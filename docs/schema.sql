-- ============================================================
-- TMT (떠먹트립) — 최종 통합 DDL
-- 모든 migration 적용 후 현재 DB 상태 기준
-- (실행용이 아닌 ERD/문서 참조용)
-- ============================================================

-- ── ENUM TYPES ──────────────────────────────────────────────

CREATE TYPE "gender_enum"   AS ENUM ('MALE', 'FEMALE');
CREATE TYPE "mbti_enum"     AS ENUM (
  'INTJ','INTP','ENTJ','ENTP',
  'INFJ','INFP','ENFJ','ENFP',
  'ISTJ','ISFJ','ESTJ','ESFJ',
  'ISTP','ISFP','ESTP','ESFP'
);
CREATE TYPE "hormone_enum"  AS ENUM ('EGEN', 'TETO');
CREATE TYPE "domain_enum"   AS ENUM ('restaurant', 'stay', 'activity');
CREATE TYPE "role_enum"     AS ENUM ('USER', 'ADMIN');


-- ── 지역 ────────────────────────────────────────────────────

CREATE TABLE "provinces" (
  "id"   SERIAL      NOT NULL,
  "name" VARCHAR(10) NOT NULL,
  CONSTRAINT "PK_PROVINCES" PRIMARY KEY ("id")
);

CREATE TABLE "districts" (
  "id"          SERIAL      NOT NULL,
  "province_id" INT         NOT NULL,
  "name"        VARCHAR(30) NOT NULL,
  CONSTRAINT "PK_DISTRICTS"          PRIMARY KEY ("id"),
  CONSTRAINT "FK_districts_province_id" FOREIGN KEY ("province_id") REFERENCES "provinces"("id")
);


-- ── 카테고리 ─────────────────────────────────────────────────

CREATE TABLE "restaurant_categories" (
  "id"         SERIAL      NOT NULL,
  "name"       VARCHAR(30) NOT NULL,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "deleted_at" TIMESTAMPTZ NULL,
  CONSTRAINT "PK_RESTAURANT_CATEGORIES" PRIMARY KEY ("id")
);

CREATE TABLE "stay_categories" (
  "id"         SERIAL      NOT NULL,
  "name"       VARCHAR(30) NOT NULL,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "deleted_at" TIMESTAMPTZ NULL,
  CONSTRAINT "PK_STAY_CATEGORIES" PRIMARY KEY ("id")
);


-- ── 사용자 ───────────────────────────────────────────────────

CREATE TABLE "users" (
  "id"            SERIAL         NOT NULL,
  "login_id"      VARCHAR(30)    UNIQUE NULL,
  "hashed_pw"     TEXT           NULL,
  "name"          VARCHAR(30)    NOT NULL,
  "birth_date"    DATE           NOT NULL,
  "gender"        "gender_enum"  NOT NULL,
  "mbti"          "mbti_enum"    NOT NULL,
  "hormone"       "hormone_enum" NOT NULL,
  "role"          "role_enum"    NOT NULL DEFAULT 'USER',
  "refresh_token" TEXT           NULL,
  "created_at"    TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
  "deleted_at"    TIMESTAMPTZ    NULL,
  CONSTRAINT "PK_USERS" PRIMARY KEY ("id")
);

CREATE TABLE "user_preferences" (
  "user_id"       INT      NOT NULL,
  -- 식당 취향
  "res_oily"      SMALLINT NOT NULL,
  "res_mild"      SMALLINT NOT NULL,
  "res_clean"     SMALLINT NOT NULL,
  "res_stim"      SMALLINT NOT NULL,
  "res_spicy"     SMALLINT NOT NULL,
  "res_noise"     SMALLINT NOT NULL,
  "res_interior"  SMALLINT NOT NULL,
  "res_service"   SMALLINT NOT NULL,
  -- 숙소 취향
  "stay_view"     SMALLINT NOT NULL,
  "stay_interior" SMALLINT NOT NULL,
  "stay_space"    SMALLINT NOT NULL,
  "stay_noise"    SMALLINT NOT NULL,
  "stay_clean"    SMALLINT NOT NULL,
  "stay_service"  SMALLINT NOT NULL,
  -- 액티비티 취향
  "act_culture"   SMALLINT NOT NULL,
  "act_view"      SMALLINT NOT NULL,
  "act_healing"   SMALLINT NOT NULL,
  "act_active"    SMALLINT NOT NULL,
  CONSTRAINT "PK_USER_PREFERENCES"          PRIMARY KEY ("user_id"),
  CONSTRAINT "FK_user_preferences_user_id"  FOREIGN KEY ("user_id") REFERENCES "users"("id")
);


