import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AtendimentoService } from '../services/atendimento.service';

@ApiTags('atendimento')
@ApiBearerAuth()
@Controller('atendimento')
export class AtendimentoController {
  constructor(private readonly atendimentoService: AtendimentoService) {}

  @Get()
  @ApiOperation({
    summary: 'Listar atendimentos',
    description:
      'RF001-RF004: Sistema de contato multi-canal, auto-atendimento, gestão de filas e OS',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de atendimentos retornada com sucesso',
  })
  listarAtendimentos() {
    return this.atendimentoService.listarTodos();
  }

  @Get('fila')
  @ApiOperation({
    summary: 'Obter fila de atendimento',
    description: 'RF003: Gestão de fila de atendimento com Kanban visual',
  })
  @ApiResponse({
    status: 200,
    description: 'Fila de atendimento atual',
  })
  obterFilaAtendimento() {
    return this.atendimentoService.obterFila();
  }

  @Post('ordem-servico')
  @ApiOperation({
    summary: 'Gerar Ordem de Serviço',
    description:
      'RF004: Geração automática de OS com dados do paciente e exames',
  })
  @ApiResponse({
    status: 201,
    description: 'OS criada com sucesso',
  })
  gerarOrdemServico(@Body() dados: any) {
    return this.atendimentoService.gerarOS(dados);
  }

  @Post('ocr/pedido-medico')
  @ApiOperation({
    summary: 'Processar pedido médico com OCR',
    description:
      'RF002: Auto-atendimento com OCR para leitura de pedidos médicos',
  })
  @ApiResponse({
    status: 200,
    description: 'Pedido médico processado com sucesso',
  })
  processarPedidoOCR(@Body() arquivo: any) {
    return this.atendimentoService.processarOCR(arquivo);
  }
}
