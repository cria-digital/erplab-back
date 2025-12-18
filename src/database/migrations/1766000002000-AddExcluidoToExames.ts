import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddExcluidoToExames1766000002000 implements MigrationInterface {
  name = 'AddExcluidoToExames1766000002000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'exames',
      new TableColumn({
        name: 'excluido',
        type: 'boolean',
        default: false,
        comment: 'Se o exame foi excluído (soft delete)',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('exames', 'excluido');
  }
}
