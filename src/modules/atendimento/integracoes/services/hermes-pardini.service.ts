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
