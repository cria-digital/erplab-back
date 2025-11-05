import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCamposFormularioInfra1762348789746
  implements MigrationInterface
{
  name = 'CreateCamposFormularioInfra1762348789746';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP CONSTRAINT "FK_807b76b6f688d6d7d47fe735c94"`,
    );
    await queryRunner.query(
      `ALTER TABLE "campos_formulario" DROP CONSTRAINT "FK_67439fee1218869b20c178026e3"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_34d8070cf1f668dd197cb5a372"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_ddd3718e7bbc953f53820939f8"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_1c7842a1c9b419f3d5cc463e28"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_02861eb976fbe5df422843ba49"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_65babffa2b26c3c96709274aa4"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_64e20564f6083689be073eec61"`,
    );
    await queryRunner.query(
      `CREATE TABLE "alternativas_campo_formulario" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "campo_formulario_id" uuid NOT NULL, "texto_alternativa" character varying(255) NOT NULL, "ordem" integer NOT NULL DEFAULT '0', "ativo" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_6d46a4da6b1a73afbbc1ccc8cc5" PRIMARY KEY ("id")); COMMENT ON COLUMN "alternativas_campo_formulario"."texto_alternativa" IS 'Texto da alternativa (ex: MG/DL, Audiometria)'; COMMENT ON COLUMN "alternativas_campo_formulario"."ordem" IS 'Ordem de exibição'; COMMENT ON COLUMN "alternativas_campo_formulario"."ativo" IS 'Se a alternativa está ativa'; COMMENT ON COLUMN "alternativas_campo_formulario"."created_at" IS 'Data de criação do registro'; COMMENT ON COLUMN "alternativas_campo_formulario"."updated_at" IS 'Data da última atualização'`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4d5dd5bbc1460e6595aae92895" ON "alternativas_campo_formulario" ("campo_formulario_id", "ordem") `,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP CONSTRAINT "UQ_807b76b6f688d6d7d47fe735c94"`,
    );
    await queryRunner.query(`ALTER TABLE "convenios" DROP COLUMN "empresa_id"`);
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP CONSTRAINT "UQ_80fe1c8895e9351c2ec2d0bf6d8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN "codigo_convenio"`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN "percentual_coparticipacao"`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN "aceita_atendimento_online"`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN "valor_consulta"`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN "observacoes_convenio"`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP CONSTRAINT "UQ_1c7842a1c9b419f3d5cc463e285"`,
    );
    await queryRunner.query(`ALTER TABLE "convenios" DROP COLUMN "codigo"`);
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN "observacoes"`,
    );
    await queryRunner.query(`ALTER TABLE "convenios" DROP COLUMN "cnpj"`);
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN "razao_social"`,
    );
    await queryRunner.query(
      `ALTER TABLE "campos_formulario" DROP COLUMN "valor_padrao"`,
    );
    await queryRunner.query(
      `ALTER TABLE "campos_formulario" DROP COLUMN "depende_de"`,
    );
    await queryRunner.query(
      `ALTER TABLE "campos_formulario" DROP COLUMN "campo_integracao"`,
    );
    await queryRunner.query(
      `ALTER TABLE "campos_formulario" DROP COLUMN "mapeamento_dados"`,
    );
    await queryRunner.query(
      `ALTER TABLE "campos_formulario" DROP COLUMN "visivel_portal"`,
    );
    await queryRunner.query(
      `ALTER TABLE "campos_formulario" DROP COLUMN "tamanho_maximo"`,
    );
    await queryRunner.query(
      `ALTER TABLE "campos_formulario" DROP COLUMN "somente_leitura"`,
    );
    await queryRunner.query(
      `ALTER TABLE "campos_formulario" DROP COLUMN "url_busca_dados"`,
    );
    await queryRunner.query(
      `ALTER TABLE "campos_formulario" DROP COLUMN "icone"`,
    );
    await queryRunner.query(
      `ALTER TABLE "campos_formulario" DROP COLUMN "condicoes_validacao"`,
    );
    await queryRunner.query(
      `ALTER TABLE "campos_formulario" DROP COLUMN "tamanho_minimo"`,
    );
    await queryRunner.query(
      `ALTER TABLE "campos_formulario" DROP COLUMN "mensagem_erro"`,
    );
    await queryRunner.query(
      `ALTER TABLE "campos_formulario" DROP COLUMN "formulario_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "campos_formulario" DROP COLUMN "opcoes_selecao"`,
    );
    await queryRunner.query(
      `ALTER TABLE "campos_formulario" DROP COLUMN "largura_coluna"`,
    );
    await queryRunner.query(
      `ALTER TABLE "campos_formulario" DROP CONSTRAINT "UQ_02861eb976fbe5df422843ba49d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "campos_formulario" DROP COLUMN "codigo_campo"`,
    );
    await queryRunner.query(
      `ALTER TABLE "campos_formulario" DROP COLUMN "valor_minimo"`,
    );
    await queryRunner.query(
      `ALTER TABLE "campos_formulario" DROP COLUMN "ordem"`,
    );
    await queryRunner.query(
      `ALTER TABLE "campos_formulario" DROP COLUMN "mascara"`,
    );
    await queryRunner.query(
      `ALTER TABLE "campos_formulario" DROP COLUMN "permite_outro"`,
    );
    await queryRunner.query(
      `ALTER TABLE "campos_formulario" DROP COLUMN "observacoes"`,
    );
    await queryRunner.query(
      `ALTER TABLE "campos_formulario" DROP COLUMN "visivel_impressao"`,
    );
    await queryRunner.query(
      `ALTER TABLE "campos_formulario" DROP COLUMN "valores_referencia"`,
    );
    await queryRunner.query(
      `ALTER TABLE "campos_formulario" DROP COLUMN "configuracoes_extras"`,
    );
    await queryRunner.query(
      `ALTER TABLE "campos_formulario" DROP COLUMN "tamanho_maximo_arquivo_mb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "campos_formulario" DROP COLUMN "condicoes_visibilidade"`,
    );
    await queryRunner.query(
      `ALTER TABLE "campos_formulario" DROP COLUMN "metadados"`,
    );
    await queryRunner.query(
      `ALTER TABLE "campos_formulario" DROP COLUMN "valor_maximo"`,
    );
    await queryRunner.query(
      `ALTER TABLE "campos_formulario" DROP COLUMN "permite_multipla_selecao"`,
    );
    await queryRunner.query(
      `ALTER TABLE "campos_formulario" DROP COLUMN "regex"`,
    );
    await queryRunner.query(
      `ALTER TABLE "campos_formulario" DROP COLUMN "condicoes_obrigatoriedade"`,
    );
    await queryRunner.query(
      `ALTER TABLE "campos_formulario" DROP COLUMN "obrigatorio"`,
    );
    await queryRunner.query(
      `ALTER TABLE "campos_formulario" DROP COLUMN "permite_multiplos_arquivos"`,
    );
    await queryRunner.query(
      `ALTER TABLE "campos_formulario" DROP COLUMN "max_arquivos"`,
    );
    await queryRunner.query(
      `ALTER TABLE "campos_formulario" DROP COLUMN "status"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."campos_formulario_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "campos_formulario" DROP COLUMN "formula_calculo"`,
    );
    await queryRunner.query(
      `ALTER TABLE "campos_formulario" DROP COLUMN "texto_ajuda"`,
    );
    await queryRunner.query(
      `ALTER TABLE "campos_formulario" DROP COLUMN "tipo_campo_padrao"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."campos_formulario_tipo_campo_padrao_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "campos_formulario" DROP COLUMN "tipos_arquivo_aceitos"`,
    );
    await queryRunner.query(
      `ALTER TABLE "campos_formulario" DROP COLUMN "campos_dependentes"`,
    );
    await queryRunner.query(
      `ALTER TABLE "campos_formulario" DROP COLUMN "placeholder"`,
    );
    await queryRunner.query(
      `ALTER TABLE "campos_formulario" DROP COLUMN "estilos_css"`,
    );
    await queryRunner.query(
      `ALTER TABLE "campos_formulario" DROP COLUMN "unidade_medida"`,
    );
    await queryRunner.query(
      `ALTER TABLE "campos_formulario" DROP COLUMN "tipo_campo"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."campos_formulario_tipo_campo_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "campos_formulario" DROP COLUMN "alinhamento"`,
    );
    await queryRunner.query(
      `ALTER TABLE "campos_formulario" DROP COLUMN "classes_css"`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD "codigo" character varying(20) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD CONSTRAINT "UQ_1c7842a1c9b419f3d5cc463e285" UNIQUE ("codigo")`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."codigo" IS 'Código interno do convênio'`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD "razao_social" character varying(255) NOT NULL`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."razao_social" IS 'Razão social'`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD "cnpj" character varying(14)`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."cnpj" IS 'CNPJ do convênio'`,
    );
    await queryRunner.query(`ALTER TABLE "convenios" ADD "observacoes" text`);
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."observacoes" IS 'Observações gerais'`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD "empresa_id" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD CONSTRAINT "UQ_807b76b6f688d6d7d47fe735c94" UNIQUE ("empresa_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD "codigo_convenio" character varying(20) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD CONSTRAINT "UQ_80fe1c8895e9351c2ec2d0bf6d8" UNIQUE ("codigo_convenio")`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD "aceita_atendimento_online" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD "percentual_coparticipacao" numeric(5,2)`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD "valor_consulta" numeric(10,2)`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD "observacoes_convenio" text`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN "registro_ans"`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD "registro_ans" character varying(50)`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."registro_ans" IS 'Registro ANS'`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN "tabela_precos"`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD "tabela_precos" character varying(50)`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."tabela_precos" IS 'Tabela de preços utilizada'`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ALTER COLUMN "nome" DROP NOT NULL`,
    );
    await queryRunner.query(`COMMENT ON COLUMN "convenios"."nome" IS NULL`);
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN "registro_ans"`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD "registro_ans" character varying(20)`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."tem_integracao_api" IS NULL`,
    );
    await queryRunner.query(`COMMENT ON COLUMN "convenios"."url_api" IS NULL`);
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."token_api" IS NULL`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."requer_autorizacao" IS NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ALTER COLUMN "requer_autorizacao" SET DEFAULT true`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."requer_senha" IS NULL`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."validade_guia_dias" IS NULL`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."convenios_tipo_faturamento_enum" RENAME TO "convenios_tipo_faturamento_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."convenios_tipo_faturamento_enum" AS ENUM('mensal', 'quinzenal', 'semanal', 'avulso')`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ALTER COLUMN "tipo_faturamento" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ALTER COLUMN "tipo_faturamento" TYPE "public"."convenios_tipo_faturamento_enum" USING "tipo_faturamento"::"text"::"public"."convenios_tipo_faturamento_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."convenios_tipo_faturamento_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ALTER COLUMN "tipo_faturamento" DROP NOT NULL`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."tipo_faturamento" IS NULL`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."portal_envio" IS NULL`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."dia_fechamento" IS NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ALTER COLUMN "prazo_pagamento_dias" SET NOT NULL`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."prazo_pagamento_dias" IS NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ALTER COLUMN "prazo_pagamento_dias" SET DEFAULT '30'`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ALTER COLUMN "percentual_desconto" DROP NOT NULL`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."percentual_desconto" IS NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ALTER COLUMN "percentual_desconto" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN "tabela_precos"`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD "tabela_precos" character varying(255)`,
    );
    await queryRunner.query(`COMMENT ON COLUMN "convenios"."telefone" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "convenios"."email" IS NULL`);
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."contato_nome" IS NULL`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."regras_especificas" IS NULL`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."convenios_status_enum" RENAME TO "convenios_status_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."convenios_status_enum" AS ENUM('ativo', 'inativo', 'suspenso', 'bloqueado')`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ALTER COLUMN "status" TYPE "public"."convenios_status_enum" USING "status"::"text"::"public"."convenios_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ALTER COLUMN "status" SET DEFAULT 'ativo'`,
    );
    await queryRunner.query(`DROP TYPE "public"."convenios_status_enum_old"`);
    await queryRunner.query(`COMMENT ON COLUMN "convenios"."status" IS NULL`);
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."criado_em" IS NULL`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."atualizado_em" IS NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "campos_formulario" DROP COLUMN "nome_campo"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."campos_formulario_nome_campo_enum" AS ENUM('tipo_exames', 'especialidade', 'grupo', 'subgrupo', 'setor', 'metodologia', 'unidade_medida', 'amostra', 'regiao_coleta', 'volume_minimo', 'estabilidade')`,
    );
    await queryRunner.query(
      `ALTER TABLE "campos_formulario" ADD "nome_campo" "public"."campos_formulario_nome_campo_enum" NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "campos_formulario" ADD CONSTRAINT "UQ_b100b1069ba5203243fce05988a" UNIQUE ("nome_campo")`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "campos_formulario"."nome_campo" IS 'Nome do campo (ex: unidade_medida, tipo_exames)'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "campos_formulario"."descricao" IS 'Descrição do campo e seu uso'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "campos_formulario"."ativo" IS 'Se o campo está ativo (soft delete)'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "campos_formulario"."created_at" IS 'Data de criação do registro'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "campos_formulario"."updated_at" IS 'Data da última atualização'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "campos_formulario"."created_by" IS 'ID do usuário que criou o registro'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "campos_formulario"."updated_by" IS 'ID do usuário que atualizou o registro'`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_34d8070cf1f668dd197cb5a372" ON "convenios" ("cnpj") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ddd3718e7bbc953f53820939f8" ON "convenios" ("nome") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1c7842a1c9b419f3d5cc463e28" ON "convenios" ("codigo") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_b100b1069ba5203243fce05988" ON "campos_formulario" ("nome_campo") `,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD CONSTRAINT "FK_807b76b6f688d6d7d47fe735c94" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "alternativas_campo_formulario" ADD CONSTRAINT "FK_58295b532a0b128ce0377888bc1" FOREIGN KEY ("campo_formulario_id") REFERENCES "campos_formulario"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "alternativas_campo_formulario" DROP CONSTRAINT "FK_58295b532a0b128ce0377888bc1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP CONSTRAINT "FK_807b76b6f688d6d7d47fe735c94"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_b100b1069ba5203243fce05988"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_1c7842a1c9b419f3d5cc463e28"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_ddd3718e7bbc953f53820939f8"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_34d8070cf1f668dd197cb5a372"`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "campos_formulario"."updated_by" IS NULL`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "campos_formulario"."created_by" IS NULL`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "campos_formulario"."updated_at" IS NULL`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "campos_formulario"."created_at" IS NULL`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "campos_formulario"."ativo" IS NULL`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "campos_formulario"."descricao" IS NULL`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "campos_formulario"."nome_campo" IS 'Nome do campo (ex: unidade_medida, tipo_exames)'`,
    );
    await queryRunner.query(
      `ALTER TABLE "campos_formulario" DROP CONSTRAINT "UQ_b100b1069ba5203243fce05988a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "campos_formulario" DROP COLUMN "nome_campo"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."campos_formulario_nome_campo_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "campos_formulario" ADD "nome_campo" character varying(255) NOT NULL`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."atualizado_em" IS 'Data de atualização'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."criado_em" IS 'Data de criação'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."status" IS 'Status do convênio'`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."convenios_status_enum_old" AS ENUM('ativo', 'inativo', 'suspenso')`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ALTER COLUMN "status" TYPE "public"."convenios_status_enum_old" USING "status"::"text"::"public"."convenios_status_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ALTER COLUMN "status" SET DEFAULT 'ativo'`,
    );
    await queryRunner.query(`DROP TYPE "public"."convenios_status_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."convenios_status_enum_old" RENAME TO "convenios_status_enum"`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."regras_especificas" IS 'Regras específicas do convênio'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."contato_nome" IS 'Pessoa de contato'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."email" IS 'E-mail de contato'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."telefone" IS 'Telefone de contato'`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN "tabela_precos"`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD "tabela_precos" character varying(50)`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ALTER COLUMN "percentual_desconto" SET DEFAULT '0'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."percentual_desconto" IS 'Percentual de desconto padrão'`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ALTER COLUMN "percentual_desconto" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ALTER COLUMN "prazo_pagamento_dias" DROP DEFAULT`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."prazo_pagamento_dias" IS 'Prazo de pagamento em dias'`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ALTER COLUMN "prazo_pagamento_dias" DROP NOT NULL`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."dia_fechamento" IS 'Dia de fechamento do faturamento'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."portal_envio" IS 'Portal de envio (SAVI, Orizon, etc)'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."tipo_faturamento" IS 'Tipo de faturamento'`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ALTER COLUMN "tipo_faturamento" SET NOT NULL`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."convenios_tipo_faturamento_enum_old" AS ENUM('manual', 'proprio', 'tiss')`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ALTER COLUMN "tipo_faturamento" TYPE "public"."convenios_tipo_faturamento_enum_old" USING "tipo_faturamento"::"text"::"public"."convenios_tipo_faturamento_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ALTER COLUMN "tipo_faturamento" SET DEFAULT 'tiss'`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."convenios_tipo_faturamento_enum"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."convenios_tipo_faturamento_enum_old" RENAME TO "convenios_tipo_faturamento_enum"`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."validade_guia_dias" IS 'Validade padrão da guia em dias'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."requer_senha" IS 'Se requer senha de autorização'`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ALTER COLUMN "requer_autorizacao" SET DEFAULT false`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."requer_autorizacao" IS 'Se requer autorização prévia'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."token_api" IS 'Token/chave de acesso'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."url_api" IS 'URL da API do convênio'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."tem_integracao_api" IS 'Se tem integração via API'`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN "registro_ans"`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD "registro_ans" character varying(50)`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."nome" IS 'Nome do convênio'`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ALTER COLUMN "nome" SET NOT NULL`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."tabela_precos" IS 'Tabela de preços utilizada'`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN "tabela_precos"`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD "tabela_precos" character varying(255)`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."registro_ans" IS 'Registro ANS'`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN "registro_ans"`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD "registro_ans" character varying(20)`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN "observacoes_convenio"`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN "valor_consulta"`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN "percentual_coparticipacao"`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN "aceita_atendimento_online"`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP CONSTRAINT "UQ_80fe1c8895e9351c2ec2d0bf6d8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN "codigo_convenio"`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP CONSTRAINT "UQ_807b76b6f688d6d7d47fe735c94"`,
    );
    await queryRunner.query(`ALTER TABLE "convenios" DROP COLUMN "empresa_id"`);
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."observacoes" IS 'Observações gerais'`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN "observacoes"`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."cnpj" IS 'CNPJ do convênio'`,
    );
    await queryRunner.query(`ALTER TABLE "convenios" DROP COLUMN "cnpj"`);
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."razao_social" IS 'Razão social'`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN "razao_social"`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."codigo" IS 'Código interno do convênio'`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP CONSTRAINT "UQ_1c7842a1c9b419f3d5cc463e285"`,
    );
    await queryRunner.query(`ALTER TABLE "convenios" DROP COLUMN "codigo"`);
    await queryRunner.query(
      `ALTER TABLE "campos_formulario" ADD "classes_css" jsonb`,
    );
    await queryRunner.query(
      `ALTER TABLE "campos_formulario" ADD "alinhamento" character varying(50) NOT NULL DEFAULT 'left'`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."campos_formulario_tipo_campo_enum" AS ENUM('arquivo', 'assinatura', 'cep', 'checkbox', 'cnpj', 'codigo_barras', 'condicional', 'cpf', 'data', 'data_hora', 'decimal', 'email', 'formula', 'hora', 'html', 'imagem', 'lista', 'localizacao', 'matriz', 'moeda', 'multipla_escolha', 'numero', 'paragrafo', 'periodo_data', 'porcentagem', 'qr_code', 'radio', 'secao', 'select', 'separador', 'switch', 'tabela', 'telefone', 'texto', 'texto_longo', 'texto_rico', 'titulo', 'url')`,
    );
    await queryRunner.query(
      `ALTER TABLE "campos_formulario" ADD "tipo_campo" "public"."campos_formulario_tipo_campo_enum" NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "campos_formulario" ADD "unidade_medida" character varying(50)`,
    );
    await queryRunner.query(
      `ALTER TABLE "campos_formulario" ADD "estilos_css" jsonb`,
    );
    await queryRunner.query(
      `ALTER TABLE "campos_formulario" ADD "placeholder" text`,
    );
    await queryRunner.query(
      `ALTER TABLE "campos_formulario" ADD "campos_dependentes" jsonb`,
    );
    await queryRunner.query(
      `ALTER TABLE "campos_formulario" ADD "tipos_arquivo_aceitos" jsonb`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."campos_formulario_tipo_campo_padrao_enum" AS ENUM('customizado', 'sistema')`,
    );
    await queryRunner.query(
      `ALTER TABLE "campos_formulario" ADD "tipo_campo_padrao" "public"."campos_formulario_tipo_campo_padrao_enum" NOT NULL DEFAULT 'customizado'`,
    );
    await queryRunner.query(
      `ALTER TABLE "campos_formulario" ADD "texto_ajuda" text`,
    );
    await queryRunner.query(
      `ALTER TABLE "campos_formulario" ADD "formula_calculo" text`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."campos_formulario_status_enum" AS ENUM('ativo', 'inativo', 'oculto')`,
    );
    await queryRunner.query(
      `ALTER TABLE "campos_formulario" ADD "status" "public"."campos_formulario_status_enum" NOT NULL DEFAULT 'ativo'`,
    );
    await queryRunner.query(
      `ALTER TABLE "campos_formulario" ADD "max_arquivos" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "campos_formulario" ADD "permite_multiplos_arquivos" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "campos_formulario" ADD "obrigatorio" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "campos_formulario" ADD "condicoes_obrigatoriedade" jsonb`,
    );
    await queryRunner.query(
      `ALTER TABLE "campos_formulario" ADD "regex" character varying(500)`,
    );
    await queryRunner.query(
      `ALTER TABLE "campos_formulario" ADD "permite_multipla_selecao" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "campos_formulario" ADD "valor_maximo" numeric(15,2)`,
    );
    await queryRunner.query(
      `ALTER TABLE "campos_formulario" ADD "metadados" jsonb`,
    );
    await queryRunner.query(
      `ALTER TABLE "campos_formulario" ADD "condicoes_visibilidade" jsonb`,
    );
    await queryRunner.query(
      `ALTER TABLE "campos_formulario" ADD "tamanho_maximo_arquivo_mb" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "campos_formulario" ADD "configuracoes_extras" jsonb`,
    );
    await queryRunner.query(
      `ALTER TABLE "campos_formulario" ADD "valores_referencia" jsonb`,
    );
    await queryRunner.query(
      `ALTER TABLE "campos_formulario" ADD "visivel_impressao" boolean NOT NULL DEFAULT true`,
    );
    await queryRunner.query(
      `ALTER TABLE "campos_formulario" ADD "observacoes" text`,
    );
    await queryRunner.query(
      `ALTER TABLE "campos_formulario" ADD "permite_outro" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "campos_formulario" ADD "mascara" character varying(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "campos_formulario" ADD "ordem" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "campos_formulario" ADD "valor_minimo" numeric(15,2)`,
    );
    await queryRunner.query(
      `ALTER TABLE "campos_formulario" ADD "codigo_campo" character varying(50) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "campos_formulario" ADD CONSTRAINT "UQ_02861eb976fbe5df422843ba49d" UNIQUE ("codigo_campo")`,
    );
    await queryRunner.query(
      `ALTER TABLE "campos_formulario" ADD "largura_coluna" integer NOT NULL DEFAULT '12'`,
    );
    await queryRunner.query(
      `ALTER TABLE "campos_formulario" ADD "opcoes_selecao" jsonb`,
    );
    await queryRunner.query(
      `ALTER TABLE "campos_formulario" ADD "formulario_id" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "campos_formulario" ADD "mensagem_erro" text`,
    );
    await queryRunner.query(
      `ALTER TABLE "campos_formulario" ADD "tamanho_minimo" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "campos_formulario" ADD "condicoes_validacao" jsonb`,
    );
    await queryRunner.query(
      `ALTER TABLE "campos_formulario" ADD "icone" character varying(50)`,
    );
    await queryRunner.query(
      `ALTER TABLE "campos_formulario" ADD "url_busca_dados" character varying(500)`,
    );
    await queryRunner.query(
      `ALTER TABLE "campos_formulario" ADD "somente_leitura" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "campos_formulario" ADD "tamanho_maximo" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "campos_formulario" ADD "visivel_portal" boolean NOT NULL DEFAULT true`,
    );
    await queryRunner.query(
      `ALTER TABLE "campos_formulario" ADD "mapeamento_dados" jsonb`,
    );
    await queryRunner.query(
      `ALTER TABLE "campos_formulario" ADD "campo_integracao" character varying(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "campos_formulario" ADD "depende_de" jsonb`,
    );
    await queryRunner.query(
      `ALTER TABLE "campos_formulario" ADD "valor_padrao" text`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD "razao_social" character varying(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD "cnpj" character varying(14)`,
    );
    await queryRunner.query(`ALTER TABLE "convenios" ADD "observacoes" text`);
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD "codigo" character varying(20) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD CONSTRAINT "UQ_1c7842a1c9b419f3d5cc463e285" UNIQUE ("codigo")`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD "observacoes_convenio" text`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD "valor_consulta" numeric(10,2)`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD "aceita_atendimento_online" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD "percentual_coparticipacao" numeric(5,2)`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD "codigo_convenio" character varying(20) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD CONSTRAINT "UQ_80fe1c8895e9351c2ec2d0bf6d8" UNIQUE ("codigo_convenio")`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD "empresa_id" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD CONSTRAINT "UQ_807b76b6f688d6d7d47fe735c94" UNIQUE ("empresa_id")`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_4d5dd5bbc1460e6595aae92895"`,
    );
    await queryRunner.query(`DROP TABLE "alternativas_campo_formulario"`);
    await queryRunner.query(
      `CREATE INDEX "IDX_64e20564f6083689be073eec61" ON "campos_formulario" ("formulario_id", "ordem") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_65babffa2b26c3c96709274aa4" ON "campos_formulario" ("tipo_campo") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_02861eb976fbe5df422843ba49" ON "campos_formulario" ("codigo_campo") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1c7842a1c9b419f3d5cc463e28" ON "convenios" ("codigo") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ddd3718e7bbc953f53820939f8" ON "convenios" ("nome") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_34d8070cf1f668dd197cb5a372" ON "convenios" ("cnpj") `,
    );
    await queryRunner.query(
      `ALTER TABLE "campos_formulario" ADD CONSTRAINT "FK_67439fee1218869b20c178026e3" FOREIGN KEY ("formulario_id") REFERENCES "formularios"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD CONSTRAINT "FK_807b76b6f688d6d7d47fe735c94" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
