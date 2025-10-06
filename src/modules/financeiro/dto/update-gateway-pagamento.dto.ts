import { PartialType } from '@nestjs/swagger';
import { CreateGatewayPagamentoDto } from './create-gateway-pagamento.dto';

export class UpdateGatewayPagamentoDto extends PartialType(
  CreateGatewayPagamentoDto,
) {}
