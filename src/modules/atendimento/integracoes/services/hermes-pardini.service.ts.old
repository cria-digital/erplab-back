import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as soap from 'soap';
import { Integracao, TipoIntegracao } from '../entities/integracao.entity';

export interface RecebeAtendimentoRequest {
  numeroRequisicao: string;
  dataRequisicao: string;
  codigoPaciente: string;
  nomePaciente: string;
  dataNascimento: string;
  sexo: string;
  exames: Array<{
    codigoExame: string;
    material: string;
  }>;
}

export interface ConsultaLaudoRequest {
  numeroRequisicao: string;
}

export interface ConsultaLaudoPeriodoRequest {
  dataInicio: string;
  dataFim: string;
}

export interface ConsultaStatusRequest {
  numeroRequisicao: string;
}

export interface CancelaExameRequest {
  numeroRequisicao: string;
  codigoExame: string;
  motivo: string;
}

export interface EnviaAmostrasRequest {
  numeroRequisicao: string;
  amostras: Array<{
    codigoAmostra: string;
    codigoExame: string;
    tipoMaterial: string;
    dataHoraColeta: string;
  }>;
}

export interface EnviaAmostrasPendentesRequest {
  numeroRequisicao: string;
}

export interface EnviaLoteResultadosRequest {
  numeroLote: string;
  resultados: Array<{
    codigoExame: string;
    parametro: string;
    valor: string;
    unidade: string;
    valorReferencia: string;
  }>;
}

export interface CancelaAmostraRequest {
  numeroRequisicao: string;
  codigoAmostra: string;
  motivo: string;
}

export interface ConsultaPendenciaTecnicaRequest {
  numeroRequisicao: string;
}

export interface GrupoFracionamentoRequest {
  codigoGrupo: string;
  descricao: string;
  exames: string[];
}

@Injectable()
export class HermesPardiniService {
  private readonly logger = new Logger(HermesPardiniService.name);

  constructor(
    @InjectRepository(Integracao)
    private readonly integracaoRepository: Repository<Integracao>,
  ) {}

  /**
   * Busca a integração ativa do Hermes Pardini
   */
  private async getIntegracao(): Promise<Integracao> {
    const integracao = await this.integracaoRepository.findOne({
      where: {
        tipoIntegracao: TipoIntegracao.LABORATORIO_APOIO,
        ativo: true,
      },
    });

    if (!integracao) {
      throw new NotFoundException(
        'Integração com Hermes Pardini não encontrada ou inativa. ' +
          'Configure a integração em: POST /api/v1/atendimento/integracoes',
      );
    }

    return integracao;
  }

  /**
   * Cria cliente SOAP
   */
  private async createSoapClient(integracao: Integracao): Promise<soap.Client> {
    const wsdlUrl = integracao.urlBase;

    try {
      const client = await soap.createClientAsync(wsdlUrl, {
        wsdl_options: {
          timeout: integracao.timeoutSegundos * 1000,
        },
      });

      this.logger.log(`Cliente SOAP criado para: ${wsdlUrl}`);
      return client;
    } catch (error) {
      this.logger.error(`Erro ao criar cliente SOAP: ${error.message}`);
      throw error;
    }
  }

  /**
   * Registra requisição na integração
   */
  private async registrarRequisicao(
    integracaoId: string,
    sucesso: boolean,
  ): Promise<void> {
    await this.integracaoRepository.increment(
      { id: integracaoId },
      'requisicoesHoje',
      1,
    );

    if (!sucesso) {
      await this.integracaoRepository.increment(
        { id: integracaoId },
        'tentativasFalhas',
        1,
      );
    }

    await this.integracaoRepository.update(integracaoId, {
      ultimaTentativa: new Date(),
      ...(sucesso && { ultimaSincronizacao: new Date() }),
    });
  }

