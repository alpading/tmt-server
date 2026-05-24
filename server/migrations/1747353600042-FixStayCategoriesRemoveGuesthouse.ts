import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixStayCategoriesRemoveGuesthouse1747353600042 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // ── 숙소 카테고리 수정 ─────────────────────────────────────────────────────
    // id=6  경주 베니키아 스위스로젠호텔: 리조트(6) → 호텔(1)
    // id=12 황리단길스테이:               게하/호스텔(4) → 펜션(3)
    // id=13 경주시티호텔:                 게하/호스텔(4) → 호텔(1)
    await queryRunner.query(`
      UPDATE "stays" SET stay_category_id = 1 WHERE id = 6;
      UPDATE "stays" SET stay_category_id = 3 WHERE id = 12;
      UPDATE "stays" SET stay_category_id = 1 WHERE id = 13;
    `);

    // ── 게하/호스텔 카테고리 삭제 (category_id=4) ────────────────────────────
    // 위에서 category_id=4를 사용하는 stay가 없어졌으므로 FK 위반 없음
    await queryRunner.query(`DELETE FROM "stay_categories" WHERE id = 4`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO "stay_categories" ("id", "name") VALUES (4, '게하 / 호스텔')
      ON CONFLICT (id) DO NOTHING
    `);
    await queryRunner.query(`
      UPDATE "stays" SET stay_category_id = 6 WHERE id = 6;
      UPDATE "stays" SET stay_category_id = 4 WHERE id = 12;
      UPDATE "stays" SET stay_category_id = 4 WHERE id = 13;
    `);
  }
}
