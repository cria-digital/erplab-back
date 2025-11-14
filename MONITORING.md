# 📊 Sistema de Monitoramento de Performance

## Visão Geral

Sistema completo de monitoramento implementado para identificar gargalos de CPU e performance na aplicação.

**Data de Implementação:** 2025-11-13
**Motivo:** Alto consumo de CPU reportado em produção após último deploy

---

## 🎯 Endpoints de Monitoramento

### 1. Métricas Detalhadas do Sistema

```http
GET /api/v1/health/metrics
```

**Retorna:**

- **CPU:** Uso em ms e load average (1, 5, 15 minutos)
- **Memória:** Usado, total, percentual, heap usado/total (em MB)
- **Uptime:** Tempo online em segundos
- **Requests:** Total, duração média, quantidade de requests lentos, últimos 50 requests

**Exemplo de resposta:**

```json
{
  "cpu": {
    "usage": 1234.56,
    "loadAverage": [0.5, 0.3, 0.2]
  },
  "memory": {
    "used": 512,
    "total": 2048,
    "percentage": 25,
    "heapUsed": 120,
    "heapTotal": 256
  },
  "uptime": 3600,
  "requests": {
    "total": 1542,
    "avgDuration": 245,
    "slowRequests": 12,
    "recentRequests": [...]
  }
}
```

---

### 2. Requests Lentos (> 1000ms)

```http
GET /api/v1/health/metrics/slow-requests
```

Lista os **50 requests mais lentos** para identificar gargalos específicos.

**Exemplo de resposta:**

```json
[
  {
    "method": "GET",
    "url": "/api/v1/cadastros/empresas/cnpj/12345678901234",
    "duration": 2543,
    "statusCode": 200,
    "ip": "192.168.1.10",
    "timestamp": "2025-11-13T12:34:56.789Z"
  }
]
```

**Use para:** Identificar requisições específicas que estão demorando muito.

---

### 3. Endpoints Mais Lentos (Agrupados)

```http
GET /api/v1/health/metrics/slowest-endpoints
```

Lista os **10 endpoints com maior tempo médio** de resposta (agrupados por URL).

**Exemplo de resposta:**

```json
[
  {
    "url": "/api/v1/cadastros/empresas/cnpj/:cnpj",
    "count": 45,
    "avgDuration": 1823,
    "maxDuration": 3241
  }
]
```

**Use para:** Identificar quais endpoints precisam de otimização.

---

### 4. Endpoints Mais Chamados

```http
GET /api/v1/health/metrics/most-called
```

Lista os **10 endpoints com mais requisições**.

**Exemplo de resposta:**

```json
[
  {
    "url": "/api/v1/health",
    "count": 1542
  }
]
```

**Use para:** Identificar endpoints que precisam de cache ou rate limiting.

---

### 5. Atividade em Background ⭐ NOVO

```http
GET /api/v1/health/metrics/background-activity
```

Mostra **processos em background ativos** e tempo de inatividade. **CRUCIAL para diagnosticar CPU alto sem requests!**

**Exemplo de resposta:**

```json
{
  "timers": 2,
  "activeHandles": 15,
  "eventLoopDelay": 0,
  "lastActivity": "2025-11-13T12:34:56.789Z",
  "inactivitySeconds": 320
}
```

**O que significam os valores:**

- `timers`: Número de timers/intervals ativos (setInterval, setTimeout não finalizados)
- `activeHandles`: Conexões de banco, files abertos, sockets, etc
- `inactivitySeconds`: Quantos segundos desde o último request

**🚨 ALERTAS:**

- `inactivitySeconds > 300` + `activeHandles > 10` → **Provável processo em background consumindo CPU**
- `timers > 5` → **Possível setInterval esquecido ou em loop**

**Use para:** Diagnosticar CPU alto MESMO SEM requests (o seu caso!)

---

## 🔍 Como Diagnosticar Problemas de CPU

### 🚀 DIAGNÓSTICO RÁPIDO (RECOMENDADO)

```bash
./diagnose-cpu.sh
```

Este script automaticamente:

1. ✅ Verifica se container está rodando
2. ✅ Detecta crash loops (restarts múltiplos)
3. ✅ Mostra CPU e memória (Docker stats)
4. ✅ Verifica atividade em background
5. ✅ Procura execuções do seeder nos logs
6. ✅ Lista requests lentos
7. ✅ Identifica endpoints problemáticos
8. ✅ Gera relatório com recomendações

