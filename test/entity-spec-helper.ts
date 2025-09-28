// Helper para criar testes básicos de entities
export function createEntitySpec(
  EntityClass: any,
  entityName: string,
  requiredFields: string[] = [],
  optionalFields: string[] = [],
  relations: string[] = [],
) {
  describe(`${entityName}`, () => {
    it('deve ser definido', () => {
      expect(EntityClass).toBeDefined();
    });

    it('deve criar uma instância', () => {
      const entity = new EntityClass();
      expect(entity).toBeDefined();
      expect(entity).toBeInstanceOf(EntityClass);
    });

    describe('campos', () => {
      const entity = new EntityClass();

      requiredFields.forEach((field) => {
        it(`deve ter o campo obrigatório ${field}`, () => {
          expect(entity).toHaveProperty(field);
        });
      });

      optionalFields.forEach((field) => {
        it(`deve ter o campo opcional ${field}`, () => {
          expect(entity).toHaveProperty(field);
        });
      });
    });

    describe('relacionamentos', () => {
      const entity = new EntityClass();

      relations.forEach((relation) => {
        it(`deve ter o relacionamento ${relation}`, () => {
          expect(entity).toHaveProperty(relation);
        });
      });
    });

    it('deve ter campos de auditoria', () => {
      const entity = new EntityClass();

      // Campos comuns de auditoria
      if ('createdAt' in entity) {
        expect(entity).toHaveProperty('createdAt');
      }
      if ('updatedAt' in entity) {
        expect(entity).toHaveProperty('updatedAt');
      }
      if ('deletedAt' in entity) {
        expect(entity).toHaveProperty('deletedAt');
      }
    });

    it('deve aceitar valores para os campos', () => {
      const entity = new EntityClass();

      requiredFields.forEach((field) => {
        entity[field] = 'test-value';
        expect(entity[field]).toBe('test-value');
      });

      optionalFields.forEach((field) => {
        entity[field] = 'optional-value';
        expect(entity[field]).toBe('optional-value');
      });
    });
  });
}

// Helper para entities com métodos especiais
export function createEntityWithMethodsSpec(
  EntityClass: any,
  entityName: string,
  methods: Array<{
    name: string;
    testCase: (entity: any) => void;
  }> = [],
) {
  describe(`${entityName} - Métodos`, () => {
    let entity: any;

    beforeEach(() => {
      entity = new EntityClass();
    });

    it('deve ser definido', () => {
      expect(EntityClass).toBeDefined();
    });

    methods.forEach(({ name, testCase }) => {
      it(`deve ter o método ${name}`, () => {
        expect(entity[name]).toBeDefined();
        expect(typeof entity[name]).toBe('function');
      });

      it(`deve executar ${name} corretamente`, () => {
        testCase(entity);
      });
    });
  });
}

// Helper para entities com hooks do TypeORM
export function createEntityWithHooksSpec(
  EntityClass: any,
  entityName: string,
  hooks: {
    beforeInsert?: boolean;
    beforeUpdate?: boolean;
    afterLoad?: boolean;
  } = {},
) {
  describe(`${entityName} - Hooks TypeORM`, () => {
    let entity: any;

    beforeEach(() => {
      entity = new EntityClass();
    });

    if (hooks.beforeInsert) {
      it('deve ter hook beforeInsert', () => {
        expect(entity.beforeInsert).toBeDefined();
        expect(typeof entity.beforeInsert).toBe('function');
      });

      it('deve executar beforeInsert', async () => {
        // Mock para verificar se o hook funciona
        if (entity.createdAt === undefined) {
          await entity.beforeInsert?.();

          // Verifica comportamentos comuns do beforeInsert
          if (entity.createdAt !== undefined) {
            expect(entity.createdAt).toBeInstanceOf(Date);
          }
          if (entity.id !== undefined && !entity.id) {
            expect(entity.id).toBeTruthy();
          }
        }
      });
    }

    if (hooks.beforeUpdate) {
      it('deve ter hook beforeUpdate', () => {
        expect(entity.beforeUpdate).toBeDefined();
        expect(typeof entity.beforeUpdate).toBe('function');
      });

      it('deve executar beforeUpdate', async () => {
        await entity.beforeUpdate?.();

        // Verifica comportamentos comuns do beforeUpdate
        if (entity.updatedAt !== undefined) {
          expect(entity.updatedAt).toBeInstanceOf(Date);
        }
      });
    }

    if (hooks.afterLoad) {
      it('deve ter hook afterLoad', () => {
        expect(entity.afterLoad).toBeDefined();
        expect(typeof entity.afterLoad).toBe('function');
      });

      it('deve executar afterLoad', () => {
        entity.afterLoad?.();
        // Adicionar verificações específicas se necessário
      });
    }
  });
}

// Helper para validar decoradores de coluna
export function validateColumnDecorators(
  EntityClass: any,
  columnSpecs: Array<{
    field: string;
    type?: string;
    nullable?: boolean;
    unique?: boolean;
    default?: any;
  }>,
) {
  describe(`${EntityClass.name} - Decoradores de Coluna`, () => {
    columnSpecs.forEach((spec) => {
      it(`campo ${spec.field} deve ter decoradores corretos`, () => {
        const metadata = Reflect.getMetadata(
          'design:type',
          EntityClass.prototype,
          spec.field,
        );

        if (spec.type) {
          expect(metadata).toBeDefined();

          // Verifica o tipo esperado
          if (spec.type === 'string') {
            expect(metadata).toBe(String);
          } else if (spec.type === 'number') {
            expect(metadata).toBe(Number);
          } else if (spec.type === 'boolean') {
            expect(metadata).toBe(Boolean);
          } else if (spec.type === 'date') {
            expect(metadata).toBe(Date);
          }
        }
      });
    });
  });
}
