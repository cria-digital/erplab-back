// Helper para criar testes básicos de módulos
export function createModuleSpec(ModuleClass: any, moduleName: string) {
  describe(`${moduleName}`, () => {
    it('deve ser definido', () => {
      expect(ModuleClass).toBeDefined();
    });

    it('deve ter metadados de módulo', () => {
      const imports = Reflect.getMetadata('imports', ModuleClass);
      const controllers = Reflect.getMetadata('controllers', ModuleClass);
      const providers = Reflect.getMetadata('providers', ModuleClass);
      const exports = Reflect.getMetadata('exports', ModuleClass);

      // Pelo menos um desses deve estar definido
      const hasMetadata = imports || controllers || providers || exports;
      expect(hasMetadata).toBeTruthy();
    });

    it('deve ter imports como array se definido', () => {
      const imports = Reflect.getMetadata('imports', ModuleClass);
      if (imports) {
        expect(Array.isArray(imports)).toBe(true);
      }
    });

    it('deve ter controllers como array se definido', () => {
      const controllers = Reflect.getMetadata('controllers', ModuleClass);
      if (controllers) {
        expect(Array.isArray(controllers)).toBe(true);
      }
    });

    it('deve ter providers como array se definido', () => {
      const providers = Reflect.getMetadata('providers', ModuleClass);
      if (providers) {
        expect(Array.isArray(providers)).toBe(true);
      }
    });

    it('deve ter exports como array se definido', () => {
      const exports = Reflect.getMetadata('exports', ModuleClass);
      if (exports) {
        expect(Array.isArray(exports)).toBe(true);
      }
    });
  });
}
