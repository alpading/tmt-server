import { MigrationInterface, QueryRunner } from 'typeorm';

// district_id=189: 경주시 (경상북도 province_id=15, 두 번째 district)
// restaurant_category: 한식=1, 중식=2, 일식=3, 양식=4, 분식=5, 동남아식=6
// stay_category: 호텔=1, 모텔=2, 펜션=3, 게하/호스텔=4, 캠핑/글램핑=5, 리조트=6, 한옥/템플스테이=7, 민박=8
export class SeedGyeongjuData1747353600017 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // ── Restaurants ────────────────────────────────────────────────────────────
    await queryRunner.query(`
      INSERT INTO "restaurants" (
        "district_id", "restaurant_category_id", "name",
        "has_parking", "allows_pets", "has_spicy_food", "has_single_seating",
        "has_table_seating", "has_floor_seating", "has_group_seating",
        "has_private_room", "has_bar_table", "has_baby_chair",
        "image_url", "address", "latitude", "longitude"
      ) VALUES
        (189, 1, '요석궁',
         false, false, false, false, true, true, true, true, false, false,
         '', '경상북도 경주시 교촌길 39-2', 35.8353000, 129.2139000),

        (189, 1, '경주교동쌈밥',
         false, false, false, true, true, false, false, false, false, false,
         '', '경상북도 경주시 교촌안길 27', 35.8367000, 129.2119000),

        (189, 1, '황남국밥',
         false, false, false, true, true, false, false, false, false, false,
         '', '경상북도 경주시 포석로 1080', 35.8341000, 129.2082000),

        (189, 1, '봉황대갈비',
         true, false, false, false, true, false, true, false, false, false,
         '', '경상북도 경주시 포석로 1142', 35.8355000, 129.2088000),

        (189, 1, '삼릉가든',
         true, false, true, false, true, false, true, true, false, false,
         '', '경상북도 경주시 배동 454-1', 35.8108000, 129.2176000),

        (189, 1, '마황토방',
         true, false, false, false, true, true, true, true, false, true,
         '', '경상북도 경주시 보문로 484', 35.8630000, 129.2776000),

        (189, 1, '오릉돼지국밥',
         false, false, false, true, true, false, false, false, false, false,
         '', '경상북도 경주시 탑동 81-4', 35.8357000, 129.2088000),

        (189, 1, '천마총순두부',
         false, false, false, true, true, false, false, false, false, false,
         '', '경상북도 경주시 원화로 266', 35.8349000, 129.2223000),

        (189, 1, '현대갈비',
         false, false, false, false, true, false, true, true, false, false,
         '', '경상북도 경주시 원화로 221', 35.8363000, 129.2247000),

        (189, 1, '향원한정식',
         true, false, false, false, true, true, true, true, false, true,
         '', '경상북도 경주시 보문로 418', 35.8612000, 129.2723000),

        (189, 5, '교리김밥',
         false, false, false, true, true, false, false, false, false, false,
         '', '경상북도 경주시 교촌안길 12', 35.8362000, 129.2130000),

        (189, 5, '황리단길만두',
         false, false, true, true, true, false, false, false, true, false,
         '', '경상북도 경주시 포석로 1085', 35.8343000, 129.2098000),

        (189, 5, '황남빵본가',
         false, false, false, true, false, false, false, false, false, false,
         '', '경상북도 경주시 태종로 783', 35.8374000, 129.2116000),

        (189, 3, '동궁회식당',
         false, false, false, false, true, false, true, false, false, false,
         '', '경상북도 경주시 원화로 232', 35.8345000, 129.2242000),

        (189, 3, '규카츠히메지경주점',
         false, false, false, true, true, false, false, false, true, false,
         '', '경상북도 경주시 포석로 1129', 35.8348000, 129.2095000),

        (189, 3, '경주소바집',
         false, false, false, true, true, false, false, false, false, false,
         '', '경상북도 경주시 첨성로 135', 35.8339000, 129.2210000),

        (189, 4, '황리단길파스타',
         false, false, false, true, true, false, false, false, true, false,
         '', '경상북도 경주시 포석로 1047', 35.8366000, 129.2108000),

        (189, 4, '첨성대브런치카페',
         false, false, false, false, true, false, false, false, false, true,
         '', '경상북도 경주시 첨성로 169-1', 35.8358000, 129.2201000),

        (189, 4, '화랑버거',
         false, false, true, true, true, false, false, false, true, false,
         '', '경상북도 경주시 포석로 1077', 35.8352000, 129.2101000),

        (189, 1, '안압지막걸리',
         false, false, true, false, true, true, true, false, true, false,
         '', '경상북도 경주시 임해로 65', 35.8349000, 129.2237000)
    `);

    // ── Stays ──────────────────────────────────────────────────────────────────
    await queryRunner.query(`
      INSERT INTO "stays" (
        "district_id", "stay_category_id", "name",
        "has_parking", "has_bathtub", "has_breakfast", "has_tv", "has_bbq",
        "allows_cooking", "allows_pets", "is_wheelchair_accessible",
        "image_url", "address", "latitude", "longitude"
      ) VALUES
        (189, 1, '힐튼경주',
         true, true, true, true, false, false, false, true,
         '', '경상북도 경주시 보문로 484-7', 35.8692000, 129.2932000),

        (189, 1, '라한셀렉트경주',
         true, true, true, true, false, false, false, false,
         '', '경상북도 경주시 보문로 560', 35.8723000, 129.2941000),

        (189, 1, '경주조선비즈니스호텔',
         true, false, true, true, false, false, false, true,
         '', '경상북도 경주시 알천북로 107', 35.8542000, 129.2257000),

        (189, 1, '코오롱호텔경주',
         true, true, true, true, false, false, false, false,
         '', '경상북도 경주시 보문로 555', 35.8717000, 129.2883000),

        (189, 1, '경주화백컨벤션호텔',
         true, true, false, true, false, false, false, true,
         '', '경상북도 경주시 알천북로 1', 35.8608000, 129.2903000),

        (189, 6, '경주월드리조트',
         true, true, true, true, true, false, false, false,
         '', '경상북도 경주시 엑스포로 7', 35.8653000, 129.2818000),

        (189, 6, '보문파크리조트',
         true, false, true, true, false, false, false, false,
         '', '경상북도 경주시 보문로 432', 35.8679000, 129.2833000),

        (189, 7, '황남동한옥스테이',
         false, false, true, true, false, false, false, false,
         '', '경상북도 경주시 황남동 123', 35.8343000, 129.2143000),

        (189, 7, '경주교동한옥',
         false, false, true, false, false, false, false, false,
         '', '경상북도 경주시 교촌길 18', 35.8360000, 129.2115000),

        (189, 7, '기림사템플스테이',
         true, false, true, false, false, false, false, false,
         '', '경상북도 경주시 양북면 기림로 238', 35.8013000, 129.4027000),

        (189, 7, '첨성대한옥스테이',
         false, false, true, true, false, false, false, false,
         '', '경상북도 경주시 인왕동 37-2', 35.8361000, 129.2186000),

        (189, 4, '황리단게스트하우스',
         false, false, false, true, false, false, false, false,
         '', '경상북도 경주시 포석로 1055', 35.8358000, 129.2103000),

        (189, 4, '경주시티게스트하우스',
         false, false, false, true, false, false, false, false,
         '', '경상북도 경주시 태종로 757', 35.8382000, 129.2122000),

        (189, 3, '솔빛펜션',
         true, true, false, true, true, true, true, false,
         '', '경상북도 경주시 안강읍 연못길 27', 35.9041000, 129.2130000),

        (189, 3, '첨성대뷰펜션',
         true, false, false, true, false, false, false, false,
         '', '경상북도 경주시 인왕동 37', 35.8363000, 129.2191000),

        (189, 3, '불국사인근펜션',
         true, false, false, true, true, true, false, false,
         '', '경상북도 경주시 진현동 400-3', 35.7923000, 129.3303000),

        (189, 5, '문무대왕글램핑',
         true, false, false, true, true, true, true, false,
         '', '경상북도 경주시 양북면 봉길리 34', 35.7290000, 129.4830000),

        (189, 5, '경주보문캠핑장',
         true, false, false, false, true, true, false, false,
         '', '경상북도 경주시 보문로 434', 35.8667000, 129.2843000),

        (189, 8, '황리단길민박',
         false, false, false, true, false, false, false, false,
         '', '경상북도 경주시 황남동 234-5', 35.8352000, 129.2118000),

        (189, 8, '경주역민박',
         false, false, false, true, false, false, false, false,
         '', '경상북도 경주시 태종로 667', 35.8412000, 129.2145000)
    `);

    // ── Activities ─────────────────────────────────────────────────────────────
    await queryRunner.query(`
      INSERT INTO "activities" (
        "destination_id", "name",
        "available_parking", "is_wheelchair_accessible", "allows_pets",
        "is_kid_friendly", "is_free", "is_cafe", "is_shopping",
        "is_active", "is_exhibition",
        "image_url", "address", "latitude", "longitude"
      ) VALUES
        (189, '불국사',
         true, true, false, true, false, false, false, false, true,
         '', '경상북도 경주시 불국로 385', 35.7902000, 129.3318000),

        (189, '석굴암',
         true, false, false, false, false, false, false, false, true,
         '', '경상북도 경주시 불국로 873-243', 35.7957000, 129.3464000),

        (189, '국립경주박물관',
         true, true, false, true, true, false, false, false, true,
         '', '경상북도 경주시 일정로 186', 35.8325000, 129.2282000),

        (189, '첨성대',
         false, true, false, true, true, false, false, false, true,
         '', '경상북도 경주시 첨성로 169-1', 35.8357000, 129.2195000),

        (189, '동궁과월지',
         true, true, false, true, false, false, false, false, true,
         '', '경상북도 경주시 원화로 102', 35.8351000, 129.2239000),

        (189, '대릉원',
         true, true, false, true, false, false, false, false, true,
         '', '경상북도 경주시 계림로 9', 35.8340000, 129.2163000),

        (189, '황리단길',
         false, true, true, true, true, true, true, false, false,
         '', '경상북도 경주시 포석로 일대', 35.8358000, 129.2098000),

        (189, '경주월드',
         true, true, false, true, false, false, false, true, false,
         '', '경상북도 경주시 엑스포로 7', 35.8644000, 129.2801000),

        (189, '보문호수공원',
         true, true, true, true, true, false, false, false, false,
         '', '경상북도 경주시 보문로 일대', 35.8687000, 129.2903000),

        (189, '문무대왕릉',
         true, false, false, false, true, false, false, false, true,
         '', '경상북도 경주시 양북면 봉길리', 35.7283000, 129.4867000),

        (189, '오릉',
         true, true, false, true, false, false, false, false, true,
         '', '경상북도 경주시 탑동 37', 35.8350000, 129.2093000),

        (189, '포석정',
         true, false, false, false, false, false, false, false, true,
         '', '경상북도 경주시 배동 454', 35.8107000, 129.2207000),

        (189, '경주엑스포공원',
         true, true, false, true, false, false, false, true, true,
         '', '경상북도 경주시 엑스포로 1', 35.8653000, 129.2787000),

        (189, '감은사지',
         true, false, false, false, true, false, false, false, true,
         '', '경상북도 경주시 양북면 용당리 55-1', 35.7413000, 129.4683000),

        (189, '분황사',
         true, false, false, false, false, false, false, false, true,
         '', '경상북도 경주시 분황로 94-11', 35.8413000, 129.2307000),

        (189, '양동마을',
         true, false, false, true, false, false, false, false, true,
         '', '경상북도 경주시 강동면 양동마을길 93', 35.9260000, 129.2340000),

        (189, '옥산서원',
         true, false, false, false, true, false, false, false, true,
         '', '경상북도 경주시 안강읍 옥산서원길 216-27', 35.9038000, 129.1867000),

        (189, '계림',
         false, true, true, true, true, false, false, false, true,
         '', '경상북도 경주시 교동 1', 35.8353000, 129.2177000),

        (189, '경주자전거투어',
         true, false, true, true, false, false, false, true, false,
         '', '경상북도 경주시 태종로 696', 35.8440000, 129.2167000),

        (189, '통일전',
         true, true, false, true, true, false, false, false, true,
         '', '경상북도 경주시 외동읍 괘릉리 25', 35.7992000, 129.3011000)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "activities" WHERE destination_id = 189`);
    await queryRunner.query(`DELETE FROM "stays" WHERE district_id = 189`);
    await queryRunner.query(`DELETE FROM "restaurants" WHERE district_id = 189`);
  }
}
