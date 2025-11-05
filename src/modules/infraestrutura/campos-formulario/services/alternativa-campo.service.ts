import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AlternativaCampoFormulario } from '../entities/alternativa-campo-formulario.entity';
import { CreateAlternativaCampoDto } from '../dto/create-alternativa-campo.dto';
import { UpdateAlternativaCampoDto } from '../dto/update-alternativa-campo.dto';

@Injectable()
export class AlternativaCampoService {
  constructor(
    @InjectRepository(AlternativaCampoFormulario)
    private readonly alternativaRepository: Repository<AlternativaCampoFormulario>,
  ) {}

  /**
   * Criar nova alternativa
   */
  async create(
    campoId: string,
    createDto: CreateAlternativaCampoDto,
  ): Promise<AlternativaCampoFormulario> {
    const alternativa = this.alternativaRepository.create({
      ...createDto,
      campoFormularioId: campoId,
    });

    return this.alternativaRepository.save(alternativa);
  }

  /**
   * Listar alternativas de um campo
   */
  async findByCampo(campoId: string): Promise<AlternativaCampoFormulario[]> {
    return this.alternativaRepository.find({
      where: { campoFormularioId: campoId },
      order: { ordem: 'ASC' },
    });
  }

  /**
   * Listar apenas alternativas ativas de um campo
   */
  async findAtivasByCampo(
    campoId: string,
  ): Promise<AlternativaCampoFormulario[]> {
    return this.alternativaRepository.find({
      where: { campoFormularioId: campoId, ativo: true },
      order: { ordem: 'ASC' },
    });
  }

  /**
   * Buscar alternativa por ID
   */
  async findOne(id: string): Promise<AlternativaCampoFormulario> {
    const alternativa = await this.alternativaRepository.findOne({
      where: { id },
      relations: ['campoFormulario'],
    });

    if (!alternativa) {
      throw new NotFoundException(`Alternativa com ID ${id} não encontrada`);
    }

    return alternativa;
  }

  /**
   * Atualizar alternativa
   */
  async update(
    id: string,
    updateDto: UpdateAlternativaCampoDto,
  ): Promise<AlternativaCampoFormulario> {
    const alternativa = await this.findOne(id);

    Object.assign(alternativa, updateDto);

    return this.alternativaRepository.save(alternativa);
  }

  /**
   * Alternar status ativo/inativo
   */
  async toggleStatus(id: string): Promise<AlternativaCampoFormulario> {
    const alternativa = await this.findOne(id);
    alternativa.ativo = !alternativa.ativo;
    return this.alternativaRepository.save(alternativa);
  }

  /**
   * Remover alternativa
   */
  async remove(id: string): Promise<void> {
    const alternativa = await this.findOne(id);
    await this.alternativaRepository.remove(alternativa);
  }
}
