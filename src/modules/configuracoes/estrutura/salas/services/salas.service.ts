import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sala } from '../entities/sala.entity';
import { CreateSalaDto } from '../dto/create-sala.dto';
import { UpdateSalaDto } from '../dto/update-sala.dto';
import { PaginatedResultDto } from '../../../../infraestrutura/common/dto/pagination.dto';

@Injectable()
export class SalasService {
  constructor(
    @InjectRepository(Sala)
    private readonly salaRepository: Repository<Sala>,
  ) {}

  async create(createSalaDto: CreateSalaDto, criadoPor: string): Promise<Sala> {
    const sala = this.salaRepository.create({
      ...createSalaDto,
      criadoPor,
      atualizadoPor: criadoPor,
    });

    return await this.salaRepository.save(sala);
  }

  async findAllPaginated(
    page: number = 1,
    limit: number = 10,
    search?: string,
    unidadeId?: string,
    setor?: string,
  ): Promise<PaginatedResultDto<Sala>> {
    const queryBuilder = this.salaRepository
      .createQueryBuilder('sala')
      .leftJoinAndSelect('sala.unidade', 'unidade');

    // Filtro por termo de busca (nome, código interno ou setor)
    if (search) {
      queryBuilder.andWhere(
        '(sala.nome ILIKE :search OR sala.codigoInterno ILIKE :search OR sala.setor ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    // Filtro por unidade
    if (unidadeId) {
      queryBuilder.andWhere('sala.unidadeId = :unidadeId', { unidadeId });
    }

    // Filtro por setor
    if (setor) {
      queryBuilder.andWhere('sala.setor = :setor', { setor });
    }

    // Ordenação e paginação
    queryBuilder
      .orderBy('sala.nome', 'ASC')
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return new PaginatedResultDto(data, total, page, limit);
  }

  async findAll(): Promise<Sala[]> {
    return await this.salaRepository.find({
      relations: ['unidade'],
      order: { nome: 'ASC' },
    });
  }

  async findAllAtivas(): Promise<Sala[]> {
    return await this.salaRepository.find({
      where: { ativo: true },
      relations: ['unidade'],
      order: { nome: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Sala> {
    const sala = await this.salaRepository.findOne({
      where: { id },
      relations: ['unidade'],
    });

    if (!sala) {
      throw new NotFoundException(`Sala com ID ${id} não encontrada`);
    }

    return sala;
  }

  async findByCodigo(codigoInterno: string): Promise<Sala> {
    const sala = await this.salaRepository.findOne({
      where: { codigoInterno },
      relations: ['unidade'],
    });

    if (!sala) {
      throw new NotFoundException(
        `Sala com código ${codigoInterno} não encontrada`,
      );
    }

    return sala;
  }

  async findByUnidade(unidadeId: string): Promise<Sala[]> {
    return await this.salaRepository.find({
      where: { unidadeId },
      relations: ['unidade'],
      order: { nome: 'ASC' },
    });
  }

  async findBySetor(setor: string): Promise<Sala[]> {
    return await this.salaRepository.find({
      where: { setor },
      relations: ['unidade'],
      order: { nome: 'ASC' },
    });
  }

  async update(
    id: string,
    updateSalaDto: UpdateSalaDto,
    atualizadoPor: string,
  ): Promise<Sala> {
    const sala = await this.findOne(id);

    Object.assign(sala, updateSalaDto, { atualizadoPor });

    return await this.salaRepository.save(sala);
  }

  async toggleAtivo(id: string, atualizadoPor: string): Promise<Sala> {
    const sala = await this.findOne(id);
    sala.ativo = !sala.ativo;
    sala.atualizadoPor = atualizadoPor;

    return await this.salaRepository.save(sala);
  }

  async remove(id: string): Promise<void> {
    const sala = await this.findOne(id);
    await this.salaRepository.remove(sala);
  }

  async getEstatisticas() {
    const total = await this.salaRepository.count();
    const ativas = await this.salaRepository.count({ where: { ativo: true } });
    const inativas = total - ativas;

    const porSetor = await this.salaRepository
      .createQueryBuilder('sala')
      .select('sala.setor', 'setor')
      .addSelect('COUNT(*)', 'quantidade')
      .groupBy('sala.setor')
      .getRawMany();

    return {
      total,
      ativas,
      inativas,
      porSetor,
    };
  }
}
