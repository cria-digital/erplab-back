import { MigrationInterface, QueryRunner } from 'typeorm';

export class RefactorKitsTables1764273656366 implements MigrationInterface {
  name = 'RefactorKitsTables1764273656366';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // =========================================
    // KITS - Adicionar campos de auditoria
    // =========================================

    // Adicionar colunas criado_por_id e atualizado_por_id
    await queryRunner.query(`ALTER TABLE "kits" ADD "criado_por_id" uuid`);
    await queryRunner.query(
      `COMMENT ON COLUMN "kits"."criado_por_id" IS 'ID do usuário que criou o kit'`,
    );
    await queryRunner.query(`ALTER TABLE "kits" ADD "atualizado_por_id" uuid`);
    await queryRunner.query(
      `COMMENT ON COLUMN "kits"."atualizado_por_id" IS 'ID do usuário que atualizou o kit por último'`,
    );

    // Adicionar FKs para tabela usuarios
    await queryRunner.query(
      `ALTER TABLE "kits" ADD CONSTRAINT "FK_kits_criado_por" FOREIGN KEY ("criado_por_id") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "kits" ADD CONSTRAINT "FK_kits_atualizado_por" FOREIGN KEY ("atualizado_por_id") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );

    // =========================================
    // KIT_EXAMES - Remover campos obsoletos
    // =========================================

    // Verificar e remover coluna codigo_tuss se existir
    const kitExamesColumns = await queryRunner.query(
      `SELECT column_name FROM information_schema.columns WHERE table_name = 'kit_exames' AND column_name IN ('codigo_tuss', 'nome_exame', 'prazo_entrega')`,
    );
    const kitExamesColumnNames = kitExamesColumns.map(
      (c: any) => c.column_name,
    );

    if (kitExamesColumnNames.includes('codigo_tuss')) {
      await queryRunner.query(
        `ALTER TABLE "kit_exames" DROP COLUMN IF EXISTS "codigo_tuss"`,
      );
    }
    if (kitExamesColumnNames.includes('nome_exame')) {
      await queryRunner.query(
        `ALTER TABLE "kit_exames" DROP COLUMN IF EXISTS "nome_exame"`,
      );
    }
    if (kitExamesColumnNames.includes('prazo_entrega')) {
      await queryRunner.query(
        `ALTER TABLE "kit_exames" DROP COLUMN IF EXISTS "prazo_entrega"`,
      );
    }

    // =========================================
    // KIT_UNIDADES - Remover campos obsoletos
    // =========================================

    const kitUnidadesColumns = await queryRunner.query(
      `SELECT column_name FROM information_schema.columns WHERE table_name = 'kit_unidades' AND column_name IN ('disponivel', 'observacoes')`,
    );
    const kitUnidadesColumnNames = kitUnidadesColumns.map(
      (c: any) => c.column_name,
    );

    if (kitUnidadesColumnNames.includes('disponivel')) {
      await queryRunner.query(
        `ALTER TABLE "kit_unidades" DROP COLUMN IF EXISTS "disponivel"`,
      );
    }
    if (kitUnidadesColumnNames.includes('observacoes')) {
      await queryRunner.query(
        `ALTER TABLE "kit_unidades" DROP COLUMN IF EXISTS "observacoes"`,
      );
    }

    // =========================================
    // KIT_CONVENIOS - Remover campos obsoletos
    // =========================================

    const kitConveniosColumns = await queryRunner.query(
      `SELECT column_name FROM information_schema.columns WHERE table_name = 'kit_convenios' AND column_name IN ('valor_convenio', 'disponivel', 'requer_autorizacao', 'observacoes')`,
    );
    const kitConveniosColumnNames = kitConveniosColumns.map(
      (c: any) => c.column_name,
    );

    if (kitConveniosColumnNames.includes('valor_convenio')) {
      await queryRunner.query(
        `ALTER TABLE "kit_convenios" DROP COLUMN IF EXISTS "valor_convenio"`,
      );
    }
    if (kitConveniosColumnNames.includes('disponivel')) {
      await queryRunner.query(
        `ALTER TABLE "kit_convenios" DROP COLUMN IF EXISTS "disponivel"`,
      );
    }
    if (kitConveniosColumnNames.includes('requer_autorizacao')) {
      await queryRunner.query(
        `ALTER TABLE "kit_convenios" DROP COLUMN IF EXISTS "requer_autorizacao"`,
      );
    }
    if (kitConveniosColumnNames.includes('observacoes')) {
      await queryRunner.query(
        `ALTER TABLE "kit_convenios" DROP COLUMN IF EXISTS "observacoes"`,
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // =========================================
    // KIT_CONVENIOS - Restaurar campos
    // =========================================
    await queryRunner.query(
      `ALTER TABLE "kit_convenios" ADD "observacoes" text`,
    );
    await queryRunner.query(
      `ALTER TABLE "kit_convenios" ADD "requer_autorizacao" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "kit_convenios" ADD "disponivel" boolean NOT NULL DEFAULT true`,
    );
    await queryRunner.query(
      `ALTER TABLE "kit_convenios" ADD "valor_convenio" numeric(10,2)`,
    );

    // =========================================
    // KIT_UNIDADES - Restaurar campos
    // =========================================
    await queryRunner.query(
      `ALTER TABLE "kit_unidades" ADD "observacoes" text`,
    );
    await queryRunner.query(
      `ALTER TABLE "kit_unidades" ADD "disponivel" boolean NOT NULL DEFAULT true`,
    );

    // =========================================
    // KIT_EXAMES - Restaurar campos
    // =========================================
    await queryRunner.query(
      `ALTER TABLE "kit_exames" ADD "prazo_entrega" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "kit_exames" ADD "nome_exame" character varying(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "kit_exames" ADD "codigo_tuss" character varying(20)`,
    );

    // =========================================
    // KITS - Remover campos de auditoria
    // =========================================
    await queryRunner.query(
      `ALTER TABLE "kits" DROP CONSTRAINT IF EXISTS "FK_kits_atualizado_por"`,
    );
    await queryRunner.query(
      `ALTER TABLE "kits" DROP CONSTRAINT IF EXISTS "FK_kits_criado_por"`,
    );
    await queryRunner.query(
      `ALTER TABLE "kits" DROP COLUMN IF EXISTS "atualizado_por_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "kits" DROP COLUMN IF EXISTS "criado_por_id"`,
    );
  }
}
