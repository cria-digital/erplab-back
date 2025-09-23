#!/bin/bash

# Script para gerar automaticamente arquivos de teste
# Uso: ./generate-tests.sh <module-name> <test-type>
# Exemplo: ./generate-tests.sh usuarios service

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar argumentos
if [ $# -lt 2 ]; then
    echo -e "${RED}Erro: Argumentos insuficientes${NC}"
    echo "Uso: $0 <nome-modulo> <tipo-teste>"
    echo "Tipos disponíveis: service, controller, e2e, all"
    echo "Exemplo: $0 usuarios service"
    exit 1
fi

MODULE=$1
TYPE=$2
MODULE_PATH="src/modules/$MODULE"
TEST_PATH="test"
TEMPLATE_PATH="test-templates"

# Converter para PascalCase
MODULE_PASCAL=$(echo "$MODULE" | sed 's/-/_/g' | sed 's/_\([a-z]\)/\U\1/g' | sed 's/^./\U&/')

# Função para criar teste de service
create_service_test() {
    local SERVICE_FILE="$MODULE_PATH/$MODULE.service.spec.ts"

    if [ -f "$SERVICE_FILE" ]; then
        echo -e "${YELLOW}⚠️  Arquivo $SERVICE_FILE já existe. Pulando...${NC}"
        return
    fi

    echo -e "${GREEN}✅ Criando teste de service para $MODULE...${NC}"

    # Copiar template
    cp "$TEMPLATE_PATH/service.spec.template.ts" "$SERVICE_FILE"

    # Substituir placeholders
    sed -i "s/ModuloService/${MODULE_PASCAL}Service/g" "$SERVICE_FILE"
    sed -i "s/modulo\.service/${MODULE}.service/g" "$SERVICE_FILE"
    sed -i "s/Entidade/${MODULE_PASCAL}/g" "$SERVICE_FILE"
    sed -i "s/entidade\.entity/${MODULE}.entity/g" "$SERVICE_FILE"
    sed -i "s/CreateModuloDto/Create${MODULE_PASCAL}Dto/g" "$SERVICE_FILE"
    sed -i "s/UpdateModuloDto/Update${MODULE_PASCAL}Dto/g" "$SERVICE_FILE"
    sed -i "s/create-modulo/create-${MODULE}/g" "$SERVICE_FILE"
    sed -i "s/update-modulo/update-${MODULE}/g" "$SERVICE_FILE"

    echo -e "${GREEN}✅ Teste de service criado: $SERVICE_FILE${NC}"
}

# Função para criar teste de controller
create_controller_test() {
    local CONTROLLER_FILE="$MODULE_PATH/$MODULE.controller.spec.ts"

    if [ -f "$CONTROLLER_FILE" ]; then
        echo -e "${YELLOW}⚠️  Arquivo $CONTROLLER_FILE já existe. Pulando...${NC}"
        return
    fi

    echo -e "${GREEN}✅ Criando teste de controller para $MODULE...${NC}"

    cat > "$CONTROLLER_FILE" << EOF
import { Test, TestingModule } from '@nestjs/testing';
import { ${MODULE_PASCAL}Controller } from './${MODULE}.controller';
import { ${MODULE_PASCAL}Service } from './${MODULE}.service';

describe('${MODULE_PASCAL}Controller', () => {
  let controller: ${MODULE_PASCAL}Controller;
  let service: ${MODULE_PASCAL}Service;

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [${MODULE_PASCAL}Controller],
      providers: [
        {
          provide: ${MODULE_PASCAL}Service,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<${MODULE_PASCAL}Controller>(${MODULE_PASCAL}Controller);
    service = module.get<${MODULE_PASCAL}Service>(${MODULE_PASCAL}Service);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new entity', async () => {
      const dto = { nome: 'Test' };
      const expected = { id: '123', ...dto };

      mockService.create.mockResolvedValue(expected);

      const result = await controller.create(dto);

      expect(result).toEqual(expected);
      expect(mockService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return paginated results', async () => {
      const query = { page: 1, limit: 10 };
      const expected = { data: [], meta: { total: 0 } };

      mockService.findAll.mockResolvedValue(expected);

      const result = await controller.findAll(query);

      expect(result).toEqual(expected);
      expect(mockService.findAll).toHaveBeenCalledWith(query);
    });
  });

  describe('findOne', () => {
    it('should return a single entity', async () => {
      const id = '123';
      const expected = { id, nome: 'Test' };

      mockService.findOne.mockResolvedValue(expected);

      const result = await controller.findOne(id);

      expect(result).toEqual(expected);
      expect(mockService.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('update', () => {
    it('should update an entity', async () => {
      const id = '123';
      const dto = { nome: 'Updated' };
      const expected = { id, ...dto };

      mockService.update.mockResolvedValue(expected);

      const result = await controller.update(id, dto);

      expect(result).toEqual(expected);
      expect(mockService.update).toHaveBeenCalledWith(id, dto);
    });
  });

  describe('remove', () => {
    it('should remove an entity', async () => {
      const id = '123';

      mockService.remove.mockResolvedValue(undefined);

      await controller.remove(id);

      expect(mockService.remove).toHaveBeenCalledWith(id);
    });
  });
});
EOF

    echo -e "${GREEN}✅ Teste de controller criado: $CONTROLLER_FILE${NC}"
}

# Função para criar teste E2E
create_e2e_test() {
    local E2E_FILE="$TEST_PATH/${MODULE}.e2e-spec.ts"

    if [ -f "$E2E_FILE" ]; then
        echo -e "${YELLOW}⚠️  Arquivo $E2E_FILE já existe. Pulando...${NC}"
        return
    fi

    echo -e "${GREEN}✅ Criando teste E2E para $MODULE...${NC}"

    # Copiar template
    cp "$TEMPLATE_PATH/e2e.spec.template.ts" "$E2E_FILE"

    # Substituir placeholders
    sed -i "s/ModuloController/${MODULE_PASCAL}Controller/g" "$E2E_FILE"
    sed -i "s/modulo/${MODULE}/g" "$E2E_FILE"
    sed -i "s/Modulo/${MODULE_PASCAL}/g" "$E2E_FILE"

    echo -e "${GREEN}✅ Teste E2E criado: $E2E_FILE${NC}"
}

# Função para criar estrutura de testes completa
create_test_structure() {
    echo -e "${GREEN}📦 Criando estrutura de testes para o módulo $MODULE${NC}"

    # Verificar se o módulo existe
    if [ ! -d "$MODULE_PATH" ]; then
        echo -e "${RED}❌ Erro: Módulo $MODULE não encontrado em $MODULE_PATH${NC}"
        exit 1
    fi

    # Criar diretório de testes se não existir
    if [ ! -d "$TEST_PATH" ]; then
        mkdir -p "$TEST_PATH"
    fi

    case $TYPE in
        service)
            create_service_test
            ;;
        controller)
            create_controller_test
            ;;
        e2e)
            create_e2e_test
            ;;
        all)
            create_service_test
            create_controller_test
            create_e2e_test
            ;;
        *)
            echo -e "${RED}❌ Tipo de teste inválido: $TYPE${NC}"
            echo "Tipos válidos: service, controller, e2e, all"
            exit 1
            ;;
    esac
}

# Executar
create_test_structure

# Executar prettier nos arquivos criados
echo -e "${YELLOW}🎨 Formatando arquivos criados...${NC}"
npx prettier --write "$MODULE_PATH/*.spec.ts" 2>/dev/null
npx prettier --write "$TEST_PATH/${MODULE}.e2e-spec.ts" 2>/dev/null

echo -e "${GREEN}✨ Testes gerados com sucesso para o módulo $MODULE!${NC}"
echo ""
echo "Para executar os testes:"
echo -e "${YELLOW}  npm test -- $MODULE.service.spec.ts${NC}  # Teste de service"
echo -e "${YELLOW}  npm test -- $MODULE.controller.spec.ts${NC}  # Teste de controller"
echo -e "${YELLOW}  npm run test:e2e -- $MODULE${NC}  # Teste E2E"
echo ""
echo "Para ver cobertura:"
echo -e "${YELLOW}  npm run test:cov -- $MODULE${NC}"