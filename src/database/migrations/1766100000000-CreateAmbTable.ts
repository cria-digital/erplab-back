import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateAmbTable1766100000000 implements MigrationInterface {
  name = 'CreateAmbTable1766100000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Criar tabela AMB-92
    await queryRunner.createTable(
      new Table({
        name: 'amb_92',
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
            comment: 'Código AMB do procedimento',
          },
          {
            name: 'descricao',
            type: 'text',
            comment: 'Descrição do procedimento',
          },
          {
            name: 'ch',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: true,
            comment: 'Coeficiente de Honorários (CH)',
          },
          {
            name: 'aux',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: true,
            comment: 'Auxiliar',
          },
          {
            name: 'porte',
            type: 'integer',
            isNullable: true,
            comment: 'Porte anestésico',
          },
          {
            name: 'versao',
            type: 'varchar',
            length: '20',
            isNullable: true,
            default: "'AMB-92'",
            comment: 'Versão da tabela (AMB-92)',
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
      'amb_92',
      new TableIndex({
        name: 'IDX_amb_92_codigo',
        columnNames: ['codigo'],
        isUnique: true,
      }),
    );

    await queryRunner.createIndex(
      'amb_92',
      new TableIndex({
        name: 'IDX_amb_92_descricao',
        columnNames: ['descricao'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('amb_92', 'IDX_amb_92_descricao');
    await queryRunner.dropIndex('amb_92', 'IDX_amb_92_codigo');
    await queryRunner.dropTable('amb_92');
  }
}
