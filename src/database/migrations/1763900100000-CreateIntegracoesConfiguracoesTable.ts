import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

/**
 * Migration: CreateIntegracoesConfiguracoesTable
 *
 * Cria a tabela integracoes_configuracoes para armazenar
 * configurações em formato chave-valor de cada integração.
 *
 * Estrutura:
 * - Cada campo de configuração é uma linha (usuario, senha, ambiente, etc)
 * - Schema no código define quais campos são válidos
 * - Valores podem ser criptografados se o schema indicar
 * - Constraint UNIQUE em (integracao_id, chave) evita duplicatas
 * - CASCADE DELETE: se integração for deletada, configs também são
 *
 * Exemplo:
 * integracao_id | chave      | valor
 * ------------- | ---------- | -------------------------
 * uuid-123      | usuario    | hp_user_centro
 * uuid-123      | senha      | [hash_criptografado]
 * uuid-123      | ambiente   | producao
 * uuid-123      | url_wsdl   | https://api.hp.com.br...
 * uuid-123      | timeout    | 30
 */
export class CreateIntegracoesConfiguracoesTable1763900100000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Criar tabela integracoes_configuracoes
    await queryRunner.createTable(
      new Table({
        name: 'integracoes_configuracoes',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v4()',
          },
          {
            name: 'integracao_id',
            type: 'uuid',
            comment: 'FK para integracoes.id',
          },
          {
            name: 'chave',
            type: 'varchar',
            length: '100',
            comment: 'Chave da configuração (ex: usuario, senha, ambiente)',
          },
          {
            name: 'valor',
            type: 'text',
            comment: 'Valor da configuração',
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
            name: 'fk_integracoes_configuracoes_integracao',
            columnNames: ['integracao_id'],
            referencedTableName: 'integracoes',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
      }),
      true,
    );

    // Criar índices
    await queryRunner.createIndex(
      'integracoes_configuracoes',
      new TableIndex({
        name: 'idx_integracoes_configuracoes_integracao_id',
        columnNames: ['integracao_id'],
      }),
    );

    await queryRunner.createIndex(
      'integracoes_configuracoes',
      new TableIndex({
        name: 'idx_integracoes_configuracoes_chave',
        columnNames: ['chave'],
      }),
    );

    await queryRunner.createIndex(
      'integracoes_configuracoes',
      new TableIndex({
        name: 'idx_integracoes_configuracoes_integracao_chave',
        columnNames: ['integracao_id', 'chave'],
        isUnique: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remover índices
    await queryRunner.dropIndex(
      'integracoes_configuracoes',
      'idx_integracoes_configuracoes_integracao_chave',
    );
    await queryRunner.dropIndex(
      'integracoes_configuracoes',
      'idx_integracoes_configuracoes_chave',
    );
    await queryRunner.dropIndex(
      'integracoes_configuracoes',
      'idx_integracoes_configuracoes_integracao_id',
    );

    // Remover tabela
    await queryRunner.dropTable('integracoes_configuracoes');
  }
}
