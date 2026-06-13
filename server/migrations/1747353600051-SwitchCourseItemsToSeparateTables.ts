import { MigrationInterface, QueryRunner } from 'typeorm';

export class SwitchCourseItemsToSeparateTables1747353600051 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. course_restaurants에 item_order 추가 (일별 식당 순서 보존)
    await queryRunner.query(`
      ALTER TABLE course_restaurants ADD COLUMN item_order SMALLINT NOT NULL DEFAULT 0
    `);

    // 2. 3개 테이블 FK에 ON DELETE CASCADE 추가
    await queryRunner.query(`ALTER TABLE course_restaurants DROP CONSTRAINT "FK_course_restaurants_course_id"`);
    await queryRunner.query(`
      ALTER TABLE course_restaurants
        ADD CONSTRAINT "FK_course_restaurants_course_id"
        FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
    `);

    await queryRunner.query(`ALTER TABLE course_stays DROP CONSTRAINT "FK_course_stays_course_id"`);
    await queryRunner.query(`
      ALTER TABLE course_stays
        ADD CONSTRAINT "FK_course_stays_course_id"
        FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
    `);

    await queryRunner.query(`ALTER TABLE course_activities DROP CONSTRAINT "FK_course_activities_course_id"`);
    await queryRunner.query(`
      ALTER TABLE course_activities
        ADD CONSTRAINT "FK_course_activities_course_id"
        FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
    `);

    // 3. course_items → 3개 테이블로 데이터 마이그레이션
    await queryRunner.query(`
      INSERT INTO course_stays (course_id, stay_id, day_number)
      SELECT course_id, item_id, day FROM course_items WHERE domain = 'stay'
      ON CONFLICT DO NOTHING
    `);

    await queryRunner.query(`
      INSERT INTO course_activities (course_id, activity_id, day_number)
      SELECT course_id, item_id, day FROM course_items WHERE domain = 'activity'
      ON CONFLICT DO NOTHING
    `);

    await queryRunner.query(`
      INSERT INTO course_restaurants (course_id, restaurant_id, day_number, item_order)
      SELECT
        course_id,
        item_id,
        day,
        (ROW_NUMBER() OVER (PARTITION BY course_id, day ORDER BY item_order) - 1)::smallint
      FROM course_items
      WHERE domain = 'restaurant'
      ON CONFLICT DO NOTHING
    `);

    // 4. course_items 테이블 삭제
    await queryRunner.query(`DROP TABLE course_items`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // course_items 재생성
    await queryRunner.query(`
      CREATE TABLE course_items (
        id         SERIAL        NOT NULL,
        course_id  INT           NOT NULL,
        domain     domain_enum   NOT NULL,
        item_id    INT           NOT NULL,
        item_order SMALLINT      NOT NULL DEFAULT 0,
        day        SMALLINT      NOT NULL DEFAULT 0,
        created_at TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
        CONSTRAINT "PK_COURSE_ITEMS"        PRIMARY KEY (id),
        CONSTRAINT "FK_COURSE_ITEMS_COURSE" FOREIGN KEY (course_id)
          REFERENCES courses(id) ON DELETE CASCADE
      )
    `);

    // 3개 테이블 → course_items 역마이그레이션
    await queryRunner.query(`
      INSERT INTO course_items (course_id, domain, item_id, day, item_order)
      SELECT course_id, 'stay'::domain_enum, stay_id, day_number, 0 FROM course_stays
    `);
    await queryRunner.query(`
      INSERT INTO course_items (course_id, domain, item_id, day, item_order)
      SELECT course_id, 'activity'::domain_enum, activity_id, day_number, 0 FROM course_activities
    `);
    await queryRunner.query(`
      INSERT INTO course_items (course_id, domain, item_id, day, item_order)
      SELECT course_id, 'restaurant'::domain_enum, restaurant_id, day_number, item_order FROM course_restaurants
    `);

    // CASCADE 제거 (원복)
    await queryRunner.query(`ALTER TABLE course_activities DROP CONSTRAINT "FK_course_activities_course_id"`);
    await queryRunner.query(`ALTER TABLE course_activities ADD CONSTRAINT "FK_course_activities_course_id" FOREIGN KEY (course_id) REFERENCES courses(id)`);
    await queryRunner.query(`ALTER TABLE course_stays DROP CONSTRAINT "FK_course_stays_course_id"`);
    await queryRunner.query(`ALTER TABLE course_stays ADD CONSTRAINT "FK_course_stays_course_id" FOREIGN KEY (course_id) REFERENCES courses(id)`);
    await queryRunner.query(`ALTER TABLE course_restaurants DROP CONSTRAINT "FK_course_restaurants_course_id"`);
    await queryRunner.query(`ALTER TABLE course_restaurants ADD CONSTRAINT "FK_course_restaurants_course_id" FOREIGN KEY (course_id) REFERENCES courses(id)`);

    await queryRunner.query(`ALTER TABLE course_restaurants DROP COLUMN item_order`);
  }
}
