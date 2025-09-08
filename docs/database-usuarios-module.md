# 🗄️ Estrutura do Banco de Dados - Módulo de Usuários

## Baseado exclusivamente nas telas do sistema

### 1. Tabela: **usuarios**

#### Consolidando informações das abas "INFORMAÇÕES GERAIS" e "SEGURANÇA"
```sql
CREATE TABLE usuarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Informações Gerais (Screenshot 1)
    codigo_interno VARCHAR(50),
    nome_completo VARCHAR(255) NOT NULL,
    cpf VARCHAR(11) UNIQUE,
    telefone VARCHAR(20),
    celular_whatsapp VARCHAR(20),
    cargo_funcao VARCHAR(100),
    cnpj_associado VARCHAR(14),
    dados_admissao VARCHAR(255),
    foto_url VARCHAR(500),
    
    -- Dados de Acesso (Screenshot 3)
    email VARCHAR(255) NOT NULL UNIQUE, -- usado para login
    senha_hash VARCHAR(255) NOT NULL,
    resetar_senha BOOLEAN DEFAULT false,
    
    -- Autenticação 2 fatores
    validacao_2_etapas BOOLEAN DEFAULT false,
    metodo_validacao VARCHAR(50), -- 'SMS', 'EMAIL', 'APP'
    pergunta_recuperacao VARCHAR(255),
    resposta_recuperacao_hash VARCHAR(255),
    
    -- Controle de acesso
    tentativas_login_falhas INTEGER DEFAULT 0,
    bloqueado_ate TIMESTAMP,
    ultimo_login TIMESTAMP,
    
    -- Status
    ativo BOOLEAN DEFAULT true,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2. Tabela: **usuarios_unidades**
```sql
CREATE TABLE usuarios_unidades (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID NOT NULL REFERENCES usuarios(id),
    unidade_saude_id UUID NOT NULL REFERENCES unidades_saude(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(usuario_id, unidade_saude_id)
);
```

### 3. Tabela: **modulos_sistema**

#### Aba "PERFIS E PERMISSÕES" (Screenshot 2)
```sql
CREATE TABLE modulos_sistema (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    codigo VARCHAR(50) NOT NULL UNIQUE,
    nome VARCHAR(100) NOT NULL,
    ordem INTEGER,
    ativo BOOLEAN DEFAULT true
);

-- Módulos identificados na tela (para referência):
-- FINANCEIRO, AGENDAMENTO, LAUDOS, GED, FATURAMENTO
-- MODULO_ABC, MODULO_DEF, MODULO_GHI, MODULO_JKL, MODULO_MNO
```

### 4. Tabela: **tipos_permissao**
```sql
CREATE TABLE tipos_permissao (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    codigo VARCHAR(50) NOT NULL UNIQUE,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tipos de permissão identificados na tela (para referência):
-- VISUALIZAR, EDITAR, EXCLUIR, RESTRICAO_ACESSO
-- Mas podem ser expandidos para: CRIAR, APROVAR, EXPORTAR, IMPRIMIR, etc.
```

### 5. Tabela: **usuarios_permissoes**
```sql
CREATE TABLE usuarios_permissoes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID NOT NULL REFERENCES usuarios(id),
    modulo_id UUID NOT NULL REFERENCES modulos_sistema(id),
    permissao_id UUID NOT NULL REFERENCES tipos_permissao(id),
    unidade_saude_id UUID REFERENCES unidades_saude(id),
    concedido BOOLEAN DEFAULT false,
    horario_inicio TIME,
    horario_fim TIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(usuario_id, modulo_id, permissao_id, unidade_saude_id)
);
```

### Alternativa com estrutura mais granular:
```sql
-- Para permissões ainda mais específicas por recurso
CREATE TABLE recursos_sistema (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    modulo_id UUID NOT NULL REFERENCES modulos_sistema(id),
    codigo VARCHAR(100) NOT NULL UNIQUE,
    nome VARCHAR(200) NOT NULL,
    descricao TEXT,
    ativo BOOLEAN DEFAULT true
);

-- Exemplos: USUARIO_CRIAR, USUARIO_EDITAR, RELATORIO_FINANCEIRO_VISUALIZAR, etc.

CREATE TABLE usuarios_permissoes_recursos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID NOT NULL REFERENCES usuarios(id),
    recurso_id UUID NOT NULL REFERENCES recursos_sistema(id),
    unidade_saude_id UUID REFERENCES unidades_saude(id),
    concedido BOOLEAN DEFAULT true,
    horario_inicio TIME,
    horario_fim TIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(usuario_id, recurso_id, unidade_saude_id)
);
```

## 📋 MÓDULO DE AUDITORIA

### 6. Tabela: **auditoria_logs**

#### Tabela unificada para todos os logs do sistema
```sql
CREATE TABLE auditoria_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tipo_log VARCHAR(50) NOT NULL, -- 'ACESSO', 'ALTERACAO', 'ERRO', 'ACAO'
    
    -- Dados comuns
    usuario_id UUID NOT NULL REFERENCES usuarios(id),
    data_hora TIMESTAMP NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    unidade_saude_id UUID REFERENCES unidades_saude(id),
    modulo VARCHAR(100),
    
    -- Para logs de acesso (LOGIN, LOGOUT, TENTATIVA_LOGIN)
    acao VARCHAR(100), -- 'LOGIN', 'LOGOUT', 'LOGIN_FALHA', etc
    
    -- Para logs de alteração
    entidade VARCHAR(100), -- 'USUARIO', 'PACIENTE', etc
    entidade_id UUID,
    operacao VARCHAR(20), -- 'INSERT', 'UPDATE', 'DELETE'
    usuario_alterou_id UUID REFERENCES usuarios(id),
    
    -- Dados da alteração (formato JSON para flexibilidade)
    dados_alteracao JSONB, -- {"campo": "nome", "antes": "João", "depois": "João Silva"}
    
    -- Detalhes adicionais
    detalhes TEXT,
    nivel VARCHAR(20), -- 'INFO', 'WARNING', 'ERROR', 'CRITICAL'
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para performance
CREATE INDEX idx_auditoria_logs_tipo ON auditoria_logs(tipo_log);
CREATE INDEX idx_auditoria_logs_usuario ON auditoria_logs(usuario_id);
CREATE INDEX idx_auditoria_logs_data ON auditoria_logs(data_hora DESC);
CREATE INDEX idx_auditoria_logs_entidade ON auditoria_logs(entidade, entidade_id);
```

### Alternativa: Tabelas separadas por tipo (se preferir)
```sql
-- Opção com tabelas especializadas
CREATE TABLE auditoria_acessos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID NOT NULL REFERENCES usuarios(id),
    data_hora TIMESTAMP NOT NULL,
    acao VARCHAR(100) NOT NULL, -- 'LOGIN', 'LOGOUT', 'LOGIN_FALHA'
    ip_address VARCHAR(45),
    user_agent TEXT,
    unidade_saude_id UUID REFERENCES unidades_saude(id),
    sucesso BOOLEAN DEFAULT true,
    motivo_falha VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE auditoria_alteracoes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID NOT NULL REFERENCES usuarios(id), -- quem sofreu alteração
    usuario_alterou_id UUID NOT NULL REFERENCES usuarios(id), -- quem fez a alteração
    data_hora TIMESTAMP NOT NULL,
    entidade VARCHAR(100) NOT NULL, -- 'USUARIO', 'PACIENTE', etc
    entidade_id UUID NOT NULL,
    operacao VARCHAR(20) NOT NULL, -- 'INSERT', 'UPDATE', 'DELETE'
    campos_alterados JSONB NOT NULL, -- [{"campo": "nome", "antes": "X", "depois": "Y"}]
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```


## Índices Recomendados

```sql
-- Índices para performance
CREATE INDEX idx_usuarios_cpf ON usuarios(cpf);
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_usuarios_codigo_interno ON usuarios(codigo_interno);
CREATE INDEX idx_logs_acesso_usuario_data ON logs_acesso(usuario_id, data_hora DESC);
CREATE INDEX idx_historico_alteracoes_usuario ON historico_alteracoes(usuario_id, data_hora_alteracao DESC);
CREATE INDEX idx_usuarios_permissoes_usuario ON usuarios_permissoes(usuario_id);
```

## Observações

1. **Senhas**: Nunca armazenar em texto plano, sempre usar hash (bcrypt)
2. **CPF**: Armazenar apenas números, sem formatação
3. **Horários**: Os horários de restrição são visíveis como "09:00 - 18:00" nas permissões
4. **Unidades**: Relacionamento many-to-many entre usuários e unidades
5. **Soft Delete**: Usar campo `ativo` ao invés de deletar registros