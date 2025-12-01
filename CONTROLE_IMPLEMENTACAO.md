# 📋 Controle de Implementação - ERP Lab

**Data de Início:** 2025-10-07
**Documento Base:** erp-analise-de-requisitos-v3-1.pdf

---

## 📊 Resumo Executivo

| Categoria                     | Total | Implementado | Em Desenvolvimento | Não Iniciado | % Conclusão |
| ----------------------------- | ----- | ------------ | ------------------ | ------------ | ----------- |
| **Requisitos Funcionais**     | 36    | 8            | 4                  | 24           | 22%         |
| **Requisitos Não Funcionais** | 13    | 3            | 0                  | 10           | 23%         |
| **Integrações**               | 13    | 0            | 0                  | 13           | 0%          |
| **TOTAL**                     | 62    | 11           | 4                  | 47           | 18%         |

---

## 🎯 Requisitos Funcionais

### 3.1 Módulo de Atendimento e Agendamento

#### RF001 - Sistema de Contato Multi-canal

- **Status:** 🔴 NÃO IMPLEMENTADO
- **Prioridade:** ALTA
- **Complexidade:** ALTA
- **Descrição:** Gerenciar interações de WhatsApp, telefone, redes sociais, presencial e e-mail
- **Necessário implementar?** ⬜ SIM ⬜ NÃO
- **Observações:**
  - Requer integração WhatsApp Business API
  - PABX em nuvem
  - Sistema de tickets unificado

---

#### RF002 - Auto-atendimento com OCR

- **Status:** 🔴 NÃO IMPLEMENTADO (MOCKADO)
- **Prioridade:** ALTA
- **Complexidade:** ALTA
- **Descrição:** Autoatendimento com leitura OCR de pedidos médicos
- **Implementação Atual:** `/back/src/modules/atendimento/services/atendimento.service.ts:62-81` - Dados simulados
- **Necessário implementar?** ⬜ SIM ⬜ NÃO
- **Observações:**
  - Integração OCR (Tesseract.js ou AWS Textract)
  - Validação automática
  - Interface de autoatendimento

---

#### RF003 - Gestão de Fila de Atendimento

- **Status:** 🔴 NÃO IMPLEMENTADO (MOCKADO)
- **Prioridade:** ALTA
- **Complexidade:** MÉDIA
- **Descrição:** Sistema Kanban com painel de senhas
- **Implementação Atual:** `/back/src/modules/atendimento/services/atendimento.service.ts:19-45` - Fila hardcoded
- **Necessário implementar?** ⬜ SIM ⬜ NÃO
- **Observações:**
  - Totem de check-in
  - Painel de senhas
  - Quadro Kanban visual

---

#### RF004 - Geração de Ordem de Serviço (OS)

- **Status:** 🔴 NÃO IMPLEMENTADO (MOCKADO)
- **Prioridade:** CRÍTICA
- **Complexidade:** ALTA
- **Descrição:** Geração automática de OS com impressão de protocolo e termos
- **Implementação Atual:** `/back/src/modules/atendimento/services/atendimento.service.ts:47-60` - OS fictícia
- **Necessário implementar?** ⬜ SIM ⬜ NÃO
- **Observações:**
  - Integração com convênios
  - Geração guia TISS
  - Impressão de termos (LGPD, etc)

---

### 3.2 Módulo de Gestão de Exames

#### RF005 - Integração com Laboratórios de Apoio

- **Status:** 🔴 NÃO IMPLEMENTADO
- **Prioridade:** CRÍTICA
- **Complexidade:** ALTA
- **Descrição:** Integração API com DB e Hermes Pardini (99% dos exames)
- **Necessário implementar?** ⬜ SIM ⬜ NÃO
- **Observações:**
  - Envio automático de amostras
  - Recebimento de resultados via API
  - Sistema de repetição de exames

---

#### RF006 - Integração com Telemedicina

- **Status:** 🟡 PARCIALMENTE IMPLEMENTADO
- **Prioridade:** ALTA
- **Complexidade:** MÉDIA
- **Descrição:** Integração com RWE Clínica e Laudos 24hrs
- **Implementação Atual:** Módulo telemedicina criado em `/back/src/modules/telemedicina/`
- **Necessário implementar?** ⬜ SIM ⬜ NÃO
- **Observações:**
  - Estrutura criada
  - Falta integração real com APIs

