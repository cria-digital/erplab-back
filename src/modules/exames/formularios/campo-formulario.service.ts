import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCampoFormularioDto } from './dto/create-campo-formulario.dto';
import { UpdateCampoFormularioDto } from './dto/update-campo-formulario.dto';
import {
  CampoFormulario,
  TipoCampo,
  StatusCampo,
  CamposPadraoSistema,
} from './entities/campo-formulario.entity';

@Injectable()
export class CampoFormularioService {
  constructor(
    @InjectRepository(CampoFormulario)
    private campoRepository: Repository<CampoFormulario>,
  ) {}

  async create(
    createCampoDto: CreateCampoFormularioDto,
  ): Promise<CampoFormulario> {
    const existingByCode = await this.campoRepository.findOne({
      where: {
        codigoCampo: createCampoDto.codigoCampo,
        formularioId: createCampoDto.formularioId,
      },
    });

    if (existingByCode) {
      throw new BadRequestException(
        `Já existe um campo com o código ${createCampoDto.codigoCampo} neste formulário`,
      );
    }

    if (!createCampoDto.ordem) {
      const ultimoCampo = await this.campoRepository.findOne({
        where: { formularioId: createCampoDto.formularioId },
        order: { ordem: 'DESC' },
      });
      createCampoDto.ordem = ultimoCampo ? ultimoCampo.ordem + 1 : 1;
    }

    const campo = this.campoRepository.create(createCampoDto);
    return await this.campoRepository.save(campo);
  }

  async findByFormulario(formularioId: string): Promise<CampoFormulario[]> {
    return await this.campoRepository.find({
      where: { formularioId },
      relations: ['alternativas'],
      order: { ordem: 'ASC' },
    });
  }

  async findAtivos(formularioId: string): Promise<CampoFormulario[]> {
    return await this.campoRepository.find({
      where: { formularioId, ativo: true },
      relations: ['alternativas'],
      order: { ordem: 'ASC' },
    });
  }

  async findByTipo(
    formularioId: string,
    tipo: TipoCampo,
  ): Promise<CampoFormulario[]> {
    return await this.campoRepository.find({
      where: { formularioId, tipoCampo: tipo },
      relations: ['alternativas'],
      order: { ordem: 'ASC' },
    });
  }

  async findObrigatorios(formularioId: string): Promise<CampoFormulario[]> {
    return await this.campoRepository.find({
      where: { formularioId, obrigatorio: true },
      relations: ['alternativas'],
      order: { ordem: 'ASC' },
    });
  }

  async findByCodigo(
    formularioId: string,
    codigo: string,
  ): Promise<CampoFormulario> {
    const campo = await this.campoRepository.findOne({
      where: { formularioId, codigoCampo: codigo },
      relations: ['alternativas'],
    });

    if (!campo) {
      throw new NotFoundException(
        `Campo com código ${codigo} não encontrado no formulário ${formularioId}`,
      );
    }

    return campo;
  }

  async search(
    formularioId: string,
    termo: string,
  ): Promise<CampoFormulario[]> {
    return await this.campoRepository
      .createQueryBuilder('campo')
      .leftJoinAndSelect('campo.alternativas', 'alternativas')
      .where('campo.formulario_id = :formularioId', { formularioId })
      .andWhere(
        '(campo.nome_campo ILIKE :termo OR campo.descricao ILIKE :termo OR campo.codigo_campo ILIKE :termo)',
        { termo: `%${termo}%` },
      )
      .orderBy('campo.ordem', 'ASC')
      .getMany();
  }

  async findOne(id: string): Promise<CampoFormulario> {
    const campo = await this.campoRepository.findOne({
      where: { id },
      relations: ['alternativas', 'formulario'],
    });

    if (!campo) {
      throw new NotFoundException(`Campo com ID ${id} não encontrado`);
    }

    return campo;
  }

