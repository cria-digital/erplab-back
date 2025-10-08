import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreatePlano1758209650194 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'planos',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'convenio_id',
            type: 'uuid',
          },
          {
            name: 'codigo_plano',
            type: 'varchar',
            length: '50',
          },
          {
            name: 'nome_plano',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'tipo_plano',
            type: 'enum',
            enum: ['ambulatorial', 'hospitalar', 'completo', 'odontologico'],
          },
          {
            name: 'categoria',
            type: 'enum',
            enum: ['basico', 'intermediario', 'premium', 'executivo'],
          },
          {
            name: 'modalidade',
            type: 'enum',
            enum: ['pre_pagamento', 'pos_pagamento', 'coparticipacao'],
          },
          {
            name: 'vigencia_inicio',
            type: 'date',
          },
          {
            name: 'vigencia_fim',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['ativo', 'inativo', 'suspenso'],
            default: "'ativo'",
          },
          {
            name: 'carencia_dias',
            type: 'int',
            default: 0,
          },
          {
            name: 'cobertura_geografica',
            type: 'enum',
            enum: ['municipal', 'estadual', 'nacional', 'internacional'],
          },
          {
            name: 'valor_consulta',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'valor_ch',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'valor_uco',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'valor_filme',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'percentual_coparticipacao',
            type: 'decimal',
            precision: 5,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'limite_mensal',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'limite_anual',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'observacoes',
            type: 'text',
            isNullable: true,
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
            name: 'FK_PLANO_CONVENIO',
            columnNames: ['convenio_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'convenios',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
      true,
    );

    await queryRunner.query(
      `CREATE INDEX "IDX_PLANO_CONVENIO" ON "planos" ("convenio_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_PLANO_CODIGO" ON "planos" ("codigo_plano")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_PLANO_STATUS" ON "planos" ("status")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('planos');
  }
}
