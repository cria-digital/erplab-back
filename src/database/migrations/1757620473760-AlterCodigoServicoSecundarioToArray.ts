import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterCodigoServicoSecundarioToArray1757620473760
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Alterar tipo da coluna codigo_servico_secundario de VARCHAR para JSONB
    await queryRunner.query(`
      ALTER TABLE unidades_saude 
      ALTER COLUMN codigo_servico_secundario 
      TYPE jsonb 
      USING CASE 
        WHEN codigo_servico_secundario IS NULL THEN NULL
        WHEN codigo_servico_secundario = '' THEN '[]'::jsonb
        ELSE jsonb_build_array(codigo_servico_secundario)
      END
    `);

    // Adicionar valor default como array vazio
    await queryRunner.query(`
      ALTER TABLE unidades_saude 
      ALTER COLUMN codigo_servico_secundario 
      SET DEFAULT '[]'::jsonb
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Reverter de JSONB para VARCHAR, pegando apenas o primeiro elemento do array
    await queryRunner.query(`
      ALTER TABLE unidades_saude 
      ALTER COLUMN codigo_servico_secundario 
      TYPE varchar(50) 
      USING CASE 
        WHEN codigo_servico_secundario IS NULL THEN NULL
        WHEN jsonb_array_length(codigo_servico_secundario) > 0 THEN codigo_servico_secundario->0->>'$'
        ELSE NULL
      END
    `);

    // Remover o default
    await queryRunner.query(`
      ALTER TABLE unidades_saude 
      ALTER COLUMN codigo_servico_secundario 
      DROP DEFAULT
    `);
  }
}
