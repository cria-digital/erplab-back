import { MigrationInterface, QueryRunner } from 'typeorm';

export class SimplifyEquipamentosAndDropImobilizados1764560000000
  implements MigrationInterface
{
  name = 'SimplifyEquipamentosAndDropImobilizados1764560000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Adicionar coluna codigo_interno
    await queryRunner.query(
      `ALTER TABLE "equipamentos" ADD COLUMN IF NOT EXISTS "codigo_interno" character varying(50)`,
    );

    // 2. Copiar dados de patrimonio para codigo_interno
    await queryRunner.query(
      `UPDATE "equipamentos" SET "codigo_interno" = "patrimonio" WHERE "codigo_interno" IS NULL`,
    );

    // 3. Adicionar coluna numeracao (para número de série/patrimônio)
    await queryRunner.query(
      `ALTER TABLE "equipamentos" ADD COLUMN IF NOT EXISTS "numeracao" character varying(100)`,
    );

    // 4. Copiar numero_serie para numeracao
    await queryRunner.query(
      `UPDATE "equipamentos" SET "numeracao" = "numero_serie" WHERE "numeracao" IS NULL AND "numero_serie" IS NOT NULL`,
    );

    // 5. Tornar codigo_interno NOT NULL e UNIQUE
    await queryRunner.query(
      `ALTER TABLE "equipamentos" ALTER COLUMN "codigo_interno" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "equipamentos" ADD CONSTRAINT "UQ_equipamentos_codigo_interno" UNIQUE ("codigo_interno")`,
    );

    // 6. Remover constraint unique antiga de patrimonio
    await queryRunner.query(
      `ALTER TABLE "equipamentos" DROP CONSTRAINT IF EXISTS "UQ_equipamentos_patrimonio"`,
    );
    await queryRunner.query(
      `ALTER TABLE "equipamentos" DROP CONSTRAINT IF EXISTS "equipamentos_patrimonio_key"`,
    );

    // 7. Remover índices antigos
    await queryRunner.query(
      `DROP INDEX IF EXISTS "public"."IDX_equipamentos_patrimonio"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "public"."IDX_equipamentos_nome"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "public"."IDX_equipamentos_sala_id"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "public"."IDX_equipamentos_fornecedor_id"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "public"."IDX_equipamentos_situacao"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "public"."IDX_equipamentos_unidade_id"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "public"."IDX_equipamentos_empresa_id"`,
    );

    // 8. Remover FK de fornecedor
    await queryRunner.query(
      `ALTER TABLE "equipamentos" DROP CONSTRAINT IF EXISTS "FK_equipamentos_fornecedor"`,
    );

    // 9. Remover colunas antigas
    await queryRunner.query(
      `ALTER TABLE "equipamentos" DROP COLUMN IF EXISTS "patrimonio"`,
    );
    await queryRunner.query(
      `ALTER TABLE "equipamentos" DROP COLUMN IF EXISTS "marca"`,
    );
    await queryRunner.query(
      `ALTER TABLE "equipamentos" DROP COLUMN IF EXISTS "modelo"`,
    );
    await queryRunner.query(
      `ALTER TABLE "equipamentos" DROP COLUMN IF EXISTS "numero_serie"`,
    );
    await queryRunner.query(
      `ALTER TABLE "equipamentos" DROP COLUMN IF EXISTS "fornecedor_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "equipamentos" DROP COLUMN IF EXISTS "data_aquisicao"`,
    );
    await queryRunner.query(
      `ALTER TABLE "equipamentos" DROP COLUMN IF EXISTS "valor_aquisicao"`,
    );
    await queryRunner.query(
      `ALTER TABLE "equipamentos" DROP COLUMN IF EXISTS "data_ultima_manutencao"`,
    );
    await queryRunner.query(
      `ALTER TABLE "equipamentos" DROP COLUMN IF EXISTS "data_proxima_manutencao"`,
    );
    await queryRunner.query(
      `ALTER TABLE "equipamentos" DROP COLUMN IF EXISTS "periodicidade_manutencao_dias"`,
    );
    await queryRunner.query(
      `ALTER TABLE "equipamentos" DROP COLUMN IF EXISTS "situacao"`,
    );
    await queryRunner.query(
      `ALTER TABLE "equipamentos" DROP COLUMN IF EXISTS "observacoes"`,
    );
    await queryRunner.query(
      `ALTER TABLE "equipamentos" DROP COLUMN IF EXISTS "empresa_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "equipamentos" DROP COLUMN IF EXISTS "criado_por"`,
    );
    await queryRunner.query(
      `ALTER TABLE "equipamentos" DROP COLUMN IF EXISTS "atualizado_por"`,
    );

    // 10. Dropar enum de situacao
    await queryRunner.query(
      `DROP TYPE IF EXISTS "public"."equipamentos_situacao_enum"`,
    );

    // 11. Criar novos índices
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_equipamentos_codigo_interno" ON "equipamentos" ("codigo_interno")`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_equipamentos_nome" ON "equipamentos" ("nome")`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_equipamentos_unidade_id" ON "equipamentos" ("unidade_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_equipamentos_sala_id" ON "equipamentos" ("sala_id")`,
    );

    // ============================================
    // IMOBILIZADOS - Dropar tabela
    // ============================================

    // 12. Remover FK de imobilizados
    await queryRunner.query(
      `ALTER TABLE "imobilizados" DROP CONSTRAINT IF EXISTS "FK_imobilizados_fornecedor"`,
    );
    await queryRunner.query(
      `ALTER TABLE "imobilizados" DROP CONSTRAINT IF EXISTS "FK_imobilizados_sala"`,
    );
    await queryRunner.query(
      `ALTER TABLE "imobilizados" DROP CONSTRAINT IF EXISTS "FK_imobilizados_unidade"`,
    );

    // 13. Dropar tabela imobilizados
    await queryRunner.query(`DROP TABLE IF EXISTS "imobilizados"`);

    // 14. Dropar enums de imobilizados
    await queryRunner.query(
      `DROP TYPE IF EXISTS "public"."imobilizados_categoria_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE IF EXISTS "public"."imobilizados_situacao_enum"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // 1. Recriar enums de imobilizados
    await queryRunner.query(
      `CREATE TYPE "public"."imobilizados_categoria_enum" AS ENUM('mobiliario', 'equipamento', 'veiculo', 'imovel', 'software', 'outros')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."imobilizados_situacao_enum" AS ENUM('ativo', 'baixa', 'venda', 'doacao', 'descarte')`,
    );

    // 2. Recriar tabela imobilizados
    await queryRunner.query(`
      CREATE TABLE "imobilizados" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "patrimonio" character varying(50) NOT NULL,
        "descricao" character varying(255) NOT NULL,
        "categoria" "public"."imobilizados_categoria_enum" NOT NULL,
        "data_aquisicao" date NOT NULL,
        "valor_aquisicao" decimal(10,2) NOT NULL,
        "numero_nota_fiscal" character varying(100),
        "fornecedor_id" uuid,
        "sala_id" uuid,
        "vida_util_anos" integer NOT NULL,
        "taxa_depreciacao_anual" decimal(5,2) NOT NULL,
        "depreciacao_acumulada" decimal(10,2) DEFAULT 0,
        "valor_residual" decimal(10,2),
        "situacao" "public"."imobilizados_situacao_enum" DEFAULT 'ativo',
        "data_baixa" date,
        "motivo_baixa" text,
        "valor_baixa" decimal(10,2),
        "observacoes" text,
        "ativo" boolean DEFAULT true,
        "unidade_id" uuid NOT NULL,
        "empresa_id" uuid,
        "criado_por" uuid NOT NULL,
        "atualizado_por" uuid NOT NULL,
        "criado_em" TIMESTAMP NOT NULL DEFAULT now(),
        "atualizado_em" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_imobilizados" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_imobilizados_patrimonio" UNIQUE ("patrimonio")
      )
    `);

    // 3. Recriar enum de equipamentos
    await queryRunner.query(
      `CREATE TYPE "public"."equipamentos_situacao_enum" AS ENUM('ativo', 'manutencao', 'inativo', 'descartado')`,
    );

    // 4. Adicionar colunas antigas de volta em equipamentos
    await queryRunner.query(
      `ALTER TABLE "equipamentos" ADD COLUMN "patrimonio" character varying(50)`,
    );
    await queryRunner.query(
      `ALTER TABLE "equipamentos" ADD COLUMN "marca" character varying(100)`,
    );
    await queryRunner.query(
      `ALTER TABLE "equipamentos" ADD COLUMN "modelo" character varying(100)`,
    );
    await queryRunner.query(
      `ALTER TABLE "equipamentos" ADD COLUMN "numero_serie" character varying(100)`,
    );
    await queryRunner.query(
      `ALTER TABLE "equipamentos" ADD COLUMN "fornecedor_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "equipamentos" ADD COLUMN "data_aquisicao" date`,
    );
    await queryRunner.query(
      `ALTER TABLE "equipamentos" ADD COLUMN "valor_aquisicao" decimal(10,2)`,
    );
    await queryRunner.query(
      `ALTER TABLE "equipamentos" ADD COLUMN "data_ultima_manutencao" date`,
    );
    await queryRunner.query(
      `ALTER TABLE "equipamentos" ADD COLUMN "data_proxima_manutencao" date`,
    );
    await queryRunner.query(
      `ALTER TABLE "equipamentos" ADD COLUMN "periodicidade_manutencao_dias" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "equipamentos" ADD COLUMN "situacao" "public"."equipamentos_situacao_enum" DEFAULT 'ativo'`,
    );
    await queryRunner.query(
      `ALTER TABLE "equipamentos" ADD COLUMN "observacoes" text`,
    );
    await queryRunner.query(
      `ALTER TABLE "equipamentos" ADD COLUMN "empresa_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "equipamentos" ADD COLUMN "criado_por" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "equipamentos" ADD COLUMN "atualizado_por" uuid`,
    );

    // 5. Copiar dados de volta
    await queryRunner.query(
      `UPDATE "equipamentos" SET "patrimonio" = "codigo_interno"`,
    );
    await queryRunner.query(
      `UPDATE "equipamentos" SET "numero_serie" = "numeracao"`,
    );

    // 6. Remover novas colunas
    await queryRunner.query(
      `ALTER TABLE "equipamentos" DROP CONSTRAINT IF EXISTS "UQ_equipamentos_codigo_interno"`,
    );
    await queryRunner.query(
      `ALTER TABLE "equipamentos" DROP COLUMN IF EXISTS "codigo_interno"`,
    );
    await queryRunner.query(
      `ALTER TABLE "equipamentos" DROP COLUMN IF EXISTS "numeracao"`,
    );

    // 7. Tornar patrimonio NOT NULL e UNIQUE
    await queryRunner.query(
      `ALTER TABLE "equipamentos" ALTER COLUMN "patrimonio" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "equipamentos" ADD CONSTRAINT "UQ_equipamentos_patrimonio" UNIQUE ("patrimonio")`,
    );
  }
}
