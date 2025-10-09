# 📋 Reorganização de HTTP Requests - ERP Lab

## 🎯 Objetivo

Reorganizar os arquivos `.http` para seguir a **mesma hierarquia de módulos** utilizada em `src/modules/`, criando uma estrutura consistente e organizada.

---

## 📊 Análise da Situação Atual

### Módulos do Sistema (31 módulos)

```
src/modules/
├── autenticacao/
│   ├── auth/
│   ├── perfil/
│   └── usuarios/
├── cadastros/
│   ├── empresas/
│   ├── pacientes/
│   ├── profissionais/
│   └── unidade-saude/
├── exames/
│   ├── amostras/
│   ├── exames/
│   ├── formularios/
│   ├── kits/
│   ├── matrizes/
│   └── metodos/
├── relacionamento/
│   ├── convenios/
│   ├── fornecedores/
│   ├── laboratorios/
│   ├── prestadores-servico/
│   └── telemedicina/
├── atendimento/
│   ├── agendas/
│   ├── atendimento/
│   └── integracoes/
├── financeiro/
│   └── core/
├── infraestrutura/
│   ├── auditoria/
│   ├── common/
│   └── email/
└── configuracoes/
    └── estrutura/
        ├── equipamentos/
        ├── etiquetas-amostra/
        ├── imobilizados/
        ├── salas/
        └── setores/
```

### Estrutura Atual dos HTTP Requests (flat)

```
http-requests/
├── agendas/
├── auditoria/
├── auth/
├── common/
├── convenios/
├── empresas/
├── exames/
├── financeiro/
├── formularios/
├── integracoes/
├── metodos/
├── pacientes/
├── perfil/
├── profissionais/
├── tipos-exame/
├── unidade-saude/
└── usuarios/
```

**Total**: 77 arquivos `.http` distribuídos em 17 diretórios

---

## ❌ Módulos SEM Arquivos .http (14 módulos)

### Exames (3 módulos)

- ❌ `exames/amostras` - Módulo implementado, falta requests
- ❌ `exames/kits` - Módulo implementado, falta requests
- ❌ `exames/matrizes` - Módulo implementado, falta requests

### Relacionamento (4 módulos)

- ❌ `relacionamento/fornecedores` - Módulo implementado, falta requests
- ❌ `relacionamento/laboratorios` - Módulo implementado, falta requests
- ❌ `relacionamento/prestadores-servico` - Módulo implementado, falta requests
- ❌ `relacionamento/telemedicina` - Módulo implementado, falta requests

### Atendimento (1 módulo)

- ❌ `atendimento/atendimento` - Módulo implementado, falta requests

### Infraestrutura (1 módulo)

- ❌ `infraestrutura/email` - Módulo implementado, falta requests

### Configurações/Estrutura Física (5 módulos)

- ❌ `configuracoes/estrutura/equipamentos` - Módulo implementado, falta requests
- ❌ `configuracoes/estrutura/etiquetas-amostra` - Módulo implementado, falta requests
- ❌ `configuracoes/estrutura/imobilizados` - Módulo implementado, falta requests
- ❌ `configuracoes/estrutura/salas` - Módulo implementado, falta requests
- ❌ `configuracoes/estrutura/setores` - Módulo implementado, falta requests

---

## ✅ Proposta de Nova Estrutura (Hierárquica)

### Estrutura Completa

