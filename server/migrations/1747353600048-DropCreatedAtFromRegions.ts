import { MigrationInterface, QueryRunner } from 'typeorm';

export class DropCreatedAtFromRegions1747353600048 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "provinces"  DROP COLUMN "created_at"`);
    await queryRunner.query(`ALTER TABLE "districts"  DROP COLUMN "created_at"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "provinces" ADD COLUMN "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()`);
    await queryRunner.query(`ALTER TABLE "districts" ADD COLUMN "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()`);
  }
}
