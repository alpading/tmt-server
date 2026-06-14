import { MigrationInterface, QueryRunner } from 'typeorm';

export class DropDeletedAtFromCourses1747353600053 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "courses" DROP COLUMN "deleted_at"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "courses" ADD COLUMN "deleted_at" TIMESTAMPTZ NULL`);
  }
}
