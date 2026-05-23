import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddHwangsongPark1747353600030 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO "activities" (
        "destination_id", "name",
        "available_parking", "is_wheelchair_accessible", "allows_pets",
        "is_kid_friendly", "is_free", "is_cafe", "is_shopping",
        "is_active", "is_exhibition",
        "image_url", "address", "latitude", "longitude", "naver_place_id"
      ) VALUES (
        189, '황성공원',
        true, true, true, true, true, false, false, false, false,
        '', '경상북도 경주시 황성동', 35.8566, 129.2245, '13351607'
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "activities" WHERE naver_place_id = '13351607'`);
  }
}
