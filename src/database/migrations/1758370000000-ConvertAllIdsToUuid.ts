import { MigrationInterface, QueryRunner } from 'typeorm';

export class ConvertAllIdsToUuid1758370000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // IMPORTANTE: Esta migration converte todos os IDs de INT para UUID
    // Isso é uma mudança DESTRUTIVA que requer backup do banco antes de executar

    // 1. Primeiro vamos adicionar colunas UUID temporárias em todas as tabelas

    // PACIENTES
    await queryRunner.query(
      `ALTER TABLE pacientes ADD COLUMN id_uuid UUID DEFAULT uuid_generate_v4()`,
    );

    // MÓDULO EXAMES - Tabelas principais
    await queryRunner.query(
      `ALTER TABLE exames ADD COLUMN id_uuid UUID DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE tipos_exame ADD COLUMN id_uuid UUID DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE laboratorios_apoio ADD COLUMN id_uuid UUID DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE subgrupos_exame ADD COLUMN id_uuid UUID DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE setores_exame ADD COLUMN id_uuid UUID DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE ordens_servico ADD COLUMN id_uuid UUID DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE ordens_servico_exames ADD COLUMN id_uuid UUID DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE resultados_exames ADD COLUMN id_uuid UUID DEFAULT uuid_generate_v4()`,
    );

    // CONVENIOS
    await queryRunner.query(
      `ALTER TABLE convenios ADD COLUMN id_uuid UUID DEFAULT uuid_generate_v4()`,
    );

    // 2. Adicionar colunas UUID para as FKs

    // EXAMES - FKs
    await queryRunner.query(
      `ALTER TABLE exames ADD COLUMN tipo_exame_id_uuid UUID`,
    );
    await queryRunner.query(
      `ALTER TABLE exames ADD COLUMN subgrupo_id_uuid UUID`,
    );
    await queryRunner.query(`ALTER TABLE exames ADD COLUMN setor_id_uuid UUID`);
    await queryRunner.query(
      `ALTER TABLE exames ADD COLUMN laboratorio_apoio_id_uuid UUID`,
    );

    // ORDENS_SERVICO - FKs
    await queryRunner.query(
      `ALTER TABLE ordens_servico ADD COLUMN paciente_id_uuid UUID`,
    );
    await queryRunner.query(
      `ALTER TABLE ordens_servico ADD COLUMN convenio_id_uuid UUID`,
    );

    // ORDENS_SERVICO_EXAMES - FKs
    await queryRunner.query(
      `ALTER TABLE ordens_servico_exames ADD COLUMN ordem_servico_id_uuid UUID`,
    );
    await queryRunner.query(
      `ALTER TABLE ordens_servico_exames ADD COLUMN exame_id_uuid UUID`,
    );

    // RESULTADOS_EXAMES - FKs
    await queryRunner.query(
      `ALTER TABLE resultados_exames ADD COLUMN ordem_servico_exame_id_uuid UUID`,
    );
    await queryRunner.query(
      `ALTER TABLE resultados_exames ADD COLUMN laboratorio_id_uuid UUID`,
    );

    // KIT_EXAMES - Será criado depois com UUID nativo

    // 3. Popular as FKs UUID baseadas nos IDs INT existentes

    // Atualizar FKs em EXAMES
    await queryRunner.query(`
      UPDATE exames e
      SET tipo_exame_id_uuid = te.id_uuid
      FROM tipos_exame te
      WHERE e.tipo_exame_id = te.id
    `);

    await queryRunner.query(`
      UPDATE exames e
      SET subgrupo_id_uuid = sg.id_uuid
      FROM subgrupos_exame sg
      WHERE e.subgrupo_id = sg.id
    `);

    await queryRunner.query(`
      UPDATE exames e
      SET setor_id_uuid = se.id_uuid
      FROM setores_exame se
      WHERE e.setor_id = se.id
    `);

    await queryRunner.query(`
      UPDATE exames e
      SET laboratorio_apoio_id_uuid = la.id_uuid
      FROM laboratorios_apoio la
      WHERE e.laboratorio_apoio_id = la.id
    `);

    // Atualizar FKs em ORDENS_SERVICO
    await queryRunner.query(`
      UPDATE ordens_servico os
      SET paciente_id_uuid = p.id_uuid
      FROM pacientes p
      WHERE os.paciente_id = p.id
    `);

    // Atualizar convenio_id FK
    await queryRunner.query(`
      UPDATE ordens_servico os
      SET convenio_id_uuid = c.id_uuid
      FROM convenios c
      WHERE os.convenio_id = c.id
    `);

    // Atualizar FKs em ORDENS_SERVICO_EXAMES
    await queryRunner.query(`
      UPDATE ordens_servico_exames ose
      SET ordem_servico_id_uuid = os.id_uuid
      FROM ordens_servico os
      WHERE ose.ordem_servico_id = os.id
    `);

    await queryRunner.query(`
      UPDATE ordens_servico_exames ose
      SET exame_id_uuid = e.id_uuid
      FROM exames e
      WHERE ose.exame_id = e.id
    `);

    // Atualizar FKs em RESULTADOS_EXAMES
    await queryRunner.query(`
      UPDATE resultados_exames re
      SET ordem_servico_exame_id_uuid = ose.id_uuid
      FROM ordens_servico_exames ose
      WHERE re.ordem_servico_exame_id = ose.id
    `);

    // KIT_EXAMES - Será atualizado quando a tabela for criada

    // 4. Remover constraints de FK antigas

    // Exames
    await queryRunner.query(
      `ALTER TABLE exames DROP CONSTRAINT IF EXISTS FK_exame_tipo`,
    );
    await queryRunner.query(
      `ALTER TABLE exames DROP CONSTRAINT IF EXISTS FK_exame_subgrupo`,
    );
    await queryRunner.query(
      `ALTER TABLE exames DROP CONSTRAINT IF EXISTS FK_exame_setor`,
    );
    await queryRunner.query(
      `ALTER TABLE exames DROP CONSTRAINT IF EXISTS FK_exame_laboratorio`,
    );

    // Ordens Servico
    await queryRunner.query(
      `ALTER TABLE ordens_servico DROP CONSTRAINT IF EXISTS FK_ordem_paciente`,
    );
    await queryRunner.query(
      `ALTER TABLE ordens_servico DROP CONSTRAINT IF EXISTS FK_ordem_convenio`,
    );

    // Ordens Servico Exames
    await queryRunner.query(
      `ALTER TABLE ordens_servico_exames DROP CONSTRAINT IF EXISTS FK_ordem_exame_ordem`,
    );
    await queryRunner.query(
      `ALTER TABLE ordens_servico_exames DROP CONSTRAINT IF EXISTS FK_ordem_exame_exame`,
    );

    // Resultados Exames
    await queryRunner.query(
      `ALTER TABLE resultados_exames DROP CONSTRAINT IF EXISTS FK_resultado_ordem_exame`,
    );

    // Kit Exames
    // KIT_EXAMES - FK será criada com UUID nativo

    // 5. Remover PKs antigas

    await queryRunner.query(
      `ALTER TABLE pacientes DROP CONSTRAINT IF EXISTS pacientes_pkey`,
    );
    await queryRunner.query(
      `ALTER TABLE exames DROP CONSTRAINT IF EXISTS exames_pkey`,
    );
    await queryRunner.query(
      `ALTER TABLE tipos_exame DROP CONSTRAINT IF EXISTS tipos_exame_pkey`,
    );
    await queryRunner.query(
      `ALTER TABLE laboratorios_apoio DROP CONSTRAINT IF EXISTS laboratorios_apoio_pkey`,
    );
    await queryRunner.query(
      `ALTER TABLE subgrupos_exame DROP CONSTRAINT IF EXISTS subgrupos_exame_pkey`,
    );
    await queryRunner.query(
      `ALTER TABLE setores_exame DROP CONSTRAINT IF EXISTS setores_exame_pkey`,
    );
    await queryRunner.query(
      `ALTER TABLE ordens_servico DROP CONSTRAINT IF EXISTS ordens_servico_pkey`,
    );
    await queryRunner.query(
      `ALTER TABLE ordens_servico_exames DROP CONSTRAINT IF EXISTS ordens_servico_exames_pkey`,
    );
    await queryRunner.query(
      `ALTER TABLE resultados_exames DROP CONSTRAINT IF EXISTS resultados_exames_pkey`,
    );
    await queryRunner.query(
      `ALTER TABLE convenios DROP CONSTRAINT IF EXISTS convenios_pkey`,
    );

    // 6. Remover colunas INT antigas e renomear UUID para id

    // PACIENTES
    await queryRunner.query(`ALTER TABLE pacientes DROP COLUMN id CASCADE`);
    await queryRunner.query(
      `ALTER TABLE pacientes RENAME COLUMN id_uuid TO id`,
    );
    await queryRunner.query(`ALTER TABLE pacientes ADD PRIMARY KEY (id)`);

    // EXAMES
    await queryRunner.query(`ALTER TABLE exames DROP COLUMN id CASCADE`);
    await queryRunner.query(`ALTER TABLE exames RENAME COLUMN id_uuid TO id`);
    await queryRunner.query(`ALTER TABLE exames ADD PRIMARY KEY (id)`);

    await queryRunner.query(`ALTER TABLE exames DROP COLUMN tipo_exame_id`);
    await queryRunner.query(
      `ALTER TABLE exames RENAME COLUMN tipo_exame_id_uuid TO tipo_exame_id`,
    );

    await queryRunner.query(`ALTER TABLE exames DROP COLUMN subgrupo_id`);
    await queryRunner.query(
      `ALTER TABLE exames RENAME COLUMN subgrupo_id_uuid TO subgrupo_id`,
    );

    await queryRunner.query(`ALTER TABLE exames DROP COLUMN setor_id`);
    await queryRunner.query(
      `ALTER TABLE exames RENAME COLUMN setor_id_uuid TO setor_id`,
    );

    await queryRunner.query(
      `ALTER TABLE exames DROP COLUMN laboratorio_apoio_id`,
    );
    await queryRunner.query(
      `ALTER TABLE exames RENAME COLUMN laboratorio_apoio_id_uuid TO laboratorio_apoio_id`,
    );

    // TIPOS_EXAME
    await queryRunner.query(`ALTER TABLE tipos_exame DROP COLUMN id CASCADE`);
    await queryRunner.query(
      `ALTER TABLE tipos_exame RENAME COLUMN id_uuid TO id`,
    );
    await queryRunner.query(`ALTER TABLE tipos_exame ADD PRIMARY KEY (id)`);

    // LABORATORIOS_APOIO
    await queryRunner.query(
      `ALTER TABLE laboratorios_apoio DROP COLUMN id CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE laboratorios_apoio RENAME COLUMN id_uuid TO id`,
    );
    await queryRunner.query(
      `ALTER TABLE laboratorios_apoio ADD PRIMARY KEY (id)`,
    );

    // SUBGRUPOS_EXAME
    await queryRunner.query(
      `ALTER TABLE subgrupos_exame DROP COLUMN id CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE subgrupos_exame RENAME COLUMN id_uuid TO id`,
    );
    await queryRunner.query(`ALTER TABLE subgrupos_exame ADD PRIMARY KEY (id)`);

    // SETORES_EXAME
    await queryRunner.query(`ALTER TABLE setores_exame DROP COLUMN id CASCADE`);
    await queryRunner.query(
      `ALTER TABLE setores_exame RENAME COLUMN id_uuid TO id`,
    );
    await queryRunner.query(`ALTER TABLE setores_exame ADD PRIMARY KEY (id)`);

    // ORDENS_SERVICO
    await queryRunner.query(
      `ALTER TABLE ordens_servico DROP COLUMN id CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE ordens_servico RENAME COLUMN id_uuid TO id`,
    );
    await queryRunner.query(`ALTER TABLE ordens_servico ADD PRIMARY KEY (id)`);

    await queryRunner.query(
      `ALTER TABLE ordens_servico DROP COLUMN paciente_id`,
    );
    await queryRunner.query(
      `ALTER TABLE ordens_servico RENAME COLUMN paciente_id_uuid TO paciente_id`,
    );

    await queryRunner.query(
      `ALTER TABLE ordens_servico DROP COLUMN IF EXISTS convenio_id`,
    );
    await queryRunner.query(
      `ALTER TABLE ordens_servico RENAME COLUMN convenio_id_uuid TO convenio_id`,
    );

    // ORDENS_SERVICO_EXAMES
    await queryRunner.query(
      `ALTER TABLE ordens_servico_exames DROP COLUMN id CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE ordens_servico_exames RENAME COLUMN id_uuid TO id`,
    );
    await queryRunner.query(
      `ALTER TABLE ordens_servico_exames ADD PRIMARY KEY (id)`,
    );

    await queryRunner.query(
      `ALTER TABLE ordens_servico_exames DROP COLUMN ordem_servico_id`,
    );
    await queryRunner.query(
      `ALTER TABLE ordens_servico_exames RENAME COLUMN ordem_servico_id_uuid TO ordem_servico_id`,
    );

    await queryRunner.query(
      `ALTER TABLE ordens_servico_exames DROP COLUMN exame_id`,
    );
    await queryRunner.query(
      `ALTER TABLE ordens_servico_exames RENAME COLUMN exame_id_uuid TO exame_id`,
    );

    // RESULTADOS_EXAMES
    await queryRunner.query(
      `ALTER TABLE resultados_exames DROP COLUMN id CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE resultados_exames RENAME COLUMN id_uuid TO id`,
    );
    await queryRunner.query(
      `ALTER TABLE resultados_exames ADD PRIMARY KEY (id)`,
    );

    await queryRunner.query(
      `ALTER TABLE resultados_exames DROP COLUMN ordem_servico_exame_id`,
    );
    await queryRunner.query(
      `ALTER TABLE resultados_exames RENAME COLUMN ordem_servico_exame_id_uuid TO ordem_servico_exame_id`,
    );

    await queryRunner.query(
      `ALTER TABLE resultados_exames DROP COLUMN IF EXISTS laboratorio_id`,
    );
    await queryRunner.query(
      `ALTER TABLE resultados_exames RENAME COLUMN laboratorio_id_uuid TO laboratorio_id`,
    );

    // KIT_EXAMES - Colunas serão criadas com UUID nativo

    // CONVENIOS
    await queryRunner.query(`ALTER TABLE convenios DROP COLUMN id CASCADE`);
    await queryRunner.query(
      `ALTER TABLE convenios RENAME COLUMN id_uuid TO id`,
    );
    await queryRunner.query(`ALTER TABLE convenios ADD PRIMARY KEY (id)`);

    // 7. Recriar as FKs com UUID

    // Exames
    await queryRunner.query(`
      ALTER TABLE exames
      ADD CONSTRAINT FK_exame_tipo
      FOREIGN KEY (tipo_exame_id) REFERENCES tipos_exame(id) ON DELETE SET NULL
    `);

    await queryRunner.query(`
      ALTER TABLE exames
      ADD CONSTRAINT FK_exame_subgrupo
      FOREIGN KEY (subgrupo_id) REFERENCES subgrupos_exame(id) ON DELETE SET NULL
    `);

    await queryRunner.query(`
      ALTER TABLE exames
      ADD CONSTRAINT FK_exame_setor
      FOREIGN KEY (setor_id) REFERENCES setores_exame(id) ON DELETE SET NULL
    `);

    await queryRunner.query(`
      ALTER TABLE exames
      ADD CONSTRAINT FK_exame_laboratorio
      FOREIGN KEY (laboratorio_apoio_id) REFERENCES laboratorios_apoio(id) ON DELETE SET NULL
    `);

    // Ordens Servico
    await queryRunner.query(`
      ALTER TABLE ordens_servico
      ADD CONSTRAINT FK_ordem_paciente
      FOREIGN KEY (paciente_id) REFERENCES pacientes(id) ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE ordens_servico
      ADD CONSTRAINT FK_ordem_convenio
      FOREIGN KEY (convenio_id) REFERENCES convenios(id) ON DELETE SET NULL
    `);

    // Ordens Servico Exames
    await queryRunner.query(`
      ALTER TABLE ordens_servico_exames
      ADD CONSTRAINT FK_ordem_exame_ordem
      FOREIGN KEY (ordem_servico_id) REFERENCES ordens_servico(id) ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE ordens_servico_exames
      ADD CONSTRAINT FK_ordem_exame_exame
      FOREIGN KEY (exame_id) REFERENCES exames(id) ON DELETE CASCADE
    `);

    // Resultados Exames
    await queryRunner.query(`
      ALTER TABLE resultados_exames
      ADD CONSTRAINT FK_resultado_ordem_exame
      FOREIGN KEY (ordem_servico_exame_id) REFERENCES ordens_servico_exames(id) ON DELETE CASCADE
    `);

    // KIT_EXAMES - FKs serão criadas com UUID nativo

    // 8. Recriar índices se necessário
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_exames_codigo_interno ON exames(codigo_interno)`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_exames_nome ON exames(nome)`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_pacientes_cpf ON pacientes(cpf)`,
    );
  }

  public async down(): Promise<void> {
    // Esta migration não pode ser revertida facilmente devido à natureza destrutiva
    // Os IDs INT originais foram perdidos e não podem ser recuperados
    throw new Error(
      'Esta migration não pode ser revertida. Restaure o backup do banco de dados.',
    );
  }
}
