import { MigrationInterface, QueryRunner } from 'typeorm';

export class RefactorExamesAndDropTiposExame1764774641041
  implements MigrationInterface
{
  name = 'RefactorExamesAndDropTiposExame1764774641041';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Adicionar novo valor ao enum nome_campo_formulario_enum
    await queryRunner.query(
      `ALTER TYPE "public"."campos_formulario_nome_campo_enum" ADD VALUE IF NOT EXISTS 'formato_laudo'`,
    );

    // 2. Remover FK constraint de tipo_exame_id para tipos_exame
    await queryRunner.query(
      `ALTER TABLE "exames" DROP CONSTRAINT IF EXISTS "FK_8a575fa5a082c47295e8c1c981d"`,
    );

    // 3. Remover FK constraint de tipo_exame_id em matrizes_exames
    await queryRunner.query(
      `ALTER TABLE "matrizes_exames" DROP CONSTRAINT IF EXISTS "FK_matrizes_exames_tipo_exame"`,
    );
    await queryRunner.query(
      `ALTER TABLE "matrizes_exames" DROP CONSTRAINT IF EXISTS "matrizes_exames_tipo_exame_id_fkey"`,
    );
    await queryRunner.query(
      `ALTER TABLE "matrizes_exames" DROP CONSTRAINT IF EXISTS "FK_f6db3a4dfb5633ff6cab58234ee"`,
    );

    // 4. Tornar tipo_exame_id nullable em exames
    await queryRunner.query(
      `ALTER TABLE "exames" ALTER COLUMN "tipo_exame_id" DROP NOT NULL`,
    );

    // 5. Tornar tipo_exame_id nullable em matrizes_exames
    await queryRunner.query(
      `ALTER TABLE "matrizes_exames" ALTER COLUMN "tipo_exame_id" DROP NOT NULL`,
    );

    // 6. Alterar sinonimos de varchar para jsonb
    await queryRunner.query(
      `ALTER TABLE "exames" ALTER COLUMN "sinonimos" TYPE jsonb USING CASE WHEN sinonimos IS NULL THEN NULL ELSE jsonb_build_array(sinonimos) END`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "exames"."sinonimos" IS 'Sinônimos ou nomes alternativos (array de strings)'`,
    );

    // 7. Remover FK constraint de regiao_coleta_id
    await queryRunner.query(
      `ALTER TABLE "exames" DROP CONSTRAINT IF EXISTS "FK_72cf529acf580f0527eb28e93e2"`,
    );

    // 8. Renomear regiao_coleta_id para regiao_coleta_ids e alterar para jsonb
    await queryRunner.query(
      `ALTER TABLE "exames" RENAME COLUMN "regiao_coleta_id" TO "regiao_coleta_ids"`,
    );
    await queryRunner.query(
      `ALTER TABLE "exames" ALTER COLUMN "regiao_coleta_ids" TYPE jsonb USING CASE WHEN regiao_coleta_ids IS NULL THEN NULL ELSE jsonb_build_array(regiao_coleta_ids) END`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "exames"."regiao_coleta_ids" IS 'Array de IDs de alternativas do campo regiao_coleta'`,
    );

    // 8. Dropar índices relacionados a tipos_exame
    await queryRunner.query(
      `DROP INDEX IF EXISTS "public"."IDX_f7a51257aefa68a64d741fb3f0"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "public"."IDX_fc6bae06debf7a16bcb7486a6e"`,
    );

    // 9. Dropar tabela tipos_exame
    await queryRunner.query(`DROP TABLE IF EXISTS "tipos_exame"`);

    // 10. Dropar enum tipos_exame_status_enum
    await queryRunner.query(
      `DROP TYPE IF EXISTS "public"."tipos_exame_status_enum"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // 1. Recriar enum tipos_exame_status_enum
    await queryRunner.query(
      `CREATE TYPE "public"."tipos_exame_status_enum" AS ENUM('ativo', 'inativo')`,
    );

    // 2. Recriar tabela tipos_exame
    await queryRunner.query(
      `CREATE TABLE "tipos_exame" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "codigo" character varying(20) NOT NULL, "nome" character varying(100) NOT NULL, "descricao" text, "icone" character varying(50), "cor" character varying(7), "ordem" integer NOT NULL DEFAULT '0', "status" "public"."tipos_exame_status_enum" NOT NULL DEFAULT 'ativo', "requer_agendamento" boolean NOT NULL DEFAULT false, "requer_autorizacao" boolean NOT NULL DEFAULT false, "permite_domiciliar" boolean NOT NULL DEFAULT false, "configuracoes" jsonb, "criado_em" TIMESTAMP NOT NULL DEFAULT now(), "atualizado_em" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_f7a51257aefa68a64d741fb3f04" UNIQUE ("codigo"), CONSTRAINT "PK_f40fd3415dacfcad6ca844a137b" PRIMARY KEY ("id"))`,
    );

    // 3. Recriar índices
    await queryRunner.query(
      `CREATE INDEX "IDX_fc6bae06debf7a16bcb7486a6e" ON "tipos_exame" ("nome")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f7a51257aefa68a64d741fb3f0" ON "tipos_exame" ("codigo")`,
    );

    // 4. Reverter regiao_coleta_ids para regiao_coleta_id
    await queryRunner.query(
      `ALTER TABLE "exames" ALTER COLUMN "regiao_coleta_ids" TYPE character varying USING regiao_coleta_ids::text`,
    );
    await queryRunner.query(
      `ALTER TABLE "exames" RENAME COLUMN "regiao_coleta_ids" TO "regiao_coleta_id"`,
    );

    // 5. Reverter sinonimos para varchar
    await queryRunner.query(
      `ALTER TABLE "exames" ALTER COLUMN "sinonimos" TYPE character varying(50) USING sinonimos::text`,
    );

    // 6. Tornar tipo_exame_id NOT NULL em matrizes_exames
    await queryRunner.query(
      `ALTER TABLE "matrizes_exames" ALTER COLUMN "tipo_exame_id" SET NOT NULL`,
    );

    // 7. Tornar tipo_exame_id NOT NULL em exames
    await queryRunner.query(
      `ALTER TABLE "exames" ALTER COLUMN "tipo_exame_id" SET NOT NULL`,
    );

    // 8. Recriar FK constraint em matrizes_exames
    await queryRunner.query(
      `ALTER TABLE "matrizes_exames" ADD CONSTRAINT "matrizes_exames_tipo_exame_id_fkey" FOREIGN KEY ("tipo_exame_id") REFERENCES "tipos_exame"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );

    // 9. Recriar FK constraint em exames
    await queryRunner.query(
      `ALTER TABLE "exames" ADD CONSTRAINT "FK_8a575fa5a082c47295e8c1c981d" FOREIGN KEY ("tipo_exame_id") REFERENCES "tipos_exame"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );

    // Nota: O valor 'formato_laudo' não pode ser removido do enum facilmente
  }
}
