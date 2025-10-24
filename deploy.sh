#!/bin/bash

# ERPLab Backend Deploy Script
set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configurações
APP_NAME="erplab-back"
GITHUB_USER="diegosoek" # Ajuste com seu usuário do GitHub
REGISTRY="ghcr.io"
IMAGE_NAME="${REGISTRY}/${GITHUB_USER}/${APP_NAME}"

# Função para log colorido
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Verifica se está logado no GitHub Container Registry
check_registry_login() {
    log_info "Verificando login no GitHub Container Registry..."
    if ! docker info 2>/dev/null | grep -q "${REGISTRY}"; then
        log_warning "Você não está logado no GitHub Container Registry"
        echo ""
        echo "Para fazer login, execute:"
        echo "  echo \$GITHUB_TOKEN | docker login ghcr.io -u ${GITHUB_USER} --password-stdin"
        echo ""
        echo "Crie um token em: https://github.com/settings/tokens"
        echo "Permissões necessárias: write:packages, read:packages"
        exit 1
    fi
    log_success "Login verificado"
}

# Obtém a versão do Git
get_version() {
    # Tenta obter a tag, se não existir usa o commit hash
    VERSION=$(git describe --tags --always 2>/dev/null || echo "latest")
    echo "$VERSION"
}

# Executa testes antes do deploy
run_tests() {
    log_info "Executando testes..."
    npm run build
    if ! npm run lint; then
        log_error "Lint falhou!"
        exit 1
    fi
    log_success "Testes passaram"
}

# Build da imagem Docker
build_image() {
    VERSION=$1
    log_info "Fazendo build da imagem Docker..."
    log_info "Versão: ${VERSION}"

    docker build \
        -t "${IMAGE_NAME}:${VERSION}" \
        -t "${IMAGE_NAME}:latest" \
        -f Dockerfile \
        .

    log_success "Build concluído"
}

# Push da imagem para o registry
push_image() {
    VERSION=$1
    log_info "Enviando imagem para o registry..."

    docker push "${IMAGE_NAME}:${VERSION}"
    docker push "${IMAGE_NAME}:latest"

    log_success "Imagem enviada com sucesso"
    log_info "Imagem disponível em: ${IMAGE_NAME}:${VERSION}"
}

# Deploy no servidor (SSH)
deploy_to_server() {
    SERVER_HOST=$1

    if [ -z "$SERVER_HOST" ]; then
        log_warning "Servidor não especificado, pulando deploy remoto"
        return
    fi

    log_info "Fazendo deploy no servidor ${SERVER_HOST}..."

    ssh "$SERVER_HOST" << 'EOF'
        cd ~/infra/apps/erplab-back
        docker-compose pull
        docker-compose up -d
        docker-compose logs -f --tail=50
EOF

    log_success "Deploy no servidor concluído"
}

# Script principal
main() {
    echo ""
    log_info "🚀 Iniciando deploy do ERPLab Backend..."
    echo ""

    # Verifica argumentos
    SKIP_TESTS=${1:-false}
    SERVER_HOST=${2:-""}

    # Executa steps
    check_registry_login

    if [ "$SKIP_TESTS" != "skip-tests" ]; then
        run_tests
    else
        log_warning "Pulando testes (modo rápido)"
    fi

    VERSION=$(get_version)
    build_image "$VERSION"
    push_image "$VERSION"

    if [ -n "$SERVER_HOST" ]; then
        deploy_to_server "$SERVER_HOST"
    fi

    echo ""
    log_success "🎉 Deploy concluído com sucesso!"
    echo ""
    echo "📦 Imagem: ${IMAGE_NAME}:${VERSION}"
    echo ""

    if [ -z "$SERVER_HOST" ]; then
        log_info "Para fazer deploy no servidor, execute:"
        echo "  ssh your-server 'cd ~/infra/apps/erplab-back && docker-compose pull && docker-compose up -d'"
    fi
    echo ""
}

# Executa o script
main "$@"
