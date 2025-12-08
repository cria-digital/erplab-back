import { MigrationInterface, QueryRunner } from 'typeorm';

export class DropSetoresExameTable1765230000000 implements MigrationInterface {
  name = 'DropSetoresExameTable1765230000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Remover FK de exames.setor_id se existir apontando para setores_exame
    await queryRunner.query(`
      ALTER TABLE "exames" DROP CONSTRAINT IF EXISTS "FK_exames_setor"
    `);

    // Buscar e remover qualquer FK que aponte para setores_exame
    const fks = await queryRunner.query(`
      SELECT conname FROM pg_constraint 
      WHERE confrelid = 'setores_exame'::regclass 
      AND contype = 'f'
    `);

    for (const fk of fks) {
      await queryRunner.query(`
        ALTER TABLE "exames" DROP CONSTRAINT IF EXISTS "${fk.conname}"
      `);
    }

    // Dropar a tabela setores_exame
    await queryRunner.query(`DROP TABLE IF EXISTS "setores_exame" CASCADE`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Recriar tabela setores_exame
    await queryRunner.query(`
      CREATE TABLE "setores_exame" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "codigo" varchar(20) NOT NULL,
        "nome" varchar(100) NOT NULL,
        "descricao" text,
        "ordem" int NOT NULL DEFAULT 0,
        "status" varchar(10) NOT NULL DEFAULT 'ativo',
        "criado_em" timestamp NOT NULL DEFAULT now(),
        "atualizado_em" timestamp NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_setores_exame_codigo" UNIQUE ("codigo"),
        CONSTRAINT "PK_setores_exame" PRIMARY KEY ("id")
      )
    `);
  }
}
