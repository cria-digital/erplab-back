import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class AddAmbIdToExames1766100001000 implements MigrationInterface {
  name = 'AddAmbIdToExames1766100001000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Adicionar coluna amb_id na tabela exames
    await queryRunner.addColumn(
      'exames',
      new TableColumn({
        name: 'amb_id',
        type: 'uuid',
        isNullable: true,
        comment: 'FK para tabela AMB-92 (código AMB selecionado)',
      }),
    );

    // Criar índice para amb_id
    await queryRunner.createIndex(
      'exames',
      new TableIndex({
        name: 'IDX_exames_amb_id',
        columnNames: ['amb_id'],
      }),
    );

    // Criar FK para tabela amb_92
    await queryRunner.createForeignKey(
      'exames',
      new TableForeignKey({
        name: 'FK_exames_amb',
        columnNames: ['amb_id'],
        referencedTableName: 'amb_92',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remover FK
    await queryRunner.dropForeignKey('exames', 'FK_exames_amb');

    // Remover índice
    await queryRunner.dropIndex('exames', 'IDX_exames_amb_id');

    // Remover coluna
    await queryRunner.dropColumn('exames', 'amb_id');
  }
}
