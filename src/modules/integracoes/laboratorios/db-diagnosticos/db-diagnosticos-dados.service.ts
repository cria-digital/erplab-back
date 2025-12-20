import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as soap from 'soap';
import { SoapClientService } from '../../soap/soap-client.service';
import {
  DadosDbConfig,
  DadosDbResponse,
  DadosDbTokenResponse,
  DadosDbProcedimentoWeb,
  DadosDbExameConfigParsed,
  DadosDbInformacoesExameParsed,
} from './interfaces/db-diagnosticos-dados.interface';
import {
  FiltraProcedimentoWebDto,
  BuscaExamesConfigDto,
  GetInformacoesExameDto,
  GetLaudoProcedimentoDto,
  GetLaudoFaixaEtariaDto,
  DownloadMascaraLaudoDto,
} from './dto/db-diagnosticos-dados.dto';
import { IntegracaoConfigService } from '../../../atendimento/integracoes/services/integracao-config.service';

/**
 * Cache de clientes SOAP e tokens por tenant
 */
interface TenantDadosDbCache {
  client: soap.Client;
  config: DadosDbConfig;
  token?: string;
  tokenExpiry?: Date;
  createdAt: Date;
}

/**
 * Service para integração com API Dados DB (Guia de Exames)
 *
 * Esta API fornece:
 * - Consulta de exames por nome
 * - Informações detalhadas de exames (preparo, prazo, material)
 * - Configuração de exames
 * - Download de máscaras de laudo
 *
 * WSDL Produção: https://wsmc.diagnosticosdobrasil.com.br/dadosdb/wsrvDadosDB.DADOSDB.svc?wsdl
 * WSDL Desenvolvimento: https://desenv.diagnosticosdobrasil.com.br/MXNETD/wsrvDadosDB.DADOSDB.svc?wsdl
 */
@Injectable()
export class DbDiagnosticosDadosService {
  private readonly logger = new Logger(DbDiagnosticosDadosService.name);

  /** Cache de clientes SOAP e tokens por tenant */
  private cache: Map<string, TenantDadosDbCache> = new Map();

  /** Tempo de vida do cache do cliente em ms (30 minutos) */
  private readonly CLIENT_CACHE_TTL_MS = 30 * 60 * 1000;

  /** Tempo de vida do token em ms (55 minutos - margem de segurança) */
  private readonly TOKEN_TTL_MS = 55 * 60 * 1000;

  /** Configuração fallback (do .env) */
  private fallbackConfig: DadosDbConfig;

  constructor(
    private readonly soapClient: SoapClientService,
    private readonly configService: ConfigService,
    private readonly integracaoConfigService: IntegracaoConfigService,
  ) {
    // Configuração fallback do .env
    this.fallbackConfig = {
      usuario: this.configService.get<string>(
        'DB_DIAGNOSTICOS_DADOS_USUARIO',
        '',
      ),
      senha: this.configService.get<string>('DB_DIAGNOSTICOS_DADOS_SENHA', ''),
      wsdlUrl: this.configService.get<string>(
        'DB_DIAGNOSTICOS_DADOS_WSDL_URL',
        'https://wsmc.diagnosticosdobrasil.com.br/dadosdb/wsrvDadosDB.DADOSDB.svc?wsdl',
      ),
      timeout: this.configService.get<number>(
        'DB_DIAGNOSTICOS_DADOS_TIMEOUT',
        60000,
      ),
    };
  }

  /**
   * Obtém configuração para um tenant específico
   */
  private async getConfigForTenant(tenantId?: string): Promise<DadosDbConfig> {
    if (!tenantId) {
      return this.fallbackConfig;
    }

    // Verifica cache
    const cached = this.cache.get(tenantId);
    if (
      cached &&
      Date.now() - cached.createdAt.getTime() < this.CLIENT_CACHE_TTL_MS
    ) {
      return cached.config;
    }

    // Busca configuração do banco
    const integracaoConfig =
      await this.integracaoConfigService.buscarConfiguracao({
        templateSlug: 'db-diagnosticos-dados',
        tenantId,
        throwIfNotFound: false,
      });

    if (!integracaoConfig) {
      this.logger.warn(
        `Integração db-diagnosticos-dados não configurada para tenant ${tenantId}, usando fallback`,
      );
      return this.fallbackConfig;
    }

    // Extrai valores da configuração
    const valores = integracaoConfig.valores || {};
    return {
      usuario:
        (valores['usuario'] as string) ||
        (valores['codigo_laboratorio'] as string) ||
        this.fallbackConfig.usuario,
      senha:
        (valores['senha'] as string) ||
        (valores['senha_integracao'] as string) ||
        this.fallbackConfig.senha,
      wsdlUrl:
        (valores['wsdl_url_dados'] as string) ||
        (valores['wsdl_dados_db'] as string) ||
        this.fallbackConfig.wsdlUrl,
      timeout:
        Number(valores['timeout']) || this.fallbackConfig.timeout || 60000,
    };
  }

