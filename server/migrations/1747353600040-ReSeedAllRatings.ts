import { MigrationInterface, QueryRunner } from 'typeorm';

// Restaurant characteristics [oily, mild, clean, stim, spicy, noise, interior, service]
const RC: Record<string, [number,number,number,number,number,number,number,number]> = {
  '1505892139': [1,3,3,1,1,1,3,3], // 요석궁 - 담백/고급
  '15742693':   [2,1,2,3,2,3,2,2], // 정록쌈밥 - 자극/시끄러움
  '1937464680': [2,1,2,3,2,2,3,2], // 황남양옥 - 자극/인테리어
  '1196479801': [2,1,2,3,2,2,3,2], // 포석로 소갈비찜 - 자극/인테리어
  '1900502536': [1,1,2,3,3,2,3,2], // 천마 맷돌순두부 - 자극/매운/인테리어
  '21701372':   [1,3,2,1,1,2,2,2], // 교리김밥 본점 - 담백
  '1385214649': [2,2,2,2,2,2,2,2], // 대화만두 황리단점 - 균형
  '1803011937': [1,3,3,1,1,1,2,2], // 박신우제면소 - 담백/가성비
  '1183977881': [3,1,2,2,1,2,3,2], // 시즈닝 - 느끼/인테리어
  '2065990534': [1,3,3,1,1,2,2,2], // 맥반 - 담백
  '1752405772': [1,3,3,1,1,1,2,3], // 수석정 - 담백/고급
  '1850467174': [2,1,2,3,2,3,3,2], // 벚꽃, 한잔 - 자극/활기
  '1614701657': [1,3,3,1,1,1,3,3], // 료미 - 담백/고급인테리어
  '2030007425': [1,1,2,3,3,2,2,2], // 신라제면 - 자극/매운
  '38279045':   [3,1,2,2,1,3,2,2], // 987피자 - 느끼
  '1335800249': [2,1,2,3,2,2,2,2], // 청온채 - 자극
  '1537062099': [2,1,1,3,2,3,2,2], // 덕클 황리단길점 - 자극
  '15246170':   [1,3,3,1,1,2,2,2], // 궁상각치우 - 담백
  '1306682069': [3,1,2,3,2,3,2,2], // 보문갈비 - 기름/자극
  '1493326356': [2,2,2,2,2,2,2,2], // 화양연화 - 중립
};

const RES_PRICE: Record<string, [number, number]> = {
  '1505892139': [40000, 70000],
  '15742693':   [12000, 20000],
  '1937464680': [7000,  12000],
  '1196479801': [30000, 50000],
  '1900502536': [10000, 15000],
  '21701372':   [4000,   8000],
  '1385214649': [8000,  12000],
  '1803011937': [10000, 15000],
  '1183977881': [20000, 35000],
  '2065990534': [15000, 25000],
  '1752405772': [20000, 30000],
  '1850467174': [15000, 25000],
  '1614701657': [25000, 40000],
  '2030007425': [10000, 15000],
  '38279045':   [15000, 22000],
  '1335800249': [30000, 50000],
  '1537062099': [12000, 20000],
  '15246170':   [10000, 18000],
  '1306682069': [25000, 40000],
  '1493326356': [15000, 25000],
};

// Stay characteristics [view, interior, space, noise, clean, service]
const SC: Record<string, [number,number,number,number,number,number]> = {
  '11728066':   [3,3,3,1,3,3], // 힐튼호텔경주
  '11609515':   [3,3,2,1,3,3], // 라한셀렉트경주
  '12899202':   [2,3,3,1,3,3], // 더케이호텔경주
  '11658829':   [3,2,2,1,2,3], // 코오롱호텔경주
  '12934753':   [2,2,3,2,2,2], // 발렌타인호텔
  '11797085':   [2,2,2,1,3,2], // 경주 베니키아 스위스로젠호텔
  '11386454':   [3,2,3,2,2,2], // 일성리조트 경주보문
  '1736329630': [3,3,2,1,2,2], // 만수
  '1264952218': [2,3,3,1,2,2], // 경주교동한옥집
  '132563442':  [3,2,2,1,3,2], // 기림사템플스테이
  '1540977096': [3,3,3,1,3,3], // 월정헌
  '1803909285': [2,3,3,2,2,2], // 황리단길스테이
  '1110136938': [1,2,2,2,3,2], // 경주시티호텔
  '1414207876': [3,3,3,2,2,2], // 애견풀빌라 포레스트258
  '1927958707': [3,3,2,1,2,2], // 라온채
  '1402810575': [2,3,3,1,3,2], // 실라마실풀빌라
  '35150031':   [3,2,2,2,2,1], // 별빛마루글램핑펜션
  '2024278058': [3,2,3,2,2,1], // 인디에어 글램핑
  '1121487897': [3,3,2,1,3,2], // 경주한옥숙소 서악다움
  '2041034954': [1,3,2,2,2,2], // 온이네민박
  '1622980709': [2,3,3,1,3,2], // 에스앤비 풀빌라
  '1422196607': [2,3,3,1,2,2], // 고대안풀빌라펜션
  '1579761664': [2,2,3,2,3,2], // 글램독 애견펜션 경주점
  '1593058332': [2,3,2,1,2,3], // 키녹 경주
};

