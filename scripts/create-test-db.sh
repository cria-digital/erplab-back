#!/bin/bash

# Script para criar banco de dados de teste
# Uso: ./scripts/create-test-db.sh

set -e

echo "🧪 Criando banco de dados de teste..."
echo "======================================"

# Extrair variáveis do .env manualmente
DB_HOST=$(grep "^DB_HOST=" .env | cut -d '=' -f2)
DB_PORT=$(grep "^DB_PORT=" .env | cut -d '=' -f2)
DB_USERNAME=$(grep "^DB_USERNAME=" .env | cut -d '=' -f2)
DB_PASSWORD=$(grep "^DB_PASSWORD=" .env | cut -d '=' -f2)

# Nome do banco de teste
TEST_DB="erplab_db_test"

# Verificar se o banco já existe
DB_EXISTS=$(PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USERNAME -lqt | cut -d \| -f 1 | grep -w $TEST_DB | wc -l)

if [ $DB_EXISTS -eq 1 ]; then
    echo "⚠️  Banco de dados '$TEST_DB' já existe."
    read -p "Deseja recriar o banco? Todos os dados serão perdidos! (s/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Ss]$ ]]; then
        echo "🗑️  Removendo banco existente..."
        PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USERNAME -c "DROP DATABASE IF EXISTS $TEST_DB;"
        echo "✅ Banco removido."
    else
        echo "❌ Operação cancelada."
        exit 0
    fi
fi

# Criar banco de dados
echo "📦 Criando banco '$TEST_DB'..."
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USERNAME -c "CREATE DATABASE $TEST_DB;"

echo "✅ Banco de dados de teste criado com sucesso!"
echo ""
echo "Para executar as migrations no banco de teste:"
echo "  NODE_ENV=test npm run migration:run"
echo ""
echo "Para executar os testes E2E:"
echo "  npm run test:e2e"