  /**
   * Obtém ou cria cliente SOAP para um tenant
   */
  private async getClient(tenantId?: string): Promise<{
    client: soap.Client;
    config: DadosDbConfig;
    token?: string;
  }> {
    const cacheKey = tenantId || '__fallback__';

    // Verifica cache
    const cached = this.cache.get(cacheKey);
    if (
      cached &&
      Date.now() - cached.createdAt.getTime() < this.CLIENT_CACHE_TTL_MS
    ) {
      // Verifica se token ainda é válido
      if (
        cached.token &&
        cached.tokenExpiry &&
        Date.now() < cached.tokenExpiry.getTime()
      ) {
        return {
          client: cached.client,
          config: cached.config,
          token: cached.token,
        };
      }
      return { client: cached.client, config: cached.config };
    }

    // Obtém configuração
    const config = await this.getConfigForTenant(tenantId);

    // Cria cliente SOAP
    const client = await this.soapClient.criarCliente({
      wsdl: config.wsdlUrl,
      timeout: config.timeout,
    });

    // Armazena no cache
    this.cache.set(cacheKey, {
      client,
      config,
      createdAt: new Date(),
    });

    return { client, config };
  }

  /**
   * Armazena token no cache
   */
  private setToken(tenantId: string | undefined, token: string): void {
    const cacheKey = tenantId || '__fallback__';
    const cached = this.cache.get(cacheKey);
    if (cached) {
      cached.token = token;
      cached.tokenExpiry = new Date(Date.now() + this.TOKEN_TTL_MS);
    }
  }

  /**
   * Chama método SOAP
   */
  private async callSoapMethod<T>(
    metodo: string,
    params: any,
    tenantId?: string,
  ): Promise<T> {
    const { client } = await this.getClient(tenantId);
    const response = await this.soapClient.chamarMetodo<T>(
      client,
      metodo,
      params,
    );

    if (!response.sucesso) {
      throw new Error(response.erro || 'Erro desconhecido na chamada SOAP');
    }

    return response.dados as T;
  }

  // ============================================
  // MÉTODOS PÚBLICOS DA API
  // ============================================

  /**
   * Gera token de autenticação
   *
   * O token deve ser gerado antes de qualquer outra chamada.
   * Usa o mesmo usuário e senha do Laudos Online.
   */
  async getToken(
    usuario: string,
    senha: string,
    tenantId?: string,
  ): Promise<DadosDbResponse<DadosDbTokenResponse>> {
    this.logger.log(
      `Gerando token para usuário: ${usuario} (tenant: ${tenantId || 'fallback'})`,
    );

    try {
      const params = {
        Senha: senha,
        Token: '',
        Usuario: usuario,
      };

      const result = await this.callSoapMethod<any>(
        'GetToken',
        params,
        tenantId,
      );

      const response = result?.GetTokenResponse || result;

      if (response?.Status === 0 && response?.token) {
        // Armazena token no cache
        this.setToken(tenantId, response.token);

        return {
          sucesso: true,
          dados: {
            Status: response.Status,
            Token: response.token,
            TipoUsuario: response.tipoUsuario,
            Message: response.Message,
          },
        };
      }

      return {
        sucesso: false,
        erro: response?.Message || 'Erro ao gerar token',
        status: response?.Status,
      };
    } catch (error) {
      this.logger.error(`Erro ao gerar token: ${error.message}`);
      return {
        sucesso: false,
        erro: error.message,
      };
    }
  }

