# Módulo de Integrações - ERPLab

Módulo completo para integração com webservices externos, com foco em integrações SOAP para o padrão TISS.

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Arquitetura](#arquitetura)
- [Cliente SOAP Genérico](#cliente-soap-genérico)
- [Integração Orizon TISS](#integração-orizon-tiss)
- [Configuração](#configuração)
- [Uso](#uso)
- [Endpoints Disponíveis](#endpoints-disponíveis)
- [Futuras Integrações](#futuras-integrações)

## 🎯 Visão Geral

Este módulo fornece uma estrutura robusta e reutilizável para consumir webservices SOAP, com implementação completa para a integração TISS com a Orizon.

### Funcionalidades Principais

✅ **Cliente SOAP Genérico** - Reutilizável para qualquer webservice SOAP
✅ **Integração Orizon TISS** - 8 webservices implementados
✅ **Tipagem TypeScript** - DTOs e interfaces completas
✅ **Tratamento de Erros** - Logs e respostas padronizadas
✅ **Documentação Swagger** - API totalmente documentada
✅ **Configuração Flexível** - Suporte a múltiplos ambientes

## 🏗️ Arquitetura

```
src/modules/integracoes/
├── soap/                          # Cliente SOAP genérico
│   ├── soap-client.service.ts    # Serviço base reutilizável
│   ├── soap.module.ts
│   └── interfaces/
│       └── soap-config.interface.ts
│
├── tiss/                          # Integrações TISS
│   ├── orizon/                   # Orizon específico
│   │   ├── orizon-tiss.service.ts
│   │   ├── orizon-tiss.controller.ts
│   │   ├── orizon-tiss.module.ts
│   │   ├── dto/                  # 6 DTOs (lote, protocolo, etc)
│   │   └── interfaces/           # Endpoints e configs
│   └── tiss.module.ts
│
├── integracoes.module.ts         # Módulo principal
└── README.md                     # Esta documentação
```

### Princípios de Design

- **Separation of Concerns**: Cliente genérico separado de implementações específicas
- **Reusabilidade**: Cliente SOAP pode ser usado para qualquer webservice
- **Escalabilidade**: Fácil adicionar novas integrações (Unimed, Bradesco Saúde, etc)
- **Type Safety**: TypeScript com tipagem rigorosa
- **Observabilidade**: Logs detalhados em cada operação

## 🔌 Cliente SOAP Genérico

### SoapClientService

Serviço base para consumir qualquer webservice SOAP.

#### Funcionalidades

- ✅ Criar clientes SOAP a partir de WSDL
- ✅ Chamar métodos com parâmetros tipados
- ✅ Converter XML ↔ JavaScript Object
- ✅ Configurar autenticação (Basic Auth, Token, Certificado)
- ✅ Headers customizados
- ✅ Timeout configurável
- ✅ Logs detalhados
- ✅ Captura de request/response XML (para debug)

#### Métodos Disponíveis

```typescript
// Criar cliente SOAP
async criarCliente(config: SoapConfig): Promise<Client>

// Chamar método SOAP
async chamarMetodo<T>(
  client: Client,
  metodo: string,
  parametros: any,
  salvarXml?: boolean
): Promise<SoapResponse<T>>

// Converter XML para objeto
async xmlParaObjeto(xml: string): Promise<any>

// Converter objeto para XML
objetoParaXml(objeto: any): string

// Descrever serviços do WSDL
async descreverServicos(config: SoapConfig): Promise<string>

// Listar métodos disponíveis
async listarMetodos(config: SoapConfig): Promise<string[]>
```

#### Exemplo de Uso Direto

```typescript
import { SoapClientService } from '@/modules/integracoes/soap/soap-client.service';

// Injetar o serviço
constructor(private readonly soapClient: SoapClientService) {}

// Usar
async exemplo() {
  // 1. Configurar
  const config: SoapConfig = {
    wsdl: 'https://exemplo.com/service?wsdl',
    auth: {
      usuario: 'user',
      senha: 'pass'
    },
    timeout: 30000
  };

  // 2. Criar cliente
  const client = await this.soapClient.criarCliente(config);

  // 3. Chamar método
  const resposta = await this.soapClient.chamarMetodo(
    client,
    'meuMetodo',
    { param1: 'valor' }
  );

  // 4. Processar resposta
  if (resposta.sucesso) {
    console.log(resposta.dados);
  } else {
    console.error(resposta.erro);
  }
}
```

## 🏥 Integração Orizon TISS

Implementação completa dos webservices TISS da Orizon.

### Webservices Implementados

| #   | Webservice        | Método Service               | Endpoint API                                            |
| --- | ----------------- | ---------------------------- | ------------------------------------------------------- |
| 1   | Lote de Guias     | `enviarLoteGuias()`          | `POST /api/v1/integracoes/tiss/orizon/lote-guias`       |
| 2   | Status Protocolo  | `consultarStatusProtocolo()` | `POST /api/v1/integracoes/tiss/orizon/status-protocolo` |
| 3   | Gerar PDF         | `gerarProtocoloPdf()`        | `POST /api/v1/integracoes/tiss/orizon/gerar-pdf`        |
| 4   | Cancelar Guia     | `cancelarGuia()`             | `POST /api/v1/integracoes/tiss/orizon/cancelar-guia`    |
| 5   | Demonstrativo     | `solicitarDemonstrativo()`   | `POST /api/v1/integracoes/tiss/orizon/demonstrativo`    |
| 6   | Recurso Glosa     | `enviarRecursoGlosa()`       | `POST /api/v1/integracoes/tiss/orizon/recurso-glosa`    |
| 7   | Status Recurso    | `consultarStatusRecurso()`   | `POST /api/v1/integracoes/tiss/orizon/status-recurso`   |
| 8   | Enviar Documentos | `enviarDocumentos()`         | `POST /api/v1/integracoes/tiss/orizon/documentos`       |

### DTOs Criados

- ✅ `EnviarLoteGuiasDto` + `LoteGuiasResponseDto`
- ✅ `ConsultarStatusProtocoloDto` + `StatusProtocoloResponseDto`
- ✅ `GerarProtocoloPdfDto` + `ProtocoloPdfResponseDto`
- ✅ `CancelarGuiaDto` + `CancelamentoGuiaResponseDto`
- ✅ `SolicitarDemonstrativoDto` + `DemonstrativoResponseDto`
- ✅ `EnviarRecursoGlosaDto` + `RecursoGlosaResponseDto`
- ✅ `ConsultarStatusRecursoDto` + `StatusRecursoResponseDto`
- ✅ `EnviarDocumentosDto` + `DocumentosResponseDto`

### Interfaces

- ✅ `ORIZON_ENDPOINTS` - Mapeamento de todos os endpoints (Homologação + Produção)
- ✅ `TipoRelatorioOrizon` - Enum para tipos de relatório (Capa_Lote, Lista_Guias, Protocolo)
- ✅ `OrizonConfig` - Configuração do serviço

## ⚙️ Configuração

### 1. Variáveis de Ambiente

Adicione no `.env`:

```bash
# Integração TISS - Orizon
ORIZON_AMBIENTE=HOMOLOGACAO           # ou PRODUCAO
ORIZON_USUARIO=seu_usuario
ORIZON_SENHA=sua_senha
ORIZON_CODIGO_PRESTADOR=seu_codigo
ORIZON_TIMEOUT=30000                  # milissegundos
```

### 2. Registrar Módulo

O módulo já está registrado no `AppModule`:

```typescript
import { IntegracoesModule } from './modules/integracoes/integracoes.module';

@Module({
  imports: [
    // ... outros módulos
    IntegracoesModule,
  ],
})
export class AppModule {}
```

### 3. Instalar Dependências

```bash
npm install soap axios xml2js
npm install --save-dev @types/soap
```

## 📖 Uso

### Injetar Serviço Orizon

```typescript
import { OrizonTissService } from '@/modules/integracoes/tiss/orizon/orizon-tiss.service';

@Injectable()
export class MeuService {
  constructor(private readonly orizonService: OrizonTissService) {}

  async exemplo() {
    // Usar métodos
  }
}
```

### Exemplos de Uso

#### 1. Enviar Lote de Guias

```typescript
const dto: EnviarLoteGuiasDto = {
  xmlLote: '<loteGuiasWS>...</loteGuiasWS>',
  codigoPrestador: '12345',
  metadados: {
    descricao: 'Lote do dia 19/11/2025',
    totalGuias: 10,
  },
};

const resultado = await this.orizonService.enviarLoteGuias(dto);

if (resultado.sucesso) {
  console.log('Protocolo:', resultado.dados.numeroProtocolo);
} else {
  console.error('Erro:', resultado.erro);
}
```

#### 2. Consultar Status de Protocolo

```typescript
const dto: ConsultarStatusProtocoloDto = {
  numeroProtocolo: '202511190001',
};

const resultado = await this.orizonService.consultarStatusProtocolo(dto);

console.log('Status:', resultado.dados.status);
console.log('Detalhes:', resultado.dados.detalhes);
```

#### 3. Gerar PDF de Protocolo

```typescript
const dto: GerarProtocoloPdfDto = {
  tipoRelatorio: TipoRelatorioOrizon.PROTOCOLO,
  numeroProtocolo: '202511190001',
};

const resultado = await this.orizonService.gerarProtocoloPdf(dto);

if (resultado.sucesso) {
  const pdfBuffer = Buffer.from(resultado.dados.pdfBase64, 'base64');
  // Salvar ou retornar PDF
}
```

#### 4. Solicitar Demonstrativo

```typescript
const dto: SolicitarDemonstrativoDto = {
  dataInicio: '2025-01-01',
  dataFim: '2025-01-31',
};

const resultado = await this.orizonService.solicitarDemonstrativo(dto);

console.log('Total Apresentado:', resultado.dados.resumo.totalApresentado);
console.log('Total Glosas:', resultado.dados.resumo.totalGlosas);
console.log('Guias:', resultado.dados.guias);
```

## 🌐 Endpoints Disponíveis

Acesse via Swagger: `http://localhost:10016/api/docs`

**Base URL**: `/api/v1/integracoes/tiss/orizon`

### Endpoints POST

- `POST /lote-guias` - Enviar lote de guias
- `POST /status-protocolo` - Consultar status (via body)
- `POST /gerar-pdf` - Gerar protocolo em PDF
- `POST /cancelar-guia` - Cancelar guia
- `POST /demonstrativo` - Solicitar demonstrativo
- `POST /recurso-glosa` - Enviar recurso de glosa
- `POST /status-recurso` - Consultar status de recurso (via body)
- `POST /documentos` - Enviar documentos

### Endpoints GET

- `GET /status-protocolo/:numeroProtocolo` - Consultar status (via param)
- `GET /status-recurso/:numeroProtocolo` - Consultar status de recurso (via param)

### Autenticação

Todos os endpoints requerem autenticação JWT via header:

```
Authorization: Bearer {seu_token_jwt}
```

## 🔮 Futuras Integrações

A arquitetura foi projetada para facilitar a adição de novas integrações:

### Planejadas

- [ ] **Unimed** - Integração TISS
- [ ] **Bradesco Saúde** - Integração TISS
- [ ] **SulAmérica** - Integração TISS
- [ ] **Amil** - Integração TISS
- [ ] **APIs REST** - Cliente HTTP genérico
- [ ] **HL7/FHIR** - Integrações hospitalares
- [ ] **PACS/DICOM** - Imagens médicas

### Como Adicionar Nova Integração

1. Criar pasta em `tiss/[operadora]/`
2. Copiar estrutura de `tiss/orizon/`
3. Ajustar DTOs e interfaces
4. Implementar service
5. Criar controller
6. Registrar módulo
7. Adicionar variáveis de ambiente
8. Documentar

## 🧪 Testes

```bash
# Testes unitários
npm test

# Testes com cobertura
npm run test:cov

# Testar endpoints via Swagger
http://localhost:10016/api/docs
```

## 📊 Logs e Monitoramento

O serviço gera logs detalhados de todas as operações:

- ✅ Criação de clientes SOAP
- ✅ Chamadas de métodos
- ✅ Sucessos e erros
- ✅ Request/Response XML (quando habilitado)

Exemplo de log:

```
[OrizonTissService] Enviando lote de guias para Orizon...
[SoapClientService] Cliente SOAP criado: https://wsp.hom.orizonbrasil.com.br:6281/...
[SoapClientService] Chamando método SOAP: tissLoteGuias_Operation
[SoapClientService] Método tissLoteGuias_Operation executado com sucesso
[OrizonTissService] Lote enviado com sucesso. Protocolo: 202511190001
```

## 🤝 Contribuindo

Ao adicionar novas funcionalidades:

1. Seguir padrão de nomenclatura
2. Criar DTOs tipados
3. Documentar com @ApiProperty
4. Adicionar logs
5. Tratar erros adequadamente
6. Atualizar documentação

## 📞 Suporte

Para dúvidas ou problemas:

- Consulte a documentação do TISS ANS
- Revise logs do sistema
- Entre em contato com suporte técnico da operadora

## 📝 Licença

MIT License - ERPLab Backend
