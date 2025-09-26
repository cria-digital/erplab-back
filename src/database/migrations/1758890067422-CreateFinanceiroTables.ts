import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateFinanceiroTables1758890067422 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Criar enum para status do banco
    await queryRunner.query(
      `CREATE TYPE "public"."bancos_status_enum" AS ENUM('ativo', 'inativo')`,
    );

    // Criar tabela de bancos
    await queryRunner.query(`
            CREATE TABLE "bancos" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "codigo" character varying(10) NOT NULL,
                "codigo_interno" character varying(20) NOT NULL,
                "nome" character varying(255) NOT NULL,
                "website" character varying(255),
                "status" "public"."bancos_status_enum" NOT NULL DEFAULT 'ativo',
                "descricao" text,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_banco_codigo" UNIQUE ("codigo"),
                CONSTRAINT "UQ_banco_codigo_interno" UNIQUE ("codigo_interno"),
                CONSTRAINT "PK_bancos" PRIMARY KEY ("id")
            )
        `);

    // Criar enums para conta bancária
    await queryRunner.query(
      `CREATE TYPE "public"."contas_bancarias_tipo_conta_enum" AS ENUM('corrente', 'poupanca', 'pagamento', 'salario', 'investimento')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."contas_bancarias_status_enum" AS ENUM('ativa', 'inativa', 'bloqueada', 'encerrada')`,
    );

    // Criar tabela de contas bancárias
    await queryRunner.query(`
            CREATE TABLE "contas_bancarias" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "banco_id" uuid NOT NULL,
                "unidade_saude_id" uuid NOT NULL,
                "codigo_interno" character varying(20) NOT NULL,
                "nome_conta" character varying(255) NOT NULL,
                "tipo_conta" "public"."contas_bancarias_tipo_conta_enum" NOT NULL DEFAULT 'corrente',
                "agencia" character varying(10) NOT NULL,
                "digito_agencia" character varying(2),
                "numero_conta" character varying(20) NOT NULL,
                "digito_conta" character varying(2) NOT NULL,
                "titular" character varying(255) NOT NULL,
                "cpf_cnpj_titular" character varying(20) NOT NULL,
                "pix_tipo" character varying(20),
                "pix_chave" character varying(255),
                "status" "public"."contas_bancarias_status_enum" NOT NULL DEFAULT 'ativa',
                "saldo_inicial" numeric(15,2) DEFAULT '0',
                "observacoes" text,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_conta_codigo_interno" UNIQUE ("codigo_interno"),
                CONSTRAINT "PK_contas_bancarias" PRIMARY KEY ("id"),
                CONSTRAINT "FK_conta_banco" FOREIGN KEY ("banco_id") REFERENCES "bancos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
                CONSTRAINT "FK_conta_unidade" FOREIGN KEY ("unidade_saude_id") REFERENCES "unidades_saude"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
            )
        `);

    // Criar enums para gateway de pagamento
    await queryRunner.query(
      `CREATE TYPE "public"."gateways_pagamento_tipo_gateway_enum" AS ENUM('cielo', 'rede', 'getnet', 'stone', 'pagseguro', 'mercadopago', 'pagarme', 'ifood', 'rappi', 'outro')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."gateways_pagamento_modalidade_enum" AS ENUM('credito', 'debito', 'pix', 'boleto', 'todos')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."gateways_pagamento_ambiente_enum" AS ENUM('producao', 'homologacao', 'teste')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."gateways_pagamento_status_enum" AS ENUM('ativo', 'inativo', 'suspenso', 'em_configuracao')`,
    );

    // Criar tabela de gateways de pagamento
    await queryRunner.query(`
            CREATE TABLE "gateways_pagamento" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "conta_bancaria_id" uuid NOT NULL,
                "codigo_interno" character varying(20) NOT NULL,
                "nome_gateway" character varying(255) NOT NULL,
                "tipo_gateway" "public"."gateways_pagamento_tipo_gateway_enum" NOT NULL,
                "modalidade" "public"."gateways_pagamento_modalidade_enum" NOT NULL DEFAULT 'todos',
                "merchant_id" character varying(100),
                "merchant_key" character varying(255),
                "api_key" character varying(255),
                "api_secret" character varying(255),
                "webhook_url" character varying(500),
                "webhook_secret" character varying(255),
                "ambiente" "public"."gateways_pagamento_ambiente_enum" NOT NULL DEFAULT 'teste',
                "taxa_credito" numeric(5,2),
                "taxa_debito" numeric(5,2),
                "taxa_pix" numeric(5,2),
                "taxa_boleto" numeric(5,2),
                "prazo_recebimento" integer DEFAULT '1',
                "status" "public"."gateways_pagamento_status_enum" NOT NULL DEFAULT 'em_configuracao',
                "configuracao_adicional" jsonb,
                "observacoes" text,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_gateway_codigo_interno" UNIQUE ("codigo_interno"),
                CONSTRAINT "PK_gateways_pagamento" PRIMARY KEY ("id"),
                CONSTRAINT "FK_gateway_conta_bancaria" FOREIGN KEY ("conta_bancaria_id") REFERENCES "contas_bancarias"("id") ON DELETE CASCADE ON UPDATE NO ACTION
            )
        `);

    // Criar enums para adquirente
    await queryRunner.query(
      `CREATE TYPE "public"."adquirentes_tipo_adquirente_enum" AS ENUM('cielo', 'rede', 'getnet', 'stone', 'pagseguro', 'mercadopago', 'safrapay', 'vero', 'outro')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."adquirentes_status_enum" AS ENUM('ativo', 'inativo', 'bloqueado', 'em_analise')`,
    );

    // Criar tabela de adquirentes
    await queryRunner.query(`
            CREATE TABLE "adquirentes" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "conta_bancaria_id" uuid NOT NULL,
                "codigo_interno" character varying(20) NOT NULL,
                "nome_adquirente" character varying(255) NOT NULL,
                "tipo_adquirente" "public"."adquirentes_tipo_adquirente_enum" NOT NULL,
                "codigo_estabelecimento" character varying(50),
                "terminal_id" character varying(50),
                "taxa_antecipacao" numeric(5,2),
                "prazo_recebimento" integer DEFAULT '30',
                "permite_parcelamento" boolean DEFAULT true,
                "parcela_maxima" integer DEFAULT '12',
                "taxa_parcelamento" numeric(5,2),
                "valor_minimo_parcela" numeric(10,2) DEFAULT '50',
                "status" "public"."adquirentes_status_enum" NOT NULL DEFAULT 'ativo',
                "contato_comercial" character varying(255),
                "telefone_suporte" character varying(20),
                "email_suporte" character varying(255),
                "observacoes" text,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_adquirente_codigo_interno" UNIQUE ("codigo_interno"),
                CONSTRAINT "PK_adquirentes" PRIMARY KEY ("id"),
                CONSTRAINT "FK_adquirente_conta_bancaria" FOREIGN KEY ("conta_bancaria_id") REFERENCES "contas_bancarias"("id") ON DELETE CASCADE ON UPDATE NO ACTION
            )
        `);

    // Criar enums para restrições de adquirente
    await queryRunner.query(
      `CREATE TYPE "public"."restricoes_adquirente_tipo_restricao_enum" AS ENUM('bandeira', 'valor_minimo', 'valor_maximo', 'horario', 'dia_semana')`,
    );

    // Criar tabela de restrições de adquirente
    await queryRunner.query(`
            CREATE TABLE "restricoes_adquirente" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "adquirente_id" uuid NOT NULL,
                "tipo_restricao" "public"."restricoes_adquirente_tipo_restricao_enum" NOT NULL,
                "valor_restricao" character varying(255) NOT NULL,
                "descricao" text,
                "ativa" boolean DEFAULT true,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_restricoes_adquirente" PRIMARY KEY ("id"),
                CONSTRAINT "FK_restricao_adquirente" FOREIGN KEY ("adquirente_id") REFERENCES "adquirentes"("id") ON DELETE CASCADE ON UPDATE NO ACTION
            )
        `);

    // Criar enums para plano de contas
    await queryRunner.query(
      `CREATE TYPE "public"."planos_contas_tipo_conta_enum" AS ENUM('receita', 'despesa', 'ativo', 'passivo', 'patrimonio')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."planos_contas_natureza_enum" AS ENUM('devedora', 'credora')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."planos_contas_status_enum" AS ENUM('ativa', 'inativa', 'bloqueada')`,
    );

    // Criar tabela de plano de contas
    await queryRunner.query(`
            CREATE TABLE "planos_contas" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "codigo_conta" character varying(20) NOT NULL,
                "nome_conta" character varying(255) NOT NULL,
                "tipo_conta" "public"."planos_contas_tipo_conta_enum" NOT NULL,
                "natureza" "public"."planos_contas_natureza_enum" NOT NULL,
                "conta_pai_id" uuid,
                "nivel" integer NOT NULL DEFAULT '1',
                "aceita_lancamento" boolean DEFAULT false,
                "status" "public"."planos_contas_status_enum" NOT NULL DEFAULT 'ativa',
                "descricao" text,
                "observacoes" text,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_plano_codigo_conta" UNIQUE ("codigo_conta"),
                CONSTRAINT "PK_planos_contas" PRIMARY KEY ("id"),
                CONSTRAINT "FK_plano_conta_pai" FOREIGN KEY ("conta_pai_id") REFERENCES "planos_contas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
            )
        `);

    // Criar tabela de contas contábeis (vinculada ao plano de contas)
    await queryRunner.query(`
            CREATE TABLE "contas_contabeis" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "plano_conta_id" uuid NOT NULL,
                "unidade_saude_id" uuid NOT NULL,
                "saldo_inicial" numeric(15,2) DEFAULT '0',
                "saldo_atual" numeric(15,2) DEFAULT '0',
                "data_saldo_inicial" date,
                "observacoes" text,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_conta_contabil_plano_unidade" UNIQUE ("plano_conta_id", "unidade_saude_id"),
                CONSTRAINT "PK_contas_contabeis" PRIMARY KEY ("id"),
                CONSTRAINT "FK_conta_contabil_plano" FOREIGN KEY ("plano_conta_id") REFERENCES "planos_contas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
                CONSTRAINT "FK_conta_contabil_unidade" FOREIGN KEY ("unidade_saude_id") REFERENCES "unidades_saude"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
            )
        `);

    // Criar índices
    await queryRunner.query(
      `CREATE INDEX "IDX_banco_codigo" ON "bancos" ("codigo")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_banco_status" ON "bancos" ("status")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_conta_banco" ON "contas_bancarias" ("banco_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_conta_unidade" ON "contas_bancarias" ("unidade_saude_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_conta_status" ON "contas_bancarias" ("status")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_gateway_conta" ON "gateways_pagamento" ("conta_bancaria_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_gateway_tipo" ON "gateways_pagamento" ("tipo_gateway")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_gateway_status" ON "gateways_pagamento" ("status")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_adquirente_conta" ON "adquirentes" ("conta_bancaria_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_adquirente_tipo" ON "adquirentes" ("tipo_adquirente")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_adquirente_status" ON "adquirentes" ("status")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_restricao_adquirente" ON "restricoes_adquirente" ("adquirente_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_plano_conta_codigo" ON "planos_contas" ("codigo_conta")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_plano_conta_pai" ON "planos_contas" ("conta_pai_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_plano_conta_tipo" ON "planos_contas" ("tipo_conta")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_conta_contabil_plano" ON "contas_contabeis" ("plano_conta_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_conta_contabil_unidade" ON "contas_contabeis" ("unidade_saude_id")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remover índices
    await queryRunner.query(`DROP INDEX "public"."IDX_conta_contabil_unidade"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_conta_contabil_plano"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_plano_conta_tipo"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_plano_conta_pai"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_plano_conta_codigo"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_restricao_adquirente"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_adquirente_status"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_adquirente_tipo"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_adquirente_conta"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_gateway_status"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_gateway_tipo"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_gateway_conta"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_conta_status"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_conta_unidade"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_conta_banco"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_banco_status"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_banco_codigo"`);

    // Remover tabelas
    await queryRunner.query(`DROP TABLE "contas_contabeis"`);
    await queryRunner.query(`DROP TABLE "planos_contas"`);
    await queryRunner.query(`DROP TABLE "restricoes_adquirente"`);
    await queryRunner.query(`DROP TABLE "adquirentes"`);
    await queryRunner.query(`DROP TABLE "gateways_pagamento"`);
    await queryRunner.query(`DROP TABLE "contas_bancarias"`);
    await queryRunner.query(`DROP TABLE "bancos"`);

    // Remover enums
    await queryRunner.query(`DROP TYPE "public"."planos_contas_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."planos_contas_natureza_enum"`);
    await queryRunner.query(
      `DROP TYPE "public"."planos_contas_tipo_conta_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."restricoes_adquirente_tipo_restricao_enum"`,
    );
    await queryRunner.query(`DROP TYPE "public"."adquirentes_status_enum"`);
    await queryRunner.query(
      `DROP TYPE "public"."adquirentes_tipo_adquirente_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."gateways_pagamento_status_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."gateways_pagamento_ambiente_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."gateways_pagamento_modalidade_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."gateways_pagamento_tipo_gateway_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."contas_bancarias_status_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."contas_bancarias_tipo_conta_enum"`,
    );
    await queryRunner.query(`DROP TYPE "public"."bancos_status_enum"`);
  }
}
