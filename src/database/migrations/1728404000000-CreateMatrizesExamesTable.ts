import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateMatrizesExamesTable1728404000000
  implements MigrationInterface
{
  name = 'CreateMatrizesExamesTable1728404000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Criar ENUM para tipo de matriz
    await queryRunner.query(
      `CREATE TYPE "public"."matrizes_exames_tipo_matriz_enum" AS ENUM('audiometria', 'densitometria', 'eletrocardiograma', 'hemograma', 'espirometria', 'acuidade_visual', 'personalizada')`,
    );

    // Criar ENUM para status de matriz
    await queryRunner.query(
      `CREATE TYPE "public"."matrizes_exames_status_enum" AS ENUM('ativo', 'inativo', 'em_desenvolvimento')`,
    );

    // Criar tabela matrizes_exames
    await queryRunner.query(
      `CREATE TABLE "matrizes_exames" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "codigo_interno" character varying(50) NOT NULL,
        "nome" character varying(255) NOT NULL,
        "descricao" text,
        "tipo_matriz" "public"."matrizes_exames_tipo_matriz_enum" NOT NULL,
        "tipo_exame_id" uuid,
        "exame_id" uuid,
        "versao" character varying(20) NOT NULL DEFAULT '1.0',
        "padrao_sistema" boolean NOT NULL DEFAULT false,
        "tem_calculo_automatico" boolean NOT NULL DEFAULT false,
        "formulas_calculo" jsonb,
        "layout_visualizacao" jsonb,
        "template_impressao" text,
        "requer_assinatura_digital" boolean NOT NULL DEFAULT true,
        "permite_edicao_apos_liberacao" boolean NOT NULL DEFAULT false,
        "regras_validacao" jsonb,
        "instrucoes_preenchimento" text,
        "observacoes" text,
        "referencias_bibliograficas" text,
        "status" "public"."matrizes_exames_status_enum" NOT NULL DEFAULT 'ativo',
        "ativo" boolean NOT NULL DEFAULT true,
        "criado_em" TIMESTAMP NOT NULL DEFAULT now(),
        "atualizado_em" TIMESTAMP NOT NULL DEFAULT now(),
        "criado_por" uuid,
        "atualizado_por" uuid,
        CONSTRAINT "UQ_matrizes_exames_codigo_interno" UNIQUE ("codigo_interno"),
        CONSTRAINT "PK_matrizes_exames" PRIMARY KEY ("id")
      )`,
    );

    // Comentários das colunas
    await queryRunner.query(
      `COMMENT ON COLUMN "matrizes_exames"."codigo_interno" IS 'Código interno único da matriz (ex: MTZ-AUDIO-001)'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "matrizes_exames"."nome" IS 'Nome da matriz (ex: Audiometria Tonal Padrão)'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "matrizes_exames"."descricao" IS 'Descrição detalhada da matriz e sua finalidade'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "matrizes_exames"."tipo_matriz" IS 'Tipo/categoria da matriz'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "matrizes_exames"."tipo_exame_id" IS 'ID do tipo de exame ao qual esta matriz pertence'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "matrizes_exames"."exame_id" IS 'ID do exame específico (opcional, para matrizes exclusivas)'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "matrizes_exames"."versao" IS 'Versão da matriz (para controle de mudanças)'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "matrizes_exames"."padrao_sistema" IS 'Se é uma matriz padrão do sistema (não pode ser deletada)'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "matrizes_exames"."tem_calculo_automatico" IS 'Se possui cálculos automáticos entre campos'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "matrizes_exames"."formulas_calculo" IS 'Fórmulas de cálculo em JSON (campo_destino: formula)'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "matrizes_exames"."layout_visualizacao" IS 'Configurações de layout para visualização (grid, posicionamento)'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "matrizes_exames"."template_impressao" IS 'Template HTML/Handlebars para impressão do laudo'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "matrizes_exames"."requer_assinatura_digital" IS 'Se requer assinatura digital do responsável técnico'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "matrizes_exames"."permite_edicao_apos_liberacao" IS 'Se permite edição após liberação do resultado'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "matrizes_exames"."regras_validacao" IS 'Regras de validação customizadas em JSON'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "matrizes_exames"."instrucoes_preenchimento" IS 'Instruções para preenchimento da matriz'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "matrizes_exames"."observacoes" IS 'Observações gerais sobre a matriz'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "matrizes_exames"."referencias_bibliograficas" IS 'Referências bibliográficas e normas técnicas'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "matrizes_exames"."status" IS 'Status da matriz'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "matrizes_exames"."ativo" IS 'Se a matriz está ativa (soft delete)'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "matrizes_exames"."criado_em" IS 'Data de criação do registro'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "matrizes_exames"."atualizado_em" IS 'Data da última atualização'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "matrizes_exames"."criado_por" IS 'ID do usuário que criou o registro'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "matrizes_exames"."atualizado_por" IS 'ID do usuário que atualizou o registro'`,
    );

    // Criar índices
    await queryRunner.query(
      `CREATE INDEX "IDX_matrizes_exames_codigo_interno" ON "matrizes_exames" ("codigo_interno")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_matrizes_exames_nome" ON "matrizes_exames" ("nome")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_matrizes_exames_tipo_matriz" ON "matrizes_exames" ("tipo_matriz")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_matrizes_exames_tipo_exame_id" ON "matrizes_exames" ("tipo_exame_id")`,
    );

    // Criar ENUM para tipo de campo
    await queryRunner.query(
      `CREATE TYPE "public"."campos_matriz_tipo_campo_enum" AS ENUM('texto', 'numero', 'decimal', 'boolean', 'data', 'hora', 'select', 'radio', 'checkbox', 'textarea', 'tabela', 'imagem', 'calculado', 'grupo')`,
    );

    // Criar ENUM para unidade de medida
    await queryRunner.query(
      `CREATE TYPE "public"."campos_matriz_unidade_medida_enum" AS ENUM('dB', 'Hz', 'mmHg', 'mL', 'g/dL', 'mg/dL', 'mm', 'cm', 'kg', '%', 'bpm', 'score', 'personalizada')`,
    );

    // Criar tabela campos_matriz
    await queryRunner.query(
      `CREATE TABLE "campos_matriz" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "matriz_id" uuid NOT NULL,
        "codigo_campo" character varying(100) NOT NULL,
        "label" character varying(255) NOT NULL,
        "tipo_campo" "public"."campos_matriz_tipo_campo_enum" NOT NULL,
        "placeholder" character varying(255),
        "descricao" text,
        "opcoes" jsonb,
        "valor_padrao" character varying(255),
        "unidade_medida" "public"."campos_matriz_unidade_medida_enum",
        "unidade_medida_customizada" character varying(50),
        "valor_referencia_min" numeric(15,5),
        "valor_referencia_max" numeric(15,5),
        "texto_referencia" character varying(500),
        "obrigatorio" boolean NOT NULL DEFAULT false,
        "valor_min" numeric(15,5),
        "valor_max" numeric(15,5),
        "mascara" character varying(100),
        "regex_validacao" character varying(500),
        "mensagem_validacao" character varying(255),
        "formula_calculo" text,
        "campos_dependentes" jsonb,
        "ordem_exibicao" integer NOT NULL DEFAULT 0,
        "linha" integer,
        "coluna" integer,
        "largura" integer,
        "visivel" boolean NOT NULL DEFAULT true,
        "somente_leitura" boolean NOT NULL DEFAULT false,
        "destacar_alterado" boolean NOT NULL DEFAULT true,
        "grupo" character varying(100),
        "secao" character varying(100),
        "configuracoes" jsonb,
        "ativo" boolean NOT NULL DEFAULT true,
        "criado_em" TIMESTAMP NOT NULL DEFAULT now(),
        "atualizado_em" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_campos_matriz" PRIMARY KEY ("id")
      )`,
    );

    // Comentários das colunas
    await queryRunner.query(
      `COMMENT ON COLUMN "campos_matriz"."matriz_id" IS 'ID da matriz à qual este campo pertence'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "campos_matriz"."codigo_campo" IS 'Código único do campo dentro da matriz (ex: audio_od_500hz)'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "campos_matriz"."label" IS 'Rótulo/label do campo (ex: Orelha Direita 500Hz)'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "campos_matriz"."tipo_campo" IS 'Tipo do campo'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "campos_matriz"."placeholder" IS 'Texto de placeholder'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "campos_matriz"."descricao" IS 'Descrição/ajuda do campo'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "campos_matriz"."opcoes" IS 'Opções para campos select/radio/checkbox (array de {value, label})'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "campos_matriz"."valor_padrao" IS 'Valor padrão do campo'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "campos_matriz"."unidade_medida" IS 'Unidade de medida do campo'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "campos_matriz"."unidade_medida_customizada" IS 'Unidade de medida customizada (quando unidadeMedida = PERSONALIZADA)'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "campos_matriz"."valor_referencia_min" IS 'Valor mínimo de referência'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "campos_matriz"."valor_referencia_max" IS 'Valor máximo de referência'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "campos_matriz"."texto_referencia" IS 'Texto descritivo dos valores de referência'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "campos_matriz"."obrigatorio" IS 'Se o campo é obrigatório'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "campos_matriz"."valor_min" IS 'Valor mínimo permitido (validação)'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "campos_matriz"."valor_max" IS 'Valor máximo permitido (validação)'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "campos_matriz"."mascara" IS 'Máscara de formatação (ex: ##/##/####)'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "campos_matriz"."regex_validacao" IS 'Expressão regular para validação customizada'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "campos_matriz"."mensagem_validacao" IS 'Mensagem de erro de validação customizada'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "campos_matriz"."formula_calculo" IS 'Fórmula para cálculo automático (ex: {campo1} + {campo2} * 2)'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "campos_matriz"."campos_dependentes" IS 'Array de IDs de campos dos quais este depende para cálculo'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "campos_matriz"."ordem_exibicao" IS 'Ordem de exibição do campo'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "campos_matriz"."linha" IS 'Linha no grid de layout (para posicionamento)'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "campos_matriz"."coluna" IS 'Coluna no grid de layout (para posicionamento)'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "campos_matriz"."largura" IS 'Largura do campo em colunas do grid'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "campos_matriz"."visivel" IS 'Se o campo é visível'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "campos_matriz"."somente_leitura" IS 'Se o campo é somente leitura (calculado ou bloqueado)'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "campos_matriz"."destacar_alterado" IS 'Se deve destacar quando valor está fora da referência'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "campos_matriz"."grupo" IS 'Nome do grupo ao qual o campo pertence (para organização)'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "campos_matriz"."secao" IS 'Nome da seção ao qual o campo pertence (nível acima do grupo)'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "campos_matriz"."configuracoes" IS 'Configurações adicionais específicas do campo'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "campos_matriz"."ativo" IS 'Se o campo está ativo'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "campos_matriz"."criado_em" IS 'Data de criação do registro'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "campos_matriz"."atualizado_em" IS 'Data da última atualização'`,
    );

    // Criar índices
    await queryRunner.query(
      `CREATE INDEX "IDX_campos_matriz_matriz_id" ON "campos_matriz" ("matriz_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_campos_matriz_codigo_campo" ON "campos_matriz" ("codigo_campo")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_campos_matriz_ordem_exibicao" ON "campos_matriz" ("ordem_exibicao")`,
    );

    // Criar foreign key
    await queryRunner.query(
      `ALTER TABLE "campos_matriz" ADD CONSTRAINT "FK_campos_matriz_matriz" FOREIGN KEY ("matriz_id") REFERENCES "matrizes_exames"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );

    // Foreign keys opcionais para matrizes_exames (tipo_exame e exame)
    // Não criar FK agora pois as tabelas tipos_exame e exames já existem mas podem não ter UUID
    // Se necessário, adicionar depois:
    // ALTER TABLE "matrizes_exames" ADD CONSTRAINT "FK_matrizes_tipo_exame" FOREIGN KEY ("tipo_exame_id") REFERENCES "tipos_exame"("id") ON DELETE SET NULL;
    // ALTER TABLE "matrizes_exames" ADD CONSTRAINT "FK_matrizes_exame" FOREIGN KEY ("exame_id") REFERENCES "exames"("id") ON DELETE SET NULL;
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remover foreign key
    await queryRunner.query(
      `ALTER TABLE "campos_matriz" DROP CONSTRAINT "FK_campos_matriz_matriz"`,
    );

    // Remover índices de campos_matriz
    await queryRunner.query(
      `DROP INDEX "public"."IDX_campos_matriz_ordem_exibicao"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_campos_matriz_codigo_campo"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_campos_matriz_matriz_id"`,
    );

    // Remover tabela campos_matriz
    await queryRunner.query(`DROP TABLE "campos_matriz"`);

    // Remover ENUMs de campos_matriz
    await queryRunner.query(
      `DROP TYPE "public"."campos_matriz_unidade_medida_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."campos_matriz_tipo_campo_enum"`,
    );

    // Remover índices de matrizes_exames
    await queryRunner.query(
      `DROP INDEX "public"."IDX_matrizes_exames_tipo_exame_id"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_matrizes_exames_tipo_matriz"`,
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_matrizes_exames_nome"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_matrizes_exames_codigo_interno"`,
    );

    // Remover tabela matrizes_exames
    await queryRunner.query(`DROP TABLE "matrizes_exames"`);

    // Remover ENUMs de matrizes_exames
    await queryRunner.query(`DROP TYPE "public"."matrizes_exames_status_enum"`);
    await queryRunner.query(
      `DROP TYPE "public"."matrizes_exames_tipo_matriz_enum"`,
    );
  }
}
