import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TipoExame } from './entities/tipo-exame.entity';
import { CreateTipoExameDto } from './dto/create-tipo-exame.dto';
import { UpdateTipoExameDto } from './dto/update-tipo-exame.dto';

@Injectable()
export class TiposExameService {
  constructor(
    @InjectRepository(TipoExame)
    private readonly tipoExameRepository: Repository<TipoExame>,
  ) {}

  async create(createTipoExameDto: CreateTipoExameDto): Promise<TipoExame> {
    const existingTipo = await this.tipoExameRepository.findOne({
      where: { codigo: createTipoExameDto.codigo },
    });

    if (existingTipo) {
      throw new ConflictException(
        `Tipo de exame com código ${createTipoExameDto.codigo} já existe`,
      );
    }

    const tipoExame = this.tipoExameRepository.create(createTipoExameDto);
    return await this.tipoExameRepository.save(tipoExame);
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    status?: string,
  ): Promise<{
    data: TipoExame[];
    total: number;
    page: number;
    lastPage: number;
  }> {
    const where: any = {};

    if (status) {
      where.status = status;
    }

    const [data, total] = await this.tipoExameRepository.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: { ordem: 'ASC', nome: 'ASC' },
    });

    return {
      data,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  async findOne(id: number): Promise<TipoExame> {
    const tipoExame = await this.tipoExameRepository.findOne({
      where: { id },
      relations: ['exames'],
    });

    if (!tipoExame) {
      throw new NotFoundException(`Tipo de exame com ID ${id} não encontrado`);
    }

    return tipoExame;
  }

  async findByCodigo(codigo: string): Promise<TipoExame> {
    const tipoExame = await this.tipoExameRepository.findOne({
      where: { codigo },
    });

    if (!tipoExame) {
      throw new NotFoundException(
        `Tipo de exame com código ${codigo} não encontrado`,
      );
    }

    return tipoExame;
  }

  async update(
    id: number,
    updateTipoExameDto: UpdateTipoExameDto,
  ): Promise<TipoExame> {
    const tipoExame = await this.findOne(id);

    if (
      updateTipoExameDto.codigo &&
      updateTipoExameDto.codigo !== tipoExame.codigo
    ) {
      const existingTipo = await this.tipoExameRepository.findOne({
        where: { codigo: updateTipoExameDto.codigo },
      });

      if (existingTipo) {
        throw new ConflictException(
          `Tipo de exame com código ${updateTipoExameDto.codigo} já existe`,
        );
      }
    }

    Object.assign(tipoExame, updateTipoExameDto);
    return await this.tipoExameRepository.save(tipoExame);
  }

  async remove(id: number): Promise<void> {
    const tipoExame = await this.findOne(id);

    if (tipoExame.exames && tipoExame.exames.length > 0) {
      throw new ConflictException(
        `Não é possível excluir o tipo de exame pois existem ${tipoExame.exames.length} exames vinculados`,
      );
    }

    tipoExame.status = 'inativo';
    await this.tipoExameRepository.save(tipoExame);
  }

  async findAtivos(): Promise<TipoExame[]> {
    return await this.tipoExameRepository.find({
      where: { status: 'ativo' },
      order: { ordem: 'ASC', nome: 'ASC' },
    });
  }

  async findComAgendamento(): Promise<TipoExame[]> {
    return await this.tipoExameRepository.find({
      where: { requer_agendamento: true, status: 'ativo' },
      order: { nome: 'ASC' },
    });
  }

  async findComAutorizacao(): Promise<TipoExame[]> {
    return await this.tipoExameRepository.find({
      where: { requer_autorizacao: true, status: 'ativo' },
      order: { nome: 'ASC' },
    });
  }

  async findDomiciliares(): Promise<TipoExame[]> {
    return await this.tipoExameRepository.find({
      where: { permite_domiciliar: true, status: 'ativo' },
      order: { nome: 'ASC' },
    });
  }
}