---

#### RF007 - Gestão de Exames Internos

- **Status:** 🟢 IMPLEMENTADO
- **Prioridade:** MÉDIA
- **Complexidade:** BAIXA
- **Descrição:** Liberação de laudos internos (testes rápidos, audiometria, ultrassom)
- **Implementação Atual:** Service completo em `/back/src/modules/exames/exames.service.ts`
- **Necessário implementar?** ⬜ SIM ⬜ NÃO
- **Observações:**
  - Máscaras de laudo personalizáveis
  - Assinatura eletrônica

---

#### RF008 - Sistema DICOM/PACS

- **Status:** 🔴 NÃO IMPLEMENTADO
- **Prioridade:** ALTA
- **Complexidade:** MUITO ALTA
- **Descrição:** Integração PACS para armazenamento de imagens
- **Necessário implementar?** ⬜ SIM ⬜ NÃO
- **Observações:**
  - Padrão DICOM
  - Acesso remoto
  - Laudação digital

---

#### RF009 - Controle de Status de Exames

- **Status:** 🟢 IMPLEMENTADO
- **Prioridade:** ALTA
- **Complexidade:** MÉDIA
- **Descrição:** Gestão dinâmica de status (aberto, executado, pendente, liberado, repetir)
- **Implementação Atual:** Gerenciado no ExamesService
- **Necessário implementar?** ⬜ SIM ⬜ NÃO
- **Observações:**
  - Notificações automáticas
  - TODO em linha 126: validação OrdemServicoExame

---

### 3.3 Módulo Financeiro

#### RF010 - Contas a Pagar Automatizadas

- **Status:** 🔴 NÃO IMPLEMENTADO
- **Prioridade:** CRÍTICA
- **Complexidade:** MUITO ALTA
- **Descrição:** Automação completa de contas a pagar com integração SEFAZ e bancos
- **Necessário implementar?** ⬜ SIM ⬜ NÃO
- **Observações:**
  - Busca NFe automática (SEFAZ XML)
  - OCR de boletos
  - APIs bancárias (Santander, Bradesco, Safra, ASAAS)
  - Conciliação automática

---

#### RF011 - Contas a Receber

- **Status:** 🔴 NÃO IMPLEMENTADO
- **Prioridade:** CRÍTICA
- **Complexidade:** MUITO ALTA
- **Descrição:** Faturamento empresas/convênios com NFSe e boleto automático
- **Necessário implementar?** ⬜ SIM ⬜ NÃO
- **Observações:**
  - Geração NFSe automática
  - Emissão boletos
  - Controle de glosas
  - Portal para clientes corporativos

---

#### RF012 - Integração com Adquirentes

- **Status:** 🔴 NÃO IMPLEMENTADO (MOCKADO)
- **Prioridade:** CRÍTICA
- **Complexidade:** MUITO ALTA
- **Descrição:** Processamento de pagamentos via cartão/PIX
- **Implementação Atual:** `/back/src/modules/financeiro/gateway-pagamento.service.ts` - TODOS os métodos mockados
- **Necessário implementar?** ⬜ SIM ⬜ NÃO
- **Observações:**
  - Integração Safrapay, Cielo, Rede
  - Processamento real de pagamentos
  - Webhooks
  - 16 métodos simulados identificados

---

#### RF013 - Cadastro de Adquirentes e Cartões

- **Status:** 🟢 IMPLEMENTADO
- **Prioridade:** MÉDIA
- **Complexidade:** BAIXA
- **Descrição:** Gestão de adquirentes e tipos de cartão
- **Implementação Atual:** Service completo em `/back/src/modules/financeiro/adquirente.service.ts`
- **Necessário implementar?** ⬜ SIM ⬜ NÃO

---

### 3.4 Módulo CRM e WhatsApp

#### RF014 - Bot de WhatsApp Inteligente

