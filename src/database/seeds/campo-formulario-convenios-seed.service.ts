import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CampoFormulario } from '../../modules/infraestrutura/campos-formulario/entities/campo-formulario.entity';
import { AlternativaCampoFormulario } from '../../modules/infraestrutura/campos-formulario/entities/alternativa-campo-formulario.entity';
import { NomeCampoFormulario } from '../../modules/infraestrutura/campos-formulario/entities/campo-formulario.entity';

interface AlternativaData {
  textoAlternativa: string;
  ordem?: number;
  ativo?: boolean;
}

interface CampoData {
  nome: NomeCampoFormulario;
  descricao: string;
  alternativas: AlternativaData[];
}

@Injectable()
export class CampoFormularioConveniosSeedService {
  constructor(
    @InjectRepository(CampoFormulario)
    private readonly campoRepository: Repository<CampoFormulario>,
    @InjectRepository(AlternativaCampoFormulario)
    private readonly alternativaRepository: Repository<AlternativaCampoFormulario>,
  ) {}

  async seed() {
    console.log('🌱 Iniciando seed de campos de formulário de convênios...');

    const camposData: CampoData[] = [
      {
        nome: NomeCampoFormulario.TIPO_CONVENIO,
        descricao: 'Tipo de convênio médico',
        alternativas: [
          { textoAlternativa: 'Plano de Saúde', ordem: 1 },
          { textoAlternativa: 'Seguro Saúde', ordem: 2 },
          { textoAlternativa: 'Cooperativa Médica', ordem: 3 },
          { textoAlternativa: 'Medicina de Grupo', ordem: 4 },
          { textoAlternativa: 'Autogestão', ordem: 5 },
          { textoAlternativa: 'Entidade Filantrópica', ordem: 6 },
          { textoAlternativa: 'Particular', ordem: 7 },
          { textoAlternativa: 'Público (SUS)', ordem: 8 },
        ],
      },
      {
        nome: NomeCampoFormulario.FORMA_LIQUIDACAO,
        descricao: 'Forma de liquidação/pagamento do convênio',
        alternativas: [
          { textoAlternativa: 'Boleto Bancário', ordem: 1 },
          { textoAlternativa: 'Depósito em Conta', ordem: 2 },
          { textoAlternativa: 'Transferência Bancária', ordem: 3 },
          { textoAlternativa: 'Cheque', ordem: 4 },
          { textoAlternativa: 'PIX', ordem: 5 },
          { textoAlternativa: 'Dinheiro', ordem: 6 },
          { textoAlternativa: 'Débito Automático', ordem: 7 },
        ],
      },
      {
        nome: NomeCampoFormulario.ENVIO_FATURAMENTO,
        descricao: 'Forma de envio do faturamento',
        alternativas: [
          { textoAlternativa: 'E-mail', ordem: 1 },
          { textoAlternativa: 'Portal Web', ordem: 2 },
          { textoAlternativa: 'API / Integração', ordem: 3 },
          { textoAlternativa: 'Físico (Impresso)', ordem: 4 },
          { textoAlternativa: 'Correios', ordem: 5 },
          { textoAlternativa: 'SEDEX', ordem: 6 },
          { textoAlternativa: 'Motoboy', ordem: 7 },
          { textoAlternativa: 'Padrão TISS', ordem: 8 },
        ],
      },
      {
        nome: NomeCampoFormulario.TABELA_SERVICO,
        descricao: 'Tabela de referência para serviços/procedimentos',
        alternativas: [
          { textoAlternativa: 'AMB (Associação Médica Brasileira)', ordem: 1 },
          {
            textoAlternativa:
              'CBHPM (Classificação Brasileira Hierarquizada de Procedimentos Médicos)',
            ordem: 2,
          },
          { textoAlternativa: 'SIMPRO', ordem: 3 },
          { textoAlternativa: 'Tabela Própria', ordem: 4 },
          {
            textoAlternativa:
              'TUSS (Terminologia Unificada da Saúde Suplementar)',
            ordem: 5,
          },
          {
            textoAlternativa:
              'SIGTAP (Sistema de Gerenciamento da Tabela de Procedimentos)',
            ordem: 6,
          },
        ],
      },
      {
        nome: NomeCampoFormulario.TABELA_BASE,
        descricao: 'Tabela base para cálculo de valores',
        alternativas: [
          { textoAlternativa: 'AMB 90', ordem: 1 },
          { textoAlternativa: 'AMB 92', ordem: 2 },
          { textoAlternativa: 'AMB 96', ordem: 3 },
          { textoAlternativa: 'CBHPM 2016', ordem: 4 },
          { textoAlternativa: 'CBHPM 2018', ordem: 5 },
          { textoAlternativa: 'CBHPM 2020', ordem: 6 },
          { textoAlternativa: 'CBHPM 2022', ordem: 7 },
          { textoAlternativa: 'CBHPM 2024', ordem: 8 },
          { textoAlternativa: 'Brasíndice', ordem: 9 },
          { textoAlternativa: 'SIMPRO', ordem: 10 },
        ],
      },
      {
        nome: NomeCampoFormulario.TABELA_MATERIAL,
        descricao: 'Tabela de referência para materiais e medicamentos',
        alternativas: [
          { textoAlternativa: 'Brasíndice', ordem: 1 },
          { textoAlternativa: 'SIMPRO', ordem: 2 },
          { textoAlternativa: 'ABC Farma', ordem: 3 },
          {
            textoAlternativa:
              'CMED (Câmara de Regulação do Mercado de Medicamentos)',
            ordem: 4,
          },
          { textoAlternativa: 'Tabela Própria', ordem: 5 },
          { textoAlternativa: 'Preço de Fábrica', ordem: 6 },
          {
            textoAlternativa: 'PMVG (Preço Máximo de Venda ao Governo)',
            ordem: 7,
          },
        ],
      },
    ];

    let totalCamposCriados = 0;
    let totalAlternativasCriadas = 0;

    for (const campoData of camposData) {
      // Verificar se o campo já existe
      let campo = await this.campoRepository.findOne({
        where: { nomeCampo: campoData.nome },
      });

      if (!campo) {
        // Criar campo
        campo = this.campoRepository.create({
          nomeCampo: campoData.nome,
          descricao: campoData.descricao,
          ativo: true,
        });
        campo = await this.campoRepository.save(campo);
        totalCamposCriados++;
        console.log(`  ✅ Campo criado: ${campoData.nome}`);
      } else {
        console.log(`  ⏭️  Campo já existe: ${campoData.nome}`);
      }

      // Verificar quantas alternativas já existem para este campo
      const alternativasExistentes = await this.alternativaRepository.countBy({
        campoFormularioId: campo.id,
      });

      if (alternativasExistentes > 0) {
        console.log(
          `     ⏭️  ${alternativasExistentes} alternativas já existem para ${campoData.nome}`,
        );
        continue;
      }

      // Criar alternativas
      for (const altData of campoData.alternativas) {
        const alternativa = this.alternativaRepository.create({
          campoFormularioId: campo.id,
          textoAlternativa: altData.textoAlternativa,
          ordem: altData.ordem || 0,
          ativo: altData.ativo !== undefined ? altData.ativo : true,
        });
        await this.alternativaRepository.save(alternativa);
        totalAlternativasCriadas++;
      }
      console.log(
        `     ✅ ${campoData.alternativas.length} alternativas criadas`,
      );
    }

    console.log(
      `\n✅ Seed de campos de convênios concluído! ${totalCamposCriados} campos e ${totalAlternativasCriadas} alternativas criadas.\n`,
    );
  }
}
