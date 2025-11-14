#!/bin/bash

# Script de diagnóstico rápido para problemas de CPU
# Uso: ./diagnose-cpu.sh

set -e

echo "=================================================="
echo "🔍 DIAGNÓSTICO DE CPU - ERPLab Backend"
echo "=================================================="
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

PROD_URL="https://erplab.paclabs.com.br/api/v1"

echo "1️⃣  Verificando se container está rodando..."
echo ""

if docker ps | grep -q erplab-backend; then
    echo -e "${GREEN}✅ Container erplab-backend está rodando${NC}"
    CONTAINER_STATUS=$(docker ps --filter "name=erplab-backend" --format "{{.Status}}")
    echo "   Status: $CONTAINER_STATUS"
else
    echo -e "${RED}❌ Container erplab-backend NÃO está rodando${NC}"
    exit 1
fi

echo ""
echo "2️⃣  Verificando se container está reiniciando em loop..."
echo ""

RESTART_COUNT=$(docker inspect erplab-backend --format='{{.RestartCount}}' 2>/dev/null || echo "0")
echo "   Restart Count: $RESTART_COUNT"

if [ "$RESTART_COUNT" -gt 5 ]; then
    echo -e "${RED}⚠️  Container reiniciou $RESTART_COUNT vezes! Possível crash loop.${NC}"
else
    echo -e "${GREEN}✅ Container estável (restarts: $RESTART_COUNT)${NC}"
fi

echo ""
echo "3️⃣  Verificando métricas de CPU e memória (Docker)..."
echo ""

docker stats erplab-backend --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.MemPerc}}"

echo ""
echo "4️⃣  Verificando atividade em background (sem requests)..."
echo ""

BACKGROUND=$(curl -s ${PROD_URL}/health/metrics/background-activity 2>/dev/null)

if [ $? -eq 0 ]; then
    echo "$BACKGROUND" | jq -r '. | "   Timers ativos: \(.timers)\n   Handles ativos: \(.activeHandles)\n   Tempo sem requests: \(.inactivitySeconds)s\n   Último request: \(.lastActivity // "Nunca")"'

    INACTIVE_SECONDS=$(echo "$BACKGROUND" | jq -r '.inactivitySeconds')
    ACTIVE_HANDLES=$(echo "$BACKGROUND" | jq -r '.activeHandles')

    if [ "$INACTIVE_SECONDS" -gt 300 ] && [ "$ACTIVE_HANDLES" -gt 10 ]; then
        echo -e "${YELLOW}⚠️  Sistema inativo por ${INACTIVE_SECONDS}s mas tem ${ACTIVE_HANDLES} handles ativos!${NC}"
        echo -e "${YELLOW}   Possível processo em background consumindo CPU.${NC}"
    fi
else
    echo -e "${RED}❌ Não foi possível obter métricas de background${NC}"
fi

echo ""
echo "5️⃣  Procurando execuções do SEEDER nos logs (últimas 100 linhas)..."
echo ""

SEEDER_COUNT=$(docker logs erplab-backend --tail 200 2>&1 | grep -c "\[SEEDER\] Iniciando" || echo "0")
SEEDER_RECENT=$(docker logs erplab-backend --tail 200 2>&1 | grep "\[SEEDER\]" | tail -5)

echo "   Total de execuções do seeder encontradas: $SEEDER_COUNT"

if [ "$SEEDER_COUNT" -gt 10 ]; then
    echo -e "${RED}⚠️  SEEDER executou ${SEEDER_COUNT} vezes! Container pode estar reiniciando em loop.${NC}"
elif [ "$SEEDER_COUNT" -gt 0 ]; then
    echo -e "${YELLOW}   Últimas linhas do seeder:${NC}"
    echo "$SEEDER_RECENT"
else
    echo -e "${GREEN}✅ Nenhuma execução recente do seeder${NC}"
fi

echo ""
echo "6️⃣  Verificando requests lentos (últimos 10)..."
echo ""

