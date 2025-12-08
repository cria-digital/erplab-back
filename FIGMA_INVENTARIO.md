# Inventário de Telas do Figma - ERP Lab

Este documento cataloga o conteúdo de cada arquivo PDF do Figma para referência futura.

**Localização dos PDFs**: `/home/diego/Projects/erplab/pdf_chunks/`

---

## chunk_001_p001-020.pdf

**Páginas**: 1-20
**Status**: Não catalogado
**Conteúdo**:

- [ ] A ser preenchido

---

## chunk_002_p021-040.pdf

**Páginas**: 21-40
**Status**: Não catalogado
**Conteúdo**:

- [ ] A ser preenchido

---

## chunk_003_p041-060.pdf

**Páginas**: 41-60
**Status**: Não catalogado
**Conteúdo**:

- [ ] A ser preenchido

---

## chunk_004_p061-080.pdf

**Páginas**: 61-80
**Status**: Não catalogado
**Conteúdo**:

- [ ] A ser preenchido

---

## chunk_005_p081-100.pdf

**Páginas**: 81-100
**Status**: Não catalogado
**Conteúdo**:

- [ ] A ser preenchido

---

## chunk_006_p101-120.pdf

**Páginas**: 101-120
**Status**: Não catalogado
**Conteúdo**:

- [ ] A ser preenchido

---

## chunk_007_p121-140.pdf

**Páginas**: 121-140
**Status**: Não catalogado
**Conteúdo**:

- [ ] A ser preenchido

---

## chunk_008_p141-160.pdf

**Páginas**: 141-160
**Status**: Não catalogado
**Conteúdo**:

- [ ] A ser preenchido

---

## chunk_009_p161-180.pdf

**Páginas**: 161-180
**Status**: Não catalogado
**Conteúdo**:

- [ ] A ser preenchido

---

## chunk_010_p181-200.pdf

**Páginas**: 181-200
**Status**: Não catalogado
**Conteúdo**:

- [ ] A ser preenchido

---

## chunk_011_p201-220.pdf

**Páginas**: 201-220
**Status**: Não catalogado
**Conteúdo**:

- [ ] A ser preenchido

---

## chunk_012_p221-240.pdf

**Páginas**: 221-240
**Status**: Não catalogado
**Conteúdo**:

- [ ] A ser preenchido

---

## chunk_013_p241-260.pdf

**Páginas**: 241-260
**Status**: ✅ Catalogado
**Conteúdo**:

### Matrizes de Exames

#### Páginas 1, 6, 7, 13, 18 - Cadastro de Matrizes

- Tela de cadastro de matrizes de exames
- Tipos: EXTERNO, IMAGEM, LABORATORIAL, AUDIOMETRIA
- Status implementação: `src/modules/exames/matrizes/`

#### Página 2 - Indicador Vincular Certificado

- Componente visual para vinculação de certificado

#### Página 5 - Listagem de Matrizes

- Listagem com 160 matrizes
- Colunas: Código, Nome, Tipo, Especialidade, Status, Ações

#### Página 14 - Visualização Matriz Densitometria Óssea

- Template de visualização de matriz
- Campos específicos para densitometria

### Exames

#### Página 3 - Listagem de Exames

- Total: 160 exames
- Colunas: Cód interno, Nome do exame, Especialidade, Setor, Destino do exame, Prazo de entrega, Ativo
- Ordenação e paginação

#### Página 4 - Visualização Hemograma Completo

- Detalhes do exame Hemograma Completo
- Todos os campos de um exame preenchidos
- Referência para implementação

#### Página 12 - Cadastro de Exame

- Formulário completo de cadastro de exame
- Campos detalhados

### Profissionais

#### Página 8 - Cadastro de Profissional (INFORMAÇÕES GERAIS)

**Informações Pessoais:**

- Pronome (ele/ela/elu)
- Nome completo
- CPF (com validação)
- Data de nascimento
- Sexo (Masculino/Feminino)
- Celular
- E-mail

**Informações Profissionais:**

- Tipo de contratação: CLT / PJ / AUTÔNOMO
- Profissão
- Código Interno
- Tipo de profissional: REALIZANTE / SOLICITANTE / AMBOS
- Nome do Conselho
- Número do Conselho
- Estado do Conselho (UF)
- Código CBO
- RQE
- Especialidade principal

**Abas:**

- INFORMAÇÕES GERAIS
- ASSINATURA DIGITAL (só aparece se tipo = REALIZANTE ou AMBOS)
- DOCUMENTAÇÃO
- INFORMAÇÕES DO REALIZANTE (só aparece se tipo = REALIZANTE ou AMBOS)
- ENDEREÇO

**Informações do Realizante (se REALIZANTE ou AMBOS):**

- Especialidades que realiza (multiselect)
- Exames que não realiza (lista de exclusão)
- Exames além da especialidade (lista de adição)

#### Página 10 - Visualização de Profissional

- Exemplo: Dr. André Giannini Pinto
- Visualização de todos os dados cadastrados

#### Página 15 - Listagem de Profissionais

- Total: 200 profissionais
- Colunas: Código, Nome, Profissão, Tipo, Conselho, Status, Ações
- Filtros e paginação

#### Páginas 9, 16 - Modal Vincular Assinatura

- Modal para vincular assinatura digital
- Campos:
  - Serial number (certificado digital)
  - Usuário
  - Senha

#### Páginas 11, 17 - Modal "Selecione o que deseja cadastrar"

- Modal de seleção de tipo de cadastro
- Opções disponíveis no contexto

### Usuários

#### Página 20 - Listagem de Usuários

- Total: 300 usuários
- Listagem com dados de usuários do sistema

### Regras de Sistema

#### Página 19 - Regra de Profissional

**REGRA CRÍTICA:**

> "Assinatura Digital e Informações do realizante aparecem APENAS se o tipo profissional for REALIZANTE ou AMBOS"

Esta regra define que as abas:

- ASSINATURA DIGITAL
- INFORMAÇÕES DO REALIZANTE

São condicionais e só devem aparecer quando `tipoProfissional` for:

- `REALIZANTE`
- `AMBOS`

### Arquivos Relacionados

**Implementado:**

- `src/modules/cadastros/profissionais/` - Módulo de profissionais
- `src/modules/exames/matrizes/` - Módulo de matrizes
- `src/modules/exames/exames/` - Módulo de exames

**Pendente de Validação:**

- Verificar campos do profissional vs Figma
- Verificar lógica condicional de abas (tipoProfissional)
- Verificar relacionamento com especialidades

---

## chunk_014_p261-280.pdf

**Páginas**: 261-280
**Status**: Não catalogado
**Conteúdo**:

- [ ] A ser preenchido

---

## chunk_015_p281-300.pdf

**Páginas**: 281-300
**Status**: ✅ Catalogado (01/12/2025)
**Conteúdo**:

### Página 1 - Cadastrar Usuários (Aba Perfis e Permissões)

- Abas: INFORMAÇÕES GERAIS | PERFIS E PERMISSÕES | SEGURANÇA | HISTÓRICO
- Seção "Configurações de perfil e módulos de acesso":
  - Perfil\*: Dropdown (ex: FINANCEIRO)
- Grid de módulos de acesso:
  - Colunas: Módulo, Unidades, Cadastrar, Visualizar, Editar, Excluir, Restrição de acesso, Horário permitido
  - Módulos listados: FINANCEIRO, AGENDAMENTO, LAUDOS, GED, FATURAMENTO, MÓDULO ABC/DEF/GHI/JKL/MNO
  - Restrição de acesso: HORÁRIO COMERCIAL / HORÁRIO ESPECÍFICO (dropdown)
  - Horário permitido: Campo de intervalo (09:00 - 18:00)
- Paginação: 10 de 50 registros
- Seção "Permissões Específicas":
  - Lista dupla com transfer (Disponíveis → Selecionadas)
  - Botões: Selecionar todos / Remover todos
  - Ex: LIBERAR LAUDOS, PODE FECHAR CAIXA
- Seção "Restrições Específicas":
  - Lista dupla com transfer (Disponíveis → Selecionadas)

### Página 2 - Especificação de Campos do Usuário

- **HISTÓRICO**: Campos para rastreamento integrados ao módulo GED
  - Últimos Acessos: Data/Hora, Ação, Módulo, IP de acesso, Unidade
  - Histórico de Alterações: Data/Hora, Usuário que alterou, Campo Alterado, Valor Antigo/Novo
- **SEGURANÇA**: Campos para autenticação
  - Login*, Senha*, Confirmar Senha\*
  - Habilitar 2FA\* (checkbox), Método de 2FA (E-mail, SMS, Aplicativo)
  - Pergunta de Recuperação, Resposta de Recuperação
- **PERFIS E PERMISSÕES**: Níveis de acesso
  - Perfil\*: Dropdown (Recepcionista, Coletora, Administrador, Gestor, etc)
  - Módulos de Acesso\*: Tabela com Módulo, Ação, Unidade, Restrição Temporal
  - Permissões Específicas: Checklist de ações
  - Status do Perfil\*: Ativo, Inativo, Suspenso
- **INFORMAÇÕES PESSOAIS**:
  - Nome Completo*, CPF*, E-mail*, Telefone*, Celular
  - Cargo/Função*, Data de Admissão, Unidades Associadas*, CNPJ Associado\*
- **NOTIFICAÇÕES**:
  - Notificar por E-mail\*, Notificar por WhatsApp

### Página 3 - Editar Tutorial

- Título: "Editar TUTORIAL"
- Campos:
  - Título do video\* (ex: "COMO CADASTRAR UM PACIENTE?")
  - Categoria\* (dropdown: CADASTROS)
  - Status: ATIVO / INATIVO (toggle)
  - Descrição\* (textarea)
  - URL do video\* (campo com validação YouTube)
- Preview do video com player embutido
- Botões: CANCELAR | SALVAR