  async update(
    id: string,
    updateCampoDto: UpdateCampoFormularioDto,
  ): Promise<CampoFormulario> {
    const campo = await this.findOne(id);

    if (
      updateCampoDto.codigoCampo &&
      updateCampoDto.codigoCampo !== campo.codigoCampo
    ) {
      const existingByCode = await this.campoRepository.findOne({
        where: {
          codigoCampo: updateCampoDto.codigoCampo,
          formularioId: campo.formularioId,
        },
      });

      if (existingByCode) {
        throw new BadRequestException(
          `Já existe um campo com o código ${updateCampoDto.codigoCampo} neste formulário`,
        );
      }
    }

    Object.assign(campo, updateCampoDto);
    return await this.campoRepository.save(campo);
  }

  async reordenar(
    formularioId: string,
    ordens: { id: string; ordem: number }[],
  ): Promise<void> {
    const campos = await this.findByFormulario(formularioId);

    for (const { id, ordem } of ordens) {
      const campo = campos.find((c) => c.id === id);
      if (campo) {
        campo.ordem = ordem;
        await this.campoRepository.save(campo);
      }
    }
  }

  async duplicar(
    id: string,
    novoCodigoCampo?: string,
  ): Promise<CampoFormulario> {
    const campoOriginal = await this.findOne(id);

    const codigo = novoCodigoCampo || `${campoOriginal.codigoCampo}_COPY`;

    const existingByCode = await this.campoRepository.findOne({
      where: {
        codigoCampo: codigo,
        formularioId: campoOriginal.formularioId,
      },
    });

    if (existingByCode) {
      throw new BadRequestException(
        `Já existe um campo com o código ${codigo} neste formulário`,
      );
    }

    const ultimoCampo = await this.campoRepository.findOne({
      where: { formularioId: campoOriginal.formularioId },
      order: { ordem: 'DESC' },
    });

    const novoCampo = this.campoRepository.create({
      ...campoOriginal,
      id: undefined,
      codigoCampo: codigo,
      nomeCampo: `${campoOriginal.nomeCampo} (Cópia)`,
      ordem: ultimoCampo ? ultimoCampo.ordem + 1 : 1,
      createdAt: undefined,
      updatedAt: undefined,
    });

    return await this.campoRepository.save(novoCampo);
  }

  async toggleStatus(id: string): Promise<CampoFormulario> {
    const campo = await this.findOne(id);
    campo.ativo = !campo.ativo;
    return await this.campoRepository.save(campo);
  }

  async updateStatus(
    id: string,
    status: StatusCampo,
  ): Promise<CampoFormulario> {
    const campo = await this.findOne(id);
    campo.status = status;
    return await this.campoRepository.save(campo);
  }

  async remove(id: string): Promise<void> {
    const campo = await this.findOne(id);
    await this.campoRepository.remove(campo);
  }

  async getEstatisticas(formularioId: string) {
    const [total, ativos, inativos, obrigatorios, porTipo, porStatus] =
      await Promise.all([
        this.campoRepository.count({ where: { formularioId } }),
        this.campoRepository.count({ where: { formularioId, ativo: true } }),
        this.campoRepository.count({ where: { formularioId, ativo: false } }),
        this.campoRepository.count({
          where: { formularioId, obrigatorio: true },
        }),
        this.campoRepository
          .createQueryBuilder('campo')
          .select('campo.tipo_campo', 'tipo')
          .addSelect('COUNT(*)', 'total')
          .where('campo.formulario_id = :formularioId', { formularioId })
          .groupBy('campo.tipo_campo')
          .getRawMany(),
        this.campoRepository
          .createQueryBuilder('campo')
          .select('campo.status', 'status')
          .addSelect('COUNT(*)', 'total')
          .where('campo.formulario_id = :formularioId', { formularioId })
          .groupBy('campo.status')
          .getRawMany(),
      ]);

    return {
      total,
      ativos,
      inativos,
      obrigatorios,
      porTipo,
      porStatus,
    };
  }

