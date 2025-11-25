# Memória de Implementação - Sistema de Integrações

**Data**: 25 de Novembro de 2025
**Status**: Refatoração principal concluída, migrations pendentes
**Build**: ✅ Passando (0 erros TypeScript)

---

## 🎯 Objetivo da Refatoração

Transformar o sistema de integrações de **hardcoded** (campos fixos no banco) para **schema-driven** (campos dinâmicos definidos em código).

### Antes (Sistema Antigo)

```typescript
// Tabela tinha 42 campos fixos
integracoes {
  nome_laboratorio,
  url_base,
  usuario,
  senha,
  token_autenticacao,
  ... // 37+ outros campos hardcoded
}
```

**Problemas:**
- Impossível adicionar novos tipos de integração sem alterar tabela
- Campos de laboratório misturados com campos de banco/gateway
- Zero flexibilidade

### Depois (Sistema Novo)

```typescript
// Tabela com apenas 15 campos genéricos
integracoes {
  template_slug,        // qual schema usar (ex: 'hermes-pardini')
  codigo_identificacao, // código único da instância
  nome_instancia,       // nome descritivo
  tipos_contexto,       // array de contextos
  ...
}

// Configurações em tabela key-value
integracoes_configuracoes {
  integracao_id,
  chave,   // 'usuario', 'senha', 'ambiente'...
  valor    // valores específicos de cada integração
}
```

**Vantagens:**
- Schemas definidos em TypeScript (src/modules/atendimento/integracoes/schemas/)
- Adicionar nova integração = criar arquivo .schema.ts (zero migrations!)
- Frontend busca schema via API e renderiza campos dinamicamente
- Validações automáticas baseadas no schema

---

## 📋 Progresso Atual

### ✅ Concluído

1. **Schemas criados**
   - `src/modules/atendimento/integracoes/schemas/types.ts` - Interfaces simplificadas
   - `src/modules/atendimento/integracoes/schemas/hermes-pardini.schema.ts` - Exemplo completo
   - `src/modules/atendimento/integracoes/schemas/index.ts` - Helpers

2. **Entidades refatoradas**
   - `Integracao` - 15 campos (era 42)
   - `IntegracaoConfiguracao` - Tabela key-value

3. **DTOs refatorados**
   - `CreateIntegracaoDto` - 7 campos simples:
     - `templateSlug`: string
     - `codigoIdentificacao`: string
     - `nomeInstancia`: string
     - `descricao?`: string
     - `tiposContexto`: TipoIntegracao[]
     - `configuracoes`: Record<string, any>
     - `observacoes?`: string
   - `UpdateIntegracaoDto` - Usa PartialType (auto-atualiza)

4. **Service refatorado** (`integracoes.service.ts`)
   - ✅ `create()` - Cria integração + configurações em transação
   - ✅ `findAll()` - Lista com configurações
   - ✅ `findAtivos()` - Filtra ativos
   - ✅ `findByTipo()` - Busca por tipo (usa array tiposContexto)
   - ✅ `findByStatus()` - Filtra por status
   - ✅ `findByCodigo()` - Busca por código
   - ✅ `search()` - Busca por termo
   - ✅ `findOne()` - Busca por ID
   - ✅ `update()` - Atualiza integração + configurações
   - ✅ `toggleStatus()` - Alterna ativo/inativo
   - ✅ `updateStatus()` - Muda status
   - ✅ `remove()` - Remove (CASCADE)
   - ✅ `getEstatisticas()` - Estatísticas
   - ✅ `testarConexao()` - Teste básico
   - ✅ `sincronizar()` - Sincronização básica
   - ✅ Validações de schema (campos obrigatórios)
   - ✅ Transações em create/update

5. **Controller refatorado** (`integracoes.controller.ts`)
   - ✅ Todos os endpoints CRUD
   - ✅ Endpoints de schemas:
     - `GET /atendimento/integracoes/schemas` - Lista schemas
     - `GET /atendimento/integracoes/schemas/:slug` - Busca schema
   - ✅ Removido endpoint `findByUnidadeSaude` (não existe mais)

6. **Module atualizado** (`integracoes.module.ts`)
   - ✅ Registra ambas as entidades
   - ✅ Registra service e controller
   - ✅ Exporta service para uso em outros módulos

