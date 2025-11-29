import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Migration para refatorar a estrutura de Tabelas de Preço conforme Figma.
 *
 * Mudanças:
 * 1. Recria tabela `tabelas_preco` com nova estrutura (sem vínculo com planos)
 * 2. Cria nova tabela `tabelas_preco_itens` para os itens/linhas da tabela
 * 3. Atualiza FKs na tabela `convenios` para apontar para `tabelas_preco`
 *
 * TABELAS AFETADAS:
 * - tabelas_preco (drop e recriação)
 * - tabelas_preco_itens (nova)
 * - convenios (apenas atualização de FKs em 3 colunas existentes)
 */
export class RefactorTabelasPrecoConfirmeFigma1764425819791
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // =====================================================
    // PASSO 1: Remover tabela antiga se existir
    // =====================================================
    await queryRunner.query(`
      ALTER TABLE IF EXISTS tabelas_preco DROP CONSTRAINT IF EXISTS "FK_TABELA_PLANO"
    `);
    await queryRunner.query(`DROP TABLE IF EXISTS tabelas_preco CASCADE`);
    await queryRunner.query(
      `DROP TYPE IF EXISTS tipo_tabela_preco_enum CASCADE`,
    );

    console.log(
      '[Migration] Tabela tabelas_preco antiga removida (se existia)',
    );

    // =====================================================
    // PASSO 2: Criar enum e nova tabela tabelas_preco
    // =====================================================
    await queryRunner.query(`
      CREATE TYPE tipo_tabela_preco_enum AS ENUM ('servico', 'material_medicamento')
    `);

    await queryRunner.query(`
      CREATE TABLE tabelas_preco (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        codigo_interno VARCHAR(50) NOT NULL UNIQUE,
        nome VARCHAR(255) NOT NULL,
        tipo_tabela tipo_tabela_preco_enum NOT NULL DEFAULT 'servico',
        observacoes TEXT,
        ativo BOOLEAN NOT NULL DEFAULT true,
        empresa_id UUID,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

        CONSTRAINT fk_tabelas_preco_empresa
          FOREIGN KEY (empresa_id) REFERENCES empresas(id)
          ON DELETE SET NULL ON UPDATE CASCADE
      )
    `);

    await queryRunner.query(
      `CREATE INDEX idx_tabelas_preco_codigo_interno ON tabelas_preco(codigo_interno)`,
    );
    await queryRunner.query(
      `CREATE INDEX idx_tabelas_preco_tipo_tabela ON tabelas_preco(tipo_tabela)`,
    );
    await queryRunner.query(
      `CREATE INDEX idx_tabelas_preco_ativo ON tabelas_preco(ativo)`,
    );
    await queryRunner.query(
      `CREATE INDEX idx_tabelas_preco_empresa_id ON tabelas_preco(empresa_id)`,
    );

    console.log('[Migration] Tabela tabelas_preco criada');

    // =====================================================
    // PASSO 3: Criar tabela tabelas_preco_itens
    // =====================================================
    await queryRunner.query(`
      CREATE TABLE tabelas_preco_itens (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        tabela_preco_id UUID NOT NULL,
        exame_id UUID NOT NULL,
        codigo_convenio VARCHAR(50),
        moeda VARCHAR(10) NOT NULL DEFAULT 'BRL',
        quantidade_filme DECIMAL(10,4) NOT NULL DEFAULT 0,
        filme_separado BOOLEAN NOT NULL DEFAULT false,
        porte INTEGER NOT NULL DEFAULT 0,
        valor DECIMAL(10,2) NOT NULL,
        custo_operacional DECIMAL(10,2),
        ativo BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

        CONSTRAINT fk_tabelas_preco_itens_tabela
          FOREIGN KEY (tabela_preco_id) REFERENCES tabelas_preco(id)
          ON DELETE CASCADE ON UPDATE CASCADE,

        CONSTRAINT fk_tabelas_preco_itens_exame
          FOREIGN KEY (exame_id) REFERENCES exames(id)
          ON DELETE RESTRICT ON UPDATE CASCADE,

        CONSTRAINT uq_tabela_preco_exame
          UNIQUE (tabela_preco_id, exame_id)
      )
    `);

    await queryRunner.query(
      `CREATE INDEX idx_tabelas_preco_itens_tabela_id ON tabelas_preco_itens(tabela_preco_id)`,
    );
    await queryRunner.query(
      `CREATE INDEX idx_tabelas_preco_itens_exame_id ON tabelas_preco_itens(exame_id)`,
    );
    await queryRunner.query(
      `CREATE INDEX idx_tabelas_preco_itens_ativo ON tabelas_preco_itens(ativo)`,
    );

    console.log('[Migration] Tabela tabelas_preco_itens criada');

    // =====================================================
    // PASSO 4: Atualizar FKs na tabela convenios
    // =====================================================

    // Remover FKs antigas (se existirem)
    await queryRunner.query(
      `ALTER TABLE convenios DROP CONSTRAINT IF EXISTS "fk_convenios_tabela_servico"`,
    );
    await queryRunner.query(
      `ALTER TABLE convenios DROP CONSTRAINT IF EXISTS "fk_convenios_tabela_base"`,
    );
    await queryRunner.query(
      `ALTER TABLE convenios DROP CONSTRAINT IF EXISTS "fk_convenios_tabela_material"`,
    );

    // Verificar se as colunas existem, se não, criar
    const colunas = await queryRunner.query(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'convenios'
      AND column_name IN ('tabela_servico_id', 'tabela_base_id', 'tabela_material_id')
    `);

    const colunasExistentes = colunas.map(
      (c: { column_name: string }) => c.column_name,
    );

    if (!colunasExistentes.includes('tabela_servico_id')) {
      await queryRunner.query(
        `ALTER TABLE convenios ADD COLUMN tabela_servico_id UUID`,
      );
    }
    if (!colunasExistentes.includes('tabela_base_id')) {
      await queryRunner.query(
        `ALTER TABLE convenios ADD COLUMN tabela_base_id UUID`,
      );
    }
    if (!colunasExistentes.includes('tabela_material_id')) {
      await queryRunner.query(
        `ALTER TABLE convenios ADD COLUMN tabela_material_id UUID`,
      );
    }

    // Limpar valores antigos (apontavam para outra tabela)
    await queryRunner.query(`
      UPDATE convenios
      SET tabela_servico_id = NULL, tabela_base_id = NULL, tabela_material_id = NULL
      WHERE tabela_servico_id IS NOT NULL OR tabela_base_id IS NOT NULL OR tabela_material_id IS NOT NULL
    `);

    // Criar novas FKs
    await queryRunner.query(`
      ALTER TABLE convenios ADD CONSTRAINT fk_convenios_tabela_servico
      FOREIGN KEY (tabela_servico_id) REFERENCES tabelas_preco(id) ON DELETE SET NULL ON UPDATE CASCADE
    `);
    await queryRunner.query(`
      ALTER TABLE convenios ADD CONSTRAINT fk_convenios_tabela_base
      FOREIGN KEY (tabela_base_id) REFERENCES tabelas_preco(id) ON DELETE SET NULL ON UPDATE CASCADE
    `);
    await queryRunner.query(`
      ALTER TABLE convenios ADD CONSTRAINT fk_convenios_tabela_material
      FOREIGN KEY (tabela_material_id) REFERENCES tabelas_preco(id) ON DELETE SET NULL ON UPDATE CASCADE
    `);

    console.log('[Migration] FKs na tabela convenios atualizadas');
    console.log('[Migration] RefactorTabelasPrecoConfirmeFigma concluída!');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remover FKs de convenios
    await queryRunner.query(
      `ALTER TABLE convenios DROP CONSTRAINT IF EXISTS fk_convenios_tabela_servico`,
    );
    await queryRunner.query(
      `ALTER TABLE convenios DROP CONSTRAINT IF EXISTS fk_convenios_tabela_base`,
    );
    await queryRunner.query(
      `ALTER TABLE convenios DROP CONSTRAINT IF EXISTS fk_convenios_tabela_material`,
    );

    // Dropar tabelas novas
    await queryRunner.query(`DROP TABLE IF EXISTS tabelas_preco_itens`);
    await queryRunner.query(`DROP TABLE IF EXISTS tabelas_preco CASCADE`);
    await queryRunner.query(`DROP TYPE IF EXISTS tipo_tabela_preco_enum`);

    console.log(
      '[Migration Revert] RefactorTabelasPrecoConfirmeFigma revertida',
    );
  }
}
