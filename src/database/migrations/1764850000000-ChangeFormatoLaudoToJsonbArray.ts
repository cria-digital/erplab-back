import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeFormatoLaudoToJsonbArray1764850000000
  implements MigrationInterface
{
  name = 'ChangeFormatoLaudoToJsonbArray1764850000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Tabela exames - Renomear e converter formato_laudo_id para formatos_laudo JSONB
    // Primeiro verificar se a coluna antiga existe
    const examesColExists = await queryRunner.query(`
      SELECT column_name FROM information_schema.columns
      WHERE table_name = 'exames' AND column_name = 'formato_laudo_id'
    `);

    if (examesColExists.length > 0) {
      // Remover a coluna antiga
      await queryRunner.query(
        `ALTER TABLE "exames" DROP COLUMN IF EXISTS "formato_laudo_id"`,
      );
    }

    // Verificar se a nova coluna já existe
    const examesNewColExists = await queryRunner.query(`
      SELECT column_name FROM information_schema.columns
      WHERE table_name = 'exames' AND column_name = 'formatos_laudo'
    `);

    if (examesNewColExists.length === 0) {
      // Adicionar a nova coluna JSONB
      await queryRunner.query(
        `ALTER TABLE "exames" ADD COLUMN "formatos_laudo" jsonb`,
      );

      // Adicionar comentário
      await queryRunner.query(
        `COMMENT ON COLUMN "exames"."formatos_laudo" IS 'Formatos de laudo aceitos (PDF, XML, HTML, TEXTO, FORMULARIO, DICOM)'`,
      );
    }

    // 2. Tabela exames_laboratorio_apoio - Mesma alteração
    const elaColExists = await queryRunner.query(`
      SELECT column_name FROM information_schema.columns
      WHERE table_name = 'exames_laboratorio_apoio' AND column_name = 'formato_laudo_id'
    `);

    if (elaColExists.length > 0) {
      // Remover a coluna antiga
      await queryRunner.query(
        `ALTER TABLE "exames_laboratorio_apoio" DROP COLUMN IF EXISTS "formato_laudo_id"`,
      );
    }

    // Verificar se a nova coluna já existe
    const elaNewColExists = await queryRunner.query(`
      SELECT column_name FROM information_schema.columns
      WHERE table_name = 'exames_laboratorio_apoio' AND column_name = 'formatos_laudo'
    `);

    if (elaNewColExists.length === 0) {
      // Adicionar a nova coluna JSONB
      await queryRunner.query(
        `ALTER TABLE "exames_laboratorio_apoio" ADD COLUMN "formatos_laudo" jsonb`,
      );

      // Adicionar comentário
      await queryRunner.query(
        `COMMENT ON COLUMN "exames_laboratorio_apoio"."formatos_laudo" IS 'Formatos de laudo aceitos (PDF, XML, HTML, TEXTO, FORMULARIO, DICOM)'`,
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Reverter: remover formatos_laudo e recriar formato_laudo_id

    // 1. Tabela exames
    await queryRunner.query(
      `ALTER TABLE "exames" DROP COLUMN IF EXISTS "formatos_laudo"`,
    );
    await queryRunner.query(
      `ALTER TABLE "exames" ADD COLUMN "formato_laudo_id" uuid`,
    );

    // 2. Tabela exames_laboratorio_apoio
    await queryRunner.query(
      `ALTER TABLE "exames_laboratorio_apoio" DROP COLUMN IF EXISTS "formatos_laudo"`,
    );
    await queryRunner.query(
      `ALTER TABLE "exames_laboratorio_apoio" ADD COLUMN "formato_laudo_id" uuid`,
    );
  }
}
