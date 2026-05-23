import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateRestaurants1747353600019 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // ── 삭제 ──────────────────────────────────────────────────────────────────
    await queryRunner.query(`
      DELETE FROM "restaurants"
      WHERE id IN (7, 8, 9, 11, 12, 15, 16, 17, 21, 22)
    `);
    // 삼릉가든(7), 마황토방(8), 오릉돼지국밥(9), 현대갈비(11), 향원한정식(12),
    // 황남빵본가(15), 동궁회식당(16), 규카츠히메지경주점(17), 화랑버거(21), 안압지막걸리(22)

    // ── 이름 수정 + naver_place_id 업데이트 ──────────────────────────────────
    await queryRunner.query(`UPDATE "restaurants" SET naver_place_id = '1505892139' WHERE id = 3`); // 요석궁
    await queryRunner.query(`UPDATE "restaurants" SET name = '정록쌈밥',           naver_place_id = '15742693'   WHERE id = 4`);
    await queryRunner.query(`UPDATE "restaurants" SET name = '황남양옥', naver_place_id = '1937464680' WHERE id = 5`); // 황남양옥
    await queryRunner.query(`UPDATE "restaurants" SET name = '포석로 소갈비찜',    naver_place_id = '1196479801' WHERE id = 6`);
    await queryRunner.query(`UPDATE "restaurants" SET name = '천마 맷돌순두부',    naver_place_id = '1900502536' WHERE id = 10`);
    await queryRunner.query(`UPDATE "restaurants" SET name = '교리김밥 본점',      naver_place_id = '21701372'   WHERE id = 13`);
    await queryRunner.query(`UPDATE "restaurants" SET name = '대화만두 황리단점',  naver_place_id = '1385214649' WHERE id = 14`);
    await queryRunner.query(`UPDATE "restaurants" SET name = '박신우제면소',       naver_place_id = '1803011937' WHERE id = 18`);
    await queryRunner.query(`UPDATE "restaurants" SET name = '시즈닝',             naver_place_id = '1183977881' WHERE id = 19`);

    // ── 신규 추가 ─────────────────────────────────────────────────────────────
    // restaurant_category: 한식=1, 중식=2, 일식=3, 양식=4, 분식=5
    await queryRunner.query(`
      INSERT INTO "restaurants" (
        "district_id", "restaurant_category_id", "name",
        "has_parking", "allows_pets", "has_spicy_food", "has_single_seating",
        "has_table_seating", "has_floor_seating", "has_group_seating",
        "has_private_room", "has_bar_table", "has_baby_chair",
        "image_url", "address", "latitude", "longitude", "naver_place_id"
      ) VALUES
        (189, 1, '맥반',
         false, false, false, true, true, false, false, false, false, false,
         '', '경상북도 경주시 포석로 1073', 35.8350000, 129.2102000, '2065990534'),

        (189, 1, '수석정',
         false, false, false, false, true, false, true, false, false, false,
         '', '경상북도 경주시 포석로 1091', 35.8346000, 129.2097000, '1752405772'),

        (189, 1, '벚꽃, 한잔',
         false, false, false, false, true, false, false, false, true, false,
         '', '경상북도 경주시 포석로 1059', 35.8360000, 129.2105000, '1850467174'),

        (189, 3, '료미',
         false, false, false, true, true, false, false, false, false, false,
         '', '경상북도 경주시 포석로 1043', 35.8365000, 129.2109000, '1614701657'),

        (189, 1, '신라제면 경주황리단길점',
         false, false, false, true, true, false, false, false, false, false,
         '', '경상북도 경주시 포석로 1067', 35.8354000, 129.2100000, '2030007425'),

        (189, 4, '987피자',
         false, false, false, true, true, false, false, false, true, false,
         '', '경상북도 경주시 포석로 1081', 35.8348000, 129.2096000, '38279045'),

        (189, 1, '청온채',
         false, false, false, false, true, false, true, false, false, true,
         '', '경상북도 경주시 첨성로 143', 35.8341000, 129.2215000, '1335800249'),

        (189, 1, '보문갈비',
         true, false, false, false, true, false, true, true, false, false,
         '', '경상북도 경주시 보문로 474', 35.8658000, 129.2826000, '1306682069'),

        (189, 1, '덕클 황리단길점',
         false, false, true, true, true, false, false, false, false, false,
         '', '경상북도 경주시 포석로 1051', 35.8363000, 129.2107000, '1537062099')
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // 신규 추가분 삭제
    await queryRunner.query(`DELETE FROM "restaurants" WHERE naver_place_id IN (
      '2065990534','1752405772','1850467174','1614701657','2030007425',
      '38279045','1335800249','1306682069','1537062099'
    )`);
    // 이름 원복 (naver_place_id만 null로)
    await queryRunner.query(`UPDATE "restaurants" SET naver_place_id = NULL WHERE id IN (3,5)`);
    await queryRunner.query(`UPDATE "restaurants" SET name = '경주교동쌈밥',    naver_place_id = NULL WHERE id = 4`);
    await queryRunner.query(`UPDATE "restaurants" SET name = '봉황대갈비',      naver_place_id = NULL WHERE id = 6`);
    await queryRunner.query(`UPDATE "restaurants" SET name = '천마총순두부',    naver_place_id = NULL WHERE id = 10`);
    await queryRunner.query(`UPDATE "restaurants" SET name = '교리김밥',        naver_place_id = NULL WHERE id = 13`);
    await queryRunner.query(`UPDATE "restaurants" SET name = '황리단길만두',    naver_place_id = NULL WHERE id = 14`);
    await queryRunner.query(`UPDATE "restaurants" SET name = '경주소바집',      naver_place_id = NULL WHERE id = 18`);
    await queryRunner.query(`UPDATE "restaurants" SET name = '황리단길파스타',  naver_place_id = NULL WHERE id = 19`);
  }
}