  /**
   * 1. RECEBE ATENDIMENTO
   * Envia requisição de exame para o laboratório
   */
  async recebeAtendimento(
    request: RecebeAtendimentoRequest,
  ): Promise<{ sucesso: boolean; mensagem: string; numeroProtocolo?: string }> {
    const integracao = await this.getIntegracao();

    try {
      const client = await this.createSoapClient(integracao);

      const args = {
        codigoCliente: integracao.usuario,
        senhaCliente: integracao.senha,
        numeroRequisicao: request.numeroRequisicao,
        dataRequisicao: request.dataRequisicao,
        codigoPaciente: request.codigoPaciente,
        nomePaciente: request.nomePaciente,
        dataNascimento: request.dataNascimento,
        sexo: request.sexo,
        exames: request.exames,
      };

      const [result] = await client.RecebeAtendimentoAsync(args);

      await this.registrarRequisicao(integracao.id, true);

      this.logger.log(
        `RecebeAtendimento executado: ${request.numeroRequisicao}`,
      );

      return {
        sucesso: true,
        mensagem: 'Requisição enviada com sucesso',
        numeroProtocolo: result?.numeroProtocolo || request.numeroRequisicao,
      };
    } catch (error) {
      await this.registrarRequisicao(integracao.id, false);
      await this.integracaoRepository.update(integracao.id, {
        ultimoErro: error.message,
      });

      this.logger.error(`Erro RecebeAtendimento: ${error.message}`);

      return {
        sucesso: false,
        mensagem: `Erro ao enviar requisição: ${error.message}`,
      };
    }
  }

  /**
   * 2. ENVIA LAUDO ATENDIMENTO
   * Busca laudo de um atendimento específico
   */
  async enviaLaudoAtendimento(
    request: ConsultaLaudoRequest,
  ): Promise<{ sucesso: boolean; mensagem: string; laudo?: any }> {
    const integracao = await this.getIntegracao();

    try {
      const client = await this.createSoapClient(integracao);

      const args = {
        codigoCliente: integracao.usuario,
        senhaCliente: integracao.senha,
        numeroRequisicao: request.numeroRequisicao,
      };

      const [result] = await client.EnviaLaudoAtendimentoAsync(args);

      await this.registrarRequisicao(integracao.id, true);

      this.logger.log(
        `EnviaLaudoAtendimento executado: ${request.numeroRequisicao}`,
      );

      return {
        sucesso: true,
        mensagem: 'Laudo recuperado com sucesso',
        laudo: result,
      };
    } catch (error) {
      await this.registrarRequisicao(integracao.id, false);

      this.logger.error(`Erro EnviaLaudoAtendimento: ${error.message}`);

      return {
        sucesso: false,
        mensagem: `Erro ao buscar laudo: ${error.message}`,
      };
    }
  }

  /**
   * 3. ENVIA LAUDO ATENDIMENTO LISTA
   * Busca laudos de múltiplos atendimentos
   */
  async enviaLaudoAtendimentoLista(
    numerosRequisicao: string[],
  ): Promise<{ sucesso: boolean; mensagem: string; laudos?: any[] }> {
    const integracao = await this.getIntegracao();

    try {
      const client = await this.createSoapClient(integracao);

      const args = {
        codigoCliente: integracao.usuario,
        senhaCliente: integracao.senha,
        numerosRequisicao: numerosRequisicao.join(','),
      };

      const [result] = await client.EnviaLaudoAtendimentoListaAsync(args);

      await this.registrarRequisicao(integracao.id, true);

      this.logger.log(
        `EnviaLaudoAtendimentoLista executado: ${numerosRequisicao.length} requisições`,
      );

      return {
        sucesso: true,
        mensagem: 'Laudos recuperados com sucesso',
        laudos: result?.laudos || [],
      };
    } catch (error) {
      await this.registrarRequisicao(integracao.id, false);

      this.logger.error(`Erro EnviaLaudoAtendimentoLista: ${error.message}`);

      return {
        sucesso: false,
        mensagem: `Erro ao buscar laudos: ${error.message}`,
      };
    }
  }

