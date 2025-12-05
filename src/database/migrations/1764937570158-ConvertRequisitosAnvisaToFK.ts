import { MigrationInterface, QueryRunner } from 'typeorm';

export class ConvertRequisitosAnvisaToFK1764937570158
  implements MigrationInterface
{
  name = 'ConvertRequisitosAnvisaToFK1764937570158';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Remove a coluna antiga jsonb
    await queryRunner.query(`
      ALTER TABLE "exames" DROP COLUMN IF EXISTS "requisitos_anvisa"
    `);

    // Adiciona a nova coluna como FK para alternativas_campo_formulario
    await queryRunner.query(`
      ALTER TABLE "exames"
      ADD COLUMN "requisitos_anvisa_id" uuid NULL
    `);

    // Adiciona o comentário na coluna
    await queryRunner.query(`
      COMMENT ON COLUMN "exames"."requisitos_anvisa_id" IS 'ID do requisito ANVISA selecionado'
    `);

    // Cria a foreign key
    await queryRunner.query(`
      ALTER TABLE "exames"
      ADD CONSTRAINT "FK_exames_requisitos_anvisa"
      FOREIGN KEY ("requisitos_anvisa_id")
      REFERENCES "alternativas_campo_formulario"("id")
      ON DELETE SET NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove a foreign key
    await queryRunner.query(`
      ALTER TABLE "exames" DROP CONSTRAINT IF EXISTS "FK_exames_requisitos_anvisa"
    `);

    // Remove a coluna FK
    await queryRunner.query(`
      ALTER TABLE "exames" DROP COLUMN IF EXISTS "requisitos_anvisa_id"
    `);

    // Restaura a coluna jsonb original
    await queryRunner.query(`
      ALTER TABLE "exames"
      ADD COLUMN "requisitos_anvisa" jsonb NULL
    `);

    await queryRunner.query(`
      COMMENT ON COLUMN "exames"."requisitos_anvisa" IS 'Requisitos da ANVISA/Normas técnicas'
    `);
  }
}
