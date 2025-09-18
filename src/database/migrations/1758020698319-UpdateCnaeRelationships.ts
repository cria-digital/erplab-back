import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateCnaeRelationships1758020698319
  implements MigrationInterface
{
  name = 'UpdateCnaeRelationships1758020698319';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Remover colunas antigas de cnae_secundarios
    await queryRunner.query(
      `ALTER TABLE "cnae_secundarios" DROP COLUMN IF EXISTS "codigo_cnae"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cnae_secundarios" DROP COLUMN IF EXISTS "descricao"`,
    );

    // Adicionar nova coluna cnae_id em cnae_secundarios
    await queryRunner.query(
      `ALTER TABLE "cnae_secundarios" ADD "cnae_id" uuid`,
    );

    // Alterar tipo da coluna cnae_principal em unidades_saude
    await queryRunner.query(
      `ALTER TABLE "unidades_saude" ALTER COLUMN "cnae_principal" TYPE uuid USING NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "unidades_saude" RENAME COLUMN "cnae_principal" TO "cnae_principal_id"`,
    );

    // Adicionar foreign keys
    await queryRunner.query(
      `ALTER TABLE "cnae_secundarios" ADD CONSTRAINT "FK_cnae_secundarios_cnae" FOREIGN KEY ("cnae_id") REFERENCES "cnaes"("id") ON DELETE SET NULL ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "unidades_saude" ADD CONSTRAINT "FK_unidades_saude_cnae" FOREIGN KEY ("cnae_principal_id") REFERENCES "cnaes"("id") ON DELETE SET NULL ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remover foreign keys
    await queryRunner.query(
      `ALTER TABLE "unidades_saude" DROP CONSTRAINT IF EXISTS "FK_unidades_saude_cnae"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cnae_secundarios" DROP CONSTRAINT IF EXISTS "FK_cnae_secundarios_cnae"`,
    );

    // Reverter coluna em unidades_saude
    await queryRunner.query(
      `ALTER TABLE "unidades_saude" RENAME COLUMN "cnae_principal_id" TO "cnae_principal"`,
    );
    await queryRunner.query(
      `ALTER TABLE "unidades_saude" ALTER COLUMN "cnae_principal" TYPE character varying(10)`,
    );

    // Remover coluna cnae_id e adicionar colunas antigas em cnae_secundarios
    await queryRunner.query(
      `ALTER TABLE "cnae_secundarios" DROP COLUMN IF EXISTS "cnae_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cnae_secundarios" ADD "descricao" character varying(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "cnae_secundarios" ADD "codigo_cnae" character varying(10) NOT NULL DEFAULT ''`,
    );
  }
}
