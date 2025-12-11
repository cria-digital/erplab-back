import { Controller, Post, Body, Get } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { DbDiagnosticosService } from './db-diagnosticos.service';
import {
  EnviarPedidoDbDto,
  ConsultarStatusDbDto,
  ConsultarLaudoDbDto,
  ConsultarLaudoPeriodoDbDto,
  ConsultarLaudoPdfDbDto,
  ReimprimirEtiquetasDbDto,
  ConsultarPendenciasDbDto,
  GerarEtiquetaRecoletaDbDto,
  ConsultarLoteResultadosDbDto,
  RelatorioRequisicoesDbDto,
  CancelarExameDbDto,
  EnviarPedidoResponseDto,
  ConsultarStatusResponseDto,
  ConsultarLaudoResponseDto,
  ConsultarLaudoPdfResponseDto,
  ConsultarPendenciasResponseDto,
  RelatorioRequisicoesResponseDto,
} from './dto/db-diagnosticos.dto';

@ApiTags('Integrações - DB Diagnósticos')
@ApiBearerAuth()
@Controller('integracoes/db-diagnosticos')
export class DbDiagnosticosController {
  constructor(private readonly dbDiagnosticosService: DbDiagnosticosService) {}

  @Post('pedido')
  @ApiOperation({
    summary: 'Enviar pedido',
    description:
      'Envia um pedido de exames para o DB Diagnósticos e retorna etiquetas (RecebeAtendimento)',
  })
  @ApiResponse({
    status: 201,
    description: 'Pedido enviado com sucesso',
    type: EnviarPedidoResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({
    status: 500,
    description: 'Erro na comunicação com DB Diagnósticos',
  })
  async enviarPedido(@Body() dto: EnviarPedidoDbDto) {
    const result = await this.dbDiagnosticosService.enviarPedido(dto);

    return {
      sucesso: result.sucesso,
      erro: result.erro,
      numeroLote: result.dados?.StatusLote?.NumeroLote,
      dataHoraGravacao: result.dados?.StatusLote?.DataHoraGravacao,
      confirmacao: result.dados?.Confirmacao
        ? {
            numeroAtendimentoApoiado:
              result.dados.Confirmacao.NumeroAtendimentoApoiado,
            status: result.dados.Confirmacao.Status,
            numeroAtendimentoDb: result.dados.Confirmacao.NumeroAtendimentoDB,
            amostras: result.dados.Confirmacao.Amostras?.map((a) => ({
              numeroAmostra: a.NumeroAmostra,
              exames: a.Exames,
              contadorAmostra: a.ContadorAmostra,
              rgPacienteDb: a.RGPacienteDB,
              nomePaciente: a.NomePaciente,
              meioColeta: a.MeioColeta,
              grupoInterface: a.GrupoInterface,
              material: a.Material,
              regiaoColeta: a.RegiaoColeta,
              volume: a.Volume,
              prioridade: a.Prioridade,
              tipoCodigoBarras: a.TipoCodigoBarras,
              codigoInstrumento: a.CodigoInstrumento,
              origem: a.Origem,
              flagAmostraMae: a.FlagAmostraMae,
              textoAmostraMae: a.TextoAmostraMae,
              dataSistema: a.DataSistema,
              etiquetaAmostra: a.EtiquetaAmostra,
            })),
          }
        : undefined,
    };
  }

  @Post('status')
  @ApiOperation({
    summary: 'Consultar status do pedido',
    description:
      'Consulta o status de processamento de um pedido (ConsultaStatusAtendimento)',
  })
  @ApiResponse({
    status: 200,
    description: 'Status consultado com sucesso',
    type: ConsultarStatusResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  async consultarStatus(@Body() dto: ConsultarStatusDbDto) {
    const result = await this.dbDiagnosticosService.consultarStatus(dto);

    return {
      sucesso: result.sucesso,
      erro: result.erro,
      numeroAtendimentoDb: result.dados?.NumeroAtendimentoDB,
      numeroAtendimentoApoiado: result.dados?.NumeroAtendimentoApoiado,
      nomePaciente: result.dados?.NomePaciente,
      status: result.dados?.Status,
      dataHoraStatus: result.dados?.DataHoraStatus,
      exames: result.dados?.Exames?.map((e) => ({
        codigoExameDb: e.CodigoExameDB,
        descricaoExame: e.DescricaoExame,
        status: e.Status,
        dataHoraStatus: e.DataHoraStatus,
        material: e.Material,
      })),
    };
  }

  @Post('laudo')
  @ApiOperation({
    summary: 'Consultar laudo/resultado',
    description:
      'Consulta o resultado de um pedido específico (EnviaLaudoAtendimento)',
  })
  @ApiResponse({
    status: 200,
    description: 'Laudo consultado com sucesso',
    type: ConsultarLaudoResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  async consultarLaudo(@Body() dto: ConsultarLaudoDbDto) {
    const result = await this.dbDiagnosticosService.consultarLaudo(dto);

    return {
      sucesso: result.sucesso,
      erro: result.erro,
      numeroAtendimentoDb: result.dados?.NumeroAtendimentoDB,
      numeroAtendimentoApoiado: result.dados?.NumeroAtendimentoApoiado,
      nomePaciente: result.dados?.NomePaciente,
      dataNascimento: result.dados?.DataNascimento,
      sexoPaciente: result.dados?.SexoPaciente,
      dataColeta: result.dados?.DataColeta,
      dataLiberacao: result.dados?.DataLiberacao,
      exames: result.dados?.Exames?.map((e) => ({
        codigoExameDb: e.CodigoExameDB,
        descricaoExame: e.DescricaoExame,
        material: e.Material,
        dataHoraLiberacao: e.DataHoraLiberacao,
        resultado: e.Resultado,
        unidadeMedida: e.UnidadeMedida,
        valorReferencia: e.ValorReferencia,
        observacao: e.Observacao,
      })),
    };
  }

  @Post('laudo/lista')
  @ApiOperation({
    summary: 'Consultar laudos em lote',
    description:
      'Consulta resultados de múltiplos pedidos (EnviaLaudoAtendimentoLista)',
  })
  @ApiResponse({
    status: 200,
    description: 'Laudos consultados com sucesso',
  })
  async consultarLaudoLista(@Body() numerosAtendimentoDb: string[]) {
    const result =
      await this.dbDiagnosticosService.consultarLaudoLista(
        numerosAtendimentoDb,
      );

    return {
      sucesso: result.sucesso,
      erro: result.erro,
      laudos: result.dados?.map((l) => ({
        numeroAtendimentoDb: l.NumeroAtendimentoDB,
        numeroAtendimentoApoiado: l.NumeroAtendimentoApoiado,
        nomePaciente: l.NomePaciente,
        dataNascimento: l.DataNascimento,
        sexoPaciente: l.SexoPaciente,
        dataColeta: l.DataColeta,
        dataLiberacao: l.DataLiberacao,
        exames: l.Exames?.map((e) => ({
          codigoExameDb: e.CodigoExameDB,
          descricaoExame: e.DescricaoExame,
          material: e.Material,
          dataHoraLiberacao: e.DataHoraLiberacao,
          resultado: e.Resultado,
          unidadeMedida: e.UnidadeMedida,
          valorReferencia: e.ValorReferencia,
          observacao: e.Observacao,
        })),
      })),
    };
  }

  @Post('laudo/periodo')
  @ApiOperation({
    summary: 'Consultar laudos por período',
    description:
      'Consulta resultados liberados em um período (EnviaLaudoAtendimentoPorPeriodo)',
  })
  @ApiResponse({
    status: 200,
    description: 'Laudos consultados com sucesso',
  })
  async consultarLaudoPorPeriodo(@Body() dto: ConsultarLaudoPeriodoDbDto) {
    const result =
      await this.dbDiagnosticosService.consultarLaudoPorPeriodo(dto);

    return {
      sucesso: result.sucesso,
      erro: result.erro,
      laudos: result.dados?.map((l) => ({
        numeroAtendimentoDb: l.NumeroAtendimentoDB,
        numeroAtendimentoApoiado: l.NumeroAtendimentoApoiado,
        nomePaciente: l.NomePaciente,
        dataLiberacao: l.DataLiberacao,
        quantidadeExames: l.Exames?.length || 0,
      })),
    };
  }

  @Post('laudo/pdf')
  @ApiOperation({
    summary: 'Consultar laudo em PDF',
    description:
      'Retorna o link ou Base64 do laudo em PDF (EnviaResultadoBase64)',
  })
  @ApiResponse({
    status: 200,
    description: 'Link/PDF do laudo retornado',
    type: ConsultarLaudoPdfResponseDto,
  })
  async consultarLaudoPdf(@Body() dto: ConsultarLaudoPdfDbDto) {
    const result = await this.dbDiagnosticosService.consultarLaudoPdf(dto);

    return {
      sucesso: result.sucesso,
      erro: result.erro,
      numeroAtendimentoDb: result.dados?.NumeroAtendimentoDB,
      linkLaudo: result.dados?.LinkLaudo,
      laudoBase64: result.dados?.LaudoBase64,
    };
  }

  @Post('etiquetas/reimprimir')
  @ApiOperation({
    summary: 'Reimprimir etiquetas',
    description:
      'Recupera as etiquetas de um pedido já enviado (EnviaAmostras)',
  })
  @ApiResponse({
    status: 200,
    description: 'Etiquetas retornadas com sucesso',
  })
  async reimprimirEtiquetas(@Body() dto: ReimprimirEtiquetasDbDto) {
    const result = await this.dbDiagnosticosService.reimprimirEtiquetas(dto);

    return {
      sucesso: result.sucesso,
      erro: result.erro,
      etiquetas: result.dados?.map((a) => ({
        numeroAmostra: a.NumeroAmostra,
        exames: a.Exames,
        contadorAmostra: a.ContadorAmostra,
        nomePaciente: a.NomePaciente,
        material: a.Material,
        etiquetaAmostra: a.EtiquetaAmostra,
      })),
    };
  }

  @Post('pendencias')
  @ApiOperation({
    summary: 'Consultar pendências técnicas',
    description:
      'Lista procedimentos com pendências técnicas (ListaProcedimentosPendentes)',
  })
  @ApiResponse({
    status: 200,
    description: 'Pendências consultadas com sucesso',
    type: ConsultarPendenciasResponseDto,
  })
  async consultarPendencias(@Body() dto: ConsultarPendenciasDbDto) {
    const result = await this.dbDiagnosticosService.consultarPendencias(dto);

    return {
      sucesso: result.sucesso,
      erro: result.erro,
      pendencias: result.dados?.map((p) => ({
        numeroAtendimentoDb: p.NumeroAtendimentoDB,
        numeroAtendimentoApoiado: p.NumeroAtendimentoApoiado,
        nomePaciente: p.NomePaciente,
        codigoExameDb: p.CodigoExameDB,
        descricaoExame: p.DescricaoExame,
        material: p.Material,
        motivoPendencia: p.MotivoPendencia,
        dataPendencia: p.DataPendencia,
      })),
    };
  }

  @Post('recoleta/etiqueta')
  @ApiOperation({
    summary: 'Gerar etiqueta para recoleta',
    description:
      'Gera nova etiqueta para procedimento pendente de recoleta (EnviaAmostrasProcedimentosPendentes)',
  })
  @ApiResponse({
    status: 200,
    description: 'Etiqueta gerada com sucesso',
  })
  async gerarEtiquetaRecoleta(@Body() dto: GerarEtiquetaRecoletaDbDto) {
    const result = await this.dbDiagnosticosService.gerarEtiquetaRecoleta(dto);

    return {
      sucesso: result.sucesso,
      erro: result.erro,
      etiquetas: result.dados?.map((a) => ({
        numeroAmostra: a.NumeroAmostra,
        exames: a.Exames,
        contadorAmostra: a.ContadorAmostra,
        nomePaciente: a.NomePaciente,
        material: a.Material,
        etiquetaAmostra: a.EtiquetaAmostra,
      })),
    };
  }

  @Post('lote/resultados')
  @ApiOperation({
    summary: 'Consultar lote de resultados',
    description:
      'Consulta resultados de um lote específico (EnviaLoteResultados)',
  })
  @ApiResponse({
    status: 200,
    description: 'Lote consultado com sucesso',
  })
  async consultarLoteResultados(@Body() dto: ConsultarLoteResultadosDbDto) {
    const result =
      await this.dbDiagnosticosService.consultarLoteResultados(dto);

    return {
      sucesso: result.sucesso,
      erro: result.erro,
      laudos: result.dados?.map((l) => ({
        numeroAtendimentoDb: l.NumeroAtendimentoDB,
        numeroAtendimentoApoiado: l.NumeroAtendimentoApoiado,
        nomePaciente: l.NomePaciente,
        dataLiberacao: l.DataLiberacao,
        quantidadeExames: l.Exames?.length || 0,
      })),
    };
  }

  @Post('relatorio/requisicoes')
  @ApiOperation({
    summary: 'Relatório de requisições enviadas',
    description:
      'Retorna relatório de requisições enviadas no período (RelatorioRequisicoesEnviadas)',
  })
  @ApiResponse({
    status: 200,
    description: 'Relatório gerado com sucesso',
    type: RelatorioRequisicoesResponseDto,
  })
  async consultarRelatorioRequisicoes(@Body() dto: RelatorioRequisicoesDbDto) {
    const result =
      await this.dbDiagnosticosService.consultarRelatorioRequisicoes(dto);

    return {
      sucesso: result.sucesso,
      erro: result.erro,
      requisicoes: result.dados?.map((r) => ({
        numeroAtendimentoDb: r.NumeroAtendimentoDB,
        numeroAtendimentoApoiado: r.NumeroAtendimentoApoiado,
        nomePaciente: r.NomePaciente,
        dataEnvio: r.DataEnvio,
        status: r.Status,
        quantidadeExames: r.QuantidadeExames,
      })),
    };
  }

  @Post('cancelar-exame')
  @ApiOperation({
    summary: 'Cancelar exame',
    description:
      'Cancela um exame temporária ou definitivamente via CodigoMPP (CTP/CDP)',
  })
  @ApiResponse({
    status: 200,
    description: 'Exame cancelado com sucesso',
    type: EnviarPedidoResponseDto,
  })
  async cancelarExame(@Body() dto: CancelarExameDbDto) {
    const result = await this.dbDiagnosticosService.cancelarExame(dto);

    return {
      sucesso: result.sucesso,
      erro: result.erro,
      mensagem: result.sucesso
        ? `Exame ${dto.codigoExameDb} cancelado com sucesso`
        : result.erro,
    };
  }

  @Get('health')
  @ApiOperation({
    summary: 'Verificar saúde da integração',
    description:
      'Verifica se a integração com DB Diagnósticos está configurada',
  })
  @ApiResponse({
    status: 200,
    description: 'Status da integração',
  })
  healthCheck() {
    return {
      status: 'ok',
      integracao: 'DB Diagnósticos',
      protocolo: 'DBSync v2.0',
      wsdl: 'https://wsmb.diagnosticosdobrasil.com.br/dbsync/wsrvProtocoloDBSync.dbsync.svc?wsdl',
      metodos: [
        'RecebeAtendimento',
        'EnviaLaudoAtendimento',
        'EnviaLaudoAtendimentoLista',
        'EnviaLaudoAtendimentoPorPeriodo',
        'ConsultaStatusAtendimento',
        'EnviaAmostras',
        'ListaProcedimentosPendentes',
        'EnviaAmostrasProcedimentosPendentes',
        'EnviaLoteResultados',
        'EnviaResultadoBase64',
        'RelatorioRequisicoesEnviadas',
      ],
    };
  }
}
