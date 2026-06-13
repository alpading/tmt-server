import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameThemeToThemes1747353600049 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "theme" RENAME TO "themes"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "themes" RENAME TO "theme"`);
  }
}
