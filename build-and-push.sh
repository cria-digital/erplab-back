#!/bin/bash
set -e

echo "========================================"
echo "🐳 ERPLab Backend - Build & Push"
echo "========================================"

# Verificar se gh está instalado
if ! command -v gh &> /dev/null; then
    echo "❌ gh CLI não encontrado. Instale com: sudo apt install gh"
    exit 1
fi

# Verificar se está autenticado
if ! gh auth status &> /dev/null; then
    echo "❌ Não autenticado no GitHub. Execute: gh auth login"
    exit 1
fi

# Login no GitHub Container Registry
echo "🔐 Fazendo login no GitHub Container Registry..."
GH_USER="diegosoek"
GH_TOKEN=""
echo "$GH_TOKEN" | docker login ghcr.io -u "$GH_USER" --password-stdin

# Build da imagem
echo "🔨 Building imagem Docker..."
docker build -t ghcr.io/$GH_USER/erplab-backend:latest .

# Push da imagem
echo "📤 Pushing imagem para GitHub Container Registry..."
docker push ghcr.io/$GH_USER/erplab-backend:latest

echo ""
echo "========================================"
echo "✅ Imagem publicada com sucesso!"
echo "========================================"
echo "Imagem: ghcr.io/$GH_USER/erplab-backend:latest"
echo ""
echo "Próximos passos no servidor:"
echo "  cd /opt/infra/apps/erplab"
echo "  docker-compose pull"
echo "  docker-compose up -d"
echo "========================================"