### Páginas 4-6 - VISUALIZAR MATRIZES DE EXAME

- Indicações de desenvolvimento: "PRONTO PARA DESENVOLVER"

### Página 7 - Visualizar Matriz de Audiometria

- Cabeçalho verde: MAT.AUDIOMETRIA
  - Cadastrado em: data/hora/usuário
  - Última edição: data/hora/usuário
- Configurações iniciais:
  - Tipo de exame: AUDIOMETRIA
  - Exame: AUDIOMETRIA TONAL
  - Código interno: AUD123
- Espaço dedicado para imagens/gráficos do laudo
- Seções do laudo:
  - MEATOSCOPIA: OD / OE (campos XXXXX)
  - AUDIOMETRIA: OD / OE (campos XXXXX)
  - IMPRESSÃO DIAGNÓSTICA (campo XXXXX)

### Página 8 - Cadastrar Agenda (Aba Informações Gerais)

- Título: "Cadastrar AGENDA"
- Abas: INFORMAÇÕES GERAIS | VINCULAÇÃO | NOTIFICAÇÕES E INTEGRAÇÃO
- Botões: CANCELAR | FINALIZAR E VINCULAR AGENDA
- Seção "Informações básicas":
  - Código interno* (AGE001), Nome da agenda*, Unidade Associada\*, Setor
  - Sala\*, Profissional, Especialidade, Equipamento
  - Descrição (textarea)
- Seção "Configuração de agenda":
  - Dias da semana\*: SEG TER QUA QUI SEX SAB DOM FERIADOS (chips)
  - Período de atendimento\*: Horário início/fim
  - Intervalo entre agendamentos\*: Dropdown
  - Capacidade por horário: Campo numérico
  - Capacidade total
  - Data específica + Horário específico + botão ADICIONAR
  - Botão: NOVO PERÍODO
- Seção "Bloqueio de horários":
  - Dia a bloquear, Horário a bloquear, Observação
  - Botão: ADICIONAR DIA

### Página 9 - Visualizar Matriz de Densitometria Óssea

- Cabeçalho verde: MAT.DENSITOMETRIA ÓSSEA
- Configurações iniciais:
  - Tipo de exame: Imagem
  - Exame: Densitometria Óssea
  - Código interno: DES123
- Seções do laudo:
  - COLUNA LOMBAR (BMD)
  - FÊMUR DIREITO (BMD)
  - CONCLUSÃO
- Informações complementares:
  - SIGLA: Explicação dos índices T, Z, BMC, BMD
  - OBSERVAÇÕES E CONCEITOS para interpretação
  - MASSA ÓSSEA EM RELAÇÃO AO ADULTO JOVEM:
    - NORMAL: +1,01 A -1,00 DP
    - OSTEOPENIA: -1,01 A -2,49 DP
    - OSTEOPOROSE: > DO QUE -2,50 DP
- Espaço para imagens/gráficos

### Página 10 - Visualizar Matriz de Eletrocardiograma

- Cabeçalho verde: MAT.ELETROCARDIOGRAMA
- Configurações iniciais:
  - Tipo de exame: EXTERNO
  - Exame: Eletrocardiograma
  - Código interno: ELE123
- Seção ANÁLISE:
  - Ritmo e Frequência Cardíaca
  - Despolarização Atrial - Onda P
  - Condução Atrioventricular - Intervalo PR
  - Despolarização Ventricular - Complexos QRS
  - Repolarização Ventricular (Onda T, Segmento ST e intervalo QT)
- CONCLUSÕES
- Espaço para imagens/gráficos

### Página 11 - Cadastrar Profissionais (Aba Informações Gerais)

- Título: "Cadastrar PROFISSIONAIS"
- Botões header: Baixar planilha | Importar dados | CANCELAR | FINALIZAR
- Aba: INFORMAÇÕES GERAIS
- Seção "Informações pessoais":
  - Pronome pessoal (DR.), Nome completo\*, CPF, Data de nascimento
  - Sexo (MASCULINO), Celular, E-mail
- Seção "Informações profissionais":
  - Tipo de contratação: CLT / PJ / AUTÔNOMO (chips)
  - Profissão\* (dropdown: MÉDICO)
  - Código interno (19011)
  - Tipo de profissional: REALIZANTE / SOLICITANTE / AMBOS (chips)
  - Nome do conselho (CRM)
  - Estado do conselho (SÃO PAULO), Número do conselho (37308)
  - Código CBO (225320), RQE (1257)
  - Especialidade principal (CARDIOLOGIA)

### Página 12 - Cadastrar Profissionais (Aba Agendas Vinculadas)

- Abas: INFORMAÇÕES GERAIS | AGENDAS VINCULADAS
- Seção "Agendas vinculadas":
  - Grid com colunas: Nome da agenda, Dias e Horário, Unidade Associada, Status, Excluir vínculo
  - Exemplo: Ultrassonografia - Unidade São Roque, Seg/Qua/Sex 14:00-18:00, 10min intervalo
- Paginação: 02 de 02 registros
- Seção "Cadastrar agenda":
  - Aviso: "Ao clicar em cadastrar agenda, você será direcionado a outra tela..."
  - Botão: "CLIQUE AQUI PARA CADASTRAR UMA AGENDA"

### Página 13 - EDITAR UNIDADE

- Indicação: "PRONTO PARA DESENVOLVER"

### Página 14 - VISUALIZAR MATRIZES DE EXAME

- Indicação: "PRONTO PARA DESENVOLVER"

### Página 15 - Editar Unidades de Saúde

- Título: "Editar UNIDADES DE SAÚDE - #0001"
- Nota para desenvolvedores:
  - "AS INFORMAÇÕES CONTIDAS NAS TELAS DE EDIÇÃO SERÃO AS MESMAS DO CADASTRO"
  - "SOMENTE MUDANDO AS NOMENCLATURAS NECESSÁRIAS, COMO O TÍTULO ACIMA"

### Página 16 - Visualizar Matriz de Hemograma

- Cabeçalho verde: HEMOGRAMA 1
- Configurações iniciais:
  - Tipo de exame: Laboratorial
  - Exame: Hemograma Completo
  - Código interno: HEM123
- SÉRIE VERMELHA + VALORES DE REFERÊNCIA:
  - ERITRÓCITOS: 4,10 a 5,60 milhões/mm³
  - HEMOGLOBINA: 12,5 a 17,0 g/dL
  - HEMATÓCRITO: 37,5 a 51,0 %
  - VCM: 80,0 a 99,9 μm³
  - HCM: 23,8 a 33,4 pg
  - RDW: 12,0 a 15,4 %
- SÉRIE BRANCA + VALORES DE REFERÊNCIA:
  - LEUCÓCITOS: 3.600 a 12.000 /mm³
  - BASTONETES: 0,0 a 5,0% - 0 a 600 /mm³
  - SEGMENTADOS: 40,0 a 75,0% - 1.440 a 9.000 /mm³
  - EOSINÓFILOS: 1,0 a 5,0% - 36 a 600 /mm³
  - BASÓFILOS: 0,0 a 2,0% - 0 a 240 /mm³
  - LINFÓCITOS: 20,0 a 45,0% - 720 a 5.400 /mm³
  - MONÓCITOS: 1,0 a 12,0% - 36 a 1.440 /mm³
- SÉRIE PLAQUETÁRIA + VALORES DE REFERÊNCIA:
  - PLAQUETAS: 150.000 a 450.000 /mm³
  - VPM: Masculino 7,4 a 11,4 fL / Feminino 7,9 a 10,8 fL
- MÉTODO, MATERIAL

### Páginas 17-20 - Divisores de Seção

- Página 17: AGENDAS (fundo verde)
- Página 18: MÉTODOS (fundo verde)
- Página 19: AMOSTRAS (fundo verde)
- Página 20: KITS (fundo verde)

---

## chunk_016_p301-320.pdf

**Páginas**: 301-320
**Status**: ✅ Catalogado (01/12/2025)
**Conteúdo**:

### Páginas 1-3 - AGENDAS (Indicações de desenvolvimento)

- Página 1: AGENDAS - PRONTO PARA DESENVOLVER
- Página 2: CADASTRAR AGENDAS - PRONTO PARA DESENVOLVER
- Página 3: VISUALIZAR AGENDAS - PRONTO PARA DESENVOLVER

### Páginas 4-6 - MÉTODOS (Indicações de desenvolvimento)

- Página 4: MÉTODOS - PRONTO PARA DESENVOLVER
- Página 5: CADASTRAR MÉTODOS - PRONTO PARA DESENVOLVER
- Página 6: VISUALIZAR MÉTODO - PRONTO PARA DESENVOLVER

### Páginas 7-9 - AMOSTRAS (Indicações de desenvolvimento)

- Página 7: AMOSTRAS - PRONTO PARA DESENVOLVER
- Página 8: CADASTRAR AMOSTRAS - PRONTO PARA DESENVOLVER
- Página 9: VISUALIZAR AMOSTRAS - PRONTO PARA DESENVOLVER

### Páginas 10-13 - KITS (Indicações de desenvolvimento)

- Página 10: KITS - PRONTO PARA DESENVOLVER
- Página 11: CADASTRAR KITS - PRONTO PARA DESENVOLVER
- Página 12: CADASTRAR KITS - PRONTO PARA DESENVOLVER (duplicado)
- Página 13: VISUALIZAR KITS - PRONTO PARA DESENVOLVER

### Página 14 - Agendas (Tela de Listagem)

- Menu lateral completo com navegação (Agendas selecionado)
- Contadores: 20 Equipamentos | 20 Especialidades | 30 Profissionais | 200 Salas
- Filtros: Status (todos), Pesquisar
- Abas de tipo: EQUIPAMENTOS | ESPECIALIDADES | PROFISSIONAIS | SALAS
- Grid de listagem (aba Equipamentos):
  - Colunas: Cód interno, Nome da agenda, Tipo de agenda, Unidade associada, Data da criação, Ativo, Editar, Visualizar, Opções
  - Código: AG-EQU001, AG-EQU002...
  - Tipo: Equipamento
