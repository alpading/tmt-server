import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Theme } from './theme.entity';
import { UsersService } from '../users/users.service';
import { NotFoundException } from '../common/exceptions';
import { ERROR_CODE } from '../common/constants/error-codes';
import { UserPreference } from '../users/user-preference.entity';

type Domain = 'restaurants' | 'stays' | 'activities';

export interface ItemResult {
  id: number;
  name: string;
  imageUrl: string;
  score: number;
}

interface DomainConfig {
  table: string;
  ratingTable: string;
  fkCol: string;
  districtCol: string;
}

const DC: Record<Domain, DomainConfig> = {
  restaurants: { table: 'restaurants', ratingTable: 'restaurant_ratings', fkCol: 'restaurant_id', districtCol: 'district_id' },
  stays:       { table: 'stays',       ratingTable: 'stay_ratings',       fkCol: 'stay_id',        districtCol: 'district_id' },
  activities:  { table: 'activities',  ratingTable: 'activity_ratings',   fkCol: 'activity_id',    districtCol: 'destination_id' },
};

interface QueryOptions {
  domain: Domain;
  districtId: number;
  entityFilters?: string[];
  caseWhenCond?: string;
  extraJoin?: string;
  extraParams?: (string | number)[];
}

@Injectable()
export class ThemesService {
  constructor(
    @InjectRepository(Theme)
    private readonly themeRepo: Repository<Theme>,
    private readonly usersService: UsersService,
  ) {}

  async getThemes(userId: number) {
    const [themes, user] = await Promise.all([
      this.themeRepo.find({ where: { deletedAt: null }, order: { id: 'ASC' } }),
      this.usersService.findById(userId),
    ]);
    return themes.map((t) => ({
      id: t.id,
      name: t.name.replace('{MBTI}', user?.mbti ?? ''),
      description: t.description,
      imageUrl: t.imageUrl,
    }));
  }

  async getRecommendations(themeId: number, districtId: number, userId: number) {
    const [theme, user, prefs] = await Promise.all([
      this.themeRepo.findOne({ where: { id: themeId } }),
      this.usersService.findById(userId),
      this.usersService.findPreferencesByUserId(userId),
    ]);

    if (!theme) throw new NotFoundException(ERROR_CODE.RESOURCE_NOT_FOUND);
    if (!user) throw new NotFoundException(ERROR_CODE.RESOURCE_NOT_FOUND);

    switch (themeId) {
      case 1:  return this.theme1(districtId);
      case 2:  return this.theme2(districtId);
      case 3:  return this.theme3(districtId, prefs);
      case 4:  return this.theme4(districtId);
      case 5:  return this.theme5(districtId);
      case 6:  return this.theme6(districtId);
      case 7:  return this.theme7(districtId);
      case 8:  return this.theme8(districtId, user.mbti);
      case 9:  return this.theme9(districtId);
      case 10: return this.theme10(districtId);
      case 11: return this.theme11(districtId);
      case 12: return this.theme12(districtId);
      case 13: return this.theme13(districtId);
      default: throw new NotFoundException(ERROR_CODE.RESOURCE_NOT_FOUND);
    }
  }

  private async queryItems(opts: QueryOptions): Promise<ItemResult[]> {
    const dc = DC[opts.domain];
    const { districtId, entityFilters = [], caseWhenCond, extraJoin = '', extraParams = [] } = opts;
    const params: (string | number)[] = [districtId, ...extraParams];

    const scoreExpr = caseWhenCond
      ? `ABS(AVG(rr.overall_rating)) + 0.5 * (COALESCE(AVG(CASE WHEN ${caseWhenCond} THEN rr.overall_rating::float END), 0) - g.global_mean)`
      : `ABS(AVG(rr.overall_rating))`;

    const filterSql = entityFilters.length ? `AND ${entityFilters.join(' AND ')}` : '';

    const sql = `
      WITH global_stats AS (
        SELECT AVG(overall_rating)::float AS global_mean FROM ${dc.ratingTable} WHERE deleted_at IS NULL
      )
      SELECT
        e.id,
        e.name,
        e.image_url AS "imageUrl",
        ROUND((${scoreExpr})::numeric, 4)::float AS score
      FROM ${dc.table} e
      INNER JOIN ${dc.ratingTable} rr ON rr.${dc.fkCol} = e.id AND rr.deleted_at IS NULL
      ${extraJoin}
      CROSS JOIN global_stats g
      WHERE e.${dc.districtCol} = $1
        AND e.deleted_at IS NULL
        ${filterSql}
      GROUP BY e.id, e.name, e.image_url, g.global_mean
      ORDER BY score DESC NULLS LAST
      LIMIT 10
    `;

    return this.themeRepo.manager.query(sql, params);
  }

