import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GatewayPagamento } from './entities/gateway-pagamento.entity';

@Injectable()
export class GatewayPagamentoService {
  constructor(
    @InjectRepository(GatewayPagamento)
    private readonly repository: Repository<GatewayPagamento>,
  ) {}
}
