import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddNovosValoresEnumCampoFormulario1765288600000
  implements MigrationInterface
{
  name = 'AddNovosValoresEnumCampoFormulario1765288600000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Adicionar novos valores ao enum campos_formulario_nome_campo_enum
    await queryRunner.query(
      `ALTER TYPE "campos_formulario_nome_campo_enum" ADD VALUE IF NOT EXISTS 'opcao_parcelamento'`,
    );
    await queryRunner.query(
      `ALTER TYPE "campos_formulario_nome_campo_enum" ADD VALUE IF NOT EXISTS 'restricao_adquirente'`,
    );
  }

  public async down(_queryRunner: QueryRunner): Promise<void> {
    // PostgreSQL não permite remover valores de enum facilmente
    // Seria necessário recriar o tipo, o que é complexo e arriscado
    // Por segurança, não fazemos nada no down
    console.log(
      'Aviso: Valores de enum não podem ser removidos facilmente no PostgreSQL',
    );
  }
}
