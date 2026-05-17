import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddResMildColumns1747353600007 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 기존 row 처리를 위해 DEFAULT 2로 추가 후 DEFAULT 제거
    await queryRunner.query(`
      ALTER TABLE "user_preferences"
        ADD COLUMN "res_mild" SMALLINT NOT NULL DEFAULT 2
    `);
    await queryRunner.query(`
      ALTER TABLE "user_preferences"
        ALTER COLUMN "res_mild" DROP DEFAULT
    `);

    await queryRunner.query(`
      ALTER TABLE "restaurant_ratings"
        ADD COLUMN "res_mild_snap" SMALLINT NOT NULL DEFAULT 2
    `);
    await queryRunner.query(`
      ALTER TABLE "restaurant_ratings"
        ALTER COLUMN "res_mild_snap" DROP DEFAULT
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_preferences" DROP COLUMN "res_mild"`);
    await queryRunner.query(`ALTER TABLE "restaurant_ratings" DROP COLUMN "res_mild_snap"`);
  }
}
