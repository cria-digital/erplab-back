import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateUnidadesSaudeTable1757363365715 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Criar extensão UUID se não existir
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    
    // Criar tabela unidades_saude
    await queryRunner.createTable(
      new Table({
        name: 'unidades_saude',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          // Informações Básicas
          {
            name: 'nome_unidade',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'codigo_interno',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },
          {
            name: 'cnpj',
            type: 'varchar',
            length: '14',
            isUnique: true,
          },
          {
            name: 'razao_social',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'nome_fantasia',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'inscricao_municipal',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },
          {
            name: 'inscricao_estadual',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },
          {
            name: 'cnes',
            type: 'varchar',
            length: '15',
            isNullable: true,
          },
          {
            name: 'contatos_unidade',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'email',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'codigo_servico_principal',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },
          {
            name: 'codigo_servico_secundario',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },
          {
            name: 'cnae_principal',
            type: 'varchar',
            length: '10',
            isNullable: true,
          },
          // Imagem/Logo
          {
            name: 'imagem_url',
            type: 'varchar',
            length: '500',
            isNullable: true,
          },
          // Endereço
          {
            name: 'cep',
            type: 'varchar',
            length: '8',
            isNullable: true,
          },
          {
            name: 'rua',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'numero',
            type: 'varchar',
            length: '20',
            isNullable: true,
          },
          {
            name: 'bairro',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'complemento',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'estado',
            type: 'varchar',
            length: '2',
            isNullable: true,
          },
          {
            name: 'cidade',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          // Responsável
          {
            name: 'nome_responsavel',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'contato_responsavel',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'email_responsavel',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          // Impostos (percentuais)
          {
            name: 'irrf_percentual',
            type: 'decimal',
            precision: 5,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'pis_percentual',
            type: 'decimal',
            precision: 5,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'cofins_percentual',
            type: 'decimal',
            precision: 5,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'csll_percentual',
            type: 'decimal',
            precision: 5,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'iss_percentual',
            type: 'decimal',
            precision: 5,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'ibs_percentual',
            type: 'decimal',
            precision: 5,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'cbs_percentual',
            type: 'decimal',
            precision: 5,
            scale: 2,
            isNullable: true,
          },
          // Retenções fiscais
          {
            name: 'reter_iss',
            type: 'boolean',
            default: false,
          },
          {
            name: 'reter_ir',
            type: 'boolean',
            default: false,
          },
          {
            name: 'reter_pcc',
            type: 'boolean',
            default: false,
          },
          {
            name: 'reter_ibs',
            type: 'boolean',
            default: false,
          },
          {
            name: 'reter_cbs',
            type: 'boolean',
            default: false,
          },
          {
            name: 'optante_simples_nacional',
            type: 'boolean',
            default: false,
          },
          // Certificado Digital
          {
            name: 'certificado_digital_vinculado',
            type: 'boolean',
            default: false,
          },
          {
            name: 'certificado_digital_path',
            type: 'varchar',
            length: '500',
            isNullable: true,
          },
          {
            name: 'certificado_digital_senha',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'certificado_digital_validade',
            type: 'date',
            isNullable: true,
          },
          // Status
          {
            name: 'ativo',
            type: 'boolean',
            default: true,
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
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // Criar índices
    await queryRunner.query(`CREATE INDEX "IDX_UNIDADE_SAUDE_CNPJ" ON "unidades_saude" ("cnpj")`);
    await queryRunner.query(`CREATE INDEX "IDX_UNIDADE_SAUDE_CIDADE" ON "unidades_saude" ("cidade")`);
    await queryRunner.query(`CREATE INDEX "IDX_UNIDADE_SAUDE_ATIVO" ON "unidades_saude" ("ativo")`);

    // Criar enum para dia_semana
    await queryRunner.query(`
      CREATE TYPE dia_semana_enum AS ENUM (
        'SEGUNDA', 'TERCA', 'QUARTA', 'QUINTA', 
        'SEXTA', 'SABADO', 'DOMINGO', 'FERIADOS'
      )
    `);

    // Criar tabela horarios_atendimento
    await queryRunner.createTable(
      new Table({
        name: 'horarios_atendimento',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'unidade_saude_id',
            type: 'uuid',
          },
          {
            name: 'dia_semana',
            type: 'enum',
            enum: ['SEGUNDA', 'TERCA', 'QUARTA', 'QUINTA', 'SEXTA', 'SABADO', 'DOMINGO', 'FERIADOS'],
          },
          {
            name: 'horario_inicio',
            type: 'time',
          },
          {
            name: 'horario_fim',
            type: 'time',
          },
          {
            name: 'intervalo_inicio',
            type: 'time',
            isNullable: true,
          },
          {
            name: 'intervalo_fim',
            type: 'time',
            isNullable: true,
          },
          {
            name: 'sem_intervalo',
            type: 'boolean',
            default: false,
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
            name: 'FK_HORARIO_ATENDIMENTO_UNIDADE',
            columnNames: ['unidade_saude_id'],
            referencedTableName: 'unidades_saude',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
      true,
    );

    // Criar tabela dados_bancarios
    await queryRunner.createTable(
      new Table({
        name: 'dados_bancarios',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'unidade_saude_id',
            type: 'uuid',
          },
          {
            name: 'banco',
            type: 'varchar',
            length: '100',
          },
          {
            name: 'codigo_banco',
            type: 'varchar',
            length: '10',
          },
          {
            name: 'agencia',
            type: 'varchar',
            length: '20',
          },
          {
            name: 'digito_agencia',
            type: 'varchar',
            length: '5',
            isNullable: true,
          },
          {
            name: 'conta_corrente',
            type: 'varchar',
            length: '20',
          },
          {
            name: 'digito_conta',
            type: 'varchar',
            length: '5',
            isNullable: true,
          },
          {
            name: 'tipo_conta',
            type: 'varchar',
            length: '20',
          },
          {
            name: 'principal',
            type: 'boolean',
            default: false,
          },
          {
            name: 'observacoes',
            type: 'varchar',
            length: '255',
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
            name: 'FK_DADO_BANCARIO_UNIDADE',
            columnNames: ['unidade_saude_id'],
            referencedTableName: 'unidades_saude',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
      true,
    );

    // Criar tabela cnae_secundarios
    await queryRunner.createTable(
      new Table({
        name: 'cnae_secundarios',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'unidade_saude_id',
            type: 'uuid',
          },
          {
            name: 'codigo_cnae',
            type: 'varchar',
            length: '10',
          },
          {
            name: 'descricao',
            type: 'varchar',
            length: '255',
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
            name: 'FK_CNAE_SECUNDARIO_UNIDADE',
            columnNames: ['unidade_saude_id'],
            referencedTableName: 'unidades_saude',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remover tabelas na ordem inversa (devido às foreign keys)
    await queryRunner.dropTable('cnae_secundarios');
    await queryRunner.dropTable('dados_bancarios');
    await queryRunner.dropTable('horarios_atendimento');
    
    // Remover enum
    await queryRunner.query(`DROP TYPE IF EXISTS dia_semana_enum`);
    
    await queryRunner.dropTable('unidades_saude');
  }
}