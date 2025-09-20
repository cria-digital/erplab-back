# Padrões e Aprendizados do Projeto ERP Lab Backend

## Setup Inicial do Sistema

### Criação do Primeiro Usuário
- **Endpoint especial**: `POST /api/v1/auth/setup`
- **Email fixo**: `diegosoek@gmail.com`
- **Funcionalidade**: Cria o usuário administrador inicial quando o sistema está vazio
- **Restrição**: Só funciona quando não há usuários cadastrados no sistema
- **Uso**:
  ```bash
  curl -X POST http://localhost:10016/api/v1/auth/setup \
    -H "Content-Type: application/json" \
    -d '{"senha": "Admin123!"}'
  ```
- **Resposta de sucesso**: Retorna dados do usuário criado
- **Resposta de erro**: HTTP 400 se já existir usuário no sistema

### Usuário de Teste Criado
- **Email**: `diegosoek@gmail.com`
- **Senha**: `Admin123!`
- **Cargo**: Administrador do Sistema
- **Status**: Ativo
- **ID**: `f6749f41-187e-4a05-8fe7-285ef87e99f1`

## Estrutura do Projeto

### Padrões de Organização de Módulos
- **Estrutura de módulos**: Seguir padrão flat - services e controllers ficam na raiz do módulo, NÃO em subpastas
  - ✅ Correto: `/src/modules/usuarios/usuarios.service.ts`
  - ❌ Errado: `/src/modules/usuarios/services/usuarios.service.ts`

### Convenções de Nomenclatura
- **TypeScript/JavaScript**: camelCase para propriedades e métodos
- **Banco de dados**: snake_case para colunas
  - Exemplo: `nome_completo` no banco → `nomeCompleto` no TypeScript
- **Entidades**: Usar decorador `@Column({ name: 'snake_case' })` para mapear

## Autenticação JWT

### Implementação Completa
1. **Dependências necessárias**:
   ```bash
   npm install @nestjs/jwt @nestjs/passport passport passport-jwt @types/passport-jwt
   ```

2. **Estrutura do módulo Auth**:
   - `auth.module.ts` - Configuração do módulo
   - `auth.service.ts` - Lógica de autenticação
   - `auth.controller.ts` - Endpoints
   - `strategies/jwt.strategy.ts` - Estratégia Passport
   - `guards/jwt-auth.guard.ts` - Guard global
   - `decorators/public.decorator.ts` - Marcar rotas públicas
   - `decorators/current-user.decorator.ts` - Obter usuário atual

3. **Configuração no .env**:
   ```env
   JWT_SECRET=sua-chave-secreta
   JWT_EXPIRES_IN=24h
   JWT_REFRESH_EXPIRES_IN=7d
   ```

4. **Guard Global**: Configurado no `app.module.ts` com `APP_GUARD`
5. **Rotas Públicas**: Usar decorator `@Public()` para excluir da autenticação

## HTTP Request Files (REST Client)

### Organização
- **Localização**: `/http-requests/[nome-modulo]/`
- **Estrutura**: Um arquivo por funcionalidade
  - `criar-[entidade].http`
  - `listar-[entidade].http`
  - `buscar-[entidade].http`
  - `atualizar-[entidade].http`
  - `exemplos-completos.http`

### Variáveis de Ambiente
- Definidas em `/http-client.env.json`
- Variáveis padrão: `{{baseUrl}}`, `{{contentType}}`, `{{token}}`
- Separação por ambiente: development, staging, production

### Formato dos Requests
```http
### Descrição do Request
METHOD {{baseUrl}}/endpoint
Content-Type: {{contentType}}
Authorization: Bearer {{token}}

{
  "campo": "valor"
}

### Expected Response
# Status: 200 OK
# {
#   "resultado": "esperado"
# }
```

## Boas Práticas Identificadas

### Sempre Executar Build e Lint (OBRIGATÓRIO)
```bash
npm run build  # Verificar erros TypeScript
npm run lint   # Verificar padrões de código
```
**IMPORTANTE**: SEMPRE executar estes comandos ao finalizar qualquer implementação ou alteração de código.

