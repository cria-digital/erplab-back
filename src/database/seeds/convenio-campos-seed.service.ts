import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CampoFormulario,
  NomeCampoFormulario,
} from '../../modules/infraestrutura/campos-formulario/entities/campo-formulario.entity';
import { AlternativaCampoFormulario } from '../../modules/infraestrutura/campos-formulario/entities/alternativa-campo-formulario.entity';

@Injectable()
export class ConvenioCamposSeedService {
  constructor(
    @InjectRepository(CampoFormulario)
    private readonly campoFormularioRepository: Repository<CampoFormulario>,
    @InjectRepository(AlternativaCampoFormulario)
    private readonly alternativaRepository: Repository<AlternativaCampoFormulario>,
  ) {}

  async seed() {
    console.log('🌱 Iniciando seed de campos de formulário para Convênios...');

    await this.seedTipoConvenio();
    await this.seedFormaLiquidacao();
    await this.seedEnvioFaturamento();
    await this.seedTabelaServico();
    await this.seedTabelaBase();
    await this.seedTabelaMaterial();

    console.log('✅ Seed de campos de Convênios concluído!');
  }

  private async seedTipoConvenio() {
    const nomeCampo = NomeCampoFormulario.TIPO_CONVENIO;

    const existe = await this.campoFormularioRepository.findOne({
      where: { nomeCampo },
    });

    if (existe) {
      console.log('   ⏭️  Campo "tipo_convenio" já existe, pulando...');
      return;
    }

    const campo = this.campoFormularioRepository.create({
      nomeCampo,
      descricao: 'Tipo de convênio (ambulatorial, hospitalar, etc)',
      ativo: true,
    });

    const campoSalvo = await this.campoFormularioRepository.save(campo);

    const alternativas = [
      { textoAlternativa: 'Ambulatorial', ordem: 1 },
      { textoAlternativa: 'Hospitalar', ordem: 2 },
      { textoAlternativa: 'Odontológico', ordem: 3 },
      { textoAlternativa: 'Misto', ordem: 4 },
      { textoAlternativa: 'Particular', ordem: 5 },
    ];

    for (const alt of alternativas) {
      await this.alternativaRepository.save({
        campoFormularioId: campoSalvo.id,
        textoAlternativa: alt.textoAlternativa,
        ordem: alt.ordem,
        ativo: true,
      });
    }

    console.log('   ✅ Campo "tipo_convenio" criado com 5 alternativas');
  }

  private async seedFormaLiquidacao() {
    const nomeCampo = NomeCampoFormulario.FORMA_LIQUIDACAO;

    const existe = await this.campoFormularioRepository.findOne({
      where: { nomeCampo },
    });

    if (existe) {
      console.log('   ⏭️  Campo "forma_liquidacao" já existe, pulando...');
      return;
    }

    const campo = this.campoFormularioRepository.create({
      nomeCampo,
      descricao: 'Forma de liquidação do convênio',
      ativo: true,
    });

    const campoSalvo = await this.campoFormularioRepository.save(campo);

    const alternativas = [
      { textoAlternativa: 'Via Fatura', ordem: 1 },
      { textoAlternativa: 'Via Guia', ordem: 2 },
      { textoAlternativa: 'Automática', ordem: 3 },
      { textoAlternativa: 'Manual', ordem: 4 },
    ];

    for (const alt of alternativas) {
      await this.alternativaRepository.save({
        campoFormularioId: campoSalvo.id,
        textoAlternativa: alt.textoAlternativa,
        ordem: alt.ordem,
        ativo: true,
      });
    }

    console.log('   ✅ Campo "forma_liquidacao" criado com 4 alternativas');
  }

  private async seedEnvioFaturamento() {
    const nomeCampo = NomeCampoFormulario.ENVIO_FATURAMENTO;

    const existe = await this.campoFormularioRepository.findOne({
      where: { nomeCampo },
    });

    if (existe) {
      console.log('   ⏭️  Campo "envio_faturamento" já existe, pulando...');
      return;
    }

    const campo = this.campoFormularioRepository.create({
      nomeCampo,
      descricao: 'Forma de envio do faturamento',
      ativo: true,
    });

    const campoSalvo = await this.campoFormularioRepository.save(campo);

    const alternativas = [
      { textoAlternativa: 'E-mail', ordem: 1 },
      { textoAlternativa: 'Portal', ordem: 2 },
      { textoAlternativa: 'Físico', ordem: 3 },
      { textoAlternativa: 'FTP', ordem: 4 },
      { textoAlternativa: 'API', ordem: 5 },
    ];

    for (const alt of alternativas) {
      await this.alternativaRepository.save({
        campoFormularioId: campoSalvo.id,
        textoAlternativa: alt.textoAlternativa,
        ordem: alt.ordem,
        ativo: true,
      });
    }

    console.log('   ✅ Campo "envio_faturamento" criado com 5 alternativas');
  }

