import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCodigoCbhpmToExames1764769000880 implements MigrationInterface {
  name = 'AddCodigoCbhpmToExames1764769000880';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "exames" ADD "codigo_cbhpm" character varying(20)`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "exames"."codigo_cbhpm" IS 'Código CBHPM (Classificação Brasileira Hierarquizada de Procedimentos Médicos)'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "exames" DROP COLUMN "codigo_cbhpm"`);
  }
}
