import { Controller, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../autenticacao/auth/guards/jwt-auth.guard';
import { PlanoContasService } from './plano-contas.service';

@ApiTags('Plano de Contas')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('financeiro/planos-contas')
export class PlanoContasController {
  constructor(private readonly service: PlanoContasService) {}
}
