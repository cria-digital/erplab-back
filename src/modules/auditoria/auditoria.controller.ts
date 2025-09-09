import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';

import {
  AuditoriaService,
  PaginatedResult,
  EstatisticasAuditoria,
} from './auditoria.service';
import { CreateAuditoriaLogDto, FiltrosAuditoriaDto } from './dto';
import { AuditoriaLog } from './entities/auditoria-log.entity';

interface ApiResponse<T = any> {
  message: string;
  data?: T;
}

interface RequestWithUser {
  user: {
    id: string;
    empresa_id: number;
    unidade_id?: string;
  };
  ip: string;
  headers: {
    'user-agent'?: string;
  };
}

// Nota: JwtAuthGuard será implementado no módulo de autenticação
// @UseGuards(JwtAuthGuard)

@ApiTags('Auditoria')
@ApiBearerAuth()
@Controller('auditoria')
export class AuditoriaController {
  constructor(private readonly auditoriaService: AuditoriaService) {}

  @Post('log')
  @ApiOperation({
    summary: 'Registrar log de auditoria',
    description: 'Registra um novo log de auditoria no sistema',
  })
  @ApiResponse({
    status: 201,
    description: 'Log registrado com sucesso',
    type: AuditoriaLog,
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos',
  })
  @ApiBody({ type: CreateAuditoriaLogDto })
  async registrarLog(
    @Body() createAuditoriaLogDto: CreateAuditoriaLogDto,
    @Request() req: RequestWithUser,
  ): Promise<ApiResponse<AuditoriaLog>> {
    // Adiciona informações da requisição se não fornecidas
    if (!createAuditoriaLogDto.ipAddress) {
      createAuditoriaLogDto.ipAddress = req.ip;
    }
    if (!createAuditoriaLogDto.userAgent) {
      createAuditoriaLogDto.userAgent = req.headers['user-agent'];
    }
    if (!createAuditoriaLogDto.usuarioId) {
      createAuditoriaLogDto.usuarioId = req.user.id;
    }

    const log = await this.auditoriaService.registrarLog(createAuditoriaLogDto);

    return {
      message: 'Log registrado com sucesso',
      data: log,
    };
  }