const STAY_PRICE: Record<string, [number, number]> = {
  '11728066':   [250000, 400000],
  '11609515':   [200000, 350000],
  '12899202':   [120000, 200000],
  '11658829':   [180000, 300000],
  '12934753':   [80000,  130000],
  '11797085':   [80000,  120000],
  '11386454':   [150000, 250000],
  '1736329630': [150000, 250000],
  '1264952218': [80000,  150000],
  '132563442':  [50000,   80000],
  '1540977096': [150000, 250000],
  '1803909285': [50000,   80000],
  '1110136938': [60000,   90000],
  '1414207876': [200000, 350000],
  '1927958707': [150000, 250000],
  '1402810575': [180000, 300000],
  '35150031':   [80000,  130000],
  '2024278058': [80000,  130000],
  '1121487897': [100000, 180000],
  '2041034954': [40000,   70000],
  '1622980709': [250000, 400000],
  '1422196607': [200000, 350000],
  '1579761664': [120000, 200000],
  '1593058332': [200000, 350000],
};

// Activity characteristics [culture, view, healing, active]
const AC: Record<string, [number,number,number,number]> = {
  '11663971':   [1,3,2,1], // 불국사 - 풍경
  '11663972':   [1,3,2,1], // 석굴암 - 풍경
  '11620556':   [3,1,2,1], // 국립경주박물관 - 문화
  '13491802':   [2,3,2,1], // 첨성대 - 풍경
  '13490982':   [2,3,2,1], // 동궁과월지 - 풍경
  '13491270':   [1,2,3,1], // 대릉원 - 힐링
  '12095305':   [1,1,1,3], // 경주월드 - 레저
  '13491589':   [1,2,3,1], // 보문호 - 힐링
  '13491217':   [1,2,3,1], // 문무대왕릉 - 힐링
  '20098998':   [1,2,3,1], // 오릉 - 힐링
  '11828149':   [1,3,2,1], // 포석정 - 풍경
  '15754062':   [2,2,1,3], // 경주엑스포공원 - 레저
  '15772342':   [1,2,3,1], // 감은사지 - 힐링
  '11663970':   [1,3,2,1], // 분황사 - 풍경
  '12765760':   [1,2,3,1], // 양동마을 - 힐링
  '13101807':   [1,2,3,1], // 옥산서원 - 힐링
  '19816000':   [1,3,2,1], // 계림 - 풍경
  '20095496':   [1,3,2,1], // 통일전 - 풍경
  '1285482977': [1,2,1,3], // 대릉한복 - 레저/쇼핑
  '11725672':   [3,1,2,1], // 대산도예 - 문화
  '38674036':   [2,2,3,1], // 이재원과자공방 - 힐링
  '785809390':  [1,2,3,1], // No Words - 힐링
  '1136426828': [1,1,1,3], // 경주루지월드 - 레저
  '20091286':   [1,1,1,3], // 강동워터파크 - 레저
  '37755924':   [3,1,2,1], // 키덜트뮤지엄 - 문화
  '34666089':   [1,1,1,3], // 경주레저 - 레저
  '1529724953': [1,1,1,3], // 경주패러글라이딩 - 레저
  '463923897':  [3,1,2,1], // 또봇 정크아트뮤지엄 - 문화
  '13351607':   [1,2,3,1], // 황성공원 - 힐링
  '38630852':   [3,1,2,1], // 경주세계자동차박물관 - 문화
  '75112495':   [3,1,2,1], // 황룡사역사문화관 - 문화
  '13529857':   [3,1,2,1], // 경주예술의전당 - 문화
  '1158250968': [1,2,3,1], // 바실라 - 힐링(카페)
  '1637133406': [1,3,2,1], // 아라카페 - 풍경
  '1008616984': [1,2,3,1], // 후프후프 - 힐링
  '1192158980': [1,3,2,1], // 르씨엘 - 풍경
  '2023957955': [1,2,1,3], // 명퉤 경주플래그십스토어 - 쇼핑
  '2026956916': [1,2,1,3], // 세컨드빈티지 - 쇼핑
  '1096043506': [1,2,2,2], // 헬로리로 - 쇼핑
  '1420649242': [1,2,3,1], // 아로마 - 힐링
  '1039669880': [1,2,1,3], // 빈티지샵 말퀴리 - 쇼핑
};

