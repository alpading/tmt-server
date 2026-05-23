import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedRatings1747353600022 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const users: any[] = await queryRunner.query(`
      SELECT u.id, u.mbti, u.hormone,
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

    // Deterministic noise in [-0.4, +0.4] (step 0.1)
    const det = (a: number, b: number): number =>
      (((a * 31 + b * 37 + a * b * 7) % 9) + 9) % 9;

    const noise = (uid: number, pid: number, salt: number): number =>
      (det(uid + salt * 17, pid + salt * 11) - 4) * 0.1;

    const matchScore = (chars: number[], prefs: number[], scale: number): number =>
      chars.reduce((sum, c, i) => sum + (c - 2) * (prefs[i] - 2) * scale, 0);

    // Clamp to [2.0, 5.0] then round to nearest 0.5
    const rating = (v: number): number =>
      Math.max(2.0, Math.min(5.0, Math.round(v * 2) / 2));

    // Restaurant characteristic vectors: [oily, mild, clean, stim, spicy, noise, interior, service]
    // Higher value (3) = more of that quality; lower (1) = less
    const RC: Record<number, number[]> = {
      3:  [2, 3, 3, 2, 2, 2, 3, 3], // 요석궁         – clean/elegant/service
      4:  [2, 3, 3, 2, 2, 2, 2, 2], // 정록쌈밥        – mild/clean
      5:  [3, 1, 2, 3, 2, 3, 1, 2], // 황남양옥        – oily/stim/noisy
      6:  [3, 2, 2, 3, 2, 2, 2, 3], // 포석로 소갈비찜  – oily/stim/service
      10: [1, 3, 3, 1, 1, 1, 2, 2], // 천마 맷돌순두부  – mild/clean/quiet
      13: [1, 3, 2, 1, 1, 2, 1, 2], // 교리김밥 본점   – mild/casual
      14: [2, 2, 2, 2, 2, 2, 2, 2], // 대화만두 황리단점 – balanced
      18: [1, 3, 2, 1, 1, 2, 2, 2], // 박신우제면소    – mild noodles
      19: [2, 3, 3, 1, 1, 2, 3, 3], // 시즈닝          – mild/clean/elegant
      23: [2, 2, 2, 2, 2, 2, 2, 2], // 맥반            – balanced
      24: [2, 3, 3, 1, 1, 1, 2, 3], // 수석정          – mild/clean/quiet/service
      25: [2, 2, 2, 3, 1, 3, 3, 2], // 벚꽃, 한잔      – stim/noisy/interior
      26: [1, 3, 3, 1, 1, 1, 3, 3], // 료미            – mild/clean/elegant
      27: [2, 3, 2, 1, 1, 2, 2, 2], // 신라제면 경주황리단길점
      28: [2, 2, 2, 2, 2, 3, 2, 2], // 987피자         – noisy
      29: [1, 3, 3, 1, 1, 1, 3, 3], // 청온채          – quiet/clean/traditional
      30: [3, 1, 2, 3, 2, 3, 2, 2], // 보문갈비        – oily/stim/noisy
      31: [3, 1, 1, 3, 2, 3, 2, 2], // 덕클 황리단길점  – oily/stim/noisy (Chinese)
    };

    // Stay characteristic vectors: [view, interior, space, noise, clean, service]
    const SC: Record<number, number[]> = {
      1:  [3, 3, 3, 1, 3, 3], // 힐튼경주              – luxury
      2:  [3, 3, 3, 1, 3, 3], // 라한셀렉트경주         – luxury
      3:  [2, 3, 3, 1, 3, 3], // 더케이호텔경주         – business hotel
      4:  [3, 3, 3, 1, 3, 3], // 코오롱호텔경주         – luxury
      5:  [2, 2, 2, 2, 2, 2], // 발렌타인호텔           – average
      6:  [2, 2, 2, 2, 3, 2], // 경주 베니키아 스위스로젠호텔 – clean
      7:  [3, 2, 3, 1, 2, 2], // 일성리조트 경주보문    – view/spacious
      8:  [3, 3, 2, 1, 3, 3], // 만수                  – hanok/upscale
      9:  [3, 3, 2, 1, 3, 2], // 경주교동한옥집         – hanok
      10: [3, 2, 2, 1, 3, 2], // 기림사템플스테이        – nature/clean
      11: [3, 3, 2, 1, 3, 3], // 월정헌                – hanok/upscale
      12: [2, 2, 2, 2, 2, 2], // 황리단길스테이         – average
      13: [2, 2, 2, 2, 2, 2], // 경주시티호텔           – average
      14: [3, 3, 3, 1, 2, 2], // 애견풀빌라 포레스트258  – nature/villa
      15: [3, 3, 3, 1, 3, 2], // 라온채                – pension/view
      16: [3, 3, 3, 1, 3, 2], // 실라마실풀빌라         – pool villa
      17: [3, 2, 2, 2, 2, 1], // 별빛마루글램핑펜션     – nature/view
      18: [3, 2, 2, 2, 2, 1], // 인디에어 글램핑        – nature/view
      19: [3, 3, 2, 1, 3, 2], // 경주한옥숙소 서악다움  – hanok
      20: [2, 1, 1, 2, 2, 2], // 온이네민박             – basic
    };

    // Activity characteristic vectors: [culture, view, healing, active]
    const AC: Record<number, number[]> = {
      2:  [3, 3, 2, 1], // 불국사
      3:  [3, 2, 3, 1], // 석굴암
      4:  [3, 1, 1, 1], // 국립경주박물관
      5:  [3, 3, 2, 1], // 첨성대
      6:  [3, 3, 2, 1], // 동궁과월지
      7:  [3, 2, 2, 1], // 대릉원
      8:  [2, 2, 3, 2], // 황리단길
      9:  [1, 1, 1, 3], // 경주월드
      10: [1, 3, 3, 1], // 보문호
      11: [2, 3, 3, 1], // 문무대왕릉
      12: [3, 2, 2, 1], // 오릉
      13: [3, 2, 2, 1], // 포석정
      14: [2, 2, 1, 2], // 경주엑스포공원
      15: [3, 3, 2, 1], // 감은사지
      16: [3, 2, 2, 1], // 분황사
      17: [3, 2, 2, 1], // 양동마을
      18: [3, 2, 3, 1], // 옥산서원
      19: [2, 2, 3, 1], // 계림
      21: [3, 2, 2, 1], // 통일전
      22: [2, 2, 2, 3], // 대릉한복
      23: [2, 1, 2, 3], // 대산도예
      27: [2, 1, 2, 3], // 이재원과자공방
      28: [1, 2, 3, 1], // No Words
    };

    const RES_PRICE: Record<number, [number, number]> = {
      3:  [40000, 70000], 4:  [12000, 20000], 5:  [7000,  12000],
      6:  [30000, 50000], 10: [10000, 15000], 13: [4000,   8000],
      14: [8000,  12000], 18: [10000, 15000], 19: [20000,  35000],
      23: [15000, 25000], 24: [20000, 30000], 25: [15000,  25000],
      26: [25000, 40000], 27: [10000, 15000], 28: [15000,  22000],
      29: [30000, 50000], 30: [25000, 40000], 31: [12000,  20000],
    };

    const STAY_PRICE: Record<number, [number, number]> = {
      1:  [250000, 400000], 2:  [200000, 350000], 3:  [120000, 200000],
      4:  [180000, 300000], 5:  [80000,  130000], 6:  [80000,  120000],
      7:  [150000, 250000], 8:  [150000, 250000], 9:  [80000,  150000],
      10: [50000,   80000], 11: [150000, 250000], 12: [50000,   80000],
      13: [60000,   90000], 14: [200000, 350000], 15: [150000, 250000],
      16: [180000, 300000], 17: [80000,  130000], 18: [80000,  130000],
      19: [100000, 180000], 20: [40000,   70000],
    };

    const resIds  = [3, 4, 5, 6, 10, 13, 14, 18, 19, 23, 24, 25, 26, 27, 28, 29, 30, 31];
    const stayIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
    const actIds  = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 23, 27, 28];

    const resVals:  string[] = [];
    const stayVals: string[] = [];
    const actVals:  string[] = [];

    for (const u of users) {
      const uid     = Number(u.id);
      const mbti    = u.mbti as string;
      const hormone = u.hormone as string;

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

      for (const rid of resIds) {
        const chars   = RC[rid];
        const overall = rating(3.8 + matchScore(chars,          rP,          0.12) + noise(uid, rid, 0));
        const taste   = rating(3.8 + matchScore(chars.slice(0, 5), rP.slice(0, 5), 0.16) + noise(uid, rid, 1));
        const space   = rating(3.8 + matchScore(chars.slice(5),    rP.slice(5),    0.22) + noise(uid, rid, 2));
        const party   = (uid * rid % 3) + 1;
        const [pMin, pMax] = RES_PRICE[rid];
        const perPerson    = pMin + ((uid * rid * 3 + uid * 7) % (pMax - pMin + 1));
        const total        = Math.round(perPerson * party / 1000) * 1000;
        const [oily, mild, clean, stim, spicy, noiseV, interior, service] = rP;
        resVals.push(
          `(${uid},${rid},${overall},${space},${taste},${party},${total},` +
          `${oily},${clean},${stim},${spicy},${noiseV},${interior},${service},'${mbti}','${hormone}',${mild})`,
        );
      }

      for (const sid of stayIds) {
        const chars    = SC[sid];
        const overall  = rating(3.8 + matchScore(chars,          sP,          0.14) + noise(uid, sid, 3));
        const interior = rating(3.8 + matchScore(chars.slice(0, 3), sP.slice(0, 3), 0.20) + noise(uid, sid, 4));
        const clean    = rating(3.8 + matchScore(chars.slice(3),    sP.slice(3),    0.20) + noise(uid, sid, 5));
        const party    = (uid * sid % 3) + 1;
        const [sMin, sMax] = STAY_PRICE[sid];
        const total = Math.round((sMin + ((uid * sid * 5 + uid * 11) % (sMax - sMin + 1))) / 1000) * 1000;
        const [view, int, spaceV, noiseV, cleanV, serviceV] = sP;
        stayVals.push(
          `(${uid},${sid},${overall},${interior},${clean},${total},${party},` +
          `${view},${int},${spaceV},${noiseV},${cleanV},${serviceV},'${mbti}','${hormone}')`,
        );
      }

      for (const aid of actIds) {
        const chars   = AC[aid];
        const overall = rating(3.8 + matchScore(chars, aP, 0.20) + noise(uid, aid, 6));
        const [culture, view, healing, active] = aP;
        actVals.push(
          `(${uid},${aid},${overall},'${mbti}','${hormone}',${culture},${view},${healing},${active})`,
        );
      }
    }

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
      `DELETE FROM activity_ratings
       WHERE user_id IN (SELECT id FROM users WHERE login_id LIKE 'user%')`,
    );
    await queryRunner.query(
      `DELETE FROM stay_ratings
       WHERE user_id IN (SELECT id FROM users WHERE login_id LIKE 'user%')`,
    );
    await queryRunner.query(
      `DELETE FROM restaurant_ratings
       WHERE user_id IN (SELECT id FROM users WHERE login_id LIKE 'user%')`,
    );
  }
}
