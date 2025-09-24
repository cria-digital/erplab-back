# 📊 Plano de Cobertura de Testes - ERP Lab Backend

## 📈 Status Atual da Cobertura

| Módulo            | Status         | Cobertura | Prioridade   | Complexidade |
| ----------------- | -------------- | --------- | ------------ | ------------ |
| Auth              | ✅ Completo    | 88%       | 🔴 Crítica   | Alta         |
| Usuários          | ✅ Completo    | 84%       | 🔴 Crítica   | Alta         |
| Pacientes         | ✅ Completo    | 89.79%    | 🔴 Crítica   | Média        |
| Exames            | ✅ Completo    | 93.48%    | 🔴 Crítica   | Muito Alta   |
| Auditoria         | ✅ Completo    | 88.03%    | 🟡 Alta      | Média        |
| Unidade Saúde     | ✅ Completo    | 77.94%    | 🟡 Alta      | Média        |
| Empresas          | ✅ Completo    | 90%+      | 🟡 Alta      | Média        |
| Convênios         | ✅ Completo    | 90%+      | 🟡 Alta      | Alta         |
| Laboratórios      | ✅ Completo    | 90%+      | ✅ Concluído | Alta         |
| Telemedicina      | ✅ Completo    | 95%+      | ✅ Concluído | Alta         |
| Prestadores       | ✅ Completo    | 95%+      | ✅ Concluído | Alta         |
| Fornecedores      | ❌ Não testado | 0%        | 🟢 Média     | Baixa        |
| Profissionais     | ❌ Não testado | 0%        | 🟢 Média     | Média        |
| Agendas           | ❌ Não testado | 0%        | 🟢 Média     | Alta         |
| Atendimento       | ❌ Não testado | 0%        | 🟡 Alta      | Alta         |
| Common (CEP/CNAE) | ❌ Não testado | 0%        | 🔵 Baixa     | Baixa        |
| Email             | ❌ Não testado | 0%        | 🔵 Baixa     | Baixa        |
| Kits              | ❌ Não testado | 0%        | 🔵 Baixa     | Baixa        |

**Meta de Cobertura**: 85% de cobertura total do código

## 🎯 Roadmap de Implementação

### 🚀 Sprint 1: Fundação (Semana 1)

**Objetivo**: Cobrir módulos críticos de autenticação e usuários

#### 1. Módulo Auth (Completar)

- [ ] Testes unitários completos (auth.service.spec.ts)
- [ ] Testes E2E completos (auth.e2e-spec.ts)
- [ ] Testes de JWT Strategy
- [ ] Testes de Guards
- [ ] Testes de Decorators

**Casos de Teste Necessários**:

```typescript
// auth.service.spec.ts
- validateUser()
  ✅ Credenciais válidas
  ✅ Usuário não encontrado
  ✅ Senha incorreta
  ✅ Usuário inativo
  ✅ Usuário bloqueado
  ✅ Incremento de tentativas
  ✅ Bloqueio após 5 tentativas
  ✅ Reset de tentativas após sucesso
- login()
  ✅ Gerar tokens JWT
  ✅ Tokens com expiração correta
- refreshToken()
  ✅ Renovar access token
  ✅ Token inválido
  ✅ Token expirado
- forgotPassword()
  ✅ Envio de email
  ✅ Token de recuperação
  ✅ Usuário não existe
- resetPassword()
  ✅ Reset com token válido
  ✅ Token inválido
  ✅ Token expirado
- changePassword()
  ✅ Alterar com senha atual correta
  ✅ Senha atual incorreta
  ✅ Validação de senha nova
- JWT Strategy
  ✅ Validação de payload
  ✅ Usuário não encontrado
  ✅ Usuário inativo
  ✅ Usuário bloqueado
- JWT Guard
  ✅ Rotas públicas
  ✅ Rotas protegidas
  ✅ Verificação de decorator
```

#### 2. Módulo Usuários (COMPLETO - 84% Cobertura)

✅ usuarios.service.spec.ts (32 testes)
✅ usuarios.controller.spec.ts (13 testes)

- [ ] usuarios.e2e-spec.ts

**Casos de Teste Implementados**:

```typescript
// usuarios.service.spec.ts
- create()
  ✅ Criar usuário válido
  ✅ Email duplicado
  ✅ CPF duplicado
  ✅ Validação de campos obrigatórios
  ✅ Hash de senha
- findAll()
  ✅ Listar com paginação
  ✅ Filtros por status
  ✅ Ordenação
- findOne()
  ✅ Buscar por ID
  ✅ ID não existe
  ✅ Não retornar senha
- update()
  ✅ Atualizar dados permitidos
  ✅ Não permitir alterar email
  ✅ Validação de campos
- remove()
  ✅ Soft delete
  ✅ Usuário não existe
  ✅ Não deletar admin principal
- Métodos adicionais testados:
  ✅ activate, block, unblock
  ✅ resetPassword, changePassword
  ✅ incrementarTentativasLogin, resetarTentativasLogin
  ✅ atualizarUltimoLogin, registrarLogout
  ✅ getStats, findByEmail
  ✅ registrarTentativaFalha, registrarLoginSucesso
```

### 🏥 Sprint 2: Core Business (Semana 2)

**Objetivo**: Cobrir módulos essenciais do negócio

#### 3. Módulo Pacientes

- [ ] pacientes.service.spec.ts
- [ ] pacientes.controller.spec.ts
- [ ] pacientes.e2e-spec.ts

**Casos de Teste**:

```typescript
- create()
  - [ ] Cadastro completo
  - [ ] Validação CPF
  - [ ] Validação data nascimento
  - [ ] Endereço via CEP
  - [ ] Foto do paciente
- findByCpf()
  - [ ] Buscar por CPF
  - [ ] CPF inválido
- update()
  - [ ] Atualizar dados
  - [ ] Histórico de alterações
- vincularConvenio()
  - [ ] Vincular convênio
  - [ ] Validar número carteira
  - [ ] Convênio inativo
```

#### 4. Módulo Exames (Complexo)

- [ ] exames.service.spec.ts
- [ ] tipos-exame.service.spec.ts
- [ ] convenios-exame.service.spec.ts
- [ ] Controllers specs
- [ ] E2E specs

**Casos de Teste**:

```typescript
- Exames Service
  - [ ] CRUD completo
  - [ ] Busca por código TUSS/AMB/SUS
  - [ ] Filtros complexos
  - [ ] Validação de preços
  - [ ] Associação com tipos

- Ordem de Serviço
  - [ ] Criar OS
  - [ ] Adicionar exames
  - [ ] Calcular valores
  - [ ] Aplicar descontos
  - [ ] Validar convênio

- Resultados
  - [ ] Upload de resultado
  - [ ] Validação de formato
  - [ ] Notificação paciente
  - [ ] Histórico de versões
```

### 🏢 Sprint 3: Gestão e Relacionamentos (Semana 3)

**Objetivo**: Cobrir módulos de gestão empresarial

#### 5. Módulo Unidade Saúde

- [ ] Testes completos
- [ ] Validação CNPJ
- [ ] Horários de funcionamento
- [ ] Vinculação com usuários

#### 6. Módulo Empresas

- [ ] CRUD completo
- [ ] Validações fiscais
- [ ] Dados bancários
- [ ] CNAEs secundários

#### 7. Módulo Convênios

- [ ] Relacionamento com Empresa
- [ ] Regras de autorização
- [ ] Tabelas de preços
- [ ] Vigência de contratos

#### 8. Módulo Laboratórios (COMPLETO - 90%+ Cobertura)

✅ laboratorio.service.spec.ts (37 testes)
✅ laboratorio.controller.spec.ts (34 testes)

- [ ] laboratorio.e2e-spec.ts

**Casos de Teste Implementados**:

```typescript
// laboratorio.service.spec.ts
- create()
  ✅ Criar laboratório válido
  ✅ Código duplicado
  ✅ Dados opcionais
  ✅ Tipos de integração
- findAll()
  ✅ Listar ordenado por código
  ✅ Lista vazia
- findOne()
  ✅ Buscar por ID
  ✅ ID não existe
- findByCodigo()
  ✅ Buscar por código
  ✅ Código não existe
- findByCnpj()
  ✅ Buscar por CNPJ da empresa
  ✅ CNPJ não existe
- findAtivos()
  ✅ Apenas laboratórios ativos
- findByIntegracao()
  ✅ Por tipo de integração
- findAceitamUrgencia()
  ✅ Laboratórios que aceitam urgência
- update()
  ✅ Atualizar dados
  ✅ Verificar duplicidade
  ✅ Mesmo código atual
  ✅ Configurações integração
  ✅ Dados financeiros
- remove()
  ✅ Remover existente
  ✅ ID não existe
- toggleStatus()
  ✅ Ativar/desativar
- search()
  ✅ Busca por nome fantasia
  ✅ Busca por razão social
  ✅ Busca por CNPJ
  ✅ Busca por código
  ✅ Ordenação resultados

// laboratorio.controller.spec.ts
- create()
  ✅ Criar com sucesso
  ✅ Propagar erro conflito
  ✅ Dados de integração
- findAll()
  ✅ Listar laboratórios
  ✅ Lista vazia
- findAtivos()
  ✅ Apenas ativos
- findAceitamUrgencia()
  ✅ Que aceitam urgência
- search()
  ✅ Por termo geral
  ✅ Por CNPJ
  ✅ Por código
- findByIntegracao()
  ✅ Por tipo integração
  ✅ Todos os tipos
- findByCodigo()
  ✅ Por código
  ✅ Não encontrado
- findByCnpj()
  ✅ Por CNPJ
  ✅ Não encontrado
  ✅ CNPJ sem formatação
- findOne()
  ✅ Por ID
  ✅ Não encontrado
- update()
  ✅ Atualizar com sucesso
  ✅ Não encontrado
  ✅ Dados integração
  ✅ Prazos entrega
- toggleStatus()
  ✅ Ativo para inativo
  ✅ Inativo para ativo
- remove()
  ✅ Remover com sucesso
  ✅ Não encontrado
```

### 🤖 Sprint 4: Integrações e Features Avançadas (Semana 4)

**Objetivo**: Cobrir módulos de integração e features avançadas

#### 9. Módulo Telemedicina (COMPLETO - 95%+ Cobertura)

✅ telemedicina.service.spec.ts (28 testes)
✅ telemedicina-exame.service.spec.ts (26 testes)
✅ telemedicina.controller.spec.ts (29 testes)
✅ telemedicina-exame.controller.spec.ts (33 testes)

**Total**: 116 testes implementados

#### 10. Módulo Prestadores de Serviço (COMPLETO - 95%+ Cobertura)

✅ prestador-servico.service.spec.ts (37 testes)
✅ prestador-servico.controller.spec.ts (28 testes)
✅ prestador-servico-categoria.service.spec.ts (35 testes)
✅ prestador-servico-categoria.controller.spec.ts (37 testes)

**Total**: 139 testes implementados

**Casos de Teste Implementados**:

- CRUD completo de prestadores e categorias
- Gestão de contratos e status
- Avaliações e estatísticas
- Importação/exportação de categorias
- Renovação automática de contratos
- Vínculos prestador-categoria

#### 11. Módulo Auditoria

- [ ] Registro de logs
- [ ] Filtros avançados
- [ ] Estatísticas
- [ ] Relatórios

#### 12. Módulo Atendimento

- [ ] Fila de atendimento
- [ ] Chamada de pacientes
- [ ] Tempo de espera
- [ ] Prioridades

### 📊 Sprint 5: Complementares (Semana 5)

**Objetivo**: Completar cobertura com módulos auxiliares

#### 12. Módulos Auxiliares

- [ ] Common (CEP, CNAE)
- [ ] Email Service
- [ ] Prestadores de Serviço
- [ ] Fornecedores
- [ ] Profissionais
- [ ] Agendas
- [ ] Kits

## 📝 Templates de Teste

### Template Service Test

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

