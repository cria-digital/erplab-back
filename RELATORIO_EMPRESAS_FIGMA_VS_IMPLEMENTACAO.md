# 📊 RELATÓRIO COMPARATIVO: FIGMA vs IMPLEMENTAÇÃO
## Cadastro de Empresas (Convênios, Laboratórios, Telemedicina, Fornecedores, Prestadores de Serviço)

**Data:** 21/11/2025
**Autor:** Claude Code
**Objetivo:** Identificar discrepâncias entre design do Figma e implementação do backend

---

## 📌 RESUMO EXECUTIVO

Este relatório documenta **TODAS as diferenças** encontradas entre as especificações do Figma e a implementação atual do backend para os 5 tipos de empresa do sistema ERP Lab.

### Problema Identificado

> **"Não sei o que acontece, mas tem muitos campos faltando e outros a mais nessa criação de convenios. Aliás, em vários end-points. Um desacordo com o que está no figma. Não pode ter campos a mais."**
> — Diego (21/11/2025)

### Status Geral

| Tipo de Empresa | Campos Figma | Campos Implementados | Match % | Status |
|-----------------|--------------|---------------------|---------|--------|
| **Convênios** | 28 | 20 | 7% | ❌ CRÍTICO |
| **Laboratórios** | 1 | 19 | 0% | ❌ CRÍTICO |
| **Telemedicina** | 1 | 37 | 0% | ❌ CRÍTICO |
| **Fornecedores** | 3 | 47 | 0% | ❌ CRÍTICO |
| **Prestadores** | 9 | 46 | 0% | ❌ CRÍTICO |

---

## 🔴 1. CONVÊNIOS

### 1.1. Abas do Formulário (Figma)

1. ✅ **INFORMAÇÕES GERAIS** (compartilhado com todas empresas)
2. ❌ **INFORMAÇÕES ESPECÍFICAS** (28 campos - **DESALINHADO**)
3. ❌ **INTEGRAÇÃO** (8 URLs + configurações - **NÃO IMPLEMENTADO**)
4. ❌ **ATENDIMENTO** (campos obrigatórios/opcionais - **IMPLEMENTAÇÃO DIFERENTE**)
5. ❌ **RESTRIÇÕES** (por plano/médico/especialidade/setor/exame - **NÃO IMPLEMENTADO**)
6. ❌ **PLANOS** (sub-cadastros - **IMPLEMENTADO**)
7. ❌ **INSTRUÇÕES** (histórico - **IMPLEMENTADO**)

### 1.2. INFORMAÇÕES ESPECÍFICAS - Figma (página 13 do PDF 1)

#### Seção: Informações do convênio

| # | Campo Figma | Tipo | Obrig. | Backend | Status |
|---|-------------|------|--------|---------|--------|
| 1 | Nome do convênio | text | ✅ | `nome` | ✅ OK |
| 2 | Código Convênio | text | ✅ | `codigo_convenio` | ✅ OK |
| 3 | Registro ANS | text | ✅ | `registro_ans` | ✅ OK |
| 4 | **Matrícula (dígitos)** | select | ✅ | ❌ | ❌ FALTANDO |
| 5 | **Tipo de convênio** | select | ✅ | ❌ | ❌ FALTANDO |
| 6 | **Liquidação/Forma de liquidação** | select | ✅ | ❌ | ❌ FALTANDO |
| 7 | **Valor CH** | decimal | ✅ | ❌ | ❌ FALTANDO |
| 8 | **Valor Filme** | decimal | ✅ | ❌ | ❌ FALTANDO |
| 9 | **Vencimento (dia)** | int | ✅ | ❌ | ❌ FALTANDO |
| 10 | **CNES** | select/FK | ✅ | ❌ | ❌ FALTANDO |
| 11 | **TISS** | toggle | - | ❌ | ❌ FALTANDO |
| 12 | **Versão do TISS** | text | ✅ | ❌ | ❌ FALTANDO |
| 13 | **TISS - Código na operadora** | text | ✅ | ❌ | ❌ FALTANDO |
| 14 | **Código Operadora (Autorização)** | text | ✅ | ❌ | ❌ FALTANDO |
| 15 | **Código do prestador** | text | ✅ | ❌ | ❌ FALTANDO |

#### Seção: Faturamento

| # | Campo Figma | Tipo | Obrig. | Backend | Status |
|---|-------------|------|--------|---------|--------|
| 16 | **Envio** | select | ✅ | ❌ | ❌ FALTANDO |
| 17 | **Fatura até (dia)** | select | ✅ | ❌ | ❌ FALTANDO |
| 18 | **Vencimento (dia)** | select | ✅ | ❌ | ❌ FALTANDO |
| 19 | **Contrato (data)** | date | ✅ | ❌ | ❌ FALTANDO |
| 20 | **Último ajuste (data)** | date | ✅ | ❌ | ❌ FALTANDO |
| 21 | **Instruções para faturamento** | textarea | - | ❌ | ❌ FALTANDO |

#### Seção: Outras informações

| # | Campo Figma | Tipo | Obrig. | Backend | Status |
|---|-------------|------|--------|---------|--------|
| 22 | **Tabela de serviço** | select/FK | ✅ | ❌ | ❌ FALTANDO |
| 23 | **Tabela base** | select/FK | ✅ | ❌ | ❌ FALTANDO |
| 24 | **Tabela material** | select/FK | ✅ | ❌ | ❌ FALTANDO |
| 25 | **Co-Participação** | toggle | - | ❌ | ❌ FALTANDO |
| 26 | **Nota Fiscal Exige na Fatura** | toggle | - | ❌ | ❌ FALTANDO |
| 27 | **Contato** | text | ✅ | ❌ | ❌ FALTANDO |
| 28 | **Instruções** | textarea | - | ❌ | ❌ FALTANDO |
| 29 | **Observações gerais** | textarea | - | `observacoes_convenio` | ⚠️ PARCIAL |

### 1.3. Campos EXTRAS no Backend (NÃO estão no Figma)

