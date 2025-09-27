import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { AlternativaCampoService } from './alternativa-campo.service';
import { CreateAlternativaCampoDto } from './dto/create-alternativa-campo.dto';
import { UpdateAlternativaCampoDto } from './dto/update-alternativa-campo.dto';
import { StatusAlternativa } from './entities/alternativa-campo.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Alternativas de Campo')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/v1/alternativas-campo')
export class AlternativaCampoController {
  constructor(
    private readonly alternativaCampoService: AlternativaCampoService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Criar nova alternativa de campo' })
  @ApiResponse({ status: 201, description: 'Alternativa criada com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 409, description: 'Alternativa já existe' })
  create(@Body() createAlternativaDto: CreateAlternativaCampoDto) {
    return this.alternativaCampoService.create(createAlternativaDto);
  }

  @Get('campo/:campoId')
  @ApiOperation({ summary: 'Listar alternativas de um campo' })
  @ApiParam({ name: 'campoId', description: 'ID do campo' })
  @ApiResponse({ status: 200, description: 'Lista de alternativas do campo' })
  findByCampo(@Param('campoId', ParseUUIDPipe) campoId: string) {
    return this.alternativaCampoService.findByCampo(campoId);
  }

  @Get('campo/:campoId/ativas')
  @ApiOperation({ summary: 'Listar alternativas ativas de um campo' })
  @ApiParam({ name: 'campoId', description: 'ID do campo' })
  @ApiResponse({
    status: 200,
    description: 'Lista de alternativas ativas do campo',
  })
  findAtivas(@Param('campoId', ParseUUIDPipe) campoId: string) {
    return this.alternativaCampoService.findAtivas(campoId);
  }

  @Get('campo/:campoId/padrao')
  @ApiOperation({ summary: 'Listar alternativas padrão de um campo' })
  @ApiParam({ name: 'campoId', description: 'ID do campo' })
  @ApiResponse({
    status: 200,
    description: 'Lista de alternativas padrão do campo',
  })
  findPadrao(@Param('campoId', ParseUUIDPipe) campoId: string) {
    return this.alternativaCampoService.findPadrao(campoId);
  }

  @Get('campo/:campoId/search')
  @ApiOperation({ summary: 'Buscar alternativas em um campo' })
  @ApiParam({ name: 'campoId', description: 'ID do campo' })
  @ApiQuery({ name: 'q', description: 'Termo de busca', required: true })
  @ApiResponse({ status: 200, description: 'Resultados da busca' })
  search(
    @Param('campoId', ParseUUIDPipe) campoId: string,
    @Query('q') termo: string,
  ) {
    return this.alternativaCampoService.search(campoId, termo);
  }

  @Get('campo/:campoId/valor/:valor')
  @ApiOperation({ summary: 'Buscar alternativa por valor em um campo' })
  @ApiParam({ name: 'campoId', description: 'ID do campo' })
  @ApiParam({ name: 'valor', description: 'Valor da alternativa' })
  @ApiResponse({ status: 200, description: 'Alternativa encontrada' })
  @ApiResponse({ status: 404, description: 'Alternativa não encontrada' })
  findByValor(
    @Param('campoId', ParseUUIDPipe) campoId: string,
    @Param('valor') valor: string,
  ) {
    return this.alternativaCampoService.findByValor(campoId, valor);
  }

  @Get('campo/:campoId/codigo/:codigo')
  @ApiOperation({ summary: 'Buscar alternativa por código em um campo' })
  @ApiParam({ name: 'campoId', description: 'ID do campo' })
  @ApiParam({ name: 'codigo', description: 'Código da alternativa' })
  @ApiResponse({ status: 200, description: 'Alternativa encontrada' })
  @ApiResponse({ status: 404, description: 'Alternativa não encontrada' })
  findByCodigo(
    @Param('campoId', ParseUUIDPipe) campoId: string,
    @Param('codigo') codigo: string,
  ) {
    return this.alternativaCampoService.findByCodigo(campoId, codigo);
  }

  @Get('campo/:campoId/estatisticas')
  @ApiOperation({ summary: 'Obter estatísticas das alternativas de um campo' })
  @ApiParam({ name: 'campoId', description: 'ID do campo' })
  @ApiResponse({ status: 200, description: 'Estatísticas das alternativas' })
  getEstatisticas(@Param('campoId', ParseUUIDPipe) campoId: string) {
    return this.alternativaCampoService.getEstatisticas(campoId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar alternativa por ID' })
  @ApiParam({ name: 'id', description: 'ID da alternativa' })
  @ApiResponse({ status: 200, description: 'Alternativa encontrada' })
  @ApiResponse({ status: 404, description: 'Alternativa não encontrada' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.alternativaCampoService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar alternativa' })
  @ApiParam({ name: 'id', description: 'ID da alternativa' })
  @ApiResponse({
    status: 200,
    description: 'Alternativa atualizada com sucesso',
  })
  @ApiResponse({ status: 404, description: 'Alternativa não encontrada' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAlternativaDto: UpdateAlternativaCampoDto,
  ) {
    return this.alternativaCampoService.update(id, updateAlternativaDto);
  }

  @Patch('campo/:campoId/reordenar')
  @ApiOperation({ summary: 'Reordenar alternativas de um campo' })
  @ApiParam({ name: 'campoId', description: 'ID do campo' })
  @ApiResponse({
    status: 200,
    description: 'Alternativas reordenadas com sucesso',
  })
  reordenar(
    @Param('campoId', ParseUUIDPipe) campoId: string,
    @Body() ordens: { id: string; ordem: number }[],
  ) {
    return this.alternativaCampoService.reordenar(campoId, ordens);
  }

  @Post(':id/duplicar')
  @ApiOperation({ summary: 'Duplicar alternativa' })
  @ApiParam({ name: 'id', description: 'ID da alternativa' })
  @ApiQuery({
    name: 'codigo',
    description: 'Novo código da alternativa',
    required: false,
  })
  @ApiResponse({
    status: 201,
    description: 'Alternativa duplicada com sucesso',
  })
  @ApiResponse({ status: 404, description: 'Alternativa não encontrada' })
  @ApiResponse({ status: 400, description: 'Código já existe' })
  duplicar(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('codigo') novoCodigo?: string,
  ) {
    return this.alternativaCampoService.duplicar(id, novoCodigo);
  }

  @Patch(':id/toggle-status')
  @ApiOperation({ summary: 'Alternar status ativo/inativo da alternativa' })
  @ApiParam({ name: 'id', description: 'ID da alternativa' })
  @ApiResponse({ status: 200, description: 'Status alterado com sucesso' })
  @ApiResponse({ status: 404, description: 'Alternativa não encontrada' })
  toggleStatus(@Param('id', ParseUUIDPipe) id: string) {
    return this.alternativaCampoService.toggleStatus(id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Atualizar status da alternativa' })
  @ApiParam({ name: 'id', description: 'ID da alternativa' })
  @ApiQuery({ name: 'status', enum: StatusAlternativa })
  @ApiResponse({ status: 200, description: 'Status atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Alternativa não encontrada' })
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('status') status: StatusAlternativa,
  ) {
    return this.alternativaCampoService.updateStatus(id, status);
  }

  @Post(':id/definir-padrao')
  @ApiOperation({ summary: 'Definir alternativa como padrão' })
  @ApiParam({ name: 'id', description: 'ID da alternativa' })
  @ApiResponse({ status: 200, description: 'Alternativa definida como padrão' })
  @ApiResponse({ status: 404, description: 'Alternativa não encontrada' })
  definirPadrao(@Param('id', ParseUUIDPipe) id: string) {
    return this.alternativaCampoService.definirPadrao(id);
  }

  @Delete('campo/:campoId/remover-padrao')
  @ApiOperation({ summary: 'Remover padrão de todas as alternativas do campo' })
  @ApiParam({ name: 'campoId', description: 'ID do campo' })
  @ApiResponse({ status: 200, description: 'Padrão removido com sucesso' })
  removerPadrao(@Param('campoId', ParseUUIDPipe) campoId: string) {
    return this.alternativaCampoService.removerPadrao(campoId);
  }

  @Post('campo/:campoId/importar')
  @ApiOperation({ summary: 'Importar alternativas para um campo' })
  @ApiParam({ name: 'campoId', description: 'ID do campo' })
  @ApiResponse({
    status: 201,
    description: 'Alternativas importadas com sucesso',
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  importarAlternativas(
    @Param('campoId', ParseUUIDPipe) campoId: string,
    @Body()
    alternativas: Array<{
      codigo: string;
      valor: string;
      rotulo: string;
      descricao?: string;
      score?: number;
    }>,
  ) {
    return this.alternativaCampoService.importarAlternativas(
      campoId,
      alternativas,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover alternativa' })
  @ApiParam({ name: 'id', description: 'ID da alternativa' })
  @ApiResponse({ status: 200, description: 'Alternativa removida com sucesso' })
  @ApiResponse({ status: 404, description: 'Alternativa não encontrada' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.alternativaCampoService.remove(id);
  }
}
