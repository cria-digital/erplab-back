# Padrões e Aprendizados do Projeto ERP Lab Backend

## Estrutura do Projeto

### Padrões de Organização de Módulos
- **Estrutura de módulos**: Seguir padrão flat - services e controllers ficam na raiz do módulo, NÃO em subpastas
  - ✅ Correto: `/src/modules/usuarios/usuarios.service.ts`
  - ❌ Errado: `/src/modules/usuarios/services/usuarios.service.ts`

### Convenções de Nomenclatura
- **TypeScript/JavaScript**: camelCase para propriedades e métodos
- **Banco de dados**: snake_case para colunas
  - Exemplo: `nome_completo` no banco → `nomeCompleto` no TypeScript
- **Entidades**: Usar decorador `@Column({ name: 'snake_case' })` para mapear

## Autenticação JWT

### Implementação Completa
1. **Dependências necessárias**:
   ```bash
   npm install @nestjs/jwt @nestjs/passport passport passport-jwt @types/passport-jwt
   ```

2. **Estrutura do módulo Auth**:
   - `auth.module.ts` - Configuração do módulo
   - `auth.service.ts` - Lógica de autenticação
   - `auth.controller.ts` - Endpoints
   - `strategies/jwt.strategy.ts` - Estratégia Passport
   - `guards/jwt-auth.guard.ts` - Guard global
   - `decorators/public.decorator.ts` - Marcar rotas públicas
   - `decorators/current-user.decorator.ts` - Obter usuário atual

3. **Configuração no .env**:
   ```env
   JWT_SECRET=sua-chave-secreta
   JWT_EXPIRES_IN=24h
   JWT_REFRESH_EXPIRES_IN=7d
   ```

4. **Guard Global**: Configurado no `app.module.ts` com `APP_GUARD`
5. **Rotas Públicas**: Usar decorator `@Public()` para excluir da autenticação

## HTTP Request Files (REST Client)

### Organização
- **Localização**: `/http-requests/[nome-modulo]/`
- **Estrutura**: Um arquivo por funcionalidade
  - `criar-[entidade].http`
  - `listar-[entidade].http`
  - `buscar-[entidade].http`
  - `atualizar-[entidade].http`
  - `exemplos-completos.http`

### Variáveis de Ambiente
- Definidas em `/http-client.env.json`
- Variáveis padrão: `{{baseUrl}}`, `{{contentType}}`, `{{token}}`
- Separação por ambiente: development, staging, production

### Formato dos Requests
```http
### Descrição do Request
METHOD {{baseUrl}}/endpoint
Content-Type: {{contentType}}
Authorization: Bearer {{token}}

{
  "campo": "valor"
}

### Expected Response
# Status: 200 OK
# {
#   "resultado": "esperado"
# }
```

## Boas Práticas Identificadas

### Sempre Executar Build e Lint
```bash
npm run build  # Verificar erros TypeScript
npm run lint   # Verificar padrões de código
```

### Módulo de Auditoria
- Registrar todas as operações críticas
- Tipos de log: ACESSO, ALTERACAO, ERRO, ACAO
- Níveis: INFO, WARNING, ERROR, CRITICAL
- Integração automática em services de outros módulos

### Tratamento de Senhas
- Sempre usar bcrypt para hash
- Salt rounds: 10
- Nunca retornar hash de senha nas respostas
- Implementar bloqueio após tentativas falhas (5 tentativas = 30 min bloqueio)

### Soft Delete
- Preferir desativação (`ativo: false`) em vez de exclusão física
- Manter histórico para auditoria

### Validação e DTOs
- Usar class-validator para validações
- Documentar com @ApiProperty do Swagger
- Separar DTOs de Create e Update
- Sempre validar UUIDs e formatos específicos (CPF, email, etc)

## Comandos Úteis

### Desenvolvimento
```bash
npm run start:dev     # Desenvolvimento com hot reload
npm run build        # Compilar TypeScript
npm run lint         # Verificar código
npm run test         # Executar testes
```

### Banco de Dados
```bash
npm run migration:generate -- -n NomeMigracao  # Gerar migration
npm run migration:run                          # Executar migrations
npm run migration:revert                       # Reverter última migration
```

## Estrutura de Entidades

### Usuario
- Autenticação com JWT
- Suporte a 2FA (dois fatores)
- Perguntas de recuperação de senha
- Relacionamento N:N com UnidadeSaude via UsuarioUnidade
- Relacionamento N:N com Permissoes via UsuarioPermissao
- Controle de tentativas de login e bloqueio temporário

### Auditoria
- Log completo de todas as operações
- Rastreamento de alterações com before/after
- Filtros avançados para consulta
- Estatísticas agregadas

## Pontos de Atenção

1. **Não criar subpastas em módulos** - Manter estrutura flat
2. **Sempre rodar build e lint** antes de considerar tarefa completa
3. **Seguir padrões de nomenclatura** do projeto (snake_case no DB, camelCase no TS)
4. **Organizar requests HTTP** em arquivos separados por operação
5. **Usar variáveis de ambiente** para configurações sensíveis
6. **Implementar auditoria** em operações críticas
7. **Validar dados de entrada** com DTOs e class-validator
8. **Documentar API** com decorators do Swagger

## Próximos Passos Sugeridos

1. Implementar sistema de permissões granulares
2. Adicionar rate limiting nos endpoints
3. Implementar cache com Redis
4. Adicionar testes unitários e e2e
5. Configurar CI/CD pipeline
6. Implementar websockets para notificações real-time
7. Adicionar sistema de filas para processamento assíncrono