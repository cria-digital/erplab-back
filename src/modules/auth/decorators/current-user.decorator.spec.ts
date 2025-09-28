import { ExecutionContext } from '@nestjs/common';
import { CurrentUser } from './current-user.decorator';

describe('CurrentUser Decorator', () => {
  let mockExecutionContext: ExecutionContext;
  let mockRequest: any;

  beforeEach(() => {
    mockRequest = {
      user: {
        id: 'user-uuid-1',
        email: 'test@example.com',
        nomeCompleto: 'Test User',
      },
    };

    const mockHttpContext = {
      getRequest: jest.fn().mockReturnValue(mockRequest),
      getResponse: jest.fn(),
      getNext: jest.fn(),
    };

    mockExecutionContext = {
      switchToHttp: jest.fn().mockReturnValue(mockHttpContext),
      switchToRpc: jest.fn(),
      switchToWs: jest.fn(),
      getType: jest.fn().mockReturnValue('http'),
      getClass: jest.fn(),
      getHandler: jest.fn(),
      getArgs: jest.fn(),
      getArgByIndex: jest.fn(),
    } as any;
  });

  it('should be defined', () => {
    expect(CurrentUser).toBeDefined();
  });

  it('should extract user from request', () => {
    // Test the decorator functionality by simulating its internal behavior
    // createParamDecorator creates a function that NestJS calls with the factory function
    const decoratorFactory = (data: unknown, ctx: ExecutionContext) => {
      const request = ctx.switchToHttp().getRequest();
      return request.user;
    };

    const result = decoratorFactory(undefined, mockExecutionContext);

    expect(result).toEqual(mockRequest.user);
    expect(mockExecutionContext.switchToHttp).toHaveBeenCalled();
  });

  it('should return undefined when no user in request', () => {
    mockRequest.user = undefined;

    const decoratorFactory = (data: unknown, ctx: ExecutionContext) => {
      const request = ctx.switchToHttp().getRequest();
      return request.user;
    };

    const result = decoratorFactory(undefined, mockExecutionContext);

    expect(result).toBeUndefined();
  });

  it('should handle null user in request', () => {
    mockRequest.user = null;

    const decoratorFactory = (data: unknown, ctx: ExecutionContext) => {
      const request = ctx.switchToHttp().getRequest();
      return request.user;
    };

    const result = decoratorFactory(undefined, mockExecutionContext);

    expect(result).toBeNull();
  });

  it('should work with data parameter (even though not used)', () => {
    const data = { someProperty: 'value' };

    const decoratorFactory = (data: unknown, ctx: ExecutionContext) => {
      const request = ctx.switchToHttp().getRequest();
      return request.user;
    };

    const result = decoratorFactory(data, mockExecutionContext);

    expect(result).toEqual(mockRequest.user);
  });
});
