import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
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
import { LaboratorioMetodoService } from './laboratorio-metodo.service';
import { CreateLaboratorioMetodoDto } from './dto/create-laboratorio-metodo.dto';
import { UpdateLaboratorioMetodoDto } from './dto/update-laboratorio-metodo.dto';

@ApiTags('Laboratórios-Métodos')
@ApiBearerAuth()
@Controller('laboratorios-metodos')
export class LaboratorioMetodoController {
  constructor(
    private readonly laboratorioMetodoService: LaboratorioMetodoService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Vincular laboratório a método' })
  @ApiResponse({
    status: 201,
    description: 'Vínculo criado com sucesso',
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({
    status: 404,
    description: 'Laboratório ou método não encontrado',
  })
  @ApiResponse({ status: 409, description: 'Vínculo já existe' })
  create(@Body() createLaboratorioMetodoDto: CreateLaboratorioMetodoDto) {
    return this.laboratorioMetodoService.create(createLaboratorioMetodoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os vínculos laboratório-método' })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Número da página',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Itens por página',
    example: 10,
  })
  @ApiQuery({
    name: 'laboratorioId',
    required: false,
    description: 'Filtrar por laboratório',
    format: 'uuid',
  })
  @ApiQuery({
    name: 'metodoId',
    required: false,
    description: 'Filtrar por método',
    format: 'uuid',
  })
  @ApiQuery({
    name: 'validado',
    required: false,
    description: 'Filtrar por status de validação',
    type: 'boolean',
  })
  @ApiResponse({ status: 200, description: 'Lista de vínculos' })
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('laboratorioId') laboratorioId?: string,
    @Query('metodoId') metodoId?: string,
    @Query('validado') validado?: string,
  ) {
    return this.laboratorioMetodoService.findAll(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 10,
      laboratorioId,
      metodoId,
      validado === undefined ? undefined : validado === 'true',
    );
  }

  @Get('validados')
  @ApiOperation({ summary: 'Listar vínculos validados' })
  @ApiQuery({
    name: 'laboratorioId',
    required: false,
    description: 'Filtrar por laboratório',
    format: 'uuid',
  })
  @ApiResponse({ status: 200, description: 'Lista de vínculos validados' })
  findValidados(@Query('laboratorioId') laboratorioId?: string) {
    return this.laboratorioMetodoService.findValidados(laboratorioId);
  }

  @Get('laboratorio/:laboratorioId')
  @ApiOperation({ summary: 'Buscar métodos de um laboratório' })
  @ApiParam({
    name: 'laboratorioId',
    description: 'ID do laboratório',
    format: 'uuid',
  })
  @ApiResponse({ status: 200, description: 'Lista de métodos do laboratório' })
  findByLaboratorio(
    @Param('laboratorioId', ParseUUIDPipe) laboratorioId: string,
  ) {
    return this.laboratorioMetodoService.findByLaboratorio(laboratorioId);
  }

  @Get('metodo/:metodoId')
  @ApiOperation({ summary: 'Buscar laboratórios que utilizam um método' })
  @ApiParam({
    name: 'metodoId',
    description: 'ID do método',
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de laboratórios que utilizam o método',
  })
  findByMetodo(@Param('metodoId', ParseUUIDPipe) metodoId: string) {
    return this.laboratorioMetodoService.findByMetodo(metodoId);
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Obter estatísticas gerais dos vínculos' })
  @ApiQuery({
    name: 'laboratorioId',
    required: false,
    description: 'Filtrar por laboratório',
    format: 'uuid',
  })
  @ApiResponse({ status: 200, description: 'Estatísticas dos vínculos' })
  getStatistics(@Query('laboratorioId') laboratorioId?: string) {
    return this.laboratorioMetodoService.getStatistics(laboratorioId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter vínculo por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID do vínculo',
    format: 'uuid',
  })
  @ApiResponse({ status: 200, description: 'Vínculo encontrado' })
  @ApiResponse({ status: 404, description: 'Vínculo não encontrado' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.laboratorioMetodoService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar vínculo laboratório-método' })
  @ApiParam({
    name: 'id',
    description: 'ID do vínculo',
    format: 'uuid',
  })
  @ApiResponse({ status: 200, description: 'Vínculo atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Vínculo não encontrado' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateLaboratorioMetodoDto: UpdateLaboratorioMetodoDto,
  ) {
    return this.laboratorioMetodoService.update(id, updateLaboratorioMetodoDto);
  }

  @Patch(':id/validar')
  @ApiOperation({ summary: 'Validar vínculo laboratório-método' })
  @ApiParam({
    name: 'id',
    description: 'ID do vínculo',
    format: 'uuid',
  })
  @ApiResponse({ status: 200, description: 'Vínculo validado com sucesso' })
  @ApiResponse({ status: 400, description: 'Vínculo já está validado' })
  @ApiResponse({ status: 404, description: 'Vínculo não encontrado' })
  validar(@Param('id', ParseUUIDPipe) id: string) {
    return this.laboratorioMetodoService.validar(id);
  }

  @Patch(':id/invalidar')
  @ApiOperation({ summary: 'Invalidar vínculo laboratório-método' })
  @ApiParam({
    name: 'id',
    description: 'ID do vínculo',
    format: 'uuid',
  })
  @ApiResponse({ status: 200, description: 'Vínculo invalidado com sucesso' })
  @ApiResponse({ status: 400, description: 'Vínculo já está invalidado' })
  @ApiResponse({ status: 404, description: 'Vínculo não encontrado' })
  invalidar(@Param('id', ParseUUIDPipe) id: string) {
    return this.laboratorioMetodoService.invalidar(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover vínculo laboratório-método' })
  @ApiParam({
    name: 'id',
    description: 'ID do vínculo',
    format: 'uuid',
  })
  @ApiResponse({ status: 204, description: 'Vínculo removido com sucesso' })
  @ApiResponse({ status: 404, description: 'Vínculo não encontrado' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.laboratorioMetodoService.remove(id);
  }
}