  /**
   * Obtém token válido (gera novo se necessário)
   */
  private async ensureToken(
    usuario: string,
    senha: string,
    tenantId?: string,
  ): Promise<string> {
    const { token } = await this.getClient(tenantId);

    if (token) {
      return token;
    }

    // Gera novo token
    const result = await this.getToken(usuario, senha, tenantId);
    if (!result.sucesso || !result.dados?.Token) {
      throw new Error(result.erro || 'Falha ao obter token');
    }

    return result.dados.Token;
  }

  /**
   * Busca procedimentos/exames por nome
   *
   * Use este método para pesquisar exames disponíveis.
   * Retorna lista de procedimentos com código, descrição, material, etc.
   */
  async filtraProcedimentoWeb(
    dto: FiltraProcedimentoWebDto,
    tenantId?: string,
  ): Promise<DadosDbResponse<DadosDbProcedimentoWeb[]>> {
    this.logger.log(
      `Buscando procedimentos: "${dto.filtroNome}" (tenant: ${tenantId || 'fallback'})`,
    );

    try {
      const config = await this.getConfigForTenant(tenantId);
      const usuario = dto.usuario || config.usuario;
      const senha = dto.senha || config.senha;

      if (!usuario || !senha) {
        return {
          sucesso: false,
          erro: 'Credenciais não configuradas. Configure usuario e senha.',
        };
      }

      const token = await this.ensureToken(usuario, senha, tenantId);

      const params = {
        Senha: senha,
        Token: token,
        Usuario: usuario,
        filtroNome: dto.filtroNome,
        origemPadrao: dto.origemPadrao || '',
      };

      const result = await this.callSoapMethod<any>(
        'FiltraProcedimentoWeb',
        params,
        tenantId,
      );

      const response = result?.FiltraProcedimentoWebResponse || result;

      if (response?.Status === 0 || response?.Status === '0') {
        const procedimentos = this.parseProcedimentosWeb(
          response?.procedimentosWeb,
        );

        return {
          sucesso: true,
          dados: procedimentos,
          message: `${procedimentos.length} procedimento(s) encontrado(s)`,
        };
      }

      return {
        sucesso: false,
        erro: response?.Message || 'Nenhum procedimento encontrado',
        status: response?.Status,
      };
    } catch (error) {
      this.logger.error(`Erro ao buscar procedimentos: ${error.message}`);
      return {
        sucesso: false,
        erro: error.message,
      };
    }
  }

  /**
   * Busca configuração de exame conforme tabela do DB
   *
   * Retorna informações detalhadas do exame incluindo parâmetros
   * e valores de referência.
   */
  async buscaExamesConfig(
    dto: BuscaExamesConfigDto,
    tenantId?: string,
  ): Promise<DadosDbResponse<DadosDbExameConfigParsed>> {
    this.logger.log(
      `Buscando config do exame: "${dto.procedimento}" (tenant: ${tenantId || 'fallback'})`,
    );

    try {
      const config = await this.getConfigForTenant(tenantId);
      const usuario = dto.usuario || config.usuario;
      const senha = dto.senha || config.senha;

      if (!usuario || !senha) {
        return {
          sucesso: false,
          erro: 'Credenciais não configuradas. Configure usuario e senha.',
        };
      }

      const token = await this.ensureToken(usuario, senha, tenantId);

      const params = {
        request: {
          Usuario: usuario,
          Senha: senha,
          Token: token,
          Procedimento: dto.procedimento,
        },
      };

      const result = await this.callSoapMethod<any>(
        'BuscaExamesConfig',
        params,
        tenantId,
      );

      const response =
        result?.BuscaExamesConfigResponse?.BuscaExamesConfigResult || result;

      if (response?.Status === 0 || response?.Status === '0') {
        const exameConfig = this.parseExameConfigXml(response?.XmlExamesConfig);

        return {
          sucesso: true,
          dados: exameConfig,
        };
      }

      return {
        sucesso: false,
        erro: response?.Message || 'Exame não encontrado',
        status: response?.Status,
      };
    } catch (error) {
      this.logger.error(`Erro ao buscar config do exame: ${error.message}`);
      return {
        sucesso: false,
        erro: error.message,
      };
    }
  }