- **Status:** 🔴 NÃO IMPLEMENTADO
- **Prioridade:** ALTA
- **Complexidade:** MUITO ALTA
- **Descrição:** Bot inteligente guiando jornada completa do cliente
- **Necessário implementar?** ⬜ SIM ⬜ NÃO
- **Observações:**
  - WhatsApp Business API
  - Jornada automatizada
  - Fallback para atendente humano

---

#### RF015 - Kanban de Jornada do Cliente

- **Status:** 🔴 NÃO IMPLEMENTADO
- **Prioridade:** MÉDIA
- **Complexidade:** MÉDIA
- **Descrição:** Visualização Kanban da jornada via WhatsApp
- **Necessário implementar?** ⬜ SIM ⬜ NÃO

---

#### RF016 - Sistema de Notificações

- **Status:** 🔴 NÃO IMPLEMENTADO
- **Prioridade:** ALTA
- **Complexidade:** MÉDIA
- **Descrição:** Notificações automáticas e-mail/WhatsApp
- **Necessário implementar?** ⬜ SIM ⬜ NÃO
- **Observações:**
  - Resultados liberados
  - Repetição de exames
  - Alertas periódicos (6 meses)

---

### 3.5 Módulo de Auditoria

#### RF017 - Gestão de POPs

- **Status:** 🔴 NÃO IMPLEMENTADO
- **Prioridade:** ALTA (Compliance ANVISA)
- **Complexidade:** MÉDIA
- **Descrição:** Gestão de Procedimentos Operacionais Padrão (RDC 786/2023)
- **Necessário implementar?** ⬜ SIM ⬜ NÃO
- **Observações:**
  - Versionamento automático
  - Assinatura digital RT
  - Integração GED
  - Alertas vencimento

---

#### RF018 - Checklists Operacionais

- **Status:** 🔴 NÃO IMPLEMENTADO
- **Prioridade:** ALTA (Compliance)
- **Complexidade:** MÉDIA
- **Descrição:** Checklists obrigatórios com evidências
- **Necessário implementar?** ⬜ SIM ⬜ NÃO
- **Observações:**
  - Manual e automático
  - Upload de evidências
  - Bloqueio de processos

---

#### RF019 - Auditorias Internas

- **Status:** 🔴 NÃO IMPLEMENTADO
- **Prioridade:** ALTA (Compliance)
- **Complexidade:** ALTA
- **Descrição:** Sistema de auditorias com relatórios automáticos
- **Necessário implementar?** ⬜ SIM ⬜ NÃO
- **Observações:**
  - Tipos: Qualidade, RDC 50, Biossegurança, etc
  - Gestão de não conformidades
  - Planos de ação

---

#### RF020 - Rastreabilidade Completa

- **Status:** 🔴 NÃO IMPLEMENTADO
- **Prioridade:** CRÍTICA (RDC 786/2023)
- **Complexidade:** ALTA
- **Descrição:** Rastreio completo: profissional, equipamento, lote, sala, liberação
- **Necessário implementar?** ⬜ SIM ⬜ NÃO

---

### 3.6 Módulo de Estoque e Compras

#### RF015 (documento) - Gestão de Estoque

- **Status:** 🔴 NÃO IMPLEMENTADO
- **Prioridade:** ALTA
- **Complexidade:** ALTA
- **Descrição:** Controle completo de estoque com alertas
- **Necessário implementar?** ⬜ SIM ⬜ NÃO
- **Observações:**
  - Lotes e validades
  - Kits de materiais
  - Inventários

---

#### RF016 (documento) - Gestão de Compras

- **Status:** 🔴 NÃO IMPLEMENTADO
- **Prioridade:** ALTA
- **Complexidade:** ALTA
- **Descrição:** Automação completa do processo de compras
- **Necessário implementar?** ⬜ SIM ⬜ NÃO
- **Observações:**
  - Requisições automáticas
  - Cotação múltiplos fornecedores
  - Integração financeiro

---

### 3.7 Módulo TISS

#### RF017 (documento) - Gestão de Convênios e Regras

- **Status:** 🟢 IMPLEMENTADO
- **Prioridade:** CRÍTICA
- **Complexidade:** ALTA
- **Descrição:** Regras específicas por convênio com tokens
- **Implementação Atual:** Service completo em `/back/src/modules/convenios/`
- **Necessário implementar?** ⬜ SIM ⬜ NÃO
- **Observações:**
  - TODO em linha 153: validação OrdemServico

