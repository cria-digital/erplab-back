# 📊 Plano de Cobertura de Testes - ERP Lab Backend

## 📈 Status Atual da Cobertura

| Módulo            | Status         | Cobertura | Prioridade | Complexidade |
| ----------------- | -------------- | --------- | ---------- | ------------ |
| Auth              | ✅ Parcial     | 30%       | 🔴 Crítica | Alta         |
| Usuários          | ❌ Não testado | 0%        | 🔴 Crítica | Alta         |
| Pacientes         | ❌ Não testado | 0%        | 🔴 Crítica | Média        |
| Exames            | ❌ Não testado | 0%        | 🔴 Crítica | Muito Alta   |
| Auditoria         | ❌ Não testado | 0%        | 🟡 Alta    | Média        |
| Unidade Saúde     | ❌ Não testado | 0%        | 🟡 Alta    | Média        |
| Empresas          | ❌ Não testado | 0%        | 🟡 Alta    | Média        |
| Convênios         | ❌ Não testado | 0%        | 🟡 Alta    | Alta         |
| Laboratórios      | ❌ Não testado | 0%        | 🟡 Alta    | Alta         |
| Telemedicina      | ❌ Não testado | 0%        | 🟢 Média   | Alta         |
| Prestadores       | ❌ Não testado | 0%        | 🟢 Média   | Média        |
| Fornecedores      | ❌ Não testado | 0%        | 🟢 Média   | Baixa        |
| Profissionais     | ❌ Não testado | 0%        | 🟢 Média   | Média        |
| Agendas           | ❌ Não testado | 0%        | 🟢 Média   | Alta         |
| Atendimento       | ❌ Não testado | 0%        | 🟡 Alta    | Alta         |
| Common (CEP/CNAE) | ❌ Não testado | 0%        | 🔵 Baixa   | Baixa        |
| Email             | ❌ Não testado | 0%        | 🔵 Baixa   | Baixa        |
| Kits              | ❌ Não testado | 0%        | 🔵 Baixa   | Baixa        |

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
  - [ ] Envio de email
  - [ ] Token de recuperação
  - [ ] Usuário não existe
- resetPassword()
  - [ ] Reset com token válido
  - [ ] Token inválido
  - [ ] Token expirado
- changePassword()
  - [ ] Alterar com senha atual correta
  - [ ] Senha atual incorreta
  - [ ] Validação de senha nova
```

#### 2. Módulo Usuários

- [ ] usuarios.service.spec.ts
- [ ] usuarios.controller.spec.ts
- [ ] usuarios.e2e-spec.ts

**Casos de Teste**:

```typescript
// usuarios.service.spec.ts
- create()
  - [ ] Criar usuário válido
  - [ ] Email duplicado
  - [ ] CPF duplicado
  - [ ] Validação de campos obrigatórios
  - [ ] Hash de senha
- findAll()
  - [ ] Listar com paginação
  - [ ] Filtros por status
  - [ ] Ordenação
- findOne()
  - [ ] Buscar por ID
  - [ ] ID não existe
  - [ ] Não retornar senha
- update()
  - [ ] Atualizar dados permitidos
  - [ ] Não permitir alterar email
  - [ ] Validação de campos
- remove()
  - [ ] Soft delete
  - [ ] Usuário não existe
  - [ ] Não deletar admin principal
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

#### 8. Módulo Laboratórios

- [ ] Integração com empresas
- [ ] Configurações de integração
- [ ] Prazos de entrega
- [ ] Repasses

### 🤖 Sprint 4: Integrações e Features Avançadas (Semana 4)

**Objetivo**: Cobrir módulos de integração e features avançadas

#### 9. Módulo Telemedicina

- [ ] Configurações de plataforma
- [ ] Vínculos de exames
- [ ] Integração APIs
- [ ] Agendamento online

#### 10. Módulo Auditoria

- [ ] Registro de logs
- [ ] Filtros avançados
- [ ] Estatísticas
- [ ] Relatórios

#### 11. Módulo Atendimento

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

## 🎯 Próximas Ações

1. **Imediato (Hoje)**
   - [ ] Completar testes do módulo Auth
   - [ ] Iniciar testes do módulo Usuários
   - [ ] Configurar dashboard de cobertura

2. **Esta Semana**
   - [ ] Sprint 1 completa
   - [ ] Documentação de testes atualizada
   - [ ] Pipeline CI/CD otimizado

3. **Este Mês**
   - [ ] 85% de cobertura alcançada
   - [ ] Todos os módulos críticos testados
   - [ ] Sistema de monitoramento implementado

---

💡 **Dica**: Execute `npm run test:cov` regularmente para acompanhar o progresso da cobertura!
