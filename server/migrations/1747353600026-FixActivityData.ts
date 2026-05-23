import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * 액티비티 데이터 정제
 *
 * 삭제: 황리단길 (너무 포괄적), No Words 중복(id=29)
 * 수정: 대릉한복·대산도예 is_active → false
 * 추가: 경주루지월드 (active), 강동워터파크 (active), 키덜트뮤지엄 (exhibition + kid)
 */
export class FixActivityData1747353600026 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. 황리단길 소프트 딜리트 (activity_ratings 외래키 보존)
    await queryRunner.query(`
      UPDATE "activities" SET deleted_at = NOW() WHERE name = '황리단길'
    `);

    // 2. No Words 중복 소프트 딜리트 (id=29, id=28 유지)
    await queryRunner.query(`
      UPDATE "activities" SET deleted_at = NOW() WHERE id = 29
    `);

    // 3. 대릉한복, 대산도예 is_active → false
    await queryRunner.query(`
      UPDATE "activities"
      SET is_active = false
      WHERE name IN ('대릉한복', '대산도예')
    `);

    // 4. 신규 액티비티 추가
    await queryRunner.query(`
      INSERT INTO "activities" (
        "destination_id", "name",
        "available_parking", "is_wheelchair_accessible", "allows_pets",
        "is_kid_friendly", "is_free", "is_cafe", "is_shopping",
        "is_active", "is_exhibition",
        "image_url", "address", "latitude", "longitude", "naver_place_id"
      ) VALUES
        (
          189, '경주루지월드',
          true, false, false, true, false, false, false, true, false,
          '', '경상북도 경주시 보불로 672', 35.8613, 129.2965, '1136426828'
        ),
        (
          189, '강동워터파크',
          true, false, false, true, false, false, false, true, false,
          '', '경상북도 경주시 강동면 안심리', 35.9383, 129.3572, '20091286'
        ),
        (
          189, '키덜트뮤지엄',
          true, false, false, true, false, false, false, false, true,
          '', '경상북도 경주시 첨성로 107', 35.8362, 129.2203, '37755924'
        )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM "activities"
      WHERE naver_place_id IN ('1136426828', '20091286', '37755924')
    `);

    await queryRunner.query(`
      UPDATE "activities"
      SET is_active = true
      WHERE name IN ('대릉한복', '대산도예')
    `);

    // No Words 복구 (원본 데이터 재삽입)
    await queryRunner.query(`
      INSERT INTO "activities" (
        "id", "destination_id", "name",
        "available_parking", "is_wheelchair_accessible", "allows_pets",
        "is_kid_friendly", "is_free", "is_cafe", "is_shopping", "is_active", "is_exhibition",
        "image_url", "address", "latitude", "longitude", "naver_place_id"
      ) VALUES (
        29, 189, 'No Words',
        false, false, false, false, false, true, false, false, false,
        '', '경상북도 경주시 포석로 일대', 35.8360, 129.2105, '785809390'
      )
    `);

    // 황리단길 복구
    await queryRunner.query(`
      INSERT INTO "activities" (
        "destination_id", "name",
        "available_parking", "is_wheelchair_accessible", "allows_pets",
        "is_kid_friendly", "is_free", "is_cafe", "is_shopping", "is_active", "is_exhibition",
        "image_url", "address", "latitude", "longitude"
      ) VALUES (
        189, '황리단길',
        false, true, true, true, true, true, true, false, false,
        '', '경상북도 경주시 포석로 일대', 35.8358, 129.2098
      )
    `);
  }
}
