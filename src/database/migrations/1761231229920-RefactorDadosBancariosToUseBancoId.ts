import { MigrationInterface, QueryRunner } from 'typeorm';

export class RefactorDadosBancariosToUseBancoId1761231229920
  implements MigrationInterface
{
  name = 'RefactorDadosBancariosToUseBancoId1761231229920';

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

    // Passo 1: Adicionar banco_id como nullable
    await queryRunner.query(
      `ALTER TABLE "dados_bancarios" ADD "banco_id" uuid`,
    );

    // Passo 2: Migrar dados existentes
    // Para cada dados_bancarios com codigo_banco, criar/buscar banco e vincular
    await queryRunner.query(`
      INSERT INTO bancos (id, codigo, codigo_interno, nome, status)
      SELECT
        uuid_generate_v4(),
        COALESCE(codigo_banco, '000'),
        COALESCE(codigo_banco, '000') || '-' || COALESCE(banco, 'Banco Padrão'),
        COALESCE(banco, 'Banco Padrão'),
        'ativo'::bancos_status_enum
      FROM dados_bancarios
      WHERE codigo_banco IS NOT NULL
        AND banco IS NOT NULL
        AND NOT EXISTS (
          SELECT 1 FROM bancos b
          WHERE b.codigo = dados_bancarios.codigo_banco
        )
      GROUP BY codigo_banco, banco
    `);

    // Passo 3: Criar um banco padrão para registros sem código_banco
    await queryRunner.query(`
      INSERT INTO bancos (id, codigo, codigo_interno, nome, status)
      SELECT
        uuid_generate_v4(),
        '000',
        '000-banco-padrao',
        'Banco Padrão',
        'ativo'::bancos_status_enum
      WHERE NOT EXISTS (SELECT 1 FROM bancos WHERE codigo = '000')
    `);

    // Passo 4: Vincular dados_bancarios aos bancos
    await queryRunner.query(`
      UPDATE dados_bancarios db
      SET banco_id = b.id
      FROM bancos b
      WHERE b.codigo = COALESCE(db.codigo_banco, '000')
    `);

    // Passo 5: Agora podemos remover as colunas antigas
    await queryRunner.query(
      `ALTER TABLE "dados_bancarios" DROP COLUMN "banco"`,
    );
    await queryRunner.query(
      `ALTER TABLE "dados_bancarios" DROP COLUMN "codigo_banco"`,
    );

    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN "observacoes_convenio"`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP CONSTRAINT "UQ_807b76b6f688d6d7d47fe735c94"`,
    );
    await queryRunner.query(`ALTER TABLE "convenios" DROP COLUMN "empresa_id"`);
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP CONSTRAINT "UQ_80fe1c8895e9351c2ec2d0bf6d8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN "codigo_convenio"`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN "aceita_atendimento_online"`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN "valor_consulta"`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN "percentual_coparticipacao"`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP CONSTRAINT "UQ_1c7842a1c9b419f3d5cc463e285"`,
    );
    await queryRunner.query(`ALTER TABLE "convenios" DROP COLUMN "codigo"`);
    await queryRunner.query(`ALTER TABLE "convenios" DROP COLUMN "cnpj"`);
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN "observacoes"`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN "razao_social"`,
    );

    // Passo 6: Tornar banco_id NOT NULL agora que todos os dados foram migrados
    await queryRunner.query(
      `ALTER TABLE "dados_bancarios" ALTER COLUMN "banco_id" SET NOT NULL`,
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
      `CREATE TYPE "public"."campos_formulario_tipo_campo_padrao_enum" AS ENUM('sistema', 'customizado')`,
    );
    await queryRunner.query(
      `ALTER TABLE "campos_formulario" ADD "tipo_campo_padrao" "public"."campos_formulario_tipo_campo_padrao_enum" NOT NULL DEFAULT 'customizado'`,
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
      `ALTER TABLE "convenios" DROP COLUMN "tabela_precos"`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD "tabela_precos" character varying(50)`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."tabela_precos" IS 'Tabela de preços utilizada'`,
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
      `CREATE INDEX "IDX_34d8070cf1f668dd197cb5a372" ON "convenios" ("cnpj") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ddd3718e7bbc953f53820939f8" ON "convenios" ("nome") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1c7842a1c9b419f3d5cc463e28" ON "convenios" ("codigo") `,
    );
    await queryRunner.query(
      `ALTER TABLE "dados_bancarios" ADD CONSTRAINT "FK_10798973e990c368e7eaa9be44a" FOREIGN KEY ("banco_id") REFERENCES "bancos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD CONSTRAINT "FK_807b76b6f688d6d7d47fe735c94" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP CONSTRAINT "FK_807b76b6f688d6d7d47fe735c94"`,
    );
    await queryRunner.query(
      `ALTER TABLE "dados_bancarios" DROP CONSTRAINT "FK_10798973e990c368e7eaa9be44a"`,
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
      `CREATE TYPE "public"."convenios_tipo_faturamento_enum_old" AS ENUM('manual', 'proprio', 'tiss')`,
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
      `COMMENT ON COLUMN "convenios"."tabela_precos" IS 'Tabela de preços utilizada'`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN "tabela_precos"`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD "tabela_precos" character varying(255)`,
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
    await queryRunner.query(
      `ALTER TABLE "campos_formulario" DROP COLUMN "tipo_campo_padrao"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."campos_formulario_tipo_campo_padrao_enum"`,
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
      `ALTER TABLE "dados_bancarios" DROP COLUMN "banco_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD "razao_social" character varying(255) NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "convenios" ADD "observacoes" text`);
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD "cnpj" character varying(14)`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD "codigo" character varying(20) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD CONSTRAINT "UQ_1c7842a1c9b419f3d5cc463e285" UNIQUE ("codigo")`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD "percentual_coparticipacao" numeric(5,2)`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD "valor_consulta" numeric(10,2)`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD "aceita_atendimento_online" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD "codigo_convenio" character varying(20) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD CONSTRAINT "UQ_80fe1c8895e9351c2ec2d0bf6d8" UNIQUE ("codigo_convenio")`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD "empresa_id" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD CONSTRAINT "UQ_807b76b6f688d6d7d47fe735c94" UNIQUE ("empresa_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD "observacoes_convenio" text`,
    );
    await queryRunner.query(
      `ALTER TABLE "dados_bancarios" ADD "codigo_banco" character varying(10)`,
    );
    await queryRunner.query(
      `ALTER TABLE "dados_bancarios" ADD "banco" character varying(100) NOT NULL`,
    );
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
