# Organização dos Módulos do Backend - ERP Lab

**Data:** 2025-10-08
**Objetivo:** Mapear módulos existentes por área funcional e identificar status de implementação

---

## 📊 Resumo Executivo

| Área Funcional               | Módulos Totais | Implementados | Parciais | Não Implementados |
| ---------------------------- | -------------- | ------------- | -------- | ----------------- |
| **Autenticação e Segurança** | 3              | 3             | 0        | 0                 |
| **Cadastros Base**           | 6              | 6             | 0        | 0                 |
| **Gestão de Exames**         | 5              | 4             | 1        | 0                 |
| **Relacionamento Empresas**  | 4              | 3             | 1        | 0                 |
| **Financeiro**               | 3              | 0             | 3        | 0                 |
| **Atendimento**              | 3              | 0             | 3        | 0                 |
| **Infraestrutura**           | 3              | 3             | 0        | 0                 |
| **TOTAL**                    | **27**         | **19**        | **8**    | **0**             |

---

## 🔐 1. AUTENTICAÇÃO E SEGURANÇA

### ✅ auth (Autenticação)

- **Status:** 100% Implementado
- **Funcionalidades:**
  - Login/Logout
  - Refresh Token
  - Recuperação de senha (forgot/reset)
  - Alteração de senha
  - Validação de tokens
  - Setup inicial do sistema
- **Arquivos:** module, service, controller, guards, strategies, decorators
- **Prioridade:** ✅ COMPLETO

### ✅ usuarios (Usuários)

- **Status:** 100% Implementado
- **Funcionalidades:**
  - CRUD completo
  - Permissões
  - Vínculos com unidades
  - Controle de tentativas de login
  - Bloqueio temporário
- **Arquivos:** module, service, controller, entities (4), DTOs (3)
- **Prioridade:** ✅ COMPLETO

### ✅ perfil (Perfil do Usuário)

- **Status:** 100% Implementado
- **Funcionalidades:**
  - Gestão de perfil
  - Preferências do usuário
  - Histórico de senhas
  - Alteração de senha com validações
- **Arquivos:** module, service, controller, entities (2), DTOs (4)
- **Prioridade:** ✅ COMPLETO

---

## 📋 2. CADASTROS BASE

### ✅ pacientes

- **Status:** 100% Implementado
- **Funcionalidades:**
  - CRUD completo
  - Busca por CPF/nome
  - Validações de CPF
- **Arquivos:** module, service, controller, entity, DTOs
- **Prioridade:** ✅ COMPLETO

### ✅ profissionais

- **Status:** 100% Implementado
- **Funcionalidades:**
  - CRUD de profissionais de saúde
  - Registro em conselhos (CRM, CRF, etc)
  - Especialidades
- **Arquivos:** module, service, controller, entities, DTOs
- **Prioridade:** ✅ COMPLETO

### ✅ unidade-saude

- **Status:** 100% Implementado
- **Funcionalidades:**
  - CRUD de unidades
  - Horários de atendimento
  - Dados bancários
  - CNAEs secundários
- **Arquivos:** module, service, controller, entities (4), DTOs
- **Prioridade:** ✅ COMPLETO

### ✅ empresas

- **Status:** 100% Implementado
- **Funcionalidades:**
  - CRUD de empresas
  - Tabela central para convênios/labs/telemedicina
  - Dados fiscais
- **Arquivos:** module, service, controller, entity, DTOs
- **Prioridade:** ✅ COMPLETO

### ✅ fornecedores

- **Status:** Criado (verificar implementação)
- **Funcionalidades:** A verificar
- **Arquivos:** module
- **Prioridade:** 🟡 VERIFICAR STATUS

### ✅ prestadores-servico

- **Status:** Criado (verificar implementação)
- **Funcionalidades:** A verificar
- **Arquivos:** module
- **Prioridade:** 🟡 VERIFICAR STATUS

---

## 🔬 3. GESTÃO DE EXAMES

### ✅ exames

