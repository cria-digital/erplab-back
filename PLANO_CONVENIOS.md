# 📋 PLANO DE CORREÇÃO: Módulo de Convênios

**Data:** 21/11/2025
**Responsável:** Claude + Diego (trabalho em 4 mãos)
**Objetivo:** Alinhar implementação backend com design do Figma
**Documento Base:** RELATORIO_EMPRESAS_FIGMA_VS_IMPLEMENTACAO.md

---

## 🎯 RESUMO EXECUTIVO

### Problema Atual

| Métrica | Valor | Status |
|---------|-------|--------|
| **Campos no Figma** | 28 | - |
| **Campos corretos** | 2 | 7% ❌ |
| **Campos faltando** | 26 | 93% ❌ |
| **Campos extras (a remover)** | 20 | - |
| **Abas não implementadas** | 3 | INTEGRAÇÃO, ATENDIMENTO, RESTRIÇÕES |
| **Abas implementadas** | 2 | ✅ PLANOS, INSTRUÇÕES |

### Complexidade Estimada

- **Esforço:** Alto (4-6 semanas)
- **Risco:** Alto (remoção de campos pode causar perda de dados)
- **Impacto:** Crítico (funcionalidade core do sistema)

---

## 📊 ANÁLISE DETALHADA

### Estrutura Atual da Tabela `convenios`

```typescript
// Campos CORRETOS (mantém)
✅ codigo_convenio: string (20)
✅ registro_ans: string (20)

// Campos PARCIALMENTE CORRETOS (ajustar)
⚠️ observacoes_convenio: text → renomear para observacoes_gerais?

// Campos EXTRAS (remover - 20 campos)
❌ tem_integracao_api: boolean
❌ url_api: string
❌ token_api: string
❌ requer_autorizacao: boolean
❌ requer_senha: boolean
❌ validade_guia_dias: number
❌ tipo_faturamento: enum
❌ portal_envio: string
❌ dia_fechamento: number
❌ prazo_pagamento_dias: number
❌ percentual_desconto: number
❌ tabela_precos: string
❌ telefone: string
❌ email: string
❌ contato_nome: string
❌ regras_especificas: json
❌ status: enum
❌ aceita_atendimento_online: boolean
❌ percentual_coparticipacao: number
❌ valor_consulta: number
```

### Campos Faltantes do Figma (26 campos)

#### Seção: Informações do Convênio

```typescript
// FALTANDO (13 campos)
matricula_digitos: number                // Dropdown: quantos dígitos tem a matrícula
tipo_convenio: enum                      // TipoConvenio (definir valores)
forma_liquidacao: enum                   // FormaLiquidacao (via fatura, via guia, etc)
valor_ch: decimal(10,2)                  // Valor da consulta/hora
valor_filme: decimal(10,2)               // Valor do filme
dia_vencimento: number                   // Dia do mês (1-31)
cnes_id: uuid                           // FK → tabela unidades_saude (CNES)
tiss: boolean                           // Usa padrão TISS?
versao_tiss: string                     // Ex: "3.05.00"
codigo_operadora_tiss: string           // Código na operadora TISS
codigo_operadora_autorizacao: string    // Código usado para autorização
codigo_prestador: string                // Código do prestador no convênio
```

#### Seção: Faturamento

```typescript
// FALTANDO (6 campos)
envio_faturamento: enum                 // Como enviar? (email, portal, físico, etc)
fatura_ate_dia: number                  // Faturar até dia X do mês
vencimento_fatura_dia: number           // Vencimento no dia X do mês
data_contrato: date                     // Data de assinatura do contrato
data_ultimo_ajuste: date                // Data do último reajuste de valores
instrucoes_faturamento: text            // Instruções específicas
```

#### Seção: Outras Informações

```typescript
// FALTANDO (7 campos)
tabela_servico_id: uuid                 // FK → tabela de serviços
tabela_base_id: uuid                    // FK → tabela base
tabela_material_id: uuid                // FK → tabela de materiais
co_participacao: boolean                // Tem co-participação?
nota_fiscal_exige_fatura: boolean       // Exige NF na fatura?
contato: string                         // Nome do contato
instrucoes: text                        // Instruções gerais
```

---

## 🚀 PLANO DE EXECUÇÃO

### ⚠️ REGRAS CRÍTICAS

> **ANTES de iniciar QUALQUER implementação:**
>
> 1. ❌ **NÃO criar migrations sem aprovação de Diego**
> 2. ❌ **NÃO remover campos sem backup e análise de dados**
> 3. ✅ **SEMPRE trabalhar em 4 mãos (Claude + Diego)**
> 4. ✅ **SEMPRE discutir modelagem antes de implementar**
> 5. ✅ **SEMPRE validar com Diego antes de executar migrations**

---

## 📅 FASE 1: PREPARAÇÃO (Prioridade P0)

### 1.1. Análise de Dados Existentes

**Objetivo:** Identificar quais campos extras estão sendo usados

**Tarefas:**
- [ ] Executar queries para verificar campos não-null
- [ ] Identificar registros que seriam afetados pela remoção
- [ ] Documentar uso de cada campo extra
- [ ] Apresentar relatório para Diego

**Queries de Análise:**

```sql
-- Verificar uso dos campos extras
SELECT
  COUNT(*) as total_convenios,
  COUNT(tem_integracao_api) as usa_integracao_api,
  COUNT(url_api) as usa_url_api,
  COUNT(token_api) as usa_token_api,
  COUNT(requer_autorizacao) as usa_requer_autorizacao,
  COUNT(telefone) as usa_telefone,
  COUNT(email) as usa_email,
  COUNT(contato_nome) as usa_contato_nome,
  COUNT(regras_especificas) as usa_regras_especificas
FROM convenios;

-- Identificar registros com dados nos campos extras
SELECT id, codigo_convenio, tem_integracao_api, url_api, telefone, email
FROM convenios
WHERE tem_integracao_api IS NOT NULL
   OR url_api IS NOT NULL
   OR token_api IS NOT NULL;
```

**Decisões Necessárias (Diego):**

1. Os campos extras contêm dados importantes?
2. Precisamos migrar esses dados para a nova estrutura?
3. Podemos criar campo `metadata_legado` (JSONB) para preservar?

---

### 1.2. Definição de Enums

**Objetivo:** Definir valores válidos para os campos enum

**Enums Necessários:**