- Paginação: 05 de 50 registros

### Página 15 - Cadastrar Agendas (Aba Informações Gerais)

- Título: "Cadastrar AGENDAS"
- Abas: INFORMAÇÕES GERAIS | VINCULAÇÃO | NOTIFICAÇÕES E INTEGRAÇÃO
- Seção "Informações básicas":
  - Código interno* (AGE001), Nome da agenda*, Unidade Associada\*, Setor
  - Sala\*, Profissional, Especialidade, Equipamento
  - Descrição (textarea)
- Seção "Configuração de agenda":
  - Dias da semana\*: SEG TER QUA QUI SEX SAB DOM FERIADOS
  - Período de atendimento\*: Horário início às fim
  - Intervalo entre agendamentos\*: Dropdown
  - Capacidade por horário: Campo texto
  - Capacidade total, Data específica, Horário específico
  - Botão: ADICIONAR
  - Botão: NOVO PERÍODO
- Seção "Bloqueio de horários":
  - Dia a bloquear, Horário a bloquear (às), Observação
  - Botão: ADICIONAR DIA

### Página 16 - Cadastrar Agendas (Aba Vinculação)

- Abas: INFORMAÇÕES GERAIS | VINCULAÇÃO | NOTIFICAÇÕES E INTEGRAÇÃO
- Seção "Vinculação":
  - Especialidade Associada\*: Multi-select + ADICIONAR
  - Setor Associado\*: Multi-select + ADICIONAR
  - Profissional Associado\*: Multi-select + ADICIONAR
  - Equipamento Associado\*: Multi-select + ADICIONAR
- Cada campo com área de tags "Nenhuma opção adicionada"

### Página 17 - Cadastrar Agendas (Aba Notificações e Integração)

- Abas: INFORMAÇÕES GERAIS | VINCULAÇÃO | NOTIFICAÇÕES E INTEGRAÇÃO
- Seção "Notificações":
  - Notificar via e-mail\*: NÃO / SIM (toggle)
  - Notificar via whatsapp\*: NÃO / SIM (toggle)
  - Prazo pra lembrar\*: Dropdown
- Seção "Canais de integrações":
  - Canais de integração\*: Multi-select + ADICIONAR
  - Integração com convênios\*: NÃO / SIM (toggle)

### Página 18 - Observação sobre Visualização

- Nota (fundo laranja):
  - "A tela de visualização vai funcionar como as demais telas de visualização."
  - "Neste caso, será separado em abas, semelhante ao VISUALIZAR MATERIAIS / INSUMO"

### Página 19 - Menu de Opções (Dropdown)

- Opções do menu (ícone ...):
  - Ativar/Desativar
  - Excluir

### Página 20 - Métodos (Tela de Listagem)

- Menu lateral completo com navegação (Métodos selecionado)
- Contador: 100 Métodos
- Filtros: Status (todos), Pesquisar
- Botão: CADASTRAR (verde)
- Grid de listagem:
  - Colunas: Cód interno, Nome do método, Descrição, Status, Excluir, Editar, Visualizar
  - Código: MET001, MET123...
  - Status: Ativo (verde), Inativo (cinza), Em revisão (laranja)
  - Exemplo: MET001 - PCR (reação em cadeia da Polimerase) - Técnica de amplificação de DNA para detecção viral
- Paginação: 10 de 100 registros

### Resumo das Telas para Implementação

#### Agendas (Módulo completo)

- **Tipos de agenda**: Equipamentos, Especialidades, Profissionais, Salas
- **Campos principais**:
  - Código interno (AG-EQU001, AG-ESP001, etc)
  - Nome, Unidade, Setor, Sala
  - Profissional, Especialidade, Equipamento
  - Dias da semana, Período, Intervalo, Capacidade
  - Bloqueios de horário
- **Vinculações**: ManyToMany com Especialidade, Setor, Profissional, Equipamento
- **Notificações**: E-mail, WhatsApp, Prazo de lembrete
- **Integrações**: Canais externos, Convênios

#### Métodos (Listagem)

- **Campos identificados**:
  - Código interno (MET001)
  - Nome do método
  - Descrição
  - Status (Ativo, Inativo, Em revisão)

---

## chunk_017_p321-340.pdf

**Páginas**: 321-340
**Status**: Não catalogado
**Conteúdo**:

- [ ] A ser preenchido

---

## chunk_018_p341-360.pdf

**Páginas**: 341-360
**Status**: ✅ Catalogado (08/12/2025)
**Conteúdo**:

### Páginas 1-3 - EMPRESAS - LABORATÓRIOS DE APOIO

- Página 1: Divisor de seção "EMPRESAS - LABORATÓRIOS DE APOIO" - PRONTO PARA DESENVOLVER
- Página 2: "CADASTRAR EMPRESAS - LABORATÓRIO DE APOIO - INÍCIO" - PRONTO PARA DESENVOLVER
- Página 3: "CADASTRAR EMPRESAS - LABORATÓRIO DE APOIO - INÍCIO" - AGUARDANDO

### Páginas 4-6 - EMPRESAS - TELEMEDICINA

- Página 4: Divisor de seção "EMPRESAS - TELEMEDICINA" - PRONTO PARA DESENVOLVER
- Página 5: "CADASTRAR EMPRESAS - TELEMEDICINA - INÍCIO" - PRONTO PARA DESENVOLVER
- Página 6: "CADASTRAR EMPRESAS - TELEMEDICINA - INÍCIO" - PRONTO PARA DESENVOLVER

### Páginas 7-8 - EMPRESAS - FORNECEDORES

- Página 7: Divisor de seção "EMPRESAS - FORNECEDORES" - PRONTO PARA DESENVOLVER
- Página 8: "CADASTRAR EMPRESAS - FORNECEDORES - INÍCIO" - PRONTO PARA DESENVOLVER

### Páginas 9-10 - EMPRESAS - PRESTADORES DE SERVIÇO

- Página 9: Divisor de seção "EMPRESAS - PRESTADORES DE SERVIÇO" - PRONTO PARA DESENVOLVER
- Página 10: "CADASTRAR EMPRESAS - PRESTADORES DE SERVIÇO - INÍCIO" - PRONTO PARA DESENVOLVER

### Página 11 - Cadastros Gerais - LISTAGEM UNIFICADA DE EMPRESAS

- Tela principal de listagem com TABS para diferentes tipos de empresa
- Contadores: 20 Convênios | 40 Laboratórios de apoio | 30 Telemedicina | 200 Fornecedores | 100 Prestadores de serviços
- Filtros: Status (todos), Pesquisar
- **ABAS (TABS)**: CONVÊNIOS | LABORATÓRIOS DE APOIO | TELEMEDICINA | FORNECEDORES | PRESTADORES DE SERVIÇO
- Grid de listagem (aba Convênios selecionada):
  - Colunas: Cód interno, Nome fantasia, CNPJ, E-mail comercial, Cidade/Estado, Ativo, Editar, Visualizar, Opções
  - Exemplos: CON001 a CON010 com dados de convênios
- Paginação: 10 de 50 registros
- Menu lateral completo visível

### Página 12 - Menu de Opções (Dropdown)

- Opções: Ativar/Desativar, Excluir

### Página 13 - Cadastrar Empresa (Tipo Genérico - Aba Informações Gerais)

- Seletor de tipo de empresa no topo
- **Aba única**: INFORMAÇÕES GERAIS
- **Seções**:
  1. **Informações básicas**:
     - LOGO (upload de imagem)
     - Código interno*, CNPJ*, Razão Social\*, Nome fantasia, Inscrição Municipal
     - Inscrição Estadual, Telefone fixo*, Celular*, E-mail comercial\*, Site da empresa
  2. **Endereço**:
     - CEP*, Rua*, Número*, Bairro*
     - Complemento, Estado*, Cidade*
  3. **Responsável**:
     - Nome do responsável*, Cargo*, Contato*, E-mail*
  4. **Impostos**:
     - IRRF (%), PIS (%), COFINS (%), CSLL (%), ISS (%), IBS (%), CBS (%)\*
     - Reter ISS (NÃO/SIM), Reter IR, Reter PCC, Reter IBS, Reter CBS, Optante pelo simples nacional
  5. **Financeiro e Pagamento**:
     - Banco*, Agência*, Conta corrente\*
     - Botão: NOVO BANCO
     - Forma de pagamento\*
- Botões: CANCELAR | FINALIZAR

### Página 14 - Cadastrar Empresa CONVÊNIOS (Aba Informações Gerais)

- Tipo selecionado: CONVÊNIOS
- **ABAS**: INFORMAÇÕES GERAIS | INFORMAÇÕES ESPECÍFICAS | INTEGRAÇÃO | ATENDIMENTO | RESTRIÇÕES | PLANOS | INSTRUÇÕES
- Mesmos campos da página 13 (informações gerais comuns)
- Botões: CANCELAR | FINALIZAR

### Página 15 - Cadastrar Empresa CONVÊNIOS (Aba Informações Específicas)

- **Aba selecionada**: INFORMAÇÕES ESPECÍFICAS
- **Seção "Informações do convênio"**:
  - Nome do convênio*, Registro ANS*, Matrícula\*
  - Tipo de convênio* (select), Forma de liquidação* (select), Valor do CH*, Valor do filme*
  - Dia de vencimento*, CNES* (select), TISS (NÃO/SIM), Versão do TISS\*
  - TISS - Código na operadora*, Código Operadora (Autorização)*, Código do prestador\*
- **Seção "Faturamento"**:
  - Envio* (select), Fatura até* (select), Vencimento* (select), Contrato*, Último ajuste\*
  - Instruções para faturamento (textarea)
