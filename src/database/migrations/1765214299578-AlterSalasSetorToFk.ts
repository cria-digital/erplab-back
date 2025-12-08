import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterSalasSetorToFk1765214299578 implements MigrationInterface {
  name = 'AlterSalasSetorToFk1765214299578';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Adicionar coluna setor_id como nullable inicialmente
    await queryRunner.query(`
      ALTER TABLE "salas"
      ADD COLUMN "setor_id" uuid
    `);

    // 2. Migrar dados existentes: buscar ou criar alternativa de setor correspondente
    // Primeiro, garantir que o campo de formulário 'setor' existe
    await queryRunner.query(`
      INSERT INTO "campos_formulario" ("id", "nome_campo", "descricao", "ativo", "created_at", "updated_at")
      SELECT
        uuid_generate_v4(),
        'setor',
        'Setores disponíveis para salas',
        true,
        NOW(),
        NOW()
      WHERE NOT EXISTS (
        SELECT 1 FROM "campos_formulario" WHERE "nome_campo" = 'setor'
      )
    `);

    // 3. Obter o ID do campo de formulário 'setor'
    const campoSetor = await queryRunner.query(`
      SELECT id FROM "campos_formulario" WHERE "nome_campo" = 'setor'
    `);

    if (campoSetor && campoSetor.length > 0) {
      const campoSetorId = campoSetor[0].id;

      // 4. Para cada valor único de setor nas salas, criar uma alternativa se não existir
      const setoresUnicos = await queryRunner.query(`
        SELECT DISTINCT setor FROM "salas" WHERE setor IS NOT NULL AND setor != ''
      `);

      for (const row of setoresUnicos) {
        const textoSetor = row.setor;

        // Verificar se alternativa já existe
        const alternativaExistente = await queryRunner.query(
          `
          SELECT id FROM "alternativas_campo_formulario"
          WHERE "campo_formulario_id" = $1 AND "texto_alternativa" = $2
        `,
          [campoSetorId, textoSetor],
        );

        if (alternativaExistente.length === 0) {
          // Criar nova alternativa
          await queryRunner.query(
            `
            INSERT INTO "alternativas_campo_formulario"
            ("id", "campo_formulario_id", "texto_alternativa", "ordem", "ativo", "created_at", "updated_at")
            VALUES (uuid_generate_v4(), $1, $2, 0, true, NOW(), NOW())
          `,
            [campoSetorId, textoSetor],
          );
        }
      }

      // 5. Atualizar setor_id nas salas baseado no texto do setor
      await queryRunner.query(
        `
        UPDATE "salas" s
        SET "setor_id" = a.id
        FROM "alternativas_campo_formulario" a
        WHERE a."campo_formulario_id" = $1
          AND a."texto_alternativa" = s.setor
          AND s.setor IS NOT NULL
          AND s.setor != ''
      `,
        [campoSetorId],
      );
    }

    // 6. Remover a coluna antiga setor (varchar)
    await queryRunner.query(`
      ALTER TABLE "salas" DROP COLUMN IF EXISTS "setor"
    `);

    // 7. Tornar setor_id NOT NULL (se houver dados)
    // Primeiro verificar se há salas com setor_id null
    const salasComSetorNull = await queryRunner.query(`
      SELECT COUNT(*) as count FROM "salas" WHERE "setor_id" IS NULL
    `);

    if (parseInt(salasComSetorNull[0].count) === 0) {
      await queryRunner.query(`
        ALTER TABLE "salas" ALTER COLUMN "setor_id" SET NOT NULL
      `);
    }

    // 8. Adicionar FK constraint
    await queryRunner.query(`
      ALTER TABLE "salas"
      ADD CONSTRAINT "FK_salas_setor_id"
      FOREIGN KEY ("setor_id")
      REFERENCES "alternativas_campo_formulario"("id")
      ON DELETE RESTRICT ON UPDATE CASCADE
    `);

    // 9. Criar índice para setor_id
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_salas_setor_id" ON "salas" ("setor_id")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // 1. Remover FK constraint
    await queryRunner.query(`
      ALTER TABLE "salas" DROP CONSTRAINT IF EXISTS "FK_salas_setor_id"
    `);

    // 2. Remover índice
    await queryRunner.query(`
      DROP INDEX IF EXISTS "IDX_salas_setor_id"
    `);

    // 3. Adicionar coluna setor (varchar) de volta
    await queryRunner.query(`
      ALTER TABLE "salas" ADD COLUMN "setor" varchar(100)
    `);

    // 4. Migrar dados de volta: pegar texto_alternativa e colocar em setor
    await queryRunner.query(`
      UPDATE "salas" s
      SET "setor" = a."texto_alternativa"
      FROM "alternativas_campo_formulario" a
      WHERE s."setor_id" = a.id
    `);

    // 5. Remover coluna setor_id
    await queryRunner.query(`
      ALTER TABLE "salas" DROP COLUMN IF EXISTS "setor_id"
    `);
  }
}