```typescript
// Convênios - src/modules/relacionamento/convenios/enums/

export enum TipoConvenio {
  AMBULATORIAL = 'ambulatorial',
  HOSPITALAR = 'hospitalar',
  ODONTOLOGICO = 'odontologico',
  MISTO = 'misto',
  PARTICULAR = 'particular'
}

export enum FormaLiquidacao {
  VIA_FATURA = 'via_fatura',
  VIA_GUIA = 'via_guia',
  AUTOMATICA = 'automatica',
  MANUAL = 'manual'
}

export enum EnvioFaturamento {
  EMAIL = 'email',
  PORTAL = 'portal',
  FISICO = 'fisico',
  FTP = 'ftp',
  API = 'api'
}
```

**⚠️ VALIDAR COM DIEGO:** Os valores dos enums estão corretos?

---

### 1.3. Modelagem de Dados

**Objetivo:** Definir estrutura final das tabelas

#### Tabela: `convenios` (Versão Corrigida)

```sql
-- INFORMAÇÕES ESPECÍFICAS DO CONVÊNIO
convenios
├── id (uuid, PK)
├── empresa_id (uuid, FK → empresas.id, UNIQUE)
│
├── IDENTIFICAÇÃO
│   ├── codigo_convenio (varchar 20, UNIQUE) ✅ JÁ EXISTE
│   ├── registro_ans (varchar 20) ✅ JÁ EXISTE
│   ├── matricula_digitos (int) ⭐ NOVO
│   ├── tipo_convenio (enum TipoConvenio) ⭐ NOVO
│   └── forma_liquidacao (enum FormaLiquidacao) ⭐ NOVO
│
├── VALORES
│   ├── valor_ch (decimal 10,2) ⭐ NOVO
│   └── valor_filme (decimal 10,2) ⭐ NOVO
│
├── TISS
│   ├── tiss (boolean, default false) ⭐ NOVO
│   ├── versao_tiss (varchar 20) ⭐ NOVO
│   ├── codigo_operadora_tiss (varchar 50) ⭐ NOVO
│   ├── codigo_operadora_autorizacao (varchar 50) ⭐ NOVO
│   └── codigo_prestador (varchar 50) ⭐ NOVO
│
├── FATURAMENTO
│   ├── envio_faturamento (enum EnvioFaturamento) ⭐ NOVO
│   ├── fatura_ate_dia (int 1-31) ⭐ NOVO
│   ├── vencimento_fatura_dia (int 1-31) ⭐ NOVO
│   ├── dia_vencimento (int 1-31) ⭐ NOVO
│   ├── data_contrato (date) ⭐ NOVO
│   ├── data_ultimo_ajuste (date) ⭐ NOVO
│   └── instrucoes_faturamento (text) ⭐ NOVO
│
├── TABELAS
│   ├── tabela_servico_id (uuid, FK) ⭐ NOVO
│   ├── tabela_base_id (uuid, FK) ⭐ NOVO
│   ├── tabela_material_id (uuid, FK) ⭐ NOVO
│   └── cnes_id (uuid, FK → unidades_saude.id) ⭐ NOVO
│
├── CONFIGURAÇÕES
│   ├── co_participacao (boolean, default false) ⭐ NOVO
│   ├── nota_fiscal_exige_fatura (boolean, default false) ⭐ NOVO
│   ├── contato (varchar 255) ⭐ NOVO
│   ├── instrucoes (text) ⭐ NOVO
│   └── observacoes_gerais (text) ⚠️ RENOMEAR DE observacoes_convenio
│
└── CONTROLE
    ├── ativo (boolean, default true)
    ├── created_at (timestamp)
    └── updated_at (timestamp)

-- TOTAL: ~30 campos (26 novos + 4 existentes)
```

**⚠️ DECISÃO IMPORTANTE (Diego):**

As colunas `tabela_servico_id`, `tabela_base_id`, `tabela_material_id` devem referenciar qual tabela?
- Opção 1: Criar tabelas novas (`tabelas_precos`)
- Opção 2: Referenciar tabela existente
- Opção 3: Armazenar como string simples (código/nome)

---

#### Nova Tabela: `convenio_integracao`

```sql
-- ABA INTEGRAÇÃO (NÃO IMPLEMENTADA)
convenio_integracao
├── id (uuid, PK)
├── convenio_id (uuid, FK → convenios.id, UNIQUE)
│
├── URLS DE INTEGRAÇÃO (8 campos)
│   ├── url_elegibilidade (text)
│   ├── url_autenticacao (text)
│   ├── url_solicitacao_autorizacao (text)
│   ├── url_cancelamento (text)
│   ├── url_status_autorizacao (text)
│   ├── url_protocolo (text)
│   ├── url_lote_anexo (text)
│   └── url_comunicacao_beneficiario (text)
│
├── CONFIGURAÇÕES GERAIS
│   ├── ativar_comunicacao (boolean, default false)
│   ├── versao_tiss_integracao (varchar 20)
│   ├── criptografar_trilha (boolean, default false)
│   └── autorizador_padrao (varchar 100)
│
├── CREDENCIAIS
│   ├── cadastrar_credenciais (boolean, default false)
│   ├── utilizar_autenticacao (boolean, default false)
│   ├── tipo_autenticacao (varchar 50)
│   ├── usuario (varchar 100)
│   ├── senha (varchar 255) -- encrypted
│   ├── usuario_2 (varchar 100)
│   ├── senha_2 (varchar 255) -- encrypted
│   ├── criptografar_senha (boolean, default true)
│   └── chave_api (text)
│
├── CONFIGURAÇÕES AVANÇADAS
│   ├── utilizar_soap_action (boolean, default false)
│   ├── enviar_arquivo (boolean, default false)
│   └── certificado_serie (varchar 100)
│
└── CONTROLE
    ├── created_at (timestamp)
    └── updated_at (timestamp)

-- TOTAL: ~24 campos
```

---

#### Nova Tabela: `convenio_campos_obrigatorios`

```sql
-- ABA ATENDIMENTO (NÃO IMPLEMENTADA)
-- Sistema de configuração de campos obrigatórios/opcionais

convenio_campos_obrigatorios
├── id (uuid, PK)
├── convenio_id (uuid, FK → convenios.id)
├── categoria (enum) -- 'PACIENTE', 'ORDEM_SERVICO', 'TISS'
├── campo (varchar 100) -- nome técnico do campo
├── obrigatorio (boolean)
├── created_at (timestamp)
└── updated_at (timestamp)

-- Unique constraint: (convenio_id, categoria, campo)
```

**Exemplo de dados:**

