import { MigrationInterface, QueryRunner } from 'typeorm';

export class DropPreferenceQuestionsTable1747353600047 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "preference_questions"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "preference_questions" (
        "id"            SERIAL      NOT NULL,
        "section_title" VARCHAR(50) NOT NULL,
        "section_order" SMALLINT    NOT NULL,
        "disp_order"    SMALLINT    NOT NULL,
        "question_text" TEXT        NOT NULL,
        "pref_key"      VARCHAR(30) NOT NULL,
        "option_high"   VARCHAR(40) NOT NULL,
        "option_mid"    VARCHAR(40) NOT NULL,
        "option_low"    VARCHAR(40) NOT NULL,
        CONSTRAINT "PK_PREFERENCE_QUESTIONS" PRIMARY KEY ("id")
      )
    `);
  }
}