  private async queryWithFallback(primary: QueryOptions, fallback: QueryOptions): Promise<ItemResult[]> {
    const results = await this.queryItems(primary);
    if (results.length > 0) return results;
    return this.queryItems(fallback);
  }

  private async queryPriceRatio(domain: 'restaurants' | 'stays', districtId: number): Promise<ItemResult[]> {
    const dc = DC[domain];
    const sql = `
      SELECT
        e.id,
        e.name,
        e.image_url AS "imageUrl",
        ROUND(
          (ABS(AVG(rr.overall_rating)) /
           NULLIF(AVG(rr.total_spent_amount::float / NULLIF(rr.visit_party_size, 0)), 0) * 1000
          )::numeric, 4
        )::float AS score
      FROM ${dc.table} e
      INNER JOIN ${dc.ratingTable} rr ON rr.${dc.fkCol} = e.id AND rr.deleted_at IS NULL
      WHERE e.${dc.districtCol} = $1
        AND e.deleted_at IS NULL
      GROUP BY e.id, e.name, e.image_url
      ORDER BY score DESC NULLS LAST
      LIMIT 10
    `;
    return this.themeRepo.manager.query(sql, [districtId]);
  }

  private async queryFlexRestaurants(districtId: number): Promise<ItemResult[]> {
    const sql = `
      WITH pp AS (
        SELECT restaurant_id, AVG(total_spent_amount::float / NULLIF(visit_party_size, 0)) AS avg_pp
        FROM restaurant_ratings
        WHERE deleted_at IS NULL
        GROUP BY restaurant_id
      ),
      threshold AS (
        SELECT PERCENTILE_CONT(0.7) WITHIN GROUP (ORDER BY avg_pp) AS val FROM pp
      )
      SELECT
        e.id,
        e.name,
        e.image_url AS "imageUrl",
        ROUND(ABS(AVG(rr.overall_rating))::numeric, 4)::float AS score
      FROM restaurants e
      INNER JOIN restaurant_ratings rr ON rr.restaurant_id = e.id AND rr.deleted_at IS NULL
      INNER JOIN pp ON pp.restaurant_id = e.id
      CROSS JOIN threshold t
      WHERE e.district_id = $1
        AND e.deleted_at IS NULL
        AND pp.avg_pp >= t.val
      GROUP BY e.id, e.name, e.image_url
      ORDER BY score DESC NULLS LAST
      LIMIT 10
    `;
    return this.themeRepo.manager.query(sql, [districtId]);
  }

  // Theme 1: 스릴만점 액티비티 여행
  private async theme1(districtId: number) {
    const [restaurants, stays, activities] = await Promise.all([
      this.queryItems({ domain: 'restaurants', districtId }),
      this.queryWithFallback(
        { domain: 'stays', districtId, entityFilters: ['e.stay_category_id = 5'] },
        { domain: 'stays', districtId },
      ),
      this.queryItems({
        domain: 'activities',
        districtId,
        entityFilters: ['e.is_active = true'],
        caseWhenCond: 'rr.act_active_snap >= 3',
      }),
    ]);
    return { restaurants, stays, activities };
  }

  // Theme 2: 인스타 감성가득 핫플레이스
  private async theme2(districtId: number) {
    const [restaurants, stays, activities] = await Promise.all([
      this.queryItems({ domain: 'restaurants', districtId, caseWhenCond: 'rr.res_interior_snap >= 3' }),
      this.queryItems({ domain: 'stays', districtId, caseWhenCond: 'rr.stay_view_snap >= 2 AND rr.stay_interior_snap >= 2' }),
      this.queryItems({ domain: 'activities', districtId, caseWhenCond: 'rr.act_view_snap >= 3' }),
    ]);
    return { restaurants, stays, activities };
  }