```sql
-- Configuração para Convênio X
INSERT INTO convenio_campos_obrigatorios VALUES
  -- Categoria: PACIENTE
  ('uuid1', 'convenio-x-id', 'PACIENTE', 'cpf_proprio', false),
  ('uuid2', 'convenio-x-id', 'PACIENTE', 'acomodacao', false),
  ('uuid3', 'convenio-x-id', 'PACIENTE', 'bairro', true),
  ('uuid4', 'convenio-x-id', 'PACIENTE', 'cidade', true),
  ('uuid5', 'convenio-x-id', 'PACIENTE', 'endereco', true),
  ('uuid6', 'convenio-x-id', 'PACIENTE', 'nome_mae', true),

  -- Categoria: ORDEM_SERVICO
  ('uuid7', 'convenio-x-id', 'ORDEM_SERVICO', 'medico_requisitante', true),
  ('uuid8', 'convenio-x-id', 'ORDEM_SERVICO', 'especialidade', true),
  ('uuid9', 'convenio-x-id', 'ORDEM_SERVICO', 'cid', false),

  -- Categoria: TISS
  ('uuid10', 'convenio-x-id', 'TISS', 'regime_atendimento', false);
```

**⚠️ VALIDAR COM DIEGO:**
- Esta abordagem está correta?
- Preferência por tabela vs JSON na coluna?

---

#### Nova Tabela: `convenio_restricoes`

```sql
-- ABA RESTRIÇÕES (NÃO IMPLEMENTADA)
-- Sistema polimórfico de restrições

convenio_restricoes
├── id (uuid, PK)
├── convenio_id (uuid, FK → convenios.id)
├── tipo_restricao (enum) -- 'PLANO', 'MEDICO', 'ESPECIALIDADE', 'SETOR', 'EXAME'
│
├── REFERÊNCIAS POLIMÓRFICAS
│   ├── plano_id (uuid, FK → planos.id, nullable)
│   ├── medico_id (uuid, FK → profissionais.id, nullable)
│   ├── especialidade_id (uuid, FK → especialidades.id, nullable)
│   ├── setor_id (uuid, FK → setores.id, nullable)
│   └── exame_id (uuid, FK → exames.id, nullable)
│
├── CONFIGURAÇÕES DA RESTRIÇÃO
│   ├── descricao (text) -- descrição da restrição
│   └── ativo (boolean, default true)
│
└── CONTROLE
    ├── created_at (timestamp)
    └── updated_at (timestamp)

-- Constraints:
-- - Apenas um dos campos de referência pode estar preenchido
-- - CHECK: tipo_restricao corresponde ao campo preenchido
```

**⚠️ DECISÃO IMPORTANTE (Diego):**

Restrições: usar tabela polimórfica (acima) ou tabelas separadas?

```sql
-- Alternativa: Tabelas separadas
convenio_restricoes_planos
convenio_restricoes_medicos
convenio_restricoes_especialidades
convenio_restricoes_setores
convenio_restricoes_exames
```

---

## 📅 FASE 2: IMPLEMENTAÇÃO - P0 (CRÍTICO)

### 2.1. Migration: Adicionar Campos Faltantes

**Arquivo:** `src/database/migrations/TIMESTAMP-AddMissingFieldsToConvenios.ts`