-- ── 여행지 ───────────────────────────────────────────────────

CREATE TABLE "restaurants" (
  "id"                     SERIAL        NOT NULL,
  "district_id"            INT           NOT NULL,
  "restaurant_category_id" INT           NOT NULL,
  "name"                   VARCHAR(100)  NOT NULL,
  -- 속성
  "allows_pets"            BOOLEAN       NOT NULL DEFAULT FALSE,
  "has_spicy_food"         BOOLEAN       NOT NULL DEFAULT FALSE,
  "has_single_seating"     BOOLEAN       NOT NULL DEFAULT FALSE,
  "has_table_seating"      BOOLEAN       NOT NULL DEFAULT FALSE,
  "has_group_seating"      BOOLEAN       NOT NULL DEFAULT FALSE,
  "has_private_room"       BOOLEAN       NOT NULL DEFAULT FALSE,
  "has_bar_table"          BOOLEAN       NOT NULL DEFAULT FALSE,
  "has_baby_chair"         BOOLEAN       NOT NULL DEFAULT FALSE,
  "has_parking"            BOOLEAN       NOT NULL DEFAULT FALSE,
  -- 위치
  "latitude"               DECIMAL(10,7) NOT NULL DEFAULT 0,
  "longitude"              DECIMAL(10,7) NOT NULL DEFAULT 0,
  "naver_place_id"         VARCHAR(30)   NULL,
  -- 메타
  "image_url"              TEXT          NOT NULL,
  "created_at"             TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  "deleted_at"             TIMESTAMPTZ   NULL,
  CONSTRAINT "PK_RESTAURANTS"                            PRIMARY KEY ("id"),
  CONSTRAINT "FK_restaurants_district_id"                FOREIGN KEY ("district_id")            REFERENCES "districts"("id"),
  CONSTRAINT "FK_restaurants_restaurant_category_id"     FOREIGN KEY ("restaurant_category_id") REFERENCES "restaurant_categories"("id")
);

CREATE TABLE "stays" (
  "id"                       SERIAL        NOT NULL,
  "district_id"              INT           NOT NULL,
  "stay_category_id"         INT           NOT NULL,
  "name"                     VARCHAR(100)  NOT NULL,
  -- 속성
  "has_parking"              BOOLEAN       NOT NULL DEFAULT FALSE,
  "has_bathtub"              BOOLEAN       NOT NULL DEFAULT FALSE,
  "has_breakfast"            BOOLEAN       NOT NULL DEFAULT FALSE,
  "has_tv"                   BOOLEAN       NOT NULL DEFAULT FALSE,
  "has_bbq"                  BOOLEAN       NOT NULL DEFAULT FALSE,
  "allows_cooking"           BOOLEAN       NOT NULL DEFAULT FALSE,
  "allows_pets"              BOOLEAN       NOT NULL DEFAULT FALSE,
  "is_wheelchair_accessible" BOOLEAN       NOT NULL DEFAULT FALSE,
  -- 위치
  "latitude"                 DECIMAL(10,7) NOT NULL DEFAULT 0,
  "longitude"                DECIMAL(10,7) NOT NULL DEFAULT 0,
  "naver_place_id"           VARCHAR(30)   NULL,
  -- 메타
  "image_url"                TEXT          NOT NULL,
  "created_at"               TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  "deleted_at"               TIMESTAMPTZ   NULL,
  CONSTRAINT "PK_STAYS"                    PRIMARY KEY ("id"),
  CONSTRAINT "FK_stays_district_id"        FOREIGN KEY ("district_id")    REFERENCES "districts"("id"),
  CONSTRAINT "FK_stays_stay_category_id"   FOREIGN KEY ("stay_category_id") REFERENCES "stay_categories"("id")
);

