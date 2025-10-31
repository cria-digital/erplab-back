import { MigrationInterface, QueryRunner } from 'typeorm';

export class MigrarDadosBancariosParaContasBancarias1761869981382
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Migrar dados de dados_bancarios para contas_bancarias + contas_bancarias_unidades
    await queryRunner.query(`
      -- Inserir contas bancárias a partir dos dados_bancarios
      INSERT INTO contas_bancarias (
        id,
        banco_id,
        codigo_interno,
        nome_conta,
        tipo_conta,
        agencia,
        digito_agencia,
        numero_conta,
        digito_conta,
        titular,
        cpf_cnpj_titular,
        status,
        saldo_inicial,
        observacoes,
        created_at,
        updated_at
      )
      SELECT
        gen_random_uuid(),
        db.banco_id,
        COALESCE(us.codigo_interno, '') || '-CC-' || SUBSTRING(db.conta_corrente, 1, 10) as codigo_interno,
        COALESCE(us.nome_unidade, 'Conta') || ' - ' || SUBSTRING(db.agencia || db.conta_corrente, 1, 20) as nome_conta,
        (CASE
          WHEN UPPER(db.tipo_conta) = 'POUPANCA' THEN 'poupanca'
          ELSE 'corrente'
        END)::contas_bancarias_tipo_conta_enum as tipo_conta,
        db.agencia,
        db.digito_agencia,
        db.conta_corrente as numero_conta,
        db.digito_conta,
        COALESCE(us.razao_social, us.nome_unidade) as titular,
        us.cnpj as cpf_cnpj_titular,
        (CASE WHEN db.ativo = true THEN 'ativa' ELSE 'inativa' END)::contas_bancarias_status_enum as status,
        0.00 as saldo_inicial,
        CASE
          WHEN db.principal = true THEN 'Conta Principal. ' || COALESCE(db.observacoes, '')
          ELSE db.observacoes
        END as observacoes,
        db.created_at,
        db.updated_at
      FROM dados_bancarios db
      LEFT JOIN unidades_saude us ON us.id = db.unidade_saude_id
      ON CONFLICT (codigo_interno) DO NOTHING;
    `);

    // 2. Criar vínculos na tabela de junção contas_bancarias_unidades
    await queryRunner.query(`
      INSERT INTO contas_bancarias_unidades (
        id,
        conta_bancaria_id,
        unidade_saude_id,
        ativo,
        created_at
      )
      SELECT
        gen_random_uuid(),
        cb.id,
        db.unidade_saude_id,
        db.ativo,
        db.created_at
      FROM dados_bancarios db
      INNER JOIN unidades_saude us ON us.id = db.unidade_saude_id
      INNER JOIN contas_bancarias cb ON cb.codigo_interno = COALESCE(us.codigo_interno, '') || '-CC-' || SUBSTRING(db.conta_corrente, 1, 10)
      WHERE NOT EXISTS (
        SELECT 1 FROM contas_bancarias_unidades cbu
        WHERE cbu.conta_bancaria_id = cb.id
        AND cbu.unidade_saude_id = db.unidade_saude_id
      );
    `);

    // 3. Marcar tabela dados_bancarios como deprecated (adicionar comentário)
    await queryRunner.query(`
      COMMENT ON TABLE dados_bancarios IS 'DEPRECATED: Use contas_bancarias + contas_bancarias_unidades. Esta tabela será removida em versões futuras.';
    `);

    // 4. Opcional: Desativar todos os registros de dados_bancarios (mantém dados para rollback)
    await queryRunner.query(`
      UPDATE dados_bancarios SET ativo = false;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // 1. Reativar dados_bancarios que têm vínculos ativos
    await queryRunner.query(`
      UPDATE dados_bancarios SET ativo = true WHERE id IN (
        SELECT DISTINCT db.id FROM dados_bancarios db
        INNER JOIN unidades_saude us ON us.id = db.unidade_saude_id
        INNER JOIN contas_bancarias cb ON cb.codigo_interno = COALESCE(us.codigo_interno, '') || '-CC-' || SUBSTRING(db.conta_corrente, 1, 10)
        INNER JOIN contas_bancarias_unidades cbu ON cbu.conta_bancaria_id = cb.id
        WHERE cbu.ativo = true
      );
    `);

    // 2. Remover comentário de deprecation
    await queryRunner.query(`
      COMMENT ON TABLE dados_bancarios IS NULL;
    `);

    // 3. Remover vínculos criados pela migration
    await queryRunner.query(`
      DELETE FROM contas_bancarias_unidades
      WHERE conta_bancaria_id IN (
        SELECT cb.id FROM contas_bancarias cb
        WHERE cb.codigo_interno LIKE '%-CC-%'
      );
    `);

    // 4. Remover contas bancárias criadas pela migration
    await queryRunner.query(`
      DELETE FROM contas_bancarias
      WHERE codigo_interno LIKE '%-CC-%';
    `);
  }
}
