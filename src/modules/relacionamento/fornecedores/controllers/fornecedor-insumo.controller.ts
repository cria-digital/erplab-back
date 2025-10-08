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
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { FornecedorInsumoService } from '../services/fornecedor-insumo.service';
import { CreateFornecedorInsumoDto } from '../dto/create-fornecedor-insumo.dto';
import { UpdateFornecedorInsumoDto } from '../dto/update-fornecedor-insumo.dto';
import { FornecedorInsumo } from '../entities/fornecedor-insumo.entity';

@ApiTags('Fornecedores - Insumos')
@Controller('relacionamento/fornecedor-insumos')
export class FornecedorInsumoController {
  constructor(
    private readonly fornecedorInsumoService: FornecedorInsumoService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Cadastrar novo insumo para fornecedor' })
  @ApiResponse({
    status: 201,
    description: 'Insumo cadastrado com sucesso.',
    type: FornecedorInsumo,
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  @ApiResponse({
    status: 409,
    description: 'Código interno já existe para este fornecedor.',
  })
  async create(
    @Body() createFornecedorInsumoDto: CreateFornecedorInsumoDto,
  ): Promise<FornecedorInsumo> {
    return await this.fornecedorInsumoService.create(createFornecedorInsumoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os insumos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de insumos retornada com sucesso.',
    type: [FornecedorInsumo],
  })
  async findAll(): Promise<FornecedorInsumo[]> {
    return await this.fornecedorInsumoService.findAll();
  }

  @Get('ativos')
  @ApiOperation({ summary: 'Listar insumos ativos e disponíveis' })
  @ApiResponse({
    status: 200,
    description: 'Lista de insumos ativos.',
    type: [FornecedorInsumo],
  })
  async findAtivos(): Promise<FornecedorInsumo[]> {
    return await this.fornecedorInsumoService.findAtivos();
  }

  @Get('promocoes')
  @ApiOperation({ summary: 'Listar insumos em promoção' })
  @ApiResponse({
    status: 200,
    description: 'Lista de insumos em promoção.',
    type: [FornecedorInsumo],
  })
  async findPromocoes(): Promise<FornecedorInsumo[]> {
    return await this.fornecedorInsumoService.findPromocoes();
  }

  @Get('estoque-baixo')
  @ApiOperation({ summary: 'Listar insumos com estoque baixo' })
  @ApiQuery({
    name: 'minimo',
    description: 'Quantidade mínima (padrão: 10)',
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de insumos com estoque baixo.',
    type: [FornecedorInsumo],
  })
  async findComEstoqueBaixo(
    @Query('minimo') minimo?: number,
  ): Promise<FornecedorInsumo[]> {
    return await this.fornecedorInsumoService.findComEstoqueBaixo(minimo);
  }

  @Get('vencendo-validade')
  @ApiOperation({ summary: 'Listar insumos vencendo validade' })
  @ApiQuery({
    name: 'dias',
    description: 'Dias para vencimento (padrão: 30)',
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de insumos vencendo validade.',
    type: [FornecedorInsumo],
  })
  async findVencendoValidade(
    @Query('dias') dias?: number,
  ): Promise<FornecedorInsumo[]> {
    return await this.fornecedorInsumoService.findVencendoValidade(dias);
  }

  @Get('fornecedor/:fornecedorId')
  @ApiOperation({ summary: 'Listar insumos de um fornecedor' })
  @ApiParam({ name: 'fornecedorId', description: 'ID do fornecedor' })
  @ApiResponse({
    status: 200,
    description: 'Lista de insumos do fornecedor.',
    type: [FornecedorInsumo],
  })
  async findByFornecedor(
    @Param('fornecedorId', ParseUUIDPipe) fornecedorId: string,
  ): Promise<FornecedorInsumo[]> {
    return await this.fornecedorInsumoService.findByFornecedor(fornecedorId);
  }

  @Get('categoria/:categoria')
  @ApiOperation({ summary: 'Listar insumos por categoria' })
  @ApiParam({ name: 'categoria', description: 'Categoria do insumo' })
  @ApiResponse({
    status: 200,
    description: 'Lista de insumos por categoria.',
    type: [FornecedorInsumo],
  })
  async findByCategoria(
    @Param('categoria') categoria: string,
  ): Promise<FornecedorInsumo[]> {
    return await this.fornecedorInsumoService.findByCategoria(categoria);
  }

  @Get('status/:status')
  @ApiOperation({ summary: 'Listar insumos por status' })
  @ApiParam({ name: 'status', description: 'Status do insumo' })
  @ApiResponse({
    status: 200,
    description: 'Lista de insumos por status.',
    type: [FornecedorInsumo],
  })
  async findByStatus(
    @Param('status') status: string,
  ): Promise<FornecedorInsumo[]> {
    return await this.fornecedorInsumoService.findByStatus(status);
  }

  @Get('codigo-barras/:codigo')
  @ApiOperation({ summary: 'Buscar insumos por código de barras' })
  @ApiParam({ name: 'codigo', description: 'Código de barras' })
  @ApiResponse({
    status: 200,
    description: 'Insumos encontrados.',
    type: [FornecedorInsumo],
  })
  async findByCodigoBarras(
    @Param('codigo') codigo: string,
  ): Promise<FornecedorInsumo[]> {
    return await this.fornecedorInsumoService.findByCodigoBarras(codigo);
  }

  @Get('search')
  @ApiOperation({ summary: 'Buscar insumos globalmente' })
  @ApiQuery({ name: 'q', description: 'Termo de busca' })
  @ApiResponse({
    status: 200,
    description: 'Resultados da busca.',
    type: [FornecedorInsumo],
  })
  async searchGlobal(@Query('q') query: string): Promise<FornecedorInsumo[]> {
    return await this.fornecedorInsumoService.searchGlobal(query);
  }

  @Get('search/:fornecedorId')
  @ApiOperation({ summary: 'Buscar insumos de um fornecedor específico' })
  @ApiParam({ name: 'fornecedorId', description: 'ID do fornecedor' })
  @ApiQuery({ name: 'q', description: 'Termo de busca' })
  @ApiResponse({
    status: 200,
    description: 'Resultados da busca.',
    type: [FornecedorInsumo],
  })
  async search(
    @Param('fornecedorId', ParseUUIDPipe) fornecedorId: string,
    @Query('q') query: string,
  ): Promise<FornecedorInsumo[]> {
    return await this.fornecedorInsumoService.search(fornecedorId, query);
  }

  @Get('estatisticas')
  @ApiOperation({ summary: 'Obter estatísticas dos insumos' })
  @ApiQuery({
    name: 'fornecedorId',
    description: 'ID do fornecedor (opcional)',
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'Estatísticas retornadas com sucesso.',
  })
  async getEstatisticas(
    @Query('fornecedorId') fornecedorId?: string,
  ): Promise<any> {
    return await this.fornecedorInsumoService.getEstatisticas(fornecedorId);
  }

  @Get('fornecedor/:fornecedorId/codigo/:codigo')
  @ApiOperation({ summary: 'Buscar insumo por código interno do fornecedor' })
  @ApiParam({ name: 'fornecedorId', description: 'ID do fornecedor' })
  @ApiParam({ name: 'codigo', description: 'Código interno' })
  @ApiResponse({
    status: 200,
    description: 'Insumo encontrado.',
    type: FornecedorInsumo,
  })
  @ApiResponse({ status: 404, description: 'Insumo não encontrado.' })
  async findByCodigoInterno(
    @Param('fornecedorId', ParseUUIDPipe) fornecedorId: string,
    @Param('codigo') codigo: string,
  ): Promise<FornecedorInsumo> {
    return await this.fornecedorInsumoService.findByCodigoInterno(
      fornecedorId,
      codigo,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar insumo por ID' })
  @ApiParam({ name: 'id', description: 'ID do insumo' })
  @ApiResponse({
    status: 200,
    description: 'Insumo encontrado.',
    type: FornecedorInsumo,
  })
  @ApiResponse({ status: 404, description: 'Insumo não encontrado.' })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<FornecedorInsumo> {
    return await this.fornecedorInsumoService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar insumo' })
  @ApiParam({ name: 'id', description: 'ID do insumo' })
  @ApiResponse({
    status: 200,
    description: 'Insumo atualizado com sucesso.',
    type: FornecedorInsumo,
  })
  @ApiResponse({ status: 404, description: 'Insumo não encontrado.' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateFornecedorInsumoDto: UpdateFornecedorInsumoDto,
  ): Promise<FornecedorInsumo> {
    return await this.fornecedorInsumoService.update(
      id,
      updateFornecedorInsumoDto,
    );
  }

  @Patch(':id/toggle-status')
  @ApiOperation({ summary: 'Alternar status do insumo' })
  @ApiParam({ name: 'id', description: 'ID do insumo' })
  @ApiResponse({
    status: 200,
    description: 'Status alterado com sucesso.',
    type: FornecedorInsumo,
  })
  async toggleStatus(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<FornecedorInsumo> {
    return await this.fornecedorInsumoService.toggleStatus(id);
  }

  @Patch(':id/estoque')
  @ApiOperation({ summary: 'Atualizar estoque do insumo' })
  @ApiParam({ name: 'id', description: 'ID do insumo' })
  @ApiResponse({
    status: 200,
    description: 'Estoque atualizado com sucesso.',
    type: FornecedorInsumo,
  })
  async atualizarEstoque(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('quantidade') quantidade: number,
  ): Promise<FornecedorInsumo> {
    return await this.fornecedorInsumoService.atualizarEstoque(id, quantidade);
  }

  @Patch(':id/preco')
  @ApiOperation({ summary: 'Atualizar preço do insumo' })
  @ApiParam({ name: 'id', description: 'ID do insumo' })
  @ApiResponse({
    status: 200,
    description: 'Preço atualizado com sucesso.',
    type: FornecedorInsumo,
  })
  async atualizarPreco(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('preco') preco: number,
  ): Promise<FornecedorInsumo> {
    return await this.fornecedorInsumoService.atualizarPreco(id, preco);
  }

  @Patch(':id/promocao')
  @ApiOperation({ summary: 'Adicionar promoção ao insumo' })
  @ApiParam({ name: 'id', description: 'ID do insumo' })
  @ApiResponse({
    status: 200,
    description: 'Promoção adicionada com sucesso.',
    type: FornecedorInsumo,
  })
  async adicionarPromocao(
    @Param('id', ParseUUIDPipe) id: string,
    @Body()
    promocaoData: {
      preco_promocional: number;
      data_inicio: Date;
      data_fim: Date;
    },
  ): Promise<FornecedorInsumo> {
    return await this.fornecedorInsumoService.adicionarPromocao(
      id,
      promocaoData.preco_promocional,
      promocaoData.data_inicio,
      promocaoData.data_fim,
    );
  }

  @Patch(':id/remover-promocao')
  @ApiOperation({ summary: 'Remover promoção do insumo' })
  @ApiParam({ name: 'id', description: 'ID do insumo' })
  @ApiResponse({
    status: 200,
    description: 'Promoção removida com sucesso.',
    type: FornecedorInsumo,
  })
  async removerPromocao(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<FornecedorInsumo> {
    return await this.fornecedorInsumoService.removerPromocao(id);
  }

  @Patch(':id/avaliar')
  @ApiOperation({ summary: 'Avaliar produto' })
  @ApiParam({ name: 'id', description: 'ID do insumo' })
  @ApiResponse({
    status: 200,
    description: 'Avaliação registrada com sucesso.',
    type: FornecedorInsumo,
  })
  async avaliarProduto(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('avaliacao') avaliacao: number,
  ): Promise<FornecedorInsumo> {
    return await this.fornecedorInsumoService.avaliarProduto(id, avaliacao);
  }

  @Patch(':id/registrar-pedido')
  @ApiOperation({ summary: 'Registrar pedido do insumo' })
  @ApiParam({ name: 'id', description: 'ID do insumo' })
  @ApiResponse({
    status: 200,
    description: 'Pedido registrado com sucesso.',
  })
  async registrarPedido(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return await this.fornecedorInsumoService.registrarPedido(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover insumo' })
  @ApiParam({ name: 'id', description: 'ID do insumo' })
  @ApiResponse({ status: 200, description: 'Insumo removido com sucesso.' })
  @ApiResponse({ status: 404, description: 'Insumo não encontrado.' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return await this.fornecedorInsumoService.remove(id);
  }
}
