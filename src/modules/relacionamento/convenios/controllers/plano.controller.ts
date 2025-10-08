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
import { PlanoService } from '../services/plano.service';
import { CreatePlanoDto } from '../dto/create-plano.dto';
import { UpdatePlanoDto } from '../dto/update-plano.dto';
import { Plano } from '../entities/plano.entity';

@ApiTags('Planos')
@Controller('relacionamento/planos')
export class PlanoController {
  constructor(private readonly planoService: PlanoService) {}

  @Post()
  @ApiOperation({ summary: 'Criar novo plano' })
  @ApiResponse({
    status: 201,
    description: 'Plano criado com sucesso',
    type: Plano,
  })
  @ApiResponse({
    status: 409,
    description: 'Conflito - Código já existente para o convênio',
  })
  @ApiResponse({ status: 404, description: 'Convênio não encontrado' })
  create(@Body() createPlanoDto: CreatePlanoDto): Promise<Plano> {
    return this.planoService.create(createPlanoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os planos' })
  @ApiResponse({ status: 200, description: 'Lista de planos', type: [Plano] })
  findAll(): Promise<Plano[]> {
    return this.planoService.findAll();
  }

  @Get('ativos')
  @ApiOperation({ summary: 'Listar planos ativos' })
  @ApiQuery({
    name: 'convenioId',
    required: false,
    description: 'Filtrar por convênio',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de planos ativos',
    type: [Plano],
  })
  findAtivos(@Query('convenioId') convenioId?: string): Promise<Plano[]> {
    return this.planoService.findAtivos(convenioId);
  }

  @Get('convenio/:convenioId')
  @ApiOperation({ summary: 'Listar planos de um convênio' })
  @ApiParam({ name: 'convenioId', description: 'ID do convênio' })
  @ApiResponse({
    status: 200,
    description: 'Lista de planos do convênio',
    type: [Plano],
  })
  findByConvenio(
    @Param('convenioId', ParseUUIDPipe) convenioId: string,
  ): Promise<Plano[]> {
    return this.planoService.findByConvenio(convenioId);
  }

  @Get('convenio/:convenioId/codigo/:codigo')
  @ApiOperation({ summary: 'Buscar plano por código dentro do convênio' })
  @ApiParam({ name: 'convenioId', description: 'ID do convênio' })
  @ApiParam({ name: 'codigo', description: 'Código do plano' })
  @ApiResponse({ status: 200, description: 'Plano encontrado', type: Plano })
  @ApiResponse({ status: 404, description: 'Plano não encontrado' })
  findByCodigo(
    @Param('convenioId', ParseUUIDPipe) convenioId: string,
    @Param('codigo') codigo: string,
  ): Promise<Plano> {
    return this.planoService.findByCodigo(convenioId, codigo);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar plano por ID' })
  @ApiParam({ name: 'id', description: 'ID do plano' })
  @ApiResponse({ status: 200, description: 'Plano encontrado', type: Plano })
  @ApiResponse({ status: 404, description: 'Plano não encontrado' })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Plano> {
    return this.planoService.findOne(id);
  }

  @Get(':id/verificar-carencia')
  @ApiOperation({ summary: 'Verificar carência do plano' })
  @ApiParam({ name: 'id', description: 'ID do plano' })
  @ApiQuery({
    name: 'dataAdesao',
    description: 'Data de adesão do beneficiário',
  })
  @ApiResponse({ status: 200, description: 'Carência verificada' })
  async verificarCarencia(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('dataAdesao') dataAdesao: string,
  ): Promise<{ carenciaCumprida: boolean }> {
    const carenciaCumprida = await this.planoService.verificarCarencia(
      id,
      new Date(dataAdesao),
    );
    return { carenciaCumprida };
  }

  @Get(':id/calcular-coparticipacao')
  @ApiOperation({ summary: 'Calcular coparticipação' })
  @ApiParam({ name: 'id', description: 'ID do plano' })
  @ApiQuery({ name: 'valor', description: 'Valor do procedimento' })
  @ApiResponse({ status: 200, description: 'Coparticipação calculada' })
  async calcularCoparticipacao(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('valor') valor: number,
  ): Promise<{ valorCoparticipacao: number }> {
    const valorCoparticipacao = await this.planoService.calcularCoparticipacao(
      id,
      valor,
    );
    return { valorCoparticipacao };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar plano' })
  @ApiParam({ name: 'id', description: 'ID do plano' })
  @ApiResponse({ status: 200, description: 'Plano atualizado', type: Plano })
  @ApiResponse({ status: 404, description: 'Plano não encontrado' })
  @ApiResponse({ status: 409, description: 'Conflito - Código já existente' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePlanoDto: UpdatePlanoDto,
  ): Promise<Plano> {
    return this.planoService.update(id, updatePlanoDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Excluir plano' })
  @ApiParam({ name: 'id', description: 'ID do plano' })
  @ApiResponse({ status: 204, description: 'Plano excluído' })
  @ApiResponse({ status: 404, description: 'Plano não encontrado' })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.planoService.remove(id);
  }
}
