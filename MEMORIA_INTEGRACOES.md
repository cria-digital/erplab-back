# Memória de Implementação - Sistema de Integrações

**Data**: 11 de Dezembro de 2025
**Versão**: 2.0
**Fonte**: PDF APIS.pdf do cliente + código existente

---

## Visão Geral

Este documento cataloga **todas as integrações** necessárias para o sistema ERP Lab, conforme especificado pelo cliente, e documenta o status de implementação de cada uma.

### Resumo de Status

| Status       | Quantidade | Descrição                             |
| ------------ | ---------- | ------------------------------------- |
| Implementado | 4          | Código funcional, pronto para teste   |
| Parcial      | 0          | Estrutura criada, falta implementação |
| Planejado    | 15         | Documentado, aguardando implementação |

---

## Arquitetura Técnica

### Sistema Schema-Driven

O sistema de integrações foi refatorado de **hardcoded** para **schema-driven**:

```
SCHEMA (código TypeScript)
└─> Define CAMPOS disponíveis para configuração
    └─> Ex: usuario, senha, ambiente, url_wsdl

INTEGRAÇÃO (registro no banco - tabela `integracoes`)
└─> INSTÂNCIA configurada de um schema
    └─> Ex: "Hermes Pardini - Unidade Centro"

CONFIGURAÇÕES (tabela `integracoes_configuracoes`)
└─> VALORES específicos (chave-valor)
    └─> { chave: 'usuario', valor: 'hp_user' }
```

### Estrutura de Arquivos

```
src/modules/
├── atendimento/integracoes/           # Sistema genérico de integrações
│   ├── schemas/
│   │   ├── types.ts                   # Interfaces e enums
│   │   ├── hermes-pardini.schema.ts   # Schema Hermes Pardini
│   │   └── index.ts                   # Registro de schemas
│   ├── entities/
│   │   ├── integracao.entity.ts       # Entidade principal
│   │   └── integracao-configuracao.entity.ts
│   ├── dto/
│   │   ├── create-integracao.dto.ts
│   │   ├── update-integracao.dto.ts
│   │   └── hermes-pardini.dto.ts
│   ├── integracoes.service.ts
│   ├── integracoes.controller.ts
│   └── integracoes.module.ts
│
└── integracoes/                        # Implementações específicas
    ├── soap/
    │   ├── soap-client.service.ts      # Cliente SOAP genérico
    │   ├── soap.module.ts
    │   └── interfaces/
    ├── tiss/
    │   ├── tiss.module.ts
    │   └── orizon/                     # Orizon TISS (IMPLEMENTADO!)
    │       ├── orizon-tiss.service.ts
    │       ├── orizon-tiss.controller.ts
    │       ├── orizon-tiss.module.ts
    │       ├── interfaces/
    │       └── dto/
    └── laboratorios/
        ├── laboratorios.module.ts
        └── hermes-pardini/             # Hermes Pardini (IMPLEMENTADO!)
            ├── hermes-pardini.module.ts
            ├── hermes-pardini.service.ts
            ├── hermes-pardini.controller.ts
            ├── interfaces/
            │   └── hermes-pardini.interface.ts
            └── dto/
                └── hermes-pardini.dto.ts
```

---

## Inventário Completo de Integrações

### 1. Laboratórios de Apoio

#### 1.1 DB Diagnósticos – Webservice v2

| Campo          | Valor              |
| -------------- | ------------------ |
| **Status**     | IMPLEMENTADO       |
| **Protocolo**  | SOAP (DBSync v2.0) |
| **Prioridade** | Alta               |

**Credenciais de Homologação:**

```
CodigoApoiado: 12588
CodigoSenhaIntegracao: malore62
WSDL: https://wsmb.diagnosticosdobrasil.com.br/dbsync/wsrvProtocoloDBSync.dbsync.svc?wsdl
```

**Variáveis de Ambiente (.env):**

```env
DB_DIAGNOSTICOS_CODIGO_APOIADO=12588
DB_DIAGNOSTICOS_SENHA=malore62
DB_DIAGNOSTICOS_WSDL_URL=https://wsmb.diagnosticosdobrasil.com.br/dbsync/wsrvProtocoloDBSync.dbsync.svc?wsdl
DB_DIAGNOSTICOS_TIMEOUT=60000
```

