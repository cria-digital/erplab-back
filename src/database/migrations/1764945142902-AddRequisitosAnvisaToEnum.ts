import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRequisitosAnvisaToEnum1764945142902
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Adicionar novo valor ao enum de campos de formulário
    await queryRunner.query(`
      ALTER TYPE "campos_formulario_nome_campo_enum"
      ADD VALUE IF NOT EXISTS 'requisitos_anvisa'
    `);
  }

  public async down(_queryRunner: QueryRunner): Promise<void> {
    // PostgreSQL não permite remover valores de enum diretamente
    // Seria necessário recriar o tipo, o que é complexo e arriscado
    console.log(
      'Não é possível remover valor de enum em PostgreSQL sem recriar o tipo',
    );
  }
}
