import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateCnaeTable1757970200000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'cnaes',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'codigo',
            type: 'varchar',
            length: '10',
            isUnique: true,
          },
          {
            name: 'descricao',
            type: 'text',
          },
          {
            name: 'secao',
            type: 'varchar',
            length: '1',
            isNullable: true,
          },
          {
            name: 'descricao_secao',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'divisao',
            type: 'varchar',
            length: '2',
            isNullable: true,
          },
          {
            name: 'descricao_divisao',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'grupo',
            type: 'varchar',
            length: '3',
            isNullable: true,
          },
          {
            name: 'descricao_grupo',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'classe',
            type: 'varchar',
            length: '4',
            isNullable: true,
          },
          {
            name: 'descricao_classe',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'subclasse',
            type: 'varchar',
            length: '7',
            isNullable: true,
          },
          {
            name: 'descricao_subclasse',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'ativo',
            type: 'boolean',
            default: true,
          },
          {
            name: 'observacoes',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
      true,
    );

    // Criar índices
    await queryRunner.query(
      `CREATE INDEX "idx_cnae_codigo" ON "cnaes" ("codigo")`,
    );

    await queryRunner.query(
      `CREATE INDEX "idx_cnae_secao" ON "cnaes" ("secao")`,
    );

    await queryRunner.query(
      `CREATE INDEX "idx_cnae_divisao" ON "cnaes" ("divisao")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('cnaes', 'idx_cnae_divisao');
    await queryRunner.dropIndex('cnaes', 'idx_cnae_secao');
    await queryRunner.dropIndex('cnaes', 'idx_cnae_codigo');
    await queryRunner.dropTable('cnaes');
  }
}
