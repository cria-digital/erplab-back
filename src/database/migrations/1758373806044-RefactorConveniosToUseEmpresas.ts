import { MigrationInterface, QueryRunner } from 'typeorm';

export class RefactorConveniosToUseEmpresas1758373806044
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Adicionar coluna empresa_id na tabela convenios (temporariamente nullable)
    await queryRunner.query(`
      ALTER TABLE "convenios"
      ADD COLUMN "empresa_id" uuid
    `);

    // 2. Migrar dados existentes de convenios para empresas
    const convenios = await queryRunner.query(`
      SELECT * FROM "convenios"
    `);

    for (const convenio of convenios) {
      // Inserir na tabela empresas
      const result = await queryRunner.query(
        `
        INSERT INTO "empresas" (
          "id",
          "tipoEmpresa",
          "codigoInterno",
          "cnpj",
          "razaoSocial",
          "nomeFantasia",
          "inscricaoEstadual",
          "inscricaoMunicipal",
          "telefoneFixo",
          "celular",
          "emailComercial",
          "siteEmpresa",
          "cep",
          "rua",
          "numero",
          "bairro",
          "complemento",
          "estado",
          "cidade",
          "banco",
          "agencia",
          "contaCorrente",
          "formaPagamento",
          "ativo",
          "criadoEm",
          "atualizadoEm"
        ) VALUES (
          uuid_generate_v4(),
          'CONVENIOS',
          $1,
          $2,
          $3,
          $4,
          $5,
          $6,
          $7,
          $8,
          $9,
          $10,
          $11,
          $12,
          $13,
          $14,
          $15,
          $16,
          $17,
          $18,
          $19,
          $20,
          $21,
          $22,
          $23,
          $24
        ) RETURNING id
      `,
        [
          convenio.codigo,
          convenio.cnpj,
          convenio.razao_social,
          convenio.nome_fantasia,
          convenio.inscricao_estadual,
          convenio.inscricao_municipal,
          convenio.telefone_principal,
          convenio.telefone_secundario,
          convenio.email_principal,
          convenio.website,
          convenio.cep,
          convenio.endereco,
          convenio.numero,
          convenio.bairro,
          convenio.complemento,
          convenio.uf,
          convenio.cidade,
          convenio.banco,
          convenio.agencia,
          convenio.conta,
          convenio.forma_pagamento,
          convenio.ativo,
          convenio.created_at,
          convenio.updated_at,
        ],
      );

      // Atualizar convenio com empresa_id
      await queryRunner.query(
        `
        UPDATE "convenios"
        SET "empresa_id" = $1
        WHERE "id" = $2
      `,
        [result[0].id, convenio.id],
      );
    }

    // 3. Adicionar novas colunas específicas de convênio
    await queryRunner.query(`
      ALTER TABLE "convenios"
      ADD COLUMN IF NOT EXISTS "codigo_convenio" varchar(20),
      ADD COLUMN IF NOT EXISTS "requer_autorizacao" boolean DEFAULT true,
      ADD COLUMN IF NOT EXISTS "aceita_atendimento_online" boolean DEFAULT false,
      ADD COLUMN IF NOT EXISTS "percentual_coparticipacao" decimal(5,2),
      ADD COLUMN IF NOT EXISTS "valor_consulta" decimal(10,2),
      ADD COLUMN IF NOT EXISTS "observacoes_convenio" text
    `);

    // 4. Copiar dados para novas colunas
    await queryRunner.query(`
      UPDATE "convenios"
      SET "codigo_convenio" = "codigo",
          "observacoes_convenio" = "observacoes"
    `);

    // 5. Remover colunas antigas (que agora estão em empresas)
    await queryRunner.query(`
      ALTER TABLE "convenios"
      DROP COLUMN IF EXISTS "codigo",
      DROP COLUMN IF EXISTS "razao_social",
      DROP COLUMN IF EXISTS "nome_fantasia",
      DROP COLUMN IF EXISTS "cnpj",
      DROP COLUMN IF EXISTS "inscricao_estadual",
      DROP COLUMN IF EXISTS "inscricao_municipal",
      DROP COLUMN IF EXISTS "endereco",
      DROP COLUMN IF EXISTS "numero",
      DROP COLUMN IF EXISTS "complemento",
      DROP COLUMN IF EXISTS "bairro",
      DROP COLUMN IF EXISTS "cidade",
      DROP COLUMN IF EXISTS "uf",
      DROP COLUMN IF EXISTS "cep",
      DROP COLUMN IF EXISTS "telefone_principal",
      DROP COLUMN IF EXISTS "telefone_secundario",
      DROP COLUMN IF EXISTS "email_principal",
      DROP COLUMN IF EXISTS "website",
      DROP COLUMN IF EXISTS "forma_pagamento",
      DROP COLUMN IF EXISTS "banco",
      DROP COLUMN IF EXISTS "agencia",
      DROP COLUMN IF EXISTS "conta",
      DROP COLUMN IF EXISTS "observacoes",
      DROP COLUMN IF EXISTS "ativo"
    `);

    // 6. Tornar empresa_id obrigatório e adicionar foreign key
    await queryRunner.query(`
      ALTER TABLE "convenios"
      ALTER COLUMN "empresa_id" SET NOT NULL
    `);

    await queryRunner.query(`
      ALTER TABLE "convenios"
      ADD CONSTRAINT "FK_convenios_empresa"
      FOREIGN KEY ("empresa_id")
      REFERENCES "empresas"("id")
      ON DELETE CASCADE
    `);

    // 7. Adicionar unique constraint na empresa_id
    await queryRunner.query(`
      ALTER TABLE "convenios"
      ADD CONSTRAINT "UQ_convenios_empresa_id"
      UNIQUE ("empresa_id")
    `);

    // 8. Adicionar unique constraint no codigo_convenio
    await queryRunner.query(`
      ALTER TABLE "convenios"
      ADD CONSTRAINT "UQ_convenios_codigo"
      UNIQUE ("codigo_convenio")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // 1. Remover constraints
    await queryRunner.query(`
      ALTER TABLE "convenios"
      DROP CONSTRAINT IF EXISTS "FK_convenios_empresa",
      DROP CONSTRAINT IF EXISTS "UQ_convenios_empresa_id",
      DROP CONSTRAINT IF EXISTS "UQ_convenios_codigo"
    `);

    // 2. Adicionar colunas antigas de volta
    await queryRunner.query(`
      ALTER TABLE "convenios"
      ADD COLUMN "codigo" varchar(20),
      ADD COLUMN "razao_social" varchar(255),
      ADD COLUMN "nome_fantasia" varchar(255),
      ADD COLUMN "cnpj" varchar(14),
      ADD COLUMN "inscricao_estadual" varchar(20),
      ADD COLUMN "inscricao_municipal" varchar(20),
      ADD COLUMN "endereco" varchar(255),
      ADD COLUMN "numero" varchar(10),
      ADD COLUMN "complemento" varchar(100),
      ADD COLUMN "bairro" varchar(100),
      ADD COLUMN "cidade" varchar(100),
      ADD COLUMN "uf" char(2),
      ADD COLUMN "cep" varchar(8),
      ADD COLUMN "telefone_principal" varchar(20),
      ADD COLUMN "telefone_secundario" varchar(20),
      ADD COLUMN "email_principal" varchar(255),
      ADD COLUMN "website" varchar(255),
      ADD COLUMN "forma_pagamento" varchar(50),
      ADD COLUMN "banco" varchar(100),
      ADD COLUMN "agencia" varchar(20),
      ADD COLUMN "conta" varchar(20),
      ADD COLUMN "observacoes" text,
      ADD COLUMN "ativo" boolean DEFAULT true
    `);

    // 3. Migrar dados de volta de empresas para convenios
    const convenios = await queryRunner.query(`
      SELECT c.*, e.*
      FROM "convenios" c
      JOIN "empresas" e ON c.empresa_id = e.id
    `);

    for (const convenio of convenios) {
      await queryRunner.query(
        `
        UPDATE "convenios"
        SET
          "codigo" = $1,
          "razao_social" = $2,
          "nome_fantasia" = $3,
          "cnpj" = $4,
          "inscricao_estadual" = $5,
          "inscricao_municipal" = $6,
          "endereco" = $7,
          "numero" = $8,
          "complemento" = $9,
          "bairro" = $10,
          "cidade" = $11,
          "uf" = $12,
          "cep" = $13,
          "telefone_principal" = $14,
          "telefone_secundario" = $15,
          "email_principal" = $16,
          "website" = $17,
          "forma_pagamento" = $18,
          "banco" = $19,
          "agencia" = $20,
          "conta" = $21,
          "observacoes" = $22,
          "ativo" = $23
        WHERE "id" = $24
      `,
        [
          convenio.codigoInterno,
          convenio.razaoSocial,
          convenio.nomeFantasia,
          convenio.cnpj,
          convenio.inscricaoEstadual,
          convenio.inscricaoMunicipal,
          convenio.rua,
          convenio.numero,
          convenio.complemento,
          convenio.bairro,
          convenio.cidade,
          convenio.estado,
          convenio.cep,
          convenio.telefoneFixo,
          convenio.celular,
          convenio.emailComercial,
          convenio.siteEmpresa,
          convenio.formaPagamento,
          convenio.banco,
          convenio.agencia,
          convenio.contaCorrente,
          convenio.observacoes_convenio,
          convenio.ativo,
          convenio.id,
        ],
      );

      // Deletar empresa associada
      await queryRunner.query(
        `
        DELETE FROM "empresas" WHERE "id" = $1
      `,
        [convenio.empresa_id],
      );
    }

    // 4. Remover colunas novas
    await queryRunner.query(`
      ALTER TABLE "convenios"
      DROP COLUMN IF EXISTS "empresa_id",
      DROP COLUMN IF EXISTS "codigo_convenio",
      DROP COLUMN IF EXISTS "requer_autorizacao",
      DROP COLUMN IF EXISTS "aceita_atendimento_online",
      DROP COLUMN IF EXISTS "percentual_coparticipacao",
      DROP COLUMN IF EXISTS "valor_consulta",
      DROP COLUMN IF EXISTS "observacoes_convenio"
    `);

    // 5. Adicionar constraints antigas
    await queryRunner.query(`
      ALTER TABLE "convenios"
      ADD CONSTRAINT "UQ_convenios_codigo_old" UNIQUE ("codigo"),
      ADD CONSTRAINT "UQ_convenios_cnpj_old" UNIQUE ("cnpj")
    `);
  }
}
