import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIntegracaoAndUnidadesToAdquirentes1764200000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Adicionar campo integracao_id na tabela adquirentes
    await queryRunner.query(`
      ALTER TABLE "adquirentes"
      ADD COLUMN "integracao_id" uuid NULL
    `);

    // 2. Criar FK para integracoes
    await queryRunner.query(`
      ALTER TABLE "adquirentes"
      ADD CONSTRAINT "FK_adquirente_integracao"
      FOREIGN KEY ("integracao_id")
      REFERENCES "integracoes"("id")
      ON DELETE SET NULL
      ON UPDATE NO ACTION
    `);

    // 3. Criar tabela intermediária para adquirentes_unidades
    await queryRunner.query(`
      CREATE TABLE "adquirentes_unidades" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "adquirente_id" uuid NOT NULL,
        "unidade_saude_id" uuid NOT NULL,
        "ativo" boolean DEFAULT true,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_adquirentes_unidades" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_adquirente_unidade" UNIQUE ("adquirente_id", "unidade_saude_id"),
        CONSTRAINT "FK_adquirente_unidade_adquirente" FOREIGN KEY ("adquirente_id") REFERENCES "adquirentes"("id") ON DELETE CASCADE ON UPDATE NO ACTION,
        CONSTRAINT "FK_adquirente_unidade_unidade" FOREIGN KEY ("unidade_saude_id") REFERENCES "unidades_saude"("id") ON DELETE CASCADE ON UPDATE NO ACTION
      )
    `);

    // 4. Criar índices
    await queryRunner.query(
      `CREATE INDEX "IDX_adquirente_integracao" ON "adquirentes" ("integracao_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_adquirente_unidade_adquirente" ON "adquirentes_unidades" ("adquirente_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_adquirente_unidade_unidade" ON "adquirentes_unidades" ("unidade_saude_id")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remover índices
    await queryRunner.query(
      `DROP INDEX IF EXISTS "public"."IDX_adquirente_unidade_unidade"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "public"."IDX_adquirente_unidade_adquirente"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "public"."IDX_adquirente_integracao"`,
    );

    // Remover tabela intermediária
    await queryRunner.query(`DROP TABLE IF EXISTS "adquirentes_unidades"`);

    // Remover FK e coluna da tabela adquirentes
    await queryRunner.query(`
      ALTER TABLE "adquirentes"
      DROP CONSTRAINT IF EXISTS "FK_adquirente_integracao"
    `);

    await queryRunner.query(`
      ALTER TABLE "adquirentes"
      DROP COLUMN IF EXISTS "integracao_id"
    `);
  }
}