| Campo Backend | Tipo | Deve Remover? |
|--------------|------|---------------|
| `tem_integracao_api` | boolean | ❌ SIM |
| `url_api` | string | ❌ SIM |
| `token_api` | string | ❌ SIM |
| `requer_autorizacao` | boolean | ❌ SIM |
| `requer_senha` | boolean | ❌ SIM |
| `validade_guia_dias` | number | ❌ SIM |
| `tipo_faturamento` | enum | ❌ SIM |
| `portal_envio` | string | ❌ SIM |
| `dia_fechamento` | number | ❌ SIM |
| `prazo_pagamento_dias` | number | ❌ SIM |
| `percentual_desconto` | number | ❌ SIM |
| `tabela_precos` | string | ❌ SIM |
| `telefone` | string | ❌ SIM |
| `email` | string | ❌ SIM |
| `contato_nome` | string | ❌ SIM |
| `regras_especificas` | json | ❌ SIM |
| `status` | enum | ❌ SIM |
| `aceita_atendimento_online` | boolean | ❌ SIM |
| `percentual_coparticipacao` | number | ❌ SIM |
| `valor_consulta` | number | ❌ SIM |

### 1.4. Aba INTEGRAÇÃO (Figma - página 8 do PDF 1)

#### URLs de Integração (NÃO IMPLEMENTADAS)

| Campo Figma | Backend | Status |
|-------------|---------|--------|
| URL de Elegibilidade | ❌ | ❌ FALTANDO |
| URL de autenticação | ❌ | ❌ FALTANDO |
| URL de Solicitação de Autorização | ❌ | ❌ FALTANDO |
| URL de Cancelamento | ❌ | ❌ FALTANDO |
| URL do Status de Autorização | ❌ | ❌ FALTANDO |
| URL do Protocolo | ❌ | ❌ FALTANDO |
| URL do Lote Anexo | ❌ | ❌ FALTANDO |
| URL de Comunicação com Beneficiário | ❌ | ❌ FALTANDO |

#### Configurações de Comunicação (página 7 do PDF 2)

| Campo Figma | Backend | Status |
|-------------|---------|--------|
| Ativar Comunicação (toggle) | ❌ | ❌ FALTANDO |
| Versão TISS | ❌ | ❌ FALTANDO |
| Criptografar Trilha (toggle) | ❌ | ❌ FALTANDO |
| Autorizador Padrão | ❌ | ❌ FALTANDO |
| Cadastrar Credenciais (toggle) | ❌ | ❌ FALTANDO |
| Utilizar Autenticação (toggle) | ❌ | ❌ FALTANDO |
| Utilizar SOAP Action (toggle) | ❌ | ❌ FALTANDO |
| Enviar Arquivo (toggle) | ❌ | ❌ FALTANDO |
| Chave API | ❌ | ❌ FALTANDO |
| Tipo de autenticação | ❌ | ❌ FALTANDO |
| Usuário | ❌ | ❌ FALTANDO |
| Senha | ❌ | ❌ FALTANDO |
| Usuário 2 | ❌ | ❌ FALTANDO |
| Senha 2 | ❌ | ❌ FALTANDO |
| Criptografar Senha (toggle) | ❌ | ❌ FALTANDO |
| Certificado de série | ❌ | ❌ FALTANDO |

### 1.5. Aba ATENDIMENTO (Figma - página 9 do PDF 1 + página 13 do PDF 2)

#### Sistema de Campos Opcionais/Obrigatórios

O Figma especifica que deve haver configuração de quais campos são obrigatórios ou opcionais para:

**Cadastro de Pacientes:**
- Campos Opcionais (selecionáveis): CPF Próprio, Acomodação, Altura, Cartão SUS, CEP, CID do Paciente, etc.
- Campos Obrigatórios: Bairro, Cidade, Endereço, Nome da Mãe, Número de Matrícula, Telefone Celular

**Ordem de Serviço:**
- Campos Opcionais: Número da Guia, Guia Principal, Guia Operadora, Data última menstruação, CID, Local de entrega, Plano
- Campos Obrigatórios: Médico Requisitante, Especialidade do Solicitante, Data da Solicitação

**TISS:**
- Campos Opcionais: Doença, Regime de Atendimento, Saúde Ocup., Tipo de Saída, Tipo de Atendimento, Cobertura Especial
- Campos Obrigatórios: (nenhum selecionado por padrão)

**❌ STATUS: Sistema NÃO IMPLEMENTADO no backend**

### 1.6. Aba RESTRIÇÕES (Figma - página 10 do PDF 1)

Sistema de restrições por:
1. Plano (dropdown)
2. Médico (dropdown)
3. Especialidade (dropdown)
4. Setor Solicitante (dropdown)
5. Exame/Material/Medicamento com:
   - Especialidade
   - Código do item
   - Unidade

**❌ STATUS: Sistema NÃO IMPLEMENTADO no backend**

### 1.7. Aba PLANOS (Figma - página 11 do PDF 1)

Sub-cadastros de planos com:
- Plano
- Tabelas
- Valor CH
- Valor Filme
- Instruções

**✅ STATUS: JÁ IMPLEMENTADO** (tabela `planos` existe)

### 1.8. Aba INSTRUÇÕES (Figma - página 12 do PDF 1)

Histórico de instruções com:
- Registro (data/hora)
- Usuário
- Instrução
- Prazo

**✅ STATUS: JÁ IMPLEMENTADO** (tabela `instrucoes` existe)

### 1.9. Estatísticas Convênios

| Métrica | Valor |
|---------|-------|
| **Total de campos no Figma (INFORMAÇÕES ESPECÍFICAS)** | 28 |
| **Campos corretamente implementados** | 2 (7%) |
| **Campos faltando** | 26 (93%) |
| **Campos extras (a remover)** | 20 |
| **Abas não implementadas** | 3 (INTEGRAÇÃO, ATENDIMENTO, RESTRIÇÕES) |
| **Abas implementadas** | 2 (PLANOS, INSTRUÇÕES) |

---

## 🔴 2. LABORATÓRIOS DE APOIO

### 2.1. Abas do Formulário (Figma)

1. ✅ **INFORMAÇÕES GERAIS** (compartilhado)
2. ❌ **INTEGRAÇÃO** (apenas 1 campo - **DESALINHADO**)
3. ❌ **VINCULAR EXAMES** (sistema completo - **NÃO IMPLEMENTADO**)

