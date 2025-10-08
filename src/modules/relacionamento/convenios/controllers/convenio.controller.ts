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
import { ConvenioService } from '../services/convenio.service';
import { CreateConvenioDto } from '../dto/create-convenio.dto';
import { UpdateConvenioDto } from '../dto/update-convenio.dto';
import { Convenio } from '../entities/convenio.entity';

@ApiTags('Convênios')
@Controller('convenios')
export class ConvenioController {
  constructor(private readonly convenioService: ConvenioService) {}

  @Post()
  @ApiOperation({ summary: 'Criar novo convênio' })
  @ApiResponse({
    status: 201,
    description: 'Convênio criado com sucesso',
    type: Convenio,
  })
  @ApiResponse({
    status: 409,
    description: 'Conflito - Código ou CNPJ já existente',
  })
  create(@Body() createConvenioDto: CreateConvenioDto): Promise<Convenio> {
    return this.convenioService.create(createConvenioDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os convênios' })
  @ApiResponse({
    status: 200,
    description: 'Lista de convênios',
    type: [Convenio],
  })
  findAll(): Promise<Convenio[]> {
    return this.convenioService.findAll();
  }

  @Get('ativos')
  @ApiOperation({ summary: 'Listar convênios ativos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de convênios ativos',
    type: [Convenio],
  })
  findAtivos(): Promise<Convenio[]> {
    return this.convenioService.findAtivos();
  }

  @Get('search')
  @ApiOperation({ summary: 'Buscar convênios' })
  @ApiQuery({ name: 'q', description: 'Termo de busca' })
  @ApiResponse({
    status: 200,
    description: 'Resultados da busca',
    type: [Convenio],
  })
  search(@Query('q') query: string): Promise<Convenio[]> {
    return this.convenioService.search(query);
  }

  @Get('codigo/:codigo')
  @ApiOperation({ summary: 'Buscar convênio por código' })
  @ApiParam({ name: 'codigo', description: 'Código do convênio' })
  @ApiResponse({
    status: 200,
    description: 'Convênio encontrado',
    type: Convenio,
  })
  @ApiResponse({ status: 404, description: 'Convênio não encontrado' })
  findByCodigo(@Param('codigo') codigo: string): Promise<Convenio> {
    return this.convenioService.findByCodigo(codigo);
  }

  @Get('cnpj/:cnpj')
  @ApiOperation({ summary: 'Buscar convênio por CNPJ' })
  @ApiParam({ name: 'cnpj', description: 'CNPJ do convênio' })
  @ApiResponse({
    status: 200,
    description: 'Convênio encontrado',
    type: Convenio,
  })
  @ApiResponse({ status: 404, description: 'Convênio não encontrado' })
  findByCnpj(@Param('cnpj') cnpj: string): Promise<Convenio> {
    return this.convenioService.findByCnpj(cnpj);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar convênio por ID' })
  @ApiParam({ name: 'id', description: 'ID do convênio' })
  @ApiResponse({
    status: 200,
    description: 'Convênio encontrado',
    type: Convenio,
  })
  @ApiResponse({ status: 404, description: 'Convênio não encontrado' })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Convenio> {
    return this.convenioService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar convênio' })
  @ApiParam({ name: 'id', description: 'ID do convênio' })
  @ApiResponse({
    status: 200,
    description: 'Convênio atualizado',
    type: Convenio,
  })
  @ApiResponse({ status: 404, description: 'Convênio não encontrado' })
  @ApiResponse({
    status: 409,
    description: 'Conflito - Código ou CNPJ já existente',
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateConvenioDto: UpdateConvenioDto,
  ): Promise<Convenio> {
    return this.convenioService.update(id, updateConvenioDto);
  }

  @Patch(':id/toggle-status')
  @ApiOperation({ summary: 'Alternar status do convênio (ativo/inativo)' })
  @ApiParam({ name: 'id', description: 'ID do convênio' })
  @ApiResponse({ status: 200, description: 'Status alterado', type: Convenio })
  @ApiResponse({ status: 404, description: 'Convênio não encontrado' })
  toggleStatus(@Param('id', ParseUUIDPipe) id: string): Promise<Convenio> {
    return this.convenioService.toggleStatus(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Excluir convênio' })
  @ApiParam({ name: 'id', description: 'ID do convênio' })
  @ApiResponse({ status: 204, description: 'Convênio excluído' })
  @ApiResponse({ status: 404, description: 'Convênio não encontrado' })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.convenioService.remove(id);
  }
}
