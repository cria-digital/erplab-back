import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { LaboratorioApoio } from './entities/laboratorio-apoio.entity';

@Injectable()
export class LaboratorioApoioService {
  constructor(
    @InjectRepository(LaboratorioApoio)
    private readonly repository: Repository<LaboratorioApoio>,
  ) {}

  async create(data: Partial<LaboratorioApoio>): Promise<LaboratorioApoio> {
    // Verifica se já existe um laboratório com o mesmo código
    if (data.codigo) {
      const existing = await this.repository.findOne({
        where: { codigo: data.codigo },
      });
      if (existing) {
        throw new ConflictException(
          `Laboratório com código ${data.codigo} já existe`,
        );
      }
    }

    const entity = this.repository.create(data);
    return await this.repository.save(entity);
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    search?: string,
    status?: string,
  ): Promise<{
    data: LaboratorioApoio[];
    total: number;
    page: number;
    lastPage: number;
  }> {
    const where: any = {};

    if (search) {
      where.nome = Like(`%${search}%`);
    }

    if (status) {
      where.status = status;
    }

    const [data, total] = await this.repository.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: { nome: 'ASC' },
    });

    return {
      data,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<LaboratorioApoio> {
    const entity = await this.repository.findOne({ where: { id } });

    if (!entity) {
      throw new NotFoundException(
        `Laboratório de apoio com ID ${id} não encontrado`,
      );
    }

    return entity;
  }

  async findByCodigo(codigo: string): Promise<LaboratorioApoio> {
    const entity = await this.repository.findOne({ where: { codigo } });

    if (!entity) {
      throw new NotFoundException(
        `Laboratório de apoio com código ${codigo} não encontrado`,
      );
    }

    return entity;
  }

  async findAtivos(): Promise<LaboratorioApoio[]> {
    return await this.repository.find({
      where: { status: 'ativo' },
      order: { nome: 'ASC' },
    });
  }

  async update(
    id: string,
    data: Partial<LaboratorioApoio>,
  ): Promise<LaboratorioApoio> {
    const entity = await this.findOne(id);

    // Se está alterando o código, verifica se não existe outro com o mesmo código
    if (data.codigo && data.codigo !== entity.codigo) {
      const existing = await this.repository.findOne({
        where: { codigo: data.codigo },
      });
      if (existing) {
        throw new ConflictException(
          `Laboratório com código ${data.codigo} já existe`,
        );
      }
    }

    Object.assign(entity, data);
    return await this.repository.save(entity);
  }

  async remove(id: string): Promise<void> {
    const entity = await this.findOne(id);
    // Soft delete - apenas desativa
    entity.status = 'inativo';
    await this.repository.save(entity);
  }

  async toggleStatus(id: string): Promise<LaboratorioApoio> {
    const entity = await this.findOne(id);
    entity.status = entity.status === 'ativo' ? 'inativo' : 'ativo';
    return await this.repository.save(entity);
  }
}
