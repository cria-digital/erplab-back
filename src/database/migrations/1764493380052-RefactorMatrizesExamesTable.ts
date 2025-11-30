import { MigrationInterface, QueryRunner } from 'typeorm';

export class RefactorMatrizesExamesTable1764493380052
  implements MigrationInterface
{
  name = 'RefactorMatrizesExamesTable1764493380052';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Adicionar novas colunas
    await queryRunner.query(
      `ALTER TABLE "matrizes_exames" ADD COLUMN "template_arquivo" character varying(500)`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "matrizes_exames"."template_arquivo" IS 'Caminho ou nome do arquivo de template importado'`,
    );

    await queryRunner.query(
      `ALTER TABLE "matrizes_exames" ADD COLUMN "template_dados" jsonb`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "matrizes_exames"."template_dados" IS 'Conteúdo do template em JSON para preview da matriz'`,
    );

    // 2. Remover índice do tipo_matriz antes de dropar a coluna
    await queryRunner.query(
      `DROP INDEX IF EXISTS "public"."IDX_matrizes_exames_tipo_matriz"`,
    );

    // 3. Remover colunas antigas
    await queryRunner.query(
      `ALTER TABLE "matrizes_exames" DROP COLUMN IF EXISTS "descricao"`,
    );
    await queryRunner.query(
      `ALTER TABLE "matrizes_exames" DROP COLUMN IF EXISTS "tipo_matriz"`,
    );
    await queryRunner.query(
      `ALTER TABLE "matrizes_exames" DROP COLUMN IF EXISTS "versao"`,
    );
    await queryRunner.query(
      `ALTER TABLE "matrizes_exames" DROP COLUMN IF EXISTS "padrao_sistema"`,
    );
    await queryRunner.query(
      `ALTER TABLE "matrizes_exames" DROP COLUMN IF EXISTS "tem_calculo_automatico"`,
    );
    await queryRunner.query(
      `ALTER TABLE "matrizes_exames" DROP COLUMN IF EXISTS "formulas_calculo"`,
    );
    await queryRunner.query(
      `ALTER TABLE "matrizes_exames" DROP COLUMN IF EXISTS "layout_visualizacao"`,
    );
    await queryRunner.query(
      `ALTER TABLE "matrizes_exames" DROP COLUMN IF EXISTS "template_impressao"`,
    );
    await queryRunner.query(
      `ALTER TABLE "matrizes_exames" DROP COLUMN IF EXISTS "requer_assinatura_digital"`,
    );
    await queryRunner.query(
      `ALTER TABLE "matrizes_exames" DROP COLUMN IF EXISTS "permite_edicao_apos_liberacao"`,
    );
    await queryRunner.query(
      `ALTER TABLE "matrizes_exames" DROP COLUMN IF EXISTS "regras_validacao"`,
    );
    await queryRunner.query(
      `ALTER TABLE "matrizes_exames" DROP COLUMN IF EXISTS "instrucoes_preenchimento"`,
    );
    await queryRunner.query(
      `ALTER TABLE "matrizes_exames" DROP COLUMN IF EXISTS "observacoes"`,
    );
    await queryRunner.query(
      `ALTER TABLE "matrizes_exames" DROP COLUMN IF EXISTS "referencias_bibliograficas"`,
    );
    await queryRunner.query(
      `ALTER TABLE "matrizes_exames" DROP COLUMN IF EXISTS "status"`,
    );

    // 4. Dropar ENUMs antigos
    await queryRunner.query(
      `DROP TYPE IF EXISTS "public"."matrizes_exames_tipo_matriz_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE IF EXISTS "public"."matrizes_exames_status_enum"`,
    );

    // 5. Tornar tipo_exame_id e exame_id NOT NULL (se houver dados null, define valor padrão primeiro)
    // Primeiro, atualizar registros com NULL para um valor temporário ou remover
    await queryRunner.query(
      `DELETE FROM "matrizes_exames" WHERE "tipo_exame_id" IS NULL OR "exame_id" IS NULL`,
    );

    // Agora aplicar NOT NULL
    await queryRunner.query(
      `ALTER TABLE "matrizes_exames" ALTER COLUMN "tipo_exame_id" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "matrizes_exames" ALTER COLUMN "exame_id" SET NOT NULL`,
    );

    // 6. Criar índice para exame_id
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_matrizes_exames_exame_id" ON "matrizes_exames" ("exame_id")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // 1. Remover índice de exame_id
    await queryRunner.query(
      `DROP INDEX IF EXISTS "public"."IDX_matrizes_exames_exame_id"`,
    );

    // 2. Tornar colunas nullable novamente
    await queryRunner.query(
      `ALTER TABLE "matrizes_exames" ALTER COLUMN "tipo_exame_id" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "matrizes_exames" ALTER COLUMN "exame_id" DROP NOT NULL`,
    );

    // 3. Recriar ENUMs
    await queryRunner.query(
      `CREATE TYPE "public"."matrizes_exames_tipo_matriz_enum" AS ENUM('audiometria', 'densitometria', 'eletrocardiograma', 'hemograma', 'espirometria', 'acuidade_visual', 'personalizada')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."matrizes_exames_status_enum" AS ENUM('ativo', 'inativo', 'em_desenvolvimento')`,
    );

    // 4. Adicionar colunas antigas de volta
    await queryRunner.query(
      `ALTER TABLE "matrizes_exames" ADD COLUMN "descricao" text`,
    );
    await queryRunner.query(
      `ALTER TABLE "matrizes_exames" ADD COLUMN "tipo_matriz" "public"."matrizes_exames_tipo_matriz_enum" DEFAULT 'personalizada'`,
    );
    await queryRunner.query(
      `ALTER TABLE "matrizes_exames" ADD COLUMN "versao" character varying(20) DEFAULT '1.0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "matrizes_exames" ADD COLUMN "padrao_sistema" boolean DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "matrizes_exames" ADD COLUMN "tem_calculo_automatico" boolean DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "matrizes_exames" ADD COLUMN "formulas_calculo" jsonb`,
    );
    await queryRunner.query(
      `ALTER TABLE "matrizes_exames" ADD COLUMN "layout_visualizacao" jsonb`,
    );
    await queryRunner.query(
      `ALTER TABLE "matrizes_exames" ADD COLUMN "template_impressao" text`,
    );
    await queryRunner.query(
      `ALTER TABLE "matrizes_exames" ADD COLUMN "requer_assinatura_digital" boolean DEFAULT true`,
    );
    await queryRunner.query(
      `ALTER TABLE "matrizes_exames" ADD COLUMN "permite_edicao_apos_liberacao" boolean DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "matrizes_exames" ADD COLUMN "regras_validacao" jsonb`,
    );
    await queryRunner.query(
      `ALTER TABLE "matrizes_exames" ADD COLUMN "instrucoes_preenchimento" text`,
    );
    await queryRunner.query(
      `ALTER TABLE "matrizes_exames" ADD COLUMN "observacoes" text`,
    );
    await queryRunner.query(
      `ALTER TABLE "matrizes_exames" ADD COLUMN "referencias_bibliograficas" text`,
    );
    await queryRunner.query(
      `ALTER TABLE "matrizes_exames" ADD COLUMN "status" "public"."matrizes_exames_status_enum" DEFAULT 'ativo'`,
    );

    // 5. Recriar índice de tipo_matriz
    await queryRunner.query(
      `CREATE INDEX "IDX_matrizes_exames_tipo_matriz" ON "matrizes_exames" ("tipo_matriz")`,
    );

    // 6. Remover novas colunas
    await queryRunner.query(
      `ALTER TABLE "matrizes_exames" DROP COLUMN IF EXISTS "template_dados"`,
    );
    await queryRunner.query(
      `ALTER TABLE "matrizes_exames" DROP COLUMN IF EXISTS "template_arquivo"`,
    );
  }
}