**Métodos SOAP Implementados:**

| Método                                | Descrição                         | Status       |
| ------------------------------------- | --------------------------------- | ------------ |
| `RecebeAtendimento`                   | Enviar pedidos e gerar etiquetas  | Implementado |
| `EnviaLaudoAtendimento`               | Consultar resultado por pedido    | Implementado |
| `EnviaLaudoAtendimentoLista`          | Consultar resultados em lote      | Implementado |
| `EnviaLaudoAtendimentoPorPeriodo`     | Consultar resultados por período  | Implementado |
| `ConsultaStatusAtendimento`           | Consultar status do pedido        | Implementado |
| `EnviaAmostras`                       | Reimprimir etiquetas              | Implementado |
| `ListaProcedimentosPendentes`         | Listar procedimentos pendentes    | Implementado |
| `EnviaAmostrasProcedimentosPendentes` | Gerar etiquetas para recoletas    | Implementado |
| `EnviaLoteResultados`                 | Consultar lote de resultados      | Implementado |
| `EnviaResultadoBase64`                | Consultar laudo PDF               | Implementado |
| `RelatorioRequisicoesEnviadas`        | Relatório de requisições enviadas | Implementado |

**Sistema de Cancelamento:**

- **CTP (Cancelamento Temporário)**: Exame pode ser reativado
- **CDP (Cancelamento Definitivo)**: Exame não pode ser reativado
- Usa o campo `CodigoMPP` no procedimento para cancelar

**Código Implementado:**

```
src/modules/integracoes/laboratorios/db-diagnosticos/
├── db-diagnosticos.module.ts
├── db-diagnosticos.service.ts       # Service com 11 métodos SOAP
├── db-diagnosticos.controller.ts    # Controller REST
├── dto/
│   └── db-diagnosticos.dto.ts       # DTOs validados
└── interfaces/
    └── db-diagnosticos.interface.ts # Interfaces TypeScript
```

**Endpoints REST:**

| Endpoint                                                    | Método | Descrição                        |
| ----------------------------------------------------------- | ------ | -------------------------------- |
| `/api/v1/integracoes/db-diagnosticos/pedido`                | POST   | Enviar pedido e gerar etiquetas  |
| `/api/v1/integracoes/db-diagnosticos/status`                | POST   | Consultar status do pedido       |
| `/api/v1/integracoes/db-diagnosticos/laudo`                 | POST   | Consultar resultado por pedido   |
| `/api/v1/integracoes/db-diagnosticos/laudo/lista`           | POST   | Consultar resultados em lote     |
| `/api/v1/integracoes/db-diagnosticos/laudo/periodo`         | POST   | Consultar resultados por período |
| `/api/v1/integracoes/db-diagnosticos/laudo/pdf`             | POST   | Consultar laudo PDF              |
| `/api/v1/integracoes/db-diagnosticos/etiquetas/reimprimir`  | POST   | Reimprimir etiquetas             |
| `/api/v1/integracoes/db-diagnosticos/pendencias`            | POST   | Consultar pendências técnicas    |
| `/api/v1/integracoes/db-diagnosticos/recoleta/etiqueta`     | POST   | Gerar etiqueta para recoleta     |
| `/api/v1/integracoes/db-diagnosticos/lote/resultados`       | POST   | Consultar lote de resultados     |
| `/api/v1/integracoes/db-diagnosticos/relatorio/requisicoes` | POST   | Relatório de requisições         |
| `/api/v1/integracoes/db-diagnosticos/cancelar-exame`        | POST   | Cancelar exame (CTP/CDP)         |
| `/api/v1/integracoes/db-diagnosticos/health`                | GET    | Verificar saúde da integração    |

**HTTP Test Files:**

```
http-requests/integracoes/db-diagnosticos/
├── pedidos.http        # Testes de envio de pedidos
├── consultas.http      # Testes de consultas
├── etiquetas.http      # Testes de etiquetas e recoletas
└── cancelamentos.http  # Testes de cancelamentos
```

**Formato de Etiquetas:**

- Retorna etiquetas em formato **EPL** (Eltron Programming Language)
- Pronto para impressão em impressoras térmicas

---

#### 1.2 Hermes Pardini – Lab-to-Lab

