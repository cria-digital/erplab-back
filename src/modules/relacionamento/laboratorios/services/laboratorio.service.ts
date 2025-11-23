import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Laboratorio } from '../entities/laboratorio.entity';
import { UpdateLaboratorioDto } from '../dto/update-laboratorio.dto';

@Injectable()
export class LaboratorioService {
  constructor(
    @InjectRepository(Laboratorio)
    private readonly laboratorioRepository: Repository<Laboratorio>,
  ) {}

  async findAll(): Promise<Laboratorio[]> {
    return await this.laboratorioRepository.find({
      relations: ['empresa'],
      order: { codigo_laboratorio: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Laboratorio> {
    const laboratorio = await this.laboratorioRepository.findOne({
      where: { id },
    });

    if (!laboratorio) {
      throw new NotFoundException(`Laboratório com ID ${id} não encontrado`);
    }

    return laboratorio;
  }

  async findByCodigo(codigo: string): Promise<Laboratorio> {
    const laboratorio = await this.laboratorioRepository.findOne({
      where: { codigo_laboratorio: codigo },
      relations: ['empresa'],
    });

    if (!laboratorio) {
      throw new NotFoundException(
        `Laboratório com código ${codigo} não encontrado`,
      );
    }

    return laboratorio;
  }

  async findByCnpj(cnpj: string): Promise<Laboratorio> {
    const laboratorio = await this.laboratorioRepository.findOne({
      where: { empresa: { cnpj } },
      relations: ['empresa'],
    });

    if (!laboratorio) {
      throw new NotFoundException(
        `Laboratório com CNPJ ${cnpj} não encontrado`,
      );
    }

    return laboratorio;
  }

  async findAtivos(): Promise<Laboratorio[]> {
    return await this.laboratorioRepository.find({
      where: { empresa: { ativo: true } },
      relations: ['empresa'],
      order: { codigo_laboratorio: 'ASC' },
    });
  }

  async update(
    id: string,
    updateLaboratorioDto: UpdateLaboratorioDto,
  ): Promise<Laboratorio> {
    const laboratorio = await this.findOne(id);
    Object.assign(laboratorio, updateLaboratorioDto);
    return await this.laboratorioRepository.save(laboratorio);
  }

  async remove(id: string): Promise<void> {
    const laboratorio = await this.findOne(id);
    await this.laboratorioRepository.remove(laboratorio);
  }

  async toggleStatus(id: string): Promise<Laboratorio> {
    const laboratorio = await this.laboratorioRepository.findOne({
      where: { id },
      relations: ['empresa'],
    });

    if (!laboratorio) {
      throw new NotFoundException(`Laboratório com ID ${id} não encontrado`);
    }

    laboratorio.empresa.ativo = !laboratorio.empresa.ativo;
    return await this.laboratorioRepository.save(laboratorio);
  }

  async search(query: string): Promise<Laboratorio[]> {
    return await this.laboratorioRepository
      .createQueryBuilder('laboratorio')
      .leftJoinAndSelect('laboratorio.empresa', 'empresa')
      .where('empresa.nomeFantasia ILIKE :query', { query: `%${query}%` })
      .orWhere('empresa.razaoSocial ILIKE :query', { query: `%${query}%` })
      .orWhere('empresa.cnpj LIKE :query', { query: `%${query}%` })
      .orWhere('laboratorio.codigo_laboratorio LIKE :query', {
        query: `%${query}%`,
      })
      .orderBy('empresa.nomeFantasia', 'ASC')
      .getMany();
  }
}
