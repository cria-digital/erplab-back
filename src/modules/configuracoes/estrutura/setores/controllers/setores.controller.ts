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
import { SetoresService } from '../services/setores.service';
import { CreateSetorDto } from '../dto/create-setor.dto';
import { UpdateSetorDto } from '../dto/update-setor.dto';
import { TipoSetor } from '../entities/setor.entity';

@ApiTags('Estrutura - Setores')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/v1/configuracoes/estrutura/setores')
export class SetoresController {
  constructor(private readonly setoresService: SetoresService) {}

  @Post()
  @ApiOperation({ summary: 'Criar novo setor' })
  @ApiResponse({ status: 201, description: 'Setor criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async create(@Body() createSetorDto: CreateSetorDto, @Request() req) {
    return await this.setoresService.create(createSetorDto, req.user.userId);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os setores' })
  @ApiResponse({ status: 200, description: 'Lista de setores retornada' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async findAll() {
    return await this.setoresService.findAll();
  }

  @Get('ativos')
  @ApiOperation({ summary: 'Listar setores ativos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de setores ativos retornada',
  })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async findAllAtivos() {
    return await this.setoresService.findAllAtivos();
  }

  @Get('estatisticas')
  @ApiOperation({ summary: 'Obter estatísticas dos setores' })
  @ApiResponse({ status: 200, description: 'Estatísticas retornadas' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async getEstatisticas() {
    return await this.setoresService.getEstatisticas();
  }

  @Get('tipo/:tipo')
  @ApiOperation({ summary: 'Buscar setores por tipo' })
  @ApiParam({ name: 'tipo', enum: TipoSetor })
  @ApiResponse({ status: 200, description: 'Setores encontrados' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async findByTipo(@Param('tipo') tipo: TipoSetor) {
    return await this.setoresService.findByTipo(tipo);
  }

  @Get('unidade/:unidadeId')
  @ApiOperation({ summary: 'Buscar setores por unidade' })
  @ApiParam({ name: 'unidadeId', type: 'string' })
  @ApiResponse({ status: 200, description: 'Setores encontrados' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async findByUnidade(@Param('unidadeId') unidadeId: string) {
    return await this.setoresService.findByUnidade(unidadeId);
  }

  @Get('codigo/:codigo')
  @ApiOperation({ summary: 'Buscar setor por código' })
  @ApiParam({ name: 'codigo', type: 'string' })
  @ApiResponse({ status: 200, description: 'Setor encontrado' })
  @ApiResponse({ status: 404, description: 'Setor não encontrado' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async findByCodigo(@Param('codigo') codigo: string) {
    return await this.setoresService.findByCodigo(codigo);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar setor por ID' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiResponse({ status: 200, description: 'Setor encontrado' })
  @ApiResponse({ status: 404, description: 'Setor não encontrado' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async findOne(@Param('id') id: string) {
    return await this.setoresService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar setor' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiResponse({ status: 200, description: 'Setor atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Setor não encontrado' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async update(
    @Param('id') id: string,
    @Body() updateSetorDto: UpdateSetorDto,
    @Request() req,
  ) {
    return await this.setoresService.update(
      id,
      updateSetorDto,
      req.user.userId,
    );
  }

  @Patch(':id/toggle-ativo')
  @ApiOperation({ summary: 'Alternar status ativo/inativo do setor' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Status do setor alterado com sucesso',
  })
  @ApiResponse({ status: 404, description: 'Setor não encontrado' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async toggleAtivo(@Param('id') id: string, @Request() req) {
    return await this.setoresService.toggleAtivo(id, req.user.userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover setor' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiResponse({ status: 200, description: 'Setor removido com sucesso' })
  @ApiResponse({ status: 404, description: 'Setor não encontrado' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async remove(@Param('id') id: string) {
    await this.setoresService.remove(id);
    return { message: 'Setor removido com sucesso' };
  }
}
