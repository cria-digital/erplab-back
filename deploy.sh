#!/bin/bash

# ==============================================
# 🚀 ERPLab Backend - Script de Deploy Manual
# ==============================================
# Carrega configurações do .env.deploy
# ==============================================

set -e

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}"
echo "=========================================="
echo "🚀 ERPLab Backend - Deploy Manual"
echo "=========================================="
echo -e "${NC}"

# Carregar .env.deploy
if [ ! -f .env.deploy ]; then
    echo -e "${RED}❌ Arquivo .env.deploy não encontrado!${NC}"
    exit 1
fi

echo -e "${YELLOW}📋 Carregando .env.deploy...${NC}"
source .env.deploy

# Carregar credenciais locais (se existir)
if [ -f .env.local ]; then
    echo -e "${YELLOW}🔐 Carregando .env.local...${NC}"
    source .env.local
else
    echo -e "${YELLOW}⚠️  .env.local não encontrado (credenciais serão solicitadas)${NC}"
fi

# Construir URL da imagem
FULL_IMAGE_URL="${IMAGE_NAME}:${IMAGE_TAG}"

# Menu
echo ""
echo "Escolha uma opção:"
echo "1) 🏗️  Build da imagem Docker"
echo "2) 📦 Build + Push para registry"
echo "3) 🚀 Deploy no servidor (build + push + ssh)"
echo "4) 🧪 Testar imagem localmente"
echo "5) 📊 Ver logs do servidor"
echo "0) ❌ Sair"
echo ""
read -p "Opção: " OPTION

case $OPTION in
    1)
        echo -e "${BLUE}🏗️ Building imagem...${NC}"
        docker build -t "${FULL_IMAGE_URL}" .
        echo -e "${GREEN}✅ Build concluído!${NC}"
        echo -e "Imagem: ${FULL_IMAGE_URL}"
        ;;

    2)
        # Build
        echo -e "${BLUE}🏗️ Building imagem...${NC}"
        docker build -t "${FULL_IMAGE_URL}" .

        # Login
        echo -e "${BLUE}🔐 Login no registry...${NC}"
        if [ -z "$GITHUB_TOKEN" ]; then
            echo -e "${YELLOW}Digite o GITHUB_TOKEN:${NC}"
            read -sp "Token: " GITHUB_TOKEN
            echo ""
        fi
        echo "$GITHUB_TOKEN" | docker login ${REGISTRY} -u ${REGISTRY_USER} --password-stdin

        # Push
        echo -e "${BLUE}📤 Pushing para registry...${NC}"
        docker push "${FULL_IMAGE_URL}"

        echo -e "${GREEN}✅ Push concluído!${NC}"
        echo -e "Imagem disponível em: ${FULL_IMAGE_URL}"
        ;;

    3)
        # Build + Push
        echo -e "${BLUE}1/3 🏗️ Building...${NC}"
        docker build -t "${FULL_IMAGE_URL}" .

        if [ -z "$GITHUB_TOKEN" ]; then
            echo -e "${YELLOW}Digite o GITHUB_TOKEN:${NC}"
            read -sp "Token: " GITHUB_TOKEN
            echo ""
        fi

        echo -e "${BLUE}🔐 Login no registry...${NC}"
        echo "$GITHUB_TOKEN" | docker login ${REGISTRY} -u ${REGISTRY_USER} --password-stdin

        echo -e "${BLUE}2/3 📤 Pushing...${NC}"
        docker push "${FULL_IMAGE_URL}"

        # Deploy via SSH
        echo -e "${BLUE}3/3 🚀 Deploying no servidor...${NC}"

        if [ -z "$CONTABO_HOST" ]; then
            read -p "Server IP: " CONTABO_HOST
        fi
        if [ -z "$CONTABO_USER" ]; then
            read -p "Server User: " CONTABO_USER
        fi
        if [ -z "$CONTABO_PASSWORD" ]; then
            read -sp "Server Password: " CONTABO_PASSWORD
            echo ""
        fi

        # Verificar se sshpass está instalado
        if ! command -v sshpass &> /dev/null; then
            echo -e "${RED}❌ sshpass não instalado. Instale com: sudo dnf install sshpass${NC}"
            exit 1
        fi

        sshpass -p "$CONTABO_PASSWORD" ssh -o StrictHostKeyChecking=no \
            ${CONTABO_USER}@${CONTABO_HOST} << EOF
            set -e
            echo "🔄 Atualizando ${APP_NAME}..."

            cd /opt/infra
            git pull origin main || true

            cd apps/${APP_NAME}

            # Login no registry
            echo "${GITHUB_TOKEN}" | docker login ${REGISTRY} -u ${REGISTRY_USER} --password-stdin

            # Pull nova imagem
            docker pull ${FULL_IMAGE_URL}

            # Atualizar .env com nova imagem
            sed -i "s|^IMAGE_URL=.*|IMAGE_URL=${FULL_IMAGE_URL}|" .env

            # Restart container
            docker-compose down
            docker-compose up -d

            # Aguardar
            echo "⏳ Aguardando container inicializar..."
            sleep 15

            # Status
            echo ""
            echo "📊 Status do container:"
            docker ps | grep ${APP_NAME}

            echo ""
            echo "📋 Últimos logs:"
            docker logs --tail 20 ${APP_NAME}-backend
