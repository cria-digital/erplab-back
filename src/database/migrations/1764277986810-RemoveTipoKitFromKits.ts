import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveTipoKitFromKits1764277986810 implements MigrationInterface {
  name = 'RemoveTipoKitFromKits1764277986810';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Verificar se a coluna existe antes de remover
    const columnExists = await queryRunner.query(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'kits' AND column_name = 'tipo_kit'
    `);

    if (columnExists.length > 0) {
      // Remover a coluna tipo_kit
      await queryRunner.query(
        `ALTER TABLE "kits" DROP COLUMN IF EXISTS "tipo_kit"`,
      );
    }

    // Remover o tipo ENUM se existir e não for usado em outras tabelas
    await queryRunner.query(`DROP TYPE IF EXISTS "kits_tipo_kit_enum"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Recriar o tipo ENUM
    await queryRunner.query(`
      CREATE TYPE "kits_tipo_kit_enum" AS ENUM (
        'CHECK_UP',
        'OCUPACIONAL',
        'PRE_NATAL',
        'COM_DESCRICAO',
        'PERSONALIZADO'
      )
    `);

    // Adicionar a coluna tipo_kit de volta
    await queryRunner.query(`
      ALTER TABLE "kits" ADD "tipo_kit" "kits_tipo_kit_enum"
    `);

    // Adicionar comentário na coluna
    await queryRunner.query(`
      COMMENT ON COLUMN "kits"."tipo_kit" IS 'Tipo de kit (Check-up, Ocupacional, Pré-Natal, com descrição para categorização)'
    `);
  }
}
