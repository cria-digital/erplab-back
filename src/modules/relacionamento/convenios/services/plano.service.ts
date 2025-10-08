import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Plano } from '../entities/plano.entity';
import { CreatePlanoDto } from '../dto/create-plano.dto';
import { UpdatePlanoDto } from '../dto/update-plano.dto';
import { ConvenioService } from './convenio.service';

@Injectable()
export class PlanoService {
  constructor(
    @InjectRepository(Plano)
    private readonly planoRepository: Repository<Plano>,
    private readonly convenioService: ConvenioService,
  ) {}

  async create(createPlanoDto: CreatePlanoDto): Promise<Plano> {
    await this.convenioService.findOne(createPlanoDto.convenio_id);

    const existingPlano = await this.planoRepository.findOne({
      where: {
        convenio_id: createPlanoDto.convenio_id,
        codigo_plano: createPlanoDto.codigo_plano,
      },
    });

    if (existingPlano) {
      throw new ConflictException(
        'Já existe um plano com este código para este convênio',
      );
    }

    const plano = this.planoRepository.create(createPlanoDto);
    return await this.planoRepository.save(plano);
  }

  async findAll(): Promise<Plano[]> {
    return await this.planoRepository.find({
      relations: [
        'convenio',
        'tabelas_preco',
        'procedimentos_autorizados',
        'restricoes',
      ],
      order: { nome_plano: 'ASC' },
    });
  }

  async findByConvenio(convenioId: string): Promise<Plano[]> {
    return await this.planoRepository.find({
      where: { convenio_id: convenioId },
      relations: ['tabelas_preco', 'procedimentos_autorizados', 'restricoes'],
      order: { nome_plano: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Plano> {
    const plano = await this.planoRepository.findOne({
      where: { id },
      relations: [
        'convenio',
        'tabelas_preco',
        'procedimentos_autorizados',
        'restricoes',
      ],
    });

    if (!plano) {
      throw new NotFoundException(`Plano com ID ${id} não encontrado`);
    }

    return plano;
  }

  async findByCodigo(convenioId: string, codigoPlano: string): Promise<Plano> {
    const plano = await this.planoRepository.findOne({
      where: {
        convenio_id: convenioId,
        codigo_plano: codigoPlano,
      },
      relations: [
        'convenio',
        'tabelas_preco',
        'procedimentos_autorizados',
        'restricoes',
      ],
    });

    if (!plano) {
      throw new NotFoundException(
        `Plano com código ${codigoPlano} não encontrado`,
      );
    }

    return plano;
  }

  async findAtivos(convenioId?: string): Promise<Plano[]> {
    const whereCondition: any = { status: 'ativo' };

    if (convenioId) {
      whereCondition.convenio_id = convenioId;
    }

    return await this.planoRepository.find({
      where: whereCondition,
      relations: ['convenio'],
      order: { nome_plano: 'ASC' },
    });
  }

  async update(id: string, updatePlanoDto: UpdatePlanoDto): Promise<Plano> {
    const plano = await this.findOne(id);

    if (
      updatePlanoDto.codigo_plano &&
      updatePlanoDto.codigo_plano !== plano.codigo_plano
    ) {
      const existingPlano = await this.planoRepository.findOne({
        where: {
          convenio_id: plano.convenio_id,
          codigo_plano: updatePlanoDto.codigo_plano,
        },
      });

      if (existingPlano && existingPlano.id !== id) {
        throw new ConflictException(
          'Já existe um plano com este código para este convênio',
        );
      }
    }

    Object.assign(plano, updatePlanoDto);
    return await this.planoRepository.save(plano);
  }

  async remove(id: string): Promise<void> {
    const plano = await this.findOne(id);
    await this.planoRepository.remove(plano);
  }

  async verificarCarencia(planoId: string, dataAdesao: Date): Promise<boolean> {
    const plano = await this.findOne(planoId);
    const hoje = new Date();
    const diasDecorridos = Math.floor(
      (hoje.getTime() - dataAdesao.getTime()) / (1000 * 60 * 60 * 24),
    );

    return diasDecorridos >= plano.carencia_dias;
  }

  async verificarLimiteMensal(
    planoId: string,
    valorAtual: number,
  ): Promise<boolean> {
    const plano = await this.findOne(planoId);

    if (!plano.limite_mensal) {
      return true;
    }

    return valorAtual <= plano.limite_mensal;
  }

  async verificarLimiteAnual(
    planoId: string,
    valorAtual: number,
  ): Promise<boolean> {
    const plano = await this.findOne(planoId);

    if (!plano.limite_anual) {
      return true;
    }

    return valorAtual <= plano.limite_anual;
  }

  async calcularCoparticipacao(
    planoId: string,
    valorProcedimento: number,
  ): Promise<number> {
    const plano = await this.findOne(planoId);

    if (!plano.percentual_coparticipacao) {
      return 0;
    }

    return (valorProcedimento * plano.percentual_coparticipacao) / 100;
  }
}