  /**
   * 4. ENVIA LAUDO ATENDIMENTO POR PERÍODO
   * Busca laudos em um período de datas
   */
  async enviaLaudoAtendimentoPorPeriodo(
    request: ConsultaLaudoPeriodoRequest,
  ): Promise<{ sucesso: boolean; mensagem: string; laudos?: any[] }> {
    const integracao = await this.getIntegracao();

    try {
      const client = await this.createSoapClient(integracao);

      const args = {
        codigoCliente: integracao.usuario,
        senhaCliente: integracao.senha,
        dataInicio: request.dataInicio,
        dataFim: request.dataFim,
      };

      const [result] = await client.EnviaLaudoAtendimentoPorPeriodoAsync(args);

      await this.registrarRequisicao(integracao.id, true);

      this.logger.log(
        `EnviaLaudoAtendimentoPorPeriodo executado: ${request.dataInicio} a ${request.dataFim}`,
      );

      return {
        sucesso: true,
        mensagem: 'Laudos do período recuperados com sucesso',
        laudos: result?.laudos || [],
      };
    } catch (error) {
      await this.registrarRequisicao(integracao.id, false);

      this.logger.error(
        `Erro EnviaLaudoAtendimentoPorPeriodo: ${error.message}`,
      );

      return {
        sucesso: false,
        mensagem: `Erro ao buscar laudos do período: ${error.message}`,
      };
    }
  }

  /**
   * 5. CONSULTA STATUS ATENDIMENTO
   * Verifica status de uma requisição
   */
  async consultaStatusAtendimento(
    request: ConsultaStatusRequest,
  ): Promise<{ sucesso: boolean; mensagem: string; status?: string }> {
    const integracao = await this.getIntegracao();

    try {
      const client = await this.createSoapClient(integracao);

      const args = {
        codigoCliente: integracao.usuario,
        senhaCliente: integracao.senha,
        numeroRequisicao: request.numeroRequisicao,
      };

      const [result] = await client.ConsultaStatusAtendimentoAsync(args);

      await this.registrarRequisicao(integracao.id, true);

      this.logger.log(
        `ConsultaStatusAtendimento executado: ${request.numeroRequisicao}`,
      );

      return {
        sucesso: true,
        mensagem: 'Status consultado com sucesso',
        status: result?.status,
      };
    } catch (error) {
      await this.registrarRequisicao(integracao.id, false);

      this.logger.error(`Erro ConsultaStatusAtendimento: ${error.message}`);

      return {
        sucesso: false,
        mensagem: `Erro ao consultar status: ${error.message}`,
      };
    }
  }

  /**
   * 6. LISTA PROCEDIMENTOS PENDENTES
   * Lista exames com resultados pendentes
   */
  async listaProcedimentosPendentes(): Promise<{
    sucesso: boolean;
    mensagem: string;
    procedimentos?: any[];
  }> {
    const integracao = await this.getIntegracao();

    try {
      const client = await this.createSoapClient(integracao);

      const args = {
        codigoCliente: integracao.usuario,
        senhaCliente: integracao.senha,
      };

      const [result] = await client.ListaProcedimentosPendentesAsync(args);

      await this.registrarRequisicao(integracao.id, true);

      this.logger.log('ListaProcedimentosPendentes executado');

      return {
        sucesso: true,
        mensagem: 'Procedimentos pendentes listados com sucesso',
        procedimentos: result?.procedimentos || [],
      };
    } catch (error) {
      await this.registrarRequisicao(integracao.id, false);

      this.logger.error(`Erro ListaProcedimentosPendentes: ${error.message}`);

      return {
        sucesso: false,
        mensagem: `Erro ao listar procedimentos pendentes: ${error.message}`,
      };
    }
  }

  /**
   * 7. CANCELA EXAME
   * Cancela um exame de uma requisição
   */
  async cancelaExame(
    request: CancelaExameRequest,
  ): Promise<{ sucesso: boolean; mensagem: string }> {
    const integracao = await this.getIntegracao();

    try {
      const client = await this.createSoapClient(integracao);

      const args = {
        codigoCliente: integracao.usuario,
        senhaCliente: integracao.senha,
        numeroRequisicao: request.numeroRequisicao,
        codigoExame: request.codigoExame,
        motivo: request.motivo,
      };

      await client.CancelaExameAsync(args);

      await this.registrarRequisicao(integracao.id, true);

      this.logger.log(
        `CancelaExame executado: ${request.numeroRequisicao} - ${request.codigoExame}`,
      );

      return {
        sucesso: true,
        mensagem: 'Exame cancelado com sucesso',
      };
    } catch (error) {
      await this.registrarRequisicao(integracao.id, false);

      this.logger.error(`Erro CancelaExame: ${error.message}`);

      return {
        sucesso: false,
        mensagem: `Erro ao cancelar exame: ${error.message}`,
      };
    }
  }

