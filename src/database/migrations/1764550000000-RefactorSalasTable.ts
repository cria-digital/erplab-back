import { MigrationInterface, QueryRunner } from 'typeorm';

export class RefactorSalasTable1764550000000 implements MigrationInterface {
  name = 'RefactorSalasTable1764550000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Adicionar nova coluna setor (string) com valor padrão
    await queryRunner.query(
      `ALTER TABLE "salas" ADD COLUMN "setor" character varying(100) DEFAULT 'Não definido'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "salas"."setor" IS 'Setor da sala (valor do campo de formulário)'`,
    );

    // 2. Atualizar registros existentes
    await queryRunner.query(
      `UPDATE "salas" SET "setor" = 'Não definido' WHERE "setor" IS NULL`,
    );

    // 3. Tornar setor NOT NULL e remover default
    await queryRunner.query(
      `ALTER TABLE "salas" ALTER COLUMN "setor" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "salas" ALTER COLUMN "setor" DROP DEFAULT`,
    );

    // 4. Renomear codigo_sala para codigo_interno
    await queryRunner.query(
      `ALTER TABLE "salas" RENAME COLUMN "codigo_sala" TO "codigo_interno"`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "salas"."codigo_interno" IS 'Código interno único da sala (ex: SALA080)'`,
    );

    // 5. Remover constraint unique antiga e criar nova
    await queryRunner.query(
      `ALTER TABLE "salas" DROP CONSTRAINT IF EXISTS "UQ_cbe0f0ee033ea0e76922ba1791e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "salas" ADD CONSTRAINT "UQ_salas_codigo_interno" UNIQUE ("codigo_interno")`,
    );

    // 6. Remover índices antigos
    await queryRunner.query(
      `DROP INDEX IF EXISTS "public"."IDX_b23690ffc4791c4ab1963a9143"`,
    ); // empresa_id
    await queryRunner.query(
      `DROP INDEX IF EXISTS "public"."IDX_d9a3793c7f473da66f99d6e834"`,
    ); // setor_id
    await queryRunner.query(
      `DROP INDEX IF EXISTS "public"."IDX_ee05e8e9270f659d40cccdadc6"`,
    ); // tipo_sala
    await queryRunner.query(
      `DROP INDEX IF EXISTS "public"."IDX_cbe0f0ee033ea0e76922ba1791"`,
    ); // codigo_sala

    // 7. Remover FK de setor_id
    await queryRunner.query(
      `ALTER TABLE "salas" DROP CONSTRAINT IF EXISTS "FK_d9a3793c7f473da66f99d6e8349"`,
    );

    // 8. Remover colunas antigas
    await queryRunner.query(
      `ALTER TABLE "salas" DROP COLUMN IF EXISTS "descricao"`,
    );
    await queryRunner.query(
      `ALTER TABLE "salas" DROP COLUMN IF EXISTS "tipo_sala"`,
    );
    await queryRunner.query(
      `ALTER TABLE "salas" DROP COLUMN IF EXISTS "andar"`,
    );
    await queryRunner.query(
      `ALTER TABLE "salas" DROP COLUMN IF EXISTS "bloco"`,
    );
    await queryRunner.query(`ALTER TABLE "salas" DROP COLUMN IF EXISTS "area"`);
    await queryRunner.query(
      `ALTER TABLE "salas" DROP COLUMN IF EXISTS "capacidade_pessoas"`,
    );
    await queryRunner.query(
      `ALTER TABLE "salas" DROP COLUMN IF EXISTS "setor_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "salas" DROP COLUMN IF EXISTS "possui_climatizacao"`,
    );
    await queryRunner.query(
      `ALTER TABLE "salas" DROP COLUMN IF EXISTS "possui_lavatorio"`,
    );
    await queryRunner.query(
      `ALTER TABLE "salas" DROP COLUMN IF EXISTS "acessibilidade"`,
    );
    await queryRunner.query(
      `ALTER TABLE "salas" DROP COLUMN IF EXISTS "observacoes"`,
    );
    await queryRunner.query(
      `ALTER TABLE "salas" DROP COLUMN IF EXISTS "empresa_id"`,
    );

