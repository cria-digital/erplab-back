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
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Public } from '../../../autenticacao/auth/decorators/public.decorator';
import { CnaeService } from '../services/cnae.service';
import { CreateCnaeDto } from '../dto/create-cnae.dto';
import { UpdateCnaeDto } from '../dto/update-cnae.dto';
import { SearchCnaeDto } from '../dto/search-cnae.dto';
import { Cnae } from '../entities/cnae.entity';
import { PaginatedResultDto } from '../dto/pagination.dto';

@ApiTags('CNAE - Classificação Nacional de Atividades Econômicas')
@Controller('cnae')
@ApiBearerAuth()
export class CnaeController {
  constructor(private readonly cnaeService: CnaeService) {}

  @Post()
  @ApiOperation({
    summary: 'Criar novo CNAE',
    description: 'Endpoint para cadastrar um novo CNAE no sistema',
  })
  @ApiResponse({
    status: 201,
    description: 'CNAE criado com sucesso',
    type: Cnae,
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos',
  })
  @ApiResponse({
    status: 409,
    description: 'CNAE já existe com este código',
  })
  create(@Body() createCnaeDto: CreateCnaeDto): Promise<Cnae> {
    return this.cnaeService.create(createCnaeDto);
  }

  @Get()
  @Public()
  @ApiOperation({
    summary: 'Listar CNAEs com filtros e paginação',
    description:
      'Retorna lista paginada de CNAEs podendo filtrar por código, descrição, seção, divisão e status',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Número da página (padrão: 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Quantidade por página (padrão: 10, máximo: 100)',
  })
  @ApiQuery({
    name: 'codigo',
    required: false,
    description: 'Filtrar por código',
  })
  @ApiQuery({
    name: 'descricao',
    required: false,
    description: 'Filtrar por descrição',
  })
  @ApiQuery({
    name: 'secao',
    required: false,
    description: 'Filtrar por seção',
  })
  @ApiQuery({
    name: 'divisao',
    required: false,
    description: 'Filtrar por divisão',
  })
  @ApiQuery({
    name: 'ativo',
    required: false,
    type: Boolean,
    description: 'Filtrar por status',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista paginada de CNAEs',
    schema: {
      example: {
        data: [
          {
            id: 'uuid',
            codigo: '86101',
            descricao: 'ATIVIDADES DE ATENDIMENTO HOSPITALAR',
            secao: 'Q',
            // ... outros campos
          },
        ],
        meta: {
          page: 1,
          limit: 10,
          total: 1358,
          totalPages: 136,
          hasPrevPage: false,
          hasNextPage: true,
        },
      },
    },
  })
  findAll(
    @Query() searchDto: SearchCnaeDto,
  ): Promise<PaginatedResultDto<Cnae>> {
    return this.cnaeService.findAll(searchDto);
  }

  @Get('search')
  @Public()
  @ApiOperation({
    summary: 'Buscar CNAEs por termo',
    description:
      'Busca CNAEs por termo em código, descrição ou subclasse. Retorna no máximo 20 resultados.',
  })
  @ApiQuery({
    name: 'q',
    required: true,
    description: 'Termo de busca (mínimo 2 caracteres)',
    example: 'laboratório',
  })
  @ApiResponse({
    status: 200,
    description: 'CNAEs encontrados',
    type: [Cnae],
  })
  search(@Query('q') termo: string): Promise<Cnae[]> {
    return this.cnaeService.search(termo);
  }

  @Get('codigo')
  @Public()
  @ApiOperation({
    summary: 'Buscar CNAE por código',
    description: 'Busca um CNAE específico pelo seu código',
  })
  @ApiQuery({
    name: 'codigo',
    description: 'Código do CNAE',
    example: '8640-2/02',
  })
  @ApiResponse({ status: 200, description: 'CNAE encontrado' })
  @ApiResponse({ status: 404, description: 'CNAE não encontrado' })
  findByCodigo(@Query('codigo') codigo: string): Promise<Cnae> {
    return this.cnaeService.findByCodigo(codigo);
  }

  @Get('secao/:secao')
  @Public()
  @ApiOperation({
    summary: 'Listar CNAEs por seção',
    description: 'Retorna todos os CNAEs de uma seção específica',
  })
  @ApiParam({ name: 'secao', description: 'Letra da seção (A-U)' })
  findBySecao(@Param('secao') secao: string): Promise<Cnae[]> {
    return this.cnaeService.findBySecao(secao);
  }

  @Get('divisao/:divisao')
  @Public()
  @ApiOperation({
    summary: 'Listar CNAEs por divisão',
    description: 'Retorna todos os CNAEs de uma divisão específica',
  })
  @ApiParam({ name: 'divisao', description: 'Código da divisão (01-99)' })
  findByDivisao(@Param('divisao') divisao: string): Promise<Cnae[]> {
    return this.cnaeService.findByDivisao(divisao);
  }

  @Get(':id')
  @Public()
  @ApiOperation({
    summary: 'Buscar CNAE por ID',
    description: 'Busca um CNAE específico pelo seu ID (UUID)',
  })
  @ApiParam({ name: 'id', description: 'ID do CNAE' })
  @ApiResponse({ status: 200, description: 'CNAE encontrado' })
  @ApiResponse({ status: 404, description: 'CNAE não encontrado' })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Cnae> {
    return this.cnaeService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar CNAE' })
  @ApiParam({ name: 'id', description: 'ID do CNAE' })
  @ApiResponse({ status: 200, description: 'CNAE atualizado com sucesso' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCnaeDto: UpdateCnaeDto,
  ): Promise<Cnae> {
    return this.cnaeService.update(id, updateCnaeDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Desativar CNAE' })
  @ApiParam({ name: 'id', description: 'ID do CNAE' })
  @ApiResponse({ status: 200, description: 'CNAE desativado com sucesso' })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.cnaeService.remove(id);
  }

  @Post('import')
  @ApiOperation({
    summary: 'Importar CNAEs em lote',
    description:
      'Permite importar múltiplos CNAEs de uma vez. Útil para carga inicial de dados.',
  })
  @ApiResponse({
    status: 201,
    description: 'CNAEs importados com sucesso',
    schema: {
      example: {
        message: '100 CNAEs importados com sucesso',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Erro na importação',
  })
  async importBulk(
    @Body() cnaes: CreateCnaeDto[],
  ): Promise<{ message: string }> {
    await this.cnaeService.importBulk(cnaes);
    return { message: `${cnaes.length} CNAEs importados com sucesso` };
  }
}
