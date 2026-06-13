import { MigrationInterface, QueryRunner } from 'typeorm';

export class DropDescriptionFromThemes1747353600050 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "themes" DROP COLUMN "description"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "themes" ADD COLUMN "description" TEXT NOT NULL DEFAULT ''`);
  }
}
