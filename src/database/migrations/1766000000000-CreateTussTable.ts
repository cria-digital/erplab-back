import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateTussTable1766000000000 implements MigrationInterface {
  name = 'CreateTussTable1766000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Criar tabela TUSS
    await queryRunner.createTable(
      new Table({
        name: 'tuss',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'codigo',
            type: 'varchar',
            length: '20',
            comment: 'Código TUSS (8 dígitos)',
          },
          {
            name: 'termo',
            type: 'text',
            comment: 'Termo/Descrição do procedimento',
          },
          {
            name: 'versao',
            type: 'varchar',
            length: '20',
            isNullable: true,
            comment: 'Versão da tabela TUSS (ex: 202511)',
          },
          {
            name: 'ativo',
            type: 'boolean',
            default: true,
            comment: 'Se o código está ativo',
          },
          {
            name: 'criado_em',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            comment: 'Data de criação do registro',
          },
        ],
      }),
      true,
    );

    // Criar índices
    await queryRunner.createIndex(
      'tuss',
      new TableIndex({
        name: 'IDX_tuss_codigo',
        columnNames: ['codigo'],
        isUnique: true,
      }),
    );

    await queryRunner.createIndex(
      'tuss',
      new TableIndex({
        name: 'IDX_tuss_termo',
        columnNames: ['termo'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('tuss', 'IDX_tuss_termo');
    await queryRunner.dropIndex('tuss', 'IDX_tuss_codigo');
    await queryRunner.dropTable('tuss');
  }
}
