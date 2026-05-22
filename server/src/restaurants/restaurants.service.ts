import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Restaurant } from './restaurant.entity';
import { RestaurantRating } from './restaurant-rating.entity';
import { RestaurantCategory } from './restaurant-category.entity';
import { Preference } from '../preferences/preference.entity';
import { UsersService } from '../users/users.service';
import { NotFoundException } from '../common/exceptions';
import { ERROR_CODE } from '../common/constants/error-codes';
import { CreateRestaurantRatingDto } from './dto/create-restaurant-rating.dto';
import { SearchRestaurantDto } from './dto/search-restaurant.dto';

const RESTAURANT_BASIC_FILTERS = [
  { key: 'hasParking',        label: '주차' },
  { key: 'hasSingleSeating',  label: '혼밥 전용 공간' },
  { key: 'allowsPets',        label: '애견 동반' },
  { key: 'hasTableSeating',   label: '입식' },
  { key: 'hasFloorSeating',   label: '좌식' },
  { key: 'hasBarTable',       label: '바테이블' },
  { key: 'hasBabyChair',      label: '유아 의자' },
  { key: 'hasGroupSeating',   label: '단체석' },
  { key: 'hasPrivateRoom',    label: '룸' },
] as const;

const RESTAURANT_BASIC_COL_MAP: Record<string, string> = {
  hasParking:       'has_parking',
  hasSingleSeating: 'has_single_seating',
  allowsPets:       'allows_pets',
  hasTableSeating:  'has_table_seating',
  hasFloorSeating:  'has_floor_seating',
  hasBarTable:      'has_bar_table',
  hasBabyChair:     'has_baby_chair',
  hasGroupSeating:  'has_group_seating',
  hasPrivateRoom:   'has_private_room',
};

const SAFE_COL_RE = /^[a-z_]+$/;

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurantRepo: Repository<Restaurant>,
    @InjectRepository(RestaurantRating)
    private readonly ratingRepo: Repository<RestaurantRating>,
    @InjectRepository(RestaurantCategory)
    private readonly categoryRepo: Repository<RestaurantCategory>,
    @InjectRepository(Preference)
    private readonly attrRepo: Repository<Preference>,
    private readonly usersService: UsersService,
  ) {}

  getBasicFilters() {
    return RESTAURANT_BASIC_FILTERS;
  }

  getCategories() {
    return this.categoryRepo.find({ select: { id: true, name: true }, order: { id: 'ASC' } });
  }

  async searchByDistrict(districtId: number, dto: SearchRestaurantDto) {
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

    const conditions: string[] = ['r.district_id = $1', 'r.deleted_at IS NULL'];
    const params: (number | string)[] = [districtId];
    let paramIdx = 2;

    if (dto.categoryId) {
      conditions.push(`r.restaurant_category_id = $${paramIdx++}`);
      params.push(dto.categoryId);
    }

    for (const key of basicFilterKeys) {
      const col = RESTAURANT_BASIC_COL_MAP[key];
      if (col) conditions.push(`r.${col} = true`);
    }

    for (const attr of prefAttrs) {
      if (attr.profileCol === 'res_spicy') conditions.push('r.has_spicy_food = true');
    }

    const whereClause = conditions.join(' AND ');

    const scoreExpr = this.buildScoreExpr(prefAttrs, 'restaurant_ratings');

    const sql = `
      SELECT r.id, r.name, r.image_url AS "imageUrl",
        ROUND((${scoreExpr})::NUMERIC, 2)::float AS score
      FROM restaurants r
      LEFT JOIN restaurant_ratings rr ON rr.restaurant_id = r.id AND rr.deleted_at IS NULL
      WHERE ${whereClause}
      GROUP BY r.id, r.name, r.image_url
      ORDER BY score DESC
      LIMIT 5
    `;

    const results = await this.restaurantRepo.manager.query(sql, params);

    const preferenceConditions = await this.buildPreferenceConditions(
      prefAttrs,
      districtId,
      'restaurant_ratings',
      'restaurant_id',
      'restaurants',
      'district_id',
    );

    return { results, preferenceConditions };
  }

  private buildScoreExpr(
    prefAttrs: Array<{ snapshotCol: string; targetCol: string }>,
    ratingTable: string,
  ): string {
    if (prefAttrs.length === 0) return 'COALESCE(AVG(rr.overall_rating), 0)';

    const globalMean = (col: string) =>
      `(SELECT COALESCE(AVG(${col}), 0) FROM ${ratingTable} WHERE deleted_at IS NULL)`;

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
    ratingTable: string,
    ratingFk: string,
    entityTable: string,
    districtCol: string,
  ) {
    const snapCond = prefAttrs.length === 1 ? '= 3' : 'IN (2,3)';
    return Promise.all(
      prefAttrs.map(async (attr) => {
        const [row] = await this.restaurantRepo.manager.query(
          `SELECT ROUND(AVG(rr.${attr.targetCol})::NUMERIC, 2)::float AS avg
           FROM ${ratingTable} rr
           JOIN ${entityTable} e ON e.id = rr.${ratingFk} AND e.deleted_at IS NULL
           WHERE rr.deleted_at IS NULL AND rr.${attr.snapshotCol} ${snapCond} AND e.${districtCol} = $1`,
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

  async findOne(id: number): Promise<Restaurant> {
    const restaurant = await this.restaurantRepo.findOne({ where: { id } });
    if (!restaurant) throw new NotFoundException(ERROR_CODE.RESOURCE_NOT_FOUND, '존재하지 않는 식당입니다.');
    return restaurant;
  }

  async createRating(userId: number, dto: CreateRestaurantRatingDto): Promise<RestaurantRating> {
    const restaurant = await this.restaurantRepo.findOne({ where: { id: dto.restaurantId } });
    if (!restaurant) {
      throw new NotFoundException(ERROR_CODE.RESOURCE_NOT_FOUND, '존재하지 않는 식당입니다.');
    }

    const [user, pref] = await Promise.all([
      this.usersService.findById(userId),
      this.usersService.findPreferencesByUserId(userId),
    ]);

    const rating = this.ratingRepo.create({
      userId,
      restaurantId: dto.restaurantId,
      overallRating: dto.overallRating,
      spaceRating: dto.spaceRating,
      tasteRating: dto.tasteRating,
      visitPartySize: dto.visitPartySize,
      totalSpentAmount: dto.totalSpentAmount,
      resOilySnap: pref.resOily,
      resMildSnap: pref.resMild,
      resCleanSnap: pref.resClean,
      resStimSnap: pref.resStim,
      resSpicySnap: pref.resSpicy,
      resNoiseSnap: pref.resNoise,
      resInteriorSnap: pref.resInterior,
      resServiceSnap: pref.resService,
      mbtiSnap: user.mbti,
      hormoneSnap: user.hormone,
    });

    return this.ratingRepo.save(rating);
  }
}
