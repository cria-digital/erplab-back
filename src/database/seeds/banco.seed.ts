import { DataSource } from 'typeorm';
import {
  Banco,
  StatusBanco,
} from '../../modules/financeiro/core/entities/banco.entity';

export async function seedBancos(dataSource: DataSource): Promise<void> {
  const bancoRepository = dataSource.getRepository(Banco);

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
    { codigo: '021', nome: 'Banco Banestes S.A.', codigo_interno: 'BANESTES' },
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
    { codigo: '075', nome: 'Banco ABN Amro S.A.', codigo_interno: 'ABN_AMRO' },
    { codigo: '076', nome: 'Banco KDB do Brasil S.A.', codigo_interno: 'KDB' },
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
    { codigo: '081', nome: 'BancoSeguro S.A.', codigo_interno: 'BANCOSEGURO' },
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
    { codigo: '091', nome: 'Unicred Central RS', codigo_interno: 'UNICRED_RS' },
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
    { codigo: '120', nome: 'Banco Rodobens S.A.', codigo_interno: 'RODOBENS' },
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
    { codigo: '184', nome: 'Banco Itaú BBA S.A.', codigo_interno: 'ITAU_BBA' },
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
    { codigo: '212', nome: 'Banco Original S.A.', codigo_interno: 'ORIGINAL' },
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
    { codigo: '237', nome: 'Banco Bradesco S.A.', codigo_interno: 'BRADESCO' },
    { codigo: '241', nome: 'Banco Clássico S.A.', codigo_interno: 'CLASSICO' },
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
    { codigo: '364', nome: 'Gerencianet S.A.', codigo_interno: 'GERENCIANET' },
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
    { codigo: '369', nome: 'Banco Digimais S.A.', codigo_interno: 'DIGIMAIS' },
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
      codigo: '381',
      nome: 'Banco Bandepe S.A.',
      codigo_interno: 'BANDEPE_NOVO',
    },
    {
      codigo: '382',
      nome: 'Fiducia Sociedade de Crédito ao Microempreendedor',
      codigo_interno: 'FIDUCIA',
    },
    {
      codigo: '383',
      nome: 'Boletobancário.com Tecnologia de Pagamentos Ltda.',
      codigo_interno: 'JUNO',
    },
    {
      codigo: '384',
      nome: 'Global Finanças Sociedade de Crédito ao Microempreendedor',
      codigo_interno: 'GLOBAL',
    },
    {
      codigo: '385',
      nome: 'Cooperativa de Crédito Rural de São Miguel do Oeste',
      codigo_interno: 'CREDISULCA',
    },
    {
      codigo: '386',
      nome: 'Nu Financeira S.A. - Sociedade de Crédito, Financiamento e Investimento',
      codigo_interno: 'NU_FINANCEIRA',
    },
    {
      codigo: '387',
      nome: 'Atico Distribuidora de Títulos e Valores Mobiliários Ltda.',
      codigo_interno: 'ATICO',
    },
    {
      codigo: '389',
      nome: 'Banco Mercantil do Brasil S.A.',
      codigo_interno: 'MERCANTIL',
    },
    { codigo: '390', nome: 'Banco GM S.A.', codigo_interno: 'GM' },
    {
      codigo: '391',
      nome: 'Cooperativa de Crédito Rural de Ibiam - Sulcredi',
      codigo_interno: 'SULCREDI_IBIAM',
    },
    {
      codigo: '393',
      nome: 'BCN S.A. Crédito, Financiamento e Investimento',
      codigo_interno: 'BCN',
    },
    {
      codigo: '394',
      nome: 'Banco Bradesco Financiamentos S.A.',
      codigo_interno: 'BRADESCO_FINANCIAMENTOS',
    },
    {
      codigo: '395',
      nome: 'RB Capital Distribuidora de Títulos e Valores Mobiliários Ltda.',
      codigo_interno: 'RB_CAPITAL_DTVM',
    },
    { codigo: '396', nome: 'Hub Pagamentos S.A', codigo_interno: 'HUB' },
    {
      codigo: '397',
      nome: 'Listo Sociedade de Crédito Direto S.A.',
      codigo_interno: 'LISTO',
    },
    {
      codigo: '398',
      nome: 'Agillitas Sociedade de Crédito Direto S.A.',
      codigo_interno: 'AGILLITAS',
    },
    {
      codigo: '399',
      nome: 'Kirton Bank S.A. - Banco Múltiplo',
      codigo_interno: 'KIRTON',
    },
    {
      codigo: '400',
      nome: 'Caixa Econômica Federal',
      codigo_interno: 'CEF_DIGITAL',
    },
    { codigo: '401', nome: 'Social Bank S.A.', codigo_interno: 'SOCIAL_BANK' },
    {
      codigo: '402',
      nome: 'Cloud Walk Meios de Pagamento S.A.',
      codigo_interno: 'CLOUDWALK',
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
    {
      codigo: '406',
      nome: 'Accredito Sociedade de Crédito Direto S.A.',
      codigo_interno: 'ACCREDITO',
    },
    {
      codigo: '407',
      nome: 'Banco Inbursa S.A.',
      codigo_interno: 'INBURSA_407',
    },
    {
      codigo: '408',
      nome: 'BonusPago Sociedade de Crédito Direto S.A.',
      codigo_interno: 'BONUSPAGO',
    },
    {
      codigo: '410',
      nome: 'Planner Trustee Distribuidora de Títulos e Valores Mobiliários Ltda.',
      codigo_interno: 'PLANNER_TRUSTEE',
    },
    {
      codigo: '411',
      nome: 'Visto Sociedade de Crédito Direto S.A.',
      codigo_interno: 'VISTO',
    },
    { codigo: '412', nome: 'Banco Capital S.A.', codigo_interno: 'CAPITAL' },
    {
      codigo: '413',
      nome: 'Setor Sociedade de Crédito ao Microempreendedor e à Empresa de Pequeno Porte Ltda.',
      codigo_interno: 'SETOR',
    },
    {
      codigo: '414',
      nome: 'Vert Companhia Securitizadora',
      codigo_interno: 'VERT',
    },
    {
      codigo: '415',
      nome: 'Banco Plural S.A.',
      codigo_interno: 'PLURAL_BANCO',
    },
    {
      codigo: '416',
      nome: 'Azumi Distribuidora de Títulos e Valores Mobiliários Ltda.',
      codigo_interno: 'AZUMI',
    },
    {
      codigo: '418',
      nome: 'Zipdin Soluções Digitais Ltda.',
      codigo_interno: 'ZIPDIN',
    },
    {
      codigo: '419',
      nome: 'Fênix Distribuidora de Títulos e Valores Mobiliários Ltda.',
      codigo_interno: 'FENIX',
    },
    {
      codigo: '420',
      nome: 'Capitual Sociedade de Crédito Direto S.A.',
      codigo_interno: 'CAPITUAL',
    },
    {
      codigo: '421',
      nome: 'Clave Distribuidora de Títulos e Valores Mobiliários Ltda.',
      codigo_interno: 'CLAVE',
    },
    { codigo: '422', nome: 'Banco Safra S.A.', codigo_interno: 'SAFRA_422' },
    {
      codigo: '423',
      nome: 'Toro Investimentos S.A.',
      codigo_interno: 'TORO_INVESTIMENTOS',
    },
    {
      codigo: '424',
      nome: 'Zoop Tecnologia e Meios de Pagamento Ltda.',
      codigo_interno: 'ZOOP',
    },
    {
      codigo: '425',
      nome: 'Toro Bank S.A. - Banco Múltiplo',
      codigo_interno: 'TORO_BANK',
    },
    {
      codigo: '426',
      nome: 'Neon Financeira - Crédito, Financiamento e Investimento S.A.',
      codigo_interno: 'NEON_FINANCEIRA',
    },
    {
      codigo: '427',
      nome: 'Cooperativa de Crédito Rural de São Miguel do Oeste',
      codigo_interno: 'CRESOL_SMO',
    },
    {
      codigo: '428',
      nome: 'Cooperativa de Crédito Sicoob Creditapiranga',
      codigo_interno: 'SICOOB_CREDITAPIRANGA',
    },
    {
      codigo: '429',
      nome: 'Credicoamo Crédito Rural',
      codigo_interno: 'CREDICOAMO_429',
    },
    {
      codigo: '430',
      nome: 'Cooperativa de Crédito Rural Seara - Crediseara',
      codigo_interno: 'CREDISEARA',
    },
    {
      codigo: '432',
      nome: 'Fidúcia Sociedade de Crédito ao Microempreendedor e à Empresa de Pequeno Porte Ltda.',
      codigo_interno: 'FIDUCIA_432',
    },
    {
      codigo: '433',
      nome: 'Maru Sociedade de Crédito Direto S.A.',
      codigo_interno: 'MARU',
    },
    {
      codigo: '434',
      nome: 'Hashtag Sociedade de Crédito Direto S.A.',
      codigo_interno: 'HASHTAG',
    },
    {
      codigo: '435',
      nome: 'Banco do Estado do Pará S.A.',
      codigo_interno: 'BANPARA_435',
    },
    {
      codigo: '436',
      nome: 'Abn Amro Distribuidora de Títulos e Valores Mobiliários Ltda.',
      codigo_interno: 'ABN_AMRO_DTVM',
    },
    {
      codigo: '437',
      nome: 'ID Corretora de Títulos e Valores Mobiliários S.A.',
      codigo_interno: 'ID_CTVM',
    },
    {
      codigo: '438',
      nome: 'Lamara Sociedade de Crédito Direto S.A.',
      codigo_interno: 'LAMARA',
    },
    {
      codigo: '439',
      nome: 'Coocredlivre - Cooperativa de Economia e Crédito Mútuo',
      codigo_interno: 'COOCREDLIVRE',
    },
    {
      codigo: '440',
      nome: 'Credix Sociedade de Crédito Direto S.A.',
      codigo_interno: 'CREDIX',
    },
    {
      codigo: '441',
      nome: 'Liga Investimentos - Distribuidora de Títulos e Valores Mobiliários Ltda.',
      codigo_interno: 'LIGA',
    },
    {
      codigo: '442',
      nome: 'Galapagos Capital Distribuidora de Títulos e Valores Mobiliários S.A.',
      codigo_interno: 'GALAPAGOS',
    },
    {
      codigo: '443',
      nome: 'Coop de Crédito de Livre Admissão do Vale do Itajaí',
      codigo_interno: 'VIACREDI',
    },
    {
      codigo: '444',
      nome: 'Work Sociedade de Crédito Direto S.A.',
      codigo_interno: 'WORK',
    },
    {
      codigo: '445',
      nome: 'Santinvest S.A - Crédito, Financiamento e Investimentos',
      codigo_interno: 'SANTINVEST',
    },
    {
      codigo: '446',
      nome: 'Trinus Sociedade de Crédito Direto S.A.',
      codigo_interno: 'TRINUS_SCD',
    },
    {
      codigo: '447',
      nome: 'Mirae Asset Wealth Management (Brazil) CTVM Ltda.',
      codigo_interno: 'MIRAE',
    },
    {
      codigo: '448',
      nome: 'Flagpay Instituição de Pagamento Ltda.',
      codigo_interno: 'FLAGPAY',
    },
    { codigo: '449', nome: 'AL5 Bank S.A.', codigo_interno: 'AL5' },
    {
      codigo: '450',
      nome: 'Fitbank Pagamentos Eletrônicos S.A.',
      codigo_interno: 'FITBANK',
    },
    {
      codigo: '451',
      nome: 'Cdt Distribuidora de Títulos e Valores Mobiliários Ltda.',
      codigo_interno: 'CDT',
    },
    {
      codigo: '452',
      nome: 'Neon Pagamentos S.A.',
      codigo_interno: 'NEON_PAGAMENTOS',
    },
    {
      codigo: '453',
      nome: 'Dinheiro Certo Sociedade de Crédito ao Microempreendedor e à Empresa de Pequeno Porte Ltda.',
      codigo_interno: 'DINHEIRO_CERTO',
    },
    {
      codigo: '454',
      nome: 'Beblue Soluções em Incentivos S.A.',
      codigo_interno: 'BEBLUE',
    },
    {
      codigo: '455',
      nome: 'Kiri Meios de Pagamento S.A.',
      codigo_interno: 'KIRI',
    },
    { codigo: '456', nome: 'Banco MUFG Brasil S.A.', codigo_interno: 'MUFG' },
    {
      codigo: '457',
      nome: 'UY3 Sociedade de Crédito Direto S.A.',
      codigo_interno: 'UY3',
    },
    {
      codigo: '458',
      nome: 'Portoseg S.A. Crédito Financiamento e Investimento',
      codigo_interno: 'PORTOSEG',
    },
    {
      codigo: '459',
      nome: 'BCR - Sociedade de Crédito Direto S.A.',
      codigo_interno: 'BCR',
    },
    {
      codigo: '460',
      nome: 'F.D Gold Distribuidora de Títulos e Valores Mobiliários Ltda.',
      codigo_interno: 'FDGOLD',
    },
    {
      codigo: '461',
      nome: 'Asaas Gestão Financeira e Pagamentos S.A.',
      codigo_interno: 'ASAAS_461',
    },
    {
      codigo: '462',
      nome: 'Capim Instituição de Pagamento S.A.',
      codigo_interno: 'CAPIM',
    },
    {
      codigo: '463',
      nome: 'Modalmais Distribuidora de Títulos e Valores Mobiliários Ltda.',
      codigo_interno: 'MODALMAIS',
    },
    {
      codigo: '464',
      nome: 'Banco Sumitomo Mitsui Brasileiro S.A.',
      codigo_interno: 'SUMITOMO',
    },
    {
      codigo: '465',
      nome: 'Delcred Sociedade de Crédito Direto S.A.',
      codigo_interno: 'DELCRED',
    },
    {
      codigo: '467',
      nome: 'K2 Partnering Solutions S.A.',
      codigo_interno: 'K2',
    },
    {
      codigo: '468',
      nome: 'Portocred S.A. - Sociedade de Crédito ao Microempreendedor e Empresa de Pequeno Porte',
      codigo_interno: 'PORTOCRED_468',
    },
    {
      codigo: '469',
      nome: 'RJI Corretora de Títulos e Valores Mobiliários Ltda.',
      codigo_interno: 'RJI',
    },
    {
      codigo: '470',
      nome: 'CDC Sociedade de Crédito ao Microempreendedor e à Empresa de Pequeno Porte Ltda.',
      codigo_interno: 'CDC',
    },
    {
      codigo: '471',
      nome: 'Pronto Credito Sociedade de Crédito ao Microempreendedor e Empresa de Pequeno Porte Ltda.',
      codigo_interno: 'PRONTO_CREDITO',
    },
    {
      codigo: '472',
      nome: 'J17 - Sociedade de Crédito Direto S.A.',
      codigo_interno: 'J17',
    },
    {
      codigo: '473',
      nome: 'Banco Original do Agronegócio S.A.',
      codigo_interno: 'ORIGINAL_AGRO_473',
    },
    {
      codigo: '474',
      nome: 'Pagseguro Internet S.A.',
      codigo_interno: 'PAGSEGURO_474',
    },
    {
      codigo: '475',
      nome: 'Aditum Sociedade de Crédito Direto S.A.',
      codigo_interno: 'ADITUM',
    },
    {
      codigo: '476',
      nome: 'Valor Sociedade de Crédito Direto S.A.',
      codigo_interno: 'VALOR_SCD',
    },
    { codigo: '477', nome: 'Banco BV S.A.', codigo_interno: 'BV' },
    {
      codigo: '478',
      nome: 'Gazincred S.A. Sociedade de Crédito, Financiamento e Investimento',
      codigo_interno: 'GAZINCRED',
    },
    { codigo: '479', nome: 'Banco ItauBank S.A.', codigo_interno: 'ITAUBANK' },
    {
      codigo: '480',
      nome: 'Laqus Sociedade de Crédito Direto S.A.',
      codigo_interno: 'LAQUS',
    },
    {
      codigo: '481',
      nome: 'Superlógica Sociedade de Crédito Direto S.A.',
      codigo_interno: 'SUPERLOGICA',
    },
    {
      codigo: '482',
      nome: 'Celcoin Instituição de Pagamento S.A.',
      codigo_interno: 'CELCOIN',
    },
    {
      codigo: '483',
      nome: 'Seil Distribuidora de Títulos e Valores Mobiliários Ltda.',
      codigo_interno: 'SEIL',
    },
    {
      codigo: '484',
      nome: 'Ahatah Meios de Pagamento S.A.',
      codigo_interno: 'AHATAH',
    },
    { codigo: '485', nome: 'Banco Master S.A.', codigo_interno: 'MASTER' },
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
      codigo: '489',
      nome: 'Hawk Sociedade de Crédito Direto S.A.',
      codigo_interno: 'HAWK',
    },
    {
      codigo: '490',
      nome: 'Cobuccio Sociedade de Crédito Direto S.A.',
      codigo_interno: 'COBUCCIO',
    },
    {
      codigo: '491',
      nome: 'Next Bank (Banco do Brasil)',
      codigo_interno: 'NEXT',
    },
    {
      codigo: '492',
      nome: 'Coop de Crédito da Região da Mogiana',
      codigo_interno: 'MOGIANA',
    },
    {
      codigo: '493',
      nome: 'Pagar.me Instituição de Pagamento S.A.',
      codigo_interno: 'PAGARME',
    },
    {
      codigo: '494',
      nome: 'Coop de Economia e Crédito Mútuo dos Médicos',
      codigo_interno: 'UNICRED_MEDICOS',
    },
    {
      codigo: '495',
      nome: 'Will S.A. Meios de Pagamento',
      codigo_interno: 'WILL',
    },
    {
      codigo: '496',
      nome: 'B&A Sociedade de Crédito Direto S.A.',
      codigo_interno: 'BA_SCD',
    },
    {
      codigo: '497',
      nome: 'Pinbank Brasil Instituição de Pagamento S.A.',
      codigo_interno: 'PINBANK',
    },
    {
      codigo: '498',
      nome: 'Tpag Instituição de Pagamento S.A.',
      codigo_interno: 'TPAG',
    },
    {
      codigo: '499',
      nome: 'Finvest Distribuidora de Títulos e Valores Mobiliários Ltda.',
      codigo_interno: 'FINVEST',
    },
    { codigo: '500', nome: 'Banco Sistema S.A.', codigo_interno: 'SISTEMA' },
    {
      codigo: '501',
      nome: 'Magnetis Gestora de Recursos Ltda.',
      codigo_interno: 'MAGNETIS',
    },
    {
      codigo: '502',
      nome: 'Grupo Travessia Sociedade de Crédito Direto S.A.',
      codigo_interno: 'TRAVESSIA',
    },
    {
      codigo: '503',
      nome: 'BRL Trust Serviços Fiduciários e Participações Ltda.',
      codigo_interno: 'BRL_TRUST_503',
    },
    {
      codigo: '504',
      nome: 'Syngenta Sociedade de Crédito, Financiamento e Investimento S.A.',
      codigo_interno: 'SYNGENTA',
    },
    {
      codigo: '505',
      nome: 'Credit Agricole Brasil S.A. Distribuidora de Títulos e Valores Mobiliários',
      codigo_interno: 'CREDIT_AGRICOLE_DTVM',
    },
    {
      codigo: '506',
      nome: 'Intercam Corretora de Câmbio Ltda.',
      codigo_interno: 'INTERCAM',
    },
    {
      codigo: '507',
      nome: 'Trustee Serviços Fiduciários Distribuidora de Títulos e Valores Mobiliários S.A.',
      codigo_interno: 'TRUSTEE',
    },
    {
      codigo: '508',
      nome: 'Avenue Securities Distribuidora de Títulos e Valores Mobiliários Ltda.',
      codigo_interno: 'AVENUE',
    },
    {
      codigo: '509',
      nome: 'Celero Sociedade de Crédito Direto S.A.',
      codigo_interno: 'CELERO',
    },
    {
      codigo: '510',
      nome: 'Excelsior Sociedade de Crédito Direto S.A.',
      codigo_interno: 'EXCELSIOR',
    },
    {
      codigo: '511',
      nome: 'Pallit Instituição de Pagamento S.A.',
      codigo_interno: 'PALLIT',
    },
    {
      codigo: '512',
      nome: 'Youse Sociedade de Crédito Direto S.A.',
      codigo_interno: 'YOUSE',
    },
    {
      codigo: '513',
      nome: 'Iti Instituição de Pagamento S.A.',
      codigo_interno: 'ITI',
    },
    {
      codigo: '514',
      nome: 'Ewally Instituição de Pagamento S.A.',
      codigo_interno: 'EWALLY',
    },
    { codigo: '515', nome: 'Blu Pagamentos S.A.', codigo_interno: 'BLU' },
    {
      codigo: '517',
      nome: 'Klavi Sociedade de Crédito Direto S.A.',
      codigo_interno: 'KLAVI',
    },
    {
      codigo: '518',
      nome: 'Zipay Soluções Digitais S.A.',
      codigo_interno: 'ZIPAY',
    },
    {
      codigo: '519',
      nome: 'Aticca Sociedade de Crédito Direto S.A.',
      codigo_interno: 'ATICCA',
    },
    {
      codigo: '520',
      nome: 'Efisa Sociedade de Crédito ao Microempreendedor e à Empresa de Pequeno Porte Ltda.',
      codigo_interno: 'EFISA',
    },
    {
      codigo: '521',
      nome: 'Prover Instituição de Pagamento S.A.',
      codigo_interno: 'PROVER',
    },
    {
      codigo: '522',
      nome: 'Red Sociedade de Crédito ao Microempreendedor e Empresa de Pequeno Porte Ltda.',
      codigo_interno: 'RED',
    },
    {
      codigo: '523',
      nome: 'Azimut Brasil Distribuidora de Títulos e Valores Mobiliários Ltda.',
      codigo_interno: 'AZIMUT',
    },
    {
      codigo: '524',
      nome: 'Darwin Agência de Serviços Societários Ltda.',
      codigo_interno: 'DARWIN',
    },
    { codigo: '525', nome: 'TG Core Asset Ltda.', codigo_interno: 'TG_CORE' },
    {
      codigo: '526',
      nome: 'Cooperativa de Crédito do Centro Norte do Brasil',
      codigo_interno: 'SICOOB_CENTRO_NORTE',
    },
    {
      codigo: '527',
      nome: 'Livebank Instituição de Pagamento S.A.',
      codigo_interno: 'LIVEBANK',
    },
    {
      codigo: '528',
      nome: 'Grafeno Sociedade de Crédito Direto S.A.',
      codigo_interno: 'GRAFENO',
    },
    {
      codigo: '529',
      nome: 'Somapay Soluções em Pagamentos S.A.',
      codigo_interno: 'SOMAPAY',
    },
    {
      codigo: '530',
      nome: 'Pi Pagamentos S.A.',
      codigo_interno: 'PI_PAGAMENTOS',
    },
    {
      codigo: '531',
      nome: 'Federal Corretora de Câmbio Ltda.',
      codigo_interno: 'FEDERAL',
    },
    {
      codigo: '532',
      nome: 'Recargapay Instituição de Pagamento S.A.',
      codigo_interno: 'RECARGAPAY',
    },
    {
      codigo: '533',
      nome: 'Agipar Corretora de Câmbio Ltda.',
      codigo_interno: 'AGIPAR',
    },
    {
      codigo: '534',
      nome: 'Intercam Sociedade de Crédito Direto S.A.',
      codigo_interno: 'INTERCAM_SCD',
    },
    {
      codigo: '535',
      nome: 'Stark Sociedade de Crédito Direto S.A.',
      codigo_interno: 'STARK',
    },
    {
      codigo: '536',
      nome: 'Financiamentos S.A. Crédito, Financiamento e Investimento',
      codigo_interno: 'FINANCIAMENTOS',
    },
    {
      codigo: '537',
      nome: 'Jeitto Instituição de Pagamento S.A.',
      codigo_interno: 'JEITTO',
    },
    {
      codigo: '538',
      nome: 'Transfeera Serviços de Pagamento S.A.',
      codigo_interno: 'TRANSFEERA',
    },
    {
      codigo: '539',
      nome: 'Credpay Fomento Mercantil Ltda.',
      codigo_interno: 'CREDPAY',
    },
    {
      codigo: '540',
      nome: 'Sidebank Sociedade de Crédito Direto S.A.',
      codigo_interno: 'SIDEBANK',
    },
    {
      codigo: '541',
      nome: 'Peak Sociedade de Empréstimo Entre Pessoas S.A.',
      codigo_interno: 'PEAK',
    },
    {
      codigo: '542',
      nome: 'Fulano Sociedade de Crédito Direto S.A.',
      codigo_interno: 'FULANO',
    },
    {
      codigo: '543',
      nome: 'Iouu Instituição de Pagamento S.A.',
      codigo_interno: 'IOUU',
    },
    {
      codigo: '544',
      nome: 'M4 Produtos e Serviços S.A.',
      codigo_interno: 'M4',
    },
    {
      codigo: '545',
      nome: 'Ourocard S.A. Crédito Financiamento e Investimento',
      codigo_interno: 'OUROCARD',
    },
    {
      codigo: '546',
      nome: 'Uzzipay Instituição de Pagamento S.A.',
      codigo_interno: 'UZZIPAY',
    },
    {
      codigo: '547',
      nome: 'U4C Instituição de Pagamento S.A.',
      codigo_interno: 'U4C',
    },
    { codigo: '548', nome: 'Multipag S.A.', codigo_interno: 'MULTIPAG' },
    {
      codigo: '549',
      nome: 'Saldo Sociedade de Crédito Direto S.A.',
      codigo_interno: 'SALDO',
    },
    {
      codigo: '550',
      nome: 'Cash Way Instituição de Pagamento S.A.',
      codigo_interno: 'CASHWAY',
    },
    {
      codigo: '551',
      nome: 'Boa Vista Sociedade de Crédito Direto S.A.',
      codigo_interno: 'BOAVISTA',
    },
    {
      codigo: '552',
      nome: 'Worldline Instituição de Pagamento S.A.',
      codigo_interno: 'WORLDLINE',
    },
    {
      codigo: '553',
      nome: 'Diin Sociedade de Crédito Direto S.A.',
      codigo_interno: 'DIIN',
    },
    {
      codigo: '554',
      nome: 'Biorc Instituição de Pagamento S.A.',
      codigo_interno: 'BIORC',
    },
    {
      codigo: '555',
      nome: 'Credifit Sociedade de Crédito Direto S.A.',
      codigo_interno: 'CREDIFIT',
    },
    {
      codigo: '556',
      nome: 'Multicred Sociedade de Crédito Direto S.A.',
      codigo_interno: 'MULTICRED',
    },
    {
      codigo: '557',
      nome: 'Efipay Instituição de Pagamento S.A.',
      codigo_interno: 'EFIPAY',
    },
    {
      codigo: '558',
      nome: 'Hvb Sociedade de Crédito Direto S.A.',
      codigo_interno: 'HVB',
    },
    { codigo: '559', nome: 'Vero Pagamentos S.A.', codigo_interno: 'VERO' },
    {
      codigo: '560',
      nome: 'Coop de Crédito Rural de Primavera do Leste',
      codigo_interno: 'PRIMACREDI_560',
    },
    {
      codigo: '561',
      nome: 'Cooperativa de Crédito do Médio Alto Uruguai',
      codigo_interno: 'SICREDI_MAU',
    },
    {
      codigo: '562',
      nome: 'Cooperativa de Crédito Rural de Lajeado',
      codigo_interno: 'CREDILAJE',
    },
    {
      codigo: '563',
      nome: 'Cooperativa de Crédito de Livre Admissão de Associados',
      codigo_interno: 'SICOOB_LIVRE',
    },
    {
      codigo: '564',
      nome: 'Viabill Instituição de Pagamento S.A.',
      codigo_interno: 'VIABILL',
    },
    {
      codigo: '565',
      nome: 'Credfit Sociedade de Crédito ao Microempreendedor e Empresa de Pequeno Porte Ltda.',
      codigo_interno: 'CREDFIT_SCMEPP',
    },
    { codigo: '566', nome: 'U.pay S.A.', codigo_interno: 'UPAY' },
    {
      codigo: '567',
      nome: 'Bloxs Instituição de Pagamento S.A.',
      codigo_interno: 'BLOXS',
    },
    {
      codigo: '568',
      nome: 'Quanto Sociedade de Crédito Direto S.A.',
      codigo_interno: 'QUANTO',
    },
    {
      codigo: '569',
      nome: 'Dmcard Instituição de Pagamento S.A.',
      codigo_interno: 'DMCARD',
    },
    {
      codigo: '570',
      nome: 'Lett Sociedade de Crédito Direto S.A.',
      codigo_interno: 'LETT',
    },
    {
      codigo: '571',
      nome: 'Sbcash Sociedade de Crédito Direto S.A.',
      codigo_interno: 'SBCASH',
    },
    {
      codigo: '572',
      nome: 'Upcred Sociedade de Crédito ao Microempreendedor e a Empresa de Pequeno Porte',
      codigo_interno: 'UPCRED',
    },
    {
      codigo: '573',
      nome: 'Reag Distribuidora de Títulos e Valores Mobiliários S.A.',
      codigo_interno: 'REAG',
    },
    {
      codigo: '574',
      nome: 'Unavanti Instituição de Pagamento S.A.',
      codigo_interno: 'UNAVANTI',
    },
    {
      codigo: '575',
      nome: 'Tpay Instituição de Pagamento S.A.',
      codigo_interno: 'TPAY_575',
    },
    {
      codigo: '576',
      nome: 'Toka Sociedade de Crédito Direto S.A.',
      codigo_interno: 'TOKA',
    },
    {
      codigo: '577',
      nome: 'Fortbrasil Administradora de Cartões de Crédito S.A.',
      codigo_interno: 'FORTBRASIL',
    },
    {
      codigo: '578',
      nome: 'Ewally Sociedade de Crédito Direto S.A.',
      codigo_interno: 'EWALLY_SCD',
    },
    {
      codigo: '579',
      nome: 'Take Blip Sociedade de Crédito Direto S.A.',
      codigo_interno: 'TAKE_BLIP',
    },
    {
      codigo: '580',
      nome: 'Liber Instituição de Pagamento S.A.',
      codigo_interno: 'LIBER',
    },
    {
      codigo: '581',
      nome: 'Nox Sociedade de Crédito Direto S.A.',
      codigo_interno: 'NOX',
    },
    {
      codigo: '582',
      nome: 'Paypal do Brasil Instituição de Pagamento Ltda.',
      codigo_interno: 'PAYPAL',
    },
    {
      codigo: '583',
      nome: 'I9pay Instituição de Pagamento S.A.',
      codigo_interno: 'I9PAY',
    },
    {
      codigo: '584',
      nome: 'Global Payments do Brasil Instituição de Pagamento S.A.',
      codigo_interno: 'GLOBAL_PAYMENTS',
    },
    {
      codigo: '585',
      nome: 'Dinheire.com Instituição de Pagamento S.A.',
      codigo_interno: 'DINHEIRE',
    },
    {
      codigo: '586',
      nome: 'Vero Sociedade de Crédito Direto S.A.',
      codigo_interno: 'VERO_SCD',
    },
    {
      codigo: '587',
      nome: 'Paytithe Instituição de Pagamento S.A.',
      codigo_interno: 'PAYTITHE',
    },
    {
      codigo: '588',
      nome: 'Bankly Instituição de Pagamento S.A.',
      codigo_interno: 'BANKLY',
    },
    {
      codigo: '589',
      nome: 'Dime Instituição de Pagamento S.A.',
      codigo_interno: 'DIME',
    },
    {
      codigo: '590',
      nome: 'Vortx Serviços Fiduciários Ltda.',
      codigo_interno: 'VORTX_SERVICOS',
    },
    {
      codigo: '591',
      nome: 'Mais Invest Distribuidora de Títulos e Valores Mobiliários S.A.',
      codigo_interno: 'MAIS_INVEST',
    },
    {
      codigo: '592',
      nome: 'Asaas Instituição de Pagamento S.A.',
      codigo_interno: 'ASAAS_IP',
    },
    {
      codigo: '593',
      nome: 'Magnum Sociedade de Crédito Direto S.A.',
      codigo_interno: 'MAGNUM',
    },
    {
      codigo: '594',
      nome: 'Nexoos Sociedade de Crédito Direto S.A.',
      codigo_interno: 'NEXOOS',
    },
    {
      codigo: '595',
      nome: 'Blu Financeira Sociedade de Crédito Direto S.A.',
      codigo_interno: 'BLU_FINANCEIRA',
    },
    {
      codigo: '596',
      nome: 'Kante Sociedade de Crédito Direto S.A.',
      codigo_interno: 'KANTE',
    },
    {
      codigo: '597',
      nome: 'Cashin Soluções Financeiras Instituição de Pagamento S.A.',
      codigo_interno: 'CASHIN',
    },
    {
      codigo: '598',
      nome: 'Crediare Sociedade de Crédito ao Microempreendedor e à Empresa de Pequeno Porte Ltda.',
      codigo_interno: 'CREDIARE',
    },
    {
      codigo: '599',
      nome: 'Zipdin Instituição de Pagamento S.A.',
      codigo_interno: 'ZIPDIN_IP',
    },
    {
      codigo: '600',
      nome: 'Lanistar Instituição de Pagamento S.A.',
      codigo_interno: 'LANISTAR',
    },
    {
      codigo: '601',
      nome: 'Brl Administradora de Consorcios Ltda.',
      codigo_interno: 'BRL_CONSORCIOS',
    },
    {
      codigo: '602',
      nome: 'Laqus Instituição de Pagamento S.A.',
      codigo_interno: 'LAQUS_IP',
    },
    {
      codigo: '603',
      nome: 'Yuno Instituição de Pagamento S.A.',
      codigo_interno: 'YUNO',
    },
    {
      codigo: '604',
      nome: 'Industrial do Brasil S.A.',
      codigo_interno: 'INDUSTRIAL',
    },
    {
      codigo: '605',
      nome: 'Aqua Sociedade de Crédito Direto S.A.',
      codigo_interno: 'AQUA',
    },
    { codigo: '606', nome: 'Banco Bari S.A.', codigo_interno: 'BARI_BANCO' },
    {
      codigo: '607',
      nome: 'Banco do Estado do Espírito Santo S.A.',
      codigo_interno: 'BANESTES_607',
    },
    { codigo: '608', nome: 'Hipercard S.A.', codigo_interno: 'HIPERCARD_608' },
    {
      codigo: '609',
      nome: 'Parana Meios de Pagamento S.A.',
      codigo_interno: 'PARANA_PAGAMENTOS',
    },
    { codigo: '610', nome: 'Banco VR S.A.', codigo_interno: 'VR' },
    { codigo: '611', nome: 'Banco Paulista S.A.', codigo_interno: 'PAULISTA' },
    {
      codigo: '612',
      nome: 'Banco Guanabara S.A.',
      codigo_interno: 'GUANABARA',
    },
    { codigo: '613', nome: 'Omni Banco S.A.', codigo_interno: 'OMNI' },
    {
      codigo: '614',
      nome: 'Somos Instituição de Pagamento S.A.',
      codigo_interno: 'SOMOS',
    },
    {
      codigo: '615',
      nome: 'Crefisa Sociedade de Crédito ao Microempreendedor e à Empresa de Pequeno Porte S.A.',
      codigo_interno: 'CREFISA_SCMEPP',
    },
    {
      codigo: '616',
      nome: 'Cooperativa de Crédito Empresarial',
      codigo_interno: 'SICOOB_EMPRESARIAL',
    },
    {
      codigo: '617',
      nome: 'Money Plus Sociedade de Crédito ao Microempreendedor',
      codigo_interno: 'MONEY_PLUS_617',
    },
    {
      codigo: '618',
      nome: 'Sax S.A. Crédito, Financiamento e Investimento',
      codigo_interno: 'SAX',
    },
    {
      codigo: '619',
      nome: 'Aqua Cred Sociedade de Crédito ao Microempreendedor e à Empresa de Pequeno Porte Ltda.',
      codigo_interno: 'AQUA_CRED',
    },
    {
      codigo: '620',
      nome: 'Vips Instituição de Pagamento S.A.',
      codigo_interno: 'VIPS_IP',
    },
    {
      codigo: '621',
      nome: 'Realize Instituição de Pagamento S.A.',
      codigo_interno: 'REALIZE_IP',
    },
    {
      codigo: '622',
      nome: 'Connectpay Instituição de Pagamento S.A.',
      codigo_interno: 'CONNECTPAY',
    },
    { codigo: '623', nome: 'Banco Pan S.A.', codigo_interno: 'PAN' },
    {
      codigo: '624',
      nome: 'Capemisa Seguradora de Vida e Previdência S.A.',
      codigo_interno: 'CAPEMISA',
    },
    {
      codigo: '625',
      nome: 'Icatu Vanguarda Gestão de Recursos Ltda.',
      codigo_interno: 'ICATU',
    },
    { codigo: '626', nome: 'Banco Ficsa S.A.', codigo_interno: 'FICSA' },
    {
      codigo: '627',
      nome: 'Salic Instituição de Pagamento S.A.',
      codigo_interno: 'SALIC',
    },
    {
      codigo: '628',
      nome: 'Mobiup Instituição de Pagamento S.A.',
      codigo_interno: 'MOBIUP',
    },
    {
      codigo: '629',
      nome: 'Brasil Card Administradora de Cartão de Crédito Ltda.',
      codigo_interno: 'BRASIL_CARD',
    },
    { codigo: '630', nome: 'Intercap S.A.', codigo_interno: 'INTERCAP' },
    {
      codigo: '631',
      nome: 'Credsystem Administradora de Cartões de Crédito Ltda.',
      codigo_interno: 'CREDSYSTEM',
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
    {
      codigo: '636',
      nome: 'Banco Bradesco S.A.',
      codigo_interno: 'BRADESCO_636',
    },
    { codigo: '637', nome: 'Banco Sofisa S.A.', codigo_interno: 'SOFISA' },
    { codigo: '638', nome: 'Banco Pine S.A.', codigo_interno: 'PINE' },
    { codigo: '639', nome: 'Banco Itaucard S.A.', codigo_interno: 'ITAUCARD' },
    {
      codigo: '640',
      nome: 'Banco de Câmbio Intl S.A.',
      codigo_interno: 'INTL',
    },
    { codigo: '641', nome: 'Banco Alvorada S.A.', codigo_interno: 'ALVORADA' },
    {
      codigo: '642',
      nome: 'Captalys Companhia de Crédito',
      codigo_interno: 'CAPTALYS',
    },
    { codigo: '643', nome: 'Banco Pine S.A.', codigo_interno: 'PINE_643' },
    {
      codigo: '644',
      nome: 'Woop Sicredi Securities S.A. CTVM',
      codigo_interno: 'WOOP',
    },
    {
      codigo: '645',
      nome: 'Gazin Administradora de Consórcios Ltda.',
      codigo_interno: 'GAZIN',
    },
    {
      codigo: '646',
      nome: 'Creditas Comp. Hipotecária',
      codigo_interno: 'CREDITAS_CH',
    },
    {
      codigo: '647',
      nome: 'Gaia Agente Autônomo de Investimento Ltda.',
      codigo_interno: 'GAIA',
    },
    { codigo: '648', nome: 'Multipla S.A.', codigo_interno: 'MULTIPLA' },
    {
      codigo: '649',
      nome: 'Hemera Distribuidora de Títulos e Valores Mobiliários Ltda.',
      codigo_interno: 'HEMERA',
    },
    {
      codigo: '650',
      nome: 'Digitopay Instituição de Pagamento S.A.',
      codigo_interno: 'DIGITOPAY',
    },
    { codigo: '651', nome: 'Banco Xp S.A.', codigo_interno: 'XP_651' },
    {
      codigo: '652',
      nome: 'Banco Itaú Consignado S.A.',
      codigo_interno: 'ITAU_CONSIGNADO_652',
    },
    { codigo: '653', nome: 'Banco Indusval S.A.', codigo_interno: 'INDUSVAL' },
    { codigo: '654', nome: 'Banco A.J.Renner S.A.', codigo_interno: 'RENNER' },
    {
      codigo: '655',
      nome: 'Banco Votorantim S.A.',
      codigo_interno: 'VOTORANTIM',
    },
    {
      codigo: '656',
      nome: 'Banco Digimais S.A.',
      codigo_interno: 'DIGIMAIS_656',
    },
    { codigo: '657', nome: 'Banco Neon S.A.', codigo_interno: 'NEON' },
    {
      codigo: '658',
      nome: 'Banco Porto Real de Investimentos S.A.',
      codigo_interno: 'PORTO_REAL',
    },
    { codigo: '659', nome: 'Zema Financeira S.A.', codigo_interno: 'ZEMA_659' },
    {
      codigo: '660',
      nome: 'Dila Instituição de Pagamento S.A.',
      codigo_interno: 'DILA',
    },
    {
      codigo: '661',
      nome: 'Duo Instituição de Pagamento S.A.',
      codigo_interno: 'DUO',
    },
    {
      codigo: '662',
      nome: 'Ivix Instituição de Pagamento S.A.',
      codigo_interno: 'IVIX',
    },
    {
      codigo: '663',
      nome: 'Choice Instituição de Pagamento S.A.',
      codigo_interno: 'CHOICE',
    },
    {
      codigo: '664',
      nome: 'Cash3 Soluções Financeiras S.A.',
      codigo_interno: 'CASH3',
    },
    {
      codigo: '665',
      nome: 'Stone Sociedade de Crédito Direto S.A.',
      codigo_interno: 'STONE_SCD',
    },
    {
      codigo: '666',
      nome: 'BR Instituição de Pagamento S.A.',
      codigo_interno: 'BR_IP',
    },
    {
      codigo: '667',
      nome: 'Martello Instituição de Pagamento S.A.',
      codigo_interno: 'MARTELLO',
    },
    {
      codigo: '668',
      nome: 'Delfin Instituição de Pagamento S.A.',
      codigo_interno: 'DELFIN',
    },
    {
      codigo: '669',
      nome: 'Conductor Instituição de Pagamento S.A.',
      codigo_interno: 'CONDUCTOR',
    },
    {
      codigo: '670',
      nome: 'Omni Companhia Securitizadora de Créditos Financeiros',
      codigo_interno: 'OMNI_SECURITIZADORA',
    },
    {
      codigo: '671',
      nome: 'Santana S.A. - Crédito, Financiamento e Investimento',
      codigo_interno: 'SANTANA',
    },
    {
      codigo: '672',
      nome: 'TC Administradora de Cartões Ltda.',
      codigo_interno: 'TC',
    },
    {
      codigo: '673',
      nome: 'Banco do Estado de Sergipe S.A.',
      codigo_interno: 'BANESE_673',
    },
    {
      codigo: '674',
      nome: 'Banco Itaú Argentina S.A.',
      codigo_interno: 'ITAU_ARGENTINA',
    },
    {
      codigo: '675',
      nome: 'Abn Amro Brasil Dois Participações S.A.',
      codigo_interno: 'ABN_AMRO_PART',
    },
    { codigo: '676', nome: 'Banco J. Safra S.A.', codigo_interno: 'SAFRA_676' },
    {
      codigo: '677',
      nome: 'Banco Nacional de Desenvolvimento Econômico e Social - BNDES',
      codigo_interno: 'BNDES_677',
    },
    {
      codigo: '678',
      nome: 'Kirton Capital - Distribuidora de Títulos e Valores Mobiliários S.A.',
      codigo_interno: 'KIRTON_CAPITAL',
    },
    {
      codigo: '679',
      nome: 'Cooperativa de Economia e Crédito Mútuo Aliança Coopernitro',
      codigo_interno: 'COOPERNITRO',
    },
    {
      codigo: '680',
      nome: 'Finamax S.A. Crédito Financiamento e Investimento',
      codigo_interno: 'FINAMAX',
    },
    {
      codigo: '682',
      nome: 'Cooperativa de Crédito Mútuo dos Integrantes das Instituições Públicas de Ensino Superior',
      codigo_interno: 'UNICRED_ENSINO',
    },
    {
      codigo: '683',
      nome: 'Santander Securities Services Brasil Distribuidora de Títulos e Valores Mobiliários S.A.',
      codigo_interno: 'SANTANDER_SECURITIES',
    },
    {
      codigo: '684',
      nome: 'Uniprime Do Brasil - Confederação Nacional das Cooperativas Centrais Unicred Ltda.',
      codigo_interno: 'UNIPRIME_BRASIL',
    },
    {
      codigo: '685',
      nome: 'Cooperativa Central de Crédito Urbano',
      codigo_interno: 'CECRED_685',
    },
    {
      codigo: '686',
      nome: 'Cooperativa de Crédito dos Empresários',
      codigo_interno: 'SICOOB_EMPRESARIOS',
    },
    {
      codigo: '687',
      nome: 'Cooperativa de Crédito dos Empresários de Guarulhos',
      codigo_interno: 'SICOOB_GUARULHOS',
    },
    {
      codigo: '688',
      nome: 'Banco BNP Paribas Brasil S.A.',
      codigo_interno: 'BNP_PARIBAS',
    },
    {
      codigo: '689',
      nome: 'Cooperativa de Crédito Poupança e Investimento',
      codigo_interno: 'SICREDI_INVESTIMENTO',
    },
    {
      codigo: '690',
      nome: 'Cooperativa de Crédito Poupança e Serviços Financeiros do Centro Norte do Brasil',
      codigo_interno: 'SICOOB_CENTRO_NORTE_690',
    },
    {
      codigo: '691',
      nome: 'Efx Corretora de Cambio Ltda.',
      codigo_interno: 'EFX',
    },
    {
      codigo: '692',
      nome: 'Lastro Credenciária Ltda.',
      codigo_interno: 'LASTRO_CREDENCIARIA',
    },
    {
      codigo: '693',
      nome: 'Fram Distribuidora de Títulos e Valores Mobiliários Ltda.',
      codigo_interno: 'FRAM_DTVM',
    },
    {
      codigo: '694',
      nome: 'Inteligência Financeira Gestão de Recursos Ltda.',
      codigo_interno: 'INTELIGENCIA',
    },
    {
      codigo: '695',
      nome: 'HR Digital S.A. Instituição de Pagamento',
      codigo_interno: 'HR_DIGITAL',
    },
    {
      codigo: '696',
      nome: 'Reluz Sociedade de Crédito ao Microempreendedor e à Empresa de Pequeno Porte S.A.',
      codigo_interno: 'RELUZ',
    },
    {
      codigo: '697',
      nome: 'Fenacon Administradora de Consórcios Ltda.',
      codigo_interno: 'FENACON',
    },
    {
      codigo: '698',
      nome: 'BR Consórcios Administradora de Consórcios Ltda.',
      codigo_interno: 'BR_CONSORCIOS',
    },
    {
      codigo: '699',
      nome: 'Maggi S.A. Administradora de Consórcios',
      codigo_interno: 'MAGGI',
    },
    {
      codigo: '700',
      nome: 'Cooperativa de Economia e Crédito Mútuo do Setor de Confecções e Têxtil',
      codigo_interno: 'SICOOB_CONFECCOES',
    },
    { codigo: '701', nome: 'Fênix DTVM Ltda.', codigo_interno: 'FENIX_DTVM' },
    {
      codigo: '702',
      nome: 'Multipla Corretora de Câmbio Ltda.',
      codigo_interno: 'MULTIPLA_CC',
    },
    { codigo: '703', nome: 'EFG Bank AG', codigo_interno: 'EFG' },
    {
      codigo: '704',
      nome: 'HSBC Bank Brasil S.A.',
      codigo_interno: 'HSBC_704',
    },
    { codigo: '705', nome: 'Citibank S.A.', codigo_interno: 'CITIBANK' },
    {
      codigo: '706',
      nome: 'J. Malucelli Distribuidora de Títulos e Valores Mobiliários',
      codigo_interno: 'MALUCELLI',
    },
    { codigo: '707', nome: 'Banco Daycoval S.A.', codigo_interno: 'DAYCOVAL' },
    {
      codigo: '708',
      nome: 'BNYM Serviços Financeiros Distribuidora de Títulos e Valores Mobiliários S.A.',
      codigo_interno: 'BNYM',
    },
    {
      codigo: '709',
      nome: 'INTL FCStone Distribuidora de Títulos e Valores Mobiliários Ltda.',
      codigo_interno: 'INTL_FCSTONE',
    },
    {
      codigo: '710',
      nome: 'Delta Distribuidora de Títulos e Valores Mobiliários Ltda.',
      codigo_interno: 'DELTA',
    },
    {
      codigo: '711',
      nome: 'Monetarie Instituição de Pagamento Ltda.',
      codigo_interno: 'MONETARIE',
    },
    {
      codigo: '712',
      nome: 'Banco Cooperativo Sicredi S.A.',
      codigo_interno: 'SICREDI',
    },
    {
      codigo: '713',
      nome: 'TCM - Administradora de Consórcios Ltda.',
      codigo_interno: 'TCM',
    },
    {
      codigo: '714',
      nome: 'PJBPAR Distribuidora de Títulos e Valores Mobiliários Ltda.',
      codigo_interno: 'PJBPAR',
    },
    {
      codigo: '715',
      nome: 'Tieté Corretora de Câmbio Ltda.',
      codigo_interno: 'TIETE',
    },
    {
      codigo: '716',
      nome: 'BT Correspondente de Instituição Financeira Ltda.',
      codigo_interno: 'BT',
    },
    {
      codigo: '717',
      nome: 'Singulare Distribuidora de Títulos e Valores Mobiliários Ltda.',
      codigo_interno: 'SINGULARE',
    },
    {
      codigo: '718',
      nome: 'Santander Caceis Brasil Distribuidora de Títulos e Valores Mobiliários S.A.',
      codigo_interno: 'SANTANDER_CACEIS',
    },
    {
      codigo: '719',
      nome: 'Picpay Bank - Banco Múltiplo S.A.',
      codigo_interno: 'PICPAY_BANK',
    },
    {
      codigo: '720',
      nome: 'BCMG Distribuidora de Títulos e Valores Mobiliários Ltda.',
      codigo_interno: 'BCMG',
    },
    {
      codigo: '721',
      nome: 'Premazon Instituição de Pagamento S.A.',
      codigo_interno: 'PREMAZON',
    },
    { codigo: '722', nome: 'Banco Xp S.A.', codigo_interno: 'XP_722' },
    {
      codigo: '723',
      nome: 'OM Instituição de Pagamento S.A.',
      codigo_interno: 'OM_IP',
    },
    {
      codigo: '724',
      nome: 'Vou.pay Instituição de Pagamento S.A.',
      codigo_interno: 'VOUPAY',
    },
    {
      codigo: '725',
      nome: 'Wise Brasil Corretora de Câmbio Ltda.',
      codigo_interno: 'WISE',
    },
    {
      codigo: '726',
      nome: 'Claro Pay Instituição de Pagamento S.A.',
      codigo_interno: 'CLARO_PAY',
    },
    {
      codigo: '727',
      nome: 'Blu Administradora de Consórcios Ltda.',
      codigo_interno: 'BLU_CONSORCIOS',
    },
    {
      codigo: '728',
      nome: 'Sicredi Participações S.A.',
      codigo_interno: 'SICREDI_PARTICIPACOES',
    },
    {
      codigo: '729',
      nome: 'Mercado Crédito Sociedade de Crédito, Financiamento e Investimento S.A.',
      codigo_interno: 'MERCADO_CREDITO',
    },
    {
      codigo: '730',
      nome: 'Indigo Sociedade de Crédito Direto S.A.',
      codigo_interno: 'INDIGO_SCD',
    },
    {
      codigo: '731',
      nome: 'ABBC Associação Brasileira de Bancos',
      codigo_interno: 'ABBC',
    },
    {
      codigo: '732',
      nome: 'Unicred Norte do Mato Grosso',
      codigo_interno: 'UNICRED_NORTE_MT',
    },
    {
      codigo: '733',
      nome: 'Sicredi - Serviços',
      codigo_interno: 'SICREDI_SERVICOS',
    },
    {
      codigo: '734',
      nome: 'Cooperativa Central de Economia e Crédito Mútuo das Unicreds',
      codigo_interno: 'UNICRED_CENTRAL_734',
    },
    { codigo: '735', nome: 'Banco Neon S.A.', codigo_interno: 'NEON_735' },
    {
      codigo: '736',
      nome: 'Unicred do Brasil',
      codigo_interno: 'UNICRED_BRASIL',
    },
    {
      codigo: '737',
      nome: 'Banco Azteca do Brasil S.A.',
      codigo_interno: 'AZTECA',
    },
    {
      codigo: '738',
      nome: 'Caixa de Crédito Cooperativo de Livre Admissão do Litoral Maranhense',
      codigo_interno: 'SICOOB_MARANHAO',
    },
    { codigo: '739', nome: 'Banco Cetelem S.A.', codigo_interno: 'CETELEM' },
    { codigo: '740', nome: 'Banco Barclays S.A.', codigo_interno: 'BARCLAYS' },
    {
      codigo: '741',
      nome: 'Banco Ribeirão Preto S.A.',
      codigo_interno: 'RIBEIRAO_PRETO',
    },
    { codigo: '742', nome: 'Banco Semear S.A.', codigo_interno: 'SEMEAR' },
    { codigo: '743', nome: 'Banco Semear', codigo_interno: 'SEMEAR_743' },
    {
      codigo: '744',
      nome: 'BancoSeguro S.A.',
      codigo_interno: 'BANCOSEGURO_744',
    },
    {
      codigo: '745',
      nome: 'Banco Citibank S.A.',
      codigo_interno: 'CITIBANK_745',
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
    { codigo: '749', nome: 'Banco Simples S.A.', codigo_interno: 'SIMPLES' },
    {
      codigo: '750',
      nome: 'Banco República Oriental do Uruguai',
      codigo_interno: 'BROU',
    },
    {
      codigo: '751',
      nome: 'Dresdner Bank Brasil S.A.',
      codigo_interno: 'DRESDNER',
    },
    {
      codigo: '752',
      nome: 'Banco BNP Paribas Brasil S.A.',
      codigo_interno: 'BNP_PARIBAS_752',
    },
    {
      codigo: '753',
      nome: 'Banco Comercial Uruguai S.A.',
      codigo_interno: 'BCU',
    },
    { codigo: '754', nome: 'Banco Sistema', codigo_interno: 'SISTEMA_754' },
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
    { codigo: '758', nome: 'Banco Finaxis', codigo_interno: 'FINAXIS_758' },
    {
      codigo: '759',
      nome: 'Neon Pagamentos S.A.',
      codigo_interno: 'NEON_PAGAMENTOS_759',
    },
    {
      codigo: '760',
      nome: 'Banco GE Capital S.A.',
      codigo_interno: 'GE_CAPITAL',
    },
    { codigo: '761', nome: 'Banco Fiat S.A.', codigo_interno: 'FIAT' },
    { codigo: '762', nome: 'Banco do Brasil S.A.', codigo_interno: 'BB_762' },
    {
      codigo: '763',
      nome: 'Banco CNH Industrial Capital S.A.',
      codigo_interno: 'CNH',
    },
    { codigo: '764', nome: 'Banco Cifra', codigo_interno: 'CIFRA_764' },
    {
      codigo: '765',
      nome: 'Banco Santinvest S.A.',
      codigo_interno: 'SANTINVEST_765',
    },
    {
      codigo: '766',
      nome: 'Banco Cooperativo do Brasil S.A.',
      codigo_interno: 'BANCOOB_766',
    },
    {
      codigo: '767',
      nome: 'Carrefour Instituição de Pagamento S.A.',
      codigo_interno: 'CARREFOUR',
    },
    {
      codigo: '768',
      nome: 'Bpn Brasil Banco Múltiplo S.A.',
      codigo_interno: 'BPN',
    },
    {
      codigo: '769',
      nome: 'Banco Itau Consignado S.A.',
      codigo_interno: 'ITAU_CONSIGNADO_769',
    },
    {
      codigo: '770',
      nome: 'Banco De Lage Landen Brasil S.A.',
      codigo_interno: 'LAGE_LANDEN',
    },
    {
      codigo: '771',
      nome: 'Orbitall Instituição de Pagamento S.A.',
      codigo_interno: 'ORBITALL',
    },
    {
      codigo: '772',
      nome: 'BBVA Brasil Banco de Investimento S.A.',
      codigo_interno: 'BBVA',
    },
    {
      codigo: '773',
      nome: 'FitBank Instituição de Pagamento Eletrônico S.A.',
      codigo_interno: 'FITBANK_773',
    },
    {
      codigo: '774',
      nome: 'Money Plus Sociedade de Crédito ao Microempreendedor e à Empresa de Pequeno Porte Ltda.',
      codigo_interno: 'MONEY_PLUS_774',
    },
    {
      codigo: '775',
      nome: 'Banco Genial S.A.',
      codigo_interno: 'GENIAL_BANCO',
    },
    {
      codigo: '776',
      nome: 'JPMorgan Chase Bank',
      codigo_interno: 'JPMORGAN_776',
    },
    {
      codigo: '777',
      nome: 'Creditas Sociedade de Crédito Direto S.A.',
      codigo_interno: 'CREDITAS_777',
    },
    {
      codigo: '778',
      nome: 'Banco Potencial S.A.',
      codigo_interno: 'POTENCIAL',
    },
    {
      codigo: '779',
      nome: 'Cooperativa de Crédito Mútuo dos Servidores da Segurança Pública de Mato Grosso',
      codigo_interno: 'SICOOB_SEGURANCA_MT',
    },
    {
      codigo: '780',
      nome: 'Cooperativa de Crédito Poupança e Investimento do Centro do Rio Grande do Sul',
      codigo_interno: 'SICREDI_CENTRO_RS',
    },
    { codigo: '781', nome: 'AFINZ Pagamentos S.A.', codigo_interno: 'AFINZ' },
    { codigo: '782', nome: 'Claro S.A.', codigo_interno: 'CLARO' },
    {
      codigo: '783',
      nome: 'FacCred Sociedade de Crédito ao Microempreendedor',
      codigo_interno: 'FACCRED',
    },
    {
      codigo: '784',
      nome: 'GWI Corretora de Câmbio Ltda.',
      codigo_interno: 'GWI',
    },
    {
      codigo: '785',
      nome: 'Adianta Recebíveis Instituição de Pagamento S.A.',
      codigo_interno: 'ADIANTA',
    },
    {
      codigo: '786',
      nome: 'Opal Instituição de Pagamento S.A.',
      codigo_interno: 'OPAL',
    },
    {
      codigo: '787',
      nome: 'BitPreço Serviços de Tecnologia Ltda.',
      codigo_interno: 'BITPRECO',
    },
    {
      codigo: '788',
      nome: 'Payfi Instituição de Pagamento S.A.',
      codigo_interno: 'PAYFI',
    },
    {
      codigo: '789',
      nome: 'CredPay Fomento Mercantil e Gestão de Ativos Ltda.',
      codigo_interno: 'CREDPAY_789',
    },
    {
      codigo: '790',
      nome: 'Tuna Instituição de Pagamento S.A.',
      codigo_interno: 'TUNA',
    },
    {
      codigo: '791',
      nome: 'Cooperativa de Crédito Rural de Camapuã',
      codigo_interno: 'SICOOB_CAMAPUA',
    },
    {
      codigo: '792',
      nome: 'Acesso Bank Instituição de Pagamento S.A.',
      codigo_interno: 'ACESSO_BANK',
    },
    {
      codigo: '793',
      nome: 'Intra Instituição de Pagamento S.A.',
      codigo_interno: 'INTRA',
    },
    {
      codigo: '794',
      nome: 'RP Digital Instituição de Pagamento S.A.',
      codigo_interno: 'RP_DIGITAL',
    },
    {
      codigo: '795',
      nome: 'Sankhya Gestão de Investimentos Ltda.',
      codigo_interno: 'SANKHYA',
    },
    {
      codigo: '796',
      nome: 'Olpag Instituição de Pagamento S.A.',
      codigo_interno: 'OLPAG',
    },
    {
      codigo: '797',
      nome: 'Cooperativa de Economia e Crédito Mútuo dos Lojistas de Vestuários',
      codigo_interno: 'UNICRED_LOJISTAS',
    },
    {
      codigo: '798',
      nome: 'Oliveira Soares Corretora de Câmbio S.A.',
      codigo_interno: 'OLIVEIRA_SOARES',
    },
    {
      codigo: '799',
      nome: 'Kirsten S.A. Administradora de Consórcios',
      codigo_interno: 'KIRSTEN',
    },
  ];

  console.log('🏦 Iniciando seed de bancos...');

  for (const bancoData of bancos) {
    const existingBanco = await bancoRepository.findOne({
      where: [
        { codigo: bancoData.codigo },
        { codigo_interno: bancoData.codigo_interno },
      ],
    });

    if (!existingBanco) {
      const banco = bancoRepository.create({
        codigo: bancoData.codigo,
        nome: bancoData.nome,
        codigo_interno: bancoData.codigo_interno,
        status: StatusBanco.ATIVO,
        descricao: `Banco ${bancoData.nome} - Código FEBRABAN: ${bancoData.codigo}`,
      });

      await bancoRepository.save(banco);
      console.log(`✅ Banco ${bancoData.codigo} - ${bancoData.nome} criado`);
    } else {
      console.log(
        `⏭️  Banco ${bancoData.codigo} - ${bancoData.nome} já existe`,
      );
    }
  }

  console.log('✅ Seed de bancos concluído!');
  console.log(`📊 Total de bancos disponíveis: ${bancos.length}`);
}
