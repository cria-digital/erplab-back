import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixExamesLaboratoriosApoioFK1766050000000
  implements MigrationInterface
{
  name = 'FixExamesLaboratoriosApoioFK1766050000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 0. Limpa dados órfãos - IDs que existem na tabela antiga mas não na nova
    // Isso evita violação de FK ao criar a nova constraint
    // exames_laboratorios_apoio tem NOT NULL em laboratorio_apoio_id, então deleta os órfãos
    await queryRunner.query(`
      DELETE FROM "exames_laboratorios_apoio"
      WHERE "laboratorio_apoio_id" IS NOT NULL
      AND "laboratorio_apoio_id" NOT IN (SELECT id FROM "laboratorios")
    `);

    // exames_unidades pode ter NULL, então apenas seta para NULL os órfãos
    await queryRunner.query(`
      UPDATE "exames_unidades"
      SET "laboratorio_apoio_id" = NULL
      WHERE "laboratorio_apoio_id" IS NOT NULL
      AND "laboratorio_apoio_id" NOT IN (SELECT id FROM "laboratorios")
    `);

    // 1. Corrige FK de exames_laboratorios_apoio
    await queryRunner.query(`
      ALTER TABLE "exames_laboratorios_apoio"
      DROP CONSTRAINT IF EXISTS "FK_exames_laboratorios_apoio_lab"
    `);

    await queryRunner.query(`
      ALTER TABLE "exames_laboratorios_apoio"
      ADD CONSTRAINT "FK_exames_laboratorios_apoio_lab"
      FOREIGN KEY ("laboratorio_apoio_id")
      REFERENCES "laboratorios"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    // 2. Corrige FK de exames_unidades
    await queryRunner.query(`
      ALTER TABLE "exames_unidades"
      DROP CONSTRAINT IF EXISTS "FK_exames_unidades_laboratorio_apoio"
    `);

    await queryRunner.query(`
      ALTER TABLE "exames_unidades"
      ADD CONSTRAINT "FK_exames_unidades_laboratorio_apoio"
      FOREIGN KEY ("laboratorio_apoio_id")
      REFERENCES "laboratorios"("id") ON DELETE SET NULL ON UPDATE NO ACTION
    `);

    // 3. Remove a tabela antiga laboratorios_apoio (não tem mais utilidade)
    await queryRunner.query(
      `DROP TABLE IF EXISTS "laboratorios_apoio" CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Recria a tabela laboratorios_apoio
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "laboratorios_apoio" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "codigo" varchar(20) NOT NULL,
        "nome" varchar(255) NOT NULL,
        "razao_social" varchar(255) NOT NULL,
        "cnpj" varchar(14),
        "status" varchar(20) DEFAULT 'ativo',
        "criado_em" TIMESTAMP DEFAULT now(),
        "atualizado_em" TIMESTAMP DEFAULT now(),
        CONSTRAINT "PK_laboratorios_apoio" PRIMARY KEY ("id")
      )
    `);

    // Reverte exames_laboratorios_apoio
    await queryRunner.query(`
      ALTER TABLE "exames_laboratorios_apoio"
      DROP CONSTRAINT IF EXISTS "FK_exames_laboratorios_apoio_lab"
    `);

    await queryRunner.query(`
      ALTER TABLE "exames_laboratorios_apoio"
      ADD CONSTRAINT "FK_exames_laboratorios_apoio_lab"
      FOREIGN KEY ("laboratorio_apoio_id")
      REFERENCES "laboratorios_apoio"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    // Reverte exames_unidades
    await queryRunner.query(`
      ALTER TABLE "exames_unidades"
      DROP CONSTRAINT IF EXISTS "FK_exames_unidades_laboratorio_apoio"
    `);

    await queryRunner.query(`
      ALTER TABLE "exames_unidades"
      ADD CONSTRAINT "FK_exames_unidades_laboratorio_apoio"
      FOREIGN KEY ("laboratorio_apoio_id")
      REFERENCES "laboratorios_apoio"("id") ON DELETE SET NULL ON UPDATE NO ACTION
    `);
  }
}
