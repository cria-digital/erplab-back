import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameExamesBooleanFields1734415200000
  implements MigrationInterface
{
  name = 'RenameExamesBooleanFields1734415200000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // === Tabela EXAMES ===

    // 1. Renomear 'peso' (int) para 'prioridade'
    await queryRunner.query(`
      ALTER TABLE "exames" RENAME COLUMN "peso" TO "prioridade"
    `);

    // 2. Renomear 'requer_peso' para 'peso'
    await queryRunner.query(`
      ALTER TABLE "exames" RENAME COLUMN "requer_peso" TO "peso"
    `);

    // 3. Renomear 'requer_altura' para 'altura'
    await queryRunner.query(`
      ALTER TABLE "exames" RENAME COLUMN "requer_altura" TO "altura"
    `);

    // 4. Renomear 'requer_volume' para 'volume'
    await queryRunner.query(`
      ALTER TABLE "exames" RENAME COLUMN "requer_volume" TO "volume"
    `);

    // Atualizar comentários das colunas na tabela exames
    await queryRunner.query(`
      COMMENT ON COLUMN "exames"."prioridade" IS 'Prioridade para ordenação'
    `);
    await queryRunner.query(`
      COMMENT ON COLUMN "exames"."peso" IS 'Se o exame requer peso do paciente'
    `);
    await queryRunner.query(`
      COMMENT ON COLUMN "exames"."altura" IS 'Se o exame requer altura do paciente'
    `);
    await queryRunner.query(`
      COMMENT ON COLUMN "exames"."volume" IS 'Se o exame requer volume específico'
    `);

    // 5. Remover colunas desnecessárias (altura_min, altura_max, volume_min, volume_ideal)
    await queryRunner.query(`
      ALTER TABLE "exames" DROP COLUMN IF EXISTS "altura_min"
    `);
    await queryRunner.query(`
      ALTER TABLE "exames" DROP COLUMN IF EXISTS "altura_max"
    `);
    await queryRunner.query(`
      ALTER TABLE "exames" DROP COLUMN IF EXISTS "volume_min"
    `);
    await queryRunner.query(`
      ALTER TABLE "exames" DROP COLUMN IF EXISTS "volume_ideal"
    `);

    // === Tabela EXAMES_LABORATORIOS_APOIO ===

    // Verificar se a tabela existe antes de tentar renomear
    const tableExists = await queryRunner.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_name = 'exames_laboratorios_apoio'
      )
    `);

    if (tableExists[0]?.exists) {
      // Renomear 'requer_peso' para 'peso'
      await queryRunner.query(`
        ALTER TABLE "exames_laboratorios_apoio" RENAME COLUMN "requer_peso" TO "peso"
      `);

      // Renomear 'requer_altura' para 'altura'
      await queryRunner.query(`
        ALTER TABLE "exames_laboratorios_apoio" RENAME COLUMN "requer_altura" TO "altura"
      `);

      // Renomear 'requer_volume' para 'volume'
      await queryRunner.query(`
        ALTER TABLE "exames_laboratorios_apoio" RENAME COLUMN "requer_volume" TO "volume"
      `);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // === Reverter tabela EXAMES_LABORATORIOS_APOIO ===
    const tableExists = await queryRunner.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_name = 'exames_laboratorios_apoio'
      )
    `);

    if (tableExists[0]?.exists) {
      await queryRunner.query(`
        ALTER TABLE "exames_laboratorios_apoio" RENAME COLUMN "volume" TO "requer_volume"
      `);
      await queryRunner.query(`
        ALTER TABLE "exames_laboratorios_apoio" RENAME COLUMN "altura" TO "requer_altura"
      `);
      await queryRunner.query(`
        ALTER TABLE "exames_laboratorios_apoio" RENAME COLUMN "peso" TO "requer_peso"
      `);
    }

    // === Reverter tabela EXAMES ===

    // Recriar colunas removidas
    await queryRunner.query(`
      ALTER TABLE "exames" ADD COLUMN IF NOT EXISTS "altura_min" DECIMAL(10,2)
    `);
    await queryRunner.query(`
      ALTER TABLE "exames" ADD COLUMN IF NOT EXISTS "altura_max" DECIMAL(10,2)
    `);
    await queryRunner.query(`
      ALTER TABLE "exames" ADD COLUMN IF NOT EXISTS "volume_min" DECIMAL(10,2)
    `);
    await queryRunner.query(`
      ALTER TABLE "exames" ADD COLUMN IF NOT EXISTS "volume_ideal" DECIMAL(10,2)
    `);

    await queryRunner.query(`
      ALTER TABLE "exames" RENAME COLUMN "volume" TO "requer_volume"
    `);
    await queryRunner.query(`
      ALTER TABLE "exames" RENAME COLUMN "altura" TO "requer_altura"
    `);
    await queryRunner.query(`
      ALTER TABLE "exames" RENAME COLUMN "peso" TO "requer_peso"
    `);
    await queryRunner.query(`
      ALTER TABLE "exames" RENAME COLUMN "prioridade" TO "peso"
    `);
  }
}
