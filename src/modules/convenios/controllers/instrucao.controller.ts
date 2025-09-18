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
import { InstrucaoService } from '../services/instrucao.service';
import { CreateInstrucaoDto } from '../dto/create-instrucao.dto';
import { UpdateInstrucaoDto } from '../dto/update-instrucao.dto';
import { Instrucao, CategoriaInstrucao } from '../entities/instrucao.entity';

@ApiTags('Instruções')
@Controller('instrucoes')
export class InstrucaoController {
  constructor(private readonly instrucaoService: InstrucaoService) {}

  @Post()
  @ApiOperation({ summary: 'Criar nova instrução' })
  @ApiResponse({
    status: 201,
    description: 'Instrução criada com sucesso',
    type: Instrucao,
  })
  @ApiResponse({ status: 404, description: 'Convênio não encontrado' })
  create(@Body() createInstrucaoDto: CreateInstrucaoDto): Promise<Instrucao> {
    return this.instrucaoService.create(createInstrucaoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as instruções' })
  @ApiResponse({
    status: 200,
    description: 'Lista de instruções',
    type: [Instrucao],
  })
  findAll(): Promise<Instrucao[]> {
    return this.instrucaoService.findAll();
  }

  @Get('convenio/:convenioId')
  @ApiOperation({ summary: 'Listar instruções de um convênio' })
  @ApiParam({ name: 'convenioId', description: 'ID do convênio' })
  @ApiResponse({
    status: 200,
    description: 'Lista de instruções do convênio',
    type: [Instrucao],
  })
  findByConvenio(
    @Param('convenioId', ParseUUIDPipe) convenioId: string,
  ): Promise<Instrucao[]> {
    return this.instrucaoService.findByConvenio(convenioId);
  }

  @Get('convenio/:convenioId/vigentes')
  @ApiOperation({ summary: 'Listar instruções vigentes de um convênio' })
  @ApiParam({ name: 'convenioId', description: 'ID do convênio' })
  @ApiQuery({
    name: 'data',
    required: false,
    description: 'Data de referência',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de instruções vigentes',
    type: [Instrucao],
  })
  findVigentes(
    @Param('convenioId', ParseUUIDPipe) convenioId: string,
    @Query('data') data?: string,
  ): Promise<Instrucao[]> {
    return this.instrucaoService.findVigentes(
      convenioId,
      data ? new Date(data) : undefined,
    );
  }

  @Get('convenio/:convenioId/categoria/:categoria')
  @ApiOperation({ summary: 'Listar instruções por categoria' })
  @ApiParam({ name: 'convenioId', description: 'ID do convênio' })
  @ApiParam({
    name: 'categoria',
    enum: CategoriaInstrucao,
    description: 'Categoria da instrução',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de instruções da categoria',
    type: [Instrucao],
  })
  findByCategoria(
    @Param('convenioId', ParseUUIDPipe) convenioId: string,
    @Param('categoria') categoria: CategoriaInstrucao,
  ): Promise<Instrucao[]> {
    return this.instrucaoService.findByCategoria(convenioId, categoria);
  }

  @Get('convenio/:convenioId/proximas-vencer')
  @ApiOperation({ summary: 'Listar instruções próximas do vencimento' })
  @ApiParam({ name: 'convenioId', description: 'ID do convênio' })
  @ApiQuery({
    name: 'dias',
    required: false,
    description: 'Dias de antecedência',
    default: 30,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de instruções próximas do vencimento',
    type: [Instrucao],
  })
  findProximasVencer(
    @Param('convenioId', ParseUUIDPipe) convenioId: string,
    @Query('dias') dias: number = 30,
  ): Promise<Instrucao[]> {
    return this.instrucaoService.findProximasVencer(convenioId, dias);
  }

  @Get('convenio/:convenioId/search')
  @ApiOperation({ summary: 'Buscar instruções' })
  @ApiParam({ name: 'convenioId', description: 'ID do convênio' })
  @ApiQuery({ name: 'q', description: 'Termo de busca' })
  @ApiResponse({
    status: 200,
    description: 'Resultados da busca',
    type: [Instrucao],
  })
  search(
    @Param('convenioId', ParseUUIDPipe) convenioId: string,
    @Query('q') query: string,
  ): Promise<Instrucao[]> {
    return this.instrucaoService.search(convenioId, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar instrução por ID' })
  @ApiParam({ name: 'id', description: 'ID da instrução' })
  @ApiResponse({
    status: 200,
    description: 'Instrução encontrada',
    type: Instrucao,
  })
  @ApiResponse({ status: 404, description: 'Instrução não encontrada' })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Instrucao> {
    return this.instrucaoService.findOne(id);
  }

  @Get(':id/historico')
  @ApiOperation({ summary: 'Obter histórico da instrução' })
  @ApiParam({ name: 'id', description: 'ID da instrução' })
  @ApiResponse({ status: 200, description: 'Histórico da instrução' })
  @ApiResponse({ status: 404, description: 'Instrução não encontrada' })
  getHistorico(@Param('id', ParseUUIDPipe) id: string): Promise<any> {
    return this.instrucaoService.getHistorico(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar instrução' })
  @ApiParam({ name: 'id', description: 'ID da instrução' })
  @ApiResponse({
    status: 200,
    description: 'Instrução atualizada',
    type: Instrucao,
  })
  @ApiResponse({ status: 404, description: 'Instrução não encontrada' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateInstrucaoDto: UpdateInstrucaoDto,
  ): Promise<Instrucao> {
    return this.instrucaoService.update(id, updateInstrucaoDto);
  }

  @Patch(':id/toggle-status')
  @ApiOperation({ summary: 'Alternar status da instrução' })
  @ApiParam({ name: 'id', description: 'ID da instrução' })
  @ApiResponse({ status: 200, description: 'Status alterado', type: Instrucao })
  @ApiResponse({ status: 404, description: 'Instrução não encontrada' })
  toggleStatus(@Param('id', ParseUUIDPipe) id: string): Promise<Instrucao> {
    return this.instrucaoService.toggleStatus(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Excluir instrução' })
  @ApiParam({ name: 'id', description: 'ID da instrução' })
  @ApiResponse({ status: 204, description: 'Instrução excluída' })
  @ApiResponse({ status: 404, description: 'Instrução não encontrada' })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.instrucaoService.remove(id);
  }
}
