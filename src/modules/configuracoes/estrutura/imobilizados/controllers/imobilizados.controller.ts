import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../../autenticacao/auth/guards/jwt-auth.guard';
import { ImobilizadosService } from '../services/imobilizados.service';
import { CreateImobilizadoDto } from '../dto/create-imobilizado.dto';
import { UpdateImobilizadoDto } from '../dto/update-imobilizado.dto';
import {
  CategoriaImobilizado,
  SituacaoImobilizado,
} from '../entities/imobilizado.entity';

@ApiTags('Estrutura - Imobilizados')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/v1/configuracoes/estrutura/imobilizados')
export class ImobilizadosController {
  constructor(private readonly imobilizadosService: ImobilizadosService) {}

  @Post()
  @ApiOperation({ summary: 'Criar novo imobilizado' })
  @ApiResponse({ status: 201, description: 'Imobilizado criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async create(
    @Body() createImobilizadoDto: CreateImobilizadoDto,
    @Request() req,
  ) {
    return await this.imobilizadosService.create(
      createImobilizadoDto,
      req.user.userId,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os imobilizados' })
  @ApiResponse({ status: 200, description: 'Lista de imobilizados retornada' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async findAll() {
    return await this.imobilizadosService.findAll();
  }

  @Get('ativos')
  @ApiOperation({ summary: 'Listar imobilizados ativos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de imobilizados ativos retornada',
  })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async findAllAtivos() {
    return await this.imobilizadosService.findAllAtivos();
  }

  @Get('estatisticas')
  @ApiOperation({ summary: 'Obter estatísticas dos imobilizados' })
  @ApiResponse({ status: 200, description: 'Estatísticas retornadas' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async getEstatisticas() {
    return await this.imobilizadosService.getEstatisticas();
  }

  @Get('depreciacao-total')
  @ApiOperation({
    summary: 'Listar imobilizados com depreciação total',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de imobilizados totalmente depreciados',
  })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async findDepreciacaoTotal() {
    return await this.imobilizadosService.findDepreciacaoTotal();
  }

  @Get('categoria/:categoria')
  @ApiOperation({ summary: 'Buscar imobilizados por categoria' })
  @ApiParam({ name: 'categoria', enum: CategoriaImobilizado })
  @ApiResponse({ status: 200, description: 'Imobilizados encontrados' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async findByCategoria(@Param('categoria') categoria: CategoriaImobilizado) {
    return await this.imobilizadosService.findByCategoria(categoria);
  }

  @Get('situacao/:situacao')
  @ApiOperation({ summary: 'Buscar imobilizados por situação' })
  @ApiParam({ name: 'situacao', enum: SituacaoImobilizado })
  @ApiResponse({ status: 200, description: 'Imobilizados encontrados' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async findBySituacao(@Param('situacao') situacao: SituacaoImobilizado) {
    return await this.imobilizadosService.findBySituacao(situacao);
  }

  @Get('unidade/:unidadeId')
  @ApiOperation({ summary: 'Buscar imobilizados por unidade' })
  @ApiParam({ name: 'unidadeId', type: 'string' })
  @ApiResponse({ status: 200, description: 'Imobilizados encontrados' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async findByUnidade(@Param('unidadeId') unidadeId: string) {
    return await this.imobilizadosService.findByUnidade(unidadeId);
  }

  @Get('sala/:salaId')
  @ApiOperation({ summary: 'Buscar imobilizados por sala' })
  @ApiParam({ name: 'salaId', type: 'string' })
  @ApiResponse({ status: 200, description: 'Imobilizados encontrados' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async findBySala(@Param('salaId') salaId: string) {
    return await this.imobilizadosService.findBySala(salaId);
  }

  @Get('setor/:setorId')
  @ApiOperation({ summary: 'Buscar imobilizados por setor' })
  @ApiParam({ name: 'setorId', type: 'string' })
  @ApiResponse({ status: 200, description: 'Imobilizados encontrados' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async findBySetor(@Param('setorId') setorId: string) {
    return await this.imobilizadosService.findBySetor(setorId);
  }

  @Get('patrimonio/:patrimonio')
  @ApiOperation({ summary: 'Buscar imobilizado por patrimônio' })
  @ApiParam({ name: 'patrimonio', type: 'string' })
  @ApiResponse({ status: 200, description: 'Imobilizado encontrado' })
  @ApiResponse({ status: 404, description: 'Imobilizado não encontrado' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async findByPatrimonio(@Param('patrimonio') patrimonio: string) {
    return await this.imobilizadosService.findByPatrimonio(patrimonio);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar imobilizado por ID' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiResponse({ status: 200, description: 'Imobilizado encontrado' })
  @ApiResponse({ status: 404, description: 'Imobilizado não encontrado' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async findOne(@Param('id') id: string) {
    return await this.imobilizadosService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar imobilizado' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Imobilizado atualizado com sucesso',
  })
  @ApiResponse({ status: 404, description: 'Imobilizado não encontrado' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async update(
    @Param('id') id: string,
    @Body() updateImobilizadoDto: UpdateImobilizadoDto,
    @Request() req,
  ) {
    return await this.imobilizadosService.update(
      id,
      updateImobilizadoDto,
      req.user.userId,
    );
  }

  @Patch(':id/situacao')
  @ApiOperation({ summary: 'Atualizar situação do imobilizado' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Situação do imobilizado atualizada com sucesso',
  })
  @ApiResponse({ status: 404, description: 'Imobilizado não encontrado' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async updateSituacao(
    @Param('id') id: string,
    @Body('situacao') situacao: SituacaoImobilizado,
    @Body('dataBaixa') dataBaixa?: Date,
    @Body('motivoBaixa') motivoBaixa?: string,
    @Body('valorBaixa') valorBaixa?: number,
    @Request() req?,
  ) {
    return await this.imobilizadosService.updateSituacao(
      id,
      situacao,
      req.user.userId,
      dataBaixa,
      motivoBaixa,
      valorBaixa,
    );
  }

  @Patch(':id/depreciacao')
  @ApiOperation({ summary: 'Atualizar depreciação acumulada' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Depreciação atualizada com sucesso',
  })
  @ApiResponse({ status: 404, description: 'Imobilizado não encontrado' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async updateDepreciacaoAcumulada(
    @Param('id') id: string,
    @Body('depreciacaoAcumulada') depreciacaoAcumulada: number,
    @Request() req,
  ) {
    return await this.imobilizadosService.updateDepreciacaoAcumulada(
      id,
      depreciacaoAcumulada,
      req.user.userId,
    );
  }

  @Patch(':id/toggle-ativo')
  @ApiOperation({ summary: 'Alternar status ativo/inativo do imobilizado' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Status do imobilizado alterado com sucesso',
  })
  @ApiResponse({ status: 404, description: 'Imobilizado não encontrado' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async toggleAtivo(@Param('id') id: string, @Request() req) {
    return await this.imobilizadosService.toggleAtivo(id, req.user.userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover imobilizado' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Imobilizado removido com sucesso',
  })
  @ApiResponse({ status: 404, description: 'Imobilizado não encontrado' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async remove(@Param('id') id: string) {
    await this.imobilizadosService.remove(id);
    return { message: 'Imobilizado removido com sucesso' };
  }
}
