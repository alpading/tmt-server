import { MigrationInterface, QueryRunner } from 'typeorm';

export class DropAddressColumn1747353600046 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "restaurants" DROP COLUMN "address"`);
    await queryRunner.query(`ALTER TABLE "stays"        DROP COLUMN "address"`);
    await queryRunner.query(`ALTER TABLE "activities"   DROP COLUMN "address"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "restaurants" ADD COLUMN "address" VARCHAR(200) NOT NULL DEFAULT ''`);
    await queryRunner.query(`ALTER TABLE "stays"        ADD COLUMN "address" VARCHAR(200) NOT NULL DEFAULT ''`);
    await queryRunner.query(`ALTER TABLE "activities"   ADD COLUMN "address" VARCHAR(200) NOT NULL DEFAULT ''`);
  }
}
