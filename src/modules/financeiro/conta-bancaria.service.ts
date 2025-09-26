import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContaBancaria } from './entities/conta-bancaria.entity';

@Injectable()
export class ContaBancariaService {
  constructor(
    @InjectRepository(ContaBancaria)
    private readonly contaBancariaRepository: Repository<ContaBancaria>,
  ) {}

  // TODO: Implementar métodos do service
}