### 2.2. Aba INTEGRAÇÃO (Figma - páginas 1, 15 do PDF 1)

#### Campos no Figma

| Campo | Tipo | Descrição |
|-------|------|-----------|
| **Integração** | dropdown | Selecionar integração pré-cadastrada |

**Observação:** No Figma, a aba INTEGRAÇÃO mostra apenas um dropdown "Selecione uma integração", sugerindo que as integrações são cadastradas separadamente e depois vinculadas ao laboratório.

### 2.3. Campos Implementados no Backend (Entity)

| # | Campo Backend | Tipo | Figma? | Status |
|---|--------------|------|--------|--------|
| 1 | `responsavel_tecnico` | string | ❌ | ⚠️ EXTRA |
| 2 | `conselho_responsavel` | string | ❌ | ⚠️ EXTRA |
| 3 | `numero_conselho` | string | ❌ | ⚠️ EXTRA |
| 4 | `tipo_integracao` | enum | ❌ | ⚠️ EXTRA |
| 5 | `url_integracao` | string | ❌ | ⚠️ EXTRA |
| 6 | `token_integracao` | string | ❌ | ⚠️ EXTRA |
| 7 | `usuario_integracao` | string | ❌ | ⚠️ EXTRA |
| 8 | `senha_integracao` | string | ❌ | ⚠️ EXTRA |
| 9 | `configuracao_adicional` | text/json | ❌ | ⚠️ EXTRA |
| 10 | `metodos_envio_resultado` | array | ❌ | ⚠️ EXTRA |
| 11 | `portal_resultados_url` | string | ❌ | ⚠️ EXTRA |
| 12 | `prazo_entrega_normal` | int | ❌ | ⚠️ EXTRA |
| 13 | `prazo_entrega_urgente` | int | ❌ | ⚠️ EXTRA |
| 14 | `taxa_urgencia` | decimal | ❌ | ⚠️ EXTRA |
| 15 | `percentual_repasse` | decimal | ❌ | ⚠️ EXTRA |
| 16 | `aceita_urgencia` | boolean | ❌ | ⚠️ EXTRA |
| 17 | `envia_resultado_automatico` | boolean | ❌ | ⚠️ EXTRA |
| 18 | `observacoes` | text | ❌ | ⚠️ EXTRA |

**⚠️ PROBLEMA CRÍTICO:**
O backend tem **18 campos** que não existem no Figma! O Figma mostra apenas 1 campo (dropdown de integração).

### 2.4. Aba VINCULAR EXAMES (Figma - páginas 2, 16 do PDF 1 / página 2 do PDF 2)

#### Funcionalidades no Figma

1. **Importar/Exportar CSV**
   - Botão "BAIXAR PLANILHA DE EXEMPLO"
   - Botão "IMPORTAR DADOS"
   - Upload de arquivo CSV

2. **Tabela de Vínculos**
   - Cód interno (exame interno)
   - Nome do exame interno
   - Código laboratório (exame do lab)
   - Nome do exame do laboratório
   - Vínculo (Sim/Não)
   - Ações: Excluir, Editar

3. **Filtros**
   - "Somente registros sem vínculo" (checkbox)
   - Campo de pesquisa
   - Botão "VINCULAR AUTOMATICAMENTE"

4. **Modal de Edição de Vínculo** (página 3 do PDF 2)
   - Código interno (readonly)
   - Nome do exame interno (readonly)
   - Código telemedicina/laboratório
   - Nome do exame do laboratório
   - Sinônimos para exame
   - Especialidade (dropdown)
   - Peso (toggle SIM/NÃO)
   - Altura (toggle SIM/NÃO)
   - Volume (toggle SIM/NÃO)
   - Prazo de entrega dos resultados (em dias)
   - Formulário Obrigatório: "ANEXAR FORMULÁRIOS DE ATENDIMENTO"
   - **Equipe médica:**
     - Nome do responsável técnico
     - CRM do responsável técnico
     - Especialidade do responsável técnico
   - **Financeiro:**
     - Valor por laudo
     - Percentual por laudo
     - Prazo para pagamento (dias)

**❌ STATUS: Sistema COMPLETAMENTE NÃO IMPLEMENTADO**

Existe apenas a entity `Laboratorio` com relacionamento OneToOne com `Empresa`, mas:
- ❌ Não existe tabela de vínculos laboratório-exames
- ❌ Não existe funcionalidade de importação/exportação
- ❌ Não existe sistema de vínculo automático
- ❌ Não existe configuração por exame (prazo, especialidade, equipe médica, valores)

### 2.5. Estatísticas Laboratórios

| Métrica | Valor |
|---------|-------|
| **Campos no Figma (INTEGRAÇÃO)** | 1 |
| **Campos implementados** | 19 |
| **Campos corretos** | 0 (0%) |
| **Campos extras (a avaliar)** | 19 (100%) |
| **Sistema VINCULAR EXAMES** | ❌ NÃO IMPLEMENTADO |

**⚠️ OBSERVAÇÃO IMPORTANTE:**
Os 19 campos implementados podem ser NECESSÁRIOS para o funcionamento do laboratório, mas **não estão especificados no Figma como aba INTEGRAÇÃO**. Aparentemente o Figma sugere um modelo onde:
- Integrações são cadastradas SEPARADAMENTE
- Laboratórios apenas SELECIONAM uma integração existente

---

## 🔴 3. TELEMEDICINA

### 3.1. Abas do Formulário (Figma)

1. ✅ **INFORMAÇÕES GERAIS** (compartilhado)
2. ❌ **INTEGRAÇÃO** (apenas 1 campo - **DESALINHADO**)
3. ❌ **VINCULAR EXAMES** (igual laboratórios - **NÃO IMPLEMENTADO**)

### 3.2. Aba INTEGRAÇÃO (Figma - páginas 3, 18 do PDF 1 / página 1 do PDF 2)

#### Campos no Figma (página 1 do PDF 2)

O Figma apresenta uma estrutura MUITO MAIS DETALHADA do que está implementado:

