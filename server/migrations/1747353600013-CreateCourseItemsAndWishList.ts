import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCourseItemsAndWishList1747353600013 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // courses는 hard delete → deleted_at 제거
    await queryRunner.query(`ALTER TABLE "courses" DROP COLUMN "deleted_at"`);

    await queryRunner.query(`
      CREATE TABLE "course_items" (
        "id"          SERIAL        NOT NULL,
        "course_id"   INT           NOT NULL,
        "domain"      "domain_enum" NOT NULL,
        "item_id"     INT           NOT NULL,
        "item_order"  SMALLINT      NOT NULL DEFAULT 0,
        "created_at"  TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
        CONSTRAINT "PK_COURSE_ITEMS" PRIMARY KEY ("id"),
        CONSTRAINT "FK_COURSE_ITEMS_COURSE" FOREIGN KEY ("course_id")
          REFERENCES "courses"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "wish_list" (
        "id"          SERIAL        NOT NULL,
        "user_id"     INT           NOT NULL,
        "domain"      "domain_enum" NOT NULL,
        "item_id"     INT           NOT NULL,
        "created_at"  TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
        CONSTRAINT "PK_WISH_LIST" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_WISH_USER_DOMAIN_ITEM" UNIQUE ("user_id", "domain", "item_id")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "wish_list"`);
    await queryRunner.query(`DROP TABLE "course_items"`);
    await queryRunner.query(`ALTER TABLE "courses" ADD COLUMN "deleted_at" TIMESTAMPTZ NULL`);
  }
}