| Campo                   | Valor        |
| ----------------------- | ------------ |
| **Status**              | IMPLEMENTADO |
| **Protocolo**           | SOAP         |
| **Prioridade**          | Alta         |
| **LC (Código Cliente)** | 4895         |

**Credenciais:**

| Ambiente        | Login | Senha | URL Webservice                                                  |
| --------------- | ----- | ----- | --------------------------------------------------------------- |
| **Produção**    | 15665 | 5431  | https://www.hermespardini.com.br/b2b/HPWS.XMLServer.cls         |
| **Homologação** | 12000 | 5990  | https://www.hermespardini.com.br/b2bhomologa/HPWS.XMLServer.cls |

**Variáveis de Ambiente (.env):**

```env
HERMES_PARDINI_LOGIN=15665
HERMES_PARDINI_SENHA=5431
HERMES_PARDINI_AMBIENTE=producao
HERMES_PARDINI_VALOR_REFERENCIA=0
HERMES_PARDINI_PAPEL_TIMBRADO=0
HERMES_PARDINI_VERSAO_RESULTADO=1
HERMES_PARDINI_TIMEOUT=30000
HERMES_PARDINI_CODIGO_CLIENTE=4895
```

**URLs de Referência:**

- Documentação: http://www.hermespardini.com.br/cal/hpws_1/documentacao.html
- Tabela de Exames: http://www.hermespardini.com.br/cal/tabexalhpV2.xml
- Modelos de Retorno: https://www.hermespardini.com.br/cal/exames/modelos.xml

**Métodos SOAP Implementados:**

| Método                     | Descrição                            | Status       |
| -------------------------- | ------------------------------------ | ------------ |
| `incluirPedido`            | Envia novo pedido de exames          | Implementado |
| `getResultadoPedido`       | Consulta resultados/laudos           | Implementado |
| `cancelaAmostra`           | Cancela amostra por código de barras | Implementado |
| `cancelaExame`             | Cancela exame específico             | Implementado |
| `consultaPendenciaTecnica` | Lista pendências técnicas            | Implementado |
| `consultaRastreabilidade`  | Rastreia pedido/amostra              | Implementado |
| `consultaStatusPedido`     | Status do pedido                     | Implementado |
| `getGrupoFracionamento`    | Grupos de fracionamento              | Implementado |

**Configurações de Retorno:**

| Parâmetro         | Valores | Descrição                                       |
| ----------------- | ------- | ----------------------------------------------- |
| `valorReferencia` | 0, 1, 2 | 0=Estruturado, 1=Bloco texto, 2=Individualizado |
| `papelTimbrado`   | 0, 1    | 0=Laudo simples, 1=Laudo personalizado          |
| `versaoResultado` | 1-10    | Versão do resultado (default: 1)                |

**Código Implementado:**

```
src/modules/integracoes/laboratorios/hermes-pardini/
├── hermes-pardini.module.ts
├── hermes-pardini.service.ts      # Service com 8 métodos SOAP
├── hermes-pardini.controller.ts   # Controller REST
├── dto/
│   └── hermes-pardini.dto.ts      # DTOs validados
└── interfaces/
    └── hermes-pardini.interface.ts # Interfaces TypeScript
```

**Endpoints REST:**

| Endpoint                                              | Método | Descrição                      |
| ----------------------------------------------------- | ------ | ------------------------------ |
| `/api/v1/integracoes/hermes-pardini/config`           | GET    | Configuração atual (sem senha) |
| `/api/v1/integracoes/hermes-pardini/config`           | POST   | Atualizar configuração         |
| `/api/v1/integracoes/hermes-pardini/pedido`           | POST   | Enviar novo pedido             |
| `/api/v1/integracoes/hermes-pardini/resultado`        | POST   | Consultar resultado            |
| `/api/v1/integracoes/hermes-pardini/resultado-lab`    | POST   | Consultar por código do lab    |
| `/api/v1/integracoes/hermes-pardini/cancelar-amostra` | POST   | Cancelar amostra               |
| `/api/v1/integracoes/hermes-pardini/cancelar-exame`   | POST   | Cancelar exame                 |
| `/api/v1/integracoes/hermes-pardini/pendencias`       | POST   | Consultar pendências           |
| `/api/v1/integracoes/hermes-pardini/rastreabilidade`  | POST   | Rastrear pedido                |
| `/api/v1/integracoes/hermes-pardini/status`           | POST   | Status do pedido               |
| `/api/v1/integracoes/hermes-pardini/fracionamento`    | GET    | Grupos de fracionamento        |

