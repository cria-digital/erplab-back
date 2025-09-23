import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreatePrestadoresServicoTable1758378346593
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Criar enums
    await queryRunner.query(`
      CREATE TYPE tipo_contrato_enum AS ENUM (
        'fixo',
        'por_demanda',
        'retainer',
        'projeto'
      )
    `);

    await queryRunner.query(`
      CREATE TYPE forma_pagamento_prestador_enum AS ENUM (
        'mensalidade',
        'por_servico',
        'hora_trabalhada',
        'pacote_fechado',
        'comissao',
        'misto'
      )
    `);

    await queryRunner.query(`
      CREATE TYPE status_contrato_enum AS ENUM (
        'ativo',
        'inativo',
        'suspenso',
        'em_analise',
        'cancelado'
      )
    `);

    await queryRunner.query(`
      CREATE TYPE frequencia_pagamento_enum AS ENUM (
        'diario',
        'semanal',
        'quinzenal',
        'mensal',
        'bimestral',
        'trimestral',
        'semestral',
        'anual',
        'por_servico'
      )
    `);

    await queryRunner.query(`
      CREATE TYPE tipo_servico_categoria_enum AS ENUM (
        'manutencao_equipamentos',
        'prestadores_exames',
        'honorario_contabeis',
        'honorario_consultoria',
        'honorario_advocaticio',
        'internet_telefonia',
        'agua',
        'energia',
        'suporte_software',
        'desenvolvimento_software',
        'seguranca_monitoramento',
        'outros_servicos_pf',
        'outros_servicos_pj',
        'limpeza_conservacao',
        'transporte_logistica',
        'marketing_publicidade',
        'recursos_humanos',
        'treinamento_capacitacao',
        'arquitetura_engenharia',
        'vigilancia_sanitaria',
        'calibracao_metrologia'
      )
    `);

    // Criar tabela prestadores_servico
    await queryRunner.createTable(
      new Table({
        name: 'prestadores_servico',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'empresa_id',
            type: 'uuid',
            isUnique: true,
          },
          {
            name: 'codigo_prestador',
            type: 'varchar',
            length: '20',
            isUnique: true,
          },
          // Informações do Contrato
          {
            name: 'tipo_contrato',
            type: 'tipo_contrato_enum',
            default: "'por_demanda'",
          },
          {
            name: 'numero_contrato',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },
          {
            name: 'data_inicio_contrato',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'data_fim_contrato',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'renovacao_automatica',
            type: 'boolean',
            default: false,
          },
          {
            name: 'prazo_aviso_renovacao',
            type: 'int',
            isNullable: true,
            comment: 'Dias de antecedência para aviso de renovação',
          },
          // Informações de Pagamento
          {
            name: 'forma_pagamento',
            type: 'forma_pagamento_prestador_enum',
            default: "'por_servico'",
          },
          {
            name: 'valor_hora',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'valor_mensal',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'valor_minimo',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'prazo_pagamento',
            type: 'int',
            default: 30,
            comment: 'Prazo em dias',
          },
          {
            name: 'dia_vencimento',
            type: 'int',
            isNullable: true,
            comment: 'Dia do mês para vencimento',
          },
          {
            name: 'frequencia_pagamento',
            type: 'frequencia_pagamento_enum',
            default: "'mensal'",
          },
          // PIX Settings
          {
            name: 'tipo_pix',
            type: 'varchar',
            length: '20',
            isNullable: true,
          },
          {
            name: 'chave_pix',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          // Dados Bancários
          {
            name: 'banco',
            type: 'varchar',
            length: '3',
            isNullable: true,
          },
          {
            name: 'agencia',
            type: 'varchar',
            length: '10',
            isNullable: true,
          },
          {
            name: 'conta',
            type: 'varchar',
            length: '20',
            isNullable: true,
          },
          {
            name: 'tipo_conta',
            type: 'varchar',
            length: '20',
            isNullable: true,
          },
          // Controles
          {
            name: 'status_contrato',
            type: 'status_contrato_enum',
            default: "'em_analise'",
          },
          {
            name: 'sla_resposta',
            type: 'int',
            isNullable: true,
            comment: 'SLA de resposta em horas',
          },
          {
            name: 'sla_resolucao',
            type: 'int',
            isNullable: true,
            comment: 'SLA de resolução em horas',
          },
          {
            name: 'horario_atendimento',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'dias_atendimento',
            type: 'text',
            isArray: true,
            isNullable: true,
          },
          {
            name: 'suporte_24x7',
            type: 'boolean',
            default: false,
          },
          {
            name: 'atende_urgencia',
            type: 'boolean',
            default: false,
          },
          {
            name: 'taxa_urgencia',
            type: 'decimal',
            precision: 5,
            scale: 2,
            isNullable: true,
            comment: 'Percentual adicional para urgência',
          },
          // Avaliação
          {
            name: 'avaliacao_media',
            type: 'decimal',
            precision: 3,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'total_avaliacoes',
            type: 'int',
            default: 0,
          },
          {
            name: 'total_servicos_prestados',
            type: 'int',
            default: 0,
          },
          // Observações e configurações
          {
            name: 'observacoes',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'requisitos_acesso',
            type: 'text',
            isNullable: true,
            comment: 'Requisitos para acesso às instalações',
          },
          {
            name: 'certificacoes',
            type: 'text',
            isArray: true,
            isNullable: true,
          },
          {
            name: 'seguros',
            type: 'text',
            isArray: true,
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
        foreignKeys: [
          {
            name: 'FK_prestador_servico_empresa',
            columnNames: ['empresa_id'],
            referencedTableName: 'empresas',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
      }),
      true,
    );

    // Criar índices para prestadores_servico
    await queryRunner.query(`
      CREATE INDEX "IDX_prestador_servico_status_contrato"
      ON "prestadores_servico" ("status_contrato")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_prestador_servico_tipo_contrato"
      ON "prestadores_servico" ("tipo_contrato")
    `);

    // Criar tabela prestador_servico_categorias
    await queryRunner.createTable(
      new Table({
        name: 'prestador_servico_categorias',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'prestador_servico_id',
            type: 'uuid',
          },
          {
            name: 'tipo_servico',
            type: 'tipo_servico_categoria_enum',
          },
          {
            name: 'descricao_servico',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'valor_padrao',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'unidade_medida',
            type: 'varchar',
            length: '50',
            isNullable: true,
            comment: 'hora, dia, mês, serviço, etc',
          },
          {
            name: 'prazo_execucao',
            type: 'int',
            isNullable: true,
            comment: 'Prazo padrão em dias',
          },
          {
            name: 'periodicidade',
            type: 'varchar',
            length: '50',
            isNullable: true,
            comment: 'diário, semanal, mensal, etc',
          },
          {
            name: 'responsavel_tecnico',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'telefone_responsavel',
            type: 'varchar',
            length: '20',
            isNullable: true,
          },
          {
            name: 'email_responsavel',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'requer_aprovacao',
            type: 'boolean',
            default: true,
          },
          {
            name: 'requer_orcamento',
            type: 'boolean',
            default: false,
          },
          {
            name: 'valor_limite_sem_aprovacao',
            type: 'decimal',
            precision: 10,
            scale: 2,
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
        foreignKeys: [
          {
            name: 'FK_prestador_servico_categoria_prestador',
            columnNames: ['prestador_servico_id'],
            referencedTableName: 'prestadores_servico',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
      }),
      true,
    );

    // Criar índice único para evitar duplicação de tipo de serviço por prestador
    await queryRunner.query(`
      CREATE UNIQUE INDEX "IDX_prestador_servico_categoria_unique"
      ON "prestador_servico_categorias" ("prestador_servico_id", "tipo_servico")
    `);

    // Criar índice para busca por status ativo
    await queryRunner.query(`
      CREATE INDEX "IDX_prestador_servico_categoria_ativo"
      ON "prestador_servico_categorias" ("ativo")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remover índices de prestador_servico_categorias
    await queryRunner.dropIndex(
      'prestador_servico_categorias',
      'IDX_prestador_servico_categoria_ativo',
    );
    await queryRunner.dropIndex(
      'prestador_servico_categorias',
      'IDX_prestador_servico_categoria_unique',
    );

    // Remover tabela prestador_servico_categorias
    await queryRunner.dropTable('prestador_servico_categorias');

    // Remover índices de prestadores_servico
    await queryRunner.dropIndex(
      'prestadores_servico',
      'IDX_prestador_servico_tipo_contrato',
    );
    await queryRunner.dropIndex(
      'prestadores_servico',
      'IDX_prestador_servico_status_contrato',
    );

    // Remover tabela prestadores_servico
    await queryRunner.dropTable('prestadores_servico');

    // Remover enums
    await queryRunner.query('DROP TYPE IF EXISTS tipo_servico_categoria_enum');
    await queryRunner.query('DROP TYPE IF EXISTS frequencia_pagamento_enum');
    await queryRunner.query('DROP TYPE IF EXISTS status_contrato_enum');
    await queryRunner.query(
      'DROP TYPE IF EXISTS forma_pagamento_prestador_enum',
    );
    await queryRunner.query('DROP TYPE IF EXISTS tipo_contrato_enum');
  }
}