| # | Campo Figma | Tipo | Obrig. | Backend | Status |
|---|-------------|------|--------|---------|--------|
| 1 | **Nome da Telemedicina** | text | ✅ | ❌ | ❌ FALTANDO |
| 2 | **Código de Identificação** | text | ✅ | `codigo_telemedicina` | ✅ OK |
| 3 | **URL da API exames** | text | ✅ | `url_integracao` | ✅ OK |
| 4 | **Token de Autenticação / Chave API** | text | ✅ | `token_integracao` | ✅ OK |
| 5 | **Padrão de Comunicação** | select | ✅ | `tipo_integracao` | ✅ OK |
| 6 | **Formato do Retorno** | select | ✅ | ❌ | ❌ FALTANDO |
| 7 | **Prazo** | text | ✅ | ❌ | ❌ FALTANDO |

### 3.3. Campos Implementados vs Figma

#### ✅ Campos que batem (parcial)

| Campo Backend | Campo Figma | Match |
|--------------|-------------|-------|
| `codigo_telemedicina` | Código de Identificação | ✅ |
| `tipo_integracao` | Padrão de Comunicação | ✅ |
| `url_integracao` | URL da API exames | ✅ |
| `token_integracao` | Token de Autenticação | ✅ |

#### ⚠️ Campos EXTRAS no Backend (37 campos!)

| # | Campo Backend | Parece Necessário? |
|---|--------------|-------------------|
| 1 | `usuario_integracao` | ⚠️ Talvez (não no Figma) |
| 2 | `senha_integracao` | ⚠️ Talvez (não no Figma) |
| 3 | `configuracao_adicional` | ⚠️ Talvez (não no Figma) |
| 4 | `status_integracao` | ⚠️ Talvez (não no Figma) |
| 5 | `tipo_plataforma` | ❌ Não especificado |
| 6 | `url_plataforma` | ❌ Não especificado |
| 7 | `versao_sistema` | ❌ Não especificado |
| 8 | `especialidades_atendidas` | ❌ Não especificado |
| 9 | `tipos_consulta` | ❌ Não especificado |
| 10 | `teleconsulta` | ❌ Não especificado |
| 11 | `telediagnostico` | ❌ Não especificado |
| 12 | `telecirurgia` | ❌ Não especificado |
| 13 | `telemonitoramento` | ❌ Não especificado |
| 14 | `tempo_consulta_padrao` | ❌ Não especificado |
| 15 | `permite_agendamento_online` | ❌ Não especificado |
| 16 | `permite_cancelamento_online` | ❌ Não especificado |
| 17 | `antecedencia_minima_agendamento` | ❌ Não especificado |
| 18 | `antecedencia_minima_cancelamento` | ❌ Não especificado |
| 19 | `certificado_digital` | ❌ Não especificado |
| 20 | `suporte_gravacao` | ❌ Não especificado |
| 21 | `suporte_streaming` | ❌ Não especificado |
| 22 | `criptografia_end_to_end` | ❌ Não especificado |
| 23 | `protocolo_seguranca` | ❌ Não especificado |
| 24 | `valor_consulta_particular` | ❌ Não especificado |
| 25 | `percentual_repasse` | ❌ Não especificado |
| 26 | `taxa_plataforma` | ❌ Não especificado |
| 27 | `observacoes` | ❌ Não especificado |
| 28 | `requisitos_tecnicos` | ❌ Não especificado |

**Total: 28 campos extras que não estão no Figma!**

### 3.4. Campos do Figma que FALTAM no Backend

| # | Campo Figma | Descrição |
|---|-------------|-----------|
| 1 | **Nome da Telemedicina** | Nome comercial da plataforma |
| 2 | **Formato do Retorno** | Formato dos dados (HL7, XML, JSON, TISS, PDF) |
| 3 | **Prazo** | Prazo de entrega dos laudos |

### 3.5. Sistema VINCULAR EXAMES (igual Laboratórios)

Ver seção 2.4 acima - funcionalidade idêntica para Telemedicina.

**❌ STATUS: NÃO IMPLEMENTADO**

### 3.6. Estatísticas Telemedicina

| Métrica | Valor |
|---------|-------|
| **Campos no Figma (INTEGRAÇÃO)** | 7 |
| **Campos implementados** | 37 |
| **Campos corretos** | 4 (11%) |
| **Campos extras** | 28 (76%) |
| **Campos faltando** | 3 (43%) |
| **Sistema VINCULAR EXAMES** | ❌ NÃO IMPLEMENTADO |

---

## 🔴 4. FORNECEDORES

### 4.1. Abas do Formulário (Figma)

1. ✅ **INFORMAÇÕES GERAIS** (compartilhado)
2. ❌ **INFORMAÇÕES ESPECÍFICAS** (3 campos por insumo - **DESALINHADO**)

### 4.2. INFORMAÇÕES ESPECÍFICAS (Figma - página 5 do PDF 1 / página 8 do PDF 2)

#### Sistema de Insumos (Múltiplos Registros)

O Figma mostra que o fornecedor pode fornecer **múltiplos tipos de insumos**, cada um com:

| Campo | Tipo | Obrig. | Descrição |
|-------|------|--------|-----------|
| **Categoria** | select | ✅ | Reagentes e Insumos, Equipamentos Médicos, Material de Escritório, Uniformes e EPI, Outros (CFO) |
| **Método de transporte** | select | ✅ | Correios, Transportadora, Próprio, Entrega Local, Retirada |
| **Orçamento mínimo (R$)** | decimal | ✅ | Valor mínimo do pedido |

**Funcionalidade:** Botão "NOVO INSUMO" para adicionar múltiplas linhas.

**⚠️ OBSERVAÇÃO:** O Figma mostra que um fornecedor pode ter **MÚLTIPLOS insumos** com categorias e métodos de transporte diferentes!

### 4.3. Campos Implementados no Backend

#### ❌ Problema: Estrutura PLANA ao invés de MÚLTIPLOS registros

O backend atual tem:

| Campo Backend | Arrays? | Problema |
|--------------|---------|----------|
| `categorias_fornecidas` | ✅ array | ⚠️ Perde método de transporte e orçamento por categoria |
| `metodos_transporte` | ✅ array | ⚠️ Não está vinculado a categoria específica |
| `orcamento_minimo` | ❌ single | ⚠️ Só permite 1 orçamento geral |
| `orcamento_maximo` | ❌ single | ❌ Não existe no Figma |

