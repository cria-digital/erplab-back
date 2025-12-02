import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddStatusChavePixContasEContaUnidade1764683573563
  implements MigrationInterface
{
  name = 'AddStatusChavePixContasEContaUnidade1764683573563';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // ============================================
    // CONTAS BANCÁRIAS - Adicionar status e chave_pix
    // ============================================

    // Criar enum se não existir
    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE "public"."contas_bancarias_status_enum" AS ENUM('ativo', 'inativo', 'suspenso');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    // Adicionar coluna status se não existir
    await queryRunner.query(`
      DO $$ BEGIN
        ALTER TABLE "contas_bancarias" ADD COLUMN "status" "public"."contas_bancarias_status_enum" NOT NULL DEFAULT 'ativo';
      EXCEPTION
        WHEN duplicate_column THEN null;
      END $$;
    `);

    // Adicionar coluna chave_pix se não existir
    await queryRunner.query(`
      DO $$ BEGIN
        ALTER TABLE "contas_bancarias" ADD COLUMN "chave_pix" character varying(255);
      EXCEPTION
        WHEN duplicate_column THEN null;
      END $$;
    `);

    // ============================================
    // UNIDADES SAÚDE - Adicionar FK conta_bancaria_id
    // ============================================

    // Adicionar coluna conta_bancaria_id se não existir
    await queryRunner.query(`
      DO $$ BEGIN
        ALTER TABLE "unidades_saude" ADD COLUMN "conta_bancaria_id" uuid;
      EXCEPTION
        WHEN duplicate_column THEN null;
      END $$;
    `);

    // Adicionar FK se não existir
    await queryRunner.query(`
      DO $$ BEGIN
        ALTER TABLE "unidades_saude" ADD CONSTRAINT "FK_c66f872703f94bc73a73b2471c9"
        FOREIGN KEY ("conta_bancaria_id") REFERENCES "contas_bancarias"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remover FK
    await queryRunner.query(`
      ALTER TABLE "unidades_saude" DROP CONSTRAINT IF EXISTS "FK_c66f872703f94bc73a73b2471c9"
    `);

    // Remover coluna conta_bancaria_id
    await queryRunner.query(`
      ALTER TABLE "unidades_saude" DROP COLUMN IF EXISTS "conta_bancaria_id"
    `);

    // Remover coluna chave_pix
    await queryRunner.query(`
      ALTER TABLE "contas_bancarias" DROP COLUMN IF EXISTS "chave_pix"
    `);

    // Remover coluna status
    await queryRunner.query(`
      ALTER TABLE "contas_bancarias" DROP COLUMN IF EXISTS "status"
    `);

    // Remover enum
    await queryRunner.query(`
      DROP TYPE IF EXISTS "public"."contas_bancarias_status_enum"
    `);
  }
}
