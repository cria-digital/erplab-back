# 🧪 Setup de Testes E2E - Instruções Rápidas

## ⚠️ IMPORTANTE: Segurança dos Dados

Os testes E2E **APAGAM TODOS OS DADOS** do banco a cada execução via `synchronize(true)`.

**Por isso, é OBRIGATÓRIO usar um banco de dados separado para testes!**

## 🚀 Setup Rápido (3 passos)

### 1. Criar Banco de Dados de Teste

**Opção A: Via Docker (se estiver usando Docker)**

```bash
docker exec -it postgres_container psql -U nestuser -c "CREATE DATABASE erplab_db_test;"
```

**Opção B: Via psql local**

```bash
psql -U nestuser -h localhost -c "CREATE DATABASE erplab_db_test;"
# Senha: nestpass
```

**Opção C: Via pgAdmin ou DBeaver**

1. Conecte no servidor PostgreSQL
2. Clique direito em "Databases" → "Create" → "Database"
3. Nome: `erplab_db_test`
4. Owner: `nestuser`

### 2. Executar Migrations no Banco de Teste

```bash
NODE_ENV=test npm run migration:run
```

### 3. Executar os Testes

```bash
npm run test:e2e
```

## ✅ Validação

Se tudo estiver correto, você verá:

```
🧪 Configuração de Teste E2E
================================
📦 Banco de Dados: erplab_db_test
🌍 Ambiente: test
================================
```

## 🚨 Erros Comuns

### Erro: "database erplab_db_test does not exist"

**Solução:** Execute o passo 1 (criar banco)

### Erro: "relation does not exist"

**Solução:** Execute o passo 2 (migrations)

### Aviso: "O nome do banco não contém 'test'"

**Solução:** Verifique se o `.env.test` tem `DB_DATABASE=erplab_db_test`

### Erro: "Tentando usar banco de PRODUÇÃO em testes!"

**Solução:** O sistema detectou que você está tentando usar `erplab_db` em testes.
Configure corretamente o `.env.test` com `DB_DATABASE=erplab_db_test`

## 📚 Documentação Completa

Para mais detalhes, consulte: [TESTES-E2E.md](./TESTES-E2E.md)
