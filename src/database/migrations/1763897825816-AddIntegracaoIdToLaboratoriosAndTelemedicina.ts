import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIntegracaoIdToLaboratoriosAndTelemedicina1763897825816
  implements MigrationInterface
{
  name = 'AddIntegracaoIdToLaboratoriosAndTelemedicina1763897825816';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "telemedicina" DROP COLUMN "tipo_integracao"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."telemedicina_tipo_integracao_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "telemedicina" DROP COLUMN "status_integracao"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."telemedicina_status_integracao_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "telemedicina" DROP COLUMN "tipo_plataforma"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."telemedicina_tipo_plataforma_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "telemedicina" DROP COLUMN "teleconsulta"`,
    );
    await queryRunner.query(
      `ALTER TABLE "telemedicina" DROP COLUMN "telediagnostico"`,
    );
    await queryRunner.query(
      `ALTER TABLE "telemedicina" DROP COLUMN "telecirurgia"`,
    );
    await queryRunner.query(
      `ALTER TABLE "telemedicina" DROP COLUMN "telemonitoramento"`,
    );
    await queryRunner.query(
      `ALTER TABLE "telemedicina" DROP COLUMN "tempo_consulta_padrao"`,
    );
    await queryRunner.query(
      `ALTER TABLE "telemedicina" DROP COLUMN "permite_agendamento_online"`,
    );
    await queryRunner.query(
      `ALTER TABLE "telemedicina" DROP COLUMN "permite_cancelamento_online"`,
    );
    await queryRunner.query(
      `ALTER TABLE "telemedicina" DROP COLUMN "antecedencia_minima_agendamento"`,
    );
    await queryRunner.query(
      `ALTER TABLE "telemedicina" DROP COLUMN "antecedencia_minima_cancelamento"`,
    );
    await queryRunner.query(
      `ALTER TABLE "telemedicina" DROP COLUMN "suporte_gravacao"`,
    );
    await queryRunner.query(
      `ALTER TABLE "telemedicina" DROP COLUMN "suporte_streaming"`,
    );
    await queryRunner.query(
      `ALTER TABLE "telemedicina" DROP COLUMN "criptografia_end_to_end"`,
    );
    await queryRunner.query(
      `ALTER TABLE "telemedicina" DROP COLUMN "valor_consulta_particular"`,
    );
    await queryRunner.query(
      `ALTER TABLE "telemedicina" DROP COLUMN "percentual_repasse"`,
    );
    await queryRunner.query(
      `ALTER TABLE "telemedicina" DROP COLUMN "taxa_plataforma"`,
    );
    await queryRunner.query(
      `ALTER TABLE "telemedicina" DROP COLUMN "url_integracao"`,
    );
    await queryRunner.query(
      `ALTER TABLE "telemedicina" DROP COLUMN "token_integracao"`,
    );
    await queryRunner.query(
      `ALTER TABLE "telemedicina" DROP COLUMN "usuario_integracao"`,
    );
    await queryRunner.query(
      `ALTER TABLE "telemedicina" DROP COLUMN "senha_integracao"`,
    );
    await queryRunner.query(
      `ALTER TABLE "telemedicina" DROP COLUMN "configuracao_adicional"`,
    );
    await queryRunner.query(
      `ALTER TABLE "telemedicina" DROP COLUMN "url_plataforma"`,
    );
    await queryRunner.query(
      `ALTER TABLE "telemedicina" DROP COLUMN "versao_sistema"`,
    );
    await queryRunner.query(
      `ALTER TABLE "telemedicina" DROP COLUMN "especialidades_atendidas"`,
    );
    await queryRunner.query(
      `ALTER TABLE "telemedicina" DROP COLUMN "tipos_consulta"`,
    );
    await queryRunner.query(
      `ALTER TABLE "telemedicina" DROP COLUMN "certificado_digital"`,
    );
    await queryRunner.query(
      `ALTER TABLE "telemedicina" DROP COLUMN "protocolo_seguranca"`,
    );
    await queryRunner.query(
      `ALTER TABLE "telemedicina" DROP COLUMN "requisitos_tecnicos"`,
    );
    await queryRunner.query(
      `ALTER TABLE "laboratorios" DROP COLUMN "tipo_integracao"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."laboratorios_tipo_integracao_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "laboratorios" DROP COLUMN "prazo_entrega_normal"`,
    );
    await queryRunner.query(
      `ALTER TABLE "laboratorios" DROP COLUMN "prazo_entrega_urgente"`,
    );
    await queryRunner.query(
      `ALTER TABLE "laboratorios" DROP COLUMN "taxa_urgencia"`,
    );
    await queryRunner.query(
      `ALTER TABLE "laboratorios" DROP COLUMN "percentual_repasse"`,
    );
    await queryRunner.query(
      `ALTER TABLE "laboratorios" DROP COLUMN "aceita_urgencia"`,
    );
    await queryRunner.query(
      `ALTER TABLE "laboratorios" DROP COLUMN "envia_resultado_automatico"`,
    );
    await queryRunner.query(
      `ALTER TABLE "laboratorios" DROP COLUMN "responsavel_tecnico"`,
    );
    await queryRunner.query(
      `ALTER TABLE "laboratorios" DROP COLUMN "conselho_responsavel"`,
    );
    await queryRunner.query(
      `ALTER TABLE "laboratorios" DROP COLUMN "numero_conselho"`,
    );
    await queryRunner.query(
      `ALTER TABLE "laboratorios" DROP COLUMN "url_integracao"`,
    );
    await queryRunner.query(
      `ALTER TABLE "laboratorios" DROP COLUMN "token_integracao"`,
    );
    await queryRunner.query(
      `ALTER TABLE "laboratorios" DROP COLUMN "usuario_integracao"`,
    );
    await queryRunner.query(
      `ALTER TABLE "laboratorios" DROP COLUMN "senha_integracao"`,
    );
    await queryRunner.query(
      `ALTER TABLE "laboratorios" DROP COLUMN "configuracao_adicional"`,
    );
    await queryRunner.query(
      `ALTER TABLE "laboratorios" DROP COLUMN "metodos_envio_resultado"`,
    );
    await queryRunner.query(
      `ALTER TABLE "laboratorios" DROP COLUMN "portal_resultados_url"`,
    );
    await queryRunner.query(
      `ALTER TABLE "telemedicina" ADD "integracao_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "laboratorios" ADD "integracao_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "telemedicina" ADD CONSTRAINT "FK_c5ec344493ea94c887f461081a7" FOREIGN KEY ("integracao_id") REFERENCES "integracoes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "laboratorios" ADD CONSTRAINT "FK_5ab3e2fdaea79a2176ec3fd88bb" FOREIGN KEY ("integracao_id") REFERENCES "integracoes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "laboratorios" DROP CONSTRAINT "FK_5ab3e2fdaea79a2176ec3fd88bb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "telemedicina" DROP CONSTRAINT "FK_c5ec344493ea94c887f461081a7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "laboratorios" DROP COLUMN "integracao_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "telemedicina" DROP COLUMN "integracao_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "laboratorios" ADD "portal_resultados_url" character varying(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "laboratorios" ADD "metodos_envio_resultado" text`,
    );
    await queryRunner.query(
      `ALTER TABLE "laboratorios" ADD "configuracao_adicional" text`,
    );
    await queryRunner.query(
      `ALTER TABLE "laboratorios" ADD "senha_integracao" character varying(100)`,
    );
    await queryRunner.query(
      `ALTER TABLE "laboratorios" ADD "usuario_integracao" character varying(100)`,
    );
    await queryRunner.query(
      `ALTER TABLE "laboratorios" ADD "token_integracao" character varying(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "laboratorios" ADD "url_integracao" character varying(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "laboratorios" ADD "numero_conselho" character varying(20)`,
    );
    await queryRunner.query(
      `ALTER TABLE "laboratorios" ADD "conselho_responsavel" character varying(20)`,
    );
    await queryRunner.query(
      `ALTER TABLE "laboratorios" ADD "responsavel_tecnico" character varying(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "laboratorios" ADD "envia_resultado_automatico" boolean NOT NULL DEFAULT true`,
    );
    await queryRunner.query(
      `ALTER TABLE "laboratorios" ADD "aceita_urgencia" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "laboratorios" ADD "percentual_repasse" numeric(5,2)`,
    );
    await queryRunner.query(
      `ALTER TABLE "laboratorios" ADD "taxa_urgencia" numeric(10,2)`,
    );
    await queryRunner.query(
      `ALTER TABLE "laboratorios" ADD "prazo_entrega_urgente" integer NOT NULL DEFAULT '1'`,
    );
    await queryRunner.query(
      `ALTER TABLE "laboratorios" ADD "prazo_entrega_normal" integer NOT NULL DEFAULT '3'`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."laboratorios_tipo_integracao_enum" AS ENUM('api', 'email', 'ftp', 'manual', 'webservice')`,
    );
    await queryRunner.query(
      `ALTER TABLE "laboratorios" ADD "tipo_integracao" "public"."laboratorios_tipo_integracao_enum" NOT NULL DEFAULT 'manual'`,
    );
    await queryRunner.query(
      `ALTER TABLE "telemedicina" ADD "requisitos_tecnicos" text`,
    );
    await queryRunner.query(
      `ALTER TABLE "telemedicina" ADD "protocolo_seguranca" character varying(50)`,
    );
    await queryRunner.query(
      `ALTER TABLE "telemedicina" ADD "certificado_digital" character varying(100)`,
    );
    await queryRunner.query(
      `ALTER TABLE "telemedicina" ADD "tipos_consulta" text`,
    );
    await queryRunner.query(
      `ALTER TABLE "telemedicina" ADD "especialidades_atendidas" text`,
    );
    await queryRunner.query(
      `ALTER TABLE "telemedicina" ADD "versao_sistema" character varying(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "telemedicina" ADD "url_plataforma" character varying(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "telemedicina" ADD "configuracao_adicional" text`,
    );
    await queryRunner.query(
      `ALTER TABLE "telemedicina" ADD "senha_integracao" character varying(100)`,
    );
    await queryRunner.query(
      `ALTER TABLE "telemedicina" ADD "usuario_integracao" character varying(100)`,
    );
    await queryRunner.query(
      `ALTER TABLE "telemedicina" ADD "token_integracao" character varying(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "telemedicina" ADD "url_integracao" character varying(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "telemedicina" ADD "taxa_plataforma" numeric(10,2)`,
    );
    await queryRunner.query(
      `ALTER TABLE "telemedicina" ADD "percentual_repasse" numeric(5,2)`,
    );
    await queryRunner.query(
      `ALTER TABLE "telemedicina" ADD "valor_consulta_particular" numeric(10,2)`,
    );
    await queryRunner.query(
      `ALTER TABLE "telemedicina" ADD "criptografia_end_to_end" boolean NOT NULL DEFAULT true`,
    );
    await queryRunner.query(
      `ALTER TABLE "telemedicina" ADD "suporte_streaming" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "telemedicina" ADD "suporte_gravacao" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "telemedicina" ADD "antecedencia_minima_cancelamento" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "telemedicina" ADD "antecedencia_minima_agendamento" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "telemedicina" ADD "permite_cancelamento_online" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "telemedicina" ADD "permite_agendamento_online" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "telemedicina" ADD "tempo_consulta_padrao" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "telemedicina" ADD "telemonitoramento" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "telemedicina" ADD "telecirurgia" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "telemedicina" ADD "telediagnostico" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "telemedicina" ADD "teleconsulta" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."telemedicina_tipo_plataforma_enum" AS ENUM('desktop', 'hibrida', 'mobile', 'web')`,
    );
    await queryRunner.query(
      `ALTER TABLE "telemedicina" ADD "tipo_plataforma" "public"."telemedicina_tipo_plataforma_enum" NOT NULL DEFAULT 'web'`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."telemedicina_status_integracao_enum" AS ENUM('ativo', 'inativo', 'manutencao', 'teste')`,
    );
    await queryRunner.query(
      `ALTER TABLE "telemedicina" ADD "status_integracao" "public"."telemedicina_status_integracao_enum" NOT NULL DEFAULT 'inativo'`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."telemedicina_tipo_integracao_enum" AS ENUM('api_rest', 'dicom', 'fhir', 'hl7', 'manual', 'webhook')`,
    );
    await queryRunner.query(
      `ALTER TABLE "telemedicina" ADD "tipo_integracao" "public"."telemedicina_tipo_integracao_enum" NOT NULL DEFAULT 'manual'`,
    );
  }
}
