# ERP Laboratório - Backend

Sistema ERP modular para laboratórios de análises clínicas e imagens, desenvolvido com NestJS, TypeORM e PostgreSQL.

## 🚀 Tecnologias

- **Node.js** 20+
- **NestJS** 11+
- **TypeORM** 0.3+
- **PostgreSQL** 15+
- **TypeScript**

## 📋 Pré-requisitos

- Node.js 20 ou superior
- Docker e Docker Compose
- Git

## 🛠️ Configuração e Instalação

### 1. Clone o repositório e instale dependências
```bash
cd erplab-back
npm install
```

### 2. Configure as variáveis de ambiente
```bash
cp .env.example .env
# O arquivo .env já está configurado com as credenciais corretas
# Caso necessário, ajuste conforme seu ambiente
```

### 3. Inicie o banco de dados PostgreSQL via Docker

#### 🐳 Tutorial Docker Compose - Banco de Dados

O projeto utiliza Docker Compose para gerenciar o banco de dados PostgreSQL de forma simples e isolada.

**Arquivo `docker-compose.yml` configurado:**
```yaml
version: '3.8'
services:
  erplab-db:
    container_name: erplab-postgres
    image: postgres:15-alpine
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: erplab_user
      POSTGRES_PASSWORD: erplab_pass_2024
      POSTGRES_DB: erplab_db
    volumes:
      - erplab_data:/var/lib/postgresql/data
volumes:
  erplab_data:
```

**Comandos básicos:**

```bash
# 1. INICIAR o banco de dados (primeira vez ou após parar)
docker-compose up -d
# -d significa "detached" (roda em background)

# 2. VERIFICAR se está rodando
docker ps
# Deve mostrar o container "erplab-postgres" com status "Up"

# 3. VER LOGS do banco (útil para debug)
docker-compose logs -f erplab-db
# Ctrl+C para sair dos logs

# 4. PARAR o banco (mantém os dados)
docker-compose stop

# 5. INICIAR novamente (após stop)
docker-compose start

# 6. PARAR e REMOVER containers (dados permanecem)
docker-compose down

# 7. RESETAR TUDO (CUIDADO: apaga todos os dados!)
docker-compose down -v
# -v remove os volumes (onde ficam os dados)
```

**Troubleshooting comum:**

```bash
# Porta 5432 já em uso?
# Verifique se outro PostgreSQL está rodando:
sudo lsof -i :5432

# Container não inicia?
# Veja os logs detalhados:
docker-compose logs erplab-db

# Permissão negada?
# Execute com sudo (Linux) ou verifique se Docker Desktop está rodando (Windows/Mac)
sudo docker-compose up -d
```

**Credenciais do banco:**
- **Host:** localhost
- **Porta:** 5432
- **Banco:** erplab_db
- **Usuário:** erplab_user
- **Senha:** erplab_pass_2024

### 4. Execute as migrations
```bash
# Build do projeto (necessário antes das migrations)
npm run build

# Executar migrations pendentes
npm run migration:run

# Criar nova migration (quando necessário)
npm run migration:create src/database/migrations/NomeDaMigration

# Gerar migration baseada em mudanças nas entities
npm run migration:generate src/database/migrations/NomeDaMigration

# Reverter última migration (se necessário)
npm run migration:revert
```

### 5. Execute o projeto
```bash
# Desenvolvimento (com hot reload)
npm run start:dev

# Produção
npm run build
npm run start:prod
```

**Verificando se tudo está funcionando:**
```bash
# Teste a API
curl http://localhost:10016/api/v1/health

# Ou abra no navegador
http://localhost:10016/api/v1/health
```

## 🌐 Endpoints

- **API Base:** `http://localhost:10016/api/v1`
- **Documentação:** `http://localhost:10016/api/docs` (em desenvolvimento)
- **Health Check:** `http://localhost:10016/api/v1/health` (em desenvolvimento)

## 📁 Estrutura do Projeto

