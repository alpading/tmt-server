import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedCategories1747353600004 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO "restaurant_categories" ("name") VALUES
        ('한식'),
        ('중식'),
        ('일식'),
        ('양식'),
        ('분식'),
        ('동남아식')
    `);

    await queryRunner.query(`
      INSERT INTO "stay_categories" ("name") VALUES
        ('호텔'),
        ('모텔'),
        ('펜션'),
        ('게하 / 호스텔'),
        ('캠핑 / 글램핑'),
        ('리조트'),
        ('한옥 / 템플스테이'),
        ('민박')
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "restaurant_categories"`);
    await queryRunner.query(`ALTER SEQUENCE restaurant_categories_id_seq RESTART WITH 1`);
    await queryRunner.query(`DELETE FROM "stay_categories"`);
    await queryRunner.query(`ALTER SEQUENCE stay_categories_id_seq RESTART WITH 1`);
  }
}
