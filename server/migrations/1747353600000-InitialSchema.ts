import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1747353600000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // ENUM types
    await queryRunner.query(`CREATE TYPE "gender_enum" AS ENUM ('MALE', 'FEMALE')`);
    await queryRunner.query(`
      CREATE TYPE "mbti_enum" AS ENUM (
        'INTJ', 'INTP', 'ENTJ', 'ENTP',
        'INFJ', 'INFP', 'ENFJ', 'ENFP',
        'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
        'ISTP', 'ISFP', 'ESTP', 'ESFP'
      )
    `);
    await queryRunner.query(`CREATE TYPE "hormone_enum" AS ENUM ('EGEN', 'TETO')`);
    await queryRunner.query(`CREATE TYPE "domain_enum" AS ENUM ('restaurant', 'stay', 'activity')`);

    await queryRunner.query(`
      CREATE TABLE "provinces" (
        "id"         SERIAL        NOT NULL,
        "name"       VARCHAR(10)   NOT NULL,
        "created_at" TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
        CONSTRAINT "PK_PROVINCES" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "districts" (
        "id"          SERIAL       NOT NULL,
        "province_id" INT          NOT NULL,
        "name"        VARCHAR(30)  NOT NULL,
        "created_at"  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
        CONSTRAINT "PK_DISTRICTS" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "restaurant_categories" (
        "id"         SERIAL       NOT NULL,
        "name"       VARCHAR(30)  NOT NULL,
        "created_at" TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
        "deleted_at" TIMESTAMPTZ  NULL DEFAULT NULL,
        CONSTRAINT "PK_RESTAURANT_CATEGORIES" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "stay_categories" (
        "id"         SERIAL       NOT NULL,
        "name"       VARCHAR(30)  NOT NULL,
        "created_at" TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
        "deleted_at" TIMESTAMPTZ  NULL DEFAULT NULL,
        CONSTRAINT "PK_STAY_CATEGORIES" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "preference_categories" (
        "id"            SERIAL        NOT NULL,
        "name"          VARCHAR(20)   NOT NULL,
        "target_rating" TEXT          NOT NULL,
        "domain"        "domain_enum" NOT NULL,
        CONSTRAINT "PK_PREFERENCE_CATEGORIES" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "users" (
        "id"         SERIAL        NOT NULL,
        "login_id"   VARCHAR(30)   UNIQUE NULL,
        "hashed_pw"  TEXT          NULL,
        "name"       VARCHAR(30)   NOT NULL,
        "birth_date" DATE          NOT NULL,
        "gender"     "gender_enum" NOT NULL,
        "mbti"       "mbti_enum"   NOT NULL,
        "hormone"    "hormone_enum" NOT NULL,
        "created_at" TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
        "deleted_at" TIMESTAMPTZ   NULL,
        CONSTRAINT "PK_USERS" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "restaurants" (
        "id"                      SERIAL       NOT NULL,
        "district_id"             INT          NOT NULL,
        "restaurant_category_id"  INT          NOT NULL,
        "name"                    VARCHAR(100) NOT NULL,
        "allows_pets"             BOOLEAN      NOT NULL DEFAULT FALSE,
        "has_spicy_food"          BOOLEAN      NOT NULL DEFAULT FALSE,
        "has_single_seating"      BOOLEAN      NOT NULL DEFAULT FALSE,
        "has_table_seating"       BOOLEAN      NOT NULL DEFAULT FALSE,
        "has_floor_seating"       BOOLEAN      NOT NULL DEFAULT FALSE,
        "has_group_seating"       BOOLEAN      NOT NULL DEFAULT FALSE,
        "has_private_room"        BOOLEAN      NOT NULL DEFAULT FALSE,
        "has_bar_table"           BOOLEAN      NOT NULL DEFAULT FALSE,
        "has_baby_chair"          BOOLEAN      NOT NULL DEFAULT FALSE,
        "image_url"               TEXT         NOT NULL,
        "created_at"              TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
        "deleted_at"              TIMESTAMPTZ  NULL DEFAULT NULL,
        CONSTRAINT "PK_RESTAURANTS" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "stays" (
        "id"                      SERIAL       NOT NULL,
        "district_id"             INT          NOT NULL,
        "stay_category_id"        INT          NOT NULL,
        "name"                    VARCHAR(100) NOT NULL,
        "has_parking"             BOOLEAN      NOT NULL DEFAULT FALSE,
        "has_bathtub"             BOOLEAN      NOT NULL DEFAULT FALSE,
        "has_breakfast"           BOOLEAN      NOT NULL DEFAULT FALSE,
        "has_tv"                  BOOLEAN      NOT NULL DEFAULT FALSE,
        "has_bbq"                 BOOLEAN      NOT NULL DEFAULT FALSE,
        "allows_cooking"          BOOLEAN      NOT NULL DEFAULT FALSE,
        "allows_pets"             BOOLEAN      NOT NULL DEFAULT FALSE,
        "is_wheelchair_accessible" BOOLEAN     NOT NULL DEFAULT FALSE,
        "image_url"               TEXT         NOT NULL,
        "created_at"              TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
        "deleted_at"              TIMESTAMPTZ  NULL,
        CONSTRAINT "PK_STAYS" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "activities" (
        "id"                      SERIAL       NOT NULL,
        "destination_id"          INT          NOT NULL,
        "name"                    VARCHAR(100) NOT NULL,
        "available_parking"       BOOLEAN      NOT NULL DEFAULT FALSE,
        "is_wheelchair_accessible" BOOLEAN     NOT NULL DEFAULT FALSE,
        "allows_pets"             BOOLEAN      NOT NULL DEFAULT FALSE,
        "is_kid_friendly"         BOOLEAN      NOT NULL DEFAULT FALSE,
        "is_free"                 BOOLEAN      NOT NULL DEFAULT FALSE,
        "is_cafe"                 BOOLEAN      NOT NULL DEFAULT FALSE,
        "is_shopping"             BOOLEAN      NOT NULL DEFAULT FALSE,
        "offers_workshop"         BOOLEAN      NOT NULL DEFAULT FALSE,
        "is_exhibition"           BOOLEAN      NOT NULL DEFAULT FALSE,
        "image_url"               TEXT         NOT NULL,
        "created_at"              TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
        "deleted_at"              TIMESTAMPTZ  NULL,
        CONSTRAINT "PK_ACTIVITIES" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "theme" (
        "id"          SERIAL       NOT NULL,
        "name"        VARCHAR(50)  NOT NULL,
        "description" TEXT         NOT NULL,
        "image_url"   TEXT         NOT NULL,
        "created_at"  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
        "deleted_at"  TIMESTAMPTZ  NULL,
        CONSTRAINT "PK_THEME" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "courses" (
        "id"         SERIAL       NOT NULL,
        "user_id"    INT          NOT NULL,
        "theme_id"   INT          NOT NULL,
        "name"       VARCHAR(50)  NOT NULL,
        "duration"   SMALLINT     NOT NULL,
        "created_at" TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
        "deleted_at" TIMESTAMPTZ  NULL,
        CONSTRAINT "PK_COURSES" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "attribute_mappings" (
        "id"                     SERIAL  NOT NULL,
        "preference_category_id" INT     NOT NULL,
        "name"                   TEXT    NOT NULL,
        "profile_col"            TEXT    NULL,
        "snapshot_col"           TEXT    NULL,
        CONSTRAINT "PK_ATTRIBUTE_MAPPINGS" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "theme_mappings" (
        "id"            SERIAL   NOT NULL,
        "theme_id"      INT      NOT NULL,
        "preference_id" INT      NOT NULL,
        "target_val"    SMALLINT NOT NULL,
        CONSTRAINT "PK_THEME_MAPPINGS" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "user_preferences" (
        "user_id"      INT      NOT NULL,
        "res_oily"     SMALLINT NOT NULL,
        "res_clean"    SMALLINT NOT NULL,
        "res_stim"     SMALLINT NOT NULL,
        "res_spicy"    SMALLINT NOT NULL,
        "res_noise"    SMALLINT NOT NULL,
        "res_interior" SMALLINT NOT NULL,
        "res_service"  SMALLINT NOT NULL,
        "stay_view"    SMALLINT NOT NULL,
        "stay_interior" SMALLINT NOT NULL,
        "stay_space"   SMALLINT NOT NULL,
        "stay_noise"   SMALLINT NOT NULL,
        "stay_clean"   SMALLINT NOT NULL,
        "stay_service" SMALLINT NOT NULL,
        "act_culture"  SMALLINT NOT NULL,
        "act_view"     SMALLINT NOT NULL,
        "act_healing"  SMALLINT NOT NULL,
        "act_active"   SMALLINT NOT NULL,
        CONSTRAINT "PK_USER_PREFERENCES" PRIMARY KEY ("user_id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "restaurant_ratings" (
        "id"                 SERIAL          NOT NULL,
        "user_id"            INT             NOT NULL,
        "restaurant_id"      INT             NOT NULL,
        "overall_rating"     NUMERIC(2,1)    NOT NULL CHECK ("overall_rating" >= 0.0 AND "overall_rating" <= 5.0),
        "space_rating"       NUMERIC(2,1)    NOT NULL CHECK ("space_rating" >= 0.0 AND "space_rating" <= 5.0),
        "taste_rating"       NUMERIC(2,1)    NOT NULL CHECK ("taste_rating" >= 0.0 AND "taste_rating" <= 5.0),
        "visit_party_size"   INT             NOT NULL,
        "total_spent_amount" INT             NOT NULL,
        "res_oily_snap"      SMALLINT        NOT NULL,
        "res_clean_snap"     SMALLINT        NOT NULL,
        "res_stim_snap"      SMALLINT        NOT NULL,
        "res_spicy_snap"     SMALLINT        NOT NULL,
        "res_noise_snap"     SMALLINT        NOT NULL,
        "res_interior_snap"  SMALLINT        NOT NULL,
        "res_service_snap"   SMALLINT        NOT NULL,
        "mbti_snap"          "mbti_enum"     NOT NULL,
        "hormone_snap"       "hormone_enum"  NOT NULL,
        "created_at"         TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
        "deleted_at"         TIMESTAMPTZ     NULL DEFAULT NULL,
        CONSTRAINT "PK_RESTAURANT_RATINGS" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "stay_ratings" (
        "id"                 SERIAL          NOT NULL,
        "user_id"            INT             NOT NULL,
        "stay_id"            INT             NOT NULL,
        "overall_rating"     NUMERIC(2,1)    NOT NULL CHECK ("overall_rating" >= 0.0 AND "overall_rating" <= 5.0),
        "interior_rating"    NUMERIC(2,1)    NOT NULL CHECK ("interior_rating" >= 0.0 AND "interior_rating" <= 5.0),
        "clean_rating"       NUMERIC(2,1)    NOT NULL CHECK ("clean_rating" >= 0.0 AND "clean_rating" <= 5.0),
        "total_spent_amount" INT             NOT NULL,
        "visit_party_size"   INT             NOT NULL,
        "stay_view_snap"     SMALLINT        NOT NULL,
        "stay_interior_snap" SMALLINT        NOT NULL,
        "stay_space_snap"    SMALLINT        NOT NULL,
        "stay_noise_snap"    SMALLINT        NOT NULL,
        "stay_clean_snap"    SMALLINT        NOT NULL,
        "stay_service_snap"  SMALLINT        NOT NULL,
        "mbti_snap"          "mbti_enum"     NOT NULL,
        "hormone_snap"       "hormone_enum"  NULL,
        "created_at"         TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
        "deleted_at"         TIMESTAMPTZ     NULL,
        CONSTRAINT "PK_STAY_RATINGS" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "activity_ratings" (
        "id"               SERIAL          NOT NULL,
        "user_id"          INT             NOT NULL,
        "activity_id"      INT             NOT NULL,
        "overall_rating"   NUMERIC(2,1)    NOT NULL CHECK ("overall_rating" >= 0.0 AND "overall_rating" <= 5.0),
        "mbti_snap"        "mbti_enum"     NOT NULL,
        "hormone_snap"     "hormone_enum"  NOT NULL,
        "act_culture_snap" SMALLINT        NOT NULL,
        "act_view_snap"    SMALLINT        NOT NULL,
        "act_healing_snap" SMALLINT        NOT NULL,
        "act_active_snap"  SMALLINT        NOT NULL,
        "created_at"       TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
        "deleted_at"       TIMESTAMPTZ     NULL DEFAULT NULL,
        CONSTRAINT "PK_ACTIVITY_RATINGS" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "course_restaurants" (
        "id"            SERIAL   NOT NULL,
        "course_id"     INT      NOT NULL,
        "restaurant_id" INT      NOT NULL,
        "day_number"    SMALLINT NOT NULL,
        CONSTRAINT "PK_COURSE_RESTAURANTS" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "course_stays" (
        "id"         SERIAL   NOT NULL,
        "course_id"  INT      NOT NULL,
        "stay_id"    INT      NOT NULL,
        "day_number" SMALLINT NOT NULL,
        CONSTRAINT "PK_COURSE_STAYS" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "course_activities" (
        "id"          SERIAL   NOT NULL,
        "course_id"   INT      NOT NULL,
        "activity_id" INT      NOT NULL,
        "day_number"  SMALLINT NOT NULL,
        CONSTRAINT "PK_COURSE_ACTIVITIES" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "favorite_restaurants" (
        "id"            SERIAL NOT NULL,
        "user_id"       INT    NOT NULL,
        "restaurant_id" INT    NOT NULL,
        CONSTRAINT "PK_FAVORITE_RESTAURANTS" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "favorite_stays" (
        "id"      SERIAL NOT NULL,
        "user_id" INT    NOT NULL,
        "stay_id" INT    NOT NULL,
        CONSTRAINT "PK_FAVORITE_STAYS" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "favorite_activities" (
        "id"          SERIAL NOT NULL,
        "user_id"     INT    NOT NULL,
        "activity_id" INT    NOT NULL,
        CONSTRAINT "PK_FAVORITE_ACTIVITIES" PRIMARY KEY ("id")
      )
    `);

    // Foreign keys
    await queryRunner.query(`ALTER TABLE "districts" ADD CONSTRAINT "FK_districts_province_id" FOREIGN KEY ("province_id") REFERENCES "provinces"("id")`);

    await queryRunner.query(`ALTER TABLE "restaurants" ADD CONSTRAINT "FK_restaurants_district_id" FOREIGN KEY ("district_id") REFERENCES "districts"("id")`);
    await queryRunner.query(`ALTER TABLE "restaurants" ADD CONSTRAINT "FK_restaurants_restaurant_category_id" FOREIGN KEY ("restaurant_category_id") REFERENCES "restaurant_categories"("id")`);

    await queryRunner.query(`ALTER TABLE "stays" ADD CONSTRAINT "FK_stays_district_id" FOREIGN KEY ("district_id") REFERENCES "districts"("id")`);
    await queryRunner.query(`ALTER TABLE "stays" ADD CONSTRAINT "FK_stays_stay_category_id" FOREIGN KEY ("stay_category_id") REFERENCES "stay_categories"("id")`);

    await queryRunner.query(`ALTER TABLE "activities" ADD CONSTRAINT "FK_activities_destination_id" FOREIGN KEY ("destination_id") REFERENCES "districts"("id")`);

    await queryRunner.query(`ALTER TABLE "courses" ADD CONSTRAINT "FK_courses_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id")`);
    await queryRunner.query(`ALTER TABLE "courses" ADD CONSTRAINT "FK_courses_theme_id" FOREIGN KEY ("theme_id") REFERENCES "theme"("id")`);

    await queryRunner.query(`ALTER TABLE "attribute_mappings" ADD CONSTRAINT "FK_attribute_mappings_preference_category_id" FOREIGN KEY ("preference_category_id") REFERENCES "preference_categories"("id")`);

    await queryRunner.query(`ALTER TABLE "theme_mappings" ADD CONSTRAINT "FK_theme_mappings_theme_id" FOREIGN KEY ("theme_id") REFERENCES "theme"("id")`);
    await queryRunner.query(`ALTER TABLE "theme_mappings" ADD CONSTRAINT "FK_theme_mappings_preference_id" FOREIGN KEY ("preference_id") REFERENCES "attribute_mappings"("id")`);

    await queryRunner.query(`ALTER TABLE "user_preferences" ADD CONSTRAINT "FK_user_preferences_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id")`);

    await queryRunner.query(`ALTER TABLE "restaurant_ratings" ADD CONSTRAINT "FK_restaurant_ratings_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id")`);
    await queryRunner.query(`ALTER TABLE "restaurant_ratings" ADD CONSTRAINT "FK_restaurant_ratings_restaurant_id" FOREIGN KEY ("restaurant_id") REFERENCES "restaurants"("id")`);

    await queryRunner.query(`ALTER TABLE "stay_ratings" ADD CONSTRAINT "FK_stay_ratings_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id")`);
    await queryRunner.query(`ALTER TABLE "stay_ratings" ADD CONSTRAINT "FK_stay_ratings_stay_id" FOREIGN KEY ("stay_id") REFERENCES "stays"("id")`);

    await queryRunner.query(`ALTER TABLE "activity_ratings" ADD CONSTRAINT "FK_activity_ratings_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id")`);
    await queryRunner.query(`ALTER TABLE "activity_ratings" ADD CONSTRAINT "FK_activity_ratings_activity_id" FOREIGN KEY ("activity_id") REFERENCES "activities"("id")`);

    await queryRunner.query(`ALTER TABLE "course_restaurants" ADD CONSTRAINT "FK_course_restaurants_course_id" FOREIGN KEY ("course_id") REFERENCES "courses"("id")`);
    await queryRunner.query(`ALTER TABLE "course_restaurants" ADD CONSTRAINT "FK_course_restaurants_restaurant_id" FOREIGN KEY ("restaurant_id") REFERENCES "restaurants"("id")`);

    await queryRunner.query(`ALTER TABLE "course_stays" ADD CONSTRAINT "FK_course_stays_course_id" FOREIGN KEY ("course_id") REFERENCES "courses"("id")`);
    await queryRunner.query(`ALTER TABLE "course_stays" ADD CONSTRAINT "FK_course_stays_stay_id" FOREIGN KEY ("stay_id") REFERENCES "stays"("id")`);

    await queryRunner.query(`ALTER TABLE "course_activities" ADD CONSTRAINT "FK_course_activities_course_id" FOREIGN KEY ("course_id") REFERENCES "courses"("id")`);
    await queryRunner.query(`ALTER TABLE "course_activities" ADD CONSTRAINT "FK_course_activities_activity_id" FOREIGN KEY ("activity_id") REFERENCES "activities"("id")`);

    await queryRunner.query(`ALTER TABLE "favorite_restaurants" ADD CONSTRAINT "FK_favorite_restaurants_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id")`);
    await queryRunner.query(`ALTER TABLE "favorite_restaurants" ADD CONSTRAINT "FK_favorite_restaurants_restaurant_id" FOREIGN KEY ("restaurant_id") REFERENCES "restaurants"("id")`);

    await queryRunner.query(`ALTER TABLE "favorite_stays" ADD CONSTRAINT "FK_favorite_stays_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id")`);
    await queryRunner.query(`ALTER TABLE "favorite_stays" ADD CONSTRAINT "FK_favorite_stays_stay_id" FOREIGN KEY ("stay_id") REFERENCES "stays"("id")`);

    await queryRunner.query(`ALTER TABLE "favorite_activities" ADD CONSTRAINT "FK_favorite_activities_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id")`);
    await queryRunner.query(`ALTER TABLE "favorite_activities" ADD CONSTRAINT "FK_favorite_activities_activity_id" FOREIGN KEY ("activity_id") REFERENCES "activities"("id")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "favorite_activities" DROP CONSTRAINT "FK_favorite_activities_activity_id"`);
    await queryRunner.query(`ALTER TABLE "favorite_activities" DROP CONSTRAINT "FK_favorite_activities_user_id"`);
    await queryRunner.query(`ALTER TABLE "favorite_stays" DROP CONSTRAINT "FK_favorite_stays_stay_id"`);
    await queryRunner.query(`ALTER TABLE "favorite_stays" DROP CONSTRAINT "FK_favorite_stays_user_id"`);
    await queryRunner.query(`ALTER TABLE "favorite_restaurants" DROP CONSTRAINT "FK_favorite_restaurants_restaurant_id"`);
    await queryRunner.query(`ALTER TABLE "favorite_restaurants" DROP CONSTRAINT "FK_favorite_restaurants_user_id"`);
    await queryRunner.query(`ALTER TABLE "course_activities" DROP CONSTRAINT "FK_course_activities_activity_id"`);
    await queryRunner.query(`ALTER TABLE "course_activities" DROP CONSTRAINT "FK_course_activities_course_id"`);
    await queryRunner.query(`ALTER TABLE "course_stays" DROP CONSTRAINT "FK_course_stays_stay_id"`);
    await queryRunner.query(`ALTER TABLE "course_stays" DROP CONSTRAINT "FK_course_stays_course_id"`);
    await queryRunner.query(`ALTER TABLE "course_restaurants" DROP CONSTRAINT "FK_course_restaurants_restaurant_id"`);
    await queryRunner.query(`ALTER TABLE "course_restaurants" DROP CONSTRAINT "FK_course_restaurants_course_id"`);
    await queryRunner.query(`ALTER TABLE "activity_ratings" DROP CONSTRAINT "FK_activity_ratings_activity_id"`);
    await queryRunner.query(`ALTER TABLE "activity_ratings" DROP CONSTRAINT "FK_activity_ratings_user_id"`);
    await queryRunner.query(`ALTER TABLE "stay_ratings" DROP CONSTRAINT "FK_stay_ratings_stay_id"`);
    await queryRunner.query(`ALTER TABLE "stay_ratings" DROP CONSTRAINT "FK_stay_ratings_user_id"`);
    await queryRunner.query(`ALTER TABLE "restaurant_ratings" DROP CONSTRAINT "FK_restaurant_ratings_restaurant_id"`);
    await queryRunner.query(`ALTER TABLE "restaurant_ratings" DROP CONSTRAINT "FK_restaurant_ratings_user_id"`);
    await queryRunner.query(`ALTER TABLE "user_preferences" DROP CONSTRAINT "FK_user_preferences_user_id"`);
    await queryRunner.query(`ALTER TABLE "theme_mappings" DROP CONSTRAINT "FK_theme_mappings_preference_id"`);
    await queryRunner.query(`ALTER TABLE "theme_mappings" DROP CONSTRAINT "FK_theme_mappings_theme_id"`);
    await queryRunner.query(`ALTER TABLE "attribute_mappings" DROP CONSTRAINT "FK_attribute_mappings_preference_category_id"`);
    await queryRunner.query(`ALTER TABLE "courses" DROP CONSTRAINT "FK_courses_theme_id"`);
    await queryRunner.query(`ALTER TABLE "courses" DROP CONSTRAINT "FK_courses_user_id"`);
    await queryRunner.query(`ALTER TABLE "activities" DROP CONSTRAINT "FK_activities_destination_id"`);
    await queryRunner.query(`ALTER TABLE "stays" DROP CONSTRAINT "FK_stays_stay_category_id"`);
    await queryRunner.query(`ALTER TABLE "stays" DROP CONSTRAINT "FK_stays_district_id"`);
    await queryRunner.query(`ALTER TABLE "restaurants" DROP CONSTRAINT "FK_restaurants_restaurant_category_id"`);
    await queryRunner.query(`ALTER TABLE "restaurants" DROP CONSTRAINT "FK_restaurants_district_id"`);
    await queryRunner.query(`ALTER TABLE "districts" DROP CONSTRAINT "FK_districts_province_id"`);

    await queryRunner.query(`DROP TABLE "favorite_activities"`);
    await queryRunner.query(`DROP TABLE "favorite_stays"`);
    await queryRunner.query(`DROP TABLE "favorite_restaurants"`);
    await queryRunner.query(`DROP TABLE "course_activities"`);
    await queryRunner.query(`DROP TABLE "course_stays"`);
    await queryRunner.query(`DROP TABLE "course_restaurants"`);
    await queryRunner.query(`DROP TABLE "activity_ratings"`);
    await queryRunner.query(`DROP TABLE "stay_ratings"`);
    await queryRunner.query(`DROP TABLE "restaurant_ratings"`);
    await queryRunner.query(`DROP TABLE "user_preferences"`);
    await queryRunner.query(`DROP TABLE "theme_mappings"`);
    await queryRunner.query(`DROP TABLE "attribute_mappings"`);
    await queryRunner.query(`DROP TABLE "courses"`);
    await queryRunner.query(`DROP TABLE "theme"`);
    await queryRunner.query(`DROP TABLE "activities"`);
    await queryRunner.query(`DROP TABLE "stays"`);
    await queryRunner.query(`DROP TABLE "restaurants"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "preference_categories"`);
    await queryRunner.query(`DROP TABLE "stay_categories"`);
    await queryRunner.query(`DROP TABLE "restaurant_categories"`);
    await queryRunner.query(`DROP TABLE "districts"`);
    await queryRunner.query(`DROP TABLE "provinces"`);

    await queryRunner.query(`DROP TYPE "domain_enum"`);
    await queryRunner.query(`DROP TYPE "hormone_enum"`);
    await queryRunner.query(`DROP TYPE "mbti_enum"`);
    await queryRunner.query(`DROP TYPE "gender_enum"`);
  }
}
