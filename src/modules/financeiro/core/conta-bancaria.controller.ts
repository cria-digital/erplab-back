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
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../autenticacao/auth/guards/jwt-auth.guard';
import { ContaBancariaService } from './conta-bancaria.service';
import { CreateContaBancariaDto } from './dto/create-conta-bancaria.dto';
import { UpdateContaBancariaDto } from './dto/update-conta-bancaria.dto';
import { TipoConta } from './entities/conta-bancaria.entity';

@ApiTags('Contas Bancárias')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('financeiro/contas-bancarias')
export class ContaBancariaController {
  constructor(private readonly service: ContaBancariaService) {}

  @Post()
  @ApiOperation({ summary: 'Criar nova conta bancária' })
  @ApiResponse({
    status: 201,
    description: 'Conta bancária criada com sucesso',
  })
  @ApiResponse({
    status: 409,
    description: 'Já existe conta com o mesmo código interno',
  })
  create(@Body() createDto: CreateContaBancariaDto) {
    return this.service.create(createDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar todas as contas bancárias',
    description:
      'Lista contas bancárias com paginação e filtros opcionais (search, tipo, status, banco, unidade)',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de contas bancárias retornada com sucesso',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Número da página (default: 1)',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Itens por página (default: 10)',
    example: 10,
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Busca por nome, agência, conta ou banco',
    example: 'conta1',
  })
  @ApiQuery({
    name: 'tipo',
    required: false,
    enum: TipoConta,
    description: 'Filtrar por tipo de conta',
    example: 'corrente',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    type: String,
    description: 'Filtrar por status (ativa, inativa, bloqueada)',
    example: 'ativa',
  })
  @ApiQuery({
    name: 'banco_id',
    required: false,
    type: String,
    description: 'Filtrar por ID do banco',
  })
  @ApiQuery({
    name: 'unidade_id',
    required: false,
    type: String,
    description: 'Filtrar por ID da unidade de saúde',
  })
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('tipo') tipo?: TipoConta,
    @Query('status') status?: string,
    @Query('banco_id') banco_id?: string,
    @Query('unidade_id') unidade_id?: string,
  ) {
    const params = {
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 10,
      search,
      tipo,
      status: status as any,
      banco_id,
      unidade_id,
    };

    return this.service.findAll(params);
  }

  @Get('ativas')
  @ApiOperation({ summary: 'Listar contas bancárias ativas' })
  @ApiResponse({
    status: 200,
    description: 'Lista de contas ativas retornada com sucesso',
  })
  findAtivas() {
    return this.service.findAtivas();
  }

  @Get('unidade/:unidadeId')
  @ApiOperation({ summary: 'Buscar contas por unidade de saúde' })
  @ApiParam({
    name: 'unidadeId',
    description: 'ID da unidade de saúde',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de contas da unidade retornada com sucesso',
  })
  findByUnidade(@Param('unidadeId') unidadeId: string) {
    return this.service.findByUnidade(unidadeId);
  }

  @Get('banco/:bancoId')
  @ApiOperation({ summary: 'Buscar contas por banco' })
  @ApiParam({
    name: 'bancoId',
    description: 'ID do banco',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de contas do banco retornada com sucesso',
  })
  findByBanco(@Param('bancoId') bancoId: string) {
    return this.service.findByBanco(bancoId);
  }

  @Get('tipo/:tipo')
  @ApiOperation({ summary: 'Buscar contas por tipo' })
  @ApiParam({
    name: 'tipo',
    description: 'Tipo de conta',
    enum: TipoConta,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de contas do tipo especificado retornada com sucesso',
  })
  findByTipo(@Param('tipo') tipo: TipoConta) {
    return this.service.findByTipo(tipo);
  }

  @Get('codigo/:codigo')
  @ApiOperation({ summary: 'Buscar conta por código interno' })
  @ApiParam({
    name: 'codigo',
    description: 'Código interno da conta',
  })
  @ApiResponse({
    status: 200,
    description: 'Conta encontrada com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Conta não encontrada',
  })
  findByCodigo(@Param('codigo') codigo: string) {
    return this.service.findByCodigo(codigo);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar conta bancária por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID da conta bancária',
  })
  @ApiResponse({
    status: 200,
    description: 'Conta encontrada com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Conta não encontrada',
  })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar conta bancária' })
  @ApiParam({
    name: 'id',
    description: 'ID da conta bancária',
  })
  @ApiResponse({
    status: 200,
    description: 'Conta atualizada com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Conta não encontrada',
  })
  update(@Param('id') id: string, @Body() updateDto: UpdateContaBancariaDto) {
    return this.service.update(id, updateDto);
  }

  @Patch(':id/toggle-status')
  @ApiOperation({ summary: 'Alternar status da conta (ativo/inativo)' })
  @ApiParam({
    name: 'id',
    description: 'ID da conta bancária',
  })
  @ApiResponse({
    status: 200,
    description: 'Status alterado com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Conta não encontrada',
  })
  toggleStatus(@Param('id') id: string) {
    return this.service.toggleStatus(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Deletar conta bancária' })
  @ApiParam({
    name: 'id',
    description: 'ID da conta bancária',
  })
  @ApiResponse({
    status: 204,
    description: 'Conta deletada com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Conta não encontrada',
  })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
