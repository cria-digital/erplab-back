import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateProfissionaisAgendasRelation1758132183106
  implements MigrationInterface
{
  name = 'CreateProfissionaisAgendasRelation1758132183106';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cnae_secundarios" DROP CONSTRAINT "FK_cnae_secundarios_cnae"`,
    );
    await queryRunner.query(
      `ALTER TABLE "unidades_saude" DROP CONSTRAINT "FK_unidades_saude_cnae"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."enderecos_estado_enum" AS ENUM('AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO')`,
    );
    await queryRunner.query(
      `CREATE TABLE "enderecos" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "cep" character varying NOT NULL, "rua" character varying NOT NULL, "numero" character varying NOT NULL, "bairro" character varying NOT NULL, "complemento" character varying, "cidade" character varying NOT NULL, "estado" "public"."enderecos_estado_enum" NOT NULL, "criadoEm" TIMESTAMP NOT NULL DEFAULT now(), "atualizadoEm" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_208b05002dcdf7bfbad378dcac1" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."documentos_profissional_tipo_enum" AS ENUM('DIPLOMA', 'CERTIFICADOS', 'CRM', 'COMPROVANTE_RESIDENCIA', 'COMPROVANTE_BANCARIO', 'ULTRASSONOGRAFIA_GERAL', 'ULTRASSONOGRAFIA_DOPPLER', 'RADIOLOGIA', 'TOMOGRAFIA')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."documentos_profissional_status_enum" AS ENUM('PENDENTE', 'APROVADO', 'REPROVADO', 'VENCIDO')`,
    );
    await queryRunner.query(
      `CREATE TABLE "documentos_profissional" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "profissionalId" uuid NOT NULL, "tipo" "public"."documentos_profissional_tipo_enum" NOT NULL, "arquivo" character varying, "validade" date, "status" "public"."documentos_profissional_status_enum" NOT NULL DEFAULT 'PENDENTE', "observacoes" text, "criadoEm" TIMESTAMP NOT NULL DEFAULT now(), "atualizadoEm" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_f38ad347047e505ef65ad3fbe5f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."periodos_atendimento_periodo_enum" AS ENUM('MANHA', 'TARDE', 'NOITE', 'INTEGRAL')`,
    );
    await queryRunner.query(
      `CREATE TABLE "periodos_atendimento" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "configuracaoAgendaId" uuid NOT NULL, "periodo" "public"."periodos_atendimento_periodo_enum" NOT NULL, "horarioInicio" TIME NOT NULL, "horarioFim" TIME NOT NULL, "diasSemana" text, "dataEspecifica" date, "intervaloPeriodo" integer, "capacidadePeriodo" integer, CONSTRAINT "PK_370573de81e33b58d44bc1210c7" PRIMARY KEY ("id")); COMMENT ON COLUMN "periodos_atendimento"."intervaloPeriodo" IS 'Intervalo em minutos'`,
    );
    await queryRunner.query(
      `CREATE TABLE "horarios_especificos" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "configuracaoAgendaId" uuid NOT NULL, "data" date NOT NULL, "horaInicio" TIME NOT NULL, "horaFim" TIME NOT NULL, "capacidade" integer, "isFeriado" boolean NOT NULL DEFAULT false, "isPeriodoFacultativo" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_498bca0adb442a63ed1bda9c2a0" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "bloqueios_horario" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "configuracaoAgendaId" uuid NOT NULL, "dataInicio" date NOT NULL, "horaInicio" TIME NOT NULL, "dataFim" date, "horaFim" TIME, "observacao" character varying, "motivoBloqueio" character varying, CONSTRAINT "PK_09a58bc0a6a74e46edbfbcd6ef2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "configuracoes_agenda" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "agendaId" uuid NOT NULL, "diasSemana" text NOT NULL, "intervaloAgendamento" integer NOT NULL, "capacidadeTotal" integer, "capacidadePorHorario" integer, CONSTRAINT "REL_8db56908d246e7fa45a9251cde" UNIQUE ("agendaId"), CONSTRAINT "PK_91717d2e56a2584decc94d9e13f" PRIMARY KEY ("id")); COMMENT ON COLUMN "configuracoes_agenda"."intervaloAgendamento" IS 'Intervalo em minutos'`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."vinculacoes_agenda_tipo_enum" AS ENUM('ESPECIALIDADE', 'SETOR', 'PROFISSIONAL', 'EQUIPAMENTO')`,
    );
    await queryRunner.query(
      `CREATE TABLE "vinculacoes_agenda" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "agendaId" uuid NOT NULL, "tipo" "public"."vinculacoes_agenda_tipo_enum" NOT NULL, "entidadeVinculadaId" character varying NOT NULL, "entidadeVinculadaNome" character varying, "opcaoAdicional" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_288df50a048870ab6110c60999e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."notificacoes_agenda_prazolembretetipo_enum" AS ENUM('HORAS', 'DIAS')`,
    );
    await queryRunner.query(
      `CREATE TABLE "notificacoes_agenda" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "agendaId" uuid NOT NULL, "notificarEmail" boolean NOT NULL DEFAULT false, "notificarWhatsapp" boolean NOT NULL DEFAULT false, "notificarSMS" boolean NOT NULL DEFAULT false, "prazoLembrete" integer, "prazoLembreteTipo" "public"."notificacoes_agenda_prazolembretetipo_enum", CONSTRAINT "REL_b30fb3e0f0d4dc0fd120d80a46" UNIQUE ("agendaId"), CONSTRAINT "PK_e493d9235c7dac2f5db6285dcbb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."canais_integracao_tipointegracao_enum" AS ENUM('API', 'WEBHOOK', 'EMAIL', 'SMS', 'WHATSAPP')`,
    );
    await queryRunner.query(
      `CREATE TABLE "canais_integracao" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "agendaId" uuid NOT NULL, "nomeCanal" character varying NOT NULL, "tipoIntegracao" "public"."canais_integracao_tipointegracao_enum" NOT NULL, "integracaoConvenios" boolean NOT NULL DEFAULT false, "configuracaoJson" json, CONSTRAINT "PK_007e9071bc4059225ee23220d0e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."agendas_status_enum" AS ENUM('ATIVO', 'INATIVO')`,
    );
    await queryRunner.query(
      `CREATE TABLE "agendas" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "codigoInterno" character varying NOT NULL, "nomeAgenda" character varying NOT NULL, "descricao" character varying, "unidadeAssociadaId" uuid, "setorId" character varying, "salaId" character varying, "especialidadeId" character varying, "equipamentoId" character varying, "status" "public"."agendas_status_enum" NOT NULL DEFAULT 'ATIVO', "criadoEm" TIMESTAMP NOT NULL DEFAULT now(), "atualizadoEm" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_a595efaeddf90015a74ca2c4eb7" UNIQUE ("codigoInterno"), CONSTRAINT "PK_5fea8668c8712b8292ded824549" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."profissionais_pronomespessoal_enum" AS ENUM('DR', 'DRA', 'SR', 'SRA', 'MASCULINO', 'FEMININO')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."profissionais_sexo_enum" AS ENUM('MASCULINO', 'FEMININO')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."profissionais_tipocontratacao_enum" AS ENUM('CLT', 'PJ', 'AUTONOMO')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."profissionais_tipoprofissional_enum" AS ENUM('REALIZANTE', 'SOLICITANTE', 'AMBOS')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."profissionais_estadoconselho_enum" AS ENUM('AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO')`,
    );
    await queryRunner.query(
      `CREATE TABLE "profissionais" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "pronomesPessoal" "public"."profissionais_pronomespessoal_enum" NOT NULL, "nomeCompleto" character varying NOT NULL, "cpf" character varying NOT NULL, "dataNascimento" date NOT NULL, "sexo" "public"."profissionais_sexo_enum" NOT NULL, "celular" character varying NOT NULL, "email" character varying NOT NULL, "tipoContratacao" "public"."profissionais_tipocontratacao_enum" NOT NULL, "profissao" character varying NOT NULL, "codigoInterno" character varying NOT NULL, "tipoProfissional" "public"."profissionais_tipoprofissional_enum" NOT NULL, "nomeConselho" character varying NOT NULL, "numeroConselho" character varying NOT NULL, "estadoConselho" "public"."profissionais_estadoconselho_enum" NOT NULL, "codigoCBO" character varying NOT NULL, "rqe" character varying, "especialidadePrincipal" character varying, "possuiAssinaturaDigital" boolean NOT NULL DEFAULT false, "enderecoId" uuid, "ativo" boolean NOT NULL DEFAULT true, "criadoEm" TIMESTAMP NOT NULL DEFAULT now(), "atualizadoEm" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_56fdd821f35e9c6da11d4e6690b" UNIQUE ("cpf"), CONSTRAINT "UQ_2973ffcacfe6082af837a44912f" UNIQUE ("codigoInterno"), CONSTRAINT "PK_a6a3048111c78bd06ecd3b1360c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "profissionais_agendas" ("profissional_id" uuid NOT NULL, "agenda_id" uuid NOT NULL, CONSTRAINT "PK_52f520ecfa829720ed04fbad0d1" PRIMARY KEY ("profissional_id", "agenda_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_59675c95290a561b490d2feb50" ON "profissionais_agendas" ("profissional_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9a21212fcf976be9a719bb03ee" ON "profissionais_agendas" ("agenda_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "cnae_secundarios" ALTER COLUMN "cnae_id" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "cnae_secundarios" ADD CONSTRAINT "FK_7a532fd2870c03180b99d96aeb6" FOREIGN KEY ("cnae_id") REFERENCES "cnaes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "unidades_saude" ADD CONSTRAINT "FK_e2b8c459f23f189d0b6faff8285" FOREIGN KEY ("cnae_principal_id") REFERENCES "cnaes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "documentos_profissional" ADD CONSTRAINT "FK_4f8d05665a230f2d594fb5838cd" FOREIGN KEY ("profissionalId") REFERENCES "profissionais"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "periodos_atendimento" ADD CONSTRAINT "FK_ad2618709cd725f9e92f47cc7ef" FOREIGN KEY ("configuracaoAgendaId") REFERENCES "configuracoes_agenda"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "horarios_especificos" ADD CONSTRAINT "FK_37b24c2fcc24d0ed71097996063" FOREIGN KEY ("configuracaoAgendaId") REFERENCES "configuracoes_agenda"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "bloqueios_horario" ADD CONSTRAINT "FK_5ca593aacb3c99f576a57bce121" FOREIGN KEY ("configuracaoAgendaId") REFERENCES "configuracoes_agenda"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "configuracoes_agenda" ADD CONSTRAINT "FK_8db56908d246e7fa45a9251cde4" FOREIGN KEY ("agendaId") REFERENCES "agendas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "vinculacoes_agenda" ADD CONSTRAINT "FK_e31c30ad9aebc053baef5d99813" FOREIGN KEY ("agendaId") REFERENCES "agendas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notificacoes_agenda" ADD CONSTRAINT "FK_b30fb3e0f0d4dc0fd120d80a46f" FOREIGN KEY ("agendaId") REFERENCES "agendas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "canais_integracao" ADD CONSTRAINT "FK_653833538b90785ad684693ff4a" FOREIGN KEY ("agendaId") REFERENCES "agendas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "agendas" ADD CONSTRAINT "FK_19962cd9467953fe95bd3bf427b" FOREIGN KEY ("unidadeAssociadaId") REFERENCES "unidades_saude"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "profissionais" ADD CONSTRAINT "FK_82e57cc4d75f12a3ac1f11d266d" FOREIGN KEY ("enderecoId") REFERENCES "enderecos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "profissionais_agendas" ADD CONSTRAINT "FK_59675c95290a561b490d2feb504" FOREIGN KEY ("profissional_id") REFERENCES "profissionais"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "profissionais_agendas" ADD CONSTRAINT "FK_9a21212fcf976be9a719bb03ee2" FOREIGN KEY ("agenda_id") REFERENCES "agendas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "profissionais_agendas" DROP CONSTRAINT "FK_9a21212fcf976be9a719bb03ee2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "profissionais_agendas" DROP CONSTRAINT "FK_59675c95290a561b490d2feb504"`,
    );
    await queryRunner.query(
      `ALTER TABLE "profissionais" DROP CONSTRAINT "FK_82e57cc4d75f12a3ac1f11d266d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "agendas" DROP CONSTRAINT "FK_19962cd9467953fe95bd3bf427b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "canais_integracao" DROP CONSTRAINT "FK_653833538b90785ad684693ff4a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notificacoes_agenda" DROP CONSTRAINT "FK_b30fb3e0f0d4dc0fd120d80a46f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "vinculacoes_agenda" DROP CONSTRAINT "FK_e31c30ad9aebc053baef5d99813"`,
    );
    await queryRunner.query(
      `ALTER TABLE "configuracoes_agenda" DROP CONSTRAINT "FK_8db56908d246e7fa45a9251cde4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bloqueios_horario" DROP CONSTRAINT "FK_5ca593aacb3c99f576a57bce121"`,
    );
    await queryRunner.query(
      `ALTER TABLE "horarios_especificos" DROP CONSTRAINT "FK_37b24c2fcc24d0ed71097996063"`,
    );
    await queryRunner.query(
      `ALTER TABLE "periodos_atendimento" DROP CONSTRAINT "FK_ad2618709cd725f9e92f47cc7ef"`,
    );
    await queryRunner.query(
      `ALTER TABLE "documentos_profissional" DROP CONSTRAINT "FK_4f8d05665a230f2d594fb5838cd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "unidades_saude" DROP CONSTRAINT "FK_e2b8c459f23f189d0b6faff8285"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cnae_secundarios" DROP CONSTRAINT "FK_7a532fd2870c03180b99d96aeb6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cnae_secundarios" ALTER COLUMN "cnae_id" DROP NOT NULL`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_9a21212fcf976be9a719bb03ee"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_59675c95290a561b490d2feb50"`,
    );
    await queryRunner.query(`DROP TABLE "profissionais_agendas"`);
    await queryRunner.query(`DROP TABLE "profissionais"`);
    await queryRunner.query(
      `DROP TYPE "public"."profissionais_estadoconselho_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."profissionais_tipoprofissional_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."profissionais_tipocontratacao_enum"`,
    );
    await queryRunner.query(`DROP TYPE "public"."profissionais_sexo_enum"`);
    await queryRunner.query(
      `DROP TYPE "public"."profissionais_pronomespessoal_enum"`,
    );
    await queryRunner.query(`DROP TABLE "agendas"`);
    await queryRunner.query(`DROP TYPE "public"."agendas_status_enum"`);
    await queryRunner.query(`DROP TABLE "canais_integracao"`);
    await queryRunner.query(
      `DROP TYPE "public"."canais_integracao_tipointegracao_enum"`,
    );
    await queryRunner.query(`DROP TABLE "notificacoes_agenda"`);
    await queryRunner.query(
      `DROP TYPE "public"."notificacoes_agenda_prazolembretetipo_enum"`,
    );
    await queryRunner.query(`DROP TABLE "vinculacoes_agenda"`);
    await queryRunner.query(
      `DROP TYPE "public"."vinculacoes_agenda_tipo_enum"`,
    );
    await queryRunner.query(`DROP TABLE "configuracoes_agenda"`);
    await queryRunner.query(`DROP TABLE "bloqueios_horario"`);
    await queryRunner.query(`DROP TABLE "horarios_especificos"`);
    await queryRunner.query(`DROP TABLE "periodos_atendimento"`);
    await queryRunner.query(
      `DROP TYPE "public"."periodos_atendimento_periodo_enum"`,
    );
    await queryRunner.query(`DROP TABLE "documentos_profissional"`);
    await queryRunner.query(
      `DROP TYPE "public"."documentos_profissional_status_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."documentos_profissional_tipo_enum"`,
    );
    await queryRunner.query(`DROP TABLE "enderecos"`);
    await queryRunner.query(`DROP TYPE "public"."enderecos_estado_enum"`);
    await queryRunner.query(
      `ALTER TABLE "unidades_saude" ADD CONSTRAINT "FK_unidades_saude_cnae" FOREIGN KEY ("cnae_principal_id") REFERENCES "cnaes"("id") ON DELETE SET NULL ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "cnae_secundarios" ADD CONSTRAINT "FK_cnae_secundarios_cnae" FOREIGN KEY ("cnae_id") REFERENCES "cnaes"("id") ON DELETE SET NULL ON UPDATE CASCADE`,
    );
  }
}
