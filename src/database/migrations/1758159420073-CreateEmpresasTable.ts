import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateEmpresasTable1758159420073 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Criar enum para tipo de empresa
    await queryRunner.query(
      `CREATE TYPE "public"."empresas_tipoempresa_enum" AS ENUM('CONVENIOS', 'LABORATORIO_APOIO', 'TELEMEDICINA', 'FORNECEDORES', 'PRESTADORES_SERVICOS')`,
    );

    // Criar tabela empresas
    await queryRunner.createTable(
      new Table({
        name: 'empresas',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'tipoEmpresa',
            type: 'enum',
            enum: [
              'CONVENIOS',
              'LABORATORIO_APOIO',
              'TELEMEDICINA',
              'FORNECEDORES',
              'PRESTADORES_SERVICOS',
            ],
          },
          {
            name: 'codigoInterno',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'cnpj',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'razaoSocial',
            type: 'varchar',
          },
          {
            name: 'nomeFantasia',
            type: 'varchar',
          },
          {
            name: 'inscricaoEstadual',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'inscricaoMunicipal',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'telefoneFixo',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'celular',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'emailComercial',
            type: 'varchar',
          },
          {
            name: 'siteEmpresa',
            type: 'varchar',
            isNullable: true,
          },
          // Endereço
          {
            name: 'cep',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'rua',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'numero',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'bairro',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'complemento',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'estado',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'cidade',
            type: 'varchar',
            isNullable: true,
          },
          // Responsável
          {
            name: 'nomeResponsavel',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'cargoResponsavel',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'contatoResponsavel',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'emailResponsavel',
            type: 'varchar',
            isNullable: true,
          },
          // Impostos
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
          // Retenções
          {
            name: 'reterIss',
            type: 'boolean',
            default: false,
          },
          {
            name: 'reterIr',
            type: 'boolean',
            default: false,
          },
          {
            name: 'reterPcc',
            type: 'boolean',
            default: false,
          },
          {
            name: 'reterIbs',
            type: 'boolean',
            default: false,
          },
          {
            name: 'reterCbs',
            type: 'boolean',
            default: false,
          },
          {
            name: 'optanteSimplesNacional',
            type: 'boolean',
            default: false,
          },
          // Financeiro
          {
            name: 'banco',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'agencia',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'contaCorrente',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'formaPagamento',
            type: 'varchar',
            isNullable: true,
          },
          // Controle
          {
            name: 'ativo',
            type: 'boolean',
            default: true,
          },
          {
            name: 'criadoEm',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'atualizadoEm',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('empresas');
    await queryRunner.query(`DROP TYPE "public"."empresas_tipoempresa_enum"`);
  }
}
