import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateRestricao1758209698461 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'restricoes',
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
            name: 'tipo_restricao',
            type: 'enum',
            enum: [
              'procedimento',
              'especialidade',
              'prestador',
              'medicamento',
              'material',
            ],
          },
          {
            name: 'codigo_item',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },
          {
            name: 'descricao',
            type: 'varchar',
            length: '500',
          },
          {
            name: 'motivo',
            type: 'text',
          },
          {
            name: 'data_inicio',
            type: 'date',
          },
          {
            name: 'data_fim',
            type: 'date',
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
            name: 'FK_RESTRICAO_PLANO',
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
    await queryRunner.dropTable('restricoes');
  }
}
