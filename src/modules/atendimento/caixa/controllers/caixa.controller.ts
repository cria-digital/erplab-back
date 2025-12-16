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
import { CaixaService } from '../services/caixa.service';
import { AbrirCaixaDto, FecharCaixaDto } from '../dto';
import { Caixa } from '../entities/caixa.entity';

@ApiTags('Caixa')
@ApiBearerAuth()
@Controller('atendimento/caixa')
export class CaixaController {
  constructor(private readonly caixaService: CaixaService) {}

  @Post('abrir')
  @ApiOperation({ summary: 'Abrir caixa para iniciar atendimentos' })
  @ApiResponse({
    status: 201,
    description: 'Caixa aberto com sucesso',
    type: Caixa,
  })
  @ApiResponse({ status: 400, description: 'Caixa anterior não fechado' })
  @ApiResponse({ status: 409, description: 'Já possui caixa aberto hoje' })
  async abrirCaixa(
    @Body() dto: AbrirCaixaDto,
    @Request() req: any,
  ): Promise<{ message: string; data: Caixa }> {
    const caixa = await this.caixaService.abrirCaixa(
      dto,
      req.user.id,
      req.user.tenantId,
    );
    return { message: 'Caixa aberto com sucesso', data: caixa };
  }

  @Patch(':id/fechar')
  @ApiOperation({ summary: 'Fechar caixa do dia' })
  @ApiResponse({
    status: 200,
    description: 'Caixa fechado com sucesso',
    type: Caixa,
  })
  @ApiResponse({ status: 400, description: 'Caixa já está fechado' })
  @ApiResponse({ status: 404, description: 'Caixa não encontrado' })
  async fecharCaixa(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: FecharCaixaDto,
    @Request() req: any,
  ): Promise<{ message: string; data: Caixa }> {
    const caixa = await this.caixaService.fecharCaixa(id, dto, req.user.id);
    return { message: 'Caixa fechado com sucesso', data: caixa };
  }

  @Get('aberto')
  @ApiOperation({ summary: 'Buscar caixa aberto do usuário atual' })
  @ApiResponse({
    status: 200,
    description: 'Caixa aberto encontrado',
    type: Caixa,
  })
  async buscarCaixaAberto(
    @Request() req: any,
  ): Promise<{ data: Caixa | null }> {
    const caixa = await this.caixaService.buscarCaixaAberto(req.user.id);
    return { data: caixa };
  }

  @Get('verificar-permissao')
  @ApiOperation({ summary: 'Verificar se usuário pode iniciar atendimento' })
  @ApiResponse({
    status: 200,
    description: 'Retorna status de permissão e saldo sugerido',
  })
  async verificarPermissao(@Request() req: any): Promise<{
    podeAtender: boolean;
    caixaAberto: Caixa | null;
    saldoSugerido: number;
  }> {
    return await this.caixaService.verificarPermissaoAtendimento(req.user.id);
  }

  @Get('saldo-sugerido')
  @ApiOperation({ summary: 'Obter saldo sugerido para abertura de caixa' })
  @ApiResponse({ status: 200, description: 'Saldo do último fechamento' })
  async obterSaldoSugerido(
    @Request() req: any,
  ): Promise<{ saldoSugerido: number }> {
    const saldo = await this.caixaService.obterSaldoSugerido(req.user.id);
    return { saldoSugerido: saldo };
  }

  @Get('historico')
  @ApiOperation({ summary: 'Listar histórico de caixas do usuário' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Lista de caixas' })
  async listarHistorico(
    @Request() req: any,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<{ data: Caixa[]; total: number }> {
    return await this.caixaService.listarCaixasUsuario(
      req.user.id,
      Number(page),
      Number(limit),
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar caixa por ID' })
  @ApiResponse({ status: 200, description: 'Caixa encontrado', type: Caixa })
  @ApiResponse({ status: 404, description: 'Caixa não encontrado' })
  async buscarPorId(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ data: Caixa }> {
    const caixa = await this.caixaService.buscarPorId(id);
    return { data: caixa };
  }
}
