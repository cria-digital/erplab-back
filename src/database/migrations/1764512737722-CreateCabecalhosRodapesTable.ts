import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateCabecalhosRodapesTable1764512737722
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Criar enum para tipo
    await queryRunner.query(`
      CREATE TYPE "tipo_cabecalho_rodape_enum" AS ENUM ('CABECALHO', 'RODAPE')
    `);

    // Criar tabela
    await queryRunner.createTable(
      new Table({
        name: 'cabecalhos_rodapes',
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
            name: 'tipo',
            type: 'tipo_cabecalho_rodape_enum',
            isNullable: false,
          },
          {
            name: 'nome_arquivo',
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

    // Criar índice único para unidade + tipo
    await queryRunner.createIndex(
      'cabecalhos_rodapes',
      new TableIndex({
        name: 'IDX_CABECALHOS_RODAPES_UNIDADE_TIPO',
        columnNames: ['unidade_id', 'tipo'],
        isUnique: true,
      }),
    );

    // Criar índice para busca por unidade
    await queryRunner.createIndex(
      'cabecalhos_rodapes',
      new TableIndex({
        name: 'IDX_CABECALHOS_RODAPES_UNIDADE',
        columnNames: ['unidade_id'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('cabecalhos_rodapes');
    await queryRunner.query(`DROP TYPE "tipo_cabecalho_rodape_enum"`);
  }
}
