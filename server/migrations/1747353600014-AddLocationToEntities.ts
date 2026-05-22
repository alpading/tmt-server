import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddLocationToEntities1747353600014 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "restaurants"
        ADD COLUMN "address"         VARCHAR(200) NOT NULL DEFAULT '',
        ADD COLUMN "latitude"        DECIMAL(10,7) NOT NULL DEFAULT 0,
        ADD COLUMN "longitude"       DECIMAL(10,7) NOT NULL DEFAULT 0,
        ADD COLUMN "naver_place_id"  VARCHAR(30) NULL
    `);

    await queryRunner.query(`
      ALTER TABLE "stays"
        ADD COLUMN "address"         VARCHAR(200) NOT NULL DEFAULT '',
        ADD COLUMN "latitude"        DECIMAL(10,7) NOT NULL DEFAULT 0,
        ADD COLUMN "longitude"       DECIMAL(10,7) NOT NULL DEFAULT 0,
        ADD COLUMN "naver_place_id"  VARCHAR(30) NULL
    `);

    await queryRunner.query(`
      ALTER TABLE "activities"
        ADD COLUMN "address"         VARCHAR(200) NOT NULL DEFAULT '',
        ADD COLUMN "latitude"        DECIMAL(10,7) NOT NULL DEFAULT 0,
        ADD COLUMN "longitude"       DECIMAL(10,7) NOT NULL DEFAULT 0,
        ADD COLUMN "naver_place_id"  VARCHAR(30) NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "activities"
        DROP COLUMN "naver_place_id",
        DROP COLUMN "longitude",
        DROP COLUMN "latitude",
        DROP COLUMN "address"
    `);

    await queryRunner.query(`
      ALTER TABLE "stays"
        DROP COLUMN "naver_place_id",
        DROP COLUMN "longitude",
        DROP COLUMN "latitude",
        DROP COLUMN "address"
    `);

    await queryRunner.query(`
      ALTER TABLE "restaurants"
        DROP COLUMN "naver_place_id",
        DROP COLUMN "longitude",
        DROP COLUMN "latitude",
        DROP COLUMN "address"
    `);
  }
}