**Schema Existente:** `src/modules/atendimento/integracoes/schemas/hermes-pardini.schema.ts`

---

### 2. Telemedicina

#### 2.1 RWE Clínica

| Campo          | Valor                          |
| -------------- | ------------------------------ |
| **Status**     | Planejado                      |
| **Protocolo**  | REST API                       |
| **URL API**    | https://telemed.rwedev.com/api |
| **Prioridade** | Média                          |

**Funcionalidades:**

- Envio de exames PDF
- Recebimento de laudos PDF
- Atualização de status

---

### 3. API OCR

| Campo          | Valor     |
| -------------- | --------- |
| **Status**     | Planejado |
| **Protocolo**  | REST API  |
| **Prioridade** | Média     |

**Documentos suportados:**

- Boletos
- Notas Fiscais (NFs)
- Pedidos médicos
- Documentos diversos

---

### 4. PACs (Picture Archiving and Communication System)

| Campo          | Valor     |
| -------------- | --------- |
| **Status**     | Planejado |
| **Protocolo**  | DICOM     |
| **Prioridade** | Média     |

**Funcionalidades:**

- Armazenamento DICOM
- Visualização web
- Recebimento de exames
- Envio para análise

---

### 5. WhatsApp – Comunicação

#### 5.1 WhatsApp Cloud API (Meta Oficial)

| Campo          | Valor     |
| -------------- | --------- |
| **Status**     | Planejado |
| **Protocolo**  | REST API  |
| **Prioridade** | Alta      |

**Funcionalidades:**

- Enviar mensagens
- Templates aprovados
- Arquivos PDF
- Fila de atendimento
- Chatbot com IA
- Webhooks (respostas do cliente)

---

### 6. Adquirentes de Cartão

#### 6.1 Safrapay API

| Campo          | Valor     |
| -------------- | --------- |
| **Status**     | Planejado |
| **Protocolo**  | REST API  |
| **Prioridade** | Média     |

**Funcionalidades:**

- Transações diárias
- Datas de repasse
- Taxas aplicadas
- Conciliação com extrato

#### 6.2 Cielo API (Planejada)

| Campo      | Valor              |
| ---------- | ------------------ |
| **Status** | Planejado (futuro) |

#### 6.3 Rede API (Planejada)

| Campo      | Valor              |
| ---------- | ------------------ |
| **Status** | Planejado (futuro) |

---

### 7. Bancos (Financeiro / Conciliação / Pagamentos)

#### 7.1 Bradesco API

| Campo          | Valor     |
| -------------- | --------- |
| **Status**     | Planejado |
| **Protocolo**  | REST API  |
| **Prioridade** | Alta      |

**Funcionalidades:**

- Boletos (gerar, registrar, consultar)
- Pix (criar e consultar)
- Pagamentos (boletos, tributos, TED)
- Extrato (Open Finance)

#### 7.2 Santander API

| Campo          | Valor     |
| -------------- | --------- |
| **Status**     | Planejado |
| **Protocolo**  | REST API  |
| **Prioridade** | Alta      |

**Funcionalidades:**

- Boletos
- Pagamentos
- Conciliação
- Pix

#### 7.3 Safra API

| Campo          | Valor     |
| -------------- | --------- |
| **Status**     | Planejado |
| **Protocolo**  | REST API  |
| **Prioridade** | Alta      |

**Funcionalidades:**

- Boletos
- Pix
- Pagamentos de contas
- Conciliação bancária

#### 7.4 ASAAS API

| Campo          | Valor     |
| -------------- | --------- |
| **Status**     | Planejado |
| **Protocolo**  | REST API  |
| **Prioridade** | Alta      |

**Funcionalidades:**

- Boletos
- Pix
- Carnês
- Notificações de pagamento

#### 7.5 Open Finance (todos os bancos)

| Campo          | Valor     |
| -------------- | --------- |
| **Status**     | Planejado |
| **Protocolo**  | REST API  |
| **Prioridade** | Média     |

