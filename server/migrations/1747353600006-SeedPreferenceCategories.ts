import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedPreferenceCategories1747353600006 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO "preference_categories" ("name", "domain", "target_rating") VALUES
        ('맛',             'restaurant', 'taste_rating'),
        ('공간',           'restaurant', 'space_rating'),
        (NULL,             'activity',   'overall_rating'),
        ('인테리어 및 풍경', 'stay',       'interior_rating'),
        ('쾌적도',          'stay',       'clean_rating')
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "preference_categories"`);
    await queryRunner.query(`ALTER SEQUENCE preference_categories_id_seq RESTART WITH 1`);
  }
}
