#!/bin/bash

# Script para corrigir imports após reorganização de módulos

echo "🔧 Corrigindo imports após reorganização..."

# Função para substituir em todos os arquivos .ts
fix_import() {
    local old_path="$1"
    local new_path="$2"
    echo "  Substituindo: $old_path -> $new_path"
    find src -name "*.ts" -type f -exec sed -i "s|'$old_path|'$new_path|g" {} +
    find src -name "*.ts" -type f -exec sed -i "s|\"$old_path|\"$new_path|g" {} +
}

# 1. AUTENTICAÇÃO
fix_import "modules/auth" "modules/autenticacao/auth"
fix_import "modules/usuarios" "modules/autenticacao/usuarios"
fix_import "modules/perfil" "modules/autenticacao/perfil"
fix_import "../auth/" "../../../autenticacao/auth/"
fix_import "../../auth/" "../../../autenticacao/auth/"
fix_import "../../../auth/" "../../../../autenticacao/auth/"

# 2. CADASTROS
fix_import "modules/pacientes" "modules/cadastros/pacientes"
fix_import "modules/profissionais" "modules/cadastros/profissionais"
fix_import "modules/unidade-saude" "modules/cadastros/unidade-saude"
fix_import "modules/empresas" "modules/cadastros/empresas"
fix_import "../pacientes/" "../../../cadastros/pacientes/"
fix_import "../../pacientes/" "../../../cadastros/pacientes/"
fix_import "../profissionais/" "../../../cadastros/profissionais/"
fix_import "../../profissionais/" "../../../cadastros/profissionais/"
fix_import "../unidade-saude/" "../../../cadastros/unidade-saude/"
fix_import "../../unidade-saude/" "../../../cadastros/unidade-saude/"
fix_import "../empresas/" "../../../cadastros/empresas/"
fix_import "../../empresas/" "../../../cadastros/empresas/"

# 3. EXAMES
fix_import "modules/exames" "modules/exames/exames"
fix_import "modules/formularios" "modules/exames/formularios"
fix_import "modules/kits" "modules/exames/kits"
fix_import "modules/metodos" "modules/exames/metodos"

# 4. RELACIONAMENTO
fix_import "modules/convenios" "modules/relacionamento/convenios"
fix_import "modules/laboratorios" "modules/relacionamento/laboratorios"
fix_import "modules/telemedicina" "modules/relacionamento/telemedicina"
fix_import "modules/fornecedores" "modules/relacionamento/fornecedores"
fix_import "modules/prestadores-servico" "modules/relacionamento/prestadores-servico"

# 5. ATENDIMENTO
fix_import "modules/atendimento" "modules/atendimento/atendimento"
fix_import "modules/agendas" "modules/atendimento/agendas"
fix_import "modules/integracoes" "modules/atendimento/integracoes"

# 6. FINANCEIRO
fix_import "modules/financeiro" "modules/financeiro/core"
fix_import "modules/contas-pagar" "modules/financeiro/core/contas-pagar"

# 7. INFRAESTRUTURA
fix_import "modules/auditoria" "modules/infraestrutura/auditoria"
fix_import "modules/common" "modules/infraestrutura/common"
fix_import "modules/email" "modules/infraestrutura/email"
fix_import "../auditoria/" "../../../infraestrutura/auditoria/"
fix_import "../../auditoria/" "../../../infraestrutura/auditoria/"
fix_import "../common/" "../../../infraestrutura/common/"
fix_import "../../common/" "../../../infraestrutura/common/"
fix_import "../email/" "../../../infraestrutura/email/"
fix_import "../../email/" "../../../infraestrutura/email/"

# Correções específicas para imports relativos
fix_import "../comum/" "../../../infraestrutura/common/"
fix_import "../../comum/" "../../../infraestrutura/common/"

echo "✅ Imports corrigidos!"
echo "🔨 Execute 'npm run build' para verificar"
