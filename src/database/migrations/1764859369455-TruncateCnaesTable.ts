import { MigrationInterface, QueryRunner } from 'typeorm';

export class TruncateCnaesTable1764859369455 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Limpa CNAEs secundários primeiro (FK para cnaes)
    await queryRunner.query(`DELETE FROM cnae_secundarios`);

    // Remove referências de cnae_principal_id nas unidades de saúde
    await queryRunner.query(
      `UPDATE unidades_saude SET cnae_principal_id = NULL`,
    );

    // Agora pode limpar a tabela de CNAEs
    await queryRunner.query(`DELETE FROM cnaes`);

    console.log(
      '✅ Tabela cnaes limpa. Seeder vai popular com códigos corretos.',
    );
  }

  public async down(_queryRunner: QueryRunner): Promise<void> {
    // Não é possível reverter um DELETE
    console.log(
      '⚠️ DELETE não pode ser revertido. Rode o seeder para repopular.',
    );
  }
}
