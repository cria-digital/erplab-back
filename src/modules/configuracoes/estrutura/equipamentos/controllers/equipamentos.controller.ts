import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
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
import { SituacaoEquipamento } from '../entities/equipamento.entity';

@ApiTags('Estrutura - Equipamentos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/v1/configuracoes/estrutura/equipamentos')
export class EquipamentosController {
  constructor(private readonly equipamentosService: EquipamentosService) {}

  @Post()
  @ApiOperation({ summary: 'Criar novo equipamento' })
  @ApiResponse({ status: 201, description: 'Equipamento criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async create(
    @Body() createEquipamentoDto: CreateEquipamentoDto,
    @Request() req,
  ) {
    return await this.equipamentosService.create(
      createEquipamentoDto,
      req.user.userId,
    );
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

  @Get('manutencao-vencida')
  @ApiOperation({ summary: 'Listar equipamentos com manutenção vencida' })
  @ApiResponse({
    status: 200,
    description: 'Lista de equipamentos com manutenção vencida',
  })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async findManutencaoVencida() {
    return await this.equipamentosService.findManutencaoVencida();
  }

  @Get('situacao/:situacao')
  @ApiOperation({ summary: 'Buscar equipamentos por situação' })
  @ApiParam({ name: 'situacao', enum: SituacaoEquipamento })
  @ApiResponse({ status: 200, description: 'Equipamentos encontrados' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async findBySituacao(@Param('situacao') situacao: SituacaoEquipamento) {
    return await this.equipamentosService.findBySituacao(situacao);
  }

  @Get('unidade/:unidadeId')
  @ApiOperation({ summary: 'Buscar equipamentos por unidade' })
  @ApiParam({ name: 'unidadeId', type: 'string' })
  @ApiResponse({ status: 200, description: 'Equipamentos encontrados' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async findByUnidade(@Param('unidadeId') unidadeId: string) {
    return await this.equipamentosService.findByUnidade(unidadeId);
  }

  @Get('sala/:salaId')
  @ApiOperation({ summary: 'Buscar equipamentos por sala' })
  @ApiParam({ name: 'salaId', type: 'string' })
  @ApiResponse({ status: 200, description: 'Equipamentos encontrados' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async findBySala(@Param('salaId') salaId: string) {
    return await this.equipamentosService.findBySala(salaId);
  }

  @Get('setor/:setorId')
  @ApiOperation({ summary: 'Buscar equipamentos por setor' })
  @ApiParam({ name: 'setorId', type: 'string' })
  @ApiResponse({ status: 200, description: 'Equipamentos encontrados' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async findBySetor(@Param('setorId') setorId: string) {
    return await this.equipamentosService.findBySetor(setorId);
  }

  @Get('patrimonio/:patrimonio')
  @ApiOperation({ summary: 'Buscar equipamento por patrimônio' })
  @ApiParam({ name: 'patrimonio', type: 'string' })
  @ApiResponse({ status: 200, description: 'Equipamento encontrado' })
  @ApiResponse({ status: 404, description: 'Equipamento não encontrado' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async findByPatrimonio(@Param('patrimonio') patrimonio: string) {
    return await this.equipamentosService.findByPatrimonio(patrimonio);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar equipamento por ID' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiResponse({ status: 200, description: 'Equipamento encontrado' })
  @ApiResponse({ status: 404, description: 'Equipamento não encontrado' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async findOne(@Param('id') id: string) {
    return await this.equipamentosService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar equipamento' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Equipamento atualizado com sucesso',
  })
  @ApiResponse({ status: 404, description: 'Equipamento não encontrado' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async update(
    @Param('id') id: string,
    @Body() updateEquipamentoDto: UpdateEquipamentoDto,
    @Request() req,
  ) {
    return await this.equipamentosService.update(
      id,
      updateEquipamentoDto,
      req.user.userId,
    );
  }

  @Patch(':id/situacao')
  @ApiOperation({ summary: 'Atualizar situação do equipamento' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Situação do equipamento atualizada com sucesso',
  })
  @ApiResponse({ status: 404, description: 'Equipamento não encontrado' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async updateSituacao(
    @Param('id') id: string,
    @Body('situacao') situacao: SituacaoEquipamento,
    @Request() req,
  ) {
    return await this.equipamentosService.updateSituacao(
      id,
      situacao,
      req.user.userId,
    );
  }

  @Patch(':id/toggle-ativo')
  @ApiOperation({ summary: 'Alternar status ativo/inativo do equipamento' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Status do equipamento alterado com sucesso',
  })
  @ApiResponse({ status: 404, description: 'Equipamento não encontrado' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async toggleAtivo(@Param('id') id: string, @Request() req) {
    return await this.equipamentosService.toggleAtivo(id, req.user.userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover equipamento' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Equipamento removido com sucesso',
  })
  @ApiResponse({ status: 404, description: 'Equipamento não encontrado' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async remove(@Param('id') id: string) {
    await this.equipamentosService.remove(id);
    return { message: 'Equipamento removido com sucesso' };
  }
}