- **Seção "Outras informações"**:
  - Tabela de serviço* (select), Tabela base* (select), Tabela material\* (select)
  - Co-Participação (NÃO/SIM), Nota Fiscal Exige na Fatura (NÃO/SIM), Contato\*
  - Instruções (textarea), Observações gerais (textarea)

### Página 16 - Cadastrar Empresa CONVÊNIOS (Aba Integração)

- **Aba selecionada**: INTEGRAÇÃO
- **Seção "Vincular integração"**:
  - Integração\* (select dropdown)

### Página 17 - Cadastrar Empresa CONVÊNIOS (Aba Restrições)

- **Aba selecionada**: RESTRIÇÕES
- **Seção "Restrições"**:
  - Tipos de restrição com valores:
    - PLANO → NÃO ESPECIFICADO (select)
    - MÉDICO → NÃO ESPECIFICADO (select)
    - ESPECIALIDADE → NÃO ESPECIFICADO (select)
    - SETOR SOLICITANTE → UNIDADE SÃO ROQUE (select)
    - EXAME/MATERIAL/MEDICAMENTO → Especialidade: IMUNOLOGIA, Citog: CITOMEGALOVÍRUS AVID, Unidade: UNIDADE IBIUNA
  - Cada linha com botão de excluir (lixeira)
  - Botão: NOVA RESTRIÇÃO

### Página 18 - Cadastrar Empresa CONVÊNIOS (Aba Planos)

- **Aba selecionada**: PLANOS
- **Seção "Planos"**:
  - Nome do plano\* (PLANO A)
  - Tabela de preços\* (select: NÃO ESPECIFICADO)
  - Valor CH\* (CÁLCULO PADRÃO)
  - Valor Filme\* (CÁLCULO PADRÃO)
  - Instruções (textarea)
  - Botão de excluir (lixeira)
- Botão: NOVO PLANO

### Página 19 - Cadastrar Empresa CONVÊNIOS (Aba Instruções)

- **Aba selecionada**: INSTRUÇÕES
- **Seção "Histórico de instruções do convênio"**:
  - Campos de input:
    - Instruções (textarea)
    - Prazo da instrução\* (campo)
    - Botão: ADICIONAR
  - Grid de histórico:
    - Colunas: Data do registro, Usuário, Instrução, Prazo da instrução
    - Exemplo: 10/02/2025 - 16:40 | Rafael Biencourt | NECESSÁRIO GUIA AUTORIZADA PARA TODOS OS PROCEDIMENTOS! | 25/02/2025 - 12:00

### Página 20 - Menu de Opções (Dropdown)

- Opções: Ativar/Desativar, Excluir

---

## chunk_019_p361-380.pdf

**Páginas**: 361-380
**Status**: ✅ Catalogado (08/12/2025)
**Conteúdo**:

### Página 1 - Cadastrar Empresa LABORATÓRIO DE APOIO (Aba Integração)

- **ABAS**: INFORMAÇÕES GERAIS | INTEGRAÇÃO | VINCULAR EXAMES
- **Aba selecionada**: INTEGRAÇÃO
- **Seção "Vincular integração"**:
  - Integração\* (select dropdown)

### Página 2 - Menu de Opções (Dropdown)

- Opções: Ativar/Desativar, Excluir

### Página 3 - Cadastrar Empresa TELEMEDICINA (Aba Integração)

- **ABAS**: INFORMAÇÕES GERAIS | INTEGRAÇÃO | VINCULAR EXAMES
- **Aba selecionada**: INTEGRAÇÃO
- **Seção "Vincular integração"**:
  - Integração\* (select dropdown)

### Página 4 - Menu de Opções (Dropdown)

- Opções: Ativar/Desativar, Excluir

### Página 5 - Cadastrar Empresa FORNECEDORES (Aba Informações Específicas)

- **ABAS**: INFORMAÇÕES GERAIS | INFORMAÇÕES ESPECÍFICAS
- **Aba selecionada**: INFORMAÇÕES ESPECÍFICAS
- **Seção "Insumos"**:
  - Grid de insumos com:
    - Categoria\* (select: REAGENTES E INSUMOS)
    - Método de transporte\* (select: CORREIOS)
    - Orçamento mínimo (R$)\* (1.000,00)
    - Botão de excluir (lixeira)
  - Linha vazia para novo insumo
  - Botão: NOVO INSUMO

### Página 6 - Menu de Opções (Dropdown)

- Opções: Ativar/Desativar, Excluir

### Página 7 - Cadastrar Empresa PRESTADORES DE SERVIÇO (Aba Informações Específicas)

- **ABAS**: INFORMAÇÕES GERAIS | INFORMAÇÕES ESPECÍFICAS
- **Aba selecionada**: INFORMAÇÕES ESPECÍFICAS
- **Seção "Serviço prestado"** (múltiplos blocos):
  - Bloco 1 (preenchido):
    - Tipo de serviço\*: MANUTENÇÃO DE EQUIPAMENTOS
    - Tipo de contrato\*: PRAZO FIXO
    - Data de início do contrato\*: 01/01/2025
    - Validade do contrato\*: 2 ANOS
    - Anexar contrato (botão + arquivo anexado)
    - Tipo de pagamento por: SERVIÇO PRESTADO / MENSALIDADE (toggle)
    - Forma de pagamento\*: PIX
    - Chave PIX: 999.999.999-99
    - Profissional (multi-select): Dr. Rafael Bittencourt, Dra. Silvia Bastos Kretzer
    - Botão: EXCLUIR BLOCO
  - Bloco 2 (vazio para preencher):
    - Mesmos campos vazios
- Botão: NOVO SERVIÇO

### Página 8 - INTEGRAÇÕES (Especificação de URLs)

- **URLs de Integração para TISS**:
  - URL de Elegibilidade: https://tissverificaelegibilidade.startiss.com.br/v30500/tissVerificaElegibilidade.asmx
  - URL de autenticação: (não especificada)
  - URL de Solicitação de Autorização: https://wsautorizador.startiss.com.br/v30500/tissSolicitacaoProcedimento.asmx
  - URL de Cancelamento: https://wscancelarguias.startiss.com.br/v30500/tissCancelaGuia.asmx
  - URL do Status de Autorização: https://statusautorizacao.startiss.com.br/v30500/tisssolicitacaostatusautorizacao.asmx
  - URL do Protocolo: (não especificado)
  - URL do Lote Anexo: (não especificado)
  - URL de Comunicação com Beneficiário: (não especificado)

### Página 9 - Cadastrar Empresa CONVÊNIOS (Aba Atendimento)

- **Aba selecionada**: ATENDIMENTO
- **Seção "Cadastro de pacientes"**:
  - CAMPOS OPCIONAIS: CPF próprio, Acomodação, Altura, Cartão SUS, CEP, CID do paciente, Loren ipson loren
  - CAMPOS OBRIGATÓRIOS: Bairro, Cidade, Endereço, Nome da mãe do paciente, Número de matrícula no convênio, Telefone celular
  - Botões para mover entre listas (> <)
  - Link: "Todos opcionais" / "Todos obrigatórios"
- **Seção "Ordem de Serviço"**:
  - CAMPOS OPCIONAIS: Número da guia, Guia principal, Guia operadora, Data última menstruação e gestante, CID, Local de entrega, Plano
  - CAMPOS OBRIGATÓRIOS: Médico requisitante, Especialidade do solicitante, Data da solicitação
- **Seção "TISS"**:
  - CAMPOS OPCIONAIS: Doença, Regime de atendimento, Saúde ocup., Tipo de saída, Tipo de atendimento, Cobertura especial
  - CAMPOS OBRIGATÓRIOS: NENHUMA OPÇÃO SELECIONADA
- **Seção "Tratamento Ambulatorial"**:
  - CAMPOS OPCIONAIS: Guia operadora, Saúde ocup., Cobertura especial, Regime de atendimento, CID
  - CAMPOS OBRIGATÓRIOS: Número da guia
- **Seção "Internamento"**:
  - CAMPOS OPCIONAIS: Número da guia, Cobertura especial, Saúde ocup., Regime de atendimento, Motivo, CID
  - CAMPOS OBRIGATÓRIOS: NENHUMA OPÇÃO SELECIONADA

### Página 10 - RESTRIÇÕES (Especificação)

- **Tipos de Restrição disponíveis**:
  1. Plano: Não Especificado
  2. Médico: Não Especificado
  3. Especialidade: Não Especificado
  4. Setor Solicitante: Unidade São Roque
  5. Exame/Material/Medicamento:
     - Especialidade: Imunologia
     - Citog: Citomegalovírus Avid
     - Unidade Ibiuna

### Página 11 - PLANOS (Especificação)

- **SUB CADASTROS (PLANOS)**:
  - Plano: (não especificado)
  - Tabelas: (não especificadas)
  - Valor CH: Cálculo Padrão
  - Valor Filme: Cálculo Padrão
  - Instruções: (não especificado)

### Página 12 - INSTRUÇÕES (Especificação)

- **Histórico de Instruções do Convênio**:
  - Registro: 10/06/2012 12:22
  - Usuário: APINT
  - Instrução: NECESSÁRIO GUIA AUTORIZADA PARA TODOS OS PROCEDIMENTOS
  - Prazo: 17/06/2012 12:16

### Página 13 - INFORMAÇÕES ESPECÍFICAS (Convênio - Detalhamento)

