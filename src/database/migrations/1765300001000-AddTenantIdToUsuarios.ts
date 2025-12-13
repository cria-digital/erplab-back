import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTenantIdToUsuarios1765300001000 implements MigrationInterface {
  name = 'AddTenantIdToUsuarios1765300001000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Adicionar coluna tenant_id (nullable inicialmente)
    await queryRunner.query(`
      ALTER TABLE "usuarios" ADD COLUMN "tenant_id" uuid
    `);

    // Criar FK para tenants
    await queryRunner.query(`
      ALTER TABLE "usuarios"
      ADD CONSTRAINT "FK_usuarios_tenant"
      FOREIGN KEY ("tenant_id")
      REFERENCES "tenants"("id")
      ON DELETE SET NULL
      ON UPDATE CASCADE
    `);

    // Criar índice para tenant_id
    await queryRunner.query(`
      CREATE INDEX "IDX_usuarios_tenant_id" ON "usuarios" ("tenant_id")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remover índice
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_usuarios_tenant_id"`);

    // Remover FK
    await queryRunner.query(`
      ALTER TABLE "usuarios" DROP CONSTRAINT IF EXISTS "FK_usuarios_tenant"
    `);

    // Remover coluna
    await queryRunner.query(`
      ALTER TABLE "usuarios" DROP COLUMN IF EXISTS "tenant_id"
    `);
  }
}
