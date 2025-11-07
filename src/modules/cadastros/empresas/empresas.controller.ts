import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { EmpresasService } from './empresas.service';
import { CreateEmpresaDto } from './dto/create-empresa.dto';
import { UpdateEmpresaDto } from './dto/update-empresa.dto';
import { SearchEmpresaDto } from './dto/search-empresa.dto';
import { JwtAuthGuard } from '../../autenticacao/auth/guards/jwt-auth.guard';
import { Empresa } from './entities/empresa.entity';
import { TipoEmpresaEnum } from './enums/empresas.enum';

@ApiTags('Empresas')
@ApiBearerAuth()
@Controller('cadastros/empresas')
@UseGuards(JwtAuthGuard)
export class EmpresasController {
  constructor(private readonly empresasService: EmpresasService) {}

  @Post()
  @ApiOperation({ summary: 'Cadastrar nova empresa' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Empresa cadastrada com sucesso',
    type: Empresa,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Dados inválidos',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'CNPJ já cadastrado',
  })
  create(@Body() createEmpresaDto: CreateEmpresaDto) {
    return this.empresasService.create(createEmpresaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as empresas' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de empresas retornada com sucesso',
    type: [Empresa],
  })
  findAll() {
    return this.empresasService.findAll();
  }

  @Get('search')
  @ApiOperation({
    summary: 'Buscar empresas com filtros e paginação',
    description:
      'Busca empresas com filtros opcionais (termo, tipoEmpresa, ativo) e paginação (page, limit)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista paginada de empresas encontradas',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { type: 'object' },
        },
        meta: {
          type: 'object',
          properties: {
            page: { type: 'number', example: 1 },
            limit: { type: 'number', example: 10 },
            total: { type: 'number', example: 50 },
            totalPages: { type: 'number', example: 5 },
            hasPrevPage: { type: 'boolean', example: false },
            hasNextPage: { type: 'boolean', example: true },
          },
        },
      },
    },
  })
  search(@Query() searchDto: SearchEmpresaDto) {
    return this.empresasService.search(searchDto);
  }

  @Get('tipo/:tipo')
  @ApiOperation({ summary: 'Listar empresas por tipo' })
  @ApiParam({
    name: 'tipo',
    enum: TipoEmpresaEnum,
    description: 'Tipo de empresa',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de empresas do tipo especificado',
    type: [Empresa],
  })
  findByTipo(@Param('tipo') tipo: string) {
    return this.empresasService.findByTipo(tipo);
  }

  @Get('cnpj/:cnpj')
  @ApiOperation({ summary: 'Buscar empresa por CNPJ' })
  @ApiParam({
    name: 'cnpj',
    description: 'CNPJ da empresa',
    example: '00.000.000/0001-00',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Empresa encontrada',
    type: Empresa,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Empresa não encontrada',
  })
  findByCnpj(@Param('cnpj') cnpj: string) {
    return this.empresasService.findByCnpj(cnpj);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar empresa por ID' })
  @ApiParam({ name: 'id', description: 'ID da empresa' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Empresa encontrada',
    type: Empresa,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Empresa não encontrada',
  })
  findOne(@Param('id') id: string) {
    return this.empresasService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar dados da empresa' })
  @ApiParam({ name: 'id', description: 'ID da empresa' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Empresa atualizada com sucesso',
    type: Empresa,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Empresa não encontrada',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'CNPJ já cadastrado para outra empresa',
  })
  update(@Param('id') id: string, @Body() updateEmpresaDto: UpdateEmpresaDto) {
    return this.empresasService.update(id, updateEmpresaDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover empresa (soft delete)' })
  @ApiParam({ name: 'id', description: 'ID da empresa' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Empresa removida com sucesso',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Empresa não encontrada',
  })
  remove(@Param('id') id: string) {
    return this.empresasService.remove(id);
  }

  @Patch(':id/ativar')
  @ApiOperation({ summary: 'Ativar empresa' })
  @ApiParam({ name: 'id', description: 'ID da empresa' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Empresa ativada com sucesso',
    type: Empresa,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Empresa não encontrada',
  })
  activate(@Param('id') id: string) {
    return this.empresasService.activate(id);
  }

  @Patch(':id/desativar')
  @ApiOperation({ summary: 'Desativar empresa' })
  @ApiParam({ name: 'id', description: 'ID da empresa' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Empresa desativada com sucesso',
    type: Empresa,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Empresa não encontrada',
  })
  deactivate(@Param('id') id: string) {
    return this.empresasService.deactivate(id);
  }
}
