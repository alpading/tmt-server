import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameAttributeMappingsToPreferences1747353600023 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "attribute_mappings" RENAME TO "preferences"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "preferences" RENAME TO "attribute_mappings"`);
  }
}
