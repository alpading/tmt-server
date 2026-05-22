import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDayToCourseItems1747353600016 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "course_items" ADD COLUMN "day" SMALLINT NOT NULL DEFAULT 0
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "course_items" DROP COLUMN "day"`);
  }
}
