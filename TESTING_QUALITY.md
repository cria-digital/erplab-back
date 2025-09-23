# 🛡️ Guia de Testes e Garantia de Qualidade - ERP Lab Backend

## 📋 Sumário

1. [Estratégia de Testes](#estratégia-de-testes)
2. [Tipos de Testes](#tipos-de-testes)
3. [Como Executar Testes](#como-executar-testes)
4. [Hooks e Automação](#hooks-e-automação)
5. [Pipeline CI/CD](#pipeline-cicd)
6. [Padrões de Qualidade](#padrões-de-qualidade)
7. [Checklist para Novas Features](#checklist-para-novas-features)

## 🎯 Estratégia de Testes

Nossa estratégia de testes segue a pirâmide de testes:

```
         /\
        /  \    E2E Tests (10%)
       /    \
      /------\  Integration Tests (30%)
     /        \
    /----------\ Unit Tests (60%)
```

### Objetivos

- ✅ **Prevenir Regressões**: Garantir que novas mudanças não quebrem funcionalidades existentes
- ✅ **Manter Qualidade**: Código testado e documentado
- ✅ **Feedback Rápido**: Detectar problemas antes do deploy
- ✅ **Confiança**: Permitir refatorações sem medo

## 🧪 Tipos de Testes

### 1. Testes Unitários

Testam componentes isoladamente (services, controllers, utils).

**Localização**: `src/**/*.spec.ts`

**Exemplo**:

```typescript
// auth.service.spec.ts
describe('AuthService', () => {
  it('deve validar usuário com credenciais corretas', async () => {
    // Arrange
    const email = 'test@example.com';
    const password = 'Test123!';

    // Act
    const result = await service.validateUser(email, password);

    // Assert
    expect(result).toBeDefined();
    expect(result.email).toBe(email);
  });
});
```

### 2. Testes de Integração (E2E)

Testam fluxos completos da aplicação.

**Localização**: `test/**/*.e2e-spec.ts`

**Exemplo**:

```typescript
// auth.e2e-spec.ts
describe('AuthController (e2e)', () => {
  it('deve fazer login com credenciais válidas', () => {
    return request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: 'user@example.com', password: 'Pass123!' })
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('access_token');
      });
  });
});
```

### 3. Testes de Contrato

Garantem que APIs mantêm contratos esperados.

**Ferramentas**: OpenAPI/Swagger validation

## 🚀 Como Executar Testes

### Comandos Básicos

```bash
# Executar todos os testes unitários
npm test

# Executar testes em modo watch (desenvolvimento)
npm run test:watch

# Executar testes com coverage
npm run test:cov

# Executar testes E2E
npm run test:e2e

# Executar teste específico
npm test -- auth.service.spec.ts

# Executar testes com debug
npm run test:debug
```

### Configuração do Ambiente de Testes

```bash
# Criar arquivo .env.test
cp .env.example .env.test

# Configurar banco de testes
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=erplab_test
DB_PASSWORD=erplab_test
DB_DATABASE=erplab_test
```

## 🔧 Hooks e Automação

### Pre-commit Hooks (Husky)

Automaticamente executados antes de cada commit:

1. **Lint**: Verifica padrões de código
2. **Format**: Formata código com Prettier
3. **Build**: Verifica erros de TypeScript
4. **Test**: Executa testes relacionados aos arquivos modificados

### Configuração Manual do Husky

```bash
# Instalar Husky
npm install --save-dev husky

# Inicializar Husky
npx husky-init

# Adicionar hook de pre-commit
npx husky add .husky/pre-commit "npm run pre-commit"

# Adicionar hook de pre-push
npx husky add .husky/pre-push "npm test"
```

## 📦 Pipeline CI/CD

### GitHub Actions

O pipeline é executado automaticamente em:

- Push para `main` ou `develop`
- Abertura de Pull Requests

### Etapas do Pipeline

1. **Lint & Format** ✅
   - Verifica padrões de código
   - Formata automaticamente

2. **Build** 🔨
   - Compila TypeScript
   - Verifica erros de tipo

3. **Testes** 🧪
   - Executa testes unitários
   - Executa testes E2E
   - Gera relatório de cobertura

4. **Security Audit** 🔒
   - Verifica vulnerabilidades em dependências
   - Análise de segurança do código

5. **Code Quality** 📊
   - SonarCloud analysis
   - Métricas de qualidade

6. **Deploy** 🚀
   - Deploy automático para staging (branch develop)
   - Deploy manual para produção (branch main)

## 📏 Padrões de Qualidade

### Métricas Mínimas

- **Cobertura de Código**: >= 80%
- **Cobertura de Branches**: >= 75%
- **Complexidade Ciclomática**: <= 10
- **Duplicação de Código**: < 3%

### Regras de Lint

```javascript
// .eslintrc.js principais regras
{
  "no-unused-vars": "error",
  "no-console": "warn",
  "prefer-const": "error",
  "@typescript-eslint/explicit-function-return-type": "warn"
}
```

## ✅ Checklist para Novas Features

### Antes de Começar

- [ ] Entender requisitos completamente
- [ ] Verificar se existe código similar que pode ser reutilizado
- [ ] Planejar estrutura e testes

### Durante o Desenvolvimento

- [ ] Escrever testes ANTES do código (TDD)
- [ ] Seguir padrões estabelecidos do projeto
- [ ] Documentar código complexo
- [ ] Usar DTOs para validação de entrada

### Antes do Commit

- [ ] Executar `npm run lint`
- [ ] Executar `npm run build`
- [ ] Executar `npm test`
- [ ] Verificar cobertura de testes
- [ ] Revisar mudanças (`git diff`)

### Antes do Push

- [ ] Todos os testes passando
- [ ] Sem warnings do lint
- [ ] Build funcionando
- [ ] Documentação atualizada
- [ ] CLAUDE.md atualizado (se necessário)

## 🔍 Debugging de Testes

### VSCode Launch Configuration

```json
{
  "type": "node",
  "request": "launch",
  "name": "Debug Jest Tests",
  "program": "${workspaceFolder}/node_modules/.bin/jest",
  "args": ["--runInBand", "--coverage=false"],
  "console": "integratedTerminal",
  "internalConsoleOptions": "neverOpen"
}
```

### Comandos Úteis

```bash
# Ver apenas testes que falharam
npm test -- --onlyFailures

# Executar teste específico por nome
npm test -- -t "deve validar usuário"

# Ver detalhes de cobertura
npm run test:cov -- --verbose

# Limpar cache de testes
npx jest --clearCache
```

## 📈 Monitoramento de Qualidade

### Ferramentas Recomendadas

- **SonarCloud**: Análise estática de código
- **Codecov**: Relatórios de cobertura
- **Snyk**: Segurança de dependências
- **Dependabot**: Atualizações automáticas

### Badges de Status

Adicione ao README.md:

```markdown
![Build Status](https://github.com/seu-usuario/erplab/workflows/CI/badge.svg)
![Coverage](https://codecov.io/gh/seu-usuario/erplab/branch/main/graph/badge.svg)
![Security](https://snyk.io/test/github/seu-usuario/erplab/badge.svg)
```

## 🚨 Troubleshooting

### Problema: Testes falhando localmente mas passando no CI

**Solução**: Limpar cache e reinstalar dependências

```bash
rm -rf node_modules dist
npm ci
npm run build
npm test
```

### Problema: Timeout em testes E2E

**Solução**: Aumentar timeout no jest.config.js

```javascript
testTimeout: 30000; // 30 segundos
```

### Problema: Banco de testes não conecta

**Solução**: Verificar se PostgreSQL está rodando

```bash
docker-compose up -d postgres-test
```

## 📚 Recursos Adicionais

### Documentação

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [NestJS Testing](https://docs.nestjs.com/fundamentals/testing)
- [Supertest](https://github.com/visionmedia/supertest)

### Boas Práticas

- [Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)
- [NestJS Testing Best Practices](https://docs.nestjs.com/fundamentals/testing#best-practices)

## 🎯 Próximos Passos

1. **Aumentar Cobertura**: Adicionar testes para módulos não cobertos
2. **Testes de Performance**: Implementar testes de carga com Artillery
3. **Testes de Mutação**: Adicionar Stryker para mutation testing
4. **Documentação de API**: Testes automáticos de contrato OpenAPI
5. **Monitoring**: Adicionar APM (Application Performance Monitoring)

---

**Lembre-se**: Testes não são custos, são investimentos em qualidade e manutenibilidade! 🚀
