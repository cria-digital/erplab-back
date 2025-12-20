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
   * @returns Lista de TUSS com descricaoCompleta (termo + código)
   */
  async search(
    query: string,
    limit: number = 20,
  ): Promise<(Tuss & { descricaoCompleta: string })[]> {
    if (!query || query.length < 2) {
      return [];
    }

    const results = await this.tussRepository.find({
      where: [
        { codigo: ILike(`%${query}%`), ativo: true },
        { termo: ILike(`%${query}%`), ativo: true },
      ],
      take: limit,
      order: { codigo: 'ASC' },
    });

    // Adiciona o campo descricaoCompleta para serialização
    return results.map((tuss) => ({
      ...tuss,
      descricaoCompleta: tuss.descricaoCompleta,
    }));
  }

  /**
   * Busca um código TUSS pelo código exato
   */
  async findByCodigo(
    codigo: string,
  ): Promise<(Tuss & { descricaoCompleta: string }) | null> {
    const tuss = await this.tussRepository.findOne({
      where: { codigo, ativo: true },
    });
    if (!tuss) return null;
    return { ...tuss, descricaoCompleta: tuss.descricaoCompleta };
  }

  /**
   * Busca um código TUSS pelo ID
   */
  async findById(
    id: string,
  ): Promise<(Tuss & { descricaoCompleta: string }) | null> {
    const tuss = await this.tussRepository.findOne({
      where: { id, ativo: true },
    });
    if (!tuss) return null;
    return { ...tuss, descricaoCompleta: tuss.descricaoCompleta };
  }

  /**
   * Lista todos os códigos TUSS ativos com paginação
   */
  async findAll(
    page: number = 1,
    limit: number = 50,
  ): Promise<PaginatedResultDto<Tuss & { descricaoCompleta: string }>> {
    const [data, total] = await this.tussRepository.findAndCount({
      where: { ativo: true },
      skip: (page - 1) * limit,
      take: limit,
      order: { codigo: 'ASC' },
    });

    // Adiciona o campo descricaoCompleta para serialização
    const dataWithDesc = data.map((tuss) => ({
      ...tuss,
      descricaoCompleta: tuss.descricaoCompleta,
    }));

    return new PaginatedResultDto(dataWithDesc, total, page, limit);
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