### Módulo de Auditoria
- Registrar todas as operações críticas
- Tipos de log: ACESSO, ALTERACAO, ERRO, ACAO
- Níveis: INFO, WARNING, ERROR, CRITICAL
- Integração automática em services de outros módulos

### Tratamento de Senhas
- Sempre usar bcrypt para hash
- Salt rounds: 10
- Nunca retornar hash de senha nas respostas
- Implementar bloqueio após tentativas falhas (5 tentativas = 30 min bloqueio)

### Soft Delete
- Preferir desativação (`ativo: false`) em vez de exclusão física
- Manter histórico para auditoria

### Validação e DTOs
- Usar class-validator para validações
- Documentar com @ApiProperty do Swagger
- Separar DTOs de Create e Update
- Sempre validar UUIDs e formatos específicos (CPF, email, etc)

## APIs Disponíveis

### Módulo Common (APIs Auxiliares)
- **CEP** (`/api/v1/cep`)
  - `GET /{cep}` - Buscar endereço por CEP (público)
  - Retorna dados compatíveis com cadastro de unidades
  - Usa API ViaCEP como fonte de dados

- **CNAE** (`/api/v1/cnae`)
  - `GET /` - Listar CNAEs com filtros e paginação (público)
    - Parâmetros de paginação: `page` (padrão: 1), `limit` (padrão: 10, máx: 100)
    - Retorna estrutura paginada com `data` e `meta`
  - `GET /search?q={termo}` - Buscar por termo (público)
  - `GET /codigo?codigo={codigo}` - Buscar por código específico (público)
  - `GET /secao/{secao}` - Listar por seção (público)
  - `GET /divisao/{divisao}` - Listar por divisão (público)
  - **IMPORTANTE**: Códigos CNAE estão armazenados sem formatação (ex: `86101` ao invés de `8610-1/01`)
  - **Total de CNAEs**: 1358 registros importados da base completa do IBGE
  - **Paginação**: Implementada com metadados (total, totalPages, hasPrevPage, hasNextPage)

### Módulo de Exames (26 endpoints)
- **Exames** (`/api/v1/exames`)
  - CRUD completo de exames
  - Busca por categoria, tipo, laboratório
  - Gestão de status em lote
  - Filtros especializados (com preparo, urgentes)

- **Tipos de Exame** (`/api/v1/tipos-exame`)
  - CRUD completo de tipos
  - Filtros por agendamento, autorização, domiciliar

- **Convênios** (`/api/v1/convenios`)
  - CRUD completo de convênios
  - Verificação de autorização
  - Regras específicas por convênio

## Comandos Úteis

### Desenvolvimento
```bash
npm run start:dev     # Desenvolvimento com hot reload
npm run build        # Compilar TypeScript
npm run lint         # Verificar código
npm run test         # Executar testes
```

### Seeders
```bash
npm run seed        # Executa todos os seeders
npm run seed:all    # Executa todos os seeders (alias)
npm run seed:cnae   # Executa apenas seeder de CNAEs
```

**Seeder de CNAEs**:
- Importa 12 CNAEs da área de saúde por padrão
- Para importar TODOS os CNAEs: baixe JSON de https://servicodados.ibge.gov.br/api/v2/cnae/classes
- Salve em `src/database/seeds/data/cnaes.json`

### Banco de Dados
```bash
# SEMPRE usar o comando abaixo para gerar migrations (cria timestamp automático)
npm run build && npx typeorm migration:generate -d dist/config/typeorm.config.js src/database/migrations/NomeDaMigration

npm run migration:run     # Executar migrations
npm run migration:revert  # Reverter última migration
```

### Testar Autenticação
```bash
# Login
curl -X POST http://localhost:10016/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "diegosoek@gmail.com", "password": "Admin123!"}'

# Usar token em requisição autenticada
TOKEN="seu_token_aqui"
curl -X GET http://localhost:10016/api/v1/usuarios \
  -H "Authorization: Bearer $TOKEN"
```

## Estado Atual do Sistema

