import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Imobilizado,
  CategoriaImobilizado,
  SituacaoImobilizado,
} from '../entities/imobilizado.entity';
import { CreateImobilizadoDto } from '../dto/create-imobilizado.dto';
import { UpdateImobilizadoDto } from '../dto/update-imobilizado.dto';

@Injectable()
export class ImobilizadosService {
  constructor(
    @InjectRepository(Imobilizado)
    private readonly imobilizadoRepository: Repository<Imobilizado>,
  ) {}

  async create(
    createImobilizadoDto: CreateImobilizadoDto,
    criadoPor: string,
  ): Promise<Imobilizado> {
    const imobilizado = this.imobilizadoRepository.create({
      ...createImobilizadoDto,
      criadoPor,
      atualizadoPor: criadoPor,
    });

    return await this.imobilizadoRepository.save(imobilizado);
  }

  async findAll(): Promise<Imobilizado[]> {
    return await this.imobilizadoRepository.find({
      relations: ['sala', 'setor', 'fornecedor', 'unidade'],
      order: { descricao: 'ASC' },
    });
  }

  async findAllAtivos(): Promise<Imobilizado[]> {
    return await this.imobilizadoRepository.find({
      where: { ativo: true },
      relations: ['sala', 'setor', 'fornecedor', 'unidade'],
      order: { descricao: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Imobilizado> {
    const imobilizado = await this.imobilizadoRepository.findOne({
      where: { id },
      relations: ['sala', 'setor', 'fornecedor', 'unidade'],
    });

    if (!imobilizado) {
      throw new NotFoundException(`Imobilizado com ID ${id} não encontrado`);
    }

    return imobilizado;
  }

  async findByPatrimonio(patrimonio: string): Promise<Imobilizado> {
    const imobilizado = await this.imobilizadoRepository.findOne({
      where: { patrimonio },
      relations: ['sala', 'setor', 'fornecedor', 'unidade'],
    });

    if (!imobilizado) {
      throw new NotFoundException(
        `Imobilizado com patrimônio ${patrimonio} não encontrado`,
      );
    }

    return imobilizado;
  }

  async findByCategoria(
    categoria: CategoriaImobilizado,
  ): Promise<Imobilizado[]> {
    return await this.imobilizadoRepository.find({
      where: { categoria },
      relations: ['sala', 'setor', 'fornecedor', 'unidade'],
      order: { descricao: 'ASC' },
    });
  }

  async findBySituacao(situacao: SituacaoImobilizado): Promise<Imobilizado[]> {
    return await this.imobilizadoRepository.find({
      where: { situacao },
      relations: ['sala', 'setor', 'fornecedor', 'unidade'],
      order: { descricao: 'ASC' },
    });
  }

  async findByUnidade(unidadeId: string): Promise<Imobilizado[]> {
    return await this.imobilizadoRepository.find({
      where: { unidadeId },
      relations: ['sala', 'setor', 'fornecedor'],
      order: { descricao: 'ASC' },
    });
  }

  async findBySala(salaId: string): Promise<Imobilizado[]> {
    return await this.imobilizadoRepository.find({
      where: { salaId },
      relations: ['sala', 'setor', 'fornecedor', 'unidade'],
      order: { descricao: 'ASC' },
    });
  }

  async findBySetor(setorId: string): Promise<Imobilizado[]> {
    return await this.imobilizadoRepository.find({
      where: { setorId },
      relations: ['sala', 'setor', 'fornecedor', 'unidade'],
      order: { descricao: 'ASC' },
    });
  }

  async findDepreciacaoTotal(): Promise<Imobilizado[]> {
    return await this.imobilizadoRepository
      .createQueryBuilder('imobilizado')
      .where('imobilizado.depreciacao_acumulada >= imobilizado.valor_aquisicao')
      .andWhere('imobilizado.situacao = :situacao', {
        situacao: SituacaoImobilizado.ATIVO,
      })
      .leftJoinAndSelect('imobilizado.sala', 'sala')
      .leftJoinAndSelect('imobilizado.setor', 'setor')
      .leftJoinAndSelect('imobilizado.unidade', 'unidade')
      .orderBy('imobilizado.descricao', 'ASC')
      .getMany();
  }

  async update(
    id: string,
    updateImobilizadoDto: UpdateImobilizadoDto,
    atualizadoPor: string,
  ): Promise<Imobilizado> {
    const imobilizado = await this.findOne(id);

    Object.assign(imobilizado, updateImobilizadoDto, { atualizadoPor });

    return await this.imobilizadoRepository.save(imobilizado);
  }

  async updateSituacao(
    id: string,
    situacao: SituacaoImobilizado,
    atualizadoPor: string,
    dataBaixa?: Date,
    motivoBaixa?: string,
    valorBaixa?: number,
  ): Promise<Imobilizado> {
    const imobilizado = await this.findOne(id);
    imobilizado.situacao = situacao;
    imobilizado.atualizadoPor = atualizadoPor;

    if (situacao !== SituacaoImobilizado.ATIVO) {
      imobilizado.dataBaixa = dataBaixa || new Date();
      imobilizado.motivoBaixa = motivoBaixa;
      imobilizado.valorBaixa = valorBaixa;
    }

    return await this.imobilizadoRepository.save(imobilizado);
  }

  async updateDepreciacaoAcumulada(
    id: string,
    depreciacaoAcumulada: number,
    atualizadoPor: string,
  ): Promise<Imobilizado> {
    const imobilizado = await this.findOne(id);
    imobilizado.depreciacaoAcumulada = depreciacaoAcumulada;
    imobilizado.atualizadoPor = atualizadoPor;

    return await this.imobilizadoRepository.save(imobilizado);
  }

  async toggleAtivo(id: string, atualizadoPor: string): Promise<Imobilizado> {
    const imobilizado = await this.findOne(id);
    imobilizado.ativo = !imobilizado.ativo;
    imobilizado.atualizadoPor = atualizadoPor;

    return await this.imobilizadoRepository.save(imobilizado);
  }

  async remove(id: string): Promise<void> {
    const imobilizado = await this.findOne(id);
    await this.imobilizadoRepository.remove(imobilizado);
  }

  async getEstatisticas() {
    const total = await this.imobilizadoRepository.count();
    const ativos = await this.imobilizadoRepository.count({
      where: { ativo: true },
    });
    const inativos = total - ativos;

    const porCategoria = await this.imobilizadoRepository
      .createQueryBuilder('imobilizado')
      .select('imobilizado.categoria', 'categoria')
      .addSelect('COUNT(*)', 'quantidade')
      .groupBy('imobilizado.categoria')
      .getRawMany();

    const porSituacao = await this.imobilizadoRepository
      .createQueryBuilder('imobilizado')
      .select('imobilizado.situacao', 'situacao')
      .addSelect('COUNT(*)', 'quantidade')
      .groupBy('imobilizado.situacao')
      .getRawMany();

    const valorTotal = await this.imobilizadoRepository
      .createQueryBuilder('imobilizado')
      .select('SUM(imobilizado.valor_aquisicao)', 'total')
      .where('imobilizado.situacao = :situacao', {
        situacao: SituacaoImobilizado.ATIVO,
      })
      .getRawOne();

    const depreciacaoTotal = await this.imobilizadoRepository
      .createQueryBuilder('imobilizado')
      .select('SUM(imobilizado.depreciacao_acumulada)', 'total')
      .where('imobilizado.situacao = :situacao', {
        situacao: SituacaoImobilizado.ATIVO,
      })
      .getRawOne();

    return {
      total,
      ativos,
      inativos,
      porCategoria,
      porSituacao,
      valorTotal: parseFloat(valorTotal?.total || 0),
      depreciacaoTotal: parseFloat(depreciacaoTotal?.total || 0),
    };
  }
}
