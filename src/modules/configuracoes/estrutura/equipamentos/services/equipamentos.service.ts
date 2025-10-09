import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Equipamento,
  SituacaoEquipamento,
} from '../entities/equipamento.entity';
import { CreateEquipamentoDto } from '../dto/create-equipamento.dto';
import { UpdateEquipamentoDto } from '../dto/update-equipamento.dto';

@Injectable()
export class EquipamentosService {
  constructor(
    @InjectRepository(Equipamento)
    private readonly equipamentoRepository: Repository<Equipamento>,
  ) {}

  async create(
    createEquipamentoDto: CreateEquipamentoDto,
    criadoPor: string,
  ): Promise<Equipamento> {
    const equipamento = this.equipamentoRepository.create({
      ...createEquipamentoDto,
      criadoPor,
      atualizadoPor: criadoPor,
    });

    return await this.equipamentoRepository.save(equipamento);
  }

  async findAll(): Promise<Equipamento[]> {
    return await this.equipamentoRepository.find({
      relations: ['sala', 'setor', 'fornecedor', 'unidade'],
      order: { nome: 'ASC' },
    });
  }

  async findAllAtivos(): Promise<Equipamento[]> {
    return await this.equipamentoRepository.find({
      where: { ativo: true },
      relations: ['sala', 'setor', 'fornecedor', 'unidade'],
      order: { nome: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Equipamento> {
    const equipamento = await this.equipamentoRepository.findOne({
      where: { id },
      relations: ['sala', 'setor', 'fornecedor', 'unidade'],
    });

    if (!equipamento) {
      throw new NotFoundException(`Equipamento com ID ${id} não encontrado`);
    }

    return equipamento;
  }

  async findByPatrimonio(patrimonio: string): Promise<Equipamento> {
    const equipamento = await this.equipamentoRepository.findOne({
      where: { patrimonio },
      relations: ['sala', 'setor', 'fornecedor', 'unidade'],
    });

    if (!equipamento) {
      throw new NotFoundException(
        `Equipamento com patrimônio ${patrimonio} não encontrado`,
      );
    }

    return equipamento;
  }

  async findBySituacao(situacao: SituacaoEquipamento): Promise<Equipamento[]> {
    return await this.equipamentoRepository.find({
      where: { situacao },
      relations: ['sala', 'setor', 'fornecedor', 'unidade'],
      order: { nome: 'ASC' },
    });
  }

  async findByUnidade(unidadeId: string): Promise<Equipamento[]> {
    return await this.equipamentoRepository.find({
      where: { unidadeId },
      relations: ['sala', 'setor', 'fornecedor'],
      order: { nome: 'ASC' },
    });
  }

  async findBySala(salaId: string): Promise<Equipamento[]> {
    return await this.equipamentoRepository.find({
      where: { salaId },
      relations: ['sala', 'setor', 'fornecedor', 'unidade'],
      order: { nome: 'ASC' },
    });
  }

  async findBySetor(setorId: string): Promise<Equipamento[]> {
    return await this.equipamentoRepository.find({
      where: { setorId },
      relations: ['sala', 'setor', 'fornecedor', 'unidade'],
      order: { nome: 'ASC' },
    });
  }

  async findManutencaoVencida(): Promise<Equipamento[]> {
    const hoje = new Date();

    return await this.equipamentoRepository
      .createQueryBuilder('equipamento')
      .where('equipamento.data_proxima_manutencao < :hoje', { hoje })
      .andWhere('equipamento.situacao = :situacao', {
        situacao: SituacaoEquipamento.ATIVO,
      })
      .leftJoinAndSelect('equipamento.sala', 'sala')
      .leftJoinAndSelect('equipamento.setor', 'setor')
      .leftJoinAndSelect('equipamento.unidade', 'unidade')
      .orderBy('equipamento.data_proxima_manutencao', 'ASC')
      .getMany();
  }

  async update(
    id: string,
    updateEquipamentoDto: UpdateEquipamentoDto,
    atualizadoPor: string,
  ): Promise<Equipamento> {
    const equipamento = await this.findOne(id);

    Object.assign(equipamento, updateEquipamentoDto, { atualizadoPor });

    return await this.equipamentoRepository.save(equipamento);
  }

  async updateSituacao(
    id: string,
    situacao: SituacaoEquipamento,
    atualizadoPor: string,
  ): Promise<Equipamento> {
    const equipamento = await this.findOne(id);
    equipamento.situacao = situacao;
    equipamento.atualizadoPor = atualizadoPor;

    return await this.equipamentoRepository.save(equipamento);
  }

  async toggleAtivo(id: string, atualizadoPor: string): Promise<Equipamento> {
    const equipamento = await this.findOne(id);
    equipamento.ativo = !equipamento.ativo;
    equipamento.atualizadoPor = atualizadoPor;

    return await this.equipamentoRepository.save(equipamento);
  }

  async remove(id: string): Promise<void> {
    const equipamento = await this.findOne(id);
    await this.equipamentoRepository.remove(equipamento);
  }

  async getEstatisticas() {
    const total = await this.equipamentoRepository.count();
    const ativos = await this.equipamentoRepository.count({
      where: { ativo: true },
    });
    const inativos = total - ativos;

    const porSituacao = await this.equipamentoRepository
      .createQueryBuilder('equipamento')
      .select('equipamento.situacao', 'situacao')
      .addSelect('COUNT(*)', 'quantidade')
      .groupBy('equipamento.situacao')
      .getRawMany();

    const manutencaoVencida = await this.equipamentoRepository.count({
      where: {
        situacao: SituacaoEquipamento.ATIVO,
      },
    });

    return {
      total,
      ativos,
      inativos,
      porSituacao,
      manutencaoVencida,
    };
  }
}
