import { MigrationInterface, QueryRunner } from 'typeorm';

export class DropSetoresTable1764550000001 implements MigrationInterface {
  name = 'DropSetoresTable1764550000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Remover FK de imobilizados para setores (se existir)
    await queryRunner.query(
      `ALTER TABLE "imobilizados" DROP CONSTRAINT IF EXISTS "FK_1970c62ab3fee19ee10d264b9f9"`,
    );

    // 2. Remover índice de setor_id em imobilizados
    await queryRunner.query(
      `DROP INDEX IF EXISTS "public"."IDX_1970c62ab3fee19ee10d264b9f"`,
    );

    // 3. Remover coluna setor_id de imobilizados
    await queryRunner.query(
      `ALTER TABLE "imobilizados" DROP COLUMN IF EXISTS "setor_id"`,
    );

    // 3.1 Remover FK de equipamentos para setores (se existir)
    await queryRunner.query(
      `ALTER TABLE "equipamentos" DROP CONSTRAINT IF EXISTS "FK_equipamentos_setor_id"`,
    );

    // 3.2 Remover índice de setor_id em equipamentos
    await queryRunner.query(
      `DROP INDEX IF EXISTS "public"."IDX_equipamentos_setor_id"`,
    );

    // 3.3 Remover coluna setor_id de equipamentos
    await queryRunner.query(
      `ALTER TABLE "equipamentos" DROP COLUMN IF EXISTS "setor_id"`,
    );

    // 4. Remover índices da tabela setores
    await queryRunner.query(
      `DROP INDEX IF EXISTS "public"."IDX_5255de71bf030201a1c3453c37"`,
    ); // codigo_setor
    await queryRunner.query(
      `DROP INDEX IF EXISTS "public"."IDX_setores_empresa_id"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "public"."IDX_setores_unidade_id"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "public"."IDX_setores_tipo_setor"`,
    );
    await queryRunner.query(`DROP INDEX IF EXISTS "public"."IDX_setores_nome"`);

    // 5. Remover FK de setores para setor_pai
    await queryRunner.query(
      `ALTER TABLE "setores" DROP CONSTRAINT IF EXISTS "FK_setores_setor_pai"`,
    );

    // 6. Dropar tabela setores
    await queryRunner.query(`DROP TABLE IF EXISTS "setores"`);

    // 7. Dropar enum de tipo_setor
    await queryRunner.query(
      `DROP TYPE IF EXISTS "public"."setores_tipo_setor_enum"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // 1. Recriar enum
    await queryRunner.query(
      `CREATE TYPE "public"."setores_tipo_setor_enum" AS ENUM('laboratorio', 'administrativo', 'atendimento', 'tecnico', 'outro')`,
    );

    // 2. Recriar tabela setores
    await queryRunner.query(`
      CREATE TABLE "setores" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "codigo_setor" character varying(50) NOT NULL,
        "nome" character varying(255) NOT NULL,
        "descricao" text,
        "tipo_setor" "public"."setores_tipo_setor_enum" NOT NULL,
        "responsavel_id" uuid,
        "setor_pai_id" uuid,
        "ordem" integer NOT NULL DEFAULT 0,
        "cor" character varying(7),
        "observacoes" text,
        "ativo" boolean NOT NULL DEFAULT true,
        "unidade_id" uuid NOT NULL,
        "empresa_id" uuid,
        "criado_por" uuid NOT NULL,
        "atualizado_por" uuid NOT NULL,
        "criado_em" TIMESTAMP NOT NULL DEFAULT now(),
        "atualizado_em" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_5255de71bf030201a1c3453c37f" UNIQUE ("codigo_setor"),
        CONSTRAINT "PK_setores" PRIMARY KEY ("id")
      )
    `);

    // 3. Recriar FK de setor_pai
    await queryRunner.query(
      `ALTER TABLE "setores" ADD CONSTRAINT "FK_setores_setor_pai" FOREIGN KEY ("setor_pai_id") REFERENCES "setores"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );

    // 4. Recriar índices
    await queryRunner.query(
      `CREATE INDEX "IDX_5255de71bf030201a1c3453c37" ON "setores" ("codigo_setor")`,
    );

    // 5. Adicionar coluna setor_id em imobilizados
    await queryRunner.query(
      `ALTER TABLE "imobilizados" ADD COLUMN "setor_id" uuid`,
    );

    // 6. Recriar índice de setor_id em imobilizados
    await queryRunner.query(
      `CREATE INDEX "IDX_1970c62ab3fee19ee10d264b9f" ON "imobilizados" ("setor_id")`,
    );

    // 7. Recriar FK de imobilizados para setores
    await queryRunner.query(
      `ALTER TABLE "imobilizados" ADD CONSTRAINT "FK_1970c62ab3fee19ee10d264b9f9" FOREIGN KEY ("setor_id") REFERENCES "setores"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );

    // 8. Adicionar coluna setor_id em equipamentos
    await queryRunner.query(
      `ALTER TABLE "equipamentos" ADD COLUMN "setor_id" uuid`,
    );

    // 9. Recriar índice de setor_id em equipamentos
    await queryRunner.query(
      `CREATE INDEX "IDX_equipamentos_setor_id" ON "equipamentos" ("setor_id")`,
    );

    // 10. Recriar FK de equipamentos para setores
    await queryRunner.query(
      `ALTER TABLE "equipamentos" ADD CONSTRAINT "FK_equipamentos_setor_id" FOREIGN KEY ("setor_id") REFERENCES "setores"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }
}