**Estrutura correta deveria ser:**

```sql
-- Tabela de vínculos (FALTANDO)
fornecedor_insumos
├── fornecedor_id
├── categoria (enum)
├── metodo_transporte (enum)
├── orcamento_minimo (decimal)
```

### 4.4. Campos EXTRAS no Backend (44 campos!)

| # | Campo Backend | Figma? | Deve Remover? |
|---|--------------|--------|---------------|
| 1 | `formas_pagamento_aceitas` | ❌ | Avaliar |
| 2 | `prazo_entrega_padrao` | ❌ | Avaliar |
| 3 | `prazo_entrega_urgente` | ❌ | Avaliar |
| 4 | `orcamento_maximo` | ❌ | ❌ Sim |
| 5 | `desconto_padrao` | ❌ | ❌ Sim |
| 6 | `avaliacao_media` | ❌ | ❌ Sim |
| 7 | `total_avaliacoes` | ❌ | ❌ Sim |
| 8 | `status_fornecedor` | ❌ | ❌ Sim |
| 9 | `certificacoes` | ❌ | ❌ Sim |
| 10 | `possui_certificacao_iso` | ❌ | ❌ Sim |
| 11 | `possui_licenca_anvisa` | ❌ | ❌ Sim |
| 12 | `data_vencimento_licencas` | ❌ | ❌ Sim |
| 13 | `representante_comercial` | ❌ | ❌ Sim |
| 14 | `telefone_comercial` | ❌ | ❌ Sim |
| 15 | `email_comercial` | ❌ | ❌ Sim |
| 16 | `gerente_conta` | ❌ | ❌ Sim |
| 17 | `aceita_pedido_urgente` | ❌ | ❌ Sim |
| 18 | `entrega_sabado` | ❌ | ❌ Sim |
| 19 | `entrega_domingo` | ❌ | ❌ Sim |
| 20 | `horario_inicio_entrega` | ❌ | ❌ Sim |
| 21 | `horario_fim_entrega` | ❌ | ❌ Sim |
| 22 | `estados_atendidos` | ❌ | ❌ Sim |
| 23 | `cidades_atendidas` | ❌ | ❌ Sim |
| 24 | `atende_todo_brasil` | ❌ | ❌ Sim |
| 25 | `observacoes` | ❌ | ❌ Sim |
| 26 | `condicoes_especiais` | ❌ | ❌ Sim |
| 27 | `historico_problemas` | ❌ | ❌ Sim |
| 28 | `data_ultimo_pedido` | ❌ | ❌ Sim |
| 29 | `data_proxima_avaliacao` | ❌ | ❌ Sim |
| 30 | `aprovado_por` | ❌ | ❌ Sim |
| 31 | `data_aprovacao` | ❌ | ❌ Sim |

**Total: 31 campos que NÃO existem no Figma!**

### 4.5. Estatísticas Fornecedores

| Métrica | Valor |
|---------|-------|
| **Campos/Seções no Figma** | 3 (por insumo) |
| **Estrutura correta** | Tabela de vínculos N:N |
| **Implementação atual** | Arrays simples |
| **Campos extras** | 31 |
| **Match** | 0% |

---

## 🔴 5. PRESTADORES DE SERVIÇO

### 5.1. Abas do Formulário (Figma)

1. ✅ **INFORMAÇÕES GERAIS** (compartilhado)
2. ❌ **INFORMAÇÕES ESPECÍFICAS** (9 campos por serviço - **DESALINHADO**)

### 5.2. INFORMAÇÕES ESPECÍFICAS (Figma - página 7 do PDF 1 / página 12 do PDF 2)

#### Sistema de Serviços (Múltiplos Registros)

Cada serviço prestado tem:

| # | Campo | Tipo | Obrig. | Descrição |
|---|-------|------|--------|-----------|
| 1 | **Tipo de serviço** | select | ✅ | Manutenção de Equipamentos, Prestadores de Exames, Honorário Contábeis, Consultoria, Advocatício, Internet/Telefonia, Água, Energia, Suporte Software, Desenvolvimento, Segurança, Outros (CFO) |
| 2 | **Tipo de contrato** | select | ✅ | Prazo Fixo, Indeterminado, Por Chamada, Retainer, Projeto |
| 3 | **Data de início do contrato** | date | ✅ | Data inicial |
| 4 | **Validade do contrato** | text | ✅ | Ex: "2 ANOS" |
| 5 | **Tipo de pagamento por** | radio | ✅ | SERVIÇO PRESTADO ou MENSALIDADE |
| 6 | **Forma de pagamento** | select | ✅ | Pix, TED, Boleto, Cartão |
| 7 | **Chave PIX** | text | - | Campo condicional |
| 8 | **Profissional** | multi-select | - | Lista de profissionais vinculados (Dr. Rafael Bisencourt, Dra. Silvia Bastos Kretzer) |
| 9 | **Anexar contrato** | file | - | Upload de PDF |

**Funcionalidade:**
- Botão "NOVO SERVIÇO" para adicionar múltiplas linhas
- Botão "ADICIONAR" para vincular profissionais
- Botão "Excluir bloco" para remover serviço

**⚠️ OBSERVAÇÃO:** Igual fornecedores, um prestador pode ter **MÚLTIPLOS serviços** com contratos independentes!

### 5.3. Campos Implementados no Backend

#### ❌ Problema: Estrutura para ÚNICO serviço ao invés de MÚLTIPLOS

| Campo Backend | Múltiplo? | Problema |
|--------------|-----------|----------|
| `tipoContrato` | ❌ | ⚠️ Só permite 1 tipo de contrato |
| `numeroContrato` | ❌ | ⚠️ Só 1 número |
| `dataInicioContrato` | ❌ | ⚠️ Só 1 data |
| `dataFimContrato` | ❌ | ⚠️ Só 1 data |
| `formaPagamento` | ❌ | ⚠️ Só 1 forma |
| `valorHora` | ❌ | ⚠️ Só 1 valor |
| `valorMensal` | ❌ | ⚠️ Só 1 valor |

**Estrutura correta deveria ser:**

