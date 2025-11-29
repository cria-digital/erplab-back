import { MigrationInterface, QueryRunner } from 'typeorm';

export class MakeKitEmpresaIdNullable1764351100000
  implements MigrationInterface
{
  name = 'MakeKitEmpresaIdNullable1764351100000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Torna a coluna empresa_id nullable na tabela kits
    await queryRunner.query(
      `ALTER TABLE "kits" ALTER COLUMN "empresa_id" DROP NOT NULL`,
    );

    await queryRunner.query(
      `COMMENT ON COLUMN "kits"."empresa_id" IS 'ID da empresa associada ao kit (opcional por enquanto)'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Reverte: torna a coluna NOT NULL novamente
    // Primeiro precisamos garantir que não há valores NULL
    await queryRunner.query(
      `UPDATE "kits" SET "empresa_id" = (SELECT id FROM "empresas" LIMIT 1) WHERE "empresa_id" IS NULL`,
    );

    await queryRunner.query(
      `ALTER TABLE "kits" ALTER COLUMN "empresa_id" SET NOT NULL`,
    );

    await queryRunner.query(
      `COMMENT ON COLUMN "kits"."empresa_id" IS 'ID da empresa associada ao kit'`,
    );
  }
}