```
http-requests/
├── autenticacao/
│   ├── auth/
│   │   ├── login.http
│   │   ├── logout.http
│   │   ├── refresh-token.http
│   │   ├── validar-token.http
│   │   ├── setup-inicial.http
│   │   ├── setup-usuario-inicial.http
│   │   ├── alterar-senha.http
│   │   ├── recuperacao-senha.http
│   │   ├── perfil.http
│   │   └── fluxo-completo.http
│   ├── perfil/
│   │   ├── obter-perfil.http
│   │   ├── atualizar-perfil.http
│   │   ├── preferencias.http
│   │   ├── alterar-senha.http
│   │   └── historico-senhas.http
│   └── usuarios/
│       ├── criar-usuario.http
│       ├── listar-usuarios.http
│       ├── buscar-usuario.http
│       ├── atualizar-usuario.http
│       ├── gerenciar-senha.http
│       ├── gerenciar-status.http
│       └── exemplos-completos.http
│
├── cadastros/
│   ├── empresas/
│   │   ├── criar-empresa.http
│   │   ├── listar-empresas.http
│   │   ├── buscar-empresa.http
│   │   ├── atualizar-empresa.http
│   │   ├── gerenciar-status-empresa.http
│   │   └── exemplos-completos.http
│   ├── pacientes/
│   │   └── pacientes.http
│   ├── profissionais/
│   │   ├── criar-profissional.http
│   │   └── operacoes-profissional.http
│   └── unidade-saude/
│       ├── criar-unidade.http
│       ├── listar-unidades.http
│       ├── buscar-unidade.http
│       ├── atualizar-unidade.http
│       ├── gerenciar-status.http
│       ├── atualizar-cnaes.http
│       └── exemplos-completos.http
│
├── exames/
│   ├── amostras/                     # ← CRIAR
│   │   ├── criar-amostra.http
│   │   ├── listar-amostras.http
│   │   ├── buscar-amostra.http
│   │   ├── atualizar-amostra.http
│   │   ├── gerenciar-status.http
│   │   └── exemplos-completos.http
│   ├── exames/
│   │   ├── criar-exame.http
│   │   └── listar-exames.http
│   ├── formularios/
│   │   ├── criar-formulario.http
│   │   ├── listar-formularios.http
│   │   ├── buscar-formulario.http
│   │   ├── atualizar-formulario.http
│   │   ├── operacoes-formularios.http
│   │   └── exemplos-completos.http
│   ├── kits/                         # ← CRIAR
│   │   ├── criar-kit.http
│   │   ├── listar-kits.http
│   │   ├── buscar-kit.http
│   │   ├── atualizar-kit.http
│   │   ├── gerenciar-exames-kit.http
│   │   └── exemplos-completos.http
│   ├── matrizes/                     # ← CRIAR
│   │   ├── criar-matriz.http
│   │   ├── listar-matrizes.http
│   │   ├── buscar-matriz.http
│   │   ├── atualizar-matriz.http
│   │   ├── duplicar-matriz.http
│   │   ├── gerenciar-campos.http
│   │   └── exemplos-completos.http
│   └── metodos/
│       ├── criar-metodo.http
│       ├── listar-metodos.http
│       ├── buscar-metodo.http
│       ├── atualizar-metodo.http
│       └── laboratorio-metodo.http
│
├── relacionamento/
│   ├── convenios/
│   │   ├── criar-convenio.http
│   │   ├── listar-convenios.http
│   │   ├── criar-plano.http
│   │   ├── listar-planos.http
│   │   ├── criar-instrucao.http
│   │   └── listar-instrucoes.http
│   ├── fornecedores/                 # ← CRIAR
│   │   ├── criar-fornecedor.http
│   │   ├── listar-fornecedores.http
│   │   ├── buscar-fornecedor.http
│   │   ├── atualizar-fornecedor.http
│   │   └── exemplos-completos.http
│   ├── laboratorios/                 # ← CRIAR
│   │   ├── criar-laboratorio.http
│   │   ├── listar-laboratorios.http
│   │   ├── buscar-laboratorio.http
│   │   ├── atualizar-laboratorio.http
│   │   ├── vincular-metodos.http
│   │   └── exemplos-completos.http
│   ├── prestadores-servico/          # ← CRIAR
│   │   ├── criar-prestador.http
│   │   ├── listar-prestadores.http
│   │   ├── buscar-prestador.http
│   │   ├── atualizar-prestador.http
│   │   └── exemplos-completos.http
│   └── telemedicina/                 # ← CRIAR
│       ├── criar-telemedicina.http
│       ├── listar-telemedicinas.http
│       ├── buscar-telemedicina.http
│       ├── atualizar-telemedicina.http
│       ├── vincular-exames.http
│       └── exemplos-completos.http
│
├── atendimento/
│   ├── agendas/
│   │   ├── criar-agenda.http
│   │   └── operacoes-agenda.http
│   ├── atendimento/                  # ← CRIAR
│   │   ├── criar-atendimento.http
│   │   ├── listar-atendimentos.http
│   │   ├── buscar-atendimento.http
│   │   ├── atualizar-atendimento.http
│   │   └── exemplos-completos.http
│   └── integracoes/
│       ├── criar-integracao.http
│       ├── listar-integracoes.http
│       ├── buscar-integracao.http
│       ├── atualizar-integracao.http
│       ├── operacoes-integracoes.http
│       └── exemplos-completos.http
│
├── financeiro/
│   └── core/
│       ├── bancos.http
│       ├── contas-bancarias.http
│       ├── gateways-pagamento.http
│       └── plano-contas.http
│
├── infraestrutura/
│   ├── auditoria/
│   │   ├── buscar-logs.http
│   │   ├── consultas-especificas.http
│   │   ├── exemplos-completos.http
│   │   └── registrar-logs.http
│   ├── common/
│   │   ├── buscar-cep.http
│   │   ├── cnae.http
│   │   └── cnae-paginacao.http
│   └── email/                        # ← CRIAR
│       ├── enviar-email.http
│       ├── templates-email.http
│       └── exemplos-completos.http
│
└── configuracoes/
    └── estrutura/
        ├── equipamentos/             # ← CRIAR
        │   ├── criar-equipamento.http
        │   ├── listar-equipamentos.http
        │   ├── buscar-equipamento.http
        │   ├── atualizar-equipamento.http
        │   └── exemplos-completos.http
        ├── etiquetas-amostra/        # ← CRIAR
        │   ├── criar-etiqueta.http
        │   ├── listar-etiquetas.http
        │   ├── buscar-etiqueta.http
        │   ├── atualizar-etiqueta.http
        │   └── exemplos-completos.http
        ├── imobilizados/             # ← CRIAR
        │   ├── criar-imobilizado.http
        │   ├── listar-imobilizados.http
        │   ├── buscar-imobilizado.http
        │   ├── atualizar-imobilizado.http
        │   └── exemplos-completos.http
        ├── salas/                    # ← CRIAR
        │   ├── criar-sala.http
        │   ├── listar-salas.http
        │   ├── buscar-sala.http
        │   ├── atualizar-sala.http
        │   └── exemplos-completos.http
        └── setores/                  # ← CRIAR
            ├── criar-setor.http
            ├── listar-setores.http
            ├── buscar-setor.http
            ├── atualizar-setor.http
            └── exemplos-completos.http
```