### Tabelas Criadas via Migrations
- ✅ **usuarios** - Tabela principal de usuários
- ✅ **usuarios_unidades** - Relacionamento usuário x unidade de saúde
- ✅ **usuarios_permissoes** - Permissões de usuários
- ✅ **modulos_sistema** - Módulos do sistema
- ✅ **tipos_permissao** - Tipos de permissões
- ✅ **auditoria_logs** - Logs de auditoria
- ✅ **historico_alteracoes** - Histórico de alterações
- ✅ **logs_auditoria** - Logs de auditoria (compatibilidade)
- ✅ **pacientes** - Tabela de pacientes
- ✅ **unidades_saude** - Unidades de saúde
- ✅ **horarios_atendimento** - Horários de atendimento
- ✅ **dados_bancarios** - Dados bancários
- ✅ **cnae_secundarios** - CNAEs secundários
- ✅ **exames** - Cadastro de exames laboratoriais
- ✅ **tipos_exame** - Tipos/categorias de exames
- ✅ **convenios** - Convênios médicos e planos de saúde
- ✅ **ordens_servico** - Ordens de serviço para exames
- ✅ **ordens_servico_exames** - Exames vinculados às ordens
- ✅ **resultados_exames** - Resultados dos exames
- ✅ **laboratorios_apoio** - Laboratórios parceiros
- ✅ **subgrupos_exame** - Subgrupos de exames
- ✅ **setores_exame** - Setores responsáveis pelos exames
- ✅ **cnaes** - Classificação Nacional de Atividades Econômicas

### Migrations Executadas
1. `CreatePacientesTable1756931316461`
2. `CreateUnidadesSaudeTable1757363365715`
3. `CreateUsuariosTable1757583000000`
4. `CreateAuditoriaAndPermissoesTables1757582641301`
5. `CreateExamesTables1757809611114`
6. `AddPasswordResetFields1757842882650`
7. `CreateCnaeTable1757970200000`

## Estrutura de Entidades

### Usuario
- Autenticação com JWT
- Suporte a 2FA (dois fatores)
- Perguntas de recuperação de senha
- Relacionamento N:N com UnidadeSaude via UsuarioUnidade
- Relacionamento N:N com Permissoes via UsuarioPermissao
- Controle de tentativas de login e bloqueio temporário

### Auditoria
- Log completo de todas as operações
- Rastreamento de alterações com before/after
- Filtros avançados para consulta
- Estatísticas agregadas

### Módulo de Exames
- **Exame**: Cadastro completo de exames com códigos TUSS, AMB, LOINC, SUS
- **TipoExame**: Categorização de exames (laboratorial, imagem, procedimento)
- **Convenio**: Gestão de convênios com configurações específicas
- **OrdemServico**: Gestão de ordens de serviço para exames
- **ResultadoExame**: Armazenamento de resultados e laudos
- **LaboratorioApoio**: Laboratórios parceiros para exames especializados
- Relacionamentos complexos entre entidades
- Suporte a multi-tenant (empresa_id)
- Soft delete em todas as entidades

### Módulo Common (APIs Auxiliares)
- **API de CEP**: Busca endereços via ViaCEP com dados compatíveis para cadastros
- **API de CNAE**: Consulta de CNAEs (Classificação Nacional de Atividades Econômicas)
- **Entidade CNAE**: Estrutura completa com seção, divisão, grupo, classe e subclasse
- Busca de CNAEs por código, descrição, seção e divisão
- 12 CNAEs da área de saúde pré-cadastrados via seeder

## Pontos de Atenção

1. **NUNCA criar tabelas/schemas sem migrations** - SEMPRE usar TypeORM migrations
2. **NUNCA criar arquivos de migration manualmente** - SEMPRE usar `npm run migration:generate` ou `npm run migration:create` para gerar timestamp correto
3. **NUNCA apagar migrations existentes** - Migrations são imutáveis após commit. Se houver problema, criar nova migration para corrigir
4. **Não criar subpastas em módulos** - Manter estrutura flat
3. **Sempre rodar build e lint** antes de considerar tarefa completa
4. **Seguir padrões de nomenclatura** do projeto (snake_case no DB, camelCase no TS)
5. **Organizar requests HTTP** em arquivos separados por operação
6. **Usar variáveis de ambiente** para configurações sensíveis
7. **Implementar auditoria** em operações críticas
8. **Validar dados de entrada** com DTOs e class-validator
9. **Documentar API** com decorators do Swagger
10. **Usar query parameters para códigos com caracteres especiais** - CNAEs têm barras no código (ex: `?codigo=8640-2/02` em vez de `/codigo/8640-2/02`)

