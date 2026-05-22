import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Stay } from './stay.entity';
import { StayRating } from './stay-rating.entity';
import { StayCategory } from './stay-category.entity';
import { AttributeMapping } from '../preferences/attribute-mapping.entity';
import { UsersService } from '../users/users.service';
import { NotFoundException } from '../common/exceptions';
import { ERROR_CODE } from '../common/constants/error-codes';
import { CreateStayRatingDto } from './dto/create-stay-rating.dto';
import { SearchStayDto } from './dto/search-stay.dto';

const STAY_BASIC_FILTERS = [
  { key: 'hasParking',             label: '주차' },
  { key: 'allowsCooking',          label: '취사' },
  { key: 'isWheelchairAccessible', label: '휠체어 접근 가능' },
  { key: 'allowsPets',             label: '애견 동반' },
  { key: 'hasBathtub',             label: '욕조' },
  { key: 'hasBreakfast',           label: '조식' },
  { key: 'hasTv',                  label: 'TV' },
  { key: 'hasBbq',                 label: '바베큐' },
] as const;

const STAY_BASIC_COL_MAP: Record<string, string> = {
  hasParking:             'has_parking',
  allowsCooking:          'allows_cooking',
  isWheelchairAccessible: 'is_wheelchair_accessible',
  allowsPets:             'allows_pets',
  hasBathtub:             'has_bathtub',
  hasBreakfast:           'has_breakfast',
  hasTv:                  'has_tv',
  hasBbq:                 'has_bbq',
};

const SAFE_COL_RE = /^[a-z_]+$/;

@Injectable()
export class StaysService {
  constructor(
    @InjectRepository(Stay)
    private readonly stayRepo: Repository<Stay>,
    @InjectRepository(StayRating)
    private readonly ratingRepo: Repository<StayRating>,
    @InjectRepository(StayCategory)
    private readonly categoryRepo: Repository<StayCategory>,
    @InjectRepository(AttributeMapping)
    private readonly attrRepo: Repository<AttributeMapping>,
    private readonly usersService: UsersService,
  ) {}

  getBasicFilters() {
    return STAY_BASIC_FILTERS;
  }

  getCategories() {
    return this.categoryRepo.find({ select: { id: true, name: true }, order: { id: 'ASC' } });
  }

  async searchByDistrict(districtId: number, dto: SearchStayDto) {
    const basicFilterKeys = dto.basicFilters
      ? dto.basicFilters.split(',').map((s) => s.trim()).filter(Boolean)
      : [];
    const prefAttrIdList = dto.prefAttrIds
      ? dto.prefAttrIds.split(',').map((s) => parseInt(s.trim(), 10)).filter((n) => !isNaN(n) && n > 0)
      : [];

    type PrefAttr = { id: number; name: string; snapshotCol: string; targetCol: string };
    let prefAttrs: PrefAttr[] = [];
    if (prefAttrIdList.length > 0) {
      const found = await this.attrRepo.find({
        where: { id: In(prefAttrIdList) },
        relations: { category: true },
      });
      prefAttrs = found
        .filter((a) => a.snapshotCol && a.category?.targetRating)
        .filter((a) => SAFE_COL_RE.test(a.snapshotCol!) && SAFE_COL_RE.test(a.category.targetRating))
        .map((a) => ({
          id: a.id,
          name: a.name,
          snapshotCol: a.snapshotCol!,
          targetCol: a.category.targetRating,
        }))
        .slice(0, 2);
    }

    const conditions: string[] = ['s.district_id = $1', 's.deleted_at IS NULL'];
    const params: (number | string)[] = [districtId];
    let paramIdx = 2;

    if (dto.categoryId) {
      conditions.push(`s.stay_category_id = $${paramIdx++}`);
      params.push(dto.categoryId);
    }

    for (const key of basicFilterKeys) {
      const col = STAY_BASIC_COL_MAP[key];
      if (col) conditions.push(`s.${col} = true`);
    }

    const whereClause = conditions.join(' AND ');
    const scoreExpr = this.buildScoreExpr(prefAttrs);

    const sql = `
      SELECT s.id, s.name, s.image_url AS "imageUrl",
        ROUND((${scoreExpr})::NUMERIC, 2)::float AS score
      FROM stays s
      LEFT JOIN stay_ratings rr ON rr.stay_id = s.id AND rr.deleted_at IS NULL
      WHERE ${whereClause}
      GROUP BY s.id, s.name, s.image_url
      ORDER BY score DESC
      LIMIT 5
    `;

    const results = await this.stayRepo.manager.query(sql, params);

    const preferenceConditions = await this.buildPreferenceConditions(prefAttrs, districtId);

    return { results, preferenceConditions };
  }

