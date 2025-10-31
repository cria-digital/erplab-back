import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Public } from '../../autenticacao/auth/decorators/public.decorator';
import { ServicoSaudeService } from './servico-saude.service';
import { ServicoSaude } from './entities/servico-saude.entity';

@ApiTags('Serviços de Saúde')
@Controller('servicos-saude')
export class ServicoSaudeController {
  constructor(private readonly servicoSaudeService: ServicoSaudeService) {}

  @Public()
  @Get()
  @ApiOperation({
    summary: 'Listar todos os serviços de saúde (LC 116/2003 - Item 4)',
    description:
      'Retorna a lista completa de códigos de serviços de saúde conforme Lei Complementar 116/2003',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de serviços retornada com sucesso',
    type: [ServicoSaude],
  })
  async findAll(): Promise<ServicoSaude[]> {
    return this.servicoSaudeService.findAll();
  }
}