SLOW_REQUESTS=$(curl -s ${PROD_URL}/health/metrics/slow-requests 2>/dev/null | jq -r '.[0:10] | .[] | "   \(.method) \(.url) - \(.duration)ms"' 2>/dev/null || echo "   Nenhum request lento")

if [ "$SLOW_REQUESTS" != "   Nenhum request lento" ]; then
    echo "$SLOW_REQUESTS"
else
    echo -e "${GREEN}✅ Nenhum request lento nos últimos 1000 requests${NC}"
fi

echo ""
echo "7️⃣  Verificando endpoints mais lentos (top 5)..."
echo ""

SLOWEST=$(curl -s ${PROD_URL}/health/metrics/slowest-endpoints 2>/dev/null | jq -r '.[0:5] | .[] | "   \(.url) - avg: \(.avgDuration)ms (max: \(.maxDuration)ms) - calls: \(.count)"' 2>/dev/null || echo "   Nenhum dado disponível")

echo "$SLOWEST"

echo ""
echo "8️⃣  Verificando métricas gerais..."
echo ""

METRICS=$(curl -s ${PROD_URL}/health/metrics 2>/dev/null)

if [ $? -eq 0 ]; then
    CPU_LOAD=$(echo "$METRICS" | jq -r '.cpu.loadAverage[0]')
    MEM_PERCENT=$(echo "$METRICS" | jq -r '.memory.percentage')
    UPTIME=$(echo "$METRICS" | jq -r '.uptime')
    TOTAL_REQUESTS=$(echo "$METRICS" | jq -r '.requests.total')

    echo "   CPU Load Average (1min): $CPU_LOAD"
    echo "   Memória: ${MEM_PERCENT}%"
    echo "   Uptime: ${UPTIME}s"
    echo "   Total de requests: $TOTAL_REQUESTS"

    # Alerta de CPU alta
    CPU_ALERT=$(echo "$CPU_LOAD > 2.0" | bc -l)
    if [ "$CPU_ALERT" -eq 1 ]; then
        echo -e "${RED}⚠️  CPU LOAD ALTO! ($CPU_LOAD)${NC}"
    fi

    # Alerta de memória alta
    if [ "$MEM_PERCENT" -gt 80 ]; then
        echo -e "${RED}⚠️  MEMÓRIA ALTA! (${MEM_PERCENT}%)${NC}"
    fi
else
    echo -e "${RED}❌ Não foi possível obter métricas gerais${NC}"
fi

echo ""
echo "=================================================="
echo "🏁 DIAGNÓSTICO CONCLUÍDO"
echo "=================================================="
echo ""

echo "📋 RESUMO E RECOMENDAÇÕES:"
echo ""

# Análise final
if [ "$RESTART_COUNT" -gt 5 ]; then
    echo -e "${RED}🚨 PROBLEMA CRÍTICO: Container em crash loop${NC}"
    echo "   → Verifique logs completos: docker logs erplab-backend --tail 500"
    echo "   → Possível erro de inicialização ou migration falhando"
fi

if [ "$SEEDER_COUNT" -gt 10 ]; then
    echo -e "${YELLOW}⚠️  POSSÍVEL CAUSA: Seeder executando múltiplas vezes${NC}"
    echo "   → Container pode estar reiniciando constantemente"
    echo "   → Verifique se migrations estão falhando"
fi

INACTIVE_SECONDS_CHECK=$(echo "$BACKGROUND" | jq -r '.inactivitySeconds' 2>/dev/null || echo "0")
if [ "$INACTIVE_SECONDS_CHECK" -gt 300 ]; then
    echo -e "${YELLOW}⚠️  Sistema inativo por mais de 5 minutos mas CPU ainda alta${NC}"
    echo "   → Provável processo em background consumindo CPU"
    echo "   → NÃO é problema de requests HTTP lentos"
    echo "   → Verifique handles ativos e timers"
fi

echo ""
echo "💡 Comandos úteis:"
echo "   Ver logs em tempo real:    docker logs erplab-backend -f"
echo "   Ver CPU em tempo real:     docker stats erplab-backend"
echo "   Métricas completas:        curl ${PROD_URL}/health/metrics | jq"
echo ""
