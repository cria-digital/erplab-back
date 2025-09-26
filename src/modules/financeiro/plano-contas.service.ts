import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlanoContas } from './entities/plano-contas.entity';

@Injectable()
export class PlanoContasService {
  constructor(
    @InjectRepository(PlanoContas)
    private readonly repository: Repository<PlanoContas>,
  ) {}
}
