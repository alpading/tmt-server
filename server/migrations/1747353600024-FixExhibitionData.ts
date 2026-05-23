import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * 문화/전시형 정제: 유적지와 경주엑스포공원의 is_exhibition을 false로 수정
 *
 * '문화/전시형' = 박물관, 미술관, 공연, 뮤지컬, 콘서트, 스포츠 관람
 * 유적지(불국사, 석굴암 등)와 경주엑스포공원은 해당 카테고리가 아님
 */
export class FixExhibitionData1747353600024 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      UPDATE "activities"
      SET is_exhibition = false
      WHERE name IN (
        '불국사', '석굴암', '첨성대', '동궁과월지', '대릉원',
        '오릉', '포석정', '감은사지', '분황사', '양동마을',
        '옥산서원', '계림', '통일전', '문무대왕릉', '경주엑스포공원'
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      UPDATE "activities"
      SET is_exhibition = true
      WHERE name IN (
        '불국사', '석굴암', '첨성대', '동궁과월지', '대릉원',
        '오릉', '포석정', '감은사지', '분황사', '양동마을',
        '옥산서원', '계림', '통일전', '문무대왕릉', '경주엑스포공원'
      )
    `);
  }
}
