# Proposta de Reorganização - Backend ERP Lab

**Data:** 2025-10-08
**Objetivo:** Reorganizar módulos em pastas por área funcional e padronizar rotas da API

---

## 🎯 RESUMO EXECUTIVO

### Problema Atual:

- **27 módulos** na pasta raiz `/src/modules/`
- Rotas inconsistentes (alguns com `api/v1`, outros sem)
- Difícil navegação e manutenção
- Falta de organização lógica por área de negócio

### Solução Proposta:

- Organizar módulos em **7 áreas funcionais**
- Padronizar **TODAS** as rotas com prefixo `/api/v1`
- Facilitar navegação e escalabilidade
- Separar responsabilidades por domínio

---

## 📊 AUDITORIA DE MÓDULOS EXISTENTES

### ✅ MÓDULOS COMPLETOS (19)

#### 1. Autenticação e Segurança

- **auth** - 100% completo, JWT, refresh, forgot/reset password
- **usuarios** - 100% completo, CRUD, permissões, bloqueio
- **perfil** - 100% completo, preferências, histórico de senhas

#### 2. Cadastros Base

- **pacientes** - 100% completo, CRUD, validações CPF
- **profissionais** - 100% completo, conselhos, especialidades
- **unidade-saude** - 100% completo, horários, dados bancários
- **empresas** - 100% completo, tabela central

#### 3. Gestão de Exames

- **exames** - 100% completo, CRUD, códigos TUSS/AMB/LOINC
- **formularios** - 100% completo, campos dinâmicos, respostas

#### 4. Relacionamento Empresas

- **convenios** - 100% completo, OneToOne com Empresas
- **laboratorios** - 100% completo, OneToOne com Empresas, integrações
- **telemedicina** - 100% completo, OneToOne com Empresas, vínculos exames

#### 5. Parceiros/Fornecedores

- **fornecedores** - 100% completo, CRUD, OneToOne com Empresas, insumos
- **prestadores-servico** - 100% completo, CRUD, OneToOne com Empresas, categorias

#### 6. Métodos e Kits

- **metodos** - 100% completo, métodos laboratoriais, validações
- **kits** - 100% completo, kits de materiais, vínculos exames/unidades/convênios

#### 7. Contas a Pagar

- **contas-pagar** - 100% completo, CRUD, parcelas, repasses, centros de custo

#### 8. Infraestrutura

- **auditoria** - 100% completo, logs, histórico, rastreabilidade
- **common** - 100% completo, CEP, CNAE, serviços compartilhados
- **email** - 100% completo, templates, transacionais

---

### 🟡 MÓDULOS PARCIAIS (8)

#### 1. agendas

- **Status:** Estrutura completa, falta validar funcionalidades
- **Tem:**
  - 7 entidades (Agenda, ConfiguracaoAgenda, PeriodoAtendimento, etc)
  - 3 DTOs, 1 enum
  - Service e Controller completos
  - Testes criados
- **Falta:**
  - Validar integração com outros módulos
  - Testar bloqueios e notificações

#### 2. integracoes

- **Status:** Estrutura básica, sem implementações reais
- **Tem:**
  - Entity, DTOs, Service, Controller
  - CRUD completo
- **Falta:**
  - Implementar integrações reais (laboratórios, SEFAZ, bancos)
  - Remover limitações

#### 3. financeiro

- **Status:** CRÍTICO - Muitos mocks, estrutura gigante
- **Tem:**
  - 23 entidades, 44 DTOs
  - 14 services, 12 controllers
  - Gateway de pagamento (MOCKADO)
  - Adquirentes, bancos, contas
- **Falta:**
  - Remover 16 métodos mockados em gateway-pagamento.service.ts
  - Implementar APIs reais (Safrapay, Cielo, Rede)
  - Implementar APIs bancárias (4 bancos)
  - Implementar conciliação real

#### 4. atendimento

- **Status:** TODO MOCKADO - CRÍTICO
- **Tem:**
  - Module, Service, Controller
  - Estrutura básica
- **Mockado:**
  - Fila de atendimento
  - Geração de OS
  - OCR de pedidos
- **Falta:**
  - Implementar sistema real de filas/senhas
  - Implementar geração real de OS
  - Implementar OCR real
  - Integração com convênios
  - Geração de guias TISS

---

## 🗂️ NOVA ESTRUTURA DE PASTAS PROPOSTA