  /**
   * Obtém informações detalhadas de um exame
   *
   * Este é o método principal para consultar:
   * - Preparo do paciente
   * - Prazo de entrega
   * - Material necessário
   * - Valores de referência
   * - Metodologia
   */
  async getInformacoesExame(
    dto: GetInformacoesExameDto,
    tenantId?: string,
  ): Promise<DadosDbResponse<DadosDbInformacoesExameParsed>> {
    this.logger.log(
      `Buscando informações do exame: "${dto.procedimento}" (tenant: ${tenantId || 'fallback'})`,
    );

    try {
      const config = await this.getConfigForTenant(tenantId);
      const usuario = dto.usuario || config.usuario;
      const senha = dto.senha || config.senha;

      if (!usuario || !senha) {
        return {
          sucesso: false,
          erro: 'Credenciais não configuradas. Configure usuario e senha.',
        };
      }

      const token = await this.ensureToken(usuario, senha, tenantId);

      const params = {
        request: {
          Usuario: usuario,
          Senha: senha,
          Token: token,
          Procedimento: dto.procedimento,
        },
      };

      const result = await this.callSoapMethod<any>(
        'GetInformacoesExame',
        params,
        tenantId,
      );

      const response =
        result?.GetInformacoesExameResponse?.GetInformacoesExameResult ||
        result;

      if (response?.Status === 0 || response?.Status === '0') {
        const informacoes = this.parseInformacoesExameXml(
          response?.XmlInformacoesExame,
        );

        return {
          sucesso: true,
          dados: informacoes,
        };
      }

      return {
        sucesso: false,
        erro: response?.Message || 'Exame não encontrado',
        status: response?.Status,
      };
    } catch (error) {
      this.logger.error(
        `Erro ao buscar informações do exame: ${error.message}`,
      );
      return {
        sucesso: false,
        erro: error.message,
      };
    }
  }

  /**
   * Obtém versão do laudo de um procedimento
   */
  async getLaudoProcedimento(
    dto: GetLaudoProcedimentoDto,
    tenantId?: string,
  ): Promise<DadosDbResponse<string[]>> {
    this.logger.log(
      `Buscando versão do laudo: "${dto.codigoProcedimento}" (tenant: ${tenantId || 'fallback'})`,
    );

    try {
      const config = await this.getConfigForTenant(tenantId);
      const usuario = dto.usuario || config.usuario;
      const senha = dto.senha || config.senha;

      if (!usuario || !senha) {
        return {
          sucesso: false,
          erro: 'Credenciais não configuradas. Configure usuario e senha.',
        };
      }

      const token = await this.ensureToken(usuario, senha, tenantId);

      const params = {
        Senha: senha,
        Token: token,
        Usuario: usuario,
        codigoProcedimento: dto.codigoProcedimento,
      };

      const result = await this.callSoapMethod<any>(
        'GetLaudoProcedimento',
        params,
        tenantId,
      );

      const response = result?.GetLaudoProcedimentoResponse || result;

      if (response?.Status === 0 || response?.Status === '0') {
        const laudos = this.parseArrayOfString(response?.laudosAtivos);

        return {
          sucesso: true,
          dados: laudos,
          message: `${laudos.length} versão(ões) de laudo encontrada(s)`,
        };
      }

      return {
        sucesso: false,
        erro: response?.Message || 'Laudo não encontrado',
        status: response?.Status,
      };
    } catch (error) {
      this.logger.error(`Erro ao buscar versão do laudo: ${error.message}`);
      return {
        sucesso: false,
        erro: error.message,
      };
    }
  }

