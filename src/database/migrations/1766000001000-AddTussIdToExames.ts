import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class AddTussIdToExames1766000001000 implements MigrationInterface {
  name = 'AddTussIdToExames1766000001000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Adicionar coluna tuss_id na tabela exames
    await queryRunner.addColumn(
      'exames',
      new TableColumn({
        name: 'tuss_id',
        type: 'uuid',
        isNullable: true,
        comment: 'FK para tabela TUSS (código TUSS selecionado)',
      }),
    );

    // Criar índice para a nova coluna
    await queryRunner.createIndex(
      'exames',
      new TableIndex({
        name: 'IDX_exames_tuss_id',
        columnNames: ['tuss_id'],
      }),
    );

    // Criar FK para tabela tuss
    await queryRunner.createForeignKey(
      'exames',
      new TableForeignKey({
        name: 'FK_exames_tuss',
        columnNames: ['tuss_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'tuss',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remover FK
    await queryRunner.dropForeignKey('exames', 'FK_exames_tuss');

    // Remover índice
    await queryRunner.dropIndex('exames', 'IDX_exames_tuss_id');

    // Remover coluna
    await queryRunner.dropColumn('exames', 'tuss_id');
  }
}