```
src/
├── comum/                    # Utilitários compartilhados
│   ├── decorators/          # Decorators personalizados
│   ├── filters/             # Exception filters
│   ├── guards/              # Guards de autenticação
│   ├── interceptors/        # Interceptors globais
│   ├── pipes/               # Pipes de validação
│   └── utils/               # Funções utilitárias
├── config/                   # Configurações da aplicação
│   ├── database.config.ts   # Configuração do TypeORM
│   └── typeorm.config.ts    # DataSource para migrations
├── database/                # Database related files
│   ├── migrations/          # Migrations do TypeORM
│   └── seeds/               # Seeds para dados iniciais
└── modulos/                 # Módulos da aplicação
    ├── atendimento/         # RF001-RF004: Atendimento e agendamento
    ├── exames/              # RF005-RF009: Gestão de exames
    ├── financeiro/          # RF010-RF012: Módulo financeiro
    ├── crm/                 # RF014-RF016: CRM e WhatsApp
    ├── auditoria/           # RF017-RF020: Auditoria e qualidade
    ├── estoque/             # RF015-RF016: Estoque e compras
    ├── tiss/                # RF017-RF018: TISS e convênios
    ├── tarefas/             # RF019-RF020: Tarefas internas
    ├── bi/                  # RF021-RF022: Business Intelligence
    ├── portal-cliente/      # RF023-RF025: Portal do cliente
    ├── portal-medico/       # RF026-RF027: Portal médico
    └── integracoes/         # RF028-RF035: Integrações externas
```

## 🐳 Docker - Comandos Úteis

```bash
# Iniciar banco de dados
docker-compose up -d

# Parar banco de dados
docker-compose down

# Parar e remover volumes (CUIDADO: apaga todos os dados)
docker-compose down -v

# Ver logs do banco
docker-compose logs -f erplab-db

# Acessar o PostgreSQL via CLI
docker exec -it erplab-postgres psql -U erplab_user -d erplab_db

# Fazer backup do banco
docker exec erplab-postgres pg_dump -U erplab_user erplab_db > backup.sql

# Restaurar backup
docker exec -i erplab-postgres psql -U erplab_user erplab_db < backup.sql
```

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run start:dev           # Servidor em modo watch
npm run start:debug         # Servidor com debug

# Build e produção
npm run build               # Build da aplicação
npm run start:prod          # Servidor em produção

# Qualidade de código
npm run lint                # ESLint
npm run format              # Prettier

# Testes
npm run test                # Testes unitários
npm run test:watch          # Testes em modo watch
npm run test:e2e            # Testes end-to-end
npm run test:cov            # Cobertura de testes

# Banco de dados
npm run migration:create    # Criar nova migration
npm run migration:generate  # Gerar migration baseada em entities
npm run migration:run       # Executar migrations
npm run migration:revert    # Reverter última migration
```

## 🏗️ Módulos do Sistema

### Core Modules (Implementação Prioritária)
1. **Atendimento** - Sistema multi-canal, OCR, filas, OS
2. **Exames** - Integração laboratórios, telemedicina, DICOM
3. **Financeiro** - Contas a pagar/receber, conciliação
4. **CRM** - WhatsApp Bot, jornada do cliente
5. **Auditoria** - POPs, checklists, rastreabilidade

### Secondary Modules
6. **Estoque** - Controle de insumos e compras
7. **TISS** - Gestão de convênios
8. **Tarefas** - Gestão interna de atividades
9. **BI** - Dashboards e relatórios
10. **Portais** - Cliente e médico
11. **Integrações** - APIs externas

## 🔒 Variáveis de Ambiente

Principais configurações no arquivo `.env`:

```env
# Aplicação
PORT=10016
NODE_ENV=development

# Banco de dados
DB_HOST=localhost
DB_USERNAME=nestuser
DB_PASSWORD=nestpass
DB_DATABASE=erplab

# APIs Críticas (configurar conforme necessário)
WHATSAPP_TOKEN=...
DB_API_TOKEN=...
HERMES_PARDINI_API_TOKEN=...
```

## 🎯 Próximos Passos

1. **Implementar módulo de atendimento** (prioridade 1)
2. **Configurar autenticação JWT**
3. **Criar entities principais**
4. **Implementar integração WhatsApp**
5. **Configurar Swagger/OpenAPI**

## 📝 Convenções

- **Idioma:** Português (PT-BR) para nomes de classes, variáveis, banco de dados
- **Nomenclatura:** camelCase para código, snake_case para banco
- **Estrutura:** Um módulo por funcionalidade do PDF
- **Migrations:** Obrigatórias para mudanças no banco

## 🤝 Contribuição

1. Siga as convenções de nomenclatura em português
2. Mantenha a estrutura modular definida
3. Use migrations para mudanças no banco
4. Escreva testes para novas funcionalidades
5. Execute lint antes de commit

---
**Desenvolvido para ERPLab** - Sistema ERP para Laboratórios de Análises Clínicas