  /**
   * Obtém faixas etárias/sexo para um laudo
   */
  async getLaudoFaixaEtariaSexo(
    dto: GetLaudoFaixaEtariaDto,
    tenantId?: string,
  ): Promise<DadosDbResponse<string[]>> {
    this.logger.log(
      `Buscando faixas etárias do laudo: "${dto.laudo}" (tenant: ${tenantId || 'fallback'})`,
    );

    try {
      const config = await this.getConfigForTenant(tenantId);
      const usuario = dto.usuario || config.usuario;
      const senha = dto.senha || config.senha;

      if (!usuario || !senha) {
        return {
          sucesso: false,
          erro: 'Credenciais não configuradas. Configure usuario e senha.',
        };
      }

      const token = await this.ensureToken(usuario, senha, tenantId);

      const params = {
        Senha: senha,
        Token: token,
        Usuario: usuario,
        laudo: dto.laudo,
      };

      const result = await this.callSoapMethod<any>(
        'GetLaudoFaixaEtariaSexo',
        params,
        tenantId,
      );

      const response = result?.GetLaudoFaixaEtariaSexoResponse || result;

      if (response?.Status === 0 || response?.Status === '0') {
        const faixas = this.parseArrayOfString(response?.faixaEtariaSexo);

        return {
          sucesso: true,
          dados: faixas,
          message: `${faixas.length} faixa(s) encontrada(s)`,
        };
      }

      return {
        sucesso: false,
        erro: response?.Message || 'Faixas não encontradas',
        status: response?.Status,
      };
    } catch (error) {
      this.logger.error(`Erro ao buscar faixas etárias: ${error.message}`);
      return {
        sucesso: false,
        erro: error.message,
      };
    }
  }

  /**
   * Download da máscara do laudo em PDF (Base64)
   */
  async downloadMascaraLaudoPdf(
    dto: DownloadMascaraLaudoDto,
    tenantId?: string,
  ): Promise<DadosDbResponse<string>> {
    this.logger.log(
      `Baixando máscara do laudo: "${dto.laudo}" - "${dto.faixaReferenciaSexo}" (tenant: ${tenantId || 'fallback'})`,
    );

    try {
      const config = await this.getConfigForTenant(tenantId);
      const usuario = dto.usuario || config.usuario;
      const senha = dto.senha || config.senha;

      if (!usuario || !senha) {
        return {
          sucesso: false,
          erro: 'Credenciais não configuradas. Configure usuario e senha.',
        };
      }

      const token = await this.ensureToken(usuario, senha, tenantId);

      const params = {
        FaixaReferenciaSexo: dto.faixaReferenciaSexo,
        Senha: senha,
        Token: token,
        Usuario: usuario,
        laudo: dto.laudo,
      };

      const result = await this.callSoapMethod<any>(
        'DownloadMascaraLaudoPDF',
        params,
        tenantId,
      );

      const response = result?.DownloadMascaraLaudoPDFResponse || result;

      if (response?.Status === 0 || response?.Status === '0') {
        return {
          sucesso: true,
          dados: response?.mascaraLaudo,
          message: 'Máscara do laudo obtida com sucesso',
        };
      }

      return {
        sucesso: false,
        erro: response?.Message || 'Máscara não encontrada',
        status: response?.Status,
      };
    } catch (error) {
      this.logger.error(`Erro ao baixar máscara do laudo: ${error.message}`);
      return {
        sucesso: false,
        erro: error.message,
      };
    }
  }

  // ============================================
  // MÉTODOS DE PARSING
  // ============================================

  private parseProcedimentosWeb(data: any): DadosDbProcedimentoWeb[] {
    if (!data) return [];

    const items = Array.isArray(data?.ProcedimentoWeb)
      ? data.ProcedimentoWeb
      : data?.ProcedimentoWeb
        ? [data.ProcedimentoWeb]
        : Array.isArray(data)
          ? data
          : [];

    return items.map((p: any) => ({
      Codigo: p.Codigo || '',
      Descricao: p.Descricao || '',
      Restricao: p.Restricao,
      RegiaoColetaObrigatoria: p.RegiaoColetaObrigatoria === 'true',
      RegiaoColetaTextoLivre: p.RegiaoColetaTextoLivre === 'true',
      ExibeProcedimentoNet: p.ExibeProcedimentoNET === 'true',
      RegiaoColetaProcedimento: this.parseArrayOfString(
        p.RegiaoColetaProcedimento,
      ),
      TemRegiaoColeta: p.TemRegiaoColeta === 'true',
      PossuiInstrucaoPreparo: p.PossuiInstrucaoPreparo === 'true',
      DataHoraColetaMaterial: p.DataHoraColetaMaterial,
      Nome: p.Nome,
      Material: p.Material,
      Selecionado: p.Selecionado === 'true',
      Meios_CondTransporte: p.Meios_CondTransporte,
    }));
  }

