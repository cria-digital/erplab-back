# 📋 HTTP Requests - ERP Laboratório

Esta pasta contém arquivos `.http` para testar todos os endpoints da API do sistema ERP Laboratório.

## 🛠️ Como Usar

### VS Code
1. Instale a extensão **REST Client** (humao.rest-client)
2. Abra qualquer arquivo `.http`
3. Clique em "Send Request" acima de cada requisição
4. O resultado aparecerá ao lado

### IntelliJ IDEA / WebStorm
1. Abra qualquer arquivo `.http`
2. Clique no ícone de play verde ao lado da requisição
3. O resultado aparecerá na aba de resposta

### JetBrains HTTP Client CLI
```bash
# Executar todas as requisições de um arquivo
http-client arquivo.http

# Executar requisição específica
http-client arquivo.http --name "Nome da Requisição"
```

## 📁 Estrutura

```
http-requests/
├── README.md                    # Este arquivo
├── pacientes/                   # Requisições do módulo Pacientes
│   └── *.http
└── unidade-saude/              # Requisições do módulo Unidades de Saúde
    ├── criar-unidade.http      # POST - Criar nova unidade
    ├── listar-unidades.http    # GET - Listar com filtros
    ├── buscar-unidade.http     # GET - Buscar por ID/CNPJ/Cidade
    ├── atualizar-unidade.http  # PATCH - Atualizar dados
    ├── gerenciar-status.http   # PATCH/DELETE - Ativar/Desativar/Remover
    └── exemplos-completos.http # Cenários completos de teste
```

## 🔑 Configuração de Variáveis de Ambiente

### Configuração Inicial (IMPORTANTE)

1. **Abra o VS Code na pasta raiz do projeto** (`/erplab`), não em subpastas
2. **Instale a extensão REST Client** (humao.rest-client) se ainda não tiver
3. **A configuração já está pronta** no arquivo `.vscode/settings.json` na raiz do projeto

### Como Usar

1. **Abra qualquer arquivo `.http`** em `erplab-back/http-requests/`
2. **Selecione o ambiente**:
   - Clique em "No Environment" ou "Environment" no **canto inferior direito** do VS Code
   - Ou use o atalho `Ctrl+Alt+E`
   - Ou `Ctrl+Shift+P` → "Rest Client: Switch Environment"
3. **Escolha entre**:
   - `dev`: Ambiente local (http://localhost:10016)
   - `homolog`: Ambiente de homologação (https://homolog.erplab.com.br)

### Variáveis Disponíveis

```http
{{baseUrl}}        # URL base da API (ex: http://localhost:10016/api/v1)
{{contentType}}    # Tipo de conteúdo (application/json)
{{token}}          # Token JWT para autenticação (quando implementado)
{{host}}           # Host do servidor
{{port}}           # Porta do servidor
{{protocol}}       # Protocolo (http ou https)
{{apiPath}}        # Caminho da API (/api/v1)
```

### Exemplo de Uso

```http
### Criar Unidade
POST {{baseUrl}}/unidades-saude
Content-Type: {{contentType}}
Authorization: Bearer {{token}}

{
  "nomeUnidade": "Laboratório Teste"
}
```

### Adicionar Token de Autenticação

Quando a autenticação for implementada, edite o arquivo `.vscode/settings.json` na raiz do projeto e adicione seu token:

```json
"dev": {
  "baseUrl": "http://localhost:10016/api/v1",
  "token": "seu-token-jwt-aqui"  // ← Adicione seu token aqui
}
```

### Estrutura Completa do settings.json

Exemplo completo do arquivo `.vscode/settings.json` na raiz do projeto:

```json
{
  "rest-client.environmentVariables": {
    "$shared": {
      "contentType": "application/json"
    },
    "dev": {
      "baseUrl": "http://localhost:10016/api/v1",
      "host": "localhost",
      "port": "10016",
      "protocol": "http",
      "apiPath": "/api/v1",
      "token": ""
    },
    "homolog": {
      "baseUrl": "https://homolog.erplab.com.br/api/v1",
      "host": "homolog.erplab.com.br",
      "port": "443",
      "protocol": "https",
      "apiPath": "/api/v1",
      "token": ""
    }
  }
}
```

## 🧪 Ordem de Teste Recomendada

### Módulo Unidades de Saúde
1. **criar-unidade.http** - Criar primeira unidade
2. **listar-unidades.http** - Verificar se foi criada
3. **buscar-unidade.http** - Buscar a unidade criada
4. **atualizar-unidade.http** - Fazer alterações
5. **gerenciar-status.http** - Testar ativação/desativação
6. **exemplos-completos.http** - Criar as 6 unidades do sistema

### Módulo Pacientes
1. Criar paciente
2. Listar pacientes
3. Buscar paciente específico
4. Atualizar dados
5. Remover paciente

## 💡 Dicas

### Copiar IDs
Após criar um recurso, copie o ID retornado para usar nas próximas requisições:
```http
# Resposta da criação
{
  "id": "123e4567-e89b-12d3-a456-426614174000",  # <-- Copie este ID
  ...
}

# Use nas próximas requisições
GET http://localhost:10016/api/v1/unidades-saude/123e4567-e89b-12d3-a456-426614174000
```

### Testar Erros
Sempre teste cenários de erro:
- CNPJ duplicado (409 Conflict)
- ID inexistente (404 Not Found)
- Dados inválidos (400 Bad Request)
- Sem autenticação (401 Unauthorized)

### Dados de Teste
Use os exemplos em `exemplos-completos.http` para popular o banco com dados realistas das 6 cidades.

## 🔗 Links Úteis

- **Swagger UI**: http://localhost:10016/api/docs
- **OpenAPI JSON**: http://localhost:10016/api/docs-json
- **Health Check**: http://localhost:10016/api/v1/health

## ⚠️ Observações

- Sempre inicie o servidor antes de testar: `npm run start:dev`
- O banco de dados deve estar rodando: `docker-compose up -d`
- Alguns endpoints exigirão autenticação (adicione o token JWT quando implementado)