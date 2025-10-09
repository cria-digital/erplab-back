import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Amostra, TipoAmostra } from '../entities/amostra.entity';
import { CreateAmostraDto } from '../dto/create-amostra.dto';
import { UpdateAmostraDto } from '../dto/update-amostra.dto';

export interface PaginatedAmostraResult {
  data: Amostra[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class AmostrasService {
  constructor(
    @InjectRepository(Amostra)
    private readonly amostraRepository: Repository<Amostra>,
  ) {}

  /**
   * Criar nova amostra
   */
  async create(
    createAmostraDto: CreateAmostraDto,
    usuarioId: string,
  ): Promise<Amostra> {
    // Verificar se código já existe
    const existingAmostra = await this.amostraRepository.findOne({
      where: { codigoInterno: createAmostraDto.codigoInterno },
    });

    if (existingAmostra) {
      throw new ConflictException(
        `Amostra com código ${createAmostraDto.codigoInterno} já existe`,
      );
    }

    // Validações
    this.validateAmostraData(createAmostraDto);

    const amostra = this.amostraRepository.create({
      ...createAmostraDto,
      criadoPor: usuarioId,
      atualizadoPor: usuarioId,
    });

    return this.amostraRepository.save(amostra);
  }

  /**
   * Listar amostras com paginação e filtros
   */
  async findAll(
    page: number = 1,
    limit: number = 10,
    search?: string,
    tipoAmostra?: TipoAmostra,
    ativo?: boolean,
  ): Promise<PaginatedAmostraResult> {
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.nome = Like(`%${search}%`);
    }

    if (tipoAmostra) {
      where.tipoAmostra = tipoAmostra;
    }

    if (ativo !== undefined) {
      where.ativo = ativo;
    }

    const [data, total] = await this.amostraRepository.findAndCount({
      where,
      order: {
        nome: 'ASC',
      },
      skip,
      take: limit,
    });

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Buscar amostra por ID
   */
  async findOne(id: string): Promise<Amostra> {
    const amostra = await this.amostraRepository.findOne({
      where: { id },
    });

    if (!amostra) {
      throw new NotFoundException(`Amostra com ID ${id} não encontrada`);
    }

    return amostra;
  }

  /**
   * Buscar amostra por código interno
   */
  async findByCodigo(codigoInterno: string): Promise<Amostra> {
    const amostra = await this.amostraRepository.findOne({
      where: { codigoInterno },
    });

    if (!amostra) {
      throw new NotFoundException(
        `Amostra com código ${codigoInterno} não encontrada`,
      );
    }

    return amostra;
  }

  /**
   * Buscar amostras por tipo
   */
  async findByTipo(tipoAmostra: TipoAmostra): Promise<Amostra[]> {
    return this.amostraRepository.find({
      where: { tipoAmostra, ativo: true },
      order: { nome: 'ASC' },
    });
  }

  /**
   * Buscar amostras ativas
   */
  async findAtivas(): Promise<Amostra[]> {
    return this.amostraRepository.find({
      where: { ativo: true },
      order: { nome: 'ASC' },
    });
  }

  /**
   * Atualizar amostra
   */
  async update(
    id: string,
    updateAmostraDto: UpdateAmostraDto,
    usuarioId: string,
  ): Promise<Amostra> {
    const amostra = await this.findOne(id);

    // Verificar conflito de código
    if (
      updateAmostraDto.codigoInterno &&
      updateAmostraDto.codigoInterno !== amostra.codigoInterno
    ) {
      const existingAmostra = await this.amostraRepository.findOne({
        where: { codigoInterno: updateAmostraDto.codigoInterno },
      });

      if (existingAmostra) {
        throw new ConflictException(
          `Amostra com código ${updateAmostraDto.codigoInterno} já existe`,
        );
      }
    }

    // Validações
    this.validateAmostraData({ ...amostra, ...updateAmostraDto });

    Object.assign(amostra, {
      ...updateAmostraDto,
      atualizadoPor: usuarioId,
    });

    return this.amostraRepository.save(amostra);
  }

  /**
   * Remover amostra (soft delete)
   */
  async remove(id: string, usuarioId: string): Promise<void> {
    const amostra = await this.findOne(id);

    amostra.ativo = false;
    amostra.atualizadoPor = usuarioId;

    await this.amostraRepository.save(amostra);
  }

  /**
   * Ativar amostra
   */
  async activate(id: string, usuarioId: string): Promise<Amostra> {
    const amostra = await this.findOne(id);

    amostra.ativo = true;
    amostra.atualizadoPor = usuarioId;

    return this.amostraRepository.save(amostra);
  }

  /**
   * Desativar amostra
   */
  async deactivate(id: string, usuarioId: string): Promise<Amostra> {
    const amostra = await this.findOne(id);

    amostra.ativo = false;
    amostra.atualizadoPor = usuarioId;

    return this.amostraRepository.save(amostra);
  }

  /**
   * Estatísticas de amostras
   */
  async getStats() {
    const [total, ativas, inativas, porTipo] = await Promise.all([
      this.amostraRepository.count(),
      this.amostraRepository.count({ where: { ativo: true } }),
      this.amostraRepository.count({ where: { ativo: false } }),
      this.amostraRepository
        .createQueryBuilder('amostra')
        .select('amostra.tipo_amostra', 'tipo')
        .addSelect('COUNT(*)', 'quantidade')
        .groupBy('amostra.tipo_amostra')
        .getRawMany(),
    ]);

    return {
      total,
      ativas,
      inativas,
      porTipo: porTipo.reduce(
        (acc, item) => {
          acc[item.tipo] = parseInt(item.quantidade);
          return acc;
        },
        {} as Record<string, number>,
      ),
    };
  }

  /**
   * Validar dados da amostra
   */
  private validateAmostraData(data: Partial<Amostra>): void {
    // Volume mínimo <= Volume ideal
    if (
      data.volumeMinimo !== undefined &&
      data.volumeIdeal !== undefined &&
      data.volumeMinimo > data.volumeIdeal
    ) {
      throw new BadRequestException(
        'Volume mínimo não pode ser maior que volume ideal',
      );
    }

    // Temperatura mínima < Temperatura máxima
    if (
      data.temperaturaMin !== undefined &&
      data.temperaturaMax !== undefined &&
      data.temperaturaMin >= data.temperaturaMax
    ) {
      throw new BadRequestException(
        'Temperatura mínima deve ser menor que temperatura máxima',
      );
    }

    // Se requer jejum, tempo deve ser > 0
    if (data.requerJejum && (!data.tempoJejum || data.tempoJejum <= 0)) {
      throw new BadRequestException(
        'Tempo de jejum deve ser maior que zero quando jejum é obrigatório',
      );
    }

    // Se requer centrifugação, tempo e rotação obrigatórios
    if (data.requerCentrifugacao) {
      if (!data.tempoCentrifugacao || data.tempoCentrifugacao <= 0) {
        throw new BadRequestException(
          'Tempo de centrifugação obrigatório quando centrifugação é necessária',
        );
      }
      if (!data.rotacaoCentrifugacao || data.rotacaoCentrifugacao <= 0) {
        throw new BadRequestException(
          'Rotação de centrifugação obrigatória quando centrifugação é necessária',
        );
      }
    }

    // Prazo validade > 0
    if (data.prazoValidadeHoras !== undefined && data.prazoValidadeHoras <= 0) {
      throw new BadRequestException(
        'Prazo de validade deve ser maior que zero',
      );
    }
  }
}