```typescript
import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddMissingFieldsToConvenios1732200000000
  implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Criar ENUM types
    await queryRunner.query(`
      CREATE TYPE tipo_convenio_enum AS ENUM (
        'ambulatorial', 'hospitalar', 'odontologico', 'misto', 'particular'
      );

      CREATE TYPE forma_liquidacao_enum AS ENUM (
        'via_fatura', 'via_guia', 'automatica', 'manual'
      );

      CREATE TYPE envio_faturamento_enum AS ENUM (
        'email', 'portal', 'fisico', 'ftp', 'api'
      );
    `);

    // 2. Adicionar colunas (todas NULLABLE inicialmente)
    await queryRunner.addColumns('convenios', [
      // Identificação
      new TableColumn({
        name: 'matricula_digitos',
        type: 'int',
        isNullable: true,
      }),
      new TableColumn({
        name: 'tipo_convenio',
        type: 'tipo_convenio_enum',
        isNullable: true,
      }),
      new TableColumn({
        name: 'forma_liquidacao',
        type: 'forma_liquidacao_enum',
        isNullable: true,
      }),

      // Valores
      new TableColumn({
        name: 'valor_ch',
        type: 'decimal',
        precision: 10,
        scale: 2,
        isNullable: true,
      }),
      new TableColumn({
        name: 'valor_filme',
        type: 'decimal',
        precision: 10,
        scale: 2,
        isNullable: true,
      }),

      // TISS
      new TableColumn({
        name: 'tiss',
        type: 'boolean',
        default: false,
      }),
      new TableColumn({
        name: 'versao_tiss',
        type: 'varchar',
        length: '20',
        isNullable: true,
      }),
      new TableColumn({
        name: 'codigo_operadora_tiss',
        type: 'varchar',
        length: '50',
        isNullable: true,
      }),
      new TableColumn({
        name: 'codigo_operadora_autorizacao',
        type: 'varchar',
        length: '50',
        isNullable: true,
      }),
      new TableColumn({
        name: 'codigo_prestador',
        type: 'varchar',
        length: '50',
        isNullable: true,
      }),

      // Faturamento
      new TableColumn({
        name: 'envio_faturamento',
        type: 'envio_faturamento_enum',
        isNullable: true,
      }),
      new TableColumn({
        name: 'fatura_ate_dia',
        type: 'int',
        isNullable: true,
      }),
      new TableColumn({
        name: 'vencimento_fatura_dia',
        type: 'int',
        isNullable: true,
      }),
      new TableColumn({
        name: 'dia_vencimento',
        type: 'int',
        isNullable: true,
      }),
      new TableColumn({
        name: 'data_contrato',
        type: 'date',
        isNullable: true,
      }),
      new TableColumn({
        name: 'data_ultimo_ajuste',
        type: 'date',
        isNullable: true,
      }),
      new TableColumn({
        name: 'instrucoes_faturamento',
        type: 'text',
        isNullable: true,
      }),

      // Tabelas (FKs serão adicionadas depois que tabelas existirem)
      new TableColumn({
        name: 'tabela_servico_id',
        type: 'uuid',
        isNullable: true,
      }),
      new TableColumn({
        name: 'tabela_base_id',
        type: 'uuid',
        isNullable: true,
      }),
      new TableColumn({
        name: 'tabela_material_id',
        type: 'uuid',
        isNullable: true,
      }),
      new TableColumn({
        name: 'cnes_id',
        type: 'uuid',
        isNullable: true,
      }),

      // Configurações
      new TableColumn({
        name: 'co_participacao',
        type: 'boolean',
        default: false,
      }),
      new TableColumn({
        name: 'nota_fiscal_exige_fatura',
        type: 'boolean',
        default: false,
      }),
      new TableColumn({
        name: 'contato',
        type: 'varchar',
        length: '255',
        isNullable: true,
      }),
      new TableColumn({
        name: 'instrucoes',
        type: 'text',
        isNullable: true,
      }),
    ]);

    // 3. Renomear coluna existente
    await queryRunner.renameColumn(
      'convenios',
      'observacoes_convenio',
      'observacoes_gerais'
    );

    // 4. Adicionar FK para CNES (assumindo que existe unidades_saude)
    await queryRunner.query(`
      ALTER TABLE convenios
      ADD CONSTRAINT fk_convenios_cnes
      FOREIGN KEY (cnes_id)
      REFERENCES unidades_saude(id)
      ON DELETE SET NULL;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Reverter todas as mudanças
    // ... (implementar down migration)
  }
}
```

**⚠️ CHECKPOINT:** Executar migration SOMENTE após aprovação de Diego!

---

### 2.2. Migration: Remover Campos Extras

**⚠️ ATENÇÃO CRÍTICA:** Esta migration é DESTRUTIVA!

**Pré-requisitos:**
1. ✅ Backup completo do banco
2. ✅ Análise de dados existentes (Fase 1.1)
3. ✅ Migração de dados importantes para `metadata_legado` (se necessário)
4. ✅ Aprovação explícita de Diego

**Arquivo:** `src/database/migrations/TIMESTAMP-RemoveExtraFieldsFromConvenios.ts`

```typescript
import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class RemoveExtraFieldsFromConvenios1732300000000
  implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    // OPCIONAL: Preservar dados em campo metadata_legado
    await queryRunner.addColumn('convenios', new TableColumn({
      name: 'metadata_legado',
      type: 'jsonb',
      isNullable: true,
    }));

    // Migrar dados para metadata_legado
    await queryRunner.query(`
      UPDATE convenios
      SET metadata_legado = jsonb_build_object(
        'tem_integracao_api', tem_integracao_api,
        'url_api', url_api,
        'token_api', token_api,
        'requer_autorizacao', requer_autorizacao,
        'telefone', telefone,
        'email', email,
        'contato_nome', contato_nome,
        'regras_especificas', regras_especificas
      )
      WHERE tem_integracao_api IS NOT NULL
         OR url_api IS NOT NULL
         OR telefone IS NOT NULL
         OR email IS NOT NULL;
    `);

    // Remover colunas extras
    await queryRunner.dropColumn('convenios', 'tem_integracao_api');
    await queryRunner.dropColumn('convenios', 'url_api');
    await queryRunner.dropColumn('convenios', 'token_api');
    await queryRunner.dropColumn('convenios', 'requer_autorizacao');
    await queryRunner.dropColumn('convenios', 'requer_senha');
    await queryRunner.dropColumn('convenios', 'validade_guia_dias');
    await queryRunner.dropColumn('convenios', 'tipo_faturamento');
    await queryRunner.dropColumn('convenios', 'portal_envio');
    await queryRunner.dropColumn('convenios', 'dia_fechamento');
    await queryRunner.dropColumn('convenios', 'prazo_pagamento_dias');
    await queryRunner.dropColumn('convenios', 'percentual_desconto');
    await queryRunner.dropColumn('convenios', 'tabela_precos');
    await queryRunner.dropColumn('convenios', 'telefone');
    await queryRunner.dropColumn('convenios', 'email');
    await queryRunner.dropColumn('convenios', 'contato_nome');
    await queryRunner.dropColumn('convenios', 'regras_especificas');
    await queryRunner.dropColumn('convenios', 'status');
    await queryRunner.dropColumn('convenios', 'aceita_atendimento_online');
    await queryRunner.dropColumn('convenios', 'percentual_coparticipacao');
    await queryRunner.dropColumn('convenios', 'valor_consulta');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Impossível reverter completamente (dados perdidos)
    // Apenas recriar estrutura vazia
  }
}
```

**⚠️ CHECKPOINT:** Executar SOMENTE após múltiplas confirmações de Diego!

---

### 2.3. Migration: Criar Tabela de Integração

**Arquivo:** `src/database/migrations/TIMESTAMP-CreateConvenioIntegracaoTable.ts`

```typescript
import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateConvenioIntegracaoTable1732400000000
  implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'convenio_integracao',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'convenio_id',
            type: 'uuid',
            isUnique: true,
          },

          // URLs
          { name: 'url_elegibilidade', type: 'text', isNullable: true },
          { name: 'url_autenticacao', type: 'text', isNullable: true },
          { name: 'url_solicitacao_autorizacao', type: 'text', isNullable: true },
          { name: 'url_cancelamento', type: 'text', isNullable: true },
          { name: 'url_status_autorizacao', type: 'text', isNullable: true },
          { name: 'url_protocolo', type: 'text', isNullable: true },
          { name: 'url_lote_anexo', type: 'text', isNullable: true },
          { name: 'url_comunicacao_beneficiario', type: 'text', isNullable: true },

          // Configurações
          { name: 'ativar_comunicacao', type: 'boolean', default: false },
          { name: 'versao_tiss_integracao', type: 'varchar', length: '20', isNullable: true },
          { name: 'criptografar_trilha', type: 'boolean', default: false },
          { name: 'autorizador_padrao', type: 'varchar', length: '100', isNullable: true },

          // Credenciais
          { name: 'cadastrar_credenciais', type: 'boolean', default: false },
          { name: 'utilizar_autenticacao', type: 'boolean', default: false },
          { name: 'tipo_autenticacao', type: 'varchar', length: '50', isNullable: true },
          { name: 'usuario', type: 'varchar', length: '100', isNullable: true },
          { name: 'senha', type: 'varchar', length: '255', isNullable: true },
          { name: 'usuario_2', type: 'varchar', length: '100', isNullable: true },
          { name: 'senha_2', type: 'varchar', length: '255', isNullable: true },
          { name: 'criptografar_senha', type: 'boolean', default: true },
          { name: 'chave_api', type: 'text', isNullable: true },

          // Avançado
          { name: 'utilizar_soap_action', type: 'boolean', default: false },
          { name: 'enviar_arquivo', type: 'boolean', default: false },
          { name: 'certificado_serie', type: 'varchar', length: '100', isNullable: true },

          // Controle
          { name: 'created_at', type: 'timestamp', default: 'now()' },
          { name: 'updated_at', type: 'timestamp', default: 'now()' },
        ],
        foreignKeys: [
          {
            columnNames: ['convenio_id'],
            referencedTableName: 'convenios',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
      }),
      true
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('convenio_integracao');
  }
}
```

---

### 2.4. Atualizar Entidade `Convenio`

**Arquivo:** `src/modules/relacionamento/convenios/entities/convenio.entity.ts`

```typescript
import {
  Entity,
  PrimaryColumn,
  Column,
  OneToOne,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Empresa } from '../../../cadastros/empresas/entities/empresa.entity';