```sql
-- Tabela existe mas precisa refatoração
prestadores_servico_categorias
├── prestador_servico_id
├── tipo_servico (enum) ← FALTANDO no Figma
├── tipo_contrato ← OK
├── numero_contrato ← FALTANDO
├── data_inicio ← FALTANDO
├── data_fim ← FALTANDO
├── tipo_pagamento (serviço/mensalidade) ← FALTANDO
├── forma_pagamento ← FALTANDO (está na tabela principal)
├── chave_pix ← FALTANDO (está na tabela principal)
├── arquivo_contrato ← FALTANDO
```

**✅ Existe** tabela `prestador_servico_categoria` mas está INCOMPLETA!

### 5.4. Campos Backend vs Figma

#### ✅ Campos que batem (parcial)

| Campo Backend | Campo Figma | Match |
|--------------|-------------|-------|
| `tipoContrato` | Tipo de contrato | ✅ |
| `dataInicioContrato` | Data de início | ✅ |
| `dataFimContrato` | Validade | ⚠️ Parcial |
| `formaPagamento` | Forma de pagamento | ⚠️ (está na tabela errada) |
| `chavePix` | Chave PIX | ⚠️ (está na tabela errada) |

#### ❌ Campos que FALTAM no Backend

| Campo Figma | Backend | Status |
|-------------|---------|--------|
| Tipo de serviço | ❌ | ❌ FALTANDO |
| Tipo de pagamento por (SERVIÇO/MENSALIDADE) | ❌ | ❌ FALTANDO |
| Profissional (multi-select) | ❌ | ❌ FALTANDO |
| Anexar contrato (file) | ❌ | ❌ FALTANDO |

#### ⚠️ Campos EXTRAS no Backend (38 campos!)

| # | Campo Backend | Figma? | Deve Remover? |
|---|--------------|--------|---------------|
| 1 | `renovacaoAutomatica` | ❌ | ❌ Sim |
| 2 | `prazoAvisoRenovacao` | ❌ | ❌ Sim |
| 3 | `valorHora` | ❌ | ⚠️ Avaliar |
| 4 | `valorMensal` | ❌ | ⚠️ Avaliar |
| 5 | `valorMinimo` | ❌ | ❌ Sim |
| 6 | `prazoPagamento` | ❌ | ❌ Sim |
| 7 | `diaVencimento` | ❌ | ❌ Sim |
| 8 | `frequenciaPagamento` | ❌ | ❌ Sim |
| 9 | `tipoPix` | ❌ | ⚠️ Redundante |
| 10 | `banco` | ❌ | ❌ Sim |
| 11 | `agencia` | ❌ | ❌ Sim |
| 12 | `conta` | ❌ | ❌ Sim |
| 13 | `tipoConta` | ❌ | ❌ Sim |
| 14 | `statusContrato` | ❌ | ❌ Sim |
| 15 | `slaResposta` | ❌ | ❌ Sim |
| 16 | `slaResolucao` | ❌ | ❌ Sim |
| 17 | `horarioAtendimento` | ❌ | ❌ Sim |
| 18 | `diasAtendimento` | ❌ | ❌ Sim |
| 19 | `suporte24x7` | ❌ | ❌ Sim |
| 20 | `atendeUrgencia` | ❌ | ❌ Sim |
| 21 | `taxaUrgencia` | ❌ | ❌ Sim |
| 22 | `avaliacaoMedia` | ❌ | ❌ Sim |
| 23 | `totalAvaliacoes` | ❌ | ❌ Sim |
| 24 | `totalServicosPrestados` | ❌ | ❌ Sim |
| 25 | `observacoes` | ❌ | ❌ Sim |
| 26 | `requisitosAcesso` | ❌ | ❌ Sim |
| 27 | `certificacoes` | ❌ | ❌ Sim |
| 28 | `seguros` | ❌ | ❌ Sim |

**Total: 28 campos que NÃO existem no Figma!**

### 5.5. Estatísticas Prestadores de Serviço

| Métrica | Valor |
|---------|-------|
| **Campos no Figma (por serviço)** | 9 |
| **Estrutura correta** | Tabela de vínculos 1:N (existe mas incompleta) |
| **Campos corretos** | 2 (22%) |
| **Campos faltando** | 4 (44%) |
| **Campos extras** | 28 |
| **Tabela `prestador_servico_categoria`** | ✅ Existe mas incompleta |

---

## 📋 RESUMO CONSOLIDADO

### Campos por Tipo de Empresa

| Empresa | Figma | Implementado | Corretos | Faltando | Extras |
|---------|-------|-------------|----------|----------|--------|
| **Convênios** | 28 | 20 | 2 (7%) | 26 (93%) | 20 |
| **Laboratórios** | 1 | 19 | 0 (0%) | 1 (100%) | 19 |
| **Telemedicina** | 7 | 37 | 4 (57%) | 3 (43%) | 28 |
| **Fornecedores** | 3 | 47 | 0 (0%) | 3 (100%) | 31 |
| **Prestadores** | 9 | 46 | 2 (22%) | 4 (44%) | 28 |
| **TOTAL** | **48** | **169** | **8 (17%)** | **37 (77%)** | **126** |

### Funcionalidades Ausentes

| Funcionalidade | Afeta | Status |
|----------------|-------|--------|
| **VINCULAR EXAMES** (laboratórios/telemedicina) | 2 tipos | ❌ NÃO IMPLEMENTADO |
| **Aba INTEGRAÇÃO** (convênios - 8 URLs) | Convênios | ❌ NÃO IMPLEMENTADO |
| **Aba ATENDIMENTO** (campos obrigatórios/opcionais) | Convênios | ❌ NÃO IMPLEMENTADO |
| **Aba RESTRIÇÕES** (por plano/médico/setor/exame) | Convênios | ❌ NÃO IMPLEMENTADO |
| **Múltiplos Insumos por Fornecedor** | Fornecedores | ⚠️ ESTRUTURA ERRADA |
| **Múltiplos Serviços por Prestador** | Prestadores | ⚠️ TABELA INCOMPLETA |

---

## 🎯 PLANO DE AÇÃO RECOMENDADO

### Prioridade CRÍTICA (P0)

#### 1. Convênios - INFORMAÇÕES ESPECÍFICAS

**Ação:** Criar migration para adicionar 26 campos faltantes

<details>
<summary>Ver lista completa de campos a adicionar</summary>

