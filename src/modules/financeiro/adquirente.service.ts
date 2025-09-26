import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Adquirente } from './entities/adquirente.entity';

@Injectable()
export class AdquirenteService {
  constructor(
    @InjectRepository(Adquirente)
    private readonly repository: Repository<Adquirente>,
  ) {}
}
