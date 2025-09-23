import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddLogoColumnToEmpresas1758582000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "empresas" ADD COLUMN "logo" VARCHAR NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "empresas" DROP COLUMN "logo"`);
  }
}
