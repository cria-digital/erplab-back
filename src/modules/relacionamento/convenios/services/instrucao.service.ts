import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Instrucao,
  CategoriaInstrucao,
  StatusInstrucao,
} from '../entities/instrucao.entity';
import { CreateInstrucaoDto } from '../dto/create-instrucao.dto';
import { UpdateInstrucaoDto } from '../dto/update-instrucao.dto';
import { ConvenioService } from './convenio.service';

@Injectable()
export class InstrucaoService {
  constructor(
    @InjectRepository(Instrucao)
    private readonly instrucaoRepository: Repository<Instrucao>,
    private readonly convenioService: ConvenioService,
  ) {}

  async create(createInstrucaoDto: CreateInstrucaoDto): Promise<Instrucao> {
    await this.convenioService.findOne(createInstrucaoDto.convenio_id);

    const instrucao = this.instrucaoRepository.create(createInstrucaoDto);
    return await this.instrucaoRepository.save(instrucao);
  }

  async findAll(): Promise<Instrucao[]> {
    return await this.instrucaoRepository.find({
      relations: ['convenio'],
      order: { prioridade: 'ASC', created_at: 'DESC' },
    });
  }

  async findByConvenio(convenioId: string): Promise<Instrucao[]> {
    return await this.instrucaoRepository.find({
      where: { convenio_id: convenioId },
      order: { prioridade: 'ASC', categoria: 'ASC', created_at: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Instrucao> {
    const instrucao = await this.instrucaoRepository.findOne({
      where: { id },
      relations: ['convenio'],
    });

    if (!instrucao) {
      throw new NotFoundException(`Instrução com ID ${id} não encontrada`);
    }

    return instrucao;
  }

  async findByCategoria(
    convenioId: string,
    categoria: CategoriaInstrucao,
  ): Promise<Instrucao[]> {
    return await this.instrucaoRepository.find({
      where: {
        convenio_id: convenioId,
        categoria,
        status: StatusInstrucao.ATIVA,
      },
      order: { prioridade: 'ASC', created_at: 'DESC' },
    });
  }

  async findVigentes(convenioId: string, data?: Date): Promise<Instrucao[]> {
    const dataReferencia = data || new Date();

    return await this.instrucaoRepository
      .createQueryBuilder('instrucao')
      .where('instrucao.convenio_id = :convenioId', { convenioId })
      .andWhere('instrucao.status = :status', { status: StatusInstrucao.ATIVA })
      .andWhere('instrucao.vigencia_inicio <= :data', { data: dataReferencia })
      .andWhere(
        '(instrucao.vigencia_fim IS NULL OR instrucao.vigencia_fim >= :data)',
        { data: dataReferencia },
      )
      .orderBy('instrucao.prioridade', 'ASC')
      .addOrderBy('instrucao.categoria', 'ASC')
      .getMany();
  }

  async findProximasVencer(
    convenioId: string,
    dias: number = 30,
  ): Promise<Instrucao[]> {
    const hoje = new Date();
    const dataLimite = new Date();
    dataLimite.setDate(hoje.getDate() + dias);

    return await this.instrucaoRepository
      .createQueryBuilder('instrucao')
      .where('instrucao.convenio_id = :convenioId', { convenioId })
      .andWhere('instrucao.status = :status', { status: StatusInstrucao.ATIVA })
      .andWhere('instrucao.vigencia_fim BETWEEN :hoje AND :dataLimite', {
        hoje,
        dataLimite,
      })
      .orderBy('instrucao.vigencia_fim', 'ASC')
      .getMany();
  }

  async update(
    id: string,
    updateInstrucaoDto: UpdateInstrucaoDto,
  ): Promise<Instrucao> {
    const instrucao = await this.findOne(id);

    Object.assign(instrucao, updateInstrucaoDto);
    return await this.instrucaoRepository.save(instrucao);
  }

  async remove(id: string): Promise<void> {
    const instrucao = await this.findOne(id);
    await this.instrucaoRepository.remove(instrucao);
  }

  async toggleStatus(id: string): Promise<Instrucao> {
    const instrucao = await this.findOne(id);

    switch (instrucao.status) {
      case StatusInstrucao.ATIVA:
        instrucao.status = StatusInstrucao.INATIVA;
        break;
      case StatusInstrucao.INATIVA:
        instrucao.status = StatusInstrucao.ATIVA;
        break;
      case StatusInstrucao.SUSPENSA:
        instrucao.status = StatusInstrucao.ATIVA;
        break;
    }

    return await this.instrucaoRepository.save(instrucao);
  }

  async search(convenioId: string, query: string): Promise<Instrucao[]> {
    return await this.instrucaoRepository
      .createQueryBuilder('instrucao')
      .where('instrucao.convenio_id = :convenioId', { convenioId })
      .andWhere(
        '(instrucao.titulo ILIKE :query OR instrucao.descricao ILIKE :query OR instrucao.codigo LIKE :query)',
        {
          query: `%${query}%`,
        },
      )
      .orderBy('instrucao.prioridade', 'ASC')
      .getMany();
  }

  async getHistorico(id: string): Promise<any> {
    const instrucao = await this.findOne(id);

    return {
      instrucao,
      historico: [
        {
          data: instrucao.created_at,
          usuario: instrucao.created_by || 'Sistema',
          acao: 'Criação',
          detalhes: 'Instrução criada',
        },
        {
          data: instrucao.updated_at,
          usuario: instrucao.updated_by || 'Sistema',
          acao: 'Última atualização',
          detalhes: 'Instrução atualizada',
        },
      ],
    };
  }
}