7. **Migrations criadas** (NÃO EXECUTADAS!)
   - `1763900000000-RefactorIntegracoesTable.ts` - Refatora tabela integracoes
   - `1763900100000-CreateIntegracoesConfiguracoesTable.ts` - Cria tabela configurações

8. **Arquivos HTTP de teste criados**
   - `1-listar-schemas.http` - Listar e filtrar schemas
   - `2-criar-integracao.http` - Criar integrações
   - `3-listar-integracoes.http` - Listar e buscar
   - `4-atualizar-integracao.http` - Atualizar
   - `5-testar-e-sincronizar.http` - Testar conexão
   - `6-deletar-integracao.http` - Deletar
   - `7-fluxo-completo.http` - Exemplo completo

### ⏳ Pendente

1. **Migrations NÃO EXECUTADAS**
   - ⚠️ **CRÍTICO**: Executar migrations SOMENTE quando tiver certeza
   - Migration vai deletar 30+ campos da tabela `integracoes`
   - Migration vai criar tabela `integracoes_configuracoes`

2. **Arquivos Hermes Pardini** (movidos para `.old`)
   - `services/hermes-pardini.service.ts.old` - Precisa refatoração completa
   - `controllers/hermes-pardini.controller.ts.old` - Precisa refatoração completa
   - **Motivo**: Ainda usam campos antigos (usuario, senha, urlBase, etc)
   - **Solução**: Refatorar para buscar configs da tabela key-value

3. **Testes**
   - Testar endpoints via arquivos `.http`
   - Testar criação/atualização de integração
   - Testar validação de campos obrigatórios

4. **Outros schemas**
   - Criar schemas para outras integrações (Santander, Orizon TISS, etc)
   - Seguir padrão do `hermes-pardini.schema.ts`

---

## 🔑 Conceitos-Chave do Sistema

### 1. Schema vs Integração vs Configuração

```
SCHEMA (código TypeScript)
└─> Define CAMPOS disponíveis
    └─> Ex: usuario, senha, ambiente, url_wsdl, timeout

INTEGRAÇÃO (registro no banco)
└─> INSTÂNCIA de um schema
    └─> Ex: "Hermes Pardini - Unidade Centro"
        └─> templateSlug = 'hermes-pardini'
        └─> codigo = 'HP-CENTRO-01'

CONFIGURAÇÕES (tabela key-value)
└─> VALORES específicos daquela instância
    └─> { chave: 'usuario', valor: 'hp_user_centro' }
    └─> { chave: 'senha', valor: '[ENCRYPTED]' }
    └─> { chave: 'ambiente', valor: 'producao' }
```

### 2. Fluxo de Criação

```mermaid
Frontend                Backend                     Database
   |                       |                            |
   | GET /schemas          |                            |
   |---------------------->|                            |
   |                       | Retorna hermes-pardini.ts  |
   |<----------------------|                            |
   |                       |                            |
   | Renderiza formulário  |                            |
   | com campos do schema  |                            |
   |                       |                            |
   | POST /integracoes     |                            |
   | {                     |                            |
   |   templateSlug,       |                            |
   |   configuracoes: {...}|                            |
   | }                     |                            |
   |---------------------->|                            |
   |                       | 1. Valida schema existe    |
   |                       | 2. Valida campos obrigatórios
   |                       | 3. Inicia transação        |
   |                       |                            |
   |                       | INSERT integracoes ------->|
   |                       |                            |
   |                       | INSERT configuracoes ----->|
   |                       | (múltiplos registros)      |
   |                       |                            |
   |                       | COMMIT transação           |
   |                       |                            |
   |<----------------------| Retorna integração criada  |
```

### 3. Tipos de Campo Suportados

```typescript
export enum TipoCampo {
  STRING = 'string',
  PASSWORD = 'password',  // Auto-criptografa!
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  SELECT = 'select',       // Usa campo 'opcoes'
  URL = 'url',
}
```

### 4. Exemplo de Schema Completo

