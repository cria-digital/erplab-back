import { MigrationInterface, QueryRunner } from 'typeorm';

export class DropAndRecreateConveniosTables1763807540857
  implements MigrationInterface
{
  name = 'DropAndRecreateConveniosTables1763807540857';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // PARTE 1: REMOVER CAMPOS DUPLICADOS
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN IF EXISTS "codigo_convenio"`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN IF EXISTS "observacoes_convenio"`,
    );

    // PARTE 2: REMOVER CAMPOS QUE VÊM DE EMPRESA
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN IF EXISTS "razao_social"`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN IF EXISTS "cnpj"`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN IF EXISTS "observacoes"`,
    );

    // PARTE 3: REMOVER CAMPOS EXTRAS NÃO MAPEADOS NA ENTIDADE
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN IF EXISTS "tem_integracao_api"`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN IF EXISTS "url_api"`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN IF EXISTS "token_api"`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN IF EXISTS "requer_autorizacao"`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN IF EXISTS "requer_senha"`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN IF EXISTS "validade_guia_dias"`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN IF EXISTS "tipo_faturamento"`,
    );
    await queryRunner.query(
      `DROP TYPE IF EXISTS "public"."convenios_tipo_faturamento_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN IF EXISTS "portal_envio"`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN IF EXISTS "dia_fechamento"`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN IF EXISTS "prazo_pagamento_dias"`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN IF EXISTS "percentual_desconto"`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN IF EXISTS "tabela_precos"`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN IF EXISTS "telefone"`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN IF EXISTS "email"`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN IF EXISTS "contato_nome"`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN IF EXISTS "regras_especificas"`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN IF EXISTS "status"`,
    );
    await queryRunner.query(
      `DROP TYPE IF EXISTS "public"."convenios_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN IF EXISTS "aceita_atendimento_online"`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN IF EXISTS "percentual_coparticipacao"`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN IF EXISTS "valor_consulta"`,
    );

    // PARTE 4: ADICIONAR CAMPOS QUE FALTAM
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD COLUMN IF NOT EXISTS "matricula" character varying(50)`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD COLUMN IF NOT EXISTS "tipo_convenio_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD COLUMN IF NOT EXISTS "forma_liquidacao_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD COLUMN IF NOT EXISTS "valor_ch" numeric(10,2)`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD COLUMN IF NOT EXISTS "valor_filme" numeric(10,2)`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD COLUMN IF NOT EXISTS "tiss" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD COLUMN IF NOT EXISTS "versao_tiss" character varying(20)`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD COLUMN IF NOT EXISTS "codigo_operadora_tiss" character varying(50)`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD COLUMN IF NOT EXISTS "codigo_operadora_autorizacao" character varying(50)`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD COLUMN IF NOT EXISTS "codigo_prestador" character varying(50)`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD COLUMN IF NOT EXISTS "envio_faturamento_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD COLUMN IF NOT EXISTS "fatura_ate_dia" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD COLUMN IF NOT EXISTS "dia_vencimento" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD COLUMN IF NOT EXISTS "data_contrato" date`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD COLUMN IF NOT EXISTS "data_ultimo_ajuste" date`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD COLUMN IF NOT EXISTS "instrucoes_faturamento" text`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD COLUMN IF NOT EXISTS "tabela_servico_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD COLUMN IF NOT EXISTS "tabela_base_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD COLUMN IF NOT EXISTS "tabela_material_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD COLUMN IF NOT EXISTS "cnes" character varying(20)`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD COLUMN IF NOT EXISTS "co_participacao" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD COLUMN IF NOT EXISTS "nota_fiscal_exige_fatura" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD COLUMN IF NOT EXISTS "contato" character varying(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD COLUMN IF NOT EXISTS "instrucoes" text`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD COLUMN IF NOT EXISTS "observacoes_gerais" text`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD COLUMN IF NOT EXISTS "integracao_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD COLUMN IF NOT EXISTS "ativo" boolean NOT NULL DEFAULT true`,
    );

    // PARTE 5: FOREIGN KEYS (somente se tabelas existirem)
    await queryRunner.query(
      `DO $$
      BEGIN
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'alternativas_campo_formulario')
        AND NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'FK_convenios_tipo_convenio') THEN
          ALTER TABLE "convenios" ADD CONSTRAINT "FK_convenios_tipo_convenio"
          FOREIGN KEY ("tipo_convenio_id") REFERENCES "alternativas_campo_formulario"("id")
          ON DELETE NO ACTION ON UPDATE NO ACTION;
        END IF;
      END $$;`,
    );

    await queryRunner.query(
      `DO $$
      BEGIN
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'alternativas_campo_formulario')
        AND NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'FK_convenios_forma_liquidacao') THEN
          ALTER TABLE "convenios" ADD CONSTRAINT "FK_convenios_forma_liquidacao"
          FOREIGN KEY ("forma_liquidacao_id") REFERENCES "alternativas_campo_formulario"("id")
          ON DELETE NO ACTION ON UPDATE NO ACTION;
        END IF;
      END $$;`,
    );

    await queryRunner.query(
      `DO $$
      BEGIN
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'alternativas_campo_formulario')
        AND NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'FK_convenios_envio_faturamento') THEN
          ALTER TABLE "convenios" ADD CONSTRAINT "FK_convenios_envio_faturamento"
          FOREIGN KEY ("envio_faturamento_id") REFERENCES "alternativas_campo_formulario"("id")
          ON DELETE NO ACTION ON UPDATE NO ACTION;
        END IF;
      END $$;`,
    );

    await queryRunner.query(
      `DO $$
      BEGIN
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'alternativas_campo_formulario')
        AND NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'FK_convenios_tabela_servico') THEN
          ALTER TABLE "convenios" ADD CONSTRAINT "FK_convenios_tabela_servico"
          FOREIGN KEY ("tabela_servico_id") REFERENCES "alternativas_campo_formulario"("id")
          ON DELETE NO ACTION ON UPDATE NO ACTION;
        END IF;
      END $$;`,
    );

    await queryRunner.query(
      `DO $$
      BEGIN
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'alternativas_campo_formulario')
        AND NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'FK_convenios_tabela_base') THEN
          ALTER TABLE "convenios" ADD CONSTRAINT "FK_convenios_tabela_base"
          FOREIGN KEY ("tabela_base_id") REFERENCES "alternativas_campo_formulario"("id")
          ON DELETE NO ACTION ON UPDATE NO ACTION;
        END IF;
      END $$;`,
    );

    await queryRunner.query(
      `DO $$
      BEGIN
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'alternativas_campo_formulario')
        AND NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'FK_convenios_tabela_material') THEN
          ALTER TABLE "convenios" ADD CONSTRAINT "FK_convenios_tabela_material"
          FOREIGN KEY ("tabela_material_id") REFERENCES "alternativas_campo_formulario"("id")
          ON DELETE NO ACTION ON UPDATE NO ACTION;
        END IF;
      END $$;`,
    );

    await queryRunner.query(
      `DO $$
      BEGIN
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'integracoes')
        AND NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'FK_convenios_integracao') THEN
          ALTER TABLE "convenios" ADD CONSTRAINT "FK_convenios_integracao"
          FOREIGN KEY ("integracao_id") REFERENCES "integracoes"("id")
          ON DELETE NO ACTION ON UPDATE NO ACTION;
        END IF;
      END $$;`,
    );
  }

  public async down(_queryRunner: QueryRunner): Promise<void> {
    throw new Error(
      'Migration rollback not supported - create new migration to revert changes',
    );
  }
}