  private parseArrayOfString(data: any): string[] {
    if (!data) return [];
    if (Array.isArray(data)) return data.filter((s) => s);
    if (data.string) {
      return Array.isArray(data.string)
        ? data.string.filter((s: any) => s)
        : [data.string];
    }
    return [];
  }

  private parseExameConfigXml(
    xml: string | null,
  ): DadosDbExameConfigParsed | null {
    if (!xml) return null;

    try {
      // Remove CDATA wrapper se presente
      const cleanXml = xml
        .replace(/<!\[CDATA\[/g, '')
        .replace(/\]\]>/g, '')
        .trim();

      // Parse básico do XML
      const getValue = (tag: string): string => {
        const match = cleanXml.match(
          new RegExp(`<${tag}>([^<]*)</${tag}>`, 'i'),
        );
        return match ? match[1].trim() : '';
      };

      return {
        codigo: getValue('CD_EXAME'),
        nome: getValue('DS_EXAME'),
        sinonimo: getValue('SINONIMO') || undefined,
        cbhpm: getValue('CBHPM') || undefined,
        metodologia: getValue('METODOLOGIA') || undefined,
        material: getValue('MATERIAL') || undefined,
        volumeObrigatorio:
          getValue('VOLUME_OBRIGATORIO')?.toUpperCase() === 'SIM',
        alturaObrigatorio:
          getValue('ALTURA_OBRIGATORIO')?.toUpperCase() === 'SIM',
        pesoObrigatorio: getValue('PESO_OBRIGATORIO')?.toUpperCase() === 'SIM',
        dataAlteracaoLaudo: getValue('DATA_ALTERACAO_LAUDO') || undefined,
        parametros: this.parseParametrosFromXml(cleanXml),
      };
    } catch (error) {
      this.logger.warn(`Erro ao parsear XML de config: ${error.message}`);
      return null;
    }
  }

  private parseParametrosFromXml(xml: string): any[] {
    const parametros: any[] = [];

    try {
      // Encontra todos os blocos <Parametro>
      const parametroRegex = /<Parametro[^>]*>([\s\S]*?)<\/Parametro>/gi;
      let match;

      while ((match = parametroRegex.exec(xml)) !== null) {
        const block = match[1];

        const getValue = (tag: string): string => {
          const m = block.match(new RegExp(`${tag}="([^"]*)"`, 'i'));
          return m ? m[1].trim() : '';
        };

        parametros.push({
          sequencia: parseInt(getValue('SEQUENCIA')) || 0,
          codigo: getValue('CD_PARAMETRO'),
          descricao: getValue('DS_PARAMETRO'),
          unidade: getValue('UNIDADE') || undefined,
          casasDecimais: parseInt(getValue('DECIMAL')) || 0,
          tipo: getValue('TIPO') || undefined,
          valoresReferencia: [],
        });
      }
    } catch (error) {
      this.logger.warn(`Erro ao parsear parâmetros: ${error.message}`);
    }

    return parametros;
  }

  private parseInformacoesExameXml(
    xml: string | null,
  ): DadosDbInformacoesExameParsed | null {
    if (!xml) return null;

    try {
      // Remove CDATA wrapper se presente
      const cleanXml = xml
        .replace(/<!\[CDATA\[/g, '')
        .replace(/\]\]>/g, '')
        .trim();

      const getValue = (tag: string): string => {
        const match = cleanXml.match(
          new RegExp(`<${tag}>([^<]*)</${tag}>`, 'i'),
        );
        return match ? match[1].trim() : '';
      };

      // Parse instruções de preparo
      const preparoInstrucoes: string[] = [];
      const coletaInstrucoes: string[] = [];

      const instrucaoRegex =
        /<Instrucao[^>]*TipoInstrucao="([^"]*)"[^>]*>[\s\S]*?<Descricao>([^<]*)<\/Descricao>/gi;
      let match;

      while ((match = instrucaoRegex.exec(cleanXml)) !== null) {
        const tipo = match[1];
        const descricao = match[2].trim();
        if (tipo.toLowerCase().includes('preparo')) {
          preparoInstrucoes.push(descricao);
        } else if (tipo.toLowerCase().includes('coleta')) {
          coletaInstrucoes.push(descricao);
        }
      }