  private buildScoreExpr(prefAttrs: Array<{ snapshotCol: string; targetCol: string }>): string {
    if (prefAttrs.length === 0) return 'COALESCE(AVG(rr.overall_rating), 0)';

    const globalMean = (col: string) =>
      `(SELECT COALESCE(AVG(${col}), 0) FROM stay_ratings WHERE deleted_at IS NULL)`;

    const singleScore = (targetCol: string, snapCol: string, snapCond: string) =>
      `COALESCE(AVG(rr.${targetCol}), 0) + 0.5 * (` +
      `COALESCE(AVG(CASE WHEN rr.${snapCol} ${snapCond} THEN rr.${targetCol} END), COALESCE(AVG(rr.${targetCol}), 0))` +
      ` - ${globalMean(targetCol)})`;

    if (prefAttrs.length === 1) {
      const { targetCol, snapshotCol } = prefAttrs[0];
      return singleScore(targetCol, snapshotCol, '= 3');
    }

    const [a1, a2] = prefAttrs;
    return `(${singleScore(a1.targetCol, a1.snapshotCol, 'IN (2,3)')} + ${singleScore(a2.targetCol, a2.snapshotCol, 'IN (2,3)')}) / 2.0`;
  }

  private async buildPreferenceConditions(
    prefAttrs: Array<{ id: number; name: string; snapshotCol: string; targetCol: string }>,
    districtId: number,
  ) {
    const snapCond = prefAttrs.length === 1 ? '= 3' : 'IN (2,3)';
    return Promise.all(
      prefAttrs.map(async (attr) => {
        const [row] = await this.stayRepo.manager.query(
          `SELECT ROUND(AVG(rr.${attr.targetCol})::NUMERIC, 2)::float AS avg
           FROM stay_ratings rr
           JOIN stays s ON s.id = rr.stay_id AND s.deleted_at IS NULL
           WHERE rr.deleted_at IS NULL AND rr.${attr.snapshotCol} ${snapCond} AND s.district_id = $1`,
          [districtId],
        );
        return {
          attributeId: attr.id,
          attributeName: attr.name,
          avgTargetRating: row.avg !== null ? Number(row.avg) : null,
        };
      }),
    );
  }

  async findOne(id: number): Promise<Stay> {
    const stay = await this.stayRepo.findOne({ where: { id } });
    if (!stay) throw new NotFoundException(ERROR_CODE.RESOURCE_NOT_FOUND, '존재하지 않는 숙소입니다.');
    return stay;
  }

  async createRating(userId: number, dto: CreateStayRatingDto): Promise<StayRating> {
    const stay = await this.stayRepo.findOne({ where: { id: dto.stayId } });
    if (!stay) {
      throw new NotFoundException(ERROR_CODE.RESOURCE_NOT_FOUND, '존재하지 않는 숙소입니다.');
    }

    const [user, pref] = await Promise.all([
      this.usersService.findById(userId),
      this.usersService.findPreferencesByUserId(userId),
    ]);

    const rating = this.ratingRepo.create({
      userId,
      stayId: dto.stayId,
      overallRating: dto.overallRating,
      interiorRating: dto.interiorRating,
      cleanRating: dto.cleanRating,
      visitPartySize: dto.visitPartySize,
      totalSpentAmount: dto.totalSpentAmount,
      stayViewSnap: pref.stayView,
      stayInteriorSnap: pref.stayInterior,
      staySpaceSnap: pref.staySpace,
      stayNoiseSnap: pref.stayNoise,
      stayCleanSnap: pref.stayClean,
      stayServiceSnap: pref.stayService,
      mbtiSnap: user.mbti,
      hormoneSnap: user.hormone,
    });

    return this.ratingRepo.save(rating);
  }
}
