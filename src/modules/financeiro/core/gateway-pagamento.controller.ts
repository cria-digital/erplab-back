import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../autenticacao/auth/guards/jwt-auth.guard';
import { GatewayPagamentoService } from './gateway-pagamento.service';
import { CreateGatewayPagamentoDto } from './dto/create-gateway-pagamento.dto';
import { UpdateGatewayPagamentoDto } from './dto/update-gateway-pagamento.dto';
import {
  TipoGateway,
  StatusGateway,
} from './entities/gateway-pagamento.entity';

@ApiTags('Gateways de Pagamento')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('gateways-pagamento')
export class GatewayPagamentoController {
  constructor(private readonly service: GatewayPagamentoService) {}

  @Post()
  @ApiOperation({ summary: 'Criar novo gateway de pagamento' })
  @ApiResponse({
    status: 201,
    description: 'Gateway criado com sucesso',
  })
  create(@Body() createDto: CreateGatewayPagamentoDto) {
    return this.service.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os gateways de pagamento' })
  @ApiResponse({
    status: 200,
    description: 'Lista de gateways retornada com sucesso',
  })
  findAll() {
    return this.service.findAll();
  }

  @Get('tipo/:tipo')
  @ApiOperation({ summary: 'Buscar gateways por tipo' })
  @ApiParam({
    name: 'tipo',
    description: 'Tipo do gateway',
    enum: TipoGateway,
  })
  @ApiResponse({
    status: 200,
    description: 'Gateways encontrados com sucesso',
  })
  findByTipo(@Param('tipo') tipo: TipoGateway) {
    return this.service.findByTipo(tipo);
  }

  @Get('status/:status')
  @ApiOperation({ summary: 'Buscar gateways por status' })
  @ApiParam({
    name: 'status',
    description: 'Status do gateway',
    enum: StatusGateway,
  })
  @ApiResponse({
    status: 200,
    description: 'Gateways encontrados com sucesso',
  })
  findByStatus(@Param('status') status: StatusGateway) {
    return this.service.findByStatus(status);
  }

  @Get('conta-bancaria/:contaId')
  @ApiOperation({ summary: 'Buscar gateways por conta bancária' })
  @ApiParam({
    name: 'contaId',
    description: 'ID da conta bancária',
  })
  @ApiResponse({
    status: 200,
    description: 'Gateways encontrados com sucesso',
  })
  findByContaBancaria(@Param('contaId') contaId: string) {
    return this.service.findByContaBancaria(contaId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar gateway por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID do gateway',
  })
  @ApiResponse({
    status: 200,
    description: 'Gateway encontrado com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Gateway não encontrado',
  })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar gateway' })
  @ApiParam({
    name: 'id',
    description: 'ID do gateway',
  })
  @ApiResponse({
    status: 200,
    description: 'Gateway atualizado com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Gateway não encontrado',
  })
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateGatewayPagamentoDto,
  ) {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Deletar gateway' })
  @ApiParam({
    name: 'id',
    description: 'ID do gateway',
  })
  @ApiResponse({
    status: 204,
    description: 'Gateway deletado com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Gateway não encontrado',
  })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }

  @Post(':id/test-connection')
  @ApiOperation({ summary: 'Testar conexão com o gateway' })
  @ApiParam({
    name: 'id',
    description: 'ID do gateway',
  })
  @ApiResponse({
    status: 200,
    description: 'Teste de conexão realizado',
  })
  testConnection(@Param('id') id: string) {
    return this.service.testConnection(id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Atualizar status do gateway' })
  @ApiParam({
    name: 'id',
    description: 'ID do gateway',
  })
  @ApiResponse({
    status: 200,
    description: 'Status atualizado com sucesso',
  })
  updateStatus(@Param('id') id: string, @Body('status') status: StatusGateway) {
    return this.service.updateStatus(id, status);
  }

  @Post(':id/refresh-api-key')
  @ApiOperation({ summary: 'Renovar chave API do gateway' })
  @ApiParam({
    name: 'id',
    description: 'ID do gateway',
  })
  @ApiResponse({
    status: 200,
    description: 'Chave API renovada com sucesso',
  })
  refreshApiKey(@Param('id') id: string) {
    return this.service.refreshApiKey(id);
  }

  @Get(':id/validate-configuration')
  @ApiOperation({ summary: 'Validar configuração do gateway' })
  @ApiParam({
    name: 'id',
    description: 'ID do gateway',
  })
  @ApiResponse({
    status: 200,
    description: 'Validação realizada',
  })
  validateConfiguration(@Param('id') id: string) {
    return this.service.validateConfiguration(id);
  }

  @Post(':id/process-payment')
  @ApiOperation({ summary: 'Processar pagamento através do gateway' })
  @ApiParam({
    name: 'id',
    description: 'ID do gateway',
  })
  @ApiResponse({
    status: 200,
    description: 'Pagamento processado',
  })
  processPayment(@Param('id') id: string, @Body() dadosPagamento: any) {
    return this.service.processPayment(id, dadosPagamento);
  }

  @Get(':id/transaction-history')
  @ApiOperation({ summary: 'Obter histórico de transações' })
  @ApiParam({
    name: 'id',
    description: 'ID do gateway',
  })
  @ApiResponse({
    status: 200,
    description: 'Histórico retornado com sucesso',
  })
  getTransactionHistory(@Param('id') id: string) {
    return this.service.getTransactionHistory(id);
  }

  @Get(':id/report')
  @ApiOperation({ summary: 'Gerar relatório do gateway' })
  @ApiParam({
    name: 'id',
    description: 'ID do gateway',
  })
  @ApiResponse({
    status: 200,
    description: 'Relatório gerado com sucesso',
  })
  generateReport(@Param('id') id: string) {
    return this.service.generateReport(id);
  }
}
