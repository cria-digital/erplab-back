# Dockerfile para o ERP Laboratório Backend

# Usar Node.js LTS
FROM node:20-alpine

# Instalar dumb-init para gerenciamento de processos
RUN apk add --no-cache dumb-init

# Criar usuário não-root
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

# Definir diretório de trabalho
WORKDIR /usr/src/app

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar dependências
RUN npm ci --only=production && npm cache clean --force

# Copiar código fonte
COPY --chown=nestjs:nodejs . .

# Build da aplicação
RUN npm run build

# Mudar para usuário não-root
USER nestjs

# Expor porta
EXPOSE 3000

# Usar dumb-init para inicializar
ENTRYPOINT ["dumb-init", "--"]

# Comando padrão
CMD ["node", "dist/main"]