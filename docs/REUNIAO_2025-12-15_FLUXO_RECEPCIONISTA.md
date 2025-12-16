# Plano Geral - Sistema ERP Lab

## Resumo da Reunião (Diego + André - 15/12/2025)

Alinhamento sobre o protótipo Figma do módulo de recepcionista para sistema de laboratório/clínica ambulatorial.

---

## Índice de Módulos

1. [Integrações](#módulo-integrações)
2. [Recepcionista](#módulo-recepcionista)
3. [Cadastro de Paciente](#módulo-cadastro-de-paciente)
4. [Orçamento](#módulo-orçamento)
5. [Agendamento](#módulo-agendamento)
6. [Pagamento/Caixa](#módulo-pagamentocaixa)

---

## Pendências para Bruno (UI/UX - Figma)

1. [ ] Tela de Orçamento completa
2. [ ] Seletor de Exames (autocomplete 3 letras)
3. [ ] Fluxo de Pagamento completo
4. [ ] Seleção de Horário no agendamento

---

## Próximos Passos

### Imediato

- Bruno corrigir/adicionar telas faltantes no Figma
- André enviar documentação da API GoToBe
- Implementar cadastro dinâmico de templates WhatsApp

### Próxima Reunião

- Módulo de Tarefas
- Fechamento de Caixa (fluxo completo)

---

---

# Módulo: Integrações

## 1. GoToBe (PBX - Telefonia)

### Descrição

Sistema de telefonia VoIP para realizar ligações diretamente do sistema. A recepcionista usa headset e pode ligar para pacientes com um clique.

### Detalhes Técnicos

- **Tipo**: PBX na nuvem
- **API**: Aberta, documentação pública
- **Ação pendente**: André vai enviar link da documentação

### Fluxo de Uso

1. Recepcionista clica no botão "Ligar" na ficha do paciente
2. Sistema chama API do GoToBe
3. Ligação é iniciada automaticamente no headset

### Considerações Multi-tenant

- Cada tenant terá suas próprias credenciais do GoToBe
- Configuração no cadastro da unidade

---

## 2. WhatsApp Business API

### Limitações Importantes

| Cenário                 | Pode enviar? | Tipo de mensagem           |
| ----------------------- | ------------ | -------------------------- |
| Cliente respondeu < 24h | Sim          | Qualquer texto             |
| Cliente não respondeu   | Sim          | Apenas templates aprovados |
| Iniciar conversa nova   | Não          | Precisa de template        |

### Templates (Mensagens Aprovadas)

**Tipos permitidos:**

- **Transacional/Serviço**: Confirmação de agendamento, avisos
- **Marketing**: Promoções (necessita opt-in do cliente)

**Exemplos de uso:**

```
Olá {nome}, você tem uma consulta agendada para {data} às {hora}.
Confirma? Responda SIM ou NÃO.
```

### Cadastro Dinâmico de Templates (Multi-tenant)

Cada tenant precisa:

1. Criar seus próprios templates no Meta Business
2. Cadastrar os IDs dos templates no sistema
3. Sistema usa o ID para chamar a API

**Campos do cadastro:**

- Nome do template
- ID do template (Meta)
- Variáveis (nome, data, hora, etc.)
- Tipo (transacional/marketing)

### Fluxo de Integração

```
[Sistema] -> [API WhatsApp] -> [Meta Cloud] -> [Paciente]
```

### CRM Básico

- Chat bot integrado
- Histórico de conversas
- Fila de atendimento por WhatsApp

---

---

# Módulo: Recepcionista

## 1. Abertura de Caixa

### Descrição

Ao iniciar o expediente, a recepcionista deve confirmar o valor em espécie (troco) antes de atender.

### Fluxo

1. Login no sistema
2. Modal: "Confirme o valor de abertura do caixa"
3. Valor sugerido: saldo em espécie do fechamento anterior
4. Recepcionista confirma ou ajusta
5. Caixa aberto

### Regras de Negócio

- **Obrigatório** abrir caixa antes de atender
- **Não pode** abrir novo caixa sem fechar o anterior
- **Validação de data**: Se caixa anterior é de outro dia, exigir fechamento primeiro
- **Tipo de sistema**: Ambulatorial (não tem virada de dia - sempre fecha no fim do expediente)

### Cenário de Erro

```
[André esqueceu de fechar o caixa ontem]
  ↓
[Hoje, ao logar]
  ↓
"André, você tem um caixa aberto do dia 14/12.
Finalize-o antes de abrir um novo."
```

---

## 2. Fila de Atendimento

### Estrutura da Fila

| Tipo           | Descrição                    |
| -------------- | ---------------------------- |
| **Prioridade** | Idosos (60+), gestantes, PCD |
| **Geral**      | Demais pacientes             |

### Identificação do Paciente

| Status               | Como funciona                            |
| -------------------- | ---------------------------------------- |
| **Identificado**     | Paciente digitou CPF no painel de senhas |
| **Não identificado** | Paciente só pegou senha avulsa           |

### Integração com Painel de Senhas

1. Paciente vai ao totem
2. Digita CPF (opcional) e seleciona prioridade
3. Retira senha (ex: P001, G015)
4. Aparece na fila da recepcionista

### Ordenação

- Por ordem de chegada dentro de cada tipo
- **Sem regra rígida**: Operador decide quem chamar
- Pode intercalar prioridade/geral conforme tempo de espera

---

## 3. Meus Atendimentos

### Descrição

Lista de atendimentos que a recepcionista já finalizou no dia/período.

### Informações Exibidas

- Nome do paciente
- Hora de chegada
- Hora de finalização na recepção
- Status (aguardando exame, em exame, finalizado)

### Fluxo

```
[Atendimento finalizado na recepção]
  ↓
[Paciente vai para "Fila de Exames"]
  ↓
[US aparece em "Meus Atendimentos"]
```

---

## 4. Agendamentos e Orçamentos

### Descrição

Consulta de todos os agendamentos e orçamentos feitos pelo usuário.

### Filtros

- Período: Data inicial - Data final
- Hoje apenas
- Semana/Mês

### Funcionalidades

- Visualizar detalhes
- Exportar para Excel

---

## 5. Fila de Exames

### Descrição

Filas separadas por tipo de agenda.

### Exemplos de Filas

- Laboratório (ordem de chegada)
- Ultrassom Sala 1
- Agenda Dr. Douglas
- Raio-X

### Visualização

- Por agenda selecionada
- Mostra pacientes aguardando

---

---

# Módulo: Cadastro de Paciente

## 1. Busca de Paciente

### Campos de Busca

- CPF
- Nome

### Fluxo

```
[Digitar CPF/Nome]
  ↓
[Encontrou?]
  ├─ Sim → Abre cadastro para edição
  └─ Não → Abre formulário novo
```

---

## 2. Formulário de Cadastro

### Dados Pessoais

- Nome completo
- CPF
- Data de nascimento
- Telefone
- E-mail
- Endereço

### Documentos (com OCR)

- Upload de documento (RG, CNH)
- Sistema lê via OCR e preenche campos

### Convênio

| Campo     | Obrigatório       |
| --------- | ----------------- |
| Convênio  | Não               |
| Plano     | Se tiver convênio |
| Matrícula | Se tiver convênio |
| Validade  | Se tiver convênio |

**Regra**: Um plano ativo principal por paciente

---

---

# Módulo: Orçamento

## 1. Cabeçalho do Orçamento

### Campos

| Campo                 | Obrigatório | Observação                 |
| --------------------- | ----------- | -------------------------- |
| Tipo de Atendimento   | Convênio    | Campo TISS                 |
| Regime de Atendimento | Convênio    | Campo TISS                 |
| Setor                 | Auto        | Recepção da unidade logada |
| Guias                 | Não         | Número das guias           |
| Médico Solicitante 1  | Sim         | Base de médicos SP         |
| Médico Solicitante 2  | Não         | Opcional                   |
| Data do Pedido        | Sim         | Preenchido automaticamente |

### Médico Solicitante

- Base de dados com todos os médicos de SP
- Busca por CRM ou nome
- Máximo 2 solicitantes (ex: endócrino + gineco)

---

## 2. Itens da Ordem de Serviço (Exames)

### Importação via OCR

**Entrada aceita:**

- Scanner
- Foto (câmera do dispositivo)
- Upload de arquivo (PDF, JPEG, PNG)

**Fluxo:**

1. Operador clica em "Importar Requisição"
2. Anexa imagem/arquivo
3. Sistema lê via OCR
4. Exames sugeridos aparecem na lista
5. Operador valida, adiciona ou remove

### Seletor Manual

**Funcionamento:**

1. Digitar mínimo 3 caracteres
2. Sistema busca exames que CONTÉM as letras
3. Mostra 5-10 primeiros resultados
4. Navegação: setas ↑↓ + Enter/Tab

**Exemplo:**

```
Digitou: "gli"
Resultados:
- Glicemia de jejum
- Hemoglobina glicosilada
- Triglicerídeos
```

### Ações na Lista

- Adicionar item (busca + enter)
- Remover item (ícone lixeira)

---

## 3. Relação Orçamento x Atendimento

| Conceito                  | Descrição                             |
| ------------------------- | ------------------------------------- |
| **Orçamento**             | Rascunho, não significa que foi feito |
| **OS (Ordem de Serviço)** | Atendimento efetivo                   |

### Quando pode gerar OS?

| Tipo       | Condição                           |
| ---------- | ---------------------------------- |
| Particular | Pagamento realizado                |
| Convênio   | Campos TISS preenchidos + faturado |

---

---

# Módulo: Agendamento

## 1. Tipos de Exame

| Tipo             | Precisa agendar?              |
| ---------------- | ----------------------------- |
| Ordem de chegada | Não (ex: exames de sangue)    |
| Agendado         | Sim (ex: ultrassom, consulta) |

**Configuração**: No cadastro do exame, define-se se precisa agenda.

---

## 2. Fluxo de Agendamento

### Origem

- Sempre parte de um orçamento
- Após criar orçamento, sistema identifica exames que precisam agenda

### Passos

1. Selecionar exame que precisa agendar
2. Selecionar unidade (pode ser outra unidade)
3. Visualizar grade de horários
4. Selecionar dia
5. Selecionar horário específico
6. Repetir para cada exame agendável

---

## 3. Grade de Horários

### Visualização Padrão

- Hoje + próximos 6 dias (total 7 dias)
- Navegação: avançar/voltar semanas
- Pode ver agendamentos passados

### Informações na Grade

| Elemento | Significado               |
| -------- | ------------------------- |
| Número   | Vagas disponíveis no slot |
| Cor      | Disponível / Lotado       |
| Período  | Manhã / Tarde             |

### Intervalos Configuráveis

- 10 em 10 minutos
- 15 em 15 minutos
- 20 em 20 minutos

(Configurado por agenda/exame)

---

## 4. Multi-unidade

### Descrição

Mesmo logado em São Roque, pode agendar para Cotia.

### Casos de Uso

- Call center centralizado
- Atendimento via WhatsApp
- Paciente prefere outra unidade

---

## 5. Resumo do Agendamento

### Tela de Confirmação

Mostra todos os agendamentos feitos:

```
- Mamografia: 19/03 às 15:00 - Unidade Centro
- Ultrassom: 20/03 às 09:30 - Unidade Centro
```

---

---

# Módulo: Pagamento/Caixa

## Status: Pendente

**Motivo**: Falta tela no Figma. Apenas botão "Pagar OS" existe.

---

## 1. O que se sabe até agora

### Botão "Pagar OS"

- Existe no protótipo
- Não tem fluxo desenhado

### Integração com Caixa

- Pagamento entra no caixa da recepcionista
- Fecha caixa no fim do expediente

---

## 2. A definir na próxima reunião

- [ ] Formas de pagamento (Dinheiro, Cartão, PIX)
- [ ] Fluxo de troco
- [ ] Integração com adquirentes
- [ ] Fechamento de caixa
- [ ] Conferência de valores
- [ ] Sangria (retirada de dinheiro)

---

---

# Decisões Técnicas Consolidadas

| Decisão              | Escolha                          |
| -------------------- | -------------------------------- |
| Tipo de sistema      | Ambulatorial (sem virada de dia) |
| Planos por paciente  | 1 ativo principal                |
| Médicos solicitantes | Máximo 2                         |
| Ordenação de fila    | Livre (operador decide)          |
| Busca em seletores   | 3 caracteres mínimo              |
| Agendamento          | Sempre parte de orçamento        |
| Templates WhatsApp   | Cadastro dinâmico por tenant     |
