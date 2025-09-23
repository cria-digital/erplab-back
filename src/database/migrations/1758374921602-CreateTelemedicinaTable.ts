import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTelemedicinaTable1758374921602
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Criar enums
    await queryRunner.query(`
      CREATE TYPE "public"."telemedicina_tipo_integracao_enum" AS ENUM(
        'api_rest', 'webhook', 'hl7', 'fhir', 'manual', 'dicom'
      )
    `);

    await queryRunner.query(`
      CREATE TYPE "public"."telemedicina_tipo_plataforma_enum" AS ENUM(
        'web', 'mobile', 'desktop', 'hibrida'
      )
    `);

    await queryRunner.query(`
      CREATE TYPE "public"."telemedicina_status_integracao_enum" AS ENUM(
        'ativo', 'inativo', 'teste', 'manutencao'
      )
    `);

    // Criar tabela telemedicina
    await queryRunner.createTable(
      new Table({
        name: 'telemedicina',
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
            name: 'codigo_telemedicina',
            type: 'varchar',
            length: '20',
            isUnique: true,
          },
          // Configurações de Integração
          {
            name: 'tipo_integracao',
            type: 'enum',
            enum: ['api_rest', 'webhook', 'hl7', 'fhir', 'manual', 'dicom'],
            default: "'manual'",
          },
          {
            name: 'url_integracao',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'token_integracao',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'usuario_integracao',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'senha_integracao',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'configuracao_adicional',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'status_integracao',
            type: 'enum',
            enum: ['ativo', 'inativo', 'teste', 'manutencao'],
            default: "'inativo'",
          },
          // Informações da Plataforma
          {
            name: 'tipo_plataforma',
            type: 'enum',
            enum: ['web', 'mobile', 'desktop', 'hibrida'],
            default: "'web'",
          },
          {
            name: 'url_plataforma',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'versao_sistema',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          // Especialidades e Serviços
          {
            name: 'especialidades_atendidas',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'tipos_consulta',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'teleconsulta',
            type: 'boolean',
            default: false,
          },
          {
            name: 'telediagnostico',
            type: 'boolean',
            default: false,
          },
          {
            name: 'telecirurgia',
            type: 'boolean',
            default: false,
          },
          {
            name: 'telemonitoramento',
            type: 'boolean',
            default: false,
          },
          // Configurações de Atendimento
          {
            name: 'tempo_consulta_padrao',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'permite_agendamento_online',
            type: 'boolean',
            default: false,
          },
          {
            name: 'permite_cancelamento_online',
            type: 'boolean',
            default: false,
          },
          {
            name: 'antecedencia_minima_agendamento',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'antecedencia_minima_cancelamento',
            type: 'int',
            isNullable: true,
          },
          // Configurações Técnicas
          {
            name: 'certificado_digital',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'suporte_gravacao',
            type: 'boolean',
            default: false,
          },
          {
            name: 'suporte_streaming',
            type: 'boolean',
            default: false,
          },
          {
            name: 'criptografia_end_to_end',
            type: 'boolean',
            default: true,
          },
          {
            name: 'protocolo_seguranca',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },
          // Valores e Cobrança
          {
            name: 'valor_consulta_particular',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'percentual_repasse',
            type: 'decimal',
            precision: 5,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'taxa_plataforma',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: true,
          },
          // Observações
          {
            name: 'observacoes',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'requisitos_tecnicos',
            type: 'text',
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

    // Criar tabela telemedicina_exames
    await queryRunner.createTable(
      new Table({
        name: 'telemedicina_exames',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'telemedicina_id',
            type: 'uuid',
          },
          {
            name: 'exame_id',
            type: 'uuid',
          },
          {
            name: 'codigo_telemedicina',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },
          {
            name: 'nome_exame_telemedicina',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'categoria_telemedicina',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'ativo',
            type: 'boolean',
            default: true,
          },
          {
            name: 'permite_upload_imagem',
            type: 'boolean',
            default: false,
          },
          {
            name: 'requer_especialista',
            type: 'boolean',
            default: false,
          },
          {
            name: 'tempo_laudo_padrao',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'valor_laudo',
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
          },
        ],
        foreignKeys: [
          {
            columnNames: ['telemedicina_id'],
            referencedTableName: 'telemedicina',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
          {
            columnNames: ['exame_id'],
            referencedTableName: 'exames',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
        uniques: [
          {
            columnNames: ['telemedicina_id', 'exame_id'],
          },
        ],
      }),
      true,
    );

    // Criar índices
    await queryRunner.query(
      `CREATE INDEX "IDX_telemedicina_empresa_id" ON "telemedicina" ("empresa_id")`,
    );

    await queryRunner.query(
      `CREATE INDEX "IDX_telemedicina_codigo" ON "telemedicina" ("codigo_telemedicina")`,
    );

    await queryRunner.query(
      `CREATE INDEX "IDX_telemedicina_tipo_integracao" ON "telemedicina" ("tipo_integracao")`,
    );

    await queryRunner.query(
      `CREATE INDEX "IDX_telemedicina_status_integracao" ON "telemedicina" ("status_integracao")`,
    );

    await queryRunner.query(
      `CREATE INDEX "IDX_telemedicina_exames_telemedicina_id" ON "telemedicina_exames" ("telemedicina_id")`,
    );

    await queryRunner.query(
      `CREATE INDEX "IDX_telemedicina_exames_exame_id" ON "telemedicina_exames" ("exame_id")`,
    );

    await queryRunner.query(
      `CREATE INDEX "IDX_telemedicina_exames_ativo" ON "telemedicina_exames" ("ativo")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remover índices
    await queryRunner.dropIndex(
      'telemedicina_exames',
      'IDX_telemedicina_exames_ativo',
    );
    await queryRunner.dropIndex(
      'telemedicina_exames',
      'IDX_telemedicina_exames_exame_id',
    );
    await queryRunner.dropIndex(
      'telemedicina_exames',
      'IDX_telemedicina_exames_telemedicina_id',
    );
    await queryRunner.dropIndex(
      'telemedicina',
      'IDX_telemedicina_status_integracao',
    );
    await queryRunner.dropIndex(
      'telemedicina',
      'IDX_telemedicina_tipo_integracao',
    );
    await queryRunner.dropIndex('telemedicina', 'IDX_telemedicina_codigo');
    await queryRunner.dropIndex('telemedicina', 'IDX_telemedicina_empresa_id');

    // Remover tabelas
    await queryRunner.dropTable('telemedicina_exames');
    await queryRunner.dropTable('telemedicina');

    // Remover enums
    await queryRunner.query(
      `DROP TYPE "public"."telemedicina_status_integracao_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."telemedicina_tipo_plataforma_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."telemedicina_tipo_integracao_enum"`,
    );
  }
}
