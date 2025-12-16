import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DespesaCaixa } from '../entities/despesa-caixa.entity';
import { Caixa, StatusCaixa } from '../entities/caixa.entity';
import { CreateDespesaCaixaDto } from '../dto/create-despesa-caixa.dto';

@Injectable()
export class DespesaCaixaService {
  constructor(
    @InjectRepository(DespesaCaixa)
    private readonly despesaRepository: Repository<DespesaCaixa>,
    @InjectRepository(Caixa)
    private readonly caixaRepository: Repository<Caixa>,
  ) {}

  /**
   * Cria uma nova despesa vinculada ao caixa
   */
  async criar(
    dto: CreateDespesaCaixaDto,
    tenantId?: string,
  ): Promise<DespesaCaixa> {
    // Verificar se o caixa existe e está aberto
    const caixa = await this.caixaRepository.findOne({
      where: { id: dto.caixaId },
    });

    if (!caixa) {
      throw new NotFoundException('Caixa não encontrado');
    }

    if (caixa.status === StatusCaixa.FECHADO) {
      throw new BadRequestException(
        'Não é possível adicionar despesas em um caixa fechado',
      );
    }

    const despesa = this.despesaRepository.create({
      ...dto,
      tenantId,
    });

    return await this.despesaRepository.save(despesa);
  }

  /**
   * Lista todas as despesas de um caixa
   */
  async listarPorCaixa(caixaId: string): Promise<DespesaCaixa[]> {
    return await this.despesaRepository.find({
      where: { caixaId },
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Busca despesa por ID
   */
  async buscarPorId(id: string): Promise<DespesaCaixa> {
    const despesa = await this.despesaRepository.findOne({
      where: { id },
      relations: ['caixa'],
    });

    if (!despesa) {
      throw new NotFoundException('Despesa não encontrada');
    }

    return despesa;
  }

  /**
   * Remove uma despesa (apenas se o caixa ainda estiver aberto)
   */
  async remover(id: string): Promise<void> {
    const despesa = await this.buscarPorId(id);

    if (despesa.caixa.status === StatusCaixa.FECHADO) {
      throw new BadRequestException(
        'Não é possível remover despesas de um caixa fechado',
      );
    }

    await this.despesaRepository.remove(despesa);
  }

  /**
   * Calcula o total de despesas de um caixa
   */
  async calcularTotalDespesas(caixaId: string): Promise<number> {
    const result = await this.despesaRepository
      .createQueryBuilder('despesa')
      .select('SUM(despesa.valor)', 'total')
      .where('despesa.caixa_id = :caixaId', { caixaId })
      .getRawOne();

    return Number(result?.total) || 0;
  }
}
