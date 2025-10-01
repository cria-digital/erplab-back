# 📊 Guia Unificado de Testes - ERP Lab Backend

## 🎯 Visão Geral

Este documento unifica toda a estratégia de testes do sistema ERP Lab Backend, consolidando planos de execução, cobertura e qualidade em um único guia completo.

## 📈 Status Atual da Cobertura

**Data:** Janeiro 2025
**Cobertura Geral:** ~60% (estimado)
**Meta:** 85% de cobertura total

### Dashboard de Progresso por Módulo

| Módulo            | Unit Tests      | E2E Tests   | Cobertura | Prioridade | Observações                               |
| ----------------- | --------------- | ----------- | --------- | ---------- | ----------------------------------------- |
| **Auth**          | ✅ Completo     | ✅ 11/11    | 88%       | 🔴 Crítica | Service ✅ Controller ✅ E2E ✅ Guards ✅ |
| **Centro Custo**  | ✅ Completo     | ✅ 14/14    | 100%      | 🔴 Crítica | E2E 100% - Referência de qualidade        |
| **Usuários**      | ✅ Completo     | ⚠️ Parcial  | 84%       | 🔴 Crítica | 32 service + 13 controller                |
| **Pacientes**     | ✅ Completo     | ❌ Pendente | 89.79%    | 🔴 Crítica | Service ✅ Controller ✅ DTO ✅           |
| **Exames**        | ✅ Completo     | ❌ Pendente | 93.48%    | 🔴 Crítica | 100% em todos os arquivos                 |
| **Unidade Saúde** | ✅ Completo     | ❌ Pendente | 77.94%    | 🟡 Alta    | Service 78% Controller 100%               |
| **Empresas**      | ✅ Completo     | ❌ Pendente | 90%+      | 🟡 Alta    | 35 service + 19 controller                |
| **Convênios**     | ✅ Completo     | ❌ Pendente | 90%+      | 🟡 Alta    | 42 service + 30 controller                |
| **Laboratórios**  | ✅ Completo     | ❌ Pendente | 90%+      | 🟡 Alta    | 37 service + 34 controller                |
| **Telemedicina**  | ✅ Completo     | ❌ Pendente | 95%+      | 🟡 Alta    | 116 testes totais                         |
| **Prestadores**   | ✅ Completo     | ❌ Pendente | 95%+      | 🟢 Média   | 139 testes totais                         |
| **Conta Pagar**   | ✅ Completo     | ⚠️ 5/13     | 90%+      | 🔴 Crítica | E2E precisa ajustes                       |
| **Repasse**       | ✅ Completo     | ⚠️ Parcial  | 90%+      | 🔴 Crítica | E2E precisa ajustes                       |
| **Auditoria**     | ✅ Completo     | ❌ Pendente | 88.03%    | 🟡 Alta    | Service 90% Controller 100%               |
| **Agendas**       | 🔄 Em Progresso | ❌ Pendente | ~20%      | 🟢 Média   | Controller ✅ Service 🔄                  |
| **Atendimento**   | ❌ Pendente     | ❌ Pendente | 0%        | 🟡 Alta    | -                                         |
| **Fornecedores**  | ❌ Pendente     | ❌ Pendente | 0%        | 🟢 Média   | -                                         |
| **Profissionais** | ❌ Pendente     | ❌ Pendente | 0%        | 🟢 Média   | -                                         |
| **Financeiro**    | ✅ Completo     | ❌ Pendente | 85%+      | 🟡 Alta    | Contas, Bancos, Planos                    |
| **Common**        | ❌ Pendente     | ❌ Pendente | 0%        | 🔵 Baixa   | CEP, CNAE                                 |
| **Kits**          | ❌ Pendente     | ❌ Pendente | 0%        | 🔵 Baixa   | -                                         |
| **Integracoes**   | ❌ Pendente     | ❌ Pendente | 0%        | 🔵 Baixa   | -                                         |

**📊 Estatísticas E2E:**

- ✅ Completos: 2/22 (9%)
- ⚠️ Parciais: 3/22 (14%)
- ❌ Pendentes: 17/22 (77%)
- 🎯 **Meta: 22/22 completos**

**🚀 Maratona E2E:** Ver [MARATONA_E2E.md](./MARATONA_E2E.md) para plano de execução

## 🎯 Estratégia de Testes

### Pirâmide de Testes

