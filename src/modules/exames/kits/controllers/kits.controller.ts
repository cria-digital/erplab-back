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
  HttpCode,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { KitsService } from '../services/kits.service';
import { CreateKitDto } from '../dto/create-kit.dto';
import { UpdateKitDto } from '../dto/update-kit.dto';
import { Kit } from '../entities/kit.entity';
import { JwtAuthGuard } from '../../../autenticacao/auth/guards/jwt-auth.guard';

@ApiTags('Kits')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('kits')
export class KitsController {
  constructor(private readonly kitsService: KitsService) {}

  @Post()
  @ApiOperation({ summary: 'Criar um novo kit de exames' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Kit criado com sucesso',
    type: Kit,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Código interno já existe',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Exame, unidade ou convênio não encontrado',
  })
  create(@Body() createKitDto: CreateKitDto): Promise<Kit> {
    return this.kitsService.create(createKitDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os kits' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de kits retornada com sucesso',
    type: [Kit],
  })
  findAll(): Promise<Kit[]> {
    return this.kitsService.findAll();
  }

  @Get('ativos')
  @ApiOperation({ summary: 'Listar apenas kits ativos' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de kits ativos retornada com sucesso',
    type: [Kit],
  })
  findAtivos(): Promise<Kit[]> {
    return this.kitsService.findAtivos();
  }

  @Get('codigo/:codigo')
  @ApiOperation({ summary: 'Buscar kit por código interno' })
  @ApiParam({
    name: 'codigo',
    description: 'Código interno do kit',
    example: 'KIT001',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Kit encontrado',
    type: Kit,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Kit não encontrado',
  })
  findByCodigo(@Param('codigo') codigo: string): Promise<Kit> {
    return this.kitsService.findByCodigo(codigo);
  }

  @Get('unidade/:unidadeId')
  @ApiOperation({ summary: 'Listar kits disponíveis em uma unidade' })
  @ApiParam({
    name: 'unidadeId',
    description: 'ID da unidade de saúde',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de kits da unidade',
    type: [Kit],
  })
  findByUnidade(
    @Param('unidadeId', ParseUUIDPipe) unidadeId: string,
  ): Promise<Kit[]> {
    return this.kitsService.findByUnidade(unidadeId);
  }

  @Get('convenio/:convenioId')
  @ApiOperation({ summary: 'Listar kits aceitos por um convênio' })
  @ApiParam({
    name: 'convenioId',
    description: 'ID do convênio',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de kits do convênio',
    type: [Kit],
  })
  findByConvenio(
    @Param('convenioId', ParseUUIDPipe) convenioId: string,
  ): Promise<Kit[]> {
    return this.kitsService.findByConvenio(convenioId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar kit por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID do kit',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Kit encontrado',
    type: Kit,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Kit não encontrado',
  })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Kit> {
    return this.kitsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar dados de um kit' })
  @ApiParam({
    name: 'id',
    description: 'ID do kit',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Kit atualizado com sucesso',
    type: Kit,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Kit não encontrado',
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateKitDto: UpdateKitDto,
  ): Promise<Kit> {
    return this.kitsService.update(id, updateKitDto);
  }

  @Patch(':id/toggle-status')
  @ApiOperation({ summary: 'Alternar status do kit (ativo/inativo)' })
  @ApiParam({
    name: 'id',
    description: 'ID do kit',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Status do kit alterado com sucesso',
    type: Kit,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Kit não encontrado',
  })
  toggleStatus(@Param('id', ParseUUIDPipe) id: string): Promise<Kit> {
    return this.kitsService.toggleStatus(id);
  }

  @Post(':id/duplicate')
  @ApiOperation({ summary: 'Duplicar um kit existente' })
  @ApiParam({
    name: 'id',
    description: 'ID do kit a ser duplicado',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiQuery({
    name: 'codigoInterno',
    description: 'Novo código interno para o kit duplicado',
    example: 'KIT002',
    required: true,
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Kit duplicado com sucesso',
    type: Kit,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Kit original não encontrado',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Código interno já existe',
  })
  duplicateKit(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('codigoInterno') codigoInterno: string,
  ): Promise<Kit> {
    return this.kitsService.duplicateKit(id, codigoInterno);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover um kit' })
  @ApiParam({
    name: 'id',
    description: 'ID do kit',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Kit removido com sucesso',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Kit não encontrado',
  })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.kitsService.remove(id);
  }
}