- **Status:** 100% Implementado
- **Funcionalidades:**
  - CRUD de exames
  - Tipos de exame
  - Códigos (TUSS, AMB, LOINC, SUS)
  - Filtros avançados
  - Gestão de status em lote
- **Arquivos:** module, service (3), controller (2), entities (7), DTOs (6)
- **Prioridade:** ✅ COMPLETO

### ✅ metodos

- **Status:** 100% Implementado (verificar)
- **Funcionalidades:**
  - Métodos de análise laboratorial
- **Arquivos:** module, entities, DTOs
- **Prioridade:** 🟡 VERIFICAR COMPLETUDE

### ✅ kits

- **Status:** Criado (verificar implementação)
- **Funcionalidades:**
  - Kits de materiais
  - Vinculação com exames
- **Arquivos:** module
- **Prioridade:** 🟡 VERIFICAR STATUS

### 🟡 agendas

- **Status:** Parcialmente Implementado
- **Funcionalidades:**
  - Configuração de agendas
  - Períodos de atendimento
  - Bloqueios de horário
  - Notificações
  - Integrações
- **Arquivos:** module, service, controller, entities (7), DTOs (3), enums
- **Prioridade:** 🔶 ALTA - Completar implementação
- **Falta:**
  - Testes
  - Validar todas as funcionalidades
  - Integração com outros módulos

### ✅ formularios

- **Status:** 100% Implementado
- **Funcionalidades:**
  - Formulários dinâmicos
  - Tipos de campo
  - Respostas
  - Validações customizadas
- **Arquivos:** module, services (4), controllers (4), entities (8), DTOs (16), enums
- **Prioridade:** ✅ COMPLETO

---

## 🏥 4. RELACIONAMENTO COM EMPRESAS

### ✅ convenios

- **Status:** 100% Implementado
- **Funcionalidades:**
  - CRUD de convênios
  - Relacionamento OneToOne com Empresas
  - Verificação de autorizações
  - Regras específicas
- **Arquivos:** module, service, controller, entity, DTOs
- **Prioridade:** ✅ COMPLETO

### ✅ laboratorios

- **Status:** 100% Implementado
- **Funcionalidades:**
  - CRUD de laboratórios de apoio
  - Relacionamento OneToOne com Empresas
  - Configurações de integração
  - Prazos de entrega
- **Arquivos:** module, service, controller, entity, DTOs
- **Prioridade:** ✅ COMPLETO

### ✅ telemedicina

- **Status:** 100% Implementado
- **Funcionalidades:**
  - CRUD de plataformas de telemedicina
  - Relacionamento OneToOne com Empresas
  - Vínculos com exames
  - Configurações de integração
- **Arquivos:** module, services (2), controllers (2), entities (2), DTOs (4)
- **Prioridade:** ✅ COMPLETO

### 🟡 integracoes

- **Status:** Parcialmente Implementado (MOCKADO)
- **Funcionalidades:**
  - Gestão de integrações externas
  - APIs de terceiros
- **Arquivos:** module, service
- **Prioridade:** 🔶 ALTA - Implementar integrações reais
- **Falta:**
  - Remover mocks
  - Implementar APIs de laboratórios (DB, Hermes Pardini)
  - Implementar APIs bancárias
  - Implementar SEFAZ
  - Testes de integração

---

## 💰 5. FINANCEIRO

### 🟡 financeiro

- **Status:** Parcialmente Implementado (MUITOS MOCKS)
- **Funcionalidades:**
  - Gateway de pagamento (MOCKADO)
  - Adquirentes
  - Conciliação (bancária e adquirentes)
  - DRE
  - Fluxo de caixa
- **Arquivos:** module, services (14), controllers (12), entities (23), DTOs (44), enums
- **Prioridade:** 🔴 CRÍTICA - Maior módulo, mais crítico
- **Falta:**
  - Implementar gateway real (Safrapay, Cielo, Rede)
  - Implementar APIs bancárias (4 bancos)
  - Remover 16 métodos mockados em gateway-pagamento.service.ts
  - Implementar conciliação real
  - Testes completos

