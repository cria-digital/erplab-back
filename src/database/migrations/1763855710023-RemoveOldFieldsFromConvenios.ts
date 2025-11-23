import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveOldFieldsFromConvenios1763855710023
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Remove índices
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_34d8070cf1f668dd197cb5a372"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_1c7842a1c9b419f3d5cc463e28"`,
    );

    // Remove campos que vêm de empresa (duplicados)
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN IF EXISTS "razao_social"`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN IF EXISTS "cnpj"`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN IF EXISTS "telefone"`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN IF EXISTS "email"`,
    );

    // Remove campos de integração API (não estão na entidade)
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN IF EXISTS "tem_integracao_api"`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN IF EXISTS "url_api"`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN IF EXISTS "token_api"`,
    );

    // Remove campos de autorização (não estão na entidade)
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN IF EXISTS "requer_autorizacao"`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN IF EXISTS "requer_senha"`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN IF EXISTS "validade_guia_dias"`,
    );

    // Remove campos de faturamento antigos (não estão na entidade)
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN IF EXISTS "tipo_faturamento"`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN IF EXISTS "portal_envio"`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN IF EXISTS "dia_fechamento"`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN IF EXISTS "prazo_pagamento_dias"`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN IF EXISTS "percentual_desconto"`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN IF EXISTS "tabela_precos"`,
    );

    // Remove campos de contato duplicados
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN IF EXISTS "contato_nome"`,
    );

    // Remove campos de observações duplicados
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN IF EXISTS "observacoes"`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN IF EXISTS "regras_especificas"`,
    );

    // Remove campo de status (usa campo "ativo" da entidade)
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN IF EXISTS "status"`,
    );

    // Remove campo codigo que foi removido
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN IF EXISTS "codigo"`,
    );

    // Remove ENUMs antigos
    await queryRunner.query(
      `DROP TYPE IF EXISTS "public"."convenios_tipo_faturamento_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE IF EXISTS "public"."convenios_status_enum"`,
    );

    // Remove constraint unique do codigo
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP CONSTRAINT IF EXISTS "UQ_1c7842a1c9b419f3d5cc463e285"`,
    );
  }

  public async down(_queryRunner: QueryRunner): Promise<void> {
    // Não implementar down - campos antigos não devem voltar
    console.log(
      'Rollback não implementado - campos antigos não devem ser restaurados',
    );
  }
}
