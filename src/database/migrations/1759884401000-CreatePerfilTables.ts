import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class CreatePerfilTables1759884401000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Criar tabela preferencias_usuario
    await queryRunner.createTable(
      new Table({
        name: 'preferencias_usuario',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'usuario_id',
            type: 'uuid',
            isUnique: true,
          },
          // Notificações
          {
            name: 'notificar_email',
            type: 'boolean',
            default: true,
          },
          {
            name: 'notificar_whatsapp',
            type: 'boolean',
            default: false,
          },
          {
            name: 'notificar_sms',
            type: 'boolean',
            default: false,
          },
          {
            name: 'notificar_sistema',
            type: 'boolean',
            default: true,
          },
          // Interface
          {
            name: 'tema',
            type: 'varchar',
            length: '20',
            default: "'claro'",
          },
          {
            name: 'idioma',
            type: 'varchar',
            length: '10',
            default: "'pt-BR'",
          },
          {
            name: 'timezone',
            type: 'varchar',
            length: '50',
            default: "'America/Sao_Paulo'",
          },
          // Privacidade
          {
            name: 'perfil_publico',
            type: 'boolean',
            default: false,
          },
          {
            name: 'mostrar_email',
            type: 'boolean',
            default: false,
          },
          {
            name: 'mostrar_telefone',
            type: 'boolean',
            default: false,
          },
          // Sessão
          {
            name: 'sessao_multipla',
            type: 'boolean',
            default: true,
          },
          {
            name: 'tempo_inatividade',
            type: 'int',
            default: 30,
          },
          // Outros
          {
            name: 'configuracoes_adicionais',
            type: 'jsonb',
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
      }),
      true,
    );

    // Criar Foreign Key para preferencias_usuario -> usuarios
    await queryRunner.createForeignKey(
      'preferencias_usuario',
      new TableForeignKey({
        name: 'fk_preferencias_usuario_usuario',
        columnNames: ['usuario_id'],
        referencedTableName: 'usuarios',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );

    // Criar índice em usuario_id
    await queryRunner.createIndex(
      'preferencias_usuario',
      new TableIndex({
        name: 'idx_preferencias_usuario_usuario_id',
        columnNames: ['usuario_id'],
      }),
    );

    // Criar tabela historico_senhas
    await queryRunner.createTable(
      new Table({
        name: 'historico_senhas',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'usuario_id',
            type: 'uuid',
          },
          {
            name: 'senha_hash',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'motivo_alteracao',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'ip_origem',
            type: 'varchar',
            length: '45',
            isNullable: true,
          },
          {
            name: 'user_agent',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'alterado_por_usuario_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'data_alteracao',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // Criar Foreign Key para historico_senhas -> usuarios (usuario_id)
    await queryRunner.createForeignKey(
      'historico_senhas',
      new TableForeignKey({
        name: 'fk_historico_senhas_usuario',
        columnNames: ['usuario_id'],
        referencedTableName: 'usuarios',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );

    // Criar Foreign Key para historico_senhas -> usuarios (alterado_por_usuario_id)
    await queryRunner.createForeignKey(
      'historico_senhas',
      new TableForeignKey({
        name: 'fk_historico_senhas_alterado_por',
        columnNames: ['alterado_por_usuario_id'],
        referencedTableName: 'usuarios',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );

    // Criar índices
    await queryRunner.createIndex(
      'historico_senhas',
      new TableIndex({
        name: 'idx_historico_senhas_usuario_id',
        columnNames: ['usuario_id'],
      }),
    );

    await queryRunner.createIndex(
      'historico_senhas',
      new TableIndex({
        name: 'idx_historico_senhas_data_alteracao',
        columnNames: ['data_alteracao'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remover tabela historico_senhas
    await queryRunner.dropTable('historico_senhas', true);

    // Remover tabela preferencias_usuario
    await queryRunner.dropTable('preferencias_usuario', true);
  }
}
