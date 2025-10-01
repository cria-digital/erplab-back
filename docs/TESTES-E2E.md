# Guia de Testes E2E (End-to-End)

## 📋 Índice

1. [Introdução](#introdução)
2. [Configuração Inicial](#configuração-inicial)
3. [Executando os Testes](#executando-os-testes)
4. [Estrutura dos Testes](#estrutura-dos-testes)
5. [Boas Práticas](#boas-práticas)
6. [Troubleshooting](#troubleshooting)

## Introdução

Os testes E2E testam a aplicação completa, incluindo:

- ✅ Rotas HTTP reais
- ✅ Banco de dados real
- ✅ Validações e guards
- ✅ Relacionamentos entre entidades
- ✅ Transações e rollbacks

**⚠️ IMPORTANTE:** Os testes E2E **APAGAM TODOS OS DADOS** do banco de teste a cada execução!

## Configuração Inicial

### 1. Criar Banco de Dados de Teste

Execute o script automatizado:

```bash
./scripts/create-test-db.sh
```

Ou manualmente via psql:

```bash
psql -U nestuser -h localhost -c "CREATE DATABASE erplab_db_test;"
```

### 2. Configurar Variáveis de Ambiente

Copie o arquivo de exemplo:

```bash
cp .env.test.example .env.test
```

Edite o `.env.test` e configure:

```env
DB_DATABASE=erplab_db_test  # NUNCA use o banco de desenvolvimento!
```

### 3. Executar Migrations no Banco de Teste

```bash
NODE_ENV=test npm run migration:run
```

## Executando os Testes

### Todos os testes E2E

```bash
npm run test:e2e
```

### Testes de um módulo específico

```bash
npm run test:e2e test/usuarios/usuarios.e2e-spec.ts
```

### Testes de múltiplos módulos (sequencial)

```bash
npm run test:e2e test/contas-pagar/
```

### Modo debug

```bash
NODE_ENV=test jest --config ./test/jest-e2e.json --runInBand --detectOpenHandles
```

## Estrutura dos Testes

### Template Básico

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { DataSource } from 'typeorm';

describe('MeuModuloController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let authToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // IMPORTANTE: Aplicar o prefixo global da API
    app.setGlobalPrefix('api/v1');

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();

    dataSource = app.get(DataSource);

    // ⚠️ APAGA TODAS AS TABELAS E RECRIA
    await dataSource.synchronize(true);

    // Criar usuário de teste e obter token
    await request(app.getHttpServer())
      .post('/api/v1/auth/setup')
      .send({ senha: 'Admin123!' });

    const loginResponse = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({
        email: 'diegosoek@gmail.com',
        password: 'Admin123!',
      });

    authToken = loginResponse.body.access_token;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/meu-recurso (POST)', () => {
    it('deve criar um novo recurso', () => {
      return request(app.getHttpServer())
        .post('/api/v1/meu-recurso')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          campo1: 'valor1',
          campo2: 'valor2',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.campo1).toBe('valor1');
        });
    });
  });
});
```

## Boas Práticas

### ✅ DO (Faça)

1. **Use banco de teste separado**

   ```typescript
   // .env.test
   DB_DATABASE = erplab_db_test;
   ```

2. **Limpe o banco no beforeAll**

   ```typescript
   await dataSource.synchronize(true);
   ```

3. **Crie dados de setup necessários**

   ```typescript
   // Criar unidade, empresa, etc antes dos testes
   const unidade = await criarUnidadeTeste();
   ```

4. **Use --runInBand para testes E2E**

   ```bash
   # Evita conflitos de banco
   npm run test:e2e
   ```

5. **Teste casos de sucesso E erro**
   ```typescript
   it('deve falhar sem autenticação', () => {
     return request(app.getHttpServer()).post('/api/v1/recurso').expect(401);
   });
   ```

### ❌ DON'T (Não Faça)

1. **❌ Nunca use banco de desenvolvimento**

   ```typescript
   // ERRADO!
   DB_DATABASE = erplab_db; // Vai apagar seus dados!
   ```

2. **❌ Não execute testes E2E em paralelo**

   ```bash
   # ERRADO - causa conflitos de ENUM
   jest --config ./test/jest-e2e.json

   # CORRETO
   jest --config ./test/jest-e2e.json --runInBand
   ```

3. **❌ Não esqueça o prefixo global**

   ```typescript
   // ERRADO
   .get('/usuarios')

   // CORRETO
   .get('/api/v1/usuarios')
   ```

4. **❌ Não faça chamadas externas reais**
   ```typescript
   // Use mocks para APIs externas
   jest.mock('../services/external-api.service');
   ```

## Módulos com Testes E2E

### ✅ Completos (100%)

1. **auth** - Autenticação e autorização
2. **usuarios** - CRUD de usuários
3. **contas-pagar/centro-custo** - Centros de custo

### ⚠️ Parciais (< 100%)

1. **contas-pagar/conta-pagar** - 38% (5/13)
2. **contas-pagar/repasse** - Não executado

### ❌ Pendentes (0%)

- agendas
- atendimento
- auditoria
- common
- convenios
- empresas
- exames
- financeiro
- formularios
- fornecedores
- integracoes
- kits
- laboratorios
- metodos
- pacientes
- prestadores-servico
- profissionais
- telemedicina
- unidade-saude

## Troubleshooting

### Erro: "duplicate key value violates unique constraint pg_type_typname_nsp_index"

**Causa:** Múltiplos testes criando ENUMs ao mesmo tempo.

**Solução:** Usar `--runInBand` para executar sequencialmente:

```bash
npm run test:e2e
```

### Erro: "expected 201, got 404"

**Causa:** Faltou aplicar o prefixo global da API.

**Solução:** Adicionar no beforeAll:

```typescript
app.setGlobalPrefix('api/v1');
```

### Erro: "QueryFailedError: relation does not exist"

**Causa:** Migrations não executadas no banco de teste.

**Solução:**

```bash
NODE_ENV=test npm run migration:run
```

### Testes muito lentos

**Causa:** Múltiplas conexões de banco ou testes em paralelo.

**Solução:** Já está configurado com `--runInBand` no package.json.

### Banco de desenvolvimento foi apagado!

**Causa:** Executou testes sem configurar `.env.test`.

**Solução preventiva:** O arquivo `test/setup-e2e.ts` valida isso automaticamente.

**Recuperação:**

```bash
npm run migration:run
npm run seed  # Se houver seeders
```

## Scripts Úteis

```bash
# Criar banco de teste
./scripts/create-test-db.sh

# Recriar banco de teste do zero
psql -U nestuser -c "DROP DATABASE IF EXISTS erplab_db_test;"
psql -U nestuser -c "CREATE DATABASE erplab_db_test;"
NODE_ENV=test npm run migration:run

# Ver logs detalhados dos testes
DEBUG=* npm run test:e2e

# Verificar conexões abertas
npm run test:e2e -- --detectOpenHandles
```

## Próximos Passos

1. Criar testes E2E para todos os módulos pendentes
2. Aumentar cobertura dos testes parciais (conta-pagar, repasse)
3. Adicionar testes de integração entre módulos
4. Configurar CI/CD para executar testes automaticamente
5. Adicionar métricas de performance nos testes

## Recursos

- [NestJS Testing](https://docs.nestjs.com/fundamentals/testing)
- [Supertest](https://github.com/visionmedia/supertest)
- [Jest E2E](https://jestjs.io/docs/tutorial-react)
- [TypeORM Testing](https://typeorm.io/testing)
