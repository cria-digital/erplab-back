import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateConfiguracoesCamposFormularioTable1763839200000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Criar ENUM para tipo de entidade
    await queryRunner.query(`
      CREATE TYPE configuracoes_campos_entidade_tipo_enum AS ENUM (
        'convenio',
        'laboratorio',
        'telemedicina',
        'unidade_saude',
        'fornecedor',
        'prestador_servico'
      )
    `);

    // Criar tabela
    await queryRunner.createTable(
      new Table({
        name: 'configuracoes_campos_formulario',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v4()',
          },
          {
            name: 'entidade_tipo',
            type: 'configuracoes_campos_entidade_tipo_enum',
            isNullable: false,
            comment:
              'Tipo da entidade: convenio, laboratorio, telemedicina, etc',
          },
          {
            name: 'entidade_id',
            type: 'uuid',
            isNullable: false,
            comment: 'ID da entidade (convenio_id, laboratorio_id, etc)',
          },
          {
            name: 'tipo_formulario',
            type: 'varchar',
            length: '50',
            isNullable: false,
            comment:
              'Tipo do formulário: cadastro_paciente, ordem_servico, tiss',
          },
          {
            name: 'nome_campo',
            type: 'varchar',
            length: '100',
            isNullable: false,
            comment: 'Nome do campo no formulário',
          },
          {
            name: 'obrigatorio',
            type: 'boolean',
            default: false,
            isNullable: false,
            comment: 'Se o campo é obrigatório para esta entidade',
          },
          {
            name: 'criado_em',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'atualizado_em',
            type: 'timestamp',
            default: 'now()',
          },
        ],
        uniques: [
          {
            name: 'UQ_entidade_tipo_formulario_campo',
            columnNames: [
              'entidade_tipo',
              'entidade_id',
              'tipo_formulario',
              'nome_campo',
            ],
          },
        ],
      }),
      true,
    );

    // Criar índice para buscas rápidas
    await queryRunner.createIndex(
      'configuracoes_campos_formulario',
      new TableIndex({
        name: 'IDX_config_campos_entidade',
        columnNames: ['entidade_tipo', 'entidade_id', 'tipo_formulario'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex(
      'configuracoes_campos_formulario',
      'IDX_config_campos_entidade',
    );
    await queryRunner.dropTable('configuracoes_campos_formulario');
    await queryRunner.query(
      `DROP TYPE configuracoes_campos_entidade_tipo_enum`,
    );
  }
}
