import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddQuestionColsToPreferences1747353600043 implements MigrationInterface {
  public async up(qr: QueryRunner): Promise<void> {
    // 기존 preferences 테이블에 질문 텍스트 + 선택지 컬럼 추가
    await qr.query(`
      ALTER TABLE preferences
        ADD COLUMN question_text TEXT,
        ADD COLUMN option_high   VARCHAR(40),
        ADD COLUMN option_mid    VARCHAR(40),
        ADD COLUMN option_low    VARCHAR(40);
    `);

    // 기존 id 1-18 행에 질문/선택지 데이터 채우기
    const data: { id: number; q: string; high: string; mid: string; low: string }[] = [
      { id:  1, q: '기름지고 느끼한 음식을 즐기나요?',                                                              high: '매우 그렇다',  mid: '보통이다', low: '전혀 아니다' },
      { id:  2, q: '건강하고 담백한 음식을 즐기나요?',                                                              high: '매우 그렇다',  mid: '보통이다', low: '전혀 아니다' },
      { id:  3, q: '달고 짠 맛이 강한 자극적인 음식을 즐기나요?',                                                   high: '매우 그렇다',  mid: '보통이다', low: '전혀 아니다' },
      { id:  4, q: '매운 음식을 적극적으로 찾아 즐기시나요?',                                                       high: '매우 그렇다',  mid: '보통이다', low: '전혀 아니다' },
      { id:  5, q: '식당의 인테리어(분위기)가 마음에 들면, 다른 조건이 조금 아쉬워도 방문할 의향이 있나요?',        high: '매우 그렇다',  mid: '보통이다', low: '전혀 아니다' },
      { id:  6, q: '직원의 응대가 불친절하면, 음식이 좋아도 다른 식당을 선택하는 편인가요?',                        high: '매우 그렇다',  mid: '보통이다', low: '전혀 아니다' },
      { id:  7, q: '식당이 시끄러우면 다른 곳을 선택할 정도로 중요한가요?',                                         high: '매우 중요하다', mid: '보통이다', low: '전혀 중요하지 않다' },
      { id:  8, q: '식당의 청결 상태가 기준에 미치지 않으면 방문을 포기할 정도로 중요한가요?',                       high: '매우 중요하다', mid: '보통이다', low: '전혀 중요하지 않다' },
      { id:  9, q: '숙소 주변 풍경(뷰)이 좋지 않으면, 다른 조건이 좋아도 선택을 피하는 편인가요?',                  high: '매우 그렇다',  mid: '보통이다', low: '전혀 아니다' },
      { id: 10, q: '숙소의 인테리어(분위기)가 좋지 않으면, 다른 조건이 좋아도 선택을 피하는 편인가요?',             high: '매우 그렇다',  mid: '보통이다', low: '전혀 아니다' },
      { id: 11, q: '숙소 공간이 좁거나 답답하게 느껴지면, 다른 조건이 좋아도 선택을 피하는 편인가요?',              high: '매우 그렇다',  mid: '보통이다', low: '전혀 아니다' },
      { id: 12, q: '숙소의 방음이 좋지 않으면, 수면이나 휴식에 방해를 받을 정도로 중요한 요소인가요?',              high: '매우 중요하다', mid: '보통이다', low: '전혀 중요하지 않다' },
      { id: 13, q: '숙소의 청결 상태가 기준에 미치지 않으면, 다른 조건이 좋아도 선택을 피하는 편인가요?',           high: '매우 그렇다',  mid: '보통이다', low: '전혀 아니다' },
      { id: 14, q: '직원의 응대가 좋지 않으면, 다른 조건이 좋아도 선택을 피하는 편인가요?',                         high: '매우 그렇다',  mid: '보통이다', low: '전혀 아니다' },
      { id: 15, q: '여행을 할 때 미술관, 전시, 공연 등 문화/전시형 여행지가 필수인가요?',                           high: '필요하다',    mid: '보통이다', low: '필요 없다' },
      { id: 16, q: '여행을 할 때 바다, 산, 숲, 야경 명소 등 풍경 감상형 여행지가 필수인가요?',                      high: '필요하다',    mid: '보통이다', low: '필요 없다' },
      { id: 17, q: '여행을 할 때 카페, 산책, 스파 등 힐링/휴식형 여행지가 필수인가요?',                             high: '필요하다',    mid: '보통이다', low: '필요 없다' },
      { id: 18, q: '여행을 할 때 등산, 서핑, 스키, 놀이기구 등 활동형 여행지가 필수인가요?',                        high: '필요하다',    mid: '보통이다', low: '필요 없다' },
    ];

    for (const row of data) {
      await qr.query(
        `UPDATE preferences SET question_text=$1, option_high=$2, option_mid=$3, option_low=$4 WHERE id=$5`,
        [row.q, row.high, row.mid, row.low, row.id],
      );
    }
  }

  public async down(qr: QueryRunner): Promise<void> {
    await qr.query(`
      ALTER TABLE preferences
        DROP COLUMN IF EXISTS question_text,
        DROP COLUMN IF EXISTS option_high,
        DROP COLUMN IF EXISTS option_mid,
        DROP COLUMN IF EXISTS option_low;
    `);
  }
}
