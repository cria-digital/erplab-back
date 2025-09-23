import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateFornecedoresTable1758377699763
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Criar enums
    await queryRunner.query(`
      CREATE TYPE "public"."categoria_insumo_enum" AS ENUM(
        'reagentes_insumos', 'equipamentos_medicos', 'material_escritorio',
        'uniformes_epi', 'medicamentos', 'outros'
      )
    `);

    await queryRunner.query(`
      CREATE TYPE "public"."metodo_transporte_enum" AS ENUM(
        'correios', 'transportadora', 'proprio', 'entrega_local', 'retirada'
      )
    `);

    await queryRunner.query(`
      CREATE TYPE "public"."forma_pagamento_fornecedor_enum" AS ENUM(
        'boleto', 'pix', 'transferencia', 'cartao_credito', 'cartao_debito',
        'dinheiro', 'cheque', 'prazo_30_dias', 'prazo_60_dias', 'prazo_90_dias'
      )
    `);

    await queryRunner.query(`
      CREATE TYPE "public"."status_fornecedor_enum" AS ENUM(
        'ativo', 'inativo', 'bloqueado', 'pendente_aprovacao'
      )
    `);

    await queryRunner.query(`
      CREATE TYPE "public"."unidade_medida_enum" AS ENUM(
        'unidade', 'caixa', 'pacote', 'frasco', 'litro', 'mililitro',
        'quilograma', 'grama', 'metro', 'centimetro', 'par', 'conjunto'
      )
    `);

    await queryRunner.query(`
      CREATE TYPE "public"."status_insumo_enum" AS ENUM(
        'disponivel', 'indisponivel', 'descontinuado', 'sob_consulta'
      )
    `);

    // Criar tabela fornecedores
    await queryRunner.createTable(
      new Table({
        name: 'fornecedores',
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
            name: 'codigo_fornecedor',
            type: 'varchar',
            length: '20',
            isUnique: true,
          },
          // Informações Específicas
          {
            name: 'categorias_fornecidas',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'metodos_transporte',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'formas_pagamento_aceitas',
            type: 'text',
            isNullable: true,
          },
          // Prazos e Condições
          {
            name: 'prazo_entrega_padrao',
            type: 'int',
            default: 7,
          },
          {
            name: 'prazo_entrega_urgente',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'orcamento_minimo',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'orcamento_maximo',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'desconto_padrao',
            type: 'decimal',
            precision: 5,
            scale: 2,
            isNullable: true,
          },
          // Avaliação e Qualificação
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
            name: 'status_fornecedor',
            type: 'enum',
            enum: ['ativo', 'inativo', 'bloqueado', 'pendente_aprovacao'],
            default: "'pendente_aprovacao'",
          },
          // Certificações
          {
            name: 'certificacoes',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'possui_certificacao_iso',
            type: 'boolean',
            default: false,
          },
          {
            name: 'possui_licenca_anvisa',
            type: 'boolean',
            default: false,
          },
          {
            name: 'data_vencimento_licencas',
            type: 'date',
            isNullable: true,
          },
          // Informações Comerciais
          {
            name: 'representante_comercial',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'telefone_comercial',
            type: 'varchar',
            length: '20',
            isNullable: true,
          },
          {
            name: 'email_comercial',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'gerente_conta',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          // Configurações de Pedido
          {
            name: 'aceita_pedido_urgente',
            type: 'boolean',
            default: false,
          },
          {
            name: 'entrega_sabado',
            type: 'boolean',
            default: false,
          },
          {
            name: 'entrega_domingo',
            type: 'boolean',
            default: false,
          },
          {
            name: 'horario_inicio_entrega',
            type: 'time',
            isNullable: true,
          },
          {
            name: 'horario_fim_entrega',
            type: 'time',
            isNullable: true,
          },
          // Área de Atendimento
          {
            name: 'estados_atendidos',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'cidades_atendidas',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'atende_todo_brasil',
            type: 'boolean',
            default: false,
          },
          // Observações
          {
            name: 'observacoes',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'condicoes_especiais',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'historico_problemas',
            type: 'text',
            isNullable: true,
          },
          // Auditoria
          {
            name: 'data_ultimo_pedido',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'data_proxima_avaliacao',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'aprovado_por',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'data_aprovacao',
            type: 'date',
            isNullable: true,
          },
          // Timestamps
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
        foreignKeys: [
          {
            columnNames: ['empresa_id'],
            referencedTableName: 'empresas',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
      }),
      true,
    );

    // Criar tabela fornecedor_insumos
    await queryRunner.createTable(
      new Table({
        name: 'fornecedor_insumos',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'fornecedor_id',
            type: 'uuid',
          },
          // Identificação
          {
            name: 'codigo_interno',
            type: 'varchar',
            length: '50',
          },
          {
            name: 'codigo_fabricante',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },
          {
            name: 'codigo_barras',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },
          {
            name: 'nome_insumo',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'descricao',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'marca',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'fabricante',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          // Categorização
          {
            name: 'categoria',
            type: 'enum',
            enum: [
              'reagentes_insumos',
              'equipamentos_medicos',
              'material_escritorio',
              'uniformes_epi',
              'medicamentos',
              'outros',
            ],
          },
          {
            name: 'subcategoria',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'grupo_produto',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          // Especificações Técnicas
          {
            name: 'modelo',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },
          {
            name: 'especificacao_tecnica',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'cor',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },
          {
            name: 'tamanho',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },
          {
            name: 'voltagem',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },
          // Unidades e Quantidades
          {
            name: 'unidade_medida',
            type: 'enum',
            enum: [
              'unidade',
              'caixa',
              'pacote',
              'frasco',
              'litro',
              'mililitro',
              'quilograma',
              'grama',
              'metro',
              'centimetro',
              'par',
              'conjunto',
            ],
          },
          {
            name: 'quantidade_embalagem',
            type: 'int',
            default: 1,
          },
          {
            name: 'quantidade_minima_pedido',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'quantidade_maxima_pedido',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'estoque_disponivel',
            type: 'int',
            isNullable: true,
          },
          // Preços
          {
            name: 'preco_unitario',
            type: 'decimal',
            precision: 10,
            scale: 4,
            isNullable: true,
          },
          {
            name: 'preco_promocional',
            type: 'decimal',
            precision: 10,
            scale: 4,
            isNullable: true,
          },
          {
            name: 'data_inicio_promocao',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'data_fim_promocao',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'desconto_quantidade',
            type: 'decimal',
            precision: 5,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'quantidade_desconto',
            type: 'int',
            isNullable: true,
          },
          // Entrega
          {
            name: 'prazo_entrega_dias',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'metodo_transporte_preferencial',
            type: 'enum',
            enum: [
              'correios',
              'transportadora',
              'proprio',
              'entrega_local',
              'retirada',
            ],
            isNullable: true,
          },
          {
            name: 'custo_frete',
            type: 'decimal',
            precision: 8,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'frete_gratis_acima_valor',
            type: 'boolean',
            default: false,
          },
          {
            name: 'valor_frete_gratis',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: true,
          },
          // Pagamento
          {
            name: 'formas_pagamento',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'prazo_pagamento_dias',
            type: 'int',
            isNullable: true,
          },
          // Status
          {
            name: 'status',
            type: 'enum',
            enum: [
              'disponivel',
              'indisponivel',
              'descontinuado',
              'sob_consulta',
            ],
            default: "'disponivel'",
          },
          {
            name: 'ativo',
            type: 'boolean',
            default: true,
          },
          {
            name: 'data_validade',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'prazo_validade_meses',
            type: 'int',
            isNullable: true,
          },
          // Certificações
          {
            name: 'registro_anvisa',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'registro_inmetro',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'certificacoes_produto',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'requer_receita_medica',
            type: 'boolean',
            default: false,
          },
          {
            name: 'produto_controlado',
            type: 'boolean',
            default: false,
          },
          // Informações Adicionais
          {
            name: 'observacoes',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'link_catalogo',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'imagem_url',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'ficha_tecnica',
            type: 'text',
            isNullable: true,
          },
          // Histórico
          {
            name: 'data_ultimo_pedido',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'total_pedidos',
            type: 'int',
            default: 0,
          },
          {
            name: 'avaliacao_produto',
            type: 'decimal',
            precision: 3,
            scale: 2,
            isNullable: true,
          },
          // Timestamps
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
        foreignKeys: [
          {
            columnNames: ['fornecedor_id'],
            referencedTableName: 'fornecedores',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
        uniques: [
          {
            columnNames: ['fornecedor_id', 'codigo_interno'],
          },
        ],
      }),
      true,
    );

    // Criar índices
    await queryRunner.query(
      `CREATE INDEX "IDX_fornecedores_empresa_id" ON "fornecedores" ("empresa_id")`,
    );

    await queryRunner.query(
      `CREATE INDEX "IDX_fornecedores_codigo" ON "fornecedores" ("codigo_fornecedor")`,
    );

    await queryRunner.query(
      `CREATE INDEX "IDX_fornecedores_status" ON "fornecedores" ("status_fornecedor")`,
    );

    await queryRunner.query(
      `CREATE INDEX "IDX_fornecedor_insumos_fornecedor_id" ON "fornecedor_insumos" ("fornecedor_id")`,
    );

    await queryRunner.query(
      `CREATE INDEX "IDX_fornecedor_insumos_categoria" ON "fornecedor_insumos" ("categoria")`,
    );

    await queryRunner.query(
      `CREATE INDEX "IDX_fornecedor_insumos_status" ON "fornecedor_insumos" ("status")`,
    );

    await queryRunner.query(
      `CREATE INDEX "IDX_fornecedor_insumos_ativo" ON "fornecedor_insumos" ("ativo")`,
    );

    await queryRunner.query(
      `CREATE INDEX "IDX_fornecedor_insumos_codigo_barras" ON "fornecedor_insumos" ("codigo_barras")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remover índices
    await queryRunner.dropIndex(
      'fornecedor_insumos',
      'IDX_fornecedor_insumos_codigo_barras',
    );
    await queryRunner.dropIndex(
      'fornecedor_insumos',
      'IDX_fornecedor_insumos_ativo',
    );
    await queryRunner.dropIndex(
      'fornecedor_insumos',
      'IDX_fornecedor_insumos_status',
    );
    await queryRunner.dropIndex(
      'fornecedor_insumos',
      'IDX_fornecedor_insumos_categoria',
    );
    await queryRunner.dropIndex(
      'fornecedor_insumos',
      'IDX_fornecedor_insumos_fornecedor_id',
    );
    await queryRunner.dropIndex('fornecedores', 'IDX_fornecedores_status');
    await queryRunner.dropIndex('fornecedores', 'IDX_fornecedores_codigo');
    await queryRunner.dropIndex('fornecedores', 'IDX_fornecedores_empresa_id');

    // Remover tabelas
    await queryRunner.dropTable('fornecedor_insumos');
    await queryRunner.dropTable('fornecedores');

    // Remover enums
    await queryRunner.query(`DROP TYPE "public"."status_insumo_enum"`);
    await queryRunner.query(`DROP TYPE "public"."unidade_medida_enum"`);
    await queryRunner.query(`DROP TYPE "public"."status_fornecedor_enum"`);
    await queryRunner.query(
      `DROP TYPE "public"."forma_pagamento_fornecedor_enum"`,
    );
    await queryRunner.query(`DROP TYPE "public"."metodo_transporte_enum"`);
    await queryRunner.query(`DROP TYPE "public"."categoria_insumo_enum"`);
  }
}
