import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddExcluidoToUnidadesSaude1764852000000
  implements MigrationInterface
{
  name = 'AddExcluidoToUnidadesSaude1764852000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Verificar se a coluna já existe
    const colExists = await queryRunner.query(`
      SELECT column_name FROM information_schema.columns
      WHERE table_name = 'unidades_saude' AND column_name = 'excluido'
    `);

    if (colExists.length === 0) {
      await queryRunner.query(`
        ALTER TABLE "unidades_saude"
        ADD COLUMN "excluido" boolean NOT NULL DEFAULT false
      `);

      await queryRunner.query(`
        COMMENT ON COLUMN "unidades_saude"."excluido"
        IS 'Soft delete - registro excluído'
      `);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "unidades_saude" DROP COLUMN IF EXISTS "excluido"
    `);
  }
}
