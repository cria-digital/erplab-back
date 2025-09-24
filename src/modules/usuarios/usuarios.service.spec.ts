import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  NotFoundException,
  ConflictException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { Usuario } from './entities/usuario.entity';
import { UsuarioUnidade } from './entities/usuario-unidade.entity';
import { UsuarioPermissao } from './entities/usuario-permissao.entity';
import { AuditoriaService } from '../auditoria/auditoria.service';
import * as bcrypt from 'bcrypt';

describe('UsuariosService', () => {
  let service: UsuariosService;

  let mockQueryBuilder;

  const mockUsuarioRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn((dto) => dto),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
    createQueryBuilder: jest.fn(() => mockQueryBuilder),
  };

  const mockUsuarioUnidadeRepository = {
    find: jest.fn(),
    create: jest.fn((dto) => dto),
    save: jest.fn(),
    delete: jest.fn(),
  };

  const mockUsuarioPermissaoRepository = {
    find: jest.fn(),
    create: jest.fn((dto) => dto),
    save: jest.fn(),
    delete: jest.fn(),
  };

  const mockAuditoriaService = {
    registrar: jest.fn(),
    registrarAlteracao: jest.fn(),
    registrarAcesso: jest.fn(),
  };

  beforeEach(async () => {
    // Reset mockQueryBuilder before each test
    mockQueryBuilder = {
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
      getOne: jest.fn(),
      getMany: jest.fn(),
      getCount: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsuariosService,
        {
          provide: getRepositoryToken(Usuario),
          useValue: mockUsuarioRepository,
        },
        {
          provide: getRepositoryToken(UsuarioUnidade),
          useValue: mockUsuarioUnidadeRepository,
        },
        {
          provide: getRepositoryToken(UsuarioPermissao),
          useValue: mockUsuarioPermissaoRepository,
        },
        {
          provide: AuditoriaService,
          useValue: mockAuditoriaService,
        },
      ],
    }).compile();

    service = module.get<UsuariosService>(UsuariosService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('deve criar um usuário com sucesso', async () => {
      const createDto = {
        nomeCompleto: 'João da Silva',
        email: 'joao@example.com',
        cpf: '123.456.789-00',
        senha: 'Senha123!',
        cargo: 'Médico',
        telefone: '(11) 98765-4321',
      };

      const hashedPassword = 'hashed_password';
      jest
        .spyOn(bcrypt, 'hash')
        .mockImplementation(() => Promise.resolve(hashedPassword));

      const mockUser = {
        hashRespostaRecuperacao: jest.fn(),
      };
      mockUser.hashRespostaRecuperacao.mockResolvedValue(undefined);

      const savedUser = {
        id: 'uuid-123',
        ...createDto,
        senhaHash: hashedPassword,
        ativo: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUsuarioRepository.findOne.mockResolvedValue(null); // Nenhum usuário existente
      mockUsuarioRepository.create.mockReturnValue(mockUser);
      mockUsuarioRepository.save.mockResolvedValue(savedUser);

      const result = await service.create(createDto, 'admin-id');

      expect(result).toEqual(savedUser);
      expect(mockUsuarioRepository.save).toHaveBeenCalledWith(mockUser);
      expect(mockAuditoriaService.registrarAlteracao).toHaveBeenCalled();
    });

    it('deve lançar erro ao criar usuário com email duplicado', async () => {
      const createDto = {
        nomeCompleto: 'João da Silva',
        email: 'existente@example.com',
        cpf: '123.456.789-00',
        senha: 'Senha123!',
        cargo: 'Médico',
      };

      mockUsuarioRepository.findOne.mockResolvedValue({ id: 'existing-id' });

      await expect(service.create(createDto, 'admin-id')).rejects.toThrow(
        ConflictException,
      );
    });

    it('deve lançar erro ao criar usuário com CPF duplicado', async () => {
      const createDto = {
        nomeCompleto: 'João da Silva',
        email: 'novo@example.com',
        cpf: '123.456.789-00',
        senha: 'Senha123!',
        cargo: 'Médico',
      };

      mockUsuarioRepository.findOne
        .mockResolvedValueOnce(null) // Email não existe
        .mockResolvedValueOnce({ id: 'existing-cpf' }); // CPF existe

      await expect(service.create(createDto, 'admin-id')).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('findAll', () => {
    it('deve retornar lista paginada de usuários', async () => {
      const usuarios = [
        { id: '1', nomeCompleto: 'User 1', email: 'user1@example.com' },
        { id: '2', nomeCompleto: 'User 2', email: 'user2@example.com' },
      ];

      mockQueryBuilder.getManyAndCount.mockResolvedValue([usuarios, 2]);

      const result = await service.findAll({ page: 1, limit: 10 });

      expect(result).toEqual({
        data: usuarios,
        total: 2,
        page: 1,
        limit: 10,
        totalPages: 1,
      });
    });

    it('deve aplicar filtros corretamente', async () => {
      mockQueryBuilder.getManyAndCount.mockResolvedValue([[], 0]);

      await service.findAll({
        page: 1,
        limit: 10,
        nome: 'João',
        email: 'joao@example.com',
        ativo: true,
      });

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledTimes(3); // nome, email, ativo
    });

    it('deve retornar array vazio quando não houver usuários', async () => {
      mockQueryBuilder.getManyAndCount.mockResolvedValue([[], 0]);

      const result = await service.findAll({ page: 1, limit: 10 });

      expect(result.data).toEqual([]);
      expect(result.total).toBe(0);
    });
  });

  describe('findOne', () => {
    it('deve retornar um usuário pelo ID', async () => {
      const usuario = {
        id: 'uuid-123',
        nomeCompleto: 'João da Silva',
        email: 'joao@example.com',
        cpf: '123.456.789-00',
      };

      mockUsuarioRepository.findOne.mockResolvedValue(usuario);

      const result = await service.findOne('uuid-123');

      expect(result).toEqual(usuario);
      expect(mockUsuarioRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'uuid-123' },
        relations: ['unidades', 'permissoes'],
      });
    });

    it('deve lançar NotFoundException quando usuário não existir', async () => {
      mockUsuarioRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('deve atualizar um usuário com sucesso', async () => {
      const updateDto = {
        nomeCompleto: 'João Silva Atualizado',
        telefone: '(11) 99999-9999',
      };

      const existingUser = {
        id: 'uuid-123',
        nomeCompleto: 'João da Silva',
        email: 'joao@example.com',
        cpf: '123.456.789-00',
      };

      const updatedUser = {
        ...existingUser,
        ...updateDto,
      };

      mockUsuarioRepository.findOne.mockResolvedValue(existingUser);
      mockUsuarioRepository.save.mockResolvedValue(updatedUser);

      const result = await service.update('uuid-123', updateDto, 'admin-id');

      expect(result).toEqual(updatedUser);
      expect(mockUsuarioRepository.save).toHaveBeenCalledWith({
        ...existingUser,
        ...updateDto,
      });
      expect(mockAuditoriaService.registrarAlteracao).toHaveBeenCalled();
    });

    it('deve lançar NotFoundException ao atualizar usuário inexistente', async () => {
      mockUsuarioRepository.findOne.mockResolvedValue(null);

      await expect(
        service.update('non-existent', { nomeCompleto: 'New' }, 'admin-id'),
      ).rejects.toThrow(NotFoundException);
    });

    it('deve atualizar email normalmente se não existir conflito', async () => {
      const updateDto = {
        email: 'novo@example.com',
        nomeCompleto: 'João Silva Novo',
      };

      const existingUser = {
        id: 'uuid-123',
        email: 'joao@example.com',
        nomeCompleto: 'João da Silva',
      };

      mockUsuarioRepository.findOne.mockResolvedValue(existingUser);
      mockUsuarioRepository.save.mockResolvedValue({
        ...existingUser,
        ...updateDto,
      });

      const result = await service.update('uuid-123', updateDto, 'admin-id');

      expect(result.email).toBe(updateDto.email);
    });
  });

  describe('remove', () => {
    it('deve desativar um usuário (soft delete)', async () => {
      const usuario = {
        id: 'uuid-123',
        nomeCompleto: 'João da Silva',
        ativo: true,
      };

      mockUsuarioRepository.findOne.mockResolvedValue(usuario);
      mockUsuarioRepository.save.mockResolvedValue({
        ...usuario,
        ativo: false,
      });

      await service.remove('uuid-123', 'admin-id');

      expect(mockUsuarioRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'uuid-123',
          nomeCompleto: 'João da Silva',
          ativo: false,
        }),
      );
      expect(mockAuditoriaService.registrarAlteracao).toHaveBeenCalled();
    });

    it('deve lançar NotFoundException ao remover usuário inexistente', async () => {
      mockUsuarioRepository.findOne.mockResolvedValue(null);

      await expect(service.remove('non-existent', 'admin-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('changePassword', () => {
    it('deve alterar senha com senha atual correta', async () => {
      const usuario = {
        id: 'uuid-123',
        senha: await bcrypt.hash('SenhaAtual123!', 10),
        comparePassword: jest.fn().mockResolvedValue(true),
      };

      const changeDto = {
        senhaAtual: 'SenhaAtual123!',
        novaSenha: 'NovaSenha123!',
        confirmacaoSenha: 'NovaSenha123!',
      };

      mockUsuarioRepository.findOne.mockResolvedValue(usuario);
      jest
        .spyOn(bcrypt, 'hash')
        .mockImplementation(() => Promise.resolve('new_hashed'));
      mockUsuarioRepository.save.mockResolvedValue({
        ...usuario,
        senha: 'new_hashed',
      });

      await service.changePassword('uuid-123', changeDto);

      expect(mockUsuarioRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          senhaHash: 'new_hashed',
          resetarSenha: false,
        }),
      );
    });

    it('deve lançar erro com senha atual incorreta', async () => {
      const usuario = {
        id: 'uuid-123',
        senha: await bcrypt.hash('SenhaAtual123!', 10),
        comparePassword: jest.fn().mockResolvedValue(false),
      };

      const changeDto = {
        senhaAtual: 'SenhaErrada!',
        novaSenha: 'NovaSenha123!',
        confirmacaoSenha: 'NovaSenha123!',
      };

      mockUsuarioRepository.findOne.mockResolvedValue(usuario);

      await expect(
        service.changePassword('uuid-123', changeDto),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('deve lançar erro se nova senha não conferir com confirmação', async () => {
      const usuario = {
        id: 'uuid-123',
        senha: await bcrypt.hash('SenhaAtual123!', 10),
        comparePassword: jest.fn().mockResolvedValue(true),
      };

      const changeDto = {
        senhaAtual: 'SenhaAtual123!',
        novaSenha: 'NovaSenha123!',
        confirmacaoSenha: 'SenhaDiferente123!',
      };

      mockUsuarioRepository.findOne.mockResolvedValue(usuario);

      await expect(
        service.changePassword('uuid-123', changeDto),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('findByEmail', () => {
    it('deve retornar usuário por email', async () => {
      const usuario = {
        id: 'uuid-123',
        email: 'joao@example.com',
        nomeCompleto: 'João da Silva',
      };

      mockUsuarioRepository.findOne.mockResolvedValue(usuario);

      const result = await service.findByEmail('joao@example.com');

      expect(result).toEqual(usuario);
      expect(mockUsuarioRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'joao@example.com' },
        relations: ['unidades', 'permissoes'],
      });
    });

    it('deve retornar null se email não existir', async () => {
      mockUsuarioRepository.findOne.mockResolvedValue(null);

      const result = await service.findByEmail('naoexiste@example.com');

      expect(result).toBeNull();
    });
  });

  describe('activate', () => {
    it('deve ativar um usuário inativo', async () => {
      const usuario = {
        id: 'uuid-123',
        ativo: false,
        tentativasLoginFalhas: 3,
        bloqueadoAte: new Date(),
      };

      const usuarioAtivado = {
        ...usuario,
        ativo: true,
        tentativasLoginFalhas: 0,
        bloqueadoAte: null,
      };

      mockUsuarioRepository.findOne.mockResolvedValue(usuario);
      mockUsuarioRepository.save.mockResolvedValue(usuarioAtivado);

      const result = await service.activate('uuid-123', 'admin-id');

      expect(result).toEqual(usuarioAtivado);
      expect(mockUsuarioRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          ativo: true,
          tentativasLoginFalhas: 0,
          bloqueadoAte: null,
        }),
      );
      expect(mockAuditoriaService.registrarAlteracao).toHaveBeenCalled();
    });
  });

  describe('block', () => {
    it('deve bloquear um usuário por tempo determinado', async () => {
      const usuario = {
        id: 'uuid-123',
        bloqueadoAte: null,
      };

      mockUsuarioRepository.findOne.mockResolvedValue(usuario);
      mockUsuarioRepository.save.mockResolvedValue({
        ...usuario,
        bloqueadoAte: expect.any(Date),
      });

      await service.block('uuid-123', 30, 'admin-id');

      expect(mockUsuarioRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          bloqueadoAte: expect.any(Date),
        }),
      );
      expect(mockAuditoriaService.registrarAlteracao).toHaveBeenCalled();
    });
  });

  describe('unblock', () => {
    it('deve desbloquear um usuário bloqueado', async () => {
      const usuario = {
        id: 'uuid-123',
        bloqueadoAte: new Date(),
        tentativasLoginFalhas: 5,
      };

      const usuarioDesbloqueado = {
        ...usuario,
        bloqueadoAte: null,
        tentativasLoginFalhas: 0,
      };

      mockUsuarioRepository.findOne.mockResolvedValue(usuario);
      mockUsuarioRepository.save.mockResolvedValue(usuarioDesbloqueado);

      const result = await service.unblock('uuid-123', 'admin-id');

      expect(result).toEqual(usuarioDesbloqueado);
      expect(mockUsuarioRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          bloqueadoAte: null,
          tentativasLoginFalhas: 0,
        }),
      );
      expect(mockAuditoriaService.registrarAlteracao).toHaveBeenCalled();
    });
  });

  describe('resetPassword', () => {
    it('deve resetar senha do usuário', async () => {
      const usuario = {
        id: 'uuid-123',
        senhaHash: 'old-hash',
        resetarSenha: false,
        tentativasLoginFalhas: 3,
        bloqueadoAte: new Date(),
      };

      jest
        .spyOn(bcrypt, 'hash')
        .mockImplementation(() => Promise.resolve('new-hash'));

      mockUsuarioRepository.findOne.mockResolvedValue(usuario);
      mockUsuarioRepository.save.mockResolvedValue({
        ...usuario,
        senhaHash: 'new-hash',
        resetarSenha: true,
        tentativasLoginFalhas: 0,
        bloqueadoAte: null,
      });

      await service.resetPassword('uuid-123', 'Nova123!', 'admin-id');

      expect(mockUsuarioRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          senhaHash: 'new-hash',
          resetarSenha: true,
          tentativasLoginFalhas: 0,
          bloqueadoAte: null,
        }),
      );
      expect(mockAuditoriaService.registrarAlteracao).toHaveBeenCalled();
    });
  });

  describe('incrementarTentativasLogin', () => {
    it('deve incrementar tentativas de login', async () => {
      const usuario = {
        id: 'uuid-123',
        tentativasLoginFalhas: 2,
        bloqueadoAte: null,
      };

      mockUsuarioRepository.findOne.mockResolvedValue(usuario);
      mockUsuarioRepository.save.mockResolvedValue({
        ...usuario,
        tentativasLoginFalhas: 3,
      });

      await service.incrementarTentativasLogin('uuid-123');

      expect(mockUsuarioRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          tentativasLoginFalhas: 3,
        }),
      );
    });

    it('deve bloquear usuário após 5 tentativas', async () => {
      const usuario = {
        id: 'uuid-123',
        tentativasLoginFalhas: 4,
        bloqueadoAte: null,
      };

      mockUsuarioRepository.findOne.mockResolvedValue(usuario);
      mockUsuarioRepository.save.mockResolvedValue({
        ...usuario,
        tentativasLoginFalhas: 5,
        bloqueadoAte: expect.any(Date),
      });

      await service.incrementarTentativasLogin('uuid-123');

      expect(mockUsuarioRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          tentativasLoginFalhas: 5,
          bloqueadoAte: expect.any(Date),
        }),
      );
    });
  });

  describe('resetarTentativasLogin', () => {
    it('deve resetar tentativas de login', async () => {
      const usuario = {
        id: 'uuid-123',
        tentativasLoginFalhas: 3,
        bloqueadoAte: new Date(),
      };

      mockUsuarioRepository.findOne.mockResolvedValue(usuario);
      mockUsuarioRepository.save.mockResolvedValue({
        ...usuario,
        tentativasLoginFalhas: 0,
        bloqueadoAte: null,
      });

      await service.resetarTentativasLogin('uuid-123');

      expect(mockUsuarioRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          tentativasLoginFalhas: 0,
          bloqueadoAte: null,
        }),
      );
    });
  });

  describe('atualizarUltimoLogin', () => {
    it('deve atualizar último login e registrar acesso', async () => {
      const usuario = {
        id: 'uuid-123',
        ultimoLogin: null,
      };

      mockUsuarioRepository.findOne.mockResolvedValue(usuario);
      mockUsuarioRepository.save.mockResolvedValue({
        ...usuario,
        ultimoLogin: expect.any(Date),
      });

      await service.atualizarUltimoLogin('uuid-123');

      expect(mockUsuarioRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          ultimoLogin: expect.any(Date),
        }),
      );
      expect(mockAuditoriaService.registrarAcesso).toHaveBeenCalledWith(
        'uuid-123',
        'Login',
        'Sistema',
        'Login realizado com sucesso',
      );
    });
  });

  describe('registrarLogout', () => {
    it('deve registrar logout do usuário', async () => {
      await service.registrarLogout('uuid-123');

      expect(mockAuditoriaService.registrarAcesso).toHaveBeenCalledWith(
        'uuid-123',
        'Logout',
        'Sistema',
        'Logout realizado',
      );
    });
  });

  describe('getStats', () => {
    it('deve retornar estatísticas dos usuários', async () => {
      mockUsuarioRepository.count
        .mockResolvedValueOnce(100) // total
        .mockResolvedValueOnce(80) // ativos
        .mockResolvedValueOnce(20) // inativos
        .mockResolvedValueOnce(15); // com2FA

      mockQueryBuilder.getCount.mockResolvedValue(5); // bloqueados

      const result = await service.getStats();

      expect(result).toEqual({
        total: 100,
        ativos: 80,
        inativos: 20,
        bloqueados: 5,
        com2FA: 15,
      });
    });
  });

  describe('registrarTentativaFalha', () => {
    it('deve incrementar tentativas de falha por email', async () => {
      const usuario = {
        id: 'uuid-123',
        email: 'test@example.com',
        tentativasLoginFalhas: 2,
        bloqueadoAte: null,
      };

      mockUsuarioRepository.findOne.mockResolvedValue(usuario);
      mockUsuarioRepository.save.mockResolvedValue({
        ...usuario,
        tentativasLoginFalhas: 3,
      });

      await service.registrarTentativaFalha('test@example.com');

      expect(mockUsuarioRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          tentativasLoginFalhas: 3,
        }),
      );
    });

    it('deve bloquear usuário após 5 tentativas por email', async () => {
      const usuario = {
        id: 'uuid-123',
        email: 'test@example.com',
        tentativasLoginFalhas: 4,
        bloqueadoAte: null,
      };

      mockUsuarioRepository.findOne.mockResolvedValue(usuario);
      mockUsuarioRepository.save.mockResolvedValue({
        ...usuario,
        tentativasLoginFalhas: 5,
        bloqueadoAte: expect.any(Date),
      });

      await service.registrarTentativaFalha('test@example.com');

      expect(mockUsuarioRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          tentativasLoginFalhas: 5,
          bloqueadoAte: expect.any(Date),
        }),
      );
    });

    it('não deve fazer nada se usuário não existir', async () => {
      mockUsuarioRepository.findOne.mockResolvedValue(null);

      await service.registrarTentativaFalha('inexistente@example.com');

      expect(mockUsuarioRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('registrarLoginSucesso', () => {
    it('deve resetar tentativas e atualizar último login', async () => {
      const usuario = {
        id: 'uuid-123',
        tentativasLoginFalhas: 3,
        ultimoLogin: null,
      };

      mockUsuarioRepository.findOne.mockResolvedValue(usuario);
      mockUsuarioRepository.save.mockResolvedValue({
        ...usuario,
        tentativasLoginFalhas: 0,
        ultimoLogin: expect.any(Date),
      });

      await service.registrarLoginSucesso('uuid-123');

      expect(mockUsuarioRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          tentativasLoginFalhas: 0,
          ultimoLogin: expect.any(Date),
        }),
      );
    });
  });
});
