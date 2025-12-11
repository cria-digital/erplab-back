import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { HermesPardiniService } from './hermes-pardini.service';
import {
  EnviarPedidoDto,
  ConsultarResultadoDto,
  CancelarAmostraDto,
  CancelarExameDto,
  ConsultarPendenciaTecnicaDto,
  ConsultarRastreabilidadeDto,
  ConsultarStatusPedidoDto,
} from './dto/hermes-pardini.dto';

@ApiTags('Integrações - Hermes Pardini')
@ApiBearerAuth()
@Controller('api/v1/integracoes/hermes-pardini')
export class HermesPardiniController {
  constructor(private readonly hermesPardiniService: HermesPardiniService) {}

  // ==========================================
  // CONEXÃO E CONFIGURAÇÃO
  // ==========================================

  @Get('testar-conexao')
  @ApiOperation({ summary: 'Testa conexão com webservice Hermes Pardini' })
  @ApiResponse({ status: 200, description: 'Conexão testada com sucesso' })
  @ApiResponse({ status: 500, description: 'Erro ao testar conexão' })
  async testarConexao() {
    return this.hermesPardiniService.testarConexao();
  }

  @Get('config')
  @ApiOperation({ summary: 'Retorna configuração atual (sem dados sensíveis)' })
  @ApiResponse({ status: 200, description: 'Configuração retornada' })
  getConfig() {
    return {
      sucesso: true,
      dados: this.hermesPardiniService.getConfig(),
    };
  }

  @Get('tabela-exames')
  @ApiOperation({ summary: 'Retorna URL da tabela de exames disponíveis' })
  @ApiResponse({ status: 200, description: 'URL da tabela de exames' })
  async buscarTabelaExames() {
    return this.hermesPardiniService.buscarTabelaExames();
  }

  // ==========================================
  // ENVIO DE PEDIDOS
  // ==========================================

  @Post('pedidos')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Envia pedido para Hermes Pardini' })
  @ApiResponse({ status: 200, description: 'Pedido enviado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 500, description: 'Erro ao enviar pedido' })
  async enviarPedido(@Body() dto: EnviarPedidoDto) {
    return this.hermesPardiniService.enviarPedido(dto);
  }

  // ==========================================
  // CONSULTA DE RESULTADOS
  // ==========================================

  @Get('resultados')
  @ApiOperation({ summary: 'Consulta resultado de pedido' })
  @ApiResponse({ status: 200, description: 'Resultado encontrado' })
  @ApiResponse({ status: 404, description: 'Pedido não encontrado' })
  async consultarResultado(@Query() dto: ConsultarResultadoDto) {
    return this.hermesPardiniService.consultarResultado(dto);
  }

  @Get('resultados/pdf')
  @ApiOperation({ summary: 'Consulta resultado em PDF' })
  @ApiResponse({ status: 200, description: 'PDF do resultado' })
  async consultarResultadoPdf(@Query() dto: ConsultarResultadoDto) {
    return this.hermesPardiniService.consultarResultado({
      ...dto,
      pdf: true,
    });
  }

  // ==========================================
  // CANCELAMENTOS
  // ==========================================

  @Post('cancelar-amostra')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cancela uma amostra' })
  @ApiResponse({ status: 200, description: 'Amostra cancelada' })
  @ApiResponse({ status: 400, description: 'Erro ao cancelar' })
  async cancelarAmostra(@Body() dto: CancelarAmostraDto) {
    return this.hermesPardiniService.cancelarAmostra(dto);
  }

  @Post('cancelar-exame')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cancela um exame específico' })
  @ApiResponse({ status: 200, description: 'Exame cancelado' })
  @ApiResponse({ status: 400, description: 'Erro ao cancelar' })
  async cancelarExame(@Body() dto: CancelarExameDto) {
    return this.hermesPardiniService.cancelarExame(dto);
  }

  // ==========================================
  // CONSULTAS
  // ==========================================

  @Get('pendencias')
  @ApiOperation({ summary: 'Consulta pendências técnicas' })
  @ApiResponse({ status: 200, description: 'Lista de pendências' })
  async consultarPendencias(@Query() dto: ConsultarPendenciaTecnicaDto) {
    return this.hermesPardiniService.consultarPendenciaTecnica(dto);
  }

  @Get('rastreabilidade')
  @ApiOperation({ summary: 'Consulta rastreabilidade de amostra' })
  @ApiResponse({ status: 200, description: 'Eventos de rastreio' })
  async consultarRastreabilidade(@Query() dto: ConsultarRastreabilidadeDto) {
    return this.hermesPardiniService.consultarRastreabilidade(dto);
  }

  @Get('status')
  @ApiOperation({ summary: 'Consulta status de pedido' })
  @ApiResponse({ status: 200, description: 'Status do pedido' })
  async consultarStatus(@Query() dto: ConsultarStatusPedidoDto) {
    return this.hermesPardiniService.consultarStatusPedido(dto);
  }

  @Get('grupos-fracionamento')
  @ApiOperation({ summary: 'Lista grupos de fracionamento' })
  @ApiResponse({ status: 200, description: 'Lista de grupos' })
  async listarGruposFracionamento() {
    return this.hermesPardiniService.buscarGruposFracionamento();
  }
}
