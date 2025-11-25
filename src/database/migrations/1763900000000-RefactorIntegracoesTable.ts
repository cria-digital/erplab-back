import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableIndex,
} from 'typeorm';

/**
 * Migration: RefactorIntegracoesTable
 *
 * Refatora completamente a tabela integracoes para o novo sistema de schemas dinâmicos:
 *
 * REMOVE (~30 campos antigos):
 * - Campos específicos por tipo: nome_laboratorio, nome_banco, nome_prefeitura, etc
 * - URLs hardcoded: url_api_exames, url_base, url_autenticacao, etc
 * - Credenciais hardcoded: usuario, senha, token_autenticacao, chave_api, etc
 * - Certificados: certificado_digital, senha_certificado
 * - Campos JSONB: configuracoes_adicionais, headers_customizados, parametros_conexao
 * - Enums antigos: tipo_integracao, padrao_comunicacao, formato_retorno
 * - Campos de controle excessivos: timeout_segundos, intervalo_sincronizacao, limite_requisicoes, etc
 *
 * ADICIONA (3 campos novos):
 * - template_slug: Referência ao schema no código
 * - nome_instancia: Nome descritivo da instância
 * - tipos_contexto: Array de contextos (permite múltiplos tipos)
 *
 * MANTÉM (campos úteis):
 * - id, codigo_identificacao, descricao
 * - unidade_saude_id, empresa_id
 * - status, ativo
 * - Campos de monitoramento: ultima_sincronizacao, tentativas_falhas, ultimo_erro
 * - Auditoria: created_at, updated_at, created_by, updated_by
 */
