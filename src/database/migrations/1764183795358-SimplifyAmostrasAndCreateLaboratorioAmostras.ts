import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableIndex,
  TableForeignKey,
} from 'typeorm';

export class SimplifyAmostrasAndCreateLaboratorioAmostras1764183795358
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Criar o novo enum de status para amostras
    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE "status_amostra_enum" AS ENUM('ativo', 'inativo', 'em_revisao');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    // 2. Adicionar nova coluna de status (se não existir)
    const hasStatusColumn = await queryRunner.hasColumn('amostras', 'status');
    if (!hasStatusColumn) {
      await queryRunner.query(`
        ALTER TABLE "amostras" ADD COLUMN "status" "status_amostra_enum" DEFAULT 'em_revisao'
      `);
    }

    // 3. Remover colunas antigas da tabela amostras
    const columnsToRemove = [
      'tipo_amostra',
      'recipiente_padrao',
      'cor_tampa',
      'volume_minimo',
      'volume_ideal',
      'unidade_volume',
      'instrucoes_coleta',
      'materiais_necessarios',
      'requer_jejum',
      'tempo_jejum',
      'instrucoes_preparo_paciente',
      'restricoes',
      'temperatura_armazenamento',
      'temperatura_min',
      'temperatura_max',
      'prazo_validade_horas',
      'condicoes_armazenamento',
      'sensibilidade_luz',
      'requer_centrifugacao',
      'tempo_centrifugacao',
      'rotacao_centrifugacao',
      'instrucoes_transporte',
      'temperatura_transporte',
      'embalagem_especial',
      'observacoes_transporte',
      'cor_etiqueta',
      'codigo_barras',
      'template_etiqueta',
      'exige_autorizacao',
      'observacoes',
      'ativo',
      'empresa_id',
      'criado_por',
      'atualizado_por',
      'criado_em',
      'atualizado_em',
    ];

    for (const columnName of columnsToRemove) {
      const hasColumn = await queryRunner.hasColumn('amostras', columnName);
      if (hasColumn) {
        await queryRunner.dropColumn('amostras', columnName);
      }
    }

    // 4. Remover índices antigos se existirem
    const indexesToRemove = [
      'IDX_amostras_tipo_amostra',
      'IDX_amostras_empresa_id',
    ];

    for (const indexName of indexesToRemove) {
      try {
        await queryRunner.query(`DROP INDEX IF EXISTS "${indexName}"`);
      } catch {
        // Index não existe, continua
      }
    }

    // 5. Remover enums antigos
    await queryRunner.query(`DROP TYPE IF EXISTS "tipo_amostra_enum" CASCADE`);
    await queryRunner.query(
      `DROP TYPE IF EXISTS "unidade_volume_enum" CASCADE`,
    );
    await queryRunner.query(
      `DROP TYPE IF EXISTS "temperatura_armazenamento_enum" CASCADE`,
    );
    await queryRunner.query(
      `DROP TYPE IF EXISTS "temperatura_transporte_enum" CASCADE`,
    );

    // 6. Garantir que as colunas padrão existem
    const hasCreatedAt = await queryRunner.hasColumn('amostras', 'created_at');
    if (!hasCreatedAt) {
      await queryRunner.query(`
        ALTER TABLE "amostras" ADD COLUMN "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      `);
    }

    const hasUpdatedAt = await queryRunner.hasColumn('amostras', 'updated_at');
    if (!hasUpdatedAt) {
      await queryRunner.query(`
        ALTER TABLE "amostras" ADD COLUMN "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      `);
    }

    // 7. Criar tabela de relacionamento laboratorios_amostras
    await queryRunner.createTable(
      new Table({
        name: 'laboratorios_amostras',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'laboratorio_id',
            type: 'uuid',
            comment: 'ID do laboratório',
          },
          {
            name: 'amostra_id',
            type: 'uuid',
            comment: 'ID da amostra',
          },
          {
            name: 'validado',
            type: 'boolean',
            default: false,
            comment:
              'Indica se o laboratório está validado para usar esta amostra',
          },
          {
            name: 'data_validacao',
            type: 'timestamp',
            isNullable: true,
            comment: 'Data de validação do laboratório para a amostra',
          },
          {
            name: 'observacoes',
            type: 'text',
            isNullable: true,
            comment: 'Observações sobre o vínculo laboratório-amostra',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // 8. Adicionar índices
    await queryRunner.createIndex(
      'laboratorios_amostras',
      new TableIndex({
        name: 'IDX_laboratorios_amostras_laboratorio_id',
        columnNames: ['laboratorio_id'],
      }),
    );

    await queryRunner.createIndex(
      'laboratorios_amostras',
      new TableIndex({
        name: 'IDX_laboratorios_amostras_amostra_id',
        columnNames: ['amostra_id'],
      }),
    );

    // 9. Adicionar constraint unique
    await queryRunner.query(`
      ALTER TABLE "laboratorios_amostras"
      ADD CONSTRAINT "UQ_laboratorios_amostras_laboratorio_amostra"
      UNIQUE ("laboratorio_id", "amostra_id")
    `);

    // 10. Adicionar foreign keys
    await queryRunner.createForeignKey(
      'laboratorios_amostras',
      new TableForeignKey({
        name: 'FK_laboratorios_amostras_laboratorio',
        columnNames: ['laboratorio_id'],
        referencedTableName: 'laboratorios',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'laboratorios_amostras',
      new TableForeignKey({
        name: 'FK_laboratorios_amostras_amostra',
        columnNames: ['amostra_id'],
        referencedTableName: 'amostras',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // 1. Remover foreign keys
    await queryRunner.dropForeignKey(
      'laboratorios_amostras',
      'FK_laboratorios_amostras_amostra',
    );
    await queryRunner.dropForeignKey(
      'laboratorios_amostras',
      'FK_laboratorios_amostras_laboratorio',
    );

    // 2. Remover tabela laboratorios_amostras
    await queryRunner.dropTable('laboratorios_amostras');

    // 3. Recriar enums antigos
    await queryRunner.query(`
      CREATE TYPE "tipo_amostra_enum" AS ENUM('sangue', 'soro', 'plasma', 'urina', 'fezes', 'swab', 'liquor', 'escarro', 'tecido', 'saliva', 'secrecao', 'outros')
    `);
    await queryRunner.query(`
      CREATE TYPE "unidade_volume_enum" AS ENUM('mL', 'L', 'g', 'mg', 'unidade')
    `);
    await queryRunner.query(`
      CREATE TYPE "temperatura_armazenamento_enum" AS ENUM('ambiente', 'refrigerado', 'congelado', 'ultracongelado', 'nitrogenio', 'especial')
    `);
    await queryRunner.query(`
      CREATE TYPE "temperatura_transporte_enum" AS ENUM('ambiente', 'refrigerado', 'congelado', 'gelo_seco', 'nitrogenio')
    `);

    // 4. Recriar colunas antigas (estrutura básica para rollback)
    await queryRunner.query(`
      ALTER TABLE "amostras"
      ADD COLUMN IF NOT EXISTS "tipo_amostra" "tipo_amostra_enum",
      ADD COLUMN IF NOT EXISTS "ativo" boolean DEFAULT true,
      ADD COLUMN IF NOT EXISTS "empresa_id" uuid,
      ADD COLUMN IF NOT EXISTS "criado_por" uuid,
      ADD COLUMN IF NOT EXISTS "atualizado_por" uuid,
      ADD COLUMN IF NOT EXISTS "criado_em" timestamp DEFAULT CURRENT_TIMESTAMP,
      ADD COLUMN IF NOT EXISTS "atualizado_em" timestamp DEFAULT CURRENT_TIMESTAMP
    `);

    // 5. Remover coluna status e enum
    await queryRunner.dropColumn('amostras', 'status');
    await queryRunner.query(`DROP TYPE IF EXISTS "status_amostra_enum"`);
  }
}