---

## 🔄 Plano de Migração

### Fase 1: Criar Nova Estrutura de Pastas

```bash
# Criar estrutura hierárquica
mkdir -p http-requests/autenticacao/{auth,perfil,usuarios}
mkdir -p http-requests/cadastros/{empresas,pacientes,profissionais,unidade-saude}
mkdir -p http-requests/exames/{amostras,exames,formularios,kits,matrizes,metodos}
mkdir -p http-requests/relacionamento/{convenios,fornecedores,laboratorios,prestadores-servico,telemedicina}
mkdir -p http-requests/atendimento/{agendas,atendimento,integracoes}
mkdir -p http-requests/financeiro/core
mkdir -p http-requests/infraestrutura/{auditoria,common,email}
mkdir -p http-requests/configuracoes/estrutura/{equipamentos,etiquetas-amostra,imobilizados,salas,setores}
```

### Fase 2: Mover Arquivos Existentes

```bash
# Autenticação
mv http-requests/auth/* http-requests/autenticacao/auth/
mv http-requests/perfil/* http-requests/autenticacao/perfil/
mv http-requests/usuarios/* http-requests/autenticacao/usuarios/

# Cadastros
mv http-requests/empresas/* http-requests/cadastros/empresas/
mv http-requests/pacientes/* http-requests/cadastros/pacientes/
mv http-requests/profissionais/* http-requests/cadastros/profissionais/
mv http-requests/unidade-saude/* http-requests/cadastros/unidade-saude/

# Exames
mv http-requests/exames/* http-requests/exames/exames/
mv http-requests/formularios/* http-requests/exames/formularios/
mv http-requests/metodos/* http-requests/exames/metodos/

# Relacionamento
mv http-requests/convenios/* http-requests/relacionamento/convenios/

# Atendimento
mv http-requests/agendas/* http-requests/atendimento/agendas/
mv http-requests/integracoes/* http-requests/atendimento/integracoes/

# Financeiro
mv http-requests/financeiro/* http-requests/financeiro/core/

# Infraestrutura
mv http-requests/auditoria/* http-requests/infraestrutura/auditoria/
mv http-requests/common/* http-requests/infraestrutura/common/
```

