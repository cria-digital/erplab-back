import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sala, TipoSala } from '../entities/sala.entity';
import { CreateSalaDto } from '../dto/create-sala.dto';
import { UpdateSalaDto } from '../dto/update-sala.dto';

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

  async findAll(): Promise<Sala[]> {
    return await this.salaRepository.find({
      relations: ['setor', 'unidade'],
      order: { nome: 'ASC' },
    });
  }

  async findAllAtivas(): Promise<Sala[]> {
    return await this.salaRepository.find({
      where: { ativo: true },
      relations: ['setor', 'unidade'],
      order: { nome: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Sala> {
    const sala = await this.salaRepository.findOne({
      where: { id },
      relations: ['setor', 'unidade'],
    });

    if (!sala) {
      throw new NotFoundException(`Sala com ID ${id} não encontrada`);
    }

    return sala;
  }

  async findByCodigo(codigoSala: string): Promise<Sala> {
    const sala = await this.salaRepository.findOne({
      where: { codigoSala },
      relations: ['setor', 'unidade'],
    });

    if (!sala) {
      throw new NotFoundException(
        `Sala com código ${codigoSala} não encontrada`,
      );
    }

    return sala;
  }

  async findByTipo(tipoSala: TipoSala): Promise<Sala[]> {
    return await this.salaRepository.find({
      where: { tipoSala },
      relations: ['setor', 'unidade'],
      order: { nome: 'ASC' },
    });
  }

  async findByUnidade(unidadeId: string): Promise<Sala[]> {
    return await this.salaRepository.find({
      where: { unidadeId },
      relations: ['setor', 'unidade'],
      order: { nome: 'ASC' },
    });
  }

  async findBySetor(setorId: string): Promise<Sala[]> {
    return await this.salaRepository.find({
      where: { setorId },
      relations: ['setor', 'unidade'],
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

    const porTipo = await this.salaRepository
      .createQueryBuilder('sala')
      .select('sala.tipo_sala', 'tipo')
      .addSelect('COUNT(*)', 'quantidade')
      .groupBy('sala.tipo_sala')
      .getRawMany();

    return {
      total,
      ativas,
      inativas,
      porTipo,
    };
  }
}