**Funcionalidades:**

- Extrato bancário
- Saldos
- Movimentações

---

### 8. Prefeituras – NFS-e

#### 8.1 Nuvem Fiscal

| Campo          | Valor                           |
| -------------- | ------------------------------- |
| **Status**     | Planejado                       |
| **Protocolo**  | REST API / SOAP                 |
| **URL**        | https://www.nuvemfiscal.com.br/ |
| **Prioridade** | Alta                            |

**Municípios utilizados:**

- São Roque
- Ibiúna
- Araçariguama
- Cotia
- Vargem Grande Paulista
- Itapecerica da Serra

**Protocolos suportados:**

- ABRASF 2.02
- GINFES
- GCASPP
- Síncrono

**Funcionalidades:**

- Geração de NFS-e
- Cancelamento
- Consulta de nota
- Download do XML
- Verificação de RPS

---

### 9. APIs de Convênios e TISS

#### 9.1 Orizon TISS

| Campo          | Valor           |
| -------------- | --------------- |
| **Status**     | IMPLEMENTADO    |
| **Protocolo**  | SOAP (TISS 4.0) |
| **Prioridade** | Crítica         |

**Credenciais de Homologação:**

```
Login: Lucasws25
Chave de transmissão: EC1yz4ia5is2Hn9Sm/BoSKW4wRJxlGS
NOTA: A chave precisa ser convertida para HASHMD5 para comunicação.
```

**Variáveis de Ambiente (.env):**

```env
ORIZON_AMBIENTE=HOMOLOGACAO
ORIZON_USUARIO=Lucasws25
ORIZON_SENHA=<hash_md5_da_chave>
ORIZON_CODIGO_PRESTADOR=<codigo_do_prestador>
ORIZON_TIMEOUT=30000
```

**Endpoints de Homologação (já configurados no código):**

| Serviço               | URL WSDL                                                                                        |
| --------------------- | ----------------------------------------------------------------------------------------------- |
| Cobrança (Lote Guias) | https://wsp.hom.orizonbrasil.com.br:6281/fature/tiss/v40100/tissLoteGuias?wsdl                  |
| Status Protocolo      | https://wsp.hom.orizonbrasil.com.br:6281/fature/tiss/v40100/tissSolicitacaoStatusProtocolo?wsdl |
| Cancela Guia/Lote     | https://wsp.hom.orizonbrasil.com.br:6281/tiss/v40100/tissCancelaGuia?wsdl                       |
| Comprovantes PDF      | https://wsp.hom.orizonbrasil.com.br:6290/gerapdf/wsGerarProtocolo?wsdl                          |
| Demonstrativos        | https://wsp.hom.orizonbrasil.com.br:6281/fature/tiss/v40100/tissSolicitaDemonstrativo?wsdl      |
| Envia Recurso Glosa   | https://wsp.hom.orizonbrasil.com.br:6281/tiss/v40100/tissEnviaRecursoGlosa?wsdl                 |
| Status Recurso        | https://wsp.hom.orizonbrasil.com.br:6281/tiss/v40100/tissSolicitaStatusRecurso?wsdl             |
| Envio Documentos      | https://tiss-hml-documentos.orizon.com.br/Service.asmx?wsdl                                     |

**Código Implementado:**

```
src/modules/integracoes/tiss/orizon/
├── orizon-tiss.service.ts       # 535 linhas - 8 métodos SOAP
├── orizon-tiss.controller.ts    # Controller REST
├── orizon-tiss.module.ts
├── interfaces/
│   └── orizon-endpoints.interface.ts  # URLs dos webservices
└── dto/
    ├── lote-guias.dto.ts
    ├── protocolo.dto.ts
    ├── cancelamento.dto.ts
    ├── demonstrativo.dto.ts
    ├── recurso-glosa.dto.ts
    └── documentos.dto.ts
```

**Métodos Implementados no Service:**

