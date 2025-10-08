import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateInstrucao1758209671276 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'instrucoes',
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
            name: 'codigo',
            type: 'varchar',
            length: '20',
          },
          {
            name: 'categoria',
            type: 'enum',
            enum: [
              'autorizacao_previa',
              'faturamento',
              'atendimento',
              'documentacao',
              'auditoria',
              'urgencia_emergencia',
              'internacao',
              'sadt',
            ],
          },
          {
            name: 'tipo_procedimento',
            type: 'enum',
            enum: [
              'todos',
              'consultas',
              'exames',
              'cirurgias',
              'internacoes',
              'procedimentos_especiais',
            ],
            default: "'todos'",
          },
          {
            name: 'titulo',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'descricao',
            type: 'text',
          },
          {
            name: 'prazo_resposta_dias',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'prazo_resposta_horas',
            type: 'int',
            isNullable: true,
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
            enum: ['ativa', 'inativa', 'suspensa'],
            default: "'ativa'",
          },
          {
            name: 'prioridade',
            type: 'enum',
            enum: ['alta', 'media', 'baixa'],
            default: "'media'",
          },
          {
            name: 'setor_responsavel',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'contato_telefone',
            type: 'varchar',
            length: '20',
            isNullable: true,
          },
          {
            name: 'contato_email',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'documentos_necessarios',
            type: 'json',
            isNullable: true,
          },
          {
            name: 'anexos',
            type: 'json',
            isNullable: true,
          },
          {
            name: 'links_uteis',
            type: 'json',
            isNullable: true,
          },
          {
            name: 'tags',
            type: 'json',
            isNullable: true,
          },
          {
            name: 'observacoes_internas',
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
          {
            name: 'created_by',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'updated_by',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
        ],
        foreignKeys: [
          {
            name: 'FK_INSTRUCAO_CONVENIO',
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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('instrucoes');
  }
}