```typescript
// src/modules/atendimento/integracoes/schemas/hermes-pardini.schema.ts
export const HERMES_PARDINI_SCHEMA: IntegracaoSchema = {
  slug: 'hermes-pardini',
  nome: 'Hermes Pardini',
  descricao: 'Integração com laboratório Hermes Pardini via SOAP',
  versao: '1.0.0',
  tipos_contexto: [TipoIntegracao.LABORATORIO_APOIO],
  protocolo: ProtocoloIntegracao.SOAP,

  campos: [
    {
      chave: 'usuario',
      label: 'Usuário',
      tipo: TipoCampo.STRING,
      obrigatorio: true,
    },
    {
      chave: 'senha',
      label: 'Senha',
      tipo: TipoCampo.PASSWORD,
      obrigatorio: true,
      criptografar: true,  // ← Marcado para criptografia
    },
    {
      chave: 'ambiente',
      label: 'Ambiente',
      tipo: TipoCampo.SELECT,
      obrigatorio: true,
      valorPadrao: 'homologacao',
      opcoes: [
        { valor: 'homologacao', label: 'Homologação' },
        { valor: 'producao', label: 'Produção' },
      ],
    },
    {
      chave: 'timeout',
      label: 'Timeout (segundos)',
      tipo: TipoCampo.NUMBER,
      obrigatorio: false,
      valorPadrao: 30,
      min: 5,
      max: 300,
    },
  ],

  ativo: true,
};
```

---

## 🛠️ Como Continuar a Implementação

### Próximo Passo 1: Executar Migrations

**⚠️ ATENÇÃO**: Migrations vão DELETAR dados antigos!

```bash
# 1. Fazer backup do banco ANTES
pg_dump -h localhost -U postgres -d erplab > backup_antes_migration.sql

# 2. Executar migrations
npm run migration:run

# 3. Verificar se tabelas foram alteradas
psql -d erplab -c "\d integracoes"
psql -d erplab -c "\d integracoes_configuracoes"

# 4. Se algo der errado, restaurar backup
psql -d erplab < backup_antes_migration.sql
```

**O que as migrations fazem:**

**Migration 1: RefactorIntegracoesTable**
```sql
-- Remove 30+ campos antigos
ALTER TABLE integracoes DROP COLUMN nome_laboratorio;
ALTER TABLE integracoes DROP COLUMN url_base;
ALTER TABLE integracoes DROP COLUMN usuario;
... (30+ DROPs)

-- Adiciona 3 novos campos
ALTER TABLE integracoes ADD COLUMN template_slug VARCHAR(100);
ALTER TABLE integracoes ADD COLUMN nome_instancia VARCHAR(255);
ALTER TABLE integracoes ADD COLUMN tipos_contexto TEXT[];

-- Remove ENUMs antigos
DROP TYPE tipo_integracao;
DROP TYPE padrao_comunicacao;
DROP TYPE formato_retorno;
```

**Migration 2: CreateIntegracoesConfiguracoesTable**
```sql
CREATE TABLE integracoes_configuracoes (
  id UUID PRIMARY KEY,
  integracao_id UUID REFERENCES integracoes(id) ON DELETE CASCADE,
  chave VARCHAR(100),
  valor TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  UNIQUE(integracao_id, chave)
);
```

### Próximo Passo 2: Testar Endpoints

```bash
# 1. Usar VS Code REST Client
# Abrir arquivo http-requests/atendimento/integracoes/7-fluxo-completo.http
# Executar cada request passo a passo

# 2. Verificar resposta da API
# Deve retornar configuracoes como array de objetos:
# [
#   { chave: 'usuario', valor: 'hp_user' },
#   { chave: 'senha', valor: '[ENCRYPTED]' },
#   ...
# ]
```

### Próximo Passo 3: Refatorar Hermes Pardini Service

**Arquivo**: `services/hermes-pardini.service.ts.old`

**Problema**: Tenta acessar campos que não existem mais
```typescript
// ❌ ERRADO (antigo)
integracao.usuario
integracao.senha
integracao.urlBase

// ✅ CERTO (novo)
const configs = integracao.configuracoes.reduce((acc, c) => {
  acc[c.chave] = c.valor;
  return acc;
}, {});

const usuario = configs.usuario;
const senha = configs.senha;
const urlBase = configs.url_wsdl;
```