    // 9. Tornar criado_por e atualizado_por nullable
    await queryRunner.query(
      `ALTER TABLE "salas" ALTER COLUMN "criado_por" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "salas" ALTER COLUMN "atualizado_por" DROP NOT NULL`,
    );

    // 10. Dropar enum antigo
    await queryRunner.query(
      `DROP TYPE IF EXISTS "public"."salas_tipo_sala_enum"`,
    );

    // 11. Criar novos índices
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_salas_codigo_interno" ON "salas" ("codigo_interno")`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_salas_nome" ON "salas" ("nome")`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_salas_unidade_id" ON "salas" ("unidade_id")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // 1. Remover novos índices
    await queryRunner.query(
      `DROP INDEX IF EXISTS "public"."IDX_salas_codigo_interno"`,
    );
    await queryRunner.query(`DROP INDEX IF EXISTS "public"."IDX_salas_nome"`);
    await queryRunner.query(
      `DROP INDEX IF EXISTS "public"."IDX_salas_unidade_id"`,
    );

    // 2. Recriar enum
    await queryRunner.query(
      `CREATE TYPE "public"."salas_tipo_sala_enum" AS ENUM('coleta', 'analise', 'exame', 'administrativa', 'espera', 'outros')`,
    );

    // 3. Adicionar colunas antigas de volta
    await queryRunner.query(`ALTER TABLE "salas" ADD COLUMN "descricao" text`);
    await queryRunner.query(
      `ALTER TABLE "salas" ADD COLUMN "tipo_sala" "public"."salas_tipo_sala_enum" DEFAULT 'outros'`,
    );
    await queryRunner.query(
      `ALTER TABLE "salas" ADD COLUMN "andar" character varying(50)`,
    );
    await queryRunner.query(
      `ALTER TABLE "salas" ADD COLUMN "bloco" character varying(50)`,
    );
    await queryRunner.query(
      `ALTER TABLE "salas" ADD COLUMN "area" numeric(10,2)`,
    );
    await queryRunner.query(
      `ALTER TABLE "salas" ADD COLUMN "capacidade_pessoas" integer`,
    );
    await queryRunner.query(`ALTER TABLE "salas" ADD COLUMN "setor_id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "salas" ADD COLUMN "possui_climatizacao" boolean DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "salas" ADD COLUMN "possui_lavatorio" boolean DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "salas" ADD COLUMN "acessibilidade" boolean DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "salas" ADD COLUMN "observacoes" text`,
    );
    await queryRunner.query(`ALTER TABLE "salas" ADD COLUMN "empresa_id" uuid`);

    // 4. Tornar criado_por e atualizado_por NOT NULL novamente
    await queryRunner.query(
      `ALTER TABLE "salas" ALTER COLUMN "criado_por" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "salas" ALTER COLUMN "atualizado_por" SET NOT NULL`,
    );

    // 5. Renomear codigo_interno de volta para codigo_sala
    await queryRunner.query(
      `ALTER TABLE "salas" DROP CONSTRAINT IF EXISTS "UQ_salas_codigo_interno"`,
    );
    await queryRunner.query(
      `ALTER TABLE "salas" RENAME COLUMN "codigo_interno" TO "codigo_sala"`,
    );
    await queryRunner.query(
      `ALTER TABLE "salas" ADD CONSTRAINT "UQ_cbe0f0ee033ea0e76922ba1791e" UNIQUE ("codigo_sala")`,
    );

    // 6. Remover coluna setor
    await queryRunner.query(
      `ALTER TABLE "salas" DROP COLUMN IF EXISTS "setor"`,
    );

    // 7. Recriar índices antigos
    await queryRunner.query(
      `CREATE INDEX "IDX_b23690ffc4791c4ab1963a9143" ON "salas" ("empresa_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_d9a3793c7f473da66f99d6e834" ON "salas" ("setor_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ee05e8e9270f659d40cccdadc6" ON "salas" ("tipo_sala")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_cbe0f0ee033ea0e76922ba1791" ON "salas" ("codigo_sala")`,
    );

    // 8. Recriar FK de setor_id
    await queryRunner.query(
      `ALTER TABLE "salas" ADD CONSTRAINT "FK_d9a3793c7f473da66f99d6e8349" FOREIGN KEY ("setor_id") REFERENCES "setores"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }
}
