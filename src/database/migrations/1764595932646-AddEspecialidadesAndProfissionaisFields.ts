import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddEspecialidadesAndProfissionaisFields1764595932646
  implements MigrationInterface
{
  name = 'AddEspecialidadesAndProfissionaisFields1764595932646';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "integracoes_configuracoes" DROP CONSTRAINT "fk_integracoes_configuracoes_integracao"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tabelas_preco_itens" DROP CONSTRAINT "fk_tabelas_preco_itens_exame"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tabelas_preco_itens" DROP CONSTRAINT "fk_tabelas_preco_itens_tabela"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tabelas_preco" DROP CONSTRAINT "fk_tabelas_preco_empresa"`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP CONSTRAINT "fk_convenios_tabela_material"`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP CONSTRAINT "fk_convenios_tabela_base"`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP CONSTRAINT "fk_convenios_tabela_servico"`,
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
      `ALTER TABLE "laboratorios_amostras" DROP CONSTRAINT "FK_laboratorios_amostras_amostra"`,
    );
    await queryRunner.query(
      `ALTER TABLE "laboratorios_amostras" DROP CONSTRAINT "FK_laboratorios_amostras_laboratorio"`,
    );
    await queryRunner.query(
      `ALTER TABLE "exames" DROP CONSTRAINT "FK_exames_amostra_enviar"`,
    );
    await queryRunner.query(
      `ALTER TABLE "exames" DROP CONSTRAINT "FK_fedb3d5bde5b26abdc2613f6894"`,
    );
    await queryRunner.query(
      `ALTER TABLE "adquirentes_unidades" DROP CONSTRAINT "FK_adquirente_unidade_unidade"`,
    );
    await queryRunner.query(
      `ALTER TABLE "adquirentes_unidades" DROP CONSTRAINT "FK_adquirente_unidade_adquirente"`,
    );
    await queryRunner.query(
      `ALTER TABLE "adquirentes" DROP CONSTRAINT "FK_adquirente_integracao"`,
    );
    await queryRunner.query(
      `ALTER TABLE "classes_cfo" DROP CONSTRAINT "FK_classes_cfo_hierarquia"`,
    );
    await queryRunner.query(
      `ALTER TABLE "kits" DROP CONSTRAINT "FK_kits_atualizado_por"`,
    );
    await queryRunner.query(
      `ALTER TABLE "kits" DROP CONSTRAINT "FK_kits_criado_por"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."idx_integracoes_configuracoes_integracao_id"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."idx_integracoes_configuracoes_chave"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."idx_integracoes_configuracoes_integracao_chave"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."idx_integracoes_template_slug"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."idx_integracoes_unidade_saude_id"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."idx_integracoes_codigo_identificacao"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."idx_tabelas_preco_itens_tabela_id"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."idx_tabelas_preco_itens_exame_id"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."idx_tabelas_preco_itens_ativo"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."idx_tabelas_preco_codigo_interno"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."idx_tabelas_preco_tipo_tabela"`,
    );
    await queryRunner.query(`DROP INDEX "public"."idx_tabelas_preco_ativo"`);
    await queryRunner.query(
      `DROP INDEX "public"."idx_tabelas_preco_empresa_id"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_ddd3718e7bbc953f53820939f8"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_laboratorios_amostras_laboratorio_id"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_laboratorios_amostras_amostra_id"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_adquirente_unidade_adquirente"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_adquirente_unidade_unidade"`,
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_adquirente_integracao"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_classes_cfo_hierarquia_ordem"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_matrizes_exames_exame_id"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_FORMULARIOS_ATENDIMENTO_UNIDADE"`,
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_salas_codigo_interno"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_salas_nome"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_salas_unidade_id"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_equipamentos_codigo_interno"`,
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_equipamentos_nome"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_equipamentos_unidade_id"`,
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_equipamentos_sala_id"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_CABECALHOS_RODAPES_UNIDADE_TIPO"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_CABECALHOS_RODAPES_UNIDADE"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tabelas_preco_itens" DROP CONSTRAINT "uq_tabela_preco_exame"`,
    );
    await queryRunner.query(
      `ALTER TABLE "laboratorios_amostras" DROP CONSTRAINT "UQ_laboratorios_amostras_laboratorio_amostra"`,
    );
    await queryRunner.query(
      `ALTER TABLE "adquirentes_unidades" DROP CONSTRAINT "UQ_adquirente_unidade"`,
    );
    await queryRunner.query(
      `CREATE TABLE "especialidades" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "codigo" character varying NOT NULL, "nome" character varying NOT NULL, "descricao" character varying, "codigoCBOS" character varying, "ativo" boolean NOT NULL DEFAULT true, "criadoEm" TIMESTAMP NOT NULL DEFAULT now(), "atualizadoEm" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_8755068bb3ceef258018e80021d" UNIQUE ("codigo"), CONSTRAINT "PK_73c2740deb4cbe08c28ac487705" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "profissionais_especialidades_realiza" ("profissional_id" uuid NOT NULL, "especialidade_id" uuid NOT NULL, CONSTRAINT "PK_2d76998f5e3631731b406989763" PRIMARY KEY ("profissional_id", "especialidade_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_8050a12283fe0a8aacabca6402" ON "profissionais_especialidades_realiza" ("profissional_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4de6ebfce106c0eaf183912a17" ON "profissionais_especialidades_realiza" ("especialidade_id") `,
    );
    await queryRunner.query(`ALTER TABLE "kits" DROP COLUMN "data_criacao"`);
    await queryRunner.query(`ALTER TABLE "kits" DROP COLUMN "observacoes"`);
    await queryRunner.query(
      `ALTER TABLE "profissionais" DROP COLUMN "especialidadePrincipal"`,
    );
    await queryRunner.query(
      `ALTER TABLE "profissionais" ADD "especialidadePrincipalId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "profissionais" ADD "serialNumberCertificado" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "profissionais" ADD "usuarioAssinatura" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "profissionais" ADD "senhaAssinatura" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "profissionais" ADD "examesNaoRealiza" uuid array`,
    );
    await queryRunner.query(
      `ALTER TABLE "profissionais" ADD "examesAlemEspecialidade" uuid array`,
    );
    await queryRunner.query(
      `ALTER TABLE "integracoes" DROP CONSTRAINT "FK_84ec1c9f1b03cc6f743c6c756cc"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_b2c226842808110feee86182a8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "integracoes" DROP CONSTRAINT "UQ_b2c226842808110feee86182a81"`,
    );
    await queryRunner.query(
      `ALTER TABLE "integracoes" DROP COLUMN "codigo_identificacao"`,
    );
    await queryRunner.query(
      `ALTER TABLE "integracoes" ADD "codigo_identificacao" character varying(100) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "integracoes" ADD CONSTRAINT "UQ_b2c226842808110feee86182a81" UNIQUE ("codigo_identificacao")`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "integracoes"."codigo_identificacao" IS 'Código único da instância da integração'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "integracoes"."unidade_saude_id" IS 'Unidade de saúde vinculada'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "integracoes"."status" IS 'Status atual da integração'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "integracoes"."ativo" IS 'Integração ativa?'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "integracoes"."ultima_sincronizacao" IS 'Última sincronização bem-sucedida'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "integracoes"."tentativas_falhas" IS 'Contador de tentativas falhadas'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "integracoes"."ultimo_erro" IS 'Última mensagem de erro'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "tabelas_preco_itens"."tabela_preco_id" IS 'FK → tabelas_preco'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "tabelas_preco_itens"."exame_id" IS 'FK → exames (vínculo obrigatório com cadastro de exames)'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "tabelas_preco_itens"."codigo_convenio" IS 'Código próprio do convênio (quando não usa TUSS/AMB)'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "tabelas_preco_itens"."moeda" IS 'Moeda do valor (ex: BRL, USD)'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "tabelas_preco_itens"."quantidade_filme" IS 'Quantidade de filme'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "tabelas_preco_itens"."filme_separado" IS 'Filme cobrado separadamente?'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "tabelas_preco_itens"."porte" IS 'Porte anestésico'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "tabelas_preco_itens"."valor" IS 'Valor do exame'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "tabelas_preco_itens"."custo_operacional" IS 'Custo operacional'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "tabelas_preco_itens"."ativo" IS 'Item ativo?'`,
    );
    await queryRunner.query(
      `ALTER TABLE "tabelas_preco_itens" ALTER COLUMN "created_at" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "tabelas_preco_itens" ALTER COLUMN "updated_at" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "tabelas_preco"."codigo_interno" IS 'Código interno da tabela'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "tabelas_preco"."nome" IS 'Nome da tabela'`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."tipo_tabela_preco_enum" RENAME TO "tipo_tabela_preco_enum_old"`,
    );
    await queryRunner.query(
      `DROP TYPE IF EXISTS "public"."tabelas_preco_tipo_tabela_enum"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."tabelas_preco_tipo_tabela_enum" AS ENUM('servico', 'material_medicamento')`,
    );
    await queryRunner.query(
      `ALTER TABLE "tabelas_preco" ALTER COLUMN "tipo_tabela" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "tabelas_preco" ALTER COLUMN "tipo_tabela" TYPE "public"."tabelas_preco_tipo_tabela_enum" USING "tipo_tabela"::"text"::"public"."tabelas_preco_tipo_tabela_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tabelas_preco" ALTER COLUMN "tipo_tabela" SET DEFAULT 'servico'`,
    );
    await queryRunner.query(`DROP TYPE "public"."tipo_tabela_preco_enum_old"`);
    await queryRunner.query(
      `COMMENT ON COLUMN "tabelas_preco"."tipo_tabela" IS 'Tipo de tabela: servico ou material_medicamento'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "tabelas_preco"."observacoes" IS 'Observações gerais da tabela'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "tabelas_preco"."ativo" IS 'Tabela ativa?'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "tabelas_preco"."empresa_id" IS 'FK → empresas (multi-tenant)'`,
    );
    await queryRunner.query(
      `ALTER TABLE "tabelas_preco" ALTER COLUMN "created_at" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "tabelas_preco" ALTER COLUMN "updated_at" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "instrucoes" DROP CONSTRAINT "FK_dd26562872777bf8ce16f997061"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ordens_servico" DROP CONSTRAINT "FK_530803f526491bc4066c4141d42"`,
    );
    await queryRunner.query(
      `ALTER TABLE "planos" DROP CONSTRAINT "FK_5acc2a4e3f7c8e181c012892608"`,
    );
    await queryRunner.query(
      `ALTER TABLE "kit_convenios" DROP CONSTRAINT "FK_b64239cdf9789aa3c014c80cc4a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ALTER COLUMN "id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."tabela_servico_id" IS 'FK → tabelas_preco (Tabela de serviços principal)'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."tabela_base_id" IS 'FK → tabelas_preco (Tabela base/fallback)'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."tabela_material_id" IS 'FK → tabelas_preco (Tabela de materiais - evolução futura)'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."criado_em" IS NULL`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."atualizado_em" IS NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "laboratorios_amostras" ALTER COLUMN "created_at" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "laboratorios_amostras" ALTER COLUMN "updated_at" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "amostras"."nome" IS 'Nome da amostra'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "amostras"."codigo_interno" IS 'Código interno da amostra (ex: AMO001)'`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."status_amostra_enum" RENAME TO "status_amostra_enum_old"`,
    );
    await queryRunner.query(
      `DROP TYPE IF EXISTS "public"."amostras_status_enum"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."amostras_status_enum" AS ENUM('ativo', 'inativo', 'em_revisao')`,
    );
    await queryRunner.query(
      `ALTER TABLE "amostras" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "amostras" ALTER COLUMN "status" TYPE "public"."amostras_status_enum" USING "status"::"text"::"public"."amostras_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "amostras" ALTER COLUMN "status" SET DEFAULT 'em_revisao'`,
    );
    await queryRunner.query(`DROP TYPE "public"."status_amostra_enum_old"`);
    await queryRunner.query(
      `ALTER TABLE "amostras" ALTER COLUMN "status" SET NOT NULL`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "amostras"."status" IS 'Status da amostra'`,
    );
    await queryRunner.query(
      `ALTER TABLE "amostras" ALTER COLUMN "created_at" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "amostras" ALTER COLUMN "created_at" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "amostras" ALTER COLUMN "updated_at" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "amostras" ALTER COLUMN "updated_at" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "exames"."amostra_id" IS 'FK para tabela amostras (amostra biológica necessária)'`,
    );
    await queryRunner.query(
      `ALTER TABLE "adquirentes_unidades" ALTER COLUMN "ativo" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."adquirentes_opcao_parcelamento_enum" RENAME TO "adquirentes_opcao_parcelamento_enum_old"`,
    );
    await queryRunner.query(
      `DROP TYPE IF EXISTS "public"."adquirentes_opcao_parcelamento_enum"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."adquirentes_opcao_parcelamento_enum" AS ENUM('avista', '2x', '3x', '4x', '5x', '6x', '7x', '8x', '9x', '10x', '11x', '12x')`,
    );
    await queryRunner.query(
      `ALTER TABLE "adquirentes" ALTER COLUMN "opcao_parcelamento" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "adquirentes" ALTER COLUMN "opcao_parcelamento" TYPE "public"."adquirentes_opcao_parcelamento_enum" USING "opcao_parcelamento"::"text"::"public"."adquirentes_opcao_parcelamento_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "adquirentes" ALTER COLUMN "opcao_parcelamento" SET DEFAULT '12x'`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."adquirentes_opcao_parcelamento_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "matrizes_exames" DROP CONSTRAINT "FK_f6db3a4dfb5633ff6cab58234ee"`,
    );
    await queryRunner.query(
      `ALTER TABLE "matrizes_exames" DROP CONSTRAINT "FK_79ac34bb25b9669b6d4eca58eaa"`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "matrizes_exames"."codigo_interno" IS 'Código interno único da matriz (ex: HEM123)'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "matrizes_exames"."nome" IS 'Nome da matriz (ex: Hemograma 1)'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "matrizes_exames"."tipo_exame_id" IS 'ID do tipo de exame (FK para tipos_exame)'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "matrizes_exames"."exame_id" IS 'ID do exame vinculado (FK para exames)'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "matrizes_exames"."ativo" IS 'Se a matriz está ativa'`,
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_config_campos_entidade"`);
    await queryRunner.query(
      `ALTER TABLE "configuracoes_campos_formulario" DROP COLUMN "tipo_formulario"`,
    );
    await queryRunner.query(
      `DROP TYPE IF EXISTS "public"."configuracoes_campos_formulario_tipo_formulario_enum"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."configuracoes_campos_formulario_tipo_formulario_enum" AS ENUM('cadastro_paciente', 'ordem_servico', 'tiss')`,
    );
    await queryRunner.query(
      `ALTER TABLE "configuracoes_campos_formulario" ADD "tipo_formulario" "public"."configuracoes_campos_formulario_tipo_formulario_enum" NOT NULL DEFAULT 'cadastro_paciente'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "configuracoes_campos_formulario"."tipo_formulario" IS 'Tipo do formulário: cadastro_paciente, ordem_servico, tiss'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "configuracoes_campos_formulario"."nome_campo" IS 'Nome do campo no formulário (deve corresponder aos enums CampoCadastroPacienteEnum, CampoOrdemServicoEnum ou CampoTissEnum)'`,
    );
    await queryRunner.query(
      `ALTER TABLE "formularios_atendimento" ALTER COLUMN "criado_em" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "formularios_atendimento" ALTER COLUMN "atualizado_em" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "salas"."nome" IS 'Nome da sala (ex: IMG-04, SALA-01)'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "equipamentos"."codigo_interno" IS 'Código interno único do equipamento (ex: EQ001)'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "equipamentos"."numeracao" IS 'Numeração/número de série do equipamento'`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."tipo_cabecalho_rodape_enum" RENAME TO "tipo_cabecalho_rodape_enum_old"`,
    );
    await queryRunner.query(
      `DROP TYPE IF EXISTS "public"."cabecalhos_rodapes_tipo_enum"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."cabecalhos_rodapes_tipo_enum" AS ENUM('CABECALHO', 'RODAPE')`,
    );
    await queryRunner.query(
      `ALTER TABLE "cabecalhos_rodapes" ALTER COLUMN "tipo" TYPE "public"."cabecalhos_rodapes_tipo_enum" USING "tipo"::"text"::"public"."cabecalhos_rodapes_tipo_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."tipo_cabecalho_rodape_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cabecalhos_rodapes" ALTER COLUMN "criado_em" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "cabecalhos_rodapes" ALTER COLUMN "atualizado_em" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_3489eeec5abb0f9a8bb3eeda45" ON "integracoes_configuracoes" ("integracao_id", "chave") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_039302adea898dadb95eaffb19" ON "integracoes_configuracoes" ("chave") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e0657f48516490bcca4c8f72ab" ON "integracoes_configuracoes" ("integracao_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b2c226842808110feee86182a8" ON "integracoes" ("codigo_identificacao") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_84ec1c9f1b03cc6f743c6c756c" ON "integracoes" ("unidade_saude_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_d1c6acf477527441934643ba0c" ON "integracoes" ("template_slug") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_16bc3aa1c456a10aae432b7f8e" ON "laboratorios_amostras" ("amostra_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_fde16f8e46073cd5218620129e" ON "laboratorios_amostras" ("laboratorio_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_85be38014689abcdaea6f22cd0" ON "classes_cfo" ("hierarquia_id", "ordem") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_79ac34bb25b9669b6d4eca58ea" ON "matrizes_exames" ("exame_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_config_campos_entidade" ON "configuracoes_campos_formulario" ("entidade_tipo", "entidade_id", "tipo_formulario") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_401cb37cfc88099f2a517b092a" ON "salas" ("codigo_interno") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0a59bba03b5a58296f52278b8e" ON "equipamentos" ("codigo_interno") `,
    );
    await queryRunner.query(
      `ALTER TABLE "tabelas_preco_itens" ADD CONSTRAINT "UQ_12c6904c6813009939bf33a5910" UNIQUE ("tabela_preco_id", "exame_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "laboratorios_amostras" ADD CONSTRAINT "UQ_007d2ff61f7e9d4d28de9581278" UNIQUE ("laboratorio_id", "amostra_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "cabecalhos_rodapes" ADD CONSTRAINT "UQ_815c5de529925383af424487d5b" UNIQUE ("unidade_id", "tipo")`,
    );
    await queryRunner.query(
      `ALTER TABLE "integracoes_configuracoes" ADD CONSTRAINT "FK_e0657f48516490bcca4c8f72ab1" FOREIGN KEY ("integracao_id") REFERENCES "integracoes"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "integracoes" ADD CONSTRAINT "FK_84ec1c9f1b03cc6f743c6c756cc" FOREIGN KEY ("unidade_saude_id") REFERENCES "unidades_saude"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "planos" ADD CONSTRAINT "FK_5acc2a4e3f7c8e181c012892608" FOREIGN KEY ("convenio_id") REFERENCES "convenios"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "instrucoes" ADD CONSTRAINT "FK_dd26562872777bf8ce16f997061" FOREIGN KEY ("convenio_id") REFERENCES "convenios"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tabelas_preco_itens" ADD CONSTRAINT "FK_6afc466dbe428dc7033b2760c28" FOREIGN KEY ("tabela_preco_id") REFERENCES "tabelas_preco"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tabelas_preco_itens" ADD CONSTRAINT "FK_769f817fd5006f5299fcc726643" FOREIGN KEY ("exame_id") REFERENCES "exames"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tabelas_preco" ADD CONSTRAINT "FK_70fbab44f2346ac61cf0a311428" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD CONSTRAINT "FK_b8c0b05eb8ace51440dee6ea20a" FOREIGN KEY ("tabela_servico_id") REFERENCES "tabelas_preco"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD CONSTRAINT "FK_1ef6363e4b4416b101a5a09959f" FOREIGN KEY ("tabela_base_id") REFERENCES "tabelas_preco"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD CONSTRAINT "FK_bf1b0192b535686557bdab37d52" FOREIGN KEY ("tabela_material_id") REFERENCES "tabelas_preco"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ordens_servico" ADD CONSTRAINT "FK_530803f526491bc4066c4141d42" FOREIGN KEY ("convenio_id") REFERENCES "convenios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "laboratorios_amostras" ADD CONSTRAINT "FK_fde16f8e46073cd5218620129ed" FOREIGN KEY ("laboratorio_id") REFERENCES "laboratorios"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "laboratorios_amostras" ADD CONSTRAINT "FK_16bc3aa1c456a10aae432b7f8e4" FOREIGN KEY ("amostra_id") REFERENCES "amostras"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "exames" ADD CONSTRAINT "FK_fedb3d5bde5b26abdc2613f6894" FOREIGN KEY ("amostra_id") REFERENCES "amostras"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "exames" ADD CONSTRAINT "FK_28567d5442ad00b97173797304e" FOREIGN KEY ("amostra_enviar_id") REFERENCES "alternativas_campo_formulario"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "adquirentes_unidades" ADD CONSTRAINT "FK_8b898a63c331eabbd0924feb146" FOREIGN KEY ("adquirente_id") REFERENCES "adquirentes"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "adquirentes_unidades" ADD CONSTRAINT "FK_ac5ef3e4d776863c99afa7b9115" FOREIGN KEY ("unidade_saude_id") REFERENCES "unidades_saude"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "adquirentes" ADD CONSTRAINT "FK_97d89dc280637ee8ada5ef61046" FOREIGN KEY ("integracao_id") REFERENCES "integracoes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "classes_cfo" ADD CONSTRAINT "FK_573d99140f035d097b9651261e9" FOREIGN KEY ("hierarquia_id") REFERENCES "hierarquias_cfo"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "matrizes_exames" ADD CONSTRAINT "FK_f6db3a4dfb5633ff6cab58234ee" FOREIGN KEY ("tipo_exame_id") REFERENCES "tipos_exame"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "matrizes_exames" ADD CONSTRAINT "FK_79ac34bb25b9669b6d4eca58eaa" FOREIGN KEY ("exame_id") REFERENCES "exames"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "kit_convenios" ADD CONSTRAINT "FK_b64239cdf9789aa3c014c80cc4a" FOREIGN KEY ("convenio_id") REFERENCES "convenios"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "kits" ADD CONSTRAINT "FK_508f0d7a7cf52a4468fdfab02de" FOREIGN KEY ("criado_por_id") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "kits" ADD CONSTRAINT "FK_70538efa36a75bc305933d022e2" FOREIGN KEY ("atualizado_por_id") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "profissionais" ADD CONSTRAINT "FK_7f123ec022ac9264025c738b9b8" FOREIGN KEY ("especialidadePrincipalId") REFERENCES "especialidades"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "profissionais_especialidades_realiza" ADD CONSTRAINT "FK_8050a12283fe0a8aacabca6402c" FOREIGN KEY ("profissional_id") REFERENCES "profissionais"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "profissionais_especialidades_realiza" ADD CONSTRAINT "FK_4de6ebfce106c0eaf183912a17d" FOREIGN KEY ("especialidade_id") REFERENCES "especialidades"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "profissionais_especialidades_realiza" DROP CONSTRAINT "FK_4de6ebfce106c0eaf183912a17d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "profissionais_especialidades_realiza" DROP CONSTRAINT "FK_8050a12283fe0a8aacabca6402c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "profissionais" DROP CONSTRAINT "FK_7f123ec022ac9264025c738b9b8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "kits" DROP CONSTRAINT "FK_70538efa36a75bc305933d022e2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "kits" DROP CONSTRAINT "FK_508f0d7a7cf52a4468fdfab02de"`,
    );
    await queryRunner.query(
      `ALTER TABLE "kit_convenios" DROP CONSTRAINT "FK_b64239cdf9789aa3c014c80cc4a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "matrizes_exames" DROP CONSTRAINT "FK_79ac34bb25b9669b6d4eca58eaa"`,
    );
    await queryRunner.query(
      `ALTER TABLE "matrizes_exames" DROP CONSTRAINT "FK_f6db3a4dfb5633ff6cab58234ee"`,
    );
    await queryRunner.query(
      `ALTER TABLE "classes_cfo" DROP CONSTRAINT "FK_573d99140f035d097b9651261e9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "adquirentes" DROP CONSTRAINT "FK_97d89dc280637ee8ada5ef61046"`,
    );
    await queryRunner.query(
      `ALTER TABLE "adquirentes_unidades" DROP CONSTRAINT "FK_ac5ef3e4d776863c99afa7b9115"`,
    );
    await queryRunner.query(
      `ALTER TABLE "adquirentes_unidades" DROP CONSTRAINT "FK_8b898a63c331eabbd0924feb146"`,
    );
    await queryRunner.query(
      `ALTER TABLE "exames" DROP CONSTRAINT "FK_28567d5442ad00b97173797304e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "exames" DROP CONSTRAINT "FK_fedb3d5bde5b26abdc2613f6894"`,
    );
    await queryRunner.query(
      `ALTER TABLE "laboratorios_amostras" DROP CONSTRAINT "FK_16bc3aa1c456a10aae432b7f8e4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "laboratorios_amostras" DROP CONSTRAINT "FK_fde16f8e46073cd5218620129ed"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ordens_servico" DROP CONSTRAINT "FK_530803f526491bc4066c4141d42"`,
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
      `ALTER TABLE "tabelas_preco" DROP CONSTRAINT "FK_70fbab44f2346ac61cf0a311428"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tabelas_preco_itens" DROP CONSTRAINT "FK_769f817fd5006f5299fcc726643"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tabelas_preco_itens" DROP CONSTRAINT "FK_6afc466dbe428dc7033b2760c28"`,
    );
    await queryRunner.query(
      `ALTER TABLE "instrucoes" DROP CONSTRAINT "FK_dd26562872777bf8ce16f997061"`,
    );
    await queryRunner.query(
      `ALTER TABLE "planos" DROP CONSTRAINT "FK_5acc2a4e3f7c8e181c012892608"`,
    );
    await queryRunner.query(
      `ALTER TABLE "integracoes" DROP CONSTRAINT "FK_84ec1c9f1b03cc6f743c6c756cc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "integracoes_configuracoes" DROP CONSTRAINT "FK_e0657f48516490bcca4c8f72ab1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cabecalhos_rodapes" DROP CONSTRAINT "UQ_815c5de529925383af424487d5b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "laboratorios_amostras" DROP CONSTRAINT "UQ_007d2ff61f7e9d4d28de9581278"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tabelas_preco_itens" DROP CONSTRAINT "UQ_12c6904c6813009939bf33a5910"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_0a59bba03b5a58296f52278b8e"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_401cb37cfc88099f2a517b092a"`,
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_config_campos_entidade"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_79ac34bb25b9669b6d4eca58ea"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_85be38014689abcdaea6f22cd0"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_fde16f8e46073cd5218620129e"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_16bc3aa1c456a10aae432b7f8e"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_d1c6acf477527441934643ba0c"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_84ec1c9f1b03cc6f743c6c756c"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_b2c226842808110feee86182a8"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_e0657f48516490bcca4c8f72ab"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_039302adea898dadb95eaffb19"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_3489eeec5abb0f9a8bb3eeda45"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cabecalhos_rodapes" ALTER COLUMN "atualizado_em" SET DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "cabecalhos_rodapes" ALTER COLUMN "criado_em" SET DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."tipo_cabecalho_rodape_enum_old" AS ENUM('CABECALHO', 'RODAPE')`,
    );
    await queryRunner.query(
      `ALTER TABLE "cabecalhos_rodapes" ALTER COLUMN "tipo" TYPE "public"."tipo_cabecalho_rodape_enum_old" USING "tipo"::"text"::"public"."tipo_cabecalho_rodape_enum_old"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."cabecalhos_rodapes_tipo_enum"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."tipo_cabecalho_rodape_enum_old" RENAME TO "tipo_cabecalho_rodape_enum"`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "equipamentos"."numeracao" IS NULL`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "equipamentos"."codigo_interno" IS NULL`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "salas"."nome" IS 'Nome da sala (ex: Sala de Coleta 1)'`,
    );
    await queryRunner.query(
      `ALTER TABLE "formularios_atendimento" ALTER COLUMN "atualizado_em" SET DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "formularios_atendimento" ALTER COLUMN "criado_em" SET DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "configuracoes_campos_formulario"."nome_campo" IS 'Nome do campo no formulário'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "configuracoes_campos_formulario"."tipo_formulario" IS 'Tipo do formulário: cadastro_paciente, ordem_servico, tiss'`,
    );
    await queryRunner.query(
      `ALTER TABLE "configuracoes_campos_formulario" DROP COLUMN "tipo_formulario"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."configuracoes_campos_formulario_tipo_formulario_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "configuracoes_campos_formulario" ADD "tipo_formulario" character varying(50) NOT NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_config_campos_entidade" ON "configuracoes_campos_formulario" ("entidade_tipo", "entidade_id", "tipo_formulario") `,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "matrizes_exames"."ativo" IS 'Se a matriz está ativa (soft delete)'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "matrizes_exames"."exame_id" IS 'ID do exame específico (opcional, para matrizes exclusivas)'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "matrizes_exames"."tipo_exame_id" IS 'ID do tipo de exame ao qual esta matriz pertence'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "matrizes_exames"."nome" IS 'Nome da matriz (ex: Audiometria Tonal Padrão)'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "matrizes_exames"."codigo_interno" IS 'Código interno único da matriz (ex: MTZ-AUDIO-001)'`,
    );
    await queryRunner.query(
      `ALTER TABLE "matrizes_exames" ADD CONSTRAINT "FK_79ac34bb25b9669b6d4eca58eaa" FOREIGN KEY ("exame_id") REFERENCES "exames"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "matrizes_exames" ADD CONSTRAINT "FK_f6db3a4dfb5633ff6cab58234ee" FOREIGN KEY ("tipo_exame_id") REFERENCES "tipos_exame"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."adquirentes_opcao_parcelamento_enum_old" AS ENUM('12x', '3x', '6x', 'avista')`,
    );
    await queryRunner.query(
      `ALTER TABLE "adquirentes" ALTER COLUMN "opcao_parcelamento" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "adquirentes" ALTER COLUMN "opcao_parcelamento" TYPE "public"."adquirentes_opcao_parcelamento_enum_old" USING "opcao_parcelamento"::"text"::"public"."adquirentes_opcao_parcelamento_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "adquirentes" ALTER COLUMN "opcao_parcelamento" SET DEFAULT '12x'`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."adquirentes_opcao_parcelamento_enum"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."adquirentes_opcao_parcelamento_enum_old" RENAME TO "adquirentes_opcao_parcelamento_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "adquirentes_unidades" ALTER COLUMN "ativo" DROP NOT NULL`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "exames"."amostra_id" IS 'FK para alternativa do campo amostra'`,
    );
    await queryRunner.query(
      `ALTER TABLE "amostras" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "amostras" ALTER COLUMN "updated_at" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "amostras" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "amostras" ALTER COLUMN "created_at" DROP NOT NULL`,
    );
    await queryRunner.query(`COMMENT ON COLUMN "amostras"."status" IS NULL`);
    await queryRunner.query(
      `ALTER TABLE "amostras" ALTER COLUMN "status" DROP NOT NULL`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."status_amostra_enum_old" AS ENUM('ativo', 'em_revisao', 'inativo')`,
    );
    await queryRunner.query(
      `ALTER TABLE "amostras" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "amostras" ALTER COLUMN "status" TYPE "public"."status_amostra_enum_old" USING "status"::"text"::"public"."status_amostra_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "amostras" ALTER COLUMN "status" SET DEFAULT 'em_revisao'`,
    );
    await queryRunner.query(`DROP TYPE "public"."amostras_status_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."status_amostra_enum_old" RENAME TO "status_amostra_enum"`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "amostras"."codigo_interno" IS 'Código único da amostra (ex: SANG-EDTA-001)'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "amostras"."nome" IS 'Nome da amostra (ex: Sangue Total com EDTA)'`,
    );
    await queryRunner.query(
      `ALTER TABLE "laboratorios_amostras" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "laboratorios_amostras" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."atualizado_em" IS 'Data de atualização'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."criado_em" IS 'Data de criação'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."tabela_material_id" IS 'FK → Tabela de materiais'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."tabela_base_id" IS 'FK → Tabela base'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."tabela_servico_id" IS 'FK → Tabela de serviços'`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "kit_convenios" ADD CONSTRAINT "FK_b64239cdf9789aa3c014c80cc4a" FOREIGN KEY ("convenio_id") REFERENCES "convenios"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "planos" ADD CONSTRAINT "FK_5acc2a4e3f7c8e181c012892608" FOREIGN KEY ("convenio_id") REFERENCES "convenios"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ordens_servico" ADD CONSTRAINT "FK_530803f526491bc4066c4141d42" FOREIGN KEY ("convenio_id") REFERENCES "convenios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "instrucoes" ADD CONSTRAINT "FK_dd26562872777bf8ce16f997061" FOREIGN KEY ("convenio_id") REFERENCES "convenios"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tabelas_preco" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "tabelas_preco" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "tabelas_preco"."empresa_id" IS NULL`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "tabelas_preco"."ativo" IS NULL`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "tabelas_preco"."observacoes" IS NULL`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "tabelas_preco"."tipo_tabela" IS NULL`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."tipo_tabela_preco_enum_old" AS ENUM('material_medicamento', 'servico')`,
    );
    await queryRunner.query(
      `ALTER TABLE "tabelas_preco" ALTER COLUMN "tipo_tabela" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "tabelas_preco" ALTER COLUMN "tipo_tabela" TYPE "public"."tipo_tabela_preco_enum_old" USING "tipo_tabela"::"text"::"public"."tipo_tabela_preco_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tabelas_preco" ALTER COLUMN "tipo_tabela" SET DEFAULT 'servico'`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."tabelas_preco_tipo_tabela_enum"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."tipo_tabela_preco_enum_old" RENAME TO "tipo_tabela_preco_enum"`,
    );
    await queryRunner.query(`COMMENT ON COLUMN "tabelas_preco"."nome" IS NULL`);
    await queryRunner.query(
      `COMMENT ON COLUMN "tabelas_preco"."codigo_interno" IS NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "tabelas_preco_itens" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "tabelas_preco_itens" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "tabelas_preco_itens"."ativo" IS NULL`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "tabelas_preco_itens"."custo_operacional" IS NULL`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "tabelas_preco_itens"."valor" IS NULL`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "tabelas_preco_itens"."porte" IS NULL`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "tabelas_preco_itens"."filme_separado" IS NULL`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "tabelas_preco_itens"."quantidade_filme" IS NULL`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "tabelas_preco_itens"."moeda" IS NULL`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "tabelas_preco_itens"."codigo_convenio" IS NULL`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "tabelas_preco_itens"."exame_id" IS NULL`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "tabelas_preco_itens"."tabela_preco_id" IS NULL`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "integracoes"."ultimo_erro" IS NULL`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "integracoes"."tentativas_falhas" IS NULL`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "integracoes"."ultima_sincronizacao" IS NULL`,
    );
    await queryRunner.query(`COMMENT ON COLUMN "integracoes"."ativo" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "integracoes"."status" IS NULL`);
    await queryRunner.query(
      `COMMENT ON COLUMN "integracoes"."unidade_saude_id" IS NULL`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "integracoes"."codigo_identificacao" IS 'Código único da instância da integração'`,
    );
    await queryRunner.query(
      `ALTER TABLE "integracoes" DROP CONSTRAINT "UQ_b2c226842808110feee86182a81"`,
    );
    await queryRunner.query(
      `ALTER TABLE "integracoes" DROP COLUMN "codigo_identificacao"`,
    );
    await queryRunner.query(
      `ALTER TABLE "integracoes" ADD "codigo_identificacao" character varying(50) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "integracoes" ADD CONSTRAINT "UQ_b2c226842808110feee86182a81" UNIQUE ("codigo_identificacao")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b2c226842808110feee86182a8" ON "integracoes" ("codigo_identificacao") `,
    );
    await queryRunner.query(
      `ALTER TABLE "integracoes" ADD CONSTRAINT "FK_84ec1c9f1b03cc6f743c6c756cc" FOREIGN KEY ("unidade_saude_id") REFERENCES "unidades_saude"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "profissionais" DROP COLUMN "examesAlemEspecialidade"`,
    );
    await queryRunner.query(
      `ALTER TABLE "profissionais" DROP COLUMN "examesNaoRealiza"`,
    );
    await queryRunner.query(
      `ALTER TABLE "profissionais" DROP COLUMN "senhaAssinatura"`,
    );
    await queryRunner.query(
      `ALTER TABLE "profissionais" DROP COLUMN "usuarioAssinatura"`,
    );
    await queryRunner.query(
      `ALTER TABLE "profissionais" DROP COLUMN "serialNumberCertificado"`,
    );
    await queryRunner.query(
      `ALTER TABLE "profissionais" DROP COLUMN "especialidadePrincipalId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "profissionais" ADD "especialidadePrincipal" character varying`,
    );
    await queryRunner.query(`ALTER TABLE "kits" ADD "observacoes" text`);
    await queryRunner.query(`ALTER TABLE "kits" ADD "data_criacao" TIMESTAMP`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_4de6ebfce106c0eaf183912a17"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_8050a12283fe0a8aacabca6402"`,
    );
    await queryRunner.query(
      `DROP TABLE "profissionais_especialidades_realiza"`,
    );
    await queryRunner.query(`DROP TABLE "especialidades"`);
    await queryRunner.query(
      `ALTER TABLE "adquirentes_unidades" ADD CONSTRAINT "UQ_adquirente_unidade" UNIQUE ("adquirente_id", "unidade_saude_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "laboratorios_amostras" ADD CONSTRAINT "UQ_laboratorios_amostras_laboratorio_amostra" UNIQUE ("laboratorio_id", "amostra_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "tabelas_preco_itens" ADD CONSTRAINT "uq_tabela_preco_exame" UNIQUE ("tabela_preco_id", "exame_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_CABECALHOS_RODAPES_UNIDADE" ON "cabecalhos_rodapes" ("unidade_id") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_CABECALHOS_RODAPES_UNIDADE_TIPO" ON "cabecalhos_rodapes" ("unidade_id", "tipo") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_equipamentos_sala_id" ON "equipamentos" ("sala_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_equipamentos_unidade_id" ON "equipamentos" ("unidade_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_equipamentos_nome" ON "equipamentos" ("nome") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_equipamentos_codigo_interno" ON "equipamentos" ("codigo_interno") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_salas_unidade_id" ON "salas" ("unidade_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_salas_nome" ON "salas" ("nome") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_salas_codigo_interno" ON "salas" ("codigo_interno") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_FORMULARIOS_ATENDIMENTO_UNIDADE" ON "formularios_atendimento" ("unidade_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_matrizes_exames_exame_id" ON "matrizes_exames" ("exame_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_classes_cfo_hierarquia_ordem" ON "classes_cfo" ("hierarquia_id", "ordem") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_adquirente_integracao" ON "adquirentes" ("integracao_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_adquirente_unidade_unidade" ON "adquirentes_unidades" ("unidade_saude_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_adquirente_unidade_adquirente" ON "adquirentes_unidades" ("adquirente_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_laboratorios_amostras_amostra_id" ON "laboratorios_amostras" ("amostra_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_laboratorios_amostras_laboratorio_id" ON "laboratorios_amostras" ("laboratorio_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ddd3718e7bbc953f53820939f8" ON "convenios" ("nome") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_tabelas_preco_empresa_id" ON "tabelas_preco" ("empresa_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_tabelas_preco_ativo" ON "tabelas_preco" ("ativo") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_tabelas_preco_tipo_tabela" ON "tabelas_preco" ("tipo_tabela") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_tabelas_preco_codigo_interno" ON "tabelas_preco" ("codigo_interno") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_tabelas_preco_itens_ativo" ON "tabelas_preco_itens" ("ativo") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_tabelas_preco_itens_exame_id" ON "tabelas_preco_itens" ("exame_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_tabelas_preco_itens_tabela_id" ON "tabelas_preco_itens" ("tabela_preco_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_integracoes_codigo_identificacao" ON "integracoes" ("codigo_identificacao") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_integracoes_unidade_saude_id" ON "integracoes" ("unidade_saude_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_integracoes_template_slug" ON "integracoes" ("template_slug") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "idx_integracoes_configuracoes_integracao_chave" ON "integracoes_configuracoes" ("integracao_id", "chave") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_integracoes_configuracoes_chave" ON "integracoes_configuracoes" ("chave") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_integracoes_configuracoes_integracao_id" ON "integracoes_configuracoes" ("integracao_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "kits" ADD CONSTRAINT "FK_kits_criado_por" FOREIGN KEY ("criado_por_id") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "kits" ADD CONSTRAINT "FK_kits_atualizado_por" FOREIGN KEY ("atualizado_por_id") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "classes_cfo" ADD CONSTRAINT "FK_classes_cfo_hierarquia" FOREIGN KEY ("hierarquia_id") REFERENCES "hierarquias_cfo"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "adquirentes" ADD CONSTRAINT "FK_adquirente_integracao" FOREIGN KEY ("integracao_id") REFERENCES "integracoes"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "adquirentes_unidades" ADD CONSTRAINT "FK_adquirente_unidade_adquirente" FOREIGN KEY ("adquirente_id") REFERENCES "adquirentes"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "adquirentes_unidades" ADD CONSTRAINT "FK_adquirente_unidade_unidade" FOREIGN KEY ("unidade_saude_id") REFERENCES "unidades_saude"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "exames" ADD CONSTRAINT "FK_fedb3d5bde5b26abdc2613f6894" FOREIGN KEY ("amostra_id") REFERENCES "alternativas_campo_formulario"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "exames" ADD CONSTRAINT "FK_exames_amostra_enviar" FOREIGN KEY ("amostra_enviar_id") REFERENCES "alternativas_campo_formulario"("id") ON DELETE SET NULL ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "laboratorios_amostras" ADD CONSTRAINT "FK_laboratorios_amostras_laboratorio" FOREIGN KEY ("laboratorio_id") REFERENCES "laboratorios"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "laboratorios_amostras" ADD CONSTRAINT "FK_laboratorios_amostras_amostra" FOREIGN KEY ("amostra_id") REFERENCES "amostras"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
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
      `ALTER TABLE "convenios" ADD CONSTRAINT "fk_convenios_tabela_servico" FOREIGN KEY ("tabela_servico_id") REFERENCES "tabelas_preco"("id") ON DELETE SET NULL ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD CONSTRAINT "fk_convenios_tabela_base" FOREIGN KEY ("tabela_base_id") REFERENCES "tabelas_preco"("id") ON DELETE SET NULL ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD CONSTRAINT "fk_convenios_tabela_material" FOREIGN KEY ("tabela_material_id") REFERENCES "tabelas_preco"("id") ON DELETE SET NULL ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "tabelas_preco" ADD CONSTRAINT "fk_tabelas_preco_empresa" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE SET NULL ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "tabelas_preco_itens" ADD CONSTRAINT "fk_tabelas_preco_itens_tabela" FOREIGN KEY ("tabela_preco_id") REFERENCES "tabelas_preco"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "tabelas_preco_itens" ADD CONSTRAINT "fk_tabelas_preco_itens_exame" FOREIGN KEY ("exame_id") REFERENCES "exames"("id") ON DELETE RESTRICT ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "integracoes_configuracoes" ADD CONSTRAINT "fk_integracoes_configuracoes_integracao" FOREIGN KEY ("integracao_id") REFERENCES "integracoes"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}
