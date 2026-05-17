import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedProvinces1747353600002 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO "provinces" ("name") VALUES
        ('서울'),
        ('부산'),
        ('대구'),
        ('인천'),
        ('광주'),
        ('대전'),
        ('울산'),
        ('세종'),
        ('경기'),
        ('강원'),
        ('충북'),
        ('충남'),
        ('전북'),
        ('전남'),
        ('경북'),
        ('경남'),
        ('제주')
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "provinces"`);
    await queryRunner.query(`ALTER SEQUENCE provinces_id_seq RESTART WITH 1`);
  }
}
