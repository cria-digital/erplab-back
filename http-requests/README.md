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

A estrutura de arquivos `.http` está organizada hierarquicamente por áreas funcionais, seguindo a mesma organização dos módulos do backend:

```
http-requests/
├── README.md                           # Este arquivo
│
├── autenticacao/                       # Autenticação e Usuários
│   ├── auth/                          # Login, logout, refresh token
│   ├── usuarios/                      # CRUD de usuários
│   └── perfil/                        # Perfil do usuário logado
│
├── cadastros/                          # Cadastros Gerais
│   ├── pacientes/                     # Gestão de pacientes
│   ├── profissionais/                 # Gestão de profissionais de saúde
│   ├── empresas/                      # Gestão de empresas
│   └── unidade-saude/                # Gestão de unidades de saúde
│
├── exames/                             # Gestão de Exames
│   ├── exames/                        # Catálogo de exames
│   ├── formularios/                   # Formulários de exames
│   ├── kits/                          # Kits de exames (check-up, ocupacional)
│   ├── metodos/                       # Métodos de exames
│   ├── tipos-exame/                   # Tipos/categorias de exames
│   ├── matrizes/                      # Matrizes (templates) de exames
│   └── amostras/                      # Tipos de amostras biológicas
│
├── relacionamento/                     # Integrações e Relacionamentos
│   ├── convenios/                     # Convênios médicos e planos
│   ├── laboratorios/                  # Laboratórios parceiros
│   ├── fornecedores/                  # Fornecedores de insumos
│   ├── prestadores-servico/           # Prestadores de serviços
│   └── telemedicina/                  # Plataformas de telemedicina
│
├── atendimento/                        # Fluxo de Atendimento
│   ├── atendimento/                   # Gestão de atendimentos
│   ├── agendas/                       # Agendamento de exames
│   └── integracoes/                   # Integrações com sistemas externos
│
├── financeiro/                         # Gestão Financeira
│   └── core/                          # Módulos financeiros
│       ├── bancos/                    # Gestão de contas bancárias
│       ├── contas-pagar/              # Contas a pagar
│       ├── contas-receber/            # Contas a receber
│       └── formas-pagamento/          # Formas de pagamento
│
├── infraestrutura/                     # Serviços de Infraestrutura
│   ├── auditoria/                     # Logs de auditoria
│   ├── common/                        # Utilitários (CEP, CNAE)
│   └── email/                         # Envio de e-mails
│
└── configuracoes/                      # Configurações do Sistema
    └── estrutura/                     # Estrutura física
        ├── equipamentos/              # Gestão de equipamentos
        ├── etiquetas-amostra/         # Templates de etiquetas
        ├── imobilizados/              # Bens imobilizados
        ├── salas/                     # Salas do laboratório
        └── setores/                   # Setores/departamentos
```

### Padrão de Nomenclatura

Cada módulo segue um padrão consistente de arquivos:

- `criar-{entidade}.http` - Criar novo registro
- `listar-{entidade}.http` - Listar com paginação e filtros
- `buscar-{entidade}.http` - Buscar por ID, código ou outros critérios
- `atualizar-{entidade}.http` - Atualizar registros existentes
- `gerenciar-status.http` - Ativar/desativar/remover registros
- `exemplos-completos.http` - Cenários completos de teste

Alguns módulos têm arquivos adicionais específicos:

- `gerenciar-{relacao}.http` - Gestão de relacionamentos (ex: exames de um kit)
- `duplicar-{entidade}.http` - Duplicação de registros (ex: matrizes)

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
