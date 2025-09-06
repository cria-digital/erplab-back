import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Paciente } from './entities/paciente.entity';
import { CreatePacienteDto, UpdatePacienteDto } from './dto';

export interface PacientesFilters {
  page?: number;
  limit?: number;
  nome?: string;
  cpf?: string;
  email?: string;
  status?: string;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class PacientesService {
  constructor(
    @InjectRepository(Paciente)
    private readonly pacientesRepository: Repository<Paciente>,
  ) {}

  /**
   * Cria um novo paciente
   * @param createPacienteDto Dados do paciente
   * @param userId ID do usuário que está criando
   * @returns Paciente criado
   */
  async create(createPacienteDto: CreatePacienteDto, userId: number): Promise<Paciente> {
    // Verifica se já existe paciente com o CPF na empresa
    const pacienteExistente = await this.pacientesRepository.findOne({
      where: { 
        cpf: createPacienteDto.cpf, 
        empresa_id: createPacienteDto.empresa_id 
      },
    });

    if (pacienteExistente) {
      throw new ConflictException(
        'Já existe um paciente cadastrado com este CPF nesta empresa'
      );
    }

    // Gera código interno se não fornecido
    const codigoInterno = createPacienteDto.codigo_interno || 
      `PAC${Date.now()}`;

    // Prepara dados para criação
    const dadosPaciente = {
      ...createPacienteDto,
      codigo_interno: codigoInterno,
      data_nascimento: new Date(createPacienteDto.data_nascimento),
      validade: createPacienteDto.validade ? new Date(createPacienteDto.validade) : undefined,
      criado_por: userId,
      atualizado_por: userId,
    };

    const paciente = this.pacientesRepository.create(dadosPaciente);
    return await this.pacientesRepository.save(paciente);
  }

  /**
   * Lista pacientes com filtros e paginação
   * @param empresaId ID da empresa
   * @param filters Filtros de busca
   * @returns Lista paginada de pacientes
   */
  async findAll(empresaId: number, filters: PacientesFilters = {}): Promise<PaginatedResult<Paciente>> {
    const { page = 1, limit = 10, nome, cpf, email, status } = filters;
    const skip = (page - 1) * limit;

    // Se não há filtros, usa query simples
    if (!nome && !cpf && !email && !status) {
      const [pacientes, total] = await Promise.all([
        this.pacientesRepository.find({
          where: { empresa_id: empresaId },
          order: { criado_em: 'DESC' },
          skip,
          take: limit,
        }),
        this.pacientesRepository.count({
          where: { empresa_id: empresaId },
        }),
      ]);

      return {
        data: pacientes,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    }

    // Usa QueryBuilder para filtros complexos
    let query = this.pacientesRepository
      .createQueryBuilder('paciente')
      .where('paciente.empresa_id = :empresaId', { empresaId });

    if (nome) {
      query = query.andWhere('paciente.nome ILIKE :nome', { nome: `%${nome}%` });
    }

    if (cpf) {
      query = query.andWhere('paciente.cpf = :cpf', { cpf });
    }

    if (email) {
      query = query.andWhere('paciente.email ILIKE :email', { email: `%${email}%` });
    }

    if (status) {
      query = query.andWhere('paciente.status = :status', { status });
    }

    const [pacientes, total] = await query
      .orderBy('paciente.criado_em', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      data: pacientes,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Busca um paciente por ID
   * @param id ID do paciente
   * @param empresaId ID da empresa
   * @returns Paciente encontrado
   */
  async findOne(id: number, empresaId: number): Promise<Paciente> {
    const paciente = await this.pacientesRepository.findOne({
      where: { id, empresa_id: empresaId },
    });

    if (!paciente) {
      throw new NotFoundException('Paciente não encontrado');
    }

    return paciente;
  }

  /**
   * Busca um paciente por CPF
   * @param cpf CPF do paciente
   * @param empresaId ID da empresa
   * @returns Paciente encontrado ou null
   */
  async findByCpf(cpf: string, empresaId: number): Promise<Paciente | null> {
    return await this.pacientesRepository.findOne({
      where: { cpf, empresa_id: empresaId },
    });
  }

  /**
   * Atualiza um paciente
   * @param id ID do paciente
   * @param empresaId ID da empresa
   * @param updatePacienteDto Dados para atualização
   * @param userId ID do usuário que está atualizando
   * @returns Paciente atualizado
   */
  async update(
    id: number, 
    empresaId: number, 
    updatePacienteDto: UpdatePacienteDto,
    userId: number
  ): Promise<Paciente> {
    const paciente = await this.findOne(id, empresaId);

    // Prepara dados para atualização
    const dadosAtualizacao = {
      ...updatePacienteDto,
      data_nascimento: updatePacienteDto.data_nascimento ? 
        new Date(updatePacienteDto.data_nascimento) : 
        paciente.data_nascimento,
      validade: updatePacienteDto.validade ? 
        new Date(updatePacienteDto.validade) : 
        paciente.validade,
      atualizado_por: userId,
    };

    // Aplica atualizações
    Object.assign(paciente, dadosAtualizacao);

    return await this.pacientesRepository.save(paciente);
  }

  /**
   * Remove um paciente (soft delete - inativa)
   * @param id ID do paciente
   * @param empresaId ID da empresa
   * @param userId ID do usuário que está removendo
   */
  async remove(id: number, empresaId: number, userId: number): Promise<void> {
    const paciente = await this.findOne(id, empresaId);

    paciente.status = 'inativo';
    paciente.atualizado_por = userId;

    await this.pacientesRepository.save(paciente);
  }

  /**
   * Ativa um paciente inativo
   * @param id ID do paciente
   * @param empresaId ID da empresa
   * @param userId ID do usuário que está ativando
   * @returns Paciente ativado
   */
  async activate(id: number, empresaId: number, userId: number): Promise<Paciente> {
    const paciente = await this.findOne(id, empresaId);

    paciente.status = 'ativo';
    paciente.atualizado_por = userId;

    return await this.pacientesRepository.save(paciente);
  }

  /**
   * Bloqueia um paciente
   * @param id ID do paciente
   * @param empresaId ID da empresa
   * @param userId ID do usuário que está bloqueando
   * @returns Paciente bloqueado
   */
  async block(id: number, empresaId: number, userId: number): Promise<Paciente> {
    const paciente = await this.findOne(id, empresaId);

    paciente.status = 'bloqueado';
    paciente.atualizado_por = userId;

    return await this.pacientesRepository.save(paciente);
  }

  /**
   * Busca pacientes por nome (para autocomplete)
   * @param nome Nome parcial
   * @param empresaId ID da empresa
   * @param limit Limite de resultados
   * @returns Lista de pacientes
   */
  async searchByName(nome: string, empresaId: number, limit: number = 10): Promise<Paciente[]> {
    return await this.pacientesRepository
      .createQueryBuilder('paciente')
      .where('paciente.empresa_id = :empresaId', { empresaId })
      .andWhere('paciente.nome ILIKE :nome', { nome: `%${nome}%` })
      .andWhere('paciente.status = :status', { status: 'ativo' })
      .orderBy('paciente.nome', 'ASC')
      .limit(limit)
      .getMany();
  }

  /**
   * Estatísticas dos pacientes por empresa
   * @param empresaId ID da empresa
   * @returns Estatísticas
   */
  async getStats(empresaId: number) {
    const [
      total,
      ativos,
      inativos,
      bloqueados,
      comConvenio,
      semConvenio,
    ] = await Promise.all([
      this.pacientesRepository.count({ where: { empresa_id: empresaId } }),
      this.pacientesRepository.count({ where: { empresa_id: empresaId, status: 'ativo' } }),
      this.pacientesRepository.count({ where: { empresa_id: empresaId, status: 'inativo' } }),
      this.pacientesRepository.count({ where: { empresa_id: empresaId, status: 'bloqueado' } }),
      this.pacientesRepository
        .createQueryBuilder('paciente')
        .where('paciente.empresa_id = :empresaId', { empresaId })
        .andWhere('paciente.convenio_id IS NOT NULL')
        .getCount(),
      this.pacientesRepository
        .createQueryBuilder('paciente')
        .where('paciente.empresa_id = :empresaId', { empresaId })
        .andWhere('paciente.convenio_id IS NULL')
        .getCount(),
    ]);

    return {
      total,
      status: {
        ativo: ativos,
        inativo: inativos,
        bloqueado: bloqueados,
      },
      convenio: {
        com_convenio: comConvenio,
        sem_convenio: semConvenio,
      },
    };
  }
}