  private async seedTabelaServico() {
    const nomeCampo = NomeCampoFormulario.TABELA_SERVICO;

    const existe = await this.campoFormularioRepository.findOne({
      where: { nomeCampo },
    });

    if (existe) {
      console.log('   ⏭️  Campo "tabela_servico" já existe, pulando...');
      return;
    }

    const campo = this.campoFormularioRepository.create({
      nomeCampo,
      descricao: 'Tabela de serviços do convênio',
      ativo: true,
    });

    const campoSalvo = await this.campoFormularioRepository.save(campo);

    const alternativas = [
      { textoAlternativa: 'TUSS', ordem: 1 },
      { textoAlternativa: 'AMB', ordem: 2 },
      { textoAlternativa: 'CBHPM', ordem: 3 },
      { textoAlternativa: 'Própria', ordem: 4 },
      { textoAlternativa: 'Simpro', ordem: 5 },
      { textoAlternativa: 'Brasíndice', ordem: 6 },
    ];

    for (const alt of alternativas) {
      await this.alternativaRepository.save({
        campoFormularioId: campoSalvo.id,
        textoAlternativa: alt.textoAlternativa,
        ordem: alt.ordem,
        ativo: true,
      });
    }

    console.log('   ✅ Campo "tabela_servico" criado com 6 alternativas');
  }

  private async seedTabelaBase() {
    const nomeCampo = NomeCampoFormulario.TABELA_BASE;

    const existe = await this.campoFormularioRepository.findOne({
      where: { nomeCampo },
    });

    if (existe) {
      console.log('   ⏭️  Campo "tabela_base" já existe, pulando...');
      return;
    }

    const campo = this.campoFormularioRepository.create({
      nomeCampo,
      descricao: 'Tabela base de procedimentos',
      ativo: true,
    });

    const campoSalvo = await this.campoFormularioRepository.save(campo);

    const alternativas = [
      { textoAlternativa: 'TUSS - Tabela Unificada', ordem: 1 },
      { textoAlternativa: 'AMB - Associação Médica Brasileira', ordem: 2 },
      {
        textoAlternativa:
          'CBHPM - Classificação Brasileira Hierarquizada de Procedimentos Médicos',
        ordem: 3,
      },
      {
        textoAlternativa:
          'SIGTAP - Sistema de Gerenciamento da Tabela de Procedimentos',
        ordem: 4,
      },
      { textoAlternativa: 'Tabela Própria do Convênio', ordem: 5 },
    ];

    for (const alt of alternativas) {
      await this.alternativaRepository.save({
        campoFormularioId: campoSalvo.id,
        textoAlternativa: alt.textoAlternativa,
        ordem: alt.ordem,
        ativo: true,
      });
    }

    console.log('   ✅ Campo "tabela_base" criado com 5 alternativas');
  }

  private async seedTabelaMaterial() {
    const nomeCampo = NomeCampoFormulario.TABELA_MATERIAL;

    const existe = await this.campoFormularioRepository.findOne({
      where: { nomeCampo },
    });

    if (existe) {
      console.log('   ⏭️  Campo "tabela_material" já existe, pulando...');
      return;
    }

    const campo = this.campoFormularioRepository.create({
      nomeCampo,
      descricao: 'Tabela de materiais e medicamentos',
      ativo: true,
    });

    const campoSalvo = await this.campoFormularioRepository.save(campo);

    const alternativas = [
      {
        textoAlternativa: 'Simpro - Tabela de Preços de Medicamentos',
        ordem: 1,
      },
      { textoAlternativa: 'Brasíndice', ordem: 2 },
      { textoAlternativa: 'ABC Farma', ordem: 3 },
      {
        textoAlternativa:
          'CMED - Câmara de Regulação do Mercado de Medicamentos',
        ordem: 4,
      },
      { textoAlternativa: 'Tabela Própria do Convênio', ordem: 5 },
    ];

    for (const alt of alternativas) {
      await this.alternativaRepository.save({
        campoFormularioId: campoSalvo.id,
        textoAlternativa: alt.textoAlternativa,
        ordem: alt.ordem,
        ativo: true,
      });
    }

    console.log('   ✅ Campo "tabela_material" criado com 5 alternativas');
  }
}
