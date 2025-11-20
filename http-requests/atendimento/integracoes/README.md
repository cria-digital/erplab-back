# 🔌 Integrações - Sistema ERP Lab

## 📋 Visão Geral

Este módulo gerencia todas as integrações do sistema com serviços externos, incluindo:

- Laboratórios de Apoio (SOAP/API)
- Telemedicina
- Gateway de Pagamento
- Bancos
- Prefeitura (NFSe)
- SEFAZ
- Convênios
- E outras integrações

## 🏗️ Arquitetura

O módulo de integrações usa uma **tabela genérica** (`integracoes`) que suporta múltiplos tipos de integrações através de:

- **Campos comuns**: URLs, credenciais, timeout, status, monitoramento
- **Campo JSONB**: `configuracoesAdicionais` para armazenar dados específicos de cada tipo

## 🧪 Integração Hermes Pardini

### Informações do Laboratório

**Hermes Pardini - PRODUÇÃO**

- Login: `15665`
- Senha: `5431`
- URL: `https://www.hermespardini.com.br/b2b/HPWS.XMLServer.cls`
- Cliente: LC 4895 - INSTITUTO SAO LUCAS SR LTDA EPP

**Hermes Pardini - TESTE/HOMOLOGAÇÃO**

- Login: `12000`
- Senha: `5990`
- URL: `https://www.hermespardini.com.br/b2bhomologa/HPWS.XMLServer.cls`

### 16 Webservices Disponíveis

1. **WSRecebeAtendimento** - Receber requisições de exames
2. **WSEnviaLaudo** - Enviar laudo individual
3. **WSEnviaLaudoLista** - Enviar lista de laudos
4. **WSEnviaLaudoPeriodo** - Enviar laudos por período
5. **WSConsultaStatus** - Consultar status de exames
6. **WSEnviaAmostras** - Enviar informações de amostras
7. **WSListaProcedimentosPendentes** - Listar procedimentos pendentes
8. **WSEnviaAmostrasPendentes** - Enviar amostras pendentes
9. **WSEnviaLoteResultados** - Enviar lote de resultados
10. **WSEnviaResultadoBase64** - Enviar resultado em Base64
11. **WSRelatorioRequisicoes** - Gerar relatório de requisições
12. **WSCancelaAmostra** - Cancelar amostra
13. **WSConsultaPendenciaTecnica** - Consultar pendências técnicas
14. **WSConsultaRastreabilidade** - Consultar rastreabilidade
15. **WSGrupoFracionamento** - Gerenciar grupos de fracionamento
16. **WSCancelaExame** - Cancelar exame

## 📚 Documentação Oficial

- **Webservice**: http://www.hermespardini.com.br/cal/hpws_1/documentacao.html
- **Tabela de Exames**: http://www.hermespardini.com.br/cal/tabexalhpV2.xml
- **Modelos de Retorno**: https://www.hermespardini.com.br/cal/exames/modelos.xml
- **Manual Retorno**: http://www.hermespardini.com.br/cal/Manual_Retorno.zip

## 🚀 Como Usar

### 1. Autenticar no Sistema

```bash
POST /api/v1/auth/login
{
  "email": "seu@email.com",
  "password": "sua-senha"
}
```

### 2. Criar Integração

Use o arquivo `hermes-pardini.http` como referência. Os dados específicos da integração vão no campo `configuracoesAdicionais` (JSONB).

### 3. Testar Conexão

```bash
POST /api/v1/atendimento/integracoes/{id}/testar-conexao
```

### 4. Ativar Integração

```bash
PATCH /api/v1/atendimento/integracoes/{id}/status?status=ativa
```

## 📊 Endpoints Disponíveis

