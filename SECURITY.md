# 🔐 Guia de Segurança - ERPLab Backend

## ⚠️ NUNCA Exponha Credenciais

### ❌ NUNCA faça:

- Commitar arquivos `.env`, `.env.local`, `.env.test`
- Compartilhar tokens em chat, issues, pull requests
- Colocar credenciais em código-fonte
- Fazer hardcode de senhas
- Expor tokens em logs

### ✅ SEMPRE faça:

- Use GitHub Secrets para CI/CD
- Use `.env.local` para desenvolvimento local (ignorado pelo git)
- Revogue tokens expostos imediatamente
- Use variáveis de ambiente para credenciais
- Rotacione tokens periodicamente

## 🔑 Tipos de Credenciais

### 1. GitHub Personal Access Token

**Onde configurar:**

- **GitHub Secrets**: Para CI/CD automático
- **`.env.local`**: Para deploy manual local

**Permissões necessárias:**

- `repo` (full control)
- `read:packages`
- `write:packages`

**Como criar:**

1. Acesse: https://github.com/settings/tokens
2. Generate new token (Classic)
3. Selecione permissões acima
4. Copie o token (você só verá uma vez!)
5. Configure como secret (NUNCA em arquivos de código)

**Como revogar token exposto:**

1. Acesse: https://github.com/settings/tokens
2. Encontre o token
3. Click em "Delete"
4. Gere um novo token

### 2. Credenciais do Servidor (SSH)

**Onde configurar:**

- **GitHub Secrets** (repositório infra): `CONTABO_HOST`, `CONTABO_USER`, `CONTABO_PASSWORD`
- **`.env.local`**: Para deploy manual local

### 3. Credenciais do Banco de Dados

**Onde configurar:**

- **Servidor** (`/opt/infra/apps/erplab/.env`): `DB_PASSWORD`
- **Nunca** em código ou repositórios

### 4. JWT Secret

**Onde configurar:**

- **Servidor** (`/opt/infra/apps/erplab/.env`): `JWT_SECRET`
- Gere com: `openssl rand -base64 64`

### 5. Credenciais de Email (SMTP)

**Onde configurar:**

- **Servidor** (`/opt/infra/apps/erplab/.env`): `MAIL_PASS`

## 📋 Checklist de Configuração

### Repositório Backend (erplab-back)

GitHub Secrets necessários:

- [x] `INFRA_DEPLOY_TOKEN` - Token com permissões read/write packages

### Repositório Infra (diegosoek/infra)

GitHub Secrets necessários:

- [x] `INFRA_DEPLOY_TOKEN` - Mesmo token acima
- [x] `CONTABO_HOST` - IP do servidor
- [x] `CONTABO_USER` - Usuário SSH
- [x] `CONTABO_PASSWORD` - Senha SSH

### Servidor (/opt/infra/apps/erplab/.env)

Variáveis necessárias:

```bash
# Banco de dados
DB_PASSWORD=senha_forte_aqui

# JWT
JWT_SECRET=chave_secreta_gerada_com_openssl

# Email
MAIL_PASS=senha_email_smtp
```

### Deploy Manual Local

Arquivo `.env.local` (criar baseado em `.env.local.example`):

```bash
GITHUB_TOKEN=seu_token_aqui
CONTABO_HOST=ip_servidor
CONTABO_USER=root
CONTABO_PASSWORD=senha_ssh
```

## 🚨 Token Exposto - Ação Imediata

Se você acidentalmente expôs um token:

1. **Revogue imediatamente**:
   - GitHub: https://github.com/settings/tokens
   - Encontre e delete o token exposto

2. **Gere novo token**:
   - Crie um novo com as mesmas permissões
   - Configure como GitHub Secret

3. **Verifique logs**:
   - Verifique se o token foi usado indevidamente
   - GitHub → Settings → Security log

4. **Atualize documentação**:
   - Atualize todos os lugares que usavam o token antigo

## 🔄 Rotação de Credenciais

**Recomendação:** Rotacione tokens a cada 90 dias.

**Processo:**

1. Gere novo token/senha
2. Configure como secret/variável
3. Teste o funcionamento
4. Revogue o antigo
5. Documente a rotação

## 📞 Em Caso de Incidente

1. **Revogue** a credencial exposta
2. **Gere** nova credencial
3. **Atualize** nos locais necessários
4. **Verifique** logs de acesso
5. **Documente** o incidente

## 🔗 Links Úteis

- [GitHub Security Best Practices](https://docs.github.com/en/code-security)
- [Managing GitHub Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [Token Security](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure)

---

**Última atualização:** Outubro 2025