// TETO-preferred / EGEN-preferred activities (naver_place_id)
const TETO_ACTS = new Set([
  '11663971',  // 불국사
  '13491270',  // 대릉원
  '12095305',  // 경주월드
  '13491217',  // 문무대왕릉
  '20098998',  // 오릉
  '1136426828',// 경주루지월드
  '34666089',  // 경주레저
  '1529724953',// 경주패러글라이딩
  '1008616984',// 후프후프
  '1039669880',// 빈티지샵 말퀴리
]);
const EGEN_ACTS = new Set([
  '11663972',  // 석굴암
  '11620556',  // 국립경주박물관
  '13491802',  // 첨성대
  '13490982',  // 동궁과월지
  '13491589',  // 보문호
  '11828149',  // 포석정
  '15772342',  // 감은사지
  '11725672',  // 대산도예
  '38674036',  // 이재원과자공방
  '463923897', // 또봇 정크아트뮤지엄
  '1158250968',// 바실라
  '2023957955',// 명퉤 경주플래그십스토어
  '2026956916',// 세컨드빈티지
  '1096043506',// 헬로리로
  '1420649242',// 아로마
]);

// MBTI-specific activity preferences
const MBTI_ACT: Record<string, string> = {
  '11663971':   'ESTP', // 불국사
  '12095305':   'ESFP', // 경주월드
  '13491802':   'INFP', // 첨성대
  '13101807':   'ISFJ', // 옥산서원
  '1285482977': 'ENFP', // 대릉한복
  '1039669880': 'ENFP', // 빈티지샵 말퀴리
  '1136426828': 'ESTJ', // 경주루지월드
  '463923897':  'INTP', // 또봇 정크아트뮤지엄
  '1096043506': 'INFJ', // 헬로리로
  '1420649242': 'ISTJ', // 아로마
};

// Restaurant age bias: 'young' → younger users prefer, 'old' → older users prefer
const RES_AGE: Record<string, 'young' | 'old'> = {
  '1183977881': 'young', // 시즈닝
  '1850467174': 'young', // 벚꽃, 한잔
  '1614701657': 'young', // 료미
  '38279045':   'young', // 987피자
  '1505892139': 'old',   // 요석궁
  '15742693':   'old',   // 정록쌈밥
  '1937464680': 'old',   // 황남양옥
};

export class ReSeedAllRatings1747353600040 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {

    // ── 1. 기존 seed 리뷰 전부 삭제 ────────────────────────────────────────
    await queryRunner.query(
      `DELETE FROM activity_ratings  WHERE user_id IN (SELECT id FROM users WHERE login_id LIKE 'user%')`,
    );
    await queryRunner.query(
      `DELETE FROM stay_ratings      WHERE user_id IN (SELECT id FROM users WHERE login_id LIKE 'user%')`,
    );
    await queryRunner.query(
      `DELETE FROM restaurant_ratings WHERE user_id IN (SELECT id FROM users WHERE login_id LIKE 'user%')`,
    );

