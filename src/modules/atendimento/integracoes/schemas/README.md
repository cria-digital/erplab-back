# 📋 Schemas de Integrações

Este diretório contém os **schemas** (definições de campos) das integrações disponíveis no sistema.

## 🎯 Conceito

- **Schema** = Define QUAIS campos uma integração precisa
- **Instância** = Configuração específica com VALORES preenchidos

### Exemplo

```typescript
// Schema (no código)
HERMES_PARDINI_SCHEMA = {
  slug: 'hermes-pardini',
  campos: [
    { chave: 'usuario', tipo: 'string', obrigatorio: true },
    { chave: 'senha', tipo: 'password', obrigatorio: true }
  ]
}

// Instância (no banco)
Integracao {
  template_slug: 'hermes-pardini',
  nome_instancia: 'HP - Unidade Centro',
  configuracoes: [
    { chave: 'usuario', valor: 'hp_user_centro' },
    { chave: 'senha', valor: '[criptografado]' }
  ]
}
```

## 📁 Estrutura

```
schemas/
├── types.ts                      # Tipos TypeScript
├── index.ts                      # Registro e helpers
├── hermes-pardini.schema.ts      # Schema Hermes Pardini
├── santander.schema.ts           # (futuro)
└── README.md                     # Esta documentação
```

## ✨ Como Adicionar Nova Integração

### 1. Criar arquivo do schema

```typescript
// schemas/nova-integracao.schema.ts

import { IntegracaoSchema, TipoCampo, ProtocoloIntegracao } from './types';
import { TipoIntegracao } from '../entities/integracao.entity';

export const NOVA_INTEGRACAO_SCHEMA: IntegracaoSchema = {
  slug: 'nova-integracao',
  nome: 'Nome da Integração',
  descricao: 'Descrição detalhada',
  versao: '1.0.0',

  tipos_contexto: [TipoIntegracao.BANCO],
  protocolo: ProtocoloIntegracao.REST,

  campos: [
    {
      chave: 'api_key',
      label: 'API Key',
      tipo: TipoCampo.STRING,
      obrigatorio: true,
      criptografar: true, // ← Criptografa automaticamente
    },
    {
      chave: 'ambiente',
      label: 'Ambiente',
      tipo: TipoCampo.SELECT,
      obrigatorio: true,
      valorPadrao: 'sandbox',
      opcoes: [
        { valor: 'sandbox', label: 'Sandbox' },
        { valor: 'producao', label: 'Produção' },
      ],
    },
  ],

  ativo: true,
};
```

### 2. Registrar no index.ts

```typescript
// schemas/index.ts

import { NOVA_INTEGRACAO_SCHEMA } from './nova-integracao.schema';

export const INTEGRACOES_SCHEMAS = {
  'hermes-pardini': HERMES_PARDINI_SCHEMA,
  'nova-integracao': NOVA_INTEGRACAO_SCHEMA, // ← Adicionar aqui
};

export { NOVA_INTEGRACAO_SCHEMA } from './nova-integracao.schema';
```

### 3. Pronto! 🎉

Agora a integração já está disponível:

- ✅ Aparece em `GET /integracoes-schemas`
- ✅ Front-end pode renderizar campos dinamicamente
- ✅ Backend valida automaticamente
- ✅ Campos marcados com `criptografar: true` são protegidos

## 🔧 Tipos de Campos Disponíveis

```typescript
enum TipoCampo {
  STRING      // Input texto simples
  NUMBER      // Input numérico
  PASSWORD    // Input senha (dots)
  EMAIL       // Input email com validação
  URL         // Input URL com validação
  SELECT      // Dropdown com opções
  CHECKBOX    // Checkbox on/off
  TEXTAREA    // Textarea multi-linha
  JSON        // Editor JSON
}
```

## 📊 Propriedades do Campo

```typescript
interface CampoSchema {
  // OBRIGATÓRIOS
  chave: string;           // Chave única (ex: 'usuario')
  label: string;           // Label exibido (ex: 'Usuário')
  tipo: TipoCampo;         // Tipo do campo
  obrigatorio: boolean;    // Campo obrigatório?

  // OPCIONAIS - Principais
  valorPadrao?: any;       // Valor padrão
  opcoes?: OpcaoSelect[];  // Opções do select
  criptografar?: boolean;  // Criptografa ao salvar?

  // OPCIONAIS - Validação
  min?: number;            // Valor mínimo/tamanho (number/string)
  max?: number;            // Valor máximo/tamanho (number/string)
}
```

## 🔐 Criptografia Automática

Campos com `criptografar: true` são automaticamente criptografados ao salvar:

```typescript
{
  chave: 'senha',
  tipo: TipoCampo.PASSWORD,
  criptografar: true, // ← Criptografa automaticamente
}

// Banco de dados:
// chave: 'senha'
// valor: '[hash_criptografado_com_crypto_service]'
```

## 📖 Helpers Disponíveis

```typescript
import {
  getSchemaBySlug,
  getAllSchemas,
  getSchemasByTipo
} from './schemas';

// Buscar por slug
const schema = getSchemaBySlug('hermes-pardini');

// Listar todos
const todos = getAllSchemas();

// Filtrar por tipo
const labSchemas = getSchemasByTipo(TipoIntegracao.LABORATORIO_APOIO);
```

## ✅ Validações Automáticas

O backend valida automaticamente:

- ✅ Campos obrigatórios foram enviados?
- ✅ Tipos corretos (string, number, etc)?
- ✅ Valores dentro dos limites (min, max)?
- ✅ Regex pattern válido?
- ✅ Opções de select válidas?

```typescript
// Exemplo de erro automático:
POST /integracoes
{
  "template_slug": "hermes-pardini",
  "configuracoes": {
    "usuario": "hp_user"
    // Faltou 'senha' (obrigatório!)
  }
}

// Response 400:
{
  "message": "Campos obrigatórios faltando",
  "campos": ["senha"]
}
```

## 🚀 Uso no Front-end

```typescript
// 1. Buscar schemas disponíveis
GET /api/v1/integracoes-schemas?tipo=CONVENIOS

// 2. Usuário seleciona "Hermes Pardini"
GET /api/v1/integracoes-schemas/hermes-pardini/campos

// 3. Renderizar campos dinamicamente
Response: {
  campos: [
    {
      chave: 'usuario',
      label: 'Usuário da API',
      tipo: 'string',
      obrigatorio: true,
      // ...
    }
  ]
}

// 4. Salvar com validação automática
POST /api/v1/integracoes
{
  "template_slug": "hermes-pardini",
  "configuracoes": { ... }
}
```

## 📝 Boas Práticas

1. **Slugs**: Use kebab-case (`hermes-pardini`, não `HermesPardini`)
2. **Chaves**: Use snake_case ou camelCase consistentemente
3. **Grupos**: Organize campos em grupos lógicos
4. **Ordem**: Use múltiplos de 10 (10, 20, 30) para facilitar inserções futuras
5. **Criptografia**: SEMPRE marque senhas/tokens como `criptografar: true`
6. **Documentação**: Preencha `descricao`, `help` e `documentacao_url`
7. **Opções Select**: Sempre forneça `descricao` nas opções
8. **Versão**: Incremente quando mudar campos obrigatórios

## 🔍 Exemplos Reais

Ver arquivo `hermes-pardini.schema.ts` para exemplo completo.
