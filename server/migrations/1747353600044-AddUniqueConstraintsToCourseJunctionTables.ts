import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUniqueConstraintsToCourseJunctionTables1747353600044 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE course_stays
        ADD CONSTRAINT "UQ_COURSE_STAYS_COURSE_STAY"
        UNIQUE (course_id, stay_id)
    `);
    await queryRunner.query(`
      ALTER TABLE course_activities
        ADD CONSTRAINT "UQ_COURSE_ACTIVITIES_COURSE_ACTIVITY"
        UNIQUE (course_id, activity_id)
    `);
    await queryRunner.query(`
      ALTER TABLE course_restaurants
        ADD CONSTRAINT "UQ_COURSE_RESTAURANTS_COURSE_RESTAURANT"
        UNIQUE (course_id, restaurant_id)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE course_stays DROP CONSTRAINT "UQ_COURSE_STAYS_COURSE_STAY"`);
    await queryRunner.query(`ALTER TABLE course_activities DROP CONSTRAINT "UQ_COURSE_ACTIVITIES_COURSE_ACTIVITY"`);
    await queryRunner.query(`ALTER TABLE course_restaurants DROP CONSTRAINT "UQ_COURSE_RESTAURANTS_COURSE_RESTAURANT"`);
  }
}