  // Theme 3: 당신의 입맛에 맞춘 식도락 여행
  private async theme3(districtId: number, prefs: UserPreference | null) {
    const NEUTRAL = 2;
    const TASTE: Array<{ prefKey: keyof UserPreference; snapCol: string }> = [
      { prefKey: 'resOily',  snapCol: 'res_oily_snap'  },
      { prefKey: 'resMild',  snapCol: 'res_mild_snap'  },
      { prefKey: 'resStim',  snapCol: 'res_stim_snap'  },
      { prefKey: 'resSpicy', snapCol: 'res_spicy_snap' },
    ];

    let restaurantCaseWhen: string | undefined;
    if (prefs) {
      const active = TASTE.filter((a) => (prefs[a.prefKey] as number) !== NEUTRAL);
      if (active.length === 1) {
        restaurantCaseWhen = `rr.${active[0].snapCol} = ${prefs[active[0].prefKey]}`;
      } else if (active.length >= 2) {
        restaurantCaseWhen = active
          .map((a) => `rr.${a.snapCol} IN (${prefs[a.prefKey]}, ${NEUTRAL})`)
          .join(' OR ');
      }
    }

    const [restaurants, stays, activities] = await Promise.all([
      this.queryItems({ domain: 'restaurants', districtId, caseWhenCond: restaurantCaseWhen }),
      this.queryItems({ domain: 'stays', districtId }),
      this.queryWithFallback(
        { domain: 'activities', districtId, entityFilters: ['e.is_cafe = true'] },
        { domain: 'activities', districtId },
      ),
    ]);
    return { restaurants, stays, activities };
  }

  // Theme 4: 지친 당신을 위한 감성 힐링 여행
  private async theme4(districtId: number) {
    const [restaurants, stays, activities] = await Promise.all([
      this.queryItems({ domain: 'restaurants', districtId, caseWhenCond: 'rr.res_interior_snap >= 2 AND rr.res_service_snap >= 2' }),
      this.queryItems({ domain: 'stays', districtId, caseWhenCond: 'rr.stay_view_snap >= 2 AND rr.stay_interior_snap >= 2 AND rr.stay_noise_snap >= 2' }),
      this.queryItems({ domain: 'activities', districtId, caseWhenCond: 'rr.act_healing_snap >= 2 AND rr.act_view_snap >= 2' }),
    ]);
    return { restaurants, stays, activities };
  }

  // Theme 5: 지갑은 가볍지만 경험은 무거운 여행
  private async theme5(districtId: number) {
    const [restaurants, stays, activities] = await Promise.all([
      this.queryPriceRatio('restaurants', districtId),
      this.queryPriceRatio('stays', districtId),
      this.queryItems({ domain: 'activities', districtId, entityFilters: ['e.is_shopping = false'] }),
    ]);
    return { restaurants, stays, activities };
  }

  // Theme 6: 부모님과 함께하는 효도 여행
  private async theme6(districtId: number) {
    const extraJoin = 'LEFT JOIN users u ON u.id = rr.user_id';
    const ageCond = "u.birth_date <= CURRENT_DATE - INTERVAL '50 years'";

    const [restaurants, stays, activities] = await Promise.all([
      this.queryItems({
        domain: 'restaurants',
        districtId,
        extraJoin,
        caseWhenCond: `${ageCond} AND rr.res_mild_snap >= 2 AND rr.res_service_snap >= 2`,
      }),
      this.queryItems({
        domain: 'stays',
        districtId,
        entityFilters: ['e.stay_category_id IN (1, 3, 6)'],
        extraJoin,
        caseWhenCond: `${ageCond} AND rr.stay_view_snap >= 3`,
      }),
      this.queryItems({
        domain: 'activities',
        districtId,
        extraJoin,
        caseWhenCond: `${ageCond} AND rr.act_view_snap >= 2 AND rr.act_healing_snap >= 2`,
      }),
    ]);
    return { restaurants, stays, activities };
  }

