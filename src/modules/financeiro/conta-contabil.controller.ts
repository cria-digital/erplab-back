import { Controller, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ContaContabilService } from './conta-contabil.service';

@ApiTags('Contas Contábeis')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('contas-contabeis')
export class ContaContabilController {
  constructor(private readonly service: ContaContabilService) {}
}
