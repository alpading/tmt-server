import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCreatedAtToFavoriteTables1747353600052 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE favorite_restaurants ADD COLUMN created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()`);
    await queryRunner.query(`ALTER TABLE favorite_stays       ADD COLUMN created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()`);
    await queryRunner.query(`ALTER TABLE favorite_activities  ADD COLUMN created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE favorite_restaurants DROP COLUMN created_at`);
    await queryRunner.query(`ALTER TABLE favorite_stays       DROP COLUMN created_at`);
    await queryRunner.query(`ALTER TABLE favorite_activities  DROP COLUMN created_at`);
  }
}
