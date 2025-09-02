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
- PostgreSQL em execução (Docker recomendado)
- Usuário e banco configurados: `nestuser:nestpass` com banco `erplab`

## 🛠️ Configuração e Instalação

### 1. Clone e instale dependências
```bash
cd erplab-back
npm install
```

### 2. Configure as variáveis de ambiente
```bash
cp .env.example .env
# Edite o arquivo .env conforme necessário
```

### 3. Crie o banco de dados
```sql
-- Conecte-se ao PostgreSQL como usuário nestuser
CREATE DATABASE erplab;
```

### 4. Execute as migrations
```bash
# Gerar uma nova migration
npm run migration:generate -- src/database/migrations/InitialMigration

# Executar migrations
npm run migration:run
```

### 5. Execute o projeto
```bash
# Desenvolvimento
npm run start:dev

# Produção
npm run build
npm run start:prod
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