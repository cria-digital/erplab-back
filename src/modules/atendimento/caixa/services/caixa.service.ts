import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Caixa, StatusCaixa } from '../entities/caixa.entity';
import { AbrirCaixaDto, FecharCaixaDto } from '../dto';

@Injectable()
export class CaixaService {
  constructor(
    @InjectRepository(Caixa)
    private readonly caixaRepository: Repository<Caixa>,
  ) {}

  /**
   * Abre um novo caixa para o usuário
   */
  async abrirCaixa(
    dto: AbrirCaixaDto,
    usuarioId: string,
    tenantId?: string,
  ): Promise<Caixa> {
    // Verificar se usuário tem caixa aberto
    const caixaAberto = await this.buscarCaixaAberto(usuarioId);

    if (caixaAberto) {
      const dataAbertura = new Date(caixaAberto.dataAbertura);
      const hoje = new Date();

      // Se for do mesmo dia, não pode abrir outro
      if (caixaAberto.isDoMesmoDia(hoje)) {
        throw new ConflictException('Você já possui um caixa aberto para hoje');
      }

      // Se for de outro dia, exige fechamento primeiro
      throw new BadRequestException(
        `Você possui um caixa aberto do dia ${dataAbertura.toLocaleDateString('pt-BR')}. ` +
          'Finalize-o antes de abrir um novo.',
      );
    }

    const caixa = this.caixaRepository.create({
      unidadeId: dto.unidadeId,
      aberturaEspecie: dto.aberturaEspecie,
      usuarioId,
      tenantId,
      dataAbertura: new Date(),
      status: StatusCaixa.ABERTO,
      // Inicializar valores com 0
      totalEntradasEspecie: 0,
      totalSaidasEspecie: 0,
      sangriaEspecie: 0,
      totalEntradasCredito: 0,
      totalEntradasDebito: 0,
      totalEntradasPix: 0,
    });

    return await this.caixaRepository.save(caixa);
  }

  /**
   * Fecha o caixa do usuário
   */
  async fecharCaixa(
    caixaId: string,
    dto: FecharCaixaDto,
    usuarioId: string,
  ): Promise<Caixa> {
    const caixa = await this.caixaRepository.findOne({
      where: { id: caixaId, usuarioId },
    });

    if (!caixa) {
      throw new NotFoundException('Caixa não encontrado');
    }

    if (caixa.isFechado()) {
      throw new BadRequestException('Este caixa já está fechado');
    }

    // Atualizar campos de espécie
    caixa.totalEntradasEspecie = dto.totalEntradasEspecie;
    caixa.totalSaidasEspecie = dto.totalSaidasEspecie;
    caixa.sangriaEspecie = dto.sangriaEspecie;
    caixa.saldoProximoDia = dto.saldoProximoDia;

    // Atualizar campos de outros meios de pagamento
    caixa.totalEntradasCredito = dto.totalEntradasCredito || 0;
    caixa.totalEntradasDebito = dto.totalEntradasDebito || 0;
    caixa.totalEntradasPix = dto.totalEntradasPix || 0;

    // Atualizar saldo final e status
    caixa.saldoFinal = dto.saldoFinal;
    caixa.dataFechamento = new Date();
    caixa.status = StatusCaixa.FECHADO;

    return await this.caixaRepository.save(caixa);
  }

  /**
   * Busca o caixa aberto do usuário
   */
  async buscarCaixaAberto(usuarioId: string): Promise<Caixa | null> {
    return await this.caixaRepository.findOne({
      where: {
        usuarioId,
        status: StatusCaixa.ABERTO,
      },
      order: { dataAbertura: 'DESC' },
    });
  }

  /**
   * Busca o último caixa fechado do usuário para sugerir valor de abertura
   */
  async buscarUltimoCaixaFechado(usuarioId: string): Promise<Caixa | null> {
    return await this.caixaRepository.findOne({
      where: {
        usuarioId,
        status: StatusCaixa.FECHADO,
      },
      order: { dataFechamento: 'DESC' },
    });
  }

  /**
   * Obtém o saldo sugerido para abertura (saldo próximo dia do último fechamento)
   */
  async obterSaldoSugerido(usuarioId: string): Promise<number> {
    const ultimoCaixa = await this.buscarUltimoCaixaFechado(usuarioId);
    return ultimoCaixa?.saldoProximoDia || 0;
  }

  /**
   * Busca caixa por ID
   */
  async buscarPorId(id: string): Promise<Caixa> {
    const caixa = await this.caixaRepository.findOne({
      where: { id },
      relations: ['usuario', 'unidade', 'despesas'],
    });

    if (!caixa) {
      throw new NotFoundException('Caixa não encontrado');
    }

    return caixa;
  }

  /**
   * Lista caixas do usuário com paginação
   */
  async listarCaixasUsuario(
    usuarioId: string,
    page = 1,
    limit = 10,
  ): Promise<{ data: Caixa[]; total: number }> {
    const [data, total] = await this.caixaRepository.findAndCount({
      where: { usuarioId },
      order: { dataAbertura: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
      relations: ['unidade'],
    });

    return { data, total };
  }

  /**
   * Verifica se o usuário pode iniciar atendimento (tem caixa aberto)
   */
  async verificarPermissaoAtendimento(usuarioId: string): Promise<{
    podeAtender: boolean;
    caixaAberto: Caixa | null;
    saldoSugerido: number;
  }> {
    const caixaAberto = await this.buscarCaixaAberto(usuarioId);
    const saldoSugerido = await this.obterSaldoSugerido(usuarioId);

    return {
      podeAtender: !!caixaAberto,
      caixaAberto,
      saldoSugerido,
    };
  }
}
