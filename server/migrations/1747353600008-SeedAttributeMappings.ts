import { MigrationInterface, QueryRunner } from 'typeorm';

// preference_category_id 기준 (SeedPreferenceCategories 순서)
// 1: 맛 (restaurant)
// 2: 공간 (restaurant)
// 3: null (activity)
// 4: 인테리어 및 풍경 (stay)
// 5: 쾌적도 (stay)
export class SeedAttributeMappings1747353600008 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO "attribute_mappings" ("preference_category_id", "name", "profile_col", "snapshot_col") VALUES
        (1, '느끼한',          'res_oily',     'res_oily_snap'),
        (1, '담백한',          'res_mild',     'res_mild_snap'),
        (1, '자극적인',        'res_stim',     'res_stim_snap'),
        (1, '매운',            'res_spicy',    'res_spicy_snap'),
        (2, '인테리어',        'res_interior', 'res_interior_snap'),
        (2, '친절도',          'res_service',  'res_service_snap'),
        (2, '소음',            'res_noise',    'res_noise_snap'),
        (2, '청결도',          'res_clean',    'res_clean_snap'),
        (4, '풍경',            'stay_view',    'stay_view_snap'),
        (4, '인테리어',        'stay_interior','stay_interior_snap'),
        (4, '협소하지 않은 공간', 'stay_space', 'stay_space_snap'),
        (5, '방음',            'stay_noise',   'stay_noise_snap'),
        (5, '청결도',          'stay_clean',   'stay_clean_snap'),
        (5, '친절도',          'stay_service', 'stay_service_snap'),
        (3, '문화, 전시',      'act_culture',  'act_culture_snap'),
        (3, '풍경, 감상',      'act_view',     'act_view_snap'),
        (3, '힐링, 휴식',      'act_healing',  'act_healing_snap'),
        (3, '활동, 경험',      'act_active',   'act_active_snap')
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "attribute_mappings"`);
    await queryRunner.query(`ALTER SEQUENCE attribute_mappings_id_seq RESTART WITH 1`);
  }
}
