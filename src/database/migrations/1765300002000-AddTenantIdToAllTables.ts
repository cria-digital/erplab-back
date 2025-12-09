import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Migration para adicionar tenant_id em todas as tabelas de negócio.
 *
 * Tabelas COMPARTILHADAS (sem tenant_id):
 * - cnaes, estados, cidades, servicos_saude
 * - campos_formulario, alternativas_campo_formulario
 * - bancos, classes_cfo, hierarquias_cfo, plano_contas
 * - modulos_sistema, tipos_permissao
 * - tenants (própria tabela de tenants)
 *
 * Tabelas que já têm tenant_id:
 * - usuarios (adicionado na migration anterior)
 */
export class AddTenantIdToAllTables1765300002000 implements MigrationInterface {
  name = 'AddTenantIdToAllTables1765300002000';

  // Tabelas que precisam de tenant_id
  private readonly tabelasComTenant = [
    // Cadastros
    'empresas',
    'unidades_saude',
    'pacientes',
    'profissionais',
    'especialidades',
    'documentos_profissional',
    'horarios_atendimento',
    'dados_bancarios',
    'cnaes_secundarios',

    // Relacionamento
    'convenios',
    'planos',
    'instrucoes',
    'restricoes',
    'tabelas_precos',
    'tabelas_precos_itens',
    'planos_convenio',
    'instrucoes_convenio',
    'restricoes_convenio',
    'configuracoes_atendimento',
    'configuracoes_campos_convenio',
    'campos_personalizados_convenio',
    'dados_convenio',
    'integracoes_convenio',
    'procedimentos_autorizados',
    'laboratorios',
    'telemedicina',
    'telemedicina_exames',
    'fornecedores',
    'fornecedores_insumos',
    'prestadores_servico',
    'prestadores_servico_categorias',

    // Exames
    'exames',
    'laboratorios_apoio',
    'exames_laboratorios_apoio',
    'ordens_servico',
    'ordens_servico_exames',
    'resultados_exames',
    'kits',
    'kits_exames',
    'kits_convenios',
    'kits_unidades',
    'laboratorios_metodos',
    'laboratorios_amostras',

    // Atendimento
    'agendas',
    'periodos_atendimento',
    'horarios_especificos',
    'bloqueios_horario',
    'vinculacoes_agenda',
    'integracoes',
    'integracoes_configuracoes',

    // Financeiro
    'contas_bancarias',
    'contas_bancarias_unidades',
    'adquirentes',
    'adquirentes_unidades',
    'restricoes_adquirentes',
    'gateways_pagamento',
    'contas_contabeis',
    'contas_pagar',
    'parcelas',
    'pagamentos_parcelas',
    'anexos',
    'centros_custo',
    'composicoes_financeiras',
    'impostos_retidos',
    'parcelamentos_config',
    'repasses',
    'repasses_filtros',

    // Configurações
    'salas',
    'equipamentos',
    'etiquetas_amostra',
    'configuracoes_campos_formulario',
    'cabecalhos_rodapes',
    'formularios_atendimento',

    // Auditoria
    'auditoria_logs',
    'historico_alteracoes',
    'logs_auditoria',

    // Perfil
    'preferencias_usuario',
    'historico_senhas',

    // Usuários (relacionamentos)
    'usuarios_unidades',
    'usuarios_permissoes',
  ];

  public async up(queryRunner: QueryRunner): Promise<void> {
    console.log('Iniciando adição de tenant_id em todas as tabelas...');

    for (const tabela of this.tabelasComTenant) {
      try {
        // Verifica se a tabela existe
        const tableExists = await queryRunner.query(`
          SELECT EXISTS (
            SELECT FROM information_schema.tables
            WHERE table_schema = 'public'
            AND table_name = '${tabela}'
          )
        `);

        if (!tableExists[0].exists) {
          console.log(`  ⏭️  Tabela ${tabela} não existe, pulando...`);
          continue;
        }

        // Verifica se a coluna já existe
        const columnExists = await queryRunner.query(`
          SELECT EXISTS (
            SELECT FROM information_schema.columns
            WHERE table_schema = 'public'
            AND table_name = '${tabela}'
            AND column_name = 'tenant_id'
          )
        `);

        if (columnExists[0].exists) {
          console.log(
            `  ⏭️  Coluna tenant_id já existe em ${tabela}, pulando...`,
          );
          continue;
        }

        // Adiciona coluna tenant_id
        await queryRunner.query(`
          ALTER TABLE "${tabela}" ADD COLUMN "tenant_id" uuid
        `);

        // Adiciona FK para tenants
        await queryRunner.query(`
          ALTER TABLE "${tabela}"
          ADD CONSTRAINT "FK_${tabela}_tenant"
          FOREIGN KEY ("tenant_id")
          REFERENCES "tenants"("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE
        `);

        // Cria índice para tenant_id
        await queryRunner.query(`
          CREATE INDEX "IDX_${tabela}_tenant_id" ON "${tabela}" ("tenant_id")
        `);

        console.log(`  ✅ tenant_id adicionado em ${tabela}`);
      } catch (error) {
        console.log(
          `  ❌ Erro ao adicionar tenant_id em ${tabela}: ${error.message}`,
        );
      }
    }

    console.log('Adição de tenant_id concluída!');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    console.log('Removendo tenant_id de todas as tabelas...');

    for (const tabela of this.tabelasComTenant.reverse()) {
      try {
        // Verifica se a tabela existe
        const tableExists = await queryRunner.query(`
          SELECT EXISTS (
            SELECT FROM information_schema.tables
            WHERE table_schema = 'public'
            AND table_name = '${tabela}'
          )
        `);

        if (!tableExists[0].exists) {
          continue;
        }

        // Verifica se a coluna existe
        const columnExists = await queryRunner.query(`
          SELECT EXISTS (
            SELECT FROM information_schema.columns
            WHERE table_schema = 'public'
            AND table_name = '${tabela}'
            AND column_name = 'tenant_id'
          )
        `);

        if (!columnExists[0].exists) {
          continue;
        }

        // Remove índice
        await queryRunner.query(`
          DROP INDEX IF EXISTS "IDX_${tabela}_tenant_id"
        `);

        // Remove FK
        await queryRunner.query(`
          ALTER TABLE "${tabela}" DROP CONSTRAINT IF EXISTS "FK_${tabela}_tenant"
        `);

        // Remove coluna
        await queryRunner.query(`
          ALTER TABLE "${tabela}" DROP COLUMN IF EXISTS "tenant_id"
        `);

        console.log(`  ✅ tenant_id removido de ${tabela}`);
      } catch (error) {
        console.log(
          `  ❌ Erro ao remover tenant_id de ${tabela}: ${error.message}`,
        );
      }
    }

    console.log('Remoção de tenant_id concluída!');
  }
}
