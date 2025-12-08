import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Equipamento } from '../entities/equipamento.entity';
import { CreateEquipamentoDto } from '../dto/create-equipamento.dto';
import { UpdateEquipamentoDto } from '../dto/update-equipamento.dto';
import { PaginatedResultDto } from '../../../../infraestrutura/common/dto/pagination.dto';

@Injectable()
export class EquipamentosService {
  constructor(
    @InjectRepository(Equipamento)
    private readonly equipamentoRepository: Repository<Equipamento>,
  ) {}

  async create(
    createEquipamentoDto: CreateEquipamentoDto,
  ): Promise<Equipamento> {
    // Verificar se código interno já existe
    const existente = await this.equipamentoRepository.findOne({
      where: { codigoInterno: createEquipamentoDto.codigoInterno },
    });

    if (existente) {
      throw new ConflictException(
        `Equipamento com código interno ${createEquipamentoDto.codigoInterno} já existe`,
      );
    }

    const equipamento = this.equipamentoRepository.create(createEquipamentoDto);
    return await this.equipamentoRepository.save(equipamento);
  }

  async findAllPaginated(
    page: number = 1,
    limit: number = 10,
    search?: string,
    unidadeId?: string,
    salaId?: string,
  ): Promise<PaginatedResultDto<Equipamento>> {
    const queryBuilder = this.equipamentoRepository
      .createQueryBuilder('equipamento')
      .leftJoinAndSelect('equipamento.sala', 'sala')
      .leftJoinAndSelect('equipamento.unidade', 'unidade');

    // Filtro por termo de busca (nome, código interno ou numeração)
    if (search) {
      queryBuilder.andWhere(
        '(equipamento.nome ILIKE :search OR equipamento.codigoInterno ILIKE :search OR equipamento.numeracao ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    // Filtro por unidade
    if (unidadeId) {
      queryBuilder.andWhere('equipamento.unidadeId = :unidadeId', {
        unidadeId,
      });
    }

    // Filtro por sala
    if (salaId) {
      queryBuilder.andWhere('equipamento.salaId = :salaId', { salaId });
    }

    // Ordenação e paginação
    queryBuilder
      .orderBy('equipamento.codigoInterno', 'ASC')
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return new PaginatedResultDto(data, total, page, limit);
  }

  async findAll(): Promise<Equipamento[]> {
    return await this.equipamentoRepository.find({
      relations: ['sala', 'unidade'],
      order: { codigoInterno: 'ASC' },
    });
  }

  async findAllAtivos(): Promise<Equipamento[]> {
    return await this.equipamentoRepository.find({
      where: { ativo: true },
      relations: ['sala', 'unidade'],
      order: { codigoInterno: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Equipamento> {
    const equipamento = await this.equipamentoRepository.findOne({
      where: { id },
      relations: ['sala', 'unidade'],
    });

    if (!equipamento) {
      throw new NotFoundException(`Equipamento com ID ${id} não encontrado`);
    }

    return equipamento;
  }

  async findByCodigoInterno(codigoInterno: string): Promise<Equipamento> {
    const equipamento = await this.equipamentoRepository.findOne({
      where: { codigoInterno },
      relations: ['sala', 'unidade'],
    });

    if (!equipamento) {
      throw new NotFoundException(
        `Equipamento com código ${codigoInterno} não encontrado`,
      );
    }

    return equipamento;
  }

  async findByUnidade(unidadeId: string): Promise<Equipamento[]> {
    return await this.equipamentoRepository.find({
      where: { unidadeId },
      relations: ['sala', 'unidade'],
      order: { codigoInterno: 'ASC' },
    });
  }

  async findBySala(salaId: string): Promise<Equipamento[]> {
    return await this.equipamentoRepository.find({
      where: { salaId },
      relations: ['sala', 'unidade'],
      order: { codigoInterno: 'ASC' },
    });
  }

  async update(
    id: string,
    updateEquipamentoDto: UpdateEquipamentoDto,
  ): Promise<Equipamento> {
    const equipamento = await this.findOne(id);

    // Verificar se novo código interno já existe (se estiver sendo alterado)
    if (
      updateEquipamentoDto.codigoInterno &&
      updateEquipamentoDto.codigoInterno !== equipamento.codigoInterno
    ) {
      const existente = await this.equipamentoRepository.findOne({
        where: { codigoInterno: updateEquipamentoDto.codigoInterno },
      });

      if (existente) {
        throw new ConflictException(
          `Equipamento com código interno ${updateEquipamentoDto.codigoInterno} já existe`,
        );
      }
    }

    Object.assign(equipamento, updateEquipamentoDto);
    return await this.equipamentoRepository.save(equipamento);
  }

  async toggleAtivo(id: string): Promise<Equipamento> {
    const equipamento = await this.findOne(id);
    equipamento.ativo = !equipamento.ativo;
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

    const porUnidade = await this.equipamentoRepository
      .createQueryBuilder('equipamento')
      .leftJoin('equipamento.unidade', 'unidade')
      .select('unidade.nomeFantasia', 'unidade')
      .addSelect('COUNT(*)', 'quantidade')
      .groupBy('unidade.nomeFantasia')
      .getRawMany();

    const porSala = await this.equipamentoRepository
      .createQueryBuilder('equipamento')
      .leftJoin('equipamento.sala', 'sala')
      .select('sala.nome', 'sala')
      .addSelect('COUNT(*)', 'quantidade')
      .where('equipamento.salaId IS NOT NULL')
      .groupBy('sala.nome')
      .getRawMany();

    return {
      total,
      ativos,
      inativos,
      porUnidade,
      porSala,
    };
  }
}
