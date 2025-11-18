import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cidade } from '../entities/cidade.entity';

@Injectable()
export class CidadeService {
  constructor(
    @InjectRepository(Cidade)
    private readonly cidadeRepository: Repository<Cidade>,
  ) {}

  /**
   * Lista todas as cidades de um estado pela UF
   */
  async findByEstadoUf(uf: string): Promise<Cidade[]> {
    return this.cidadeRepository.find({
      where: {
        estado: {
          uf: uf.toUpperCase(),
        },
      },
      relations: ['estado'],
      order: {
        nome: 'ASC',
      },
    });
  }

  /**
   * Lista todas as cidades de um estado pelo ID
   */
  async findByEstadoId(estadoId: string): Promise<Cidade[]> {
    return this.cidadeRepository.find({
      where: { estadoId },
      relations: ['estado'],
      order: {
        nome: 'ASC',
      },
    });
  }

  /**
   * Lista todas as cidades (útil para importação/admin)
   */
  async findAll(): Promise<Cidade[]> {
    return this.cidadeRepository.find({
      relations: ['estado'],
      order: {
        nome: 'ASC',
      },
    });
  }
}