  /**
   * 8. ENVIA RESULTADO BASE64
   * Busca resultado em formato Base64 (PDF)
   */
  async enviaResultadoBase64(
    numeroRequisicao: string,
  ): Promise<{ sucesso: boolean; mensagem: string; base64?: string }> {
    const integracao = await this.getIntegracao();

    try {
      const client = await this.createSoapClient(integracao);

      const args = {
        codigoCliente: integracao.usuario,
        senhaCliente: integracao.senha,
        numeroRequisicao,
      };

      const [result] = await client.EnviaResultadoBase64Async(args);

      await this.registrarRequisicao(integracao.id, true);

      this.logger.log(`EnviaResultadoBase64 executado: ${numeroRequisicao}`);

      return {
        sucesso: true,
        mensagem: 'Resultado Base64 recuperado com sucesso',
        base64: result?.base64,
      };
    } catch (error) {
      await this.registrarRequisicao(integracao.id, false);

      this.logger.error(`Erro EnviaResultadoBase64: ${error.message}`);

      return {
        sucesso: false,
        mensagem: `Erro ao buscar resultado Base64: ${error.message}`,
      };
    }
  }

  /**
   * 9. RELATÓRIO REQUISIÇÕES ENVIADAS
   * Gera relatório de requisições enviadas
   */
  async relatorioRequisicoesEnviadas(
    dataInicio: string,
    dataFim: string,
  ): Promise<{ sucesso: boolean; mensagem: string; relatorio?: any }> {
    const integracao = await this.getIntegracao();

    try {
      const client = await this.createSoapClient(integracao);

      const args = {
        codigoCliente: integracao.usuario,
        senhaCliente: integracao.senha,
        dataInicio,
        dataFim,
      };

      const [result] = await client.RelatorioRequisicoesEnviadasAsync(args);

      await this.registrarRequisicao(integracao.id, true);

      this.logger.log(
        `RelatorioRequisicoesEnviadas executado: ${dataInicio} a ${dataFim}`,
      );

      return {
        sucesso: true,
        mensagem: 'Relatório gerado com sucesso',
        relatorio: result,
      };
    } catch (error) {
      await this.registrarRequisicao(integracao.id, false);

      this.logger.error(`Erro RelatorioRequisicoesEnviadas: ${error.message}`);

      return {
        sucesso: false,
        mensagem: `Erro ao gerar relatório: ${error.message}`,
      };
    }
  }

  /**
   * 10. CONSULTA RASTREABILIDADE
   * Consulta rastreamento de amostra
   */
  async consultaRastreabilidade(
    numeroRequisicao: string,
  ): Promise<{ sucesso: boolean; mensagem: string; rastreamento?: any }> {
    const integracao = await this.getIntegracao();

    try {
      const client = await this.createSoapClient(integracao);

      const args = {
        codigoCliente: integracao.usuario,
        senhaCliente: integracao.senha,
        numeroRequisicao,
      };

      const [result] = await client.ConsultaRastreabilidadeAsync(args);

      await this.registrarRequisicao(integracao.id, true);

      this.logger.log(`ConsultaRastreabilidade executado: ${numeroRequisicao}`);

      return {
        sucesso: true,
        mensagem: 'Rastreamento consultado com sucesso',
        rastreamento: result,
      };
    } catch (error) {
      await this.registrarRequisicao(integracao.id, false);

      this.logger.error(`Erro ConsultaRastreabilidade: ${error.message}`);

      return {
        sucesso: false,
        mensagem: `Erro ao consultar rastreabilidade: ${error.message}`,
      };
    }
  }

