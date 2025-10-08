import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { PrestadorServicoService } from './prestador-servico.service';
import { CreatePrestadorServicoDto } from './dto/create-prestador-servico.dto';
import { UpdatePrestadorServicoDto } from './dto/update-prestador-servico.dto';
import {
  PrestadorServico,
  StatusContrato,
} from './entities/prestador-servico.entity';

@ApiTags('Prestadores de Serviço')
@Controller('prestadores-servico')
export class PrestadorServicoController {
  constructor(
    private readonly prestadorServicoService: PrestadorServicoService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Criar novo prestador de serviço' })
  @ApiResponse({ status: 201, description: 'Prestador criado com sucesso' })
  @ApiResponse({ status: 409, description: 'Prestador já existe' })
  create(
    @Body() createDto: CreatePrestadorServicoDto,
  ): Promise<PrestadorServico> {
    return this.prestadorServicoService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os prestadores de serviço' })
  @ApiResponse({ status: 200, description: 'Lista de prestadores' })
  findAll(): Promise<PrestadorServico[]> {
    return this.prestadorServicoService.findAll();
  }

  @Get('ativos')
  @ApiOperation({ summary: 'Listar prestadores ativos' })
  @ApiResponse({ status: 200, description: 'Lista de prestadores ativos' })
  findActive(): Promise<PrestadorServico[]> {
    return this.prestadorServicoService.findActive();
  }

  @Get('urgencia')
  @ApiOperation({ summary: 'Listar prestadores que atendem urgência' })
  @ApiResponse({
    status: 200,
    description: 'Lista de prestadores com atendimento urgente',
  })
  findComUrgencia(): Promise<PrestadorServico[]> {
    return this.prestadorServicoService.findComUrgencia();
  }

  @Get('24x7')
  @ApiOperation({ summary: 'Listar prestadores com suporte 24x7' })
  @ApiResponse({ status: 200, description: 'Lista de prestadores 24x7' })
  findCom24x7(): Promise<PrestadorServico[]> {
    return this.prestadorServicoService.findCom24x7();
  }

  @Get('search')
  @ApiOperation({ summary: 'Buscar prestadores por termo' })
  @ApiQuery({ name: 'q', description: 'Termo de busca' })
  @ApiResponse({ status: 200, description: 'Prestadores encontrados' })
  search(@Query('q') termo: string): Promise<PrestadorServico[]> {
    return this.prestadorServicoService.search(termo);
  }

  @Get('estatisticas')
  @ApiOperation({ summary: 'Obter estatísticas dos prestadores' })
  @ApiResponse({ status: 200, description: 'Estatísticas' })
  getEstatisticas(): Promise<any> {
    return this.prestadorServicoService.getEstatisticas();
  }

  @Get('contratos-vencendo')
  @ApiOperation({ summary: 'Listar contratos próximos ao vencimento' })
  @ApiQuery({
    name: 'dias',
    description: 'Dias para vencimento',
    required: false,
  })
  @ApiResponse({ status: 200, description: 'Contratos vencendo' })
  getContratosVencendo(
    @Query('dias') dias?: number,
  ): Promise<PrestadorServico[]> {
    return this.prestadorServicoService.getContratosVencendo(dias);
  }

  @Get('renovacoes-automaticas')
  @ApiOperation({
    summary: 'Listar contratos com renovação automática próxima',
  })
  @ApiResponse({ status: 200, description: 'Contratos para renovação' })
  getRenovacoesAutomaticas(): Promise<PrestadorServico[]> {
    return this.prestadorServicoService.getRenovacoesAutomaticas();
  }

  @Get('status/:status')
  @ApiOperation({ summary: 'Buscar prestadores por status do contrato' })
  @ApiParam({ name: 'status', enum: StatusContrato })
  @ApiResponse({ status: 200, description: 'Prestadores encontrados' })
  findByStatus(
    @Param('status') status: StatusContrato,
  ): Promise<PrestadorServico[]> {
    return this.prestadorServicoService.findByStatus(status);
  }

  @Get('tipo-contrato/:tipo')
  @ApiOperation({ summary: 'Buscar prestadores por tipo de contrato' })
  @ApiParam({ name: 'tipo', description: 'Tipo de contrato' })
  @ApiResponse({ status: 200, description: 'Prestadores encontrados' })
  findByTipoContrato(@Param('tipo') tipo: string): Promise<PrestadorServico[]> {
    return this.prestadorServicoService.findByTipoContrato(tipo);
  }

  @Get('codigo/:codigo')
  @ApiOperation({ summary: 'Buscar prestador por código' })
  @ApiParam({ name: 'codigo', description: 'Código do prestador' })
  @ApiResponse({ status: 200, description: 'Prestador encontrado' })
  @ApiResponse({ status: 404, description: 'Prestador não encontrado' })
  findByCodigo(@Param('codigo') codigo: string): Promise<PrestadorServico> {
    return this.prestadorServicoService.findByCodigo(codigo);
  }

  @Get('cnpj/:cnpj')
  @ApiOperation({ summary: 'Buscar prestador por CNPJ' })
  @ApiParam({ name: 'cnpj', description: 'CNPJ do prestador' })
  @ApiResponse({ status: 200, description: 'Prestador encontrado' })
  @ApiResponse({ status: 404, description: 'Prestador não encontrado' })
  findByCnpj(@Param('cnpj') cnpj: string): Promise<PrestadorServico> {
    return this.prestadorServicoService.findByCnpj(cnpj);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar prestador por ID' })
  @ApiParam({ name: 'id', description: 'ID do prestador' })
  @ApiResponse({ status: 200, description: 'Prestador encontrado' })
  @ApiResponse({ status: 404, description: 'Prestador não encontrado' })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<PrestadorServico> {
    return this.prestadorServicoService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar prestador' })
  @ApiParam({ name: 'id', description: 'ID do prestador' })
  @ApiResponse({ status: 200, description: 'Prestador atualizado' })
  @ApiResponse({ status: 404, description: 'Prestador não encontrado' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdatePrestadorServicoDto,
  ): Promise<PrestadorServico> {
    return this.prestadorServicoService.update(id, updateDto);
  }

  @Patch(':id/status/:status')
  @ApiOperation({ summary: 'Atualizar status do contrato' })
  @ApiParam({ name: 'id', description: 'ID do prestador' })
  @ApiParam({ name: 'status', enum: StatusContrato })
  @ApiResponse({ status: 200, description: 'Status atualizado' })
  @ApiResponse({ status: 404, description: 'Prestador não encontrado' })
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('status') status: StatusContrato,
  ): Promise<PrestadorServico> {
    return this.prestadorServicoService.updateStatus(id, status);
  }

  @Patch(':id/toggle-status')
  @ApiOperation({ summary: 'Alternar status ativo/inativo' })
  @ApiParam({ name: 'id', description: 'ID do prestador' })
  @ApiResponse({ status: 200, description: 'Status alternado' })
  @ApiResponse({ status: 404, description: 'Prestador não encontrado' })
  toggleStatus(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<PrestadorServico> {
    return this.prestadorServicoService.toggleStatus(id);
  }

  @Post(':id/avaliar')
  @ApiOperation({ summary: 'Avaliar prestador' })
  @ApiParam({ name: 'id', description: 'ID do prestador' })
  @ApiResponse({ status: 200, description: 'Avaliação registrada' })
  @ApiResponse({ status: 404, description: 'Prestador não encontrado' })
  avaliar(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: { avaliacao: number },
  ): Promise<PrestadorServico> {
    return this.prestadorServicoService.avaliar(id, body.avaliacao);
  }

  @Post(':id/incrementar-servicos')
  @ApiOperation({ summary: 'Incrementar contador de serviços prestados' })
  @ApiParam({ name: 'id', description: 'ID do prestador' })
  @ApiResponse({ status: 200, description: 'Contador incrementado' })
  @ApiResponse({ status: 404, description: 'Prestador não encontrado' })
  incrementarServicos(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<PrestadorServico> {
    return this.prestadorServicoService.incrementarServicos(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover prestador' })
  @ApiParam({ name: 'id', description: 'ID do prestador' })
  @ApiResponse({ status: 204, description: 'Prestador removido' })
  @ApiResponse({ status: 404, description: 'Prestador não encontrado' })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.prestadorServicoService.remove(id);
  }
}
