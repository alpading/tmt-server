import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { DomainEnum } from '../common/enums';

const TABLE_META: Record<DomainEnum, { table: string; idCol: string }> = {
  [DomainEnum.RESTAURANT]: { table: 'restaurant_ratings', idCol: 'restaurant_id' },
  [DomainEnum.STAY]: { table: 'stay_ratings', idCol: 'stay_id' },
  [DomainEnum.ACTIVITY]: { table: 'activity_ratings', idCol: 'activity_id' },
};

@Injectable()
export class StatService {
  constructor(private readonly dataSource: DataSource) {}

  async getMbtiStat(domain: DomainEnum, itemId: number) {
    const { table, idCol } = TABLE_META[domain];
    const rows: Array<{ mbti: string; avg: string }> = await this.dataSource.query(
      `SELECT mbti_snap AS mbti, AVG(overall_rating) AS avg
       FROM ${table}
       WHERE ${idCol} = $1 AND deleted_at IS NULL
       GROUP BY mbti_snap
       ORDER BY avg DESC
       LIMIT 1`,
      [itemId],
    );
    if (!rows.length) return null;
    return { mbti: rows[0].mbti, avgRating: parseFloat(parseFloat(rows[0].avg).toFixed(1)) };
  }

  async getHormoneStat(domain: DomainEnum, itemId: number) {
    const { table, idCol } = TABLE_META[domain];
    const rows: Array<{ hormone: string; avg: string }> = await this.dataSource.query(
      `SELECT hormone_snap AS hormone, AVG(overall_rating) AS avg
       FROM ${table}
       WHERE ${idCol} = $1 AND deleted_at IS NULL AND hormone_snap IS NOT NULL
       GROUP BY hormone_snap
       ORDER BY avg DESC
       LIMIT 1`,
      [itemId],
    );
    if (!rows.length) return null;
    return { hormone: rows[0].hormone, avgRating: parseFloat(parseFloat(rows[0].avg).toFixed(1)) };
  }

  async getOverallStat(domain: DomainEnum, itemId: number) {
    const { table, idCol } = TABLE_META[domain];
    const rows: Array<{ avg: string | null; count: string }> = await this.dataSource.query(
      `SELECT AVG(overall_rating) AS avg, COUNT(*) AS count
       FROM ${table}
       WHERE ${idCol} = $1 AND deleted_at IS NULL`,
      [itemId],
    );
    return {
      avgRating: rows[0].avg ? parseFloat(parseFloat(rows[0].avg).toFixed(1)) : null,
      count: parseInt(rows[0].count),
    };
  }

  async getPreferenceStat(domain: DomainEnum, itemId: number) {
    const { table, idCol } = TABLE_META[domain];

    const categories: Array<{
      catId: number;
      catName: string | null;
      targetRating: string;
      attrName: string;
      snapshotCol: string;
    }> = await this.dataSource.query(
      `SELECT pc.id AS "catId", pc.name AS "catName", pc.target_rating AS "targetRating",
              am.name AS "attrName", am.snapshot_col AS "snapshotCol"
       FROM preference_categories pc
       JOIN preferences am ON am.preference_category_id = pc.id
       WHERE pc.domain = $1 AND am.snapshot_col IS NOT NULL
       ORDER BY pc.id, am.id`,
      [domain],
    );

    const catMap = new Map<number, { catName: string | null; targetRating: string; attrs: Array<{ name: string; snapCol: string }> }>();
    for (const row of categories) {
      if (!catMap.has(row.catId)) {
        catMap.set(row.catId, { catName: row.catName, targetRating: row.targetRating, attrs: [] });
      }
      catMap.get(row.catId)!.attrs.push({ name: row.attrName, snapCol: row.snapshotCol });
    }

    const results: Array<{ category: string | null; attribute: string; avgRating: number }> = [];

    for (const [, cat] of catMap) {
      let bestAttr: string | null = null;
      let bestAvg = -Infinity;

      for (const attr of cat.attrs) {
        // targetRating and snapCol come from our own DB, safe to interpolate
        const rows: Array<{ avg: string | null }> = await this.dataSource.query(
          `SELECT AVG(${cat.targetRating}) AS avg
           FROM ${table}
           WHERE ${idCol} = $1 AND ${attr.snapCol} = 3 AND deleted_at IS NULL`,
          [itemId],
        );
        const avg = rows[0].avg ? parseFloat(rows[0].avg) : null;
        if (avg !== null && avg > bestAvg) {
          bestAvg = avg;
          bestAttr = attr.name;
        }
      }

      if (bestAttr !== null) {
        results.push({ category: cat.catName, attribute: bestAttr, avgRating: parseFloat(bestAvg.toFixed(1)) });
      }
    }

    return results;
  }
}
