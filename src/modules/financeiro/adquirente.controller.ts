import { Controller, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdquirenteService } from './adquirente.service';

@ApiTags('Adquirentes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('adquirentes')
export class AdquirenteController {
  constructor(private readonly service: AdquirenteService) {}
}
