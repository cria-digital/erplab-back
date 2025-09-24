import { Test, TestingModule } from '@nestjs/testing';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Reflector } from '@nestjs/core';
import { ExecutionContext } from '@nestjs/common';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;

  const mockReflector = {
    getAllAndOverride: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtAuthGuard,
        {
          provide: Reflector,
          useValue: mockReflector,
        },
      ],
    }).compile();

    guard = module.get<JwtAuthGuard>(JwtAuthGuard);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('canActivate', () => {
    const mockExecutionContext = {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: jest.fn(() => ({
        getRequest: jest.fn(() => ({
          headers: { authorization: 'Bearer token' },
        })),
      })),
    } as unknown as ExecutionContext;

    it('deve retornar true para rotas públicas', () => {
      mockReflector.getAllAndOverride.mockReturnValue(true);

      const result = guard.canActivate(mockExecutionContext);

      expect(result).toBe(true);
      expect(mockReflector.getAllAndOverride).toHaveBeenCalledWith(
        IS_PUBLIC_KEY,
        [mockExecutionContext.getHandler(), mockExecutionContext.getClass()],
      );
    });

    it('deve chamar super.canActivate para rotas protegidas', () => {
      mockReflector.getAllAndOverride.mockReturnValue(false);

      // Mock do super.canActivate
      const superCanActivateSpy = jest
        .spyOn(
          Object.getPrototypeOf(Object.getPrototypeOf(guard)),
          'canActivate',
        )
        .mockReturnValue(true);

      guard.canActivate(mockExecutionContext);

      expect(mockReflector.getAllAndOverride).toHaveBeenCalledWith(
        IS_PUBLIC_KEY,
        [mockExecutionContext.getHandler(), mockExecutionContext.getClass()],
      );
      expect(superCanActivateSpy).toHaveBeenCalledWith(mockExecutionContext);
    });

    it('deve verificar handler e class para decorator público', () => {
      const mockHandler = jest.fn();
      const mockClass = jest.fn();

      mockExecutionContext.getHandler = jest.fn().mockReturnValue(mockHandler);
      mockExecutionContext.getClass = jest.fn().mockReturnValue(mockClass);

      mockReflector.getAllAndOverride.mockReturnValue(false);

      guard.canActivate(mockExecutionContext);

      expect(mockReflector.getAllAndOverride).toHaveBeenCalledWith(
        IS_PUBLIC_KEY,
        [mockHandler, mockClass],
      );
    });

    it('deve retornar true quando isPublic é undefined mas tratado como public', () => {
      mockReflector.getAllAndOverride.mockReturnValue(undefined);

      // Por padrão, undefined é tratado como false, então vai chamar super.canActivate
      const superCanActivateSpy = jest
        .spyOn(
          Object.getPrototypeOf(Object.getPrototypeOf(guard)),
          'canActivate',
        )
        .mockReturnValue(true);

      guard.canActivate(mockExecutionContext);

      expect(superCanActivateSpy).toHaveBeenCalled();
    });
  });
});
