# 🚀 ERPLab Backend - Guia de Deploy

## 📋 Visão Geral

Este projeto suporta dois métodos de deploy:

1. **Deploy Automático** via GitHub Actions (recomendado)
2. **Deploy Manual** via script local

## 🔧 Pré-requisitos

### Para Deploy Automático

- GitHub Personal Access Token com permissões `read:packages` e `write:packages`
- Secrets configurados no GitHub

### Para Deploy Manual

- Docker instalado localmente
- sshpass instalado (`sudo dnf install sshpass` no Fedora)
- Acesso SSH ao servidor
- GitHub Personal Access Token

## 🤖 Deploy Automático (GitHub Actions)

### Configuração Inicial

1. **Criar GitHub Personal Access Token:**
   - Acesse: https://github.com/settings/tokens
   - Gere um token com permissões: `read:packages`, `write:packages`
   - Copie o token gerado

2. **Configurar Secrets no Repositório Backend:**

   ```
   Settings > Secrets and variables > Actions > New repository secret
   ```

   Adicione:
   - Nome: `INFRA_DEPLOY_TOKEN`
   - Valor: `<seu_token_github>`

3. **Secrets já configurados no Repositório Infra:**
   - `CONTABO_HOST` - IP do servidor
   - `CONTABO_USER` - Usuário SSH
   - `CONTABO_PASSWORD` - Senha SSH
   - `INFRA_DEPLOY_TOKEN` - Mesmo token acima

### Como Funciona

1. Você faz push para a branch `main` ou `master`
2. GitHub Actions **no backend** é disparado
3. Workflow faz build da imagem Docker
4. Push da imagem para `ghcr.io/diegosoek/erplab-backend:latest`
5. Dispara webhook no repositório `infra`
6. GitHub Actions **no infra** recebe o trigger
7. Conecta via SSH no servidor
8. Faz pull da nova imagem
9. Restart do container

## 🛠️ Deploy Manual (Script Local)

### Usando o Script

```bash
./deploy.sh
```

**Opções disponíveis:**

1. **Build da imagem Docker** - Apenas build local
2. **Build + Push para registry** - Build e push para ghcr.io
3. **Deploy no servidor** - Build + Push + SSH deploy
4. **Testar imagem localmente** - Roda container local
5. **Ver logs do servidor** - Conecta e mostra logs

### Credenciais

**Opção 1: Arquivo .env.local (Recomendado)**

```bash
# Copie o exemplo
cp .env.local.example .env.local

# Edite com suas credenciais
nano .env.local

# O deploy.sh carrega automaticamente
```

**Opção 2: Input Interativo**

Se `.env.local` não existir, o script solicitará as credenciais manualmente.

## 🌐 URLs de Produção

- **API:** https://erplab.paclabs.com.br
- **Docs:** https://erplab.paclabs.com.br/api/docs
- **Health:** https://erplab.paclabs.com.br/api/v1/health

## 🐛 Troubleshooting

### Erro: "sshpass: command not found"

```bash
sudo dnf install sshpass
```

### Container não inicia

```bash
./deploy.sh  # Opção 5 - Ver logs

# Ou SSH direto
ssh root@servidor
docker logs --tail 100 erplab-backend
```

---

**Última atualização:** Outubro 2025