### Fase 3: Criar Arquivos para Módulos Faltantes

#### 3.1 Exames/Amostras (6 arquivos)

- `criar-amostra.http`
- `listar-amostras.http`
- `buscar-amostra.http`
- `atualizar-amostra.http`
- `gerenciar-status.http`
- `exemplos-completos.http`

#### 3.2 Exames/Kits (6 arquivos)

- `criar-kit.http`
- `listar-kits.http`
- `buscar-kit.http`
- `atualizar-kit.http`
- `gerenciar-exames-kit.http`
- `exemplos-completos.http`

#### 3.3 Exames/Matrizes (7 arquivos)

- `criar-matriz.http`
- `listar-matrizes.http`
- `buscar-matriz.http`
- `atualizar-matriz.http`
- `duplicar-matriz.http`
- `gerenciar-campos.http`
- `exemplos-completos.http`

#### 3.4 Relacionamento/Fornecedores (5 arquivos)

- `criar-fornecedor.http`
- `listar-fornecedores.http`
- `buscar-fornecedor.http`
- `atualizar-fornecedor.http`
- `exemplos-completos.http`

#### 3.5 Relacionamento/Laboratórios (6 arquivos)

- `criar-laboratorio.http`
- `listar-laboratorios.http`
- `buscar-laboratorio.http`
- `atualizar-laboratorio.http`
- `vincular-metodos.http`
- `exemplos-completos.http`

#### 3.6 Relacionamento/Prestadores de Serviço (5 arquivos)

- `criar-prestador.http`
- `listar-prestadores.http`
- `buscar-prestador.http`
- `atualizar-prestador.http`
- `exemplos-completos.http`

#### 3.7 Relacionamento/Telemedicina (6 arquivos)

- `criar-telemedicina.http`
- `listar-telemedicinas.http`
- `buscar-telemedicina.http`
- `atualizar-telemedicina.http`
- `vincular-exames.http`
- `exemplos-completos.http`

#### 3.8 Atendimento/Atendimento (5 arquivos)

- `criar-atendimento.http`
- `listar-atendimentos.http`
- `buscar-atendimento.http`
- `atualizar-atendimento.http`
- `exemplos-completos.http`

#### 3.9 Infraestrutura/Email (3 arquivos)

- `enviar-email.http`
- `templates-email.http`
- `exemplos-completos.http`

#### 3.10 Configurações/Estrutura (5 módulos × 5 arquivos = 25 arquivos)

Para cada módulo (equipamentos, etiquetas-amostra, imobilizados, salas, setores):

- `criar-{modulo}.http`
- `listar-{modulo}.http`
- `buscar-{modulo}.http`
- `atualizar-{modulo}.http`
- `exemplos-completos.http`

**Total de arquivos a criar**: ~74 arquivos

### Fase 4: Remover Pastas Antigas

```bash
# Remover estrutura antiga (após validar migração)
rm -rf http-requests/auth
rm -rf http-requests/perfil
rm -rf http-requests/usuarios
rm -rf http-requests/empresas
rm -rf http-requests/pacientes
rm -rf http-requests/profissionais
rm -rf http-requests/unidade-saude
rm -rf http-requests/exames
rm -rf http-requests/formularios
rm -rf http-requests/metodos
rm -rf http-requests/convenios
rm -rf http-requests/agendas
rm -rf http-requests/integracoes
rm -rf http-requests/financeiro
rm -rf http-requests/auditoria
rm -rf http-requests/common
rm -rf http-requests/tipos-exame  # Verificar se ainda é usado
```

