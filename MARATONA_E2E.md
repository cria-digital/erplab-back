# 🏃‍♂️ MARATONA E2E - Plano de Execução

**Objetivo:** Criar testes E2E para TODOS os módulos do sistema
**Meta:** 100% dos módulos com E2E básico
**Banco de Teste:** erplab_db_test ✅

## 📊 Status Atual

```
✅ Completos: 2/22 módulos (9%)
🔄 Em Progresso: 3/22 módulos (14%)
❌ Pendentes: 17/22 módulos (77%)

Total de Testes E2E: 48 passando / 86 totais (56%)
```

## 🎯 Checklist de Módulos

### ✅ Completos (2)

- [x] **auth** - 11/11 testes (5 skipped)
- [x] **contas-pagar/centro-custo** - 14/14 testes

### 🔄 Parcialmente Completos (3)

- [ ] **usuarios** - ~50% completo
- [ ] **contas-pagar/conta-pagar** - 5/13 testes
- [ ] **contas-pagar/repasse** - parcial

### ❌ Pendentes - Prioridade ALTA (8)

- [ ] **pacientes**
- [ ] **exames**
- [ ] **unidade-saude**
- [ ] **empresas**
- [ ] **convenios**
- [ ] **profissionais**
- [ ] **agendas**
- [ ] **atendimento**

### ❌ Pendentes - Prioridade MÉDIA (5)

- [ ] **laboratorios**
- [ ] **telemedicina**
- [ ] **prestadores-servico**
- [ ] **fornecedores**
- [ ] **financeiro**

### ❌ Pendentes - Prioridade BAIXA (4)

- [ ] **auditoria** (somente leitura)
- [ ] **common** (APIs auxiliares)
- [ ] **kits**
- [ ] **integracoes**

## 📋 Template Base para E2E

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { DataSource } from 'typeorm';

