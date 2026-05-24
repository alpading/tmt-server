import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * SeedGyeongjuData(017)에서 '황남양옥'이 삽입됐고,
 * UpdateRestaurants(019)에서 별도 row(id=5)를 다시 '황남양옥'으로 rename해
 * naver_place_id 없는 중복 row가 남아 있다.
 *
 * naver_place_id가 NULL이거나 빈 문자열인 중복 식당 row를 삭제한다.
 * (평점/즐겨찾기/코스 참조가 없는 row만 대상)
 */
export class RemoveDuplicateRestaurants1747353600041 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1) naver_place_id가 없는데 이름이 다른 유효 row와 겹치는 중복 행 삭제
    //    (restaurant_ratings에서 참조되지 않는 row만 안전하게 삭제)
    await queryRunner.query(`
      DELETE FROM "restaurants"
      WHERE (naver_place_id IS NULL OR naver_place_id = '')
        AND name IN (
          SELECT name FROM "restaurants"
          WHERE naver_place_id IS NOT NULL AND naver_place_id != ''
        )
        AND id NOT IN (
          SELECT DISTINCT restaurant_id FROM "restaurant_ratings" WHERE deleted_at IS NULL
        )
    `);

    // 2) 같은 naver_place_id를 가진 중복 row 정리
    //    (가장 작은 id만 남기고, ratings가 없는 나머지 삭제)
    await queryRunner.query(`
      DELETE FROM "restaurants"
      WHERE naver_place_id IS NOT NULL
        AND naver_place_id != ''
        AND id NOT IN (
          SELECT MIN(id) FROM "restaurants"
          WHERE naver_place_id IS NOT NULL AND naver_place_id != ''
          GROUP BY naver_place_id
        )
        AND id NOT IN (
          SELECT DISTINCT restaurant_id FROM "restaurant_ratings" WHERE deleted_at IS NULL
        )
    `);
  }

  public async down(_queryRunner: QueryRunner): Promise<void> {
    // 삭제된 row 복원 불가 — no-op
  }
}
