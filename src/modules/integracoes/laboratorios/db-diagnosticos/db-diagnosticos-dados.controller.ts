import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { DbDiagnosticosDadosService } from './db-diagnosticos-dados.service';
import {
  GetTokenDadosDbDto,
  FiltraProcedimentoWebDto,
  BuscaExamesConfigDto,
  GetInformacoesExameDto,
  GetLaudoProcedimentoDto,
  GetLaudoFaixaEtariaDto,
  DownloadMascaraLaudoDto,
  TokenResponseDto,
  ProcedimentoWebResponseDto,
  InformacoesExameResponseDto,
  ExameConfigResponseDto,
} from './dto/db-diagnosticos-dados.dto';

/**
 * Controller para API Dados DB (Guia de Exames)
 *
 * Esta API fornece consulta de informações de exames:
 * - Busca de exames por nome
 * - Informações detalhadas (preparo, prazo, material)
 * - Configurações de exames
 * - Download de máscaras de laudo
 *
 * DIFERENTE da API de Protocolo (dbsync) que gerencia pedidos e resultados.
 *
 * WSDL Produção: https://wsmc.diagnosticosdobrasil.com.br/dadosdb/wsrvDadosDB.DADOSDB.svc?wsdl
 */
@ApiTags('Integrações - DB Diagnósticos (Guia de Exames)')
@ApiBearerAuth()
@Controller('integracoes/db-diagnosticos/guia-exames')
export class DbDiagnosticosDadosController {
  constructor(
    private readonly dbDiagnosticosDadosService: DbDiagnosticosDadosService,
  ) {}

  // ============================================
  // AUTENTICAÇÃO
  // ============================================

