import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServicoSaude } from './entities/servico-saude.entity';

@Injectable()
export class ServicoSaudeService {
  constructor(
    @InjectRepository(ServicoSaude)
    private readonly servicoSaudeRepository: Repository<ServicoSaude>,
  ) {}

  async findAll(): Promise<ServicoSaude[]> {
    return this.servicoSaudeRepository.find({
      where: { ativo: true },
      order: { codigo: 'ASC' },
    });
  }

  async findByCodigo(codigo: string): Promise<ServicoSaude | null> {
    return this.servicoSaudeRepository.findOne({
      where: { codigo, ativo: true },
    });
  }
}
