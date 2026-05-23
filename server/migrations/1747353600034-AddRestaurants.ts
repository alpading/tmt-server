import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRestaurants1747353600034 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO "restaurants" (
        "district_id", "restaurant_category_id", "name",
        "allows_pets", "has_spicy_food", "has_single_seating", "has_table_seating",
        "has_group_seating", "has_private_room", "has_bar_table", "has_baby_chair", "has_parking",
        "image_url", "address", "latitude", "longitude", "naver_place_id"
      ) VALUES
        (
          189, 1, '궁상각치우',
          true, false, false, true, true, false, false, false, true,
          '', '경상북도 경주시', 35.8358, 129.2098, '15246170'
        ),
        (
          189, 1, '화양연화',
          true, false, false, true, true, true, false, true, false,
          '', '경상북도 경주시', 35.8358, 129.2098, '1493326356'
        )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM "restaurants" WHERE naver_place_id IN ('15246170', '1493326356')
    `);
  }
}