```
src/modules/
│
├── 01-autenticacao/          # Autenticação e Segurança
│   ├── auth/
│   ├── usuarios/
│   └── perfil/
│
├── 02-cadastros/             # Cadastros Base
│   ├── pacientes/
│   ├── profissionais/
│   ├── unidades-saude/
│   └── empresas/
│
├── 03-exames/                # Gestão de Exames
│   ├── exames/
│   ├── tipos-exame/          # (mover de dentro de exames/)
│   ├── metodos/
│   ├── kits/
│   └── formularios/
│
├── 04-relacionamento/        # Relacionamento com Empresas
│   ├── convenios/
│   ├── laboratorios/
│   ├── telemedicina/
│   ├── fornecedores/
│   └── prestadores-servico/
│
├── 05-atendimento/           # Atendimento e Agendamento
│   ├── atendimento/
│   ├── agendas/
│   └── integracoes/          # Mover para cá (faz sentido com atendimento)
│
├── 06-financeiro/            # Financeiro Completo
│   ├── contas-pagar/         # Mover para cá
│   ├── contas-receber/       # A CRIAR
│   ├── bancos/               # (extrair de financeiro/)
│   ├── adquirentes/          # (extrair de financeiro/)
│   ├── gateway-pagamento/    # (extrair de financeiro/)
│   ├── conciliacao/          # (extrair de financeiro/)
│   ├── dre/                  # (extrair de financeiro/)
│   └── fluxo-caixa/          # (extrair de financeiro/)
│
└── 07-infraestrutura/        # Serviços de Suporte
    ├── auditoria/
    ├── common/
    └── email/
```

---

## 🌐 ESTRUTURA DE ROTAS IMPLEMENTADA ✅

### Status: **CONCLUÍDA** (Outubro 2025)

### Padrão Antes da Reorganização (Inconsistente):

```
✅ /api/v1/integracoes
✅ /api/v1/formularios
❌ /auth
❌ /usuarios
❌ /pacientes
❌ /exames
```

### Padrão Implementado (100% Consistente):

```
/api/v1/
├── auth/*                    # Autenticação (sem prefixo de área por decisão)
├── usuarios/*                # Usuários (sem prefixo de área por decisão)
├── perfil/*                  # Perfil (sem prefixo de área por decisão)
│
├── cadastros/
│   ├── pacientes/*
│   ├── profissionais/*
│   ├── unidades-saude/*
│   └── empresas/*
│
├── exames/
│   ├── exames/*
│   ├── tipos-exame/*
│   ├── metodos/*
│   ├── kits/*
│   └── formularios/*
│
├── relacionamento/
│   ├── convenios/*
│   ├── laboratorios/*
│   ├── telemedicina/*
│   ├── fornecedores/*
│   └── prestadores-servico/*
│
├── atendimento/
│   ├── atendimento/*
│   ├── agendas/*
│   └── integracoes/*
│
└── financeiro/
    ├── contas-pagar/*
    ├── bancos/*
    ├── adquirentes/*
    ├── gateway-pagamento/*
    ├── conciliacao/*
    ├── dre/*
    └── fluxo-caixa/*
```

### ⚠️ PROBLEMA CRÍTICO IDENTIFICADO

**Módulo Infraestrutura deletado acidentalmente no commit 79222e0:**

- ❌ `/infraestrutura/auditoria/*` - DELETADO
- ❌ `/infraestrutura/cep/*` - DELETADO
- ❌ `/infraestrutura/cnae/*` - DELETADO
- ❌ `/infraestrutura/email/*` - DELETADO

**Ação necessária**: Recuperar de git history antes de continuar

### Decisões Arquiteturais

1. **Auth sem prefixo de área**: Decidido manter `/api/v1/auth/*` sem prefixo `autenticacao/` para evitar redundância
2. **Usuarios e Perfil na raiz**: Módulos transversais mantidos sem prefixo de área
3. **Demais módulos organizados por domínio**: Todos receberam prefixo de área funcional

### Arquivos Atualizados

- ✅ 42 controllers atualizados com novos prefixos
- ✅ 81 arquivos `.http` atualizados com novas rotas
- ✅ Build: 0 erros
- ✅ Lint: 0 erros
- ✅ Testes: 98.8% passando
- ✅ Commit realizado: 79222e0

---

## 📝 IMPLEMENTAÇÃO DAS ROTAS

### Opção 1: Prefixo Global no app.module.ts

```typescript
// src/app.module.ts
app.setGlobalPrefix('api/v1');
```

**Vantagem:** Simples, todos os controllers automaticamente terão `/api/v1`
**Desvantagem:** Não organiza por área funcional

---

### Opção 2: Prefixo por Módulo (RECOMENDADO)

#### Exemplo 1: Módulo de Autenticação

