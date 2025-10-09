import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Setor, TipoSetor } from '../entities/setor.entity';
import { CreateSetorDto } from '../dto/create-setor.dto';
import { UpdateSetorDto } from '../dto/update-setor.dto';

@Injectable()
export class SetoresService {
  constructor(
    @InjectRepository(Setor)
    private readonly setorRepository: Repository<Setor>,
  ) {}

  async create(
    createSetorDto: CreateSetorDto,
    criadoPor: string,
  ): Promise<Setor> {
    const setor = this.setorRepository.create({
      ...createSetorDto,
      criadoPor,
      atualizadoPor: criadoPor,
    });

    return await this.setorRepository.save(setor);
  }

  async findAll(): Promise<Setor[]> {
    return await this.setorRepository.find({
      relations: ['setorPai', 'responsavel', 'unidade'],
      order: { nome: 'ASC' },
    });
  }

  async findAllAtivos(): Promise<Setor[]> {
    return await this.setorRepository.find({
      where: { ativo: true },
      relations: ['setorPai', 'responsavel', 'unidade'],
      order: { nome: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Setor> {
    const setor = await this.setorRepository.findOne({
      where: { id },
      relations: ['setorPai', 'setoresFilhos', 'responsavel', 'unidade'],
    });

    if (!setor) {
      throw new NotFoundException(`Setor com ID ${id} não encontrado`);
    }

    return setor;
  }

  async findByCodigo(codigoSetor: string): Promise<Setor> {
    const setor = await this.setorRepository.findOne({
      where: { codigoSetor },
      relations: ['setorPai', 'responsavel', 'unidade'],
    });

    if (!setor) {
      throw new NotFoundException(
        `Setor com código ${codigoSetor} não encontrado`,
      );
    }

    return setor;
  }

  async findByTipo(tipoSetor: TipoSetor): Promise<Setor[]> {
    return await this.setorRepository.find({
      where: { tipoSetor },
      relations: ['setorPai', 'responsavel', 'unidade'],
      order: { nome: 'ASC' },
    });
  }

  async findByUnidade(unidadeId: string): Promise<Setor[]> {
    return await this.setorRepository.find({
      where: { unidadeId },
      relations: ['setorPai', 'responsavel'],
      order: { nome: 'ASC' },
    });
  }

  async update(
    id: string,
    updateSetorDto: UpdateSetorDto,
    atualizadoPor: string,
  ): Promise<Setor> {
    const setor = await this.findOne(id);

    Object.assign(setor, updateSetorDto, { atualizadoPor });

    return await this.setorRepository.save(setor);
  }

  async toggleAtivo(id: string, atualizadoPor: string): Promise<Setor> {
    const setor = await this.findOne(id);
    setor.ativo = !setor.ativo;
    setor.atualizadoPor = atualizadoPor;

    return await this.setorRepository.save(setor);
  }

  async remove(id: string): Promise<void> {
    const setor = await this.findOne(id);
    await this.setorRepository.remove(setor);
  }

  async getEstatisticas() {
    const total = await this.setorRepository.count();
    const ativas = await this.setorRepository.count({
      where: { ativo: true },
    });
    const inativas = total - ativas;

    const porTipo = await this.setorRepository
      .createQueryBuilder('setor')
      .select('setor.tipo_setor', 'tipo')
      .addSelect('COUNT(*)', 'quantidade')
      .groupBy('setor.tipo_setor')
      .getRawMany();

    return {
      total,
      ativas,
      inativas,
      porTipo,
    };
  }
}