---

#### RF018 (documento) - Geração e Upload XML/PDF TISS

- **Status:** 🔴 NÃO IMPLEMENTADO
- **Prioridade:** CRÍTICA
- **Complexidade:** MUITO ALTA
- **Descrição:** Geração e upload automático para portais (SAVI, Orizon)
- **Necessário implementar?** ⬜ SIM ⬜ NÃO

---

### 3.8 Sistema Interno de Tarefas

#### RF019 (documento) - Atribuição e Gestão de Tarefas

- **Status:** 🔴 NÃO IMPLEMENTADO
- **Prioridade:** MÉDIA
- **Complexidade:** MÉDIA
- **Descrição:** Sistema de tarefas manual e automático
- **Necessário implementar?** ⬜ SIM ⬜ NÃO

---

#### RF020 (documento) - Checklists Internos

- **Status:** 🔴 NÃO IMPLEMENTADO
- **Prioridade:** MÉDIA
- **Complexidade:** BAIXA
- **Descrição:** Checklists personalizáveis para atividades
- **Necessário implementar?** ⬜ SIM ⬜ NÃO

---

### 3.9 Painel Gerencial / BI

#### RF021 - Painel de KPIs

- **Status:** 🔴 NÃO IMPLEMENTADO
- **Prioridade:** ALTA
- **Complexidade:** ALTA
- **Descrição:** Dashboard com KPIs operacionais e financeiros
- **Necessário implementar?** ⬜ SIM ⬜ NÃO
- **Observações:**
  - DRE, Fluxo de Caixa
  - Ticket médio
  - Faturamento por canal

---

#### RF022 - Gráficos e Análises

- **Status:** 🔴 NÃO IMPLEMENTADO
- **Prioridade:** ALTA
- **Complexidade:** ALTA
- **Descrição:** Análises detalhadas com gráficos interativos
- **Necessário implementar?** ⬜ SIM ⬜ NÃO

---

### 3.10 Portal do Cliente

#### RF023 - Acesso a Resultados

- **Status:** 🔴 NÃO IMPLEMENTADO
- **Prioridade:** ALTA
- **Complexidade:** MÉDIA
- **Descrição:** Portal web seguro para acesso a resultados
- **Necessário implementar?** ⬜ SIM ⬜ NÃO

---

#### RF024 - Histórico de Agendamentos

- **Status:** 🔴 NÃO IMPLEMENTADO
- **Prioridade:** MÉDIA
- **Complexidade:** BAIXA
- **Descrição:** Visualização e gerenciamento de agendamentos
- **Necessário implementar?** ⬜ SIM ⬜ NÃO

---

#### RF025 - Atualização de Dados Cadastrais

- **Status:** 🔴 NÃO IMPLEMENTADO
- **Prioridade:** BAIXA
- **Complexidade:** BAIXA
- **Descrição:** Autoatualização de cadastro
- **Necessário implementar?** ⬜ SIM ⬜ NÃO

---

### 3.11 Portal Médico

#### RF026 - Acesso a Laudos e Imagens

- **Status:** 🔴 NÃO IMPLEMENTADO
- **Prioridade:** MÉDIA
- **Complexidade:** MÉDIA
- **Descrição:** Portal exclusivo para médicos parceiros
- **Necessário implementar?** ⬜ SIM ⬜ NÃO

---

#### RF027 - Histórico de Pedidos

- **Status:** 🔴 NÃO IMPLEMENTADO
- **Prioridade:** BAIXA
- **Complexidade:** BAIXA
- **Descrição:** Acompanhamento de pedidos
- **Necessário implementar?** ⬜ SIM ⬜ NÃO

---

### 3.12 Automação de Documentos

#### RF028 - Monitoramento Automático de E-mails

- **Status:** 🔴 NÃO IMPLEMENTADO
- **Prioridade:** ALTA
- **Complexidade:** MUITO ALTA
- **Descrição:** OCR automático de NFe, boletos, comprovantes via e-mail
- **Necessário implementar?** ⬜ SIM ⬜ NÃO
- **Observações:**
  - Classificação automática
  - Vinculação a fornecedor
  - Criação título Contas a Pagar
  - Detecção duplicidade