```typescript
// Adicionar na tabela convenios
matricula_digitos: number
tipo_convenio: enum
forma_liquidacao: enum
valor_ch: decimal
valor_filme: decimal
dia_vencimento: number
cnes_id: uuid (FK)
tiss: boolean
versao_tiss: string
codigo_operadora_tiss: string
codigo_operadora_autorizacao: string
codigo_prestador: string
envio_faturamento: enum
fatura_ate_dia: number
vencimento_fatura_dia: number
data_contrato: date
data_ultimo_ajuste: date
instrucoes_faturamento: text
tabela_servico_id: uuid (FK)
tabela_base_id: uuid (FK)
tabela_material_id: uuid (FK)
co_participacao: boolean
nota_fiscal_exige_fatura: boolean
contato: string
instrucoes: text
// observacoes_gerais: já existe como observacoes_convenio
```

</details>

**Ação:** Remover 20 campos extras

<details>
<summary>Ver lista de campos a remover</summary>

```typescript
// Remover da tabela convenios
tem_integracao_api
url_api
token_api
requer_autorizacao
requer_senha
validade_guia_dias
tipo_faturamento
portal_envio
dia_fechamento
prazo_pagamento_dias
percentual_desconto
tabela_precos
telefone
email
contato_nome
regras_especificas
status
aceita_atendimento_online
percentual_coparticipacao
valor_consulta
```

</details>

#### 2. Convênios - Aba INTEGRAÇÃO

**Ação:** Criar tabela `convenio_integracao`

```sql
CREATE TABLE convenio_integracao (
  id uuid PRIMARY KEY,
  convenio_id uuid REFERENCES convenios(id),

  -- URLs de Integração
  url_elegibilidade text,
  url_autenticacao text,
  url_solicitacao_autorizacao text,
  url_cancelamento text,
  url_status_autorizacao text,
  url_protocolo text,
  url_lote_anexo text,
  url_comunicacao_beneficiario text,

  -- Configurações
  ativar_comunicacao boolean DEFAULT false,
  versao_tiss varchar(20),
  criptografar_trilha boolean DEFAULT false,
  autorizador_padrao varchar(100),
  cadastrar_credenciais boolean DEFAULT false,
  utilizar_autenticacao boolean DEFAULT false,
  utilizar_soap_action boolean DEFAULT false,
  enviar_arquivo boolean DEFAULT false,
  chave_api text,
  tipo_autenticacao varchar(50),
  usuario varchar(100),
  senha varchar(255), -- encrypted
  usuario_2 varchar(100),
  senha_2 varchar(255), -- encrypted
  criptografar_senha boolean DEFAULT true,
  certificado_serie varchar(100),

  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);
```

#### 3. Laboratórios / Telemedicina - VINCULAR EXAMES

**Ação:** Criar sistema completo de vínculos

```sql
-- Tabela de vínculos laboratório-exames
CREATE TABLE laboratorio_exames (
  id uuid PRIMARY KEY,
  laboratorio_id uuid REFERENCES laboratorios(id),
  exame_id uuid REFERENCES exames(id),

  -- Dados do exame no laboratório
  codigo_laboratorio varchar(50) NOT NULL,
  nome_exame_laboratorio varchar(255) NOT NULL,
  sinonimos text[],
  especialidade_id uuid REFERENCES especialidades(id),

  -- Requisitos
  requer_peso boolean DEFAULT false,
  requer_altura boolean DEFAULT false,
  requer_volume boolean DEFAULT false,
  prazo_entrega_dias int NOT NULL,
  formulario_obrigatorio boolean DEFAULT false,

  -- Equipe médica
  responsavel_tecnico_nome varchar(255),
  responsavel_tecnico_crm varchar(20),
  responsavel_tecnico_especialidade varchar(100),

  -- Financeiro
  valor_laudo decimal(10,2),
  percentual_laudo decimal(5,2),
  prazo_pagamento_dias int,

  ativo boolean DEFAULT true,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now(),

  UNIQUE(laboratorio_id, exame_id)
);

-- Igual para telemedicina
CREATE TABLE telemedicina_exames (
  -- mesma estrutura acima
);
```

**Ação:** Implementar endpoints de importação/exportação CSV

```typescript
// Endpoints necessários
POST /laboratorios/:id/exames/importar (multipart/form-data)
GET  /laboratorios/:id/exames/exportar (download CSV)
POST /laboratorios/:id/exames/vincular-automaticamente
GET  /laboratorios/:id/exames/sem-vinculo
```

#### 4. Fornecedores - Sistema de Múltiplos Insumos

**Ação:** Criar tabela de vínculos

```sql
CREATE TABLE fornecedor_insumos (
  id uuid PRIMARY KEY,
  fornecedor_id uuid REFERENCES fornecedores(id),

  categoria varchar(50) NOT NULL, -- enum
  metodo_transporte varchar(50) NOT NULL, -- enum
  orcamento_minimo decimal(10,2) NOT NULL,

  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);
```

**Ação:** Remover/migrar campos da tabela principal

```sql
-- Remover campos redundantes
ALTER TABLE fornecedores DROP COLUMN categorias_fornecidas;
ALTER TABLE fornecedores DROP COLUMN metodos_transporte;
ALTER TABLE fornecedores DROP COLUMN orcamento_minimo;
ALTER TABLE fornecedores DROP COLUMN orcamento_maximo;
-- ... remover os outros 27 campos extras
```

#### 5. Prestadores - Completar Sistema de Múltiplos Serviços

**Ação:** Expandir tabela `prestador_servico_categoria`

```sql
ALTER TABLE prestador_servico_categorias
  ADD COLUMN tipo_servico varchar(100) NOT NULL,
  ADD COLUMN numero_contrato varchar(50),
  ADD COLUMN data_inicio date,
  ADD COLUMN validade varchar(50),
  ADD COLUMN tipo_pagamento varchar(50), -- SERVICO_PRESTADO ou MENSALIDADE
  ADD COLUMN forma_pagamento varchar(50),
  ADD COLUMN chave_pix varchar(255),
  ADD COLUMN arquivo_contrato text; -- URL ou base64

-- Tabela de vínculos com profissionais
CREATE TABLE prestador_servico_profissionais (
  id uuid PRIMARY KEY,
  prestador_servico_categoria_id uuid REFERENCES prestador_servico_categorias(id),
  profissional_id uuid REFERENCES profissionais(id),
  created_at timestamp DEFAULT now()
);
```

