# 🚀 Deploy do ERPLab Backend

## Pré-requisitos

1. **Docker instalado e rodando**
2. **Login no GitHub Container Registry**

### Fazer login no GitHub Container Registry

Primeiro, crie um Personal Access Token no GitHub:

- Acesse: https://github.com/settings/tokens
- Crie um token com permissões: `write:packages`, `read:packages`

Depois faça login:

```bash
echo $GITHUB_TOKEN | docker login ghcr.io -u SEU_USUARIO --password-stdin
```

## 📦 Uso do Script

### Deploy básico (com testes)

```bash
./deploy.sh
```

### Deploy rápido (sem testes)

```bash
./deploy.sh skip-tests
```

### Deploy com atualização automática no servidor

```bash
./deploy.sh skip-tests user@your-server.com
```

## 🔧 Configuração no Servidor

No servidor, você precisa ter um `docker-compose.yml` configurado em `~/infra/apps/erplab-back/`:

```yaml
version: '3.8'

networks:
  web:
    external: true
  internal:
    external: true

services:
  erplab-back:
    image: ghcr.io/SEU_USUARIO/erplab-back:latest
    container_name: erplab-back
    restart: unless-stopped
    environment:
      - NODE_ENV=production
      - DB_HOST=host.docker.internal
      - DB_PORT=5432
      - DB_USER=${DB_USER}
      - DB_PASSWORD=${DB_PASSWORD}
      - DB_NAME=${DB_NAME}
      - JWT_SECRET=${JWT_SECRET}
      - PORT=10016
    networks:
      - web
      - internal
    extra_hosts:
      - "host.docker.internal:host-gateway"
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.erplab-back.rule=Host(\`api.erplab.yourdomain.com\`)"
      - "traefik.http.routers.erplab-back.entrypoints=websecure"
      - "traefik.http.routers.erplab-back.tls.certresolver=letsencrypt"
      - "traefik.http.services.erplab-back.loadbalancer.server.port=10016"
      - "traefik.docker.network=web"
```

E um arquivo `.env`:

```bash
DB_USER=erplab_user
DB_PASSWORD=senha_segura_aqui
DB_NAME=erplab_db
JWT_SECRET=seu_jwt_secret_aqui
```

## 🔄 Workflow Completo

1. **Desenvolvimento Local**

   ```bash
   git add .
   git commit -m "feat: nova funcionalidade"
   git push origin main
   ```

2. **Deploy da Imagem**

   ```bash
   ./deploy.sh
   ```

3. **Atualizar no Servidor**
   ```bash
   ssh user@server
   cd ~/infra/apps/erplab-back
   docker-compose pull
   docker-compose up -d
   docker-compose logs -f --tail=50
   ```

## 📝 Versionamento

O script usa tags do Git para versionar as imagens:

- Se houver uma tag: usa a tag (ex: `v1.0.0`)
- Se não houver tag: usa o hash do commit (ex: `abc1234`)
- Sempre cria também a tag `latest`

Para criar uma release com versão:

```bash
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0
./deploy.sh
```

## 🐛 Troubleshooting

### Erro de autenticação no registry

```bash
# Verifique se está logado
docker info | grep ghcr.io

# Se não estiver, faça login novamente
echo $GITHUB_TOKEN | docker login ghcr.io -u SEU_USUARIO --password-stdin
```

### Imagem não atualiza no servidor

```bash
# No servidor, force o pull
docker-compose pull --ignore-pull-failures
docker-compose up -d --force-recreate
```

### Ver logs da aplicação

```bash
# No servidor
docker-compose logs -f erplab-back
```

## 📊 Monitoramento

Após o deploy, verifique o status:

```bash
# No servidor
docker ps | grep erplab
docker-compose ps
curl http://localhost:10016/api/v1/health
```
