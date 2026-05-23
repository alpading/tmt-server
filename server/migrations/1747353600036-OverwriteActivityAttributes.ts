import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * 액티비티 속성 전면 재조사 반영
 * 지정된 항목만 true, 나머지 전부 false
 * 신규 카페/쇼핑 항목 추가
 */
export class OverwriteActivityAttributes1747353600036 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {

    // ── 기존 항목 속성 덮어쓰기 ──────────────────────────────────────────
    // park / wchair / pets / kid / free / cafe / shop / active / exhib
    const updates: Array<{ id: string; park: boolean; wchair: boolean; pets: boolean; kid: boolean; free: boolean; cafe: boolean; shop: boolean; active: boolean; exhib: boolean }> = [
      { id: '11663971',   park: true,  wchair: true,  pets: false, kid: false, free: true,  cafe: false, shop: false, active: false, exhib: false }, // 불국사
      { id: '11663972',   park: true,  wchair: true,  pets: false, kid: false, free: true,  cafe: false, shop: false, active: false, exhib: false }, // 석굴암
      { id: '11620556',   park: true,  wchair: true,  pets: false, kid: false, free: true,  cafe: false, shop: false, active: false, exhib: true  }, // 국립경주박물관
      { id: '13491802',   park: true,  wchair: true,  pets: false, kid: true,  free: true,  cafe: false, shop: false, active: false, exhib: false }, // 첨성대
      { id: '13490982',   park: true,  wchair: true,  pets: false, kid: true,  free: false, cafe: false, shop: false, active: false, exhib: false }, // 동궁과월지
      { id: '13491270',   park: true,  wchair: true,  pets: false, kid: true,  free: true,  cafe: false, shop: false, active: false, exhib: false }, // 대릉원
      { id: '12095305',   park: true,  wchair: true,  pets: false, kid: false, free: false, cafe: false, shop: false, active: true,  exhib: false }, // 경주월드
      { id: '13491589',   park: true,  wchair: true,  pets: true,  kid: true,  free: true,  cafe: false, shop: false, active: false, exhib: false }, // 보문호
      { id: '13491217',   park: true,  wchair: true,  pets: true,  kid: true,  free: true,  cafe: false, shop: false, active: false, exhib: false }, // 문무대왕릉
      { id: '20098998',   park: true,  wchair: true,  pets: false, kid: true,  free: false, cafe: false, shop: false, active: false, exhib: false }, // 오릉
      { id: '11828149',   park: true,  wchair: true,  pets: false, kid: true,  free: false, cafe: false, shop: false, active: false, exhib: false }, // 포석정
      { id: '15754062',   park: true,  wchair: true,  pets: true,  kid: true,  free: false, cafe: false, shop: false, active: true,  exhib: true  }, // 경주엑스포공원
      { id: '15772342',   park: true,  wchair: true,  pets: true,  kid: true,  free: false, cafe: false, shop: false, active: false, exhib: false }, // 감은사지
      { id: '11663970',   park: true,  wchair: true,  pets: true,  kid: true,  free: true,  cafe: false, shop: false, active: false, exhib: false }, // 분황사
      { id: '12765760',   park: true,  wchair: true,  pets: false, kid: true,  free: false, cafe: false, shop: false, active: false, exhib: false }, // 양동마을
      { id: '13101807',   park: true,  wchair: true,  pets: true,  kid: true,  free: true,  cafe: false, shop: false, active: false, exhib: false }, // 옥산서원
      { id: '19816000',   park: true,  wchair: true,  pets: true,  kid: true,  free: true,  cafe: false, shop: false, active: false, exhib: false }, // 계림
      { id: '20095496',   park: false, wchair: true,  pets: true,  kid: true,  free: true,  cafe: false, shop: false, active: false, exhib: false }, // 통일전
      { id: '1285482977', park: true,  wchair: true,  pets: false, kid: false, free: false, cafe: false, shop: true,  active: false, exhib: false }, // 대릉한복
      { id: '11725672',   park: true,  wchair: true,  pets: true,  kid: true,  free: false, cafe: false, shop: false, active: false, exhib: false }, // 대산도예
      { id: '38674036',   park: true,  wchair: true,  pets: false, kid: false, free: false, cafe: true,  shop: false, active: false, exhib: false }, // 이재원과자공방
      { id: '785809390',  park: false, wchair: false, pets: false, kid: false, free: false, cafe: false, shop: false, active: false, exhib: false }, // No Words
      { id: '1136426828', park: true,  wchair: true,  pets: false, kid: true,  free: false, cafe: false, shop: false, active: true,  exhib: false }, // 경주루지월드
      { id: '20091286',   park: true,  wchair: false, pets: false, kid: true,  free: false, cafe: false, shop: false, active: true,  exhib: false }, // 강동워터파크
      { id: '37755924',   park: true,  wchair: true,  pets: false, kid: true,  free: false, cafe: false, shop: false, active: false, exhib: true  }, // 키덜트뮤지엄
      { id: '34666089',   park: true,  wchair: false, pets: true,  kid: true,  free: false, cafe: false, shop: false, active: true,  exhib: false }, // 경주레저
      { id: '1529724953', park: true,  wchair: false, pets: true,  kid: false, free: false, cafe: false, shop: false, active: true,  exhib: false }, // 경주 패러글라이딩
      { id: '463923897',  park: true,  wchair: true,  pets: false, kid: true,  free: false, cafe: false, shop: false, active: false, exhib: true  }, // 또봇 정크아트뮤지엄
      { id: '13351607',   park: true,  wchair: true,  pets: true,  kid: false, free: true,  cafe: false, shop: false, active: false, exhib: false }, // 황성공원
      // 기존 전시형
      { id: '38630852',   park: true,  wchair: true,  pets: false, kid: true,  free: false, cafe: false, shop: false, active: false, exhib: true  }, // 경주 세계 자동차 박물관
      { id: '75112495',   park: true,  wchair: true,  pets: false, kid: true,  free: false, cafe: false, shop: false, active: false, exhib: true  }, // 황룡사역사문화관
      { id: '13529857',   park: true,  wchair: true,  pets: false, kid: true,  free: false, cafe: false, shop: false, active: false, exhib: true  }, // 경주 예술의전당
    ];

