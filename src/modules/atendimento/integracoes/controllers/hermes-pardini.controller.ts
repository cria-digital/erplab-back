import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../autenticacao/auth/guards/jwt-auth.guard';
import { HermesPardiniService } from '../services/hermes-pardini.service';
import {
  RecebeAtendimentoDto,
  ConsultaLaudoDto,
  ConsultaLaudoListaDto,
  ConsultaLaudoPeriodoDto,
  ConsultaStatusDto,
  CancelaExameDto,
  ConsultaRastreabilidadeDto,
  EnviaResultadoBase64Dto,
  RelatorioRequisicoesDto,
} from '../dto/hermes-pardini.dto';

@ApiTags('Hermes Pardini - SOAP')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('atendimento/integracoes/hermes-pardini')
export class HermesPardiniController {
  constructor(private readonly hermesPardiniService: HermesPardiniService) {}

  @Post('testar-conexao')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Testar conexão com Hermes Pardini' })
  @ApiResponse({ status: 200, description: 'Resultado do teste' })
  async testarConexao() {
    return await this.hermesPardiniService.testarConexao();
  }

  @Post('recebe-atendimento')
  @ApiOperation({ summary: 'Enviar requisição de exame' })
  @ApiResponse({ status: 201, description: 'Requisição enviada com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  async recebeAtendimento(@Body() dto: RecebeAtendimentoDto) {
    return await this.hermesPardiniService.recebeAtendimento(dto);
  }

  @Post('envia-laudo')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Buscar laudo de um atendimento' })
  @ApiResponse({ status: 200, description: 'Laudo recuperado' })
  @ApiResponse({ status: 404, description: 'Laudo não encontrado' })
  async enviaLaudo(@Body() dto: ConsultaLaudoDto) {
    return await this.hermesPardiniService.enviaLaudoAtendimento(dto);
  }

  @Post('envia-laudo-lista')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Buscar laudos de múltiplos atendimentos' })
  @ApiResponse({ status: 200, description: 'Laudos recuperados' })
  async enviaLaudoLista(@Body() dto: ConsultaLaudoListaDto) {
    return await this.hermesPardiniService.enviaLaudoAtendimentoLista(
      dto.numerosRequisicao,
    );
  }

  @Post('envia-laudo-periodo')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Buscar laudos por período' })
  @ApiResponse({ status: 200, description: 'Laudos do período recuperados' })
  async enviaLaudoPeriodo(@Body() dto: ConsultaLaudoPeriodoDto) {
    return await this.hermesPardiniService.enviaLaudoAtendimentoPorPeriodo(dto);
  }

  @Get('consulta-status')
  @ApiOperation({ summary: 'Consultar status de uma requisição' })
  @ApiResponse({ status: 200, description: 'Status consultado' })
  async consultaStatus(@Query() dto: ConsultaStatusDto) {
    return await this.hermesPardiniService.consultaStatusAtendimento(dto);
  }

  @Get('lista-procedimentos-pendentes')
  @ApiOperation({ summary: 'Listar procedimentos com resultados pendentes' })
  @ApiResponse({ status: 200, description: 'Procedimentos listados' })
  async listaProcedimentosPendentes() {
    return await this.hermesPardiniService.listaProcedimentosPendentes();
  }

  @Post('cancela-exame')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cancelar um exame' })
  @ApiResponse({ status: 200, description: 'Exame cancelado' })
  async cancelaExame(@Body() dto: CancelaExameDto) {
    return await this.hermesPardiniService.cancelaExame(dto);
  }

  @Get('envia-resultado-base64')
  @ApiOperation({ summary: 'Buscar resultado em Base64 (PDF)' })
  @ApiResponse({ status: 200, description: 'Resultado Base64 recuperado' })
  async enviaResultadoBase64(@Query() dto: EnviaResultadoBase64Dto) {
    return await this.hermesPardiniService.enviaResultadoBase64(
      dto.numeroRequisicao,
    );
  }

  @Post('relatorio-requisicoes')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Gerar relatório de requisições enviadas' })
  @ApiResponse({ status: 200, description: 'Relatório gerado' })
  async relatorioRequisicoes(@Body() dto: RelatorioRequisicoesDto) {
    return await this.hermesPardiniService.relatorioRequisicoesEnviadas(
      dto.dataInicio,
      dto.dataFim,
    );
  }

  @Get('consulta-rastreabilidade')
  @ApiOperation({ summary: 'Consultar rastreamento de amostra' })
  @ApiResponse({ status: 200, description: 'Rastreamento consultado' })
  async consultaRastreabilidade(@Query() dto: ConsultaRastreabilidadeDto) {
    return await this.hermesPardiniService.consultaRastreabilidade(
      dto.numeroRequisicao,
    );
  }
}
