import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { PerfilService } from './perfil.service';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { PreferenciaUsuario } from './entities/preferencia-usuario.entity';
import { HistoricoSenha } from './entities/historico-senha.entity';
import { AuditoriaService } from '../../infraestrutura/auditoria/auditoria.service';

describe('PerfilService', () => {
  let service: PerfilService;
  let usuariosRepository: Repository<Usuario>;
  let preferenciasRepository: Repository<PreferenciaUsuario>;
  let historicoSenhasRepository: Repository<HistoricoSenha>;
  let auditoriaService: AuditoriaService;

  const mockUsuario = {
    id: 'usuario-uuid',
    nomeCompleto: 'Teste Usuario',
    email: 'teste@example.com',
    senhaHash: '$2b$10$hashedpassword',
    comparePassword: jest.fn(),
  };

  const mockPreferencias = {
    id: 'preferencia-uuid',
    usuarioId: 'usuario-uuid',
    notificarEmail: true,
    notificarWhatsapp: false,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PerfilService,
        {
          provide: getRepositoryToken(Usuario),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(PreferenciaUsuario),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(HistoricoSenha),
          useValue: {
            find: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: AuditoriaService,
          useValue: {
            registrarLog: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PerfilService>(PerfilService);
    usuariosRepository = module.get<Repository<Usuario>>(
      getRepositoryToken(Usuario),
    );
    preferenciasRepository = module.get<Repository<PreferenciaUsuario>>(
      getRepositoryToken(PreferenciaUsuario),
    );
    historicoSenhasRepository = module.get<Repository<HistoricoSenha>>(
      getRepositoryToken(HistoricoSenha),
    );
    auditoriaService = module.get<AuditoriaService>(AuditoriaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('obterPerfil', () => {
    it('deve retornar perfil completo do usuário', async () => {
      jest
        .spyOn(usuariosRepository, 'findOne')
        .mockResolvedValue(mockUsuario as any);
      jest
        .spyOn(preferenciasRepository, 'findOne')
        .mockResolvedValue(mockPreferencias as any);

      const result = await service.obterPerfil('usuario-uuid');

      expect(result).toBeDefined();
      expect(result.id).toBe('usuario-uuid');
      expect(result.preferencias).toBeDefined();
      expect((result as any).senhaHash).toBeUndefined(); // Não deve retornar senha
    });

    it('deve criar preferências se não existir', async () => {
      jest
        .spyOn(usuariosRepository, 'findOne')
        .mockResolvedValue(mockUsuario as any);
      jest.spyOn(preferenciasRepository, 'findOne').mockResolvedValue(null);
      jest
        .spyOn(preferenciasRepository, 'create')
        .mockReturnValue(mockPreferencias as any);
      jest
        .spyOn(preferenciasRepository, 'save')
        .mockResolvedValue(mockPreferencias as any);

      const result = await service.obterPerfil('usuario-uuid');

      expect(preferenciasRepository.create).toHaveBeenCalled();
      expect(preferenciasRepository.save).toHaveBeenCalled();
      expect(result.preferencias).toBeDefined();
    });

    it('deve lançar NotFoundException se usuário não existir', async () => {
      jest.spyOn(usuariosRepository, 'findOne').mockResolvedValue(null);

      await expect(service.obterPerfil('usuario-invalido')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('atualizarPerfil', () => {
    it('deve atualizar dados do perfil', async () => {
      const updateDto = { nomeCompleto: 'Novo Nome' };
      jest
        .spyOn(usuariosRepository, 'findOne')
        .mockResolvedValue(mockUsuario as any);
      jest.spyOn(usuariosRepository, 'save').mockResolvedValue({
        ...mockUsuario,
        ...updateDto,
      } as any);

      const result = await service.atualizarPerfil('usuario-uuid', updateDto);

      expect(result.nomeCompleto).toBe('Novo Nome');
      expect(auditoriaService.registrarLog).toHaveBeenCalled();
    });
  });

  describe('alterarSenha', () => {
    it('deve alterar senha com sucesso', async () => {
      const alterarSenhaDto = {
        senhaAtual: 'SenhaAtual123!',
        novaSenha: 'NovaSenha456@',
        confirmarNovaSenha: 'NovaSenha456@',
      };

      mockUsuario.comparePassword.mockResolvedValue(true);
      jest
        .spyOn(usuariosRepository, 'findOne')
        .mockResolvedValue(mockUsuario as any);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);
      jest.spyOn(historicoSenhasRepository, 'find').mockResolvedValue([]);
      jest
        .spyOn(historicoSenhasRepository, 'create')
        .mockReturnValue({} as any);
      jest
        .spyOn(historicoSenhasRepository, 'save')
        .mockResolvedValue({} as any);
      jest
        .spyOn(usuariosRepository, 'save')
        .mockResolvedValue(mockUsuario as any);

      const result = await service.alterarSenha(
        'usuario-uuid',
        alterarSenhaDto,
      );

      expect(result.message).toBe('Senha alterada com sucesso');
      expect(auditoriaService.registrarLog).toHaveBeenCalled();
    });

    it('deve lançar erro se senhas não conferem', async () => {
      const alterarSenhaDto = {
        senhaAtual: 'SenhaAtual123!',
        novaSenha: 'NovaSenha456@',
        confirmarNovaSenha: 'SenhaDiferente789#',
      };

      await expect(
        service.alterarSenha('usuario-uuid', alterarSenhaDto),
      ).rejects.toThrow(BadRequestException);
    });

    it('deve lançar erro se senha atual incorreta', async () => {
      const alterarSenhaDto = {
        senhaAtual: 'SenhaErrada123!',
        novaSenha: 'NovaSenha456@',
        confirmarNovaSenha: 'NovaSenha456@',
      };

      mockUsuario.comparePassword.mockResolvedValue(false);
      jest
        .spyOn(usuariosRepository, 'findOne')
        .mockResolvedValue(mockUsuario as any);

      await expect(
        service.alterarSenha('usuario-uuid', alterarSenhaDto),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
