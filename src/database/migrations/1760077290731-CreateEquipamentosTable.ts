import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateEquipamentosTable1760077290731
  implements MigrationInterface
{
  name = 'CreateEquipamentosTable1760077290731';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP CONSTRAINT "FK_807b76b6f688d6d7d47fe735c94"`,
    );
    await queryRunner.query(
      `ALTER TABLE "laboratorios_metodos" DROP CONSTRAINT "FK_LABORATORIOS_METODOS_METODO"`,
    );
    await queryRunner.query(
      `ALTER TABLE "laboratorios_metodos" DROP CONSTRAINT "FK_LABORATORIOS_METODOS_LABORATORIO"`,
    );
    await queryRunner.query(
      `ALTER TABLE "campos_matriz" DROP CONSTRAINT "FK_campos_matriz_matriz"`,
    );
    await queryRunner.query(
      `ALTER TABLE "preferencias_usuario" DROP CONSTRAINT "fk_preferencias_usuario_usuario"`,
    );
    await queryRunner.query(
      `ALTER TABLE "historico_senhas" DROP CONSTRAINT "fk_historico_senhas_alterado_por"`,
    );
    await queryRunner.query(
      `ALTER TABLE "historico_senhas" DROP CONSTRAINT "fk_historico_senhas_usuario"`,
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
      `DROP INDEX "public"."IDX_LABORATORIOS_METODOS_LABORATORIO"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_LABORATORIOS_METODOS_METODO"`,
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_METODOS_CODIGO_INTERNO"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_METODOS_NOME"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_matrizes_exames_codigo_interno"`,
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_matrizes_exames_nome"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_matrizes_exames_tipo_matriz"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_matrizes_exames_tipo_exame_id"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_campos_matriz_matriz_id"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_campos_matriz_codigo_campo"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_campos_matriz_ordem_exibicao"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_amostras_codigo_interno"`,
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_amostras_nome"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_amostras_tipo_amostra"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_amostras_empresa_id"`);
    await queryRunner.query(
      `DROP INDEX "public"."idx_preferencias_usuario_usuario_id"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."idx_historico_senhas_usuario_id"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."idx_historico_senhas_data_alteracao"`,
    );
    await queryRunner.query(
      `ALTER TABLE "laboratorios_metodos" DROP CONSTRAINT "UQ_LABORATORIOS_METODOS_LABORATORIO_METODO"`,
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
      `ALTER TABLE "convenios" DROP COLUMN "observacoes_convenio"`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP CONSTRAINT "UQ_80fe1c8895e9351c2ec2d0bf6d8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN "codigo_convenio"`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP CONSTRAINT "UQ_1c7842a1c9b419f3d5cc463e285"`,
    );
    await queryRunner.query(`ALTER TABLE "convenios" DROP COLUMN "codigo"`);
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN "razao_social"`,
    );
    await queryRunner.query(`ALTER TABLE "convenios" DROP COLUMN "cnpj"`);
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN "observacoes"`,
    );
    await queryRunner.query(
      `ALTER TABLE "laboratorios_metodos" DROP COLUMN "created_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "laboratorios_metodos" DROP COLUMN "updated_at"`,
    );
    await queryRunner.query(`ALTER TABLE "metodos" DROP COLUMN "created_at"`);
    await queryRunner.query(`ALTER TABLE "metodos" DROP COLUMN "updated_at"`);
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
      `ALTER TABLE "laboratorios_metodos" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "laboratorios_metodos" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "metodos" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "metodos" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
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
      `COMMENT ON COLUMN "convenios"."tem_integracao_api" IS 'Se tem integração via API'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."url_api" IS 'URL da API do convênio'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."token_api" IS 'Token/chave de acesso'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."requer_autorizacao" IS 'Se requer autorização prévia'`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ALTER COLUMN "requer_autorizacao" SET DEFAULT false`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."requer_senha" IS 'Se requer senha de autorização'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."validade_guia_dias" IS 'Validade padrão da guia em dias'`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."convenios_tipo_faturamento_enum" RENAME TO "convenios_tipo_faturamento_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."convenios_tipo_faturamento_enum" AS ENUM('tiss', 'proprio', 'manual')`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ALTER COLUMN "tipo_faturamento" TYPE "public"."convenios_tipo_faturamento_enum" USING "tipo_faturamento"::"text"::"public"."convenios_tipo_faturamento_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ALTER COLUMN "tipo_faturamento" SET DEFAULT 'tiss'`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."convenios_tipo_faturamento_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ALTER COLUMN "tipo_faturamento" SET NOT NULL`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."tipo_faturamento" IS 'Tipo de faturamento'`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ALTER COLUMN "tipo_faturamento" SET DEFAULT 'tiss'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."portal_envio" IS 'Portal de envio (SAVI, Orizon, etc)'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."dia_fechamento" IS 'Dia de fechamento do faturamento'`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ALTER COLUMN "prazo_pagamento_dias" DROP NOT NULL`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."prazo_pagamento_dias" IS 'Prazo de pagamento em dias'`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ALTER COLUMN "prazo_pagamento_dias" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ALTER COLUMN "percentual_desconto" SET NOT NULL`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."percentual_desconto" IS 'Percentual de desconto padrão'`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ALTER COLUMN "percentual_desconto" SET DEFAULT '0'`,
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
      `COMMENT ON COLUMN "convenios"."telefone" IS 'Telefone de contato'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."email" IS 'E-mail de contato'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."contato_nome" IS 'Pessoa de contato'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."regras_especificas" IS 'Regras específicas do convênio'`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."convenios_status_enum" RENAME TO "convenios_status_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."convenios_status_enum" AS ENUM('ativo', 'inativo', 'suspenso')`,
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
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."status" IS 'Status do convênio'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."criado_em" IS 'Data de criação'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."atualizado_em" IS 'Data de atualização'`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN "registro_ans"`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD "registro_ans" character varying(20)`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN "tabela_precos"`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD "tabela_precos" character varying(255)`,
    );
    await queryRunner.query(`COMMENT ON COLUMN "amostras"."id" IS NULL`);
    await queryRunner.query(
      `ALTER TABLE "amostras" ALTER COLUMN "criado_em" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "amostras" ALTER COLUMN "atualizado_em" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "preferencias_usuario" ALTER COLUMN "created_at" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "preferencias_usuario" ALTER COLUMN "updated_at" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "historico_senhas" ALTER COLUMN "data_alteracao" SET DEFAULT now()`,
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
      `CREATE INDEX "IDX_7d18ea692673166969ee739164" ON "laboratorios_metodos" ("metodo_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e1445f18d757962ef62fcd75ef" ON "laboratorios_metodos" ("laboratorio_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_8a7c2084abeadd7660da4350ca" ON "metodos" ("nome") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_808aa72c9cd62a9f8bb83691bd" ON "metodos" ("codigo_interno") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f6db3a4dfb5633ff6cab58234e" ON "matrizes_exames" ("tipo_exame_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e41a58c56f5b258bd82da5867e" ON "matrizes_exames" ("tipo_matriz") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_3fc41a143f193d646bb0b1062b" ON "matrizes_exames" ("nome") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_42f89fd5f1738e2e54f25c0955" ON "matrizes_exames" ("codigo_interno") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_512435525fae90f76085881327" ON "campos_matriz" ("ordem_exibicao") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_84987dd1407e9794c40ee1105a" ON "campos_matriz" ("codigo_campo") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_2d05ae8e0cccf6f741a2d1934e" ON "campos_matriz" ("matriz_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_24833a3b712fb7e53435edd318" ON "amostras" ("empresa_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_5640f3bce2ce98e78057d6f0b2" ON "amostras" ("tipo_amostra") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f7b65b2693ca98424dd580927c" ON "amostras" ("nome") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_88e38233ec5fb69e0c0e9c9851" ON "amostras" ("codigo_interno") `,
    );
    await queryRunner.query(
      `ALTER TABLE "laboratorios_metodos" ADD CONSTRAINT "UQ_ed743591a5d616dd3dadc957187" UNIQUE ("laboratorio_id", "metodo_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD CONSTRAINT "FK_807b76b6f688d6d7d47fe735c94" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "laboratorios_metodos" ADD CONSTRAINT "FK_e1445f18d757962ef62fcd75ef0" FOREIGN KEY ("laboratorio_id") REFERENCES "laboratorios"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "laboratorios_metodos" ADD CONSTRAINT "FK_7d18ea692673166969ee7391640" FOREIGN KEY ("metodo_id") REFERENCES "metodos"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "matrizes_exames" ADD CONSTRAINT "FK_f6db3a4dfb5633ff6cab58234ee" FOREIGN KEY ("tipo_exame_id") REFERENCES "tipos_exame"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "matrizes_exames" ADD CONSTRAINT "FK_79ac34bb25b9669b6d4eca58eaa" FOREIGN KEY ("exame_id") REFERENCES "exames"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "campos_matriz" ADD CONSTRAINT "FK_2d05ae8e0cccf6f741a2d1934eb" FOREIGN KEY ("matriz_id") REFERENCES "matrizes_exames"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "preferencias_usuario" ADD CONSTRAINT "FK_b33aaf0ab1fb5318c3ea848e8e5" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "historico_senhas" ADD CONSTRAINT "FK_750f73ca82db3115a418560f53c" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "historico_senhas" DROP CONSTRAINT "FK_750f73ca82db3115a418560f53c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "preferencias_usuario" DROP CONSTRAINT "FK_b33aaf0ab1fb5318c3ea848e8e5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "campos_matriz" DROP CONSTRAINT "FK_2d05ae8e0cccf6f741a2d1934eb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "matrizes_exames" DROP CONSTRAINT "FK_79ac34bb25b9669b6d4eca58eaa"`,
    );
    await queryRunner.query(
      `ALTER TABLE "matrizes_exames" DROP CONSTRAINT "FK_f6db3a4dfb5633ff6cab58234ee"`,
    );
    await queryRunner.query(
      `ALTER TABLE "laboratorios_metodos" DROP CONSTRAINT "FK_7d18ea692673166969ee7391640"`,
    );
    await queryRunner.query(
      `ALTER TABLE "laboratorios_metodos" DROP CONSTRAINT "FK_e1445f18d757962ef62fcd75ef0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP CONSTRAINT "FK_807b76b6f688d6d7d47fe735c94"`,
    );
    await queryRunner.query(
      `ALTER TABLE "laboratorios_metodos" DROP CONSTRAINT "UQ_ed743591a5d616dd3dadc957187"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_88e38233ec5fb69e0c0e9c9851"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_f7b65b2693ca98424dd580927c"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_5640f3bce2ce98e78057d6f0b2"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_24833a3b712fb7e53435edd318"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_2d05ae8e0cccf6f741a2d1934e"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_84987dd1407e9794c40ee1105a"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_512435525fae90f76085881327"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_42f89fd5f1738e2e54f25c0955"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_3fc41a143f193d646bb0b1062b"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_e41a58c56f5b258bd82da5867e"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_f6db3a4dfb5633ff6cab58234e"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_808aa72c9cd62a9f8bb83691bd"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_8a7c2084abeadd7660da4350ca"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_e1445f18d757962ef62fcd75ef"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_7d18ea692673166969ee739164"`,
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
      `ALTER TABLE "historico_senhas" ALTER COLUMN "data_alteracao" SET DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "preferencias_usuario" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "preferencias_usuario" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "amostras" ALTER COLUMN "atualizado_em" SET DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "amostras" ALTER COLUMN "criado_em" SET DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "amostras"."id" IS 'ID único da amostra'`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN "tabela_precos"`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD "tabela_precos" character varying(50)`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP COLUMN "registro_ans"`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD "registro_ans" character varying(50)`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."atualizado_em" IS NULL`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."criado_em" IS NULL`,
    );
    await queryRunner.query(`COMMENT ON COLUMN "convenios"."status" IS NULL`);
    await queryRunner.query(
      `CREATE TYPE "public"."convenios_status_enum_old" AS ENUM('ativo', 'inativo', 'suspenso', 'bloqueado')`,
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
      `COMMENT ON COLUMN "convenios"."regras_especificas" IS NULL`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."contato_nome" IS NULL`,
    );
    await queryRunner.query(`COMMENT ON COLUMN "convenios"."email" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "convenios"."telefone" IS NULL`);
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
      `ALTER TABLE "convenios" ALTER COLUMN "percentual_desconto" DROP DEFAULT`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."percentual_desconto" IS NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ALTER COLUMN "percentual_desconto" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ALTER COLUMN "prazo_pagamento_dias" SET DEFAULT '30'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."prazo_pagamento_dias" IS NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ALTER COLUMN "prazo_pagamento_dias" SET NOT NULL`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."dia_fechamento" IS NULL`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."portal_envio" IS NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ALTER COLUMN "tipo_faturamento" DROP DEFAULT`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."tipo_faturamento" IS NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ALTER COLUMN "tipo_faturamento" DROP NOT NULL`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."convenios_tipo_faturamento_enum_old" AS ENUM('mensal', 'quinzenal', 'semanal', 'avulso')`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ALTER COLUMN "tipo_faturamento" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ALTER COLUMN "tipo_faturamento" TYPE "public"."convenios_tipo_faturamento_enum_old" USING "tipo_faturamento"::"text"::"public"."convenios_tipo_faturamento_enum_old"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."convenios_tipo_faturamento_enum"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."convenios_tipo_faturamento_enum_old" RENAME TO "convenios_tipo_faturamento_enum"`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."validade_guia_dias" IS NULL`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."requer_senha" IS NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ALTER COLUMN "requer_autorizacao" SET DEFAULT true`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."requer_autorizacao" IS NULL`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."token_api" IS NULL`,
    );
    await queryRunner.query(`COMMENT ON COLUMN "convenios"."url_api" IS NULL`);
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."tem_integracao_api" IS NULL`,
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
    await queryRunner.query(`ALTER TABLE "metodos" DROP COLUMN "updatedAt"`);
    await queryRunner.query(`ALTER TABLE "metodos" DROP COLUMN "createdAt"`);
    await queryRunner.query(
      `ALTER TABLE "laboratorios_metodos" DROP COLUMN "updatedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "laboratorios_metodos" DROP COLUMN "createdAt"`,
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
      `ALTER TABLE "metodos" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "metodos" ADD "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "laboratorios_metodos" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "laboratorios_metodos" ADD "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(`ALTER TABLE "convenios" ADD "observacoes" text`);
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
      `ALTER TABLE "convenios" ADD "codigo_convenio" character varying(20) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD CONSTRAINT "UQ_80fe1c8895e9351c2ec2d0bf6d8" UNIQUE ("codigo_convenio")`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD "observacoes_convenio" text`,
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
      `ALTER TABLE "laboratorios_metodos" ADD CONSTRAINT "UQ_LABORATORIOS_METODOS_LABORATORIO_METODO" UNIQUE ("laboratorio_id", "metodo_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_historico_senhas_data_alteracao" ON "historico_senhas" ("data_alteracao") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_historico_senhas_usuario_id" ON "historico_senhas" ("usuario_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_preferencias_usuario_usuario_id" ON "preferencias_usuario" ("usuario_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_amostras_empresa_id" ON "amostras" ("empresa_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_amostras_tipo_amostra" ON "amostras" ("tipo_amostra") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_amostras_nome" ON "amostras" ("nome") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_amostras_codigo_interno" ON "amostras" ("codigo_interno") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_campos_matriz_ordem_exibicao" ON "campos_matriz" ("ordem_exibicao") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_campos_matriz_codigo_campo" ON "campos_matriz" ("codigo_campo") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_campos_matriz_matriz_id" ON "campos_matriz" ("matriz_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_matrizes_exames_tipo_exame_id" ON "matrizes_exames" ("tipo_exame_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_matrizes_exames_tipo_matriz" ON "matrizes_exames" ("tipo_matriz") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_matrizes_exames_nome" ON "matrizes_exames" ("nome") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_matrizes_exames_codigo_interno" ON "matrizes_exames" ("codigo_interno") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_METODOS_NOME" ON "metodos" ("nome") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_METODOS_CODIGO_INTERNO" ON "metodos" ("codigo_interno") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_LABORATORIOS_METODOS_METODO" ON "laboratorios_metodos" ("metodo_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_LABORATORIOS_METODOS_LABORATORIO" ON "laboratorios_metodos" ("laboratorio_id") `,
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
      `ALTER TABLE "historico_senhas" ADD CONSTRAINT "fk_historico_senhas_usuario" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "historico_senhas" ADD CONSTRAINT "fk_historico_senhas_alterado_por" FOREIGN KEY ("alterado_por_usuario_id") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "preferencias_usuario" ADD CONSTRAINT "fk_preferencias_usuario_usuario" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "campos_matriz" ADD CONSTRAINT "FK_campos_matriz_matriz" FOREIGN KEY ("matriz_id") REFERENCES "matrizes_exames"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "laboratorios_metodos" ADD CONSTRAINT "FK_LABORATORIOS_METODOS_LABORATORIO" FOREIGN KEY ("laboratorio_id") REFERENCES "laboratorios"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "laboratorios_metodos" ADD CONSTRAINT "FK_LABORATORIOS_METODOS_METODO" FOREIGN KEY ("metodo_id") REFERENCES "metodos"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD CONSTRAINT "FK_807b76b6f688d6d7d47fe735c94" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
