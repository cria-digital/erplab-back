import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Amostra, StatusAmostra } from '../entities/amostra.entity';
import { LaboratorioAmostra } from '../entities/laboratorio-amostra.entity';
import { CreateAmostraDto } from '../dto/create-amostra.dto';
import { UpdateAmostraDto } from '../dto/update-amostra.dto';

@Injectable()
export class AmostrasService {
  constructor(
    @InjectRepository(Amostra)
    private readonly amostraRepository: Repository<Amostra>,
    @InjectRepository(LaboratorioAmostra)
    private readonly laboratorioAmostraRepository: Repository<LaboratorioAmostra>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createAmostraDto: CreateAmostraDto): Promise<Amostra> {
    // Verificar duplicidade de código
    const existingByCodigo = await this.amostraRepository.findOne({
      where: { codigoInterno: createAmostraDto.codigoInterno },
    });

    if (existingByCodigo) {
      throw new ConflictException(
        `Amostra com código ${createAmostraDto.codigoInterno} já existe`,
      );
    }

    // Verificar duplicidade de nome
    const existingByNome = await this.amostraRepository.findOne({
      where: { nome: createAmostraDto.nome },
    });

    if (existingByNome) {
      throw new ConflictException(
        `Amostra com nome "${createAmostraDto.nome}" já existe`,
      );
    }

    const amostra = this.amostraRepository.create(createAmostraDto);
    return await this.amostraRepository.save(amostra);
  }

  async findAll(
    page = 1,
    limit = 10,
    search?: string,
    status?: StatusAmostra,
  ): Promise<{
    data: Amostra[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const query = this.amostraRepository.createQueryBuilder('amostra');

    // Trazer os vínculos com laboratórios e dados da empresa (nome)
    query.leftJoinAndSelect(
      'amostra.laboratorioAmostras',
      'laboratorioAmostras',
    );
    query.leftJoinAndSelect('laboratorioAmostras.laboratorio', 'laboratorio');
    query.leftJoinAndSelect('laboratorio.empresa', 'empresa');

    if (search) {
      query.where(
        '(amostra.nome ILIKE :search OR amostra.codigo_interno ILIKE :search OR amostra.descricao ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (status) {
      query.andWhere('amostra.status = :status', { status });
    }

    query.orderBy('amostra.nome', 'ASC');

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

  async findOne(id: string): Promise<Amostra> {
    const amostra = await this.amostraRepository.findOne({
      where: { id },
      relations: [
        'laboratorioAmostras',
        'laboratorioAmostras.laboratorio',
        'laboratorioAmostras.laboratorio.empresa',
      ],
    });

    if (!amostra) {
      throw new NotFoundException(`Amostra com ID ${id} não encontrada`);
    }

    return amostra;
  }

  async findByCodigo(codigoInterno: string): Promise<Amostra> {
    const amostra = await this.amostraRepository.findOne({
      where: { codigoInterno },
      relations: [
        'laboratorioAmostras',
        'laboratorioAmostras.laboratorio',
        'laboratorioAmostras.laboratorio.empresa',
      ],
    });

    if (!amostra) {
      throw new NotFoundException(
        `Amostra com código ${codigoInterno} não encontrada`,
      );
    }

    return amostra;
  }

  async update(
    id: string,
    updateAmostraDto: UpdateAmostraDto,
  ): Promise<Amostra> {
    const amostra = await this.findOne(id);

    // Verificar duplicidade de nome se estiver alterando
    if (updateAmostraDto.nome && updateAmostraDto.nome !== amostra.nome) {
      const existingByNome = await this.amostraRepository.findOne({
        where: { nome: updateAmostraDto.nome },
      });

      if (existingByNome && existingByNome.id !== id) {
        throw new ConflictException(
          `Amostra com nome "${updateAmostraDto.nome}" já existe`,
        );
      }
    }

    // Nota: codigoInterno não pode ser alterado (excluído do UpdateDto)

    Object.assign(amostra, updateAmostraDto);

    return await this.amostraRepository.save(amostra);
  }

  async remove(id: string): Promise<void> {
    const amostra = await this.findOne(id);

    // Usar transação para garantir atomicidade:
    // 1. Remover todos os vínculos com laboratórios
    // 2. Remover a amostra
    await this.dataSource.transaction(async (manager) => {
      // Remover todos os vínculos da amostra com laboratórios
      await manager.delete(LaboratorioAmostra, { amostraId: id });

      // Remover a amostra
      await manager.remove(amostra);
    });
  }

  async toggleStatus(id: string): Promise<Amostra> {
    const amostra = await this.findOne(id);

    if (amostra.status === StatusAmostra.ATIVO) {
      amostra.status = StatusAmostra.INATIVO;
    } else if (amostra.status === StatusAmostra.INATIVO) {
      amostra.status = StatusAmostra.ATIVO;
    } else {
      throw new BadRequestException(
        'Amostra em revisão não pode ter seu status alterado diretamente',
      );
    }

    return await this.amostraRepository.save(amostra);
  }

  async validar(id: string): Promise<Amostra> {
    const amostra = await this.findOne(id);

    if (amostra.status !== StatusAmostra.EM_REVISAO) {
      throw new BadRequestException(
        'Apenas amostras em revisão podem ser validadas',
      );
    }

    amostra.status = StatusAmostra.ATIVO;
    return await this.amostraRepository.save(amostra);
  }

  async findByStatus(status: StatusAmostra): Promise<Amostra[]> {
    return await this.amostraRepository.find({
      where: { status },
      order: { nome: 'ASC' },
    });
  }

  async getStatistics(): Promise<{
    total: number;
    ativos: number;
    inativos: number;
    emRevisao: number;
  }> {
    const [total, ativos, inativos, emRevisao] = await Promise.all([
      this.amostraRepository.count(),
      this.amostraRepository.count({ where: { status: StatusAmostra.ATIVO } }),
      this.amostraRepository.count({
        where: { status: StatusAmostra.INATIVO },
      }),
      this.amostraRepository.count({
        where: { status: StatusAmostra.EM_REVISAO },
      }),
    ]);

    return {
      total,
      ativos,
      inativos,
      emRevisao,
    };
  }
}
