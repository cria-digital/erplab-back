import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddExameFieldsAndLaboratoriosApoio1764707243056
  implements MigrationInterface
{
  name = 'AddExameFieldsAndLaboratoriosApoio1764707243056';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Adicionar novos campos na tabela exames
    await queryRunner.query(`
      ALTER TABLE "exames"
      ADD COLUMN IF NOT EXISTS "requer_peso" boolean NOT NULL DEFAULT false,
      ADD COLUMN IF NOT EXISTS "requer_altura" boolean NOT NULL DEFAULT false,
      ADD COLUMN IF NOT EXISTS "requer_volume" boolean NOT NULL DEFAULT false,
      ADD COLUMN IF NOT EXISTS "volume_minimo_id" uuid,
      ADD COLUMN IF NOT EXISTS "formato_laudo_id" uuid,
      ADD COLUMN IF NOT EXISTS "termo_consentimento" boolean NOT NULL DEFAULT false,
      ADD COLUMN IF NOT EXISTS "preparo_geral" text,
      ADD COLUMN IF NOT EXISTS "preparo_feminino" text,
      ADD COLUMN IF NOT EXISTS "preparo_infantil" text,
      ADD COLUMN IF NOT EXISTS "coleta_geral" text,
      ADD COLUMN IF NOT EXISTS "coleta_feminino" text,
      ADD COLUMN IF NOT EXISTS "coleta_infantil" text,
      ADD COLUMN IF NOT EXISTS "lembrete_coletora" text,
      ADD COLUMN IF NOT EXISTS "lembrete_recepcionista_agendamento" text,
      ADD COLUMN IF NOT EXISTS "lembrete_recepcionista_os" text
    `);

    // 2. Criar tabela de relacionamento N:M entre exames e unidades de saúde
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "exames_unidades" (
        "exame_id" uuid NOT NULL,
        "unidade_id" uuid NOT NULL,
        CONSTRAINT "PK_exames_unidades" PRIMARY KEY ("exame_id", "unidade_id"),
        CONSTRAINT "FK_exames_unidades_exame" FOREIGN KEY ("exame_id")
          REFERENCES "exames"("id") ON DELETE CASCADE ON UPDATE NO ACTION,
        CONSTRAINT "FK_exames_unidades_unidade" FOREIGN KEY ("unidade_id")
          REFERENCES "unidades_saude"("id") ON DELETE CASCADE ON UPDATE NO ACTION
      )
    `);

    // Criar índices para a tabela de relacionamento
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_exames_unidades_exame_id" ON "exames_unidades" ("exame_id")
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_exames_unidades_unidade_id" ON "exames_unidades" ("unidade_id")
    `);

    // 3. Criar tabela de configurações específicas por laboratório de apoio
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "exames_laboratorios_apoio" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "exame_id" uuid NOT NULL,
        "laboratorio_apoio_id" uuid NOT NULL,
        "codigo_exame_apoio" varchar(50),
        "metodologia_id" uuid,
        "unidade_medida_id" uuid,
        "requer_peso" boolean NOT NULL DEFAULT false,
        "requer_altura" boolean NOT NULL DEFAULT false,
        "requer_volume" boolean NOT NULL DEFAULT false,
        "amostra_id" uuid,
        "amostra_enviar_id" uuid,
        "tipo_recipiente_id" uuid,
        "regioes_coleta_ids" jsonb,
        "volume_minimo_id" uuid,
        "estabilidade_id" uuid,
        "formularios_atendimento" jsonb,
        "preparo_geral" text,
        "preparo_feminino" text,
        "preparo_infantil" text,
        "coleta_geral" text,
        "coleta_feminino" text,
        "coleta_infantil" text,
        "tecnica_coleta" text,
        "lembrete_coletora" text,
        "lembrete_recepcionista_agendamento" text,
        "lembrete_recepcionista_os" text,
        "distribuicao" text,
        "prazo_entrega_dias" integer,
        "formato_laudo_id" uuid,
        "ativo" boolean NOT NULL DEFAULT true,
        "criado_em" TIMESTAMP NOT NULL DEFAULT now(),
        "atualizado_em" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_exames_laboratorios_apoio" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_exames_laboratorios_apoio" UNIQUE ("exame_id", "laboratorio_apoio_id"),
        CONSTRAINT "FK_exames_laboratorios_apoio_exame" FOREIGN KEY ("exame_id")
          REFERENCES "exames"("id") ON DELETE CASCADE ON UPDATE NO ACTION,
        CONSTRAINT "FK_exames_laboratorios_apoio_lab" FOREIGN KEY ("laboratorio_apoio_id")
          REFERENCES "laboratorios_apoio"("id") ON DELETE CASCADE ON UPDATE NO ACTION
      )
    `);

    // Criar índices para a tabela de laboratórios de apoio
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_exames_laboratorios_apoio_exame_lab"
      ON "exames_laboratorios_apoio" ("exame_id", "laboratorio_apoio_id")
    `);

    // Adicionar comentários nas colunas
    await queryRunner.query(`
      COMMENT ON COLUMN "exames"."requer_peso" IS 'Se o exame requer peso do paciente';
      COMMENT ON COLUMN "exames"."requer_altura" IS 'Se o exame requer altura do paciente';
      COMMENT ON COLUMN "exames"."requer_volume" IS 'Se o exame requer volume específico';
      COMMENT ON COLUMN "exames"."volume_minimo_id" IS 'FK para alternativa do campo volume_minimo';
      COMMENT ON COLUMN "exames"."formato_laudo_id" IS 'FK para alternativa do campo formato_laudo';
      COMMENT ON COLUMN "exames"."termo_consentimento" IS 'Se o exame requer termo de consentimento';
      COMMENT ON COLUMN "exames"."preparo_geral" IS 'Instruções de preparo - Público geral';
      COMMENT ON COLUMN "exames"."preparo_feminino" IS 'Instruções de preparo - Feminino';
      COMMENT ON COLUMN "exames"."preparo_infantil" IS 'Instruções de preparo - Infantil';
      COMMENT ON COLUMN "exames"."coleta_geral" IS 'Instruções de coleta - Público geral';
      COMMENT ON COLUMN "exames"."coleta_feminino" IS 'Instruções de coleta - Feminino';
      COMMENT ON COLUMN "exames"."coleta_infantil" IS 'Instruções de coleta - Infantil';
      COMMENT ON COLUMN "exames"."lembrete_coletora" IS 'Lembrete para coletora';
      COMMENT ON COLUMN "exames"."lembrete_recepcionista_agendamento" IS 'Lembrete para recepcionista - Agendamentos e Orçamentos';
      COMMENT ON COLUMN "exames"."lembrete_recepcionista_os" IS 'Lembrete para recepcionista - Ordem de Serviço';
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remover tabela de laboratórios de apoio
    await queryRunner.query(`DROP TABLE IF EXISTS "exames_laboratorios_apoio"`);

    // Remover tabela de relacionamento N:M
    await queryRunner.query(`DROP TABLE IF EXISTS "exames_unidades"`);

    // Remover colunas adicionadas na tabela exames
    await queryRunner.query(`
      ALTER TABLE "exames"
      DROP COLUMN IF EXISTS "requer_peso",
      DROP COLUMN IF EXISTS "requer_altura",
      DROP COLUMN IF EXISTS "requer_volume",
      DROP COLUMN IF EXISTS "volume_minimo_id",
      DROP COLUMN IF EXISTS "formato_laudo_id",
      DROP COLUMN IF EXISTS "termo_consentimento",
      DROP COLUMN IF EXISTS "preparo_geral",
      DROP COLUMN IF EXISTS "preparo_feminino",
      DROP COLUMN IF EXISTS "preparo_infantil",
      DROP COLUMN IF EXISTS "coleta_geral",
      DROP COLUMN IF EXISTS "coleta_feminino",
      DROP COLUMN IF EXISTS "coleta_infantil",
      DROP COLUMN IF EXISTS "lembrete_coletora",
      DROP COLUMN IF EXISTS "lembrete_recepcionista_agendamento",
      DROP COLUMN IF EXISTS "lembrete_recepcionista_os"
    `);
  }
}
