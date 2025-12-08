import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveCategoriaFromExames1765202100000
  implements MigrationInterface
{
  name = 'RemoveCategoriaFromExames1765202100000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Remove a coluna categoria da tabela exames
    await queryRunner.query(`ALTER TABLE "exames" DROP COLUMN "categoria"`);

    // Remove o tipo enum que não será mais utilizado
    await queryRunner.query(
      `DROP TYPE IF EXISTS "public"."exames_categoria_enum"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Recria o tipo enum
    await queryRunner.query(
      `CREATE TYPE "public"."exames_categoria_enum" AS ENUM('laboratorio', 'imagem', 'procedimento', 'consulta')`,
    );

    // Recria a coluna categoria com valor default
    await queryRunner.query(
      `ALTER TABLE "exames" ADD "categoria" "public"."exames_categoria_enum" NOT NULL DEFAULT 'laboratorio'`,
    );
  }
}