- **Cadastro de Convênios - Seções e Configurações**:
  - Convênio: INT INTERMEDCI
  - Código Convênio: 55901
  - Registro ANS: Via Fatura
  - Contrato: CONVENI
  - Liquidação: 14 Dígitos
  - Matrícula Dígitos: Ambulatorial
  - Tipo: Cálculo Padrão
  - Valor CH: Cálculo Padrão
  - Valor Filme: Dia (Fora Mês) 1
  - Vencimento: IN3 INTERMED V 3.01 (IN3)
  - Tabela Serviço: 926
  - Tabela Base: BSD BRASÍNDICE (BSD)
  - Tabela Material: 4959525500018
  - Código Prestador: Não
  - Co-Participação: (não especificadas)
  - Observações gerais: (não especificadas)
  - Instruções: (não especificado)
  - CNES: SIM/NA
  - TISS: 4.01.01
  - Versão TISS: Tatiana e Adriana
  - Contato: Sim
  - Nota Fiscal Exige na Fatura: 4959525500018
  - TISS Código na Operadora: 16731
  - Código Operadora (Autorização)

### Página 14 - Cadastros Gerais - LABORATÓRIOS DE APOIO (Listagem)

- Menu lateral com "Laboratórios de apoio" selecionado
- Mesma estrutura da página 11 do chunk_018, mas com aba LABORATÓRIOS DE APOIO selecionada
- Grid de listagem:
  - Colunas: Cód interno, Nome fantasia, CNPJ, E-mail comercial, Cidade/Estado, Ativo, Editar, Visualizar, Opções
  - Exemplos: LAB001 a LAB010 com dados de laboratórios
- Paginação: 10 de 50 registros

### Página 15 - Cadastrar Empresa LABORATÓRIO DE APOIO (Aba Informações Gerais)

- **ABAS**: INFORMAÇÕES GERAIS | INTEGRAÇÃO | VINCULAR EXAMES
- **Aba selecionada**: INFORMAÇÕES GERAIS
- Mesmos campos da página 13 do chunk_018 (informações gerais comuns)

### Página 16 - Cadastrar Empresa LABORATÓRIO DE APOIO (Aba Vincular Exames)

- **Aba selecionada**: VINCULAR EXAMES
- **Seção "Exames"**:
  - Botões: BAIXAR PLANILHA DE EXEMPLO | IMPORTAR DADOS
  - Estatísticas: 0 de 0 registros | 0 de 0 vínculos
  - Checkbox: Somente registros sem vínculo
  - Pesquisar
  - Botão: VINCULAR AUTOMATICAMENTE
- Grid de vínculos:
  - Colunas: Cód interno, Nome do exame interno, Código laboratório, Nome do exame do laboratório, Vínculo, Excluir, Editar
  - Mensagem: "PRÉVIA DA TABELA SERÁ CARREGADA AQUI"

### Página 17 - Cadastros Gerais - TELEMEDICINA (Listagem)

- Menu lateral com "Telemedicina" selecionado
- Grid de listagem:
  - Colunas: Cód interno, Nome fantasia, CNPJ, E-mail comercial, Cidade/Estado, Ativo, Editar, Visualizar, Opções
  - Exemplos: TEL001 a TEL010 com dados de telemedicina
- Paginação: 10 de 50 registros

### Página 18 - Cadastrar Empresa TELEMEDICINA (Aba Informações Gerais)

- **ABAS**: INFORMAÇÕES GERAIS | INTEGRAÇÃO | VINCULAR EXAMES
- **Aba selecionada**: INFORMAÇÕES GERAIS
- Mesmos campos das páginas anteriores (informações gerais comuns)

### Página 19 - Cadastrar Empresa TELEMEDICINA (Aba Vincular Exames)

- **Aba selecionada**: VINCULAR EXAMES
- Mesma estrutura da página 16 (Vincular Exames de Laboratório de Apoio)

### Página 20 - INFORMAÇÕES ESPECÍFICAS (Convênio - Faturamento)

- **Faturamento**:
  - (Nenhuma instrução específica mencionada)
- **Contrato**:
  - Envio:
  - Fat Até:
  - Vencimento:
  - Instruções para Faturamento:
  - Data do Contrato: 00/00/0000
  - Último Ajuste do Contrato: 00/00/0000

### Resumo das Telas para Implementação

#### Empresas (Listagem Unificada) ✅ JÁ IMPLEMENTADO

- Tela única com TABS para todos os tipos de empresa
- Implementado em: `src/modules/cadastros/empresas/`

#### Convênios (Cadastro Completo)

- **ABAS**: Informações Gerais, Informações Específicas, Integração, Atendimento, Restrições, Planos, Instruções
- **Entidades relacionadas**: Plano, Restricao, InstrucaoConvenio
- Implementado em: `src/modules/relacionamento/convenios/`

#### Laboratórios de Apoio

- **ABAS**: Informações Gerais, Integração, Vincular Exames
- Implementado em: `src/modules/relacionamento/laboratorios/`

#### Telemedicina

- **ABAS**: Informações Gerais, Integração, Vincular Exames
- Implementado em: `src/modules/relacionamento/telemedicina/`

#### Fornecedores

- **ABAS**: Informações Gerais, Informações Específicas (Insumos)
- Implementado em: `src/modules/relacionamento/fornecedores/`

#### Prestadores de Serviço

- **ABAS**: Informações Gerais, Informações Específicas (Serviços)
- Implementado em: `src/modules/relacionamento/prestadores-servico/`

#### Campos Específicos por Tipo de Empresa

| Tipo         | Abas Específicas                                                           |
| ------------ | -------------------------------------------------------------------------- |
| Convênio     | Info. Específicas, Integração, Atendimento, Restrições, Planos, Instruções |
| Laboratório  | Integração, Vincular Exames                                                |
| Telemedicina | Integração, Vincular Exames                                                |
| Fornecedor   | Info. Específicas (Insumos)                                                |
| Prestador    | Info. Específicas (Serviços)                                               |

---

## chunk_020_p381-400.pdf

**Páginas**: 381-400
**Status**: Não catalogado
**Conteúdo**:

- [ ] A ser preenchido

---

## chunk_021_p401-420.pdf

**Páginas**: 401-420
**Status**: ✅ Catalogado (30/11/2025)
**Conteúdo**:

### Página 1 - Tabela de Preços (Cadastro)

- Tela de cadastro de tabela de preços
- Campos: Código interno, Nome da tabela, Tipo de tabela (select)
- Campo de observações (textarea)
- Grid editável com colunas:
  - Cód Exame, Nome do exame, Cód Convênio, Moeda, Qntd Filme, Filme separado, Porte, Valor, Custo operacional, Excluir
- Botões: Baixar planilha de exemplo, Importar dados, Adicionar linha
- Paginação: 10 de 10 registros

### Página 2 - Empresa/Laboratório de Apoio (Vincular Exames)

- Abas: Informações gerais, Informações específicas, Vincular exames
- Grid de vínculos de exames:
  - Cód interno, Nome do exame interno, Código laboratório, Nome do exame do laboratório, Vínculo, Excluir, Editar
- Filtros: Somente registros sem vínculo, Pesquisar
- Botões: Baixar planilha de exemplo, Importar dados, Vincular automaticamente
- Estatísticas: X de Y registros, X de Y vínculos

### Página 3 - Vínculo de Exame (Edição detalhada)

- Seção Exames: Código interno (select), Nome exame interno, Código laboratório, Nome exame laboratório
- Sinônimos para o exame, Preço do exame (R$)
- Valores de referência (textarea)
- Seção Coleta e Transporte:
  - Material a enviar (select), Tipo de recipiente para coleta (select), Método de coleta (select)
  - Região de coleta (multi-select com botão Adicionar)
  - Volume mínimo requerido (select), Estabilidade (select)
  - Especialidade (select), Metodologia utilizada (select), Unidade de medida (select)
  - Peso (Sim/Não), Altura (Sim/Não), Volume (Sim/Não)
- Seção Preparo e Coleta:
  - Preparo (textarea), Coleta (textarea), Técnica de coleta (textarea)
- Seção Prazos:
  - Prazo de entrega dos resultados (dias), Dias e Horários de retirada de amostras
  - Geração Automática de Etiqueta (Sim/Não), Formato da etiqueta (select)
- Seção Lembretes:
  - Distribuição (textarea), Rejeição (textarea), Adicionais (textarea), Links úteis (textarea)
- Seção Formulários para atendimento:
  - Botão: Anexar formulários de atendimento

### Página 4 - Tabela de Preços (com dados preenchidos)

- Mesmo layout da página 1, mas com dados exemplo:
  - Código: ABC123, Nome: TABELA CONVENIO X, Tipo: SERVIÇO
  - Grid com 10 registros de exemplo (EXA123, CON123, R$, etc.)
  - Paginação: 10 de 100 registros, páginas 01-04

### Página 5 - Informações Específicas - Laboratório de Apoio (Especificação de campos)

- Lista de campos específicos para laboratório de apoio:
  - Nome do Laboratório, Código de Identificação
  - URL da API exames, Token de Autenticação / Chave API
  - URL da API guia de exames, Token de Autenticação / Chave API
  - Padrão de Comunicação (WebService REST, SOAP, FTP, etc.)
  - Formato do Retorno (HL7, XML, JSON, TISS, PDF)
  - Especialidade, Material a enviar, Meio(s) de coleta, Região de coleta
  - Volume mínimo necessário, Formulário Obrigatório
  - Preparo, Coleta, Técnica de coleta, Estabilidade
  - Distribuição, Rejeição, Adicionais, Links úteis
  - Preço Exame, Prazo, Dias e Horários de Retirada de Amostras
  - Método de Coleta e Transporte, Geração Automática de Etiqueta, Formato da Etiqueta
  - Nome do exame, Código interno exame, Sinônimos para exame
  - Método, Unidade de medida, Valores de Referência
  - Peso (Sim/Não), Altura (Sim/Não), Volume (Sim/Não)

### Página 6 - Informações Gerais de Empresa (Especificação de campos)

