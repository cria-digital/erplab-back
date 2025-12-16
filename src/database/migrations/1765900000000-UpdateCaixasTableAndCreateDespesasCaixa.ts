import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateCaixasTableAndCreateDespesasCaixa1765900000000
  implements MigrationInterface
{
  name = 'UpdateCaixasTableAndCreateDespesasCaixa1765900000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // === ATUALIZAR TABELA CAIXAS ===

    // Remover colunas antigas
    await queryRunner.query(
      `ALTER TABLE "caixas" DROP COLUMN IF EXISTS "valor_abertura"`,
    );
    await queryRunner.query(
      `ALTER TABLE "caixas" DROP COLUMN IF EXISTS "valor_fechamento"`,
    );
    await queryRunner.query(
      `ALTER TABLE "caixas" DROP COLUMN IF EXISTS "observacao_fechamento"`,
    );

    // Adicionar novas colunas - Dinheiro em Espécie
    await queryRunner.query(`
      ALTER TABLE "caixas" ADD COLUMN "abertura_especie" numeric(10,2) NOT NULL DEFAULT 0
    `);
    await queryRunner.query(`
      ALTER TABLE "caixas" ADD COLUMN "total_entradas_especie" numeric(10,2) DEFAULT 0
    `);
    await queryRunner.query(`
      ALTER TABLE "caixas" ADD COLUMN "total_saidas_especie" numeric(10,2) DEFAULT 0
    `);
    await queryRunner.query(`
      ALTER TABLE "caixas" ADD COLUMN "sangria_especie" numeric(10,2) DEFAULT 0
    `);
    await queryRunner.query(`
      ALTER TABLE "caixas" ADD COLUMN "saldo_proximo_dia" numeric(10,2)
    `);

    // Adicionar novas colunas - Saldo Geral
    await queryRunner.query(`
      ALTER TABLE "caixas" ADD COLUMN "total_entradas_credito" numeric(10,2) DEFAULT 0
    `);
    await queryRunner.query(`
      ALTER TABLE "caixas" ADD COLUMN "total_entradas_debito" numeric(10,2) DEFAULT 0
    `);
    await queryRunner.query(`
      ALTER TABLE "caixas" ADD COLUMN "total_entradas_pix" numeric(10,2) DEFAULT 0
    `);
    await queryRunner.query(`
      ALTER TABLE "caixas" ADD COLUMN "saldo_final" numeric(10,2)
    `);

    // === CRIAR TABELA DESPESAS_CAIXA ===
    await queryRunner.query(`
      CREATE TABLE "despesas_caixa" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "caixa_id" uuid NOT NULL,
        "nome" character varying(255) NOT NULL,
        "valor" numeric(10,2) NOT NULL,
        "tipo_despesa" character varying(100) NOT NULL,
        "comprovante" character varying(500),
        "tenant_id" uuid,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_despesas_caixa_id" PRIMARY KEY ("id")
      )
    `);

    // Criar índices para despesas_caixa
    await queryRunner.query(
      `CREATE INDEX "IDX_despesas_caixa_caixa_id" ON "despesas_caixa" ("caixa_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_despesas_caixa_tenant_id" ON "despesas_caixa" ("tenant_id")`,
    );

    // Criar foreign keys para despesas_caixa
    await queryRunner.query(`
      ALTER TABLE "despesas_caixa" ADD CONSTRAINT "FK_despesas_caixa_caixa"
      FOREIGN KEY ("caixa_id") REFERENCES "caixas"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "despesas_caixa" ADD CONSTRAINT "FK_despesas_caixa_tenant"
      FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // === REMOVER TABELA DESPESAS_CAIXA ===
    await queryRunner.query(
      `ALTER TABLE "despesas_caixa" DROP CONSTRAINT "FK_despesas_caixa_tenant"`,
    );
    await queryRunner.query(
      `ALTER TABLE "despesas_caixa" DROP CONSTRAINT "FK_despesas_caixa_caixa"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_despesas_caixa_tenant_id"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_despesas_caixa_caixa_id"`,
    );
    await queryRunner.query(`DROP TABLE "despesas_caixa"`);

    // === REVERTER TABELA CAIXAS ===

    // Remover novas colunas
    await queryRunner.query(`ALTER TABLE "caixas" DROP COLUMN "saldo_final"`);
    await queryRunner.query(
      `ALTER TABLE "caixas" DROP COLUMN "total_entradas_pix"`,
    );
    await queryRunner.query(
      `ALTER TABLE "caixas" DROP COLUMN "total_entradas_debito"`,
    );
    await queryRunner.query(
      `ALTER TABLE "caixas" DROP COLUMN "total_entradas_credito"`,
    );
    await queryRunner.query(
      `ALTER TABLE "caixas" DROP COLUMN "saldo_proximo_dia"`,
    );
    await queryRunner.query(
      `ALTER TABLE "caixas" DROP COLUMN "sangria_especie"`,
    );
    await queryRunner.query(
      `ALTER TABLE "caixas" DROP COLUMN "total_saidas_especie"`,
    );
    await queryRunner.query(
      `ALTER TABLE "caixas" DROP COLUMN "total_entradas_especie"`,
    );
    await queryRunner.query(
      `ALTER TABLE "caixas" DROP COLUMN "abertura_especie"`,
    );

    // Restaurar colunas antigas
    await queryRunner.query(`
      ALTER TABLE "caixas" ADD COLUMN "valor_abertura" numeric(10,2) NOT NULL DEFAULT 0
    `);
    await queryRunner.query(`
      ALTER TABLE "caixas" ADD COLUMN "valor_fechamento" numeric(10,2)
    `);
    await queryRunner.query(`
      ALTER TABLE "caixas" ADD COLUMN "observacao_fechamento" text
    `);
  }
}