## Módulo de Laboratórios (Em Desenvolvimento)

### Decisões de Arquitetura
- **Estrutura similar a Convênios**: Laboratórios seguem o mesmo padrão de convênios
- **Relacionamento com Empresas**: OneToOne com a tabela `empresas` via `empresa_id`
- **Campos específicos apenas**: A tabela `laboratorios` contém apenas campos específicos de laboratório
  - Dados comuns (CNPJ, razão social, endereço, etc) ficam na tabela `empresas`
  - Dados específicos (integração, prazos de entrega, responsável técnico, etc) ficam em `laboratorios`

### Estrutura da Tabela Laboratórios
```sql
laboratorios
├── id (uuid)
├── empresa_id (uuid, FK → empresas.id, UNIQUE)
├── codigo_laboratorio (varchar 20, UNIQUE)
├── responsavel_tecnico (varchar 255)
├── conselho_responsavel (varchar 20)
├── numero_conselho (varchar 20)
├── tipo_integracao (enum: api, webservice, manual, ftp, email)
├── url_integracao (varchar 255)
├── token_integracao (varchar 255)
├── usuario_integracao (varchar 100)
├── senha_integracao (varchar 100)
├── configuracao_adicional (text/json)
├── metodos_envio_resultado (text/array)
├── portal_resultados_url (varchar 255)
├── prazo_entrega_normal (int, default: 3)
├── prazo_entrega_urgente (int, default: 1)
├── taxa_urgencia (decimal 10,2)
├── percentual_repasse (decimal 5,2)
├── aceita_urgencia (boolean, default: false)
├── envia_resultado_automatico (boolean, default: true)
├── observacoes (text)
├── created_at (timestamp)
└── updated_at (timestamp)
```

### Arquivos Criados
- `src/modules/laboratorios/entities/laboratorio.entity.ts` - Entidade com relacionamento OneToOne para Empresa
- `src/modules/laboratorios/dto/create-laboratorio.dto.ts` - DTO para criação (reutiliza estrutura de convênios)
- `src/modules/laboratorios/dto/update-laboratorio.dto.ts` - DTO para atualização
- `src/modules/laboratorios/services/laboratorio.service.ts` - Service com métodos CRUD e buscas específicas
- `src/modules/laboratorios/controllers/laboratorio.controller.ts` - Controller com endpoints RESTful
- `src/modules/laboratorios/laboratorios.module.ts` - Módulo do NestJS
- `src/database/migrations/[timestamp]-CreateLaboratoriosTable.ts` - Migration criada manualmente

### Status Atual
- ✅ Entidade criada com campos específicos
- ✅ DTOs criados reaproveitando estrutura de convênios
- ✅ Service implementado com métodos similares a convênios
- ✅ Controller com endpoints específicos para laboratórios
- ✅ Módulo criado e registrado no AppModule
- ✅ Migration manual criada (apenas campos específicos)
- ⏳ Migration ainda não executada
- ⏳ Testes ainda não realizados

### Consideração sobre Herança vs Relacionamento
- **Padrão escolhido**: Manter consistência com o módulo de Convênios
- **Estrutura**: Relacionamento OneToOne com `empresas` (não herança de tabelas)
- **Motivo**: TypeORM com PostgreSQL tem limitações para herança de tabelas
- **Benefício**: Mantém dados normalizados e evita duplicação

## Próximos Passos Sugeridos

1. Executar migration do módulo de laboratórios
2. Criar testes para o módulo de laboratórios
3. Implementar sistema de permissões granulares
4. Adicionar rate limiting nos endpoints
5. Implementar cache com Redis
6. Adicionar testes unitários e e2e
7. Configurar CI/CD pipeline
8. Implementar websockets para notificações real-time
9. Adicionar sistema de filas para processamento assíncrono