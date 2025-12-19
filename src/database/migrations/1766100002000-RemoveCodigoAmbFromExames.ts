import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class RemoveCodigoAmbFromExames1766100002000
  implements MigrationInterface
{
  name = 'RemoveCodigoAmbFromExames1766100002000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Remove coluna codigo_amb da tabela exames
    const hasColumn = await queryRunner.hasColumn('exames', 'codigo_amb');
    if (hasColumn) {
      await queryRunner.dropColumn('exames', 'codigo_amb');
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Recria a coluna codigo_amb
    await queryRunner.addColumn(
      'exames',
      new TableColumn({
        name: 'codigo_amb',
        type: 'varchar',
        length: '20',
        isNullable: true,
        comment: 'Código AMB (Associação Médica Brasileira)',
      }),
    );
  }
}
