import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContaContabil } from './entities/conta-contabil.entity';

@Injectable()
export class ContaContabilService {
  constructor(
    @InjectRepository(ContaContabil)
    private readonly repository: Repository<ContaContabil>,
  ) {}
}
