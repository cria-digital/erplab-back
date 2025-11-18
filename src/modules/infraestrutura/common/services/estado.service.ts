import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Estado } from '../entities/estado.entity';

@Injectable()
export class EstadoService {
  constructor(
    @InjectRepository(Estado)
    private readonly estadoRepository: Repository<Estado>,
  ) {}

  /**
   * Lista todos os estados do Brasil ordenados por nome
   */
  async findAll(): Promise<Estado[]> {
    return this.estadoRepository.find({
      order: {
        nome: 'ASC',
      },
    });
  }

  /**
   * Busca um estado pela UF
   */
  async findByUf(uf: string): Promise<Estado | null> {
    return this.estadoRepository.findOne({
      where: { uf: uf.toUpperCase() },
      relations: ['cidades'],
    });
  }
}
