import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuditoriaService } from '../services/auditoria.service';
import { ConsultaAuditoriaDto, ConsultaHistoricoDto } from '../dto/consulta-auditoria.dto';

// Nota: JwtAuthGuard será implementado no módulo de autenticação
// @UseGuards(JwtAuthGuard)

@ApiTags('Auditoria')
@ApiBearerAuth()
@Controller('auditoria')
export class AuditoriaController {
  constructor(private readonly auditoriaService: AuditoriaService) {}

  @Get('logs')
  @ApiOperation({ 
    summary: 'Consultar logs de auditoria',
    description: 'Retorna os logs de auditoria do sistema com filtros opcionais'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de logs de auditoria retornada com sucesso'
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Não autorizado' 
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Acesso negado - permissão insuficiente' 
  })
  async consultarLogs(@Query() filtros: ConsultaAuditoriaDto) {
    const { page, limit, ...outrosFiltros } = filtros;
    
    const filtrosConvertidos = {
      ...outrosFiltros,
      dataInicio: filtros.dataInicio ? new Date(filtros.dataInicio) : undefined,
      dataFim: filtros.dataFim ? new Date(filtros.dataFim) : undefined,
    };

    return await this.auditoriaService.obterLogsAuditoria(
      filtrosConvertidos,
      { page: page || 1, limit: limit || 50 }
    );
  }

  @Get('historico')
  @ApiOperation({ 
    summary: 'Consultar histórico de alterações',
    description: 'Retorna o histórico detalhado de alterações nos registros do sistema'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Histórico de alterações retornado com sucesso'
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Não autorizado' 
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Acesso negado - permissão insuficiente' 
  })
  async consultarHistorico(@Query() filtros: ConsultaHistoricoDto) {
    const { page, limit, ...outrosFiltros } = filtros;
    
    const filtrosConvertidos = {
      ...outrosFiltros,
      dataInicio: filtros.dataInicio ? new Date(filtros.dataInicio) : undefined,
      dataFim: filtros.dataFim ? new Date(filtros.dataFim) : undefined,
    };

    return await this.auditoriaService.obterHistoricoAlteracoes(
      filtrosConvertidos,
      { page: page || 1, limit: limit || 50 }
    );
  }

  @Get('estatisticas')
  @ApiOperation({ 
    summary: 'Obter estatísticas de auditoria',
    description: 'Retorna estatísticas e métricas dos logs de auditoria'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Estatísticas retornadas com sucesso'
  })
  async obterEstatisticas() {
    // Implementação de estatísticas será adicionada posteriormente
    return {
      message: 'Estatísticas de auditoria - implementação em desenvolvimento',
      implementado: false
    };
  }
}