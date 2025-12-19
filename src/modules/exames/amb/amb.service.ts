import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Amb } from './entities/amb.entity';
import { PaginatedResultDto } from '../../infraestrutura/common/dto/pagination.dto';

@Injectable()
export class AmbService {
  constructor(
    @InjectRepository(Amb)
    private readonly ambRepository: Repository<Amb>,
  ) {}

  /**
   * Busca códigos AMB por código ou descrição (autocomplete)
   * @param query Termo de busca (código ou descrição)
   * @param limit Limite de resultados (padrão: 20)
   */
  async search(query: string, limit: number = 20): Promise<Amb[]> {
    if (!query || query.length < 2) {
      return [];
    }

    return this.ambRepository.find({
      where: [
        { codigo: ILike(`%${query}%`), ativo: true },
        { descricao: ILike(`%${query}%`), ativo: true },
      ],
      take: limit,
      order: { codigo: 'ASC' },
    });
  }

  /**
   * Busca um código AMB pelo código exato
   */
  async findByCodigo(codigo: string): Promise<Amb | null> {
    return this.ambRepository.findOne({
      where: { codigo, ativo: true },
    });
  }

  /**
   * Busca um código AMB pelo ID
   */
  async findById(id: string): Promise<Amb | null> {
    return this.ambRepository.findOne({
      where: { id, ativo: true },
    });
  }

  /**
   * Lista todos os códigos AMB ativos com paginação
   */
  async findAll(
    page: number = 1,
    limit: number = 50,
  ): Promise<PaginatedResultDto<Amb>> {
    const [data, total] = await this.ambRepository.findAndCount({
      where: { ativo: true },
      skip: (page - 1) * limit,
      take: limit,
      order: { codigo: 'ASC' },
    });

    return new PaginatedResultDto(data, total, page, limit);
  }

  /**
   * Retorna estatísticas da tabela AMB
   */
  async getStats(): Promise<{ total: number; ativos: number }> {
    const total = await this.ambRepository.count();
    const ativos = await this.ambRepository.count({ where: { ativo: true } });
    return { total, ativos };
  }
}
