import { MigrationInterface, QueryRunner } from 'typeorm';

export class DeleteInvalidRestaurant1747353600032 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`UPDATE "restaurants" SET deleted_at = NOW() WHERE id = 2`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`UPDATE "restaurants" SET deleted_at = NULL WHERE id = 2`);
  }
}
