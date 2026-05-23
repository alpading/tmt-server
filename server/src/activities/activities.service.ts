import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Activity } from './activity.entity';
import { ActivityRating } from './activity-rating.entity';
import { Preference } from '../preferences/preference.entity';
import { UsersService } from '../users/users.service';
import { NotFoundException } from '../common/exceptions';
import { ERROR_CODE } from '../common/constants/error-codes';
import { CreateActivityRatingDto } from './dto/create-activity-rating.dto';
import { SearchActivityDto } from './dto/search-activity.dto';

const ACTIVITY_BASIC_FILTERS = [
  { key: 'availableParking',       label: '주차' },
  { key: 'isKidFriendly',          label: '아이와 함께' },
  { key: 'isShopping',             label: '쇼핑' },
  { key: 'isCafe',                 label: '카페, 디저트' },
  { key: 'isFree',                 label: '무료' },
  { key: 'isWheelchairAccessible', label: '휠체어 가능 여부' },
  { key: 'allowsPets',             label: '애견 동반' },
] as const;

const ACTIVITY_BASIC_COL_MAP: Record<string, string> = {
  availableParking:       'available_parking',
  isKidFriendly:          'is_kid_friendly',
  isShopping:             'is_shopping',
  isCafe:                 'is_cafe',
  isFree:                 'is_free',
  isWheelchairAccessible: 'is_wheelchair_accessible',
  allowsPets:             'allows_pets',
};

const SAFE_COL_RE = /^[a-z_]+$/;

@Injectable()
export class ActivitiesService {
  constructor(
    @InjectRepository(Activity)
    private readonly activityRepo: Repository<Activity>,
    @InjectRepository(ActivityRating)
    private readonly ratingRepo: Repository<ActivityRating>,
    @InjectRepository(Preference)
    private readonly attrRepo: Repository<Preference>,
    private readonly usersService: UsersService,
  ) {}

  getBasicFilters() {
    return ACTIVITY_BASIC_FILTERS;
  }

  async searchByDistrict(districtId: number, dto: SearchActivityDto) {
    const basicFilterKeys = dto.basicFilters
      ? dto.basicFilters.split(',').map((s) => s.trim()).filter(Boolean)
      : [];
    const prefAttrIdList = dto.prefAttrIds
      ? dto.prefAttrIds.split(',').map((s) => parseInt(s.trim(), 10)).filter((n) => !isNaN(n) && n > 0)
      : [];

    type PrefAttr = { id: number; name: string; snapshotCol: string; targetCol: string; profileCol: string | null };
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
          profileCol: a.profileCol,
        }))
        .slice(0, 2);
    }

    const conditions: string[] = ['a.destination_id = $1', 'a.deleted_at IS NULL'];
    const params: (number | string)[] = [districtId];

    for (const key of basicFilterKeys) {
      const col = ACTIVITY_BASIC_COL_MAP[key];
      if (col) conditions.push(`a.${col} = true`);
    }

    // Hybrid: act_culture → is_exhibition, act_active → is_active
    for (const attr of prefAttrs) {
      if (attr.profileCol === 'act_culture') conditions.push('a.is_exhibition = true');
      if (attr.profileCol === 'act_active') conditions.push('a.is_active = true');
    }

    const whereClause = conditions.join(' AND ');
    const scoreExpr = this.buildScoreExpr(prefAttrs);

    const sql = `
      SELECT a.id, a.name, a.image_url AS "imageUrl",
        ROUND((${scoreExpr})::NUMERIC, 2)::float AS score
      FROM activities a
      LEFT JOIN activity_ratings rr ON rr.activity_id = a.id AND rr.deleted_at IS NULL
      WHERE ${whereClause}
      GROUP BY a.id, a.name, a.image_url
      ORDER BY score DESC
      LIMIT 3
    `;

    const results = await this.activityRepo.manager.query(sql, params);

    const preferenceConditions = await this.buildPreferenceConditions(prefAttrs, districtId);

    return { results, preferenceConditions };
  }

  private buildScoreExpr(prefAttrs: Array<{ snapshotCol: string; targetCol: string }>): string {
    if (prefAttrs.length === 0) return 'COALESCE(AVG(rr.overall_rating), 0)';

    const globalMean = (col: string) =>
      `(SELECT COALESCE(AVG(${col}), 0) FROM activity_ratings WHERE deleted_at IS NULL)`;

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
        const [row] = await this.activityRepo.manager.query(
          `SELECT ROUND(AVG(rr.${attr.targetCol})::NUMERIC, 2)::float AS avg
           FROM activity_ratings rr
           JOIN activities a ON a.id = rr.activity_id AND a.deleted_at IS NULL
           WHERE rr.deleted_at IS NULL AND rr.${attr.snapshotCol} ${snapCond} AND a.destination_id = $1`,
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

  async findOne(id: number): Promise<Activity> {
    const activity = await this.activityRepo.findOne({ where: { id } });
    if (!activity) throw new NotFoundException(ERROR_CODE.RESOURCE_NOT_FOUND, '존재하지 않는 액티비티입니다.');
    return activity;
  }

  async createRating(userId: number, dto: CreateActivityRatingDto): Promise<ActivityRating> {
    const activity = await this.activityRepo.findOne({ where: { id: dto.activityId } });
    if (!activity) {
      throw new NotFoundException(ERROR_CODE.RESOURCE_NOT_FOUND, '존재하지 않는 액티비티입니다.');
    }

    const [user, pref] = await Promise.all([
      this.usersService.findById(userId),
      this.usersService.findPreferencesByUserId(userId),
    ]);

    const rating = this.ratingRepo.create({
      userId,
      activityId: dto.activityId,
      overallRating: dto.overallRating,
      mbtiSnap: user.mbti,
      hormoneSnap: user.hormone,
      actCultureSnap: pref.actCulture,
      actViewSnap: pref.actView,
      actHealingSnap: pref.actHealing,
      actActiveSnap: pref.actActive,
    });

    return this.ratingRepo.save(rating);
  }
}