import { UnidadeSaude } from '../../../cadastros/unidade-saude/entities/unidade-saude.entity';
import { ConvenioIntegracao } from './convenio-integracao.entity';
import { Plano } from './plano.entity';
import { Instrucao } from './instrucao.entity';

// Enums
export enum TipoConvenio {
  AMBULATORIAL = 'ambulatorial',
  HOSPITALAR = 'hospitalar',
  ODONTOLOGICO = 'odontologico',
  MISTO = 'misto',
  PARTICULAR = 'particular',
}

export enum FormaLiquidacao {
  VIA_FATURA = 'via_fatura',
  VIA_GUIA = 'via_guia',
  AUTOMATICA = 'automatica',
  MANUAL = 'manual',
}

export enum EnvioFaturamento {
  EMAIL = 'email',
  PORTAL = 'portal',
  FISICO = 'fisico',
  FTP = 'ftp',
  API = 'api',
}

@Entity('convenios')
export class Convenio {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ type: 'uuid', unique: true })
  empresa_id: string;

  @OneToOne(() => Empresa)
  @JoinColumn({ name: 'empresa_id' })
  empresa: Empresa;

  // === IDENTIFICAÇÃO ===
  @Column({ type: 'varchar', length: 20, unique: true })
  codigo_convenio: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  registro_ans: string;

  @Column({ type: 'int', nullable: true })
  matricula_digitos: number;

  @Column({
    type: 'enum',
    enum: TipoConvenio,
    nullable: true,
  })
  tipo_convenio: TipoConvenio;

  @Column({
    type: 'enum',
    enum: FormaLiquidacao,
    nullable: true,
  })
  forma_liquidacao: FormaLiquidacao;

  // === VALORES ===
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  valor_ch: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  valor_filme: number;

  // === TISS ===
  @Column({ type: 'boolean', default: false })
  tiss: boolean;

  @Column({ type: 'varchar', length: 20, nullable: true })
  versao_tiss: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  codigo_operadora_tiss: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  codigo_operadora_autorizacao: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  codigo_prestador: string;

  // === FATURAMENTO ===
  @Column({
    type: 'enum',
    enum: EnvioFaturamento,
    nullable: true,
  })
  envio_faturamento: EnvioFaturamento;

  @Column({ type: 'int', nullable: true })
  fatura_ate_dia: number;

  @Column({ type: 'int', nullable: true })
  vencimento_fatura_dia: number;

  @Column({ type: 'int', nullable: true })
  dia_vencimento: number;

  @Column({ type: 'date', nullable: true })
  data_contrato: Date;

  @Column({ type: 'date', nullable: true })
  data_ultimo_ajuste: Date;

  @Column({ type: 'text', nullable: true })
  instrucoes_faturamento: string;

  // === TABELAS (FKs para tabelas de preços) ===
  @Column({ type: 'uuid', nullable: true })
  tabela_servico_id: string;

  @Column({ type: 'uuid', nullable: true })
  tabela_base_id: string;

  @Column({ type: 'uuid', nullable: true })
  tabela_material_id: string;

  @Column({ type: 'uuid', nullable: true })
  cnes_id: string;

  @ManyToOne(() => UnidadeSaude, { nullable: true })
  @JoinColumn({ name: 'cnes_id' })
  cnes: UnidadeSaude;

  // === CONFIGURAÇÕES ===
  @Column({ type: 'boolean', default: false })
  co_participacao: boolean;

  @Column({ type: 'boolean', default: false })
  nota_fiscal_exige_fatura: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  contato: string;

  @Column({ type: 'text', nullable: true })
  instrucoes: string;

  @Column({ type: 'text', nullable: true })
  observacoes_gerais: string;

  // === RELACIONAMENTOS ===
  @OneToOne(() => ConvenioIntegracao, (integracao) => integracao.convenio)
  integracao: ConvenioIntegracao;

  @OneToMany(() => Plano, (plano) => plano.convenio)
  planos: Plano[];

  @OneToMany(() => Instrucao, (instrucao) => instrucao.convenio)
  instrucoes_historico: Instrucao[];

  // === CONTROLE ===
  @Column({ type: 'boolean', default: true })
  ativo: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  // === METADATA LEGADO (opcional) ===
  @Column({ type: 'jsonb', nullable: true })
  metadata_legado: any;
}
```

---

### 2.5. Criar Entidade `ConvenioIntegracao`

**Arquivo:** `src/modules/relacionamento/convenios/entities/convenio-integracao.entity.ts`

```typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Convenio } from './convenio.entity';

@Entity('convenio_integracao')
export class ConvenioIntegracao {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', unique: true })
  convenio_id: string;

  @OneToOne(() => Convenio, (convenio) => convenio.integracao)
  @JoinColumn({ name: 'convenio_id' })
  convenio: Convenio;

  // === URLS DE INTEGRAÇÃO ===
  @Column({ type: 'text', nullable: true })
  url_elegibilidade: string;

  @Column({ type: 'text', nullable: true })
  url_autenticacao: string;

  @Column({ type: 'text', nullable: true })
  url_solicitacao_autorizacao: string;

  @Column({ type: 'text', nullable: true })
  url_cancelamento: string;

  @Column({ type: 'text', nullable: true })
  url_status_autorizacao: string;

  @Column({ type: 'text', nullable: true })
  url_protocolo: string;

  @Column({ type: 'text', nullable: true })
  url_lote_anexo: string;

  @Column({ type: 'text', nullable: true })
  url_comunicacao_beneficiario: string;

  // === CONFIGURAÇÕES GERAIS ===
  @Column({ type: 'boolean', default: false })
  ativar_comunicacao: boolean;

  @Column({ type: 'varchar', length: 20, nullable: true })
  versao_tiss_integracao: string;

  @Column({ type: 'boolean', default: false })
  criptografar_trilha: boolean;

  @Column({ type: 'varchar', length: 100, nullable: true })
  autorizador_padrao: string;

  // === CREDENCIAIS ===
  @Column({ type: 'boolean', default: false })
  cadastrar_credenciais: boolean;