| Método   | Endpoint                                      | Descrição        |
| -------- | --------------------------------------------- | ---------------- |
| `POST`   | `/atendimento/integracoes`                    | Criar integração |
| `GET`    | `/atendimento/integracoes`                    | Listar todas     |
| `GET`    | `/atendimento/integracoes/ativos`             | Listar ativas    |
| `GET`    | `/atendimento/integracoes/estatisticas`       | Estatísticas     |
| `GET`    | `/atendimento/integracoes/tipo/:tipo`         | Por tipo         |
| `GET`    | `/atendimento/integracoes/status/:status`     | Por status       |
| `GET`    | `/atendimento/integracoes/codigo/:codigo`     | Por código       |
| `GET`    | `/atendimento/integracoes/:id`                | Por ID           |
| `PATCH`  | `/atendimento/integracoes/:id`                | Atualizar        |
| `PATCH`  | `/atendimento/integracoes/:id/toggle-status`  | Ativar/Desativar |
| `PATCH`  | `/atendimento/integracoes/:id/status`         | Atualizar status |
| `POST`   | `/atendimento/integracoes/:id/testar-conexao` | Testar conexão   |
| `POST`   | `/atendimento/integracoes/:id/sincronizar`    | Sincronizar      |
| `DELETE` | `/atendimento/integracoes/:id`                | Remover          |

## 🔧 Tipos de Integração

- `laboratorio_apoio` - Laboratórios de Apoio
- `telemedicina` - Plataformas de Telemedicina
- `gateway_pagamento` - Gateways de Pagamento
- `banco` - Bancos (boletos, PIX)
- `prefeitura_nfse` - Prefeituras (NFSe)
- `sefaz` - SEFAZ (NFe, NFCe)
- `receita_federal` - Receita Federal
- `power_bi` - Power BI
- `pabx` - PABX
- `correios` - Correios
- `ocr` - OCR
- `convenios` - Convênios
- `adquirentes` - Adquirentes
- `pacs` - PACS
- `email` - Email
- `whatsapp` - WhatsApp
- `concessionarias` - Concessionárias
- `outros` - Outros

## 🔐 Status da Integração

- `em_configuracao` - Em configuração inicial
- `ativa` - Ativa e funcionando
- `inativa` - Inativa (pausada)
- `erro` - Com erro
- `manutencao` - Em manutenção

## 📝 Padrões de Comunicação

- `rest_api` - REST API
- `soap` - SOAP (usado pelo Hermes Pardini)
- `graphql` - GraphQL
- `webhook` - Webhook
- `ftp` - FTP
- `sftp` - SFTP
- `email` - Email
- `database` - Database
- `file` - File
- `manual` - Manual

## ⚙️ Configurações Adicionais (JSONB)

O campo `configuracoesAdicionais` aceita qualquer estrutura JSON. Para o Hermes Pardini, usamos:

```json
{
  "ambiente": "producao|teste|homologacao",
  "cliente": "Nome do cliente",
  "valorReferencia": "0|1|2",
  "papelTimbrado": false,
  "versaoResultado": 1,

  "urlTabelaExamesEnvio": "URL da tabela",
  "urlModelosRetorno": "URL dos modelos",
  "urlManualRetorno": "URL do manual",

  "webservicesDisponiveis": {
    "wsRecebeAtendimento": true,
    "wsEnviaLaudo": true,
    ...
  },

  "configuracoesTecnicas": {
    "timeoutConexao": 30000,
    "tentativasRetry": 3,
    "intervaloRetry": 5000,
    "validaCertificadoSSL": true,
    "logRequisicoes": true,
    "logRespostas": true
  },

  "notificacoes": {
    "notificarErro": true,
    "emailNotificacao": "admin@lab.com"
  }
}
```

## 🐛 Troubleshooting

### Erro 404 - Integração não encontrada

- Verifique se o ID está correto
- Liste todas: `GET /atendimento/integracoes`

### Erro 409 - Integração já existe

- Código de identificação deve ser único
- Use `PATCH` para atualizar ao invés de criar nova

### Erro 401 - Não autorizado

- Token expirado, faça login novamente
- Verifique header `Authorization: Bearer TOKEN`

### Falha no teste de conexão

- Verifique credenciais (usuário/senha)
- Confirme URL do webservice
- Teste conectividade de rede
- Verifique timeout (padrão 30s)

## ✅ Checklist de Integração

- [ ] Token de autenticação obtido
- [ ] Integração criada com sucesso
- [ ] Teste de conexão executado
- [ ] Credenciais validadas
- [ ] Status atualizado para "ativa"
- [ ] Logs habilitados
- [ ] Email de notificação configurado
- [ ] Documentação revisada
