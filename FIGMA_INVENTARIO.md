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
**Status**: Não catalogado
**Conteúdo**:

- [ ] A ser preenchido

---

## chunk_014_p261-280.pdf

**Páginas**: 261-280
**Status**: Não catalogado
**Conteúdo**:

- [ ] A ser preenchido

---

## chunk_015_p281-300.pdf

**Páginas**: 281-300
**Status**: Não catalogado
**Conteúdo**:

- [ ] A ser preenchido

---

## chunk_016_p301-320.pdf

**Páginas**: 301-320
**Status**: Não catalogado
**Conteúdo**:

- [ ] A ser preenchido

---

## chunk_017_p321-340.pdf

**Páginas**: 321-340
**Status**: Não catalogado
**Conteúdo**:

- [ ] A ser preenchido

---

## chunk_018_p341-360.pdf

**Páginas**: 341-360
**Status**: Não catalogado
**Conteúdo**:

- [ ] A ser preenchido

---

## chunk_019_p361-380.pdf

**Páginas**: 361-380
**Status**: Não catalogado
**Conteúdo**:

- [ ] A ser preenchido

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
**Status**: Catalogado (30/11/2025)
**Conteúdo**:

### Página 1 - DOCUMENTACAO - FORMULARIOS DE ATENDIMENTO (Divisor de seção)

- Título da seção: "DOCUMENTAÇÃO - FORMULÁRIOS DE ATENDIMENTO"
- Indicação: NOVA TELA

### Página 2 - Cabeçalhos/Rodapés (Tela de listagem)

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

### Página 3 - Formulários de Atendimento (Tela de listagem)

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
**Status**: Não catalogado
**Conteúdo**:

- [ ] A ser preenchido

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

**Data**: 30/11/2025
**Chunks catalogados**: 2 de 26
