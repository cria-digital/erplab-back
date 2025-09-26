import { Controller, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ContaBancariaService } from './conta-bancaria.service';

@ApiTags('Contas Bancárias')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('contas-bancarias')
export class ContaBancariaController {
  constructor(private readonly service: ContaBancariaService) {}
}
