import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameActivityColumns1747353600045 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE activities RENAME COLUMN available_parking TO has_parking`);
    await queryRunner.query(`ALTER TABLE activities RENAME COLUMN destination_id TO district_id`);
    await queryRunner.query(`
      ALTER TABLE activities
        RENAME CONSTRAINT "FK_activities_destination_id" TO "FK_activities_district_id"
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE activities RENAME COLUMN has_parking TO available_parking`);
    await queryRunner.query(`ALTER TABLE activities RENAME COLUMN district_id TO destination_id`);
    await queryRunner.query(`
      ALTER TABLE activities
        RENAME CONSTRAINT "FK_activities_district_id" TO "FK_activities_destination_id"
    `);
  }
}
