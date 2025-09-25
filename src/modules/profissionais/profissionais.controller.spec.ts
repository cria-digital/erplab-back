import { Test, TestingModule } from '@nestjs/testing';
import { ProfissionaisController } from './controllers/profissionais.controller';
import { ProfissionaisService } from './services/profissionais.service';
import { CreateProfissionalDto } from './dto/create-profissional.dto';
import { UpdateProfissionalDto } from './dto/update-profissional.dto';
import { CreateDocumentoDto } from './dto/create-documento.dto';
import {
  TipoDocumentoProfissionalEnum,
  PronomeEnum,
  SexoEnum,
  TipoContratacaoEnum,
  TipoProfissionalEnum,
  EstadoConselhoEnum,
} from './enums/profissionais.enum';

describe('ProfissionaisController', () => {
  let controller: ProfissionaisController;
  let service: ProfissionaisService;

  const mockProfissionaisService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByCpf: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    addDocumento: jest.fn(),
    updateDocumento: jest.fn(),
    removeDocumento: jest.fn(),
    vincularAgenda: jest.fn(),
    desvincularAgenda: jest.fn(),
  };

  const mockProfissional = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    nome: 'Dr. João Silva',
    cpf: '123.456.789-00',
    crm: '12345-SP',
    especialidade: 'Cardiologia',
    telefone: '(11) 98765-4321',
    email: 'dr.joao@exemplo.com',
    ativo: true,
    created_at: new Date(),
    updated_at: new Date(),
  };

  const mockDocumento = {
    id: '550e8400-e29b-41d4-a716-446655440002',
    profissionalId: '550e8400-e29b-41d4-a716-446655440000',
    tipo: TipoDocumentoProfissionalEnum.DIPLOMA,
    arquivo: 'diploma.pdf',
    validade: new Date('2025-01-01'),
    status: 'PENDENTE',
    observacoes: 'Documento em análise',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfissionaisController],
      providers: [
        {
          provide: ProfissionaisService,
          useValue: mockProfissionaisService,
        },
      ],
    }).compile();

    controller = module.get<ProfissionaisController>(ProfissionaisController);
    service = module.get<ProfissionaisService>(ProfissionaisService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deveria estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('deveria criar um novo profissional', async () => {
      const dto: CreateProfissionalDto = {
        pronomesPessoal: PronomeEnum.DR,
        nomeCompleto: 'Dr. João Silva',
        cpf: '123.456.789-00',
        dataNascimento: new Date('1980-01-01'),
        sexo: SexoEnum.MASCULINO,
        celular: '(11) 98765-4321',
        email: 'dr.joao@exemplo.com',
        tipoContratacao: TipoContratacaoEnum.CLT,
        profissao: 'MÉDICO',
        codigoInterno: '19011',
        tipoProfissional: TipoProfissionalEnum.AMBOS,
        nomeConselho: 'CRM',
        numeroConselho: '12345',
        estadoConselho: EstadoConselhoEnum.SP,
        codigoCBO: '225320',
        possuiAssinaturaDigital: false,
      };

      mockProfissionaisService.create.mockResolvedValue(mockProfissional);

      const result = await controller.create(dto);

      expect(result).toEqual(mockProfissional);
      expect(service.create).toHaveBeenCalledWith(dto);
      expect(service.create).toHaveBeenCalledTimes(1);
    });

    it('deveria tratar erro ao criar profissional', async () => {
      const dto: CreateProfissionalDto = {
        pronomesPessoal: PronomeEnum.DR,
        nomeCompleto: 'Dr. João Silva',
        cpf: '123.456.789-00',
        dataNascimento: new Date('1980-01-01'),
        sexo: SexoEnum.MASCULINO,
        celular: '(11) 98765-4321',
        email: 'dr.joao@exemplo.com',
        tipoContratacao: TipoContratacaoEnum.CLT,
        profissao: 'MÉDICO',
        codigoInterno: '19011',
        tipoProfissional: TipoProfissionalEnum.AMBOS,
        nomeConselho: 'CRM',
        numeroConselho: '12345',
        estadoConselho: EstadoConselhoEnum.SP,
        codigoCBO: '225320',
        possuiAssinaturaDigital: false,
      };

      const erro = new Error('CPF já cadastrado');
      mockProfissionaisService.create.mockRejectedValue(erro);

      await expect(controller.create(dto)).rejects.toThrow('CPF já cadastrado');
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('deveria retornar lista de profissionais', async () => {
      const mockProfissionais = [mockProfissional];
      mockProfissionaisService.findAll.mockResolvedValue(mockProfissionais);

      const result = await controller.findAll();

      expect(result).toEqual(mockProfissionais);
      expect(service.findAll).toHaveBeenCalled();
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });

    it('deveria retornar lista vazia', async () => {
      mockProfissionaisService.findAll.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(result).toEqual([]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('deveria retornar um profissional por ID', async () => {
      mockProfissionaisService.findOne.mockResolvedValue(mockProfissional);

      const result = await controller.findOne(
        '550e8400-e29b-41d4-a716-446655440000',
      );

      expect(result).toEqual(mockProfissional);
      expect(service.findOne).toHaveBeenCalledWith(
        '550e8400-e29b-41d4-a716-446655440000',
      );
    });

    it('deveria tratar erro quando profissional não existir', async () => {
      const erro = new Error('Profissional não encontrado');
      mockProfissionaisService.findOne.mockRejectedValue(erro);

      await expect(
        controller.findOne('550e8400-e29b-41d4-a716-446655440000'),
      ).rejects.toThrow('Profissional não encontrado');
    });
  });

  describe('findByCpf', () => {
    it('deveria retornar profissional por CPF', async () => {
      mockProfissionaisService.findByCpf.mockResolvedValue(mockProfissional);

      const result = await controller.findByCpf('123.456.789-00');

      expect(result).toEqual(mockProfissional);
      expect(service.findByCpf).toHaveBeenCalledWith('123.456.789-00');
    });

    it('deveria tratar erro quando CPF não for encontrado', async () => {
      const erro = new Error('Profissional com CPF não encontrado');
      mockProfissionaisService.findByCpf.mockRejectedValue(erro);

      await expect(controller.findByCpf('123.456.789-00')).rejects.toThrow(
        'Profissional com CPF não encontrado',
      );
    });
  });

  describe('update', () => {
    it('deveria atualizar um profissional', async () => {
      const dto: UpdateProfissionalDto = {
        nomeCompleto: 'Dr. João Silva Atualizado',
        celular: '(11) 99999-9999',
      };

      const profissionalAtualizado = { ...mockProfissional, ...dto };
      mockProfissionaisService.update.mockResolvedValue(profissionalAtualizado);

      const result = await controller.update(
        '550e8400-e29b-41d4-a716-446655440000',
        dto,
      );

      expect(result).toEqual(profissionalAtualizado);
      expect(service.update).toHaveBeenCalledWith(
        '550e8400-e29b-41d4-a716-446655440000',
        dto,
      );
    });

    it('deveria tratar erro ao atualizar', async () => {
      const dto: UpdateProfissionalDto = { nomeCompleto: 'Novo Nome' };
      const erro = new Error('Profissional não encontrado');
      mockProfissionaisService.update.mockRejectedValue(erro);

      await expect(
        controller.update('550e8400-e29b-41d4-a716-446655440000', dto),
      ).rejects.toThrow('Profissional não encontrado');
    });
  });

  describe('remove', () => {
    it('deveria remover um profissional', async () => {
      mockProfissionaisService.remove.mockResolvedValue(undefined);

      const result = await controller.remove(
        '550e8400-e29b-41d4-a716-446655440000',
      );

      expect(result).toBeUndefined();
      expect(service.remove).toHaveBeenCalledWith(
        '550e8400-e29b-41d4-a716-446655440000',
      );
    });

    it('deveria tratar erro ao remover', async () => {
      const erro = new Error('Profissional não encontrado');
      mockProfissionaisService.remove.mockRejectedValue(erro);

      await expect(
        controller.remove('550e8400-e29b-41d4-a716-446655440000'),
      ).rejects.toThrow('Profissional não encontrado');
    });
  });

  describe('addDocumento', () => {
    it('deveria adicionar documento ao profissional', async () => {
      const dto: CreateDocumentoDto = {
        tipo: TipoDocumentoProfissionalEnum.DIPLOMA,
        arquivo: 'diploma.pdf',
        validade: new Date('2025-01-01'),
        observacoes: 'Documento em análise',
      };

      mockProfissionaisService.addDocumento.mockResolvedValue(mockDocumento);

      const result = await controller.addDocumento(
        '550e8400-e29b-41d4-a716-446655440000',
        dto,
      );

      expect(result).toEqual(mockDocumento);
      expect(service.addDocumento).toHaveBeenCalledWith(
        '550e8400-e29b-41d4-a716-446655440000',
        dto,
      );
    });

    it('deveria tratar erro ao adicionar documento', async () => {
      const dto: CreateDocumentoDto = {
        tipo: TipoDocumentoProfissionalEnum.CRM,
      };
      const erro = new Error('Profissional não encontrado');
      mockProfissionaisService.addDocumento.mockRejectedValue(erro);

      await expect(
        controller.addDocumento('550e8400-e29b-41d4-a716-446655440000', dto),
      ).rejects.toThrow('Profissional não encontrado');
    });
  });

  describe('updateDocumento', () => {
    it('deveria atualizar documento', async () => {
      const dto: CreateDocumentoDto = {
        tipo: TipoDocumentoProfissionalEnum.CRM,
        arquivo: 'crm.pdf',
      };

      const documentoAtualizado = { ...mockDocumento, ...dto };
      mockProfissionaisService.updateDocumento.mockResolvedValue(
        documentoAtualizado,
      );

      const result = await controller.updateDocumento(
        '550e8400-e29b-41d4-a716-446655440002',
        dto,
      );

      expect(result).toEqual(documentoAtualizado);
      expect(service.updateDocumento).toHaveBeenCalledWith(
        '550e8400-e29b-41d4-a716-446655440002',
        dto,
      );
    });

    it('deveria tratar erro ao atualizar documento', async () => {
      const dto: CreateDocumentoDto = {
        tipo: TipoDocumentoProfissionalEnum.CRM,
      };
      const erro = new Error('Documento não encontrado');
      mockProfissionaisService.updateDocumento.mockRejectedValue(erro);

      await expect(
        controller.updateDocumento('550e8400-e29b-41d4-a716-446655440002', dto),
      ).rejects.toThrow('Documento não encontrado');
    });
  });

  describe('removeDocumento', () => {
    it('deveria remover documento', async () => {
      mockProfissionaisService.removeDocumento.mockResolvedValue(undefined);

      const result = await controller.removeDocumento(
        '550e8400-e29b-41d4-a716-446655440002',
      );

      expect(result).toBeUndefined();
      expect(service.removeDocumento).toHaveBeenCalledWith(
        '550e8400-e29b-41d4-a716-446655440002',
      );
    });

    it('deveria tratar erro ao remover documento', async () => {
      const erro = new Error('Documento não encontrado');
      mockProfissionaisService.removeDocumento.mockRejectedValue(erro);

      await expect(
        controller.removeDocumento('550e8400-e29b-41d4-a716-446655440002'),
      ).rejects.toThrow('Documento não encontrado');
    });
  });

  describe('vincularAgenda', () => {
    it('deveria vincular agenda ao profissional', async () => {
      const profissionalComAgenda = {
        ...mockProfissional,
        agendas: [
          {
            id: '550e8400-e29b-41d4-a716-446655440003',
            nome: 'Agenda Cardiologia',
          },
        ],
      };

      mockProfissionaisService.vincularAgenda.mockResolvedValue(
        profissionalComAgenda,
      );

      const result = await controller.vincularAgenda(
        '550e8400-e29b-41d4-a716-446655440000',
        '550e8400-e29b-41d4-a716-446655440003',
      );

      expect(result).toEqual(profissionalComAgenda);
      expect(service.vincularAgenda).toHaveBeenCalledWith(
        '550e8400-e29b-41d4-a716-446655440000',
        '550e8400-e29b-41d4-a716-446655440003',
      );
    });

    it('deveria tratar erro ao vincular agenda', async () => {
      const erro = new Error('Agenda já vinculada');
      mockProfissionaisService.vincularAgenda.mockRejectedValue(erro);

      await expect(
        controller.vincularAgenda(
          '550e8400-e29b-41d4-a716-446655440000',
          '550e8400-e29b-41d4-a716-446655440003',
        ),
      ).rejects.toThrow('Agenda já vinculada');
    });
  });

  describe('desvincularAgenda', () => {
    it('deveria desvincular agenda do profissional', async () => {
      const profissionalSemAgenda = { ...mockProfissional, agendas: [] };
      mockProfissionaisService.desvincularAgenda.mockResolvedValue(
        profissionalSemAgenda,
      );

      const result = await controller.desvincularAgenda(
        '550e8400-e29b-41d4-a716-446655440000',
        '550e8400-e29b-41d4-a716-446655440003',
      );

      expect(result).toEqual(profissionalSemAgenda);
      expect(service.desvincularAgenda).toHaveBeenCalledWith(
        '550e8400-e29b-41d4-a716-446655440000',
        '550e8400-e29b-41d4-a716-446655440003',
      );
    });

    it('deveria tratar erro ao desvincular agenda', async () => {
      const erro = new Error('Agenda não está vinculada');
      mockProfissionaisService.desvincularAgenda.mockRejectedValue(erro);

      await expect(
        controller.desvincularAgenda(
          '550e8400-e29b-41d4-a716-446655440000',
          '550e8400-e29b-41d4-a716-446655440003',
        ),
      ).rejects.toThrow('Agenda não está vinculada');
    });
  });
});
