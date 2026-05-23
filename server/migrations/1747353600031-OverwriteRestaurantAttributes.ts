import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * 식당 속성 전면 재조사 반영
 * 지정된 항목만 true, 나머지 전부 false
 * naver_place_id도 함께 업데이트
 */
export class OverwriteRestaurantAttributes1747353600031 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const updates: Array<{ name: string; naverPlaceId: string; pet: boolean; spicy: boolean; single: boolean; table: boolean; floor: boolean; group: boolean; priv: boolean; bar: boolean; baby: boolean; parking: boolean }> = [
      // name                     naverPlaceId    pet    spicy  single table  floor  group  priv   bar    baby   parking
      { name: '요석궁',             naverPlaceId: '1505892139',  pet: false, spicy: false, single: false, table: true,  floor: true,  group: false, priv: true,  bar: false, baby: false, parking: true  },
      { name: '정록쌈밥',            naverPlaceId: '15742693',    pet: false, spicy: false, single: false, table: true,  floor: false, group: true,  priv: false, bar: false, baby: true,  parking: true  },
      { name: '황남양옥',            naverPlaceId: '1937464680',  pet: true,  spicy: true,  single: true,  table: true,  floor: false, group: true,  priv: true,  bar: false, baby: true,  parking: true  },
      { name: '포석로 소갈비찜',      naverPlaceId: '1196479801',  pet: false, spicy: true,  single: false, table: true,  floor: false, group: true,  priv: false, bar: false, baby: true,  parking: false },
      { name: '천마 맷돌순두부',      naverPlaceId: '1900502536',  pet: false, spicy: true,  single: false, table: true,  floor: false, group: true,  priv: true,  bar: false, baby: false, parking: false },
      { name: '교리김밥 본점',        naverPlaceId: '21701372',    pet: false, spicy: false, single: false, table: true,  floor: false, group: false, priv: false, bar: false, baby: false, parking: true  },
      { name: '대화만두 황리단점',     naverPlaceId: '1385214649',  pet: false, spicy: false, single: false, table: true,  floor: false, group: false, priv: false, bar: true,  baby: false, parking: false },
      { name: '박신우제면소',         naverPlaceId: '1803011937',  pet: false, spicy: false, single: false, table: true,  floor: false, group: false, priv: false, bar: true,  baby: false, parking: false },
      { name: '시즈닝',             naverPlaceId: '1183977881',  pet: false, spicy: false, single: false, table: true,  floor: false, group: false, priv: false, bar: false, baby: true,  parking: false },
      { name: '맥반',               naverPlaceId: '2065990534',  pet: false, spicy: false, single: false, table: true,  floor: false, group: true,  priv: false, bar: false, baby: true,  parking: false },
      { name: '수석정',             naverPlaceId: '1752405772',  pet: false, spicy: false, single: false, table: true,  floor: false, group: false, priv: false, bar: false, baby: false, parking: true  },
      { name: '벚꽃, 한잔',          naverPlaceId: '1850467174',  pet: false, spicy: true,  single: false, table: true,  floor: false, group: true,  priv: false, bar: true,  baby: false, parking: true  },
      { name: '료미',               naverPlaceId: '1614701657',  pet: true,  spicy: false, single: true,  table: true,  floor: false, group: true,  priv: false, bar: true,  baby: true,  parking: false },
      { name: '신라제면 경주황리단길점', naverPlaceId: '2030007425',  pet: false, spicy: true,  single: false, table: true,  floor: false, group: false, priv: false, bar: false, baby: true,  parking: false },
      { name: '987피자',            naverPlaceId: '38279045',    pet: true,  spicy: false, single: false, table: true,  floor: false, group: false, priv: false, bar: false, baby: false, parking: false },
      { name: '청온채',             naverPlaceId: '1335800249',  pet: false, spicy: true,  single: true,  table: true,  floor: false, group: true,  priv: false, bar: true,  baby: false, parking: false },
      { name: '보문갈비',            naverPlaceId: '1306682069',  pet: false, spicy: false, single: false, table: true,  floor: false, group: true,  priv: false, bar: false, baby: true,  parking: true  },
      { name: '덕클 황리단길점',      naverPlaceId: '1537062099',  pet: false, spicy: true,  single: false, table: true,  floor: false, group: true,  priv: false, bar: false, baby: true,  parking: true  },
    ];

    for (const r of updates) {
      await queryRunner.query(`
        UPDATE "restaurants" SET
          naver_place_id        = $1,
          allows_pets           = $2,
          has_spicy_food        = $3,
          has_single_seating    = $4,
          has_table_seating     = $5,
          has_floor_seating     = $6,
          has_group_seating     = $7,
          has_private_room      = $8,
          has_bar_table         = $9,
          has_baby_chair        = $10,
          has_parking           = $11
        WHERE name = $12
      `, [r.naverPlaceId, r.pet, r.spicy, r.single, r.table, r.floor, r.group, r.priv, r.bar, r.baby, r.parking, r.name]);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // 롤백은 전체 리셋 (모두 false)
    await queryRunner.query(`
      UPDATE "restaurants" SET
        allows_pets = false, has_spicy_food = false, has_single_seating = false,
        has_table_seating = false, has_floor_seating = false, has_group_seating = false,
        has_private_room = false, has_bar_table = false, has_baby_chair = false,
        has_parking = false
      WHERE name IN (
        '요석궁','정록쌈밥','황남양옥','포석로 소갈비찜','천마 맷돌순두부',
        '교리김밥 본점','대화만두 황리단점','박신우제면소','시즈닝','맥반',
        '수석정','벚꽃, 한잔','료미','신라제면 경주황리단길점','987피자',
        '청온채','보문갈비','덕클 황리단길점'
      )
    `);
  }
}
