import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  Query,
  Request,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { FilaAtendimentoService } from '../services/fila-atendimento.service';
import { CriarSenhaDto, ChamarSenhaDto, FiltroFilaDto } from '../dto';
import { SenhaAtendimento } from '../entities/senha-atendimento.entity';

@ApiTags('Fila de Atendimento')
@ApiBearerAuth()
@Controller('atendimento/fila')
export class FilaAtendimentoController {
  constructor(private readonly filaService: FilaAtendimentoService) {}

  @Post('gerar-senha')
  @ApiOperation({ summary: 'Gerar nova senha de atendimento' })
  @ApiResponse({
    status: 201,
    description: 'Senha gerada com sucesso',
    type: SenhaAtendimento,
  })
  async gerarSenha(
    @Body() dto: CriarSenhaDto,
    @Request() req: any,
  ): Promise<{ message: string; data: SenhaAtendimento }> {
    const senha = await this.filaService.gerarSenha(dto, req.user?.tenantId);
    return { message: 'Senha gerada com sucesso', data: senha };
  }

  @Post('chamar')
  @ApiOperation({ summary: 'Chamar próxima senha' })
  @ApiResponse({
    status: 200,
    description: 'Senha chamada com sucesso',
    type: SenhaAtendimento,
  })
  @ApiResponse({ status: 404, description: 'Senha não encontrada' })
  async chamarSenha(
    @Body() dto: ChamarSenhaDto,
    @Request() req: any,
  ): Promise<{ message: string; data: SenhaAtendimento }> {
    const senha = await this.filaService.chamarSenha(dto, req.user.id);
    return {
      message: `Senha ${senha.ticket} chamada com sucesso`,
      data: senha,
    };
  }

  @Patch(':id/iniciar-atendimento')
  @ApiOperation({ summary: 'Iniciar atendimento de uma senha chamada' })
  @ApiResponse({
    status: 200,
    description: 'Atendimento iniciado',
    type: SenhaAtendimento,
  })
  @ApiResponse({ status: 400, description: 'Senha não foi chamada ainda' })
  async iniciarAtendimento(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: any,
  ): Promise<{ message: string; data: SenhaAtendimento }> {
    const senha = await this.filaService.iniciarAtendimento(id, req.user.id);
    return { message: 'Atendimento iniciado', data: senha };
  }

  @Patch(':id/finalizar-atendimento')
  @ApiOperation({ summary: 'Finalizar atendimento' })
  @ApiResponse({
    status: 200,
    description: 'Atendimento finalizado',
    type: SenhaAtendimento,
  })
  @ApiResponse({ status: 400, description: 'Senha não está em atendimento' })
  async finalizarAtendimento(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: any,
  ): Promise<{ message: string; data: SenhaAtendimento }> {
    const senha = await this.filaService.finalizarAtendimento(id, req.user.id);
    return { message: 'Atendimento finalizado', data: senha };
  }

  @Patch(':id/desistencia')
  @ApiOperation({ summary: 'Marcar senha como desistência' })
  @ApiResponse({
    status: 200,
    description: 'Desistência registrada',
    type: SenhaAtendimento,
  })
  async marcarDesistencia(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ message: string; data: SenhaAtendimento }> {
    const senha = await this.filaService.marcarDesistencia(id);
    return { message: 'Desistência registrada', data: senha };
  }

  @Get()
  @ApiOperation({ summary: 'Listar fila de atendimento' })
  @ApiQuery({ name: 'unidadeId', required: false, type: String })
  @ApiQuery({ name: 'tipo', required: false, enum: ['prioridade', 'geral'] })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['aguardando', 'chamado', 'em_atendimento', 'finalizado', 'desistiu'],
  })
  @ApiQuery({
    name: 'data',
    required: false,
    type: String,
    description: 'Formato: YYYY-MM-DD',
  })
  @ApiResponse({ status: 200, description: 'Fila de atendimento' })
  async listarFila(@Query() filtro: FiltroFilaDto): Promise<{
    prioridades: SenhaAtendimento[];
    geral: SenhaAtendimento[];
    totalAguardando: number;
  }> {
    return await this.filaService.listarFila(filtro);
  }

  @Get('proxima/:unidadeId')
  @ApiOperation({ summary: 'Buscar próxima senha a ser chamada' })
  @ApiResponse({
    status: 200,
    description: 'Próxima senha',
    type: SenhaAtendimento,
  })
  async buscarProximaSenha(
    @Param('unidadeId', ParseUUIDPipe) unidadeId: string,
  ): Promise<{ data: SenhaAtendimento | null }> {
    const senha = await this.filaService.buscarProximaSenha(unidadeId);
    return { data: senha };
  }

  @Get('meus-atendimentos')
  @ApiOperation({ summary: 'Listar meus atendimentos do dia' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Lista de atendimentos' })
  async listarMeusAtendimentos(
    @Request() req: any,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<{ data: SenhaAtendimento[]; total: number }> {
    return await this.filaService.listarMeusAtendimentos(
      req.user.id,
      Number(page),
      Number(limit),
    );
  }

  @Get('estatisticas/:unidadeId')
  @ApiOperation({ summary: 'Obter estatísticas da fila' })
  @ApiResponse({ status: 200, description: 'Estatísticas da fila' })
  async obterEstatisticas(
    @Param('unidadeId', ParseUUIDPipe) unidadeId: string,
  ): Promise<{
    aguardando: { prioridade: number; geral: number };
    chamados: number;
    emAtendimento: number;
    finalizados: number;
    desistencias: number;
    tempoMedioEspera: number;
    tempoMedioAtendimento: number;
  }> {
    return await this.filaService.obterEstatisticas(unidadeId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar senha por ID' })
  @ApiResponse({
    status: 200,
    description: 'Senha encontrada',
    type: SenhaAtendimento,
  })
  @ApiResponse({ status: 404, description: 'Senha não encontrada' })
  async buscarPorId(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ data: SenhaAtendimento }> {
    const senha = await this.filaService.buscarPorId(id);
    return { data: senha };
  }
}