describe('[ModuleName]Controller (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let authToken: string;
  let entityId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
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
    await dataSource.synchronize(true);

    // Setup: Criar usuário e fazer login
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

  // ==================== POST ====================
  describe('/resource (POST)', () => {
    it('deve criar novo recurso', () => {
      return request(app.getHttpServer())
        .post('/api/v1/resource')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          campo1: 'valor1',
          campo2: 'valor2',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          entityId = res.body.id;
        });
    });

    it('deve validar campos obrigatórios', () => {
      return request(app.getHttpServer())
        .post('/api/v1/resource')
        .set('Authorization', `Bearer ${authToken}`)
        .send({})
        .expect(400);
    });

    it('deve falhar sem autenticação', () => {
      return request(app.getHttpServer())
        .post('/api/v1/resource')
        .send({ campo1: 'valor' })
        .expect(401);
    });
  });

  // ==================== GET ====================
  describe('/resource (GET)', () => {
    it('deve listar todos os recursos', () => {
      return request(app.getHttpServer())
        .get('/api/v1/resource')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });
  });

  describe('/resource/:id (GET)', () => {
    it('deve buscar recurso por ID', () => {
      return request(app.getHttpServer())
        .get(`/api/v1/resource/${entityId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(entityId);
        });
    });

    it('deve retornar 404 para ID inexistente', () => {
      return request(app.getHttpServer())
        .get('/api/v1/resource/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });

  // ==================== PATCH ====================
  describe('/resource/:id (PATCH)', () => {
    it('deve atualizar recurso', () => {
      return request(app.getHttpServer())
        .patch(`/api/v1/resource/${entityId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ campo1: 'novo valor' })
        .expect(200);
    });
  });

  // ==================== DELETE ====================
  describe('/resource/:id (DELETE)', () => {
    it('deve remover recurso', async () => {
      const createRes = await request(app.getHttpServer())
        .post('/api/v1/resource')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ campo1: 'para deletar' });

      await request(app.getHttpServer())
        .delete(`/api/v1/resource/${createRes.body.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(204);
    });

    it('deve retornar 404 ao deletar ID inexistente', () => {
      return request(app.getHttpServer())
        .delete('/api/v1/resource/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });
});
```

## 🎯 Estratégia de Execução

### Fase 1: CRUD Básico (1 dia)

**Meta:** 8 módulos com CRUD básico

1. ✅ pacientes
2. ✅ exames
3. ✅ unidade-saude
4. ✅ empresas
5. ✅ profissionais
6. ✅ fornecedores
7. ✅ kits
8. ✅ agendas

### Fase 2: Módulos Complexos (2 dias)

**Meta:** 6 módulos com lógica de negócio

1. ✅ convenios (com relacionamentos)
2. ✅ laboratorios (com integrações)
3. ✅ telemedicina (com vínculos)
4. ✅ prestadores-servico (com categorias)
5. ✅ financeiro (contas bancárias, planos)
6. ✅ atendimento (fluxo completo)

### Fase 3: Correção e Refinamento (1 dia)

**Meta:** Corrigir módulos parciais

1. ✅ usuarios (completar testes)
2. ✅ conta-pagar (ajustar dependências)
3. ✅ repasse (ajustar dependências)
4. ✅ Executar todos e garantir > 80% passando

## 📝 Checklist por Módulo

Para cada módulo, criar testes para:

### CRUD Essencial (Mínimo)

- [ ] POST - Criar entidade
- [ ] POST - Validar campos obrigatórios
- [ ] POST - Falhar sem autenticação
- [ ] GET (lista) - Listar todas
- [ ] GET (id) - Buscar por ID
- [ ] GET (id) - Retornar 404
- [ ] PATCH - Atualizar
- [ ] DELETE - Remover
- [ ] DELETE - Retornar 404

### Funcionalidades Específicas (Opcional)

- [ ] Filtros e buscas
- [ ] Relacionamentos
- [ ] Validações de negócio
- [ ] Toggle status/ativo
- [ ] Soft delete

## 🚀 Comandos Úteis

```bash
# Criar novo teste E2E
touch test/[modulo]/[modulo].e2e-spec.ts

# Executar teste específico
npm run test:e2e test/[modulo]/[modulo].e2e-spec.ts

# Executar todos os testes E2E
npm run test:e2e

# Ver apenas summary
npm run test:e2e | grep "Tests:"

# Listar módulos sem E2E
find src/modules -name "*.controller.ts" | sed 's/.*modules\///' | sed 's/\/.*controller.*//' | sort -u > /tmp/all_modules.txt
find test -name "*.e2e-spec.ts" | sed 's/test\///' | sed 's/\/.*//' | sort -u > /tmp/tested_modules.txt
comm -23 /tmp/all_modules.txt /tmp/tested_modules.txt
```

## 📊 Métricas de Sucesso

### Objetivo Mínimo (MVP)

- ✅ 22 módulos com E2E
- ✅ Mínimo 5 testes por módulo
- ✅ 70% de taxa de sucesso

### Objetivo Ideal (Completo)

- ✅ 22 módulos com E2E
- ✅ Média de 10 testes por módulo
- ✅ 90% de taxa de sucesso
- ✅ Cobertura de casos de erro
- ✅ Testes de relacionamentos

## 🎓 Padrões e Boas Práticas

### ✅ DO (Faça)

1. **Use beforeAll para setup**

   ```typescript
   beforeAll(async () => {
     // Setup uma vez para todos os testes
   });
   ```

2. **Crie entidades necessárias no beforeAll**

   ```typescript
   const unidade = await criarUnidade();
   const empresa = await criarEmpresa();
   ```

3. **Sempre teste autenticação**

   ```typescript
   it('deve falhar sem autenticação', () => {
     return request(app.getHttpServer()).post('/api/v1/recurso').expect(401);
   });
   ```

4. **Teste validações**

   ```typescript
   it('deve validar campos obrigatórios', () => {
     return request(app.getHttpServer())
       .post('/api/v1/recurso')
       .send({}) // Sem dados
       .expect(400);
   });
   ```

5. **Use .skip() para testes não implementados**
   ```typescript
   it.skip('deve testar funcionalidade futura', () => {
     // Implementar depois
   });
   ```

### ❌ DON'T (Não Faça)

1. **❌ Não use banco de produção**
2. **❌ Não crie muitas entidades desnecessárias**
3. **❌ Não esqueça o setGlobalPrefix('api/v1')**
4. **❌ Não teste implementações internas**
5. **❌ Não deixe testes interdependentes**

## 📅 Cronograma Sugerido

### Dia 1 (8h) - CRUD Básico

- **Manhã (4h):** pacientes, exames, unidade-saude, empresas
- **Tarde (4h):** profissionais, fornecedores, kits, agendas

### Dia 2 (8h) - Módulos Médios

- **Manhã (4h):** convenios, laboratorios, telemedicina
- **Tarde (4h):** prestadores-servico, financeiro, atendimento

### Dia 3 (4h) - Finalização

- **Manhã (2h):** Corrigir usuarios, conta-pagar, repasse
- **Tarde (2h):** Executar todos, corrigir falhas, documentar

## 🎯 Meta Final

```
Total de Módulos: 22
Módulos com E2E: 22 (100%)
Total de Testes: ~200+ testes
Taxa de Sucesso: 85%+
Suites Passando: 18+ (80%+)
```

## 📝 Registro de Progresso

Atualizar após cada módulo completo:

```markdown
### [Data] - [Módulo]

- ✅ Testes criados: X testes
- ✅ Testes passando: X/X
- ⏱️ Tempo gasto: Xh
- 📝 Observações: ...
```

---

**Vamos começar! 🚀**

**Próximo módulo:** [Escolha um da lista de pendentes]