- Campos comuns para qualquer tipo de empresa:
  - **Identificação da Empresa**:
    - Tipo de Empresa (Laboratório de Apoio, Prestador de Serviço, Fornecedor, Telemedicina, Convênio)
    - Código Interno, Razão Social, Nome Fantasia, CNPJ, Inscrição Estadual, Inscrição Municipal
  - **Endereço e Contato**:
    - CEP (busca automática), Logradouro, Número, Complemento, Bairro, Cidade, Estado
    - Telefone Fixo, Celular, E-mail Comercial, Site
  - **Responsável e Contato Comercial**:
    - Nome do Responsável, Cargo, Telefone, E-mail
  - **Impostos**:
    - IRRF (%), PIS (%), COFINS (%), CSLL (%), ISS (%), IBS (%), CBS (%)
    - Reter ISS (Não/Sim), Reter IR, Reter PCC, Reter IBS, Reter CBS
    - Optar pelo simples nacional (Não/Sim)
  - **Financeiro e Pagamento**:
    - Banco, Agência, Conta Corrente, Chave Pix
    - Formas de Pagamento Aceitas, Prazos de Pagamento

### Página 7 - ESTRUTURA (Divisor de seção)

- Título da seção: "ESTRUTURA"

### Página 8 - SALAS / SETORES (Divisor de seção)

- Título da seção: "SALAS / SETORES"

### Página 9 - EQUIPAMENTOS / IMOBILIZADOS (Divisor de seção)

- Título da seção: "EQUIPAMENTOS / IMOBILIZADOS"

### Página 10 - ETIQUETAS PARA AMOSTRA (Divisor de seção)

- Título da seção: "ETIQUETAS PARA AMOSTRA"

### Página 11 - ESTRUTURA - SALAS / SETORES (Nova Tela)

- Indicação de nova tela a ser desenvolvida

### Página 12 - ESTRUTURA - EQUIPAMENTOS / IMOBILIZADOS (Nova Tela)

- Indicação de nova tela a ser desenvolvida

### Página 13 - ESTRUTURA - ETIQUETAS PARA AMOSTRA (Skala)

- Indicação de integração com Skala

### Página 14 - Cadastros Gerais - SALAS / SETORES (Tela de listagem)

- Menu lateral com navegação completa:
  - Principais: Unidades de saúde, Exames, Matrizes de Exames, Profissionais, Usuários, Agendas, Métodos, Amostras, Kits
  - Empresas: Convênios, Laboratórios de apoio, Telemedicina, Fornecedores, Prestadores de serviço, Tabela de preços
  - Estrutura: **Salas / Setores**, Equipamentos / Imobilizados, Etiquetas para amostra
  - Documentação: Cabeçalhos / Rodapés, Formulários de atendimento
  - Financeiro: Bancos, Adquirentes, Hierarquia CFO
  - Outros: Importação de tabelas, Integrações, Campos do formulário
- Filtros: Selecione uma unidade (dropdown), Selecione um setor (dropdown), Digite o nome da sala (texto), Botão Adicionar
- Barra de pesquisa
- Grid de listagem:
  - Cód interno (ex: SALA080, SALA079...), Unidade (ex: São Roque, Jardins), Setor (ex: Imagem, Exames), Nome da sala (ex: IMG-04, SALA-03), Status (Ativo/Inativo), Excluir (botão), Inativar (toggle)
- Paginação: 10 de 80 registros

### Página 15 - Cadastros Gerais - EQUIPAMENTOS / IMOBILIZADOS (Tela de listagem)

- Mesma estrutura de menu lateral
- Filtros: Selecione unidade (dropdown), Nome do equipamento (texto), Numeração (texto), Localização (texto), Botão Adicionar
- Barra de pesquisa
- Botão: CADASTRAR (verde, canto superior direito)
- Grid de listagem:
  - Cód interno (ex: EQ100, EQ099...), Unidade (ex: São Roque, Jardins), Nome do equipamento (ex: Raio-X), Numeração (ex: 1592653986625698526), Localização (ex: Sala ABC, Segundo andar), Excluir (botão), Gerar etiqueta (botão)
- Paginação: 10 de 100 registros

### Página 16 - ETIQUETAS PARA AMOSTRA (Skala)

- Indicação: "SERÁ FEITO DIRETO PELA SKALA"
- Mesma estrutura de menu lateral com "Etiquetas para amostra" selecionado

### Página 17 - DOCUMENTAÇÃO (Divisor de seção)

- Título da seção: "DOCUMENTAÇÃO"

### Página 18 - CABEÇALHOS / RODAPÉS (Divisor de seção)

- Título da seção: "CABEÇALHOS / RODAPÉS"

### Página 19 - FORMULÁRIOS DE ATENDIMENTO (Divisor de seção)

- Título da seção: "FORMULÁRIOS DE ATENDIMENTO"

### Página 20 - DOCUMENTAÇÃO - CABEÇALHOS / RODAPÉS (Nova Tela)

- Indicação de nova tela a ser desenvolvida

### Implementações realizadas baseadas neste chunk:

#### Salas (Implementado)

- **Entidade**: `src/modules/configuracoes/estrutura/salas/entities/sala.entity.ts`
- **Campos**: id, codigoInterno, unidadeId, setor (string - campo de formulário), nome, ativo, criadoEm, atualizadoEm
- **Migration**: `src/database/migrations/1764550000000-RefactorSalasTable.ts`

#### Equipamentos (Implementado - Unificado com Imobilizados)

- **Entidade**: `src/modules/configuracoes/estrutura/equipamentos/entities/equipamento.entity.ts`
- **Campos**: id, codigoInterno, unidadeId, nome, numeracao, salaId (FK para localização), ativo, criadoEm, atualizadoEm
- **Migration**: `src/database/migrations/1764560000000-SimplifyEquipamentosAndDropImobilizados.ts`

#### Setores (Removido)

- Setor agora é um campo de formulário (string) na entidade Sala
- Módulo de Setores foi removido completamente
- **Migration**: `src/database/migrations/1764550000001-DropSetoresTable.ts`

#### Imobilizados (Removido)

- Unificado com Equipamentos em uma única entidade
- Tabela `imobilizados` foi dropada

---

## chunk_022_p421-440.pdf

**Páginas**: 421-440
**Status**: ✅ Catalogado e Implementado (01/12/2025)
**Conteúdo**:

### Página 1 - DOCUMENTACAO - FORMULARIOS DE ATENDIMENTO (Divisor de seção)

- Título da seção: "DOCUMENTAÇÃO - FORMULÁRIOS DE ATENDIMENTO"
- Indicação: NOVA TELA

### Página 2 - Cabeçalhos/Rodapés (Tela de listagem) ✅ IMPLEMENTADO

- **Status**: ✅ 100% Implementado (30/11/2025)
- **Endpoint**: `/api/v1/configuracoes/documentacao/cabecalhos-rodapes`
- **Arquivos**:
  - Entity: `src/modules/configuracoes/documentacao/cabecalhos-rodapes/entities/cabecalho-rodape.entity.ts`
  - Migration: `1764512737722-CreateCabecalhosRodapesTable.ts`
  - Service: `src/modules/configuracoes/documentacao/cabecalhos-rodapes/services/cabecalhos-rodapes.service.ts`
  - Controller: `src/modules/configuracoes/documentacao/cabecalhos-rodapes/controllers/cabecalhos-rodapes.controller.ts`
- Menu lateral completo com navegação
- Filtros superiores:
  - Selecione uma unidade (dropdown)
  - Toggle: Cabeçalho / Rodapé
  - Botão: IMPORTAR IMAGEM
  - Botão: ADICIONAR (verde)
- Grid de listagem:
  - Colunas: Unidade, Tipo, Imagem, Excluir, Baixar
  - Exemplos: São Roque, Jardins, Navegantes (cada uma com cabeçalho e rodapé)
- Paginação: 06 de 06 registros

### Página 3 - Formulários de Atendimento (Tela de listagem) ✅ IMPLEMENTADO

- **Status**: ✅ 100% Implementado (01/12/2025)
- **Endpoint**: `/api/v1/configuracoes/documentacao/formularios-atendimento`
- **Arquivos**:
  - Entity: `src/modules/configuracoes/documentacao/formularios-atendimento/entities/formulario-atendimento.entity.ts`
  - Migration: `1764578306901-CreateFormulariosAtendimentoTable.ts`
  - Service: `src/modules/configuracoes/documentacao/formularios-atendimento/services/formularios-atendimento.service.ts`
  - Controller: `src/modules/configuracoes/documentacao/formularios-atendimento/controllers/formularios-atendimento.controller.ts`
- Menu lateral com "Formulários de atendimento" selecionado
- Filtros superiores:
  - Selecione uma unidade (dropdown)
  - Botão: IMPORTAR FORMULÁRIO
  - Campo texto: Observação
  - Botão: ADICIONAR (verde)
- Grid de listagem:
  - Colunas: Unidade, Documento, Observação, Excluir, Baixar
  - Documento: Nome_da_documento.pdf
  - Observação: "Formulário para loren ipson loren"
- Paginação: 06 de 06 registros

### Página 4 - BANCOS (Divisor de seção verde)

- Título da seção: "BANCOS"

### Página 5 - ADQUIRENTES (Divisor de seção verde)

- Título da seção: "ADQUIRENTES"

### Página 6 - HIERARQUIA CFO (Divisor de seção verde)

- Título da seção: "HIERARQUIA CFO - Classe Financeira Orçamentária"

### Página 7 - CADASTROS FINANCEIRO (Divisor de seção verde)

- Título da seção: "CADASTROS FINANCEIRO"

### Páginas 8-10 - BANCOS (Indicações de desenvolvimento)

- Página 8: BANCOS - PRONTO PARA DESENVOLVER
- Página 9: CADASTRAR BANCOS - PRONTO PARA DESENVOLVER
- Página 10: VISUALIZAR BANCOS - PRONTO PARA DESENVOLVER

### Páginas 11-13 - ADQUIRENTES (Indicações de desenvolvimento)

- Página 11: ADQUIRENTES - PRONTO PARA DESENVOLVER
- Página 12: CADASTRAR ADQUIRENTES - PRONTO PARA DESENVOLVER
- Página 13: VISUALIZAR ADQUIRENTES - PRONTO PARA DESENVOLVER

