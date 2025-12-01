import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { ProfissionaisService } from './services/profissionais.service';
import { Profissional } from './entities/profissional.entity';
import { DocumentoProfissional } from './entities/documento-profissional.entity';
import { Especialidade } from './entities/especialidade.entity';
import {
  Endereco,
  EstadoEnum,
} from '../../infraestrutura/common/entities/endereco.entity';
import { Agenda } from '../../atendimento/agendas/entities/agenda.entity';
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

describe('ProfissionaisService', () => {
  let service: ProfissionaisService;
  let profissionalRepository: Repository<Profissional>;
  let documentoRepository: Repository<DocumentoProfissional>;
  let enderecoRepository: Repository<Endereco>;
  let agendaRepository: Repository<Agenda>;

  const mockProfissional = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    nome: 'Dr. João Silva',
    cpf: '123.456.789-00',
    crm: '12345-SP',
    especialidade: 'Cardiologia',
    telefone: '(11) 98765-4321',
    email: 'dr.joao@exemplo.com',
    enderecoId: '550e8400-e29b-41d4-a716-446655440001',
    endereco: {
      id: '550e8400-e29b-41d4-a716-446655440001',
      logradouro: 'Rua Teste',
      numero: '123',
      bairro: 'Centro',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '01000-000',
    },
    documentos: [],
    agendas: [],
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
    created_at: new Date(),
    updated_at: new Date(),
  };

  const mockAgenda = {
    id: '550e8400-e29b-41d4-a716-446655440003',
    nome: 'Agenda Cardiologia',
    descricao: 'Agenda de atendimentos de cardiologia',
    profissionais: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfissionaisService,
        {
          provide: getRepositoryToken(Profissional),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(DocumentoProfissional),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Especialidade),
          useValue: {
            findBy: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Endereco),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Agenda),
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ProfissionaisService>(ProfissionaisService);
    profissionalRepository = module.get<Repository<Profissional>>(
      getRepositoryToken(Profissional),
    );
    documentoRepository = module.get<Repository<DocumentoProfissional>>(
      getRepositoryToken(DocumentoProfissional),
    );
    enderecoRepository = module.get<Repository<Endereco>>(
      getRepositoryToken(Endereco),
    );
    agendaRepository = module.get<Repository<Agenda>>(
      getRepositoryToken(Agenda),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deveria estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('deveria criar um profissional com endereço', async () => {
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

      jest
        .spyOn(profissionalRepository, 'create')
        .mockReturnValue(mockProfissional as any);
      jest
        .spyOn(profissionalRepository, 'save')
        .mockResolvedValue(mockProfissional as any);

      const result = await service.create(dto);

      expect(result).toEqual(mockProfissional);
      expect(profissionalRepository.create).toHaveBeenCalled();
      expect(profissionalRepository.save).toHaveBeenCalled();
    });

    it('deveria criar um profissional sem endereço', async () => {
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

      const profissionalSemEndereco = {
        ...mockProfissional,
        endereco: null,
        enderecoId: null,
      };
      jest
        .spyOn(profissionalRepository, 'create')
        .mockReturnValue(profissionalSemEndereco as any);
      jest
        .spyOn(profissionalRepository, 'save')
        .mockResolvedValue(profissionalSemEndereco as any);

      const result = await service.create(dto);

      expect(result).toEqual(profissionalSemEndereco);
      expect(enderecoRepository.create).not.toHaveBeenCalled();
      expect(enderecoRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('deveria retornar todos os profissionais com relacionamentos', async () => {
      const mockProfissionais = [mockProfissional];
      jest
        .spyOn(profissionalRepository, 'find')
        .mockResolvedValue(mockProfissionais as any);

      const result = await service.findAll();

      expect(result).toEqual(mockProfissionais);
      expect(profissionalRepository.find).toHaveBeenCalledWith({
        relations: [
          'documentos',
          'endereco',
          'agendas',
          'especialidadePrincipal',
          'especialidadesRealiza',
        ],
      });
    });

    it('deveria retornar array vazio quando não houver profissionais', async () => {
      jest.spyOn(profissionalRepository, 'find').mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('deveria retornar um profissional específico', async () => {
      jest
        .spyOn(profissionalRepository, 'findOne')
        .mockResolvedValue(mockProfissional as any);

      const result = await service.findOne(
        '550e8400-e29b-41d4-a716-446655440000',
      );

      expect(result).toEqual(mockProfissional);
      expect(profissionalRepository.findOne).toHaveBeenCalledWith({
        where: { id: '550e8400-e29b-41d4-a716-446655440000' },
        relations: [
          'documentos',
          'endereco',
          'agendas',
          'especialidadePrincipal',
          'especialidadesRealiza',
        ],
      });
    });

    it('deveria lançar NotFoundException quando profissional não existir', async () => {
      jest.spyOn(profissionalRepository, 'findOne').mockResolvedValue(null);

      await expect(
        service.findOne('550e8400-e29b-41d4-a716-446655440000'),
      ).rejects.toThrow(NotFoundException);
      await expect(
        service.findOne('550e8400-e29b-41d4-a716-446655440000'),
      ).rejects.toThrow(
        'Profissional com ID 550e8400-e29b-41d4-a716-446655440000 não encontrado',
      );
    });
  });

  describe('findByCpf', () => {
    it('deveria retornar um profissional por CPF', async () => {
      jest
        .spyOn(profissionalRepository, 'findOne')
        .mockResolvedValue(mockProfissional as any);

      const result = await service.findByCpf('123.456.789-00');

      expect(result).toEqual(mockProfissional);
      expect(profissionalRepository.findOne).toHaveBeenCalledWith({
        where: { cpf: '123.456.789-00' },
        relations: [
          'documentos',
          'endereco',
          'agendas',
          'especialidadePrincipal',
          'especialidadesRealiza',
        ],
      });
    });

    it('deveria lançar NotFoundException quando CPF não for encontrado', async () => {
      jest.spyOn(profissionalRepository, 'findOne').mockResolvedValue(null);

      await expect(service.findByCpf('123.456.789-00')).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.findByCpf('123.456.789-00')).rejects.toThrow(
        'Profissional com CPF 123.456.789-00 não encontrado',
      );
    });
  });

  describe('update', () => {
    it('deveria atualizar um profissional com endereço existente', async () => {
      const dto: UpdateProfissionalDto = {
        nomeCompleto: 'Dr. João Silva Atualizado',
        celular: '(11) 99999-9999',
      };

      jest
        .spyOn(profissionalRepository, 'findOne')
        .mockResolvedValue(mockProfissional as any);
      jest
        .spyOn(enderecoRepository, 'update')
        .mockResolvedValue({ affected: 1 } as any);
      jest
        .spyOn(profissionalRepository, 'update')
        .mockResolvedValue({ affected: 1 } as any);

      const result = await service.update(
        '550e8400-e29b-41d4-a716-446655440000',
        dto,
      );

      expect(result).toEqual(mockProfissional);
      expect(profissionalRepository.update).toHaveBeenCalled();
    });

    it('deveria criar novo endereço quando não existir', async () => {
      const dto: UpdateProfissionalDto = {
        nomeCompleto: 'Dr. Novo Nome',
        endereco: {
          rua: 'Rua Nova',
          numero: '456',
          bairro: 'Centro',
          cidade: 'São Paulo',
          estado: EstadoEnum.SP,
          cep: '01000-000',
        },
      };

      const profissionalSemEndereco = { ...mockProfissional, enderecoId: null };
      const novoEndereco = { id: '550e8400-e29b-41d4-a716-446655440004' };
      const profissionalAtualizado = { ...profissionalSemEndereco };

      jest
        .spyOn(profissionalRepository, 'findOne')
        .mockResolvedValueOnce(profissionalSemEndereco as any)
        .mockResolvedValueOnce(profissionalAtualizado as any);
      jest
        .spyOn(enderecoRepository, 'create')
        .mockReturnValue(novoEndereco as any);
      jest
        .spyOn(enderecoRepository, 'save')
        .mockResolvedValue(novoEndereco as any);
      jest
        .spyOn(profissionalRepository, 'update')
        .mockResolvedValue({ affected: 1 } as any);

      const result = await service.update(
        '550e8400-e29b-41d4-a716-446655440000',
        dto,
      );

      expect(result).toEqual(profissionalAtualizado);
      expect(enderecoRepository.create).toHaveBeenCalledWith(dto.endereco);
      expect(enderecoRepository.save).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('deveria remover um profissional', async () => {
      jest
        .spyOn(profissionalRepository, 'delete')
        .mockResolvedValue({ affected: 1 } as any);

      await expect(
        service.remove('550e8400-e29b-41d4-a716-446655440000'),
      ).resolves.not.toThrow();

      expect(profissionalRepository.delete).toHaveBeenCalledWith(
        '550e8400-e29b-41d4-a716-446655440000',
      );
    });

    it('deveria lançar NotFoundException quando profissional não existir', async () => {
      jest
        .spyOn(profissionalRepository, 'delete')
        .mockResolvedValue({ affected: 0 } as any);

      await expect(
        service.remove('550e8400-e29b-41d4-a716-446655440000'),
      ).rejects.toThrow(NotFoundException);
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

      jest
        .spyOn(profissionalRepository, 'findOne')
        .mockResolvedValue(mockProfissional as any);
      jest
        .spyOn(documentoRepository, 'create')
        .mockReturnValue(mockDocumento as any);
      jest
        .spyOn(documentoRepository, 'save')
        .mockResolvedValue(mockDocumento as any);

      const result = await service.addDocumento(
        '550e8400-e29b-41d4-a716-446655440000',
        dto,
      );

      expect(result).toEqual(mockDocumento);
      expect(documentoRepository.create).toHaveBeenCalledWith({
        ...dto,
        profissionalId: mockProfissional.id,
      });
      expect(documentoRepository.save).toHaveBeenCalled();
    });

    it('deveria lançar erro quando profissional não existir', async () => {
      jest.spyOn(profissionalRepository, 'findOne').mockResolvedValue(null);

      const dto: CreateDocumentoDto = {
        tipo: TipoDocumentoProfissionalEnum.DIPLOMA,
        arquivo: 'diploma.pdf',
      };

      await expect(
        service.addDocumento('550e8400-e29b-41d4-a716-446655440000', dto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateDocumento', () => {
    it('deveria atualizar um documento', async () => {
      const dto: CreateDocumentoDto = {
        tipo: TipoDocumentoProfissionalEnum.CRM,
        arquivo: 'crm.pdf',
      };

      jest
        .spyOn(documentoRepository, 'update')
        .mockResolvedValue({ affected: 1 } as any);
      jest
        .spyOn(documentoRepository, 'findOne')
        .mockResolvedValue(mockDocumento as any);

      const result = await service.updateDocumento(
        '550e8400-e29b-41d4-a716-446655440002',
        dto,
      );

      expect(result).toEqual(mockDocumento);
      expect(documentoRepository.update).toHaveBeenCalledWith(
        '550e8400-e29b-41d4-a716-446655440002',
        dto,
      );
    });

    it('deveria lançar NotFoundException quando documento não existir', async () => {
      jest
        .spyOn(documentoRepository, 'update')
        .mockResolvedValue({ affected: 1 } as any);
      jest.spyOn(documentoRepository, 'findOne').mockResolvedValue(null);

      const dto: CreateDocumentoDto = {
        tipo: TipoDocumentoProfissionalEnum.CRM,
      };

      await expect(
        service.updateDocumento('550e8400-e29b-41d4-a716-446655440002', dto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('removeDocumento', () => {
    it('deveria remover um documento', async () => {
      jest
        .spyOn(documentoRepository, 'delete')
        .mockResolvedValue({ affected: 1 } as any);

      await expect(
        service.removeDocumento('550e8400-e29b-41d4-a716-446655440002'),
      ).resolves.not.toThrow();

      expect(documentoRepository.delete).toHaveBeenCalledWith(
        '550e8400-e29b-41d4-a716-446655440002',
      );
    });

    it('deveria lançar NotFoundException quando documento não existir', async () => {
      jest
        .spyOn(documentoRepository, 'delete')
        .mockResolvedValue({ affected: 0 } as any);

      await expect(
        service.removeDocumento('550e8400-e29b-41d4-a716-446655440002'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('vincularAgenda', () => {
    it('deveria vincular agenda ao profissional', async () => {
      const profissionalSemAgenda = { ...mockProfissional, agendas: [] };
      const profissionalComAgenda = {
        ...mockProfissional,
        agendas: [mockAgenda],
      };

      jest
        .spyOn(profissionalRepository, 'findOne')
        .mockResolvedValueOnce(profissionalSemAgenda as any)
        .mockResolvedValueOnce(profissionalComAgenda as any);
      jest
        .spyOn(agendaRepository, 'findOne')
        .mockResolvedValue(mockAgenda as any);
      jest
        .spyOn(profissionalRepository, 'save')
        .mockResolvedValue(profissionalComAgenda as any);

      const result = await service.vincularAgenda(
        '550e8400-e29b-41d4-a716-446655440000',
        '550e8400-e29b-41d4-a716-446655440003',
      );

      expect(result).toEqual(profissionalComAgenda);
      expect(profissionalRepository.save).toHaveBeenCalled();
    });

    it('deveria lançar erro quando agenda não existir', async () => {
      jest
        .spyOn(profissionalRepository, 'findOne')
        .mockResolvedValue(mockProfissional as any);
      jest.spyOn(agendaRepository, 'findOne').mockResolvedValue(null);

      await expect(
        service.vincularAgenda(
          '550e8400-e29b-41d4-a716-446655440000',
          '550e8400-e29b-41d4-a716-446655440003',
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('deveria lançar erro quando agenda já estiver vinculada', async () => {
      const profissionalComAgenda = {
        ...mockProfissional,
        agendas: [mockAgenda],
      };

      jest
        .spyOn(profissionalRepository, 'findOne')
        .mockResolvedValue(profissionalComAgenda as any);
      jest
        .spyOn(agendaRepository, 'findOne')
        .mockResolvedValue(mockAgenda as any);

      await expect(
        service.vincularAgenda(
          '550e8400-e29b-41d4-a716-446655440000',
          '550e8400-e29b-41d4-a716-446655440003',
        ),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('desvincularAgenda', () => {
    it('deveria desvincular agenda do profissional', async () => {
      const profissionalComAgenda = {
        ...mockProfissional,
        agendas: [mockAgenda],
      };
      const profissionalSemAgenda = { ...mockProfissional, agendas: [] };

      jest
        .spyOn(profissionalRepository, 'findOne')
        .mockResolvedValueOnce(profissionalComAgenda as any)
        .mockResolvedValueOnce(profissionalSemAgenda as any);
      jest
        .spyOn(agendaRepository, 'findOne')
        .mockResolvedValue(mockAgenda as any);
      jest
        .spyOn(profissionalRepository, 'save')
        .mockResolvedValue(profissionalSemAgenda as any);

      const result = await service.desvincularAgenda(
        '550e8400-e29b-41d4-a716-446655440000',
        '550e8400-e29b-41d4-a716-446655440003',
      );

      expect(result).toEqual(profissionalSemAgenda);
      expect(profissionalRepository.save).toHaveBeenCalled();
    });

    it('deveria lançar erro quando agenda não existir', async () => {
      jest
        .spyOn(profissionalRepository, 'findOne')
        .mockResolvedValue(mockProfissional as any);
      jest.spyOn(agendaRepository, 'findOne').mockResolvedValue(null);

      await expect(
        service.desvincularAgenda(
          '550e8400-e29b-41d4-a716-446655440000',
          '550e8400-e29b-41d4-a716-446655440003',
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('deveria lançar erro quando agenda não estiver vinculada', async () => {
      const profissionalSemAgenda = { ...mockProfissional, agendas: [] };

      jest
        .spyOn(profissionalRepository, 'findOne')
        .mockResolvedValue(profissionalSemAgenda as any);
      jest
        .spyOn(agendaRepository, 'findOne')
        .mockResolvedValue(mockAgenda as any);

      await expect(
        service.desvincularAgenda(
          '550e8400-e29b-41d4-a716-446655440000',
          '550e8400-e29b-41d4-a716-446655440003',
        ),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
