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

import { ConvenioService } from './services/convenio.service';
import { CreateConvenioExamesDto } from '../../exames/exames/dto/create-convenio-exames.dto';
import { UpdateConvenioExamesDto } from '../../exames/exames/dto/update-convenio-exames.dto';
import { Convenio } from './entities/convenio.entity';
import {
  VincularIntegracaoDto,
  VincularIntegracaoLoteDto,
} from './dto/vincular-integracao.dto';

interface ApiResponseType<T = any> {
  message: string;
  data?: T;
}

@ApiTags('Convênios')
@ApiBearerAuth()
@Controller('relacionamento/convenios')
export class ConveniosController {
  constructor(private readonly convenioService: ConvenioService) {}

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
    const convenio = await this.convenioService.create(createConvenioDto);

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
    @Query('page') _page?: string,
    @Query('limit') _limit?: string,
    @Query('search') _search?: string,
    @Query('status') _status?: string, // TODO: Remover após migration
  ) {
    // Service refatorado não tem paginação - retorna todos
    const convenios = await this.convenioService.findAll();
    return {
      message: 'Convênios encontrados',
      data: convenios,
    };
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
    const convenios = await this.convenioService.findAtivos();
    return {
      message: 'Convênios ativos encontrados',
      data: convenios,
    };
  }

  // TODO: Refatorar após migration - método removido
  // @Get('com-integracao')
  // @ApiOperation({
  //   summary: 'Listar convênios com integração',
  //   description: 'Retorna todos os convênios que possuem integração via API.',
  // })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Lista de convênios com integração',
  //   type: [Convenio],
  // })
  // async findComIntegracao(): Promise<ApiResponseType<Convenio[]>> {
  //   const convenios = await this.convenioService.findComIntegracao();
  //   return {
  //     message: 'Convênios com integração encontrados',
  //     data: convenios,
  //   };
  // }

  // TODO: Refatorar após migration - método removido
  // @Get('tipo-faturamento/:tipo')
  // @ApiOperation({
  //   summary: 'Buscar convênios por tipo de faturamento',
  //   description: 'Retorna convênios filtrados pelo tipo de faturamento.',
  // })
  // @ApiParam({
  //   name: 'tipo',
  //   enum: ['tiss', 'proprio', 'manual'],
  //   description: 'Tipo de faturamento',
  // })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Lista de convênios do tipo',
  //   type: [Convenio],
  // })
  // async findByTipoFaturamento(
  //   @Param('tipo') tipo: string,
  // ): Promise<ApiResponseType<Convenio[]>> {
  //   const convenios = await this.convenioService.findByTipoFaturamento(tipo);
  //   return {
  //     message: 'Convênios encontrados com sucesso',
  //     data: convenios,
  //   };
  // }

  // TODO: Refatorar após migration - método removido
  // @Get(':id/autorizacao')
  // @ApiOperation({
  //   summary: 'Verificar requisitos de autorização',
  //   description: 'Verifica se o convênio requer autorização e/ou senha.',
  // })
  // @ApiParam({
  //   name: 'id',
  //   type: String,
  //   description: 'ID do convênio',
  // })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Requisitos de autorização',
  //   schema: {
  //     type: 'object',
  //     properties: {
  //       requerAutorizacao: { type: 'boolean' },
  //       requerSenha: { type: 'boolean' },
  //     },
  //   },
  // })
  // async verificarAutorizacao(
  //   @Param('id') id: string,
  // ): Promise<ApiResponseType<any>> {
  //   const autorizacao = await this.convenioService.verificarAutorizacao(id);
  //   return {
  //     message: 'Requisitos de autorização verificados',
  //     data: autorizacao,
  //   };
  // }

  // TODO: Refatorar após migration - método removido
  // @Get(':id/regras')
  // @ApiOperation({
  //   summary: 'Obter regras do convênio',
  //   description: 'Retorna as regras específicas e configurações do convênio.',
  // })
  // @ApiParam({
  //   name: 'id',
  //   type: String,
  //   description: 'ID do convênio',
  // })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Regras do convênio',
  //   schema: {
  //     type: 'object',
  //     properties: {
  //       percentualDesconto: { type: 'number' },
  //       tabelaPrecos: { type: 'string' },
  //       validadeGuiaDias: { type: 'number' },
  //       regrasEspecificas: { type: 'object' },
  //     },
  //   },
  // })
  // async getRegrasConvenio(
  //   @Param('id') id: string,
  // ): Promise<ApiResponseType<any>> {
  //   const regras = await this.convenioService.getRegrasConvenio(id);
  //   return {
  //     message: 'Regras do convênio obtidas com sucesso',
  //     data: regras,
  //   };
  // }

  // TODO: Refatorar após migration - campo codigo_convenio removido
  // @Get('codigo/:codigo')
  // @ApiOperation({
  //   summary: 'Buscar convênio por código',
  //   description: 'Retorna um convênio específico pelo código.',
  // })
  // @ApiParam({
  //   name: 'codigo',
  //   type: String,
  //   description: 'Código do convênio',
  // })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Convênio encontrado',
  //   type: Convenio,
  // })
  // @ApiResponse({
  //   status: 404,
  //   description: 'Convênio não encontrado',
  // })
  // async findByCodigo(
  //   @Param('codigo') codigo: string,
  // ): Promise<ApiResponseType<Convenio>> {
  //   const convenio = await this.convenioService.findByCodigo(codigo);
  //   return {
  //     message: 'Convênio encontrado com sucesso',
  //     data: convenio,
  //   };
  // }

  // ==========================================
  // ENDPOINTS DE INTEGRAÇÃO
  // ==========================================

  @Get('com-integracao')
  @ApiOperation({
    summary: 'Listar convênios com integração',
    description: 'Retorna todos os convênios que possuem integração vinculada.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de convênios com integração',
    type: [Convenio],
  })
  async findComIntegracao(): Promise<ApiResponseType<Convenio[]>> {
    const convenios = await this.convenioService.findComIntegracao();
    return {
      message: 'Convênios com integração encontrados',
      data: convenios,
    };
  }

  @Get('sem-integracao')
  @ApiOperation({
    summary: 'Listar convênios sem integração',
    description:
      'Retorna todos os convênios que não possuem integração vinculada.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de convênios sem integração',
    type: [Convenio],
  })
  async findSemIntegracao(): Promise<ApiResponseType<Convenio[]>> {
    const convenios = await this.convenioService.findSemIntegracao();
    return {
      message: 'Convênios sem integração encontrados',
      data: convenios,
    };
  }

  @Get('integracao/:integracaoId')
  @ApiOperation({
    summary: 'Listar convênios por integração',
    description:
      'Retorna todos os convênios vinculados a uma integração específica.',
  })
  @ApiParam({
    name: 'integracaoId',
    type: String,
    description: 'ID da integração',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de convênios da integração',
    type: [Convenio],
  })
  async findByIntegracao(
    @Param('integracaoId') integracaoId: string,
  ): Promise<ApiResponseType<Convenio[]>> {
    const convenios = await this.convenioService.findByIntegracao(integracaoId);
    return {
      message: 'Convênios da integração encontrados',
      data: convenios,
    };
  }

  @Post('vincular-integracao')
  @ApiOperation({
    summary: 'Vincular integração a um convênio',
    description: 'Vincula ou desvincula uma integração de um convênio.',
  })
  @ApiBody({ type: VincularIntegracaoDto })
  @ApiResponse({
    status: 200,
    description: 'Integração vinculada com sucesso',
    type: Convenio,
  })
  @ApiResponse({
    status: 404,
    description: 'Convênio não encontrado',
  })
  async vincularIntegracao(
    @Body() dto: VincularIntegracaoDto,
  ): Promise<ApiResponseType<Convenio>> {
    const convenio = await this.convenioService.vincularIntegracao(dto);
    return {
      message: dto.integracaoId
        ? 'Integração vinculada com sucesso'
        : 'Integração desvinculada com sucesso',
      data: convenio,
    };
  }

  @Post('vincular-integracao/lote')
  @ApiOperation({
    summary: 'Vincular integrações em lote',
    description:
      'Vincula ou desvincula integrações de múltiplos convênios em uma única operação.',
  })
  @ApiBody({ type: VincularIntegracaoLoteDto })
  @ApiResponse({
    status: 200,
    description: 'Operação em lote concluída',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        data: {
          type: 'object',
          properties: {
            sucesso: { type: 'number', example: 5 },
            erros: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  convenioId: { type: 'string' },
                  erro: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
  })
  async vincularIntegracaoLote(
    @Body() dto: VincularIntegracaoLoteDto,
  ): Promise<ApiResponseType> {
    const resultado = await this.convenioService.vincularIntegracaoLote(dto);
    return {
      message: `Operação concluída: ${resultado.sucesso} sucesso(s), ${resultado.erros.length} erro(s)`,
      data: resultado,
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
    const convenio = await this.convenioService.findOne(id);
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
    const convenio = await this.convenioService.update(id, updateConvenioDto);
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
    await this.convenioService.remove(id);
    return {
      message: 'Convênio desativado com sucesso',
    };
  }
}