```
         /\
        /  \    E2E Tests (10%)
       /    \   - Fluxos completos
      /------\  Integration Tests (30%)
     /        \ - Integração entre módulos
    /----------\ Unit Tests (60%)
                - Services, Controllers, Utils
```

### Objetivos Principais

1. **Prevenir Regressões**: Garantir que novas mudanças não quebrem funcionalidades
2. **Manter Qualidade**: Código testado seguindo TDD
3. **Feedback Rápido**: Detectar problemas antes do deploy
4. **Cobertura 100%**: Meta obrigatória para todos os módulos

## 🚀 Comandos de Execução

### Comandos Básicos

```bash
# Executar todos os testes
npm test

# Testes em modo watch (desenvolvimento)
npm run test:watch

# Testes com cobertura
npm run test:cov

# Testes E2E
npm run test:e2e

# Teste específico
npm test -- auth.service.spec.ts

# Limpar cache
npx jest --clearCache
```

### Pipeline de Qualidade Obrigatório

**SEMPRE** executar após criar/modificar código:

```bash
npm run build && npm run lint && npm test
```

## 📝 Padrões de Desenvolvimento TDD

### 1. Ciclo Red-Green-Refactor

```typescript
// 1. RED - Escrever teste que falha
describe('NovoService', () => {
  it('deve executar operação com sucesso', async () => {
    // Arrange
    const input = { campo: 'valor' };

    // Act
    const result = await service.executar(input);

    // Assert
    expect(result).toBeDefined();
    expect(result.status).toBe('sucesso');
  });
});

// 2. GREEN - Implementar código mínimo para passar
async executar(input: Dto): Promise<Result> {
  return { status: 'sucesso' };
}

// 3. REFACTOR - Melhorar código mantendo testes verdes
```

### 2. Estrutura de Teste Padrão

```typescript
describe('ModuloService', () => {
  let service: ModuloService;
  let repository: Repository<Entidade>;

  // Mock do repository
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

  // Testes organizados por método
  describe('create', () => {
    it('deve criar com dados válidos', async () => {
      // Teste de sucesso
    });

    it('deve falhar com dados inválidos', async () => {
      // Teste de erro
    });

    it('deve tratar duplicação', async () => {
      // Teste de conflito
    });
  });

  // Mais grupos de testes...
});
```

## 📊 Métricas de Qualidade

### Métricas Obrigatórias

| Métrica                      | Mínimo | Atual | Status |
| ---------------------------- | ------ | ----- | ------ |
| **Cobertura de Statements**  | 85%    | ~60%  | ⚠️     |
| **Cobertura de Branches**    | 75%    | ~50%  | ⚠️     |
| **Cobertura de Functions**   | 85%    | ~55%  | ⚠️     |
| **Cobertura de Lines**       | 85%    | ~60%  | ⚠️     |
| **Complexidade Ciclomática** | ≤10    | ✅    | ✅     |
| **Duplicação de Código**     | <3%    | ✅    | ✅     |

## 🔧 Casos de Teste por Tipo

### Service Tests - Casos Obrigatórios

```typescript
// CRUD Completo
- create()
  ✅ Criar com dados válidos
  ✅ Validação de campos obrigatórios
  ✅ Tratamento de duplicação
  ✅ Transação com rollback em erro

- findAll()
  ✅ Listar com paginação
  ✅ Filtros por múltiplos campos
  ✅ Ordenação
  ✅ Lista vazia

- findOne()
  ✅ Buscar existente
  ✅ Não encontrado (NotFoundException)
  ✅ ID inválido

- update()
  ✅ Atualizar campos permitidos
  ✅ Não encontrado
  ✅ Validação de dados
  ✅ Conflito de unicidade

- remove()
  ✅ Soft delete (preferencial)
  ✅ Hard delete quando aplicável
  ✅ Não encontrado
  ✅ Verificar dependências

// Métodos de Negócio
- validações específicas
- cálculos e agregações
- integrações com outros módulos
- tratamento de erros de negócio
```

### Controller Tests - Casos Obrigatórios