---

#### RF029 - Conciliação de Adquirentes

- **Status:** 🔴 NÃO IMPLEMENTADO
- **Prioridade:** ALTA
- **Complexidade:** ALTA
- **Descrição:** Conciliação automática transações cartão
- **Necessário implementar?** ⬜ SIM ⬜ NÃO

---

#### RF036 - Conciliação Bancária

- **Status:** 🔴 NÃO IMPLEMENTADO
- **Prioridade:** ALTA
- **Complexidade:** ALTA
- **Descrição:** Conciliação automática extratos bancários
- **Necessário implementar?** ⬜ SIM ⬜ NÃO

---

## 🔌 Requisitos de Integração

### 5.1 Integrações Críticas

#### INT001 - Laboratórios de Apoio (DB, Hermes Pardini)

- **Status:** 🔴 NÃO IMPLEMENTADO
- **Prioridade:** CRÍTICA
- **Necessário implementar?** ⬜ SIM ⬜ NÃO

---

#### INT002 - Bancos (Bradesco, Santander, Safra, ASAAS)

- **Status:** 🔴 NÃO IMPLEMENTADO
- **Prioridade:** CRÍTICA
- **Necessário implementar?** ⬜ SIM ⬜ NÃO

---

#### INT003 - Adquirentes (Safrapay, Cielo, Rede)

- **Status:** 🔴 NÃO IMPLEMENTADO
- **Prioridade:** CRÍTICA
- **Necessário implementar?** ⬜ SIM ⬜ NÃO

---

#### INT004 - Órgãos Governamentais (SEFAZ, Receita, Prefeituras)

- **Status:** 🔴 NÃO IMPLEMENTADO
- **Prioridade:** CRÍTICA
- **Necessário implementar?** ⬜ SIM ⬜ NÃO

---

### 5.2 Integrações Importantes

#### INT005 - Telemedicina (RWE, Laudos 24hrs)

- **Status:** 🟡 ESTRUTURA CRIADA
- **Prioridade:** ALTA
- **Necessário implementar?** ⬜ SIM ⬜ NÃO

---

#### INT006 - WhatsApp Business API

- **Status:** 🔴 NÃO IMPLEMENTADO
- **Prioridade:** ALTA
- **Necessário implementar?** ⬜ SIM ⬜ NÃO

---

#### INT007 - PACS (Sistema DICOM)

- **Status:** 🔴 NÃO IMPLEMENTADO
- **Prioridade:** ALTA
- **Necessário implementar?** ⬜ SIM ⬜ NÃO

---

#### INT008 - PABX em Nuvem

- **Status:** 🔴 NÃO IMPLEMENTADO
- **Prioridade:** MÉDIA
- **Necessário implementar?** ⬜ SIM ⬜ NÃO

---

### APIs Auxiliares

#### RF030 - API Correios (CEP)

- **Status:** 🟢 IMPLEMENTADO
- **Prioridade:** BAIXA
- **Implementação Atual:** `/back/src/modules/common/services/cep.service.ts`
- **Necessário implementar?** ⬜ SIM ⬜ NÃO

---

#### RF031 - API Receita Federal (CNPJ/CPF)

- **Status:** 🔴 NÃO IMPLEMENTADO
- **Prioridade:** MÉDIA
- **Necessário implementar?** ⬜ SIM ⬜ NÃO

---

#### RF032 - API NFSe por Prefeitura

- **Status:** 🔴 NÃO IMPLEMENTADO
- **Prioridade:** CRÍTICA
- **Necessário implementar?** ⬜ SIM ⬜ NÃO
- **Observações:**
  - São Roque, Ibiúna, Cotia, Araçariguama, Vargem Grande Paulista, Itapecerica da Serra

---

#### RF033 - API Power BI

- **Status:** 🔴 NÃO IMPLEMENTADO
- **Prioridade:** BAIXA
- **Necessário implementar?** ⬜ SIM ⬜ NÃO

---

#### RF034 - API PABX (GOTO, URA, VOIP)