  // Theme 7: 여행에서만큼은 FLEX
  private async theme7(districtId: number) {
    const [restaurants, stays, activities] = await Promise.all([
      this.queryFlexRestaurants(districtId),
      this.queryItems({ domain: 'stays', districtId, entityFilters: ['e.stay_category_id = 1'] }),
      this.queryItems({ domain: 'activities', districtId, entityFilters: ['e.is_shopping = true'] }),
    ]);
    return { restaurants, stays, activities };
  }

  // Theme 8: {MBTI} 맞춤 여행
  private async theme8(districtId: number, mbti: string) {
    const caseWhenCond = `rr.mbti_snap::text = $2`;
    const extraParams: [string] = [mbti];
    const [restaurants, stays, activities] = await Promise.all([
      this.queryItems({ domain: 'restaurants', districtId, caseWhenCond, extraParams }),
      this.queryItems({ domain: 'stays',       districtId, caseWhenCond, extraParams }),
      this.queryItems({ domain: 'activities',  districtId, caseWhenCond, extraParams }),
    ]);
    return { restaurants, stays, activities };
  }

  // Theme 9: 에스트로겐 듬뿍! 여행
  private async theme9(districtId: number) {
    const caseWhenCond = `rr.hormone_snap::text = 'EGEN'`;
    const [restaurants, stays, activities] = await Promise.all([
      this.queryItems({ domain: 'restaurants', districtId, caseWhenCond }),
      this.queryItems({ domain: 'stays',       districtId, caseWhenCond }),
      this.queryItems({ domain: 'activities',  districtId, caseWhenCond }),
    ]);
    return { restaurants, stays, activities };
  }

  // Theme 10: 테스토르테론 듬뿍! 여행
  private async theme10(districtId: number) {
    const caseWhenCond = `rr.hormone_snap::text = 'TETO'`;
    const [restaurants, stays, activities] = await Promise.all([
      this.queryItems({ domain: 'restaurants', districtId, caseWhenCond }),
      this.queryItems({ domain: 'stays',       districtId, caseWhenCond }),
      this.queryItems({ domain: 'activities',  districtId, caseWhenCond }),
    ]);
    return { restaurants, stays, activities };
  }

  // Theme 11: 아이와 함께해요
  private async theme11(districtId: number) {
    const [restaurants, stays, activities] = await Promise.all([
      this.queryItems({ domain: 'restaurants', districtId, entityFilters: ['e.has_baby_chair = true'] }),
      this.queryItems({ domain: 'stays',       districtId, entityFilters: ['e.stay_category_id != 4'] }),
      this.queryItems({ domain: 'activities',  districtId, entityFilters: ['e.is_kid_friendly = true'] }),
    ]);
    return { restaurants, stays, activities };
  }

  // Theme 12: 멍멍이와 함께해요
  private async theme12(districtId: number) {
    const [restaurants, stays, activities] = await Promise.all([
      this.queryItems({ domain: 'restaurants', districtId, entityFilters: ['e.allows_pets = true'] }),
      this.queryItems({ domain: 'stays',       districtId, entityFilters: ['e.allows_pets = true'] }),
      this.queryItems({ domain: 'activities',  districtId, entityFilters: ['e.allows_pets = true'] }),
    ]);
    return { restaurants, stays, activities };
  }

  // Theme 13: 2,30대가 좋아한 MZ 여행
  private async theme13(districtId: number) {
    const extraJoin = 'LEFT JOIN users u ON u.id = rr.user_id';
    const ageCond = "u.birth_date > CURRENT_DATE - INTERVAL '40 years'";
    const [restaurants, stays, activities] = await Promise.all([
      this.queryItems({ domain: 'restaurants', districtId, extraJoin, caseWhenCond: ageCond }),
      this.queryItems({ domain: 'stays',       districtId, extraJoin, caseWhenCond: ageCond }),
      this.queryItems({ domain: 'activities',  districtId, extraJoin, caseWhenCond: ageCond }),
    ]);
    return { restaurants, stays, activities };
  }
}