  async validarCampo(
    id: string,
  ): Promise<{ valido: boolean; erros: string[] }> {
    const campo = await this.findOne(id);
    const erros: string[] = [];

    if (
      campo.tipoCampo === TipoCampo.SELECT &&
      (!campo.alternativas || campo.alternativas.length === 0)
    ) {
      erros.push('Campo de seleção deve ter pelo menos uma alternativa');
    }

    if (
      campo.tipoCampo === TipoCampo.RADIO &&
      (!campo.alternativas || campo.alternativas.length === 0)
    ) {
      erros.push('Campo de rádio deve ter pelo menos uma alternativa');
    }

    if (
      campo.tamanhoMinimo &&
      campo.tamanhoMaximo &&
      campo.tamanhoMinimo > campo.tamanhoMaximo
    ) {
      erros.push('Tamanho mínimo não pode ser maior que o tamanho máximo');
    }

    if (
      campo.valorMinimo &&
      campo.valorMaximo &&
      campo.valorMinimo > campo.valorMaximo
    ) {
      erros.push('Valor mínimo não pode ser maior que o valor máximo');
    }

    return {
      valido: erros.length === 0,
      erros,
    };
  }

  // ========== MÉTODOS PARA CAMPOS PADRÃO DO SISTEMA ==========

  /**
   * Retorna todos os campos padrão do sistema com suas informações
   */
  getCamposPadrao() {
    const camposInfo = this.getCamposPadraoInfo();

    // Agrupar por categoria
    const categorias = Array.from(
      new Set(camposInfo.map((c) => c.categoria)),
    ).sort();

    return {
      campos: camposInfo,
      total: camposInfo.length,
      categorias,
    };
  }

  /**
   * Busca informações de um campo padrão específico pelo código
   */
  getCampoPadraoByCodigo(codigo: CamposPadraoSistema) {
    const campo = this.getCamposPadraoInfo().find((c) => c.codigo === codigo);

    if (!campo) {
      throw new NotFoundException(
        `Campo padrão com código ${codigo} não encontrado`,
      );
    }

    return campo;
  }

  /**
   * Retorna todos os tipos de campo disponíveis
   */
  getTiposCampo() {
    const tipos = Object.values(TipoCampo).map((tipo) => {
      return {
        valor: tipo,
        label: this.getTipoCampoLabel(tipo),
        categoria: this.getTipoCampoCategoria(tipo),
        permiteAlternativas: this.tipoCampoPermiteAlternativas(tipo),
        descricao: this.getTipoCampoDescricao(tipo),
      };
    });

    // Agrupar por categoria
    const categorias = Array.from(
      new Set(tipos.map((t) => t.categoria)),
    ).sort();

    return {
      tipos,
      total: tipos.length,
      categorias,
    };
  }

  /**
   * Retorna campos padrão filtrados por categoria
   */
  getCamposPadraoPorCategoria(categoria: string) {
    const campos = this.getCamposPadraoInfo().filter(
      (c) => c.categoria === categoria,
    );

    return {
      categoria,
      campos,
      total: campos.length,
    };
  }

  // ========== MÉTODOS AUXILIARES PRIVADOS ==========

