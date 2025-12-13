import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIsSuperAdminToUsuarios1765400000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Adiciona coluna is_super_admin na tabela usuarios
    await queryRunner.query(`
      ALTER TABLE "usuarios"
      ADD COLUMN "is_super_admin" boolean NOT NULL DEFAULT false
    `);

    // Cria índice para busca rápida de super admins
    await queryRunner.query(`
      CREATE INDEX "IDX_usuarios_is_super_admin" ON "usuarios" ("is_super_admin")
    `);

    console.log('✅ Campo is_super_admin adicionado na tabela usuarios');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_usuarios_is_super_admin"`,
    );
    await queryRunner.query(
      `ALTER TABLE "usuarios" DROP COLUMN "is_super_admin"`,
    );
  }
}
