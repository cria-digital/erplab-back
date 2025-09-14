import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPasswordResetFields1757842882650 implements MigrationInterface {
  name = 'AddPasswordResetFields1757842882650';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "usuarios" ADD "reset_password_token" character varying(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "usuarios" ADD "reset_password_expires" TIMESTAMP`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "usuarios" DROP COLUMN "reset_password_expires"`,
    );
    await queryRunner.query(
      `ALTER TABLE "usuarios" DROP COLUMN "reset_password_token"`,
    );
  }
}