### Páginas 14-16 - HIERARQUIA CFO (Indicações de desenvolvimento)

- Página 14: HIERARQUIA CFO - PRONTO PARA DESENVOLVER
- Página 15: CADASTRAR HIERARQUIA CFO - PRONTO PARA DESENVOLVER
- Página 16: VISUALIZAR HIERARQUIA CFO - PRONTO PARA DESENVOLVER

### Página 17 - Bancos/Contas Bancárias (Tela de listagem)

- Contador: "10 Bancos" (ícone de banco)
- Filtros: Status (todos), Unidade (todas), Pesquisar
- Grid de listagem:
  - Colunas: Cód interno, Banco, Descrição, Unidade Associada, Status, Excluir, Editar, Visualizar
  - Status possíveis: Ativo (verde), Inativo (cinza), Suspenso (laranja)
  - Exemplos: BAN001-BAN004, bancos 237-Bradesco e 033-Santander
- Paginação: 04 de 10 registros

### Página 18 - Cadastrar Bancos (Tela de cadastro - Aba Informações Gerais)

- Abas: INFORMAÇÕES GERAIS | INTEGRAÇÃO
- Seção "Informações iniciais":
  - Código interno\* (ex: BAN001, auto-gerado)
  - Banco\* (select - lista de bancos do BACEN)
  - Descrição\* (texto livre - ex: "Conta principal para pagamentos de fornecedores")
  - Status do banco (select)
- Seção "Informações da conta":
  - Agência\* (número)
  - Conta corrente\* (número)
  - Dígito verificador\* (número com tooltip)
  - Tipo de conta\* (select)
  - Chave PIX (texto)
  - Unidades Associadas\* (multi-select + botão ADICIONAR)
- Botão: NOVA CONTA (para adicionar múltiplas contas)
- Botões: CANCELAR | FINALIZAR

### Página 19 - Cadastrar Bancos (Tela de cadastro - Aba Integração)

- Abas: INFORMAÇÕES GERAIS | INTEGRAÇÃO (selecionada)
- Seção "Vincular integração":
  - Integração\* (select)
  - Botão: TESTAR CONEXÃO
  - Validade de configuração da API\* (data --/--/----)
  - Contingência\* (texto - "Digite a chave de uma API alternativa")
- Botões: CANCELAR | FINALIZAR

### Página 20 - Observação sobre Visualização

- Nota: "A tela de visualização vai funcionar como as demais telas de visualização"

### Implementações realizadas baseadas neste chunk:

#### Cabeçalhos/Rodapés (Implementado - 30/11/2025)

- **Entidade**: `src/modules/configuracoes/documentacao/cabecalhos-rodapes/entities/cabecalho-rodape.entity.ts`
- **Campos**: id, unidadeId, tipo (CABECALHO/RODAPE), nomeArquivo, caminhoArquivo, mimeType, tamanho, ativo, criadoEm, atualizadoEm
- **Migration**: `src/database/migrations/1764512737722-CreateCabecalhosRodapesTable.ts`
- **Service**: `src/modules/configuracoes/documentacao/cabecalhos-rodapes/services/cabecalhos-rodapes.service.ts`
- **Controller**: `src/modules/configuracoes/documentacao/cabecalhos-rodapes/controllers/cabecalhos-rodapes.controller.ts`
- **Module**: `src/modules/configuracoes/documentacao/cabecalhos-rodapes/cabecalhos-rodapes.module.ts`
- **Funcionalidades**: Upload de imagem (JPG, PNG, GIF, WEBP), Download, Exclusão
- **Validações**: Tamanho máximo 1MB, formatos de imagem apenas
- **Constraint**: UNIQUE(unidade_id, tipo) - Uma unidade só pode ter 1 cabeçalho e 1 rodapé
- **Armazenamento**: Local em `uploads/cabecalhos-rodapes/{unidadeId}/`

#### Formulários de Atendimento (PENDENTE)

- **Entidade necessária**: `FormularioAtendimento`
- **Campos identificados**:
  - id, unidadeId, nomeDocumento, caminhoArquivo, observacao, criadoEm, atualizadoEm
- **Funcionalidades**: Upload de PDF, Download, Exclusão
- **Relacionamento**: ManyToOne com UnidadeSaude

#### Bancos/Contas Bancárias (Ajustes necessários)

- O sistema já tem módulo de Bancos (seeder com 270 bancos BACEN)
- **Falta implementar**: Contas Bancárias por unidade
- **Entidade necessária**: `ContaBancaria`
- **Campos identificados**:
  - id, codigoInterno (BAN001), bancoId (FK), descricao, status (ATIVO/INATIVO/SUSPENSO)
  - agencia, contaCorrente, digitoVerificador, tipoConta, chavePix
  - unidadesAssociadas (ManyToMany com UnidadeSaude)
  - integracaoId, validadeApiConfig, chaveContingencia

---

## chunk_023_p441-460.pdf

**Páginas**: 441-460
**Status**: ✅ Catalogado (01/12/2025)
**Conteúdo**:

### Página 1 - Adquirentes (Tela de listagem)

- Menu lateral completo com navegação (Adquirentes selecionado)
- Contador: "50 Adquirentes" (ícone)
- Filtros superiores:
  - Status: todos (dropdown)
  - Unidade: todas (dropdown)
  - Pesquisar (campo texto)
- Botão: CADASTRAR (verde, canto superior direito)
- Grid de listagem:
  - Colunas: Cód interno, Nome do adquirente, Descrição, Conta Associada, Unidades Associadas, Ativo, Editar, Visualizar, Opções
  - Exemplo: ADQ001, Picpay, "Loren ipson loren ipson", 237 - Bradesco - 123456-7, São Roque, Sim
- Paginação: 05 de 50 registros

### Página 2 - Menu de Opções (Adquirentes)

- Dropdown de opções (ícone ...):
  - Ativar/Desativar
  - Excluir

### Página 3 - Cadastrar Adquirentes (Aba Informações Gerais - vazio)

- Abas: INFORMAÇÕES GERAIS | INTEGRAÇÃO
- Seção "Informações iniciais":
  - Código interno\* (ex: ADQ001, auto-gerado)
  - Nome do adquirente\* (texto)
  - Descrição\* (texto)
  - Conta Associada\* (select)
- Seção "Informações específicas":
  - Unidades Associadas\* (multi-select + botão ADICIONAR)
- Seção "Informações financeiras":
  - Tipo de cartões suportados\* (multi-select + ADICIONAR) - Ex: Mastercard
  - Opção de parcelamento\* (select)
  - Taxa por transação (texto - %)
  - Taxa por parcelamento (texto - %)
  - Porcentagem de repasse\* (texto - %)
  - Prazo de repasse\* (texto)
- Seção "Restrições":
  - Unidade (select)
  - Restrição (select)
  - Botão: NOVA RESTRIÇÃO
- Botões: CANCELAR | FINALIZAR

### Página 4 - Cadastrar Adquirentes (Aba Integração - vazio)

- Abas: INFORMAÇÕES GERAIS | INTEGRAÇÃO (selecionada)
- Seção "Vincular integração":
  - Integração\* (select)
  - Botão: TESTAR CONEXÃO
  - Validade de configuração da API\* (campo data --/--/----)
  - Contingência\* (texto - "Digite a chave de uma API alternativa")
- Botões: CANCELAR | FINALIZAR

### Página 5 - Observação sobre Visualização (Adquirentes)

- Nota informativa (fundo laranja):
  - "OBSERVAÇÃO: A tela de visualização vai funcionar como as demais telas de visualização."

### Página 6 - Cadastrar Bancos (Aba Integração - preenchido)

- Título: "Cadastrar BANCOS"
- Abas: INFORMAÇÕES GERAIS | INTEGRAÇÃO (selecionada)
- Seção "Vincular integração":
  - Integração: "GATEWAY DE PAGAMENTO - LOREN IPSON" (selecionado)
  - Botão: TESTAR CONEXÃO
  - Mensagem de sucesso: "Conexão bem sucedida" (verde, com ícone ✓)
  - Validade de configuração da API: 31/01/2026
  - Contingência: chave longa preenchida
- Botões: CANCELAR | FINALIZAR

### Página 7 - Hierarquia CFO (Tela de listagem)

- Menu lateral com "Hierarquia CFO" selecionado
- Contador: "02 Hierarquias CFO" (ícone)
- Grid de listagem:
  - Colunas: Cód interno, Descrição da hierarquia, Cadastrado em, Última edição, Editar, Visualizar, Ativar
  - Exemplo 1: HCFO01, "Hierarquia 2025", 10/01/2025 - 12:52 / Rafael Biencourt, 12/01/2025 - 16:05 / Rafael Biencourt, toggle ativo
  - Exemplo 2: HCFO01, "Hierarquia 2020", 10/01/2020 - 09:15 / Samuel Oliveira, 25/01/2021 - 14:02 / Samuel Oliveira, toggle inativo
- Paginação: 04 de 10 registros

### Página 8 - Cadastrar Hierarquia CFO (vazio)

- Título: "Cadastrar HIERARQUIA CFO - CLASSE FINANCEIRA ORÇAMENTÁRIA"
- Campo: Descrição da hierarquia\* (texto)
- Grid editável com drag-and-drop:
  - Colunas: Nível de classificação, Código hierárquico, Código contábil, Nome da classe, Vínculos, Excluir, Desativar
  - Linha TÍTULO: campo texto para nome do título
  - Linha de nível: botões 01/02/03/04 para selecionar nível, código hierárquico (ex: 1), código contábil (Preencha), nome da classe (texto), vínculos (multi-select), excluir (ícone), desativar (toggle)
- Botões: ADICIONAR TÍTULO | ADICIONAR NÍVEL
- Contador: 02 registros
- Botões: CANCELAR | FINALIZAR

