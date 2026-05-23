import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddNewStays1747353600037 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO "stays" (
        "district_id", "stay_category_id", "name",
        "has_parking", "has_bathtub", "has_breakfast", "has_tv", "has_bbq",
        "allows_cooking", "allows_pets", "is_wheelchair_accessible",
        "image_url", "address", "latitude", "longitude", "naver_place_id"
      ) VALUES
        (189, 3, '에스앤비 풀빌라',
         true, true, true, true, true, true, true, true,
         '', '경상북도 경주시', 35.8440, 129.2167, '1622980709'),

        (189, 3, '고대안풀빌라펜션',
         true, true, false, true, true, true, false, false,
         '', '경상북도 경주시', 35.8440, 129.2167, '1422196607'),

        (189, 3, '글램독 애견펜션 경주점',
         true, false, false, true, true, true, true, false,
         '', '경상북도 경주시', 35.8440, 129.2167, '1579761664'),

        (189, 1, '키녹 경주',
         true, true, true, true, false, false, true, false,
         '', '경상북도 경주시', 35.8440, 129.2167, '1593058332')
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM "stays"
      WHERE naver_place_id IN ('1622980709','1422196607','1579761664','1593058332')
    `);
  }
}