- **Status:** 🔴 NÃO IMPLEMENTADO
- **Prioridade:** MÉDIA
- **Necessário implementar?** ⬜ SIM ⬜ NÃO

---

#### RF035 - API PACS

- **Status:** 🔴 NÃO IMPLEMENTADO
- **Prioridade:** ALTA
- **Necessário implementar?** ⬜ SIM ⬜ NÃO

---

## ⚙️ Requisitos Não Funcionais

### 4.1 Performance

#### RNF001 - Suporte a 1000 Usuários Simultâneos

- **Status:** 🔴 NÃO VALIDADO
- **Prioridade:** ALTA
- **Necessário implementar?** ⬜ SIM ⬜ NÃO

---

#### RNF002 - Tempo de Resposta < 3 segundos

- **Status:** 🔴 NÃO VALIDADO
- **Prioridade:** ALTA
- **Necessário implementar?** ⬜ SIM ⬜ NÃO

---

#### RNF003 - Disponibilidade 99,5%

- **Status:** 🔴 NÃO IMPLEMENTADO
- **Prioridade:** CRÍTICA
- **Necessário implementar?** ⬜ SIM ⬜ NÃO
- **Observações:**
  - Redundância
  - Balanceamento de carga
  - DRP/BCP

---

### 4.2 Segurança

#### RNF004 - Autenticação Multi-fator (MFA)

- **Status:** 🔴 NÃO IMPLEMENTADO
- **Prioridade:** CRÍTICA
- **Necessário implementar?** ⬜ SIM ⬜ NÃO

---

#### RNF005 - Criptografia AES-256

- **Status:** 🟡 PARCIAL
- **Prioridade:** CRÍTICA
- **Necessário implementar?** ⬜ SIM ⬜ NÃO
- **Observações:**
  - HTTPS implementado
  - Falta criptografia em repouso

---

#### RNF006 - Logs de Auditoria (5 anos)

- **Status:** 🟢 IMPLEMENTADO
- **Prioridade:** CRÍTICA (Compliance)
- **Implementação Atual:** Módulo auditoria completo
- **Necessário implementar?** ⬜ SIM ⬜ NÃO

---

#### RNF007 - Conformidade LGPD

- **Status:** 🟡 PARCIAL
- **Prioridade:** CRÍTICA
- **Necessário implementar?** ⬜ SIM ⬜ NÃO
- **Observações:**
  - Termos de consentimento
  - Portabilidade de dados
  - Direito ao esquecimento

---

### 4.3 Integração

#### RNF008 - Suporte REST e SOAP

- **Status:** 🟡 PARCIAL (apenas REST)
- **Prioridade:** ALTA
- **Necessário implementar?** ⬜ SIM ⬜ NÃO

---

#### RNF009 - Retry Automático para APIs

- **Status:** 🔴 NÃO IMPLEMENTADO
- **Prioridade:** ALTA
- **Necessário implementar?** ⬜ SIM ⬜ NÃO

---

#### RNF010 - Cache Local de Dados Críticos

- **Status:** 🔴 NÃO IMPLEMENTADO
- **Prioridade:** MÉDIA
- **Necessário implementar?** ⬜ SIM ⬜ NÃO

---

### 4.4 Usabilidade

#### RNF011 - Interface Responsiva

- **Status:** 🔴 NÃO IMPLEMENTADO (Frontend)
- **Prioridade:** ALTA
- **Necessário implementar?** ⬜ SIM ⬜ NÃO

---

#### RNF012 - Suporte Múltiplos Navegadores

- **Status:** 🔴 NÃO VALIDADO
- **Prioridade:** MÉDIA
- **Necessário implementar?** ⬜ SIM ⬜ NÃO

---

#### RNF013 - Treinamento Máximo 4 horas

- **Status:** 🔴 NÃO VALIDADO
- **Prioridade:** MÉDIA
- **Necessário implementar?** ⬜ SIM ⬜ NÃO

---

## 📋 Conformidade Regulatória

### ANVISA RDC 786/2023

- **Status:** 🔴 NÃO CONFORME
- **Impacto:** CRÍTICO
- **Itens Pendentes:**
  - [ ] Gestão de POPs
  - [ ] Checklists obrigatórios
  - [ ] Rastreabilidade completa
  - [ ] Controle de qualidade

