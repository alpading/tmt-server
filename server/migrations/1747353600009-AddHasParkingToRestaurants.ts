import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddHasParkingToRestaurants1747353600009 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "restaurants" ADD COLUMN "has_parking" BOOLEAN NOT NULL DEFAULT FALSE
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "restaurants" DROP COLUMN "has_parking"`);
  }
}
