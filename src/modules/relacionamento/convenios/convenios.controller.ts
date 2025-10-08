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

import { ConveniosService } from './convenios.service';
import { CreateConvenioExamesDto } from '../../exames/exames/dto/create-convenio-exames.dto';
import { UpdateConvenioExamesDto } from '../../exames/exames/dto/update-convenio-exames.dto';
import { Convenio } from './entities/convenio.entity';

interface ApiResponseType<T = any> {
  message: string;
  data?: T;
}

@ApiTags('Convênios')
@ApiBearerAuth()
@Controller('convenios')
export class ConveniosController {
  constructor(private readonly conveniosService: ConveniosService) {}

  @Post()
  @ApiOperation({
    summary: 'Criar um novo convênio',
    description:
      'Cria um novo convênio no sistema com todas as configurações necessárias.',
  })
  @ApiResponse({
    status: 201,
    description: 'Convênio criado com sucesso',
    type: Convenio,
  })
  @ApiResponse({
    status: 409,
    description: 'Código ou CNPJ já cadastrado',
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos',
  })
  @ApiBody({ type: CreateConvenioExamesDto })
  async create(
    @Body() createConvenioDto: CreateConvenioExamesDto,
  ): Promise<ApiResponseType<Convenio>> {
    const convenio = await this.conveniosService.create(createConvenioDto);

    return {
      message: 'Convênio criado com sucesso',
      data: convenio,
    };
  }

  @Get()
  @ApiOperation({
    summary: 'Listar convênios',
    description: 'Lista todos os convênios com filtros opcionais e paginação.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de convênios retornada com sucesso',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/Convenio' },
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
    description: 'Buscar por nome do convênio',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['ativo', 'inativo', 'suspenso'],
    description: 'Filtrar por status',
  })
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('status') status?: string,
  ) {
    return await this.conveniosService.findAll(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 10,
      search,
      status,
    );
  }

  @Get('ativos')
  @ApiOperation({
    summary: 'Listar convênios ativos',
    description: 'Retorna todos os convênios com status ativo.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de convênios ativos',
    type: [Convenio],
  })
  async findAtivos(): Promise<ApiResponseType<Convenio[]>> {
    const convenios = await this.conveniosService.findAtivos();
    return {
      message: 'Convênios ativos encontrados',
      data: convenios,
    };
  }

  @Get('com-integracao')
  @ApiOperation({
    summary: 'Listar convênios com integração',
    description: 'Retorna todos os convênios que possuem integração via API.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de convênios com integração',
    type: [Convenio],
  })
  async findComIntegracao(): Promise<ApiResponseType<Convenio[]>> {
    const convenios = await this.conveniosService.findComIntegracao();
    return {
      message: 'Convênios com integração encontrados',
      data: convenios,
    };
  }

  @Get('tipo-faturamento/:tipo')
  @ApiOperation({
    summary: 'Buscar convênios por tipo de faturamento',
    description: 'Retorna convênios filtrados pelo tipo de faturamento.',
  })
  @ApiParam({
    name: 'tipo',
    enum: ['tiss', 'proprio', 'manual'],
    description: 'Tipo de faturamento',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de convênios do tipo',
    type: [Convenio],
  })
  async findByTipoFaturamento(
    @Param('tipo') tipo: string,
  ): Promise<ApiResponseType<Convenio[]>> {
    const convenios = await this.conveniosService.findByTipoFaturamento(tipo);
    return {
      message: 'Convênios encontrados com sucesso',
      data: convenios,
    };
  }

  @Get(':id/autorizacao')
  @ApiOperation({
    summary: 'Verificar requisitos de autorização',
    description: 'Verifica se o convênio requer autorização e/ou senha.',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID do convênio',
  })
  @ApiResponse({
    status: 200,
    description: 'Requisitos de autorização',
    schema: {
      type: 'object',
      properties: {
        requerAutorizacao: { type: 'boolean' },
        requerSenha: { type: 'boolean' },
      },
    },
  })
  async verificarAutorizacao(
    @Param('id') id: string,
  ): Promise<ApiResponseType<any>> {
    const autorizacao = await this.conveniosService.verificarAutorizacao(id);
    return {
      message: 'Requisitos de autorização verificados',
      data: autorizacao,
    };
  }

  @Get(':id/regras')
  @ApiOperation({
    summary: 'Obter regras do convênio',
    description: 'Retorna as regras específicas e configurações do convênio.',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID do convênio',
  })
  @ApiResponse({
    status: 200,
    description: 'Regras do convênio',
    schema: {
      type: 'object',
      properties: {
        percentualDesconto: { type: 'number' },
        tabelaPrecos: { type: 'string' },
        validadeGuiaDias: { type: 'number' },
        regrasEspecificas: { type: 'object' },
      },
    },
  })
  async getRegrasConvenio(
    @Param('id') id: string,
  ): Promise<ApiResponseType<any>> {
    const regras = await this.conveniosService.getRegrasConvenio(id);
    return {
      message: 'Regras do convênio obtidas com sucesso',
      data: regras,
    };
  }

  @Get('codigo/:codigo')
  @ApiOperation({
    summary: 'Buscar convênio por código',
    description: 'Retorna um convênio específico pelo código.',
  })
  @ApiParam({
    name: 'codigo',
    type: String,
    description: 'Código do convênio',
  })
  @ApiResponse({
    status: 200,
    description: 'Convênio encontrado',
    type: Convenio,
  })
  @ApiResponse({
    status: 404,
    description: 'Convênio não encontrado',
  })
  async findByCodigo(
    @Param('codigo') codigo: string,
  ): Promise<ApiResponseType<Convenio>> {
    const convenio = await this.conveniosService.findByCodigo(codigo);
    return {
      message: 'Convênio encontrado com sucesso',
      data: convenio,
    };
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Buscar convênio por ID',
    description: 'Retorna um convênio específico pelo ID.',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID do convênio',
  })
  @ApiResponse({
    status: 200,
    description: 'Convênio encontrado',
    type: Convenio,
  })
  @ApiResponse({
    status: 404,
    description: 'Convênio não encontrado',
  })
  async findOne(@Param('id') id: string): Promise<ApiResponseType<Convenio>> {
    const convenio = await this.conveniosService.findOne(id);
    return {
      message: 'Convênio encontrado com sucesso',
      data: convenio,
    };
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Atualizar convênio',
    description: 'Atualiza as informações de um convênio existente.',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID do convênio',
  })
  @ApiBody({ type: UpdateConvenioExamesDto })
  @ApiResponse({
    status: 200,
    description: 'Convênio atualizado com sucesso',
    type: Convenio,
  })
  @ApiResponse({
    status: 404,
    description: 'Convênio não encontrado',
  })
  @ApiResponse({
    status: 409,
    description: 'Código ou CNPJ já existe em outro convênio',
  })
  async update(
    @Param('id') id: string,
    @Body() updateConvenioDto: UpdateConvenioExamesDto,
  ): Promise<ApiResponseType<Convenio>> {
    const convenio = await this.conveniosService.update(id, updateConvenioDto);
    return {
      message: 'Convênio atualizado com sucesso',
      data: convenio,
    };
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Desativar convênio',
    description: 'Desativa um convênio (soft delete).',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID do convênio',
  })
  @ApiResponse({
    status: 200,
    description: 'Convênio desativado com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Convênio não encontrado',
  })
  async remove(@Param('id') id: string): Promise<ApiResponseType> {
    await this.conveniosService.remove(id);
    return {
      message: 'Convênio desativado com sucesso',
    };
  }
}
