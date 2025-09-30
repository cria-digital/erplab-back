import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateMetodosTables1759169110387 implements MigrationInterface {
  name = 'CreateMetodosTables1759169110387';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Criar tabela metodos
    await queryRunner.createTable(
      new Table({
        name: 'metodos',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          {
            name: 'nome',
            type: 'varchar',
            length: '255',
            comment: 'Nome do método',
          },
          {
            name: 'codigo_interno',
            type: 'varchar',
            length: '50',
            isUnique: true,
            comment: 'Código interno do método (ex: MET123)',
          },
          {
            name: 'descricao',
            type: 'text',
            isNullable: true,
            comment: 'Descrição detalhada do método',
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['ativo', 'inativo', 'em_validacao'],
            default: "'em_validacao'",
            comment: 'Status do método',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // Criar índices para a tabela metodos
    await queryRunner.query(
      `CREATE INDEX "IDX_METODOS_CODIGO_INTERNO" ON "metodos" ("codigo_interno")`,
    );

    await queryRunner.query(
      `CREATE INDEX "IDX_METODOS_NOME" ON "metodos" ("nome")`,
    );

    // Criar tabela laboratorios_metodos (relacionamento N:N)
    await queryRunner.createTable(
      new Table({
        name: 'laboratorios_metodos',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          {
            name: 'laboratorio_id',
            type: 'uuid',
            comment: 'ID do laboratório',
          },
          {
            name: 'metodo_id',
            type: 'uuid',
            comment: 'ID do método',
          },
          {
            name: 'validado',
            type: 'boolean',
            default: false,
            comment:
              'Indica se o laboratório está validado para usar este método',
          },
          {
            name: 'data_validacao',
            type: 'timestamp',
            isNullable: true,
            comment: 'Data de validação do laboratório para o método',
          },
          {
            name: 'observacoes',
            type: 'text',
            isNullable: true,
            comment: 'Observações sobre o vínculo laboratório-método',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
        foreignKeys: [
          {
            name: 'FK_LABORATORIOS_METODOS_LABORATORIO',
            referencedTableName: 'laboratorios',
            referencedColumnNames: ['id'],
            columnNames: ['laboratorio_id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            name: 'FK_LABORATORIOS_METODOS_METODO',
            referencedTableName: 'metodos',
            referencedColumnNames: ['id'],
            columnNames: ['metodo_id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
        uniques: [
          {
            name: 'UQ_LABORATORIOS_METODOS_LABORATORIO_METODO',
            columnNames: ['laboratorio_id', 'metodo_id'],
          },
        ],
      }),
      true,
    );

    // Criar índices para a tabela laboratorios_metodos
    await queryRunner.query(
      `CREATE INDEX "IDX_LABORATORIOS_METODOS_LABORATORIO" ON "laboratorios_metodos" ("laboratorio_id")`,
    );

    await queryRunner.query(
      `CREATE INDEX "IDX_LABORATORIOS_METODOS_METODO" ON "laboratorios_metodos" ("metodo_id")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remover índices da tabela laboratorios_metodos
    await queryRunner.query(`DROP INDEX "IDX_LABORATORIOS_METODOS_METODO"`);
    await queryRunner.query(
      `DROP INDEX "IDX_LABORATORIOS_METODOS_LABORATORIO"`,
    );

    // Remover tabela laboratorios_metodos
    await queryRunner.dropTable('laboratorios_metodos');

    // Remover índices da tabela metodos
    await queryRunner.query(`DROP INDEX "IDX_METODOS_NOME"`);
    await queryRunner.query(`DROP INDEX "IDX_METODOS_CODIGO_INTERNO"`);

    // Remover tabela metodos
    await queryRunner.dropTable('metodos');
  }
}