**Ideal para diagnosticar CPU alto mesmo sem uso!**

---

### Passo 1: Verificar Atividade em Background ⭐ NOVO

```bash
curl https://erplab.paclabs.com.br/api/v1/health/metrics/background-activity | jq
```

**O que observar:**

- `inactivitySeconds` > 300 (5 min) → Sistema inativo
- `activeHandles` > 10 → Muitos processos ativos
- **Combinação dos dois** → CPU alto SEM requests (seu caso!)

---

### Passo 2: Verificar Métricas Gerais

```bash
curl https://erplab.paclabs.com.br/api/v1/health/metrics | jq
```

**O que observar:**

- `memory.percentage` > 80% → Problema de memória
- `cpu.loadAverage[0]` > 2.0 → CPU alta
- `requests.slowRequests` alto → Muitos requests lentos
- `background.inactivitySeconds` alto + `background.activeHandles` alto → **Processo em background**

---

### Passo 3: Verificar Logs do Seeder

```bash
docker logs erplab-backend --tail 200 | grep "\[SEEDER\]"
```

**O que procurar:**

- Múltiplas execuções com timestamps próximos → Container reiniciando
- Tempo de execução > 5s → Seeder lento
- Execuções a cada poucos segundos → **Crash loop**

**Exemplo de log normal:**

```
🌱 [SEEDER] Iniciando seeder de Campos de Formulário...
🕒 [SEEDER] Timestamp: 2025-11-13T10:00:00.000Z
✓ [SEEDER] Todos os campos já atualizados. Nenhuma alteração necessária.
⏱️  [SEEDER] Tempo de execução: 234ms (0.23s)
🏁 [SEEDER] Finalizado em: 2025-11-13T10:00:00.234Z
```

**Exemplo de problema (crash loop):**

```
[SEEDER] Iniciando... 10:00:00
[SEEDER] Iniciando... 10:00:15  ← 15s depois!
[SEEDER] Iniciando... 10:00:30  ← Container reiniciando!
```

---

### Passo 4: Identificar Requests Lentos

```bash
curl https://erplab.paclabs.com.br/api/v1/health/metrics/slow-requests | jq
```

**O que procurar:**

- URLs que aparecem repetidamente
- Durations > 5000ms (muito lentos)
- Padrões de IP (possível ataque ou loop)

---

### Passo 5: Identificar Endpoints Problemáticos

```bash
curl https://erplab.paclabs.com.br/api/v1/health/metrics/slowest-endpoints | jq
```

**O que procurar:**

- `avgDuration` > 1000ms → Endpoint lento
- `count` alto → Endpoint muito chamado
- Combinar os dois → Prioridade de otimização

---

### Passo 6: Verificar Endpoints Mais Chamados

```bash
curl https://erplab.paclabs.com.br/api/v1/health/metrics/most-called | jq
```

**O que procurar:**

- Endpoints com `count` muito alto
- Verificar se precisam de cache
- Verificar se há polling desnecessário no frontend

---

## 🚨 Logs Automáticos

O sistema automaticamente loga no console:

### Seeders

```
🌱 [SEEDER] Iniciando seeder de Campos de Formulário...
🕒 [SEEDER] Timestamp: 2025-11-13T10:00:00.000Z
⏱️  [SEEDER] Tempo de execução: 234ms (0.23s)
🏁 [SEEDER] Finalizado em: 2025-11-13T10:00:00.234Z
```

### Requests Lentos (> 1000ms)

```
🐌 Request lento: GET /api/v1/cadastros/empresas - 1234ms - IP: 192.168.1.10
```

### Requests Muito Lentos (> 5000ms)

```
🚨 Request MUITO lento: GET /api/v1/cadastros/empresas/cnpj/12345 - 5432ms - IP: 192.168.1.10
```

**Visualizar logs:**

```bash
# Ver todos os logs em tempo real
docker logs erplab-backend -f

# Filtrar apenas requests lentos
docker logs erplab-backend -f | grep "Request lento"

# Filtrar apenas seeders
docker logs erplab-backend --tail 200 | grep "\[SEEDER\]"

# Contar quantas vezes seeder executou
docker logs erplab-backend --tail 500 | grep -c "\[SEEDER\] Iniciando"
```

---

## 📈 Métricas Armazenadas

- **Últimos 1000 requests:** Mantidos em memória
- **Threshold de request lento:** 1000ms (configurável)
- **Reset automático:** Não (persist durante uptime)

