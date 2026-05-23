import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * 숙소 속성 전면 재조사 반영
 * 지정된 항목만 true, 나머지 전부 false
 */
export class OverwriteStayAttributes1747353600035 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const updates: Array<{
      id: string; park: boolean; bathtub: boolean; breakfast: boolean;
      tv: boolean; bbq: boolean; cooking: boolean; pets: boolean; wheelchair: boolean;
    }> = [
      // naver_place_id          park    bathtub bkfast  tv      bbq     cooking pets    wheelchair
      { id: '11728066',  park: true,  bathtub: true,  breakfast: true,  tv: true,  bbq: false, cooking: false, pets: false, wheelchair: true  }, // 힐튼호텔경주
      { id: '11609515',  park: true,  bathtub: true,  breakfast: true,  tv: true,  bbq: false, cooking: false, pets: false, wheelchair: true  }, // 라한셀렉트경주
      { id: '12899202',  park: true,  bathtub: true,  breakfast: true,  tv: true,  bbq: false, cooking: false, pets: true,  wheelchair: true  }, // 더케이호텔경주
      { id: '11658829',  park: true,  bathtub: true,  breakfast: true,  tv: true,  bbq: false, cooking: false, pets: false, wheelchair: true  }, // 코오롱호텔경주
      { id: '12934753',  park: true,  bathtub: true,  breakfast: true,  tv: true,  bbq: false, cooking: true,  pets: false, wheelchair: true  }, // 발렌타인호텔
      { id: '11797085',  park: true,  bathtub: true,  breakfast: true,  tv: true,  bbq: false, cooking: false, pets: false, wheelchair: true  }, // 경주 베니키아 스위스로젠호텔
      { id: '11386454',  park: true,  bathtub: true,  breakfast: true,  tv: true,  bbq: false, cooking: true,  pets: false, wheelchair: true  }, // 일성리조트 경주보문
      { id: '1736329630', park: true, bathtub: false, breakfast: false, tv: false, bbq: false, cooking: false, pets: false, wheelchair: false }, // 만수
      { id: '1264952218', park: true, bathtub: false, breakfast: false, tv: false, bbq: false, cooking: false, pets: false, wheelchair: true  }, // 경주교동한옥집
      { id: '132563442',  park: true, bathtub: false, breakfast: false, tv: false, bbq: false, cooking: false, pets: false, wheelchair: false }, // 기림사템플스테이
      { id: '1540977096', park: true, bathtub: false, breakfast: false, tv: false, bbq: true,  cooking: true,  pets: false, wheelchair: true  }, // 월정헌
      { id: '1803909285', park: true, bathtub: true,  breakfast: false, tv: false, bbq: true,  cooking: true,  pets: true,  wheelchair: true  }, // 황리단길스테이
      { id: '1110136938', park: true, bathtub: true,  breakfast: true,  tv: true,  bbq: false, cooking: true,  pets: false, wheelchair: true  }, // 경주시티호텔
      { id: '1414207876', park: true, bathtub: false, breakfast: false, tv: true,  bbq: true,  cooking: true,  pets: true,  wheelchair: false }, // 애견풀빌라 포레스트258
      { id: '1927958707', park: true, bathtub: true,  breakfast: false, tv: true,  bbq: true,  cooking: true,  pets: false, wheelchair: false }, // 라온채
      { id: '1402810575', park: true, bathtub: true,  breakfast: false, tv: true,  bbq: true,  cooking: true,  pets: false, wheelchair: false }, // 실라마실풀빌라
      { id: '35150031',   park: true, bathtub: false, breakfast: false, tv: false, bbq: true,  cooking: true,  pets: false, wheelchair: false }, // 별빛마루글램핑펜션
      { id: '2024278058', park: true, bathtub: false, breakfast: false, tv: false, bbq: true,  cooking: true,  pets: true,  wheelchair: false }, // 인디에어 글램핑
      { id: '1121487897', park: true, bathtub: true,  breakfast: false, tv: true,  bbq: false, cooking: true,  pets: false, wheelchair: false }, // 경주한옥숙소 서악다움
      { id: '2041034954', park: true, bathtub: true,  breakfast: false, tv: true,  bbq: true,  cooking: true,  pets: false, wheelchair: false }, // 온이네민박
    ];

    for (const r of updates) {
      await queryRunner.query(`
        UPDATE "stays" SET
          has_parking              = $1,
          has_bathtub              = $2,
          has_breakfast            = $3,
          has_tv                   = $4,
          has_bbq                  = $5,
          allows_cooking           = $6,
          allows_pets              = $7,
          is_wheelchair_accessible = $8
        WHERE naver_place_id = $9
      `, [r.park, r.bathtub, r.breakfast, r.tv, r.bbq, r.cooking, r.pets, r.wheelchair, r.id]);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      UPDATE "stays" SET
        has_parking = false, has_bathtub = false, has_breakfast = false,
        has_tv = false, has_bbq = false, allows_cooking = false,
        allows_pets = false, is_wheelchair_accessible = false
      WHERE naver_place_id IN (
        '11728066','11609515','12899202','11658829','12934753','11797085',
        '11386454','1736329630','1264952218','132563442','1540977096',
        '1803909285','1110136938','1414207876','1927958707','1402810575',
        '35150031','2024278058','1121487897','2041034954'
      )
    `);
  }
}
