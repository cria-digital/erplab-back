import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCaixaAndFilaAtendimentoTables1765820500000
  implements MigrationInterface
{
  name = 'CreateCaixaAndFilaAtendimentoTables1765820500000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create enums
    await queryRunner.query(`
      CREATE TYPE "public"."caixas_status_enum" AS ENUM('aberto', 'fechado')
    `);

    await queryRunner.query(`
      CREATE TYPE "public"."senhas_atendimento_tipo_enum" AS ENUM('prioridade', 'geral')
    `);

    await queryRunner.query(`
      CREATE TYPE "public"."senhas_atendimento_status_enum" AS ENUM('aguardando', 'chamado', 'em_atendimento', 'finalizado', 'desistiu')
    `);

    // Create caixas table
    await queryRunner.query(`
      CREATE TABLE "caixas" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "usuario_id" uuid NOT NULL,
        "unidade_id" uuid NOT NULL,
        "valor_abertura" numeric(10,2) NOT NULL,
        "valor_fechamento" numeric(10,2),
        "data_abertura" TIMESTAMP NOT NULL,
        "data_fechamento" TIMESTAMP,
        "status" "public"."caixas_status_enum" NOT NULL DEFAULT 'aberto',
        "observacao_fechamento" text,
        "tenant_id" uuid,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_caixas_id" PRIMARY KEY ("id")
      )
    `);

    // Create senhas_atendimento table
    await queryRunner.query(`
      CREATE TABLE "senhas_atendimento" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "unidade_id" uuid NOT NULL,
        "ticket" character varying(10) NOT NULL,
        "tipo" "public"."senhas_atendimento_tipo_enum" NOT NULL,
        "hora_chegada" TIMESTAMP NOT NULL,
        "paciente_id" uuid,
        "status" "public"."senhas_atendimento_status_enum" NOT NULL DEFAULT 'aguardando',
        "mesa" character varying(10),
        "usuario_atendente_id" uuid,
        "hora_chamada" TIMESTAMP,
        "hora_inicio_atendimento" TIMESTAMP,
        "hora_fim_atendimento" TIMESTAMP,
        "tem_agendamento" boolean NOT NULL DEFAULT false,
        "agendamento_id" uuid,
        "tenant_id" uuid,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_senhas_atendimento_id" PRIMARY KEY ("id")
      )
    `);

    // Create indexes for caixas
    await queryRunner.query(
      `CREATE INDEX "IDX_caixas_usuario_id" ON "caixas" ("usuario_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_caixas_unidade_id" ON "caixas" ("unidade_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_caixas_tenant_id" ON "caixas" ("tenant_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_caixas_usuario_data" ON "caixas" ("usuario_id", "data_abertura")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_caixas_unidade_status" ON "caixas" ("unidade_id", "status")`,
    );

    // Create indexes for senhas_atendimento
    await queryRunner.query(
      `CREATE INDEX "IDX_senhas_unidade_id" ON "senhas_atendimento" ("unidade_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_senhas_tenant_id" ON "senhas_atendimento" ("tenant_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_senhas_unidade_status_tipo" ON "senhas_atendimento" ("unidade_id", "status", "tipo")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_senhas_unidade_ticket_chegada" ON "senhas_atendimento" ("unidade_id", "ticket", "hora_chegada")`,
    );

    // Create foreign keys for caixas
    await queryRunner.query(`
      ALTER TABLE "caixas" ADD CONSTRAINT "FK_caixas_usuario"
      FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "caixas" ADD CONSTRAINT "FK_caixas_unidade"
      FOREIGN KEY ("unidade_id") REFERENCES "unidades_saude"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "caixas" ADD CONSTRAINT "FK_caixas_tenant"
      FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);

    // Create foreign keys for senhas_atendimento
    await queryRunner.query(`
      ALTER TABLE "senhas_atendimento" ADD CONSTRAINT "FK_senhas_unidade"
      FOREIGN KEY ("unidade_id") REFERENCES "unidades_saude"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "senhas_atendimento" ADD CONSTRAINT "FK_senhas_paciente"
      FOREIGN KEY ("paciente_id") REFERENCES "pacientes"("id") ON DELETE SET NULL ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "senhas_atendimento" ADD CONSTRAINT "FK_senhas_usuario_atendente"
      FOREIGN KEY ("usuario_atendente_id") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "senhas_atendimento" ADD CONSTRAINT "FK_senhas_tenant"
      FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign keys for senhas_atendimento
    await queryRunner.query(
      `ALTER TABLE "senhas_atendimento" DROP CONSTRAINT "FK_senhas_tenant"`,
    );
    await queryRunner.query(
      `ALTER TABLE "senhas_atendimento" DROP CONSTRAINT "FK_senhas_usuario_atendente"`,
    );
    await queryRunner.query(
      `ALTER TABLE "senhas_atendimento" DROP CONSTRAINT "FK_senhas_paciente"`,
    );
    await queryRunner.query(
      `ALTER TABLE "senhas_atendimento" DROP CONSTRAINT "FK_senhas_unidade"`,
    );

    // Drop foreign keys for caixas
    await queryRunner.query(
      `ALTER TABLE "caixas" DROP CONSTRAINT "FK_caixas_tenant"`,
    );
    await queryRunner.query(
      `ALTER TABLE "caixas" DROP CONSTRAINT "FK_caixas_unidade"`,
    );
    await queryRunner.query(
      `ALTER TABLE "caixas" DROP CONSTRAINT "FK_caixas_usuario"`,
    );

    // Drop indexes for senhas_atendimento
    await queryRunner.query(
      `DROP INDEX "public"."IDX_senhas_unidade_ticket_chegada"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_senhas_unidade_status_tipo"`,
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_senhas_tenant_id"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_senhas_unidade_id"`);

    // Drop indexes for caixas
    await queryRunner.query(`DROP INDEX "public"."IDX_caixas_unidade_status"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_caixas_usuario_data"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_caixas_tenant_id"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_caixas_unidade_id"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_caixas_usuario_id"`);

    // Drop tables
    await queryRunner.query(`DROP TABLE "senhas_atendimento"`);
    await queryRunner.query(`DROP TABLE "caixas"`);

    // Drop enums
    await queryRunner.query(
      `DROP TYPE "public"."senhas_atendimento_status_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."senhas_atendimento_tipo_enum"`,
    );
    await queryRunner.query(`DROP TYPE "public"."caixas_status_enum"`);
  }
}