describe('ModuloService', () => {
  let service: ModuloService;
  let repository: Repository<Entidade>;

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn(),
    })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ModuloService,
        {
          provide: getRepositoryToken(Entidade),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ModuloService>(ModuloService);
    repository = module.get<Repository<Entidade>>(getRepositoryToken(Entidade));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('deve criar entidade com sucesso', async () => {
      // Arrange
      const dto = {
        /* dados */
      };
      const expected = { id: 'uuid', ...dto };
      mockRepository.save.mockResolvedValue(expected);

      // Act
      const result = await service.create(dto);

      // Assert
      expect(result).toEqual(expected);
      expect(mockRepository.save).toHaveBeenCalledWith(dto);
    });

    it('deve falhar com dados inválidos', async () => {
      // Teste de validação
    });
  });

  // Mais testes...
});
```

### Template E2E Test

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('ModuloController (e2e)', () => {
  let app: INestApplication;
  let authToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    // Login para obter token
    const loginResponse = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({
        email: 'test@example.com',
        password: 'Test123!',
      });

    authToken = loginResponse.body.access_token;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/modulo (GET)', () => {
    it('deve listar entidades', () => {
      return request(app.getHttpServer())
        .get('/api/v1/modulo')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('data');
          expect(res.body).toHaveProperty('meta');
          expect(Array.isArray(res.body.data)).toBe(true);
        });
    });
  });

  // Mais testes...
});
```

## 🤖 Automação de Testes

### Script de Geração de Testes

```bash
#!/bin/bash
# generate-tests.sh

MODULE=$1
TYPE=$2 # service, controller, e2e

if [ "$TYPE" = "service" ]; then
  cp templates/service.spec.template.ts src/modules/$MODULE/$MODULE.service.spec.ts
  sed -i "s/ModuloService/${MODULE^}Service/g" src/modules/$MODULE/$MODULE.service.spec.ts
elif [ "$TYPE" = "controller" ]; then
  cp templates/controller.spec.template.ts src/modules/$MODULE/$MODULE.controller.spec.ts
  sed -i "s/ModuloController/${MODULE^}Controller/g" src/modules/$MODULE/$MODULE.controller.spec.ts
elif [ "$TYPE" = "e2e" ]; then
  cp templates/e2e.spec.template.ts test/$MODULE.e2e-spec.ts
  sed -i "s/modulo/$MODULE/g" test/$MODULE.e2e-spec.ts
fi

echo "Teste criado para $MODULE ($TYPE)"
```

### Comando NPM para Gerar Testes

```json
{
  "scripts": {
    "generate:test": "bash scripts/generate-tests.sh",
    "test:module": "jest --testPathPattern=src/modules/$MODULE",
    "test:coverage:module": "jest --coverage --testPathPattern=src/modules/$MODULE"
  }
}
```

## 📊 Métricas e Monitoramento

### Dashboard de Cobertura

```bash
# Instalar dependências
npm install --save-dev jest-html-reporter jest-junit

# Configurar jest.config.js
module.exports = {
  coverageReporters: ['text', 'lcov', 'html'],
  reporters: [
    'default',
    ['jest-html-reporter', {
      pageTitle: 'ERP Lab - Test Report',
      outputPath: 'coverage/test-report.html',
      includeFailureMsg: true,
    }],
  ],
};
```

### CI/CD Metrics

```yaml
# .github/workflows/metrics.yml
name: Test Metrics

on:
  push:
    branches: [main, develop]

jobs:
  metrics:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Run tests with coverage
        run: |
          npm ci
          npm run test:cov

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v4
        with:
          file: ./coverage/lcov.info

      - name: Comment PR with coverage
        uses: romeovs/lcov-reporter-action@v0.3.1
        if: github.event_name == 'pull_request'
        with:
          lcov-file: ./coverage/lcov.info
          github-token: ${{ secrets.GITHUB_TOKEN }}
```

## 📅 Cronograma de Execução

| Semana | Sprint         | Módulos                       | Meta Cobertura | Responsável  |
| ------ | -------------- | ----------------------------- | -------------- | ------------ |
| 1      | Fundação       | Auth, Usuários                | 90%            | Time Core    |
| 2      | Core Business  | Pacientes, Exames             | 85%            | Time Core    |
| 3      | Gestão         | Unidades, Empresas, Convênios | 80%            | Time Backend |
| 4      | Integrações    | Telemedicina, Auditoria       | 80%            | Time Backend |
| 5      | Complementares | Restantes                     | 75%            | Time Full    |

## 🏆 Critérios de Aceitação

### Por Módulo

- ✅ Cobertura mínima: 80%
- ✅ Todos os cenários críticos testados
- ✅ Testes E2E dos fluxos principais
- ✅ Sem testes falhando
- ✅ Documentação atualizada

### Global

