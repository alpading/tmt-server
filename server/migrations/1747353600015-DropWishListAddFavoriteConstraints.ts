import { MigrationInterface, QueryRunner } from 'typeorm';

export class DropWishListAddFavoriteConstraints1747353600015 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "wish_list"`);

    await queryRunner.query(`
      ALTER TABLE "favorite_restaurants"
        ADD CONSTRAINT "UQ_FAV_RESTAURANT_USER" UNIQUE ("user_id", "restaurant_id")
    `);
    await queryRunner.query(`
      ALTER TABLE "favorite_stays"
        ADD CONSTRAINT "UQ_FAV_STAY_USER" UNIQUE ("user_id", "stay_id")
    `);
    await queryRunner.query(`
      ALTER TABLE "favorite_activities"
        ADD CONSTRAINT "UQ_FAV_ACTIVITY_USER" UNIQUE ("user_id", "activity_id")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "favorite_activities" DROP CONSTRAINT "UQ_FAV_ACTIVITY_USER"`);
    await queryRunner.query(`ALTER TABLE "favorite_stays" DROP CONSTRAINT "UQ_FAV_STAY_USER"`);
    await queryRunner.query(`ALTER TABLE "favorite_restaurants" DROP CONSTRAINT "UQ_FAV_RESTAURANT_USER"`);

    await queryRunner.query(`
      CREATE TABLE "wish_list" (
        "id"         SERIAL        NOT NULL,
        "user_id"    INT           NOT NULL,
        "domain"     "domain_enum" NOT NULL,
        "item_id"    INT           NOT NULL,
        "created_at" TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
        CONSTRAINT "PK_WISH_LIST" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_WISH_USER_DOMAIN_ITEM" UNIQUE ("user_id", "domain", "item_id")
      )
    `);
  }
}
