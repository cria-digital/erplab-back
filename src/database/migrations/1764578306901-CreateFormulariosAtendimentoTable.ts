import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateFormulariosAtendimentoTable1764578306901
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'formularios_atendimento',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'unidade_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'nome_documento',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'caminho_arquivo',
            type: 'varchar',
            length: '500',
            isNullable: false,
          },
          {
            name: 'observacao',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'mime_type',
            type: 'varchar',
            length: '100',
            isNullable: false,
          },
          {
            name: 'tamanho',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'ativo',
            type: 'boolean',
            default: true,
          },
          {
            name: 'criado_em',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'atualizado_em',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
        foreignKeys: [
          {
            columnNames: ['unidade_id'],
            referencedTableName: 'unidades_saude',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
      }),
      true,
    );

    // Índice para busca por unidade
    await queryRunner.createIndex(
      'formularios_atendimento',
      new TableIndex({
        name: 'IDX_FORMULARIOS_ATENDIMENTO_UNIDADE',
        columnNames: ['unidade_id'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('formularios_atendimento');
  }
}
