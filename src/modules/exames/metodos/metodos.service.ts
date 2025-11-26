import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, In, DataSource } from 'typeorm';
import { Metodo, StatusMetodo } from './entities/metodo.entity';
import { LaboratorioMetodo } from './entities/laboratorio-metodo.entity';
import { CreateMetodoDto } from './dto/create-metodo.dto';
import { UpdateMetodoDto } from './dto/update-metodo.dto';

@Injectable()
export class MetodosService {
  constructor(
    @InjectRepository(Metodo)
    private readonly metodoRepository: Repository<Metodo>,
    @InjectRepository(LaboratorioMetodo)
    private readonly laboratorioMetodoRepository: Repository<LaboratorioMetodo>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createMetodoDto: CreateMetodoDto): Promise<Metodo> {
    const existingMetodo = await this.metodoRepository.findOne({
      where: { codigoInterno: createMetodoDto.codigoInterno },
    });

    if (existingMetodo) {
      throw new ConflictException(
        `Método com código ${createMetodoDto.codigoInterno} já existe`,
      );
    }

    const metodo = this.metodoRepository.create(createMetodoDto);
    return await this.metodoRepository.save(metodo);
  }

  async findAll(
    page = 1,
    limit = 10,
    search?: string,
    status?: StatusMetodo,
  ): Promise<{
    data: Metodo[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const query = this.metodoRepository.createQueryBuilder('metodo');

    // Trazer os vínculos com laboratórios e dados da empresa (nome)
    query.leftJoinAndSelect('metodo.laboratorioMetodos', 'laboratorioMetodos');
    query.leftJoinAndSelect('laboratorioMetodos.laboratorio', 'laboratorio');
    query.leftJoinAndSelect('laboratorio.empresa', 'empresa');

    if (search) {
      query.where(
        '(metodo.nome ILIKE :search OR metodo.codigo_interno ILIKE :search OR metodo.descricao ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (status) {
      query.andWhere('metodo.status = :status', { status });
    }

    query.orderBy('metodo.nome', 'ASC');

    const [data, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Metodo> {
    const metodo = await this.metodoRepository.findOne({
      where: { id },
      relations: [
        'laboratorioMetodos',
        'laboratorioMetodos.laboratorio',
        'laboratorioMetodos.laboratorio.empresa',
      ],
    });

    if (!metodo) {
      throw new NotFoundException(`Método com ID ${id} não encontrado`);
    }

    return metodo;
  }

  async findByCodigo(codigoInterno: string): Promise<Metodo> {
    const metodo = await this.metodoRepository.findOne({
      where: { codigoInterno },
      relations: [
        'laboratorioMetodos',
        'laboratorioMetodos.laboratorio',
        'laboratorioMetodos.laboratorio.empresa',
      ],
    });

    if (!metodo) {
      throw new NotFoundException(
        `Método com código ${codigoInterno} não encontrado`,
      );
    }

    return metodo;
  }

  async update(id: string, updateMetodoDto: UpdateMetodoDto): Promise<Metodo> {
    const metodo = await this.findOne(id);

    Object.assign(metodo, updateMetodoDto);

    return await this.metodoRepository.save(metodo);
  }

  async remove(id: string): Promise<void> {
    const metodo = await this.findOne(id);

    // Usar transação para garantir atomicidade:
    // 1. Remover todos os vínculos com laboratórios
    // 2. Remover o método
    await this.dataSource.transaction(async (manager) => {
      // Remover todos os vínculos do método com laboratórios
      await manager.delete(LaboratorioMetodo, { metodoId: id });

      // Remover o método
      await manager.remove(metodo);
    });
  }

  async toggleStatus(id: string): Promise<Metodo> {
    const metodo = await this.findOne(id);

    if (metodo.status === StatusMetodo.ATIVO) {
      metodo.status = StatusMetodo.INATIVO;
    } else if (metodo.status === StatusMetodo.INATIVO) {
      metodo.status = StatusMetodo.ATIVO;
    } else {
      throw new BadRequestException(
        'Método em validação não pode ter seu status alterado diretamente',
      );
    }

    return await this.metodoRepository.save(metodo);
  }

  async validar(id: string): Promise<Metodo> {
    const metodo = await this.findOne(id);

    if (metodo.status !== StatusMetodo.EM_VALIDACAO) {
      throw new BadRequestException(
        'Apenas métodos em validação podem ser validados',
      );
    }

    metodo.status = StatusMetodo.ATIVO;
    return await this.metodoRepository.save(metodo);
  }

  async findByStatus(status: StatusMetodo): Promise<Metodo[]> {
    return await this.metodoRepository.find({
      where: { status },
      order: { nome: 'ASC' },
    });
  }

  async findByIds(ids: string[]): Promise<Metodo[]> {
    if (!ids || ids.length === 0) {
      return [];
    }

    return await this.metodoRepository.find({
      where: { id: In(ids) },
    });
  }

  async search(term: string): Promise<Metodo[]> {
    if (!term || term.trim().length === 0) {
      return [];
    }

    return await this.metodoRepository.find({
      where: [
        { nome: Like(`%${term}%`) },
        { codigoInterno: Like(`%${term}%`) },
        { descricao: Like(`%${term}%`) },
      ],
      take: 20,
      order: { nome: 'ASC' },
    });
  }

  async getStatistics(): Promise<{
    total: number;
    ativos: number;
    inativos: number;
    emValidacao: number;
  }> {
    const [total, ativos, inativos, emValidacao] = await Promise.all([
      this.metodoRepository.count(),
      this.metodoRepository.count({ where: { status: StatusMetodo.ATIVO } }),
      this.metodoRepository.count({ where: { status: StatusMetodo.INATIVO } }),
      this.metodoRepository.count({
        where: { status: StatusMetodo.EM_VALIDACAO },
      }),
    ]);

    return {
      total,
      ativos,
      inativos,
      emValidacao,
    };
  }
}