  /**
   * 11. ENVIA AMOSTRAS
   * Envia informações de amostras coletadas para o laboratório
   */
  async enviaAmostras(
    request: EnviaAmostrasRequest,
  ): Promise<{ sucesso: boolean; mensagem: string; protocolo?: string }> {
    const integracao = await this.getIntegracao();

    try {
      const client = await this.createSoapClient(integracao);

      const args = {
        codigoCliente: integracao.usuario,
        senhaCliente: integracao.senha,
        numeroRequisicao: request.numeroRequisicao,
        amostras: request.amostras,
      };

      const [result] = await client.EnviaAmostrasAsync(args);

      await this.registrarRequisicao(integracao.id, true);

      this.logger.log(
        `EnviaAmostras executado: ${request.numeroRequisicao} - ${request.amostras.length} amostras`,
      );

      return {
        sucesso: true,
        mensagem: 'Amostras enviadas com sucesso',
        protocolo: result?.numeroProtocolo,
      };
    } catch (error) {
      await this.registrarRequisicao(integracao.id, false);

      this.logger.error(`Erro EnviaAmostras: ${error.message}`);

      return {
        sucesso: false,
        mensagem: `Erro ao enviar amostras: ${error.message}`,
      };
    }
  }

  /**
   * 12. ENVIA AMOSTRAS PROCEDIMENTOS PENDENTES
   * Envia amostras de procedimentos com coleta pendente
   */
  async enviaAmostrasProcedimentosPendentes(
    request: EnviaAmostrasPendentesRequest,
  ): Promise<{
    sucesso: boolean;
    mensagem: string;
    amostrasPendentes?: any[];
  }> {
    const integracao = await this.getIntegracao();

    try {
      const client = await this.createSoapClient(integracao);

      const args = {
        codigoCliente: integracao.usuario,
        senhaCliente: integracao.senha,
        numeroRequisicao: request.numeroRequisicao,
      };

      const [result] =
        await client.EnviaAmostrasProcedimentosPendentesAsync(args);

      await this.registrarRequisicao(integracao.id, true);

      this.logger.log(
        `EnviaAmostrasProcedimentosPendentes executado: ${request.numeroRequisicao}`,
      );

      return {
        sucesso: true,
        mensagem: 'Amostras pendentes consultadas com sucesso',
        amostrasPendentes: result?.amostrasPendentes || [],
      };
    } catch (error) {
      await this.registrarRequisicao(integracao.id, false);

      this.logger.error(
        `Erro EnviaAmostrasProcedimentosPendentes: ${error.message}`,
      );

      return {
        sucesso: false,
        mensagem: `Erro ao consultar amostras pendentes: ${error.message}`,
      };
    }
  }

  /**
   * 13. ENVIA LOTE RESULTADOS
   * Envia lote de resultados de exames para processamento
   */
  async enviaLoteResultados(
    request: EnviaLoteResultadosRequest,
  ): Promise<{ sucesso: boolean; mensagem: string; protocolo?: string }> {
    const integracao = await this.getIntegracao();

    try {
      const client = await this.createSoapClient(integracao);

      const args = {
        codigoCliente: integracao.usuario,
        senhaCliente: integracao.senha,
        numeroLote: request.numeroLote,
        resultados: request.resultados,
      };

      const [result] = await client.EnviaLoteResultadosAsync(args);

      await this.registrarRequisicao(integracao.id, true);

      this.logger.log(
        `EnviaLoteResultados executado: ${request.numeroLote} - ${request.resultados.length} resultados`,
      );

      return {
        sucesso: true,
        mensagem: 'Lote de resultados enviado com sucesso',
        protocolo: result?.numeroProtocolo,
      };
    } catch (error) {
      await this.registrarRequisicao(integracao.id, false);

      this.logger.error(`Erro EnviaLoteResultados: ${error.message}`);

      return {
        sucesso: false,
        mensagem: `Erro ao enviar lote de resultados: ${error.message}`,
      };
    }
  }

  /**
   * 14. CANCELA AMOSTRA
   * Cancela uma amostra específica de uma requisição
   */
  async cancelaAmostra(
    request: CancelaAmostraRequest,
  ): Promise<{ sucesso: boolean; mensagem: string }> {
    const integracao = await this.getIntegracao();

    try {
      const client = await this.createSoapClient(integracao);

      const args = {
        codigoCliente: integracao.usuario,
        senhaCliente: integracao.senha,
        numeroRequisicao: request.numeroRequisicao,
        codigoAmostra: request.codigoAmostra,
        motivo: request.motivo,
      };

      await client.CancelaAmostraAsync(args);

      await this.registrarRequisicao(integracao.id, true);

      this.logger.log(
        `CancelaAmostra executado: ${request.numeroRequisicao} - ${request.codigoAmostra}`,
      );

      return {
        sucesso: true,
        mensagem: 'Amostra cancelada com sucesso',
      };
    } catch (error) {
      await this.registrarRequisicao(integracao.id, false);

      this.logger.error(`Erro CancelaAmostra: ${error.message}`);

      return {
        sucesso: false,
        mensagem: `Erro ao cancelar amostra: ${error.message}`,
      };
    }
  }