### Página 9 - Visualizar Hierarquia CFO

- Cabeçalho verde com:
  - Título: "HIERARQUIA 2025"
  - Cadastrado em: 01/02/2025 - 12:15 / Rafael Bittencourt
  - Última edição: 01/02/2025 - 17:25 / Giovana Ferreira
- Estrutura hierárquica em árvore (indentação visual):
  - **DESPESAS** (título em verde)
    - 1 - DESPESAS COM PESSOAL
      - 1.1 - SALÁRIOS (texto cinza claro)
        - 1.1.1 - JOÃO DA SILVA (texto cinza mais claro)
          - 1.1.1.1 - LOREN IPSON LOREN
      - 1.2 - ENCARGOS
        - 1.2.1 - JOÃO DA SILVA
  - **ORGANIZAÇÃO DE RECEITAS** (título em verde)
    - 2 - RECEITAS
      - 2.1 - ANUIDADES/MENSALIDADES
      - 2.2 - RECEITAS DIVERSAS
      - 2.3 - RECEITAS DE APLICAÇÕES FINANCEIRA

### Página 10 - Cadastrar Bancos (Aba Informações Gerais - preenchido)

- Título: "Cadastrar BANCOS"
- Abas: INFORMAÇÕES GERAIS (selecionada) | INTEGRAÇÃO
- Seção "Informações iniciais":
  - Código interno\*: BAN001
  - Banco\*: 237 - BRADESCO (select)
  - Descrição\*: CONTA PRINCIPAL PARA PAGAMENTOS DE FORNECEDORES
  - Status do banco: ATIVO (select)
- Seção "Informações da conta":
  - Agência\*: 1234-5
  - Conta corrente\*: 123456-7
  - Dígito verificador\*: 8 (com tooltip)
  - Tipo de conta\*: CORRENTE (select)
  - Chave PIX: 999.999.999-99
  - Unidades Associadas\*: (multi-select + ADICIONAR) - São Roque, Jardins (tags removíveis)
- Botão: NOVA CONTA (para adicionar múltiplas contas)
- Botões: CANCELAR | FINALIZAR

### Página 11 - Cadastrar Adquirentes (Aba Informações Gerais - preenchido)

- Título: "Cadastrar ADQUIRENTES"
- Abas: INFORMAÇÕES GERAIS (selecionada) | INTEGRAÇÃO
- Seção "Informações iniciais":
  - Código interno\*: ADQ001
  - Nome do adquirente\*: PICPAY
  - Descrição\*: LOREN IPSON LOREN
  - Conta Associada\*: 237 - BRADESCO - 123456-7 (select)
- Seção "Informações específicas":
  - Unidades Associadas\*: São Roque (tag removível)
- Seção "Informações financeiras":
  - Tipo de cartões suportados\*: Mastercard, Visa (tags removíveis)
  - Opção de parcelamento\*: 12X
  - Taxa por transação: 1%
  - Taxa por parcelamento: 3%
  - Porcentagem de repasse\*: 10%
  - Prazo de repasse\*: 5 DIAS ÚTEIS
- Seção "Restrições":
  - Unidade: SÃO ROQUE
  - Restrição: NÃO PODE PARCELAR LOREN IPSON
- Botão: NOVA RESTRIÇÃO
- Botões: CANCELAR | FINALIZAR

### Página 12 - Cadastrar Hierarquia CFO (preenchido)

- Título: "Cadastrar HIERARQUIA CFO - CLASSE FINANCEIRA ORÇAMENTÁRIA"
- Campo: Descrição da hierarquia\*: HIERARQUIA 2025
- Grid com 12 registros preenchidos (drag-and-drop habilitado):
  - **TÍTULO: DESPESAS**
    - Nível 01: código 1 | contábil 0001 | DESPESA COM PESSOAL | vínculos: FINANCEIRO + 2
    - Nível 02: código 1.1 | contábil 0002 | SALÁRIOS | vínculos: FINANCEIRO
    - Nível 03: código 1.1.1 | contábil - | JOÃO DA SILVA | vínculos: -
    - Nível 04: código 1.1.1.1 | contábil - | LOREN IPSON LOREN | vínculos: -
    - Nível 02: código 1.2 | contábil - | ENCARGOS | vínculos: -
    - Nível 03: código 1.2.1 | contábil - | JOÃO DA SILVA | vínculos: -
  - **TÍTULO: ORGANIZAÇÃO DE RECEITAS**
    - Nível 01: código 2 | contábil 0006 | RECEITAS | vínculos: FINANCEIRO
    - Nível 02: código 2.1 | contábil - | ANUIDADES/MENSALIDADES | vínculos: -
    - Nível 02: código 2.2 | contábil - | RECEITAS DIVERSAS | vínculos: -
    - Nível 02: código 2.2 | contábil - | RECEITAS DE APLICAÇÕES FINANCEIRA | vínculos: -
- Botões: ADICIONAR TÍTULO | ADICIONAR NÍVEL
- Contador: 12 registros
- Botões: CANCELAR | FINALIZAR

### Página 13 - CADASTROS OUTROS (Divisor de seção)

- Título da seção: "CADASTROS OUTROS" (fundo verde)

### Página 14 - IMPORTAÇÃO DE TABELAS (Divisor de seção)

- Título da seção: "IMPORTAÇÃO DE TABELAS" (fundo amarelo)

### Página 15 - INTEGRAÇÕES (Divisor de seção)

- Título da seção: "INTEGRAÇÕES" (fundo verde)

### Página 16 - CAMPOS DO FORMULÁRIO (Divisor de seção)

- Título da seção: "CAMPOS DO FORMULÁRIO" (fundo verde)

### Página 17 - IMPORTAÇÃO DE TABELAS (Indicação de desenvolvimento)

- "IMPORTAÇÃO DE TABELAS - NOVA TELA"
- Status: Nova funcionalidade a ser desenvolvida

### Página 18 - INTEGRAÇÕES (Indicação de desenvolvimento)

- "INTEGRAÇÕES - PRONTO PARA DESENVOLVER"
- Status: Pronto para desenvolvimento

### Página 19 - CADASTRAR INTEGRAÇÃO (Indicação de desenvolvimento)

- "CADASTRAR INTEGRAÇÃO - PRONTO PARA DESENVOLVER"
- Status: Pronto para desenvolvimento

### Página 20 - CAMPOS DO FORMULÁRIO (Indicação de desenvolvimento)

- "CAMPOS DO FORMULÁRIO - PRONTO PARA DESENVOLVER"
- Status: Pronto para desenvolvimento

### Resumo das Telas para Implementação

#### Adquirentes (PENDENTE)

- **Entidade necessária**: `Adquirente`
- **Campos identificados**:
  - id, codigoInterno (ADQ001), nome, descricao
  - contaBancariaId (FK para conta bancária)
  - unidadesAssociadas (ManyToMany com UnidadeSaude)
  - tipoCartoesSuportados (array: Mastercard, Visa, etc)
  - opcaoParcelamento (select/enum)
  - taxaTransacao (decimal %), taxaParcelamento (decimal %)
  - percentualRepasse (decimal %), prazoRepasse (texto/int)
  - integracaoId, validadeApiConfig, chaveContingencia
  - ativo, criadoEm, atualizadoEm
- **Relacionamento**: ManyToMany com UnidadeSaude
- **Tabela adicional**: `adquirentes_restricoes` (unidadeId, restricao)

#### Hierarquia CFO (PENDENTE)

- **Entidades necessárias**: `HierarquiaCfo`, `ClasseCfo`
- **Campos HierarquiaCfo**:
  - id, codigoInterno (HCFO01), descricao
  - ativo, criadoPor, atualizadoPor, criadoEm, atualizadoEm
- **Campos ClasseCfo**:
  - id, hierarquiaId (FK)
  - tipo (TITULO | NIVEL)
  - nivelClassificacao (1-4)
  - codigoHierarquico (ex: 1.1.1)
  - codigoContabil (texto)
  - nomeClasse (texto)
  - vinculos (ManyToMany com alguma entidade?)
  - ordem (para drag-and-drop)
  - ativo, criadoEm, atualizadoEm
- **Estrutura**: Hierárquica com até 4 níveis + títulos

#### Importação de Tabelas (PENDENTE)

- Nova tela a ser desenvolvida
- Funcionalidade para importar dados via planilhas

#### Integrações (PENDENTE)

- Nova tela de listagem e cadastro de integrações
- Campos: nome, tipo, url, token, status conexão, etc

#### Campos do Formulário (JÁ EXISTE - `infraestrutura/campos-formulario`)

- Já implementado em `src/modules/infraestrutura/campos-formulario/`
- Verificar se precisa de ajustes baseado no Figma

---

## chunk_024_p461-480.pdf

**Páginas**: 461-480
**Status**: Não catalogado
**Conteúdo**:

- [ ] A ser preenchido

---

## chunk_025_p481-500.pdf

**Páginas**: 481-500
**Status**: Não catalogado
**Conteúdo**:

- [ ] A ser preenchido

---

## chunk_026_p501-501.pdf

**Páginas**: 501
**Status**: Não catalogado
**Conteúdo**:

- [ ] A ser preenchido

---

## Legenda de Status

- ✅ Catalogado - Conteúdo analisado e documentado
- 🚧 Em progresso - Análise parcial
- ❌ Não catalogado - Ainda não analisado

## Como usar este documento

1. Ao receber uma solicitação relacionada ao Figma, consulte este documento primeiro
2. Localize o chunk correspondente às páginas mencionadas
3. Leia o PDF em `/home/diego/Projects/erplab/pdf_chunks/chunk_XXX_pYYY-ZZZ.pdf`
4. Após implementar, atualize este documento com os detalhes

## Última atualização

**Data**: 08/12/2025
**Chunks catalogados**: 6 de 26