export class RefactorIntegracoesTable1763900000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // ==========================================
    // PARTE 1: REMOVER CAMPOS ANTIGOS
    // ==========================================

    // Remover campos específicos por tipo
    await queryRunner.dropColumn('integracoes', 'nome_integracao');
    await queryRunner.dropColumn('integracoes', 'nome_laboratorio');
    await queryRunner.dropColumn('integracoes', 'nome_prefeitura');
    await queryRunner.dropColumn('integracoes', 'nome_banco');
    await queryRunner.dropColumn('integracoes', 'nome_gateway');
    await queryRunner.dropColumn('integracoes', 'nome_convenio');
    await queryRunner.dropColumn('integracoes', 'nome_adquirente');
    await queryRunner.dropColumn('integracoes', 'nome_concessionaria');

    // Remover URLs hardcoded
    await queryRunner.dropColumn('integracoes', 'url_api_exames');
    await queryRunner.dropColumn('integracoes', 'url_api_guia_exames');
    await queryRunner.dropColumn('integracoes', 'url_base');
    await queryRunner.dropColumn('integracoes', 'url_autenticacao');
    await queryRunner.dropColumn('integracoes', 'url_consulta');
    await queryRunner.dropColumn('integracoes', 'url_envio');
    await queryRunner.dropColumn('integracoes', 'url_callback');

    // Remover credenciais hardcoded
    await queryRunner.dropColumn('integracoes', 'usuario');
    await queryRunner.dropColumn('integracoes', 'senha');
    await queryRunner.dropColumn('integracoes', 'token_autenticacao');
    await queryRunner.dropColumn('integracoes', 'chave_api');
    await queryRunner.dropColumn('integracoes', 'certificado_digital');
    await queryRunner.dropColumn('integracoes', 'senha_certificado');

    // Remover JSONBs (serão substituídos por key-value)
    await queryRunner.dropColumn('integracoes', 'configuracoes_adicionais');
    await queryRunner.dropColumn('integracoes', 'headers_customizados');
    await queryRunner.dropColumn('integracoes', 'parametros_conexao');

    // Remover campos de controle excessivos
    await queryRunner.dropColumn('integracoes', 'descricao_api');
    await queryRunner.dropColumn('integracoes', 'timeout_segundos');
    await queryRunner.dropColumn(
      'integracoes',
      'intervalo_sincronizacao_minutos',
    );
    await queryRunner.dropColumn('integracoes', 'limite_requisicoes_dia');
    await queryRunner.dropColumn('integracoes', 'requisicoes_hoje');
    await queryRunner.dropColumn('integracoes', 'data_reset_contador');
    await queryRunner.dropColumn('integracoes', 'ultima_tentativa');

    // Remover índice composto antigo
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_31f9e7b77d84db8376b81c265b"`,
    );

    // Remover campos com enums antigos (vamos dropar os enums depois)
    await queryRunner.dropColumn('integracoes', 'tipo_integracao');
    await queryRunner.dropColumn('integracoes', 'padrao_comunicacao');
    await queryRunner.dropColumn('integracoes', 'formato_retorno');

    // ==========================================
    // PARTE 2: ADICIONAR CAMPOS NOVOS
    // ==========================================

    // Adicionar template_slug
    await queryRunner.addColumn(
      'integracoes',
      new TableColumn({
        name: 'template_slug',
        type: 'varchar',
        length: '100',
        isNullable: false,
        comment: 'Slug do schema no código (ex: hermes-pardini)',
      }),
    );

    // Adicionar nome_instancia
    await queryRunner.addColumn(
      'integracoes',
      new TableColumn({
        name: 'nome_instancia',
        type: 'varchar',
        length: '255',
        isNullable: false,
        comment: 'Nome descritivo desta instância',
      }),
    );

    // Renomear observacoes para descricao (mais claro)
    await queryRunner.renameColumn('integracoes', 'observacoes', 'descricao');

    // Mudar tipo de descricao para TEXT
    await queryRunner.changeColumn(
      'integracoes',
      'descricao',
      new TableColumn({
        name: 'descricao',
        type: 'text',
        isNullable: true,
        comment: 'Descrição adicional da integração',
      }),
    );

    // Adicionar tipos_contexto (array de text)
    await queryRunner.addColumn(
      'integracoes',
      new TableColumn({
        name: 'tipos_contexto',
        type: 'text',
        isArray: true,
        isNullable: false,
        comment: 'Contextos onde a integração está disponível',
      }),
    );

    // ==========================================
    // PARTE 3: CRIAR ÍNDICES
    // ==========================================

    await queryRunner.createIndex(
      'integracoes',
      new TableIndex({
        name: 'idx_integracoes_template_slug',
        columnNames: ['template_slug'],
      }),
    );

    await queryRunner.createIndex(
      'integracoes',
      new TableIndex({
        name: 'idx_integracoes_unidade_saude_id',
        columnNames: ['unidade_saude_id'],
      }),
    );

    await queryRunner.createIndex(
      'integracoes',
      new TableIndex({
        name: 'idx_integracoes_codigo_identificacao',
        columnNames: ['codigo_identificacao'],
      }),
    );

    // Criar índice GIN para busca no array tipos_contexto
    await queryRunner.query(`
      CREATE INDEX idx_integracoes_tipos_contexto
      ON integracoes USING GIN (tipos_contexto);
    `);

    // ==========================================
    // PARTE 4: LIMPAR ENUMS ANTIGOS
    // ==========================================

    await queryRunner.query(
      `DROP TYPE IF EXISTS "public"."integracoes_tipo_integracao_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE IF EXISTS "public"."integracoes_padrao_comunicacao_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE IF EXISTS "public"."integracoes_formato_retorno_enum"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Recriar enums antigos
    await queryRunner.query(
      `CREATE TYPE "public"."integracoes_tipo_integracao_enum" AS ENUM('laboratorio_apoio', 'telemedicina', 'gateway_pagamento', 'banco', 'prefeitura_nfse', 'sefaz', 'receita_federal', 'power_bi', 'pabx', 'correios', 'ocr', 'convenios', 'adquirentes', 'pacs', 'email', 'whatsapp', 'concessionarias', 'outros')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."integracoes_padrao_comunicacao_enum" AS ENUM('rest_api', 'soap', 'graphql', 'webhook', 'ftp', 'sftp', 'email', 'database', 'file', 'manual')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."integracoes_formato_retorno_enum" AS ENUM('json', 'xml', 'csv', 'txt', 'pdf', 'html', 'binary')`,
    );

    // Remover índices novos
    await queryRunner.query(
      'DROP INDEX IF EXISTS idx_integracoes_tipos_contexto',
    );
    await queryRunner.dropIndex(
      'integracoes',
      'idx_integracoes_codigo_identificacao',
    );
    await queryRunner.dropIndex(
      'integracoes',
      'idx_integracoes_unidade_saude_id',
    );
    await queryRunner.dropIndex('integracoes', 'idx_integracoes_template_slug');

    // Remover campos novos
    await queryRunner.dropColumn('integracoes', 'tipos_contexto');
    await queryRunner.renameColumn('integracoes', 'descricao', 'observacoes');
    await queryRunner.dropColumn('integracoes', 'nome_instancia');
    await queryRunner.dropColumn('integracoes', 'template_slug');

    // Recriar campos antigos (estrutura básica - dados serão perdidos)
    await queryRunner.addColumn(
      'integracoes',
      new TableColumn({
        name: 'tipo_integracao',
        type: 'enum',
        enum: [
          'laboratorio_apoio',
          'telemedicina',
          'gateway_pagamento',
          'banco',
          'prefeitura_nfse',
          'sefaz',
          'receita_federal',
          'power_bi',
          'pabx',
          'correios',
          'ocr',
          'convenios',
          'adquirentes',
          'pacs',
          'email',
          'whatsapp',
          'concessionarias',
          'outros',
        ],
        isNullable: false,
        default: "'outros'",
      }),
    );

    await queryRunner.addColumn(
      'integracoes',
      new TableColumn({
        name: 'nome_integracao',
        type: 'varchar',
        length: '100',
        isNullable: false,
        default: "''",
      }),
    );

    // Adicionar outros campos críticos
    await queryRunner.addColumn(
      'integracoes',
      new TableColumn({
        name: 'padrao_comunicacao',
        type: 'enum',
        enum: [
          'rest_api',
          'soap',
          'graphql',
          'webhook',
          'ftp',
          'sftp',
          'email',
          'database',
          'file',
          'manual',
        ],
        isNullable: true,
      }),
    );

    // Nota: Rollback completo seria muito extenso, listando apenas os principais
    // Em produção, fazer backup antes de executar esta migration!
  }
}
