import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { ExameLaboratorioApoioService } from './exame-laboratorio-apoio.service';
import { CreateExameLaboratorioApoioDto } from './dto/create-exame-laboratorio-apoio.dto';
import { UpdateExameLaboratorioApoioDto } from './dto/update-exame-laboratorio-apoio.dto';

@ApiTags('Exames - Laboratórios de Apoio')
@ApiBearerAuth()
@Controller('exames/exames-laboratorios-apoio')
export class ExameLaboratorioApoioController {
  constructor(private readonly service: ExameLaboratorioApoioService) {}

  @Post()
  @ApiOperation({
    summary: 'Criar configuração de laboratório de apoio para um exame',
  })
  @ApiResponse({
    status: 201,
    description: 'Configuração criada com sucesso',
  })
  @ApiResponse({
    status: 409,
    description: 'Já existe configuração para este exame e laboratório',
  })
  async create(@Body() dto: CreateExameLaboratorioApoioDto) {
    const data = await this.service.create(dto);
    return {
      message: 'Configuração de laboratório de apoio criada com sucesso',
      data,
    };
  }

  @Get()
  @ApiOperation({
    summary: 'Listar todas as configurações de laboratórios de apoio',
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
    description: 'Itens por página (padrão: 10)',
  })
  @ApiQuery({
    name: 'exameId',
    required: false,
    description: 'Filtrar por ID do exame',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de configurações',
  })
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('exameId') exameId?: string,
  ) {
    return this.service.findAll(page || 1, limit || 10, exameId);
  }

  @Get('exame/:exameId')
  @ApiOperation({
    summary: 'Listar laboratórios de apoio de um exame específico',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de laboratórios de apoio do exame',
  })
  async findByExame(@Param('exameId', ParseUUIDPipe) exameId: string) {
    const data = await this.service.findByExame(exameId);
    return {
      message: 'Laboratórios de apoio do exame listados com sucesso',
      data,
      total: data.length,
    };
  }

  @Get('laboratorio/:laboratorioId')
  @ApiOperation({
    summary: 'Listar exames de um laboratório de apoio específico',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de exames do laboratório de apoio',
  })
  async findByLaboratorio(
    @Param('laboratorioId', ParseUUIDPipe) laboratorioId: string,
  ) {
    const data = await this.service.findByLaboratorio(laboratorioId);
    return {
      message: 'Exames do laboratório de apoio listados com sucesso',
      data,
      total: data.length,
    };
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Buscar configuração de laboratório de apoio por ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Configuração encontrada',
  })
  @ApiResponse({
    status: 404,
    description: 'Configuração não encontrada',
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const data = await this.service.findOne(id);
    return {
      message: 'Configuração encontrada com sucesso',
      data,
    };
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Atualizar configuração de laboratório de apoio',
  })
  @ApiResponse({
    status: 200,
    description: 'Configuração atualizada com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Configuração não encontrada',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateExameLaboratorioApoioDto,
  ) {
    const data = await this.service.update(id, dto);
    return {
      message: 'Configuração de laboratório de apoio atualizada com sucesso',
      data,
    };
  }

  @Patch(':id/toggle-ativo')
  @ApiOperation({
    summary: 'Ativar/Desativar configuração de laboratório de apoio',
  })
  @ApiResponse({
    status: 200,
    description: 'Status alterado com sucesso',
  })
  async toggleAtivo(@Param('id', ParseUUIDPipe) id: string) {
    const data = await this.service.toggleAtivo(id);
    return {
      message: `Configuração ${data.ativo ? 'ativada' : 'desativada'} com sucesso`,
      data,
    };
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Remover configuração de laboratório de apoio',
  })
  @ApiResponse({
    status: 200,
    description: 'Configuração removida com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Configuração não encontrada',
  })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.service.remove(id);
    return {
      message: 'Configuração de laboratório de apoio removida com sucesso',
    };
  }
}