| Método                       | Descrição                    | Status       |
| ---------------------------- | ---------------------------- | ------------ |
| `enviarLoteGuias()`          | Envia lote de guias TISS     | Implementado |
| `consultarStatusProtocolo()` | Consulta status de protocolo | Implementado |
| `gerarProtocoloPdf()`        | Gera comprovante PDF         | Implementado |
| `cancelarGuia()`             | Cancela guia/lote            | Implementado |
| `solicitarDemonstrativo()`   | Solicita demonstrativo       | Implementado |
| `enviarRecursoGlosa()`       | Envia recurso de glosa       | Implementado |
| `consultarStatusRecurso()`   | Consulta status de recurso   | Implementado |
| `enviarDocumentos()`         | Envia documentos anexos      | Implementado |

---

#### 9.2 SAVI

| Campo          | Valor           |
| -------------- | --------------- |
| **Status**     | Planejado       |
| **Protocolo**  | SOAP (TISS 4.0) |
| **Prioridade** | Alta            |

**Padrões:**

- TISS 4.0 (XML)
- Envio de guias
- Consulta de status
- Envio de XML + PDF para plataformas

---

### 10. Governo / Documentos

#### 10.1 Receita Federal

| Campo          | Valor     |
| -------------- | --------- |
| **Status**     | Planejado |
| **Protocolo**  | REST API  |
| **Prioridade** | Média     |

**Funcionalidades:**

- Consulta CNPJ (oficial)
- Consulta CPF (quando disponível via parceiros)

#### 10.2 SEFAZ

| Campo          | Valor     |
| -------------- | --------- |
| **Status**     | Planejado |
| **Protocolo**  | REST/SOAP |
| **Prioridade** | Média     |

**Funcionalidades:**

- Download e leitura de XML de NF-e
- Manifestação do destinatário (opcional)

---

### 11. APIs de Cadastro / Utilidades

#### 11.1 ViaCEP

| Campo         | Valor                                |
| ------------- | ------------------------------------ |
| **Status**    | IMPLEMENTADO                         |
| **Protocolo** | REST API                             |
| **URL**       | https://viacep.com.br/ws/{cep}/json/ |

**Endpoint no sistema:** `GET /api/v1/cep/{cep}`

#### 11.2 Consulta CNPJ

| Campo      | Valor     |
| ---------- | --------- |
| **Status** | Planejado |

#### 11.3 Consulta CPF

| Campo      | Valor     |
| ---------- | --------- |
| **Status** | Planejado |

---

### 12. APIs para Integrações Futuras

| Integração                   | Status    | Descrição                    |
| ---------------------------- | --------- | ---------------------------- |
| Multiempresas/Multiunidades  | Planejado | Suporte multi-tenant         |
| OpenAI / LLM interno         | Planejado | IA para chatbot e análises   |
| Conexões HL7                 | Planejado | Integração hospitalar        |
| Interfaceamento equipamentos | Planejado | Conexão com equipamentos lab |
| Portal médico                | Planejado | Acesso para médicos          |
| Portal do paciente           | Planejado | Acesso para pacientes        |

---

## Tipos de Integração (Enum)

```typescript
export enum TipoIntegracao {
  LABORATORIO_APOIO = 'laboratorio_apoio',
  CONVENIOS = 'convenios',
  TELEMEDICINA = 'telemedicina',
  BANCO = 'banco',
  GATEWAY_PAGAMENTO = 'gateway_pagamento',
  NFSE = 'nfse',
  SEFAZ = 'sefaz',
  RECEITA_FEDERAL = 'receita_federal',
  POWER_BI = 'power_bi',
  PABX = 'pabx',
  CORREIOS = 'correios',
  OCR = 'ocr',
  ADQUIRENTES = 'adquirentes',
  PACS = 'pacs',
  EMAIL = 'email',
  WHATSAPP = 'whatsapp',
  CONCESSIONARIAS = 'concessionarias',
  OUTROS = 'outros',
}
```

---

## Tipos de Campo para Schemas

```typescript
export enum TipoCampo {
  STRING = 'string',
  NUMBER = 'number',
  PASSWORD = 'password',
  EMAIL = 'email',
  URL = 'url',
  SELECT = 'select',
  CHECKBOX = 'checkbox',
  TEXTAREA = 'textarea',
  JSON = 'json',
}

export enum ProtocoloIntegracao {
  REST = 'REST',
  SOAP = 'SOAP',
  GRAPHQL = 'GRAPHQL',
  FTP = 'FTP',
  SFTP = 'SFTP',
  EMAIL = 'EMAIL',
  WEBHOOK = 'WEBHOOK',
}
```

