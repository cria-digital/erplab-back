import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Migration para adicionar tenant_id às tabelas que estão faltando.
 * Algumas tabelas de relacionamento e outras tabelas de negócio
 * não foram incluídas na migration anterior.
 */
export class AddTenantIdToMissingTables1765400003000
  implements MigrationInterface
{
  name = 'AddTenantIdToMissingTables1765400003000';

  // Tabelas que precisam de tenant_id
  private readonly tabelas = [
    'kit_exames',
    'kit_convenios',
    'kit_unidades',
    'exames_unidades',
    'formularios',
    'respostas_campo',
    'respostas_formulario',
    'anexos_contas_pagar',
    'fornecedor_insumos',
    'prestador_servico_categorias',
    'profissionais_especialidades_realiza',
    'configuracoes_atendimento_convenio',
    'restricoes_adquirente',
    'tabelas_preco_itens',
    'cnae_secundarios',
    'alternativas_campo',
    'enderecos',
    'planos_contas',
    'servicos_saude',
  ];

  public async up(queryRunner: QueryRunner): Promise<void> {
    console.log('🔄 Adicionando tenant_id às tabelas faltantes...\n');

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
          console.log(`  ⚠️  ${tabela}: Tabela não existe, pulando...`);
          continue;
        }

        // Verifica se a coluna tenant_id já existe
        const columnExists = await queryRunner.query(`
          SELECT EXISTS (
            SELECT FROM information_schema.columns
            WHERE table_schema = 'public'
            AND table_name = '${tabela}'
            AND column_name = 'tenant_id'
          )
        `);

        if (columnExists[0].exists) {
          console.log(`  ✅ ${tabela}: tenant_id já existe`);
          continue;
        }

        // Adiciona a coluna tenant_id
        await queryRunner.query(`
          ALTER TABLE "${tabela}" ADD COLUMN "tenant_id" uuid
        `);

        // Adiciona a FK para tenants
        await queryRunner.query(`
          ALTER TABLE "${tabela}"
          ADD CONSTRAINT "FK_${tabela}_tenant"
          FOREIGN KEY ("tenant_id")
          REFERENCES "tenants"("id")
          ON DELETE SET NULL
        `);

        // Adiciona índice para performance
        await queryRunner.query(`
          CREATE INDEX "IDX_${tabela}_tenant_id" ON "${tabela}" ("tenant_id")
        `);

        console.log(`  ✅ ${tabela}: tenant_id adicionado com sucesso`);
      } catch (error) {
        console.log(`  ❌ ${tabela}: Erro - ${error.message}`);
      }
    }

    console.log('\n✅ Migration concluída!');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    console.log('⚠️  Revertendo: Removendo tenant_id das tabelas...');

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
          ALTER TABLE "${tabela}" DROP COLUMN "tenant_id"
        `);

        console.log(`  ✅ ${tabela}: tenant_id removido`);
      } catch (error) {
        console.log(`  ⚠️  ${tabela}: Erro - ${error.message}`);
      }
    }
  }
}
