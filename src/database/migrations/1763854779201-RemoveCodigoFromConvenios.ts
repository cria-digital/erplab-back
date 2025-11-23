import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveCodigoFromConvenios1763854779201
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Remove índice
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_1c7842a1c9b419f3d5cc463e28"`,
    );

    // Remove constraint unique
    await queryRunner.query(
      `ALTER TABLE "convenios" DROP CONSTRAINT IF EXISTS "UQ_1c7842a1c9b419f3d5cc463e285"`,
    );

    // Remove coluna codigo
    await queryRunner.query(`ALTER TABLE "convenios" DROP COLUMN "codigo"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Adiciona coluna codigo de volta
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD "codigo" character varying(20)`,
    );

    // Adiciona constraint unique
    await queryRunner.query(
      `ALTER TABLE "convenios" ADD CONSTRAINT "UQ_1c7842a1c9b419f3d5cc463e285" UNIQUE ("codigo")`,
    );

    // Adiciona índice
    await queryRunner.query(
      `CREATE INDEX "IDX_1c7842a1c9b419f3d5cc463e28" ON "convenios" ("codigo")`,
    );

    // Adiciona comentário
    await queryRunner.query(
      `COMMENT ON COLUMN "convenios"."codigo" IS 'Código interno do convênio'`,
    );
  }
}
