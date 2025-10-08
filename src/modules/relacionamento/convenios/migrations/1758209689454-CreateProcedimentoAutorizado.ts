import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateProcedimentoAutorizado1758209689454
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'procedimentos_autorizados',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'plano_id',
            type: 'uuid',
          },
          {
            name: 'codigo_tuss',
            type: 'varchar',
            length: '20',
            isNullable: true,
          },
          {
            name: 'codigo_cbhpm',
            type: 'varchar',
            length: '20',
            isNullable: true,
          },
          {
            name: 'codigo_proprio',
            type: 'varchar',
            length: '20',
            isNullable: true,
          },
          {
            name: 'descricao',
            type: 'varchar',
            length: '500',
          },
          {
            name: 'valor_negociado',
            type: 'decimal',
            precision: 10,
            scale: 2,
          },
          {
            name: 'percentual_coparticipacao',
            type: 'decimal',
            precision: 5,
            scale: 2,
            default: 0,
          },
          {
            name: 'carencia_especifica_dias',
            type: 'int',
            default: 0,
          },
          {
            name: 'limite_utilizacao_mensal',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'limite_utilizacao_anual',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'necessita_autorizacao',
            type: 'boolean',
            default: false,
          },
          {
            name: 'documentacao_necessaria',
            type: 'json',
            isNullable: true,
          },
          {
            name: 'prazo_autorizacao_dias',
            type: 'int',
            default: 1,
          },
          {
            name: 'observacoes',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'ativo',
            type: 'boolean',
            default: true,
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
            name: 'FK_PROCEDIMENTO_PLANO',
            columnNames: ['plano_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'planos',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('procedimentos_autorizados');
  }
}
