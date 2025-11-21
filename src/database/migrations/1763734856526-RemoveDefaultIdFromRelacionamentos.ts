import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveDefaultIdFromRelacionamentos1763734856526
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Remove auto-geração de UUID das tabelas de relacionamento
    // Agora os IDs são definidos manualmente para serem iguais aos IDs das empresas

    await queryRunner.query(
      `ALTER TABLE "laboratorios" ALTER COLUMN "id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ALTER COLUMN "id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "telemedicina" ALTER COLUMN "id" DROP DEFAULT`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Restaura auto-geração de UUID

    await queryRunner.query(
      `ALTER TABLE "telemedicina" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "convenios" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "laboratorios" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`,
    );
  }
}
