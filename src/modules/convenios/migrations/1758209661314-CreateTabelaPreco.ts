import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTabelaPreco1758209661314 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'tabelas_preco',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'plano_id',
            type: 'uuid',
          },
          {
            name: 'codigo_tabela',
            type: 'varchar',
            length: '50',
          },
          {
            name: 'descricao',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'tipo_tabela',
            type: 'enum',
            enum: ['tuss', 'cbhpm', 'propria', 'brasindice', 'simpro'],
          },
          {
            name: 'versao',
            type: 'varchar',
            length: '20',
            isNullable: true,
          },
          {
            name: 'edicao',
            type: 'varchar',
            length: '20',
            isNullable: true,
          },
          {
            name: 'data_vigencia',
            type: 'date',
          },
          {
            name: 'percentual_desconto',
            type: 'decimal',
            precision: 5,
            scale: 2,
            default: 0,
          },
          {
            name: 'percentual_acrescimo',
            type: 'decimal',
            precision: 5,
            scale: 2,
            default: 0,
          },
          {
            name: 'valor_ch',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'valor_uco',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'valor_porte_anestesico',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'valor_filme',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'ativa',
            type: 'boolean',
            default: true,
          },
          {
            name: 'observacoes',
            type: 'text',
            isNullable: true,
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
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
        foreignKeys: [
          {
            name: 'FK_TABELA_PLANO',
            columnNames: ['plano_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'planos',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('tabelas_preco');
  }
}
