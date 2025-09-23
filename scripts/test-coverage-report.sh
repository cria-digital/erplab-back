#!/bin/bash

# Script para gerar relatório de cobertura de testes
# Uso: ./test-coverage-report.sh

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}         📊 RELATÓRIO DE COBERTURA DE TESTES - ERP LAB         ${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════════════${NC}"
echo ""

# Função para verificar cobertura de um módulo
check_module_coverage() {
    local MODULE=$1
    local MODULE_PATH="src/modules/$MODULE"
    local HAS_SERVICE=false
    local HAS_CONTROLLER=false
    local SERVICE_TEST_EXISTS=false
    local CONTROLLER_TEST_EXISTS=false
    local E2E_TEST_EXISTS=false

    # Verificar se módulo existe
    if [ ! -d "$MODULE_PATH" ]; then
        return
    fi

    # Verificar se tem service
    if [ -f "$MODULE_PATH/$MODULE.service.ts" ]; then
        HAS_SERVICE=true
        if [ -f "$MODULE_PATH/$MODULE.service.spec.ts" ]; then
            SERVICE_TEST_EXISTS=true
        fi
    fi

    # Verificar se tem controller
    if [ -f "$MODULE_PATH/$MODULE.controller.ts" ]; then
        HAS_CONTROLLER=true
        if [ -f "$MODULE_PATH/$MODULE.controller.spec.ts" ]; then
            CONTROLLER_TEST_EXISTS=true
        fi
    fi

    # Verificar teste E2E
    if [ -f "test/${MODULE}.e2e-spec.ts" ]; then
        E2E_TEST_EXISTS=true
    fi

    # Calcular status
    local STATUS="${RED}❌${NC}"
    local COVERAGE="0%"

    if $HAS_SERVICE || $HAS_CONTROLLER; then
        local TOTAL=0
        local TESTED=0

        if $HAS_SERVICE; then
            TOTAL=$((TOTAL + 1))
            if $SERVICE_TEST_EXISTS; then
                TESTED=$((TESTED + 1))
            fi
        fi

        if $HAS_CONTROLLER; then
            TOTAL=$((TOTAL + 1))
            if $CONTROLLER_TEST_EXISTS; then
                TESTED=$((TESTED + 1))
            fi
        fi

        if [ $TOTAL -gt 0 ]; then
            local PERCENT=$((TESTED * 100 / TOTAL))
            COVERAGE="${PERCENT}%"

            if [ $PERCENT -eq 100 ]; then
                STATUS="${GREEN}✅${NC}"
            elif [ $PERCENT -gt 0 ]; then
                STATUS="${YELLOW}⚠️${NC}"
            fi
        fi
    fi

    # Mostrar resultado
    printf "%-20s %s  " "$MODULE" "$STATUS"
    printf "Service: "
    if $HAS_SERVICE; then
        if $SERVICE_TEST_EXISTS; then
            printf "${GREEN}✓${NC} "
        else
            printf "${RED}✗${NC} "
        fi
    else
        printf "- "
    fi

    printf "Controller: "
    if $HAS_CONTROLLER; then
        if $CONTROLLER_TEST_EXISTS; then
            printf "${GREEN}✓${NC} "
        else
            printf "${RED}✗${NC} "
        fi
    else
        printf "- "
    fi

    printf "E2E: "
    if $E2E_TEST_EXISTS; then
        printf "${GREEN}✓${NC} "
    else
        printf "${RED}✗${NC} "
    fi

    printf "Coverage: "
    if [ "$COVERAGE" = "100%" ]; then
        printf "${GREEN}%s${NC}\n" "$COVERAGE"
    elif [ "$COVERAGE" = "0%" ]; then
        printf "${RED}%s${NC}\n" "$COVERAGE"
    else
        printf "${YELLOW}%s${NC}\n" "$COVERAGE"
    fi
}

# Listar todos os módulos
echo -e "${BLUE}📁 Analisando módulos...${NC}"
echo ""

MODULES=$(ls -d src/modules/*/ 2>/dev/null | xargs -n 1 basename)

for MODULE in $MODULES; do
    check_module_coverage "$MODULE"
done

echo ""
echo -e "${CYAN}───────────────────────────────────────────────────────────────${NC}"

# Estatísticas gerais
TOTAL_MODULES=$(echo "$MODULES" | wc -w)
MODULES_WITH_TESTS=0
TOTAL_SERVICE_FILES=0
TOTAL_SERVICE_TESTS=0
TOTAL_CONTROLLER_FILES=0
TOTAL_CONTROLLER_TESTS=0
TOTAL_E2E_TESTS=0

for MODULE in $MODULES; do
    MODULE_PATH="src/modules/$MODULE"
    HAS_TEST=false

    if [ -f "$MODULE_PATH/$MODULE.service.ts" ]; then
        TOTAL_SERVICE_FILES=$((TOTAL_SERVICE_FILES + 1))
        if [ -f "$MODULE_PATH/$MODULE.service.spec.ts" ]; then
            TOTAL_SERVICE_TESTS=$((TOTAL_SERVICE_TESTS + 1))
            HAS_TEST=true
        fi
    fi

    if [ -f "$MODULE_PATH/$MODULE.controller.ts" ]; then
        TOTAL_CONTROLLER_FILES=$((TOTAL_CONTROLLER_FILES + 1))
        if [ -f "$MODULE_PATH/$MODULE.controller.spec.ts" ]; then
            TOTAL_CONTROLLER_TESTS=$((TOTAL_CONTROLLER_TESTS + 1))
            HAS_TEST=true
        fi
    fi

    if [ -f "test/${MODULE}.e2e-spec.ts" ]; then
        TOTAL_E2E_TESTS=$((TOTAL_E2E_TESTS + 1))
        HAS_TEST=true
    fi

    if $HAS_TEST; then
        MODULES_WITH_TESTS=$((MODULES_WITH_TESTS + 1))
    fi
done

echo ""
echo -e "${MAGENTA}📊 ESTATÍSTICAS GERAIS${NC}"
echo -e "───────────────────────────────────────"
echo -e "Total de Módulos:        ${CYAN}$TOTAL_MODULES${NC}"
echo -e "Módulos com Testes:      ${CYAN}$MODULES_WITH_TESTS${NC} ($(($MODULES_WITH_TESTS * 100 / $TOTAL_MODULES))%)"
echo ""
echo -e "Services:                ${CYAN}$TOTAL_SERVICE_FILES${NC}"
echo -e "Services Testados:       ${CYAN}$TOTAL_SERVICE_TESTS${NC} ($(($TOTAL_SERVICE_TESTS * 100 / ($TOTAL_SERVICE_FILES + 1)))%)"
echo ""
echo -e "Controllers:             ${CYAN}$TOTAL_CONTROLLER_FILES${NC}"
echo -e "Controllers Testados:    ${CYAN}$TOTAL_CONTROLLER_TESTS${NC} ($(($TOTAL_CONTROLLER_TESTS * 100 / ($TOTAL_CONTROLLER_FILES + 1)))%)"
echo ""
echo -e "Testes E2E:              ${CYAN}$TOTAL_E2E_TESTS${NC}"
echo ""

# Calcular cobertura geral
TOTAL_FILES=$((TOTAL_SERVICE_FILES + TOTAL_CONTROLLER_FILES))
TOTAL_TESTED=$((TOTAL_SERVICE_TESTS + TOTAL_CONTROLLER_TESTS))
OVERALL_COVERAGE=0

if [ $TOTAL_FILES -gt 0 ]; then
    OVERALL_COVERAGE=$((TOTAL_TESTED * 100 / TOTAL_FILES))
fi

echo -e "${CYAN}───────────────────────────────────────────────────────────────${NC}"
echo ""

# Status da cobertura
if [ $OVERALL_COVERAGE -ge 80 ]; then
    echo -e "${GREEN}✅ COBERTURA GERAL: ${OVERALL_COVERAGE}% - Excelente!${NC}"
elif [ $OVERALL_COVERAGE -ge 60 ]; then
    echo -e "${YELLOW}⚠️  COBERTURA GERAL: ${OVERALL_COVERAGE}% - Pode melhorar${NC}"
else
    echo -e "${RED}❌ COBERTURA GERAL: ${OVERALL_COVERAGE}% - Precisa melhorar!${NC}"
fi

echo ""
echo -e "${CYAN}═══════════════════════════════════════════════════════════════${NC}"

# Recomendações
echo ""
echo -e "${BLUE}💡 RECOMENDAÇÕES:${NC}"

# Listar módulos sem testes
MODULES_WITHOUT_TESTS=""
for MODULE in $MODULES; do
    MODULE_PATH="src/modules/$MODULE"
    HAS_ANY_TEST=false

    if [ -f "$MODULE_PATH/$MODULE.service.spec.ts" ] || \
       [ -f "$MODULE_PATH/$MODULE.controller.spec.ts" ] || \
       [ -f "test/${MODULE}.e2e-spec.ts" ]; then
        HAS_ANY_TEST=true
    fi

    if ! $HAS_ANY_TEST && [ -d "$MODULE_PATH" ]; then
        if [ -f "$MODULE_PATH/$MODULE.service.ts" ] || [ -f "$MODULE_PATH/$MODULE.controller.ts" ]; then
            MODULES_WITHOUT_TESTS="$MODULES_WITHOUT_TESTS $MODULE"
        fi
    fi
done

if [ -n "$MODULES_WITHOUT_TESTS" ]; then
    echo ""
    echo -e "${RED}Módulos sem nenhum teste:${NC}"
    for MODULE in $MODULES_WITHOUT_TESTS; do
        echo -e "  ${YELLOW}→${NC} $MODULE"
        echo -e "    Execute: ${CYAN}./scripts/generate-tests.sh $MODULE all${NC}"
    done
fi

# Módulos prioritários
echo ""
echo -e "${YELLOW}Módulos prioritários para testes:${NC}"
echo -e "  1. ${MAGENTA}auth${NC} - Crítico para segurança"
echo -e "  2. ${MAGENTA}usuarios${NC} - Core do sistema"
echo -e "  3. ${MAGENTA}pacientes${NC} - Dados sensíveis"
echo -e "  4. ${MAGENTA}exames${NC} - Lógica de negócio complexa"

echo ""
echo -e "${GREEN}Para gerar relatório detalhado de cobertura:${NC}"
echo -e "  ${CYAN}npm run test:cov${NC}"
echo ""
echo -e "${GREEN}Para gerar testes para um módulo:${NC}"
echo -e "  ${CYAN}./scripts/generate-tests.sh <modulo> all${NC}"
echo ""