CREATE TABLE "activities" (
  "id"                       SERIAL        NOT NULL,
  "district_id"              INT           NOT NULL,  -- renamed from destination_id
  "name"                     VARCHAR(100)  NOT NULL,
  -- 속성
  "has_parking"              BOOLEAN       NOT NULL DEFAULT FALSE,  -- renamed from available_parking
  "is_wheelchair_accessible" BOOLEAN       NOT NULL DEFAULT FALSE,
  "allows_pets"              BOOLEAN       NOT NULL DEFAULT FALSE,
  "is_kid_friendly"          BOOLEAN       NOT NULL DEFAULT FALSE,
  "is_free"                  BOOLEAN       NOT NULL DEFAULT FALSE,
  "is_cafe"                  BOOLEAN       NOT NULL DEFAULT FALSE,
  "is_shopping"              BOOLEAN       NOT NULL DEFAULT FALSE,
  "is_active"                BOOLEAN       NOT NULL DEFAULT FALSE,  -- replaced offers_workshop
  "is_exhibition"            BOOLEAN       NOT NULL DEFAULT FALSE,
  -- 위치
  "latitude"                 DECIMAL(10,7) NOT NULL DEFAULT 0,
  "longitude"                DECIMAL(10,7) NOT NULL DEFAULT 0,
  "naver_place_id"           VARCHAR(30)   NULL,
  -- 메타
  "image_url"                TEXT          NOT NULL,
  "created_at"               TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  "deleted_at"               TIMESTAMPTZ   NULL,
  CONSTRAINT "PK_ACTIVITIES"               PRIMARY KEY ("id"),
  CONSTRAINT "FK_activities_district_id"   FOREIGN KEY ("district_id") REFERENCES "districts"("id")
);


-- ── 테마 / 추천 ──────────────────────────────────────────────

CREATE TABLE "themes" (
  "id"          SERIAL      NOT NULL,
  "name"      VARCHAR(50) NOT NULL,
  "image_url" TEXT        NOT NULL,
  "created_at"  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "deleted_at"  TIMESTAMPTZ NULL,
  CONSTRAINT "PK_THEMES" PRIMARY KEY ("id")
);

-- 취향 카테고리 (식당/숙소/액티비티 × 세부 항목)
CREATE TABLE "preference_categories" (
  "id"            SERIAL        NOT NULL,
  "name"          VARCHAR(20)   NULL,
  "target_rating" TEXT          NOT NULL,
  "domain"        "domain_enum" NOT NULL,
  CONSTRAINT "PK_PREFERENCE_CATEGORIES" PRIMARY KEY ("id")
);

-- 취향 속성 정의 (attribute_mappings → preferences 로 rename)
CREATE TABLE "preferences" (
  "id"                     SERIAL      NOT NULL,
  "preference_category_id" INT         NOT NULL,
  "name"                   TEXT        NULL,
  "profile_col"            TEXT        NULL,
  "snapshot_col"           TEXT        NULL,
  "question_text"          TEXT        NULL,
  "option_high"            VARCHAR(40) NULL,
  "option_mid"             VARCHAR(40) NULL,
  "option_low"             VARCHAR(40) NULL,
  CONSTRAINT "PK_PREFERENCES"                        PRIMARY KEY ("id"),
  CONSTRAINT "FK_preferences_preference_category_id" FOREIGN KEY ("preference_category_id") REFERENCES "preference_categories"("id")
);

-- 테마 ↔ 취향 매핑 (테마 추천 조건)
CREATE TABLE "theme_mappings" (
  "id"            SERIAL   NOT NULL,
  "theme_id"      INT      NOT NULL,
  "preference_id" INT      NOT NULL,
  "target_val"    SMALLINT NOT NULL,
  CONSTRAINT "PK_THEME_MAPPINGS"               PRIMARY KEY ("id"),
  CONSTRAINT "FK_theme_mappings_theme_id"      FOREIGN KEY ("theme_id")      REFERENCES "themes"("id"),
  CONSTRAINT "FK_theme_mappings_preference_id" FOREIGN KEY ("preference_id") REFERENCES "preferences"("id")
);


-- ── 코스 ────────────────────────────────────────────────────

CREATE TABLE "courses" (
  "id"         SERIAL      NOT NULL,
  "user_id"    INT         NOT NULL,
  "theme_id"   INT         NOT NULL,
  "name"       VARCHAR(50) NOT NULL,
  "duration"   SMALLINT    NOT NULL,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  -- deleted_at 없음 (hard delete)
  CONSTRAINT "PK_COURSES"          PRIMARY KEY ("id"),
  CONSTRAINT "FK_courses_user_id"  FOREIGN KEY ("user_id")  REFERENCES "users"("id"),
  CONSTRAINT "FK_courses_theme_id" FOREIGN KEY ("theme_id") REFERENCES "themes"("id")
);

CREATE TABLE "course_stays" (
  "id"         SERIAL   NOT NULL,
  "course_id"  INT      NOT NULL,
  "stay_id"    INT      NOT NULL,
  "day_number" SMALLINT NOT NULL,
  CONSTRAINT "PK_COURSE_STAYS"             PRIMARY KEY ("id"),
  CONSTRAINT "UQ_COURSE_STAYS_COURSE_STAY" UNIQUE ("course_id", "stay_id"),
  CONSTRAINT "FK_course_stays_course_id"   FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE,
  CONSTRAINT "FK_course_stays_stay_id"     FOREIGN KEY ("stay_id")   REFERENCES "stays"("id")
);

