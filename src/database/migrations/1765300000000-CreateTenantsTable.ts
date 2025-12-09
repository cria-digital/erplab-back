import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTenantsTable1765300000000 implements MigrationInterface {
  name = 'CreateTenantsTable1765300000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Criar tipo enum para plano
    await queryRunner.query(`
      CREATE TYPE "plano_tenant_enum" AS ENUM ('trial', 'basico', 'profissional', 'enterprise')
    `);

    // Criar tabela tenants
    await queryRunner.query(`
      CREATE TABLE "tenants" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "nome" varchar(255) NOT NULL,
        "slug" varchar(100) NOT NULL,
        "cnpj" varchar(14),
        "plano" "plano_tenant_enum" NOT NULL DEFAULT 'trial',
        "limite_usuarios" int NOT NULL DEFAULT 5,
        "limite_unidades" int NOT NULL DEFAULT 1,
        "data_expiracao" date,
        "configuracoes" jsonb,
        "ativo" boolean NOT NULL DEFAULT true,
        "criado_em" timestamp NOT NULL DEFAULT now(),
        "atualizado_em" timestamp NOT NULL DEFAULT now(),
        CONSTRAINT "PK_tenants" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_tenants_slug" UNIQUE ("slug"),
        CONSTRAINT "UQ_tenants_cnpj" UNIQUE ("cnpj")
      )
    `);

    // Criar índices
    await queryRunner.query(`
      CREATE INDEX "IDX_tenants_slug" ON "tenants" ("slug")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_tenants_ativo" ON "tenants" ("ativo")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_tenants_plano" ON "tenants" ("plano")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remover índices
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_tenants_plano"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_tenants_ativo"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_tenants_slug"`);

    // Remover tabela
    await queryRunner.query(`DROP TABLE IF EXISTS "tenants"`);

    // Remover tipo enum
    await queryRunner.query(`DROP TYPE IF EXISTS "plano_tenant_enum"`);
  }
}
