import { Controller, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GatewayPagamentoService } from './gateway-pagamento.service';

@ApiTags('Gateways de Pagamento')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('gateways-pagamento')
export class GatewayPagamentoController {
  constructor(private readonly service: GatewayPagamentoService) {}
}
