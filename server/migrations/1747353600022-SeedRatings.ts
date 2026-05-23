import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * 스킵: 1747353600040-ReSeedAllRatings 에서 전체 재생성
 */
export class SeedRatings1747353600022 implements MigrationInterface {
  public async up(_queryRunner: QueryRunner): Promise<void> {
    // no-op
  }

  public async down(_queryRunner: QueryRunner): Promise<void> {
    // no-op
  }
}