    // ── 2. 유저 조회 ─────────────────────────────────────────────────────
    const users: any[] = await queryRunner.query(`
      SELECT u.id, u.mbti, u.hormone, u.birth_date,
        up.res_oily, up.res_mild, up.res_clean, up.res_stim, up.res_spicy,
        up.res_noise, up.res_interior, up.res_service,
        up.stay_view, up.stay_interior, up.stay_space, up.stay_noise,
        up.stay_clean, up.stay_service,
        up.act_culture, up.act_view, up.act_healing, up.act_active
      FROM users u
      JOIN user_preferences up ON up.user_id = u.id
      WHERE u.login_id LIKE 'user%'
      ORDER BY u.id
    `);

    // ── 3. 장소 조회 ──────────────────────────────────────────────────────
    const restaurants: any[] = await queryRunner.query(
      `SELECT id, naver_place_id FROM restaurants WHERE deleted_at IS NULL`,
    );
    const stays: any[] = await queryRunner.query(
      `SELECT id, naver_place_id FROM stays WHERE deleted_at IS NULL`,
    );
    const activities: any[] = await queryRunner.query(
      `SELECT id, naver_place_id FROM activities WHERE deleted_at IS NULL`,
    );

    // ── 4. 헬퍼 함수 ──────────────────────────────────────────────────────
    const det = (a: number, b: number): number =>
      (((a * 31 + b * 37 + a * b * 7) % 9) + 9) % 9;
    const noise = (uid: number, pid: number, salt: number): number =>
      (det(uid + salt * 17, pid + salt * 11) - 4) * 0.1;
    const matchScore = (chars: number[], prefs: number[], scale: number): number =>
      chars.reduce((sum, c, i) => sum + (c - 2) * (prefs[i] - 2) * scale, 0);
    const rating = (v: number): number =>
      Math.max(2.0, Math.min(5.0, Math.round(v * 2) / 2));

    const resVals:  string[] = [];
    const stayVals: string[] = [];
    const actVals:  string[] = [];

    // ── 5. 메인 루프 ──────────────────────────────────────────────────────
    for (const u of users) {
      const uid       = Number(u.id);
      const mbti      = u.mbti  as string;
      const hormone   = u.hormone as string;
      const birthYear = new Date(u.birth_date).getFullYear();
      const isYoung   = birthYear >= 1995; // ~31세 이하
      const isOld     = birthYear <= 1986; // ~40세 이상
      const isTeto    = hormone === 'TETO';
      const isEgen    = hormone === 'EGEN';

      const rP = [
        Number(u.res_oily), Number(u.res_mild), Number(u.res_clean), Number(u.res_stim),
        Number(u.res_spicy), Number(u.res_noise), Number(u.res_interior), Number(u.res_service),
      ];
      const sP = [
        Number(u.stay_view), Number(u.stay_interior), Number(u.stay_space),
        Number(u.stay_noise), Number(u.stay_clean), Number(u.stay_service),
      ];
      const aP = [
        Number(u.act_culture), Number(u.act_view), Number(u.act_healing), Number(u.act_active),
      ];

      // ── 식당 ─────────────────────────────────────────────────────────────
      for (const r of restaurants) {
        const pid   = r.naver_place_id as string;
        const rid   = Number(r.id);
        const chars = RC[pid];
        if (!chars) continue;

        const price   = RES_PRICE[pid] ?? [10000, 20000];
        const ageType = RES_AGE[pid];
        const ageBias = ageType === 'young'
          ? (isYoung ? 0.3 : isOld ? -0.3 : 0)
          : ageType === 'old'
          ? (isOld ? 0.3 : isYoung ? -0.2 : 0)
          : 0;

        const overall = rating(3.8 + matchScore(chars,          rP,          0.12) + noise(uid, rid, 0) + ageBias);
        const taste   = rating(3.8 + matchScore(chars.slice(0,5), rP.slice(0,5), 0.16) + noise(uid, rid, 1) + ageBias);
        const space   = rating(3.8 + matchScore(chars.slice(5),   rP.slice(5),   0.22) + noise(uid, rid, 2) + ageBias);
        const party   = (uid * rid % 3) + 1;
        const span    = price[1] - price[0];
        const per     = price[0] + ((uid * rid * 3 + uid * 7) % (span + 1));
        const total   = Math.round(per * party / 1000) * 1000;
        const [oily, mild, clean, stim, spicy, noiseV, interior, service] = rP;

        resVals.push(
          `(${uid},${rid},${overall},${space},${taste},${party},${total},` +
          `${oily},${clean},${stim},${spicy},${noiseV},${interior},${service},'${mbti}','${hormone}',${mild})`,
        );
      }

      // ── 숙소 ─────────────────────────────────────────────────────────────
      for (const s of stays) {
        const pid   = s.naver_place_id as string;
        const sid   = Number(s.id);
        const chars = SC[pid];
        if (!chars) continue;

        const price    = STAY_PRICE[pid] ?? [80000, 150000];
        const overall  = rating(3.8 + matchScore(chars,          sP,          0.14) + noise(uid, sid, 3));
        const interior = rating(3.8 + matchScore(chars.slice(0,3), sP.slice(0,3), 0.20) + noise(uid, sid, 4));
        const clean    = rating(3.8 + matchScore(chars.slice(3),   sP.slice(3),   0.20) + noise(uid, sid, 5));
        const party    = (uid * sid % 3) + 1;
        const span     = price[1] - price[0];
        const total    = Math.round((price[0] + ((uid * sid * 5 + uid * 11) % (span + 1))) / 1000) * 1000;
        const [view, int2, spaceV, noiseV, cleanV, serviceV] = sP;

        stayVals.push(
          `(${uid},${sid},${overall},${interior},${clean},${total},${party},` +
          `${view},${int2},${spaceV},${noiseV},${cleanV},${serviceV},'${mbti}','${hormone}')`,
        );
      }

      // ── 액티비티 ──────────────────────────────────────────────────────────
      for (const a of activities) {
        const pid   = a.naver_place_id as string;
        const aid   = Number(a.id);
        const chars = AC[pid];
        if (!chars) continue;

        let bias = 0;
        if (TETO_ACTS.has(pid)) bias += isTeto ?  0.3 : isEgen ? -0.1 : 0;
        if (EGEN_ACTS.has(pid)) bias += isEgen ?  0.3 : isTeto ? -0.1 : 0;
        if (MBTI_ACT[pid] && MBTI_ACT[pid] === mbti) bias += 0.2;

        const overall = rating(3.8 + matchScore(chars as number[], aP, 0.20) + noise(uid, aid, 6) + bias);
        const [cult, view, heal, act] = aP;

        actVals.push(
          `(${uid},${aid},${overall},'${mbti}','${hormone}',${cult},${view},${heal},${act})`,
        );
      }
    }