      return {
        codigo: getValue('CodigoProcedimento'),
        nome: getValue('NomeProcedimento'),
        sinonimos: getValue('Sinonimos') || undefined,
        codigoMaterial: getValue('CodigoMaterial') || undefined,
        nomeMaterial: getValue('NomeMaterial') || undefined,
        interpretacao: getValue('Interpretacao') || undefined,
        preco: parseFloat(getValue('PrecoProcedimento')) || undefined,
        regioesColeta: [],
        valoresReferencia: this.parseValoresReferenciaFromXml(cleanXml),
        producao: {
          volumeMinimo: getValue('VolumeMinimo') || undefined,
          prazo: getValue('Prazo') || undefined,
          realizacao: getValue('Realizacao') || undefined,
          meiosColeta: getValue('MeiosColeta') || undefined,
        },
        instrucoes: {
          preparo: preparoInstrucoes.length > 0 ? preparoInstrucoes : undefined,
          coleta: coletaInstrucoes.length > 0 ? coletaInstrucoes : undefined,
        },
      };
    } catch (error) {
      this.logger.warn(`Erro ao parsear XML de informações: ${error.message}`);
      return null;
    }
  }

  private parseValoresReferenciaFromXml(xml: string): any[] {
    const valores: any[] = [];

    try {
      const vrRegex =
        /<ValorReferencia>[\s\S]*?<Metodo>([^<]*)<\/Metodo>[\s\S]*?<Parametro>([^<]*)<\/Parametro>[\s\S]*?<Sexo[^>]*\/>[\s\S]*?<IdadeInferior[^>]*\/>[\s\S]*?<IdadeSuperior[^>]*\/>[\s\S]*?<ValorReferencia>([^<]*)<\/ValorReferencia>/gi;
      let match;

      while ((match = vrRegex.exec(xml)) !== null) {
        valores.push({
          metodo: match[1].trim(),
          parametro: match[2].trim(),
          valorReferencia: match[3].trim(),
        });
      }
    } catch (error) {
      this.logger.warn(
        `Erro ao parsear valores de referência: ${error.message}`,
      );
    }

    return valores;
  }

  // ============================================
  // MÉTODOS UTILITÁRIOS
  // ============================================

  /**
   * Verifica saúde da integração
   */
  async healthCheck(tenantId?: string): Promise<{
    sucesso: boolean;
    status: string;
    endpoint: string;
    usuario: string;
    tenantId?: string;
    detalhes?: any;
    erro?: string;
  }> {
    try {
      const config = await this.getConfigForTenant(tenantId);

      if (!config.usuario || !config.senha) {
        return {
          sucesso: false,
          status: 'configuracao_incompleta',
          endpoint: config.wsdlUrl,
          usuario: config.usuario || 'não configurado',
          tenantId,
          erro: 'Credenciais não configuradas',
        };
      }

      const { client } = await this.getClient(tenantId);
      const descricao = client.describe();
      const servicos = Object.keys(descricao);

      return {
        sucesso: true,
        status: 'conectado',
        endpoint: config.wsdlUrl,
        usuario: config.usuario,
        tenantId,
        detalhes: {
          servicosDisponiveis: servicos,
          timeout: config.timeout,
        },
      };
    } catch (error) {
      this.logger.error(`Health check falhou: ${error.message}`);
      return {
        sucesso: false,
        status: 'erro_conexao',
        endpoint: this.fallbackConfig.wsdlUrl,
        usuario: this.fallbackConfig.usuario || 'não configurado',
        tenantId,
        erro: error.message,
      };
    }
  }

  /**
   * Descreve o WSDL para debug
   */
  async describeWsdl(tenantId?: string): Promise<any> {
    try {
      const { client } = await this.getClient(tenantId);
      return client.describe();
    } catch (error) {
      this.logger.error(`Erro ao descrever WSDL: ${error.message}`);
      return { erro: error.message };
    }
  }

  /**
   * Limpa cache de clientes e tokens
   */
  clearCache(tenantId?: string): void {
    if (tenantId) {
      this.cache.delete(tenantId);
      this.logger.log(`Cache limpo para tenant ${tenantId}`);
    } else {
      this.cache.clear();
      this.logger.log('Cache de todos os tenants limpo');
    }
  }
}