### Prioridade ALTA (P1)

1. **Convênios - Aba ATENDIMENTO:** Sistema de campos obrigatórios/opcionais configuráveis
2. **Convênios - Aba RESTRIÇÕES:** Sistema de restrições por plano/médico/especialidade/setor/exame
3. **Laboratórios:** Simplificar campos (1 dropdown de integração conforme Figma?)

### Prioridade MÉDIA (P2)

1. Revisar se os 19 campos de `laboratorios` devem ser movidos para módulo de Integrações separado
2. Revisar se os 28 campos extras de `telemedicina` são necessários
3. Revisar se os 28 campos extras de `prestadores_servico` são necessários

---

## ⚠️ OBSERVAÇÕES FINAIS

### Questões para Validação com Diego

1. **Laboratórios/Telemedicina:** Os campos implementados (responsável técnico, integração, prazos, etc) são necessários mesmo não estando no Figma? Ou devem ser movidos para um módulo separado de "Integrações"?

2. **Fornecedores/Prestadores:** Os ~30 campos extras (certificações, avaliações, áreas atendidas, etc) vieram de onde? São requisitos futuros ou foram implementados por engano?

3. **Convênios - INTEGRAÇÃO:** As 8 URLs e 16 configurações devem ser obrigatórias ou opcionais?

4. **Convênios - ATENDIMENTO:** Como deve funcionar o sistema de campos obrigatórios/opcionais? Armazenar como JSON na tabela ou criar tabela separada?

5. **Convênios - RESTRIÇÕES:** Como estruturar o banco? Uma tabela polimórfica ou tabelas separadas por tipo (plano, médico, especialidade, etc)?

### Impacto Estimado

| Ação | Esforço | Impacto em Dados | Risco |
|------|---------|-----------------|-------|
| Adicionar 26 campos Convênios | Alto | Médio | Baixo |
| Remover 20 campos Convênios | Médio | **ALTO** | **Alto** |
| Sistema VINCULAR EXAMES | Alto | Baixo | Médio |
| Aba INTEGRAÇÃO Convênios | Médio | Baixo | Baixo |
| Refatorar Fornecedores | Alto | **ALTO** | **Alto** |
| Expandir Prestadores | Médio | Médio | Médio |

### Dados Existentes

**⚠️ ATENÇÃO:** Remover campos que já contêm dados pode causar perda de informações. Recomenda-se:

1. Fazer backup completo do banco
2. Analisar quais campos extras estão sendo usados
3. Se necessário, migrar dados para nova estrutura antes de remover
4. Considerar criar campo `metadata` (JSONB) para preservar dados antigos

---

## 📊 ANEXOS

### A. Mapeamento Completo de Campos

Ver seções individuais acima (1.2, 2.3, 3.3, 4.3, 5.4) para mapeamento detalhado campo-a-campo.

### B. Estrutura de Enums Necessários

```typescript
// Convênios
enum TipoConvenio {
  AMBULATORIAL = 'ambulatorial',
  HOSPITALAR = 'hospitalar',
  ODONTOLOGICO = 'odontologico',
  MISTO = 'misto'
}

enum FormaLiquidacao {
  VIA_FATURA = 'via_fatura',
  VIA_GUIA = 'via_guia',
  ONLINE = 'online'
}

enum EnvioFaturamento {
  FISICO = 'fisico',
  EMAIL = 'email',
  PORTAL = 'portal',
  FTP = 'ftp'
}

// Fornecedores
enum CategoriaInsumo {
  REAGENTES_INSUMOS = 'reagentes_insumos',
  EQUIPAMENTOS_MEDICOS = 'equipamentos_medicos',
  MATERIAL_ESCRITORIO = 'material_escritorio',
  UNIFORMES_EPI = 'uniformes_epi',
  OUTROS = 'outros'
}

enum MetodoTransporte {
  CORREIOS = 'correios',
  TRANSPORTADORA = 'transportadora',
  PROPRIO = 'proprio',
  ENTREGA_LOCAL = 'entrega_local',
  RETIRADA = 'retirada'
}

// Prestadores
enum TipoServico {
  MANUTENCAO_EQUIPAMENTOS = 'manutencao_equipamentos',
  PRESTADORES_EXAMES = 'prestadores_exames',
  HONORARIO_CONTABEIS = 'honorario_contabeis',
  HONORARIO_CONSULTORIA = 'honorario_consultoria',
  HONORARIO_ADVOCATICIO = 'honorario_advocaticio',
  INTERNET_TELEFONIA = 'internet_telefonia',
  AGUA = 'agua',
  ENERGIA = 'energia',
  SUPORTE_SOFTWARE = 'suporte_software',
  DESENVOLVIMENTO_SOFTWARE = 'desenvolvimento_software',
  SEGURANCA_MONITORAMENTO = 'seguranca_monitoramento',
  OUTROS = 'outros'
}

enum TipoContrato {
  PRAZO_FIXO = 'prazo_fixo',
  INDETERMINADO = 'indeterminado',
  POR_CHAMADA = 'por_chamada',
  RETAINER = 'retainer',
  PROJETO = 'projeto'
}

enum TipoPagamento {
  SERVICO_PRESTADO = 'servico_prestado',
  MENSALIDADE = 'mensalidade'
}
```

### C. Referências de Páginas do Figma

| Tipo | Páginas no PDF 1 | Páginas no PDF 2 |
|------|------------------|------------------|
| Convênios | 8-13 | 7 (integração), 13 (atendimento) |
| Laboratórios | 1-2, 14-16 | 2 (vínculos), 8 (dados) |
| Telemedicina | 3-4, 17-19 | 1 (dados), 2-3 (vínculos) |
| Fornecedores | 5-6 | 4-5, 8 |
| Prestadores | 7, 9 (listagem) | 6, 12 |
| Tabela Preços | 19-20 | 17-18 |

---

**Fim do Relatório**

*Gerado por: Claude Code*
*Data: 21/11/2025*
*Versão: 1.0*
