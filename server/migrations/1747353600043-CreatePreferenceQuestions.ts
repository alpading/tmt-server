import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePreferenceQuestions1747353600043 implements MigrationInterface {
  public async up(qr: QueryRunner): Promise<void> {
    await qr.query(`
      CREATE TABLE preference_questions (
        id            SERIAL PRIMARY KEY,
        section_title VARCHAR(50)  NOT NULL,
        section_order SMALLINT    NOT NULL,
        disp_order    SMALLINT    NOT NULL,
        question_text TEXT        NOT NULL,
        pref_key      VARCHAR(30) NOT NULL,
        option_high   VARCHAR(40) NOT NULL,
        option_mid    VARCHAR(40) NOT NULL,
        option_low    VARCHAR(40) NOT NULL
      );
    `);

    await qr.query(`
      INSERT INTO preference_questions
        (section_title, section_order, disp_order, question_text, pref_key, option_high, option_mid, option_low)
      VALUES
        -- 식당 취향 (section_order=1)
        ('식당 취향 질문', 1, 1, '기름지고 느끼한 음식을 즐기나요?',                                                              'resOily',     '매우 그렇다', '보통이다', '전혀 아니다'),
        ('식당 취향 질문', 1, 2, '건강하고 담백한 음식을 즐기나요?',                                                              'resMild',     '매우 그렇다', '보통이다', '전혀 아니다'),
        ('식당 취향 질문', 1, 3, '달고 짠 맛이 강한 자극적인 음식을 즐기나요?',                                                   'resStim',     '매우 그렇다', '보통이다', '전혀 아니다'),
        ('식당 취향 질문', 1, 4, '매운 음식을 적극적으로 찾아 즐기시나요?',                                                       'resSpicy',    '매우 그렇다', '보통이다', '전혀 아니다'),
        ('식당 취향 질문', 1, 5, '식당이 시끄러우면 다른 곳을 선택할 정도로 중요한가요?',                                         'resNoise',    '매우 중요하다', '보통이다', '전혀 중요하지 않다'),
        ('식당 취향 질문', 1, 6, '식당의 청결 상태가 기준에 미치지 않으면 방문을 포기할 정도로 중요한가요?',                       'resClean',    '매우 중요하다', '보통이다', '전혀 중요하지 않다'),
        ('식당 취향 질문', 1, 7, '식당의 인테리어(분위기)가 마음에 들면, 다른 조건이 조금 아쉬워도 방문할 의향이 있나요?',        'resInterior', '매우 그렇다', '보통이다', '전혀 아니다'),
        ('식당 취향 질문', 1, 8, '직원의 응대가 불친절하면, 음식이 좋아도 다른 식당을 선택하는 편인가요?',                        'resService',  '매우 그렇다', '보통이다', '전혀 아니다'),
        -- 숙소 취향 (section_order=2)
        ('숙소 취향 질문', 2, 1, '숙소 주변 풍경(뷰)이 좋지 않으면, 다른 조건이 좋아도 선택을 피하는 편인가요?',                  'stayView',     '매우 그렇다', '보통이다', '전혀 아니다'),
        ('숙소 취향 질문', 2, 2, '숙소의 인테리어(분위기)가 좋지 않으면, 다른 조건이 좋아도 선택을 피하는 편인가요?',             'stayInterior', '매우 그렇다', '보통이다', '전혀 아니다'),
        ('숙소 취향 질문', 2, 3, '숙소 공간이 좁거나 답답하게 느껴지면, 다른 조건이 좋아도 선택을 피하는 편인가요?',              'staySpace',    '매우 그렇다', '보통이다', '전혀 아니다'),
        ('숙소 취향 질문', 2, 4, '숙소의 방음이 좋지 않으면, 수면이나 휴식에 방해를 받을 정도로 중요한 요소인가요?',              'stayNoise',    '매우 중요하다', '보통이다', '전혀 중요하지 않다'),
        ('숙소 취향 질문', 2, 5, '숙소의 청결 상태가 기준에 미치지 않으면, 다른 조건이 좋아도 선택을 피하는 편인가요?',           'stayClean',    '매우 그렇다', '보통이다', '전혀 아니다'),
        ('숙소 취향 질문', 2, 6, '직원의 응대가 좋지 않으면, 다른 조건이 좋아도 선택을 피하는 편인가요?',                         'stayService',  '매우 그렇다', '보통이다', '전혀 아니다'),
        -- 액티비티 취향 (section_order=3)
        ('액티비티 취향 질문', 3, 1, '여행을 할 때 미술관, 전시, 공연 등 문화/전시형 여행지가 필수인가요?',                         'actCulture', '필요하다', '보통이다', '필요 없다'),
        ('액티비티 취향 질문', 3, 2, '여행을 할 때 바다, 산, 숲, 야경 명소 등 풍경 감상형 여행지가 필수인가요?',                    'actView',    '필요하다', '보통이다', '필요 없다'),
        ('액티비티 취향 질문', 3, 3, '여행을 할 때 카페, 산책, 스파 등 힐링/휴식형 여행지가 필수인가요?',                          'actHealing', '필요하다', '보통이다', '필요 없다'),
        ('액티비티 취향 질문', 3, 4, '여행을 할 때 등산, 서핑, 스키, 놀이기구 등 활동형 여행지가 필수인가요?',                     'actActive',  '필요하다', '보통이다', '필요 없다');
    `);
  }

  public async down(qr: QueryRunner): Promise<void> {
    await qr.query(`DROP TABLE IF EXISTS preference_questions;`);
  }
}
