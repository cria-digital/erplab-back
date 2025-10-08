import { Test, TestingModule } from '@nestjs/testing';
import { PerfilController } from './perfil.controller';
import { PerfilService } from './perfil.service';

describe('PerfilController', () => {
  let controller: PerfilController;
  let service: PerfilService;

  const mockPerfilService = {
    obterPerfil: jest.fn(),
    atualizarPerfil: jest.fn(),
    obterPreferencias: jest.fn(),
    atualizarPreferencias: jest.fn(),
    alterarSenha: jest.fn(),
    obterHistoricoSenhas: jest.fn(),
  };

  const mockRequest = {
    user: {
      id: 'usuario-uuid',
      email: 'teste@example.com',
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PerfilController],
      providers: [
        {
          provide: PerfilService,
          useValue: mockPerfilService,
        },
      ],
    }).compile();

    controller = module.get<PerfilController>(PerfilController);
    service = module.get<PerfilService>(PerfilService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('obterPerfil', () => {
    it('deve retornar perfil do usuário', async () => {
      const mockPerfil = {
        id: 'usuario-uuid',
        nomeCompleto: 'Teste Usuario',
        email: 'teste@example.com',
      };

      mockPerfilService.obterPerfil.mockResolvedValue(mockPerfil);

      const result = await controller.obterPerfil(mockRequest as any);

      expect(result.message).toBe('Perfil obtido com sucesso');
      expect(result.data).toEqual(mockPerfil);
      expect(service.obterPerfil).toHaveBeenCalledWith('usuario-uuid');
    });
  });

  describe('atualizarPerfil', () => {
    it('deve atualizar perfil do usuário', async () => {
      const updateDto = { nomeCompleto: 'Novo Nome' };
      const mockPerfilAtualizado = { ...updateDto, id: 'usuario-uuid' };

      mockPerfilService.atualizarPerfil.mockResolvedValue(mockPerfilAtualizado);

      const result = await controller.atualizarPerfil(
        mockRequest as any,
        updateDto,
        '127.0.0.1',
      );

      expect(result.message).toBe('Perfil atualizado com sucesso');
      expect(result.data).toEqual(mockPerfilAtualizado);
      expect(service.atualizarPerfil).toHaveBeenCalledWith(
        'usuario-uuid',
        updateDto,
        '127.0.0.1',
      );
    });
  });

  describe('alterarSenha', () => {
    it('deve alterar senha do usuário', async () => {
      const alterarSenhaDto = {
        senhaAtual: 'SenhaAtual123!',
        novaSenha: 'NovaSenha456@',
        confirmarNovaSenha: 'NovaSenha456@',
      };

      mockPerfilService.alterarSenha.mockResolvedValue({
        message: 'Senha alterada com sucesso',
      });

      const result = await controller.alterarSenha(
        mockRequest as any,
        alterarSenhaDto,
        '127.0.0.1',
        'Mozilla/5.0',
      );

      expect(result.message).toBe('Senha alterada com sucesso');
      expect(service.alterarSenha).toHaveBeenCalledWith(
        'usuario-uuid',
        alterarSenhaDto,
        '127.0.0.1',
        'Mozilla/5.0',
      );
    });
  });
});
