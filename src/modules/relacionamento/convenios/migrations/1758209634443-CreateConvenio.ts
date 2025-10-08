import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateConvenio1758209634443 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'convenios',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'codigo',
            type: 'varchar',
            length: '20',
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
            name: 'cnpj',
            type: 'varchar',
            length: '14',
            isUnique: true,
          },
          {
            name: 'inscricao_estadual',
            type: 'varchar',
            length: '20',
            isNullable: true,
          },
          {
            name: 'inscricao_municipal',
            type: 'varchar',
            length: '20',
            isNullable: true,
          },
          {
            name: 'registro_ans',
            type: 'varchar',
            length: '20',
            isNullable: true,
          },
          {
            name: 'tipo_convenio',
            type: 'enum',
            enum: ['plano_saude', 'particular', 'sus', 'cooperativa', 'outro'],
          },
          {
            name: 'modalidade',
            type: 'enum',
            enum: ['pre_pagamento', 'pos_pagamento', 'coparticipacao'],
          },
          {
            name: 'endereco',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'numero',
            type: 'varchar',
            length: '10',
          },
          {
            name: 'complemento',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'bairro',
            type: 'varchar',
            length: '100',
          },
          {
            name: 'cidade',
            type: 'varchar',
            length: '100',
          },
          {
            name: 'uf',
            type: 'char',
            length: '2',
          },
          {
            name: 'cep',
            type: 'varchar',
            length: '8',
          },
          {
            name: 'telefone_principal',
            type: 'varchar',
            length: '20',
          },
          {
            name: 'telefone_secundario',
            type: 'varchar',
            length: '20',
            isNullable: true,
          },
          {
            name: 'email_principal',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'email_faturamento',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'website',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'prazo_pagamento',
            type: 'int',
            default: 30,
          },
          {
            name: 'dia_vencimento',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'forma_pagamento',
            type: 'enum',
            enum: ['boleto', 'transferencia', 'deposito', 'pix'],
          },
          {
            name: 'banco',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'agencia',
            type: 'varchar',
            length: '20',
            isNullable: true,
          },
          {
            name: 'conta',
            type: 'varchar',
            length: '20',
            isNullable: true,
          },
          {
            name: 'pix_key',
            type: 'varchar',
            length: '255',
            isNullable: true,
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
            name: 'data_contrato',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'data_vigencia_inicio',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'data_vigencia_fim',
            type: 'date',
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
      }),
      true,
    );

    await queryRunner.query(
      `CREATE INDEX "IDX_CONVENIO_CODIGO" ON "convenios" ("codigo")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_CONVENIO_CNPJ" ON "convenios" ("cnpj")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_CONVENIO_ATIVO" ON "convenios" ("ativo")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('convenios');
  }
}