  /**
   * Informações detalhadas sobre cada campo padrão do sistema
   */
  private getCamposPadraoInfo() {
    return [
      // Unidades de Medida e Quantidades
      {
        codigo: CamposPadraoSistema.UNIDADE_MEDIDA,
        nome: 'Unidade de Medida',
        descricao: 'Usado nos formulários de exames (MG/DL, G, MG, etc)',
        categoria: 'Unidades de Medida e Quantidades',
        tiposCampoSugeridos: [TipoCampo.SELECT, TipoCampo.RADIO],
      },
      {
        codigo: CamposPadraoSistema.TIPO_UNIDADE,
        nome: 'Tipo de Unidade',
        descricao: 'Classificação de unidade (Volume, Massa, Comprimento, etc)',
        categoria: 'Unidades de Medida e Quantidades',
        tiposCampoSugeridos: [TipoCampo.SELECT],
      },

      // Dados do Paciente
      {
        codigo: CamposPadraoSistema.TIPO_SANGUE,
        nome: 'Tipo Sanguíneo',
        descricao: 'Tipo sanguíneo do paciente (A+, B-, O+, AB-, etc)',
        categoria: 'Dados do Paciente',
        tiposCampoSugeridos: [TipoCampo.SELECT, TipoCampo.RADIO],
      },
      {
        codigo: CamposPadraoSistema.GENERO,
        nome: 'Gênero',
        descricao: 'Gênero do paciente (Masculino, Feminino, Outro)',
        categoria: 'Dados do Paciente',
        tiposCampoSugeridos: [TipoCampo.SELECT, TipoCampo.RADIO],
      },
      {
        codigo: CamposPadraoSistema.COR_RACA,
        nome: 'Cor/Raça',
        descricao: 'Autodeclaração de cor/raça conforme IBGE',
        categoria: 'Dados do Paciente',
        tiposCampoSugeridos: [TipoCampo.SELECT],
      },
      {
        codigo: CamposPadraoSistema.ESTADO_CIVIL,
        nome: 'Estado Civil',
        descricao: 'Estado civil do paciente',
        categoria: 'Dados do Paciente',
        tiposCampoSugeridos: [TipoCampo.SELECT],
      },
      {
        codigo: CamposPadraoSistema.ESCOLARIDADE,
        nome: 'Escolaridade',
        descricao: 'Nível de escolaridade do paciente',
        categoria: 'Dados do Paciente',
        tiposCampoSugeridos: [TipoCampo.SELECT],
      },
      {
        codigo: CamposPadraoSistema.PROFISSAO,
        nome: 'Profissão',
        descricao: 'Profissão/ocupação do paciente',
        categoria: 'Dados do Paciente',
        tiposCampoSugeridos: [TipoCampo.TEXTO, TipoCampo.SELECT],
      },

      // Dados de Exame/Amostra
      {
        codigo: CamposPadraoSistema.TIPO_AMOSTRA,
        nome: 'Tipo de Amostra',
        descricao: 'Tipo de amostra biológica (Sangue, Urina, Fezes, etc)',
        categoria: 'Dados de Exame/Amostra',
        tiposCampoSugeridos: [TipoCampo.SELECT],
      },
      {
        codigo: CamposPadraoSistema.METODO_COLETA,
        nome: 'Método de Coleta',
        descricao: 'Método utilizado para coletar a amostra',
        categoria: 'Dados de Exame/Amostra',
        tiposCampoSugeridos: [TipoCampo.SELECT, TipoCampo.TEXTO_LONGO],
      },
      {
        codigo: CamposPadraoSistema.TIPO_RECIPIENTE,
        nome: 'Tipo de Recipiente',
        descricao: 'Tipo de recipiente para amostra (Tubo, Frasco, etc)',
        categoria: 'Dados de Exame/Amostra',
        tiposCampoSugeridos: [TipoCampo.SELECT],
      },
      {
        codigo: CamposPadraoSistema.CONDICAO_JEJUM,
        nome: 'Condição de Jejum',
        descricao: 'Status de jejum do paciente',
        categoria: 'Dados de Exame/Amostra',
        tiposCampoSugeridos: [TipoCampo.SELECT, TipoCampo.RADIO],
      },
      {
        codigo: CamposPadraoSistema.PREPARO_PACIENTE,
        nome: 'Preparo do Paciente',
        descricao: 'Instruções de preparo seguidas pelo paciente',
        categoria: 'Dados de Exame/Amostra',
        tiposCampoSugeridos: [
          TipoCampo.MULTIPLA_ESCOLHA,
          TipoCampo.TEXTO_LONGO,
        ],
      },

      // Dados Clínicos
      {
        codigo: CamposPadraoSistema.SINTOMAS,
        nome: 'Sintomas',
        descricao: 'Sintomas apresentados pelo paciente',
        categoria: 'Dados Clínicos',
        tiposCampoSugeridos: [
          TipoCampo.MULTIPLA_ESCOLHA,
          TipoCampo.TEXTO_LONGO,
        ],
      },
      {
        codigo: CamposPadraoSistema.MEDICAMENTOS_USO,
        nome: 'Medicamentos em Uso',
        descricao: 'Medicamentos que o paciente está utilizando',
        categoria: 'Dados Clínicos',
        tiposCampoSugeridos: [TipoCampo.TEXTO_LONGO, TipoCampo.LISTA],
      },
      {
        codigo: CamposPadraoSistema.ALERGIAS,
        nome: 'Alergias',
        descricao: 'Alergias conhecidas do paciente',
        categoria: 'Dados Clínicos',
        tiposCampoSugeridos: [
          TipoCampo.MULTIPLA_ESCOLHA,
          TipoCampo.TEXTO_LONGO,
        ],
      },
      {
        codigo: CamposPadraoSistema.HISTORICO_FAMILIAR,
        nome: 'Histórico Familiar',
        descricao: 'Histórico de doenças na família',
        categoria: 'Dados Clínicos',
        tiposCampoSugeridos: [TipoCampo.TEXTO_LONGO],
      },
      {
        codigo: CamposPadraoSistema.COMORBIDADES,
        nome: 'Comorbidades',
        descricao: 'Doenças/condições pré-existentes',
        categoria: 'Dados Clínicos',
        tiposCampoSugeridos: [TipoCampo.MULTIPLA_ESCOLHA],
      },

      // Resultados e Interpretações
      {
        codigo: CamposPadraoSistema.RESULTADO_QUALITATIVO,
        nome: 'Resultado Qualitativo',
        descricao: 'Resultado qualitativo do exame',
        categoria: 'Resultados e Interpretações',
        tiposCampoSugeridos: [TipoCampo.SELECT, TipoCampo.RADIO],
      },
      {
        codigo: CamposPadraoSistema.INTERPRETACAO,
        nome: 'Interpretação',
        descricao: 'Interpretação dos resultados do exame',
        categoria: 'Resultados e Interpretações',
        tiposCampoSugeridos: [TipoCampo.TEXTO_LONGO, TipoCampo.TEXTO_RICO],
      },
      {
        codigo: CamposPadraoSistema.OBSERVACOES_TECNICAS,
        nome: 'Observações Técnicas',
        descricao: 'Observações técnicas sobre o exame',
        categoria: 'Resultados e Interpretações',
        tiposCampoSugeridos: [TipoCampo.TEXTO_LONGO],
      },
      {
        codigo: CamposPadraoSistema.CONCLUSAO_LAUDO,
        nome: 'Conclusão do Laudo',
        descricao: 'Conclusão final do laudo médico',
        categoria: 'Resultados e Interpretações',
        tiposCampoSugeridos: [TipoCampo.TEXTO_RICO, TipoCampo.TEXTO_LONGO],
      },

      // Controles e Status
      {
        codigo: CamposPadraoSistema.STATUS_EXAME,
        nome: 'Status do Exame',
        descricao: 'Status atual do exame',
        categoria: 'Controles e Status',
        tiposCampoSugeridos: [TipoCampo.SELECT],
      },
      {
        codigo: CamposPadraoSistema.PRIORIDADE,
        nome: 'Prioridade',
        descricao: 'Prioridade de execução do exame',
        categoria: 'Controles e Status',
        tiposCampoSugeridos: [TipoCampo.SELECT, TipoCampo.RADIO],
      },
      {
        codigo: CamposPadraoSistema.URGENCIA,
        nome: 'Urgência',
        descricao: 'Nível de urgência do exame',
        categoria: 'Controles e Status',
        tiposCampoSugeridos: [TipoCampo.SELECT, TipoCampo.SWITCH],
      },

      // Outros
      {
        codigo: CamposPadraoSistema.SIM_NAO,
        nome: 'Sim/Não',
        descricao: 'Campo binário de sim/não',
        categoria: 'Outros',
        tiposCampoSugeridos: [
          TipoCampo.RADIO,
          TipoCampo.SWITCH,
          TipoCampo.SELECT,
        ],
      },
      {
        codigo: CamposPadraoSistema.PRESENCA_AUSENCIA,
        nome: 'Presença/Ausência',
        descricao: 'Indica presença ou ausência de algo',
        categoria: 'Outros',
        tiposCampoSugeridos: [TipoCampo.RADIO, TipoCampo.SELECT],
      },
      {
        codigo: CamposPadraoSistema.POSITIVO_NEGATIVO,
        nome: 'Positivo/Negativo',
        descricao: 'Resultado positivo ou negativo',
        categoria: 'Outros',
        tiposCampoSugeridos: [TipoCampo.RADIO, TipoCampo.SELECT],
      },
    ];
  }

