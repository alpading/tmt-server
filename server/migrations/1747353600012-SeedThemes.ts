import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedThemes1747353600012 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO "theme" ("name", "description", "image_url") VALUES
        ('스릴만점 액티비티 여행',           '짜릿한 레저와 액티비티로 가득한 여행',       'https://placeholder.com/themes/1.jpg'),
        ('인스타 감성가득 핫플레이스',        '감각적인 인테리어와 뷰 맛집 모음',           'https://placeholder.com/themes/2.jpg'),
        ('당신의 입맛에 맞춘 식도락 여행',    '내 식성에 딱 맞는 맛집 탐방',               'https://placeholder.com/themes/3.jpg'),
        ('지친 당신을 위한 감성 힐링 여행',   '편안하고 여유로운 힐링 여행',               'https://placeholder.com/themes/4.jpg'),
        ('지갑은 가볍지만 경험은 무거운 여행', '가성비 최고의 알찬 여행',                   'https://placeholder.com/themes/5.jpg'),
        ('부모님과 함께하는 효도 여행',       '부모님과 함께하는 편안한 여행',             'https://placeholder.com/themes/6.jpg'),
        ('여행에서만큼은 FLEX',               '럭셔리하게 즐기는 프리미엄 여행',           'https://placeholder.com/themes/7.jpg'),
        ('{MBTI} 맞춤 여행',                 '나와 같은 MBTI 유저들이 사랑한 여행지',      'https://placeholder.com/themes/8.jpg'),
        ('에스트로겐 듬뿍! 여행',             '에겐 성향 유저들이 사랑한 여행지',          'https://placeholder.com/themes/9.jpg'),
        ('테스토르테론 듬뿍! 여행',           '테토 성향 유저들이 사랑한 여행지',          'https://placeholder.com/themes/10.jpg'),
        ('아이와 함께해요',                   '아이와 함께하는 가족 친화 여행',            'https://placeholder.com/themes/11.jpg'),
        ('멍멍이와 함께해요',                 '반려견과 함께하는 펫 프렌들리 여행',        'https://placeholder.com/themes/12.jpg'),
        ('2,30대가 좋아한 MZ 여행',           '2030 세대가 선택한 트렌디한 여행',          'https://placeholder.com/themes/13.jpg')
    `);

    // theme_mappings: snap 조건이 있는 테마만 (preference_id = attribute_mappings.id, target_val = 최소 snap값)
    await queryRunner.query(`
      INSERT INTO "theme_mappings" ("theme_id", "preference_id", "target_val") VALUES
        -- 스릴만점 액티비티 여행 (id=1)
        (1, 18, 3),   -- act_active_snap >= 3

        -- 인스타 감성가득 핫플레이스 (id=2)
        (2,  5, 3),   -- res_interior_snap >= 3
        (2,  9, 2),   -- stay_view_snap >= 2
        (2, 10, 2),   -- stay_interior_snap >= 2
        (2, 16, 3),   -- act_view_snap >= 3

        -- 지친 당신을 위한 감성 힐링 여행 (id=4)
        (4,  5, 2),   -- res_interior_snap >= 2
        (4,  6, 2),   -- res_service_snap >= 2
        (4,  9, 2),   -- stay_view_snap >= 2
        (4, 10, 2),   -- stay_interior_snap >= 2
        (4, 12, 2),   -- stay_noise_snap >= 2
        (4, 16, 2),   -- act_view_snap >= 2
        (4, 17, 2),   -- act_healing_snap >= 2

        -- 부모님과 함께하는 효도 여행 (id=6)
        (6,  2, 2),   -- res_mild_snap >= 2
        (6,  6, 2),   -- res_service_snap >= 2
        (6,  9, 3),   -- stay_view_snap >= 3
        (6, 16, 2),   -- act_view_snap >= 2
        (6, 17, 2)    -- act_healing_snap >= 2
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "theme_mappings"`);
    await queryRunner.query(`ALTER SEQUENCE theme_mappings_id_seq RESTART WITH 1`);
    await queryRunner.query(`DELETE FROM "theme"`);
    await queryRunner.query(`ALTER SEQUENCE theme_id_seq RESTART WITH 1`);
  }
}
