import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateKitsTables1758567746245 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Criar enums
    await queryRunner.query(`
      CREATE TYPE tipo_kit_enum AS ENUM (
        'CHECK_UP',
        'OCUPACIONAL',
        'PRE_NATAL',
        'COM_DESCRICAO',
        'PERSONALIZADO'
      )
    `);

    await queryRunner.query(`
      CREATE TYPE status_kit_enum AS ENUM (
        'ATIVO',
        'INATIVO',
        'EM_REVISAO'
      )
    `);

    // Criar tabela kits
    await queryRunner.createTable(
      new Table({
        name: 'kits',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'codigo_interno',
            type: 'varchar',
            length: '50',
            isUnique: true,
            comment: 'Código interno único do kit (ex.: KIT001)',
          },
          {
            name: 'nome_kit',
            type: 'varchar',
            length: '255',
            comment: 'Nome do kit',
          },
          {
            name: 'descricao',
            type: 'text',
            isNullable: true,
            comment: 'Descrição detalhada do kit',
          },
          {
            name: 'tipo_kit',
            type: 'tipo_kit_enum',
            comment: 'Tipo de kit',
          },
          {
            name: 'status_kit',
            type: 'status_kit_enum',
            default: "'ATIVO'",
            comment: 'Status do kit',
          },
          {
            name: 'empresa_id',
            type: 'uuid',
            comment: 'ID da empresa associada ao kit',
          },
          {
            name: 'prazo_padrao_entrega',
            type: 'int',
            isNullable: true,
            comment: 'Prazo padrão de entrega do kit em dias',
          },
          {
            name: 'valor_total',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: true,
            comment: 'Valor total do kit',
          },
          {
            name: 'preco_kit',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: true,
            comment: 'Preço do kit para venda',
          },
          {
            name: 'observacoes',
            type: 'text',
            isNullable: true,
            comment: 'Observações específicas para cada exame no kit',
          },
          {
            name: 'data_criacao',
            type: 'timestamp',
            isNullable: true,
            comment: 'Data de criação do cadastro',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
            comment: 'Data/hora de criação do registro',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
            comment: 'Data/hora da última atualização',
          },
        ],
        foreignKeys: [
          {
            name: 'FK_kit_empresa',
            columnNames: ['empresa_id'],
            referencedTableName: 'empresas',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
      }),
      true,
    );

    // Criar tabela kit_exames
    await queryRunner.createTable(
      new Table({
        name: 'kit_exames',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'kit_id',
            type: 'uuid',
          },
          {
            name: 'exame_id',
            type: 'uuid',
          },
          {
            name: 'codigo_tuss',
            type: 'varchar',
            length: '20',
            isNullable: true,
            comment: 'Código TUSS do exame no kit',
          },
          {
            name: 'nome_exame',
            type: 'varchar',
            length: '255',
            isNullable: true,
            comment: 'Nome do exame (puxado do cadastro de exames)',
          },
          {
            name: 'prazo_entrega',
            type: 'int',
            isNullable: true,
            comment: 'Prazo de entrega do exame em dias',
          },
          {
            name: 'quantidade',
            type: 'int',
            default: 1,
            comment: 'Quantidade de cada exame no kit',
          },
          {
            name: 'ordem_insercao',
            type: 'int',
            isNullable: true,
            comment: 'Ordem de apresentação dos exames no kit',
          },
          {
            name: 'observacoes',
            type: 'text',
            isNullable: true,
            comment: 'Observações específicas para este exame no kit',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
            comment: 'Data/hora de criação do registro',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
            comment: 'Data/hora da última atualização',
          },
        ],
        foreignKeys: [
          {
            name: 'FK_kit_exame_kit',
            columnNames: ['kit_id'],
            referencedTableName: 'kits',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
          {
            name: 'FK_kit_exame_exame',
            columnNames: ['exame_id'],
            referencedTableName: 'exames',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
        uniques: [
          {
            name: 'UQ_kit_exame',
            columnNames: ['kit_id', 'exame_id'],
          },
        ],
      }),
      true,
    );

    // Criar tabela kit_unidades
    await queryRunner.createTable(
      new Table({
        name: 'kit_unidades',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'kit_id',
            type: 'uuid',
          },
          {
            name: 'unidade_id',
            type: 'uuid',
          },
          {
            name: 'disponivel',
            type: 'boolean',
            default: true,
            comment: 'Indica se o kit está disponível nesta unidade',
          },
          {
            name: 'observacoes',
            type: 'text',
            isNullable: true,
            comment: 'Observações específicas do kit para esta unidade',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
            comment: 'Data/hora de criação do registro',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
            comment: 'Data/hora da última atualização',
          },
        ],
        foreignKeys: [
          {
            name: 'FK_kit_unidade_kit',
            columnNames: ['kit_id'],
            referencedTableName: 'kits',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
          {
            name: 'FK_kit_unidade_unidade',
            columnNames: ['unidade_id'],
            referencedTableName: 'unidades_saude',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
        uniques: [
          {
            name: 'UQ_kit_unidade',
            columnNames: ['kit_id', 'unidade_id'],
          },
        ],
      }),
      true,
    );

    // Criar tabela kit_convenios
    await queryRunner.createTable(
      new Table({
        name: 'kit_convenios',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'kit_id',
            type: 'uuid',
          },
          {
            name: 'convenio_id',
            type: 'uuid',
          },
          {
            name: 'valor_convenio',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: true,
            comment: 'Valor do kit para este convênio específico',
          },
          {
            name: 'disponivel',
            type: 'boolean',
            default: true,
            comment: 'Indica se o kit está disponível para este convênio',
          },
          {
            name: 'requer_autorizacao',
            type: 'boolean',
            default: false,
            comment: 'Indica se requer autorização do convênio para este kit',
          },
          {
            name: 'observacoes',
            type: 'text',
            isNullable: true,
            comment: 'Observações específicas do kit para este convênio',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
            comment: 'Data/hora de criação do registro',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
            comment: 'Data/hora da última atualização',
          },
        ],
        foreignKeys: [
          {
            name: 'FK_kit_convenio_kit',
            columnNames: ['kit_id'],
            referencedTableName: 'kits',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
          {
            name: 'FK_kit_convenio_convenio',
            columnNames: ['convenio_id'],
            referencedTableName: 'convenios',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
        uniques: [
          {
            name: 'UQ_kit_convenio',
            columnNames: ['kit_id', 'convenio_id'],
          },
        ],
      }),
      true,
    );

    // Criar índices
    await queryRunner.query(`
      CREATE INDEX "IDX_kit_codigo_interno" ON "kits" ("codigo_interno")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_kit_nome" ON "kits" ("nome_kit")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_kit_tipo" ON "kits" ("tipo_kit")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_kit_status" ON "kits" ("status_kit")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_kit_empresa" ON "kits" ("empresa_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_kit_exame_kit" ON "kit_exames" ("kit_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_kit_exame_exame" ON "kit_exames" ("exame_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_kit_exame_ordem" ON "kit_exames" ("ordem_insercao")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_kit_unidade_kit" ON "kit_unidades" ("kit_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_kit_unidade_unidade" ON "kit_unidades" ("unidade_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_kit_convenio_kit" ON "kit_convenios" ("kit_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_kit_convenio_convenio" ON "kit_convenios" ("convenio_id")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remover índices
    await queryRunner.dropIndex('kit_convenios', 'IDX_kit_convenio_convenio');
    await queryRunner.dropIndex('kit_convenios', 'IDX_kit_convenio_kit');
    await queryRunner.dropIndex('kit_unidades', 'IDX_kit_unidade_unidade');
    await queryRunner.dropIndex('kit_unidades', 'IDX_kit_unidade_kit');
    await queryRunner.dropIndex('kit_exames', 'IDX_kit_exame_ordem');
    await queryRunner.dropIndex('kit_exames', 'IDX_kit_exame_exame');
    await queryRunner.dropIndex('kit_exames', 'IDX_kit_exame_kit');
    await queryRunner.dropIndex('kits', 'IDX_kit_empresa');
    await queryRunner.dropIndex('kits', 'IDX_kit_status');
    await queryRunner.dropIndex('kits', 'IDX_kit_tipo');
    await queryRunner.dropIndex('kits', 'IDX_kit_nome');
    await queryRunner.dropIndex('kits', 'IDX_kit_codigo_interno');

    // Remover tabelas
    await queryRunner.dropTable('kit_convenios');
    await queryRunner.dropTable('kit_unidades');
    await queryRunner.dropTable('kit_exames');
    await queryRunner.dropTable('kits');

    // Remover enums
    await queryRunner.query('DROP TYPE IF EXISTS status_kit_enum');
    await queryRunner.query('DROP TYPE IF EXISTS tipo_kit_enum');
  }
}
