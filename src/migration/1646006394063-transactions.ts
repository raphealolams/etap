import { MigrationInterface, QueryRunner } from 'typeorm';

export class transactions1646006394063 implements MigrationInterface {
  name = 'transactions1646006394063';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transactions" ALTER COLUMN "amount" TYPE numeric`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallets" ALTER COLUMN "available_balance" TYPE numeric`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallets" ALTER COLUMN "total_balance" TYPE numeric`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "wallets" ALTER COLUMN "total_balance" TYPE numeric(2,2)`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallets" ALTER COLUMN "available_balance" TYPE numeric(2,2)`,
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" ALTER COLUMN "amount" TYPE numeric(2,2)`,
    );
  }
}
