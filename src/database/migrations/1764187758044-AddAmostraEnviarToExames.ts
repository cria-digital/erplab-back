import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAmostraEnviarToExames1764187758044
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Adicionar coluna amostra_enviar_id
    const hasColumn = await queryRunner.hasColumn(
      'exames',
      'amostra_enviar_id',
    );
    if (!hasColumn) {
      await queryRunner.query(`
        ALTER TABLE "exames"
        ADD COLUMN "amostra_enviar_id" uuid NULL
      `);

      // Adicionar comentário
      await queryRunner.query(`
        COMMENT ON COLUMN "exames"."amostra_enviar_id" IS 'FK para alternativa do campo amostra_enviar (soro, plasma, etc)'
      `);
    }

    // FK será criada quando a tabela alternativas_campos_formulario existir
    // Por enquanto a coluna fica sem FK
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remover FK se existir
    try {
      await queryRunner.query(`
        ALTER TABLE "exames"
        DROP CONSTRAINT IF EXISTS "FK_exames_amostra_enviar"
      `);
    } catch {
      // FK não existia
    }

    // Remover coluna
    const hasColumn = await queryRunner.hasColumn(
      'exames',
      'amostra_enviar_id',
    );
    if (hasColumn) {
      await queryRunner.query(`
        ALTER TABLE "exames"
        DROP COLUMN "amostra_enviar_id"
      `);
    }
  }
}