  private getTipoCampoLabel(tipo: TipoCampo): string {
    const labels = {
      [TipoCampo.TEXTO]: 'Texto Curto',
      [TipoCampo.TEXTO_LONGO]: 'Texto Longo',
      [TipoCampo.TEXTO_RICO]: 'Texto Rico (HTML)',
      [TipoCampo.EMAIL]: 'E-mail',
      [TipoCampo.URL]: 'URL',
      [TipoCampo.TELEFONE]: 'Telefone',
      [TipoCampo.CPF]: 'CPF',
      [TipoCampo.CNPJ]: 'CNPJ',
      [TipoCampo.CEP]: 'CEP',
      [TipoCampo.NUMERO]: 'Número Inteiro',
      [TipoCampo.DECIMAL]: 'Número Decimal',
      [TipoCampo.MOEDA]: 'Valor Monetário',
      [TipoCampo.PORCENTAGEM]: 'Porcentagem',
      [TipoCampo.DATA]: 'Data',
      [TipoCampo.HORA]: 'Hora',
      [TipoCampo.DATA_HORA]: 'Data e Hora',
      [TipoCampo.PERIODO_DATA]: 'Período de Datas',
      [TipoCampo.SELECT]: 'Seleção (Dropdown)',
      [TipoCampo.RADIO]: 'Opção Única (Radio)',
      [TipoCampo.CHECKBOX]: 'Caixa de Seleção',
      [TipoCampo.SWITCH]: 'Interruptor (Liga/Desliga)',
      [TipoCampo.MULTIPLA_ESCOLHA]: 'Múltipla Escolha',
      [TipoCampo.ARQUIVO]: 'Upload de Arquivo',
      [TipoCampo.IMAGEM]: 'Upload de Imagem',
      [TipoCampo.ASSINATURA]: 'Assinatura Digital',
      [TipoCampo.LOCALIZACAO]: 'Localização (GPS)',
      [TipoCampo.CODIGO_BARRAS]: 'Código de Barras',
      [TipoCampo.QR_CODE]: 'QR Code',
      [TipoCampo.SECAO]: 'Seção',
      [TipoCampo.SEPARADOR]: 'Separador Visual',
      [TipoCampo.TITULO]: 'Título',
      [TipoCampo.PARAGRAFO]: 'Parágrafo',
      [TipoCampo.HTML]: 'HTML Personalizado',
      [TipoCampo.TABELA]: 'Tabela',
      [TipoCampo.LISTA]: 'Lista',
      [TipoCampo.MATRIZ]: 'Matriz',
      [TipoCampo.FORMULA]: 'Fórmula/Cálculo',
      [TipoCampo.CONDICIONAL]: 'Campo Condicional',
    };
    return labels[tipo] || tipo;
  }