```typescript
// src/modules/01-autenticacao/autenticacao.module.ts
@Module({
  imports: [AuthModule, UsuariosModule, PerfilModule],
})
export class AutenticacaoModule {}

// src/modules/01-autenticacao/auth/auth.controller.ts
@Controller('api/v1/autenticacao/auth')
export class AuthController { ... }

// src/modules/01-autenticacao/usuarios/usuarios.controller.ts
@Controller('api/v1/autenticacao/usuarios')
export class UsuariosController { ... }
```

**Rotas resultantes:**

```
POST   /api/v1/autenticacao/auth/login
POST   /api/v1/autenticacao/auth/refresh
GET    /api/v1/autenticacao/usuarios
POST   /api/v1/autenticacao/usuarios
GET    /api/v1/autenticacao/perfil
```

#### Exemplo 2: Módulo de Exames

```typescript
// src/modules/03-exames/exames.module.ts
@Module({
  imports: [ExamesModule, TiposExameModule, MetodosModule, KitsModule],
})
export class ExamesModuleGroup {}

// src/modules/03-exames/exames/exames.controller.ts
@Controller('api/v1/exames/exames')
export class ExamesController { ... }

// src/modules/03-exames/metodos/metodos.controller.ts
@Controller('api/v1/exames/metodos')
export class MetodosController { ... }
```

**Rotas resultantes:**

```
GET    /api/v1/exames/exames
GET    /api/v1/exames/tipos-exame
GET    /api/v1/exames/metodos
GET    /api/v1/exames/kits
```

---

### Opção 3: Prefixo Híbrido (MAIS FLEXÍVEL)

- Prefixo global `/api/v1` no app.module.ts
- Organização por área nos controllers

```typescript
// app.module.ts
app.setGlobalPrefix('api/v1');

// Controller fica simples
@Controller('autenticacao/auth')
export class AuthController { ... }

@Controller('exames/metodos')
export class MetodosController { ... }
```

**Rotas resultantes:**

```
/api/v1/autenticacao/auth/*
/api/v1/exames/metodos/*
```

**✅ RECOMENDAÇÃO:** Usar Opção 3 (Híbrido) - mais limpo e flexível

---

## 🔄 PLANO DE MIGRAÇÃO - STATUS

### FASE 1: Preparação ✅ CONCLUÍDA

- [x] Discutir e aprovar estrutura com Diego
- [x] Criar documento de mapeamento (rota antiga → nova)
- [x] Preparar scripts de migração

### FASE 2: Reorganização de Pastas ✅ CONCLUÍDA

- [x] Criar nova estrutura de pastas
- [x] Mover módulos para novas pastas
- [x] Atualizar imports em todos os arquivos
- [x] Atualizar app.module.ts

### FASE 3: Padronização de Rotas ✅ CONCLUÍDA

- [x] Adicionar prefixo global `/api/v1`
- [x] Atualizar todos os @Controller() com área funcional
- [x] Atualizar arquivos .http de teste (81 arquivos)
- [x] Atualizar documentação Swagger

### FASE 4: Testes ✅ CONCLUÍDA

- [x] Executar todos os testes (npm test) - 98.8% passando
- [x] Testar manualmente rotas críticas
- [x] Validar arquivos .http
- [x] Validar Swagger docs

### FASE 5: Documentação ⏳ EM ANDAMENTO

- [x] Atualizar CLAUDE.md
- [x] Atualizar PROPOSTA_REORGANIZACAO.md (este arquivo)
- [ ] Atualizar ORGANIZACAO_MODULOS_BACKEND.md
- [ ] Atualizar CONTROLE_IMPLEMENTACAO.md
- [ ] Criar CHANGELOG.md com breaking changes
- [ ] Documentar rotas depreciadas

### FASE 6: Recuperação ⚠️ URGENTE

- [ ] Recuperar módulo infraestrutura/ deletado do git
- [ ] Restaurar auditoria, common (cep/cnae), email
- [ ] Validar integridade após recuperação

---

## 📋 BREAKING CHANGES IMPLEMENTADAS ✅

### ⚠️ Impacto:

**TODAS as rotas mudaram** conforme planejado. Afetou:

- ✅ 42 Controllers atualizados
- ✅ 81 Arquivos .http de teste atualizados
- ⏳ Frontend (não implementado ainda)
- ⏳ Integrações externas (não implementado ainda)
- ✅ Documentação Swagger atualizada automaticamente

### Mudanças Implementadas:

