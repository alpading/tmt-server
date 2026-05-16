import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRoleAndRefreshToken1747353600001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE "role_enum" AS ENUM ('USER', 'ADMIN')`);
    await queryRunner.query(`ALTER TABLE "users" ADD COLUMN "role" "role_enum" NOT NULL DEFAULT 'USER'`);
    await queryRunner.query(`ALTER TABLE "users" ADD COLUMN "refresh_token" TEXT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "refresh_token"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "role"`);
    await queryRunner.query(`DROP TYPE "role_enum"`);
  }
}
