import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddActiveActivities1747353600027 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO "activities" (
        "destination_id", "name",
        "available_parking", "is_wheelchair_accessible", "allows_pets",
        "is_kid_friendly", "is_free", "is_cafe", "is_shopping",
        "is_active", "is_exhibition",
        "image_url", "address", "latitude", "longitude", "naver_place_id"
      ) VALUES
        (
          189, '경주레저',
          true, false, false, false, false, false, false, true, false,
          '', '경상북도 경주시', 35.8440, 129.2167, '34666089'
        ),
        (
          189, '경주 패러글라이딩',
          true, false, false, false, false, false, false, true, false,
          '', '경상북도 경주시', 35.8440, 129.2167, '1529724953'
        )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM "activities"
      WHERE naver_place_id IN ('34666089', '1529724953')
    `);
  }
}
