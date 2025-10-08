import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Banco,
  StatusBanco,
} from '../../modules/financeiro/core/entities/banco.entity';

@Injectable()
export class BancoSeedService {
  constructor(
    @InjectRepository(Banco)
    private readonly bancoRepository: Repository<Banco>,
  ) {}

  async seed(): Promise<void> {
    const count = await this.bancoRepository.count();

    if (count > 0) {
      console.log(
        `Bancos já foram importados (${count} registros). Pulando seed...`,
      );
      return;
    }

    console.log('Iniciando importação de Bancos...');

    // Lista completa de bancos do Banco Central do Brasil
    const bancos = [
      { codigo: '001', nome: 'Banco do Brasil S.A.', codigo_interno: 'BB' },
      { codigo: '003', nome: 'Banco da Amazônia S.A.', codigo_interno: 'BASA' },
      {
        codigo: '004',
        nome: 'Banco do Nordeste do Brasil S.A.',
        codigo_interno: 'BNB',
      },
      {
        codigo: '007',
        nome: 'Banco Nacional de Desenvolvimento Econômico e Social - BNDES',
        codigo_interno: 'BNDES',
      },
      {
        codigo: '010',
        nome: 'Credicoamo Crédito Rural Cooperativa',
        codigo_interno: 'CREDICOAMO',
      },
      {
        codigo: '011',
        nome: 'Credit Suisse Hedging-Griffo Corretora de Valores S.A.',
        codigo_interno: 'CREDIT_SUISSE',
      },
      { codigo: '012', nome: 'Banco Inbursa S.A.', codigo_interno: 'INBURSA' },
      {
        codigo: '014',
        nome: 'Natixis Brasil S.A. Banco Múltiplo',
        codigo_interno: 'NATIXIS',
      },
      {
        codigo: '015',
        nome: 'UBS Brasil Corretora de Câmbio, Títulos e Valores Mobiliários S.A.',
        codigo_interno: 'UBS',
      },
      {
        codigo: '016',
        nome: 'Coop. de Crédito Mútuo dos Despachantes de Trânsito de SC',
        codigo_interno: 'SICOOB_SC',
      },
      {
        codigo: '017',
        nome: 'BNY Mellon Banco S.A.',
        codigo_interno: 'BNY_MELLON',
      },
      { codigo: '018', nome: 'Banco Tricury S.A.', codigo_interno: 'TRICURY' },
      {
        codigo: '021',
        nome: 'Banco Banestes S.A.',
        codigo_interno: 'BANESTES',
      },
      { codigo: '024', nome: 'Banco Bandepe S.A.', codigo_interno: 'BANDEPE' },
      { codigo: '025', nome: 'Banco Alfa S.A.', codigo_interno: 'ALFA' },
      {
        codigo: '029',
        nome: 'Banco Itaú Consignado S.A.',
        codigo_interno: 'ITAU_CONSIGNADO',
      },
      {
        codigo: '033',
        nome: 'Banco Santander (Brasil) S.A.',
        codigo_interno: 'SANTANDER',
      },
      {
        codigo: '036',
        nome: 'Banco Bradesco BBI S.A.',
        codigo_interno: 'BRADESCO_BBI',
      },
      {
        codigo: '037',
        nome: 'Banco do Estado do Pará S.A.',
        codigo_interno: 'BANPARA',
      },
      { codigo: '040', nome: 'Banco Cargill S.A.', codigo_interno: 'CARGILL' },
      {
        codigo: '041',
        nome: 'Banco do Estado do Rio Grande do Sul S.A.',
        codigo_interno: 'BANRISUL',
      },
      {
        codigo: '047',
        nome: 'Banco do Estado de Sergipe S.A.',
        codigo_interno: 'BANESE',
      },
      {
        codigo: '060',
        nome: 'Confidence Corretora de Câmbio S.A.',
        codigo_interno: 'CONFIDENCE',
      },
      {
        codigo: '062',
        nome: 'Hipercard Banco Múltiplo S.A.',
        codigo_interno: 'HIPERCARD',
      },
      {
        codigo: '063',
        nome: 'Banco Bradescard S.A.',
        codigo_interno: 'BRADESCARD',
      },
      {
        codigo: '064',
        nome: 'Goldman Sachs do Brasil Banco Múltiplo S.A.',
        codigo_interno: 'GOLDMAN_SACHS',
      },
      {
        codigo: '065',
        nome: 'Banco AndBank (Brasil) S.A.',
        codigo_interno: 'ANDBANK',
      },
      {
        codigo: '066',
        nome: 'Banco Morgan Stanley S.A.',
        codigo_interno: 'MORGAN_STANLEY',
      },
      { codigo: '069', nome: 'Banco Crefisa S.A.', codigo_interno: 'CREFISA' },
      { codigo: '070', nome: 'Banco de Brasília S.A.', codigo_interno: 'BRB' },
      { codigo: '074', nome: 'Banco J. Safra S.A.', codigo_interno: 'SAFRA' },
      {
        codigo: '075',
        nome: 'Banco ABN Amro S.A.',
        codigo_interno: 'ABN_AMRO',
      },
      {
        codigo: '076',
        nome: 'Banco KDB do Brasil S.A.',
        codigo_interno: 'KDB',
      },
      { codigo: '077', nome: 'Banco Inter S.A.', codigo_interno: 'INTER' },
      {
        codigo: '078',
        nome: 'Haitong Banco de Investimento do Brasil S.A.',
        codigo_interno: 'HAITONG',
      },
      {
        codigo: '079',
        nome: 'Banco Original do Agronegócio S.A.',
        codigo_interno: 'ORIGINAL_AGRO',
      },
      {
        codigo: '080',
        nome: 'B&T Corretora de Câmbio Ltda.',
        codigo_interno: 'BT_CC',
      },
      {
        codigo: '081',
        nome: 'BancoSeguro S.A.',
        codigo_interno: 'BANCOSEGURO',
      },
      { codigo: '082', nome: 'Banco Topázio S.A.', codigo_interno: 'TOPAZIO' },
      {
        codigo: '083',
        nome: 'Banco da China Brasil S.A.',
        codigo_interno: 'CHINA',
      },
      {
        codigo: '084',
        nome: 'Uniprime Norte do Paraná',
        codigo_interno: 'UNIPRIME_NORTE',
      },
      {
        codigo: '085',
        nome: 'Cooperativa Central de Crédito Urbano - Cecred',
        codigo_interno: 'CECRED',
      },
      {
        codigo: '089',
        nome: 'Cooperativa de Crédito Rural da Região da Mogiana',
        codigo_interno: 'CREDISAN',
      },
      {
        codigo: '091',
        nome: 'Unicred Central RS',
        codigo_interno: 'UNICRED_RS',
      },
      {
        codigo: '092',
        nome: 'BRK S.A. Crédito, Financiamento e Investimento',
        codigo_interno: 'BRK',
      },
      {
        codigo: '093',
        nome: 'Pólocred Sociedade de Crédito ao Microempreendedor',
        codigo_interno: 'POLOCRED',
      },
      { codigo: '094', nome: 'Banco Finaxis S.A.', codigo_interno: 'FINAXIS' },
      {
        codigo: '095',
        nome: 'Banco Confidence de Câmbio S.A.',
        codigo_interno: 'CONFIDENCE_CAMBIO',
      },
      {
        codigo: '096',
        nome: 'Banco BMFBovespa de Serviços de Liquidação e Custódia S.A.',
        codigo_interno: 'B3',
      },
      {
        codigo: '097',
        nome: 'Cooperativa Central de Crédito Noroeste Brasileiro',
        codigo_interno: 'CREDISIS',
      },
      {
        codigo: '098',
        nome: 'Credialiança Cooperativa de Crédito Rural',
        codigo_interno: 'CREDIALIANCA',
      },
      {
        codigo: '099',
        nome: 'Uniprime Central CCC',
        codigo_interno: 'UNIPRIME_CENTRAL',
      },
      {
        codigo: '100',
        nome: 'Planner Corretora de Valores S.A.',
        codigo_interno: 'PLANNER',
      },
      {
        codigo: '101',
        nome: 'Renascença Distribuidora de Títulos e Valores Mobiliários',
        codigo_interno: 'RENASCENCA',
      },
      {
        codigo: '102',
        nome: 'XP Investimentos Corretora de Câmbio, Títulos e Valores Mobiliários S.A.',
        codigo_interno: 'XP',
      },
      { codigo: '104', nome: 'Caixa Econômica Federal', codigo_interno: 'CEF' },
      {
        codigo: '105',
        nome: 'Lecca Crédito, Financiamento e Investimento S.A.',
        codigo_interno: 'LECCA',
      },
      {
        codigo: '107',
        nome: 'Banco Bocom BBM S.A.',
        codigo_interno: 'BOCOM_BBM',
      },
      {
        codigo: '108',
        nome: 'PortoCred S.A. Crédito, Financiamento e Investimento',
        codigo_interno: 'PORTOCRED',
      },
      {
        codigo: '111',
        nome: 'Oliveira Trust Distribuidora de Títulos e Valores Mobiliários S.A.',
        codigo_interno: 'OLIVEIRA_TRUST',
      },
      {
        codigo: '113',
        nome: 'Magliano S.A. Corretora de Cambio e Valores Mobiliários',
        codigo_interno: 'MAGLIANO',
      },
      {
        codigo: '114',
        nome: 'Central Cooperativa de Crédito do Estado do Espírito Santo',
        codigo_interno: 'CECOOPES',
      },
      {
        codigo: '117',
        nome: 'Advanced Corretora de Câmbio Ltda.',
        codigo_interno: 'ADVANCED',
      },
      {
        codigo: '118',
        nome: 'Standard Chartered Bank (Brasil) S.A.',
        codigo_interno: 'STANDARD',
      },
      {
        codigo: '119',
        nome: 'Banco Western Union do Brasil S.A.',
        codigo_interno: 'WESTERN_UNION',
      },
      {
        codigo: '120',
        nome: 'Banco Rodobens S.A.',
        codigo_interno: 'RODOBENS',
      },
      { codigo: '121', nome: 'Banco Agibank S.A.', codigo_interno: 'AGIBANK' },
      {
        codigo: '122',
        nome: 'Banco Bradesco BERJ S.A.',
        codigo_interno: 'BRADESCO_BERJ',
      },
      {
        codigo: '124',
        nome: 'Banco Woori Bank do Brasil S.A.',
        codigo_interno: 'WOORI',
      },
      {
        codigo: '125',
        nome: 'Brasil Plural S.A. - Banco Múltiplo',
        codigo_interno: 'PLURAL',
      },
      {
        codigo: '126',
        nome: 'BR Partners Banco de Investimento S.A.',
        codigo_interno: 'BR_PARTNERS',
      },
      {
        codigo: '127',
        nome: 'Codepe Corretora de Valores e Câmbio S.A.',
        codigo_interno: 'CODEPE',
      },
      {
        codigo: '128',
        nome: 'MS Bank S.A. Banco de Câmbio',
        codigo_interno: 'MS_BANK',
      },
      {
        codigo: '129',
        nome: 'UBS Brasil Banco de Investimento S.A.',
        codigo_interno: 'UBS_BI',
      },
      {
        codigo: '130',
        nome: 'Caruana S.A. Sociedade de Crédito, Financiamento e Investimento',
        codigo_interno: 'CARUANA',
      },
      {
        codigo: '131',
        nome: 'Tullett Prebon Brasil Corretora de Valores e Câmbio Ltda.',
        codigo_interno: 'TULLETT',
      },
      {
        codigo: '132',
        nome: 'ICBC do Brasil Banco Múltiplo S.A.',
        codigo_interno: 'ICBC',
      },
      { codigo: '133', nome: 'Cresol Confederação', codigo_interno: 'CRESOL' },
      {
        codigo: '134',
        nome: 'BGC Liquidez Distribuidora de Títulos e Valores Mobiliários Ltda.',
        codigo_interno: 'BGC',
      },
      {
        codigo: '135',
        nome: 'Gradual Corretora de Câmbio, Títulos e Valores Mobiliários S.A.',
        codigo_interno: 'GRADUAL',
      },
      {
        codigo: '136',
        nome: 'Confederação Nacional das Cooperativas Centrais Unicred',
        codigo_interno: 'UNICRED',
      },
      {
        codigo: '137',
        nome: 'Multimoney Corretora de Câmbio Ltda.',
        codigo_interno: 'MULTIMONEY',
      },
      {
        codigo: '138',
        nome: 'Get Money Corretora de Câmbio S.A.',
        codigo_interno: 'GET_MONEY',
      },
      {
        codigo: '139',
        nome: 'Intesa Sanpaolo Brasil S.A. - Banco Múltiplo',
        codigo_interno: 'INTESA',
      },
      {
        codigo: '140',
        nome: 'Easynvest - Título Corretora de Valores S.A.',
        codigo_interno: 'EASYNVEST',
      },
      {
        codigo: '142',
        nome: 'Broker Brasil Corretora de Câmbio Ltda.',
        codigo_interno: 'BROKER_BRASIL',
      },
      {
        codigo: '143',
        nome: 'Treviso Corretora de Câmbio S.A.',
        codigo_interno: 'TREVISO',
      },
      {
        codigo: '144',
        nome: 'Bexs Banco de Câmbio S.A.',
        codigo_interno: 'BEXS',
      },
      {
        codigo: '145',
        nome: 'Levycam - Corretora de Câmbio e Valores Ltda.',
        codigo_interno: 'LEVYCAM',
      },
      {
        codigo: '146',
        nome: 'Guitta Corretora de Câmbio Ltda.',
        codigo_interno: 'GUITTA',
      },
      {
        codigo: '149',
        nome: 'Facta Financeira S.A. - Crédito, Financiamento e Investimento',
        codigo_interno: 'FACTA',
      },
      {
        codigo: '157',
        nome: 'ICAP do Brasil Corretora de Títulos e Valores Mobiliários Ltda.',
        codigo_interno: 'ICAP',
      },
      {
        codigo: '159',
        nome: 'Casa do Crédito S.A. Sociedade de Crédito ao Microempreendedor',
        codigo_interno: 'CASA_CREDITO',
      },
      {
        codigo: '163',
        nome: 'Commerzbank Brasil S.A. - Banco Múltiplo',
        codigo_interno: 'COMMERZBANK',
      },
      {
        codigo: '169',
        nome: 'Banco Olé Bonsucesso Consignado S.A.',
        codigo_interno: 'OLE',
      },
      {
        codigo: '172',
        nome: 'Albatross Corretora de Câmbio e Valores S.A.',
        codigo_interno: 'ALBATROSS',
      },
      {
        codigo: '173',
        nome: 'BRL Trust Distribuidora de Títulos e Valores Mobiliários S.A.',
        codigo_interno: 'BRL_TRUST',
      },
      {
        codigo: '174',
        nome: 'Pernambucanas Financiadora S.A. Crédito, Financiamento e Investimento',
        codigo_interno: 'PERNAMBUCANAS',
      },
      {
        codigo: '177',
        nome: 'Guide Investimentos S.A. Corretora de Valores',
        codigo_interno: 'GUIDE',
      },
      {
        codigo: '180',
        nome: 'CM Capital Markets Corretora de Câmbio, Títulos e Valores Mobiliários Ltda.',
        codigo_interno: 'CM_CAPITAL',
      },
      {
        codigo: '182',
        nome: 'Dacasa Financeira S.A. - Sociedade de Crédito, Financiamento e Investimento',
        codigo_interno: 'DACASA',
      },
      {
        codigo: '183',
        nome: 'Socred S.A. - Sociedade de Crédito ao Microempreendedor',
        codigo_interno: 'SOCRED',
      },
      {
        codigo: '184',
        nome: 'Banco Itaú BBA S.A.',
        codigo_interno: 'ITAU_BBA',
      },
      {
        codigo: '188',
        nome: 'Ativa Investimentos S.A. Corretora de Títulos, Câmbio e Valores',
        codigo_interno: 'ATIVA',
      },
      {
        codigo: '189',
        nome: 'HS Financeira S.A. Crédito, Financiamento e Investimentos',
        codigo_interno: 'HS',
      },
      {
        codigo: '190',
        nome: 'Cooperativa de Economia e Crédito Mútuo dos Servidores Públicos Estaduais do Rio',
        codigo_interno: 'SERVICOOP',
      },
      {
        codigo: '191',
        nome: 'Nova Futura Corretora de Títulos e Valores Mobiliários Ltda.',
        codigo_interno: 'NOVA_FUTURA',
      },
      {
        codigo: '194',
        nome: 'Parmetal Distribuidora de Títulos e Valores Mobiliários Ltda.',
        codigo_interno: 'PARMETAL',
      },
      {
        codigo: '196',
        nome: 'Fair Corretora de Câmbio S.A.',
        codigo_interno: 'FAIR',
      },
      { codigo: '197', nome: 'Stone Pagamentos S.A.', codigo_interno: 'STONE' },
      {
        codigo: '204',
        nome: 'Banco Bradesco Cartões S.A.',
        codigo_interno: 'BRADESCO_CARTOES',
      },
      { codigo: '208', nome: 'Banco BTG Pactual S.A.', codigo_interno: 'BTG' },
      {
        codigo: '212',
        nome: 'Banco Original S.A.',
        codigo_interno: 'ORIGINAL',
      },
      { codigo: '213', nome: 'Banco Arbi S.A.', codigo_interno: 'ARBI' },
      {
        codigo: '217',
        nome: 'Banco John Deere S.A.',
        codigo_interno: 'JOHN_DEERE',
      },
      { codigo: '218', nome: 'Banco BS2 S.A.', codigo_interno: 'BS2' },
      {
        codigo: '222',
        nome: 'Banco Credit Agrícole Brasil S.A.',
        codigo_interno: 'CREDIT_AGRICOLE',
      },
      { codigo: '224', nome: 'Banco Fibra S.A.', codigo_interno: 'FIBRA' },
      { codigo: '233', nome: 'Banco Cifra S.A.', codigo_interno: 'CIFRA' },
      {
        codigo: '237',
        nome: 'Banco Bradesco S.A.',
        codigo_interno: 'BRADESCO',
      },
      {
        codigo: '241',
        nome: 'Banco Clássico S.A.',
        codigo_interno: 'CLASSICO',
      },
      { codigo: '243', nome: 'Banco Máxima S.A.', codigo_interno: 'MAXIMA' },
      { codigo: '246', nome: 'Banco ABC Brasil S.A.', codigo_interno: 'ABC' },
      {
        codigo: '249',
        nome: 'Banco Investcred Unibanco S.A.',
        codigo_interno: 'INVESTCRED',
      },
      {
        codigo: '250',
        nome: 'BCV - Banco de Crédito e Varejo S.A.',
        codigo_interno: 'BCV',
      },
      {
        codigo: '253',
        nome: 'Bexs Corretora de Câmbio S.A.',
        codigo_interno: 'BEXS_CC',
      },
      { codigo: '254', nome: 'Paraná Banco S.A.', codigo_interno: 'PARANA' },
      { codigo: '260', nome: 'Nubank S.A.', codigo_interno: 'NUBANK' },
      { codigo: '265', nome: 'Banco Fator S.A.', codigo_interno: 'FATOR' },
      { codigo: '266', nome: 'Banco Cédula S.A.', codigo_interno: 'CEDULA' },
      {
        codigo: '268',
        nome: 'Bari Companhia Hipotecária',
        codigo_interno: 'BARI',
      },
      {
        codigo: '269',
        nome: 'HSBC Brasil S.A. - Banco de Investimento',
        codigo_interno: 'HSBC',
      },
      {
        codigo: '270',
        nome: 'Sagitur Corretora de Câmbio Ltda.',
        codigo_interno: 'SAGITUR',
      },
      {
        codigo: '271',
        nome: 'IB Corretora de Câmbio, Títulos e Valores Mobiliários S.A.',
        codigo_interno: 'IB_CCTVM',
      },
      {
        codigo: '272',
        nome: 'AGK Corretora de Câmbio S.A.',
        codigo_interno: 'AGK',
      },
      {
        codigo: '273',
        nome: 'Cooperativa de Crédito Rural de São Miguel do Oeste - Sulcredi',
        codigo_interno: 'SULCREDI',
      },
      {
        codigo: '274',
        nome: 'Money Plus Sociedade de Crédito ao Microempreendedor e à Empresa de Pequeno Porte',
        codigo_interno: 'MONEY_PLUS',
      },
      {
        codigo: '275',
        nome: 'Genial Investimentos Corretora de Valores Mobiliários S.A.',
        codigo_interno: 'GENIAL',
      },
      {
        codigo: '276',
        nome: 'Senff S.A. - Crédito, Financiamento e Investimento',
        codigo_interno: 'SENFF',
      },
      {
        codigo: '278',
        nome: 'Genial Investimentos Corretora de Valores Mobiliários S.A.',
        codigo_interno: 'GENIAL_CVM',
      },
      {
        codigo: '279',
        nome: 'Cooperativa de Crédito Rural de Primavera do Leste',
        codigo_interno: 'PRIMACREDI',
      },
      {
        codigo: '280',
        nome: 'Avista S.A. Crédito, Financiamento e Investimento',
        codigo_interno: 'AVISTA',
      },
      {
        codigo: '281',
        nome: 'Cooperativa de Crédito Rural Coopavel',
        codigo_interno: 'COOPAVEL',
      },
      {
        codigo: '283',
        nome: 'RB Capital Investimentos Distribuidora de Títulos e Valores Mobiliários Ltda.',
        codigo_interno: 'RB_CAPITAL',
      },
      {
        codigo: '285',
        nome: 'Frente Corretora de Câmbio Ltda.',
        codigo_interno: 'FRENTE',
      },
      {
        codigo: '286',
        nome: 'Cooperativa de Crédito Rural de Ouro - Sulcredi',
        codigo_interno: 'SULCREDI_OURO',
      },
      {
        codigo: '288',
        nome: 'Carol Distribuidora de Títulos e Valores Mobiliários Ltda.',
        codigo_interno: 'CAROL',
      },
      {
        codigo: '289',
        nome: 'Decyseo Corretora de Câmbio Ltda.',
        codigo_interno: 'DECYSEO',
      },
      {
        codigo: '290',
        nome: 'PagSeguro Internet S.A.',
        codigo_interno: 'PAGSEGURO',
      },
      {
        codigo: '291',
        nome: 'Goldman Sachs do Brasil Corretora de Títulos e Valores Mobiliários S.A.',
        codigo_interno: 'GOLDMAN_SACHS_CTVM',
      },
      {
        codigo: '292',
        nome: 'BS2 Distribuidora de Títulos e Valores Mobiliários S.A.',
        codigo_interno: 'BS2_DTVM',
      },
      {
        codigo: '293',
        nome: 'Lastro RDV Distribuidora de Títulos e Valores Mobiliários Ltda.',
        codigo_interno: 'LASTRO',
      },
      {
        codigo: '294',
        nome: 'Asaas Gestão Financeira e Pagamentos S.A.',
        codigo_interno: 'ASAAS',
      },
      {
        codigo: '295',
        nome: 'Pefisa S.A. - Crédito, Financiamento e Investimento',
        codigo_interno: 'PEFISA',
      },
      {
        codigo: '296',
        nome: 'Vision S.A. Corretora de Câmbio',
        codigo_interno: 'VISION',
      },
      {
        codigo: '298',
        nome: 'Vips Corretora de Câmbio Ltda.',
        codigo_interno: 'VIPS',
      },
      {
        codigo: '299',
        nome: 'Sorocred Crédito, Financiamento e Investimento S.A.',
        codigo_interno: 'SOROCRED',
      },
      {
        codigo: '300',
        nome: 'Banco de la Nación Argentina',
        codigo_interno: 'BNA',
      },
      {
        codigo: '301',
        nome: 'BPP Instituição de Pagamentos S.A.',
        codigo_interno: 'BPP',
      },
      {
        codigo: '306',
        nome: 'Portopar Distribuidora de Títulos e Valores Mobiliários Ltda.',
        codigo_interno: 'PORTOPAR',
      },
      {
        codigo: '307',
        nome: 'Terra Investimentos Distribuidora de Títulos e Valores Mobiliários Ltda.',
        codigo_interno: 'TERRA',
      },
      {
        codigo: '308',
        nome: 'Cambionet Corretora de Câmbio Ltda.',
        codigo_interno: 'CAMBIONET',
      },
      {
        codigo: '309',
        nome: 'RBRL Distribuidora de Títulos e Valores Mobiliários Ltda.',
        codigo_interno: 'RBRL',
      },
      {
        codigo: '310',
        nome: 'Vortx Distribuidora de Títulos e Valores Mobiliários Ltda.',
        codigo_interno: 'VORTX',
      },
      {
        codigo: '311',
        nome: 'Dourada Corretora de Câmbio Ltda.',
        codigo_interno: 'DOURADA',
      },
      {
        codigo: '312',
        nome: 'Hscm Sociedade de Crédito ao Microempreendedor e à Empresa de Pequeno Porte Ltda.',
        codigo_interno: 'HSCM',
      },
      {
        codigo: '313',
        nome: 'Amazônia Corretora de Câmbio Ltda.',
        codigo_interno: 'AMAZONIA',
      },
      {
        codigo: '314',
        nome: 'RB Investimentos Distribuidora de Títulos e Valores Mobiliários Ltda.',
        codigo_interno: 'RB_INVESTIMENTOS',
      },
      {
        codigo: '315',
        nome: 'Pi Distribuidora de Títulos e Valores Mobiliários S.A.',
        codigo_interno: 'PI_DTVM',
      },
      {
        codigo: '316',
        nome: 'Índigo Investimentos Distribuidora de Títulos e Valores Mobiliários Ltda.',
        codigo_interno: 'INDIGO',
      },
      {
        codigo: '317',
        nome: 'Mercado Pago Instituição de Pagamento Ltda.',
        codigo_interno: 'MERCADOPAGO',
      },
      { codigo: '318', nome: 'Banco BMG S.A.', codigo_interno: 'BMG' },
      {
        codigo: '319',
        nome: 'OM Distribuidora de Títulos e Valores Mobiliários Ltda.',
        codigo_interno: 'OM_DTVM',
      },
      { codigo: '320', nome: 'Banco CCB Brasil S.A.', codigo_interno: 'CCB' },
      {
        codigo: '321',
        nome: 'Crefaz Sociedade de Crédito ao Microempreendedor e à Empresa de Pequeno Porte Ltda.',
        codigo_interno: 'CREFAZ',
      },
      {
        codigo: '322',
        nome: 'Cooperativa de Crédito Rural de Abelardo Luz - Sulcredi',
        codigo_interno: 'SULCREDI_ABELARDO',
      },
      {
        codigo: '323',
        nome: 'Mercado Bitcoin Serviços Digitais Ltda.',
        codigo_interno: 'MERCADO_BITCOIN',
      },
      {
        codigo: '324',
        nome: 'Cartos Sociedade de Crédito Direto S.A.',
        codigo_interno: 'CARTOS',
      },
      {
        codigo: '325',
        nome: 'Órama Distribuidora de Títulos e Valores Mobiliários S.A.',
        codigo_interno: 'ORAMA',
      },
      {
        codigo: '326',
        nome: 'Parati - Crédito, Financiamento e Investimento S.A.',
        codigo_interno: 'PARATI',
      },
      {
        codigo: '329',
        nome: 'QI Sociedade de Crédito Direto S.A.',
        codigo_interno: 'QI_SCD',
      },
      {
        codigo: '330',
        nome: 'Banco Bari de Investimentos e Financiamentos S.A.',
        codigo_interno: 'BARI_INVESTIMENTOS',
      },
      {
        codigo: '331',
        nome: 'Fram Capital Distribuidora de Títulos e Valores Mobiliários S.A.',
        codigo_interno: 'FRAM',
      },
      {
        codigo: '332',
        nome: 'Acesso Soluções de Pagamento S.A.',
        codigo_interno: 'ACESSO',
      },
      { codigo: '335', nome: 'Banco Digio S.A.', codigo_interno: 'DIGIO' },
      { codigo: '336', nome: 'Banco C6 S.A.', codigo_interno: 'C6' },
      {
        codigo: '340',
        nome: 'Super Pagamentos S.A.',
        codigo_interno: 'SUPER_PAGAMENTOS',
      },
      { codigo: '341', nome: 'Itaú Unibanco S.A.', codigo_interno: 'ITAU' },
      {
        codigo: '342',
        nome: 'Creditas Sociedade de Crédito Direto S.A.',
        codigo_interno: 'CREDITAS',
      },
      {
        codigo: '343',
        nome: 'FFA Sociedade de Crédito ao Microempreendedor e à Empresa de Pequeno Porte Ltda.',
        codigo_interno: 'FFA',
      },
      { codigo: '348', nome: 'Banco XP S.A.', codigo_interno: 'XP_BANCO' },
      {
        codigo: '349',
        nome: 'Amaggi S.A. Crédito, Financiamento e Investimento',
        codigo_interno: 'AMAGGI',
      },
      {
        codigo: '350',
        nome: 'Crehnor Laranjeiras Sociedade de Crédito ao Microempreendedor',
        codigo_interno: 'CREHNOR',
      },
      {
        codigo: '352',
        nome: 'Toro Corretora de Títulos e Valores Mobiliários S.A.',
        codigo_interno: 'TORO',
      },
      {
        codigo: '353',
        nome: 'Necton Investimentos S.A. Corretora de Valores Mobiliários e Commodities',
        codigo_interno: 'NECTON',
      },
      {
        codigo: '354',
        nome: 'Simplified Instituição de Pagamento Ltda.',
        codigo_interno: 'SIMPLIFIED',
      },
      {
        codigo: '355',
        nome: 'Ótimo Sociedade de Crédito Direto S.A.',
        codigo_interno: 'OTIMO',
      },
      {
        codigo: '357',
        nome: 'Midway Sociedade de Crédito Direto S.A.',
        codigo_interno: 'MIDWAY',
      },
      {
        codigo: '358',
        nome: 'Zema Crédito, Financiamento e Investimento S.A.',
        codigo_interno: 'ZEMA',
      },
      {
        codigo: '359',
        nome: 'Travelex Banco de Câmbio S.A.',
        codigo_interno: 'TRAVELEX',
      },
      {
        codigo: '360',
        nome: 'Trinus Capital Distribuidora de Títulos e Valores Mobiliários S.A.',
        codigo_interno: 'TRINUS',
      },
      {
        codigo: '361',
        nome: 'Ideal Corretora de Títulos e Valores Mobiliários S.A.',
        codigo_interno: 'IDEAL',
      },
      { codigo: '362', nome: 'Cielo S.A.', codigo_interno: 'CIELO' },
      {
        codigo: '363',
        nome: 'Socopa Sociedade Corretora Paulista S.A.',
        codigo_interno: 'SOCOPA',
      },
      {
        codigo: '364',
        nome: 'Gerencianet S.A.',
        codigo_interno: 'GERENCIANET',
      },
      {
        codigo: '365',
        nome: 'Solidus S.A. Corretora de Câmbio e Valores Mobiliários',
        codigo_interno: 'SOLIDUS',
      },
      {
        codigo: '366',
        nome: 'Banco Societe Generale Brasil S.A.',
        codigo_interno: 'SOCIETE_GENERALE',
      },
      {
        codigo: '367',
        nome: 'Vitreo Distribuidora de Títulos e Valores Mobiliários S.A.',
        codigo_interno: 'VITREO',
      },
      { codigo: '368', nome: 'Banco CSF S.A.', codigo_interno: 'CSF' },
      {
        codigo: '369',
        nome: 'Banco Digimais S.A.',
        codigo_interno: 'DIGIMAIS',
      },
      {
        codigo: '370',
        nome: 'Banco Mizuho do Brasil S.A.',
        codigo_interno: 'MIZUHO',
      },
      {
        codigo: '371',
        nome: 'Warren Corretora de Valores Mobiliários e Câmbio Ltda.',
        codigo_interno: 'WARREN',
      },
      {
        codigo: '373',
        nome: 'Up.p Sociedade de Empréstimo entre Pessoas S.A.',
        codigo_interno: 'UPP',
      },
      {
        codigo: '374',
        nome: 'Realize Crédito, Financiamento e Investimento S.A.',
        codigo_interno: 'REALIZE',
      },
      {
        codigo: '376',
        nome: 'Banco J.P. Morgan S.A.',
        codigo_interno: 'JP_MORGAN',
      },
      {
        codigo: '377',
        nome: 'BMS Sociedade de Crédito Direto S.A.',
        codigo_interno: 'BMS',
      },
      {
        codigo: '378',
        nome: 'BBC Leasing S.A. - Arrendamento Mercantil',
        codigo_interno: 'BBC',
      },
      {
        codigo: '379',
        nome: 'Cooperforte - Cooperativa de Economia e Crédito Mútuo',
        codigo_interno: 'COOPERFORTE',
      },
      { codigo: '380', nome: 'Picpay Servicos S.A.', codigo_interno: 'PICPAY' },
      {
        codigo: '383',
        nome: 'Juno - Boletobancário.com Tecnologia de Pagamentos Ltda.',
        codigo_interno: 'JUNO',
      },
      {
        codigo: '389',
        nome: 'Banco Mercantil do Brasil S.A.',
        codigo_interno: 'MERCANTIL',
      },
      { codigo: '390', nome: 'Banco GM S.A.', codigo_interno: 'GM' },
      {
        codigo: '394',
        nome: 'Banco Bradesco Financiamentos S.A.',
        codigo_interno: 'BRADESCO_FINANCIAMENTOS',
      },
      {
        codigo: '399',
        nome: 'Kirton Bank S.A. - Banco Múltiplo',
        codigo_interno: 'KIRTON',
      },
      {
        codigo: '403',
        nome: 'Cora Sociedade de Crédito Direto S.A.',
        codigo_interno: 'CORA',
      },
      {
        codigo: '404',
        nome: 'Sumup Sociedade de Crédito Direto S.A.',
        codigo_interno: 'SUMUP',
      },
      { codigo: '412', nome: 'Banco Capital S.A.', codigo_interno: 'CAPITAL' },
      { codigo: '422', nome: 'Banco Safra S.A.', codigo_interno: 'SAFRA_422' },
      {
        codigo: '450',
        nome: 'Fitbank Pagamentos Eletrônicos S.A.',
        codigo_interno: 'FITBANK',
      },
      { codigo: '453', nome: 'Banco Pan S.A.', codigo_interno: 'PAN' },
      { codigo: '456', nome: 'Banco MUFG Brasil S.A.', codigo_interno: 'MUFG' },
      {
        codigo: '464',
        nome: 'Banco Sumitomo Mitsui Brasileiro S.A.',
        codigo_interno: 'SUMITOMO',
      },
      { codigo: '477', nome: 'Banco BV S.A.', codigo_interno: 'BV' },
      {
        codigo: '479',
        nome: 'Banco ItauBank S.A.',
        codigo_interno: 'ITAUBANK',
      },
      {
        codigo: '487',
        nome: 'Jpmorgan Chase Bank National Association',
        codigo_interno: 'JPMORGAN_CHASE',
      },
      {
        codigo: '488',
        nome: 'Revolut do Brasil Instituição de Pagamento Ltda.',
        codigo_interno: 'REVOLUT',
      },
      {
        codigo: '492',
        nome: 'Coop de Crédito da Região da Mogiana',
        codigo_interno: 'MOGIANA',
      },
      {
        codigo: '505',
        nome: 'Credit Agricole Brasil S.A.',
        codigo_interno: 'CREDIT_AGRICOLE_DTVM',
      },
      {
        codigo: '600',
        nome: 'Banco Luso Brasileiro S.A.',
        codigo_interno: 'LUSO',
      },
      {
        codigo: '604',
        nome: 'Banco Industrial do Brasil S.A.',
        codigo_interno: 'INDUSTRIAL',
      },
      { codigo: '610', nome: 'Banco VR S.A.', codigo_interno: 'VR' },
      {
        codigo: '611',
        nome: 'Banco Paulista S.A.',
        codigo_interno: 'PAULISTA',
      },
      {
        codigo: '612',
        nome: 'Banco Guanabara S.A.',
        codigo_interno: 'GUANABARA',
      },
      { codigo: '613', nome: 'Omni Banco S.A.', codigo_interno: 'OMNI' },
      { codigo: '623', nome: 'Banco Pan S.A.', codigo_interno: 'PAN_623' },
      { codigo: '626', nome: 'Banco Ficsa S.A.', codigo_interno: 'FICSA' },
      {
        codigo: '630',
        nome: 'Banco Intercap S.A.',
        codigo_interno: 'INTERCAP',
      },
      {
        codigo: '633',
        nome: 'Banco Rendimento S.A.',
        codigo_interno: 'RENDIMENTO',
      },
      {
        codigo: '634',
        nome: 'Banco Triângulo S.A.',
        codigo_interno: 'TRIANGULO',
      },
      { codigo: '637', nome: 'Banco Sofisa S.A.', codigo_interno: 'SOFISA' },
      { codigo: '643', nome: 'Banco Pine S.A.', codigo_interno: 'PINE' },
      {
        codigo: '652',
        nome: 'Banco Itaú Consignado S.A.',
        codigo_interno: 'ITAU_CONSIGNADO_652',
      },
      {
        codigo: '653',
        nome: 'Banco Indusval S.A.',
        codigo_interno: 'INDUSVAL',
      },
      {
        codigo: '654',
        nome: 'Banco A.J.Renner S.A.',
        codigo_interno: 'RENNER',
      },
      {
        codigo: '655',
        nome: 'Banco Votorantim S.A.',
        codigo_interno: 'VOTORANTIM',
      },
      {
        codigo: '707',
        nome: 'Banco Daycoval S.A.',
        codigo_interno: 'DAYCOVAL',
      },
      {
        codigo: '712',
        nome: 'Banco Cooperativo Sicredi S.A.',
        codigo_interno: 'SICREDI',
      },
      { codigo: '735', nome: 'Banco Neon S.A.', codigo_interno: 'NEON' },
      { codigo: '739', nome: 'Banco Cetelem S.A.', codigo_interno: 'CETELEM' },
      {
        codigo: '741',
        nome: 'Banco Ribeirão Preto S.A.',
        codigo_interno: 'RIBEIRAO_PRETO',
      },
      { codigo: '743', nome: 'Banco Semear S.A.', codigo_interno: 'SEMEAR' },
      {
        codigo: '745',
        nome: 'Banco Citibank S.A.',
        codigo_interno: 'CITIBANK',
      },
      { codigo: '746', nome: 'Banco Modal S.A.', codigo_interno: 'MODAL' },
      {
        codigo: '747',
        nome: 'Banco Rabobank International Brasil S.A.',
        codigo_interno: 'RABOBANK',
      },
      {
        codigo: '748',
        nome: 'Banco Cooperativo Sicredi S.A.',
        codigo_interno: 'SICREDI_748',
      },
      {
        codigo: '752',
        nome: 'Banco BNP Paribas Brasil S.A.',
        codigo_interno: 'BNP_PARIBAS',
      },
      {
        codigo: '755',
        nome: 'Bank of America Merrill Lynch Banco Múltiplo S.A.',
        codigo_interno: 'BOFA',
      },
      {
        codigo: '756',
        nome: 'Banco Cooperativo do Brasil S.A. - BANCOOB',
        codigo_interno: 'BANCOOB',
      },
      {
        codigo: '757',
        nome: 'Banco KEB Hana do Brasil S.A.',
        codigo_interno: 'KEB_HANA',
      },
    ];

    try {
      const bancosToCreate = bancos.map((bancoData) =>
        this.bancoRepository.create({
          codigo: bancoData.codigo,
          nome: bancoData.nome,
          codigo_interno: bancoData.codigo_interno.substring(0, 20),
          status: StatusBanco.ATIVO,
          descricao: `Banco ${bancoData.nome} - Código FEBRABAN: ${bancoData.codigo}`,
        }),
      );

      await this.bancoRepository.save(bancosToCreate);

      console.log(`✅ ${bancosToCreate.length} bancos importados com sucesso!`);
    } catch (error) {
      console.error('❌ Erro ao importar bancos:', error);
      throw error;
    }
  }
}