```typescript
// Endpoints REST
- POST /
  ✅ Status 201 com dados válidos
  ✅ Status 400 com dados inválidos
  ✅ Status 409 em conflito

- GET /
  ✅ Status 200 com lista
  ✅ Paginação funcionando
  ✅ Filtros aplicados

- GET /:id
  ✅ Status 200 quando existe
  ✅ Status 404 quando não existe

- PATCH /:id
  ✅ Status 200 com sucesso
  ✅ Status 404 não encontrado
  ✅ Status 400 dados inválidos

- DELETE /:id
  ✅ Status 200/204 com sucesso
  ✅ Status 404 não encontrado

// Validações
  ✅ Guards funcionando
  ✅ Pipes de validação
  ✅ Interceptors aplicados
```

### E2E Tests - Fluxos Completos

```typescript
// Fluxo de Autenticação
✅ Registro → Login → Token → Acesso autorizado
✅ Token expirado → Refresh → Novo token
✅ Logout → Token invalidado

// Fluxo de Negócio
✅ Criar paciente → Agendar → Atender → Resultado
✅ Criar OS → Adicionar exames → Faturar → Pagar
✅ Importar dados → Processar → Validar → Confirmar
```

## 📋 Checklist de Implementação

### Para Cada Novo Módulo

- [ ] **Análise**
  - [ ] Entender requisitos completos
  - [ ] Identificar dependências
  - [ ] Definir interfaces e contratos

- [ ] **Design dos Testes**
  - [ ] Listar todos os casos (happy path, edge, errors)
  - [ ] Criar estrutura de mocks
  - [ ] Planejar dados de teste

- [ ] **Implementação TDD**
  - [ ] RED: Escrever teste que falha
  - [ ] GREEN: Código mínimo para passar
  - [ ] REFACTOR: Melhorar mantendo verde

- [ ] **Validação**
  - [ ] `npm run build` - Sem erros TypeScript
  - [ ] `npm run lint` - Sem warnings
  - [ ] `npm test` - 100% passando
  - [ ] `npm run test:cov` - Cobertura >= 85%

- [ ] **Documentação**
  - [ ] JSDoc nos métodos públicos
  - [ ] Swagger/OpenAPI atualizado
  - [ ] Arquivos .http para testes manuais

## 🚨 Troubleshooting

### Problemas Comuns

**Testes falhando após merge**

```bash
rm -rf node_modules dist
npm ci
npm run build
npm test
```

**Timeout em testes**

```typescript
// jest.config.js
testTimeout: 30000; // 30 segundos
```

**Mock não funcionando**

```typescript
// Limpar mocks entre testes
afterEach(() => {
  jest.clearAllMocks();
  jest.restoreAllMocks();
});
```

## 🎯 Plano de Ação Imediato

### Prioridade 1 - Esta Sessão

1. ✅ Completar testes do módulo Agendas
2. ⏳ Criar testes do módulo Atendimento
3. ⏳ Validar cobertura geral

### Prioridade 2 - Próximas 24h

1. Módulo Fornecedores
2. Módulo Profissionais
3. Módulo Common (CEP/CNAE)

### Prioridade 3 - Esta Semana

1. Módulo Email
2. Módulo Kits
3. Testes E2E dos fluxos principais
4. Atingir 85% de cobertura total

## 📚 Scripts de Automação

### Gerar Template de Teste

```bash
#!/bin/bash
# generate-test.sh
MODULE=$1
TYPE=$2 # service, controller, e2e

npm run generate:test -- $MODULE $TYPE
```

### Verificar Cobertura por Módulo

```bash
npm run test:cov -- --collectCoverageFrom="src/modules/$MODULE/**/*.ts"
```

### Pipeline Completo de Validação

```bash
#!/bin/bash
# validate-all.sh
echo "🔨 Building..."
npm run build || exit 1

echo "🔍 Linting..."
npm run lint || exit 1

echo "🧪 Testing..."
npm test || exit 1

echo "📊 Coverage..."
npm run test:cov

echo "✅ All checks passed!"
```

## 🏆 Critérios de Conclusão

Um módulo é considerado **COMPLETO** quando:

✅ Service com cobertura >= 85%
✅ Controller com cobertura >= 85%
✅ DTOs com validações testadas
✅ E2E cobrindo fluxo principal
✅ Sem testes falhando
✅ Build e lint passando
✅ Documentação atualizada

---

**Última Atualização**: Janeiro 2025
**Responsável**: Sistema de Testes Automatizados
**Meta Final**: 85% de cobertura total até final da semana

💡 **Lembre-se**: TDD não é custo, é investimento em qualidade!