**Solução**: Helper para converter array para objeto
```typescript
// Adicionar no service
private getConfigsAsObject(integracao: Integracao): Record<string, any> {
  return integracao.configuracoes.reduce((acc, config) => {
    acc[config.chave] = config.valor;
    return acc;
  }, {} as Record<string, any>);
}

// Usar nos métodos
const configs = this.getConfigsAsObject(integracao);
const usuario = configs.usuario;
const senha = configs.senha;
```

### Próximo Passo 4: Criar Mais Schemas

**Exemplo**: Schema para Santander API

```typescript
// src/modules/atendimento/integracoes/schemas/santander-api.schema.ts
import { IntegracaoSchema, TipoCampo, TipoIntegracao, ProtocoloIntegracao } from './types';

export const SANTANDER_SCHEMA: IntegracaoSchema = {
  slug: 'santander-api',
  nome: 'Santander API Cobrança',
  descricao: 'Integração com Santander para geração de boletos',
  versao: '1.0.0',
  tipos_contexto: [TipoIntegracao.BANCO],
  protocolo: ProtocoloIntegracao.REST,

  campos: [
    {
      chave: 'client_id',
      label: 'Client ID',
      tipo: TipoCampo.STRING,
      obrigatorio: true,
    },
    {
      chave: 'client_secret',
      label: 'Client Secret',
      tipo: TipoCampo.PASSWORD,
      obrigatorio: true,
      criptografar: true,
    },
    {
      chave: 'workspace',
      label: 'Workspace',
      tipo: TipoCampo.STRING,
      obrigatorio: true,
    },
    {
      chave: 'certificado_base64',
      label: 'Certificado (Base64)',
      tipo: TipoCampo.STRING,
      obrigatorio: true,
    },
    {
      chave: 'ambiente',
      label: 'Ambiente',
      tipo: TipoCampo.SELECT,
      obrigatorio: true,
      valorPadrao: 'homologacao',
      opcoes: [
        { valor: 'homologacao', label: 'Homologação' },
        { valor: 'producao', label: 'Produção' },
      ],
    },
  ],

  ativo: true,
};
```

Depois registrar no `schemas/index.ts`:
```typescript
import { SANTANDER_SCHEMA } from './santander-api.schema';

export const INTEGRACOES_SCHEMAS: Record<string, IntegracaoSchema> = {
  'hermes-pardini': HERMES_PARDINI_SCHEMA,
  'santander-api': SANTANDER_SCHEMA,  // ← Adicionar aqui
};
```

---

## 📂 Estrutura de Arquivos

```
src/modules/atendimento/integracoes/
├── schemas/
│   ├── types.ts                     ✅ Interfaces (CampoSchema, IntegracaoSchema)
│   ├── hermes-pardini.schema.ts     ✅ Schema exemplo
│   ├── santander-api.schema.ts      ⏳ Criar
│   ├── orizon-tiss.schema.ts        ⏳ Criar
│   └── index.ts                     ✅ Registro + helpers
│
├── entities/
│   ├── integracao.entity.ts         ✅ Refatorada (15 campos)
│   └── integracao-configuracao.entity.ts ✅ Nova (key-value)
│
├── dto/
│   ├── create-integracao.dto.ts     ✅ Refatorado (7 campos)
│   └── update-integracao.dto.ts     ✅ PartialType
│
├── services/
│   ├── hermes-pardini.service.ts.old ⚠️ Precisa refatoração
│   └── (outros services futuros)
│
├── controllers/
│   ├── hermes-pardini.controller.ts.old ⚠️ Precisa refatoração
│   └── (outros controllers futuros)
│
├── integracoes.service.ts           ✅ Refatorado (completo)
├── integracoes.controller.ts        ✅ Refatorado (completo)
└── integracoes.module.ts            ✅ Atualizado
```

---

## 🔍 Debugar Problemas Comuns

### Problema 1: "Property 'usuario' does not exist on type 'Integracao'"

**Causa**: Código antigo tentando acessar campos removidos

**Solução**:
```typescript
// ❌ ANTES
const usuario = integracao.usuario;

// ✅ DEPOIS
const configs = integracao.configuracoes.reduce((acc, c) => {
  acc[c.chave] = c.valor;
  return acc;
}, {});
const usuario = configs.usuario;
```

### Problema 2: "Campos obrigatórios faltando"

