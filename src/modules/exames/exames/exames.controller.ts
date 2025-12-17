import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
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

import { ExamesService } from './exames.service';
import { CreateExameDto } from './dto/create-exame.dto';
import { UpdateExameDto } from './dto/update-exame.dto';
import { Exame } from './entities/exame.entity';

interface ApiResponseType<T = any> {
  message: string;
  data?: T;
}

@ApiTags('Exames')
@ApiBearerAuth()
@Controller('exames/exames')
export class ExamesController {
  constructor(private readonly examesService: ExamesService) {}

  @Post()
  @ApiOperation({
    summary: 'Criar um novo exame',
    description:
      'Cria um novo exame no sistema com todas as configurações necessárias.',
  })
  @ApiResponse({
    status: 201,
    description: 'Exame criado com sucesso',
    type: Exame,
  })
  @ApiResponse({
    status: 409,
    description: 'Código interno já cadastrado',
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos',
  })
  @ApiBody({ type: CreateExameDto })
  async create(
    @Body() createExameDto: CreateExameDto,
  ): Promise<ApiResponseType<Exame>> {
    const exame = await this.examesService.create(createExameDto);

    return {
      message: 'Exame criado com sucesso',
      data: exame,
    };
  }

  @Get()
  @ApiOperation({
    summary: 'Listar exames',
    description: 'Lista todos os exames com filtros opcionais e paginação.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de exames retornada com sucesso',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/Exame' },
        },
        total: { type: 'number', example: 100 },
        page: { type: 'number', example: 1 },
        lastPage: { type: 'number', example: 10 },
      },
    },
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Número da página',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Quantidade de itens por página',
    example: 10,
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Buscar por nome do exame',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['ativo', 'inativo', 'suspenso'],
    description: 'Filtrar por status',
  })
  @ApiQuery({
    name: 'tipo_exame_id',
    required: false,
    type: String,
    description: 'Filtrar por tipo de exame (ID da alternativa)',
  })
  @ApiQuery({
    name: 'especialidade_id',
    required: false,
    type: String,
    description: 'Filtrar por especialidade (ID da alternativa)',
  })
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('tipo_exame_id') tipoExameId?: string,
    @Query('especialidade_id') especialidadeId?: string,
  ) {
    return await this.examesService.findAll(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 10,
      search,
      status,
      tipoExameId,
      especialidadeId,
    );
  }

  @Get('tipo/:tipoId')
  @ApiOperation({
    summary: 'Buscar exames por tipo',
    description: 'Retorna todos os exames ativos de um tipo específico.',
  })
  @ApiParam({
    name: 'tipoId',
    type: String,
    description: 'ID do tipo de exame',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de exames do tipo',
    type: [Exame],
  })
  async findByTipo(
    @Param('tipoId') tipoId: string,
  ): Promise<ApiResponseType<Exame[]>> {
    const exames = await this.examesService.findByTipo(tipoId);
    return {
      message: 'Exames encontrados com sucesso',
      data: exames,
    };
  }

  @Get('laboratorio/:laboratorioId')
  @ApiOperation({
    summary: 'Buscar exames por laboratório de apoio',
    description:
      'Retorna todos os exames realizados em um laboratório de apoio específico.',
  })
  @ApiParam({
    name: 'laboratorioId',
    type: String,
    description: 'ID do laboratório de apoio',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de exames do laboratório',
    type: [Exame],
  })
  async findByLaboratorioApoio(
    @Param('laboratorioId') laboratorioId: string,
  ): Promise<ApiResponseType<Exame[]>> {
    const exames =
      await this.examesService.findByLaboratorioApoio(laboratorioId);
    return {
      message: 'Exames encontrados com sucesso',
      data: exames,
    };
  }

  @Get('buscar/:nome')
  @ApiOperation({
    summary: 'Buscar exames por nome',
    description: 'Busca exames pelo nome ou sinônimos.',
  })
  @ApiParam({
    name: 'nome',
    type: String,
    description: 'Nome ou parte do nome do exame',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de exames encontrados',
    type: [Exame],
  })
  async searchByName(
    @Param('nome') nome: string,
  ): Promise<ApiResponseType<Exame[]>> {
    const exames = await this.examesService.searchByName(nome);
    return {
      message: 'Exames encontrados com sucesso',
      data: exames,
    };
  }

  @Get('com-preparo')
  @ApiOperation({
    summary: 'Listar exames que necessitam preparo',
    description:
      'Retorna todos os exames ativos que necessitam de preparo especial.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de exames com preparo',
    type: [Exame],
  })
  async getExamesComPreparo(): Promise<ApiResponseType<Exame[]>> {
    const exames = await this.examesService.getExamesComPreparo();
    return {
      message: 'Exames com preparo encontrados',
      data: exames,
    };
  }

  @Get('urgentes')
  @ApiOperation({
    summary: 'Listar exames urgentes',
    description: 'Retorna exames ordenados por prioridade/peso.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de exames urgentes',
    type: [Exame],
  })
  async getExamesUrgentes(): Promise<ApiResponseType<Exame[]>> {
    const exames = await this.examesService.getExamesUrgentes();
    return {
      message: 'Exames urgentes encontrados',
      data: exames,
    };
  }

  @Get('codigos')
  @ApiOperation({
    summary: 'Buscar exames por códigos padronizados',
    description: 'Busca exames pelos códigos TUSS, AMB ou SUS.',
  })
  @ApiQuery({
    name: 'tuss',
    required: false,
    type: String,
    description: 'Código TUSS',
  })
  @ApiQuery({
    name: 'amb',
    required: false,
    type: String,
    description: 'Código AMB',
  })
  @ApiQuery({
    name: 'sus',
    required: false,
    type: String,
    description: 'Código SUS',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de exames encontrados',
    type: [Exame],
  })
  async findByCodigos(
    @Query('tuss') tuss?: string,
    @Query('amb') amb?: string,
    @Query('sus') sus?: string,
  ): Promise<ApiResponseType<Exame[]>> {
    const exames = await this.examesService.findByCodigos(tuss, amb, sus);
    return {
      message: 'Exames encontrados com sucesso',
      data: exames,
    };
  }

  @Get('codigo/:codigo')
  @ApiOperation({
    summary: 'Buscar exame por código interno',
    description: 'Retorna um exame específico pelo código interno.',
  })
  @ApiParam({
    name: 'codigo',
    type: String,
    description: 'Código interno do exame',
  })
  @ApiResponse({
    status: 200,
    description: 'Exame encontrado',
    type: Exame,
  })
  @ApiResponse({
    status: 404,
    description: 'Exame não encontrado',
  })
  async findByCodigo(
    @Param('codigo') codigo: string,
  ): Promise<ApiResponseType<Exame>> {
    const exame = await this.examesService.findByCodigo(codigo);
    return {
      message: 'Exame encontrado com sucesso',
      data: exame,
    };
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Buscar exame por ID',
    description: 'Retorna um exame específico pelo ID.',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID do exame',
  })
  @ApiResponse({
    status: 200,
    description: 'Exame encontrado',
    type: Exame,
  })
  @ApiResponse({
    status: 404,
    description: 'Exame não encontrado',
  })
  async findOne(@Param('id') id: string): Promise<ApiResponseType<Exame>> {
    const exame = await this.examesService.findOne(id);
    return {
      message: 'Exame encontrado com sucesso',
      data: exame,
    };
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Atualizar exame',
    description: 'Atualiza as informações de um exame existente.',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID do exame',
  })
  @ApiBody({ type: UpdateExameDto })
  @ApiResponse({
    status: 200,
    description: 'Exame atualizado com sucesso',
    type: Exame,
  })
  @ApiResponse({
    status: 404,
    description: 'Exame não encontrado',
  })
  @ApiResponse({
    status: 409,
    description: 'Código interno já existe em outro exame',
  })
  async update(
    @Param('id') id: string,
    @Body() updateExameDto: UpdateExameDto,
  ): Promise<ApiResponseType<Exame>> {
    const exame = await this.examesService.update(id, updateExameDto);
    return {
      message: 'Exame atualizado com sucesso',
      data: exame,
    };
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Desativar exame',
    description: 'Desativa um exame (soft delete).',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID do exame',
  })
  @ApiResponse({
    status: 200,
    description: 'Exame desativado com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Exame não encontrado',
  })
  async remove(@Param('id') id: string): Promise<ApiResponseType> {
    await this.examesService.remove(id);
    return {
      message: 'Exame desativado com sucesso',
    };
  }

  @Patch('status/bulk')
  @ApiOperation({
    summary: 'Atualizar status em lote',
    description: 'Atualiza o status de múltiplos exames.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        ids: {
          type: 'array',
          items: { type: 'string' },
          example: ['uuid1', 'uuid2', 'uuid3'],
        },
        status: {
          type: 'string',
          enum: ['ativo', 'inativo', 'suspenso'],
          example: 'inativo',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Status atualizados com sucesso',
  })
  async bulkUpdateStatus(
    @Body() body: { ids: string[]; status: string },
  ): Promise<ApiResponseType> {
    await this.examesService.bulkUpdateStatus(body.ids, body.status);
    return {
      message: 'Status dos exames atualizados com sucesso',
    };
  }
}
