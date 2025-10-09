import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateAmostrasTable1728405000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Criar ENUM para tipo de amostra
    await queryRunner.query(`
      CREATE TYPE amostras_tipo_amostra_enum AS ENUM (
        'sangue',
        'soro',
        'plasma',
        'urina',
        'fezes',
        'swab',
        'liquor',
        'escarro',
        'tecido',
        'saliva',
        'secrecao',
        'outros'
      );
    `);

    // Criar ENUM para unidade de volume
    await queryRunner.query(`
      CREATE TYPE amostras_unidade_volume_enum AS ENUM (
        'mL',
        'L',
        'g',
        'mg',
        'unidade'
      );
    `);

    // Criar ENUM para temperatura de armazenamento
    await queryRunner.query(`
      CREATE TYPE amostras_temperatura_armazenamento_enum AS ENUM (
        'ambiente',
        'refrigerado',
        'congelado',
        'ultracongelado',
        'nitrogenio',
        'especial'
      );
    `);

    // Criar ENUM para temperatura de transporte
    await queryRunner.query(`
      CREATE TYPE amostras_temperatura_transporte_enum AS ENUM (
        'ambiente',
        'refrigerado',
        'congelado',
        'gelo_seco',
        'nitrogenio'
      );
    `);

    // Criar tabela amostras
    await queryRunner.createTable(
      new Table({
        name: 'amostras',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
            comment: 'ID único da amostra',
          },
          // Identificação
          {
            name: 'codigo_interno',
            type: 'varchar',
            length: '50',
            isUnique: true,
            comment: 'Código único da amostra (ex: SANG-EDTA-001)',
          },
          {
            name: 'nome',
            type: 'varchar',
            length: '255',
            comment: 'Nome da amostra (ex: Sangue Total com EDTA)',
          },
          {
            name: 'descricao',
            type: 'text',
            isNullable: true,
            comment: 'Descrição detalhada da amostra',
          },
          {
            name: 'tipo_amostra',
            type: 'amostras_tipo_amostra_enum',
            comment: 'Tipo/categoria da amostra',
          },
          // Coleta
          {
            name: 'recipiente_padrao',
            type: 'varchar',
            length: '255',
            isNullable: true,
            comment:
              'Tipo de recipiente padrão (ex: Tubo EDTA, Frasco estéril)',
          },
          {
            name: 'cor_tampa',
            type: 'varchar',
            length: '50',
            isNullable: true,
            comment: 'Cor da tampa do tubo (roxa, vermelha, amarela, etc)',
          },
          {
            name: 'volume_minimo',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: true,
            comment: 'Volume mínimo necessário',
          },
          {
            name: 'volume_ideal',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: true,
            comment: 'Volume ideal recomendado',
          },
          {
            name: 'unidade_volume',
            type: 'amostras_unidade_volume_enum',
            isNullable: true,
            comment: 'Unidade de medida do volume',
          },
          {
            name: 'instrucoes_coleta',
            type: 'text',
            isNullable: true,
            comment: 'Instruções detalhadas de coleta',
          },
          {
            name: 'materiais_necessarios',
            type: 'jsonb',
            isNullable: true,
            comment: 'Array de materiais necessários para coleta',
          },
          // Preparo do Paciente
          {
            name: 'requer_jejum',
            type: 'boolean',
            default: false,
            comment: 'Se a coleta requer jejum do paciente',
          },
          {
            name: 'tempo_jejum',
            type: 'integer',
            isNullable: true,
            comment: 'Tempo de jejum necessário em horas',
          },
          {
            name: 'instrucoes_preparo_paciente',
            type: 'text',
            isNullable: true,
            comment:
              'Instruções de preparo do paciente (dieta, medicamentos, etc)',
          },
          {
            name: 'restricoes',
            type: 'text',
            isNullable: true,
            comment: 'Restrições (não fumar, não beber álcool, etc)',
          },
          // Armazenamento
          {
            name: 'temperatura_armazenamento',
            type: 'amostras_temperatura_armazenamento_enum',
            isNullable: true,
            comment: 'Faixa de temperatura de armazenamento',
          },
          {
            name: 'temperatura_min',
            type: 'decimal',
            precision: 5,
            scale: 2,
            isNullable: true,
            comment: 'Temperatura mínima de armazenamento em °C',
          },
          {
            name: 'temperatura_max',
            type: 'decimal',
            precision: 5,
            scale: 2,
            isNullable: true,
            comment: 'Temperatura máxima de armazenamento em °C',
          },
          {
            name: 'prazo_validade_horas',
            type: 'integer',
            isNullable: true,
            comment: 'Prazo de validade da amostra em horas',
          },
          {
            name: 'condicoes_armazenamento',
            type: 'text',
            isNullable: true,
            comment: 'Condições especiais de armazenamento',
          },
          {
            name: 'sensibilidade_luz',
            type: 'boolean',
            default: false,
            comment: 'Se a amostra é sensível à luz (proteger)',
          },
          {
            name: 'requer_centrifugacao',
            type: 'boolean',
            default: false,
            comment: 'Se a amostra requer centrifugação',
          },
          {
            name: 'tempo_centrifugacao',
            type: 'integer',
            isNullable: true,
            comment: 'Tempo de centrifugação em minutos',
          },
          {
            name: 'rotacao_centrifugacao',
            type: 'integer',
            isNullable: true,
            comment: 'Rotação da centrífuga em RPM',
          },
          // Transporte
          {
            name: 'instrucoes_transporte',
            type: 'text',
            isNullable: true,
            comment: 'Instruções de transporte',
          },
          {
            name: 'temperatura_transporte',
            type: 'amostras_temperatura_transporte_enum',
            isNullable: true,
            comment: 'Condição de temperatura para transporte',
          },
          {
            name: 'embalagem_especial',
            type: 'boolean',
            default: false,
            comment: 'Se requer embalagem especial',
          },
          {
            name: 'observacoes_transporte',
            type: 'text',
            isNullable: true,
            comment: 'Observações sobre transporte',
          },
          // Etiquetagem
          {
            name: 'cor_etiqueta',
            type: 'varchar',
            length: '7',
            isNullable: true,
            comment: 'Cor da etiqueta em formato hexadecimal (ex: #FF0000)',
          },
          {
            name: 'codigo_barras',
            type: 'boolean',
            default: true,
            comment: 'Se deve gerar código de barras na etiqueta',
          },
          {
            name: 'template_etiqueta',
            type: 'text',
            isNullable: true,
            comment: 'Template customizado para impressão de etiqueta',
          },
          // Controle
          {
            name: 'exige_autorizacao',
            type: 'boolean',
            default: false,
            comment: 'Se a coleta exige autorização especial',
          },
          {
            name: 'observacoes',
            type: 'text',
            isNullable: true,
            comment: 'Observações gerais',
          },
          {
            name: 'ativo',
            type: 'boolean',
            default: true,
            comment: 'Se a amostra está ativa',
          },
          {
            name: 'empresa_id',
            type: 'uuid',
            isNullable: true,
            comment: 'ID da empresa (multi-tenant)',
          },
          // Auditoria
          {
            name: 'criado_por',
            type: 'uuid',
            comment: 'ID do usuário que criou o registro',
          },
          {
            name: 'atualizado_por',
            type: 'uuid',
            comment: 'ID do usuário que atualizou o registro',
          },
          {
            name: 'criado_em',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            comment: 'Data de criação do registro',
          },
          {
            name: 'atualizado_em',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            comment: 'Data da última atualização',
          },
        ],
      }),
      true,
    );

    // Criar índices
    await queryRunner.createIndex(
      'amostras',
      new TableIndex({
        name: 'IDX_amostras_codigo_interno',
        columnNames: ['codigo_interno'],
      }),
    );

    await queryRunner.createIndex(
      'amostras',
      new TableIndex({
        name: 'IDX_amostras_nome',
        columnNames: ['nome'],
      }),
    );

    await queryRunner.createIndex(
      'amostras',
      new TableIndex({
        name: 'IDX_amostras_tipo_amostra',
        columnNames: ['tipo_amostra'],
      }),
    );

    await queryRunner.createIndex(
      'amostras',
      new TableIndex({
        name: 'IDX_amostras_empresa_id',
        columnNames: ['empresa_id'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remover índices
    await queryRunner.dropIndex('amostras', 'IDX_amostras_empresa_id');
    await queryRunner.dropIndex('amostras', 'IDX_amostras_tipo_amostra');
    await queryRunner.dropIndex('amostras', 'IDX_amostras_nome');
    await queryRunner.dropIndex('amostras', 'IDX_amostras_codigo_interno');

    // Remover tabela
    await queryRunner.dropTable('amostras');

    // Remover ENUMs
    await queryRunner.query(
      `DROP TYPE IF EXISTS amostras_temperatura_transporte_enum;`,
    );
    await queryRunner.query(
      `DROP TYPE IF EXISTS amostras_temperatura_armazenamento_enum;`,
    );
    await queryRunner.query(
      `DROP TYPE IF EXISTS amostras_unidade_volume_enum;`,
    );
    await queryRunner.query(`DROP TYPE IF EXISTS amostras_tipo_amostra_enum;`);
  }
}
