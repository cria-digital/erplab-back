import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Cnae } from '../entities/cnae.entity';
import { CreateCnaeDto } from '../dto/create-cnae.dto';
import { UpdateCnaeDto } from '../dto/update-cnae.dto';
import { SearchCnaeDto } from '../dto/search-cnae.dto';
import { PaginatedResultDto } from '../../../common/dto/pagination.dto';

@Injectable()
export class CnaeService {
  constructor(
    @InjectRepository(Cnae)
    private readonly cnaeRepository: Repository<Cnae>,
  ) {}

  async create(createCnaeDto: CreateCnaeDto): Promise<Cnae> {
    const cnae = this.cnaeRepository.create(createCnaeDto);
    return await this.cnaeRepository.save(cnae);
  }

  async findAll(searchDto?: SearchCnaeDto): Promise<PaginatedResultDto<Cnae>> {
    const query = this.cnaeRepository.createQueryBuilder('cnae');

    if (searchDto?.codigo) {
      query.andWhere('cnae.codigo LIKE :codigo', {
        codigo: `%${searchDto.codigo}%`,
      });
    }

    if (searchDto?.descricao) {
      query.andWhere('LOWER(cnae.descricao) LIKE LOWER(:descricao)', {
        descricao: `%${searchDto.descricao}%`,
      });
    }

    if (searchDto?.secao) {
      query.andWhere('cnae.secao = :secao', { secao: searchDto.secao });
    }

    if (searchDto?.divisao) {
      query.andWhere('cnae.divisao = :divisao', { divisao: searchDto.divisao });
    }

    if (searchDto?.ativo !== undefined) {
      query.andWhere('cnae.ativo = :ativo', { ativo: searchDto.ativo });
    }

    query.orderBy('cnae.codigo', 'ASC');

    // Paginação
    const page = searchDto?.page || 1;
    const limit = searchDto?.limit || 10;
    const offset = (page - 1) * limit;

    // Obter total antes de aplicar limit/offset
    const total = await query.getCount();

    // Aplicar paginação
    query.skip(offset).take(limit);

    const data = await query.getMany();

    return new PaginatedResultDto(data, total, page, limit);
  }

  async findOne(id: string): Promise<Cnae> {
    const cnae = await this.cnaeRepository.findOne({ where: { id } });
    if (!cnae) {
      throw new NotFoundException(`CNAE com ID ${id} não encontrado`);
    }
    return cnae;
  }

  async findByCodigo(codigo: string): Promise<Cnae> {
    const cnae = await this.cnaeRepository.findOne({ where: { codigo } });
    if (!cnae) {
      throw new NotFoundException(`CNAE com código ${codigo} não encontrado`);
    }
    return cnae;
  }

  async update(id: string, updateCnaeDto: UpdateCnaeDto): Promise<Cnae> {
    const cnae = await this.findOne(id);
    Object.assign(cnae, updateCnaeDto);
    return await this.cnaeRepository.save(cnae);
  }

  async remove(id: string): Promise<void> {
    const cnae = await this.findOne(id);
    cnae.ativo = false;
    await this.cnaeRepository.save(cnae);
  }

  async search(termo: string): Promise<Cnae[]> {
    return await this.cnaeRepository.find({
      where: [
        { codigo: ILike(`%${termo}%`) },
        { descricao: ILike(`%${termo}%`) },
        { descricaoSubclasse: ILike(`%${termo}%`) },
      ],
      take: 20,
      order: { codigo: 'ASC' },
    });
  }

  async findBySecao(secao: string): Promise<Cnae[]> {
    return await this.cnaeRepository.find({
      where: { secao, ativo: true },
      order: { codigo: 'ASC' },
    });
  }

  async findByDivisao(divisao: string): Promise<Cnae[]> {
    return await this.cnaeRepository.find({
      where: { divisao, ativo: true },
      order: { codigo: 'ASC' },
    });
  }

  async importBulk(cnaes: CreateCnaeDto[]): Promise<void> {
    const chunks = [];
    const chunkSize = 500;

    for (let i = 0; i < cnaes.length; i += chunkSize) {
      chunks.push(cnaes.slice(i, i + chunkSize));
    }

    for (const chunk of chunks) {
      const entities = chunk.map((dto) => this.cnaeRepository.create(dto));
      await this.cnaeRepository.save(entities);
    }
  }
}