---

## 🔧 Arquitetura

### 1. PerformanceInterceptor

- Intercepta todas as requisições HTTP
- Mede tempo de execução (start → end)
- Registra métricas no `MetricsService`
- Loga requests lentos automaticamente

**Localização:** `src/comum/interceptors/performance.interceptor.ts`

### 2. MetricsService

- Armazena últimos 1000 requests
- Calcula estatísticas agregadas
- Fornece métricas de CPU e memória do sistema
- Agrupa endpoints por URL

**Localização:** `src/comum/services/metrics.service.ts`

### 3. HealthController

- Expõe 5 endpoints de monitoramento
- Todos públicos (sem autenticação necessária)
- Documentado no Swagger

**Localização:** `src/health.controller.ts`

---

## 🎨 Integração com Frontend (Futuro)

Você pode criar um dashboard de monitoramento no frontend consumindo estes endpoints:

```typescript
// Exemplo React
const Monitoring = () => {
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    const interval = setInterval(async () => {
      const response = await fetch('/api/v1/health/metrics');
      const data = await response.json();
      setMetrics(data);
    }, 5000); // Atualiza a cada 5s

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h2>CPU: {metrics?.cpu.loadAverage[0].toFixed(2)}</h2>
      <h2>Memória: {metrics?.memory.percentage}%</h2>
      <h2>Requests Lentos: {metrics?.requests.slowRequests}</h2>
    </div>
  );
};
```

---

## ⚠️ Problemas Identificados na Análise Inicial

### 1. Seeder Executando a Cada Restart

- **Localização:** `campo-formulario-seed.service.ts`
- **Problema:** Processa 105 alternativas em saves individuais
- **Solução futura:** Batch insert + skip se já existir

### 2. Endpoint com Chamada Externa Sem Cache

- **Endpoint:** `GET /api/v1/cadastros/empresas/cnpj/:cnpj`
- **Problema:** Chama API externa CNPJA sem cache
- **Solução futura:** Implementar cache em memória

### 3. Queries com Múltiplas Relations Sem Paginação

- **Serviços:** `empresas.service.ts`, `unidade-saude.service.ts`
- **Problema:** `findAll()` sem limite
- **Solução futura:** Paginação obrigatória

---

## 📝 Comandos Úteis de Diagnóstico

```bash
# 🚀 DIAGNÓSTICO COMPLETO (RECOMENDADO)
./diagnose-cpu.sh

# 1. Ver atividade em background (CPU alto sem requests)
curl https://erplab.paclabs.com.br/api/v1/health/metrics/background-activity | jq

# 2. Ver métricas gerais
curl https://erplab.paclabs.com.br/api/v1/health/metrics | jq

# 3. Monitorar requests lentos em tempo real
watch -n 5 'curl -s https://erplab.paclabs.com.br/api/v1/health/metrics/slow-requests | jq ".[0:5]"'

# 4. Ver endpoints mais problemáticos
curl https://erplab.paclabs.com.br/api/v1/health/metrics/slowest-endpoints | jq

# 5. Ver logs do container em tempo real
docker logs erplab-backend -f

# 6. Ver métricas do Docker em tempo real
docker stats erplab-backend

# 7. Verificar execuções do seeder
docker logs erplab-backend --tail 200 | grep "\[SEEDER\]"

# 8. Contar quantas vezes seeder executou
docker logs erplab-backend --tail 500 | grep -c "\[SEEDER\] Iniciando"

# 9. Verificar se container está em crash loop
docker inspect erplab-backend --format='{{.RestartCount}}'

# 10. Ver últimos erros/crashes
docker logs erplab-backend --tail 500 | grep -i error
```

---

## 🎯 Próximos Passos

1. **Monitorar por 24-48h** para coletar dados
2. **Analisar endpoints mais lentos** com os dados coletados
3. **Implementar cache** no endpoint CNPJ se necessário
4. **Otimizar seeder** para não processar desnecessariamente
5. **Adicionar paginação obrigatória** nos métodos `findAll()`
6. **Considerar Redis** para cache distribuído
7. **Implementar rate limiting** em endpoints públicos

---

## 📚 Documentação Adicional

- Swagger: `https://erplab.paclabs.com.br/api/docs`
- Health Check: `https://erplab.paclabs.com.br/api/v1/health`
- Métricas: `https://erplab.paclabs.com.br/api/v1/health/metrics`