- ✅ Cobertura total: 85%
- ✅ Pipeline CI/CD verde
- ✅ Nenhuma vulnerabilidade crítica
- ✅ Tempo de execução < 5 minutos
- ✅ Relatórios de cobertura publicados

## 🛠️ Ferramentas Necessárias

### Testing

- Jest (já instalado)
- Supertest (já instalado)
- @nestjs/testing (já instalado)

### Coverage

```bash
npm install --save-dev @vitest/coverage-istanbul nyc
```

### Mocking

```bash
npm install --save-dev faker @faker-js/faker mockdate
```

### Reporting

```bash
npm install --save-dev jest-html-reporter jest-junit allure-jest
```

## 📚 Recursos e Documentação

### Links Úteis

- [Jest Documentation](https://jestjs.io/)
- [NestJS Testing Guide](https://docs.nestjs.com/fundamentals/testing)
- [Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)

### Exemplos de Testes Complexos

- [Testes com Transações](https://github.com/nestjs/nest/tree/master/sample)
- [Testes de WebSockets](https://docs.nestjs.com/websockets/testing)
- [Testes de GraphQL](https://docs.nestjs.com/graphql/testing)

## 📊 Progresso Atual (Última atualização: Janeiro 2025)

### ✅ Módulos Completados

1. **Auth** - 88% de cobertura
   - auth.service.spec.ts ✅
   - auth.controller.spec.ts ✅
   - jwt.strategy.spec.ts ✅
   - jwt-auth.guard.spec.ts ✅

2. **Usuários** - 84% de cobertura
   - usuarios.service.spec.ts ✅
   - usuarios.controller.spec.ts ✅

3. **Pacientes** - 89.79% de cobertura
   - pacientes.service.spec.ts ✅
   - pacientes.controller.spec.ts ✅

4. **Exames** - 93.48% de cobertura
   - exames.service.spec.ts ✅ (100% coverage)
   - exames.controller.spec.ts ✅ (100% coverage)
   - tipos-exame.service.spec.ts ✅ (100% coverage)
   - tipos-exame.controller.spec.ts ✅ (100% coverage)
   - convenios.service.spec.ts ✅ (100% coverage)
   - convenios.controller.spec.ts ✅ (100% coverage)

5. **Auditoria** - 88.03% de cobertura
   - auditoria.service.spec.ts ✅ (90.12% coverage)
   - auditoria.controller.spec.ts ✅ (100% coverage)

6. **Unidade Saúde** - 77.94% de cobertura
   - unidade-saude.service.spec.ts ✅ (78.23% coverage)
   - unidade-saude.controller.spec.ts ✅ (100% coverage)

7. **Empresas** - 90%+ de cobertura (estimado)
   - empresas.service.spec.ts ✅ (35 testes - cobertura completa)
   - empresas.controller.spec.ts ✅ (19 testes - 100% coverage)

8. **Convênios** - 90%+ de cobertura (estimado)
   - convenio.service.spec.ts ✅ (42 testes - cobertura completa com transações)
   - convenio.controller.spec.ts ✅ (30 testes - 100% coverage)

### 🎯 Próximas Ações

1. **Imediato (Próxima sessão)**
   - [x] ~~Completar testes do módulo Exames~~ ✅ COMPLETO (93.48%)
   - [x] ~~Completar testes do módulo Auditoria~~ ✅ COMPLETO (88.03%)
   - [x] ~~Iniciar módulo Unidade Saúde~~ ✅ COMPLETO (77.94%)
   - [x] ~~Iniciar módulo Empresas~~ ✅ COMPLETO (90%+)
   - [x] ~~Iniciar módulo Convênios~~ ✅ COMPLETO (90%+)
   - [x] ✅ Concluído módulo Laboratórios (0% → 90%+)
   - [ ] Iniciar módulo Telemedicina (0% → 85%)
   - [x] ~~Atualizar métricas de cobertura~~ ✅

2. **Esta Semana**
   - [ ] Completar módulos de Alta prioridade
   - [ ] Documentação de testes atualizada
   - [ ] Pipeline CI/CD otimizado

3. **Este Mês**
   - [ ] 85% de cobertura alcançada
   - [ ] Todos os módulos críticos testados
   - [ ] Sistema de monitoramento implementado

---

💡 **Dica**: Execute `npm run test:cov` regularmente para acompanhar o progresso da cobertura!