  @Column({ type: 'boolean', default: false })
  utilizar_autenticacao: boolean;

  @Column({ type: 'varchar', length: 50, nullable: true })
  tipo_autenticacao: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  usuario: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  senha: string; // TODO: Encrypt com bcrypt

  @Column({ type: 'varchar', length: 100, nullable: true })
  usuario_2: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  senha_2: string; // TODO: Encrypt com bcrypt

  @Column({ type: 'boolean', default: true })
  criptografar_senha: boolean;

  @Column({ type: 'text', nullable: true })
  chave_api: string;

  // === CONFIGURAÇÕES AVANÇADAS ===
  @Column({ type: 'boolean', default: false })
  utilizar_soap_action: boolean;

  @Column({ type: 'boolean', default: false })
  enviar_arquivo: boolean;

  @Column({ type: 'varchar', length: 100, nullable: true })
  certificado_serie: string;

  // === CONTROLE ===
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;
}
```

---

### 2.6. Atualizar DTOs

**Arquivo:** `src/modules/relacionamento/convenios/dto/create-convenio.dto.ts`

```typescript
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsNumber,
  IsBoolean,
  IsDateString,
  IsUUID,
  Min,
  Max,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateEmpresaDto } from '../../../cadastros/empresas/dto/create-empresa.dto';
import {
  TipoConvenio,
  FormaLiquidacao,
  EnvioFaturamento,
} from '../entities/convenio.entity';

export class CreateConvenioDto {
  @ApiProperty({ description: 'Dados da empresa', type: CreateEmpresaDto })
  @ValidateNested()
  @Type(() => CreateEmpresaDto)
  empresa: CreateEmpresaDto;

  // === IDENTIFICAÇÃO ===
  @ApiProperty({ description: 'Código do convênio', maxLength: 20 })
  @IsString()
  @IsNotEmpty()
  codigo_convenio: string;

  @ApiPropertyOptional({ description: 'Registro ANS', maxLength: 20 })
  @IsString()
  @IsOptional()
  registro_ans?: string;

  @ApiPropertyOptional({ description: 'Quantidade de dígitos da matrícula' })
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(20)
  matricula_digitos?: number;

  @ApiPropertyOptional({ enum: TipoConvenio, description: 'Tipo de convênio' })
  @IsEnum(TipoConvenio)
  @IsOptional()
  tipo_convenio?: TipoConvenio;

  @ApiPropertyOptional({
    enum: FormaLiquidacao,
    description: 'Forma de liquidação',
  })
  @IsEnum(FormaLiquidacao)
  @IsOptional()
  forma_liquidacao?: FormaLiquidacao;

  // === VALORES ===
  @ApiPropertyOptional({ description: 'Valor CH', example: 150.0 })
  @IsNumber()
  @IsOptional()
  valor_ch?: number;

  @ApiPropertyOptional({ description: 'Valor Filme', example: 50.0 })
  @IsNumber()
  @IsOptional()
  valor_filme?: number;

  // === TISS ===
  @ApiPropertyOptional({ description: 'Utiliza padrão TISS?', default: false })
  @IsBoolean()
  @IsOptional()
  tiss?: boolean;

  @ApiPropertyOptional({ description: 'Versão TISS', example: '3.05.00' })
  @IsString()
  @IsOptional()
  versao_tiss?: string;

  @ApiPropertyOptional({ description: 'Código na operadora (TISS)' })
  @IsString()
  @IsOptional()
  codigo_operadora_tiss?: string;

  @ApiPropertyOptional({ description: 'Código da operadora (Autorização)' })
  @IsString()
  @IsOptional()
  codigo_operadora_autorizacao?: string;

  @ApiPropertyOptional({ description: 'Código do prestador no convênio' })
  @IsString()
  @IsOptional()
  codigo_prestador?: string;

  // === FATURAMENTO ===
  @ApiPropertyOptional({
    enum: EnvioFaturamento,
    description: 'Forma de envio do faturamento',
  })
  @IsEnum(EnvioFaturamento)
  @IsOptional()
  envio_faturamento?: EnvioFaturamento;

  @ApiPropertyOptional({
    description: 'Faturar até o dia (1-31)',
    minimum: 1,
    maximum: 31,
  })
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(31)
  fatura_ate_dia?: number;

  @ApiPropertyOptional({
    description: 'Vencimento da fatura no dia (1-31)',
    minimum: 1,
    maximum: 31,
  })
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(31)
  vencimento_fatura_dia?: number;

  @ApiPropertyOptional({
    description: 'Dia de vencimento (1-31)',
    minimum: 1,
    maximum: 31,
  })
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(31)
  dia_vencimento?: number;

  @ApiPropertyOptional({
    description: 'Data do contrato',
    example: '2024-01-15',
  })
  @IsDateString()
  @IsOptional()
  data_contrato?: string;

  @ApiPropertyOptional({
    description: 'Data do último ajuste de valores',
    example: '2024-11-01',
  })
  @IsDateString()
  @IsOptional()
  data_ultimo_ajuste?: string;

  @ApiPropertyOptional({ description: 'Instruções para faturamento' })
  @IsString()
  @IsOptional()
  instrucoes_faturamento?: string;

  // === TABELAS ===
  @ApiPropertyOptional({ description: 'ID da tabela de serviços' })
  @IsUUID()
  @IsOptional()
  tabela_servico_id?: string;

  @ApiPropertyOptional({ description: 'ID da tabela base' })
  @IsUUID()
  @IsOptional()
  tabela_base_id?: string;

  @ApiPropertyOptional({ description: 'ID da tabela de materiais' })
  @IsUUID()
  @IsOptional()
  tabela_material_id?: string;

  @ApiPropertyOptional({ description: 'ID do CNES da unidade' })
  @IsUUID()
  @IsOptional()
  cnes_id?: string;

