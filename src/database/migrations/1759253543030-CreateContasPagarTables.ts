import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateContasPagarTables1759253543030
  implements MigrationInterface
{
  name = 'CreateContasPagarTables1759253543030';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "telemedicina" DROP CONSTRAINT "FK_3b8b6cbf7da8164244b24e455f0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP CONSTRAINT "FK_convenios_empresa"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ordens_servico" DROP CONSTRAINT "fk_ordem_convenio"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ordens_servico" DROP CONSTRAINT "fk_ordem_paciente"`,
    );
    await queryRunner.query(
      `ALTER TABLE "resultados_exames" DROP CONSTRAINT "fk_resultado_ordem_exame"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ordens_servico_exames" DROP CONSTRAINT "fk_ordem_exame_exame"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ordens_servico_exames" DROP CONSTRAINT "fk_ordem_exame_ordem"`,
    );
    await queryRunner.query(
      `ALTER TABLE "exames" DROP CONSTRAINT "fk_exame_laboratorio"`,
    );
    await queryRunner.query(
      `ALTER TABLE "exames" DROP CONSTRAINT "fk_exame_setor"`,
    );
    await queryRunner.query(
      `ALTER TABLE "exames" DROP CONSTRAINT "fk_exame_subgrupo"`,
    );
    await queryRunner.query(
      `ALTER TABLE "exames" DROP CONSTRAINT "fk_exame_tipo"`,
    );
    await queryRunner.query(
      `ALTER TABLE "prestadores_servico" DROP CONSTRAINT "FK_prestador_servico_empresa"`,
    );
    await queryRunner.query(
      `ALTER TABLE "prestador_servico_categorias" DROP CONSTRAINT "FK_prestador_servico_categoria_prestador"`,
    );
    await queryRunner.query(
      `ALTER TABLE "laboratorios" DROP CONSTRAINT "FK_6ee6a251b531dbdd6d18ed9ca6a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "kit_exames" DROP CONSTRAINT "FK_kit_exame_exame"`,
    );
    await queryRunner.query(
      `ALTER TABLE "kit_exames" DROP CONSTRAINT "FK_kit_exame_kit"`,
    );
    await queryRunner.query(
      `ALTER TABLE "kit_unidades" DROP CONSTRAINT "FK_kit_unidade_unidade"`,
    );
    await queryRunner.query(
      `ALTER TABLE "kit_unidades" DROP CONSTRAINT "FK_kit_unidade_kit"`,
    );
    await queryRunner.query(
      `ALTER TABLE "kit_convenios" DROP CONSTRAINT "FK_kit_convenio_convenio"`,
    );
    await queryRunner.query(
      `ALTER TABLE "kit_convenios" DROP CONSTRAINT "FK_kit_convenio_kit"`,
    );
    await queryRunner.query(
      `ALTER TABLE "kits" DROP CONSTRAINT "FK_kit_empresa"`,
    );
    await queryRunner.query(
      `ALTER TABLE "fornecedores" DROP CONSTRAINT "FK_0fb8f907c40978d0f3b198adabc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "gateways_pagamento" DROP CONSTRAINT "FK_gateway_conta_bancaria"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contas_bancarias" DROP CONSTRAINT "FK_conta_unidade"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contas_bancarias" DROP CONSTRAINT "FK_conta_banco"`,
    );
    await queryRunner.query(
      `ALTER TABLE "adquirentes" DROP CONSTRAINT "FK_adquirente_conta_bancaria"`,
    );
    await queryRunner.query(
      `ALTER TABLE "restricoes_adquirente" DROP CONSTRAINT "FK_restricao_adquirente"`,
    );
    await queryRunner.query(
      `ALTER TABLE "planos_contas" DROP CONSTRAINT "FK_plano_conta_pai"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contas_contabeis" DROP CONSTRAINT "FK_conta_contabil_unidade"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contas_contabeis" DROP CONSTRAINT "FK_conta_contabil_plano"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_telemedicina_empresa_id"`,
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_telemedicina_codigo"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_telemedicina_tipo_integracao"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_telemedicina_status_integracao"`,
    );
    await queryRunner.query(`DROP INDEX "public"."idx_pacientes_cpf"`);
    await queryRunner.query(`DROP INDEX "public"."idx_exames_codigo_interno"`);
    await queryRunner.query(`DROP INDEX "public"."idx_exames_nome"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_telemedicina_exames_telemedicina_id"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_telemedicina_exames_exame_id"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_telemedicina_exames_ativo"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_prestador_servico_status_contrato"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_prestador_servico_tipo_contrato"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_prestador_servico_categoria_unique"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_prestador_servico_categoria_ativo"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_ddd3718e7bbc953f53820939f8"`,
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_kit_codigo_interno"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_kit_nome"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_kit_tipo"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_kit_status"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_kit_empresa"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_fornecedores_empresa_id"`,
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_fornecedores_codigo"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_fornecedores_status"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_fornecedor_insumos_fornecedor_id"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_fornecedor_insumos_categoria"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_fornecedor_insumos_status"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_fornecedor_insumos_ativo"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_fornecedor_insumos_codigo_barras"`,
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_banco_codigo"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_banco_status"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_gateway_conta"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_gateway_tipo"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_gateway_status"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_conta_banco"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_conta_unidade"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_conta_status"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_adquirente_conta"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_adquirente_tipo"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_adquirente_status"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_restricao_adquirente"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_plano_conta_codigo"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_plano_conta_pai"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_plano_conta_tipo"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_conta_contabil_plano"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_conta_contabil_unidade"`);
    await queryRunner.query(
      `ALTER TABLE "kit_exames" DROP CONSTRAINT "UQ_kit_exame"`,
    );
    await queryRunner.query(
      `ALTER TABLE "kit_unidades" DROP CONSTRAINT "UQ_kit_unidade"`,
    );
    await queryRunner.query(
      `ALTER TABLE "kit_convenios" DROP CONSTRAINT "UQ_kit_convenio"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contas_contabeis" DROP CONSTRAINT "UQ_conta_contabil_plano_unidade"`,
    );
    await queryRunner.query(
      `CREATE TABLE "laboratorios_metodos" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "laboratorio_id" uuid NOT NULL, "metodo_id" uuid NOT NULL, "validado" boolean NOT NULL DEFAULT false, "data_validacao" TIMESTAMP, "observacoes" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_ed743591a5d616dd3dadc957187" UNIQUE ("laboratorio_id", "metodo_id"), CONSTRAINT "PK_136be598d2ab033852085122c82" PRIMARY KEY ("id")); COMMENT ON COLUMN "laboratorios_metodos"."laboratorio_id" IS 'ID do laboratório'; COMMENT ON COLUMN "laboratorios_metodos"."metodo_id" IS 'ID do método'; COMMENT ON COLUMN "laboratorios_metodos"."validado" IS 'Indica se o laboratório está validado para usar este método'; COMMENT ON COLUMN "laboratorios_metodos"."data_validacao" IS 'Data de validação do laboratório para o método'; COMMENT ON COLUMN "laboratorios_metodos"."observacoes" IS 'Observações sobre o vínculo laboratório-método'`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7d18ea692673166969ee739164" ON "laboratorios_metodos" ("metodo_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e1445f18d757962ef62fcd75ef" ON "laboratorios_metodos" ("laboratorio_id") `,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."metodos_status_enum" AS ENUM('ativo', 'inativo', 'em_validacao')`,
    );
    await queryRunner.query(
      `CREATE TABLE "metodos" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "nome" character varying(255) NOT NULL, "codigo_interno" character varying(50) NOT NULL, "descricao" text, "status" "public"."metodos_status_enum" NOT NULL DEFAULT 'em_validacao', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_808aa72c9cd62a9f8bb83691bdd" UNIQUE ("codigo_interno"), CONSTRAINT "PK_1b6527a88a7afc35d98723e8bdd" PRIMARY KEY ("id")); COMMENT ON COLUMN "metodos"."nome" IS 'Nome do método'; COMMENT ON COLUMN "metodos"."codigo_interno" IS 'Código interno do método (ex: MET123)'; COMMENT ON COLUMN "metodos"."descricao" IS 'Descrição detalhada do método'; COMMENT ON COLUMN "metodos"."status" IS 'Status do método'`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_8a7c2084abeadd7660da4350ca" ON "metodos" ("nome") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_808aa72c9cd62a9f8bb83691bd" ON "metodos" ("codigo_interno") `,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."tabelas_preco_tipo_tabela_enum" AS ENUM('tuss', 'cbhpm', 'propria', 'brasindice', 'simpro')`,
    );
    await queryRunner.query(
      `CREATE TABLE "tabelas_preco" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "plano_id" uuid NOT NULL, "codigo_tabela" character varying(50) NOT NULL, "descricao" character varying(255) NOT NULL, "tipo_tabela" "public"."tabelas_preco_tipo_tabela_enum" NOT NULL, "versao" character varying(20), "edicao" character varying(20), "data_vigencia" date NOT NULL, "percentual_desconto" numeric(5,2) NOT NULL DEFAULT '0', "percentual_acrescimo" numeric(5,2) NOT NULL DEFAULT '0', "valor_ch" numeric(10,2), "valor_uco" numeric(10,2), "valor_porte_anestesico" numeric(10,2), "valor_filme" numeric(10,2), "ativa" boolean NOT NULL DEFAULT true, "observacoes" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_afea3649f6713afb112b4bd06e4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "procedimentos_autorizados" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "plano_id" uuid NOT NULL, "codigo_tuss" character varying(20), "codigo_cbhpm" character varying(20), "codigo_proprio" character varying(20), "descricao" character varying(500) NOT NULL, "valor_negociado" numeric(10,2) NOT NULL, "percentual_coparticipacao" numeric(5,2) NOT NULL DEFAULT '0', "carencia_especifica_dias" integer NOT NULL DEFAULT '0', "limite_utilizacao_mensal" integer, "limite_utilizacao_anual" integer, "necessita_autorizacao" boolean NOT NULL DEFAULT false, "documentacao_necessaria" json, "prazo_autorizacao_dias" integer NOT NULL DEFAULT '1', "observacoes" text, "ativo" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_bf4a177fbda94cafe3070ef1607" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."restricoes_tipo_restricao_enum" AS ENUM('procedimento', 'especialidade', 'prestador', 'medicamento', 'material')`,
    );
    await queryRunner.query(
      `CREATE TABLE "restricoes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "plano_id" uuid NOT NULL, "tipo_restricao" "public"."restricoes_tipo_restricao_enum" NOT NULL, "codigo_item" character varying(50), "descricao" character varying(500) NOT NULL, "motivo" text NOT NULL, "data_inicio" date NOT NULL, "data_fim" date, "ativa" boolean NOT NULL DEFAULT true, "observacoes" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_1c664f8b50a52b0fe9dd19d423f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."planos_tipo_plano_enum" AS ENUM('ambulatorial', 'hospitalar', 'completo', 'odontologico')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."planos_categoria_enum" AS ENUM('basico', 'intermediario', 'premium', 'executivo')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."planos_modalidade_enum" AS ENUM('pre_pagamento', 'pos_pagamento', 'coparticipacao')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."planos_status_enum" AS ENUM('ativo', 'inativo', 'suspenso')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."planos_cobertura_geografica_enum" AS ENUM('municipal', 'estadual', 'nacional', 'internacional')`,
    );
    await queryRunner.query(
      `CREATE TABLE "planos" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "convenio_id" uuid NOT NULL, "codigo_plano" character varying(50) NOT NULL, "nome_plano" character varying(255) NOT NULL, "tipo_plano" "public"."planos_tipo_plano_enum" NOT NULL, "categoria" "public"."planos_categoria_enum" NOT NULL, "modalidade" "public"."planos_modalidade_enum" NOT NULL, "vigencia_inicio" date NOT NULL, "vigencia_fim" date, "status" "public"."planos_status_enum" NOT NULL DEFAULT 'ativo', "carencia_dias" integer NOT NULL DEFAULT '0', "cobertura_geografica" "public"."planos_cobertura_geografica_enum" NOT NULL, "valor_consulta" numeric(10,2), "valor_ch" numeric(10,2), "valor_uco" numeric(10,2), "valor_filme" numeric(10,2), "percentual_coparticipacao" numeric(5,2), "limite_mensal" numeric(10,2), "limite_anual" numeric(10,2), "observacoes" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_683c959790c0f44669997e1a558" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."instrucoes_categoria_enum" AS ENUM('autorizacao_previa', 'faturamento', 'atendimento', 'documentacao', 'auditoria', 'urgencia_emergencia', 'internacao', 'sadt')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."instrucoes_tipo_procedimento_enum" AS ENUM('todos', 'consultas', 'exames', 'cirurgias', 'internacoes', 'procedimentos_especiais')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."instrucoes_status_enum" AS ENUM('ativa', 'inativa', 'suspensa')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."instrucoes_prioridade_enum" AS ENUM('alta', 'media', 'baixa')`,
    );
    await queryRunner.query(
      `CREATE TABLE "instrucoes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "convenio_id" uuid NOT NULL, "codigo" character varying(20) NOT NULL, "categoria" "public"."instrucoes_categoria_enum" NOT NULL, "tipo_procedimento" "public"."instrucoes_tipo_procedimento_enum" NOT NULL DEFAULT 'todos', "titulo" character varying(255) NOT NULL, "descricao" text NOT NULL, "prazo_resposta_dias" integer, "prazo_resposta_horas" integer, "vigencia_inicio" date NOT NULL, "vigencia_fim" date, "status" "public"."instrucoes_status_enum" NOT NULL DEFAULT 'ativa', "prioridade" "public"."instrucoes_prioridade_enum" NOT NULL DEFAULT 'media', "setor_responsavel" character varying(100), "contato_telefone" character varying(20), "contato_email" character varying(255), "documentos_necessarios" json, "anexos" json, "links_uteis" json, "tags" json, "observacoes_internas" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" character varying(255), "updated_by" character varying(255), CONSTRAINT "PK_c94fadf3c7a4302dc22b66ccb6e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."integracoes_tipo_integracao_enum" AS ENUM('laboratorio_apoio', 'telemedicina', 'gateway_pagamento', 'banco', 'prefeitura_nfse', 'sefaz', 'receita_federal', 'power_bi', 'pabx', 'correios', 'ocr', 'convenios', 'adquirentes', 'pacs', 'email', 'whatsapp', 'concessionarias', 'outros')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."integracoes_padrao_comunicacao_enum" AS ENUM('rest_api', 'soap', 'graphql', 'webhook', 'ftp', 'sftp', 'email', 'database', 'file', 'manual')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."integracoes_formato_retorno_enum" AS ENUM('json', 'xml', 'csv', 'txt', 'pdf', 'html', 'binary')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."integracoes_status_enum" AS ENUM('ativa', 'inativa', 'em_configuracao', 'erro', 'manutencao')`,
    );
    await queryRunner.query(
      `CREATE TABLE "integracoes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tipo_integracao" "public"."integracoes_tipo_integracao_enum" NOT NULL, "nome_integracao" character varying(100) NOT NULL, "descricao_api" character varying(255), "codigo_identificacao" character varying(50) NOT NULL, "unidade_saude_id" uuid, "url_api_exames" character varying(500), "url_api_guia_exames" character varying(500), "token_autenticacao" character varying(500), "chave_api" character varying(500), "padrao_comunicacao" "public"."integracoes_padrao_comunicacao_enum", "formato_retorno" "public"."integracoes_formato_retorno_enum", "nome_laboratorio" character varying(100), "nome_prefeitura" character varying(100), "nome_banco" character varying(100), "nome_gateway" character varying(100), "nome_convenio" character varying(100), "nome_adquirente" character varying(100), "nome_concessionaria" character varying(100), "url_base" character varying(500), "url_autenticacao" character varying(500), "url_consulta" character varying(500), "url_envio" character varying(500), "url_callback" character varying(500), "usuario" character varying(255), "senha" character varying(255), "certificado_digital" character varying(500), "senha_certificado" character varying(255), "configuracoes_adicionais" jsonb, "headers_customizados" jsonb, "parametros_conexao" jsonb, "status" "public"."integracoes_status_enum" NOT NULL DEFAULT 'em_configuracao', "ativo" boolean NOT NULL DEFAULT true, "ultima_sincronizacao" TIMESTAMP, "ultima_tentativa" TIMESTAMP, "tentativas_falhas" integer NOT NULL DEFAULT '0', "ultimo_erro" text, "timeout_segundos" integer NOT NULL DEFAULT '30', "intervalo_sincronizacao_minutos" integer, "limite_requisicoes_dia" integer, "requisicoes_hoje" integer NOT NULL DEFAULT '0', "data_reset_contador" date, "observacoes" character varying(255), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" character varying(100), "updated_by" character varying(100), CONSTRAINT "UQ_b2c226842808110feee86182a81" UNIQUE ("codigo_identificacao"), CONSTRAINT "PK_4bc3b02cf967f617ba1aa0c7c23" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_d7605e31326af142657184148d" ON "integracoes" ("status") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b2c226842808110feee86182a8" ON "integracoes" ("codigo_identificacao") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_31f9e7b77d84db8376b81c265b" ON "integracoes" ("tipo_integracao", "unidade_saude_id") `,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."alternativas_campo_status_enum" AS ENUM('ativa', 'inativa')`,
    );
    await queryRunner.query(
      `CREATE TABLE "alternativas_campo" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "campo_formulario_id" uuid NOT NULL, "codigo_alternativa" character varying(50) NOT NULL, "texto_alternativa" text NOT NULL, "descricao" text, "valor" character varying(255), "ordem" integer NOT NULL DEFAULT '0', "icone" character varying(50), "cor" character varying(50), "imagem_url" character varying(500), "estilos_css" jsonb, "selecionado_padrao" boolean NOT NULL DEFAULT false, "permite_texto_adicional" boolean NOT NULL DEFAULT false, "placeholder_texto_adicional" character varying(255), "exclusiva" boolean NOT NULL DEFAULT false, "pontuacao" numeric(10,2), "peso" numeric(5,2) NOT NULL DEFAULT '1', "acoes_ao_selecionar" jsonb, "campos_mostrar" jsonb, "campos_ocultar" jsonb, "campos_obrigatorios" jsonb, "proxima_pergunta_id" text, "validacoes_customizadas" jsonb, "mensagem_validacao" text, "codigo_externo" character varying(255), "mapeamento_integracao" jsonb, "categoria" character varying(100), "tags" jsonb, "status" "public"."alternativas_campo_status_enum" NOT NULL DEFAULT 'ativa', "ativo" boolean NOT NULL DEFAULT true, "visivel_impressao" boolean NOT NULL DEFAULT true, "visivel_portal" boolean NOT NULL DEFAULT true, "metadados" jsonb, "observacoes" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" character varying(100), "updated_by" character varying(100), CONSTRAINT "UQ_e6fed83083145e4eacacdef3809" UNIQUE ("codigo_alternativa"), CONSTRAINT "PK_af43a8e9209e325e21600a6b8f6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_e6fed83083145e4eacacdef380" ON "alternativas_campo" ("codigo_alternativa") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b5a3ab4d3ad30855ad4c39e736" ON "alternativas_campo" ("campo_formulario_id", "ordem") `,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."campos_formulario_tipo_campo_enum" AS ENUM('texto', 'texto_longo', 'texto_rico', 'email', 'url', 'telefone', 'cpf', 'cnpj', 'cep', 'numero', 'decimal', 'moeda', 'porcentagem', 'data', 'hora', 'data_hora', 'periodo_data', 'select', 'radio', 'checkbox', 'switch', 'multipla_escolha', 'arquivo', 'imagem', 'assinatura', 'localizacao', 'codigo_barras', 'qr_code', 'secao', 'separador', 'titulo', 'paragrafo', 'html', 'tabela', 'lista', 'matriz', 'formula', 'condicional')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."campos_formulario_status_enum" AS ENUM('ativo', 'inativo', 'oculto')`,
    );
    await queryRunner.query(
      `CREATE TABLE "campos_formulario" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "formulario_id" uuid NOT NULL, "codigo_campo" character varying(50) NOT NULL, "nome_campo" character varying(255) NOT NULL, "descricao" text, "placeholder" text, "texto_ajuda" text, "tipo_campo" "public"."campos_formulario_tipo_campo_enum" NOT NULL, "ordem" integer NOT NULL DEFAULT '0', "obrigatorio" boolean NOT NULL DEFAULT false, "somente_leitura" boolean NOT NULL DEFAULT false, "tamanho_minimo" integer, "tamanho_maximo" integer, "valor_minimo" numeric(15,2), "valor_maximo" numeric(15,2), "mascara" character varying(255), "regex" character varying(500), "mensagem_erro" text, "valor_padrao" text, "opcoes_selecao" jsonb, "permite_multipla_selecao" boolean NOT NULL DEFAULT false, "permite_outro" boolean NOT NULL DEFAULT false, "tipos_arquivo_aceitos" jsonb, "tamanho_maximo_arquivo_mb" integer, "permite_multiplos_arquivos" boolean NOT NULL DEFAULT false, "max_arquivos" integer, "largura_coluna" integer NOT NULL DEFAULT '12', "alinhamento" character varying(50) NOT NULL DEFAULT 'left', "estilos_css" jsonb, "classes_css" jsonb, "icone" character varying(50), "condicoes_visibilidade" jsonb, "condicoes_obrigatoriedade" jsonb, "condicoes_validacao" jsonb, "formula_calculo" text, "campos_dependentes" jsonb, "depende_de" jsonb, "campo_integracao" character varying(255), "url_busca_dados" character varying(500), "mapeamento_dados" jsonb, "unidade_medida" character varying(50), "valores_referencia" jsonb, "status" "public"."campos_formulario_status_enum" NOT NULL DEFAULT 'ativo', "ativo" boolean NOT NULL DEFAULT true, "visivel_impressao" boolean NOT NULL DEFAULT true, "visivel_portal" boolean NOT NULL DEFAULT true, "metadados" jsonb, "configuracoes_extras" jsonb, "observacoes" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" character varying(100), "updated_by" character varying(100), CONSTRAINT "UQ_02861eb976fbe5df422843ba49d" UNIQUE ("codigo_campo"), CONSTRAINT "PK_cedc93bba3f03ae4c01180e06a8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_02861eb976fbe5df422843ba49" ON "campos_formulario" ("codigo_campo") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_65babffa2b26c3c96709274aa4" ON "campos_formulario" ("tipo_campo") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_64e20564f6083689be073eec61" ON "campos_formulario" ("formulario_id", "ordem") `,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."formularios_tipo_enum" AS ENUM('exame', 'anamnese', 'prescricao', 'laudo', 'receita', 'atestado', 'declaracao', 'questionario', 'ficha_clinica', 'evolucao', 'termo_consentimento', 'customizado')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."formularios_categoria_enum" AS ENUM('clinico', 'administrativo', 'financeiro', 'operacional', 'qualidade', 'pesquisa')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."formularios_status_enum" AS ENUM('rascunho', 'publicado', 'arquivado', 'em_revisao')`,
    );
    await queryRunner.query(
      `CREATE TABLE "formularios" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "codigo_formulario" character varying(50) NOT NULL, "nome_formulario" character varying(255) NOT NULL, "descricao" text, "tipo" "public"."formularios_tipo_enum" NOT NULL DEFAULT 'customizado', "categoria" "public"."formularios_categoria_enum", "unidade_saude_id" uuid, "versao" integer NOT NULL DEFAULT '1', "status" "public"."formularios_status_enum" NOT NULL DEFAULT 'rascunho', "ativo" boolean NOT NULL DEFAULT true, "obrigatorio" boolean NOT NULL DEFAULT false, "permite_edicao" boolean NOT NULL DEFAULT true, "requer_assinatura" boolean NOT NULL DEFAULT false, "permite_anexos" boolean NOT NULL DEFAULT false, "max_anexos" integer, "gera_pdf" boolean NOT NULL DEFAULT false, "envia_email" boolean NOT NULL DEFAULT false, "exibir_numeracao" boolean NOT NULL DEFAULT true, "exibir_progresso" boolean NOT NULL DEFAULT false, "permite_salvar_rascunho" boolean NOT NULL DEFAULT true, "validacao_tempo_real" boolean NOT NULL DEFAULT true, "perfis_acesso" jsonb, "departamentos_acesso" jsonb, "template_cabecalho" text, "template_rodape" text, "estilos_customizados" jsonb, "configuracoes_extras" jsonb, "regras_validacao" jsonb, "regras_visibilidade" jsonb, "logica_condicional" jsonb, "webhook_url" character varying(500), "integracao_config" jsonb, "gatilhos_automacao" jsonb, "total_preenchimentos" integer NOT NULL DEFAULT '0', "ultimo_preenchimento" TIMESTAMP, "data_publicacao" TIMESTAMP, "data_arquivamento" TIMESTAMP, "valido_de" date, "valido_ate" date, "formulario_pai_id" uuid, "observacoes" text, "metadados" jsonb, "tags" jsonb, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" character varying(100), "updated_by" character varying(100), CONSTRAINT "UQ_53f0aac643c39b489226d72d64a" UNIQUE ("codigo_formulario"), CONSTRAINT "PK_99d35e86697a78044541773bd67" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e0cb31caf9691957aa8dccba83" ON "formularios" ("unidade_saude_id") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_53f0aac643c39b489226d72d64" ON "formularios" ("codigo_formulario") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_41734f5084c2296412a2289fb8" ON "formularios" ("tipo", "status") `,
    );
    await queryRunner.query(
      `CREATE TABLE "respostas_campo" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "resposta_formulario_id" uuid NOT NULL, "campo_formulario_id" uuid NOT NULL, "valor_texto" text, "valor_numerico" numeric(15,4), "valor_data" date, "valor_hora" TIME, "valor_data_hora" TIMESTAMP, "valor_booleano" boolean, "valor_json" jsonb, "alternativas_selecionadas_ids" jsonb, "texto_adicional_alternativa" text, "arquivos" jsonb, "url_arquivo" character varying(500), "assinatura_base64" text, "latitude" numeric(10,8), "longitude" numeric(11,8), "endereco_completo" text, "validado" boolean NOT NULL DEFAULT false, "erros_validacao" jsonb, "data_resposta" TIMESTAMP, "tempo_resposta_segundos" integer, "tentativas_preenchimento" integer NOT NULL DEFAULT '1', "editado" boolean NOT NULL DEFAULT false, "data_ultima_edicao" TIMESTAMP, "historico_edicoes" jsonb, "valor_calculado" boolean NOT NULL DEFAULT false, "formula_aplicada" text, "pontuacao_obtida" numeric(10,2), "peso_aplicado" numeric(10,2), "unidade_medida_usada" character varying(50), "fora_referencia" boolean NOT NULL DEFAULT false, "indicador_referencia" character varying(20), "observacoes" text, "comentario_revisor" text, "metadados" jsonb, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" character varying(100), "updated_by" character varying(100), CONSTRAINT "PK_c4fbd8b1623dff05f903c15c135" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_a124ea8ed8eaee5a435f05f7ac" ON "respostas_campo" ("resposta_formulario_id", "campo_formulario_id") `,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."respostas_formulario_status_enum" AS ENUM('rascunho', 'em_preenchimento', 'concluido', 'revisao', 'aprovado', 'rejeitado', 'cancelado')`,
    );
    await queryRunner.query(
      `CREATE TABLE "respostas_formulario" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "codigo_resposta" character varying(50) NOT NULL, "formulario_id" uuid NOT NULL, "paciente_id" uuid, "usuario_preenchimento_id" uuid, "data_inicio_preenchimento" TIMESTAMP, "data_fim_preenchimento" TIMESTAMP, "tempo_preenchimento_segundos" integer, "data_ultima_edicao" TIMESTAMP, "status" "public"."respostas_formulario_status_enum" NOT NULL DEFAULT 'rascunho', "percentual_completo" numeric(5,2) NOT NULL DEFAULT '0', "campos_respondidos" integer NOT NULL DEFAULT '0', "total_campos" integer NOT NULL DEFAULT '0', "versao_formulario" integer NOT NULL DEFAULT '1', "validado" boolean NOT NULL DEFAULT false, "data_validacao" TIMESTAMP, "usuario_validacao_id" uuid, "observacoes_validacao" text, "assinado" boolean NOT NULL DEFAULT false, "data_assinatura" TIMESTAMP, "assinatura_digital" text, "ip_assinatura" character varying(100), "pontuacao_total" numeric(10,2), "pontuacao_maxima" numeric(10,2), "pontuacao_por_secao" jsonb, "origem_resposta" character varying(50), "dispositivo" character varying(100), "navegador" character varying(100), "ip_origem" character varying(100), "localizacao" jsonb, "ordem_servico_id" uuid, "atendimento_id" uuid, "consulta_id" uuid, "arquivos_anexos" jsonb, "pdf_url" character varying(500), "pdf_gerado_em" TIMESTAMP, "email_enviado" boolean NOT NULL DEFAULT false, "email_enviado_em" TIMESTAMP, "destinatarios_email" jsonb, "metadados" jsonb, "observacoes" text, "tags" jsonb, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" character varying(100), "updated_by" character varying(100), CONSTRAINT "UQ_a8aa141cd37668699551ea6a7be" UNIQUE ("codigo_resposta"), CONSTRAINT "PK_7512161a3a59398c7907654c1eb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_a8aa141cd37668699551ea6a7b" ON "respostas_formulario" ("codigo_resposta") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4c24240ee6381f5309243d7286" ON "respostas_formulario" ("status", "created_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c740e4327de792b24d8746999e" ON "respostas_formulario" ("formulario_id", "paciente_id") `,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."restricoes_convenio_tipo_restricao_enum" AS ENUM('PLANO', 'MEDICO', 'ESPECIALIDADE', 'SETOR_SOLICITANTE', 'EXAME_MATERIAL_MEDICAMENTO', 'OUTRO')`,
    );
    await queryRunner.query(
      `CREATE TABLE "restricoes_convenio" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "empresa_id" uuid NOT NULL, "tipo_restricao" "public"."restricoes_convenio_tipo_restricao_enum" NOT NULL, "plano_id" character varying, "plano_nome" character varying, "medico_id" character varying, "medico_nome" character varying, "especialidade_id" character varying, "especialidade_nome" character varying, "setor_solicitante_id" character varying, "setor_solicitante_nome" character varying, "unidade_id" character varying, "unidade_nome" character varying, "exame_material_id" character varying, "exame_material_nome" character varying, "especialidade_exame" character varying, "criog" character varying, "descricao" text, "ativo" boolean NOT NULL DEFAULT true, "criado_em" TIMESTAMP NOT NULL DEFAULT now(), "atualizado_em" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_0066ce2f059de3e7902dc9c1a62" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "integracoes_convenio" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "empresa_id" uuid NOT NULL, "integracao" character varying, "url_verificacao_elegibilidade" character varying, "url_autenticacao" character varying, "url_solicitacao_procedimento" character varying, "url_cancelamento" character varying, "url_status_autorizacao" character varying, "url_protocolo" character varying, "url_lote_anexo" character varying, "url_comunicacao_beneficiario" character varying, "ativar_comunicacao" boolean NOT NULL DEFAULT false, "versao_tiss_comunicacao" character varying, "criptografar_tiss" boolean NOT NULL DEFAULT false, "autorizador_padrao" character varying, "cadastrar_credencial" boolean NOT NULL DEFAULT false, "utilizar_autenticador" boolean NOT NULL DEFAULT false, "utilizar_soap_action" boolean NOT NULL DEFAULT false, "enviar_arquivo" boolean NOT NULL DEFAULT false, "chave_api" character varying, "tipo_autenticacao" character varying, "usuario" character varying, "senha" character varying, "criptografar_senha" boolean, "certificado_serie" character varying, "ativo" boolean NOT NULL DEFAULT true, "criado_em" TIMESTAMP NOT NULL DEFAULT now(), "atualizado_em" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_22571eecd9f2a81deed23140e6b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "planos_convenio" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "empresa_id" uuid NOT NULL, "nome_plano" character varying NOT NULL, "tabela_precos" character varying, "valor_ch" numeric(10,2), "valor_filme" character varying, "instrucoes" text, "ativo" boolean NOT NULL DEFAULT true, "criado_em" TIMESTAMP NOT NULL DEFAULT now(), "atualizado_em" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_5acc2a4e3f7c8e181c012892608" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "instrucoes_convenio" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "empresa_id" uuid NOT NULL, "titulo" character varying NOT NULL, "descricao" text NOT NULL, "tipo" character varying, "ordem" integer NOT NULL DEFAULT '0', "ativo" boolean NOT NULL DEFAULT true, "criado_em" TIMESTAMP NOT NULL DEFAULT now(), "atualizado_em" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_dd26562872777bf8ce16f997061" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."configuracoes_campos_convenio_secao_enum" AS ENUM('CADASTRO_PACIENTES', 'ORDEM_SERVICO', 'TISS', 'TRATAMENTO_AMBULATORIAL', 'INTERNAMENTO')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."configuracoes_campos_convenio_tipo_obrigatoriedade_enum" AS ENUM('OPCIONAL', 'OBRIGATORIO')`,
    );
    await queryRunner.query(
      `CREATE TABLE "configuracoes_campos_convenio" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "empresa_id" uuid NOT NULL, "secao" "public"."configuracoes_campos_convenio_secao_enum" NOT NULL, "nome_campo" character varying NOT NULL, "label_campo" character varying NOT NULL, "tipo_obrigatoriedade" "public"."configuracoes_campos_convenio_tipo_obrigatoriedade_enum" NOT NULL DEFAULT 'OPCIONAL', "visivel" boolean NOT NULL DEFAULT true, "ordem_exibicao" integer, "ativo" boolean NOT NULL DEFAULT true, "criado_em" TIMESTAMP NOT NULL DEFAULT now(), "atualizado_em" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_987284236fd4c696a13193e38b1" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."dados_convenio_tipo_convenio_enum" AS ENUM('PARTICULAR', 'PLANO_SAUDE', 'SUS', 'COOPERATIVA', 'EMPRESA', 'OUTROS')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."dados_convenio_forma_liquidacao_enum" AS ENUM('VIA_FATURA', 'DEPOSITO', 'BOLETO', 'CARTAO', 'DINHEIRO', 'OUTROS')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."dados_convenio_tipo_envio_enum" AS ENUM('FAT_ATE', 'VIA_FATURA', 'OUTROS')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."dados_convenio_fatura_ate_enum" AS ENUM('LOTE', 'INDIVIDUAL', 'OUTROS')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."dados_convenio_tabela_servico_enum" AS ENUM('IN3_INTERMED', 'AMB', 'CBHPM', 'TUSS', 'TABELA_PROPRIA', 'BRASINDICE', 'SIMPRO')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."dados_convenio_tabela_base_enum" AS ENUM('BRASINDICE', 'SIMPRO', 'TABELA_PROPRIA', 'AMB', 'OUTROS')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."dados_convenio_tabela_material_enum" AS ENUM('BRASINDICE', 'SIMPRO', 'TABELA_PROPRIA', 'AMB', 'OUTROS')`,
    );
    await queryRunner.query(
      `CREATE TABLE "dados_convenio" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "empresa_id" uuid NOT NULL, "nome_convenio" character varying NOT NULL, "registro_ans" character varying, "matricula" character varying, "tipo_convenio" "public"."dados_convenio_tipo_convenio_enum" NOT NULL, "forma_liquidacao" "public"."dados_convenio_forma_liquidacao_enum", "valor_ch" numeric(10,2), "valor_filme" character varying, "matricula_digitos" integer, "cnes" character varying, "tiss" boolean NOT NULL DEFAULT false, "versao_tiss" character varying, "tiss_codigo_operadora" character varying, "codigo_operadora_autorizacao" character varying, "codigo_prestador" character varying, "tipo_envio" "public"."dados_convenio_tipo_envio_enum", "fatura_ate" "public"."dados_convenio_fatura_ate_enum", "dia_vencimento" character varying, "contrato" character varying, "ultimo_ajuste" character varying, "ultimo_ajuste_contrato" date, "instrucoes_faturamento" text, "instrucoes_gerais" text, "observacoes_gerais" text, "tabela_servico" "public"."dados_convenio_tabela_servico_enum", "tabela_base" "public"."dados_convenio_tabela_base_enum", "tabela_material" "public"."dados_convenio_tabela_material_enum", "co_participacao" boolean NOT NULL DEFAULT false, "nota_fiscal_exige_fatura" boolean NOT NULL DEFAULT false, "contato" character varying, "data_contrato" date, "codigo_convenio" character varying, "criado_em" TIMESTAMP NOT NULL DEFAULT now(), "atualizado_em" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_49e184a44d48a3e26ab68e993e5" UNIQUE ("empresa_id"), CONSTRAINT "REL_49e184a44d48a3e26ab68e993e" UNIQUE ("empresa_id"), CONSTRAINT "PK_b67577746a240a1725ad6d147bd" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "configuracoes_atendimento_convenio" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "empresa_id" uuid NOT NULL, "tipo_atendimento" character varying NOT NULL, "permite_urgencia" boolean NOT NULL DEFAULT true, "permite_domiciliar" boolean NOT NULL DEFAULT true, "permite_agendamento" boolean NOT NULL DEFAULT true, "prazo_agendamento_dias" integer, "horario_inicio" character varying, "horario_fim" character varying, "atende_fim_semana" boolean NOT NULL DEFAULT true, "atende_feriado" boolean NOT NULL DEFAULT true, "tempo_medio_atendimento_minutos" integer, "observacoes" text, "ativo" boolean NOT NULL DEFAULT true, "criado_em" TIMESTAMP NOT NULL DEFAULT now(), "atualizado_em" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_d7323e14c3c1c7a078d4881e649" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "campos_personalizados_convenio" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "empresa_id" uuid NOT NULL, "nome_campo" character varying NOT NULL, "tipo_campo" character varying NOT NULL, "valor" character varying, "valor_json" json, "descricao" character varying, "obrigatorio" boolean NOT NULL DEFAULT false, "ativo" boolean NOT NULL DEFAULT true, "criado_em" TIMESTAMP NOT NULL DEFAULT now(), "atualizado_em" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_9155e5930177c1bcb06714020c1" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."repasses_filtros_entidade_tipo_enum" AS ENUM('medico', 'especialidade', 'setor', 'exame')`,
    );
    await queryRunner.query(
      `CREATE TABLE "repasses_filtros" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "repasse_id" uuid NOT NULL, "entidade_tipo" "public"."repasses_filtros_entidade_tipo_enum" NOT NULL, "entidade_id" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_dd2e2d9fed53d84ae616a6e255c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_601e32c468b0a6983ab3ea4f16" ON "repasses_filtros" ("repasse_id", "entidade_tipo", "entidade_id") `,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."repasses_status_enum" AS ENUM('ativo', 'processado', 'cancelado')`,
    );
    await queryRunner.query(
      `CREATE TABLE "repasses" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "data_inicio" date NOT NULL, "data_fim" date NOT NULL, "unidade_id" uuid NOT NULL, "descricao" text, "status" "public"."repasses_status_enum" NOT NULL DEFAULT 'ativo', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_caa6f1e750a07e2ecfc0cc989a7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "centros_custo" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "codigo" character varying(20) NOT NULL, "nome" character varying(255) NOT NULL, "descricao" text, "unidade_id" uuid, "ativo" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_2cf4cc82a75a27a96b77a7f4939" UNIQUE ("codigo"), CONSTRAINT "PK_cfc51dbd5e8311d82d57ba6a2b2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_2cf4cc82a75a27a96b77a7f493" ON "centros_custo" ("codigo") `,
    );
    await queryRunner.query(
      `CREATE TABLE "composicoes_financeiras" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "conta_pagar_id" uuid NOT NULL, "conta_contabil_id" uuid NOT NULL, "centro_custo_id" uuid, "colaborador_id" uuid, "colaborador_nome" character varying(255), "valor" numeric(10,2) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_630678a751b35d5ec9321355c46" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."impostos_retidos_tipo_imposto_enum" AS ENUM('iss', 'irrf', 'csll', 'pis', 'cofins', 'ibs', 'cbs')`,
    );
    await queryRunner.query(
      `CREATE TABLE "impostos_retidos" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "conta_pagar_id" uuid NOT NULL, "tipo_imposto" "public"."impostos_retidos_tipo_imposto_enum" NOT NULL, "percentual" numeric(5,2) NOT NULL, "valor_calculado" numeric(10,2) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_6d4e968b60e13d8e9888aad4b08" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."pagamentos_parcelas_forma_pagamento_enum" AS ENUM('boleto', 'pix', 'cartao_credito', 'ted', 'doc', 'transferencia', 'caixa', 'cheque')`,
    );
    await queryRunner.query(
      `CREATE TABLE "pagamentos_parcelas" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "parcela_id" uuid NOT NULL, "forma_pagamento" "public"."pagamentos_parcelas_forma_pagamento_enum" NOT NULL, "conta_bancaria_id" uuid, "codigo_barras" character varying(100), "chave_pix" character varying(255), "dados_bancarios" jsonb, "informacoes_adicionais" jsonb, "comprovante_path" character varying(500), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_ad234e7adf4e29564d247fceb03" UNIQUE ("parcela_id"), CONSTRAINT "REL_ad234e7adf4e29564d247fceb0" UNIQUE ("parcela_id"), CONSTRAINT "PK_e06d4aaba55236b73ca592e97b1" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."parcelas_status_enum" AS ENUM('pendente', 'paga', 'agendada', 'vencida', 'cancelada')`,
    );
    await queryRunner.query(
      `CREATE TABLE "parcelas" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "conta_pagar_id" uuid NOT NULL, "numero_parcela" integer NOT NULL, "total_parcelas" integer NOT NULL, "valor" numeric(10,2) NOT NULL, "data_vencimento" date NOT NULL, "data_pagamento" date, "data_agendamento" date, "status" "public"."parcelas_status_enum" NOT NULL DEFAULT 'pendente', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_2081f431fed935a5bb1da9f420b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_51c1e722beb0f9ebb540991c9b" ON "parcelas" ("conta_pagar_id", "numero_parcela") `,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."anexos_contas_pagar_tipo_anexo_enum" AS ENUM('boleto', 'nota_fiscal', 'contrato', 'comprovante_pagamento', 'outros')`,
    );
    await queryRunner.query(
      `CREATE TABLE "anexos_contas_pagar" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "conta_pagar_id" uuid NOT NULL, "tipo_anexo" "public"."anexos_contas_pagar_tipo_anexo_enum" NOT NULL, "nome_arquivo" character varying(255) NOT NULL, "caminho_arquivo" character varying(500) NOT NULL, "mime_type" character varying(100) NOT NULL, "tamanho" bigint NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_567918d8d306f74e2be66c0e87a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."contas_pagar_credor_tipo_enum" AS ENUM('empresa', 'prestador_servico', 'fornecedor', 'profissional')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."contas_pagar_tipo_documento_enum" AS ENUM('nota_fiscal', 'folha_pagamento', 'boleto', 'recibo', 'contrato', 'outros')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."contas_pagar_status_enum" AS ENUM('a_pagar', 'paga', 'agendada', 'parcialmente_paga', 'cancelada', 'vencida')`,
    );
    await queryRunner.query(
      `CREATE TABLE "contas_pagar" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "credor_tipo" "public"."contas_pagar_credor_tipo_enum" NOT NULL, "credor_id" uuid NOT NULL, "unidade_devedora_id" uuid NOT NULL, "tipo_documento" "public"."contas_pagar_tipo_documento_enum" NOT NULL, "numero_documento" character varying(100) NOT NULL, "descricao" text, "valor_bruto" numeric(10,2) NOT NULL, "valor_liquido" numeric(10,2) NOT NULL, "competencia" character varying(7) NOT NULL, "data_emissao" date NOT NULL, "codigo_interno" character varying(50) NOT NULL, "status" "public"."contas_pagar_status_enum" NOT NULL DEFAULT 'a_pagar', "observacoes" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_a9361e49eb6e7ae8df58e2ae765" UNIQUE ("codigo_interno"), CONSTRAINT "PK_2f0a30e7ee98c3035dcce83ebe7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0aae5c754b3c58dc590a837dcc" ON "contas_pagar" ("status") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a997f748acea3a784870ddd03e" ON "contas_pagar" ("unidade_devedora_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a20ec8c8f91fa848cfb960fd71" ON "contas_pagar" ("credor_tipo", "credor_id") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_a9361e49eb6e7ae8df58e2ae76" ON "contas_pagar" ("codigo_interno") `,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."parcelamentos_config_periodicidade_enum" AS ENUM('mensal', 'quinzenal', 'semanal', 'personalizado')`,
    );
    await queryRunner.query(
      `CREATE TABLE "parcelamentos_config" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "conta_pagar_id" uuid NOT NULL, "numero_parcelas" integer NOT NULL, "periodicidade" "public"."parcelamentos_config_periodicidade_enum" NOT NULL DEFAULT 'mensal', "data_primeira_parcela" date NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_dec3f4b0a592fbfa5f0ecbd68ec" UNIQUE ("conta_pagar_id"), CONSTRAINT "REL_dec3f4b0a592fbfa5f0ecbd68e" UNIQUE ("conta_pagar_id"), CONSTRAINT "PK_78c562224378d56b295c6d69fd4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP CONSTRAINT "UQ_convenios_empresa_id"`,
    );
    await queryRunner.query(`ALTER TABLE "convenios" DROP COLUMN "empresa_id"`);
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN "aceita_atendimento_online"`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN "percentual_coparticipacao"`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN "valor_consulta"`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP CONSTRAINT "UQ_convenios_codigo"`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN "codigo_convenio"`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN "observacoes_convenio"`,
    );
    await queryRunner.query(
      `ALTER TABLE "resultados_exames" DROP COLUMN "laboratorio_id"`,
    );
    await queryRunner.query(`ALTER TABLE "bancos" DROP COLUMN "website"`);
    await queryRunner.query(
      `ALTER TABLE "gateways_pagamento" DROP COLUMN "tipo_gateway"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."gateways_pagamento_tipo_gateway_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "gateways_pagamento" DROP COLUMN "modalidade"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."gateways_pagamento_modalidade_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "gateways_pagamento" DROP COLUMN "ambiente"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."gateways_pagamento_ambiente_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "gateways_pagamento" DROP COLUMN "taxa_credito"`,
    );
    await queryRunner.query(
      `ALTER TABLE "gateways_pagamento" DROP COLUMN "taxa_debito"`,
    );
    await queryRunner.query(
      `ALTER TABLE "gateways_pagamento" DROP COLUMN "taxa_pix"`,
    );
    await queryRunner.query(
      `ALTER TABLE "gateways_pagamento" DROP COLUMN "taxa_boleto"`,
    );
    await queryRunner.query(
      `ALTER TABLE "gateways_pagamento" DROP COLUMN "prazo_recebimento"`,
    );
    await queryRunner.query(
      `ALTER TABLE "gateways_pagamento" DROP COLUMN "configuracao_adicional"`,
    );
    await queryRunner.query(
      `ALTER TABLE "gateways_pagamento" DROP CONSTRAINT "UQ_gateway_codigo_interno"`,
    );
    await queryRunner.query(
      `ALTER TABLE "gateways_pagamento" DROP COLUMN "codigo_interno"`,
    );
    await queryRunner.query(
      `ALTER TABLE "gateways_pagamento" DROP COLUMN "nome_gateway"`,
    );
    await queryRunner.query(
      `ALTER TABLE "gateways_pagamento" DROP COLUMN "merchant_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "gateways_pagamento" DROP COLUMN "merchant_key"`,
    );
    await queryRunner.query(
      `ALTER TABLE "gateways_pagamento" DROP COLUMN "api_key"`,
    );
    await queryRunner.query(
      `ALTER TABLE "gateways_pagamento" DROP COLUMN "api_secret"`,
    );
    await queryRunner.query(
      `ALTER TABLE "gateways_pagamento" DROP COLUMN "webhook_url"`,
    );
    await queryRunner.query(
      `ALTER TABLE "gateways_pagamento" DROP COLUMN "webhook_secret"`,
    );
    await queryRunner.query(
      `ALTER TABLE "gateways_pagamento" DROP COLUMN "observacoes"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contas_bancarias" DROP COLUMN "saldo_inicial"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contas_bancarias" DROP COLUMN "nome_conta"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contas_bancarias" DROP COLUMN "digito_agencia"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contas_bancarias" DROP COLUMN "digito_conta"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contas_bancarias" DROP COLUMN "titular"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contas_bancarias" DROP COLUMN "cpf_cnpj_titular"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contas_bancarias" DROP COLUMN "pix_tipo"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contas_bancarias" DROP COLUMN "pix_chave"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contas_bancarias" DROP COLUMN "observacoes"`,
    );
    await queryRunner.query(
      `ALTER TABLE "adquirentes" DROP COLUMN "conta_bancaria_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "adquirentes" DROP COLUMN "tipo_adquirente"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."adquirentes_tipo_adquirente_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "adquirentes" DROP COLUMN "taxa_antecipacao"`,
    );
    await queryRunner.query(
      `ALTER TABLE "adquirentes" DROP COLUMN "prazo_recebimento"`,
    );
    await queryRunner.query(
      `ALTER TABLE "adquirentes" DROP COLUMN "permite_parcelamento"`,
    );
    await queryRunner.query(
      `ALTER TABLE "adquirentes" DROP COLUMN "parcela_maxima"`,
    );
    await queryRunner.query(
      `ALTER TABLE "adquirentes" DROP COLUMN "valor_minimo_parcela"`,
    );
    await queryRunner.query(
      `ALTER TABLE "adquirentes" DROP COLUMN "codigo_estabelecimento"`,
    );
    await queryRunner.query(
      `ALTER TABLE "adquirentes" DROP COLUMN "terminal_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "adquirentes" DROP COLUMN "contato_comercial"`,
    );
    await queryRunner.query(
      `ALTER TABLE "adquirentes" DROP COLUMN "telefone_suporte"`,
    );
    await queryRunner.query(
      `ALTER TABLE "adquirentes" DROP COLUMN "email_suporte"`,
    );
    await queryRunner.query(
      `ALTER TABLE "adquirentes" DROP COLUMN "observacoes"`,
    );
    await queryRunner.query(
      `ALTER TABLE "restricoes_adquirente" DROP COLUMN "tipo_restricao"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."restricoes_adquirente_tipo_restricao_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "restricoes_adquirente" DROP COLUMN "ativa"`,
    );
    await queryRunner.query(
      `ALTER TABLE "restricoes_adquirente" DROP COLUMN "valor_restricao"`,
    );
    await queryRunner.query(
      `ALTER TABLE "restricoes_adquirente" DROP COLUMN "descricao"`,
    );
    await queryRunner.query(
      `ALTER TABLE "planos_contas" DROP COLUMN "tipo_conta"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."planos_contas_tipo_conta_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "planos_contas" DROP COLUMN "natureza"`,
    );
    await queryRunner.query(`DROP TYPE "public"."planos_contas_natureza_enum"`);
    await queryRunner.query(
      `ALTER TABLE "planos_contas" DROP COLUMN "conta_pai_id"`,
    );
    await queryRunner.query(`ALTER TABLE "planos_contas" DROP COLUMN "nivel"`);
    await queryRunner.query(
      `ALTER TABLE "planos_contas" DROP COLUMN "aceita_lancamento"`,
    );
    await queryRunner.query(`ALTER TABLE "planos_contas" DROP COLUMN "status"`);
    await queryRunner.query(`DROP TYPE "public"."planos_contas_status_enum"`);
    await queryRunner.query(
      `ALTER TABLE "planos_contas" DROP CONSTRAINT "UQ_plano_codigo_conta"`,
    );
    await queryRunner.query(
      `ALTER TABLE "planos_contas" DROP COLUMN "codigo_conta"`,
    );
    await queryRunner.query(
      `ALTER TABLE "planos_contas" DROP COLUMN "nome_conta"`,
    );
    await queryRunner.query(
      `ALTER TABLE "planos_contas" DROP COLUMN "descricao"`,
    );
    await queryRunner.query(
      `ALTER TABLE "planos_contas" DROP COLUMN "observacoes"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contas_contabeis" DROP COLUMN "plano_conta_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contas_contabeis" DROP COLUMN "unidade_saude_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contas_contabeis" DROP COLUMN "saldo_inicial"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contas_contabeis" DROP COLUMN "saldo_atual"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contas_contabeis" DROP COLUMN "data_saldo_inicial"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contas_contabeis" DROP COLUMN "observacoes"`,
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
      `CREATE TYPE "public"."gateways_pagamento_tipo_enum" AS ENUM('pagseguro', 'mercado_pago', 'stripe', 'paypal', 'cielo', 'rede', 'stone', 'getnet', 'outro')`,
    );
    await queryRunner.query(
      `ALTER TABLE "gateways_pagamento" ADD "tipo" "public"."gateways_pagamento_tipo_enum" NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "gateways_pagamento" ADD "nome" character varying(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "gateways_pagamento" ADD "validade_api" date`,
    );
    await queryRunner.query(
      `ALTER TABLE "gateways_pagamento" ADD "chave_api" text`,
    );
    await queryRunner.query(
      `ALTER TABLE "gateways_pagamento" ADD "contingencia" text`,
    );
    await queryRunner.query(
      `ALTER TABLE "gateways_pagamento" ADD "configuracao" jsonb`,
    );
    await queryRunner.query(
      `ALTER TABLE "contas_bancarias" ADD "digito_verificador" character varying(5)`,
    );
    await queryRunner.query(
      `ALTER TABLE "contas_bancarias" ADD "chave_pix" character varying(50)`,
    );
    await queryRunner.query(
      `ALTER TABLE "contas_bancarias" ADD "descricao" text`,
    );
    await queryRunner.query(
      `ALTER TABLE "contas_bancarias" ADD "conta_principal" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(`ALTER TABLE "adquirentes" ADD "descricao" text`);
    await queryRunner.query(
      `ALTER TABLE "adquirentes" ADD "tipos_cartao_suportados" text`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."adquirentes_opcao_parcelamento_enum" AS ENUM('12x', '6x', '3x', 'avista')`,
    );
    await queryRunner.query(
      `ALTER TABLE "adquirentes" ADD "opcao_parcelamento" "public"."adquirentes_opcao_parcelamento_enum" NOT NULL DEFAULT '12x'`,
    );
    await queryRunner.query(
      `ALTER TABLE "adquirentes" ADD "taxa_transacao" numeric(5,2) NOT NULL DEFAULT '1'`,
    );
    await queryRunner.query(
      `ALTER TABLE "adquirentes" ADD "percentual_repasse" numeric(5,2) NOT NULL DEFAULT '10'`,
    );
    await queryRunner.query(
      `ALTER TABLE "adquirentes" ADD "prazo_repasse" integer NOT NULL DEFAULT '5'`,
    );
    await queryRunner.query(
      `ALTER TABLE "adquirentes" ADD "conta_associada_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "adquirentes" ADD "configuracao_integracao" jsonb`,
    );
    await queryRunner.query(
      `ALTER TABLE "restricoes_adquirente" ADD "unidade_saude_id" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "restricoes_adquirente" ADD "restricao" text`,
    );
    await queryRunner.query(
      `ALTER TABLE "planos_contas" ADD "descricao_hierarquia" character varying(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "planos_contas" ADD "nome_hierarquia" character varying(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "planos_contas" ADD "data_cadastro" date NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "planos_contas" ADD "ultima_edicao" date`,
    );
    await queryRunner.query(
      `ALTER TABLE "planos_contas" ADD "usuario_cadastro_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "planos_contas" ADD "usuario_edicao_id" uuid`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."contas_contabeis_tipo_classificacao_enum" AS ENUM('titulo', 'nivel')`,
    );
    await queryRunner.query(
      `ALTER TABLE "contas_contabeis" ADD "tipo_classificacao" "public"."contas_contabeis_tipo_classificacao_enum" NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "contas_contabeis" ADD "codigo_hierarquico" character varying(50) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "contas_contabeis" ADD "codigo_contabil" character varying(50)`,
    );
    await queryRunner.query(
      `ALTER TABLE "contas_contabeis" ADD "nome_classe" character varying(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "contas_contabeis" ADD "vinculo_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "contas_contabeis" ADD "excluir" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "contas_contabeis" ADD "desativar" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "contas_contabeis" ADD "plano_contas_id" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "contas_contabeis" ADD "conta_pai_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "telemedicina" ALTER COLUMN "created_at" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "telemedicina" ALTER COLUMN "updated_at" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_87912d0aec876ebe8d448c8bd4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pacientes" DROP COLUMN "convenio_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pacientes" ADD "convenio_id" character varying`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "pacientes"."convenio_id" IS 'ID do convênio'`,
    );
    await queryRunner.query(`ALTER TABLE "pacientes" DROP COLUMN "empresa_id"`);
    await queryRunner.query(
      `ALTER TABLE "pacientes" ADD "empresa_id" character varying NOT NULL`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "pacientes"."empresa_id" IS 'ID da empresa (CNPJ/Filial)'`,
    );
    await queryRunner.query(`ALTER TABLE "pacientes" DROP COLUMN "criado_por"`);
    await queryRunner.query(
      `ALTER TABLE "pacientes" ADD "criado_por" character varying`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "pacientes"."criado_por" IS 'ID do usuário que criou o registro'`,
    );
    await queryRunner.query(
      `ALTER TABLE "pacientes" DROP COLUMN "atualizado_por"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pacientes" ADD "atualizado_por" character varying`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "pacientes"."atualizado_por" IS 'ID do usuário que atualizou o registro'`,
    );
    await queryRunner.query(
      `ALTER TABLE "ordens_servico" ALTER COLUMN "paciente_id" SET NOT NULL`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "ordens_servico"."paciente_id" IS 'ID do paciente'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "ordens_servico"."convenio_id" IS 'ID do convênio'`,
    );
    await queryRunner.query(
      `ALTER TABLE "ordens_servico" DROP COLUMN "atendente_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ordens_servico" ADD "atendente_id" character varying`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "ordens_servico"."atendente_id" IS 'ID do atendente que criou a OS'`,
    );
    await queryRunner.query(
      `ALTER TABLE "ordens_servico" DROP COLUMN "coletor_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ordens_servico" ADD "coletor_id" character varying`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "ordens_servico"."coletor_id" IS 'ID do profissional que realizou a coleta'`,
    );
    await queryRunner.query(
      `ALTER TABLE "ordens_servico" DROP COLUMN "empresa_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ordens_servico" ADD "empresa_id" character varying NOT NULL`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "ordens_servico"."empresa_id" IS 'ID da empresa'`,
    );
    await queryRunner.query(
      `ALTER TABLE "ordens_servico" DROP COLUMN "criado_por"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ordens_servico" ADD "criado_por" character varying`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "ordens_servico"."criado_por" IS 'ID do usuário que criou o registro'`,
    );
    await queryRunner.query(
      `ALTER TABLE "ordens_servico" DROP COLUMN "atualizado_por"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ordens_servico" ADD "atualizado_por" character varying`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "ordens_servico"."atualizado_por" IS 'ID do usuário que atualizou o registro'`,
    );
    await queryRunner.query(
      `ALTER TABLE "resultados_exames" ALTER COLUMN "ordem_servico_exame_id" SET NOT NULL`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "resultados_exames"."ordem_servico_exame_id" IS 'ID do exame na ordem de serviço'`,
    );
    await queryRunner.query(
      `ALTER TABLE "resultados_exames" DROP COLUMN "exame_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "resultados_exames" ADD "exame_id" uuid NOT NULL`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "resultados_exames"."exame_id" IS 'ID do exame'`,
    );
    await queryRunner.query(
      `ALTER TABLE "resultados_exames" DROP COLUMN "qc_responsavel_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "resultados_exames" ADD "qc_responsavel_id" character varying`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "resultados_exames"."qc_responsavel_id" IS 'ID do responsável pelo QC'`,
    );
    await queryRunner.query(
      `ALTER TABLE "ordens_servico_exames" ALTER COLUMN "ordem_servico_id" SET NOT NULL`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "ordens_servico_exames"."ordem_servico_id" IS 'ID da ordem de serviço'`,
    );
    await queryRunner.query(
      `ALTER TABLE "ordens_servico_exames" ALTER COLUMN "exame_id" SET NOT NULL`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "ordens_servico_exames"."exame_id" IS 'ID do exame'`,
    );
    await queryRunner.query(
      `ALTER TABLE "ordens_servico_exames" DROP COLUMN "coletor_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ordens_servico_exames" ADD "coletor_id" character varying`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "ordens_servico_exames"."coletor_id" IS 'ID do profissional que coletou'`,
    );
    await queryRunner.query(
      `ALTER TABLE "ordens_servico_exames" DROP COLUMN "laboratorio_apoio_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ordens_servico_exames" ADD "laboratorio_apoio_id" uuid`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "ordens_servico_exames"."laboratorio_apoio_id" IS 'ID do laboratório de apoio destinatário'`,
    );
    await queryRunner.query(
      `ALTER TABLE "ordens_servico_exames" DROP COLUMN "analista_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ordens_servico_exames" ADD "analista_id" character varying`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "ordens_servico_exames"."analista_id" IS 'ID do analista/biomédico'`,
    );
    await queryRunner.query(
      `ALTER TABLE "ordens_servico_exames" DROP COLUMN "liberado_por"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ordens_servico_exames" ADD "liberado_por" character varying`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "ordens_servico_exames"."liberado_por" IS 'ID do responsável técnico que liberou'`,
    );
    await queryRunner.query(
      `ALTER TABLE "ordens_servico_exames" DROP COLUMN "exame_original_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ordens_servico_exames" ADD "exame_original_id" character varying`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "ordens_servico_exames"."exame_original_id" IS 'ID do exame original (se for repetição)'`,
    );
    await queryRunner.query(
      `ALTER TABLE "ordens_servico_exames" DROP COLUMN "responsavel_controle_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ordens_servico_exames" ADD "responsavel_controle_id" character varying`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "ordens_servico_exames"."responsavel_controle_id" IS 'ID do responsável pelo controle de qualidade'`,
    );
    await queryRunner.query(
      `ALTER TABLE "setores_exame" DROP COLUMN "responsavel_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "setores_exame" ADD "responsavel_id" character varying(36)`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "setores_exame"."responsavel_id" IS 'ID do responsável pelo setor'`,
    );
    await queryRunner.query(
      `ALTER TABLE "exames" ALTER COLUMN "tipo_exame_id" SET NOT NULL`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "exames"."tipo_exame_id" IS 'ID do tipo de exame'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "exames"."subgrupo_id" IS 'ID do subgrupo'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "exames"."setor_id" IS 'ID do setor responsável'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "exames"."laboratorio_apoio_id" IS 'ID do laboratório de apoio'`,
    );
    await queryRunner.query(`ALTER TABLE "exames" DROP COLUMN "empresa_id"`);
    await queryRunner.query(
      `ALTER TABLE "exames" ADD "empresa_id" character varying`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "exames"."empresa_id" IS 'ID da empresa (null = disponível para todas)'`,
    );
    await queryRunner.query(`ALTER TABLE "exames" DROP COLUMN "criado_por"`);
    await queryRunner.query(
      `ALTER TABLE "exames" ADD "criado_por" character varying`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "exames"."criado_por" IS 'ID do usuário que criou o registro'`,
    );
    await queryRunner.query(
      `ALTER TABLE "exames" DROP COLUMN "atualizado_por"`,
    );
    await queryRunner.query(
      `ALTER TABLE "exames" ADD "atualizado_por" character varying`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "exames"."atualizado_por" IS 'ID do usuário que atualizou o registro'`,
    );
    await queryRunner.query(
      `ALTER TABLE "telemedicina_exames" ALTER COLUMN "created_at" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "telemedicina_exames" ALTER COLUMN "updated_at" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."tipo_contrato_enum" RENAME TO "tipo_contrato_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."prestadores_servico_tipo_contrato_enum" AS ENUM('fixo', 'por_demanda', 'retainer', 'projeto')`,
    );
    await queryRunner.query(
      `ALTER TABLE "prestadores_servico" ALTER COLUMN "tipo_contrato" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "prestadores_servico" ALTER COLUMN "tipo_contrato" TYPE "public"."prestadores_servico_tipo_contrato_enum" USING "tipo_contrato"::"text"::"public"."prestadores_servico_tipo_contrato_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "prestadores_servico" ALTER COLUMN "tipo_contrato" SET DEFAULT 'por_demanda'`,
    );
    await queryRunner.query(`DROP TYPE "public"."tipo_contrato_enum_old"`);
    await queryRunner.query(
      `ALTER TYPE "public"."forma_pagamento_prestador_enum" RENAME TO "forma_pagamento_prestador_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."prestadores_servico_forma_pagamento_enum" AS ENUM('mensalidade', 'por_servico', 'hora_trabalhada', 'pacote_fechado', 'comissao', 'misto')`,
    );
    await queryRunner.query(
      `ALTER TABLE "prestadores_servico" ALTER COLUMN "forma_pagamento" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "prestadores_servico" ALTER COLUMN "forma_pagamento" TYPE "public"."prestadores_servico_forma_pagamento_enum" USING "forma_pagamento"::"text"::"public"."prestadores_servico_forma_pagamento_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "prestadores_servico" ALTER COLUMN "forma_pagamento" SET DEFAULT 'por_servico'`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."forma_pagamento_prestador_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."frequencia_pagamento_enum" RENAME TO "frequencia_pagamento_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."prestadores_servico_frequencia_pagamento_enum" AS ENUM('diario', 'semanal', 'quinzenal', 'mensal', 'bimestral', 'trimestral', 'semestral', 'anual', 'por_servico')`,
    );
    await queryRunner.query(
      `ALTER TABLE "prestadores_servico" ALTER COLUMN "frequencia_pagamento" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "prestadores_servico" ALTER COLUMN "frequencia_pagamento" TYPE "public"."prestadores_servico_frequencia_pagamento_enum" USING "frequencia_pagamento"::"text"::"public"."prestadores_servico_frequencia_pagamento_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "prestadores_servico" ALTER COLUMN "frequencia_pagamento" SET DEFAULT 'mensal'`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."frequencia_pagamento_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."status_contrato_enum" RENAME TO "status_contrato_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."prestadores_servico_status_contrato_enum" AS ENUM('ativo', 'inativo', 'suspenso', 'em_analise', 'cancelado')`,
    );
    await queryRunner.query(
      `ALTER TABLE "prestadores_servico" ALTER COLUMN "status_contrato" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "prestadores_servico" ALTER COLUMN "status_contrato" TYPE "public"."prestadores_servico_status_contrato_enum" USING "status_contrato"::"text"::"public"."prestadores_servico_status_contrato_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "prestadores_servico" ALTER COLUMN "status_contrato" SET DEFAULT 'em_analise'`,
    );
    await queryRunner.query(`DROP TYPE "public"."status_contrato_enum_old"`);
    await queryRunner.query(
      `ALTER TYPE "public"."tipo_servico_categoria_enum" RENAME TO "tipo_servico_categoria_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."prestador_servico_categorias_tipo_servico_enum" AS ENUM('manutencao_equipamentos', 'prestadores_exames', 'honorario_contabeis', 'honorario_consultoria', 'honorario_advocaticio', 'internet_telefonia', 'agua', 'energia', 'suporte_software', 'desenvolvimento_software', 'seguranca_monitoramento', 'outros_servicos_pf', 'outros_servicos_pj', 'limpeza_conservacao', 'transporte_logistica', 'marketing_publicidade', 'recursos_humanos', 'treinamento_capacitacao', 'arquitetura_engenharia', 'vigilancia_sanitaria', 'calibracao_metrologia')`,
    );
    await queryRunner.query(
      `ALTER TABLE "prestador_servico_categorias" ALTER COLUMN "tipo_servico" TYPE "public"."prestador_servico_categorias_tipo_servico_enum" USING "tipo_servico"::"text"::"public"."prestador_servico_categorias_tipo_servico_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."tipo_servico_categoria_enum_old"`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "kit_exames"."codigo_tuss" IS 'Código TUSS do exame no kit (vinculado ao cadastro de exames, puxando Código TUSS)'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "kit_exames"."quantidade" IS 'Quantidade de cada exame no kit (geralmente 1, mas pode variar)'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "kit_exames"."ordem_insercao" IS 'Ordem de apresentação dos exames no kit para inserção no front-end'`,
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
      `COMMENT ON COLUMN "kits"."nome_kit" IS 'Nome do kit (ex.: Kit Check-up Básico, Kit Exames Ocupacionais Padrão)'`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."tipo_kit_enum" RENAME TO "tipo_kit_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."kits_tipo_kit_enum" AS ENUM('CHECK_UP', 'OCUPACIONAL', 'PRE_NATAL', 'COM_DESCRICAO', 'PERSONALIZADO')`,
    );
    await queryRunner.query(
      `ALTER TABLE "kits" ALTER COLUMN "tipo_kit" TYPE "public"."kits_tipo_kit_enum" USING "tipo_kit"::"text"::"public"."kits_tipo_kit_enum"`,
    );
    await queryRunner.query(`DROP TYPE "public"."tipo_kit_enum_old"`);
    await queryRunner.query(
      `COMMENT ON COLUMN "kits"."tipo_kit" IS 'Tipo de kit (Check-up, Ocupacional, Pré-Natal, com descrição para categorização)'`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."status_kit_enum" RENAME TO "status_kit_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."kits_status_kit_enum" AS ENUM('ATIVO', 'INATIVO', 'EM_REVISAO')`,
    );
    await queryRunner.query(
      `ALTER TABLE "kits" ALTER COLUMN "status_kit" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "kits" ALTER COLUMN "status_kit" TYPE "public"."kits_status_kit_enum" USING "status_kit"::"text"::"public"."kits_status_kit_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "kits" ALTER COLUMN "status_kit" SET DEFAULT 'ATIVO'`,
    );
    await queryRunner.query(`DROP TYPE "public"."status_kit_enum_old"`);
    await queryRunner.query(
      `COMMENT ON COLUMN "kits"."status_kit" IS 'Status do kit (Ativo, Inativo, Em Revisão)'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "kits"."prazo_padrao_entrega" IS 'Prazo padrão de entrega do kit em dias (ex.: 3 para 72h, 48h, com base nos prazos dos exames)'`,
    );
    await queryRunner.query(
      `ALTER TABLE "fornecedores" ALTER COLUMN "created_at" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "fornecedores" ALTER COLUMN "updated_at" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "fornecedor_insumos" ALTER COLUMN "created_at" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "fornecedor_insumos" ALTER COLUMN "updated_at" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "bancos" DROP CONSTRAINT "UQ_banco_codigo"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."gateways_pagamento_status_enum" RENAME TO "gateways_pagamento_status_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."gateways_pagamento_status_enum" AS ENUM('conectado', 'desconectado', 'erro', 'pendente')`,
    );
    await queryRunner.query(
      `ALTER TABLE "gateways_pagamento" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "gateways_pagamento" ALTER COLUMN "status" TYPE "public"."gateways_pagamento_status_enum" USING "status"::"text"::"public"."gateways_pagamento_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "gateways_pagamento" ALTER COLUMN "status" SET DEFAULT 'pendente'`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."gateways_pagamento_status_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contas_bancarias" DROP CONSTRAINT "UQ_conta_codigo_interno"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contas_bancarias" DROP COLUMN "codigo_interno"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contas_bancarias" ADD "codigo_interno" character varying(50) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "contas_bancarias" ADD CONSTRAINT "UQ_8abf28b7d8623f214e2c1ca0c3b" UNIQUE ("codigo_interno")`,
    );
    await queryRunner.query(
      `ALTER TABLE "contas_bancarias" DROP COLUMN "agencia"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contas_bancarias" ADD "agencia" character varying(20) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."contas_bancarias_tipo_conta_enum" RENAME TO "contas_bancarias_tipo_conta_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."contas_bancarias_tipo_conta_enum" AS ENUM('corrente', 'poupanca', 'investimento')`,
    );
    await queryRunner.query(
      `ALTER TABLE "contas_bancarias" ALTER COLUMN "tipo_conta" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "contas_bancarias" ALTER COLUMN "tipo_conta" TYPE "public"."contas_bancarias_tipo_conta_enum" USING "tipo_conta"::"text"::"public"."contas_bancarias_tipo_conta_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contas_bancarias" ALTER COLUMN "tipo_conta" SET DEFAULT 'corrente'`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."contas_bancarias_tipo_conta_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."contas_bancarias_status_enum" RENAME TO "contas_bancarias_status_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."contas_bancarias_status_enum" AS ENUM('ativo', 'inativo', 'bloqueado')`,
    );
    await queryRunner.query(
      `ALTER TABLE "contas_bancarias" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "contas_bancarias" ALTER COLUMN "status" TYPE "public"."contas_bancarias_status_enum" USING "status"::"text"::"public"."contas_bancarias_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contas_bancarias" ALTER COLUMN "status" SET DEFAULT 'ativo'`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."contas_bancarias_status_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."adquirentes_status_enum" RENAME TO "adquirentes_status_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."adquirentes_status_enum" AS ENUM('ativo', 'inativo', 'suspenso')`,
    );
    await queryRunner.query(
      `ALTER TABLE "adquirentes" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "adquirentes" ALTER COLUMN "status" TYPE "public"."adquirentes_status_enum" USING "status"::"text"::"public"."adquirentes_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "adquirentes" ALTER COLUMN "status" SET DEFAULT 'ativo'`,
    );
    await queryRunner.query(`DROP TYPE "public"."adquirentes_status_enum_old"`);
    await queryRunner.query(
      `ALTER TABLE "adquirentes" ALTER COLUMN "taxa_parcelamento" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "adquirentes" ALTER COLUMN "taxa_parcelamento" SET DEFAULT '3'`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_87912d0aec876ebe8d448c8bd4" ON "pacientes" ("cpf", "empresa_id") `,
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
      `CREATE INDEX "IDX_b1b3d3e5b836732231b23c6ad4" ON "ordens_servico" ("paciente_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0ac9b116f95df47e908a121465" ON "resultados_exames" ("ordem_servico_exame_id") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_a10bb8b6b95914f057d3efa029" ON "ordens_servico_exames" ("ordem_servico_id", "exame_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4f31dc4d464240932397ecaeb0" ON "prestadores_servico" ("tipo_contrato") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_5920ce3727cdeaf3239161cb21" ON "prestadores_servico" ("status_contrato") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_1de70f9c6436f12294538ec337" ON "prestadores_servico" ("codigo_prestador") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_bcdb3efc04c5833fec5fb84fe8" ON "prestador_servico_categorias" ("ativo") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_2e6e8e65b58ef4b8d2a0f6bf99" ON "prestador_servico_categorias" ("prestador_servico_id", "tipo_servico") `,
    );
    await queryRunner.query(
      `ALTER TABLE "kit_exames" ADD CONSTRAINT "UQ_14d55a8965297efd9afb361f644" UNIQUE ("kit_id", "exame_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "kit_unidades" ADD CONSTRAINT "UQ_c9f319e6e74bf47591784a687ba" UNIQUE ("kit_id", "unidade_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "kit_convenios" ADD CONSTRAINT "UQ_73ecbc748597c58b9586d85dc21" UNIQUE ("kit_id", "convenio_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "telemedicina" ADD CONSTRAINT "FK_3b8b6cbf7da8164244b24e455f0" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ordens_servico" ADD CONSTRAINT "FK_b1b3d3e5b836732231b23c6ad46" FOREIGN KEY ("paciente_id") REFERENCES "pacientes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ordens_servico" ADD CONSTRAINT "FK_530803f526491bc4066c4141d42" FOREIGN KEY ("convenio_id") REFERENCES "convenios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "resultados_exames" ADD CONSTRAINT "FK_0ac9b116f95df47e908a1214650" FOREIGN KEY ("ordem_servico_exame_id") REFERENCES "ordens_servico_exames"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "resultados_exames" ADD CONSTRAINT "FK_1028937a4d04120dab46f83d157" FOREIGN KEY ("exame_id") REFERENCES "exames"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ordens_servico_exames" ADD CONSTRAINT "FK_e119c5edaab2722f9a29cc50727" FOREIGN KEY ("ordem_servico_id") REFERENCES "ordens_servico"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ordens_servico_exames" ADD CONSTRAINT "FK_01dd25b3c67eeb0b53b90642c67" FOREIGN KEY ("exame_id") REFERENCES "exames"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ordens_servico_exames" ADD CONSTRAINT "FK_4909a97b0566e2f950a3b29c446" FOREIGN KEY ("laboratorio_apoio_id") REFERENCES "laboratorios_apoio"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "exames" ADD CONSTRAINT "FK_8a575fa5a082c47295e8c1c981d" FOREIGN KEY ("tipo_exame_id") REFERENCES "tipos_exame"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "exames" ADD CONSTRAINT "FK_d76081f4ce0ab0153c0a77d4cee" FOREIGN KEY ("subgrupo_id") REFERENCES "subgrupos_exame"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "exames" ADD CONSTRAINT "FK_4194026d1ac0809426c39ed6e30" FOREIGN KEY ("setor_id") REFERENCES "setores_exame"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "exames" ADD CONSTRAINT "FK_25628670dfec238652b334ff2a2" FOREIGN KEY ("laboratorio_apoio_id") REFERENCES "laboratorios_apoio"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "prestadores_servico" ADD CONSTRAINT "FK_95bdd3a9adae3f7327a9efedfea" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "prestador_servico_categorias" ADD CONSTRAINT "FK_39c21588fb433c75848b95d1ecc" FOREIGN KEY ("prestador_servico_id") REFERENCES "prestadores_servico"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "laboratorios" ADD CONSTRAINT "FK_6ee6a251b531dbdd6d18ed9ca6a" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "laboratorios_metodos" ADD CONSTRAINT "FK_e1445f18d757962ef62fcd75ef0" FOREIGN KEY ("laboratorio_id") REFERENCES "laboratorios"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "laboratorios_metodos" ADD CONSTRAINT "FK_7d18ea692673166969ee7391640" FOREIGN KEY ("metodo_id") REFERENCES "metodos"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "kit_exames" ADD CONSTRAINT "FK_4d245b6a8b4628b601487308a60" FOREIGN KEY ("kit_id") REFERENCES "kits"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "kit_exames" ADD CONSTRAINT "FK_ca4e95e556caef1e80546709172" FOREIGN KEY ("exame_id") REFERENCES "exames"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "kit_unidades" ADD CONSTRAINT "FK_494a53b78a8946941aadc78d247" FOREIGN KEY ("kit_id") REFERENCES "kits"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "kit_unidades" ADD CONSTRAINT "FK_4f8b8488cf41eca57aab40ffa0e" FOREIGN KEY ("unidade_id") REFERENCES "unidades_saude"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tabelas_preco" ADD CONSTRAINT "FK_c5b48b07fcbf3f8cd60c7be69b2" FOREIGN KEY ("plano_id") REFERENCES "planos"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "procedimentos_autorizados" ADD CONSTRAINT "FK_b3dfeecc613260212262b54c41b" FOREIGN KEY ("plano_id") REFERENCES "planos"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "restricoes" ADD CONSTRAINT "FK_ce82f2c2c0f8b73b11386c54718" FOREIGN KEY ("plano_id") REFERENCES "planos"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "planos" ADD CONSTRAINT "FK_5acc2a4e3f7c8e181c012892608" FOREIGN KEY ("convenio_id") REFERENCES "convenios"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "instrucoes" ADD CONSTRAINT "FK_dd26562872777bf8ce16f997061" FOREIGN KEY ("convenio_id") REFERENCES "convenios"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD CONSTRAINT "FK_807b76b6f688d6d7d47fe735c94" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "kit_convenios" ADD CONSTRAINT "FK_4035e473a107b7a86cf3ffffa52" FOREIGN KEY ("kit_id") REFERENCES "kits"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "kit_convenios" ADD CONSTRAINT "FK_b64239cdf9789aa3c014c80cc4a" FOREIGN KEY ("convenio_id") REFERENCES "convenios"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "kits" ADD CONSTRAINT "FK_f9616bbef559d0feadcfd6b1748" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "integracoes" ADD CONSTRAINT "FK_84ec1c9f1b03cc6f743c6c756cc" FOREIGN KEY ("unidade_saude_id") REFERENCES "unidades_saude"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "fornecedores" ADD CONSTRAINT "FK_0fb8f907c40978d0f3b198adabc" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "alternativas_campo" ADD CONSTRAINT "FK_e7553bb76133e731596eb441362" FOREIGN KEY ("campo_formulario_id") REFERENCES "campos_formulario"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "campos_formulario" ADD CONSTRAINT "FK_67439fee1218869b20c178026e3" FOREIGN KEY ("formulario_id") REFERENCES "formularios"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "formularios" ADD CONSTRAINT "FK_e0cb31caf9691957aa8dccba83a" FOREIGN KEY ("unidade_saude_id") REFERENCES "unidades_saude"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "formularios" ADD CONSTRAINT "FK_9aaeeac99dfee2d3846fd9ce188" FOREIGN KEY ("formulario_pai_id") REFERENCES "formularios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "respostas_campo" ADD CONSTRAINT "FK_370f28419af837a1dbda61a3cab" FOREIGN KEY ("resposta_formulario_id") REFERENCES "respostas_formulario"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "respostas_campo" ADD CONSTRAINT "FK_8a2a015b4025a55cc423ecd8256" FOREIGN KEY ("campo_formulario_id") REFERENCES "campos_formulario"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "respostas_formulario" ADD CONSTRAINT "FK_d03249cd7b73b1b8acc7e88deae" FOREIGN KEY ("formulario_id") REFERENCES "formularios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "respostas_formulario" ADD CONSTRAINT "FK_5902f3f4ce0a90309ac57ee76db" FOREIGN KEY ("paciente_id") REFERENCES "pacientes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "respostas_formulario" ADD CONSTRAINT "FK_342c1d012448f111fd8c3ab27ec" FOREIGN KEY ("usuario_preenchimento_id") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "respostas_formulario" ADD CONSTRAINT "FK_c9c976c943fc8aba3f239428770" FOREIGN KEY ("usuario_validacao_id") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "gateways_pagamento" ADD CONSTRAINT "FK_8fdb08f98a380b4ff5c20a3199d" FOREIGN KEY ("conta_bancaria_id") REFERENCES "contas_bancarias"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "contas_bancarias" ADD CONSTRAINT "FK_87f9ae3dbd541474c71978f6f00" FOREIGN KEY ("banco_id") REFERENCES "bancos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "contas_bancarias" ADD CONSTRAINT "FK_b9284d2d29fbc31e1d861a5573b" FOREIGN KEY ("unidade_saude_id") REFERENCES "unidades_saude"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "adquirentes" ADD CONSTRAINT "FK_4770f4e75267e561f9d1c9d5965" FOREIGN KEY ("conta_associada_id") REFERENCES "contas_bancarias"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "restricoes_adquirente" ADD CONSTRAINT "FK_5af32e6833853169a2ccd2f3a30" FOREIGN KEY ("unidade_saude_id") REFERENCES "unidades_saude"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "restricoes_adquirente" ADD CONSTRAINT "FK_0a4c5821414a5e4b3826f36a002" FOREIGN KEY ("adquirente_id") REFERENCES "adquirentes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "contas_contabeis" ADD CONSTRAINT "FK_146dd1215852047c9eaf1aecf9e" FOREIGN KEY ("plano_contas_id") REFERENCES "planos_contas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "contas_contabeis" ADD CONSTRAINT "FK_003f0bfce24fd17c82b6bd274f8" FOREIGN KEY ("conta_pai_id") REFERENCES "contas_contabeis"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "restricoes_convenio" ADD CONSTRAINT "FK_b29ebac8fd25d57f8f4e4562ae7" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "integracoes_convenio" ADD CONSTRAINT "FK_de87f407b5b98a727b1328f3035" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "planos_convenio" ADD CONSTRAINT "FK_e0206f5ef36e39a694f9d4a7c22" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "instrucoes_convenio" ADD CONSTRAINT "FK_c863a4f4ac9064559c6b36eca18" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "configuracoes_campos_convenio" ADD CONSTRAINT "FK_7b8062f25717f633014ccd18638" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "dados_convenio" ADD CONSTRAINT "FK_49e184a44d48a3e26ab68e993e5" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "configuracoes_atendimento_convenio" ADD CONSTRAINT "FK_7118c5acfd7781795b19bced1a4" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "campos_personalizados_convenio" ADD CONSTRAINT "FK_efafa15f96fa0882f05239a736b" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "repasses_filtros" ADD CONSTRAINT "FK_85c7968b9f7dd30548b4b5b3c01" FOREIGN KEY ("repasse_id") REFERENCES "repasses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "repasses" ADD CONSTRAINT "FK_f65138b6c22559ce83416df8cba" FOREIGN KEY ("unidade_id") REFERENCES "unidades_saude"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "centros_custo" ADD CONSTRAINT "FK_dea965c261d4e65681ed26cfff2" FOREIGN KEY ("unidade_id") REFERENCES "unidades_saude"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "composicoes_financeiras" ADD CONSTRAINT "FK_6a8922e562e25fbd0d97b538b0d" FOREIGN KEY ("conta_pagar_id") REFERENCES "contas_pagar"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "composicoes_financeiras" ADD CONSTRAINT "FK_ae3cb13b624a35dbf80a36f9a20" FOREIGN KEY ("conta_contabil_id") REFERENCES "contas_contabeis"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "composicoes_financeiras" ADD CONSTRAINT "FK_63ece8ff53a2d09c1c1ce4877e7" FOREIGN KEY ("centro_custo_id") REFERENCES "centros_custo"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "composicoes_financeiras" ADD CONSTRAINT "FK_e6481de07eac469d6eec6805344" FOREIGN KEY ("colaborador_id") REFERENCES "profissionais"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "impostos_retidos" ADD CONSTRAINT "FK_9988ac0a4ce6d20613b4cb6cd85" FOREIGN KEY ("conta_pagar_id") REFERENCES "contas_pagar"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "pagamentos_parcelas" ADD CONSTRAINT "FK_ad234e7adf4e29564d247fceb03" FOREIGN KEY ("parcela_id") REFERENCES "parcelas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "pagamentos_parcelas" ADD CONSTRAINT "FK_316bbe6dc54b1494515859e602d" FOREIGN KEY ("conta_bancaria_id") REFERENCES "contas_bancarias"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "parcelas" ADD CONSTRAINT "FK_9c1393c5dc2b571cb616314416e" FOREIGN KEY ("conta_pagar_id") REFERENCES "contas_pagar"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "anexos_contas_pagar" ADD CONSTRAINT "FK_6efd17faf98494fb97586cb1a12" FOREIGN KEY ("conta_pagar_id") REFERENCES "contas_pagar"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "contas_pagar" ADD CONSTRAINT "FK_a997f748acea3a784870ddd03e0" FOREIGN KEY ("unidade_devedora_id") REFERENCES "unidades_saude"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "parcelamentos_config" ADD CONSTRAINT "FK_dec3f4b0a592fbfa5f0ecbd68ec" FOREIGN KEY ("conta_pagar_id") REFERENCES "contas_pagar"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "parcelamentos_config" DROP CONSTRAINT "FK_dec3f4b0a592fbfa5f0ecbd68ec"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contas_pagar" DROP CONSTRAINT "FK_a997f748acea3a784870ddd03e0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "anexos_contas_pagar" DROP CONSTRAINT "FK_6efd17faf98494fb97586cb1a12"`,
    );
    await queryRunner.query(
      `ALTER TABLE "parcelas" DROP CONSTRAINT "FK_9c1393c5dc2b571cb616314416e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pagamentos_parcelas" DROP CONSTRAINT "FK_316bbe6dc54b1494515859e602d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pagamentos_parcelas" DROP CONSTRAINT "FK_ad234e7adf4e29564d247fceb03"`,
    );
    await queryRunner.query(
      `ALTER TABLE "impostos_retidos" DROP CONSTRAINT "FK_9988ac0a4ce6d20613b4cb6cd85"`,
    );
    await queryRunner.query(
      `ALTER TABLE "composicoes_financeiras" DROP CONSTRAINT "FK_e6481de07eac469d6eec6805344"`,
    );
    await queryRunner.query(
      `ALTER TABLE "composicoes_financeiras" DROP CONSTRAINT "FK_63ece8ff53a2d09c1c1ce4877e7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "composicoes_financeiras" DROP CONSTRAINT "FK_ae3cb13b624a35dbf80a36f9a20"`,
    );
    await queryRunner.query(
      `ALTER TABLE "composicoes_financeiras" DROP CONSTRAINT "FK_6a8922e562e25fbd0d97b538b0d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "centros_custo" DROP CONSTRAINT "FK_dea965c261d4e65681ed26cfff2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "repasses" DROP CONSTRAINT "FK_f65138b6c22559ce83416df8cba"`,
    );
    await queryRunner.query(
      `ALTER TABLE "repasses_filtros" DROP CONSTRAINT "FK_85c7968b9f7dd30548b4b5b3c01"`,
    );
    await queryRunner.query(
      `ALTER TABLE "campos_personalizados_convenio" DROP CONSTRAINT "FK_efafa15f96fa0882f05239a736b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "configuracoes_atendimento_convenio" DROP CONSTRAINT "FK_7118c5acfd7781795b19bced1a4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "dados_convenio" DROP CONSTRAINT "FK_49e184a44d48a3e26ab68e993e5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "configuracoes_campos_convenio" DROP CONSTRAINT "FK_7b8062f25717f633014ccd18638"`,
    );
    await queryRunner.query(
      `ALTER TABLE "instrucoes_convenio" DROP CONSTRAINT "FK_c863a4f4ac9064559c6b36eca18"`,
    );
    await queryRunner.query(
      `ALTER TABLE "planos_convenio" DROP CONSTRAINT "FK_e0206f5ef36e39a694f9d4a7c22"`,
    );
    await queryRunner.query(
      `ALTER TABLE "integracoes_convenio" DROP CONSTRAINT "FK_de87f407b5b98a727b1328f3035"`,
    );
    await queryRunner.query(
      `ALTER TABLE "restricoes_convenio" DROP CONSTRAINT "FK_b29ebac8fd25d57f8f4e4562ae7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contas_contabeis" DROP CONSTRAINT "FK_003f0bfce24fd17c82b6bd274f8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contas_contabeis" DROP CONSTRAINT "FK_146dd1215852047c9eaf1aecf9e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "restricoes_adquirente" DROP CONSTRAINT "FK_0a4c5821414a5e4b3826f36a002"`,
    );
    await queryRunner.query(
      `ALTER TABLE "restricoes_adquirente" DROP CONSTRAINT "FK_5af32e6833853169a2ccd2f3a30"`,
    );
    await queryRunner.query(
      `ALTER TABLE "adquirentes" DROP CONSTRAINT "FK_4770f4e75267e561f9d1c9d5965"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contas_bancarias" DROP CONSTRAINT "FK_b9284d2d29fbc31e1d861a5573b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contas_bancarias" DROP CONSTRAINT "FK_87f9ae3dbd541474c71978f6f00"`,
    );
    await queryRunner.query(
      `ALTER TABLE "gateways_pagamento" DROP CONSTRAINT "FK_8fdb08f98a380b4ff5c20a3199d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "respostas_formulario" DROP CONSTRAINT "FK_c9c976c943fc8aba3f239428770"`,
    );
    await queryRunner.query(
      `ALTER TABLE "respostas_formulario" DROP CONSTRAINT "FK_342c1d012448f111fd8c3ab27ec"`,
    );
    await queryRunner.query(
      `ALTER TABLE "respostas_formulario" DROP CONSTRAINT "FK_5902f3f4ce0a90309ac57ee76db"`,
    );
    await queryRunner.query(
      `ALTER TABLE "respostas_formulario" DROP CONSTRAINT "FK_d03249cd7b73b1b8acc7e88deae"`,
    );
    await queryRunner.query(
      `ALTER TABLE "respostas_campo" DROP CONSTRAINT "FK_8a2a015b4025a55cc423ecd8256"`,
    );
    await queryRunner.query(
      `ALTER TABLE "respostas_campo" DROP CONSTRAINT "FK_370f28419af837a1dbda61a3cab"`,
    );
    await queryRunner.query(
      `ALTER TABLE "formularios" DROP CONSTRAINT "FK_9aaeeac99dfee2d3846fd9ce188"`,
    );
    await queryRunner.query(
      `ALTER TABLE "formularios" DROP CONSTRAINT "FK_e0cb31caf9691957aa8dccba83a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "campos_formulario" DROP CONSTRAINT "FK_67439fee1218869b20c178026e3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "alternativas_campo" DROP CONSTRAINT "FK_e7553bb76133e731596eb441362"`,
    );
    await queryRunner.query(
      `ALTER TABLE "fornecedores" DROP CONSTRAINT "FK_0fb8f907c40978d0f3b198adabc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "integracoes" DROP CONSTRAINT "FK_84ec1c9f1b03cc6f743c6c756cc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "kits" DROP CONSTRAINT "FK_f9616bbef559d0feadcfd6b1748"`,
    );
    await queryRunner.query(
      `ALTER TABLE "kit_convenios" DROP CONSTRAINT "FK_b64239cdf9789aa3c014c80cc4a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "kit_convenios" DROP CONSTRAINT "FK_4035e473a107b7a86cf3ffffa52"`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP CONSTRAINT "FK_807b76b6f688d6d7d47fe735c94"`,
    );
    await queryRunner.query(
      `ALTER TABLE "instrucoes" DROP CONSTRAINT "FK_dd26562872777bf8ce16f997061"`,
    );
    await queryRunner.query(
      `ALTER TABLE "planos" DROP CONSTRAINT "FK_5acc2a4e3f7c8e181c012892608"`,
    );
    await queryRunner.query(
      `ALTER TABLE "restricoes" DROP CONSTRAINT "FK_ce82f2c2c0f8b73b11386c54718"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procedimentos_autorizados" DROP CONSTRAINT "FK_b3dfeecc613260212262b54c41b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tabelas_preco" DROP CONSTRAINT "FK_c5b48b07fcbf3f8cd60c7be69b2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "kit_unidades" DROP CONSTRAINT "FK_4f8b8488cf41eca57aab40ffa0e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "kit_unidades" DROP CONSTRAINT "FK_494a53b78a8946941aadc78d247"`,
    );
    await queryRunner.query(
      `ALTER TABLE "kit_exames" DROP CONSTRAINT "FK_ca4e95e556caef1e80546709172"`,
    );
    await queryRunner.query(
      `ALTER TABLE "kit_exames" DROP CONSTRAINT "FK_4d245b6a8b4628b601487308a60"`,
    );
    await queryRunner.query(
      `ALTER TABLE "laboratorios_metodos" DROP CONSTRAINT "FK_7d18ea692673166969ee7391640"`,
    );
    await queryRunner.query(
      `ALTER TABLE "laboratorios_metodos" DROP CONSTRAINT "FK_e1445f18d757962ef62fcd75ef0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "laboratorios" DROP CONSTRAINT "FK_6ee6a251b531dbdd6d18ed9ca6a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "prestador_servico_categorias" DROP CONSTRAINT "FK_39c21588fb433c75848b95d1ecc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "prestadores_servico" DROP CONSTRAINT "FK_95bdd3a9adae3f7327a9efedfea"`,
    );
    await queryRunner.query(
      `ALTER TABLE "exames" DROP CONSTRAINT "FK_25628670dfec238652b334ff2a2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "exames" DROP CONSTRAINT "FK_4194026d1ac0809426c39ed6e30"`,
    );
    await queryRunner.query(
      `ALTER TABLE "exames" DROP CONSTRAINT "FK_d76081f4ce0ab0153c0a77d4cee"`,
    );
    await queryRunner.query(
      `ALTER TABLE "exames" DROP CONSTRAINT "FK_8a575fa5a082c47295e8c1c981d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ordens_servico_exames" DROP CONSTRAINT "FK_4909a97b0566e2f950a3b29c446"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ordens_servico_exames" DROP CONSTRAINT "FK_01dd25b3c67eeb0b53b90642c67"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ordens_servico_exames" DROP CONSTRAINT "FK_e119c5edaab2722f9a29cc50727"`,
    );
    await queryRunner.query(
      `ALTER TABLE "resultados_exames" DROP CONSTRAINT "FK_1028937a4d04120dab46f83d157"`,
    );
    await queryRunner.query(
      `ALTER TABLE "resultados_exames" DROP CONSTRAINT "FK_0ac9b116f95df47e908a1214650"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ordens_servico" DROP CONSTRAINT "FK_530803f526491bc4066c4141d42"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ordens_servico" DROP CONSTRAINT "FK_b1b3d3e5b836732231b23c6ad46"`,
    );
    await queryRunner.query(
      `ALTER TABLE "telemedicina" DROP CONSTRAINT "FK_3b8b6cbf7da8164244b24e455f0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "kit_convenios" DROP CONSTRAINT "UQ_73ecbc748597c58b9586d85dc21"`,
    );
    await queryRunner.query(
      `ALTER TABLE "kit_unidades" DROP CONSTRAINT "UQ_c9f319e6e74bf47591784a687ba"`,
    );
    await queryRunner.query(
      `ALTER TABLE "kit_exames" DROP CONSTRAINT "UQ_14d55a8965297efd9afb361f644"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_2e6e8e65b58ef4b8d2a0f6bf99"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_bcdb3efc04c5833fec5fb84fe8"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_1de70f9c6436f12294538ec337"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_5920ce3727cdeaf3239161cb21"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_4f31dc4d464240932397ecaeb0"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_a10bb8b6b95914f057d3efa029"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_0ac9b116f95df47e908a121465"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_b1b3d3e5b836732231b23c6ad4"`,
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
      `DROP INDEX "public"."IDX_87912d0aec876ebe8d448c8bd4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "adquirentes" ALTER COLUMN "taxa_parcelamento" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "adquirentes" ALTER COLUMN "taxa_parcelamento" DROP NOT NULL`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."adquirentes_status_enum_old" AS ENUM('ativo', 'inativo', 'bloqueado', 'em_analise')`,
    );
    await queryRunner.query(
      `ALTER TABLE "adquirentes" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "adquirentes" ALTER COLUMN "status" TYPE "public"."adquirentes_status_enum_old" USING "status"::"text"::"public"."adquirentes_status_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "adquirentes" ALTER COLUMN "status" SET DEFAULT 'ativo'`,
    );
    await queryRunner.query(`DROP TYPE "public"."adquirentes_status_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."adquirentes_status_enum_old" RENAME TO "adquirentes_status_enum"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."contas_bancarias_status_enum_old" AS ENUM('ativa', 'inativa', 'bloqueada', 'encerrada')`,
    );
    await queryRunner.query(
      `ALTER TABLE "contas_bancarias" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "contas_bancarias" ALTER COLUMN "status" TYPE "public"."contas_bancarias_status_enum_old" USING "status"::"text"::"public"."contas_bancarias_status_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contas_bancarias" ALTER COLUMN "status" SET DEFAULT 'ativa'`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."contas_bancarias_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."contas_bancarias_status_enum_old" RENAME TO "contas_bancarias_status_enum"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."contas_bancarias_tipo_conta_enum_old" AS ENUM('corrente', 'poupanca', 'pagamento', 'salario', 'investimento')`,
    );
    await queryRunner.query(
      `ALTER TABLE "contas_bancarias" ALTER COLUMN "tipo_conta" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "contas_bancarias" ALTER COLUMN "tipo_conta" TYPE "public"."contas_bancarias_tipo_conta_enum_old" USING "tipo_conta"::"text"::"public"."contas_bancarias_tipo_conta_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contas_bancarias" ALTER COLUMN "tipo_conta" SET DEFAULT 'corrente'`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."contas_bancarias_tipo_conta_enum"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."contas_bancarias_tipo_conta_enum_old" RENAME TO "contas_bancarias_tipo_conta_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contas_bancarias" DROP COLUMN "agencia"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contas_bancarias" ADD "agencia" character varying(10) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "contas_bancarias" DROP CONSTRAINT "UQ_8abf28b7d8623f214e2c1ca0c3b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contas_bancarias" DROP COLUMN "codigo_interno"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contas_bancarias" ADD "codigo_interno" character varying(20) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "contas_bancarias" ADD CONSTRAINT "UQ_conta_codigo_interno" UNIQUE ("codigo_interno")`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."gateways_pagamento_status_enum_old" AS ENUM('ativo', 'inativo', 'suspenso', 'em_configuracao')`,
    );
    await queryRunner.query(
      `ALTER TABLE "gateways_pagamento" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "gateways_pagamento" ALTER COLUMN "status" TYPE "public"."gateways_pagamento_status_enum_old" USING "status"::"text"::"public"."gateways_pagamento_status_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "gateways_pagamento" ALTER COLUMN "status" SET DEFAULT 'em_configuracao'`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."gateways_pagamento_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."gateways_pagamento_status_enum_old" RENAME TO "gateways_pagamento_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bancos" ADD CONSTRAINT "UQ_banco_codigo" UNIQUE ("codigo")`,
    );
    await queryRunner.query(
      `ALTER TABLE "fornecedor_insumos" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "fornecedor_insumos" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "fornecedores" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "fornecedores" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "kits"."prazo_padrao_entrega" IS 'Prazo padrão de entrega do kit em dias'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "kits"."status_kit" IS 'Status do kit'`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."status_kit_enum_old" AS ENUM('ATIVO', 'INATIVO', 'EM_REVISAO')`,
    );
    await queryRunner.query(
      `ALTER TABLE "kits" ALTER COLUMN "status_kit" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "kits" ALTER COLUMN "status_kit" TYPE "public"."status_kit_enum_old" USING "status_kit"::"text"::"public"."status_kit_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "kits" ALTER COLUMN "status_kit" SET DEFAULT 'ATIVO'`,
    );
    await queryRunner.query(`DROP TYPE "public"."kits_status_kit_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."status_kit_enum_old" RENAME TO "status_kit_enum"`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "kits"."tipo_kit" IS 'Tipo de kit'`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."tipo_kit_enum_old" AS ENUM('CHECK_UP', 'OCUPACIONAL', 'PRE_NATAL', 'COM_DESCRICAO', 'PERSONALIZADO')`,
    );
    await queryRunner.query(
      `ALTER TABLE "kits" ALTER COLUMN "tipo_kit" TYPE "public"."tipo_kit_enum_old" USING "tipo_kit"::"text"::"public"."tipo_kit_enum_old"`,
    );
    await queryRunner.query(`DROP TYPE "public"."kits_tipo_kit_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."tipo_kit_enum_old" RENAME TO "tipo_kit_enum"`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "kits"."nome_kit" IS 'Nome do kit'`,
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
      `CREATE TYPE "public"."convenios_tipo_faturamento_enum_old" AS ENUM('tiss', 'proprio', 'manual')`,
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
      `COMMENT ON COLUMN "kit_exames"."ordem_insercao" IS 'Ordem de apresentação dos exames no kit'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "kit_exames"."quantidade" IS 'Quantidade de cada exame no kit'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "kit_exames"."codigo_tuss" IS 'Código TUSS do exame no kit'`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."tipo_servico_categoria_enum_old" AS ENUM('manutencao_equipamentos', 'prestadores_exames', 'honorario_contabeis', 'honorario_consultoria', 'honorario_advocaticio', 'internet_telefonia', 'agua', 'energia', 'suporte_software', 'desenvolvimento_software', 'seguranca_monitoramento', 'outros_servicos_pf', 'outros_servicos_pj', 'limpeza_conservacao', 'transporte_logistica', 'marketing_publicidade', 'recursos_humanos', 'treinamento_capacitacao', 'arquitetura_engenharia', 'vigilancia_sanitaria', 'calibracao_metrologia')`,
    );
    await queryRunner.query(
      `ALTER TABLE "prestador_servico_categorias" ALTER COLUMN "tipo_servico" TYPE "public"."tipo_servico_categoria_enum_old" USING "tipo_servico"::"text"::"public"."tipo_servico_categoria_enum_old"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."prestador_servico_categorias_tipo_servico_enum"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."tipo_servico_categoria_enum_old" RENAME TO "tipo_servico_categoria_enum"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."status_contrato_enum_old" AS ENUM('ativo', 'inativo', 'suspenso', 'em_analise', 'cancelado')`,
    );
    await queryRunner.query(
      `ALTER TABLE "prestadores_servico" ALTER COLUMN "status_contrato" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "prestadores_servico" ALTER COLUMN "status_contrato" TYPE "public"."status_contrato_enum_old" USING "status_contrato"::"text"::"public"."status_contrato_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "prestadores_servico" ALTER COLUMN "status_contrato" SET DEFAULT 'em_analise'`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."prestadores_servico_status_contrato_enum"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."status_contrato_enum_old" RENAME TO "status_contrato_enum"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."frequencia_pagamento_enum_old" AS ENUM('diario', 'semanal', 'quinzenal', 'mensal', 'bimestral', 'trimestral', 'semestral', 'anual', 'por_servico')`,
    );
    await queryRunner.query(
      `ALTER TABLE "prestadores_servico" ALTER COLUMN "frequencia_pagamento" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "prestadores_servico" ALTER COLUMN "frequencia_pagamento" TYPE "public"."frequencia_pagamento_enum_old" USING "frequencia_pagamento"::"text"::"public"."frequencia_pagamento_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "prestadores_servico" ALTER COLUMN "frequencia_pagamento" SET DEFAULT 'mensal'`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."prestadores_servico_frequencia_pagamento_enum"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."frequencia_pagamento_enum_old" RENAME TO "frequencia_pagamento_enum"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."forma_pagamento_prestador_enum_old" AS ENUM('mensalidade', 'por_servico', 'hora_trabalhada', 'pacote_fechado', 'comissao', 'misto')`,
    );
    await queryRunner.query(
      `ALTER TABLE "prestadores_servico" ALTER COLUMN "forma_pagamento" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "prestadores_servico" ALTER COLUMN "forma_pagamento" TYPE "public"."forma_pagamento_prestador_enum_old" USING "forma_pagamento"::"text"::"public"."forma_pagamento_prestador_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "prestadores_servico" ALTER COLUMN "forma_pagamento" SET DEFAULT 'por_servico'`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."prestadores_servico_forma_pagamento_enum"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."forma_pagamento_prestador_enum_old" RENAME TO "forma_pagamento_prestador_enum"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."tipo_contrato_enum_old" AS ENUM('fixo', 'por_demanda', 'retainer', 'projeto')`,
    );
    await queryRunner.query(
      `ALTER TABLE "prestadores_servico" ALTER COLUMN "tipo_contrato" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "prestadores_servico" ALTER COLUMN "tipo_contrato" TYPE "public"."tipo_contrato_enum_old" USING "tipo_contrato"::"text"::"public"."tipo_contrato_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "prestadores_servico" ALTER COLUMN "tipo_contrato" SET DEFAULT 'por_demanda'`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."prestadores_servico_tipo_contrato_enum"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."tipo_contrato_enum_old" RENAME TO "tipo_contrato_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "telemedicina_exames" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "telemedicina_exames" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "exames"."atualizado_por" IS 'ID do usuário que atualizou o registro'`,
    );
    await queryRunner.query(
      `ALTER TABLE "exames" DROP COLUMN "atualizado_por"`,
    );
    await queryRunner.query(
      `ALTER TABLE "exames" ADD "atualizado_por" integer`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "exames"."criado_por" IS 'ID do usuário que criou o registro'`,
    );
    await queryRunner.query(`ALTER TABLE "exames" DROP COLUMN "criado_por"`);
    await queryRunner.query(`ALTER TABLE "exames" ADD "criado_por" integer`);
    await queryRunner.query(
      `COMMENT ON COLUMN "exames"."empresa_id" IS 'ID da empresa (null = disponível para todas)'`,
    );
    await queryRunner.query(`ALTER TABLE "exames" DROP COLUMN "empresa_id"`);
    await queryRunner.query(`ALTER TABLE "exames" ADD "empresa_id" integer`);
    await queryRunner.query(
      `COMMENT ON COLUMN "exames"."laboratorio_apoio_id" IS NULL`,
    );
    await queryRunner.query(`COMMENT ON COLUMN "exames"."setor_id" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "exames"."subgrupo_id" IS NULL`);
    await queryRunner.query(
      `COMMENT ON COLUMN "exames"."tipo_exame_id" IS NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "exames" ALTER COLUMN "tipo_exame_id" DROP NOT NULL`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "setores_exame"."responsavel_id" IS 'ID do responsável pelo setor'`,
    );
    await queryRunner.query(
      `ALTER TABLE "setores_exame" DROP COLUMN "responsavel_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "setores_exame" ADD "responsavel_id" integer`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "ordens_servico_exames"."responsavel_controle_id" IS 'ID do responsável pelo controle de qualidade'`,
    );
    await queryRunner.query(
      `ALTER TABLE "ordens_servico_exames" DROP COLUMN "responsavel_controle_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ordens_servico_exames" ADD "responsavel_controle_id" integer`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "ordens_servico_exames"."exame_original_id" IS 'ID do exame original (se for repetição)'`,
    );
    await queryRunner.query(
      `ALTER TABLE "ordens_servico_exames" DROP COLUMN "exame_original_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ordens_servico_exames" ADD "exame_original_id" integer`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "ordens_servico_exames"."liberado_por" IS 'ID do responsável técnico que liberou'`,
    );
    await queryRunner.query(
      `ALTER TABLE "ordens_servico_exames" DROP COLUMN "liberado_por"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ordens_servico_exames" ADD "liberado_por" integer`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "ordens_servico_exames"."analista_id" IS 'ID do analista/biomédico'`,
    );
    await queryRunner.query(
      `ALTER TABLE "ordens_servico_exames" DROP COLUMN "analista_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ordens_servico_exames" ADD "analista_id" integer`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "ordens_servico_exames"."laboratorio_apoio_id" IS 'ID do laboratório de apoio destinatário'`,
    );
    await queryRunner.query(
      `ALTER TABLE "ordens_servico_exames" DROP COLUMN "laboratorio_apoio_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ordens_servico_exames" ADD "laboratorio_apoio_id" integer`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "ordens_servico_exames"."coletor_id" IS 'ID do profissional que coletou'`,
    );
    await queryRunner.query(
      `ALTER TABLE "ordens_servico_exames" DROP COLUMN "coletor_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ordens_servico_exames" ADD "coletor_id" integer`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "ordens_servico_exames"."exame_id" IS NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "ordens_servico_exames" ALTER COLUMN "exame_id" DROP NOT NULL`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "ordens_servico_exames"."ordem_servico_id" IS NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "ordens_servico_exames" ALTER COLUMN "ordem_servico_id" DROP NOT NULL`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "resultados_exames"."qc_responsavel_id" IS 'ID do responsável pelo QC'`,
    );
    await queryRunner.query(
      `ALTER TABLE "resultados_exames" DROP COLUMN "qc_responsavel_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "resultados_exames" ADD "qc_responsavel_id" integer`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "resultados_exames"."exame_id" IS 'ID do exame'`,
    );
    await queryRunner.query(
      `ALTER TABLE "resultados_exames" DROP COLUMN "exame_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "resultados_exames" ADD "exame_id" integer NOT NULL`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "resultados_exames"."ordem_servico_exame_id" IS NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "resultados_exames" ALTER COLUMN "ordem_servico_exame_id" DROP NOT NULL`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "ordens_servico"."atualizado_por" IS 'ID do usuário que atualizou o registro'`,
    );
    await queryRunner.query(
      `ALTER TABLE "ordens_servico" DROP COLUMN "atualizado_por"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ordens_servico" ADD "atualizado_por" integer`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "ordens_servico"."criado_por" IS 'ID do usuário que criou o registro'`,
    );
    await queryRunner.query(
      `ALTER TABLE "ordens_servico" DROP COLUMN "criado_por"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ordens_servico" ADD "criado_por" integer`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "ordens_servico"."empresa_id" IS 'ID da empresa'`,
    );
    await queryRunner.query(
      `ALTER TABLE "ordens_servico" DROP COLUMN "empresa_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ordens_servico" ADD "empresa_id" integer NOT NULL`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "ordens_servico"."coletor_id" IS 'ID do profissional que realizou a coleta'`,
    );
    await queryRunner.query(
      `ALTER TABLE "ordens_servico" DROP COLUMN "coletor_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ordens_servico" ADD "coletor_id" integer`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "ordens_servico"."atendente_id" IS 'ID do atendente que criou a OS'`,
    );
    await queryRunner.query(
      `ALTER TABLE "ordens_servico" DROP COLUMN "atendente_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ordens_servico" ADD "atendente_id" integer`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "ordens_servico"."convenio_id" IS NULL`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "ordens_servico"."paciente_id" IS NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "ordens_servico" ALTER COLUMN "paciente_id" DROP NOT NULL`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "pacientes"."atualizado_por" IS 'ID do usuário que atualizou o registro'`,
    );
    await queryRunner.query(
      `ALTER TABLE "pacientes" DROP COLUMN "atualizado_por"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pacientes" ADD "atualizado_por" integer`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "pacientes"."criado_por" IS 'ID do usuário que criou o registro'`,
    );
    await queryRunner.query(`ALTER TABLE "pacientes" DROP COLUMN "criado_por"`);
    await queryRunner.query(`ALTER TABLE "pacientes" ADD "criado_por" integer`);
    await queryRunner.query(
      `COMMENT ON COLUMN "pacientes"."empresa_id" IS 'ID da empresa (CNPJ/Filial)'`,
    );
    await queryRunner.query(`ALTER TABLE "pacientes" DROP COLUMN "empresa_id"`);
    await queryRunner.query(
      `ALTER TABLE "pacientes" ADD "empresa_id" integer NOT NULL`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "pacientes"."convenio_id" IS 'ID do convênio'`,
    );
    await queryRunner.query(
      `ALTER TABLE "pacientes" DROP COLUMN "convenio_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pacientes" ADD "convenio_id" integer`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_87912d0aec876ebe8d448c8bd4" ON "pacientes" ("cpf", "empresa_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "telemedicina" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "telemedicina" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "contas_contabeis" DROP COLUMN "conta_pai_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contas_contabeis" DROP COLUMN "plano_contas_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contas_contabeis" DROP COLUMN "desativar"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contas_contabeis" DROP COLUMN "excluir"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contas_contabeis" DROP COLUMN "vinculo_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contas_contabeis" DROP COLUMN "nome_classe"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contas_contabeis" DROP COLUMN "codigo_contabil"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contas_contabeis" DROP COLUMN "codigo_hierarquico"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contas_contabeis" DROP COLUMN "tipo_classificacao"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."contas_contabeis_tipo_classificacao_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "planos_contas" DROP COLUMN "usuario_edicao_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "planos_contas" DROP COLUMN "usuario_cadastro_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "planos_contas" DROP COLUMN "ultima_edicao"`,
    );
    await queryRunner.query(
      `ALTER TABLE "planos_contas" DROP COLUMN "data_cadastro"`,
    );
    await queryRunner.query(
      `ALTER TABLE "planos_contas" DROP COLUMN "nome_hierarquia"`,
    );
    await queryRunner.query(
      `ALTER TABLE "planos_contas" DROP COLUMN "descricao_hierarquia"`,
    );
    await queryRunner.query(
      `ALTER TABLE "restricoes_adquirente" DROP COLUMN "restricao"`,
    );
    await queryRunner.query(
      `ALTER TABLE "restricoes_adquirente" DROP COLUMN "unidade_saude_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "adquirentes" DROP COLUMN "configuracao_integracao"`,
    );
    await queryRunner.query(
      `ALTER TABLE "adquirentes" DROP COLUMN "conta_associada_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "adquirentes" DROP COLUMN "prazo_repasse"`,
    );
    await queryRunner.query(
      `ALTER TABLE "adquirentes" DROP COLUMN "percentual_repasse"`,
    );
    await queryRunner.query(
      `ALTER TABLE "adquirentes" DROP COLUMN "taxa_transacao"`,
    );
    await queryRunner.query(
      `ALTER TABLE "adquirentes" DROP COLUMN "opcao_parcelamento"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."adquirentes_opcao_parcelamento_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "adquirentes" DROP COLUMN "tipos_cartao_suportados"`,
    );
    await queryRunner.query(
      `ALTER TABLE "adquirentes" DROP COLUMN "descricao"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contas_bancarias" DROP COLUMN "conta_principal"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contas_bancarias" DROP COLUMN "descricao"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contas_bancarias" DROP COLUMN "chave_pix"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contas_bancarias" DROP COLUMN "digito_verificador"`,
    );
    await queryRunner.query(
      `ALTER TABLE "gateways_pagamento" DROP COLUMN "configuracao"`,
    );
    await queryRunner.query(
      `ALTER TABLE "gateways_pagamento" DROP COLUMN "contingencia"`,
    );
    await queryRunner.query(
      `ALTER TABLE "gateways_pagamento" DROP COLUMN "chave_api"`,
    );
    await queryRunner.query(
      `ALTER TABLE "gateways_pagamento" DROP COLUMN "validade_api"`,
    );
    await queryRunner.query(
      `ALTER TABLE "gateways_pagamento" DROP COLUMN "nome"`,
    );
    await queryRunner.query(
      `ALTER TABLE "gateways_pagamento" DROP COLUMN "tipo"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."gateways_pagamento_tipo_enum"`,
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
      `ALTER TABLE "contas_contabeis" ADD "observacoes" text`,
    );
    await queryRunner.query(
      `ALTER TABLE "contas_contabeis" ADD "data_saldo_inicial" date`,
    );
    await queryRunner.query(
      `ALTER TABLE "contas_contabeis" ADD "saldo_atual" numeric(15,2) DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "contas_contabeis" ADD "saldo_inicial" numeric(15,2) DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "contas_contabeis" ADD "unidade_saude_id" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "contas_contabeis" ADD "plano_conta_id" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "planos_contas" ADD "observacoes" text`,
    );
    await queryRunner.query(`ALTER TABLE "planos_contas" ADD "descricao" text`);
    await queryRunner.query(
      `ALTER TABLE "planos_contas" ADD "nome_conta" character varying(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "planos_contas" ADD "codigo_conta" character varying(20) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "planos_contas" ADD CONSTRAINT "UQ_plano_codigo_conta" UNIQUE ("codigo_conta")`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."planos_contas_status_enum" AS ENUM('ativa', 'inativa', 'bloqueada')`,
    );
    await queryRunner.query(
      `ALTER TABLE "planos_contas" ADD "status" "public"."planos_contas_status_enum" NOT NULL DEFAULT 'ativa'`,
    );
    await queryRunner.query(
      `ALTER TABLE "planos_contas" ADD "aceita_lancamento" boolean DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "planos_contas" ADD "nivel" integer NOT NULL DEFAULT '1'`,
    );
    await queryRunner.query(
      `ALTER TABLE "planos_contas" ADD "conta_pai_id" uuid`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."planos_contas_natureza_enum" AS ENUM('devedora', 'credora')`,
    );
    await queryRunner.query(
      `ALTER TABLE "planos_contas" ADD "natureza" "public"."planos_contas_natureza_enum" NOT NULL`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."planos_contas_tipo_conta_enum" AS ENUM('receita', 'despesa', 'ativo', 'passivo', 'patrimonio')`,
    );
    await queryRunner.query(
      `ALTER TABLE "planos_contas" ADD "tipo_conta" "public"."planos_contas_tipo_conta_enum" NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "restricoes_adquirente" ADD "descricao" text`,
    );
    await queryRunner.query(
      `ALTER TABLE "restricoes_adquirente" ADD "valor_restricao" character varying(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "restricoes_adquirente" ADD "ativa" boolean DEFAULT true`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."restricoes_adquirente_tipo_restricao_enum" AS ENUM('bandeira', 'valor_minimo', 'valor_maximo', 'horario', 'dia_semana')`,
    );
    await queryRunner.query(
      `ALTER TABLE "restricoes_adquirente" ADD "tipo_restricao" "public"."restricoes_adquirente_tipo_restricao_enum" NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "adquirentes" ADD "observacoes" text`);
    await queryRunner.query(
      `ALTER TABLE "adquirentes" ADD "email_suporte" character varying(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "adquirentes" ADD "telefone_suporte" character varying(20)`,
    );
    await queryRunner.query(
      `ALTER TABLE "adquirentes" ADD "contato_comercial" character varying(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "adquirentes" ADD "terminal_id" character varying(50)`,
    );
    await queryRunner.query(
      `ALTER TABLE "adquirentes" ADD "codigo_estabelecimento" character varying(50)`,
    );
    await queryRunner.query(
      `ALTER TABLE "adquirentes" ADD "valor_minimo_parcela" numeric(10,2) DEFAULT '50'`,
    );
    await queryRunner.query(
      `ALTER TABLE "adquirentes" ADD "parcela_maxima" integer DEFAULT '12'`,
    );
    await queryRunner.query(
      `ALTER TABLE "adquirentes" ADD "permite_parcelamento" boolean DEFAULT true`,
    );
    await queryRunner.query(
      `ALTER TABLE "adquirentes" ADD "prazo_recebimento" integer DEFAULT '30'`,
    );
    await queryRunner.query(
      `ALTER TABLE "adquirentes" ADD "taxa_antecipacao" numeric(5,2)`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."adquirentes_tipo_adquirente_enum" AS ENUM('cielo', 'rede', 'getnet', 'stone', 'pagseguro', 'mercadopago', 'safrapay', 'vero', 'outro')`,
    );
    await queryRunner.query(
      `ALTER TABLE "adquirentes" ADD "tipo_adquirente" "public"."adquirentes_tipo_adquirente_enum" NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "adquirentes" ADD "conta_bancaria_id" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "contas_bancarias" ADD "observacoes" text`,
    );
    await queryRunner.query(
      `ALTER TABLE "contas_bancarias" ADD "pix_chave" character varying(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "contas_bancarias" ADD "pix_tipo" character varying(20)`,
    );
    await queryRunner.query(
      `ALTER TABLE "contas_bancarias" ADD "cpf_cnpj_titular" character varying(20) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "contas_bancarias" ADD "titular" character varying(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "contas_bancarias" ADD "digito_conta" character varying(2) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "contas_bancarias" ADD "digito_agencia" character varying(2)`,
    );
    await queryRunner.query(
      `ALTER TABLE "contas_bancarias" ADD "nome_conta" character varying(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "contas_bancarias" ADD "saldo_inicial" numeric(15,2) DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "gateways_pagamento" ADD "observacoes" text`,
    );
    await queryRunner.query(
      `ALTER TABLE "gateways_pagamento" ADD "webhook_secret" character varying(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "gateways_pagamento" ADD "webhook_url" character varying(500)`,
    );
    await queryRunner.query(
      `ALTER TABLE "gateways_pagamento" ADD "api_secret" character varying(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "gateways_pagamento" ADD "api_key" character varying(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "gateways_pagamento" ADD "merchant_key" character varying(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "gateways_pagamento" ADD "merchant_id" character varying(100)`,
    );
    await queryRunner.query(
      `ALTER TABLE "gateways_pagamento" ADD "nome_gateway" character varying(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "gateways_pagamento" ADD "codigo_interno" character varying(20) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "gateways_pagamento" ADD CONSTRAINT "UQ_gateway_codigo_interno" UNIQUE ("codigo_interno")`,
    );
    await queryRunner.query(
      `ALTER TABLE "gateways_pagamento" ADD "configuracao_adicional" jsonb`,
    );
    await queryRunner.query(
      `ALTER TABLE "gateways_pagamento" ADD "prazo_recebimento" integer DEFAULT '1'`,
    );
    await queryRunner.query(
      `ALTER TABLE "gateways_pagamento" ADD "taxa_boleto" numeric(5,2)`,
    );
    await queryRunner.query(
      `ALTER TABLE "gateways_pagamento" ADD "taxa_pix" numeric(5,2)`,
    );
    await queryRunner.query(
      `ALTER TABLE "gateways_pagamento" ADD "taxa_debito" numeric(5,2)`,
    );
    await queryRunner.query(
      `ALTER TABLE "gateways_pagamento" ADD "taxa_credito" numeric(5,2)`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."gateways_pagamento_ambiente_enum" AS ENUM('producao', 'homologacao', 'teste')`,
    );
    await queryRunner.query(
      `ALTER TABLE "gateways_pagamento" ADD "ambiente" "public"."gateways_pagamento_ambiente_enum" NOT NULL DEFAULT 'teste'`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."gateways_pagamento_modalidade_enum" AS ENUM('credito', 'debito', 'pix', 'boleto', 'todos')`,
    );
    await queryRunner.query(
      `ALTER TABLE "gateways_pagamento" ADD "modalidade" "public"."gateways_pagamento_modalidade_enum" NOT NULL DEFAULT 'todos'`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."gateways_pagamento_tipo_gateway_enum" AS ENUM('cielo', 'rede', 'getnet', 'stone', 'pagseguro', 'mercadopago', 'pagarme', 'ifood', 'rappi', 'outro')`,
    );
    await queryRunner.query(
      `ALTER TABLE "gateways_pagamento" ADD "tipo_gateway" "public"."gateways_pagamento_tipo_gateway_enum" NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "bancos" ADD "website" character varying(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "resultados_exames" ADD "laboratorio_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD "observacoes_convenio" text`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD "codigo_convenio" character varying(20)`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD CONSTRAINT "UQ_convenios_codigo" UNIQUE ("codigo_convenio")`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD "valor_consulta" numeric(10,2)`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD "percentual_coparticipacao" numeric(5,2)`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD "aceita_atendimento_online" boolean DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD "empresa_id" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD CONSTRAINT "UQ_convenios_empresa_id" UNIQUE ("empresa_id")`,
    );
    await queryRunner.query(`DROP TABLE "parcelamentos_config"`);
    await queryRunner.query(
      `DROP TYPE "public"."parcelamentos_config_periodicidade_enum"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_a9361e49eb6e7ae8df58e2ae76"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_a20ec8c8f91fa848cfb960fd71"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_a997f748acea3a784870ddd03e"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_0aae5c754b3c58dc590a837dcc"`,
    );
    await queryRunner.query(`DROP TABLE "contas_pagar"`);
    await queryRunner.query(`DROP TYPE "public"."contas_pagar_status_enum"`);
    await queryRunner.query(
      `DROP TYPE "public"."contas_pagar_tipo_documento_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."contas_pagar_credor_tipo_enum"`,
    );
    await queryRunner.query(`DROP TABLE "anexos_contas_pagar"`);
    await queryRunner.query(
      `DROP TYPE "public"."anexos_contas_pagar_tipo_anexo_enum"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_51c1e722beb0f9ebb540991c9b"`,
    );
    await queryRunner.query(`DROP TABLE "parcelas"`);
    await queryRunner.query(`DROP TYPE "public"."parcelas_status_enum"`);
    await queryRunner.query(`DROP TABLE "pagamentos_parcelas"`);
    await queryRunner.query(
      `DROP TYPE "public"."pagamentos_parcelas_forma_pagamento_enum"`,
    );
    await queryRunner.query(`DROP TABLE "impostos_retidos"`);
    await queryRunner.query(
      `DROP TYPE "public"."impostos_retidos_tipo_imposto_enum"`,
    );
    await queryRunner.query(`DROP TABLE "composicoes_financeiras"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_2cf4cc82a75a27a96b77a7f493"`,
    );
    await queryRunner.query(`DROP TABLE "centros_custo"`);
    await queryRunner.query(`DROP TABLE "repasses"`);
    await queryRunner.query(`DROP TYPE "public"."repasses_status_enum"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_601e32c468b0a6983ab3ea4f16"`,
    );
    await queryRunner.query(`DROP TABLE "repasses_filtros"`);
    await queryRunner.query(
      `DROP TYPE "public"."repasses_filtros_entidade_tipo_enum"`,
    );
    await queryRunner.query(`DROP TABLE "campos_personalizados_convenio"`);
    await queryRunner.query(`DROP TABLE "configuracoes_atendimento_convenio"`);
    await queryRunner.query(`DROP TABLE "dados_convenio"`);
    await queryRunner.query(
      `DROP TYPE "public"."dados_convenio_tabela_material_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."dados_convenio_tabela_base_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."dados_convenio_tabela_servico_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."dados_convenio_fatura_ate_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."dados_convenio_tipo_envio_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."dados_convenio_forma_liquidacao_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."dados_convenio_tipo_convenio_enum"`,
    );
    await queryRunner.query(`DROP TABLE "configuracoes_campos_convenio"`);
    await queryRunner.query(
      `DROP TYPE "public"."configuracoes_campos_convenio_tipo_obrigatoriedade_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."configuracoes_campos_convenio_secao_enum"`,
    );
    await queryRunner.query(`DROP TABLE "instrucoes_convenio"`);
    await queryRunner.query(`DROP TABLE "planos_convenio"`);
    await queryRunner.query(`DROP TABLE "integracoes_convenio"`);
    await queryRunner.query(`DROP TABLE "restricoes_convenio"`);
    await queryRunner.query(
      `DROP TYPE "public"."restricoes_convenio_tipo_restricao_enum"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_c740e4327de792b24d8746999e"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_4c24240ee6381f5309243d7286"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_a8aa141cd37668699551ea6a7b"`,
    );
    await queryRunner.query(`DROP TABLE "respostas_formulario"`);
    await queryRunner.query(
      `DROP TYPE "public"."respostas_formulario_status_enum"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_a124ea8ed8eaee5a435f05f7ac"`,
    );
    await queryRunner.query(`DROP TABLE "respostas_campo"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_41734f5084c2296412a2289fb8"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_53f0aac643c39b489226d72d64"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_e0cb31caf9691957aa8dccba83"`,
    );
    await queryRunner.query(`DROP TABLE "formularios"`);
    await queryRunner.query(`DROP TYPE "public"."formularios_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."formularios_categoria_enum"`);
    await queryRunner.query(`DROP TYPE "public"."formularios_tipo_enum"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_64e20564f6083689be073eec61"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_65babffa2b26c3c96709274aa4"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_02861eb976fbe5df422843ba49"`,
    );
    await queryRunner.query(`DROP TABLE "campos_formulario"`);
    await queryRunner.query(
      `DROP TYPE "public"."campos_formulario_status_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."campos_formulario_tipo_campo_enum"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_b5a3ab4d3ad30855ad4c39e736"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_e6fed83083145e4eacacdef380"`,
    );
    await queryRunner.query(`DROP TABLE "alternativas_campo"`);
    await queryRunner.query(
      `DROP TYPE "public"."alternativas_campo_status_enum"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_31f9e7b77d84db8376b81c265b"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_b2c226842808110feee86182a8"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_d7605e31326af142657184148d"`,
    );
    await queryRunner.query(`DROP TABLE "integracoes"`);
    await queryRunner.query(`DROP TYPE "public"."integracoes_status_enum"`);
    await queryRunner.query(
      `DROP TYPE "public"."integracoes_formato_retorno_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."integracoes_padrao_comunicacao_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."integracoes_tipo_integracao_enum"`,
    );
    await queryRunner.query(`DROP TABLE "instrucoes"`);
    await queryRunner.query(`DROP TYPE "public"."instrucoes_prioridade_enum"`);
    await queryRunner.query(`DROP TYPE "public"."instrucoes_status_enum"`);
    await queryRunner.query(
      `DROP TYPE "public"."instrucoes_tipo_procedimento_enum"`,
    );
    await queryRunner.query(`DROP TYPE "public"."instrucoes_categoria_enum"`);
    await queryRunner.query(`DROP TABLE "planos"`);
    await queryRunner.query(
      `DROP TYPE "public"."planos_cobertura_geografica_enum"`,
    );
    await queryRunner.query(`DROP TYPE "public"."planos_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."planos_modalidade_enum"`);
    await queryRunner.query(`DROP TYPE "public"."planos_categoria_enum"`);
    await queryRunner.query(`DROP TYPE "public"."planos_tipo_plano_enum"`);
    await queryRunner.query(`DROP TABLE "restricoes"`);
    await queryRunner.query(
      `DROP TYPE "public"."restricoes_tipo_restricao_enum"`,
    );
    await queryRunner.query(`DROP TABLE "procedimentos_autorizados"`);
    await queryRunner.query(`DROP TABLE "tabelas_preco"`);
    await queryRunner.query(
      `DROP TYPE "public"."tabelas_preco_tipo_tabela_enum"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_808aa72c9cd62a9f8bb83691bd"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_8a7c2084abeadd7660da4350ca"`,
    );
    await queryRunner.query(`DROP TABLE "metodos"`);
    await queryRunner.query(`DROP TYPE "public"."metodos_status_enum"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_e1445f18d757962ef62fcd75ef"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_7d18ea692673166969ee739164"`,
    );
    await queryRunner.query(`DROP TABLE "laboratorios_metodos"`);
    await queryRunner.query(
      `ALTER TABLE "contas_contabeis" ADD CONSTRAINT "UQ_conta_contabil_plano_unidade" UNIQUE ("plano_conta_id", "unidade_saude_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "kit_convenios" ADD CONSTRAINT "UQ_kit_convenio" UNIQUE ("kit_id", "convenio_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "kit_unidades" ADD CONSTRAINT "UQ_kit_unidade" UNIQUE ("kit_id", "unidade_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "kit_exames" ADD CONSTRAINT "UQ_kit_exame" UNIQUE ("kit_id", "exame_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_conta_contabil_unidade" ON "contas_contabeis" ("unidade_saude_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_conta_contabil_plano" ON "contas_contabeis" ("plano_conta_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_plano_conta_tipo" ON "planos_contas" ("tipo_conta") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_plano_conta_pai" ON "planos_contas" ("conta_pai_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_plano_conta_codigo" ON "planos_contas" ("codigo_conta") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_restricao_adquirente" ON "restricoes_adquirente" ("adquirente_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_adquirente_status" ON "adquirentes" ("status") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_adquirente_tipo" ON "adquirentes" ("tipo_adquirente") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_adquirente_conta" ON "adquirentes" ("conta_bancaria_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_conta_status" ON "contas_bancarias" ("status") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_conta_unidade" ON "contas_bancarias" ("unidade_saude_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_conta_banco" ON "contas_bancarias" ("banco_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_gateway_status" ON "gateways_pagamento" ("status") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_gateway_tipo" ON "gateways_pagamento" ("tipo_gateway") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_gateway_conta" ON "gateways_pagamento" ("conta_bancaria_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_banco_status" ON "bancos" ("status") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_banco_codigo" ON "bancos" ("codigo") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_fornecedor_insumos_codigo_barras" ON "fornecedor_insumos" ("codigo_barras") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_fornecedor_insumos_ativo" ON "fornecedor_insumos" ("ativo") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_fornecedor_insumos_status" ON "fornecedor_insumos" ("status") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_fornecedor_insumos_categoria" ON "fornecedor_insumos" ("categoria") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_fornecedor_insumos_fornecedor_id" ON "fornecedor_insumos" ("fornecedor_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_fornecedores_status" ON "fornecedores" ("status_fornecedor") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_fornecedores_codigo" ON "fornecedores" ("codigo_fornecedor") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_fornecedores_empresa_id" ON "fornecedores" ("empresa_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_kit_empresa" ON "kits" ("empresa_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_kit_status" ON "kits" ("status_kit") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_kit_tipo" ON "kits" ("tipo_kit") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_kit_nome" ON "kits" ("nome_kit") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_kit_codigo_interno" ON "kits" ("codigo_interno") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ddd3718e7bbc953f53820939f8" ON "convenios" ("nome") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_prestador_servico_categoria_ativo" ON "prestador_servico_categorias" ("ativo") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_prestador_servico_categoria_unique" ON "prestador_servico_categorias" ("prestador_servico_id", "tipo_servico") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_prestador_servico_tipo_contrato" ON "prestadores_servico" ("tipo_contrato") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_prestador_servico_status_contrato" ON "prestadores_servico" ("status_contrato") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_telemedicina_exames_ativo" ON "telemedicina_exames" ("ativo") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_telemedicina_exames_exame_id" ON "telemedicina_exames" ("exame_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_telemedicina_exames_telemedicina_id" ON "telemedicina_exames" ("telemedicina_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_exames_nome" ON "exames" ("nome") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_exames_codigo_interno" ON "exames" ("codigo_interno") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_pacientes_cpf" ON "pacientes" ("cpf") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_telemedicina_status_integracao" ON "telemedicina" ("status_integracao") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_telemedicina_tipo_integracao" ON "telemedicina" ("tipo_integracao") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_telemedicina_codigo" ON "telemedicina" ("codigo_telemedicina") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_telemedicina_empresa_id" ON "telemedicina" ("empresa_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "contas_contabeis" ADD CONSTRAINT "FK_conta_contabil_plano" FOREIGN KEY ("plano_conta_id") REFERENCES "planos_contas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "contas_contabeis" ADD CONSTRAINT "FK_conta_contabil_unidade" FOREIGN KEY ("unidade_saude_id") REFERENCES "unidades_saude"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "planos_contas" ADD CONSTRAINT "FK_plano_conta_pai" FOREIGN KEY ("conta_pai_id") REFERENCES "planos_contas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "restricoes_adquirente" ADD CONSTRAINT "FK_restricao_adquirente" FOREIGN KEY ("adquirente_id") REFERENCES "adquirentes"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "adquirentes" ADD CONSTRAINT "FK_adquirente_conta_bancaria" FOREIGN KEY ("conta_bancaria_id") REFERENCES "contas_bancarias"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "contas_bancarias" ADD CONSTRAINT "FK_conta_banco" FOREIGN KEY ("banco_id") REFERENCES "bancos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "contas_bancarias" ADD CONSTRAINT "FK_conta_unidade" FOREIGN KEY ("unidade_saude_id") REFERENCES "unidades_saude"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "gateways_pagamento" ADD CONSTRAINT "FK_gateway_conta_bancaria" FOREIGN KEY ("conta_bancaria_id") REFERENCES "contas_bancarias"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "fornecedores" ADD CONSTRAINT "FK_0fb8f907c40978d0f3b198adabc" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "kits" ADD CONSTRAINT "FK_kit_empresa" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "kit_convenios" ADD CONSTRAINT "FK_kit_convenio_kit" FOREIGN KEY ("kit_id") REFERENCES "kits"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "kit_convenios" ADD CONSTRAINT "FK_kit_convenio_convenio" FOREIGN KEY ("convenio_id") REFERENCES "convenios"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "kit_unidades" ADD CONSTRAINT "FK_kit_unidade_kit" FOREIGN KEY ("kit_id") REFERENCES "kits"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "kit_unidades" ADD CONSTRAINT "FK_kit_unidade_unidade" FOREIGN KEY ("unidade_id") REFERENCES "unidades_saude"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "kit_exames" ADD CONSTRAINT "FK_kit_exame_kit" FOREIGN KEY ("kit_id") REFERENCES "kits"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "kit_exames" ADD CONSTRAINT "FK_kit_exame_exame" FOREIGN KEY ("exame_id") REFERENCES "exames"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "laboratorios" ADD CONSTRAINT "FK_6ee6a251b531dbdd6d18ed9ca6a" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "prestador_servico_categorias" ADD CONSTRAINT "FK_prestador_servico_categoria_prestador" FOREIGN KEY ("prestador_servico_id") REFERENCES "prestadores_servico"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "prestadores_servico" ADD CONSTRAINT "FK_prestador_servico_empresa" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "exames" ADD CONSTRAINT "fk_exame_tipo" FOREIGN KEY ("tipo_exame_id") REFERENCES "tipos_exame"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "exames" ADD CONSTRAINT "fk_exame_subgrupo" FOREIGN KEY ("subgrupo_id") REFERENCES "subgrupos_exame"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "exames" ADD CONSTRAINT "fk_exame_setor" FOREIGN KEY ("setor_id") REFERENCES "setores_exame"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "exames" ADD CONSTRAINT "fk_exame_laboratorio" FOREIGN KEY ("laboratorio_apoio_id") REFERENCES "laboratorios_apoio"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ordens_servico_exames" ADD CONSTRAINT "fk_ordem_exame_ordem" FOREIGN KEY ("ordem_servico_id") REFERENCES "ordens_servico"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ordens_servico_exames" ADD CONSTRAINT "fk_ordem_exame_exame" FOREIGN KEY ("exame_id") REFERENCES "exames"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "resultados_exames" ADD CONSTRAINT "fk_resultado_ordem_exame" FOREIGN KEY ("ordem_servico_exame_id") REFERENCES "ordens_servico_exames"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ordens_servico" ADD CONSTRAINT "fk_ordem_paciente" FOREIGN KEY ("paciente_id") REFERENCES "pacientes"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ordens_servico" ADD CONSTRAINT "fk_ordem_convenio" FOREIGN KEY ("convenio_id") REFERENCES "convenios"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD CONSTRAINT "FK_convenios_empresa" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "telemedicina" ADD CONSTRAINT "FK_3b8b6cbf7da8164244b24e455f0" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}