---

## Matriz de Prioridades

### Prioridade Crítica

1. Orizon TISS (implementado)
2. SAVI TISS

### Prioridade Alta

1. Hermes Pardini
2. DB Diagnósticos
3. WhatsApp Cloud API
4. Bradesco API
5. Santander API
6. Safra API
7. ASAAS API
8. Nuvem Fiscal (NFS-e)

### Prioridade Média

1. RWE Telemedicina
2. Safrapay API
3. API OCR
4. PACS/DICOM
5. Open Finance
6. Receita Federal
7. SEFAZ

### Prioridade Baixa (Futuro)

1. Cielo API
2. Rede API
3. HL7
4. Interfaceamento
5. Portais (médico/paciente)

---

## Próximos Passos

### Imediato (Semana 1-2)

- [ ] Configurar variáveis de ambiente Orizon
- [ ] Testar integração Orizon em homologação
- [ ] Criar schema para SAVI TISS
- [ ] Implementar service SAVI TISS
- [x] **Hermes Pardini - IMPLEMENTADO (11/12/2025)**

### Curto Prazo (Semana 3-4)

- [x] ~~Refatorar Hermes Pardini service~~ (CONCLUÍDO)
- [x] **DB Diagnósticos - IMPLEMENTADO (11/12/2025)**
- [ ] Implementar WhatsApp Cloud API

### Médio Prazo (Mês 2)

- [ ] Implementar APIs bancárias (Bradesco, Santander, Safra, ASAAS)
- [ ] Implementar Nuvem Fiscal para NFS-e
- [ ] Implementar RWE Telemedicina

### Longo Prazo (Mês 3+)

- [ ] API OCR
- [ ] PACS/DICOM
- [ ] Adquirentes de cartão
- [ ] Open Finance
- [ ] Integrações futuras (HL7, portais, etc.)

---

## Como Criar uma Nova Integração

### 1. Criar o Schema

```typescript
// src/modules/atendimento/integracoes/schemas/nova-integracao.schema.ts
import { IntegracaoSchema, TipoCampo, ProtocoloIntegracao } from './types';
import { TipoIntegracao } from '../entities/integracao.entity';

export const NOVA_INTEGRACAO_SCHEMA: IntegracaoSchema = {
  slug: 'nova-integracao',
  nome: 'Nova Integração',
  descricao: 'Descrição da integração',
  versao: '1.0.0',
  tipos_contexto: [TipoIntegracao.TIPO_ADEQUADO],
  protocolo: ProtocoloIntegracao.REST, // ou SOAP
  campos: [
    {
      chave: 'api_key',
      label: 'API Key',
      tipo: TipoCampo.PASSWORD,
      obrigatorio: true,
      criptografar: true,
    },
    // ... mais campos
  ],
  ativo: true,
};
```

### 2. Registrar no Index

```typescript
// src/modules/atendimento/integracoes/schemas/index.ts
import { NOVA_INTEGRACAO_SCHEMA } from './nova-integracao.schema';

export const INTEGRACOES_SCHEMAS: Record<string, IntegracaoSchema> = {
  'hermes-pardini': HERMES_PARDINI_SCHEMA,
  'nova-integracao': NOVA_INTEGRACAO_SCHEMA, // ← adicionar
};
```

### 3. Criar Service Específico (se necessário)

Para integrações SOAP complexas como Orizon, criar módulo dedicado em:

```
src/modules/integracoes/{tipo}/{nome}/
```

---

## Referências

- **PDF do Cliente**: `/home/diego/Downloads/APIS.pdf`
- **Email Hermes Pardini**: `/home/diego/Downloads/Gmail - Fwd_ Documentação Interface Apoio Pardini LC 4895 - INSTITUTO SAO LUCAS SR LTDA EPP.pdf`
- **Código Orizon TISS**: `src/modules/integracoes/tiss/orizon/`
- **Código Hermes Pardini**: `src/modules/integracoes/laboratorios/hermes-pardini/`
- **Código Schemas**: `src/modules/atendimento/integracoes/schemas/`
- **Service SOAP Genérico**: `src/modules/integracoes/soap/`

---

**Última atualização**: 11/12/2025
**Autor**: Claude Code
**Versão do documento**: 2.2
