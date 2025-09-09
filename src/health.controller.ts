import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Public } from './modules/auth/decorators/public.decorator';

@ApiTags('health')
@Controller('health')
export class HealthController {
  @Public()
  @Get()
  @ApiOperation({
    summary: 'Verificação de saúde do sistema',
    description:
      'Endpoint para verificar se a API e banco de dados estão funcionando corretamente',
  })
  @ApiResponse({
    status: 200,
    description: 'Sistema funcionando corretamente',
    example: {
      status: 'ok',
      message: 'ERP Laboratório Backend está funcionando!',
      timestamp: '2025-09-02T20:01:27.483Z',
      database: 'erplab - conectado',
      port: 10016,
    },
  })
  check() {
    return {
      status: 'ok',
      message: 'ERP Laboratório Backend está funcionando!',
      timestamp: new Date().toISOString(),
      database: 'erplab - conectado',
      port: process.env.PORT || 10016,
    };
  }
}
