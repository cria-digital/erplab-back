import { MigrationInterface, QueryRunner } from 'typeorm';

export class DropAndRecreateConveniosTables1763807540857
  implements MigrationInterface
{
  name = 'DropAndRecreateConveniosTables1763807540857';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP CONSTRAINT "FK_807b76b6f688d6d7d47fe735c94"`,
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
      `CREATE TABLE "cidades" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "nome" character varying(255) NOT NULL, "codigo_ibge" character varying(7) NOT NULL, "estado_id" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_924064cce6ff408643d55a425e9" UNIQUE ("codigo_ibge"), CONSTRAINT "PK_cc606d4fea4335e32bd19f3a9fa" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_924064cce6ff408643d55a425e" ON "cidades" ("codigo_ibge") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_2e7d637be70af707d91216a193" ON "cidades" ("estado_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "estados" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "nome" character varying(100) NOT NULL, "uf" character varying(2) NOT NULL, "codigo_ibge" character varying(2) NOT NULL, "regiao" character varying(20) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_727d8a05d0f922861f13978ac5d" UNIQUE ("uf"), CONSTRAINT "UQ_7dad70d8568576ae8d3f78e7617" UNIQUE ("codigo_ibge"), CONSTRAINT "PK_3d9a9f2658d5086012f27924d30" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "contas_bancarias" DROP COLUMN "status"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."contas_bancarias_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contas_bancarias" DROP COLUMN "saldo_inicial"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contas_bancarias" DROP COLUMN "pix_tipo"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contas_bancarias" DROP COLUMN "pix_chave"`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP CONSTRAINT "UQ_807b76b6f688d6d7d47fe735c94"`,
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
      `ALTER TABLE "convenios" DROP CONSTRAINT "UQ_80fe1c8895e9351c2ec2d0bf6d8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN "codigo_convenio"`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN "observacoes_convenio"`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN "tem_integracao_api"`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN "requer_autorizacao"`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN "requer_senha"`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN "validade_guia_dias"`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN "tipo_faturamento"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."convenios_tipo_faturamento_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN "dia_fechamento"`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN "prazo_pagamento_dias"`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN "percentual_desconto"`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN "regras_especificas"`,
    );
    await queryRunner.query(`ALTER TABLE "convenios" DROP COLUMN "status"`);
    await queryRunner.query(`DROP TYPE "public"."convenios_status_enum"`);
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN "observacoes"`,
    );
    await queryRunner.query(`ALTER TABLE "convenios" DROP COLUMN "url_api"`);
    await queryRunner.query(`ALTER TABLE "convenios" DROP COLUMN "token_api"`);
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN "tabela_precos"`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN "portal_envio"`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP CONSTRAINT "UQ_1c7842a1c9b419f3d5cc463e285"`,
    );
    await queryRunner.query(`ALTER TABLE "convenios" DROP COLUMN "codigo"`);
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN "razao_social"`,
    );
    await queryRunner.query(`ALTER TABLE "convenios" DROP COLUMN "cnpj"`);
    await queryRunner.query(`ALTER TABLE "convenios" DROP COLUMN "telefone"`);
    await queryRunner.query(`ALTER TABLE "convenios" DROP COLUMN "email"`);
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN "contato_nome"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contas_bancarias" ADD "empresa_id" uuid`,
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
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD "tem_integracao_api" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."tem_integracao_api" IS 'Se tem integração via API'`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD "url_api" character varying(255)`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."url_api" IS 'URL da API do convênio'`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD "token_api" character varying(255)`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."token_api" IS 'Token/chave de acesso'`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD "requer_autorizacao" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."requer_autorizacao" IS 'Se requer autorização prévia'`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD "requer_senha" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."requer_senha" IS 'Se requer senha de autorização'`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD "validade_guia_dias" integer`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."validade_guia_dias" IS 'Validade padrão da guia em dias'`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD "tipo_faturamento" "public"."convenios_tipo_faturamento_enum" NOT NULL DEFAULT 'tiss'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."tipo_faturamento" IS 'Tipo de faturamento'`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD "portal_envio" character varying(255)`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."portal_envio" IS 'Portal de envio (SAVI, Orizon, etc)'`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD "dia_fechamento" integer`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."dia_fechamento" IS 'Dia de fechamento do faturamento'`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD "prazo_pagamento_dias" integer`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."prazo_pagamento_dias" IS 'Prazo de pagamento em dias'`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD "percentual_desconto" numeric(5,2) NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."percentual_desconto" IS 'Percentual de desconto padrão'`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD "tabela_precos" character varying(50)`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."tabela_precos" IS 'Tabela de preços utilizada'`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD "telefone" character varying(20)`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."telefone" IS 'Telefone de contato'`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD "email" character varying(255)`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."email" IS 'E-mail de contato'`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD "contato_nome" character varying(255)`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."contato_nome" IS 'Pessoa de contato'`,
    );
    await queryRunner.query(`ALTER TABLE "convenios" ADD "observacoes" text`);
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."observacoes" IS 'Observações gerais'`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD "regras_especificas" jsonb`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."regras_especificas" IS 'Regras específicas do convênio'`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD "status" "public"."convenios_status_enum" NOT NULL DEFAULT 'ativo'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."status" IS 'Status do convênio'`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD "empresa_id" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD CONSTRAINT "UQ_807b76b6f688d6d7d47fe735c94" UNIQUE ("empresa_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD "matricula" character varying(50)`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."matricula" IS 'Matrícula do beneficiário'`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD "tipo_convenio_id" uuid`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."tipo_convenio_id" IS 'FK → Tipo de convênio'`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD "forma_liquidacao_id" uuid`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."forma_liquidacao_id" IS 'FK → Forma de liquidação'`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD "valor_ch" numeric(10,2)`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."valor_ch" IS 'Valor CH (consulta/hora)'`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD "valor_filme" numeric(10,2)`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."valor_filme" IS 'Valor do filme'`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD "tiss" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."tiss" IS 'Utiliza padrão TISS'`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD "versao_tiss" character varying(20)`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."versao_tiss" IS 'Versão TISS'`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD "codigo_operadora_tiss" character varying(50)`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."codigo_operadora_tiss" IS 'Código na operadora (TISS)'`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD "codigo_operadora_autorizacao" character varying(50)`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."codigo_operadora_autorizacao" IS 'Código operadora (Autorização)'`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD "codigo_prestador" character varying(50)`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."codigo_prestador" IS 'Código do prestador no convênio'`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD "envio_faturamento_id" uuid`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."envio_faturamento_id" IS 'FK → Forma de envio do faturamento'`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD "fatura_ate_dia" integer`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."fatura_ate_dia" IS 'Faturar até o dia X do mês (1-31)'`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD "dia_vencimento" integer`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."dia_vencimento" IS 'Dia de vencimento do mês (1-31)'`,
    );
    await queryRunner.query(`ALTER TABLE "convenios" ADD "data_contrato" date`);
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."data_contrato" IS 'Data do contrato'`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD "data_ultimo_ajuste" date`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."data_ultimo_ajuste" IS 'Data do último ajuste'`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD "instrucoes_faturamento" text`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."instrucoes_faturamento" IS 'Instruções para faturamento'`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD "tabela_servico_id" uuid`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."tabela_servico_id" IS 'FK → Tabela de serviços'`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD "tabela_base_id" uuid`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."tabela_base_id" IS 'FK → Tabela base'`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD "tabela_material_id" uuid`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."tabela_material_id" IS 'FK → Tabela de materiais'`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD "cnes" character varying(20)`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."cnes" IS 'Código CNES'`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD "co_participacao" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."co_participacao" IS 'Possui co-participação'`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD "nota_fiscal_exige_fatura" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."nota_fiscal_exige_fatura" IS 'Exige NF na fatura'`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD "contato" character varying(255)`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."contato" IS 'Nome do contato'`,
    );
    await queryRunner.query(`ALTER TABLE "convenios" ADD "instrucoes" text`);
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."instrucoes" IS 'Instruções gerais'`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD "observacoes_gerais" text`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."observacoes_gerais" IS 'Observações gerais'`,
    );
    await queryRunner.query(`ALTER TABLE "convenios" ADD "integracao_id" uuid`);
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."integracao_id" IS 'FK → integracoes (vínculo com integração)'`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD "ativo" boolean NOT NULL DEFAULT true`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."ativo" IS 'Convenio ativo?'`,
    );
    await queryRunner.query(
      `ALTER TABLE "empresas" ALTER COLUMN "nomeFantasia" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "telemedicina_exames" DROP CONSTRAINT "FK_2ba9fe220bc6e867312d2dc6452"`,
    );
    await queryRunner.query(
      `ALTER TABLE "exames" DROP CONSTRAINT "FK_a35caeccff8224699a2dbae386c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "telemedicina" ALTER COLUMN "id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ALTER COLUMN "nome" SET NOT NULL`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."nome" IS 'Nome do convênio'`,
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
      `COMMENT ON COLUMN "convenios"."criado_em" IS 'Data de criação'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."atualizado_em" IS 'Data de atualização'`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."campos_formulario_nome_campo_enum" RENAME TO "campos_formulario_nome_campo_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."campos_formulario_nome_campo_enum" AS ENUM('tipo_exames', 'especialidade', 'grupo', 'subgrupo', 'setor', 'metodologia', 'unidade_medida', 'amostra', 'tipo_recipiente', 'regiao_coleta', 'volume_minimo', 'estabilidade', 'tipo_convenio', 'forma_liquidacao', 'envio_faturamento', 'tabela_servico', 'tabela_base', 'tabela_material', 'dia_vencimento')`,
    );
    await queryRunner.query(
      `ALTER TABLE "campos_formulario" ALTER COLUMN "nome_campo" TYPE "public"."campos_formulario_nome_campo_enum" USING "nome_campo"::"text"::"public"."campos_formulario_nome_campo_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."campos_formulario_nome_campo_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "laboratorios_metodos" DROP CONSTRAINT "FK_e1445f18d757962ef62fcd75ef0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "laboratorios" ALTER COLUMN "id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "kit_convenios" DROP CONSTRAINT "FK_b64239cdf9789aa3c014c80cc4a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ordens_servico" DROP CONSTRAINT "FK_530803f526491bc4066c4141d42"`,
    );
    await queryRunner.query(
      `ALTER TABLE "instrucoes" DROP CONSTRAINT "FK_dd26562872777bf8ce16f997061"`,
    );
    await queryRunner.query(
      `ALTER TABLE "planos" DROP CONSTRAINT "FK_5acc2a4e3f7c8e181c012892608"`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ALTER COLUMN "id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ALTER COLUMN "nome" SET NOT NULL`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."nome" IS 'Nome do convênio'`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN "registro_ans"`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD "registro_ans" character varying(20)`,
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
      `ALTER TABLE "contas_bancarias" ADD CONSTRAINT "FK_a4e06e1867e111790adec422859" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ordens_servico" ADD CONSTRAINT "FK_530803f526491bc4066c4141d42" FOREIGN KEY ("convenio_id") REFERENCES "convenios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "exames" ADD CONSTRAINT "FK_a35caeccff8224699a2dbae386c" FOREIGN KEY ("telemedicina_id") REFERENCES "telemedicina"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "telemedicina_exames" ADD CONSTRAINT "FK_2ba9fe220bc6e867312d2dc6452" FOREIGN KEY ("telemedicina_id") REFERENCES "telemedicina"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "instrucoes" ADD CONSTRAINT "FK_dd26562872777bf8ce16f997061" FOREIGN KEY ("convenio_id") REFERENCES "convenios"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD CONSTRAINT "FK_807b76b6f688d6d7d47fe735c94" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD CONSTRAINT "FK_37bb282c10cb77c9995f55f3ae8" FOREIGN KEY ("tipo_convenio_id") REFERENCES "alternativas_campo_formulario"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD CONSTRAINT "FK_3133ddebb3bf61a78673afc528d" FOREIGN KEY ("forma_liquidacao_id") REFERENCES "alternativas_campo_formulario"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD CONSTRAINT "FK_29997ac252cfff45eb879c522d7" FOREIGN KEY ("envio_faturamento_id") REFERENCES "alternativas_campo_formulario"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD CONSTRAINT "FK_b8c0b05eb8ace51440dee6ea20a" FOREIGN KEY ("tabela_servico_id") REFERENCES "alternativas_campo_formulario"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD CONSTRAINT "FK_1ef6363e4b4416b101a5a09959f" FOREIGN KEY ("tabela_base_id") REFERENCES "alternativas_campo_formulario"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD CONSTRAINT "FK_bf1b0192b535686557bdab37d52" FOREIGN KEY ("tabela_material_id") REFERENCES "alternativas_campo_formulario"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD CONSTRAINT "FK_896e3cc543c02509342769cb1a3" FOREIGN KEY ("integracao_id") REFERENCES "integracoes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "planos" ADD CONSTRAINT "FK_5acc2a4e3f7c8e181c012892608" FOREIGN KEY ("convenio_id") REFERENCES "convenios"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "cidades" ADD CONSTRAINT "FK_2e7d637be70af707d91216a1933" FOREIGN KEY ("estado_id") REFERENCES "estados"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "laboratorios_metodos" ADD CONSTRAINT "FK_e1445f18d757962ef62fcd75ef0" FOREIGN KEY ("laboratorio_id") REFERENCES "laboratorios"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "kit_convenios" ADD CONSTRAINT "FK_b64239cdf9789aa3c014c80cc4a" FOREIGN KEY ("convenio_id") REFERENCES "convenios"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "kit_convenios" DROP CONSTRAINT "FK_b64239cdf9789aa3c014c80cc4a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "laboratorios_metodos" DROP CONSTRAINT "FK_e1445f18d757962ef62fcd75ef0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cidades" DROP CONSTRAINT "FK_2e7d637be70af707d91216a1933"`,
    );
    await queryRunner.query(
      `ALTER TABLE "planos" DROP CONSTRAINT "FK_5acc2a4e3f7c8e181c012892608"`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP CONSTRAINT "FK_896e3cc543c02509342769cb1a3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP CONSTRAINT "FK_bf1b0192b535686557bdab37d52"`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP CONSTRAINT "FK_1ef6363e4b4416b101a5a09959f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP CONSTRAINT "FK_b8c0b05eb8ace51440dee6ea20a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP CONSTRAINT "FK_29997ac252cfff45eb879c522d7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP CONSTRAINT "FK_3133ddebb3bf61a78673afc528d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP CONSTRAINT "FK_37bb282c10cb77c9995f55f3ae8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP CONSTRAINT "FK_807b76b6f688d6d7d47fe735c94"`,
    );
    await queryRunner.query(
      `ALTER TABLE "instrucoes" DROP CONSTRAINT "FK_dd26562872777bf8ce16f997061"`,
    );
    await queryRunner.query(
      `ALTER TABLE "telemedicina_exames" DROP CONSTRAINT "FK_2ba9fe220bc6e867312d2dc6452"`,
    );
    await queryRunner.query(
      `ALTER TABLE "exames" DROP CONSTRAINT "FK_a35caeccff8224699a2dbae386c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ordens_servico" DROP CONSTRAINT "FK_530803f526491bc4066c4141d42"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contas_bancarias" DROP CONSTRAINT "FK_a4e06e1867e111790adec422859"`,
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
      `ALTER TABLE "convenios" DROP COLUMN "registro_ans"`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD "registro_ans" character varying(50)`,
    );
    await queryRunner.query(`COMMENT ON COLUMN "convenios"."nome" IS NULL`);
    await queryRunner.query(
      `ALTER TABLE "convenios" ALTER COLUMN "nome" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "planos" ADD CONSTRAINT "FK_5acc2a4e3f7c8e181c012892608" FOREIGN KEY ("convenio_id") REFERENCES "convenios"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "instrucoes" ADD CONSTRAINT "FK_dd26562872777bf8ce16f997061" FOREIGN KEY ("convenio_id") REFERENCES "convenios"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ordens_servico" ADD CONSTRAINT "FK_530803f526491bc4066c4141d42" FOREIGN KEY ("convenio_id") REFERENCES "convenios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "kit_convenios" ADD CONSTRAINT "FK_b64239cdf9789aa3c014c80cc4a" FOREIGN KEY ("convenio_id") REFERENCES "convenios"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "laboratorios" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "laboratorios_metodos" ADD CONSTRAINT "FK_e1445f18d757962ef62fcd75ef0" FOREIGN KEY ("laboratorio_id") REFERENCES "laboratorios"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."campos_formulario_nome_campo_enum_old" AS ENUM('tipo_exames', 'especialidade', 'grupo', 'subgrupo', 'setor', 'metodologia', 'unidade_medida', 'amostra', 'tipo_recipiente', 'regiao_coleta', 'volume_minimo', 'estabilidade')`,
    );
    await queryRunner.query(
      `ALTER TABLE "campos_formulario" ALTER COLUMN "nome_campo" TYPE "public"."campos_formulario_nome_campo_enum_old" USING "nome_campo"::"text"::"public"."campos_formulario_nome_campo_enum_old"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."campos_formulario_nome_campo_enum"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."campos_formulario_nome_campo_enum_old" RENAME TO "campos_formulario_nome_campo_enum"`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."atualizado_em" IS NULL`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."criado_em" IS NULL`,
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
    await queryRunner.query(`COMMENT ON COLUMN "convenios"."nome" IS NULL`);
    await queryRunner.query(
      `ALTER TABLE "convenios" ALTER COLUMN "nome" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "telemedicina" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "exames" ADD CONSTRAINT "FK_a35caeccff8224699a2dbae386c" FOREIGN KEY ("telemedicina_id") REFERENCES "telemedicina"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "telemedicina_exames" ADD CONSTRAINT "FK_2ba9fe220bc6e867312d2dc6452" FOREIGN KEY ("telemedicina_id") REFERENCES "telemedicina"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "empresas" ALTER COLUMN "nomeFantasia" SET NOT NULL`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."ativo" IS 'Convenio ativo?'`,
    );
    await queryRunner.query(`ALTER TABLE "convenios" DROP COLUMN "ativo"`);
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."integracao_id" IS 'FK → integracoes (vínculo com integração)'`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN "integracao_id"`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."observacoes_gerais" IS 'Observações gerais'`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN "observacoes_gerais"`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."instrucoes" IS 'Instruções gerais'`,
    );
    await queryRunner.query(`ALTER TABLE "convenios" DROP COLUMN "instrucoes"`);
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."contato" IS 'Nome do contato'`,
    );
    await queryRunner.query(`ALTER TABLE "convenios" DROP COLUMN "contato"`);
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."nota_fiscal_exige_fatura" IS 'Exige NF na fatura'`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN "nota_fiscal_exige_fatura"`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."co_participacao" IS 'Possui co-participação'`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN "co_participacao"`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."cnes" IS 'Código CNES'`,
    );
    await queryRunner.query(`ALTER TABLE "convenios" DROP COLUMN "cnes"`);
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."tabela_material_id" IS 'FK → Tabela de materiais'`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN "tabela_material_id"`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."tabela_base_id" IS 'FK → Tabela base'`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN "tabela_base_id"`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."tabela_servico_id" IS 'FK → Tabela de serviços'`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN "tabela_servico_id"`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."instrucoes_faturamento" IS 'Instruções para faturamento'`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN "instrucoes_faturamento"`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."data_ultimo_ajuste" IS 'Data do último ajuste'`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN "data_ultimo_ajuste"`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."data_contrato" IS 'Data do contrato'`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN "data_contrato"`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."dia_vencimento" IS 'Dia de vencimento do mês (1-31)'`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN "dia_vencimento"`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."fatura_ate_dia" IS 'Faturar até o dia X do mês (1-31)'`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN "fatura_ate_dia"`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."envio_faturamento_id" IS 'FK → Forma de envio do faturamento'`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN "envio_faturamento_id"`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."codigo_prestador" IS 'Código do prestador no convênio'`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN "codigo_prestador"`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."codigo_operadora_autorizacao" IS 'Código operadora (Autorização)'`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN "codigo_operadora_autorizacao"`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."codigo_operadora_tiss" IS 'Código na operadora (TISS)'`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN "codigo_operadora_tiss"`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."versao_tiss" IS 'Versão TISS'`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN "versao_tiss"`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."tiss" IS 'Utiliza padrão TISS'`,
    );
    await queryRunner.query(`ALTER TABLE "convenios" DROP COLUMN "tiss"`);
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."valor_filme" IS 'Valor do filme'`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN "valor_filme"`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."valor_ch" IS 'Valor CH (consulta/hora)'`,
    );
    await queryRunner.query(`ALTER TABLE "convenios" DROP COLUMN "valor_ch"`);
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."forma_liquidacao_id" IS 'FK → Forma de liquidação'`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN "forma_liquidacao_id"`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."tipo_convenio_id" IS 'FK → Tipo de convênio'`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN "tipo_convenio_id"`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."matricula" IS 'Matrícula do beneficiário'`,
    );
    await queryRunner.query(`ALTER TABLE "convenios" DROP COLUMN "matricula"`);
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP CONSTRAINT "UQ_807b76b6f688d6d7d47fe735c94"`,
    );
    await queryRunner.query(`ALTER TABLE "convenios" DROP COLUMN "empresa_id"`);
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."status" IS 'Status do convênio'`,
    );
    await queryRunner.query(`ALTER TABLE "convenios" DROP COLUMN "status"`);
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."regras_especificas" IS 'Regras específicas do convênio'`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN "regras_especificas"`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."observacoes" IS 'Observações gerais'`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN "observacoes"`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."contato_nome" IS 'Pessoa de contato'`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN "contato_nome"`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."email" IS 'E-mail de contato'`,
    );
    await queryRunner.query(`ALTER TABLE "convenios" DROP COLUMN "email"`);
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."telefone" IS 'Telefone de contato'`,
    );
    await queryRunner.query(`ALTER TABLE "convenios" DROP COLUMN "telefone"`);
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."tabela_precos" IS 'Tabela de preços utilizada'`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN "tabela_precos"`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."percentual_desconto" IS 'Percentual de desconto padrão'`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN "percentual_desconto"`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."prazo_pagamento_dias" IS 'Prazo de pagamento em dias'`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN "prazo_pagamento_dias"`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."dia_fechamento" IS 'Dia de fechamento do faturamento'`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN "dia_fechamento"`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."portal_envio" IS 'Portal de envio (SAVI, Orizon, etc)'`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN "portal_envio"`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."tipo_faturamento" IS 'Tipo de faturamento'`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN "tipo_faturamento"`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."validade_guia_dias" IS 'Validade padrão da guia em dias'`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN "validade_guia_dias"`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."requer_senha" IS 'Se requer senha de autorização'`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN "requer_senha"`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."requer_autorizacao" IS 'Se requer autorização prévia'`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN "requer_autorizacao"`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."token_api" IS 'Token/chave de acesso'`,
    );
    await queryRunner.query(`ALTER TABLE "convenios" DROP COLUMN "token_api"`);
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."url_api" IS 'URL da API do convênio'`,
    );
    await queryRunner.query(`ALTER TABLE "convenios" DROP COLUMN "url_api"`);
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."tem_integracao_api" IS 'Se tem integração via API'`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN "tem_integracao_api"`,
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
      `ALTER TABLE "contas_bancarias" DROP COLUMN "empresa_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD "contato_nome" character varying(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD "email" character varying(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD "telefone" character varying(20)`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD "cnpj" character varying(14)`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD "razao_social" character varying(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD "codigo" character varying(20) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD CONSTRAINT "UQ_1c7842a1c9b419f3d5cc463e285" UNIQUE ("codigo")`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD "portal_envio" character varying(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD "tabela_precos" character varying(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD "token_api" character varying(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD "url_api" character varying(255)`,
    );
    await queryRunner.query(`ALTER TABLE "convenios" ADD "observacoes" text`);
    await queryRunner.query(
      `CREATE TYPE "public"."convenios_status_enum" AS ENUM('ativo', 'inativo', 'suspenso', 'bloqueado')`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD "status" "public"."convenios_status_enum" NOT NULL DEFAULT 'ativo'`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD "regras_especificas" jsonb`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD "percentual_desconto" numeric(5,2)`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD "prazo_pagamento_dias" integer NOT NULL DEFAULT '30'`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD "dia_fechamento" integer`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."convenios_tipo_faturamento_enum" AS ENUM('mensal', 'quinzenal', 'semanal', 'avulso')`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD "tipo_faturamento" "public"."convenios_tipo_faturamento_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD "validade_guia_dias" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD "requer_senha" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD "requer_autorizacao" boolean NOT NULL DEFAULT true`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD "tem_integracao_api" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD "observacoes_convenio" text`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD "codigo_convenio" character varying(20) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD CONSTRAINT "UQ_80fe1c8895e9351c2ec2d0bf6d8" UNIQUE ("codigo_convenio")`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD "valor_consulta" numeric(10,2)`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD "percentual_coparticipacao" numeric(5,2)`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD "aceita_atendimento_online" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD "empresa_id" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD CONSTRAINT "UQ_807b76b6f688d6d7d47fe735c94" UNIQUE ("empresa_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "contas_bancarias" ADD "pix_chave" character varying(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "contas_bancarias" ADD "pix_tipo" character varying(20)`,
    );
    await queryRunner.query(
      `ALTER TABLE "contas_bancarias" ADD "saldo_inicial" numeric(15,2) NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."contas_bancarias_status_enum" AS ENUM('ativa', 'inativa', 'bloqueada', 'encerrada')`,
    );
    await queryRunner.query(
      `ALTER TABLE "contas_bancarias" ADD "status" "public"."contas_bancarias_status_enum" NOT NULL DEFAULT 'ativa'`,
    );
    await queryRunner.query(`DROP TABLE "estados"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_2e7d637be70af707d91216a193"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_924064cce6ff408643d55a425e"`,
    );
    await queryRunner.query(`DROP TABLE "cidades"`);
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
      `ALTER TABLE "convenios" ADD CONSTRAINT "FK_807b76b6f688d6d7d47fe735c94" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
