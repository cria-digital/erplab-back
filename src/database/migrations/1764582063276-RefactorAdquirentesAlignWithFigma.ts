import { MigrationInterface, QueryRunner } from 'typeorm';

export class RefactorAdquirentesAlignWithFigma1764582063276
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Remover colunas que não estão no Figma
    await queryRunner.query(`
      ALTER TABLE "adquirentes"
      DROP COLUMN IF EXISTS "tipo_adquirente",
      DROP COLUMN IF EXISTS "codigo_estabelecimento",
      DROP COLUMN IF EXISTS "terminal_id",
      DROP COLUMN IF EXISTS "taxa_antecipacao",
      DROP COLUMN IF EXISTS "permite_parcelamento",
      DROP COLUMN IF EXISTS "parcela_maxima",
      DROP COLUMN IF EXISTS "valor_minimo_parcela",
      DROP COLUMN IF EXISTS "contato_comercial",
      DROP COLUMN IF EXISTS "telefone_suporte",
      DROP COLUMN IF EXISTS "email_suporte",
      DROP COLUMN IF EXISTS "observacoes"
    `);

    // 2. Remover o tipo enum antigo de tipo_adquirente se existir
    await queryRunner.query(`
      DROP TYPE IF EXISTS "adquirentes_tipo_adquirente_enum"
    `);

    // 3. Renomear prazo_recebimento para prazo_repasse e alterar tipo
    await queryRunner.query(`
      ALTER TABLE "adquirentes"
      DROP COLUMN IF EXISTS "prazo_recebimento"
    `);
    await queryRunner.query(`
      ALTER TABLE "adquirentes"
      ADD COLUMN IF NOT EXISTS "prazo_repasse" varchar(50) NULL
    `);

    // 4. Adicionar novas colunas do Figma (aba Integração)
    await queryRunner.query(`
      ALTER TABLE "adquirentes"
      ADD COLUMN IF NOT EXISTS "validade_configuracao_api" date NULL,
      ADD COLUMN IF NOT EXISTS "chave_contingencia" varchar(500) NULL
    `);

    // 5. Simplificar enum de status (remover bloqueado e em_analise)
    // Primeiro atualizar valores existentes
    await queryRunner.query(`
      UPDATE "adquirentes"
      SET "status" = 'inativo'
      WHERE "status" IN ('bloqueado', 'em_analise')
    `);

    // 6. Criar novo enum simplificado
    await queryRunner.query(`
      CREATE TYPE "adquirentes_status_enum_new" AS ENUM ('ativo', 'inativo')
    `);

    // 7. Remover DEFAULT antes de alterar tipo (PostgreSQL exige isso)
    await queryRunner.query(`
      ALTER TABLE "adquirentes"
      ALTER COLUMN "status" DROP DEFAULT
    `);

    // 8. Alterar coluna para usar novo enum
    await queryRunner.query(`
      ALTER TABLE "adquirentes"
      ALTER COLUMN "status" TYPE "adquirentes_status_enum_new"
      USING "status"::text::"adquirentes_status_enum_new"
    `);

    // 9. Restaurar DEFAULT
    await queryRunner.query(`
      ALTER TABLE "adquirentes"
      ALTER COLUMN "status" SET DEFAULT 'ativo'
    `);

    // 10. Remover enum antigo e renomear novo
    await queryRunner.query(`
      DROP TYPE IF EXISTS "adquirentes_status_enum"
    `);
    await queryRunner.query(`
      ALTER TYPE "adquirentes_status_enum_new" RENAME TO "adquirentes_status_enum"
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Reverter enum de status
    await queryRunner.query(`
      CREATE TYPE "adquirentes_status_enum_old" AS ENUM ('ativo', 'inativo', 'bloqueado', 'em_analise')
    `);
    // Remover DEFAULT antes de alterar tipo
    await queryRunner.query(`
      ALTER TABLE "adquirentes"
      ALTER COLUMN "status" DROP DEFAULT
    `);
    await queryRunner.query(`
      ALTER TABLE "adquirentes"
      ALTER COLUMN "status" TYPE "adquirentes_status_enum_old"
      USING "status"::text::"adquirentes_status_enum_old"
    `);
    // Restaurar DEFAULT
    await queryRunner.query(`
      ALTER TABLE "adquirentes"
      ALTER COLUMN "status" SET DEFAULT 'ativo'
    `);
    await queryRunner.query(`
      DROP TYPE IF EXISTS "adquirentes_status_enum"
    `);
    await queryRunner.query(`
      ALTER TYPE "adquirentes_status_enum_old" RENAME TO "adquirentes_status_enum"
    `);

    // Remover colunas novas
    await queryRunner.query(`
      ALTER TABLE "adquirentes"
      DROP COLUMN IF EXISTS "validade_configuracao_api",
      DROP COLUMN IF EXISTS "chave_contingencia",
      DROP COLUMN IF EXISTS "prazo_repasse"
    `);

    // Readicionar prazo_recebimento
    await queryRunner.query(`
      ALTER TABLE "adquirentes"
      ADD COLUMN "prazo_recebimento" int DEFAULT 30
    `);

    // Recriar tipo enum de tipo_adquirente
    await queryRunner.query(`
      CREATE TYPE "adquirentes_tipo_adquirente_enum" AS ENUM (
        'cielo', 'rede', 'getnet', 'stone', 'pagseguro',
        'mercadopago', 'safrapay', 'vero', 'outro'
      )
    `);

    // Readicionar colunas removidas
    await queryRunner.query(`
      ALTER TABLE "adquirentes"
      ADD COLUMN "tipo_adquirente" "adquirentes_tipo_adquirente_enum" NULL,
      ADD COLUMN "codigo_estabelecimento" varchar(50) NULL,
      ADD COLUMN "terminal_id" varchar(50) NULL,
      ADD COLUMN "taxa_antecipacao" decimal(5,2) NULL,
      ADD COLUMN "permite_parcelamento" boolean DEFAULT true,
      ADD COLUMN "parcela_maxima" int DEFAULT 12,
      ADD COLUMN "valor_minimo_parcela" decimal(10,2) DEFAULT 50,
      ADD COLUMN "contato_comercial" varchar(255) NULL,
      ADD COLUMN "telefone_suporte" varchar(20) NULL,
      ADD COLUMN "email_suporte" varchar(255) NULL,
      ADD COLUMN "observacoes" text NULL
    `);
  }
}
