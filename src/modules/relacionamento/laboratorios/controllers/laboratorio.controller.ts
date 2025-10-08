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
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { LaboratorioService } from '../services/laboratorio.service';
import { CreateLaboratorioDto } from '../dto/create-laboratorio.dto';
import { UpdateLaboratorioDto } from '../dto/update-laboratorio.dto';
import { Laboratorio } from '../entities/laboratorio.entity';

@ApiTags('Laboratórios')
@Controller('laboratorios')
export class LaboratorioController {
  constructor(private readonly laboratorioService: LaboratorioService) {}

  @Post()
  @ApiOperation({ summary: 'Criar novo laboratório' })
  @ApiResponse({
    status: 201,
    description: 'Laboratório criado com sucesso',
    type: Laboratorio,
  })
  @ApiResponse({
    status: 409,
    description: 'Conflito - Código ou CNPJ já existente',
  })
  create(
    @Body() createLaboratorioDto: CreateLaboratorioDto,
  ): Promise<Laboratorio> {
    return this.laboratorioService.create(createLaboratorioDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os laboratórios' })
  @ApiResponse({
    status: 200,
    description: 'Lista de laboratórios',
    type: [Laboratorio],
  })
  findAll(): Promise<Laboratorio[]> {
    return this.laboratorioService.findAll();
  }

  @Get('ativos')
  @ApiOperation({ summary: 'Listar laboratórios ativos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de laboratórios ativos',
    type: [Laboratorio],
  })
  findAtivos(): Promise<Laboratorio[]> {
    return this.laboratorioService.findAtivos();
  }

  @Get('urgencia')
  @ApiOperation({ summary: 'Listar laboratórios que aceitam urgência' })
  @ApiResponse({
    status: 200,
    description: 'Lista de laboratórios que aceitam urgência',
    type: [Laboratorio],
  })
  findAceitamUrgencia(): Promise<Laboratorio[]> {
    return this.laboratorioService.findAceitamUrgencia();
  }

  @Get('search')
  @ApiOperation({ summary: 'Buscar laboratórios' })
  @ApiQuery({ name: 'q', description: 'Termo de busca' })
  @ApiResponse({
    status: 200,
    description: 'Resultados da busca',
    type: [Laboratorio],
  })
  search(@Query('q') query: string): Promise<Laboratorio[]> {
    return this.laboratorioService.search(query);
  }

  @Get('integracao/:tipo')
  @ApiOperation({ summary: 'Buscar laboratórios por tipo de integração' })
  @ApiParam({
    name: 'tipo',
    enum: ['api', 'webservice', 'manual', 'ftp', 'email'],
  })
  @ApiResponse({
    status: 200,
    description: 'Laboratórios com o tipo de integração especificado',
    type: [Laboratorio],
  })
  findByIntegracao(@Param('tipo') tipo: string): Promise<Laboratorio[]> {
    return this.laboratorioService.findByIntegracao(tipo);
  }

  @Get('codigo/:codigo')
  @ApiOperation({ summary: 'Buscar laboratório por código' })
  @ApiParam({ name: 'codigo', description: 'Código do laboratório' })
  @ApiResponse({
    status: 200,
    description: 'Laboratório encontrado',
    type: Laboratorio,
  })
  @ApiResponse({ status: 404, description: 'Laboratório não encontrado' })
  findByCodigo(@Param('codigo') codigo: string): Promise<Laboratorio> {
    return this.laboratorioService.findByCodigo(codigo);
  }

  @Get('cnpj/:cnpj')
  @ApiOperation({ summary: 'Buscar laboratório por CNPJ' })
  @ApiParam({ name: 'cnpj', description: 'CNPJ do laboratório' })
  @ApiResponse({
    status: 200,
    description: 'Laboratório encontrado',
    type: Laboratorio,
  })
  @ApiResponse({ status: 404, description: 'Laboratório não encontrado' })
  findByCnpj(@Param('cnpj') cnpj: string): Promise<Laboratorio> {
    return this.laboratorioService.findByCnpj(cnpj);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar laboratório por ID' })
  @ApiParam({ name: 'id', description: 'ID do laboratório' })
  @ApiResponse({
    status: 200,
    description: 'Laboratório encontrado',
    type: Laboratorio,
  })
  @ApiResponse({ status: 404, description: 'Laboratório não encontrado' })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Laboratorio> {
    return this.laboratorioService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar laboratório' })
  @ApiParam({ name: 'id', description: 'ID do laboratório' })
  @ApiResponse({
    status: 200,
    description: 'Laboratório atualizado',
    type: Laboratorio,
  })
  @ApiResponse({ status: 404, description: 'Laboratório não encontrado' })
  @ApiResponse({
    status: 409,
    description: 'Conflito - Código ou CNPJ já existente',
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateLaboratorioDto: UpdateLaboratorioDto,
  ): Promise<Laboratorio> {
    return this.laboratorioService.update(id, updateLaboratorioDto);
  }

  @Patch(':id/toggle-status')
  @ApiOperation({ summary: 'Alternar status do laboratório (ativo/inativo)' })
  @ApiParam({ name: 'id', description: 'ID do laboratório' })
  @ApiResponse({
    status: 200,
    description: 'Status alterado',
    type: Laboratorio,
  })
  @ApiResponse({ status: 404, description: 'Laboratório não encontrado' })
  toggleStatus(@Param('id', ParseUUIDPipe) id: string): Promise<Laboratorio> {
    return this.laboratorioService.toggleStatus(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Excluir laboratório' })
  @ApiParam({ name: 'id', description: 'ID do laboratório' })
  @ApiResponse({ status: 204, description: 'Laboratório excluído' })
  @ApiResponse({ status: 404, description: 'Laboratório não encontrado' })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.laboratorioService.remove(id);
  }
}
