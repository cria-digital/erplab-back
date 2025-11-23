import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  ConfiguracaoCampoFormulario,
  TipoEntidadeEnum,
  TipoFormularioEnum,
} from '../../modules/configuracoes/campos-formulario/entities/configuracao-campo-formulario.entity';

/**
 * Seeder para campos do formulário de Cadastro de Paciente
 *
 * IMPORTANTE: Este seeder NÃO é executado automaticamente.
 * Ele serve como referência dos 30 campos disponíveis no cadastro de pacientes.
 *
 * Para usar, chame o método seedParaConvenio(convenio_id) passando o ID de um convênio existente.
 */
@Injectable()
export class ConfiguracaoCamposCadastroPacienteSeedService {
  private readonly logger = new Logger(
    ConfiguracaoCamposCadastroPacienteSeedService.name,
  );

  // 30 campos do formulário de cadastro de pacientes (baseado no Figma página 7)
  private readonly CAMPOS_CADASTRO_PACIENTE = [
    // Informações básicas (17 campos)
    { nomeCampo: 'foto', obrigatorio: false },
    { nomeCampo: 'codigo_interno', obrigatorio: true },
    { nomeCampo: 'nome', obrigatorio: true },
    { nomeCampo: 'nome_social', obrigatorio: false },
    { nomeCampo: 'usar_nome_social', obrigatorio: false },
    { nomeCampo: 'sexo', obrigatorio: true },
    { nomeCampo: 'data_nascimento', obrigatorio: true },
    { nomeCampo: 'nome_mae', obrigatorio: false },
    { nomeCampo: 'prontuario', obrigatorio: false },
    { nomeCampo: 'rg', obrigatorio: false },
    { nomeCampo: 'cpf', obrigatorio: false },
    { nomeCampo: 'estado_civil', obrigatorio: false },
    { nomeCampo: 'email', obrigatorio: false },
    { nomeCampo: 'contatos', obrigatorio: false },
    { nomeCampo: 'whatsapp', obrigatorio: false },
    { nomeCampo: 'profissao', obrigatorio: false },
    { nomeCampo: 'observacao', obrigatorio: false },

    // Informações do convênio (6 campos)
    { nomeCampo: 'convenio', obrigatorio: false },
    { nomeCampo: 'plano', obrigatorio: false },
    { nomeCampo: 'validade_convenio', obrigatorio: false },
    { nomeCampo: 'matricula', obrigatorio: false },
    { nomeCampo: 'nome_titular', obrigatorio: false },
    { nomeCampo: 'cartao_sus', obrigatorio: false },

    // Endereço (7 campos)
    { nomeCampo: 'cep', obrigatorio: false },
    { nomeCampo: 'rua', obrigatorio: false },
    { nomeCampo: 'numero', obrigatorio: false },
    { nomeCampo: 'bairro', obrigatorio: false },
    { nomeCampo: 'complemento', obrigatorio: false },
    { nomeCampo: 'estado', obrigatorio: false },
    { nomeCampo: 'cidade', obrigatorio: false },
  ];

  constructor(
    @InjectRepository(ConfiguracaoCampoFormulario)
    private readonly configuracaoRepository: Repository<ConfiguracaoCampoFormulario>,
  ) {}

  /**
   * Cria configuração padrão de campos para um convênio específico
   * @param convenioId - ID do convênio
   * @param camposObrigatorios - Array de nomes de campos que devem ser obrigatórios (opcional)
   */
  async seedParaConvenio(
    convenioId: string,
    camposObrigatorios?: string[],
  ): Promise<void> {
    this.logger.log(
      `🌱 Criando configurações de campos para convênio ${convenioId}...`,
    );

    // Verificar se já existe configuração para este convênio
    const existente = await this.configuracaoRepository.findOne({
      where: {
        entidadeTipo: TipoEntidadeEnum.CONVENIO,
        entidadeId: convenioId,
        tipoFormulario: TipoFormularioEnum.CADASTRO_PACIENTE,
      },
    });

    if (existente) {
      this.logger.warn(
        `⚠️  Convênio ${convenioId} já possui configurações de campos. Pulando...`,
      );
      return;
    }

    // Criar configurações
    const configuracoes = this.CAMPOS_CADASTRO_PACIENTE.map((campo) => {
      const obrigatorio = camposObrigatorios
        ? camposObrigatorios.includes(campo.nomeCampo)
        : campo.obrigatorio;

      return this.configuracaoRepository.create({
        entidadeTipo: TipoEntidadeEnum.CONVENIO,
        entidadeId: convenioId,
        tipoFormulario: TipoFormularioEnum.CADASTRO_PACIENTE,
        nomeCampo: campo.nomeCampo,
        obrigatorio,
      });
    });

    await this.configuracaoRepository.save(configuracoes);

    this.logger.log(
      `✅ ${configuracoes.length} campos configurados para o convênio ${convenioId}`,
    );
  }

  /**
   * Lista todos os campos disponíveis
   */
  listarCamposDisponiveis(): Array<{
    nomeCampo: string;
    obrigatorio: boolean;
  }> {
    return this.CAMPOS_CADASTRO_PACIENTE;
  }

  /**
   * Exemplo de uso: Configurar campos obrigatórios específicos
   */
  async exemploConvenioExigente(convenioId: string): Promise<void> {
    const camposObrigatorios = [
      'codigo_interno',
      'nome',
      'sexo',
      'data_nascimento',
      'cpf', // Exige CPF
      'rg', // Exige RG
      'nome_mae', // Exige nome da mãe
      'cep', // Exige endereço completo
      'rua',
      'numero',
      'bairro',
      'estado',
      'cidade',
      'convenio', // Exige dados do convênio
      'plano',
      'matricula',
    ];

    await this.seedParaConvenio(convenioId, camposObrigatorios);
  }

  /**
   * Exemplo de uso: Configurar convênio simples (mínimo de campos)
   */
  async exemploConvenioSimples(convenioId: string): Promise<void> {
    const camposObrigatorios = [
      'codigo_interno',
      'nome',
      'sexo',
      'data_nascimento',
      // Apenas 4 campos obrigatórios
    ];

    await this.seedParaConvenio(convenioId, camposObrigatorios);
  }
}
