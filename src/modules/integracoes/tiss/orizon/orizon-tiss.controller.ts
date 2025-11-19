import {
  Controller,
  Post,
  Get,
  Body,
  Param,
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
import { OrizonTissService } from './orizon-tiss.service';
import { EnviarLoteGuiasDto, LoteGuiasResponseDto } from './dto/lote-guias.dto';
import {
  ConsultarStatusProtocoloDto,
  StatusProtocoloResponseDto,
  GerarProtocoloPdfDto,
  ProtocoloPdfResponseDto,
} from './dto/protocolo.dto';
import {
  CancelarGuiaDto,
  CancelamentoGuiaResponseDto,
} from './dto/cancelamento.dto';
import {
  SolicitarDemonstrativoDto,
  DemonstrativoResponseDto,
} from './dto/demonstrativo.dto';
import {
  EnviarRecursoGlosaDto,
  RecursoGlosaResponseDto,
  ConsultarStatusRecursoDto,
  StatusRecursoResponseDto,
} from './dto/recurso-glosa.dto';
import {
  EnviarDocumentosDto,
  DocumentosResponseDto,
} from './dto/documentos.dto';

/**
 * Controller para integração TISS com Orizon
 *
 * Endpoints para consumir webservices SOAP da Orizon:
 * - Envio e consulta de lotes de guias
 * - Geração de comprovantes PDF
 * - Cancelamento de guias
 * - Demonstrativos
 * - Recursos de glosa
 * - Envio de documentos
 */
@ApiTags('Integrações TISS - Orizon')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/v1/integracoes/tiss/orizon')
export class OrizonTissController {
  constructor(private readonly orizonService: OrizonTissService) {}

  @Post('lote-guias')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Enviar lote de guias para a Orizon' })
  @ApiResponse({
    status: 200,
    description: 'Lote enviado com sucesso',
    type: LoteGuiasResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 500, description: 'Erro ao comunicar com webservice' })
  async enviarLoteGuias(@Body() dto: EnviarLoteGuiasDto) {
    return this.orizonService.enviarLoteGuias(dto);
  }

  @Post('status-protocolo')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Consultar status de protocolo' })
  @ApiResponse({
    status: 200,
    description: 'Status consultado com sucesso',
    type: StatusProtocoloResponseDto,
  })
  async consultarStatusProtocolo(@Body() dto: ConsultarStatusProtocoloDto) {
    return this.orizonService.consultarStatusProtocolo(dto);
  }

  @Get('status-protocolo/:numeroProtocolo')
  @ApiOperation({ summary: 'Consultar status de protocolo (via GET)' })
  @ApiResponse({
    status: 200,
    description: 'Status consultado com sucesso',
    type: StatusProtocoloResponseDto,
  })
  async consultarStatusProtocoloGet(
    @Param('numeroProtocolo') numeroProtocolo: string,
  ) {
    return this.orizonService.consultarStatusProtocolo({ numeroProtocolo });
  }

  @Post('gerar-pdf')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Gerar protocolo em PDF (base64)' })
  @ApiResponse({
    status: 200,
    description: 'PDF gerado com sucesso',
    type: ProtocoloPdfResponseDto,
  })
  async gerarProtocoloPdf(@Body() dto: GerarProtocoloPdfDto) {
    return this.orizonService.gerarProtocoloPdf(dto);
  }

  @Post('cancelar-guia')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cancelar guia' })
  @ApiResponse({
    status: 200,
    description: 'Guia cancelada com sucesso',
    type: CancelamentoGuiaResponseDto,
  })
  async cancelarGuia(@Body() dto: CancelarGuiaDto) {
    return this.orizonService.cancelarGuia(dto);
  }

  @Post('demonstrativo')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Solicitar demonstrativo de pagamento' })
  @ApiResponse({
    status: 200,
    description: 'Demonstrativo gerado com sucesso',
    type: DemonstrativoResponseDto,
  })
  async solicitarDemonstrativo(@Body() dto: SolicitarDemonstrativoDto) {
    return this.orizonService.solicitarDemonstrativo(dto);
  }

  @Post('recurso-glosa')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Enviar recurso contra glosa' })
  @ApiResponse({
    status: 200,
    description: 'Recurso enviado com sucesso',
    type: RecursoGlosaResponseDto,
  })
  async enviarRecursoGlosa(@Body() dto: EnviarRecursoGlosaDto) {
    return this.orizonService.enviarRecursoGlosa(dto);
  }

  @Post('status-recurso')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Consultar status de recurso de glosa' })
  @ApiResponse({
    status: 200,
    description: 'Status consultado com sucesso',
    type: StatusRecursoResponseDto,
  })
  async consultarStatusRecurso(@Body() dto: ConsultarStatusRecursoDto) {
    return this.orizonService.consultarStatusRecurso(dto);
  }

  @Get('status-recurso/:numeroProtocolo')
  @ApiOperation({ summary: 'Consultar status de recurso (via GET)' })
  @ApiResponse({
    status: 200,
    description: 'Status consultado com sucesso',
    type: StatusRecursoResponseDto,
  })
  async consultarStatusRecursoGet(
    @Param('numeroProtocolo') numeroProtocolo: string,
  ) {
    return this.orizonService.consultarStatusRecurso({ numeroProtocolo });
  }

  @Post('documentos')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Enviar documentos anexos' })
  @ApiResponse({
    status: 200,
    description: 'Documentos enviados com sucesso',
    type: DocumentosResponseDto,
  })
  async enviarDocumentos(@Body() dto: EnviarDocumentosDto) {
    return this.orizonService.enviarDocumentos(dto);
  }
}
