import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRespostaFormularioDto } from './dto/create-resposta-formulario.dto';
import { UpdateRespostaFormularioDto } from './dto/update-resposta-formulario.dto';
import {
  RespostaFormulario,
  StatusResposta,
} from './entities/resposta-formulario.entity';

@Injectable()
export class RespostaFormularioService {
  constructor(
    @InjectRepository(RespostaFormulario)
    private respostaRepository: Repository<RespostaFormulario>,
  ) {}

  async create(
    createRespostaDto: CreateRespostaFormularioDto,
  ): Promise<RespostaFormulario> {
    if (!createRespostaDto.codigoResposta) {
      createRespostaDto.codigoResposta = await this.gerarCodigoResposta();
    }

    if (!createRespostaDto.status) {
      createRespostaDto.status = StatusResposta.RASCUNHO;
    }

    const resposta = this.respostaRepository.create(createRespostaDto);
    return await this.respostaRepository.save(resposta);
  }

  async findAll(): Promise<RespostaFormulario[]> {
    return await this.respostaRepository.find({
      relations: ['formulario', 'paciente', 'usuarioPreenchimento'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByFormulario(formularioId: string): Promise<RespostaFormulario[]> {
    return await this.respostaRepository.find({
      where: { formularioId },
      relations: ['paciente', 'usuarioPreenchimento'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByPaciente(pacienteId: string): Promise<RespostaFormulario[]> {
    return await this.respostaRepository.find({
      where: { pacienteId },
      relations: ['formulario', 'usuarioPreenchimento'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByUsuario(usuarioId: string): Promise<RespostaFormulario[]> {
    return await this.respostaRepository.find({
      where: { usuarioPreenchimentoId: usuarioId },
      relations: ['formulario', 'paciente'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByStatus(status: StatusResposta): Promise<RespostaFormulario[]> {
    return await this.respostaRepository.find({
      where: { status },
      relations: ['formulario', 'paciente', 'usuarioPreenchimento'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByUnidadeSaude(
    unidadeSaudeId: string,
  ): Promise<RespostaFormulario[]> {
    return await this.respostaRepository
      .createQueryBuilder('resposta')
      .leftJoinAndSelect('resposta.formulario', 'formulario')
      .leftJoinAndSelect('resposta.paciente', 'paciente')
      .leftJoinAndSelect('resposta.usuarioPreenchimento', 'usuario')
      .where('formulario.unidade_saude_id = :unidadeSaudeId', {
        unidadeSaudeId,
      })
      .orderBy('resposta.created_at', 'DESC')
      .getMany();
  }

  async findByOrdemServico(
    ordemServicoId: string,
  ): Promise<RespostaFormulario[]> {
    return await this.respostaRepository.find({
      where: { ordemServicoId },
      relations: ['formulario', 'paciente', 'usuarioPreenchimento'],
      order: { createdAt: 'DESC' },
    });
  }

  async findCompletas(): Promise<RespostaFormulario[]> {
    return await this.respostaRepository.find({
      where: { percentualCompleto: 100 },
      relations: ['formulario', 'paciente', 'usuarioPreenchimento'],
      order: { createdAt: 'DESC' },
    });
  }

  async findPendentesRevisao(): Promise<RespostaFormulario[]> {
    return await this.respostaRepository.find({
      where: { status: StatusResposta.REVISAO },
      relations: ['formulario', 'paciente', 'usuarioPreenchimento'],
      order: { createdAt: 'DESC' },
    });
  }

  async findAssinadasDigitalmente(): Promise<RespostaFormulario[]> {
    return await this.respostaRepository.find({
      where: { assinado: true },
      relations: ['formulario', 'paciente', 'usuarioPreenchimento'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByCodigo(codigo: string): Promise<RespostaFormulario> {
    const resposta = await this.respostaRepository.findOne({
      where: { codigoResposta: codigo },
      relations: ['formulario', 'paciente', 'usuarioPreenchimento'],
    });

    if (!resposta) {
      throw new NotFoundException(
        `Resposta com código ${codigo} não encontrada`,
      );
    }

    return resposta;
  }

  async search(termo: string): Promise<RespostaFormulario[]> {
    return await this.respostaRepository
      .createQueryBuilder('resposta')
      .leftJoinAndSelect('resposta.formulario', 'formulario')
      .leftJoinAndSelect('resposta.paciente', 'paciente')
      .leftJoinAndSelect('resposta.usuarioPreenchimento', 'usuario')
      .where('resposta.codigo_resposta ILIKE :termo', { termo: `%${termo}%` })
      .orWhere('resposta.observacoes ILIKE :termo', { termo: `%${termo}%` })
      .orWhere('formulario.nome_formulario ILIKE :termo', {
        termo: `%${termo}%`,
      })
      .orWhere('paciente.nome_completo ILIKE :termo', { termo: `%${termo}%` })
      .orderBy('resposta.created_at', 'DESC')
      .getMany();
  }

  async findOne(id: string): Promise<RespostaFormulario> {
    const resposta = await this.respostaRepository.findOne({
      where: { id },
      relations: ['formulario', 'paciente', 'usuarioPreenchimento'],
    });

    if (!resposta) {
      throw new NotFoundException(`Resposta com ID ${id} não encontrada`);
    }

    return resposta;
  }

  async update(
    id: string,
    updateRespostaDto: UpdateRespostaFormularioDto,
  ): Promise<RespostaFormulario> {
    const resposta = await this.findOne(id);

    if (resposta.status === StatusResposta.CONCLUIDO) {
      throw new BadRequestException('Não é possível editar resposta concluída');
    }

    if (resposta.assinado) {
      throw new BadRequestException(
        'Não é possível editar resposta assinada digitalmente',
      );
    }

    // Atualiza a data da última edição
    resposta.dataUltimaEdicao = new Date();

    Object.assign(resposta, updateRespostaDto);
    return await this.respostaRepository.save(resposta);
  }

  async updateStatus(
    id: string,
    status: StatusResposta,
    observacoes?: string,
  ): Promise<RespostaFormulario> {
    const resposta = await this.findOne(id);

    if (resposta.assinado && status === StatusResposta.RASCUNHO) {
      throw new BadRequestException(
        'Não é possível alterar status de resposta assinada digitalmente',
      );
    }

    resposta.status = status;
    if (observacoes) {
      resposta.observacoesValidacao = observacoes;
    }

    if (status === StatusResposta.CONCLUIDO) {
      resposta.percentualCompleto = 100;
      resposta.dataFimPreenchimento = new Date();
    }

    return await this.respostaRepository.save(resposta);
  }

  async finalizar(id: string): Promise<RespostaFormulario> {
    const resposta = await this.findOne(id);

    if (resposta.status === StatusResposta.CONCLUIDO) {
      throw new BadRequestException('Resposta já está concluída');
    }

    // Validar se a resposta está completa
    const validacao = await this.validarResposta(id);
    if (!validacao.valida) {
      throw new BadRequestException(
        `Resposta incompleta: ${validacao.erros.join(', ')}`,
      );
    }

    resposta.status = StatusResposta.CONCLUIDO;
    resposta.percentualCompleto = 100;
    resposta.dataFimPreenchimento = new Date();

    return await this.respostaRepository.save(resposta);
  }

  async assinarDigitalmente(
    id: string,
    hashAssinatura: string,
    certificadoDigital: string,
  ): Promise<RespostaFormulario> {
    const resposta = await this.findOne(id);

    if (resposta.status !== StatusResposta.CONCLUIDO) {
      throw new BadRequestException('Só é possível assinar resposta concluída');
    }

    if (resposta.assinado) {
      throw new BadRequestException('Resposta já está assinada digitalmente');
    }

    resposta.assinado = true;
    resposta.assinaturaDigital = `${hashAssinatura}|${certificadoDigital}`;
    resposta.dataAssinatura = new Date();

    return await this.respostaRepository.save(resposta);
  }

  async calcularPercentualCompleto(id: string): Promise<number> {
    const resposta = await this.findOne(id);

    if (!resposta.formulario || !resposta.formulario.campos) {
      return 0;
    }

    const camposObrigatorios = resposta.formulario.campos.filter(
      (campo) => campo.obrigatorio,
    );
    if (camposObrigatorios.length === 0) {
      return 100;
    }

    let camposPreenchidos = 0;

    // Simular cálculo baseado em respostas de campos
    // Em implementação real, seria baseado nas respostas dos campos
    camposPreenchidos = Math.floor(Math.random() * camposObrigatorios.length);

    const percentual = (camposPreenchidos / camposObrigatorios.length) * 100;

    // Atualizar o percentual na resposta
    await this.respostaRepository.update(id, {
      percentualCompleto: percentual,
    });

    return percentual;
  }

  async duplicar(
    id: string,
    novoPacienteId?: string,
  ): Promise<RespostaFormulario> {
    const respostaOriginal = await this.findOne(id);

    const novaResposta = this.respostaRepository.create({
      ...respostaOriginal,
      id: undefined,
      codigoResposta: await this.gerarCodigoResposta(),
      pacienteId: novoPacienteId || respostaOriginal.pacienteId,
      status: StatusResposta.RASCUNHO,
      percentualCompleto: 0,
      assinado: false,
      assinaturaDigital: null,
      dataFimPreenchimento: null,
      dataAssinatura: null,
      createdAt: undefined,
      updatedAt: undefined,
    });

    return await this.respostaRepository.save(novaResposta);
  }

  async remove(id: string): Promise<void> {
    const resposta = await this.findOne(id);

    if (resposta.status === StatusResposta.CONCLUIDO) {
      throw new BadRequestException(
        'Não é possível excluir resposta concluída',
      );
    }

    if (resposta.assinado) {
      throw new BadRequestException(
        'Não é possível excluir resposta assinada digitalmente',
      );
    }

    await this.respostaRepository.remove(resposta);
  }

  async getEstatisticas() {
    const [
      total,
      completas,
      incompletas,
      concluidas,
      assinadas,
      porStatus,
      porFormulario,
    ] = await Promise.all([
      this.respostaRepository.count(),
      this.respostaRepository.count({ where: { percentualCompleto: 100 } }),
      this.respostaRepository
        .createQueryBuilder('resposta')
        .where('resposta.percentual_completo < :percentual', {
          percentual: 100,
        })
        .getCount(),
      this.respostaRepository.count({
        where: { status: StatusResposta.CONCLUIDO },
      }),
      this.respostaRepository.count({ where: { assinado: true } }),
      this.respostaRepository
        .createQueryBuilder('resposta')
        .select('resposta.status', 'status')
        .addSelect('COUNT(*)', 'total')
        .groupBy('resposta.status')
        .getRawMany(),
      this.respostaRepository
        .createQueryBuilder('resposta')
        .leftJoin('resposta.formulario', 'formulario')
        .select('formulario.nome_formulario', 'formulario')
        .addSelect('COUNT(*)', 'total')
        .groupBy('formulario.nome_formulario')
        .getRawMany(),
    ]);

    return {
      total,
      completas,
      incompletas,
      concluidas,
      assinadas,
      porStatus,
      porFormulario,
    };
  }

  async validarResposta(
    id: string,
  ): Promise<{ valida: boolean; erros: string[] }> {
    const resposta = await this.findOne(id);
    const erros: string[] = [];

    if (!resposta.formulario || !resposta.formulario.campos) {
      erros.push('Formulário não encontrado ou sem campos');
      return { valida: false, erros };
    }

    const camposObrigatorios = resposta.formulario.campos.filter(
      (campo) => campo.obrigatorio,
    );

    // Simulação de validação
    // Em implementação real, seria baseado nas respostas dos campos relacionados
    for (const campo of camposObrigatorios) {
      // Simular verificação de preenchimento
      if (Math.random() > 0.8) {
        erros.push(`Campo obrigatório não preenchido: ${campo.nomeCampo}`);
      }
    }

    return {
      valida: erros.length === 0,
      erros,
    };
  }

  private async gerarCodigoResposta(): Promise<string> {
    const ano = new Date().getFullYear();
    const mes = (new Date().getMonth() + 1).toString().padStart(2, '0');

    const ultimaResposta = await this.respostaRepository
      .createQueryBuilder('resposta')
      .where('resposta.codigo_resposta LIKE :pattern', {
        pattern: `RESP${ano}${mes}%`,
      })
      .orderBy('resposta.codigo_resposta', 'DESC')
      .getOne();

    let proximoNumero = 1;

    if (ultimaResposta) {
      const numeroAtual = parseInt(ultimaResposta.codigoResposta.slice(-4));
      proximoNumero = numeroAtual + 1;
    }

    return `RESP${ano}${mes}${proximoNumero.toString().padStart(4, '0')}`;
  }
}
