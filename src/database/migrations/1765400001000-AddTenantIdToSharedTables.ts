import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Migration para adicionar tenant_id em tabelas que eram compartilhadas
 * mas precisam de tenant para isolamento de dados.
 */
export class AddTenantIdToSharedTables1765400001000
  implements MigrationInterface
{
  name = 'AddTenantIdToSharedTables1765400001000';

  // Tabelas que precisam de tenant_id
  private readonly tabelas = [
    'campos_formulario',
    'alternativas_campo_formulario',
    'grupos_exame',
    'amostras',
    'recipientes',
    'materiais',
    'metodos',
    'volumes',
    'valores_referencia',
    'exame_materiais',
    'tabelas_preco',
    'itens_tabela_preco',
    'grupos_tabela_preco',
    'matrizes_exames',
    'campos_matriz',
  ];

  public async up(queryRunner: QueryRunner): Promise<void> {
    console.log(
      'Iniciando adição de tenant_id em tabelas anteriormente compartilhadas...',
    );

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

    console.log('Adição de tenant_id em tabelas compartilhadas concluída!');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    console.log('Removendo tenant_id de tabelas compartilhadas...');

    for (const tabela of this.tabelas.reverse()) {
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
