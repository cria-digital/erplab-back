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
import { LaboratorioAmostraService } from '../services/laboratorio-amostra.service';
import { CreateLaboratorioAmostraDto } from '../dto/create-laboratorio-amostra.dto';
import { UpdateLaboratorioAmostraDto } from '../dto/update-laboratorio-amostra.dto';

@ApiTags('Laboratórios-Amostras')
@ApiBearerAuth()
@Controller('exames/laboratorios-amostras')
export class LaboratorioAmostraController {
  constructor(
    private readonly laboratorioAmostraService: LaboratorioAmostraService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Vincular laboratório a uma amostra' })
  @ApiResponse({ status: 201, description: 'Vínculo criado com sucesso' })
  @ApiResponse({
    status: 404,
    description: 'Amostra ou laboratório não encontrado',
  })
  @ApiResponse({ status: 409, description: 'Vínculo já existe' })
  create(@Body() createDto: CreateLaboratorioAmostraDto) {
    return this.laboratorioAmostraService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os vínculos laboratório-amostra' })
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
  })
  @ApiQuery({
    name: 'amostraId',
    required: false,
    description: 'Filtrar por amostra',
  })
  @ApiQuery({
    name: 'validado',
    required: false,
    description: 'Filtrar por status de validação',
  })
  @ApiResponse({ status: 200, description: 'Lista de vínculos' })
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('laboratorioId') laboratorioId?: string,
    @Query('amostraId') amostraId?: string,
    @Query('validado') validado?: string,
  ) {
    return this.laboratorioAmostraService.findAll(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 10,
      laboratorioId,
      amostraId,
      validado !== undefined ? validado === 'true' : undefined,
    );
  }

  @Get('validados')
  @ApiOperation({ summary: 'Listar vínculos validados' })
  @ApiQuery({
    name: 'laboratorioId',
    required: false,
    description: 'Filtrar por laboratório',
  })
  @ApiResponse({ status: 200, description: 'Lista de vínculos validados' })
  findValidados(@Query('laboratorioId') laboratorioId?: string) {
    return this.laboratorioAmostraService.findValidados(laboratorioId);
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Obter estatísticas dos vínculos' })
  @ApiQuery({
    name: 'laboratorioId',
    required: false,
    description: 'Filtrar por laboratório',
  })
  @ApiResponse({ status: 200, description: 'Estatísticas dos vínculos' })
  getStatistics(@Query('laboratorioId') laboratorioId?: string) {
    return this.laboratorioAmostraService.getStatistics(laboratorioId);
  }

  @Get('laboratorio/:laboratorioId')
  @ApiOperation({ summary: 'Buscar amostras de um laboratório' })
  @ApiParam({
    name: 'laboratorioId',
    description: 'ID do laboratório',
    format: 'uuid',
  })
  @ApiResponse({ status: 200, description: 'Lista de amostras do laboratório' })
  findByLaboratorio(
    @Param('laboratorioId', ParseUUIDPipe) laboratorioId: string,
  ) {
    return this.laboratorioAmostraService.findByLaboratorio(laboratorioId);
  }

  @Get('amostra/:amostraId')
  @ApiOperation({ summary: 'Buscar laboratórios de uma amostra' })
  @ApiParam({ name: 'amostraId', description: 'ID da amostra', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Lista de laboratórios da amostra' })
  findByAmostra(@Param('amostraId', ParseUUIDPipe) amostraId: string) {
    return this.laboratorioAmostraService.findByAmostra(amostraId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter vínculo por ID' })
  @ApiParam({ name: 'id', description: 'ID do vínculo', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Vínculo encontrado' })
  @ApiResponse({ status: 404, description: 'Vínculo não encontrado' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.laboratorioAmostraService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar vínculo' })
  @ApiParam({ name: 'id', description: 'ID do vínculo', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Vínculo atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Vínculo não encontrado' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateLaboratorioAmostraDto,
  ) {
    return this.laboratorioAmostraService.update(id, updateDto);
  }

  @Patch(':id/validar')
  @ApiOperation({ summary: 'Validar vínculo laboratório-amostra' })
  @ApiParam({ name: 'id', description: 'ID do vínculo', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Vínculo validado com sucesso' })
  @ApiResponse({ status: 404, description: 'Vínculo não encontrado' })
  validar(@Param('id', ParseUUIDPipe) id: string) {
    return this.laboratorioAmostraService.validar(id);
  }

  @Patch(':id/invalidar')
  @ApiOperation({ summary: 'Invalidar vínculo laboratório-amostra' })
  @ApiParam({ name: 'id', description: 'ID do vínculo', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Vínculo invalidado com sucesso' })
  @ApiResponse({ status: 404, description: 'Vínculo não encontrado' })
  invalidar(@Param('id', ParseUUIDPipe) id: string) {
    return this.laboratorioAmostraService.invalidar(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover vínculo' })
  @ApiParam({ name: 'id', description: 'ID do vínculo', format: 'uuid' })
  @ApiResponse({ status: 204, description: 'Vínculo removido com sucesso' })
  @ApiResponse({ status: 404, description: 'Vínculo não encontrado' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.laboratorioAmostraService.remove(id);
  }
}
