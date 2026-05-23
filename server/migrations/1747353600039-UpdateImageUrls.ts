import { MigrationInterface, QueryRunner } from 'typeorm';

const BASE = 'https://tmt-gyeongju.s3.ap-northeast-2.amazonaws.com';

export class UpdateImageUrls1747353600039 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {

    // ── Activities ────────────────────────────────────────────────────────
    const activities: [string, string][] = [
      ['785809390',  'jpg'], // No Words
      ['20091286',   'jpg'], // 강동워터파크
      ['15772342',   'jpg'], // 감은사지
      ['19816000',   'jpg'], // 계림
      ['13491270',   'jpg'], // 대릉원
      ['34666089',   'jpg'], // 경주레저
      ['1136426828', 'jpg'], // 경주루지월드
      ['13491217',   'jpg'], // 문무대왕릉
      ['12765760',   'jpg'], // 양동마을
      ['15754062',   'png'], // 경주엑스포공원
      ['20098998',   'jpg'], // 오릉
      ['12095305',   'png'], // 경주월드
      ['1529724953', 'jpg'], // 경주 패러글라이딩
      ['11620556',   'jpg'], // 국립경주박물관
      ['1285482977', 'jpg'], // 대릉한복
      ['11725672',   'png'], // 대산도예
      ['13490982',   'jpg'], // 동궁과월지
      ['463923897',  'jpg'], // 또봇 정크아트뮤지엄
      ['1192158980', 'jpg'], // 르씨엘
      ['2023957955', 'jpg'], // 명퉤 경주플래그십스토어
      ['1158250968', 'jpg'], // 바실라
      ['13491589',   'jpg'], // 보문호
      ['11663970',   'jpg'], // 분황사
      ['11663971',   'jpg'], // 불국사
      ['1039669880', 'jpg'], // 빈티지샵 말퀴리
      ['11663972',   'jpg'], // 석굴암
      ['2026956916', 'jpg'], // 세컨드빈티지
      ['1637133406', 'jpg'], // 아라카페
      ['1420649242', 'jpg'], // 아로마
      ['13101807',   'jpg'], // 옥산서원
      ['38674036',   'jpg'], // 이재원과자공방
      ['13491802',   'jpg'], // 첨성대
      ['37755924',   'jpg'], // 키덜트뮤지엄
      ['20095496',   'jpg'], // 통일전
      ['11828149',   'jpg'], // 포석정
      ['1096043506', 'jpg'], // 헬로리로
      ['13351607',   'jpg'], // 황성공원
      ['1008616984', 'jpg'], // 후프후프
    ];

    for (const [id, ext] of activities) {
      await queryRunner.query(
        `UPDATE "activities" SET image_url = $1 WHERE naver_place_id = $2`,
        [`${BASE}/activities/${id}.${ext}`, id],
      );
    }

    // ── Restaurants ───────────────────────────────────────────────────────
    const restaurants: [string, string][] = [
      ['38279045',    'jpg'], // 987피자
      ['21701372',    'jpg'], // 교리김밥 본점
      ['1385214649',  'jpg'], // 대화만두 황리단점
      ['1537062099',  'jpg'], // 덕클 황리단길점
      ['1614701657',  'jpg'], // 료미
      ['2065990534',  'jpg'], // 맥반
      ['1803011937',  'jpg'], // 박신우제면소
      ['1850467174',  'jpg'], // 벚꽃, 한잔
      ['1306682069',  'jpg'], // 보문갈비
      ['1752405772',  'jpg'], // 수석정
      ['1183977881',  'jpg'], // 시즈닝
      ['2030007425',  'jpg'], // 신라제면 경주황리단길점
      ['1505892139',  'jpg'], // 요석궁
      ['15742693',    'jpg'], // 정록쌈밥
      ['1900502536',  'jpg'], // 천마 맷돌순두부
      ['1335800249',  'png'], // 청온채
      ['1196479801',  'jpg'], // 포석로 소갈비찜
      ['1937464680',  'png'], // 황남양옥
    ];

    for (const [id, ext] of restaurants) {
      await queryRunner.query(
        `UPDATE "restaurants" SET image_url = $1 WHERE naver_place_id = $2`,
        [`${BASE}/restaurants/${id}.${ext}`, id],
      );
    }

    // ── Stays ─────────────────────────────────────────────────────────────
    const stays: string[] = [
      '11728066',   // 힐튼호텔경주
      '11609515',   // 라한셀렉트경주
      '12899202',   // 더케이호텔경주
      '11658829',   // 코오롱호텔경주
      '12934753',   // 발렌타인호텔
      '11797085',   // 경주 베니키아 스위스로젠호텔
      '11386454',   // 일성리조트 경주보문
      '1736329630', // 만수
      '1264952218', // 경주교동한옥집
      '132563442',  // 기림사템플스테이
      '1540977096', // 월정헌
      '1803909285', // 황리단길스테이
      '1110136938', // 경주시티호텔
      '1414207876', // 애견풀빌라 포레스트258
      '1927958707', // 라온채
      '1402810575', // 실라마실풀빌라
      '35150031',   // 별빛마루글램핑펜션
      '2024278058', // 인디에어 글램핑
      '1121487897', // 경주한옥숙소 서악다움
      '2041034954', // 온이네민박
      '1622980709', // 에스앤비 풀빌라
      '1422196607', // 고대안풀빌라펜션
      '1579761664', // 글램독 애견펜션 경주점
      '1593058332', // 키녹 경주
    ];

    for (const id of stays) {
      await queryRunner.query(
        `UPDATE "stays" SET image_url = $1 WHERE naver_place_id = $2`,
        [`${BASE}/stays/${id}.jpg`, id],
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`UPDATE "activities"  SET image_url = ''`);
    await queryRunner.query(`UPDATE "restaurants" SET image_url = ''`);
    await queryRunner.query(`UPDATE "stays"       SET image_url = ''`);
  }
}