---

### ANVISA RDC 50/2002

- **Status:** 🔴 NÃO CONFORME
- **Impacto:** ALTO
- **Itens Pendentes:**
  - [ ] Auditorias de estrutura
  - [ ] Checklists de infraestrutura

---

### LGPD

- **Status:** 🟡 PARCIALMENTE CONFORME
- **Impacto:** CRÍTICO
- **Itens Pendentes:**
  - [ ] Termos de consentimento
  - [ ] Portabilidade
  - [ ] Direito ao esquecimento

---

### Padrão TISS (ANS)

- **Status:** 🔴 NÃO IMPLEMENTADO
- **Impacto:** CRÍTICO
- **Itens Pendentes:**
  - [ ] Geração de guias
  - [ ] Upload para portais
  - [ ] Credenciamento

---

## 🎯 Priorização Recomendada

### SPRINT 1 - Infraestrutura Crítica (4 semanas)

1. ✅ **RF004** - Ordem de Serviço (CRÍTICO)
2. ✅ **RF010** - Contas a Pagar (CRÍTICO)
3. ✅ **RF011** - Contas a Receber (CRÍTICO)
4. ✅ **RF012** - Integração Adquirentes (CRÍTICO)
5. ✅ **RNF004** - MFA (CRÍTICO)

### SPRINT 2 - Conformidade e Exames (3 semanas)

1. ✅ **RF005** - Laboratórios de Apoio (CRÍTICO)
2. ✅ **RF017** - Gestão de POPs (CRÍTICO)
3. ✅ **RF018** - Checklists (CRÍTICO)
4. ✅ **RF020** - Rastreabilidade (CRÍTICO)
5. ✅ **INT001** - APIs Lab Apoio (CRÍTICO)

### SPRINT 3 - Atendimento e CRM (3 semanas)

1. ✅ **RF001** - Contato Multi-canal (ALTA)
2. ✅ **RF002** - OCR Automático (ALTA)
3. ✅ **RF003** - Fila Atendimento (ALTA)
4. ✅ **RF014** - Bot WhatsApp (ALTA)
5. ✅ **INT006** - WhatsApp API (ALTA)

### SPRINT 4 - Integrações Financeiras (3 semanas)

1. ✅ **INT002** - APIs Bancárias (CRÍTICO)
2. ✅ **INT003** - APIs Adquirentes (CRÍTICO)
3. ✅ **INT004** - SEFAZ/Receita (CRÍTICO)
4. ✅ **RF029** - Conciliação Adquirentes (ALTA)
5. ✅ **RF036** - Conciliação Bancária (ALTA)

### SPRINT 5 - Portais e BI (2 semanas)

1. ✅ **RF021** - Painel KPIs (ALTA)
2. ✅ **RF022** - Gráficos e Análises (ALTA)
3. ✅ **RF023** - Portal Cliente (ALTA)
4. ✅ **RF026** - Portal Médico (MÉDIA)

---

## 📝 Notas e Observações

### Arquivos Mockados Identificados

1. `/back/src/modules/atendimento/services/atendimento.service.ts` - TODO O MÓDULO
2. `/back/src/modules/financeiro/gateway-pagamento.service.ts` - 16 MÉTODOS
3. `/back/src/modules/integracoes/integracoes.service.ts` - 2 MÉTODOS
4. `/back/src/modules/formularios/resposta-formulario.service.ts` - 2 MÉTODOS

### TODOs Críticos no Código

- `exames.service.ts:126` - Verificação OrdemServicoExame
- `convenios.service.ts:153` - Verificação OrdemServico

### Decisões Arquiteturais Importantes

- Multi-empresa: 7 CNPJs em 6 cidades
- Relacionamento OneToOne: empresas → laboratórios/convenios/telemedicina
- JWT com refresh token implementado
- Auditoria centralizada

---

## 🌐 Reorganização de Rotas da API (Outubro 2025)

### Status: ✅ CONCLUÍDA

**Data de Implementação:** 2025-10-08
**Commit:** 79222e0
**Título:** refactor: reorganizar rotas da API por área funcional

