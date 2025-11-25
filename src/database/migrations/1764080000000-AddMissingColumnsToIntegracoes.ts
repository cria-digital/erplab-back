import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

/**
 * Migration: AddMissingColumnsToIntegracoes
 *
 * Adiciona colunas que foram removidas pela migration anterior mas são necessárias:
 * - empresa_id: Para suporte multi-tenant
 * - timeout_segundos: Timeout padrão
 * - intervalo_sincronizacao_minutos: Intervalo de sync
 * - limite_requisicoes_dia: Limite de requisições
 * - requisicoes_hoje: Contador de requisições
 * - data_reset_contador: Data do reset
 * - ultima_tentativa: Última tentativa de conexão
 * - observacoes: Campo de observações
 */
export class AddMissingColumnsToIntegracoes1764080000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // empresa_id
    await queryRunner.addColumn(
      'integracoes',
      new TableColumn({
        name: 'empresa_id',
        type: 'uuid',
        isNullable: true,
        comment: 'Empresa vinculada (para multi-tenant futuro)',
      }),
    );

    // timeout_segundos
    await queryRunner.addColumn(
      'integracoes',
      new TableColumn({
        name: 'timeout_segundos',
        type: 'int',
        default: 30,
        comment: 'Timeout padrão em segundos',
      }),
    );

    // intervalo_sincronizacao_minutos
    await queryRunner.addColumn(
      'integracoes',
      new TableColumn({
        name: 'intervalo_sincronizacao_minutos',
        type: 'int',
        isNullable: true,
        comment: 'Intervalo de sincronização automática',
      }),
    );

    // limite_requisicoes_dia
    await queryRunner.addColumn(
      'integracoes',
      new TableColumn({
        name: 'limite_requisicoes_dia',
        type: 'int',
        isNullable: true,
        comment: 'Limite de requisições por dia',
      }),
    );

    // requisicoes_hoje
    await queryRunner.addColumn(
      'integracoes',
      new TableColumn({
        name: 'requisicoes_hoje',
        type: 'int',
        default: 0,
        comment: 'Contador de requisições do dia',
      }),
    );

    // data_reset_contador
    await queryRunner.addColumn(
      'integracoes',
      new TableColumn({
        name: 'data_reset_contador',
        type: 'date',
        isNullable: true,
        comment: 'Data do último reset do contador',
      }),
    );

    // ultima_tentativa
    await queryRunner.addColumn(
      'integracoes',
      new TableColumn({
        name: 'ultima_tentativa',
        type: 'timestamp',
        isNullable: true,
        comment: 'Última tentativa de conexão',
      }),
    );

    // observacoes
    await queryRunner.addColumn(
      'integracoes',
      new TableColumn({
        name: 'observacoes',
        type: 'text',
        isNullable: true,
        comment: 'Observações gerais',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('integracoes', 'observacoes');
    await queryRunner.dropColumn('integracoes', 'ultima_tentativa');
    await queryRunner.dropColumn('integracoes', 'data_reset_contador');
    await queryRunner.dropColumn('integracoes', 'requisicoes_hoje');
    await queryRunner.dropColumn('integracoes', 'limite_requisicoes_dia');
    await queryRunner.dropColumn(
      'integracoes',
      'intervalo_sincronizacao_minutos',
    );
    await queryRunner.dropColumn('integracoes', 'timeout_segundos');
    await queryRunner.dropColumn('integracoes', 'empresa_id');
  }
}
