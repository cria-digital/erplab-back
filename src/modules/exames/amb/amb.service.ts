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
   * @returns Lista de AMB com descricaoCompleta (descrição + código)
   */
  async search(
    query: string,
    limit: number = 20,
  ): Promise<(Amb & { descricaoCompleta: string })[]> {
    if (!query || query.length < 2) {
      return [];
    }

    const results = await this.ambRepository.find({
      where: [
        { codigo: ILike(`%${query}%`), ativo: true },
        { descricao: ILike(`%${query}%`), ativo: true },
      ],
      take: limit,
      order: { codigo: 'ASC' },
    });

    // Adiciona o campo descricaoCompleta para serialização
    return results.map((amb) => ({
      ...amb,
      descricaoCompleta: amb.descricaoCompleta,
    }));
  }

  /**
   * Busca um código AMB pelo código exato
   */
  async findByCodigo(
    codigo: string,
  ): Promise<(Amb & { descricaoCompleta: string }) | null> {
    const amb = await this.ambRepository.findOne({
      where: { codigo, ativo: true },
    });
    if (!amb) return null;
    return { ...amb, descricaoCompleta: amb.descricaoCompleta };
  }

  /**
   * Busca um código AMB pelo ID
   */
  async findById(
    id: string,
  ): Promise<(Amb & { descricaoCompleta: string }) | null> {
    const amb = await this.ambRepository.findOne({
      where: { id, ativo: true },
    });
    if (!amb) return null;
    return { ...amb, descricaoCompleta: amb.descricaoCompleta };
  }

  /**
   * Lista todos os códigos AMB ativos com paginação
   */
  async findAll(
    page: number = 1,
    limit: number = 50,
  ): Promise<PaginatedResultDto<Amb & { descricaoCompleta: string }>> {
    const [data, total] = await this.ambRepository.findAndCount({
      where: { ativo: true },
      skip: (page - 1) * limit,
      take: limit,
      order: { codigo: 'ASC' },
    });

    // Adiciona o campo descricaoCompleta para serialização
    const dataWithDesc = data.map((amb) => ({
      ...amb,
      descricaoCompleta: amb.descricaoCompleta,
    }));

    return new PaginatedResultDto(dataWithDesc, total, page, limit);
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
