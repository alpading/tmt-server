import { MigrationInterface, QueryRunner } from 'typeorm';

export class DropFloorSeating1747353600033 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "restaurants" DROP COLUMN "has_floor_seating"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "restaurants" ADD COLUMN "has_floor_seating" BOOLEAN NOT NULL DEFAULT FALSE`);
    await queryRunner.query(`UPDATE "restaurants" SET has_floor_seating = true WHERE name = '요석궁'`);
  }
}
