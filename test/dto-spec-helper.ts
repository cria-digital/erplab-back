import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

// Helper para criar testes básicos de DTOs
export function createDtoSpec(
  DtoClass: any,
  dtoName: string,
  validData: Record<string, any>,
  invalidCases: Array<{
    field: string;
    value: any;
    expectedError?: string;
  }> = [],
) {
  describe(`${dtoName}`, () => {
    it('deve ser definido', () => {
      expect(DtoClass).toBeDefined();
    });

    it('deve criar uma instância válida com dados corretos', async () => {
      const dto = plainToInstance(DtoClass, validData);
      const errors = await validate(dto as object);
      expect(errors).toHaveLength(0);
    });

    if (invalidCases.length > 0) {
      describe('validações', () => {
        invalidCases.forEach(({ field, value, expectedError }) => {
          it(`deve falhar quando ${field} é ${JSON.stringify(value)}`, async () => {
            const invalidData = { ...validData, [field]: value };
            const dto = plainToInstance(DtoClass, invalidData);
            const errors = await validate(dto as object);

            expect(errors.length).toBeGreaterThan(0);

            const fieldError = errors.find((error) => error.property === field);
            expect(fieldError).toBeDefined();

            if (expectedError) {
              const constraints = fieldError?.constraints || {};
              const hasExpectedError = Object.values(constraints).some((msg) =>
                msg.includes(expectedError),
              );
              expect(hasExpectedError).toBe(true);
            }
          });
        });
      });
    }

    it('deve ter todas as propriedades esperadas', () => {
      const dto = new DtoClass();
      Object.keys(validData).forEach((key) => {
        expect(dto).toHaveProperty(key);
      });
    });

    it('deve aplicar transformações corretamente', async () => {
      const dto = plainToInstance(DtoClass, validData);

      // Verifica se os tipos foram transformados corretamente
      Object.entries(validData).forEach(([key, value]) => {
        if (typeof value === 'string' && !isNaN(Number(value))) {
          // Se o valor pode ser número, verifica se foi transformado
          if (dto[key] !== value) {
            expect(typeof dto[key]).toBe('number');
          }
        }

        if (value === 'true' || value === 'false') {
          // Se o valor pode ser booleano, verifica se foi transformado
          if (dto[key] !== value) {
            expect(typeof dto[key]).toBe('boolean');
          }
        }
      });
    });
  });
}

// Helper específico para DTOs de criação
export function createCreateDtoSpec(
  DtoClass: any,
  dtoName: string,
  requiredFields: string[],
  optionalFields: string[] = [],
) {
  describe(`${dtoName}`, () => {
    it('deve ser definido', () => {
      expect(DtoClass).toBeDefined();
    });

    describe('campos obrigatórios', () => {
      requiredFields.forEach((field) => {
        it(`deve ter erro quando ${field} está ausente`, async () => {
          const data = {};
          requiredFields.forEach((f) => {
            if (f !== field) {
              data[f] = 'valor-teste';
            }
          });

          const dto = plainToInstance(DtoClass, data);
          const errors = await validate(dto as object);

          const fieldError = errors.find((error) => error.property === field);
          expect(fieldError).toBeDefined();
        });
      });
    });

    describe('campos opcionais', () => {
      optionalFields.forEach((field) => {
        it(`deve aceitar ${field} como opcional`, async () => {
          const data = {};
          requiredFields.forEach((f) => {
            data[f] = 'valor-teste';
          });

          const dto = plainToInstance(DtoClass, data);
          const errors = await validate(dto as object);

          const fieldError = errors.find((error) => error.property === field);
          expect(fieldError).toBeUndefined();
        });
      });
    });
  });
}

// Helper para DTOs de atualização (PartialType)
export function createUpdateDtoSpec(
  DtoClass: any,
  dtoName: string,
  allFields: string[],
) {
  describe(`${dtoName}`, () => {
    it('deve ser definido', () => {
      expect(DtoClass).toBeDefined();
    });

    it('deve aceitar atualização parcial', async () => {
      // Testa com apenas um campo
      const data = { [allFields[0]]: 'valor-atualizado' };
      const dto = plainToInstance(DtoClass, data);
      const errors = await validate(dto as object);

      expect(errors).toHaveLength(0);
    });

    it('deve aceitar todos os campos como opcionais', async () => {
      const dto = plainToInstance(DtoClass, {});
      const errors = await validate(dto as object);

      // Nenhum campo deve ser obrigatório em um DTO de atualização
      expect(errors).toHaveLength(0);
    });

    allFields.forEach((field) => {
      it(`deve aceitar atualização apenas do campo ${field}`, async () => {
        const data = { [field]: 'valor-novo' };
        const dto = plainToInstance(DtoClass, data);
        const errors = await validate(dto as object);

        expect(errors).toHaveLength(0);
      });
    });
  });
}
