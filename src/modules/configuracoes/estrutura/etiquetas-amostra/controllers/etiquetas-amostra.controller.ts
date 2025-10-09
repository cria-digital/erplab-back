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
import { EtiquetasAmostraService } from '../services/etiquetas-amostra.service';
import { CreateEtiquetaAmostraDto } from '../dto/create-etiqueta-amostra.dto';
import { UpdateEtiquetaAmostraDto } from '../dto/update-etiqueta-amostra.dto';
import { TipoImpressora } from '../entities/etiqueta-amostra.entity';

@ApiTags('Estrutura - Etiquetas de Amostra')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/v1/configuracoes/estrutura/etiquetas-amostra')
export class EtiquetasAmostraController {
  constructor(
    private readonly etiquetasAmostraService: EtiquetasAmostraService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Criar nova etiqueta de amostra' })
  @ApiResponse({
    status: 201,
    description: 'Etiqueta de amostra criada com sucesso',
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async create(
    @Body() createEtiquetaAmostraDto: CreateEtiquetaAmostraDto,
    @Request() req,
  ) {
    return await this.etiquetasAmostraService.create(
      createEtiquetaAmostraDto,
      req.user.userId,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as etiquetas de amostra' })
  @ApiResponse({
    status: 200,
    description: 'Lista de etiquetas de amostra retornada',
  })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async findAll() {
    return await this.etiquetasAmostraService.findAll();
  }

  @Get('ativas')
  @ApiOperation({ summary: 'Listar etiquetas de amostra ativas' })
  @ApiResponse({
    status: 200,
    description: 'Lista de etiquetas de amostra ativas retornada',
  })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async findAllAtivas() {
    return await this.etiquetasAmostraService.findAllAtivas();
  }

  @Get('estatisticas')
  @ApiOperation({ summary: 'Obter estatísticas das etiquetas de amostra' })
  @ApiResponse({ status: 200, description: 'Estatísticas retornadas' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async getEstatisticas() {
    return await this.etiquetasAmostraService.getEstatisticas();
  }

  @Get('tipo-impressora/:tipo')
  @ApiOperation({ summary: 'Buscar etiquetas por tipo de impressora' })
  @ApiParam({ name: 'tipo', enum: TipoImpressora })
  @ApiResponse({
    status: 200,
    description: 'Etiquetas de amostra encontradas',
  })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async findByTipoImpressora(@Param('tipo') tipo: TipoImpressora) {
    return await this.etiquetasAmostraService.findByTipoImpressora(tipo);
  }

  @Get('padrao/unidade/:unidadeId')
  @ApiOperation({ summary: 'Buscar etiqueta padrão da unidade' })
  @ApiParam({ name: 'unidadeId', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Etiqueta padrão encontrada',
  })
  @ApiResponse({ status: 404, description: 'Etiqueta padrão não encontrada' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async findPadrao(@Param('unidadeId') unidadeId: string) {
    return await this.etiquetasAmostraService.findPadrao(unidadeId);
  }

  @Get('unidade/:unidadeId')
  @ApiOperation({ summary: 'Buscar etiquetas por unidade' })
  @ApiParam({ name: 'unidadeId', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Etiquetas de amostra encontradas',
  })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async findByUnidade(@Param('unidadeId') unidadeId: string) {
    return await this.etiquetasAmostraService.findByUnidade(unidadeId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar etiqueta de amostra por ID' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Etiqueta de amostra encontrada',
  })
  @ApiResponse({
    status: 404,
    description: 'Etiqueta de amostra não encontrada',
  })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async findOne(@Param('id') id: string) {
    return await this.etiquetasAmostraService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar etiqueta de amostra' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Etiqueta de amostra atualizada com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Etiqueta de amostra não encontrada',
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async update(
    @Param('id') id: string,
    @Body() updateEtiquetaAmostraDto: UpdateEtiquetaAmostraDto,
    @Request() req,
  ) {
    return await this.etiquetasAmostraService.update(
      id,
      updateEtiquetaAmostraDto,
      req.user.userId,
    );
  }

  @Patch(':id/toggle-ativo')
  @ApiOperation({
    summary: 'Alternar status ativo/inativo da etiqueta de amostra',
  })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Status da etiqueta de amostra alterado com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Etiqueta de amostra não encontrada',
  })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async toggleAtivo(@Param('id') id: string, @Request() req) {
    return await this.etiquetasAmostraService.toggleAtivo(id, req.user.userId);
  }

  @Patch(':id/set-padrao')
  @ApiOperation({ summary: 'Definir etiqueta como padrão' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Etiqueta definida como padrão com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Etiqueta de amostra não encontrada',
  })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async setPadrao(@Param('id') id: string, @Request() req) {
    return await this.etiquetasAmostraService.setPadrao(id, req.user.userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover etiqueta de amostra' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Etiqueta de amostra removida com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Etiqueta de amostra não encontrada',
  })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async remove(@Param('id') id: string) {
    await this.etiquetasAmostraService.remove(id);
    return { message: 'Etiqueta de amostra removida com sucesso' };
  }
}