CREATE TABLE "course_activities" (
  "id"          SERIAL   NOT NULL,
  "course_id"   INT      NOT NULL,
  "activity_id" INT      NOT NULL,
  "day_number"  SMALLINT NOT NULL,
  CONSTRAINT "PK_COURSE_ACTIVITIES"                 PRIMARY KEY ("id"),
  CONSTRAINT "UQ_COURSE_ACTIVITIES_COURSE_ACTIVITY" UNIQUE ("course_id", "activity_id"),
  CONSTRAINT "FK_course_activities_course_id"       FOREIGN KEY ("course_id")   REFERENCES "courses"("id") ON DELETE CASCADE,
  CONSTRAINT "FK_course_activities_activity_id"     FOREIGN KEY ("activity_id") REFERENCES "activities"("id")
);

CREATE TABLE "course_restaurants" (
  "id"            SERIAL   NOT NULL,
  "course_id"     INT      NOT NULL,
  "restaurant_id" INT      NOT NULL,
  "day_number"    SMALLINT NOT NULL,
  "item_order"    SMALLINT NOT NULL DEFAULT 0,
  CONSTRAINT "PK_COURSE_RESTAURANTS"                   PRIMARY KEY ("id"),
  CONSTRAINT "UQ_COURSE_RESTAURANTS_COURSE_RESTAURANT" UNIQUE ("course_id", "restaurant_id"),
  CONSTRAINT "FK_course_restaurants_course_id"         FOREIGN KEY ("course_id")     REFERENCES "courses"("id") ON DELETE CASCADE,
  CONSTRAINT "FK_course_restaurants_restaurant_id"     FOREIGN KEY ("restaurant_id") REFERENCES "restaurants"("id")
);


-- ── 저장된 장소 (즐겨찾기) ──────────────────────────────────

CREATE TABLE "favorite_restaurants" (
  "id"            SERIAL      NOT NULL,
  "user_id"       INT         NOT NULL,
  "restaurant_id" INT         NOT NULL,
  "created_at"    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "PK_FAVORITE_RESTAURANTS"               PRIMARY KEY ("id"),
  CONSTRAINT "UQ_FAV_RESTAURANT_USER"                UNIQUE ("user_id", "restaurant_id"),
  CONSTRAINT "FK_favorite_restaurants_user_id"       FOREIGN KEY ("user_id")       REFERENCES "users"("id"),
  CONSTRAINT "FK_favorite_restaurants_restaurant_id" FOREIGN KEY ("restaurant_id") REFERENCES "restaurants"("id")
);

CREATE TABLE "favorite_stays" (
  "id"         SERIAL      NOT NULL,
  "user_id"    INT         NOT NULL,
  "stay_id"    INT         NOT NULL,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "PK_FAVORITE_STAYS"         PRIMARY KEY ("id"),
  CONSTRAINT "UQ_FAV_STAY_USER"          UNIQUE ("user_id", "stay_id"),
  CONSTRAINT "FK_favorite_stays_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id"),
  CONSTRAINT "FK_favorite_stays_stay_id" FOREIGN KEY ("stay_id") REFERENCES "stays"("id")
);

CREATE TABLE "favorite_activities" (
  "id"          SERIAL      NOT NULL,
  "user_id"     INT         NOT NULL,
  "activity_id" INT         NOT NULL,
  "created_at"  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "PK_FAVORITE_ACTIVITIES"             PRIMARY KEY ("id"),
  CONSTRAINT "UQ_FAV_ACTIVITY_USER"               UNIQUE ("user_id", "activity_id"),
  CONSTRAINT "FK_favorite_activities_user_id"     FOREIGN KEY ("user_id")     REFERENCES "users"("id"),
  CONSTRAINT "FK_favorite_activities_activity_id" FOREIGN KEY ("activity_id") REFERENCES "activities"("id")
);


-- ── 리뷰 / 평점 ──────────────────────────────────────────────

