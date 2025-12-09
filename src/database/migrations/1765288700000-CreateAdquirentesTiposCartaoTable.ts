import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAdquirentesTiposCartaoTable1765288700000
  implements MigrationInterface
{
  name = 'CreateAdquirentesTiposCartaoTable1765288700000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 0. Adicionar valor 'tipo_cartao' ao enum de campos de formulário
    await queryRunner.query(
      `ALTER TYPE "campos_formulario_nome_campo_enum" ADD VALUE IF NOT EXISTS 'tipo_cartao'`,
    );

    // 1. Remover coluna tipos_cartao_suportados se existir (era um array de enum)
    await queryRunner.query(`
      ALTER TABLE "adquirentes"
      DROP COLUMN IF EXISTS "tipos_cartao_suportados"
    `);

    // 2. Remover o enum type se existir
    await queryRunner.query(`
      DROP TYPE IF EXISTS "public"."adquirentes_tipos_cartao_suportados_enum"
    `);

    // 3. Criar tabela intermediária para tipos de cartão
    await queryRunner.query(`
      CREATE TABLE "adquirentes_tipos_cartao" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "adquirente_id" uuid NOT NULL,
        "tipo_cartao_id" uuid NOT NULL,
        "ativo" boolean DEFAULT true,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_adquirentes_tipos_cartao" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_adquirente_tipo_cartao" UNIQUE ("adquirente_id", "tipo_cartao_id"),
        CONSTRAINT "FK_adquirente_tipo_cartao_adquirente" FOREIGN KEY ("adquirente_id") REFERENCES "adquirentes"("id") ON DELETE CASCADE ON UPDATE NO ACTION,
        CONSTRAINT "FK_adquirente_tipo_cartao_alternativa" FOREIGN KEY ("tipo_cartao_id") REFERENCES "alternativas_campo_formulario"("id") ON DELETE CASCADE ON UPDATE NO ACTION
      )
    `);

    // 4. Criar índices
    await queryRunner.query(
      `CREATE INDEX "IDX_adquirente_tipo_cartao_adquirente" ON "adquirentes_tipos_cartao" ("adquirente_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_adquirente_tipo_cartao_tipo" ON "adquirentes_tipos_cartao" ("tipo_cartao_id")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // 1. Remover índices
    await queryRunner.query(
      `DROP INDEX IF EXISTS "public"."IDX_adquirente_tipo_cartao_tipo"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "public"."IDX_adquirente_tipo_cartao_adquirente"`,
    );

    // 2. Remover tabela intermediária
    await queryRunner.query(`DROP TABLE IF EXISTS "adquirentes_tipos_cartao"`);

    // 3. Recriar enum de tipos de cartão
    await queryRunner.query(`
      CREATE TYPE "public"."adquirentes_tipos_cartao_suportados_enum" AS ENUM (
        'mastercard', 'visa', 'elo', 'american_express', 'hipercard', 'diners', 'pix', 'outro'
      )
    `);

    // 4. Recriar coluna tipos_cartao_suportados como array
    await queryRunner.query(`
      ALTER TABLE "adquirentes"
      ADD COLUMN "tipos_cartao_suportados" "public"."adquirentes_tipos_cartao_suportados_enum"[] DEFAULT '{}'
    `);
  }
}
