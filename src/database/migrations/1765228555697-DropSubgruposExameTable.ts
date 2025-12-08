import { MigrationInterface, QueryRunner } from 'typeorm';

export class DropSubgruposExameTable1765228555697
  implements MigrationInterface
{
  name = 'DropSubgruposExameTable1765228555697';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Remover FK de exames.subgrupo_id se existir apontando para subgrupos_exame
    await queryRunner.query(`
      ALTER TABLE "exames" DROP CONSTRAINT IF EXISTS "FK_exames_subgrupo"
    `);
    await queryRunner.query(`
      ALTER TABLE "exames" DROP CONSTRAINT IF EXISTS "FK_d76081f4ce0ab0153c0a77d4cee"
    `);

    // Dropar a tabela subgrupos_exame
    await queryRunner.query(`DROP TABLE IF EXISTS "subgrupos_exame" CASCADE`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Recriar tabela subgrupos_exame
    await queryRunner.query(`
      CREATE TABLE "subgrupos_exame" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "codigo" varchar(20) NOT NULL,
        "nome" varchar(100) NOT NULL,
        "descricao" text,
        "categoria" varchar(20) NOT NULL,
        "ordem" int NOT NULL DEFAULT 0,
        "status" varchar(10) NOT NULL DEFAULT 'ativo',
        "criado_em" timestamp NOT NULL DEFAULT now(),
        "atualizado_em" timestamp NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_subgrupos_exame_codigo" UNIQUE ("codigo"),
        CONSTRAINT "PK_subgrupos_exame" PRIMARY KEY ("id")
      )
    `);

    // Criar índices
    await queryRunner.query(
      `CREATE INDEX "IDX_subgrupos_exame_codigo" ON "subgrupos_exame" ("codigo")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_subgrupos_exame_nome" ON "subgrupos_exame" ("nome")`,
    );
  }
}