### Fase 5: Atualizar Documentação

- Atualizar `/http-requests/README.md`
- Atualizar `/CLAUDE.md` (seção "HTTP Request Files")
- Adicionar exemplos da nova estrutura

---

## 📝 Padrão de Nomenclatura dos Arquivos

### Operações CRUD

- `criar-{entidade}.http` - POST
- `listar-{entidade}.http` - GET (lista)
- `buscar-{entidade}.http` - GET (por ID)
- `atualizar-{entidade}.http` - PATCH
- `remover-{entidade}.http` - DELETE

### Operações Específicas

- `gerenciar-status.http` - Ativar/Desativar
- `vincular-{relacionamento}.http` - Relacionamentos N:N
- `operacoes-{entidade}.http` - Múltiplas operações
- `exemplos-completos.http` - Cenários completos de teste

---

## 🎯 Benefícios da Reorganização

### 1. Consistência

- Mesma estrutura de `src/modules/`
- Fácil navegação e localização

### 2. Escalabilidade

- Suporte a novos módulos
- Estrutura clara para crescimento

### 3. Manutenibilidade

- Arquivos agrupados por área funcional
- Facilita refatoração

### 4. Onboarding

- Desenvolvedores entendem a estrutura rapidamente
- Padrão consistente em todo o projeto

### 5. Descoberta

- Fácil identificar módulos sem requests
- Identificação de gaps de documentação

---

## ✅ Checklist de Implementação

### Preparação

- [ ] Fazer backup da pasta `http-requests/`
- [ ] Criar branch específica para reorganização
- [ ] Revisar documentação em `CLAUDE.md`

### Execução

- [ ] Criar estrutura de pastas hierárquica
- [ ] Mover arquivos existentes (77 arquivos)
- [ ] Criar arquivos para módulos faltantes (74 arquivos)
- [ ] Validar todas as requisições
- [ ] Atualizar variáveis de ambiente se necessário

### Documentação

- [ ] Atualizar `/http-requests/README.md`
- [ ] Atualizar `/CLAUDE.md`
- [ ] Criar guia de migração para equipe
- [ ] Atualizar `.vscode/settings.json` se necessário

### Validação

- [ ] Testar requisições de cada módulo
- [ ] Verificar variáveis de ambiente
- [ ] Validar com equipe
- [ ] Commit e push das mudanças

### Limpeza

- [ ] Remover pastas antigas
- [ ] Remover arquivos obsoletos
- [ ] Fazer commit final

---

## 📅 Estimativa de Tempo

| Fase      | Atividade                 | Tempo Estimado |
| --------- | ------------------------- | -------------- |
| 1         | Criar estrutura de pastas | 15 min         |
| 2         | Mover arquivos existentes | 30 min         |
| 3         | Criar arquivos faltantes  | 4-6 horas      |
| 4         | Remover pastas antigas    | 10 min         |
| 5         | Atualizar documentação    | 1 hora         |
| **Total** |                           | **~6-8 horas** |

---

## 🚀 Próximos Passos

1. **Validar proposta com Diego** ✋
2. Criar branch `feature/reorganizar-http-requests`
3. Executar Fases 1 e 2 (estrutura + migração)
4. Criar arquivos faltantes (Fase 3)
5. Testar todas as requisições
6. Atualizar documentação
7. Code review e merge

---

## 📌 Observações

- Esta reorganização **não afeta** o código da aplicação
- Apenas arquivos de teste `.http` serão movidos/criados
- Variáveis de ambiente em `.vscode/settings.json` permanecem iguais
- Estrutura flat atual será preservada em backup

---

**Documento criado em**: 2025-10-09
**Versão**: 1.0
**Status**: 🟡 Aguardando aprovação
