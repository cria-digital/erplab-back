import { MigrationInterface, QueryRunner, Table, Index } from "typeorm";

export class CreatePacientesTable1756931316461 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "pacientes",
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment"
                },
                {
                    name: "codigo_interno",
                    type: "varchar",
                    length: "20",
                    isUnique: true
                },
                {
                    name: "nome",
                    type: "varchar",
                    length: "255"
                },
                {
                    name: "nome_social",
                    type: "varchar",
                    length: "255",
                    isNullable: true
                },
                {
                    name: "usar_nome_social",
                    type: "enum",
                    enum: ["nao_se_aplica", "sim", "nao"],
                    default: "'nao_se_aplica'"
                },
                {
                    name: "sexo",
                    type: "enum",
                    enum: ["M", "F", "O"]
                },
                {
                    name: "data_nascimento",
                    type: "date"
                },
                {
                    name: "nome_mae",
                    type: "varchar",
                    length: "255"
                },
                {
                    name: "prontuario",
                    type: "varchar",
                    length: "50",
                    isNullable: true
                },
                {
                    name: "rg",
                    type: "varchar",
                    length: "20"
                },
                {
                    name: "cpf",
                    type: "varchar",
                    length: "11"
                },
                {
                    name: "estado_civil",
                    type: "varchar",
                    length: "50"
                },
                {
                    name: "email",
                    type: "varchar",
                    length: "255"
                },
                {
                    name: "contatos",
                    type: "varchar",
                    length: "20"
                },
                {
                    name: "whatsapp",
                    type: "varchar",
                    length: "20",
                    isNullable: true
                },
                {
                    name: "profissao",
                    type: "varchar",
                    length: "100"
                },
                {
                    name: "observacao",
                    type: "text",
                    isNullable: true
                },
                {
                    name: "convenio_id",
                    type: "int",
                    isNullable: true
                },
                {
                    name: "plano",
                    type: "varchar",
                    length: "100",
                    isNullable: true
                },
                {
                    name: "validade",
                    type: "date",
                    isNullable: true
                },
                {
                    name: "matricula",
                    type: "varchar",
                    length: "50",
                    isNullable: true
                },
                {
                    name: "nome_titular",
                    type: "varchar",
                    length: "255",
                    isNullable: true
                },
                {
                    name: "cartao_sus",
                    type: "varchar",
                    length: "50",
                    isNullable: true
                },
                {
                    name: "cep",
                    type: "varchar",
                    length: "8"
                },
                {
                    name: "rua",
                    type: "varchar",
                    length: "255",
                    isNullable: true
                },
                {
                    name: "numero",
                    type: "varchar",
                    length: "20"
                },
                {
                    name: "bairro",
                    type: "varchar",
                    length: "100"
                },
                {
                    name: "complemento",
                    type: "varchar",
                    length: "100",
                    isNullable: true
                },
                {
                    name: "cidade",
                    type: "varchar",
                    length: "100"
                },
                {
                    name: "estado",
                    type: "varchar",
                    length: "2"
                },
                {
                    name: "foto_url",
                    type: "varchar",
                    length: "500",
                    isNullable: true
                },
                {
                    name: "status",
                    type: "enum",
                    enum: ["ativo", "inativo", "bloqueado"],
                    default: "'ativo'"
                },
                {
                    name: "empresa_id",
                    type: "int"
                },
                {
                    name: "criado_em",
                    type: "timestamp",
                    default: "CURRENT_TIMESTAMP"
                },
                {
                    name: "atualizado_em",
                    type: "timestamp",
                    default: "CURRENT_TIMESTAMP",
                    onUpdate: "CURRENT_TIMESTAMP"
                },
                {
                    name: "criado_por",
                    type: "int"
                },
                {
                    name: "atualizado_por",
                    type: "int"
                }
            ],
            indices: [
                new Index("IDX_PACIENTE_CPF_EMPRESA", ["cpf", "empresa_id"]),
                new Index("IDX_PACIENTE_NOME", ["nome"]),
                new Index("IDX_PACIENTE_STATUS", ["status"]),
                new Index("IDX_PACIENTE_EMPRESA", ["empresa_id"]),
                new Index("IDX_PACIENTE_EMAIL", ["email"]),
                new Index("IDX_PACIENTE_CONVENIO", ["convenio_id"])
            ]
        }), true);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("pacientes");
    }

}
