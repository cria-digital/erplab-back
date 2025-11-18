import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateEstadosECidadesTables1763480500000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Criar tabela de estados
    await queryRunner.createTable(
      new Table({
        name: 'estados',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'nome',
            type: 'varchar',
            length: '100',
          },
          {
            name: 'uf',
            type: 'varchar',
            length: '2',
            isUnique: true,
          },
          {
            name: 'codigo_ibge',
            type: 'varchar',
            length: '2',
            isUnique: true,
          },
          {
            name: 'regiao',
            type: 'varchar',
            length: '20',
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
      }),
      true,
    );

    // Criar tabela de cidades
    await queryRunner.createTable(
      new Table({
        name: 'cidades',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'nome',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'codigo_ibge',
            type: 'varchar',
            length: '7',
            isUnique: true,
          },
          {
            name: 'estado_id',
            type: 'uuid',
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
            name: 'FK_cidade_estado',
            columnNames: ['estado_id'],
            referencedTableName: 'estados',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
        indices: [
          {
            name: 'IDX_cidade_estado_id',
            columnNames: ['estado_id'],
          },
          {
            name: 'IDX_cidade_codigo_ibge',
            columnNames: ['codigo_ibge'],
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('cidades', true);
    await queryRunner.dropTable('estados', true);
  }
}
