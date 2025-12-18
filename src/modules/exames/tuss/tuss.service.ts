import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Tuss } from './entities/tuss.entity';
import { PaginatedResultDto } from '../../infraestrutura/common/dto/pagination.dto';

@Injectable()
export class TussService {
  constructor(
    @InjectRepository(Tuss)
    private readonly tussRepository: Repository<Tuss>,
  ) {}

  /**
   * Busca códigos TUSS por código ou termo (autocomplete)
   * @param query Termo de busca (código ou descrição)
   * @param limit Limite de resultados (padrão: 20)
   */
  async search(query: string, limit: number = 20): Promise<Tuss[]> {
    if (!query || query.length < 2) {
      return [];
    }

    return this.tussRepository.find({
      where: [
        { codigo: ILike(`%${query}%`), ativo: true },
        { termo: ILike(`%${query}%`), ativo: true },
      ],
      take: limit,
      order: { codigo: 'ASC' },
    });
  }

  /**
   * Busca um código TUSS pelo código exato
   */
  async findByCodigo(codigo: string): Promise<Tuss | null> {
    return this.tussRepository.findOne({
      where: { codigo, ativo: true },
    });
  }

  /**
   * Busca um código TUSS pelo ID
   */
  async findById(id: string): Promise<Tuss | null> {
    return this.tussRepository.findOne({
      where: { id, ativo: true },
    });
  }

  /**
   * Lista todos os códigos TUSS ativos com paginação
   */
  async findAll(
    page: number = 1,
    limit: number = 50,
  ): Promise<PaginatedResultDto<Tuss>> {
    const [data, total] = await this.tussRepository.findAndCount({
      where: { ativo: true },
      skip: (page - 1) * limit,
      take: limit,
      order: { codigo: 'ASC' },
    });

    return new PaginatedResultDto(data, total, page, limit);
  }

  /**
   * Retorna estatísticas da tabela TUSS
   */
  async getStats(): Promise<{ total: number; ativos: number }> {
    const total = await this.tussRepository.count();
    const ativos = await this.tussRepository.count({ where: { ativo: true } });
    return { total, ativos };
  }
}
