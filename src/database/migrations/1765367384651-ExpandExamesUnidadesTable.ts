import { MigrationInterface, QueryRunner } from 'typeorm';

export class ExpandExamesUnidadesTable1765367384651
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Adicionar coluna processamento em exames
    await queryRunner.query(`
      ALTER TABLE "exames" ADD COLUMN IF NOT EXISTS "processamento" TEXT;
    `);

    // 2. Adicionar coluna processamento em exames_laboratorios_apoio
    await queryRunner.query(`
      ALTER TABLE "exames_laboratorios_apoio" ADD COLUMN IF NOT EXISTS "processamento" TEXT;
    `);

    // 3. Adicionar PK uuid na tabela exames_unidades
    // Primeiro, adicionar a coluna id
    await queryRunner.query(`
      ALTER TABLE "exames_unidades" ADD COLUMN IF NOT EXISTS "id" UUID DEFAULT uuid_generate_v4();
    `);

    // Remover a PK composta antiga
    await queryRunner.query(`
      ALTER TABLE "exames_unidades" DROP CONSTRAINT IF EXISTS "PK_exames_unidades";
    `);

    // Criar nova PK com id
    await queryRunner.query(`
      ALTER TABLE "exames_unidades" ADD PRIMARY KEY ("id");
    `);

    // Adicionar constraint UNIQUE para exame_id + unidade_id
    await queryRunner.query(`
      ALTER TABLE "exames_unidades" ADD CONSTRAINT "UQ_exames_unidades_exame_unidade"
      UNIQUE ("exame_id", "unidade_id");
    `);

    // 4. Adicionar novos campos em exames_unidades
    await queryRunner.query(`
      ALTER TABLE "exames_unidades" ADD COLUMN IF NOT EXISTS "destino" VARCHAR(20) DEFAULT 'interno' NOT NULL;
    `);

    await queryRunner.query(`
      ALTER TABLE "exames_unidades" ADD COLUMN IF NOT EXISTS "laboratorio_apoio_id" UUID;
    `);

    await queryRunner.query(`
      ALTER TABLE "exames_unidades" ADD COLUMN IF NOT EXISTS "telemedicina_id" UUID;
    `);

    await queryRunner.query(`
      ALTER TABLE "exames_unidades" ADD COLUMN IF NOT EXISTS "ativo" BOOLEAN DEFAULT TRUE;
    `);

    await queryRunner.query(`
      ALTER TABLE "exames_unidades" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP DEFAULT NOW();
    `);

    await queryRunner.query(`
      ALTER TABLE "exames_unidades" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP DEFAULT NOW();
    `);

    // 5. Adicionar FKs
    await queryRunner.query(`
      ALTER TABLE "exames_unidades"
      ADD CONSTRAINT "FK_exames_unidades_laboratorio_apoio"
      FOREIGN KEY ("laboratorio_apoio_id") REFERENCES "laboratorios_apoio"("id");
    `);

    await queryRunner.query(`
      ALTER TABLE "exames_unidades"
      ADD CONSTRAINT "FK_exames_unidades_telemedicina"
      FOREIGN KEY ("telemedicina_id") REFERENCES "telemedicina"("id");
    `);

    // 6. Adicionar constraint de validação para destino
    await queryRunner.query(`
      ALTER TABLE "exames_unidades" ADD CONSTRAINT "CHK_exames_unidades_destino"
      CHECK ("destino" IN ('interno', 'apoio', 'telemedicina'));
    `);

    // 7. Remover campos antigos da tabela exames
    await queryRunner.query(`
      ALTER TABLE "exames" DROP COLUMN IF EXISTS "tipo_realizacao";
    `);

    await queryRunner.query(`
      ALTER TABLE "exames" DROP COLUMN IF EXISTS "laboratorio_apoio_id";
    `);

    await queryRunner.query(`
      ALTER TABLE "exames" DROP COLUMN IF EXISTS "telemedicina_id";
    `);

    await queryRunner.query(`
      ALTER TABLE "exames" DROP COLUMN IF EXISTS "unidade_destino_id";
    `);

    await queryRunner.query(`
      ALTER TABLE "exames" DROP COLUMN IF EXISTS "envio_automatico";
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // 1. Restaurar campos antigos na tabela exames
    await queryRunner.query(`
      ALTER TABLE "exames" ADD COLUMN IF NOT EXISTS "tipo_realizacao" VARCHAR(20) DEFAULT 'interno';
    `);

    await queryRunner.query(`
      ALTER TABLE "exames" ADD COLUMN IF NOT EXISTS "laboratorio_apoio_id" UUID;
    `);

    await queryRunner.query(`
      ALTER TABLE "exames" ADD COLUMN IF NOT EXISTS "telemedicina_id" UUID;
    `);

    await queryRunner.query(`
      ALTER TABLE "exames" ADD COLUMN IF NOT EXISTS "unidade_destino_id" UUID;
    `);

    await queryRunner.query(`
      ALTER TABLE "exames" ADD COLUMN IF NOT EXISTS "envio_automatico" VARCHAR(10) DEFAULT 'nao';
    `);

    // 2. Remover constraints e colunas novas de exames_unidades
    await queryRunner.query(`
      ALTER TABLE "exames_unidades" DROP CONSTRAINT IF EXISTS "CHK_exames_unidades_destino";
    `);

    await queryRunner.query(`
      ALTER TABLE "exames_unidades" DROP CONSTRAINT IF EXISTS "FK_exames_unidades_telemedicina";
    `);

    await queryRunner.query(`
      ALTER TABLE "exames_unidades" DROP CONSTRAINT IF EXISTS "FK_exames_unidades_laboratorio_apoio";
    `);

    await queryRunner.query(`
      ALTER TABLE "exames_unidades" DROP COLUMN IF EXISTS "updated_at";
    `);

    await queryRunner.query(`
      ALTER TABLE "exames_unidades" DROP COLUMN IF EXISTS "created_at";
    `);

    await queryRunner.query(`
      ALTER TABLE "exames_unidades" DROP COLUMN IF EXISTS "ativo";
    `);

    await queryRunner.query(`
      ALTER TABLE "exames_unidades" DROP COLUMN IF EXISTS "telemedicina_id";
    `);

    await queryRunner.query(`
      ALTER TABLE "exames_unidades" DROP COLUMN IF EXISTS "laboratorio_apoio_id";
    `);

    await queryRunner.query(`
      ALTER TABLE "exames_unidades" DROP COLUMN IF EXISTS "destino";
    `);

    // 3. Reverter PK para composta
    await queryRunner.query(`
      ALTER TABLE "exames_unidades" DROP CONSTRAINT IF EXISTS "UQ_exames_unidades_exame_unidade";
    `);

    await queryRunner.query(`
      ALTER TABLE "exames_unidades" DROP CONSTRAINT IF EXISTS "exames_unidades_pkey";
    `);

    await queryRunner.query(`
      ALTER TABLE "exames_unidades" DROP COLUMN IF EXISTS "id";
    `);

    await queryRunner.query(`
      ALTER TABLE "exames_unidades" ADD CONSTRAINT "PK_exames_unidades"
      PRIMARY KEY ("exame_id", "unidade_id");
    `);

    // 4. Remover coluna processamento
    await queryRunner.query(`
      ALTER TABLE "exames_laboratorios_apoio" DROP COLUMN IF EXISTS "processamento";
    `);

    await queryRunner.query(`
      ALTER TABLE "exames" DROP COLUMN IF EXISTS "processamento";
    `);
  }
}
