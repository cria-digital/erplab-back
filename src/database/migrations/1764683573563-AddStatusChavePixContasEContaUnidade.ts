import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddStatusChavePixContasEContaUnidade1764683573563
  implements MigrationInterface
{
  name = 'AddStatusChavePixContasEContaUnidade1764683573563';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "periodos_atendimento" DROP CONSTRAINT "FK_ad2618709cd725f9e92f47cc7ef"`,
    );
    await queryRunner.query(
      `ALTER TABLE "horarios_especificos" DROP CONSTRAINT "FK_37b24c2fcc24d0ed71097996063"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bloqueios_horario" DROP CONSTRAINT "FK_5ca593aacb3c99f576a57bce121"`,
    );
    await queryRunner.query(
      `ALTER TABLE "vinculacoes_agenda" DROP CONSTRAINT "FK_e31c30ad9aebc053baef5d99813"`,
    );
    await queryRunner.query(
      `ALTER TABLE "agendas" DROP CONSTRAINT "FK_19962cd9467953fe95bd3bf427b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "periodos_atendimento" DROP COLUMN "configuracaoAgendaId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "periodos_atendimento" DROP COLUMN "periodo"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."periodos_atendimento_periodo_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "periodos_atendimento" DROP COLUMN "horarioInicio"`,
    );
    await queryRunner.query(
      `ALTER TABLE "periodos_atendimento" DROP COLUMN "horarioFim"`,
    );
    await queryRunner.query(
      `ALTER TABLE "periodos_atendimento" DROP COLUMN "dataEspecifica"`,
    );
    await queryRunner.query(
      `ALTER TABLE "periodos_atendimento" DROP COLUMN "intervaloPeriodo"`,
    );
    await queryRunner.query(
      `ALTER TABLE "periodos_atendimento" DROP COLUMN "capacidadePeriodo"`,
    );
    await queryRunner.query(
      `ALTER TABLE "periodos_atendimento" DROP COLUMN "diasSemana"`,
    );
    await queryRunner.query(
      `ALTER TABLE "horarios_especificos" DROP COLUMN "configuracaoAgendaId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "horarios_especificos" DROP COLUMN "data"`,
    );
    await queryRunner.query(
      `ALTER TABLE "horarios_especificos" DROP COLUMN "horaInicio"`,
    );
    await queryRunner.query(
      `ALTER TABLE "horarios_especificos" DROP COLUMN "horaFim"`,
    );
    await queryRunner.query(
      `ALTER TABLE "horarios_especificos" DROP COLUMN "capacidade"`,
    );
    await queryRunner.query(
      `ALTER TABLE "horarios_especificos" DROP COLUMN "isFeriado"`,
    );
    await queryRunner.query(
      `ALTER TABLE "horarios_especificos" DROP COLUMN "isPeriodoFacultativo"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bloqueios_horario" DROP COLUMN "configuracaoAgendaId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bloqueios_horario" DROP COLUMN "dataInicio"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bloqueios_horario" DROP COLUMN "horaInicio"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bloqueios_horario" DROP COLUMN "dataFim"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bloqueios_horario" DROP COLUMN "horaFim"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bloqueios_horario" DROP COLUMN "motivoBloqueio"`,
    );
    await queryRunner.query(
      `ALTER TABLE "vinculacoes_agenda" DROP COLUMN "agendaId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "vinculacoes_agenda" DROP COLUMN "opcaoAdicional"`,
    );
    await queryRunner.query(
      `ALTER TABLE "vinculacoes_agenda" DROP COLUMN "entidadeVinculadaId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "vinculacoes_agenda" DROP COLUMN "entidadeVinculadaNome"`,
    );
    await queryRunner.query(
      `ALTER TABLE "agendas" DROP COLUMN "unidadeAssociadaId"`,
    );
    await queryRunner.query(`ALTER TABLE "agendas" DROP COLUMN "status"`);
    await queryRunner.query(`DROP TYPE "public"."agendas_status_enum"`);
    await queryRunner.query(`ALTER TABLE "agendas" DROP COLUMN "criadoEm"`);
    await queryRunner.query(`ALTER TABLE "agendas" DROP COLUMN "atualizadoEm"`);
    await queryRunner.query(
      `ALTER TABLE "agendas" DROP CONSTRAINT "UQ_a595efaeddf90015a74ca2c4eb7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "agendas" DROP COLUMN "codigoInterno"`,
    );
    await queryRunner.query(`ALTER TABLE "agendas" DROP COLUMN "nomeAgenda"`);
    await queryRunner.query(`ALTER TABLE "agendas" DROP COLUMN "setorId"`);
    await queryRunner.query(`ALTER TABLE "agendas" DROP COLUMN "salaId"`);
    await queryRunner.query(
      `ALTER TABLE "agendas" DROP COLUMN "especialidadeId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "agendas" DROP COLUMN "equipamentoId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "unidades_saude" ADD "conta_bancaria_id" uuid`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."contas_bancarias_status_enum" AS ENUM('ativo', 'inativo', 'suspenso')`,
    );
    await queryRunner.query(
      `ALTER TABLE "contas_bancarias" ADD "status" "public"."contas_bancarias_status_enum" NOT NULL DEFAULT 'ativo'`,
    );
    await queryRunner.query(
      `ALTER TABLE "contas_bancarias" ADD "chave_pix" character varying(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "periodos_atendimento" ADD "agenda_id" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "periodos_atendimento" ADD "horario_inicio" TIME NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "periodos_atendimento" ADD "horario_fim" TIME NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "horarios_especificos" ADD "agenda_id" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "horarios_especificos" ADD "data_especifica" date NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "horarios_especificos" ADD "horario_especifico" TIME NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "bloqueios_horario" ADD "agenda_id" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "bloqueios_horario" ADD "dia_bloquear" date NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "bloqueios_horario" ADD "horario_inicio" TIME NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "bloqueios_horario" ADD "horario_fim" TIME NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "vinculacoes_agenda" ADD "agenda_id" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "vinculacoes_agenda" ADD "entidade_vinculada_id" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "agendas" ADD "codigo_interno" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "agendas" ADD CONSTRAINT "UQ_210c1b8b14963ecc5494a75f523" UNIQUE ("codigo_interno")`,
    );
    await queryRunner.query(
      `ALTER TABLE "agendas" ADD "nome_agenda" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "agendas" ADD "unidade_id" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "agendas" ADD "setor" character varying`,
    );
    await queryRunner.query(`ALTER TABLE "agendas" ADD "sala_id" uuid`);
    await queryRunner.query(`ALTER TABLE "agendas" ADD "profissional_id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "agendas" ADD "especialidade_id" uuid`,
    );
    await queryRunner.query(`ALTER TABLE "agendas" ADD "equipamento_id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "agendas" ADD "dias_semana" text NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "agendas" ADD "intervalo_agendamento" integer NOT NULL`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "agendas"."intervalo_agendamento" IS 'Intervalo em minutos'`,
    );
    await queryRunner.query(
      `ALTER TABLE "agendas" ADD "capacidade_por_horario" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "agendas" ADD "capacidade_total" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "agendas" ADD "notificar_email" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "agendas" ADD "notificar_whatsapp" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "agendas" ADD "prazo_lembrete" character varying`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "agendas"."prazo_lembrete" IS 'Prazo em horas para lembrete'`,
    );
    await queryRunner.query(
      `ALTER TABLE "agendas" ADD "integracao_convenios" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "agendas" ADD "ativo" boolean NOT NULL DEFAULT true`,
    );
    await queryRunner.query(
      `ALTER TABLE "agendas" ADD "criado_em" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "agendas" ADD "atualizado_em" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_config_campos_entidade"`);
    await queryRunner.query(
      `ALTER TABLE "configuracoes_campos_formulario" ALTER COLUMN "tipo_formulario" DROP DEFAULT`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_config_campos_entidade" ON "configuracoes_campos_formulario" ("entidade_tipo", "entidade_id", "tipo_formulario") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_agendas_codigo_interno" ON "agendas" ("codigo_interno") `,
    );
    await queryRunner.query(
      `ALTER TABLE "unidades_saude" ADD CONSTRAINT "FK_c66f872703f94bc73a73b2471c9" FOREIGN KEY ("conta_bancaria_id") REFERENCES "contas_bancarias"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "periodos_atendimento" ADD CONSTRAINT "FK_e2d54a2cc9a935969918041804e" FOREIGN KEY ("agenda_id") REFERENCES "agendas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "horarios_especificos" ADD CONSTRAINT "FK_345d857d7d9e25bb2fac238e665" FOREIGN KEY ("agenda_id") REFERENCES "agendas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "bloqueios_horario" ADD CONSTRAINT "FK_60dd9675fa590e1e3d368c81726" FOREIGN KEY ("agenda_id") REFERENCES "agendas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "vinculacoes_agenda" ADD CONSTRAINT "FK_6bd48cd81ba563b66d9f0b7a2b5" FOREIGN KEY ("agenda_id") REFERENCES "agendas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "agendas" ADD CONSTRAINT "FK_8a58542f4bb5e4ae19d02d5cd58" FOREIGN KEY ("unidade_id") REFERENCES "unidades_saude"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "agendas" ADD CONSTRAINT "FK_8a5726c572b31cbdc4286518a1c" FOREIGN KEY ("sala_id") REFERENCES "salas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "agendas" ADD CONSTRAINT "FK_929a8f39c2ec977b2b45e495f20" FOREIGN KEY ("profissional_id") REFERENCES "profissionais"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "agendas" ADD CONSTRAINT "FK_3feb4f9dc1787d7bc880d1a2a2f" FOREIGN KEY ("especialidade_id") REFERENCES "especialidades"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "agendas" ADD CONSTRAINT "FK_0aef66827d42fdb135e0ba2d0c6" FOREIGN KEY ("equipamento_id") REFERENCES "equipamentos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "agendas" DROP CONSTRAINT "FK_0aef66827d42fdb135e0ba2d0c6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "agendas" DROP CONSTRAINT "FK_3feb4f9dc1787d7bc880d1a2a2f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "agendas" DROP CONSTRAINT "FK_929a8f39c2ec977b2b45e495f20"`,
    );
    await queryRunner.query(
      `ALTER TABLE "agendas" DROP CONSTRAINT "FK_8a5726c572b31cbdc4286518a1c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "agendas" DROP CONSTRAINT "FK_8a58542f4bb5e4ae19d02d5cd58"`,
    );
    await queryRunner.query(
      `ALTER TABLE "vinculacoes_agenda" DROP CONSTRAINT "FK_6bd48cd81ba563b66d9f0b7a2b5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bloqueios_horario" DROP CONSTRAINT "FK_60dd9675fa590e1e3d368c81726"`,
    );
    await queryRunner.query(
      `ALTER TABLE "horarios_especificos" DROP CONSTRAINT "FK_345d857d7d9e25bb2fac238e665"`,
    );
    await queryRunner.query(
      `ALTER TABLE "periodos_atendimento" DROP CONSTRAINT "FK_e2d54a2cc9a935969918041804e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "unidades_saude" DROP CONSTRAINT "FK_c66f872703f94bc73a73b2471c9"`,
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_agendas_codigo_interno"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_config_campos_entidade"`);
    await queryRunner.query(
      `ALTER TABLE "configuracoes_campos_formulario" ALTER COLUMN "tipo_formulario" SET DEFAULT 'cadastro_paciente'`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_config_campos_entidade" ON "configuracoes_campos_formulario" ("entidade_tipo", "entidade_id", "tipo_formulario") `,
    );
    await queryRunner.query(
      `ALTER TABLE "agendas" DROP COLUMN "atualizado_em"`,
    );
    await queryRunner.query(`ALTER TABLE "agendas" DROP COLUMN "criado_em"`);
    await queryRunner.query(`ALTER TABLE "agendas" DROP COLUMN "ativo"`);
    await queryRunner.query(
      `ALTER TABLE "agendas" DROP COLUMN "integracao_convenios"`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "agendas"."prazo_lembrete" IS 'Prazo em horas para lembrete'`,
    );
    await queryRunner.query(
      `ALTER TABLE "agendas" DROP COLUMN "prazo_lembrete"`,
    );
    await queryRunner.query(
      `ALTER TABLE "agendas" DROP COLUMN "notificar_whatsapp"`,
    );
    await queryRunner.query(
      `ALTER TABLE "agendas" DROP COLUMN "notificar_email"`,
    );
    await queryRunner.query(
      `ALTER TABLE "agendas" DROP COLUMN "capacidade_total"`,
    );
    await queryRunner.query(
      `ALTER TABLE "agendas" DROP COLUMN "capacidade_por_horario"`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "agendas"."intervalo_agendamento" IS 'Intervalo em minutos'`,
    );
    await queryRunner.query(
      `ALTER TABLE "agendas" DROP COLUMN "intervalo_agendamento"`,
    );
    await queryRunner.query(`ALTER TABLE "agendas" DROP COLUMN "dias_semana"`);
    await queryRunner.query(
      `ALTER TABLE "agendas" DROP COLUMN "equipamento_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "agendas" DROP COLUMN "especialidade_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "agendas" DROP COLUMN "profissional_id"`,
    );
    await queryRunner.query(`ALTER TABLE "agendas" DROP COLUMN "sala_id"`);
    await queryRunner.query(`ALTER TABLE "agendas" DROP COLUMN "setor"`);
    await queryRunner.query(`ALTER TABLE "agendas" DROP COLUMN "unidade_id"`);
    await queryRunner.query(`ALTER TABLE "agendas" DROP COLUMN "nome_agenda"`);
    await queryRunner.query(
      `ALTER TABLE "agendas" DROP CONSTRAINT "UQ_210c1b8b14963ecc5494a75f523"`,
    );
    await queryRunner.query(
      `ALTER TABLE "agendas" DROP COLUMN "codigo_interno"`,
    );
    await queryRunner.query(
      `ALTER TABLE "vinculacoes_agenda" DROP COLUMN "entidade_vinculada_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "vinculacoes_agenda" DROP COLUMN "agenda_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bloqueios_horario" DROP COLUMN "horario_fim"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bloqueios_horario" DROP COLUMN "horario_inicio"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bloqueios_horario" DROP COLUMN "dia_bloquear"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bloqueios_horario" DROP COLUMN "agenda_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "horarios_especificos" DROP COLUMN "horario_especifico"`,
    );
    await queryRunner.query(
      `ALTER TABLE "horarios_especificos" DROP COLUMN "data_especifica"`,
    );
    await queryRunner.query(
      `ALTER TABLE "horarios_especificos" DROP COLUMN "agenda_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "periodos_atendimento" DROP COLUMN "horario_fim"`,
    );
    await queryRunner.query(
      `ALTER TABLE "periodos_atendimento" DROP COLUMN "horario_inicio"`,
    );
    await queryRunner.query(
      `ALTER TABLE "periodos_atendimento" DROP COLUMN "agenda_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contas_bancarias" DROP COLUMN "chave_pix"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contas_bancarias" DROP COLUMN "status"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."contas_bancarias_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "unidades_saude" DROP COLUMN "conta_bancaria_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "agendas" ADD "equipamentoId" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "agendas" ADD "especialidadeId" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "agendas" ADD "salaId" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "agendas" ADD "setorId" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "agendas" ADD "nomeAgenda" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "agendas" ADD "codigoInterno" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "agendas" ADD CONSTRAINT "UQ_a595efaeddf90015a74ca2c4eb7" UNIQUE ("codigoInterno")`,
    );
    await queryRunner.query(
      `ALTER TABLE "agendas" ADD "atualizadoEm" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "agendas" ADD "criadoEm" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."agendas_status_enum" AS ENUM('ATIVO', 'INATIVO')`,
    );
    await queryRunner.query(
      `ALTER TABLE "agendas" ADD "status" "public"."agendas_status_enum" NOT NULL DEFAULT 'ATIVO'`,
    );
    await queryRunner.query(
      `ALTER TABLE "agendas" ADD "unidadeAssociadaId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "vinculacoes_agenda" ADD "entidadeVinculadaNome" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "vinculacoes_agenda" ADD "entidadeVinculadaId" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "vinculacoes_agenda" ADD "opcaoAdicional" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "vinculacoes_agenda" ADD "agendaId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "bloqueios_horario" ADD "motivoBloqueio" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "bloqueios_horario" ADD "horaFim" TIME`,
    );
    await queryRunner.query(
      `ALTER TABLE "bloqueios_horario" ADD "dataFim" date`,
    );
    await queryRunner.query(
      `ALTER TABLE "bloqueios_horario" ADD "horaInicio" TIME NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "bloqueios_horario" ADD "dataInicio" date NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "bloqueios_horario" ADD "configuracaoAgendaId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "horarios_especificos" ADD "isPeriodoFacultativo" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "horarios_especificos" ADD "isFeriado" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "horarios_especificos" ADD "capacidade" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "horarios_especificos" ADD "horaFim" TIME NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "horarios_especificos" ADD "horaInicio" TIME NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "horarios_especificos" ADD "data" date NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "horarios_especificos" ADD "configuracaoAgendaId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "periodos_atendimento" ADD "diasSemana" text`,
    );
    await queryRunner.query(
      `ALTER TABLE "periodos_atendimento" ADD "capacidadePeriodo" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "periodos_atendimento" ADD "intervaloPeriodo" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "periodos_atendimento" ADD "dataEspecifica" date`,
    );
    await queryRunner.query(
      `ALTER TABLE "periodos_atendimento" ADD "horarioFim" TIME NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "periodos_atendimento" ADD "horarioInicio" TIME NOT NULL`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."periodos_atendimento_periodo_enum" AS ENUM('INTEGRAL', 'MANHA', 'NOITE', 'TARDE')`,
    );
    await queryRunner.query(
      `ALTER TABLE "periodos_atendimento" ADD "periodo" "public"."periodos_atendimento_periodo_enum" NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "periodos_atendimento" ADD "configuracaoAgendaId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "agendas" ADD CONSTRAINT "FK_19962cd9467953fe95bd3bf427b" FOREIGN KEY ("unidadeAssociadaId") REFERENCES "unidades_saude"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "vinculacoes_agenda" ADD CONSTRAINT "FK_e31c30ad9aebc053baef5d99813" FOREIGN KEY ("agendaId") REFERENCES "agendas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "bloqueios_horario" ADD CONSTRAINT "FK_5ca593aacb3c99f576a57bce121" FOREIGN KEY ("configuracaoAgendaId") REFERENCES "configuracoes_agenda"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "horarios_especificos" ADD CONSTRAINT "FK_37b24c2fcc24d0ed71097996063" FOREIGN KEY ("configuracaoAgendaId") REFERENCES "configuracoes_agenda"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "periodos_atendimento" ADD CONSTRAINT "FK_ad2618709cd725f9e92f47cc7ef" FOREIGN KEY ("configuracaoAgendaId") REFERENCES "configuracoes_agenda"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