    // ── 6. 배치 INSERT ────────────────────────────────────────────────────
    const BATCH = 500;

    for (let i = 0; i < resVals.length; i += BATCH) {
      await queryRunner.query(
        `INSERT INTO restaurant_ratings
           (user_id, restaurant_id, overall_rating, space_rating, taste_rating,
            visit_party_size, total_spent_amount,
            res_oily_snap, res_clean_snap, res_stim_snap, res_spicy_snap,
            res_noise_snap, res_interior_snap, res_service_snap,
            mbti_snap, hormone_snap, res_mild_snap)
         VALUES ${resVals.slice(i, i + BATCH).join(',')}`,
      );
    }

    for (let i = 0; i < stayVals.length; i += BATCH) {
      await queryRunner.query(
        `INSERT INTO stay_ratings
           (user_id, stay_id, overall_rating, interior_rating, clean_rating,
            total_spent_amount, visit_party_size,
            stay_view_snap, stay_interior_snap, stay_space_snap,
            stay_noise_snap, stay_clean_snap, stay_service_snap,
            mbti_snap, hormone_snap)
         VALUES ${stayVals.slice(i, i + BATCH).join(',')}`,
      );
    }

    for (let i = 0; i < actVals.length; i += BATCH) {
      await queryRunner.query(
        `INSERT INTO activity_ratings
           (user_id, activity_id, overall_rating,
            mbti_snap, hormone_snap,
            act_culture_snap, act_view_snap, act_healing_snap, act_active_snap)
         VALUES ${actVals.slice(i, i + BATCH).join(',')}`,
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM activity_ratings   WHERE user_id IN (SELECT id FROM users WHERE login_id LIKE 'user%')`,
    );
    await queryRunner.query(
      `DELETE FROM stay_ratings       WHERE user_id IN (SELECT id FROM users WHERE login_id LIKE 'user%')`,
    );
    await queryRunner.query(
      `DELETE FROM restaurant_ratings WHERE user_id IN (SELECT id FROM users WHERE login_id LIKE 'user%')`,
    );
  }
}
