import { MigrationInterface, QueryRunner } from 'typeorm';

export class ApplyGyeongjuDataCorrections1747353600020 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // ── 식당: 덕클 황리단길점 카테고리 중식으로 수정 ──────────────────────────
    await queryRunner.query(`UPDATE "restaurants" SET restaurant_category_id = 2 WHERE id = 31`);

    // ── 숙소: 이름 수정 + naver_place_id 일괄 반영 ───────────────────────────
    await queryRunner.query(`
      UPDATE "stays" SET naver_place_id = '11728066' WHERE id = 1;
      UPDATE "stays" SET naver_place_id = '11609515' WHERE id = 2;
      UPDATE "stays" SET name = '더케이호텔경주',              naver_place_id = '12899202'   WHERE id = 3;
      UPDATE "stays" SET naver_place_id = '11658829' WHERE id = 4;
      UPDATE "stays" SET name = '발렌타인호텔',                naver_place_id = '12934753'   WHERE id = 5;
      UPDATE "stays" SET name = '경주 베니키아 스위스로젠호텔', naver_place_id = '11797085'  WHERE id = 6;
      UPDATE "stays" SET name = '일성리조트 경주보문',          naver_place_id = '11386454'   WHERE id = 7;
      UPDATE "stays" SET name = '만수',                        naver_place_id = '1736329630' WHERE id = 8;
      UPDATE "stays" SET name = '경주교동한옥집',              naver_place_id = '1264952218' WHERE id = 9;
      UPDATE "stays" SET naver_place_id = '132563442'  WHERE id = 10;
      UPDATE "stays" SET name = '월정헌',                      naver_place_id = '1540977096' WHERE id = 11;
      UPDATE "stays" SET name = '황리단길스테이',              naver_place_id = '1803909285' WHERE id = 12;
      UPDATE "stays" SET name = '경주시티호텔',                naver_place_id = '1110136938' WHERE id = 13;
      UPDATE "stays" SET name = '애견풀빌라 포레스트258',      naver_place_id = '1414207876' WHERE id = 14;
      UPDATE "stays" SET name = '라온채',                      naver_place_id = '1927958707' WHERE id = 15;
      UPDATE "stays" SET name = '실라마실풀빌라',              naver_place_id = '1402810575' WHERE id = 16;
      UPDATE "stays" SET name = '별빛마루글램핑펜션',          naver_place_id = '35150031'   WHERE id = 17;
      UPDATE "stays" SET name = '인디에어 글램핑',             naver_place_id = '2024278058' WHERE id = 18;
      UPDATE "stays" SET name = '경주한옥숙소 서악다움',       naver_place_id = '1121487897' WHERE id = 19;
      UPDATE "stays" SET name = '온이네민박',                  naver_place_id = '2041034954' WHERE id = 20;
    `);

    // ── 액티비티: 삭제 ────────────────────────────────────────────────────────
    // 경주자전거투어(20), 보문호수카약체험(24), 경주야경투어(25), 황리단길카페거리(26)
    await queryRunner.query(`DELETE FROM "activities" WHERE id IN (20, 24, 25, 26)`);

    // ── 액티비티: 이름 수정 + naver_place_id 일괄 반영 ───────────────────────
    await queryRunner.query(`
      UPDATE "activities" SET naver_place_id = '11663971'   WHERE id = 2;
      UPDATE "activities" SET naver_place_id = '11663972'   WHERE id = 3;
      UPDATE "activities" SET naver_place_id = '11620556'   WHERE id = 4;
      UPDATE "activities" SET naver_place_id = '13491802'   WHERE id = 5;
      UPDATE "activities" SET naver_place_id = '13490982'   WHERE id = 6;
      UPDATE "activities" SET naver_place_id = '13491270'   WHERE id = 7;
      UPDATE "activities" SET naver_place_id = '677355362'  WHERE id = 8;
      UPDATE "activities" SET naver_place_id = '12095305'   WHERE id = 9;
      UPDATE "activities" SET name = '보문호',              naver_place_id = '13491589'   WHERE id = 10;
      UPDATE "activities" SET naver_place_id = '13491217'   WHERE id = 11;
      UPDATE "activities" SET naver_place_id = '20098998'   WHERE id = 12;
      UPDATE "activities" SET naver_place_id = '11828149'   WHERE id = 13;
      UPDATE "activities" SET naver_place_id = '15754062'   WHERE id = 14;
      UPDATE "activities" SET naver_place_id = '15772342'   WHERE id = 15;
      UPDATE "activities" SET naver_place_id = '11663970'   WHERE id = 16;
      UPDATE "activities" SET naver_place_id = '12765760'   WHERE id = 17;
      UPDATE "activities" SET naver_place_id = '13101807'   WHERE id = 18;
      UPDATE "activities" SET naver_place_id = '19816000'   WHERE id = 19;
      UPDATE "activities" SET naver_place_id = '20095496'   WHERE id = 21;
      UPDATE "activities" SET name = '대릉한복',            naver_place_id = '1285482977' WHERE id = 22;
      UPDATE "activities" SET name = '대산도예',            naver_place_id = '11725672'   WHERE id = 23;
      UPDATE "activities" SET name = '이재원과자공방',      naver_place_id = '38674036'   WHERE id = 27;
    `);

    // ── 액티비티: 신규 추가 (No Words 카페) ──────────────────────────────────
    await queryRunner.query(`
      INSERT INTO "activities" (
        "destination_id", "name",
        "available_parking", "is_wheelchair_accessible", "allows_pets",
        "is_kid_friendly", "is_free", "is_cafe", "is_shopping", "is_active", "is_exhibition",
        "image_url", "address", "latitude", "longitude", "naver_place_id"
      ) VALUES (
        189, 'No Words',
        false, false, false, false, false, true, false, false, false,
        '', '경상북도 경주시 포석로 일대', 35.8360000, 129.2105000, '785809390'
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "activities" WHERE naver_place_id = '785809390'`);
    await queryRunner.query(`UPDATE "restaurants" SET restaurant_category_id = 1 WHERE id = 31`);
  }
}
