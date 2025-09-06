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
  ValidationPipe,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { UnidadeSaudeService, PaginationParams } from './unidade-saude.service';
import { CreateUnidadeSaudeDto } from './dto/create-unidade-saude.dto';
import { UpdateUnidadeSaudeDto } from './dto/update-unidade-saude.dto';
import {
  UnidadeSaudeResponseDto,
  UnidadeSaudeListResponseDto,
} from './dto/response-unidade-saude.dto';

@ApiTags('Unidades de Saúde')
@Controller('unidades-saude')
@UseInterceptors(ClassSerializerInterceptor)
export class UnidadeSaudeController {
  constructor(private readonly unidadeSaudeService: UnidadeSaudeService) {}

  @Post()
  @ApiOperation({
    summary: 'Criar nova unidade de saúde',
    description: 'Cria uma nova unidade de saúde com todos os dados relacionados (horários, dados bancários, CNAEs)',
  })
  @ApiBody({ type: CreateUnidadeSaudeDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Unidade de saúde criada com sucesso',
    type: UnidadeSaudeResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'CNPJ já cadastrado',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Dados inválidos',
  })
  async create(
    @Body(ValidationPipe) createUnidadeSaudeDto: CreateUnidadeSaudeDto,
  ): Promise<UnidadeSaudeResponseDto> {
    const unidade = await this.unidadeSaudeService.create(createUnidadeSaudeDto);
    return unidade as UnidadeSaudeResponseDto;
  }

  @Get()
  @ApiOperation({
    summary: 'Listar unidades de saúde',
    description: 'Lista todas as unidades de saúde com paginação e filtros opcionais',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Número da página (default: 1)',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Limite de registros por página (default: 10)',
    example: 10,
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Busca por nome, fantasia, CNPJ ou razão social',
  })
  @ApiQuery({
    name: 'ativo',
    required: false,
    type: Boolean,
    description: 'Filtrar por status ativo/inativo',
  })
  @ApiQuery({
    name: 'cidade',
    required: false,
    type: String,
    description: 'Filtrar por cidade',
  })
  @ApiQuery({
    name: 'estado',
    required: false,
    type: String,
    description: 'Filtrar por estado (UF)',
    example: 'SP',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de unidades de saúde',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/UnidadeSaudeListResponseDto' },
        },
        total: { type: 'number', example: 100 },
        page: { type: 'number', example: 1 },
        limit: { type: 'number', example: 10 },
        totalPages: { type: 'number', example: 10 },
      },
    },
  })
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('ativo') ativo?: boolean,
    @Query('cidade') cidade?: string,
    @Query('estado') estado?: string,
  ) {
    const params: PaginationParams = {
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 10,
      search,
      ativo,
      cidade,
      estado,
    };

    return this.unidadeSaudeService.findAll(params);
  }

  @Get('ativas')
  @ApiOperation({
    summary: 'Listar unidades ativas',
    description: 'Lista apenas as unidades de saúde ativas (para dropdowns/selects)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de unidades ativas',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          nomeUnidade: { type: 'string' },
          nomeFantasia: { type: 'string' },
          cnpj: { type: 'string' },
        },
      },
    },
  })
  async listActive() {
    return this.unidadeSaudeService.listActive();
  }

  @Get('cidade/:cidade')
  @ApiOperation({
    summary: 'Buscar unidades por cidade',
    description: 'Lista todas as unidades de saúde ativas de uma cidade específica',
  })
  @ApiParam({
    name: 'cidade',
    description: 'Nome da cidade',
    example: 'São Roque',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de unidades da cidade',
    type: [UnidadeSaudeResponseDto],
  })
  async findByCidade(@Param('cidade') cidade: string) {
    return this.unidadeSaudeService.findByCidade(cidade);
  }

  @Get('cnpj/:cnpj')
  @ApiOperation({
    summary: 'Buscar unidade por CNPJ',
    description: 'Busca uma unidade de saúde específica pelo CNPJ',
  })
  @ApiParam({
    name: 'cnpj',
    description: 'CNPJ da unidade (apenas números)',
    example: '12345678000190',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Unidade de saúde encontrada',
    type: UnidadeSaudeResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Unidade não encontrada',
  })
  async findByCnpj(@Param('cnpj') cnpj: string): Promise<UnidadeSaudeResponseDto> {
    const unidade = await this.unidadeSaudeService.findByCnpj(cnpj);
    return unidade as UnidadeSaudeResponseDto;
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Buscar unidade por ID',
    description: 'Busca uma unidade de saúde específica com todos os dados relacionados',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID da unidade de saúde',
    type: 'string',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Unidade de saúde encontrada',
    type: UnidadeSaudeResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Unidade não encontrada',
  })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<UnidadeSaudeResponseDto> {
    const unidade = await this.unidadeSaudeService.findOne(id);
    return unidade as UnidadeSaudeResponseDto;
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Atualizar unidade de saúde',
    description: 'Atualiza os dados de uma unidade de saúde existente',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID da unidade de saúde',
    type: 'string',
  })
  @ApiBody({ type: UpdateUnidadeSaudeDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Unidade de saúde atualizada',
    type: UnidadeSaudeResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Unidade não encontrada',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'CNPJ já cadastrado em outra unidade',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(ValidationPipe) updateUnidadeSaudeDto: UpdateUnidadeSaudeDto,
  ): Promise<UnidadeSaudeResponseDto> {
    const unidade = await this.unidadeSaudeService.update(id, updateUnidadeSaudeDto);
    return unidade as UnidadeSaudeResponseDto;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Remover unidade de saúde',
    description: 'Remove (soft delete) uma unidade de saúde',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID da unidade de saúde',
    type: 'string',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Unidade removida com sucesso',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Unidade não encontrada',
  })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.unidadeSaudeService.remove(id);
  }

  @Patch(':id/ativar')
  @ApiOperation({
    summary: 'Ativar unidade de saúde',
    description: 'Ativa uma unidade de saúde previamente desativada',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID da unidade de saúde',
    type: 'string',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Unidade ativada com sucesso',
    type: UnidadeSaudeResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Unidade não encontrada',
  })
  async activate(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<UnidadeSaudeResponseDto> {
    const unidade = await this.unidadeSaudeService.activate(id);
    return unidade as UnidadeSaudeResponseDto;
  }

  @Patch(':id/desativar')
  @ApiOperation({
    summary: 'Desativar unidade de saúde',
    description: 'Desativa uma unidade de saúde ativa',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID da unidade de saúde',
    type: 'string',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Unidade desativada com sucesso',
    type: UnidadeSaudeResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Unidade não encontrada',
  })
  async deactivate(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<UnidadeSaudeResponseDto> {
    const unidade = await this.unidadeSaudeService.deactivate(id);
    return unidade as UnidadeSaudeResponseDto;
  }
}