**Causa**: DTO não enviou todos os campos obrigatórios do schema

**Solução**: Verificar schema e enviar todos os campos com `obrigatorio: true`

```typescript
// Exemplo: hermes-pardini tem 3 obrigatórios
{
  templateSlug: 'hermes-pardini',
  codigoIdentificacao: 'HP-001',
  nomeInstancia: 'Hermes Pardini Centro',
  tiposContexto: ['LABORATORIO_APOIO'],
  configuracoes: {
    usuario: 'hp_user',     // obrigatório
    senha: 'senha123',      // obrigatório
    ambiente: 'producao',   // obrigatório
    // url_wsdl é opcional
    // timeout é opcional
  }
}
```

### Problema 3: Migration falha

**Causa**: Banco de dados tem dados incompatíveis

**Solução**:
1. Fazer backup
2. Limpar dados antigos se necessário
3. Executar migration
4. Se falhar, restaurar backup e investigar

---

## 📊 Status de Cada Arquivo

| Arquivo | Status | Notas |
|---------|--------|-------|
| `schemas/types.ts` | ✅ Concluído | Interfaces simplificadas (5 props por campo) |
| `schemas/hermes-pardini.schema.ts` | ✅ Concluído | Exemplo completo com 5 campos |
| `schemas/index.ts` | ✅ Concluído | Helpers + registro |
| `entities/integracao.entity.ts` | ✅ Concluído | 15 campos (era 42) |
| `entities/integracao-configuracao.entity.ts` | ✅ Concluído | Tabela key-value |
| `dto/create-integracao.dto.ts` | ✅ Concluído | 7 campos + validações |
| `dto/update-integracao.dto.ts` | ✅ Concluído | PartialType |
| `integracoes.service.ts` | ✅ Concluído | 15 métodos + transações |
| `integracoes.controller.ts` | ✅ Concluído | 13 endpoints + schemas |
| `integracoes.module.ts` | ✅ Concluído | Registros corretos |
| `services/hermes-pardini.service.ts` | ⚠️ `.old` | Precisa refatoração |
| `controllers/hermes-pardini.controller.ts` | ⚠️ `.old` | Precisa refatoração |
| Migrations | ⏳ Criadas, não executadas | ⚠️ BACKUP primeiro! |
| Arquivos HTTP | ✅ Criados (7 arquivos) | Prontos para teste |

---

## 🎯 Critérios de Sucesso

### Build
- [x] `npm run build` - 0 erros TypeScript
- [ ] `npm run lint` - 0 erros ESLint
- [ ] `npm test` - Testes passando

### Migrations
- [ ] Migration executada com sucesso
- [ ] Tabela `integracoes` com 15 campos
- [ ] Tabela `integracoes_configuracoes` criada
- [ ] Índices criados

### Funcionalidade
- [ ] POST /integracoes cria integração + configurações
- [ ] GET /integracoes retorna com array de configuracoes
- [ ] PUT /integracoes atualiza integração + configurações
- [ ] DELETE /integracoes remove tudo (CASCADE)
- [ ] GET /integracoes/schemas retorna schemas disponíveis
- [ ] GET /integracoes/schemas/:slug retorna schema específico

---

## 💡 Notas Finais

1. **Sempre fazer backup** antes de executar migrations
2. **Não commitar `.old`** - são temporários
3. **Seguir padrão do hermes-pardini.schema.ts** para novos schemas
4. **Validar campos obrigatórios** - service já valida automaticamente
5. **Usar transações** - create/update já usam
6. **CASCADE DELETE** - configurações são removidas automaticamente

---

## 📞 Próximas Ações Recomendadas

1. ✅ Executar `npm run lint` e corrigir warnings
2. ✅ Executar migrations (com backup!)
3. ✅ Testar fluxo completo com arquivo HTTP
4. ✅ Refatorar Hermes Pardini service/controller
5. ⏳ Criar schemas para outras integrações
6. ⏳ Implementar criptografia de campos sensíveis
7. ⏳ Adicionar testes unitários
8. ⏳ Documentar API com Swagger

---

**Última atualização**: 25/11/2025
**Build status**: ✅ Passando
**Migrations**: ⏳ Pendentes
**Pronto para**: Executar migrations e testar
