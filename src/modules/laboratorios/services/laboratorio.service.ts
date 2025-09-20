import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Laboratorio } from '../entities/laboratorio.entity';
import { CreateLaboratorioDto } from '../dto/create-laboratorio.dto';
import { UpdateLaboratorioDto } from '../dto/update-laboratorio.dto';

@Injectable()
export class LaboratorioService {
  constructor(
    @InjectRepository(Laboratorio)
    private readonly laboratorioRepository: Repository<Laboratorio>,
  ) {}

  async create(createLaboratorioDto: CreateLaboratorioDto): Promise<Laboratorio> {
    // Verificar duplicidade de código
    const existingCodigo = await this.laboratorioRepository.findOne({
      where: { codigo: createLaboratorioDto.codigo },
    });

    if (existingCodigo) {
      throw new ConflictException('Já existe um laboratório com este código');
    }

    // Verificar duplicidade de CNPJ
    const existingCnpj = await this.laboratorioRepository.findOne({
      where: { cnpj: createLaboratorioDto.cnpj },
    });

    if (existingCnpj) {
      throw new ConflictException('Já existe um laboratório com este CNPJ');
    }

    const laboratorio = this.laboratorioRepository.create(createLaboratorioDto);
    return await this.laboratorioRepository.save(laboratorio);
  }

  async findAll(): Promise<Laboratorio[]> {
    return await this.laboratorioRepository.find({
      order: { nome_fantasia: 'ASC' },
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
      where: { codigo },
    });

    if (!laboratorio) {
      throw new NotFoundException(`Laboratório com código ${codigo} não encontrado`);
    }

    return laboratorio;
  }

  async findByCnpj(cnpj: string): Promise<Laboratorio> {
    const laboratorio = await this.laboratorioRepository.findOne({
      where: { cnpj },
    });

    if (!laboratorio) {
      throw new NotFoundException(`Laboratório com CNPJ ${cnpj} não encontrado`);
    }

    return laboratorio;
  }

  async findAtivos(): Promise<Laboratorio[]> {
    return await this.laboratorioRepository.find({
      where: { ativo: true },
      order: { nome_fantasia: 'ASC' },
    });
  }

  async findByIntegracao(tipo: string): Promise<Laboratorio[]> {
    return await this.laboratorioRepository.find({
      where: {
        tipo_integracao: tipo as any,
        ativo: true
      },
      order: { nome_fantasia: 'ASC' },
    });
  }

  async findAceitamUrgencia(): Promise<Laboratorio[]> {
    return await this.laboratorioRepository.find({
      where: {
        aceita_urgencia: true,
        ativo: true
      },
      order: { nome_fantasia: 'ASC' },
    });
  }

  async update(id: string, updateLaboratorioDto: UpdateLaboratorioDto): Promise<Laboratorio> {
    const laboratorio = await this.findOne(id);

    // Verificar duplicidade de código se foi alterado
    if (updateLaboratorioDto.codigo && updateLaboratorioDto.codigo !== laboratorio.codigo) {
      const existingCodigo = await this.laboratorioRepository.findOne({
        where: { codigo: updateLaboratorioDto.codigo },
      });

      if (existingCodigo) {
        throw new ConflictException('Já existe um laboratório com este código');
      }
    }

    // Verificar duplicidade de CNPJ se foi alterado
    if (updateLaboratorioDto.cnpj && updateLaboratorioDto.cnpj !== laboratorio.cnpj) {
      const existingCnpj = await this.laboratorioRepository.findOne({
        where: { cnpj: updateLaboratorioDto.cnpj },
      });

      if (existingCnpj) {
        throw new ConflictException('Já existe um laboratório com este CNPJ');
      }
    }

    Object.assign(laboratorio, updateLaboratorioDto);
    return await this.laboratorioRepository.save(laboratorio);
  }

  async remove(id: string): Promise<void> {
    const laboratorio = await this.findOne(id);
    await this.laboratorioRepository.remove(laboratorio);
  }

  async toggleStatus(id: string): Promise<Laboratorio> {
    const laboratorio = await this.findOne(id);
    laboratorio.ativo = !laboratorio.ativo;
    return await this.laboratorioRepository.save(laboratorio);
  }

  async search(query: string): Promise<Laboratorio[]> {
    return await this.laboratorioRepository
      .createQueryBuilder('laboratorio')
      .where('laboratorio.nome_fantasia ILIKE :query', { query: `%${query}%` })
      .orWhere('laboratorio.razao_social ILIKE :query', { query: `%${query}%` })
      .orWhere('laboratorio.cnpj LIKE :query', { query: `%${query}%` })
      .orWhere('laboratorio.codigo LIKE :query', { query: `%${query}%` })
      .orderBy('laboratorio.nome_fantasia', 'ASC')
      .getMany();
  }
}