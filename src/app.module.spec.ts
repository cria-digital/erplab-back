import { AppModule } from './app.module';

describe('AppModule', () => {
  it('deve ser definido', () => {
    expect(AppModule).toBeDefined();
  });

  it('deve ter a estrutura de módulo correta', () => {
    const moduleMetadata = Reflect.getMetadata('imports', AppModule);
    expect(moduleMetadata).toBeDefined();
    expect(Array.isArray(moduleMetadata)).toBe(true);
  });

  it('deve ter controllers definidos', () => {
    const controllers = Reflect.getMetadata('controllers', AppModule);
    expect(controllers).toBeDefined();
    expect(Array.isArray(controllers)).toBe(true);
    expect(controllers.length).toBeGreaterThan(0);
  });

  it('deve ter providers definidos', () => {
    const providers = Reflect.getMetadata('providers', AppModule);
    expect(providers).toBeDefined();
    expect(Array.isArray(providers)).toBe(true);
    expect(providers.length).toBeGreaterThan(0);
  });

  it('deve ter APP_GUARD configurado', () => {
    const providers = Reflect.getMetadata('providers', AppModule);
    const appGuardProvider = providers.find(
      (provider: any) => provider.provide === 'APP_GUARD',
    );
    expect(appGuardProvider).toBeDefined();
    expect(appGuardProvider.useClass).toBeDefined();
  });
});
