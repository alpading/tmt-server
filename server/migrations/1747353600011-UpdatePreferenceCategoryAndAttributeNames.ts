import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdatePreferenceCategoryAndAttributeNames1747353600011 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      UPDATE "preference_categories" SET "name" = '음식 취향'             WHERE "domain" = 'restaurant' AND "target_rating" = 'taste_rating'
    `);
    await queryRunner.query(`
      UPDATE "preference_categories" SET "name" = '공간 및 서비스 취향'   WHERE "domain" = 'restaurant' AND "target_rating" = 'space_rating'
    `);
    await queryRunner.query(`
      UPDATE "preference_categories" SET "name" = '분위기 및 공간 취향'   WHERE "domain" = 'stay'       AND "target_rating" = 'interior_rating'
    `);
    await queryRunner.query(`
      UPDATE "preference_categories" SET "name" = '이용환경 및 서비스 취향' WHERE "domain" = 'stay'      AND "target_rating" = 'clean_rating'
    `);

    await queryRunner.query(`
      UPDATE "attribute_mappings" SET "name" = '기름지고 느끼한'           WHERE "profile_col" = 'res_oily'
    `);
    await queryRunner.query(`
      UPDATE "attribute_mappings" SET "name" = '건강하고 담백한'           WHERE "profile_col" = 'res_mild'
    `);
    await queryRunner.query(`
      UPDATE "attribute_mappings" SET "name" = '달고 짠 자극적인'         WHERE "profile_col" = 'res_stim'
    `);
    await queryRunner.query(`
      UPDATE "attribute_mappings" SET "name" = '스트레스 풀리는 매운'     WHERE "profile_col" = 'res_spicy'
    `);
    await queryRunner.query(`
      UPDATE "attribute_mappings" SET "name" = '인테리어와 분위기가 좋은' WHERE "profile_col" = 'res_interior'
    `);
    await queryRunner.query(`
      UPDATE "attribute_mappings" SET "name" = '직원의 응대가 친절한'     WHERE "profile_col" = 'res_service'
    `);
    await queryRunner.query(`
      UPDATE "attribute_mappings" SET "name" = '소음이 없고 조용한'       WHERE "profile_col" = 'res_noise'
    `);
    await queryRunner.query(`
      UPDATE "attribute_mappings" SET "name" = '위생 및 청결 상태가 깔끔한' WHERE "profile_col" = 'res_clean'
    `);
    await queryRunner.query(`
      UPDATE "attribute_mappings" SET "name" = '주변 풍경이 좋은'         WHERE "profile_col" = 'stay_view'
    `);
    await queryRunner.query(`
      UPDATE "attribute_mappings" SET "name" = '인테리어와 분위기가 좋은' WHERE "profile_col" = 'stay_interior'
    `);
    await queryRunner.query(`
      UPDATE "attribute_mappings" SET "name" = '공간이 넓고 쾌적한'       WHERE "profile_col" = 'stay_space'
    `);
    await queryRunner.query(`
      UPDATE "attribute_mappings" SET "name" = '방음이 잘 되어 조용한'    WHERE "profile_col" = 'stay_noise'
    `);
    await queryRunner.query(`
      UPDATE "attribute_mappings" SET "name" = '청결 및 위생 관리가 잘 된' WHERE "profile_col" = 'stay_clean'
    `);
    await queryRunner.query(`
      UPDATE "attribute_mappings" SET "name" = '직원 응대 및 서비스가 좋은' WHERE "profile_col" = 'stay_service'
    `);
    await queryRunner.query(`
      UPDATE "attribute_mappings" SET "name" = '문화 / 전시'              WHERE "profile_col" = 'act_culture'
    `);
    await queryRunner.query(`
      UPDATE "attribute_mappings" SET "name" = '풍경 / 감상'              WHERE "profile_col" = 'act_view'
    `);
    await queryRunner.query(`
      UPDATE "attribute_mappings" SET "name" = '힐링 / 휴식'              WHERE "profile_col" = 'act_healing'
    `);
    await queryRunner.query(`
      UPDATE "attribute_mappings" SET "name" = '레저 / 액티비티'          WHERE "profile_col" = 'act_active'
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`UPDATE "preference_categories" SET "name" = '맛'              WHERE "domain" = 'restaurant' AND "target_rating" = 'taste_rating'`);
    await queryRunner.query(`UPDATE "preference_categories" SET "name" = '공간'            WHERE "domain" = 'restaurant' AND "target_rating" = 'space_rating'`);
    await queryRunner.query(`UPDATE "preference_categories" SET "name" = '인테리어 및 풍경' WHERE "domain" = 'stay'       AND "target_rating" = 'interior_rating'`);
    await queryRunner.query(`UPDATE "preference_categories" SET "name" = '쾌적도'          WHERE "domain" = 'stay'       AND "target_rating" = 'clean_rating'`);

    await queryRunner.query(`UPDATE "attribute_mappings" SET "name" = '느끼한'           WHERE "profile_col" = 'res_oily'`);
    await queryRunner.query(`UPDATE "attribute_mappings" SET "name" = '담백한'           WHERE "profile_col" = 'res_mild'`);
    await queryRunner.query(`UPDATE "attribute_mappings" SET "name" = '자극적인'         WHERE "profile_col" = 'res_stim'`);
    await queryRunner.query(`UPDATE "attribute_mappings" SET "name" = '매운'             WHERE "profile_col" = 'res_spicy'`);
    await queryRunner.query(`UPDATE "attribute_mappings" SET "name" = '인테리어'         WHERE "profile_col" = 'res_interior'`);
    await queryRunner.query(`UPDATE "attribute_mappings" SET "name" = '친절도'           WHERE "profile_col" = 'res_service'`);
    await queryRunner.query(`UPDATE "attribute_mappings" SET "name" = '소음'             WHERE "profile_col" = 'res_noise'`);
    await queryRunner.query(`UPDATE "attribute_mappings" SET "name" = '청결도'           WHERE "profile_col" = 'res_clean'`);
    await queryRunner.query(`UPDATE "attribute_mappings" SET "name" = '풍경'             WHERE "profile_col" = 'stay_view'`);
    await queryRunner.query(`UPDATE "attribute_mappings" SET "name" = '인테리어'         WHERE "profile_col" = 'stay_interior'`);
    await queryRunner.query(`UPDATE "attribute_mappings" SET "name" = '협소하지 않은 공간' WHERE "profile_col" = 'stay_space'`);
    await queryRunner.query(`UPDATE "attribute_mappings" SET "name" = '방음'             WHERE "profile_col" = 'stay_noise'`);
    await queryRunner.query(`UPDATE "attribute_mappings" SET "name" = '청결도'           WHERE "profile_col" = 'stay_clean'`);
    await queryRunner.query(`UPDATE "attribute_mappings" SET "name" = '친절도'           WHERE "profile_col" = 'stay_service'`);
    await queryRunner.query(`UPDATE "attribute_mappings" SET "name" = '문화, 전시'       WHERE "profile_col" = 'act_culture'`);
    await queryRunner.query(`UPDATE "attribute_mappings" SET "name" = '풍경, 감상'       WHERE "profile_col" = 'act_view'`);
    await queryRunner.query(`UPDATE "attribute_mappings" SET "name" = '힐링, 휴식'       WHERE "profile_col" = 'act_healing'`);
    await queryRunner.query(`UPDATE "attribute_mappings" SET "name" = '활동, 경험'       WHERE "profile_col" = 'act_active'`);
  }
}