    for (const r of updates) {
      await queryRunner.query(`
        UPDATE "activities" SET
          available_parking        = $1,
          is_wheelchair_accessible = $2,
          allows_pets              = $3,
          is_kid_friendly          = $4,
          is_free                  = $5,
          is_cafe                  = $6,
          is_shopping              = $7,
          is_active                = $8,
          is_exhibition            = $9
        WHERE naver_place_id = $10
      `, [r.park, r.wchair, r.pets, r.kid, r.free, r.cafe, r.shop, r.active, r.exhib, r.id]);
    }

    // ── 신규 카페/쇼핑 항목 추가 ──────────────────────────────────────────
    await queryRunner.query(`
      INSERT INTO "activities" (
        "destination_id", "name",
        "available_parking", "is_wheelchair_accessible", "allows_pets",
        "is_kid_friendly", "is_free", "is_cafe", "is_shopping",
        "is_active", "is_exhibition",
        "image_url", "address", "latitude", "longitude", "naver_place_id"
      ) VALUES
        (189, '바실라',                  true,  true,  true,  false, false, true,  false, false, false, '', '경상북도 경주시', 35.8358, 129.2098, '1158250968'),
        (189, '아라카페',                true,  true,  true,  false, false, true,  false, false, false, '', '경상북도 경주시', 35.8358, 129.2098, '1637133406'),
        (189, '후프후프',                true,  true,  true,  false, false, true,  false, false, false, '', '경상북도 경주시', 35.8358, 129.2098, '1008616984'),
        (189, '르씨엘',                  true,  true,  false, false, false, true,  false, false, false, '', '경상북도 경주시', 35.8358, 129.2098, '1192158980'),
        (189, '명퉤 경주플래그십스토어',   true,  true,  false, false, false, false, true,  false, false, '', '경상북도 경주시', 35.8358, 129.2098, '2023957955'),
        (189, '세컨드빈티지',             true,  true,  false, false, false, false, true,  false, false, '', '경상북도 경주시', 35.8358, 129.2098, '2026956916'),
        (189, '헬로리로',                false, true,  false, false, false, false, true,  false, false, '', '경상북도 경주시', 35.8358, 129.2098, '1096043506'),
        (189, '아로마',                  false, true,  false, false, false, false, true,  false, false, '', '경상북도 경주시', 35.8358, 129.2098, '1420649242'),
        (189, '빈티지샵 말퀴리',          false, true,  false, false, false, false, true,  false, false, '', '경상북도 경주시', 35.8358, 129.2098, '1039669880')
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM "activities"
      WHERE naver_place_id IN (
        '1158250968','1637133406','1008616984','1192158980',
        '2023957955','2026956916','1096043506','1420649242','1039669880'
      )
    `);
  }
}
