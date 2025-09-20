import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateLaboratoriosTable1758371834671 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Criar enum para tipo de integração
    await queryRunner.query(`
      CREATE TYPE "laboratorios_tipo_integracao_enum" AS ENUM(
        'api', 'webservice', 'manual', 'ftp', 'email'
      )
    `);

    // Criar tabela de laboratórios com apenas campos específicos
    await queryRunner.createTable(
      new Table({
        name: 'laboratorios',
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
            isUnique: true, // Um laboratório por empresa
          },
          {
            name: 'codigo_laboratorio',
            type: 'varchar',
            length: '20',
            isUnique: true,
          },
          // Responsável Técnico
          {
            name: 'responsavel_tecnico',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'conselho_responsavel',
            type: 'varchar',
            length: '20',
            isNullable: true,
          },
          {
            name: 'numero_conselho',
            type: 'varchar',
            length: '20',
            isNullable: true,
          },
          // Integração
          {
            name: 'tipo_integracao',
            type: 'laboratorios_tipo_integracao_enum',
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
          // Métodos de Envio de Resultados
          {
            name: 'metodos_envio_resultado',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'portal_resultados_url',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          // Prazos e Condições Específicas
          {
            name: 'prazo_entrega_normal',
            type: 'int',
            default: 3,
          },
          {
            name: 'prazo_entrega_urgente',
            type: 'int',
            default: 1,
          },
          {
            name: 'taxa_urgencia',
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
          // Configurações específicas
          {
            name: 'aceita_urgencia',
            type: 'boolean',
            default: false,
          },
          {
            name: 'envia_resultado_automatico',
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

    // Adicionar foreign key para empresa
    await queryRunner.createForeignKey(
      'laboratorios',
      new TableForeignKey({
        columnNames: ['empresa_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'empresas',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('laboratorios');
    await queryRunner.query(`DROP TYPE "laboratorios_tipo_integracao_enum"`);
  }
}