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

@ApiTags('Matrizes de Exames')
@Controller('exames/matrizes')
@ApiBearerAuth()
export class MatrizesController {
  constructor(private readonly matrizesService: MatrizesService) {}

  @Post()
  @ApiOperation({
    summary: 'Criar nova matriz',
    description:
      'Cria uma nova matriz de exame. Conforme Figma: Tipo de exame, Exame vinculado, Nome da matriz, Código interno.',
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
      'Lista todas as matrizes com paginação e filtros opcionais por tipo de exame e termo de busca',
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
    name: 'tipoExameId',
    required: false,
    type: String,
    description: 'Filtrar por ID do tipo de exame',
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
    @Query('tipoExameId') tipoExameId?: string,
    @Query('ativo') ativo?: boolean,
  ) {
    return this.matrizesService.findAll(
      page ? +page : 1,
      limit ? +limit : 10,
      search,
      tipoExameId,
      ativo,
    );
  }

  @Get('ativas')
  @ApiOperation({
    summary: 'Listar matrizes ativas',
    description: 'Retorna apenas matrizes ativas',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de matrizes ativas',
  })
  findAtivas() {
    return this.matrizesService.findAtivas();
  }

  @Get('stats')
  @ApiOperation({
    summary: 'Estatísticas de matrizes',
    description:
      'Retorna estatísticas agregadas (total, por tipo de exame, etc)',
  })
  @ApiResponse({
    status: 200,
    description: 'Estatísticas retornadas',
  })
  getStats() {
    return this.matrizesService.getStats();
  }

  @Get('tipo-exame/:tipoExameId')
  @ApiOperation({
    summary: 'Buscar matrizes por tipo de exame',
    description:
      'Retorna todas as matrizes ativas de um tipo de exame específico',
  })
  @ApiParam({
    name: 'tipoExameId',
    description: 'ID do tipo de exame',
  })
  @ApiResponse({
    status: 200,
    description: 'Matrizes do tipo de exame especificado',
  })
  findByTipoExame(@Param('tipoExameId', ParseUUIDPipe) tipoExameId: string) {
    return this.matrizesService.findByTipoExame(tipoExameId);
  }

  @Get('codigo/:codigo')
  @ApiOperation({
    summary: 'Buscar matriz por código interno',
    description: 'Busca uma matriz específica pelo código interno',
  })
  @ApiParam({
    name: 'codigo',
    description: 'Código interno da matriz',
    example: 'HEM123',
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
    description: 'Remove uma matriz (soft delete).',
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
    description: 'Desativa uma matriz.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID da matriz',
  })
  @ApiResponse({
    status: 200,
    description: 'Matriz desativada com sucesso',
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
