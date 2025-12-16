import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  Request,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { DespesaCaixaService } from '../services/despesa-caixa.service';
import { CreateDespesaCaixaDto } from '../dto/create-despesa-caixa.dto';
import { DespesaCaixa } from '../entities/despesa-caixa.entity';

@ApiTags('Despesas do Caixa')
@ApiBearerAuth()
@Controller('atendimento/caixa/despesas')
export class DespesaCaixaController {
  constructor(private readonly despesaService: DespesaCaixaService) {}

  @Post()
  @ApiOperation({ summary: 'Criar nova despesa do caixa' })
  @ApiResponse({
    status: 201,
    description: 'Despesa criada com sucesso',
    type: DespesaCaixa,
  })
  @ApiResponse({ status: 400, description: 'Caixa já está fechado' })
  @ApiResponse({ status: 404, description: 'Caixa não encontrado' })
  async criar(
    @Body() dto: CreateDespesaCaixaDto,
    @Request() req: any,
  ): Promise<{ message: string; data: DespesaCaixa }> {
    const despesa = await this.despesaService.criar(dto, req.user.tenantId);
    return { message: 'Despesa criada com sucesso', data: despesa };
  }

  @Get('caixa/:caixaId')
  @ApiOperation({ summary: 'Listar despesas de um caixa' })
  @ApiResponse({ status: 200, description: 'Lista de despesas' })
  async listarPorCaixa(
    @Param('caixaId', ParseUUIDPipe) caixaId: string,
  ): Promise<{ data: DespesaCaixa[] }> {
    const despesas = await this.despesaService.listarPorCaixa(caixaId);
    return { data: despesas };
  }

  @Get('caixa/:caixaId/total')
  @ApiOperation({ summary: 'Obter total de despesas de um caixa' })
  @ApiResponse({ status: 200, description: 'Total de despesas' })
  async calcularTotal(
    @Param('caixaId', ParseUUIDPipe) caixaId: string,
  ): Promise<{ total: number }> {
    const total = await this.despesaService.calcularTotalDespesas(caixaId);
    return { total };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar despesa por ID' })
  @ApiResponse({
    status: 200,
    description: 'Despesa encontrada',
    type: DespesaCaixa,
  })
  @ApiResponse({ status: 404, description: 'Despesa não encontrada' })
  async buscarPorId(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ data: DespesaCaixa }> {
    const despesa = await this.despesaService.buscarPorId(id);
    return { data: despesa };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover despesa do caixa' })
  @ApiResponse({ status: 200, description: 'Despesa removida com sucesso' })
  @ApiResponse({ status: 400, description: 'Caixa já está fechado' })
  @ApiResponse({ status: 404, description: 'Despesa não encontrada' })
  async remover(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ message: string }> {
    await this.despesaService.remover(id);
    return { message: 'Despesa removida com sucesso' };
  }
}
