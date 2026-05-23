import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * is_kid_friendly 정제
 *
 * 수정:
 *   - 대릉한복 is_kid_friendly → false
 *   - 테스트 액티비티(id=1) 소프트 딜리트
 *
 * 추가:
 *   - 또봇 정크아트뮤지엄 (kid=true, exhibition=true)
 *
 * 이미 true인 항목 (변경 불필요):
 *   경주월드, 경주엑스포공원, 경주루지월드, 강동워터파크,
 *   키덜트뮤지엄, 경주 세계 자동차 박물관
 */
export class FixKidFriendlyData1747353600028 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. 테스트 액티비티 소프트 딜리트
    await queryRunner.query(`
      UPDATE "activities" SET deleted_at = NOW() WHERE id = 1
    `);

    // 2. 대릉한복 is_kid_friendly → false
    await queryRunner.query(`
      UPDATE "activities" SET is_kid_friendly = false WHERE name = '대릉한복'
    `);

    // 3. 또봇 정크아트뮤지엄 추가
    await queryRunner.query(`
      INSERT INTO "activities" (
        "destination_id", "name",
        "available_parking", "is_wheelchair_accessible", "allows_pets",
        "is_kid_friendly", "is_free", "is_cafe", "is_shopping",
        "is_active", "is_exhibition",
        "image_url", "address", "latitude", "longitude", "naver_place_id"
      ) VALUES (
        189, '또봇 정크아트뮤지엄',
        true, false, false, true, false, false, false, false, true,
        '', '경상북도 경주시 보문로 일대', 35.8650, 129.2900, '463923897'
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "activities" WHERE naver_place_id = '463923897'`);
    await queryRunner.query(`UPDATE "activities" SET is_kid_friendly = true WHERE name = '대릉한복'`);
    await queryRunner.query(`UPDATE "activities" SET deleted_at = NULL WHERE id = 1`);
  }
}
