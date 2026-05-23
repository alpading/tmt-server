import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixAllowsPets1747353600029 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      UPDATE "activities"
      SET allows_pets = true
      WHERE name IN ('첨성대', '경주엑스포공원')
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      UPDATE "activities"
      SET allows_pets = false
      WHERE name IN ('첨성대', '경주엑스포공원')
    `);
  }
}
