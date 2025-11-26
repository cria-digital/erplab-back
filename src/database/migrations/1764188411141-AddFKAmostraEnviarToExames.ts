import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFKAmostraEnviarToExames1764188411141
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Adicionar FK para alternativas_campo_formulario
    await queryRunner.query(`
      ALTER TABLE "exames"
      ADD CONSTRAINT "FK_exames_amostra_enviar"
      FOREIGN KEY ("amostra_enviar_id")
      REFERENCES "alternativas_campo_formulario"("id")
      ON DELETE SET NULL
      ON UPDATE CASCADE
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "exames"
      DROP CONSTRAINT IF EXISTS "FK_exames_amostra_enviar"
    `);
  }
}
