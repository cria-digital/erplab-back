import {
  Controller,
  Get,
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
} from '@nestjs/swagger';
import { TelemedicinaService } from '../services/telemedicina.service';
import { UpdateTelemedicinaDto } from '../dto/update-telemedicina.dto';
import { Telemedicina } from '../entities/telemedicina.entity';

@ApiTags('Telemedicina')
@Controller('relacionamento/telemedicina')
export class TelemedicinaController {
  constructor(private readonly telemedicinaService: TelemedicinaService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todas as empresas de telemedicina' })
  @ApiResponse({
    status: 200,
    description: 'Lista de telemedicinas retornada com sucesso.',
    type: [Telemedicina],
  })
  async findAll(): Promise<Telemedicina[]> {
    return await this.telemedicinaService.findAll();
  }

  @Get('ativos')
  @ApiOperation({ summary: 'Listar telemedicinas ativas' })
  @ApiResponse({
    status: 200,
    description: 'Lista de telemedicinas ativas.',
    type: [Telemedicina],
  })
  async findAtivos(): Promise<Telemedicina[]> {
    return await this.telemedicinaService.findAtivos();
  }

  @Get('search')
  @ApiOperation({ summary: 'Buscar telemedicinas por termo' })
  @ApiQuery({ name: 'q', description: 'Termo de busca' })
  @ApiResponse({
    status: 200,
    description: 'Resultados da busca.',
    type: [Telemedicina],
  })
  async search(@Query('q') query: string): Promise<Telemedicina[]> {
    return await this.telemedicinaService.search(query);
  }

  @Get('codigo/:codigo')
  @ApiOperation({ summary: 'Buscar telemedicina por código' })
  @ApiParam({ name: 'codigo', description: 'Código da telemedicina' })
  @ApiResponse({
    status: 200,
    description: 'Telemedicina encontrada.',
    type: Telemedicina,
  })
  @ApiResponse({ status: 404, description: 'Telemedicina não encontrada.' })
  async findByCodigo(@Param('codigo') codigo: string): Promise<Telemedicina> {
    return await this.telemedicinaService.findByCodigo(codigo);
  }

  @Get('cnpj/:cnpj')
  @ApiOperation({ summary: 'Buscar telemedicina por CNPJ' })
  @ApiParam({ name: 'cnpj', description: 'CNPJ da empresa' })
  @ApiResponse({
    status: 200,
    description: 'Telemedicina encontrada.',
    type: Telemedicina,
  })
  @ApiResponse({ status: 404, description: 'Telemedicina não encontrada.' })
  async findByCnpj(@Param('cnpj') cnpj: string): Promise<Telemedicina> {
    return await this.telemedicinaService.findByCnpj(cnpj);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar telemedicina por ID' })
  @ApiParam({ name: 'id', description: 'ID da telemedicina' })
  @ApiResponse({
    status: 200,
    description: 'Telemedicina encontrada.',
    type: Telemedicina,
  })
  @ApiResponse({ status: 404, description: 'Telemedicina não encontrada.' })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Telemedicina> {
    return await this.telemedicinaService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar telemedicina' })
  @ApiParam({ name: 'id', description: 'ID da telemedicina' })
  @ApiResponse({
    status: 200,
    description: 'Telemedicina atualizada com sucesso.',
    type: Telemedicina,
  })
  @ApiResponse({ status: 404, description: 'Telemedicina não encontrada.' })
  @ApiResponse({ status: 409, description: 'Código ou CNPJ já existe.' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTelemedicinaDto: UpdateTelemedicinaDto,
  ): Promise<Telemedicina> {
    return await this.telemedicinaService.update(id, updateTelemedicinaDto);
  }

  @Patch(':id/toggle-status')
  @ApiOperation({ summary: 'Alternar status da telemedicina' })
  @ApiParam({ name: 'id', description: 'ID da telemedicina' })
  @ApiResponse({
    status: 200,
    description: 'Status alterado com sucesso.',
    type: Telemedicina,
  })
  @ApiResponse({ status: 404, description: 'Telemedicina não encontrada.' })
  async toggleStatus(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Telemedicina> {
    return await this.telemedicinaService.toggleStatus(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover telemedicina' })
  @ApiParam({ name: 'id', description: 'ID da telemedicina' })
  @ApiResponse({
    status: 200,
    description: 'Telemedicina removida com sucesso.',
  })
  @ApiResponse({ status: 404, description: 'Telemedicina não encontrada.' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return await this.telemedicinaService.remove(id);
  }
}