  // === CONFIGURAÇÕES ===
  @ApiPropertyOptional({
    description: 'Possui co-participação?',
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  co_participacao?: boolean;

  @ApiPropertyOptional({
    description: 'Exige nota fiscal na fatura?',
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  nota_fiscal_exige_fatura?: boolean;

  @ApiPropertyOptional({ description: 'Nome do contato' })
  @IsString()
  @IsOptional()
  contato?: string;

  @ApiPropertyOptional({ description: 'Instruções gerais' })
  @IsString()
  @IsOptional()
  instrucoes?: string;

  @ApiPropertyOptional({ description: 'Observações gerais' })
  @IsString()
  @IsOptional()
  observacoes_gerais?: string;
}
```

---

## 📅 FASE 3: IMPLEMENTAÇÃO - P1 (ALTA)

### 3.1. Aba ATENDIMENTO - Sistema de Campos Obrigatórios

**⚠️ DECISÃO NECESSÁRIA (Diego):** Qual abordagem usar?

#### Opção A: Tabela Normalizada (Recomendado)

```sql
CREATE TABLE convenio_campos_obrigatorios (
  id uuid PRIMARY KEY,
  convenio_id uuid REFERENCES convenios(id),
  categoria varchar(50), -- PACIENTE, ORDEM_SERVICO, TISS
  campo varchar(100),
  obrigatorio boolean,
  created_at timestamp,
  UNIQUE(convenio_id, categoria, campo)
);
```

**Prós:**
- Estrutura clara e consultável
- Fácil validação
- Fácil adicionar novos campos

**Contras:**
- Muitos registros (pode ter 50+ linhas por convênio)

#### Opção B: Coluna JSONB

```typescript
// Na tabela convenios
campos_obrigatorios: {
  PACIENTE: {
    cpf_proprio: false,
    bairro: true,
    cidade: true,
    // ...
  },
  ORDEM_SERVICO: {
    medico_requisitante: true,
    especialidade: true,
    // ...
  },
  TISS: {
    regime_atendimento: false,
    // ...
  }
}
```

**Prós:**
- Compacto (1 linha por convênio)
- Flexível

**Contras:**
- Dificulta queries (ex: "quais convênios exigem CPF?")
- Validação mais complexa

**⚠️ AGUARDAR DECISÃO DE DIEGO ANTES DE IMPLEMENTAR**

---

### 3.2. Aba RESTRIÇÕES - Sistema de Restrições

**⚠️ DECISÃO NECESSÁRIA (Diego):** Qual abordagem usar?

#### Opção A: Tabela Polimórfica (Recomendado para flexibilidade)

```sql
CREATE TABLE convenio_restricoes (
  id uuid PRIMARY KEY,
  convenio_id uuid REFERENCES convenios(id),
  tipo_restricao varchar(50), -- PLANO, MEDICO, ESPECIALIDADE, SETOR, EXAME

  -- Referências polimórficas (apenas uma preenchida)
  plano_id uuid,
  medico_id uuid,
  especialidade_id uuid,
  setor_id uuid,
  exame_id uuid,

  descricao text,
  ativo boolean DEFAULT true,
  created_at timestamp,

  CONSTRAINT check_one_reference CHECK (
    (plano_id IS NOT NULL)::integer +
    (medico_id IS NOT NULL)::integer +
    (especialidade_id IS NOT NULL)::integer +
    (setor_id IS NOT NULL)::integer +
    (exame_id IS NOT NULL)::integer = 1
  )
);
```

#### Opção B: Tabelas Separadas (Recomendado para type-safety)

```sql
CREATE TABLE convenio_restricoes_planos (
  id uuid PRIMARY KEY,
  convenio_id uuid REFERENCES convenios(id),
  plano_id uuid REFERENCES planos(id),
  descricao text,
  ativo boolean,
  created_at timestamp
);

CREATE TABLE convenio_restricoes_medicos (
  id uuid PRIMARY KEY,
  convenio_id uuid REFERENCES convenios(id),
  medico_id uuid REFERENCES profissionais(id),
  descricao text,
  ativo boolean,
  created_at timestamp
);

-- ... (mais 3 tabelas similares)
```

**⚠️ AGUARDAR DECISÃO DE DIEGO ANTES DE IMPLEMENTAR**

---

## 📅 FASE 4: TESTES E VALIDAÇÃO

### 4.1. Checklist de Testes

- [ ] **Build:** `npm run build` (0 erros TypeScript)
- [ ] **Lint:** `npm run lint` (0 erros ESLint)
- [ ] **Testes Unitários:** `npm test` (100% passando)
- [ ] **Testes E2E:** Criar testes para novos endpoints
- [ ] **Migrations:** Testar up e down migrations
- [ ] **Validação de DTOs:** Testar validações com dados inválidos
- [ ] **Relacionamentos:** Testar carregamento eager/lazy
- [ ] **Soft Delete:** Verificar que desativação funciona

### 4.2. Arquivos HTTP de Teste

Criar em `/http-requests/relacionamento/convenios/`:

- `criar-convenio-completo.http` - Com todos os novos campos
- `atualizar-convenio.http` - Teste de update
- `buscar-convenio.http` - Teste de relacionamentos
- `integracao-convenio.http` - CRUD de integração
- `campos-obrigatorios.http` - Teste de configuração
- `restricoes.http` - CRUD de restrições

---

## 📊 RISCOS E MITIGAÇÕES

| Risco | Impacto | Probabilidade | Mitigação |
|-------|---------|---------------|-----------|
| **Perda de dados na remoção de campos** | 🔴 ALTO | Médio | Backup + Migração para metadata_legado |
| **Validações quebram cadastros existentes** | 🟡 MÉDIO | Alto | Adicionar campos nullable + validar apenas em novos |
| **Integrações param de funcionar** | 🔴 ALTO | Baixo | Manter campos de integração até validar não uso |
| **Mudanças incompatíveis com frontend** | 🟡 MÉDIO | Alto | Documentar breaking changes + versionar API |
| **Migrations falham em produção** | 🔴 ALTO | Baixo | Testar em staging + ter plano de rollback |
| **Referências FK para tabelas inexistentes** | 🟡 MÉDIO | Médio | Criar tabelas referenced antes das migrations |

---

## 📝 CHECKLIST COMPLETO DE IMPLEMENTAÇÃO

### Fase 0: Planejamento e Aprovação
- [x] Criar documento PLANO_CONVENIOS.md
- [ ] **Revisar plano com Diego**
- [ ] **Aprovar modelagem de dados**
- [ ] **Definir enums (valores corretos)**
- [ ] **Decidir: Tabela polimórfica vs separadas**
- [ ] **Decidir: JSONB vs tabela normalizada (campos obrigatórios)**
- [ ] **Confirmar se tabelas de preços (tabela_servico, etc) existem**

### Fase 1: Preparação (P0)
- [ ] Executar queries de análise de dados
- [ ] Gerar relatório de uso de campos extras
- [ ] **Apresentar relatório para Diego**
- [ ] **Decidir se preservar dados em metadata_legado**
- [ ] Fazer backup completo do banco de dados
- [ ] Criar enums em arquivos TypeScript

### Fase 2: Migrations e Entidades (P0)
- [ ] Criar migration: Adicionar 26 campos faltantes
- [ ] **Revisar migration com Diego**
- [ ] **Executar migration em desenvolvimento**
- [ ] Testar dados após migration
- [ ] Criar migration: Tabela convenio_integracao
- [ ] **Executar migration convenio_integracao**
- [ ] Atualizar entity Convenio com novos campos
- [ ] Criar entity ConvenioIntegracao
- [ ] Atualizar ConveniosModule (registrar nova entity)
- [ ] **Build + Lint + Test** ✅

### Fase 3: DTOs e Validações (P0)
- [ ] Atualizar CreateConvenioDto (26 campos)
- [ ] Atualizar UpdateConvenioDto (parcial)
- [ ] Criar CreateConvenioIntegracaoDto
- [ ] Criar UpdateConvenioIntegracaoDto
- [ ] Adicionar validações (class-validator)
- [ ] Adicionar documentação Swagger
- [ ] **Build + Lint + Test** ✅

### Fase 4: Services (P0)
- [ ] Atualizar ConveniosService.create() - incluir novos campos
- [ ] Atualizar ConveniosService.update() - incluir novos campos
- [ ] Criar métodos para relacionamento com integracao
- [ ] Adicionar validações de negócio (ex: dia 1-31)
- [ ] Testar transações (rollback em caso de erro)
- [ ] **Build + Lint + Test** ✅

### Fase 5: Controllers (P0)
- [ ] Atualizar endpoints existentes (usar novos DTOs)
- [ ] Criar endpoint: POST /convenios/:id/integracao
- [ ] Criar endpoint: GET /convenios/:id/integracao
- [ ] Criar endpoint: PATCH /convenios/:id/integracao
- [ ] Criar endpoint: DELETE /convenios/:id/integracao
- [ ] Adicionar documentação Swagger completa
- [ ] **Build + Lint + Test** ✅

### Fase 6: Remoção de Campos Extras (P0 - CRÍTICO)
- [ ] **CONFIRMAR COM DIEGO: Dados migrados/backup feito**
- [ ] Criar migration: RemoveExtraFieldsFromConvenios
- [ ] **Revisar migration 3x com Diego**
- [ ] **Executar em desenvolvimento primeiro**
- [ ] Validar que sistema continua funcionando
- [ ] **SOMENTE ENTÃO executar em produção**
- [ ] **Build + Lint + Test** ✅

### Fase 7: Aba ATENDIMENTO (P1)
- [ ] **Decidir modelagem com Diego**
- [ ] Criar migration (tabela ou coluna JSONB)
- [ ] Criar entity (se tabela normalizada)
- [ ] Criar DTOs
- [ ] Implementar service
- [ ] Criar endpoints CRUD
- [ ] **Build + Lint + Test** ✅

### Fase 8: Aba RESTRIÇÕES (P1)
- [ ] **Decidir modelagem com Diego**
- [ ] Criar migration(s)
- [ ] Criar entity(ies)
- [ ] Criar DTOs
- [ ] Implementar service com validações
- [ ] Criar endpoints CRUD
- [ ] **Build + Lint + Test** ✅

### Fase 9: Testes e Documentação
- [ ] Criar testes unitários (services)
- [ ] Criar testes E2E (endpoints)
- [ ] Criar arquivos .http de exemplo
- [ ] Atualizar documentação do projeto
- [ ] Atualizar CLAUDE.md com decisões tomadas
- [ ] **Build + Lint + Test (final)** ✅

### Fase 10: Deploy
- [ ] Testar em ambiente de staging
- [ ] Executar migrations em staging
- [ ] Validar funcionamento completo
- [ ] Criar plano de rollback
- [ ] **Executar migrations em produção**
- [ ] Monitorar logs e erros
- [ ] Validar sistema em produção

---

## 🎯 PONTOS DE DECISÃO CRÍTICOS

### 🚨 PARADA OBRIGATÓRIA 1: Antes de Criar Migrations

**Perguntas para Diego:**

1. ✅ A modelagem das tabelas está aprovada?
2. ✅ Os enums têm os valores corretos?
3. ✅ As FKs (tabela_servico_id, etc) referenciam tabelas que existem?
4. ✅ Preferência: campos nullable ou obrigatórios?

**Só prosseguir após resposta ✅ para TODAS as perguntas!**

---

### 🚨 PARADA OBRIGATÓRIA 2: Antes de Remover Campos

**Validações Obrigatórias:**

1. ✅ Backup do banco foi feito?
2. ✅ Análise de dados foi apresentada?
3. ✅ Dados importantes foram migrados?
4. ✅ Diego confirmou EXPLICITAMENTE a remoção?

**Só prosseguir após resposta ✅ para TODAS as validações!**

---

### 🚨 PARADA OBRIGATÓRIA 3: Antes de Implementar Abas P1

**Decisões Necessárias (Diego):**

1. Aba ATENDIMENTO: Tabela normalizada ou JSONB?
2. Aba RESTRIÇÕES: Polimórfica ou tabelas separadas?
3. Prioridade: Implementar P1 agora ou depois?

**Só prosseguir após decisões de Diego!**

---

## 📚 REFERÊNCIAS

- [RELATORIO_EMPRESAS_FIGMA_VS_IMPLEMENTACAO.md](RELATORIO_EMPRESAS_FIGMA_VS_IMPLEMENTACAO.md) - Análise completa
- [CLAUDE.md](CLAUDE.md) - Padrões do projeto
- [PDF Figma - Páginas 8-13](/home/diego/Projects/erplab/back/pdfs/) - Design original
- [TypeORM Migrations](https://typeorm.io/migrations) - Documentação oficial
- [Class Validator](https://github.com/typestack/class-validator) - Validações

---

## 🔄 HISTÓRICO DE REVISÕES

| Data | Versão | Autor | Mudanças |
|------|--------|-------|----------|
| 21/11/2025 | 1.0 | Claude + Diego | Versão inicial do plano |

---

## 💬 PRÓXIMOS PASSOS

**⏭️ PRÓXIMA AÇÃO:**

1. **Diego revisar este plano completo**
2. **Responder perguntas das seções de DECISÃO**
3. **Aprovar modelagem de dados proposta**
4. **Definir valores dos enums**
5. **Confirmar quais campos podem ser nullable**

**Após aprovação, iniciar Fase 1: Preparação**

---

**📌 LEMBRETE IMPORTANTE:**

> Este é um projeto de trabalho em **4 mãos**. Nenhuma migration será criada ou executada sem aprovação explícita de Diego. A remoção de campos é uma operação crítica que requer múltiplas confirmações.

---

**Fim do Plano de Correção do Módulo de Convênios**