  private getTipoCampoCategoria(tipo: TipoCampo): string {
    if (
      [
        TipoCampo.TEXTO,
        TipoCampo.TEXTO_LONGO,
        TipoCampo.TEXTO_RICO,
        TipoCampo.EMAIL,
        TipoCampo.URL,
        TipoCampo.TELEFONE,
        TipoCampo.CPF,
        TipoCampo.CNPJ,
        TipoCampo.CEP,
      ].includes(tipo)
    ) {
      return 'Campos de texto';
    }

    if (
      [
        TipoCampo.NUMERO,
        TipoCampo.DECIMAL,
        TipoCampo.MOEDA,
        TipoCampo.PORCENTAGEM,
      ].includes(tipo)
    ) {
      return 'Campos numéricos';
    }

    if (
      [
        TipoCampo.DATA,
        TipoCampo.HORA,
        TipoCampo.DATA_HORA,
        TipoCampo.PERIODO_DATA,
      ].includes(tipo)
    ) {
      return 'Campos de data/hora';
    }

    if (
      [
        TipoCampo.SELECT,
        TipoCampo.RADIO,
        TipoCampo.CHECKBOX,
        TipoCampo.SWITCH,
        TipoCampo.MULTIPLA_ESCOLHA,
      ].includes(tipo)
    ) {
      return 'Campos de seleção';
    }

    if (
      [
        TipoCampo.ARQUIVO,
        TipoCampo.IMAGEM,
        TipoCampo.ASSINATURA,
        TipoCampo.LOCALIZACAO,
        TipoCampo.CODIGO_BARRAS,
        TipoCampo.QR_CODE,
      ].includes(tipo)
    ) {
      return 'Campos especiais';
    }

    if (
      [
        TipoCampo.SECAO,
        TipoCampo.SEPARADOR,
        TipoCampo.TITULO,
        TipoCampo.PARAGRAFO,
        TipoCampo.HTML,
      ].includes(tipo)
    ) {
      return 'Campos de layout';
    }

    if (
      [
        TipoCampo.TABELA,
        TipoCampo.LISTA,
        TipoCampo.MATRIZ,
        TipoCampo.FORMULA,
        TipoCampo.CONDICIONAL,
      ].includes(tipo)
    ) {
      return 'Campos complexos';
    }

    return 'Outros';
  }