  @Post('token')
  @ApiOperation({
    summary: 'Gerar token de autenticação',
    description:
      'Gera um token para autenticação na API Dados DB. Use as mesmas credenciais do Laudos Online.',
  })
  @ApiResponse({
    status: 201,
    description: 'Token gerado com sucesso',
    type: TokenResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Credenciais inválidas' })
  async getToken(@Body() dto: GetTokenDadosDbDto) {
    const result = await this.dbDiagnosticosDadosService.getToken(
      dto.usuario,
      dto.senha,
    );

    return {
      sucesso: result.sucesso,
      erro: result.erro,
      token: result.dados?.Token,
      tipoUsuario: result.dados?.TipoUsuario,
      status: result.dados?.Status,
      message: result.dados?.Message,
    };
  }

  // ============================================
  // CONSULTA DE EXAMES
  // ============================================

  @Post('buscar')
  @ApiOperation({
    summary: 'Buscar exames por nome',
    description:
      'Pesquisa exames pelo nome. Retorna lista de procedimentos com código, descrição, material e se possui preparo.',
  })
  @ApiResponse({
    status: 200,
    description: 'Exames encontrados',
    type: [ProcedimentoWebResponseDto],
  })
  @ApiResponse({ status: 400, description: 'Filtro muito curto' })
  async buscarExames(@Body() dto: FiltraProcedimentoWebDto) {
    const result =
      await this.dbDiagnosticosDadosService.filtraProcedimentoWeb(dto);

    return {
      sucesso: result.sucesso,
      erro: result.erro,
      message: result.message,
      total: result.dados?.length || 0,
      exames: result.dados?.map((p) => ({
        codigo: p.Codigo,
        descricao: p.Descricao,
        material: p.Material,
        possuiPreparo: p.PossuiInstrucaoPreparo,
        temRegiaoColeta: p.TemRegiaoColeta,
        regiaoColetaObrigatoria: p.RegiaoColetaObrigatoria,
        meiosCondTransporte: p.Meios_CondTransporte,
        restricao: p.Restricao,
      })),
    };
  }

  @Get('buscar')
  @ApiOperation({
    summary: 'Buscar exames por nome (GET)',
    description:
      'Pesquisa exames pelo nome usando query parameter. Alternativa ao POST.',
  })
  @ApiQuery({
    name: 'nome',
    description: 'Nome ou parte do nome do exame (mínimo 3 caracteres)',
    example: 'TIREOESTIMULANTE',
  })
  @ApiResponse({
    status: 200,
    description: 'Exames encontrados',
    type: [ProcedimentoWebResponseDto],
  })
  async buscarExamesGet(@Query('nome') nome: string) {
    const dto: FiltraProcedimentoWebDto = { filtroNome: nome || '' };
    const result =
      await this.dbDiagnosticosDadosService.filtraProcedimentoWeb(dto);

    return {
      sucesso: result.sucesso,
      erro: result.erro,
      message: result.message,
      total: result.dados?.length || 0,
      exames: result.dados?.map((p) => ({
        codigo: p.Codigo,
        descricao: p.Descricao,
        material: p.Material,
        possuiPreparo: p.PossuiInstrucaoPreparo,
        temRegiaoColeta: p.TemRegiaoColeta,
        regiaoColetaObrigatoria: p.RegiaoColetaObrigatoria,
        meiosCondTransporte: p.Meios_CondTransporte,
        restricao: p.Restricao,
      })),
    };
  }

  // ============================================
  // INFORMAÇÕES DETALHADAS
  // ============================================

  @Post('informacoes')
  @ApiOperation({
    summary: 'Obter informações detalhadas do exame',
    description:
      'Retorna informações completas do exame incluindo: preparo, prazo de entrega, material, metodologia, valores de referência e interpretação.',
  })
  @ApiResponse({
    status: 200,
    description: 'Informações do exame',
    type: InformacoesExameResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Exame não encontrado' })
  async getInformacoesExame(@Body() dto: GetInformacoesExameDto) {
    const result =
      await this.dbDiagnosticosDadosService.getInformacoesExame(dto);

    if (!result.sucesso) {
      return {
        sucesso: false,
        erro: result.erro,
      };
    }

    const dados = result.dados;
    return {
      sucesso: true,
      exame: {
        codigo: dados?.codigo,
        nome: dados?.nome,
        sinonimos: dados?.sinonimos,
        material: dados?.nomeMaterial,
        codigoMaterial: dados?.codigoMaterial,
        interpretacao: dados?.interpretacao,
        preco: dados?.preco,
        producao: {
          volumeMinimo: dados?.producao?.volumeMinimo,
          prazo: dados?.producao?.prazo,
          realizacao: dados?.producao?.realizacao,
          meiosColeta: dados?.producao?.meiosColeta,
        },
        preparo: dados?.instrucoes?.preparo,
        instrucoesColeta: dados?.instrucoes?.coleta,
        valoresReferencia: dados?.valoresReferencia,
        regioesColeta: dados?.regioesColeta,
      },
    };
  }

  @Get('informacoes')
  @ApiOperation({
    summary: 'Obter informações detalhadas do exame (GET)',
    description: 'Alternativa GET para obter informações do exame pelo código.',
  })
  @ApiQuery({
    name: 'codigo',
    description: 'Código do exame DB',
    example: 'TSH',
  })
  @ApiResponse({
    status: 200,
    description: 'Informações do exame',
    type: InformacoesExameResponseDto,
  })
  async getInformacoesExameGet(@Query('codigo') codigo: string) {
    const dto: GetInformacoesExameDto = { procedimento: codigo || '' };
    const result =
      await this.dbDiagnosticosDadosService.getInformacoesExame(dto);

    if (!result.sucesso) {
      return {
        sucesso: false,
        erro: result.erro,
      };
    }

    const dados = result.dados;
    return {
      sucesso: true,
      exame: {
        codigo: dados?.codigo,
        nome: dados?.nome,
        sinonimos: dados?.sinonimos,
        material: dados?.nomeMaterial,
        codigoMaterial: dados?.codigoMaterial,
        interpretacao: dados?.interpretacao,
        preco: dados?.preco,
        producao: {
          volumeMinimo: dados?.producao?.volumeMinimo,
          prazo: dados?.producao?.prazo,
          realizacao: dados?.producao?.realizacao,
          meiosColeta: dados?.producao?.meiosColeta,
        },
        preparo: dados?.instrucoes?.preparo,
        instrucoesColeta: dados?.instrucoes?.coleta,
        valoresReferencia: dados?.valoresReferencia,
        regioesColeta: dados?.regioesColeta,
      },
    };
  }

  // ============================================
  // CONFIGURAÇÃO DE EXAMES
  // ============================================

  @Post('config')
  @ApiOperation({
    summary: 'Obter configuração do exame',
    description:
      'Retorna a configuração completa do exame conforme tabela do DB, incluindo parâmetros e valores de referência.',
  })
  @ApiResponse({
    status: 200,
    description: 'Configuração do exame',
    type: ExameConfigResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Exame não encontrado' })
  async getExameConfig(@Body() dto: BuscaExamesConfigDto) {
    const result = await this.dbDiagnosticosDadosService.buscaExamesConfig(dto);

    if (!result.sucesso) {
      return {
        sucesso: false,
        erro: result.erro,
      };
    }

    const dados = result.dados;
    return {
      sucesso: true,
      exame: {
        codigo: dados?.codigo,
        nome: dados?.nome,
        sinonimo: dados?.sinonimo,
        cbhpm: dados?.cbhpm,
        metodologia: dados?.metodologia,
        material: dados?.material,
        volumeObrigatorio: dados?.volumeObrigatorio,
        alturaObrigatorio: dados?.alturaObrigatorio,
        pesoObrigatorio: dados?.pesoObrigatorio,
        dataAlteracaoLaudo: dados?.dataAlteracaoLaudo,
        parametros: dados?.parametros,
      },
    };
  }

  @Get('config')
  @ApiOperation({
    summary: 'Obter configuração do exame (GET)',
    description: 'Alternativa GET para obter configuração do exame.',
  })
  @ApiQuery({
    name: 'codigo',
    description: 'Código do exame DB',
    example: 'TSH',
  })
  @ApiResponse({
    status: 200,
    description: 'Configuração do exame',
    type: ExameConfigResponseDto,
  })
  async getExameConfigGet(@Query('codigo') codigo: string) {
    const dto: BuscaExamesConfigDto = { procedimento: codigo || '' };
    const result = await this.dbDiagnosticosDadosService.buscaExamesConfig(dto);

    if (!result.sucesso) {
      return {
        sucesso: false,
        erro: result.erro,
      };
    }

    const dados = result.dados;
    return {
      sucesso: true,
      exame: {
        codigo: dados?.codigo,
        nome: dados?.nome,
        sinonimo: dados?.sinonimo,
        cbhpm: dados?.cbhpm,
        metodologia: dados?.metodologia,
        material: dados?.material,
        volumeObrigatorio: dados?.volumeObrigatorio,
        alturaObrigatorio: dados?.alturaObrigatorio,
        pesoObrigatorio: dados?.pesoObrigatorio,
        dataAlteracaoLaudo: dados?.dataAlteracaoLaudo,
        parametros: dados?.parametros,
      },
    };
  }

  // ============================================
  // LAUDO E MÁSCARAS
  // ============================================

  @Post('laudo/versao')
  @ApiOperation({
    summary: 'Obter versão do laudo',
    description: 'Retorna as versões ativas do laudo para um procedimento.',
  })
  @ApiResponse({
    status: 200,
    description: 'Versões do laudo',
  })
  async getLaudoProcedimento(@Body() dto: GetLaudoProcedimentoDto) {
    const result =
      await this.dbDiagnosticosDadosService.getLaudoProcedimento(dto);

    return {
      sucesso: result.sucesso,
      erro: result.erro,
      message: result.message,
      laudosAtivos: result.dados,
    };
  }

  @Post('laudo/faixa-etaria')
  @ApiOperation({
    summary: 'Obter faixas etárias do laudo',
    description:
      'Retorna as faixas etárias e sexo disponíveis para uma versão de laudo.',
  })
  @ApiResponse({
    status: 200,
    description: 'Faixas etárias',
  })
  async getLaudoFaixaEtaria(@Body() dto: GetLaudoFaixaEtariaDto) {
    const result =
      await this.dbDiagnosticosDadosService.getLaudoFaixaEtariaSexo(dto);

    return {
      sucesso: result.sucesso,
      erro: result.erro,
      message: result.message,
      faixas: result.dados,
    };
  }

  @Post('laudo/mascara')
  @ApiOperation({
    summary: 'Download da máscara do laudo em PDF',
    description:
      'Retorna a máscara do laudo em Base64 (PDF). Use para visualizar template do laudo.',
  })
  @ApiResponse({
    status: 200,
    description: 'Máscara do laudo em Base64',
  })
  async downloadMascaraLaudo(@Body() dto: DownloadMascaraLaudoDto) {
    const result =
      await this.dbDiagnosticosDadosService.downloadMascaraLaudoPdf(dto);

    return {
      sucesso: result.sucesso,
      erro: result.erro,
      message: result.message,
      mascaraBase64: result.dados,
      contentType: 'application/pdf',
    };
  }

  // ============================================
  // DIAGNÓSTICO E UTILITÁRIOS
  // ============================================

  @Get('health')
  @ApiOperation({
    summary: 'Verificar saúde da integração',
    description:
      'Verifica se a integração com o Guia de Exames DB está configurada e conecta.',
  })
  @ApiResponse({
    status: 200,
    description: 'Status da integração',
  })
  async healthCheck() {
    return await this.dbDiagnosticosDadosService.healthCheck();
  }

  @Get('wsdl/describe')
  @ApiOperation({
    summary: 'Descrever WSDL (Debug)',
    description: 'Retorna a descrição completa do WSDL para debug.',
  })
  @ApiResponse({
    status: 200,
    description: 'Descrição do WSDL',
  })
  async describeWsdl() {
    return await this.dbDiagnosticosDadosService.describeWsdl();
  }
}