EOF

        echo -e "${GREEN}✅ Deploy concluído!${NC}"
        echo -e "🌐 URL: https://${APP_DOMAIN}"
        echo -e "📖 Docs: https://${APP_DOMAIN}${API_DOCS_ENDPOINT}"
        echo -e "💚 Health: https://${APP_DOMAIN}${HEALTH_ENDPOINT}"
        ;;

    4)
        echo -e "${BLUE}🧪 Testando imagem localmente...${NC}"

        # Criar .env.test se não existir
        if [ ! -f .env.test ]; then
            cat > .env.test << ENVEOF
NODE_ENV=development
PORT=${APP_PORT}
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=erplab_dev
JWT_SECRET=test-secret-key-change-in-production
CORS_ORIGIN=http://localhost:3000
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=test@example.com
MAIL_PASSWORD=test
MAIL_FROM=test@example.com
FRONTEND_URL=http://localhost:3000
ENVEOF
            echo -e "${GREEN}✅ Criado .env.test${NC}"
        fi

        docker run -d \
            --name ${APP_NAME}-test \
            -p ${APP_PORT}:${APP_PORT} \
            --env-file .env.test \
            "${FULL_IMAGE_URL}"

        echo -e "${GREEN}✅ Container de teste iniciado!${NC}"
        echo -e "🌐 URL: http://localhost:${APP_PORT}"
        echo -e "💚 Health: http://localhost:${APP_PORT}${HEALTH_ENDPOINT}"
        echo -e "📖 Docs: http://localhost:${APP_PORT}${API_DOCS_ENDPOINT}"
        echo ""
        echo "📋 Ver logs: docker logs -f ${APP_NAME}-test"
        echo "🛑 Parar: docker stop ${APP_NAME}-test && docker rm ${APP_NAME}-test"
        ;;

    5)
        echo -e "${BLUE}📊 Logs do servidor...${NC}"

        if [ -z "$CONTABO_HOST" ]; then
            read -p "Server IP: " CONTABO_HOST
        fi
        if [ -z "$CONTABO_USER" ]; then
            read -p "Server User: " CONTABO_USER
        fi
        if [ -z "$CONTABO_PASSWORD" ]; then
            read -sp "Server Password: " CONTABO_PASSWORD
            echo ""
        fi

        sshpass -p "$CONTABO_PASSWORD" ssh -o StrictHostKeyChecking=no \
            ${CONTABO_USER}@${CONTABO_HOST} << EOF
            echo "🐳 Containers rodando:"
            docker ps | grep ${APP_NAME} || echo "❌ Container não encontrado"
            echo ""
            echo "📋 Logs (últimas 100 linhas):"
            docker logs --tail 100 ${APP_NAME}-backend 2>/dev/null || echo "❌ Container não encontrado"
EOF
        ;;

    0)
        echo -e "${BLUE}👋 Saindo...${NC}"
        exit 0
        ;;

    *)
        echo -e "${RED}❌ Opção inválida!${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}✅ Operação concluída!${NC}"
