import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterPreferenceCategoryNameNullable1747353600005 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "preference_categories" ALTER COLUMN "name" DROP NOT NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      UPDATE "preference_categories" SET "name" = '' WHERE "name" IS NULL
    `);
    await queryRunner.query(`
      ALTER TABLE "preference_categories" ALTER COLUMN "name" SET NOT NULL
    `);
  }
}
