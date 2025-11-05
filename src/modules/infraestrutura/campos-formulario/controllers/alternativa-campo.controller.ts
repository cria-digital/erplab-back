import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AlternativaCampoService } from '../services/alternativa-campo.service';
import { CreateAlternativaCampoDto } from '../dto/create-alternativa-campo.dto';
import { UpdateAlternativaCampoDto } from '../dto/update-alternativa-campo.dto';

@ApiTags('Alternativas de Campo')
@Controller('infraestrutura/campos-formulario/:campoId/alternativas')
@ApiBearerAuth()
export class AlternativaCampoController {
  constructor(
    private readonly alternativaCampoService: AlternativaCampoService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Criar nova alternativa',
    description: 'Adiciona uma nova alternativa a um campo',
  })
  @ApiParam({ name: 'campoId', description: 'ID do campo' })
  @ApiResponse({ status: 201, description: 'Alternativa criada' })
  create(
    @Param('campoId', ParseUUIDPipe) campoId: string,
    @Body() createDto: CreateAlternativaCampoDto,
  ) {
    return this.alternativaCampoService.create(campoId, createDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar alternativas',
    description: 'Lista todas as alternativas de um campo',
  })
  @ApiParam({ name: 'campoId', description: 'ID do campo' })
  @ApiResponse({ status: 200, description: 'Lista de alternativas' })
  findByCampo(@Param('campoId', ParseUUIDPipe) campoId: string) {
    return this.alternativaCampoService.findByCampo(campoId);
  }

  @Get('ativas')
  @ApiOperation({
    summary: 'Listar alternativas ativas',
    description: 'Lista apenas alternativas ativas de um campo',
  })
  @ApiParam({ name: 'campoId', description: 'ID do campo' })
  @ApiResponse({ status: 200, description: 'Lista de alternativas ativas' })
  findAtivas(@Param('campoId', ParseUUIDPipe) campoId: string) {
    return this.alternativaCampoService.findAtivasByCampo(campoId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Buscar alternativa por ID',
    description: 'Retorna uma alternativa específica',
  })
  @ApiParam({ name: 'campoId', description: 'ID do campo' })
  @ApiParam({ name: 'id', description: 'ID da alternativa' })
  @ApiResponse({ status: 200, description: 'Alternativa encontrada' })
  @ApiResponse({ status: 404, description: 'Alternativa não encontrada' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.alternativaCampoService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Atualizar alternativa',
    description: 'Atualiza uma alternativa',
  })
  @ApiParam({ name: 'campoId', description: 'ID do campo' })
  @ApiParam({ name: 'id', description: 'ID da alternativa' })
  @ApiResponse({ status: 200, description: 'Alternativa atualizada' })
  @ApiResponse({ status: 404, description: 'Alternativa não encontrada' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateAlternativaCampoDto,
  ) {
    return this.alternativaCampoService.update(id, updateDto);
  }

  @Patch(':id/toggle-status')
  @ApiOperation({
    summary: 'Alternar status ativo/inativo',
    description: 'Ativa ou desativa uma alternativa',
  })
  @ApiParam({ name: 'campoId', description: 'ID do campo' })
  @ApiParam({ name: 'id', description: 'ID da alternativa' })
  @ApiResponse({ status: 200, description: 'Status alterado' })
  @ApiResponse({ status: 404, description: 'Alternativa não encontrada' })
  toggleStatus(@Param('id', ParseUUIDPipe) id: string) {
    return this.alternativaCampoService.toggleStatus(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Remover alternativa',
    description: 'Remove uma alternativa',
  })
  @ApiParam({ name: 'campoId', description: 'ID do campo' })
  @ApiParam({ name: 'id', description: 'ID da alternativa' })
  @ApiResponse({ status: 204, description: 'Alternativa removida' })
  @ApiResponse({ status: 404, description: 'Alternativa não encontrada' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.alternativaCampoService.remove(id);
  }
}
