import { MigrationInterface, QueryRunner } from 'typeorm';

export class VincularAdquirenteComCamposFormulario1765288500000
  implements MigrationInterface
{
  name = 'VincularAdquirenteComCamposFormulario1765288500000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Remover coluna enum opcao_parcelamento da tabela adquirentes
    await queryRunner.query(
      `ALTER TABLE "adquirentes" DROP COLUMN IF EXISTS "opcao_parcelamento"`,
    );

    // 2. Adicionar coluna opcao_parcelamento_id (FK para alternativas_campo_formulario)
    await queryRunner.query(
      `ALTER TABLE "adquirentes" ADD COLUMN "opcao_parcelamento_id" uuid`,
    );

    // 3. Criar FK para alternativas_campo_formulario
    await queryRunner.query(
      `ALTER TABLE "adquirentes" ADD CONSTRAINT "FK_adquirentes_opcao_parcelamento" FOREIGN KEY ("opcao_parcelamento_id") REFERENCES "alternativas_campo_formulario"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );

    // 4. Na tabela restricoes_adquirente: renomear coluna restricao para valor_restricao
    await queryRunner.query(
      `ALTER TABLE "restricoes_adquirente" RENAME COLUMN "restricao" TO "valor_restricao"`,
    );

    // 5. Adicionar coluna restricao_id (FK para alternativas_campo_formulario)
    await queryRunner.query(
      `ALTER TABLE "restricoes_adquirente" ADD COLUMN "restricao_id" uuid`,
    );

    // 6. Criar FK para alternativas_campo_formulario
    await queryRunner.query(
      `ALTER TABLE "restricoes_adquirente" ADD CONSTRAINT "FK_restricoes_adquirente_restricao" FOREIGN KEY ("restricao_id") REFERENCES "alternativas_campo_formulario"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );

    // 7. Remover o enum type se existir (opcional, para limpeza)
    await queryRunner.query(
      `DROP TYPE IF EXISTS "public"."adquirentes_opcao_parcelamento_enum"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // 1. Remover FK de restricoes_adquirente
    await queryRunner.query(
      `ALTER TABLE "restricoes_adquirente" DROP CONSTRAINT IF EXISTS "FK_restricoes_adquirente_restricao"`,
    );

    // 2. Remover coluna restricao_id
    await queryRunner.query(
      `ALTER TABLE "restricoes_adquirente" DROP COLUMN IF EXISTS "restricao_id"`,
    );

    // 3. Renomear valor_restricao de volta para restricao
    await queryRunner.query(
      `ALTER TABLE "restricoes_adquirente" RENAME COLUMN "valor_restricao" TO "restricao"`,
    );

    // 4. Remover FK de adquirentes
    await queryRunner.query(
      `ALTER TABLE "adquirentes" DROP CONSTRAINT IF EXISTS "FK_adquirentes_opcao_parcelamento"`,
    );

    // 5. Remover coluna opcao_parcelamento_id
    await queryRunner.query(
      `ALTER TABLE "adquirentes" DROP COLUMN IF EXISTS "opcao_parcelamento_id"`,
    );

    // 6. Recriar enum type
    await queryRunner.query(
      `CREATE TYPE "public"."adquirentes_opcao_parcelamento_enum" AS ENUM('avista', '2x', '3x', '4x', '5x', '6x', '7x', '8x', '9x', '10x', '11x', '12x')`,
    );

    // 7. Recriar coluna opcao_parcelamento com enum
    await queryRunner.query(
      `ALTER TABLE "adquirentes" ADD COLUMN "opcao_parcelamento" "public"."adquirentes_opcao_parcelamento_enum" DEFAULT '12x'`,
    );
  }
}