  /**
   * 15. CONSULTA PENDÊNCIA TÉCNICA
   * Consulta pendências técnicas de uma requisição
   */
  async consultaPendenciaTecnica(
    request: ConsultaPendenciaTecnicaRequest,
  ): Promise<{
    sucesso: boolean;
    mensagem: string;
    pendencias?: any[];
  }> {
    const integracao = await this.getIntegracao();

    try {
      const client = await this.createSoapClient(integracao);

      const args = {
        codigoCliente: integracao.usuario,
        senhaCliente: integracao.senha,
        numeroRequisicao: request.numeroRequisicao,
      };

      const [result] = await client.ConsultaPendenciaTecnicaAsync(args);

      await this.registrarRequisicao(integracao.id, true);

      this.logger.log(
        `ConsultaPendenciaTecnica executado: ${request.numeroRequisicao}`,
      );

      return {
        sucesso: true,
        mensagem: 'Pendências técnicas consultadas com sucesso',
        pendencias: result?.pendencias || [],
      };
    } catch (error) {
      await this.registrarRequisicao(integracao.id, false);

      this.logger.error(`Erro ConsultaPendenciaTecnica: ${error.message}`);

      return {
        sucesso: false,
        mensagem: `Erro ao consultar pendências técnicas: ${error.message}`,
      };
    }
  }

  /**
   * 16. GRUPO FRACIONAMENTO
   * Gerencia grupos de fracionamento de exames
   */
  async grupoFracionamento(
    request: GrupoFracionamentoRequest,
  ): Promise<{ sucesso: boolean; mensagem: string; grupo?: any }> {
    const integracao = await this.getIntegracao();

    try {
      const client = await this.createSoapClient(integracao);

      const args = {
        codigoCliente: integracao.usuario,
        senhaCliente: integracao.senha,
        codigoGrupo: request.codigoGrupo,
        descricao: request.descricao,
        exames: request.exames,
      };

      const [result] = await client.GrupoFracionamentoAsync(args);

      await this.registrarRequisicao(integracao.id, true);

      this.logger.log(
        `GrupoFracionamento executado: ${request.codigoGrupo} - ${request.exames.length} exames`,
      );

      return {
        sucesso: true,
        mensagem: 'Grupo de fracionamento processado com sucesso',
        grupo: result,
      };
    } catch (error) {
      await this.registrarRequisicao(integracao.id, false);

      this.logger.error(`Erro GrupoFracionamento: ${error.message}`);

      return {
        sucesso: false,
        mensagem: `Erro ao processar grupo de fracionamento: ${error.message}`,
      };
    }
  }

  /**
   * TESTAR CONEXÃO
   * Valida credenciais e conectividade com o webservice
   */
  async testarConexao(): Promise<{
    sucesso: boolean;
    mensagem: string;
    detalhes?: any;
  }> {
    const integracao = await this.getIntegracao();

    try {
      const client = await this.createSoapClient(integracao);

      // Tenta listar procedimentos pendentes para validar conexão
      const args = {
        codigoCliente: integracao.usuario,
        senhaCliente: integracao.senha,
      };

      await client.ListaProcedimentosPendentesAsync(args);

      this.logger.log('Teste de conexão bem-sucedido');

      return {
        sucesso: true,
        mensagem: 'Conexão com Hermes Pardini estabelecida com sucesso',
        detalhes: {
          url: integracao.urlBase,
          usuario: integracao.usuario,
          ambiente: integracao.configuracoesAdicionais?.ambiente || 'producao',
        },
      };
    } catch (error) {
      this.logger.error(`Erro ao testar conexão: ${error.message}`);

      return {
        sucesso: false,
        mensagem: `Falha ao conectar com Hermes Pardini: ${error.message}`,
      };
    }
  }
}