  private tipoCampoPermiteAlternativas(tipo: TipoCampo): boolean {
    return [
      TipoCampo.SELECT,
      TipoCampo.RADIO,
      TipoCampo.CHECKBOX,
      TipoCampo.MULTIPLA_ESCOLHA,
    ].includes(tipo);
  }

  private getTipoCampoDescricao(tipo: TipoCampo): string {
    const descricoes = {
      [TipoCampo.SELECT]:
        'Campo de seleção com lista suspensa (dropdown). Permite escolher uma opção entre várias.',
      [TipoCampo.RADIO]:
        'Botões de opção onde apenas uma alternativa pode ser selecionada.',
      [TipoCampo.CHECKBOX]: 'Caixas de seleção que permitem marcar/desmarcar.',
      [TipoCampo.MULTIPLA_ESCOLHA]:
        'Permite selecionar múltiplas opções de uma lista.',
      [TipoCampo.TEXTO]: 'Campo de texto curto de uma linha.',
      [TipoCampo.TEXTO_LONGO]: 'Campo de texto de múltiplas linhas (textarea).',
      [TipoCampo.NUMERO]: 'Campo para números inteiros.',
      [TipoCampo.DECIMAL]: 'Campo para números decimais.',
      [TipoCampo.DATA]: 'Seletor de data.',
      [TipoCampo.SWITCH]: 'Interruptor de liga/desliga para valores booleanos.',
    };
    return descricoes[tipo] || '';
  }
}
