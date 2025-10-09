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
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { MatrizesService } from '../services/matrizes.service';
import { CreateMatrizDto } from '../dto/create-matriz.dto';
import { UpdateMatrizDto } from '../dto/update-matriz.dto';
import { TipoMatriz, StatusMatriz } from '../entities/matriz-exame.entity';

@ApiTags('Matrizes de Exames')
@Controller('exames/matrizes')
@ApiBearerAuth()
export class MatrizesController {
  constructor(private readonly matrizesService: MatrizesService) {}

  @Post()
  @ApiOperation({
    summary: 'Criar nova matriz',
    description:
      'Cria uma nova matriz de exame com seus campos. Matrizes são templates/formulários padronizados para tipos específicos de exames.',
  })
  @ApiResponse({
    status: 201,
    description: 'Matriz criada com sucesso',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflito - Código interno já existe',
  })
  create(@Body() createMatrizDto: CreateMatrizDto, @Request() req: any) {
    return this.matrizesService.create(createMatrizDto, req.user.id);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar matrizes',
    description:
      'Lista todas as matrizes com paginação e filtros opcionais por tipo, status e termo de busca',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Número da página (padrão: 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Itens por página (padrão: 10)',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Termo de busca no nome',
  })
  @ApiQuery({
    name: 'tipoMatriz',
    required: false,
    enum: TipoMatriz,
    description: 'Filtrar por tipo de matriz',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: StatusMatriz,
    description: 'Filtrar por status',
  })
  @ApiQuery({
    name: 'ativo',
    required: false,
    type: Boolean,
    description: 'Filtrar por ativo/inativo',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de matrizes retornada com sucesso',
  })
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('tipoMatriz') tipoMatriz?: TipoMatriz,
    @Query('status') status?: StatusMatriz,
    @Query('ativo') ativo?: boolean,
  ) {
    return this.matrizesService.findAll(
      page ? +page : 1,
      limit ? +limit : 10,
      search,
      tipoMatriz,
      status,
      ativo,
    );
  }

  @Get('ativas')
  @ApiOperation({
    summary: 'Listar matrizes ativas',
    description: 'Retorna apenas matrizes ativas e com status ATIVO',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de matrizes ativas',
  })
  findAtivas() {
    return this.matrizesService.findAtivas();
  }

  @Get('padrao')
  @ApiOperation({
    summary: 'Listar matrizes padrão do sistema',
    description:
      'Retorna matrizes predefinidas do sistema (Audiometria, Hemograma, etc)',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de matrizes padrão',
  })
  findPadrao() {
    return this.matrizesService.findPadrao();
  }

  @Get('stats')
  @ApiOperation({
    summary: 'Estatísticas de matrizes',
    description: 'Retorna estatísticas agregadas (total, por tipo, etc)',
  })
  @ApiResponse({
    status: 200,
    description: 'Estatísticas retornadas',
  })
  getStats() {
    return this.matrizesService.getStats();
  }

  @Get('tipo/:tipo')
  @ApiOperation({
    summary: 'Buscar matrizes por tipo',
    description: 'Retorna todas as matrizes ativas de um tipo específico',
  })
  @ApiParam({
    name: 'tipo',
    enum: TipoMatriz,
    description: 'Tipo de matriz',
  })
  @ApiResponse({
    status: 200,
    description: 'Matrizes do tipo especificado',
  })
  findByTipo(@Param('tipo') tipo: TipoMatriz) {
    return this.matrizesService.findByTipo(tipo);
  }

  @Get('codigo/:codigo')
  @ApiOperation({
    summary: 'Buscar matriz por código interno',
    description: 'Busca uma matriz específica pelo código interno',
  })
  @ApiParam({
    name: 'codigo',
    description: 'Código interno da matriz',
    example: 'MTZ-AUDIO-001',
  })
  @ApiResponse({
    status: 200,
    description: 'Matriz encontrada',
  })
  @ApiResponse({
    status: 404,
    description: 'Matriz não encontrada',
  })
  findByCodigo(@Param('codigo') codigo: string) {
    return this.matrizesService.findByCodigo(codigo);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Buscar matriz por ID',
    description: 'Retorna uma matriz específica com todos os seus campos',
  })
  @ApiParam({
    name: 'id',
    description: 'ID da matriz (UUID)',
  })
  @ApiResponse({
    status: 200,
    description: 'Matriz encontrada',
  })
  @ApiResponse({
    status: 404,
    description: 'Matriz não encontrada',
  })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.matrizesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Atualizar matriz',
    description:
      'Atualiza uma matriz existente. Se campos forem fornecidos, todos os campos existentes serão substituídos.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID da matriz',
  })
  @ApiResponse({
    status: 200,
    description: 'Matriz atualizada com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Matriz não encontrada',
  })
  @ApiResponse({
    status: 400,
    description: 'Não é possível modificar matriz padrão do sistema',
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateMatrizDto: UpdateMatrizDto,
    @Request() req: any,
  ) {
    return this.matrizesService.update(id, updateMatrizDto, req.user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Remover matriz',
    description:
      'Remove uma matriz (soft delete). Matrizes padrão do sistema não podem ser removidas.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID da matriz',
  })
  @ApiResponse({
    status: 204,
    description: 'Matriz removida com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Matriz não encontrada',
  })
  @ApiResponse({
    status: 400,
    description: 'Não é possível remover matriz padrão do sistema',
  })
  remove(@Param('id', ParseUUIDPipe) id: string, @Request() req: any) {
    return this.matrizesService.remove(id, req.user.id);
  }

  @Patch(':id/ativar')
  @ApiOperation({
    summary: 'Ativar matriz',
    description: 'Ativa uma matriz inativa',
  })
  @ApiParam({
    name: 'id',
    description: 'ID da matriz',
  })
  @ApiResponse({
    status: 200,
    description: 'Matriz ativada com sucesso',
  })
  activate(@Param('id', ParseUUIDPipe) id: string, @Request() req: any) {
    return this.matrizesService.activate(id, req.user.id);
  }

  @Patch(':id/desativar')
  @ApiOperation({
    summary: 'Desativar matriz',
    description:
      'Desativa uma matriz. Matrizes padrão do sistema não podem ser desativadas.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID da matriz',
  })
  @ApiResponse({
    status: 200,
    description: 'Matriz desativada com sucesso',
  })
  @ApiResponse({
    status: 400,
    description: 'Não é possível desativar matriz padrão do sistema',
  })
  deactivate(@Param('id', ParseUUIDPipe) id: string, @Request() req: any) {
    return this.matrizesService.deactivate(id, req.user.id);
  }

  @Post(':id/duplicar')
  @ApiOperation({
    summary: 'Duplicar matriz',
    description:
      'Cria uma cópia de uma matriz existente com novo código e nome',
  })
  @ApiParam({
    name: 'id',
    description: 'ID da matriz a ser duplicada',
  })
  @ApiResponse({
    status: 201,
    description: 'Matriz duplicada com sucesso',
  })
  @ApiResponse({
    status: 409,
    description: 'Código interno da cópia já existe',
  })
  duplicate(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('codigoInterno') codigoInterno: string,
    @Body('nome') nome: string,
    @Request() req: any,
  ) {
    return this.matrizesService.duplicate(id, codigoInterno, nome, req.user.id);
  }
}