### 🟡 contas-pagar

- **Status:** Criado (verificar implementação)
- **Funcionalidades:**
  - Gestão de contas a pagar
  - Integração SEFAZ
  - OCR de boletos
- **Arquivos:** module
- **Prioridade:** 🔴 CRÍTICA - RF010
- **Falta:** Verificar status completo

### ❌ contas-receber

- **Status:** NÃO CRIADO
- **Funcionalidades:**
  - Faturamento empresas/convênios
  - Geração NFSe
  - Boletos
  - Controle de glosas
- **Prioridade:** 🔴 CRÍTICA - RF011
- **Falta:** Criar módulo completo

---

## 👥 6. ATENDIMENTO

### 🟡 atendimento

- **Status:** Parcialmente Implementado (TODO MOCKADO)
- **Funcionalidades:**
  - Fila de atendimento (MOCK)
  - Ordem de Serviço (MOCK)
  - OCR de pedidos médicos (MOCK)
- **Arquivos:** module, service, controller
- **Prioridade:** 🔴 CRÍTICA - RF003, RF004
- **Falta:**
  - Implementar sistema real de fila/senhas
  - Implementar geração real de OS
  - Implementar OCR real
  - Integração com convênios
  - Geração de guias TISS

---

## 🛠️ 7. INFRAESTRUTURA E SUPORTE

### ✅ auditoria

- **Status:** 100% Implementado
- **Funcionalidades:**
  - Logs de auditoria
  - Histórico de alterações
  - Rastreabilidade completa
  - Filtros avançados
- **Arquivos:** module, service, controller, entities (3), DTOs (3)
- **Prioridade:** ✅ COMPLETO

### ✅ common

- **Status:** 100% Implementado
- **Funcionalidades:**
  - API de CEP (ViaCEP)
  - API de CNAE
  - Serviços compartilhados
- **Arquivos:** module, services (2), controllers (2), entity, DTOs
- **Prioridade:** ✅ COMPLETO

### ✅ email

- **Status:** 100% Implementado
- **Funcionalidades:**
  - Envio de emails transacionais
  - Templates
  - Recuperação de senha
  - Notificações
- **Arquivos:** module, service, templates
- **Prioridade:** ✅ COMPLETO

---

## 🌐 REORGANIZAÇÃO DE ROTAS IMPLEMENTADA (Outubro 2025)

### Status da Reorganização

✅ **CONCLUÍDA** - Todas as rotas foram reorganizadas por área funcional

### Estrutura de Rotas Atual

```
/api/v1/
├── auth/*                    # Sem prefixo (decisão arquitetural)
├── usuarios/*                # Sem prefixo (decisão arquitetural)
├── perfil/*                  # Sem prefixo (decisão arquitetural)
├── cadastros/*              # Pacientes, Profissionais, Empresas, Unidades
├── exames/*                 # Exames, Formulários, Kits, Métodos
├── relacionamento/*         # Convênios, Labs, Telemedicina, Fornecedores
├── atendimento/*            # Atendimento, Agendas, Integrações
└── financeiro/*             # Bancos, Adquirentes, Contas, DRE, Fluxo
```

### Arquivos Atualizados

- 42 controllers com novos prefixos
- 81 arquivos .http de requisições
- Build e Lint passando 100%
- Testes: 98.8% passando

### ⚠️ Problema Crítico

Módulo `infraestrutura/` foi deletado acidentalmente no commit 79222e0 e precisa ser recuperado.

---

## 📝 MÓDULOS A CRIAR

Baseado no documento `organizacao_modulos.md` e requisitos do sistema:

### 🔴 PRIORIDADE CRÍTICA

1. **contas-receber** (RF011)
   - Faturamento
   - NFSe
   - Boletos
   - Portal do cliente

