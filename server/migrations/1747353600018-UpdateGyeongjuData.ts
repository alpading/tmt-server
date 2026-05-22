import { MigrationInterface, QueryRunner } from 'typeorm';

// 브런치카페 식당 분류 제거, 액티비티에 체험형 + 카페 추가
export class UpdateGyeongjuData1747353600018 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 첨성대브런치카페 식당에서 제거
    await queryRunner.query(`
      DELETE FROM "restaurants" WHERE name = '첨성대브런치카페' AND district_id = 189
    `);

    // 체험형 액티비티 + 카페 추가
    await queryRunner.query(`
      INSERT INTO "activities" (
        "destination_id", "name",
        "available_parking", "is_wheelchair_accessible", "allows_pets",
        "is_kid_friendly", "is_free", "is_cafe", "is_shopping",
        "is_active", "is_exhibition",
        "image_url", "address", "latitude", "longitude"
      ) VALUES
        (189, '경주한복체험',
         false, false, false, true, false, false, false, true, false,
         '', '경상북도 경주시 황남동 148-3', 35.8370000, 129.2131000),

        (189, '경주도자기체험',
         true, false, false, true, false, false, false, true, false,
         '', '경상북도 경주시 서라벌대로 110-1', 35.8511000, 129.2265000),

        (189, '보문호수카약체험',
         true, false, false, true, false, false, false, true, false,
         '', '경상북도 경주시 보문로 일대', 35.8670000, 129.2880000),

        (189, '경주야경투어',
         false, false, false, true, false, false, false, true, false,
         '', '경상북도 경주시 일정로 186', 35.8357000, 129.2195000),

        (189, '황리단길카페거리',
         false, true, true, true, true, true, true, false, false,
         '', '경상북도 경주시 포석로 일대', 35.8362000, 129.2106000),

        (189, '경주빵공방',
         false, false, false, true, false, true, false, false, false,
         '', '경상북도 경주시 첨성로 141', 35.8344000, 129.2213000)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM "activities"
      WHERE destination_id = 189
        AND name IN (
          '경주한복체험', '경주도자기체험', '보문호수카약체험',
          '경주야경투어', '황리단길카페거리', '경주빵공방'
        )
    `);
    await queryRunner.query(`
      INSERT INTO "restaurants" (
        "district_id", "restaurant_category_id", "name",
        "has_parking", "allows_pets", "has_spicy_food", "has_single_seating",
        "has_table_seating", "has_floor_seating", "has_group_seating",
        "has_private_room", "has_bar_table", "has_baby_chair",
        "image_url", "address", "latitude", "longitude"
      ) VALUES (
        189, 4, '첨성대브런치카페',
        false, false, false, false, true, false, false, false, false, true,
        '', '경상북도 경주시 첨성로 169-1', 35.8358000, 129.2201000
      )
    `);
  }
}