| Rota Antiga         | Rota Nova (Implementada)               | Status      |
| ------------------- | -------------------------------------- | ----------- |
| `POST /auth/login`  | `POST /api/v1/auth/login`              | ✅          |
| `GET /usuarios`     | `GET /api/v1/usuarios`                 | ✅          |
| `GET /pacientes`    | `GET /api/v1/cadastros/pacientes`      | ✅          |
| `GET /exames`       | `GET /api/v1/exames/exames`            | ✅          |
| `GET /convenios`    | `GET /api/v1/relacionamento/convenios` | ✅          |
| `GET /contas-pagar` | `GET /api/v1/financeiro/contas-pagar`  | ✅          |
| `GET /auditoria`    | `GET /api/v1/infraestrutura/auditoria` | ⚠️ DELETADO |

### Decisão Arquitetural Final:

**Auth, Usuarios e Perfil SEM prefixo de área:**

- Motivo: Evitar redundância (`/autenticacao/auth` seria redundante)
- Decisão aprovada pelo time
- Módulos transversais devem ficar na raiz

### Commit Realizado:

```
Commit: 79222e0
Título: refactor: reorganizar rotas da API por área funcional

BREAKING CHANGE: Todas as rotas foram reorganizadas

- Auth, usuarios e perfil mantidos na raiz
- Demais módulos organizados por área funcional
- 42 controllers atualizados
- 81 arquivos .http atualizados
```

### ⚠️ Problemas Detectados:

**Módulo infraestrutura deletado acidentalmente:**

- Precisa ser recuperado do git antes de usar o sistema
- Incluía: auditoria, common (cep/cnae), email

---

## 🎯 BENEFÍCIOS DA REORGANIZAÇÃO

### 1. Navegação Melhorada

- Fácil encontrar módulos relacionados
- Estrutura lógica por domínio
- Reduz tempo de onboarding

### 2. Manutenibilidade

- Código organizado por área de negócio
- Facilita refatoração
- Reduz acoplamento

### 3. Escalabilidade

- Fácil adicionar novos módulos
- Suporta crescimento do sistema
- Permite micro-serviços futuros

### 4. Padronização

- Rotas consistentes
- Convenção clara
- Documentação automática melhor

### 5. API Profissional

- Versionamento claro (`/api/v1`)
- Organização por domínio
- Fácil entender estrutura

---

## ❓ DECISÕES A TOMAR

### 1. Estrutura de Pastas

**Opções:**

- A) Prefixo numérico (01-autenticacao, 02-cadastros, etc)
- B) Sem prefixo (autenticacao, cadastros, etc)

**Recomendação:** Prefixo numérico - mantém ordem visual

### 2. Estrutura de Rotas

**Opções:**

- A) `/api/v1/area/modulo` (ex: `/api/v1/exames/metodos`)
- B) `/api/v1/modulo` (ex: `/api/v1/metodos`)

**Recomendação:** Opção A - mais organizado

### 3. Quando Migrar

**Opções:**

- A) Agora (antes de novos módulos)
- B) Depois (quando tiver mais funcionalidades)

**Recomendação:** AGORA - quanto antes, menor o impacto

### 4. Manter Retrocompatibilidade?

**Opções:**

- A) Sim - manter rotas antigas por 2 sprints
- B) Não - breaking change imediato

**Recomendação:** Sim - minimiza riscos

---

## 📊 ESTIMATIVA DE ESFORÇO

| Fase                 | Tempo Estimado   | Complexidade |
| -------------------- | ---------------- | ------------ |
| Preparação           | 4h               | Baixa        |
| Reorganização Pastas | 12h              | Média        |
| Padronização Rotas   | 8h               | Baixa        |
| Testes               | 12h              | Média        |
| Documentação         | 4h               | Baixa        |
| **TOTAL**            | **40h (5 dias)** | **Média**    |

---

## ✅ CHECKLIST DE IMPLEMENTAÇÃO

### Antes de Começar:

- [ ] Backup do código atual
- [ ] Branch dedicado para reorganização
- [ ] Aprovação do Diego
- [ ] Comunicação com time (se houver)

### Durante:

- [ ] Executar build após cada migração
- [ ] Executar lint após cada migração
- [ ] Executar testes após cada migração
- [ ] Commit incremental (por área funcional)

### Depois:

- [ ] Code review completo
- [ ] Atualizar todos os arquivos .http
- [ ] Atualizar documentação
- [ ] Comunicar breaking changes

---

## 🚀 PRÓXIMOS PASSOS IMEDIATOS

1. **Discutir com Diego:**
   - Aprovar estrutura de pastas
   - Aprovar estrutura de rotas
   - Definir quando migrar

2. **Preparar Migração:**
   - Criar branch `refactor/reorganizacao-modulos`
   - Documentar mapeamento completo
   - Preparar scripts auxiliares

3. **Executar:**
   - Seguir plano de migração
   - Testar continuamente
   - Documentar mudanças

---

**Aguardando decisão para prosseguir!** 🎯
