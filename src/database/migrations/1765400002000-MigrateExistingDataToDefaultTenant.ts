import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Migration para migrar todos os dados existentes para o tenant padrão.
 * Atualiza tenant_id em todas as tabelas que possuem essa coluna.
 */
export class MigrateExistingDataToDefaultTenant1765400002000
  implements MigrationInterface
{
  name = 'MigrateExistingDataToDefaultTenant1765400002000';

  // Todas as tabelas que possuem tenant_id
  private readonly tabelas = [
    'usuarios',
    'pacientes',
    'profissionais',
    'unidades_saude',
    'empresas',
    'exames',
    'kits_exame',
    'kit_exames',
    'metodos',
    'matrizes_exames',
    'campos_matriz',
    'amostras',
    'recipientes',
    'materiais',
    'volumes',
    'valores_referencia',
    'exame_materiais',
    'convenios',
    'planos_convenio',
    'instrucoes_convenio',
    'laboratorios',
    'laboratorio_exames',
    'laboratorio_amostras',
    'telemedicina',
    'telemedicina_exames',
    'fornecedores',
    'prestadores_servico',
    'agendas',
    'periodos_atendimento',
    'horarios_especificos',
    'bloqueios_horario',
    'vinculacoes_agenda',
    'integracoes_atendimento',
    'contas_pagar',
    'parcelas_conta_pagar',
    'cabecalhos_rodapes',
    'formularios_atendimento',
    'configuracoes_campos_formulario',
    'campos_formulario',
    'alternativas_campo_formulario',
    'grupos_exame',
    'tabelas_preco',
    'itens_tabela_preco',
    'grupos_tabela_preco',
    'salas',
    'equipamentos',
    'etiquetas_amostra',
    'auditoria_logs',
    'historico_alteracoes',
    'preferencias_usuario',
    'historico_senhas',
  ];

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Busca o tenant padrão
    const tenants = await queryRunner.query(`
      SELECT id FROM tenants WHERE slug = 'tenant-padrao' LIMIT 1
    `);

    if (!tenants || tenants.length === 0) {
      console.log('⚠️  Tenant padrão não encontrado. Criando...');

      // Cria o tenant padrão se não existir
      await queryRunner.query(`
        INSERT INTO tenants (id, nome, slug, plano, limite_usuarios, limite_unidades, ativo, configuracoes)
        VALUES (
          uuid_generate_v4(),
          'Tenant Padrão',
          'tenant-padrao',
          'enterprise',
          100,
          50,
          true,
          '{"descricao": "Tenant padrão criado pela migration", "criadoAutomaticamente": true}'::jsonb
        )
      `);

      const newTenant = await queryRunner.query(`
        SELECT id FROM tenants WHERE slug = 'tenant-padrao' LIMIT 1
      `);

      if (!newTenant || newTenant.length === 0) {
        throw new Error('Falha ao criar tenant padrão');
      }
    }

    const tenantPadrao = await queryRunner.query(`
      SELECT id FROM tenants WHERE slug = 'tenant-padrao' LIMIT 1
    `);

    const tenantId = tenantPadrao[0].id;
    console.log(`✅ Tenant padrão encontrado: ${tenantId}`);
    console.log('🔄 Iniciando migração de dados para o tenant padrão...\n');

    let tabelasAtualizadas = 0;
    let registrosAtualizados = 0;

    for (const tabela of this.tabelas) {
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

        // Verifica se a coluna tenant_id existe na tabela
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

        // Conta quantos registros serão atualizados
        const countResult = await queryRunner.query(`
          SELECT COUNT(*) as count FROM "${tabela}" WHERE tenant_id IS NULL
        `);

        const count = parseInt(countResult[0].count, 10);

        if (count === 0) {
          continue;
        }

        // Atualiza todos os registros sem tenant_id
        await queryRunner.query(
          `
          UPDATE "${tabela}" SET tenant_id = $1 WHERE tenant_id IS NULL
        `,
          [tenantId],
        );

        console.log(`  ✅ ${tabela}: ${count} registro(s) atualizado(s)`);
        tabelasAtualizadas++;
        registrosAtualizados += count;
      } catch (error) {
        console.log(`  ⚠️  ${tabela}: Erro - ${error.message}`);
      }
    }

    console.log('\n==============================');
    console.log(`✅ Migração concluída!`);
    console.log(`   Tabelas atualizadas: ${tabelasAtualizadas}`);
    console.log(`   Registros migrados: ${registrosAtualizados}`);
    console.log('==============================');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    console.log(
      '⚠️  Revertendo: Definindo tenant_id como NULL em todas as tabelas...',
    );

    for (const tabela of this.tabelas) {
      try {
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

        await queryRunner.query(`
          UPDATE "${tabela}" SET tenant_id = NULL
        `);

        console.log(`  ✅ ${tabela}: tenant_id resetado para NULL`);
      } catch (error) {
        console.log(`  ⚠️  ${tabela}: Erro - ${error.message}`);
      }
    }
  }
}