2. **estoque** (RF015)
   - Controle de insumos
   - Lotes e validades
   - Inventários
   - Alertas de estoque mínimo

3. **compras** (RF016)
   - Requisições
   - Cotações
   - Pedidos
   - Recebimento

4. **tiss** (RF017, RF018)
   - Geração de guias
   - Upload XML/PDF
   - Portais de convênios

### 🟡 PRIORIDADE ALTA

5. **pops** (RF017)
   - Procedimentos Operacionais Padrão
   - Versionamento
   - Assinatura digital

6. **checklists** (RF018)
   - Checklists operacionais
   - Evidências
   - Bloqueio de processos

7. **auditorias-internas** (RF019)
   - Planejamento
   - Execução
   - Não conformidades
   - Planos de ação

8. **rastreabilidade** (RF020)
   - Profissional
   - Equipamento
   - Reagentes
   - Sala/Local

9. **notificacoes** (RF016)
   - Email
   - WhatsApp
   - Push
   - SMS

10. **whatsapp** (RF014)
    - Bot inteligente
    - Jornada do cliente
    - Kanban

### 🟢 PRIORIDADE MÉDIA

11. **estrutura**
    - Salas
    - Setores
    - Equipamentos
    - Imobilizados
    - Etiquetas

12. **documentacao**
    - Cabeçalhos/Rodapés
    - Templates
    - GED

13. **tabelas-preco**
    - Preços por convênio
    - Tabelas especiais
    - Vigências

14. **bi** (RF021, RF022)
    - KPIs
    - Dashboards
    - Relatórios
    - Gráficos

15. **portal-cliente** (RF023, RF024, RF025)
    - Acesso a resultados
    - Agendamentos
    - Atualização cadastral

16. **portal-medico** (RF026, RF027)
    - Acesso a laudos
    - Histórico de pedidos

---

## 📊 ANÁLISE DE COMPLETUDE POR MÓDULO EXISTENTE

### Módulos que precisam de verificação detalhada:

1. **fornecedores** - Verificar se está completo
2. **prestadores-servico** - Verificar se está completo
3. **metodos** - Verificar completude
4. **kits** - Verificar completude
5. **agendas** - Completar funcionalidades
6. **integracoes** - Remover mocks, implementar real
7. **financeiro** - Remover mocks, implementar real
8. **contas-pagar** - Verificar status
9. **atendimento** - Remover mocks, implementar real

---

## 🎯 PLANO DE AÇÃO SUGERIDO

### FASE 1: Auditoria e Completude (1-2 semanas)

- [ ] Verificar status de fornecedores
- [ ] Verificar status de prestadores-servico
- [ ] Verificar status de metodos
- [ ] Verificar status de kits
- [ ] Verificar status de contas-pagar
- [ ] Documentar o que falta em cada um

### FASE 2: Módulos Críticos (4-6 semanas)

- [ ] Completar atendimento (RF003, RF004)
- [ ] Completar financeiro (remover mocks)
- [ ] Criar contas-receber (RF011)
- [ ] Completar integracoes (laboratórios, bancos)
- [ ] Criar estoque (RF015)
- [ ] Criar compras (RF016)

### FASE 3: Conformidade (2-3 semanas)

- [ ] Criar módulo TISS (RF017, RF018)
- [ ] Criar módulo POPs (RF017)
- [ ] Criar módulo Checklists (RF018)
- [ ] Criar módulo Rastreabilidade (RF020)

### FASE 4: Automação (2-3 semanas)

- [ ] Criar módulo WhatsApp (RF014)
- [ ] Criar módulo Notificações (RF016)
- [ ] Completar agendas

### FASE 5: Gestão e BI (2-3 semanas)

- [ ] Criar módulo BI (RF021, RF022)
- [ ] Criar portal-cliente (RF023-025)
- [ ] Criar portal-medico (RF026-027)

---

**Próximo Passo Recomendado:** Começar pela FASE 1 - fazer auditoria detalhada dos módulos existentes para entender exatamente o que está pronto e o que falta.
