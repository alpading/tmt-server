import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * 문화/전시형 액티비티 3개 추가 + 경주엑스포공원 is_exhibition 복구
 *
 * 추가:
 *   - 경주 세계 자동차 박물관 (naver_place_id: 38630852)
 *   - 황룡사역사문화관         (naver_place_id: 75112495)
 *   - 경주 예술의전당           (naver_place_id: 13529857)
 *
 * 수정:
 *   - 경주엑스포공원 is_exhibition → true
 */
export class AddExhibitionActivities1747353600025 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. 경주엑스포공원 is_exhibition 복구
    await queryRunner.query(`
      UPDATE "activities"
      SET is_exhibition = true
      WHERE name = '경주엑스포공원'
    `);

    // 2. 문화/전시형 액티비티 3개 추가
    await queryRunner.query(`
      INSERT INTO "activities" (
        "destination_id", "name",
        "available_parking", "is_wheelchair_accessible", "allows_pets",
        "is_kid_friendly", "is_free", "is_cafe", "is_shopping",
        "is_active", "is_exhibition",
        "image_url", "address", "latitude", "longitude", "naver_place_id"
      ) VALUES
        (
          189, '경주 세계 자동차 박물관',
          true, true, false, true, false, false, false, false, true,
          '', '경상북도 경주시 보불로 550', 35.8627, 129.3002, '38630852'
        ),
        (
          189, '황룡사역사문화관',
          true, true, false, true, false, false, false, false, true,
          '', '경상북도 경주시 구황동 320-1', 35.8340, 129.2295, '75112495'
        ),
        (
          189, '경주 예술의전당',
          true, true, false, true, false, false, false, false, true,
          '', '경상북도 경주시 알천북로 1', 35.8442, 129.2115, '13529857'
        )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM "activities"
      WHERE naver_place_id IN ('38630852', '75112495', '13529857')
    `);

    await queryRunner.query(`
      UPDATE "activities"
      SET is_exhibition = false
      WHERE name = '경주엑스포공원'
    `);
  }
}
