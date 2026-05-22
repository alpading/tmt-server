import { MigrationInterface, QueryRunner } from 'typeorm';

export class ReplaceOffersWorkshopWithIsActive1747353600010 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "activities" DROP COLUMN "offers_workshop"`);
    await queryRunner.query(`ALTER TABLE "activities" ADD COLUMN "is_active" BOOLEAN NOT NULL DEFAULT FALSE`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "activities" DROP COLUMN "is_active"`);
    await queryRunner.query(`ALTER TABLE "activities" ADD COLUMN "offers_workshop" BOOLEAN NOT NULL DEFAULT FALSE`);
  }
}