CREATE TABLE "restaurant_ratings" (
  "id"                 SERIAL         NOT NULL,
  "user_id"            INT            NOT NULL,
  "restaurant_id"      INT            NOT NULL,
  "overall_rating"     NUMERIC(2,1)   NOT NULL CHECK ("overall_rating"  BETWEEN 0.0 AND 5.0),
  "space_rating"       NUMERIC(2,1)   NOT NULL CHECK ("space_rating"    BETWEEN 0.0 AND 5.0),
  "taste_rating"       NUMERIC(2,1)   NOT NULL CHECK ("taste_rating"    BETWEEN 0.0 AND 5.0),
  "visit_party_size"   INT            NOT NULL,
  "total_spent_amount" INT            NOT NULL,
  -- 평점 시점 사용자 취향 스냅샷
  "res_oily_snap"      SMALLINT       NOT NULL,
  "res_mild_snap"      SMALLINT       NOT NULL,
  "res_clean_snap"     SMALLINT       NOT NULL,
  "res_stim_snap"      SMALLINT       NOT NULL,
  "res_spicy_snap"     SMALLINT       NOT NULL,
  "res_noise_snap"     SMALLINT       NOT NULL,
  "res_interior_snap"  SMALLINT       NOT NULL,
  "res_service_snap"   SMALLINT       NOT NULL,
  "mbti_snap"          "mbti_enum"    NOT NULL,
  "hormone_snap"       "hormone_enum" NOT NULL,
  "created_at"         TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
  "deleted_at"         TIMESTAMPTZ    NULL,
  CONSTRAINT "PK_RESTAURANT_RATINGS"              PRIMARY KEY ("id"),
  CONSTRAINT "FK_restaurant_ratings_user_id"      FOREIGN KEY ("user_id")       REFERENCES "users"("id"),
  CONSTRAINT "FK_restaurant_ratings_restaurant_id" FOREIGN KEY ("restaurant_id") REFERENCES "restaurants"("id")
);

CREATE TABLE "stay_ratings" (
  "id"                 SERIAL         NOT NULL,
  "user_id"            INT            NOT NULL,
  "stay_id"            INT            NOT NULL,
  "overall_rating"     NUMERIC(2,1)   NOT NULL CHECK ("overall_rating"  BETWEEN 0.0 AND 5.0),
  "interior_rating"    NUMERIC(2,1)   NOT NULL CHECK ("interior_rating" BETWEEN 0.0 AND 5.0),
  "clean_rating"       NUMERIC(2,1)   NOT NULL CHECK ("clean_rating"    BETWEEN 0.0 AND 5.0),
  "total_spent_amount" INT            NOT NULL,
  "visit_party_size"   INT            NOT NULL,
  -- 평점 시점 사용자 취향 스냅샷
  "stay_view_snap"     SMALLINT       NOT NULL,
  "stay_interior_snap" SMALLINT       NOT NULL,
  "stay_space_snap"    SMALLINT       NOT NULL,
  "stay_noise_snap"    SMALLINT       NOT NULL,
  "stay_clean_snap"    SMALLINT       NOT NULL,
  "stay_service_snap"  SMALLINT       NOT NULL,
  "mbti_snap"          "mbti_enum"    NOT NULL,
  "hormone_snap"       "hormone_enum" NULL,
  "created_at"         TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
  "deleted_at"         TIMESTAMPTZ    NULL,
  CONSTRAINT "PK_STAY_RATINGS"              PRIMARY KEY ("id"),
  CONSTRAINT "FK_stay_ratings_user_id"      FOREIGN KEY ("user_id") REFERENCES "users"("id"),
  CONSTRAINT "FK_stay_ratings_stay_id"      FOREIGN KEY ("stay_id") REFERENCES "stays"("id")
);

CREATE TABLE "activity_ratings" (
  "id"               SERIAL         NOT NULL,
  "user_id"          INT            NOT NULL,
  "activity_id"      INT            NOT NULL,
  "overall_rating"   NUMERIC(2,1)   NOT NULL CHECK ("overall_rating" BETWEEN 0.0 AND 5.0),
  -- 평점 시점 사용자 취향 스냅샷
  "act_culture_snap" SMALLINT       NOT NULL,
  "act_view_snap"    SMALLINT       NOT NULL,
  "act_healing_snap" SMALLINT       NOT NULL,
  "act_active_snap"  SMALLINT       NOT NULL,
  "mbti_snap"        "mbti_enum"    NOT NULL,
  "hormone_snap"     "hormone_enum" NOT NULL,
  "created_at"       TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
  "deleted_at"       TIMESTAMPTZ    NULL,
  CONSTRAINT "PK_ACTIVITY_RATINGS"              PRIMARY KEY ("id"),
  CONSTRAINT "FK_activity_ratings_user_id"      FOREIGN KEY ("user_id")     REFERENCES "users"("id"),
  CONSTRAINT "FK_activity_ratings_activity_id"  FOREIGN KEY ("activity_id") REFERENCES "activities"("id")
);
