import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateExamesTables1757809611114 implements MigrationInterface {
  name = 'CreateExamesTables1757809611114';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."convenios_tipo_faturamento_enum" AS ENUM('tiss', 'proprio', 'manual')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."convenios_status_enum" AS ENUM('ativo', 'inativo', 'suspenso')`,
    );
    await queryRunner.query(
      `CREATE TABLE "convenios" ("id" SERIAL NOT NULL, "codigo" character varying(20) NOT NULL, "nome" character varying(255) NOT NULL, "razao_social" character varying(255) NOT NULL, "cnpj" character varying(14), "registro_ans" character varying(50), "tem_integracao_api" boolean NOT NULL DEFAULT false, "url_api" character varying(255), "token_api" character varying(255), "requer_autorizacao" boolean NOT NULL DEFAULT false, "requer_senha" boolean NOT NULL DEFAULT false, "validade_guia_dias" integer, "tipo_faturamento" "public"."convenios_tipo_faturamento_enum" NOT NULL DEFAULT 'tiss', "portal_envio" character varying(255), "dia_fechamento" integer, "prazo_pagamento_dias" integer, "percentual_desconto" numeric(5,2) NOT NULL DEFAULT '0', "tabela_precos" character varying(50), "telefone" character varying(20), "email" character varying(255), "contato_nome" character varying(255), "observacoes" text, "regras_especificas" jsonb, "status" "public"."convenios_status_enum" NOT NULL DEFAULT 'ativo', "criado_em" TIMESTAMP NOT NULL DEFAULT now(), "atualizado_em" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_1c7842a1c9b419f3d5cc463e285" UNIQUE ("codigo"), CONSTRAINT "PK_fa042004f48924b7d9a46fea728" PRIMARY KEY ("id")); COMMENT ON COLUMN "convenios"."codigo" IS 'Código interno do convênio'; COMMENT ON COLUMN "convenios"."nome" IS 'Nome do convênio'; COMMENT ON COLUMN "convenios"."razao_social" IS 'Razão social'; COMMENT ON COLUMN "convenios"."cnpj" IS 'CNPJ do convênio'; COMMENT ON COLUMN "convenios"."registro_ans" IS 'Registro ANS'; COMMENT ON COLUMN "convenios"."tem_integracao_api" IS 'Se tem integração via API'; COMMENT ON COLUMN "convenios"."url_api" IS 'URL da API do convênio'; COMMENT ON COLUMN "convenios"."token_api" IS 'Token/chave de acesso'; COMMENT ON COLUMN "convenios"."requer_autorizacao" IS 'Se requer autorização prévia'; COMMENT ON COLUMN "convenios"."requer_senha" IS 'Se requer senha de autorização'; COMMENT ON COLUMN "convenios"."validade_guia_dias" IS 'Validade padrão da guia em dias'; COMMENT ON COLUMN "convenios"."tipo_faturamento" IS 'Tipo de faturamento'; COMMENT ON COLUMN "convenios"."portal_envio" IS 'Portal de envio (SAVI, Orizon, etc)'; COMMENT ON COLUMN "convenios"."dia_fechamento" IS 'Dia de fechamento do faturamento'; COMMENT ON COLUMN "convenios"."prazo_pagamento_dias" IS 'Prazo de pagamento em dias'; COMMENT ON COLUMN "convenios"."percentual_desconto" IS 'Percentual de desconto padrão'; COMMENT ON COLUMN "convenios"."tabela_precos" IS 'Tabela de preços utilizada'; COMMENT ON COLUMN "convenios"."telefone" IS 'Telefone de contato'; COMMENT ON COLUMN "convenios"."email" IS 'E-mail de contato'; COMMENT ON COLUMN "convenios"."contato_nome" IS 'Pessoa de contato'; COMMENT ON COLUMN "convenios"."observacoes" IS 'Observações gerais'; COMMENT ON COLUMN "convenios"."regras_especificas" IS 'Regras específicas do convênio'; COMMENT ON COLUMN "convenios"."status" IS 'Status do convênio'; COMMENT ON COLUMN "convenios"."criado_em" IS 'Data de criação'; COMMENT ON COLUMN "convenios"."atualizado_em" IS 'Data de atualização'`,
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
      `CREATE TYPE "public"."ordens_servico_canal_origem_enum" AS ENUM('presencial', 'whatsapp', 'telefone', 'email', 'portal', 'domiciliar')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."ordens_servico_prioridade_enum" AS ENUM('normal', 'urgente', 'emergencia')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."ordens_servico_tipo_atendimento_enum" AS ENUM('particular', 'convenio', 'sus')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."ordens_servico_status_enum" AS ENUM('rascunho', 'agendado', 'confirmado', 'em_atendimento', 'aguardando_coleta', 'coletado', 'em_analise', 'parcialmente_liberado', 'liberado', 'entregue', 'cancelado')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."ordens_servico_status_pagamento_enum" AS ENUM('pendente', 'parcial', 'pago', 'cancelado')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."ordens_servico_forma_entrega_enum" AS ENUM('presencial', 'email', 'whatsapp', 'portal', 'correios')`,
    );
    await queryRunner.query(
      `CREATE TABLE "ordens_servico" ("id" SERIAL NOT NULL, "codigo" character varying(50) NOT NULL, "protocolo" character varying(50) NOT NULL, "paciente_id" integer NOT NULL, "unidade_saude_id" uuid NOT NULL, "data_atendimento" TIMESTAMP NOT NULL, "data_coleta_prevista" date, "data_coleta_realizada" TIMESTAMP, "data_entrega_prevista" date, "data_entrega_realizada" TIMESTAMP, "canal_origem" "public"."ordens_servico_canal_origem_enum" NOT NULL, "prioridade" "public"."ordens_servico_prioridade_enum" NOT NULL DEFAULT 'normal', "tipo_atendimento" "public"."ordens_servico_tipo_atendimento_enum" NOT NULL, "convenio_id" integer, "numero_guia" character varying(50), "senha_autorizacao" character varying(50), "validade_guia" date, "medico_solicitante" character varying(255), "crm_solicitante" character varying(20), "clinica_origem" character varying(255), "valor_total" numeric(10,2) NOT NULL DEFAULT '0', "valor_desconto" numeric(10,2) NOT NULL DEFAULT '0', "valor_final" numeric(10,2) NOT NULL DEFAULT '0', "valor_pago" numeric(10,2) NOT NULL DEFAULT '0', "status" "public"."ordens_servico_status_enum" NOT NULL DEFAULT 'rascunho', "status_pagamento" "public"."ordens_servico_status_pagamento_enum" NOT NULL DEFAULT 'pendente', "observacoes" text, "notas_internas" text, "orientacoes_paciente" text, "documentos_anexados" jsonb, "forma_entrega" "public"."ordens_servico_forma_entrega_enum", "dados_entrega" character varying(255), "atendente_id" integer, "coletor_id" integer, "historico_status" jsonb, "empresa_id" integer NOT NULL, "criado_em" TIMESTAMP NOT NULL DEFAULT now(), "atualizado_em" TIMESTAMP NOT NULL DEFAULT now(), "criado_por" integer, "atualizado_por" integer, CONSTRAINT "UQ_54200b365883ce3b8f7ad48eaaf" UNIQUE ("codigo"), CONSTRAINT "UQ_06cc03c264582adb66f4d800673" UNIQUE ("protocolo"), CONSTRAINT "PK_7e88933ca1acb36785ccb55a34c" PRIMARY KEY ("id")); COMMENT ON COLUMN "ordens_servico"."codigo" IS 'Código único da ordem de serviço'; COMMENT ON COLUMN "ordens_servico"."protocolo" IS 'Protocolo de atendimento'; COMMENT ON COLUMN "ordens_servico"."paciente_id" IS 'ID do paciente'; COMMENT ON COLUMN "ordens_servico"."unidade_saude_id" IS 'ID da unidade de saúde'; COMMENT ON COLUMN "ordens_servico"."data_atendimento" IS 'Data e hora do atendimento'; COMMENT ON COLUMN "ordens_servico"."data_coleta_prevista" IS 'Data prevista para coleta'; COMMENT ON COLUMN "ordens_servico"."data_coleta_realizada" IS 'Data e hora real da coleta'; COMMENT ON COLUMN "ordens_servico"."data_entrega_prevista" IS 'Data prevista de entrega'; COMMENT ON COLUMN "ordens_servico"."data_entrega_realizada" IS 'Data e hora da entrega'; COMMENT ON COLUMN "ordens_servico"."canal_origem" IS 'Canal de origem do atendimento'; COMMENT ON COLUMN "ordens_servico"."prioridade" IS 'Prioridade do atendimento'; COMMENT ON COLUMN "ordens_servico"."tipo_atendimento" IS 'Tipo de atendimento'; COMMENT ON COLUMN "ordens_servico"."convenio_id" IS 'ID do convênio'; COMMENT ON COLUMN "ordens_servico"."numero_guia" IS 'Número da guia do convênio'; COMMENT ON COLUMN "ordens_servico"."senha_autorizacao" IS 'Senha de autorização do convênio'; COMMENT ON COLUMN "ordens_servico"."validade_guia" IS 'Validade da guia'; COMMENT ON COLUMN "ordens_servico"."medico_solicitante" IS 'Nome do médico solicitante'; COMMENT ON COLUMN "ordens_servico"."crm_solicitante" IS 'CRM do médico solicitante'; COMMENT ON COLUMN "ordens_servico"."clinica_origem" IS 'Clínica/Hospital de origem'; COMMENT ON COLUMN "ordens_servico"."valor_total" IS 'Valor total dos exames'; COMMENT ON COLUMN "ordens_servico"."valor_desconto" IS 'Valor do desconto'; COMMENT ON COLUMN "ordens_servico"."valor_final" IS 'Valor final após desconto'; COMMENT ON COLUMN "ordens_servico"."valor_pago" IS 'Valor pago'; COMMENT ON COLUMN "ordens_servico"."status" IS 'Status atual da ordem de serviço'; COMMENT ON COLUMN "ordens_servico"."status_pagamento" IS 'Status do pagamento'; COMMENT ON COLUMN "ordens_servico"."observacoes" IS 'Observações gerais'; COMMENT ON COLUMN "ordens_servico"."notas_internas" IS 'Notas internas (não visível ao paciente)'; COMMENT ON COLUMN "ordens_servico"."orientacoes_paciente" IS 'Orientações ao paciente'; COMMENT ON COLUMN "ordens_servico"."documentos_anexados" IS 'URLs de documentos anexados (pedido médico, etc)'; COMMENT ON COLUMN "ordens_servico"."forma_entrega" IS 'Forma de entrega dos resultados'; COMMENT ON COLUMN "ordens_servico"."dados_entrega" IS 'Email/WhatsApp/Endereço para entrega'; COMMENT ON COLUMN "ordens_servico"."atendente_id" IS 'ID do atendente que criou a OS'; COMMENT ON COLUMN "ordens_servico"."coletor_id" IS 'ID do profissional que realizou a coleta'; COMMENT ON COLUMN "ordens_servico"."historico_status" IS 'Histórico de mudanças de status'; COMMENT ON COLUMN "ordens_servico"."empresa_id" IS 'ID da empresa'; COMMENT ON COLUMN "ordens_servico"."criado_em" IS 'Data de criação do registro'; COMMENT ON COLUMN "ordens_servico"."atualizado_em" IS 'Data da última atualização'; COMMENT ON COLUMN "ordens_servico"."criado_por" IS 'ID do usuário que criou o registro'; COMMENT ON COLUMN "ordens_servico"."atualizado_por" IS 'ID do usuário que atualizou o registro'`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f3888ffa68910189ba40bbfbfb" ON "ordens_servico" ("status") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b1b3d3e5b836732231b23c6ad4" ON "ordens_servico" ("paciente_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_3014f31412e49a7453e454b45e" ON "ordens_servico" ("data_atendimento") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_06cc03c264582adb66f4d80067" ON "ordens_servico" ("protocolo") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_54200b365883ce3b8f7ad48eaa" ON "ordens_servico" ("codigo") `,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."resultados_exames_classificacao_enum" AS ENUM('normal', 'alterado', 'critico')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."resultados_exames_status_enum" AS ENUM('rascunho', 'em_analise', 'aguardando_revisao', 'liberado', 'retificado')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."resultados_exames_origem_enum" AS ENUM('manual', 'interfaceamento', 'apoio', 'telemedicina')`,
    );
    await queryRunner.query(
      `CREATE TABLE "resultados_exames" ("id" SERIAL NOT NULL, "ordem_servico_exame_id" integer NOT NULL, "exame_id" integer NOT NULL, "parametro" character varying(255) NOT NULL, "resultado" character varying(255), "resultado_numerico" numeric(15,5), "resultado_texto" text, "unidade" character varying(50), "valor_referencia" character varying(255), "valor_minimo" numeric(15,5), "valor_maximo" numeric(15,5), "classificacao" "public"."resultados_exames_classificacao_enum" NOT NULL DEFAULT 'normal', "flag" character varying(10), "fora_referencia" boolean NOT NULL DEFAULT false, "valor_critico" boolean NOT NULL DEFAULT false, "metodo" character varying(255), "observacoes" text, "interpretacao" text, "comentarios" text, "laudo" text, "arquivos_anexados" jsonb, "versao" integer NOT NULL DEFAULT '1', "historico_versoes" jsonb, "data_revisao" TIMESTAMP, "revisado_por" integer, "data_liberacao" TIMESTAMP, "liberado_por" integer, "assinatura_digital" character varying(255), "status" "public"."resultados_exames_status_enum" NOT NULL DEFAULT 'rascunho', "origem" "public"."resultados_exames_origem_enum" NOT NULL DEFAULT 'manual', "sistema_origem" character varying(100), "qc_aprovado" boolean NOT NULL DEFAULT false, "data_qc" TIMESTAMP, "qc_responsavel_id" integer, "ordem_exibicao" integer NOT NULL DEFAULT '0', "criado_em" TIMESTAMP NOT NULL DEFAULT now(), "atualizado_em" TIMESTAMP NOT NULL DEFAULT now(), "criado_por" integer, "atualizado_por" integer, CONSTRAINT "PK_87d4021cadf653a1856984b7486" PRIMARY KEY ("id")); COMMENT ON COLUMN "resultados_exames"."ordem_servico_exame_id" IS 'ID do exame na ordem de serviço'; COMMENT ON COLUMN "resultados_exames"."exame_id" IS 'ID do exame'; COMMENT ON COLUMN "resultados_exames"."parametro" IS 'Nome do parâmetro analisado'; COMMENT ON COLUMN "resultados_exames"."resultado" IS 'Resultado do parâmetro'; COMMENT ON COLUMN "resultados_exames"."resultado_numerico" IS 'Resultado numérico (quando aplicável)'; COMMENT ON COLUMN "resultados_exames"."resultado_texto" IS 'Resultado textual/descritivo'; COMMENT ON COLUMN "resultados_exames"."unidade" IS 'Unidade de medida'; COMMENT ON COLUMN "resultados_exames"."valor_referencia" IS 'Valor de referência'; COMMENT ON COLUMN "resultados_exames"."valor_minimo" IS 'Valor mínimo de referência'; COMMENT ON COLUMN "resultados_exames"."valor_maximo" IS 'Valor máximo de referência'; COMMENT ON COLUMN "resultados_exames"."classificacao" IS 'Classificação do resultado'; COMMENT ON COLUMN "resultados_exames"."flag" IS 'Flag do resultado (H, L, HH, LL, etc)'; COMMENT ON COLUMN "resultados_exames"."fora_referencia" IS 'Se o valor está fora da referência'; COMMENT ON COLUMN "resultados_exames"."valor_critico" IS 'Se é um valor crítico/pânico'; COMMENT ON COLUMN "resultados_exames"."metodo" IS 'Método utilizado na análise'; COMMENT ON COLUMN "resultados_exames"."observacoes" IS 'Observações do resultado'; COMMENT ON COLUMN "resultados_exames"."interpretacao" IS 'Interpretação do resultado'; COMMENT ON COLUMN "resultados_exames"."comentarios" IS 'Comentários adicionais'; COMMENT ON COLUMN "resultados_exames"."laudo" IS 'Laudo completo (para exames de imagem)'; COMMENT ON COLUMN "resultados_exames"."arquivos_anexados" IS 'URLs de arquivos anexados (imagens, PDFs)'; COMMENT ON COLUMN "resultados_exames"."versao" IS 'Versão do resultado (para rastrear alterações)'; COMMENT ON COLUMN "resultados_exames"."historico_versoes" IS 'Histórico de versões anteriores'; COMMENT ON COLUMN "resultados_exames"."data_revisao" IS 'Data da última revisão'; COMMENT ON COLUMN "resultados_exames"."revisado_por" IS 'ID do usuário que revisou'; COMMENT ON COLUMN "resultados_exames"."data_liberacao" IS 'Data e hora da liberação'; COMMENT ON COLUMN "resultados_exames"."liberado_por" IS 'ID do responsável técnico que liberou'; COMMENT ON COLUMN "resultados_exames"."assinatura_digital" IS 'Assinatura digital do responsável'; COMMENT ON COLUMN "resultados_exames"."status" IS 'Status do resultado'; COMMENT ON COLUMN "resultados_exames"."origem" IS 'Origem do resultado'; COMMENT ON COLUMN "resultados_exames"."sistema_origem" IS 'Sistema/equipamento de origem'; COMMENT ON COLUMN "resultados_exames"."qc_aprovado" IS 'Se passou pelo controle de qualidade'; COMMENT ON COLUMN "resultados_exames"."data_qc" IS 'Data do controle de qualidade'; COMMENT ON COLUMN "resultados_exames"."qc_responsavel_id" IS 'ID do responsável pelo QC'; COMMENT ON COLUMN "resultados_exames"."ordem_exibicao" IS 'Ordem de exibição no laudo'; COMMENT ON COLUMN "resultados_exames"."criado_em" IS 'Data de criação do registro'; COMMENT ON COLUMN "resultados_exames"."atualizado_em" IS 'Data da última atualização'; COMMENT ON COLUMN "resultados_exames"."criado_por" IS 'ID do usuário que criou o registro'; COMMENT ON COLUMN "resultados_exames"."atualizado_por" IS 'ID do usuário que atualizou o registro'`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_3a122ca2df29dae27f9aa2b26d" ON "resultados_exames" ("parametro") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0ac9b116f95df47e908a121465" ON "resultados_exames" ("ordem_servico_exame_id") `,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."laboratorios_apoio_forma_envio_enum" AS ENUM('api', 'portal', 'email', 'manual')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."laboratorios_apoio_periodicidade_faturamento_enum" AS ENUM('mensal', 'quinzenal', 'semanal')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."laboratorios_apoio_status_enum" AS ENUM('ativo', 'inativo', 'suspenso')`,
    );
    await queryRunner.query(
      `CREATE TABLE "laboratorios_apoio" ("id" SERIAL NOT NULL, "codigo" character varying(20) NOT NULL, "nome" character varying(255) NOT NULL, "razao_social" character varying(255) NOT NULL, "cnpj" character varying(14), "tem_integracao_api" boolean NOT NULL DEFAULT false, "url_api" character varying(255), "usuario_api" character varying(255), "senha_api" character varying(255), "forma_envio" "public"."laboratorios_apoio_forma_envio_enum" NOT NULL DEFAULT 'manual', "url_portal" character varying(255), "email_envio" character varying(255), "horario_coleta" TIME, "dias_coleta" jsonb, "responsavel_coleta" character varying(255), "prazo_padrao_dias" integer, "aceita_urgencia" boolean NOT NULL DEFAULT false, "prazo_urgencia_horas" integer, "percentual_desconto" numeric(5,2) NOT NULL DEFAULT '0', "periodicidade_faturamento" "public"."laboratorios_apoio_periodicidade_faturamento_enum" NOT NULL DEFAULT 'mensal', "prazo_pagamento_dias" integer, "telefone" character varying(20), "whatsapp" character varying(20), "email" character varying(255), "contato_nome" character varying(255), "mapeamento_exames" jsonb, "configuracoes" jsonb, "observacoes" text, "status" "public"."laboratorios_apoio_status_enum" NOT NULL DEFAULT 'ativo', "criado_em" TIMESTAMP NOT NULL DEFAULT now(), "atualizado_em" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_f224b2cb32d58f019a6d9ffce4a" UNIQUE ("codigo"), CONSTRAINT "PK_acdc51c4e3bffdb68c319f76a0f" PRIMARY KEY ("id")); COMMENT ON COLUMN "laboratorios_apoio"."codigo" IS 'Código do laboratório'; COMMENT ON COLUMN "laboratorios_apoio"."nome" IS 'Nome do laboratório (DB, Hermes Pardini, etc)'; COMMENT ON COLUMN "laboratorios_apoio"."razao_social" IS 'Razão social'; COMMENT ON COLUMN "laboratorios_apoio"."cnpj" IS 'CNPJ'; COMMENT ON COLUMN "laboratorios_apoio"."tem_integracao_api" IS 'Se tem integração via API'; COMMENT ON COLUMN "laboratorios_apoio"."url_api" IS 'URL da API'; COMMENT ON COLUMN "laboratorios_apoio"."usuario_api" IS 'Usuário/login da API'; COMMENT ON COLUMN "laboratorios_apoio"."senha_api" IS 'Senha/token da API'; COMMENT ON COLUMN "laboratorios_apoio"."forma_envio" IS 'Forma de envio de amostras'; COMMENT ON COLUMN "laboratorios_apoio"."url_portal" IS 'Portal web do laboratório'; COMMENT ON COLUMN "laboratorios_apoio"."email_envio" IS 'E-mail para envio'; COMMENT ON COLUMN "laboratorios_apoio"."horario_coleta" IS 'Horário de coleta das amostras'; COMMENT ON COLUMN "laboratorios_apoio"."dias_coleta" IS 'Dias da semana de coleta'; COMMENT ON COLUMN "laboratorios_apoio"."responsavel_coleta" IS 'Responsável pela coleta/transporte'; COMMENT ON COLUMN "laboratorios_apoio"."prazo_padrao_dias" IS 'Prazo padrão em dias úteis'; COMMENT ON COLUMN "laboratorios_apoio"."aceita_urgencia" IS 'Se aceita urgências'; COMMENT ON COLUMN "laboratorios_apoio"."prazo_urgencia_horas" IS 'Prazo de urgência em horas'; COMMENT ON COLUMN "laboratorios_apoio"."percentual_desconto" IS 'Percentual de desconto'; COMMENT ON COLUMN "laboratorios_apoio"."periodicidade_faturamento" IS 'Periodicidade de faturamento'; COMMENT ON COLUMN "laboratorios_apoio"."prazo_pagamento_dias" IS 'Prazo de pagamento em dias'; COMMENT ON COLUMN "laboratorios_apoio"."telefone" IS 'Telefone comercial'; COMMENT ON COLUMN "laboratorios_apoio"."whatsapp" IS 'WhatsApp'; COMMENT ON COLUMN "laboratorios_apoio"."email" IS 'E-mail de contato'; COMMENT ON COLUMN "laboratorios_apoio"."contato_nome" IS 'Pessoa de contato'; COMMENT ON COLUMN "laboratorios_apoio"."mapeamento_exames" IS 'Mapeamento de códigos de exames'; COMMENT ON COLUMN "laboratorios_apoio"."configuracoes" IS 'Configurações adicionais'; COMMENT ON COLUMN "laboratorios_apoio"."observacoes" IS 'Observações'; COMMENT ON COLUMN "laboratorios_apoio"."status" IS 'Status'; COMMENT ON COLUMN "laboratorios_apoio"."criado_em" IS 'Data de criação'; COMMENT ON COLUMN "laboratorios_apoio"."atualizado_em" IS 'Data de atualização'`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1e7f843a43b3625a08d41d7d4c" ON "laboratorios_apoio" ("nome") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f224b2cb32d58f019a6d9ffce4" ON "laboratorios_apoio" ("codigo") `,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."ordens_servico_exames_status_enum" AS ENUM('pendente', 'aguardando_coleta', 'coletado', 'enviado_apoio', 'em_analise', 'liberado', 'repetir', 'cancelado')`,
    );
    await queryRunner.query(
      `CREATE TABLE "ordens_servico_exames" ("id" SERIAL NOT NULL, "ordem_servico_id" integer NOT NULL, "exame_id" integer NOT NULL, "quantidade" integer NOT NULL DEFAULT '1', "codigo_amostra" character varying(50), "codigo_barras" character varying(50), "status" "public"."ordens_servico_exames_status_enum" NOT NULL DEFAULT 'pendente', "valor_unitario" numeric(10,2) NOT NULL DEFAULT '0', "valor_total" numeric(10,2) NOT NULL DEFAULT '0', "valor_desconto" numeric(10,2) NOT NULL DEFAULT '0', "data_coleta" TIMESTAMP, "coletor_id" integer, "local_coleta" character varying(100), "observacoes_coleta" text, "material_coletado" character varying(100), "volume_coletado" numeric(10,2), "data_envio_apoio" TIMESTAMP, "laboratorio_apoio_id" integer, "codigo_apoio" character varying(50), "lote_envio" character varying(50), "data_inicio_analise" TIMESTAMP, "data_liberacao" TIMESTAMP, "analista_id" integer, "liberado_por" integer, "is_repeticao" boolean NOT NULL DEFAULT false, "exame_original_id" integer, "motivo_repeticao" text, "observacoes" text, "notas_tecnicas" text, "equipamentos_utilizados" jsonb, "reagentes_utilizados" jsonb, "controle_qualidade_ok" boolean NOT NULL DEFAULT false, "data_controle_qualidade" TIMESTAMP, "responsavel_controle_id" integer, "is_urgente" boolean NOT NULL DEFAULT false, "prazo_maximo" TIMESTAMP, "criado_em" TIMESTAMP NOT NULL DEFAULT now(), "atualizado_em" TIMESTAMP NOT NULL DEFAULT now(), "criado_por" integer, "atualizado_por" integer, CONSTRAINT "PK_814fe138c735e8fe4a75ac1f598" PRIMARY KEY ("id")); COMMENT ON COLUMN "ordens_servico_exames"."ordem_servico_id" IS 'ID da ordem de serviço'; COMMENT ON COLUMN "ordens_servico_exames"."exame_id" IS 'ID do exame'; COMMENT ON COLUMN "ordens_servico_exames"."quantidade" IS 'Quantidade do exame'; COMMENT ON COLUMN "ordens_servico_exames"."codigo_amostra" IS 'Código único da amostra/tubo'; COMMENT ON COLUMN "ordens_servico_exames"."codigo_barras" IS 'Código de barras da amostra'; COMMENT ON COLUMN "ordens_servico_exames"."status" IS 'Status do exame'; COMMENT ON COLUMN "ordens_servico_exames"."valor_unitario" IS 'Valor unitário do exame'; COMMENT ON COLUMN "ordens_servico_exames"."valor_total" IS 'Valor total (quantidade x unitário)'; COMMENT ON COLUMN "ordens_servico_exames"."valor_desconto" IS 'Valor de desconto aplicado'; COMMENT ON COLUMN "ordens_servico_exames"."data_coleta" IS 'Data e hora da coleta'; COMMENT ON COLUMN "ordens_servico_exames"."coletor_id" IS 'ID do profissional que coletou'; COMMENT ON COLUMN "ordens_servico_exames"."local_coleta" IS 'Local da coleta (sala, domicílio, etc)'; COMMENT ON COLUMN "ordens_servico_exames"."observacoes_coleta" IS 'Observações da coleta'; COMMENT ON COLUMN "ordens_servico_exames"."material_coletado" IS 'Tipo de material coletado'; COMMENT ON COLUMN "ordens_servico_exames"."volume_coletado" IS 'Volume coletado (ml)'; COMMENT ON COLUMN "ordens_servico_exames"."data_envio_apoio" IS 'Data e hora do envio para laboratório de apoio'; COMMENT ON COLUMN "ordens_servico_exames"."laboratorio_apoio_id" IS 'ID do laboratório de apoio destinatário'; COMMENT ON COLUMN "ordens_servico_exames"."codigo_apoio" IS 'Código do exame no laboratório de apoio'; COMMENT ON COLUMN "ordens_servico_exames"."lote_envio" IS 'Número do lote de envio'; COMMENT ON COLUMN "ordens_servico_exames"."data_inicio_analise" IS 'Data e hora do início da análise'; COMMENT ON COLUMN "ordens_servico_exames"."data_liberacao" IS 'Data e hora da liberação do resultado'; COMMENT ON COLUMN "ordens_servico_exames"."analista_id" IS 'ID do analista/biomédico'; COMMENT ON COLUMN "ordens_servico_exames"."liberado_por" IS 'ID do responsável técnico que liberou'; COMMENT ON COLUMN "ordens_servico_exames"."is_repeticao" IS 'Se é uma repetição de exame'; COMMENT ON COLUMN "ordens_servico_exames"."exame_original_id" IS 'ID do exame original (se for repetição)'; COMMENT ON COLUMN "ordens_servico_exames"."motivo_repeticao" IS 'Motivo da repetição'; COMMENT ON COLUMN "ordens_servico_exames"."observacoes" IS 'Observações gerais do exame'; COMMENT ON COLUMN "ordens_servico_exames"."notas_tecnicas" IS 'Notas técnicas (visível apenas internamente)'; COMMENT ON COLUMN "ordens_servico_exames"."equipamentos_utilizados" IS 'Equipamentos utilizados'; COMMENT ON COLUMN "ordens_servico_exames"."reagentes_utilizados" IS 'Reagentes e lotes utilizados'; COMMENT ON COLUMN "ordens_servico_exames"."controle_qualidade_ok" IS 'Se passou pelo controle de qualidade'; COMMENT ON COLUMN "ordens_servico_exames"."data_controle_qualidade" IS 'Data da verificação do controle de qualidade'; COMMENT ON COLUMN "ordens_servico_exames"."responsavel_controle_id" IS 'ID do responsável pelo controle de qualidade'; COMMENT ON COLUMN "ordens_servico_exames"."is_urgente" IS 'Se é exame urgente'; COMMENT ON COLUMN "ordens_servico_exames"."prazo_maximo" IS 'Prazo máximo para liberação (se urgente)'; COMMENT ON COLUMN "ordens_servico_exames"."criado_em" IS 'Data de criação do registro'; COMMENT ON COLUMN "ordens_servico_exames"."atualizado_em" IS 'Data da última atualização'; COMMENT ON COLUMN "ordens_servico_exames"."criado_por" IS 'ID do usuário que criou o registro'; COMMENT ON COLUMN "ordens_servico_exames"."atualizado_por" IS 'ID do usuário que atualizou o registro'`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_6a014e2af58dd69a686cff61b9" ON "ordens_servico_exames" ("codigo_amostra") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_19edf7189fc994d88f4f9535b0" ON "ordens_servico_exames" ("status") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_a10bb8b6b95914f057d3efa029" ON "ordens_servico_exames" ("ordem_servico_id", "exame_id") `,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."subgrupos_exame_categoria_enum" AS ENUM('laboratorio', 'imagem', 'procedimento', 'consulta')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."subgrupos_exame_status_enum" AS ENUM('ativo', 'inativo')`,
    );
    await queryRunner.query(
      `CREATE TABLE "subgrupos_exame" ("id" SERIAL NOT NULL, "codigo" character varying(20) NOT NULL, "nome" character varying(100) NOT NULL, "descricao" text, "categoria" "public"."subgrupos_exame_categoria_enum" NOT NULL, "ordem" integer NOT NULL DEFAULT '0', "status" "public"."subgrupos_exame_status_enum" NOT NULL DEFAULT 'ativo', "criado_em" TIMESTAMP NOT NULL DEFAULT now(), "atualizado_em" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_e3a763c062801a2237584ac82ae" UNIQUE ("codigo"), CONSTRAINT "PK_079c14f1ac50db63d5796d3857c" PRIMARY KEY ("id")); COMMENT ON COLUMN "subgrupos_exame"."codigo" IS 'Código do subgrupo'; COMMENT ON COLUMN "subgrupos_exame"."nome" IS 'Nome do subgrupo (ex: Hematologia, Bioquímica, Radiologia)'; COMMENT ON COLUMN "subgrupos_exame"."descricao" IS 'Descrição do subgrupo'; COMMENT ON COLUMN "subgrupos_exame"."categoria" IS 'Categoria a qual pertence'; COMMENT ON COLUMN "subgrupos_exame"."ordem" IS 'Ordem de exibição'; COMMENT ON COLUMN "subgrupos_exame"."status" IS 'Status do subgrupo'; COMMENT ON COLUMN "subgrupos_exame"."criado_em" IS 'Data de criação'; COMMENT ON COLUMN "subgrupos_exame"."atualizado_em" IS 'Data de atualização'`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_be965a905b45b4c057b6ee222a" ON "subgrupos_exame" ("nome") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e3a763c062801a2237584ac82a" ON "subgrupos_exame" ("codigo") `,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."setores_exame_status_enum" AS ENUM('ativo', 'inativo')`,
    );
    await queryRunner.query(
      `CREATE TABLE "setores_exame" ("id" SERIAL NOT NULL, "codigo" character varying(20) NOT NULL, "nome" character varying(100) NOT NULL, "descricao" text, "localizacao" character varying(100), "ramal" character varying(20), "responsavel_id" integer, "ordem" integer NOT NULL DEFAULT '0', "status" "public"."setores_exame_status_enum" NOT NULL DEFAULT 'ativo', "criado_em" TIMESTAMP NOT NULL DEFAULT now(), "atualizado_em" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_dc71b5a9368c763c4c1b7eb05a3" UNIQUE ("codigo"), CONSTRAINT "PK_b241a9933e5fc5f7fcddfa92202" PRIMARY KEY ("id")); COMMENT ON COLUMN "setores_exame"."codigo" IS 'Código do setor'; COMMENT ON COLUMN "setores_exame"."nome" IS 'Nome do setor (ex: Laboratório, Radiologia, Ultrassom)'; COMMENT ON COLUMN "setores_exame"."descricao" IS 'Descrição do setor'; COMMENT ON COLUMN "setores_exame"."localizacao" IS 'Localização física do setor'; COMMENT ON COLUMN "setores_exame"."ramal" IS 'Ramal/telefone do setor'; COMMENT ON COLUMN "setores_exame"."responsavel_id" IS 'ID do responsável pelo setor'; COMMENT ON COLUMN "setores_exame"."ordem" IS 'Ordem de exibição'; COMMENT ON COLUMN "setores_exame"."status" IS 'Status do setor'; COMMENT ON COLUMN "setores_exame"."criado_em" IS 'Data de criação'; COMMENT ON COLUMN "setores_exame"."atualizado_em" IS 'Data de atualização'`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9992f937fa556caf2047c9bd2d" ON "setores_exame" ("nome") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_dc71b5a9368c763c4c1b7eb05a" ON "setores_exame" ("codigo") `,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."exames_categoria_enum" AS ENUM('laboratorio', 'imagem', 'procedimento', 'consulta')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."exames_especialidade_requerida_enum" AS ENUM('nao', 'sim')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."exames_necessita_preparo_enum" AS ENUM('nao', 'sim')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."exames_tipo_realizacao_enum" AS ENUM('interno', 'apoio', 'telemedicina')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."exames_envio_automatico_enum" AS ENUM('nao', 'sim')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."exames_tem_valores_referencia_enum" AS ENUM('nao', 'sim')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."exames_status_enum" AS ENUM('ativo', 'inativo', 'suspenso')`,
    );
    await queryRunner.query(
      `CREATE TABLE "exames" ("id" SERIAL NOT NULL, "codigo_interno" character varying(50) NOT NULL, "nome" character varying(255) NOT NULL, "sinonimos" character varying(50), "codigo_tuss" character varying(20), "codigo_amb" character varying(20), "codigo_loinc" character varying(20), "codigo_sus" character varying(20), "tipo_exame_id" integer NOT NULL, "categoria" "public"."exames_categoria_enum" NOT NULL, "subgrupo_id" integer, "setor_id" integer, "metodologia" character varying(255), "especialidade_requerida" "public"."exames_especialidade_requerida_enum" NOT NULL DEFAULT 'nao', "especialidade" character varying(255), "grupo" character varying(100), "peso" integer, "altura_min" numeric(10,2), "altura_max" numeric(10,2), "volume_min" numeric(10,2), "volume_ideal" numeric(10,2), "unidade_medida" character varying(50), "amostra_biologica" character varying(100), "tipo_recipiente" character varying(100), "necessita_preparo" "public"."exames_necessita_preparo_enum" NOT NULL DEFAULT 'nao', "requisitos" text, "tipo_realizacao" "public"."exames_tipo_realizacao_enum" NOT NULL DEFAULT 'interno', "laboratorio_apoio_id" integer, "destino_exame" character varying(100), "envio_automatico" "public"."exames_envio_automatico_enum" NOT NULL DEFAULT 'nao', "prazo_entrega_dias" integer, "formato_prazo" character varying(50), "tem_valores_referencia" "public"."exames_tem_valores_referencia_enum" NOT NULL DEFAULT 'nao', "valores_referencia" jsonb, "tecnica_coleta" text, "distribuicao" text, "processamento_entrega" text, "requisitos_anvisa" jsonb, "formularios_atendimento" jsonb, "preparo_coleta" jsonb, "lembretes" jsonb, "status" "public"."exames_status_enum" NOT NULL DEFAULT 'ativo', "empresa_id" integer, "criado_em" TIMESTAMP NOT NULL DEFAULT now(), "atualizado_em" TIMESTAMP NOT NULL DEFAULT now(), "criado_por" integer, "atualizado_por" integer, CONSTRAINT "UQ_8d42006560615a3aeb26fc0dc7a" UNIQUE ("codigo_interno"), CONSTRAINT "PK_a52615f52a6d51d4e23aa0a0b5d" PRIMARY KEY ("id")); COMMENT ON COLUMN "exames"."codigo_interno" IS 'Código interno do exame'; COMMENT ON COLUMN "exames"."nome" IS 'Nome completo do exame'; COMMENT ON COLUMN "exames"."sinonimos" IS 'Sinônimos ou nomes alternativos'; COMMENT ON COLUMN "exames"."codigo_tuss" IS 'Código TUSS (Terminologia Unificada da Saúde Suplementar)'; COMMENT ON COLUMN "exames"."codigo_amb" IS 'Código AMB (Associação Médica Brasileira)'; COMMENT ON COLUMN "exames"."codigo_loinc" IS 'Código LOINC (Logical Observation Identifiers Names and Codes)'; COMMENT ON COLUMN "exames"."codigo_sus" IS 'Código SUS'; COMMENT ON COLUMN "exames"."tipo_exame_id" IS 'ID do tipo de exame'; COMMENT ON COLUMN "exames"."categoria" IS 'Categoria geral do exame'; COMMENT ON COLUMN "exames"."subgrupo_id" IS 'ID do subgrupo'; COMMENT ON COLUMN "exames"."setor_id" IS 'ID do setor responsável'; COMMENT ON COLUMN "exames"."metodologia" IS 'Metodologia utilizada no exame'; COMMENT ON COLUMN "exames"."especialidade_requerida" IS 'Se precisa de especialidade médica específica'; COMMENT ON COLUMN "exames"."especialidade" IS 'Especialidade médica requerida'; COMMENT ON COLUMN "exames"."grupo" IS 'Grupo de exames relacionados'; COMMENT ON COLUMN "exames"."peso" IS 'Peso/prioridade para ordenação'; COMMENT ON COLUMN "exames"."altura_min" IS 'Altura mínima em cm (para alguns exames de imagem)'; COMMENT ON COLUMN "exames"."altura_max" IS 'Altura máxima em cm'; COMMENT ON COLUMN "exames"."volume_min" IS 'Volume mínimo necessário (em ml para exames laboratoriais)'; COMMENT ON COLUMN "exames"."volume_ideal" IS 'Volume ideal (em ml)'; COMMENT ON COLUMN "exames"."unidade_medida" IS 'Unidade de medida do resultado'; COMMENT ON COLUMN "exames"."amostra_biologica" IS 'Tipo de amostra biológica necessária'; COMMENT ON COLUMN "exames"."tipo_recipiente" IS 'Tipo de recipiente para coleta'; COMMENT ON COLUMN "exames"."necessita_preparo" IS 'Se necessita preparo especial'; COMMENT ON COLUMN "exames"."requisitos" IS 'Requisitos para realização do exame'; COMMENT ON COLUMN "exames"."tipo_realizacao" IS 'Onde o exame é realizado'; COMMENT ON COLUMN "exames"."laboratorio_apoio_id" IS 'ID do laboratório de apoio'; COMMENT ON COLUMN "exames"."destino_exame" IS 'Destino do exame no sistema externo'; COMMENT ON COLUMN "exames"."envio_automatico" IS 'Se envia automaticamente para laboratório de apoio'; COMMENT ON COLUMN "exames"."prazo_entrega_dias" IS 'Prazo de entrega em dias úteis'; COMMENT ON COLUMN "exames"."formato_prazo" IS 'Formato do prazo (ex: 5 dias úteis, 24 horas)'; COMMENT ON COLUMN "exames"."tem_valores_referencia" IS 'Se tem referência de valores normais'; COMMENT ON COLUMN "exames"."valores_referencia" IS 'Valores de referência por idade/sexo'; COMMENT ON COLUMN "exames"."tecnica_coleta" IS 'Técnica de coleta específica'; COMMENT ON COLUMN "exames"."distribuicao" IS 'Distribuição/processamento da amostra'; COMMENT ON COLUMN "exames"."processamento_entrega" IS 'Processamento e entrega de laudos'; COMMENT ON COLUMN "exames"."requisitos_anvisa" IS 'Requisitos da ANVISA/Normas técnicas'; COMMENT ON COLUMN "exames"."formularios_atendimento" IS 'Formulários necessários para o atendimento'; COMMENT ON COLUMN "exames"."preparo_coleta" IS 'Instruções de preparo por público (geral, feminino, infantil)'; COMMENT ON COLUMN "exames"."lembretes" IS 'Lembretes para coletores, recepcionistas e ordem de serviço'; COMMENT ON COLUMN "exames"."status" IS 'Status do exame no sistema'; COMMENT ON COLUMN "exames"."empresa_id" IS 'ID da empresa (null = disponível para todas)'; COMMENT ON COLUMN "exames"."criado_em" IS 'Data de criação do registro'; COMMENT ON COLUMN "exames"."atualizado_em" IS 'Data da última atualização'; COMMENT ON COLUMN "exames"."criado_por" IS 'ID do usuário que criou o registro'; COMMENT ON COLUMN "exames"."atualizado_por" IS 'ID do usuário que atualizou o registro'`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_132c8c171d9cb389fd31df8856" ON "exames" ("nome") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7af09e78857812e41e2c098481" ON "exames" ("codigo_loinc") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0f3b86e8a3eb7986a62e1d706d" ON "exames" ("codigo_tuss") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_8d42006560615a3aeb26fc0dc7" ON "exames" ("codigo_interno") `,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."tipos_exame_status_enum" AS ENUM('ativo', 'inativo')`,
    );
    await queryRunner.query(
      `CREATE TABLE "tipos_exame" ("id" SERIAL NOT NULL, "codigo" character varying(20) NOT NULL, "nome" character varying(100) NOT NULL, "descricao" text, "icone" character varying(50), "cor" character varying(7), "ordem" integer NOT NULL DEFAULT '0', "status" "public"."tipos_exame_status_enum" NOT NULL DEFAULT 'ativo', "requer_agendamento" boolean NOT NULL DEFAULT false, "requer_autorizacao" boolean NOT NULL DEFAULT false, "permite_domiciliar" boolean NOT NULL DEFAULT false, "configuracoes" jsonb, "criado_em" TIMESTAMP NOT NULL DEFAULT now(), "atualizado_em" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_f7a51257aefa68a64d741fb3f04" UNIQUE ("codigo"), CONSTRAINT "PK_f40fd3415dacfcad6ca844a137b" PRIMARY KEY ("id")); COMMENT ON COLUMN "tipos_exame"."codigo" IS 'Código do tipo de exame'; COMMENT ON COLUMN "tipos_exame"."nome" IS 'Nome do tipo de exame'; COMMENT ON COLUMN "tipos_exame"."descricao" IS 'Descrição detalhada do tipo'; COMMENT ON COLUMN "tipos_exame"."icone" IS 'Ícone ou identificador visual'; COMMENT ON COLUMN "tipos_exame"."cor" IS 'Cor hexadecimal para interface'; COMMENT ON COLUMN "tipos_exame"."ordem" IS 'Ordem de exibição'; COMMENT ON COLUMN "tipos_exame"."status" IS 'Status do tipo de exame'; COMMENT ON COLUMN "tipos_exame"."requer_agendamento" IS 'Se requer agendamento prévio'; COMMENT ON COLUMN "tipos_exame"."requer_autorizacao" IS 'Se requer autorização de convênio'; COMMENT ON COLUMN "tipos_exame"."permite_domiciliar" IS 'Se permite coleta domiciliar'; COMMENT ON COLUMN "tipos_exame"."configuracoes" IS 'Configurações adicionais do tipo'; COMMENT ON COLUMN "tipos_exame"."criado_em" IS 'Data de criação do registro'; COMMENT ON COLUMN "tipos_exame"."atualizado_em" IS 'Data da última atualização'`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_fc6bae06debf7a16bcb7486a6e" ON "tipos_exame" ("nome") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f7a51257aefa68a64d741fb3f0" ON "tipos_exame" ("codigo") `,
    );
    await queryRunner.query(
      `ALTER TABLE "ordens_servico" ADD CONSTRAINT "FK_b1b3d3e5b836732231b23c6ad46" FOREIGN KEY ("paciente_id") REFERENCES "pacientes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ordens_servico" ADD CONSTRAINT "FK_646eaa8e7882192446f99de732c" FOREIGN KEY ("unidade_saude_id") REFERENCES "unidades_saude"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
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
      `ALTER TABLE "ordens_servico" DROP CONSTRAINT "FK_646eaa8e7882192446f99de732c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ordens_servico" DROP CONSTRAINT "FK_b1b3d3e5b836732231b23c6ad46"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_f7a51257aefa68a64d741fb3f0"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_fc6bae06debf7a16bcb7486a6e"`,
    );
    await queryRunner.query(`DROP TABLE "tipos_exame"`);
    await queryRunner.query(`DROP TYPE "public"."tipos_exame_status_enum"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_8d42006560615a3aeb26fc0dc7"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_0f3b86e8a3eb7986a62e1d706d"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_7af09e78857812e41e2c098481"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_132c8c171d9cb389fd31df8856"`,
    );
    await queryRunner.query(`DROP TABLE "exames"`);
    await queryRunner.query(`DROP TYPE "public"."exames_status_enum"`);
    await queryRunner.query(
      `DROP TYPE "public"."exames_tem_valores_referencia_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."exames_envio_automatico_enum"`,
    );
    await queryRunner.query(`DROP TYPE "public"."exames_tipo_realizacao_enum"`);
    await queryRunner.query(
      `DROP TYPE "public"."exames_necessita_preparo_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."exames_especialidade_requerida_enum"`,
    );
    await queryRunner.query(`DROP TYPE "public"."exames_categoria_enum"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_dc71b5a9368c763c4c1b7eb05a"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_9992f937fa556caf2047c9bd2d"`,
    );
    await queryRunner.query(`DROP TABLE "setores_exame"`);
    await queryRunner.query(`DROP TYPE "public"."setores_exame_status_enum"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_e3a763c062801a2237584ac82a"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_be965a905b45b4c057b6ee222a"`,
    );
    await queryRunner.query(`DROP TABLE "subgrupos_exame"`);
    await queryRunner.query(`DROP TYPE "public"."subgrupos_exame_status_enum"`);
    await queryRunner.query(
      `DROP TYPE "public"."subgrupos_exame_categoria_enum"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_a10bb8b6b95914f057d3efa029"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_19edf7189fc994d88f4f9535b0"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_6a014e2af58dd69a686cff61b9"`,
    );
    await queryRunner.query(`DROP TABLE "ordens_servico_exames"`);
    await queryRunner.query(
      `DROP TYPE "public"."ordens_servico_exames_status_enum"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_f224b2cb32d58f019a6d9ffce4"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_1e7f843a43b3625a08d41d7d4c"`,
    );
    await queryRunner.query(`DROP TABLE "laboratorios_apoio"`);
    await queryRunner.query(
      `DROP TYPE "public"."laboratorios_apoio_status_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."laboratorios_apoio_periodicidade_faturamento_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."laboratorios_apoio_forma_envio_enum"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_0ac9b116f95df47e908a121465"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_3a122ca2df29dae27f9aa2b26d"`,
    );
    await queryRunner.query(`DROP TABLE "resultados_exames"`);
    await queryRunner.query(
      `DROP TYPE "public"."resultados_exames_origem_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."resultados_exames_status_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."resultados_exames_classificacao_enum"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_54200b365883ce3b8f7ad48eaa"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_06cc03c264582adb66f4d80067"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_3014f31412e49a7453e454b45e"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_b1b3d3e5b836732231b23c6ad4"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_f3888ffa68910189ba40bbfbfb"`,
    );
    await queryRunner.query(`DROP TABLE "ordens_servico"`);
    await queryRunner.query(
      `DROP TYPE "public"."ordens_servico_forma_entrega_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."ordens_servico_status_pagamento_enum"`,
    );
    await queryRunner.query(`DROP TYPE "public"."ordens_servico_status_enum"`);
    await queryRunner.query(
      `DROP TYPE "public"."ordens_servico_tipo_atendimento_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."ordens_servico_prioridade_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."ordens_servico_canal_origem_enum"`,
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
    await queryRunner.query(`DROP TABLE "convenios"`);
    await queryRunner.query(`DROP TYPE "public"."convenios_status_enum"`);
    await queryRunner.query(
      `DROP TYPE "public"."convenios_tipo_faturamento_enum"`,
    );
  }
}
