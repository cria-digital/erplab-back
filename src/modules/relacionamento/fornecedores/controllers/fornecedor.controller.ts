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
import { FornecedorService } from '../services/fornecedor.service';
import { CreateFornecedorDto } from '../dto/create-fornecedor.dto';
import { UpdateFornecedorDto } from '../dto/update-fornecedor.dto';
import { Fornecedor } from '../entities/fornecedor.entity';

@ApiTags('Fornecedores')
@Controller('relacionamento/fornecedores')
export class FornecedorController {
  constructor(private readonly fornecedorService: FornecedorService) {}

  @Post()
  @ApiOperation({ summary: 'Criar novo fornecedor' })
  @ApiResponse({
    status: 201,
    description: 'Fornecedor criado com sucesso.',
    type: Fornecedor,
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  @ApiResponse({ status: 409, description: 'Código ou CNPJ já existe.' })
  async create(
    @Body() createFornecedorDto: CreateFornecedorDto,
  ): Promise<Fornecedor> {
    return await this.fornecedorService.create(createFornecedorDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os fornecedores' })
  @ApiResponse({
    status: 200,
    description: 'Lista de fornecedores retornada com sucesso.',
    type: [Fornecedor],
  })
  async findAll(): Promise<Fornecedor[]> {
    return await this.fornecedorService.findAll();
  }

  @Get('ativos')
  @ApiOperation({ summary: 'Listar fornecedores ativos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de fornecedores ativos.',
    type: [Fornecedor],
  })
  async findAtivos(): Promise<Fornecedor[]> {
    return await this.fornecedorService.findAtivos();
  }

  @Get('pendentes')
  @ApiOperation({ summary: 'Listar fornecedores pendentes de aprovação' })
  @ApiResponse({
    status: 200,
    description: 'Lista de fornecedores pendentes.',
    type: [Fornecedor],
  })
  async findPendentesAprovacao(): Promise<Fornecedor[]> {
    return await this.fornecedorService.findPendentesAprovacao();
  }

  @Get('search')
  @ApiOperation({ summary: 'Buscar fornecedores por termo' })
  @ApiQuery({ name: 'q', description: 'Termo de busca' })
  @ApiResponse({
    status: 200,
    description: 'Resultados da busca.',
    type: [Fornecedor],
  })
  async search(@Query('q') query: string): Promise<Fornecedor[]> {
    return await this.fornecedorService.search(query);
  }

  @Get('estatisticas')
  @ApiOperation({ summary: 'Obter estatísticas dos fornecedores' })
  @ApiResponse({
    status: 200,
    description: 'Estatísticas retornadas com sucesso.',
  })
  async getEstatisticas(): Promise<any> {
    return await this.fornecedorService.getEstatisticas();
  }

  @Get('regiao')
  @ApiOperation({ summary: 'Obter fornecedores por região' })
  @ApiResponse({
    status: 200,
    description: 'Fornecedores por região.',
  })
  async getFornecedoresPorRegiao(): Promise<any> {
    return await this.fornecedorService.getFornecedoresPorRegiao();
  }

  @Get('status/:status')
  @ApiOperation({ summary: 'Buscar fornecedores por status' })
  @ApiParam({ name: 'status', description: 'Status do fornecedor' })
  @ApiResponse({
    status: 200,
    description: 'Lista de fornecedores por status.',
    type: [Fornecedor],
  })
  async findByStatus(@Param('status') status: string): Promise<Fornecedor[]> {
    return await this.fornecedorService.findByStatus(status);
  }

  @Get('categoria/:categoria')
  @ApiOperation({ summary: 'Buscar fornecedores por categoria' })
  @ApiParam({ name: 'categoria', description: 'Categoria de insumos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de fornecedores por categoria.',
    type: [Fornecedor],
  })
  async findByCategoria(
    @Param('categoria') categoria: string,
  ): Promise<Fornecedor[]> {
    return await this.fornecedorService.findByCategoria(categoria);
  }

  @Get('regiao/:estados')
  @ApiOperation({
    summary: 'Buscar fornecedores que atendem determinados estados',
  })
  @ApiParam({
    name: 'estados',
    description: 'Estados separados por vírgula (UF)',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de fornecedores que atendem a região.',
    type: [Fornecedor],
  })
  async findByRegiao(
    @Param('estados') estadosParam: string,
  ): Promise<Fornecedor[]> {
    const estados = estadosParam.split(',').map((e) => e.trim().toUpperCase());
    return await this.fornecedorService.findByRegiao(estados);
  }

  @Get('codigo/:codigo')
  @ApiOperation({ summary: 'Buscar fornecedor por código' })
  @ApiParam({ name: 'codigo', description: 'Código do fornecedor' })
  @ApiResponse({
    status: 200,
    description: 'Fornecedor encontrado.',
    type: Fornecedor,
  })
  @ApiResponse({ status: 404, description: 'Fornecedor não encontrado.' })
  async findByCodigo(@Param('codigo') codigo: string): Promise<Fornecedor> {
    return await this.fornecedorService.findByCodigo(codigo);
  }

  @Get('cnpj/:cnpj')
  @ApiOperation({ summary: 'Buscar fornecedor por CNPJ' })
  @ApiParam({ name: 'cnpj', description: 'CNPJ da empresa' })
  @ApiResponse({
    status: 200,
    description: 'Fornecedor encontrado.',
    type: Fornecedor,
  })
  @ApiResponse({ status: 404, description: 'Fornecedor não encontrado.' })
  async findByCnpj(@Param('cnpj') cnpj: string): Promise<Fornecedor> {
    return await this.fornecedorService.findByCnpj(cnpj);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar fornecedor por ID' })
  @ApiParam({ name: 'id', description: 'ID do fornecedor' })
  @ApiResponse({
    status: 200,
    description: 'Fornecedor encontrado.',
    type: Fornecedor,
  })
  @ApiResponse({ status: 404, description: 'Fornecedor não encontrado.' })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Fornecedor> {
    return await this.fornecedorService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar fornecedor' })
  @ApiParam({ name: 'id', description: 'ID do fornecedor' })
  @ApiResponse({
    status: 200,
    description: 'Fornecedor atualizado com sucesso.',
    type: Fornecedor,
  })
  @ApiResponse({ status: 404, description: 'Fornecedor não encontrado.' })
  @ApiResponse({ status: 409, description: 'Código ou CNPJ já existe.' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateFornecedorDto: UpdateFornecedorDto,
  ): Promise<Fornecedor> {
    return await this.fornecedorService.update(id, updateFornecedorDto);
  }

  @Patch(':id/toggle-status')
  @ApiOperation({ summary: 'Alternar status do fornecedor' })
  @ApiParam({ name: 'id', description: 'ID do fornecedor' })
  @ApiResponse({
    status: 200,
    description: 'Status alterado com sucesso.',
    type: Fornecedor,
  })
  @ApiResponse({ status: 404, description: 'Fornecedor não encontrado.' })
  async toggleStatus(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Fornecedor> {
    return await this.fornecedorService.toggleStatus(id);
  }

  @Patch(':id/aprovar')
  @ApiOperation({ summary: 'Aprovar fornecedor' })
  @ApiParam({ name: 'id', description: 'ID do fornecedor' })
  @ApiResponse({
    status: 200,
    description: 'Fornecedor aprovado com sucesso.',
    type: Fornecedor,
  })
  async aprovarFornecedor(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('aprovado_por') aprovadoPor: string,
  ): Promise<Fornecedor> {
    return await this.fornecedorService.aprovarFornecedor(id, aprovadoPor);
  }

  @Patch(':id/reprovar')
  @ApiOperation({ summary: 'Reprovar fornecedor' })
  @ApiParam({ name: 'id', description: 'ID do fornecedor' })
  @ApiResponse({
    status: 200,
    description: 'Fornecedor reprovado com sucesso.',
    type: Fornecedor,
  })
  async reprovarFornecedor(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Fornecedor> {
    return await this.fornecedorService.reprovarFornecedor(id);
  }

  @Patch(':id/avaliar')
  @ApiOperation({ summary: 'Avaliar fornecedor' })
  @ApiParam({ name: 'id', description: 'ID do fornecedor' })
  @ApiResponse({
    status: 200,
    description: 'Avaliação registrada com sucesso.',
    type: Fornecedor,
  })
  async atualizarAvaliacao(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('avaliacao') avaliacao: number,
  ): Promise<Fornecedor> {
    return await this.fornecedorService.atualizarAvaliacao(id, avaliacao);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover fornecedor' })
  @ApiParam({ name: 'id', description: 'ID do fornecedor' })
  @ApiResponse({ status: 200, description: 'Fornecedor removido com sucesso.' })
  @ApiResponse({ status: 404, description: 'Fornecedor não encontrado.' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return await this.fornecedorService.remove(id);
  }
}
