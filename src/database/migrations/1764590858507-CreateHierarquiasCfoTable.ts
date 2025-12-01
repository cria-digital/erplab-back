import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateHierarquiasCfoTable1764590858507
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Criar tabela hierarquias_cfo
    await queryRunner.query(`
      CREATE TABLE "hierarquias_cfo" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "codigo_interno" varchar(20) NOT NULL,
        "descricao" varchar(255) NOT NULL,
        "ativo" boolean NOT NULL DEFAULT true,
        "empresa_id" uuid NULL,
        "criado_em" TIMESTAMP NOT NULL DEFAULT now(),
        "atualizado_em" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_hierarquias_cfo" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_hierarquias_cfo_codigo_interno" UNIQUE ("codigo_interno")
      )
    `);

    // Criar enum para tipo de classe CFO
    await queryRunner.query(`
      CREATE TYPE "classes_cfo_tipo_enum" AS ENUM ('TITULO', 'NIVEL')
    `);

    // Criar tabela classes_cfo
    await queryRunner.query(`
      CREATE TABLE "classes_cfo" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "hierarquia_id" uuid NOT NULL,
        "tipo" "classes_cfo_tipo_enum" NOT NULL,
        "nivel_classificacao" int NULL,
        "codigo_hierarquico" varchar(20) NOT NULL,
        "codigo_contabil" varchar(20) NULL,
        "nome_classe" varchar(255) NOT NULL,
        "ordem" int NOT NULL DEFAULT 0,
        "ativo" boolean NOT NULL DEFAULT true,
        "criado_em" TIMESTAMP NOT NULL DEFAULT now(),
        "atualizado_em" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_classes_cfo" PRIMARY KEY ("id"),
        CONSTRAINT "FK_classes_cfo_hierarquia" FOREIGN KEY ("hierarquia_id")
          REFERENCES "hierarquias_cfo"("id") ON DELETE CASCADE ON UPDATE NO ACTION
      )
    `);

    // Criar índice para ordenação
    await queryRunner.query(`
      CREATE INDEX "IDX_classes_cfo_hierarquia_ordem" ON "classes_cfo" ("hierarquia_id", "ordem")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remover índice
    await queryRunner.query(`
      DROP INDEX IF EXISTS "IDX_classes_cfo_hierarquia_ordem"
    `);

    // Remover tabela classes_cfo
    await queryRunner.query(`DROP TABLE IF EXISTS "classes_cfo"`);

    // Remover enum
    await queryRunner.query(`DROP TYPE IF EXISTS "classes_cfo_tipo_enum"`);

    // Remover tabela hierarquias_cfo
    await queryRunner.query(`DROP TABLE IF EXISTS "hierarquias_cfo"`);
  }
}