  @Get()
  @ApiOperation({
    summary: 'Buscar logs de auditoria',
    description: 'Busca logs de auditoria com filtros e paginação',
  })
  @ApiResponse({
    status: 200,
    description: 'Logs encontrados com sucesso',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/AuditoriaLog' },
        },
        total: { type: 'number', example: 100 },
        page: { type: 'number', example: 1 },
        limit: { type: 'number', example: 10 },
        totalPages: { type: 'number', example: 10 },
      },
    },
  })
  async buscarLogs(
    @Query() filtros: FiltrosAuditoriaDto,
    @Request() req: RequestWithUser,
  ): Promise<PaginatedResult<AuditoriaLog>> {
    // Se a unidade estiver definida, filtra por ela
    if (req.user.unidade_id) {
      filtros.unidadeSaudeId = req.user.unidade_id;
    }

    return await this.auditoriaService.buscarLogs(filtros);
  }

  @Get('usuario/:usuarioId')
  @ApiOperation({
    summary: 'Buscar logs por usuário',
    description: 'Busca logs de auditoria de um usuário específico',
  })
  @ApiResponse({
    status: 200,
    description: 'Logs do usuário encontrados',
    type: [AuditoriaLog],
  })
  @ApiParam({
    name: 'usuarioId',
    description: 'ID do usuário',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Limite de resultados (padrão: 50)',
  })
  async buscarLogsPorUsuario(
    @Param('usuarioId') usuarioId: string,
    @Query('limit') limit?: number,
  ): Promise<AuditoriaLog[]> {
    return await this.auditoriaService.buscarLogsPorUsuario(
      usuarioId,
      limit || 50,
    );
  }

  @Get('entidade/:entidade/:entidadeId')
  @ApiOperation({
    summary: 'Buscar logs por entidade',
    description: 'Busca logs de auditoria de uma entidade específica',
  })
  @ApiResponse({
    status: 200,
    description: 'Logs da entidade encontrados',
    type: [AuditoriaLog],
  })
  @ApiParam({
    name: 'entidade',
    description: 'Nome da entidade',
    example: 'pacientes',
  })
  @ApiParam({
    name: 'entidadeId',
    description: 'ID da entidade',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  async buscarLogsPorEntidade(
    @Param('entidade') entidade: string,
    @Param('entidadeId') entidadeId: string,
  ): Promise<AuditoriaLog[]> {
    return await this.auditoriaService.buscarLogsPorEntidade(
      entidade,
      entidadeId,
    );
  }

  @Get('estatisticas')
  @ApiOperation({
    summary: 'Obter estatísticas de auditoria',
    description: 'Retorna estatísticas consolidadas dos logs de auditoria',
  })
  @ApiResponse({
    status: 200,
    description: 'Estatísticas retornadas com sucesso',
    schema: {
      type: 'object',
      properties: {
        totalLogs: { type: 'number' },
        porTipo: {
          type: 'object',
          additionalProperties: { type: 'number' },
        },
        porNivel: {
          type: 'object',
          additionalProperties: { type: 'number' },
        },
        porOperacao: {
          type: 'object',
          additionalProperties: { type: 'number' },
        },
        acessosHoje: { type: 'number' },
        errosHoje: { type: 'number' },
        usuariosAtivos: { type: 'number' },
        modulosMaisAcessados: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              modulo: { type: 'string' },
              acessos: { type: 'number' },
            },
          },
        },
      },
    },
  })
  async obterEstatisticas(
    @Request() req: RequestWithUser,
  ): Promise<EstatisticasAuditoria> {
    return await this.auditoriaService.obterEstatisticas(req.user.unidade_id);
  }

  @Post('acesso')
  @ApiOperation({
    summary: 'Registrar acesso',
    description: 'Registra um log de acesso ao sistema',
  })
  @ApiResponse({
    status: 201,
    description: 'Acesso registrado com sucesso',
    type: AuditoriaLog,
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        acao: { type: 'string', example: 'Visualizar Lista' },
        modulo: { type: 'string', example: 'Pacientes' },
        detalhes: {
          type: 'string',
          example: 'Lista filtrada por status ativo',
        },
      },
      required: ['acao', 'modulo'],
    },
  })
  async registrarAcesso(
    @Body() body: { acao: string; modulo: string; detalhes?: string },
    @Request() req: RequestWithUser,
  ): Promise<ApiResponse<AuditoriaLog>> {
    const log = await this.auditoriaService.registrarAcesso(
      req.user.id,
      body.acao,
      body.modulo,
      body.detalhes,
      req.ip,
      req.headers['user-agent'],
    );

    return {
      message: 'Acesso registrado com sucesso',
      data: log,
    };
  }

  @Post('erro')
  @ApiOperation({
    summary: 'Registrar erro',
    description: 'Registra um log de erro no sistema',
  })
  @ApiResponse({
    status: 201,
    description: 'Erro registrado com sucesso',
    type: AuditoriaLog,
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        erro: { type: 'string', example: 'Falha ao processar pagamento' },
        modulo: { type: 'string', example: 'Financeiro' },
        detalhes: {
          type: 'string',
          example: 'Gateway de pagamento indisponível',
        },
      },
      required: ['erro'],
    },
  })
  async registrarErro(
    @Body() body: { erro: string; modulo?: string; detalhes?: string },
    @Request() req: RequestWithUser,
  ): Promise<ApiResponse<AuditoriaLog>> {
    const log = await this.auditoriaService.registrarErro(
      req.user.id,
      body.erro,
      body.modulo,
      body.detalhes,
    );

    return {
      message: 'Erro registrado com sucesso',
      data: log,
    };
  }
}
