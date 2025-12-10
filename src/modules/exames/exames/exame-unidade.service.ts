import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExameUnidade } from './entities/exame-unidade.entity';
import { CreateExameUnidadeDto } from './dto/create-exame-unidade.dto';

@Injectable()
export class ExameUnidadeService {
  constructor(
    @InjectRepository(ExameUnidade)
    private readonly repository: Repository<ExameUnidade>,
  ) {}

  /**
   * Valida as regras de negócio para o destino do exame:
   * - INTERNO: não pode ter laboratório de apoio nem telemedicina
   * - APOIO: deve ter laboratório de apoio, não pode ter telemedicina
   * - TELEMEDICINA: deve ter telemedicina, não pode ter laboratório de apoio
   */
  private validateDestino(dto: CreateExameUnidadeDto): void {
    const { destino, laboratorio_apoio_id, telemedicina_id } = dto;

    if (destino === 'interno') {
      if (laboratorio_apoio_id) {
        throw new BadRequestException(
          'Destino INTERNO não permite selecionar laboratório de apoio',
        );
      }
      if (telemedicina_id) {
        throw new BadRequestException(
          'Destino INTERNO não permite selecionar telemedicina',
        );
      }
    }

    if (destino === 'apoio') {
      if (!laboratorio_apoio_id) {
        throw new BadRequestException(
          'Destino APOIO requer seleção de laboratório de apoio',
        );
      }
      if (telemedicina_id) {
        throw new BadRequestException(
          'Destino APOIO não permite selecionar telemedicina',
        );
      }
    }

    if (destino === 'telemedicina') {
      if (!telemedicina_id) {
        throw new BadRequestException(
          'Destino TELEMEDICINA requer seleção de telemedicina',
        );
      }
      if (laboratorio_apoio_id) {
        throw new BadRequestException(
          'Destino TELEMEDICINA não permite selecionar laboratório de apoio',
        );
      }
    }
  }

  async create(
    exameId: string,
    dto: CreateExameUnidadeDto,
  ): Promise<ExameUnidade> {
    // Valida regras de negócio
    this.validateDestino(dto);

    // Verifica se já existe vínculo
    const existente = await this.repository.findOne({
      where: {
        exame_id: exameId,
        unidade_id: dto.unidade_id,
      },
    });

    if (existente) {
      throw new ConflictException(
        'Este exame já está vinculado a esta unidade',
      );
    }

    const entity = this.repository.create({
      exame_id: exameId,
      unidade_id: dto.unidade_id,
      destino: dto.destino,
      laboratorio_apoio_id: dto.laboratorio_apoio_id,
      telemedicina_id: dto.telemedicina_id,
      ativo: dto.ativo ?? true,
    });

    return this.repository.save(entity);
  }

  async findByExame(exameId: string): Promise<ExameUnidade[]> {
    return this.repository.find({
      where: { exame_id: exameId },
      relations: ['unidadeSaude', 'laboratorioApoio', 'telemedicina'],
      order: { created_at: 'DESC' },
    });
  }

  async findByUnidade(unidadeId: string): Promise<ExameUnidade[]> {
    return this.repository.find({
      where: { unidade_id: unidadeId },
      relations: ['exame'],
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: string): Promise<ExameUnidade> {
    const entity = await this.repository.findOne({
      where: { id },
      relations: ['exame', 'unidadeSaude', 'laboratorioApoio', 'telemedicina'],
    });

    if (!entity) {
      throw new NotFoundException(`Vínculo com ID ${id} não encontrado`);
    }

    return entity;
  }

  async update(
    id: string,
    dto: Partial<CreateExameUnidadeDto>,
  ): Promise<ExameUnidade> {
    const entity = await this.findOne(id);

    // Se está alterando o destino, valida as regras
    if (dto.destino || dto.laboratorio_apoio_id || dto.telemedicina_id) {
      const mergedDto = {
        ...entity,
        ...dto,
      } as CreateExameUnidadeDto;
      this.validateDestino(mergedDto);
    }

    Object.assign(entity, dto);
    return this.repository.save(entity);
  }

  async remove(id: string): Promise<void> {
    const result = await this.repository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Vínculo com ID ${id} não encontrado`);
    }
  }

  async toggleStatus(id: string): Promise<ExameUnidade> {
    const entity = await this.findOne(id);
    entity.ativo = !entity.ativo;
    return this.repository.save(entity);
  }
}
