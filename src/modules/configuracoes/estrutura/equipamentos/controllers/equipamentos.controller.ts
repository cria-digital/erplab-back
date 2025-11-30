import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../../autenticacao/auth/guards/jwt-auth.guard';
import { EquipamentosService } from '../services/equipamentos.service';
import { CreateEquipamentoDto } from '../dto/create-equipamento.dto';
import { UpdateEquipamentoDto } from '../dto/update-equipamento.dto';

@ApiTags('Estrutura - Equipamentos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('configuracoes/estrutura/equipamentos')
export class EquipamentosController {
  constructor(private readonly equipamentosService: EquipamentosService) {}

  @Post()
  @ApiOperation({ summary: 'Criar novo equipamento' })
  @ApiResponse({ status: 201, description: 'Equipamento criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 409, description: 'Código interno já existe' })
  async create(@Body() createEquipamentoDto: CreateEquipamentoDto) {
    return await this.equipamentosService.create(createEquipamentoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os equipamentos' })
  @ApiResponse({ status: 200, description: 'Lista de equipamentos retornada' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async findAll() {
    return await this.equipamentosService.findAll();
  }

  @Get('ativos')
  @ApiOperation({ summary: 'Listar equipamentos ativos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de equipamentos ativos retornada',
  })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async findAllAtivos() {
    return await this.equipamentosService.findAllAtivos();
  }

  @Get('estatisticas')
  @ApiOperation({ summary: 'Obter estatísticas dos equipamentos' })
  @ApiResponse({ status: 200, description: 'Estatísticas retornadas' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async getEstatisticas() {
    return await this.equipamentosService.getEstatisticas();
  }

  @Get('unidade/:unidadeId')
  @ApiOperation({ summary: 'Buscar equipamentos por unidade' })
  @ApiParam({ name: 'unidadeId', type: 'string' })
  @ApiResponse({ status: 200, description: 'Equipamentos encontrados' })
  @ApiResponse({ status: 400, description: 'UUID inválido' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async findByUnidade(@Param('unidadeId', ParseUUIDPipe) unidadeId: string) {
    return await this.equipamentosService.findByUnidade(unidadeId);
  }

  @Get('sala/:salaId')
  @ApiOperation({ summary: 'Buscar equipamentos por sala' })
  @ApiParam({ name: 'salaId', type: 'string' })
  @ApiResponse({ status: 200, description: 'Equipamentos encontrados' })
  @ApiResponse({ status: 400, description: 'UUID inválido' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async findBySala(@Param('salaId', ParseUUIDPipe) salaId: string) {
    return await this.equipamentosService.findBySala(salaId);
  }

  @Get('codigo/:codigoInterno')
  @ApiOperation({ summary: 'Buscar equipamento por código interno' })
  @ApiParam({ name: 'codigoInterno', type: 'string' })
  @ApiResponse({ status: 200, description: 'Equipamento encontrado' })
  @ApiResponse({ status: 404, description: 'Equipamento não encontrado' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async findByCodigoInterno(@Param('codigoInterno') codigoInterno: string) {
    return await this.equipamentosService.findByCodigoInterno(codigoInterno);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar equipamento por ID' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiResponse({ status: 200, description: 'Equipamento encontrado' })
  @ApiResponse({ status: 400, description: 'UUID inválido' })
  @ApiResponse({ status: 404, description: 'Equipamento não encontrado' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.equipamentosService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar equipamento' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Equipamento atualizado com sucesso',
  })
  @ApiResponse({ status: 400, description: 'UUID inválido ou dados inválidos' })
  @ApiResponse({ status: 404, description: 'Equipamento não encontrado' })
  @ApiResponse({ status: 409, description: 'Código interno já existe' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateEquipamentoDto: UpdateEquipamentoDto,
  ) {
    return await this.equipamentosService.update(id, updateEquipamentoDto);
  }

  @Patch(':id/toggle-ativo')
  @ApiOperation({ summary: 'Alternar status ativo/inativo do equipamento' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Status do equipamento alterado com sucesso',
  })
  @ApiResponse({ status: 400, description: 'UUID inválido' })
  @ApiResponse({ status: 404, description: 'Equipamento não encontrado' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async toggleAtivo(@Param('id', ParseUUIDPipe) id: string) {
    return await this.equipamentosService.toggleAtivo(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover equipamento' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Equipamento removido com sucesso',
  })
  @ApiResponse({ status: 400, description: 'UUID inválido' })
  @ApiResponse({ status: 404, description: 'Equipamento não encontrado' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.equipamentosService.remove(id);
    return { message: 'Equipamento removido com sucesso' };
  }
}