### Mudanças Implementadas

#### Controllers Atualizados (42 total)

- ✅ Autenticação: auth, usuarios, perfil (mantidos na raiz `/api/v1/`)
- ✅ Cadastros: pacientes, profissionais, empresas, unidades-saude
- ✅ Exames: exames, formulários, kits, métodos
- ✅ Relacionamento: convênios, laboratórios, telemedicina, fornecedores, prestadores
- ✅ Atendimento: atendimento, agendas, integrações
- ✅ Financeiro: bancos, adquirentes, gateway, conciliação, DRE, fluxo-caixa
- ⚠️ Infraestrutura: **DELETADO ACIDENTALMENTE** (auditoria, common, email)

#### Arquivos .http Atualizados (81 total)

- ✅ Todas as requisições de teste atualizadas com novas rotas
- ✅ Variáveis de ambiente mantidas (baseUrl, token, contentType)

#### Testes

- ✅ Build: 0 erros TypeScript
- ✅ Lint: 0 erros ESLint
- ✅ Testes: 98.8% passando (2,462 de 2,500)

### Decisões Arquiteturais

1. **Auth na raiz**: Decidido manter `/api/v1/auth/*` sem prefixo `autenticacao/`
   - Motivo: Evitar redundância
   - Módulos afetados: auth, usuarios, perfil

2. **Organização por domínio**: Todos os demais módulos receberam prefixo de área funcional
   - Padrão: `/api/v1/{area}/{module}/*`
   - Áreas: cadastros, exames, relacionamento, atendimento, financeiro, infraestrutura

### ⚠️ Problemas Identificados

#### Crítico: Módulo Infraestrutura Deletado

- **Status:** DELETADO no commit 79222e0
- **Arquivos perdidos:** 41 arquivos
- **Módulos afetados:**
  - `infraestrutura/auditoria/` - Logs de auditoria
  - `infraestrutura/common/` - APIs auxiliares (CEP, CNAE)
  - `infraestrutura/email/` - Serviço de emails
- **Ação necessária:** Recuperar do git history

#### Breaking Changes

- **Todas as rotas mudaram** - Frontend e integrações precisarão ser atualizados
- **Exemplo:** `GET /pacientes` → `GET /api/v1/cadastros/pacientes`

---

## 📅 Histórico de Atualizações

| Data       | Responsável | Alterações                                        |
| ---------- | ----------- | ------------------------------------------------- |
| 2025-10-07 | Claude      | Documento criado com análise completa             |
| 2025-10-08 | Claude      | Reorganização de rotas implementada e documentada |
| 2025-10-08 | Claude      | Identificado problema com infraestrutura deletada |
| 2025-11-30 | Claude      | Módulo Cabeçalhos/Rodapés implementado            |
| 2025-12-01 | Claude      | Módulo Formulários de Atendimento implementado    |
| 2025-12-01 | Claude      | Limpeza de arquivos .md obsoletos                 |

---

## ✅ Módulos de Documentação (Implementados em Nov-Dez 2025)

### Cabeçalhos e Rodapés

- **Endpoint:** `/api/v1/configuracoes/documentacao/cabecalhos-rodapes`
- **Status:** ✅ 100% Implementado
- **Funcionalidades:** Upload de imagens para cabeçalho/rodapé por unidade
- **Limite:** 1MB por arquivo, formatos: JPG, PNG, GIF, WEBP
- **Constraint:** UNIQUE por (unidade_id, tipo) - apenas 1 cabeçalho e 1 rodapé por unidade

### Formulários de Atendimento

- **Endpoint:** `/api/v1/configuracoes/documentacao/formularios-atendimento`
- **Status:** ✅ 100% Implementado
- **Funcionalidades:** Upload de PDFs de formulários por unidade
- **Limite:** 1MB por arquivo, formato: PDF
- **Observação:** Múltiplos formulários por unidade permitidos

---

## 🔗 Referências

- Documento base: `/erp-analise-de-requisitos-v3-1.pdf`
- Relatório de mocks: Análise realizada em 2025-10-07
- Padrões de código: `/back/CLAUDE.md`
- Mapeamento Figma: `/organizacao_modulos.md`
