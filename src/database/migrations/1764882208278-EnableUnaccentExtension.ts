import { MigrationInterface, QueryRunner } from 'typeorm';

export class EnableUnaccentExtension1764882208278
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Habilita a extensão unaccent para buscas sem acentos
    // Ex: "Saude" encontra "Saúde", "laboratorio" encontra "Laboratório"
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS unaccent');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP EXTENSION IF EXISTS unaccent');
  }
}
