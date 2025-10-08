import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CentroCusto } from '../entities/centro-custo.entity';
import { CreateCentroCustoDto } from '../dto/create-centro-custo.dto';
import { UpdateCentroCustoDto } from '../dto/update-centro-custo.dto';

@Injectable()
export class CentroCustoService {
  constructor(
    @InjectRepository(CentroCusto)
    private readonly centroCustoRepository: Repository<CentroCusto>,
  ) {}

  async create(dto: CreateCentroCustoDto): Promise<CentroCusto> {
    // Verificar código único
    const existing = await this.centroCustoRepository.findOne({
      where: { codigo: dto.codigo },
    });

    if (existing) {
      throw new ConflictException(
        'Já existe um centro de custo com este código',
      );
    }

    const centroCusto = this.centroCustoRepository.create(dto);
    return await this.centroCustoRepository.save(centroCusto);
  }

  async findAll(): Promise<CentroCusto[]> {
    return await this.centroCustoRepository.find({
      relations: ['unidade'],
      order: { codigo: 'ASC' },
    });
  }

  async findAtivos(): Promise<CentroCusto[]> {
    return await this.centroCustoRepository.find({
      where: { ativo: true },
      relations: ['unidade'],
      order: { codigo: 'ASC' },
    });
  }

  async findOne(id: string): Promise<CentroCusto> {
    const centroCusto = await this.centroCustoRepository.findOne({
      where: { id },
      relations: ['unidade'],
    });

    if (!centroCusto) {
      throw new NotFoundException(
        `Centro de custo com ID ${id} não encontrado`,
      );
    }

    return centroCusto;
  }

  async findByCodigo(codigo: string): Promise<CentroCusto> {
    const centroCusto = await this.centroCustoRepository.findOne({
      where: { codigo },
      relations: ['unidade'],
    });

    if (!centroCusto) {
      throw new NotFoundException(
        `Centro de custo com código ${codigo} não encontrado`,
      );
    }

    return centroCusto;
  }

  async update(id: string, dto: UpdateCentroCustoDto): Promise<CentroCusto> {
    const centroCusto = await this.findOne(id);

    // Verificar código único se foi alterado
    if (dto.codigo && dto.codigo !== centroCusto.codigo) {
      const existing = await this.centroCustoRepository.findOne({
        where: { codigo: dto.codigo },
      });

      if (existing) {
        throw new ConflictException(
          'Já existe um centro de custo com este código',
        );
      }
    }

    Object.assign(centroCusto, dto);
    return await this.centroCustoRepository.save(centroCusto);
  }

  async remove(id: string): Promise<void> {
    const centroCusto = await this.findOne(id);
    await this.centroCustoRepository.remove(centroCusto);
  }

  async toggleStatus(id: string): Promise<CentroCusto> {
    const centroCusto = await this.findOne(id);
    centroCusto.ativo = !centroCusto.ativo;
    return await this.centroCustoRepository.save(centroCusto);
  }
}
