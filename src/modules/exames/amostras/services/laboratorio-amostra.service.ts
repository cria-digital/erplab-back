import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LaboratorioAmostra } from '../entities/laboratorio-amostra.entity';
import { Amostra } from '../entities/amostra.entity';
import { Laboratorio } from '../../../relacionamento/laboratorios/entities/laboratorio.entity';
import { CreateLaboratorioAmostraDto } from '../dto/create-laboratorio-amostra.dto';
import { UpdateLaboratorioAmostraDto } from '../dto/update-laboratorio-amostra.dto';

@Injectable()
export class LaboratorioAmostraService {
  constructor(
    @InjectRepository(LaboratorioAmostra)
    private readonly laboratorioAmostraRepository: Repository<LaboratorioAmostra>,
    @InjectRepository(Amostra)
    private readonly amostraRepository: Repository<Amostra>,
    @InjectRepository(Laboratorio)
    private readonly laboratorioRepository: Repository<Laboratorio>,
  ) {}

  async create(
    createDto: CreateLaboratorioAmostraDto,
  ): Promise<LaboratorioAmostra> {
    // Verificar se a amostra existe
    const amostra = await this.amostraRepository.findOne({
      where: { id: createDto.amostraId },
    });
    if (!amostra) {
      throw new NotFoundException(
        `Amostra com ID ${createDto.amostraId} não encontrada`,
      );
    }

    // Verificar se o laboratório existe
    const laboratorio = await this.laboratorioRepository.findOne({
      where: { id: createDto.laboratorioId },
    });
    if (!laboratorio) {
      throw new NotFoundException(
        `Laboratório com ID ${createDto.laboratorioId} não encontrado`,
      );
    }

    // Verificar se já existe vínculo
    const existingVinculo = await this.laboratorioAmostraRepository.findOne({
      where: {
        laboratorioId: createDto.laboratorioId,
        amostraId: createDto.amostraId,
      },
    });
    if (existingVinculo) {
      throw new ConflictException(
        'Este laboratório já está vinculado a esta amostra',
      );
    }

    const vinculo = this.laboratorioAmostraRepository.create(createDto);
    return await this.laboratorioAmostraRepository.save(vinculo);
  }

  async findAll(
    page = 1,
    limit = 10,
    laboratorioId?: string,
    amostraId?: string,
    validado?: boolean,
  ): Promise<{
    data: LaboratorioAmostra[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const query = this.laboratorioAmostraRepository
      .createQueryBuilder('vinculo')
      .leftJoinAndSelect('vinculo.laboratorio', 'laboratorio')
      .leftJoinAndSelect('laboratorio.empresa', 'empresa')
      .leftJoinAndSelect('vinculo.amostra', 'amostra');

    if (laboratorioId) {
      query.andWhere('vinculo.laboratorio_id = :laboratorioId', {
        laboratorioId,
      });
    }

    if (amostraId) {
      query.andWhere('vinculo.amostra_id = :amostraId', { amostraId });
    }

    if (validado !== undefined) {
      query.andWhere('vinculo.validado = :validado', { validado });
    }

    query.orderBy('vinculo.createdAt', 'DESC');

    const [data, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<LaboratorioAmostra> {
    const vinculo = await this.laboratorioAmostraRepository.findOne({
      where: { id },
      relations: ['laboratorio', 'laboratorio.empresa', 'amostra'],
    });

    if (!vinculo) {
      throw new NotFoundException(`Vínculo com ID ${id} não encontrado`);
    }

    return vinculo;
  }

  async findByLaboratorio(
    laboratorioId: string,
  ): Promise<LaboratorioAmostra[]> {
    return await this.laboratorioAmostraRepository.find({
      where: { laboratorioId },
      relations: ['amostra'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByAmostra(amostraId: string): Promise<LaboratorioAmostra[]> {
    return await this.laboratorioAmostraRepository.find({
      where: { amostraId },
      relations: ['laboratorio', 'laboratorio.empresa'],
      order: { createdAt: 'DESC' },
    });
  }

  async findValidados(laboratorioId?: string): Promise<LaboratorioAmostra[]> {
    const query = this.laboratorioAmostraRepository
      .createQueryBuilder('vinculo')
      .leftJoinAndSelect('vinculo.laboratorio', 'laboratorio')
      .leftJoinAndSelect('laboratorio.empresa', 'empresa')
      .leftJoinAndSelect('vinculo.amostra', 'amostra')
      .where('vinculo.validado = :validado', { validado: true });

    if (laboratorioId) {
      query.andWhere('vinculo.laboratorio_id = :laboratorioId', {
        laboratorioId,
      });
    }

    return await query.orderBy('vinculo.createdAt', 'DESC').getMany();
  }

  async update(
    id: string,
    updateDto: UpdateLaboratorioAmostraDto,
  ): Promise<LaboratorioAmostra> {
    const vinculo = await this.findOne(id);
    Object.assign(vinculo, updateDto);
    return await this.laboratorioAmostraRepository.save(vinculo);
  }

  async validar(id: string): Promise<LaboratorioAmostra> {
    const vinculo = await this.findOne(id);
    vinculo.validado = true;
    vinculo.dataValidacao = new Date();
    return await this.laboratorioAmostraRepository.save(vinculo);
  }

  async invalidar(id: string): Promise<LaboratorioAmostra> {
    const vinculo = await this.findOne(id);
    vinculo.validado = false;
    vinculo.dataValidacao = null;
    return await this.laboratorioAmostraRepository.save(vinculo);
  }

  async remove(id: string): Promise<void> {
    const vinculo = await this.findOne(id);
    await this.laboratorioAmostraRepository.remove(vinculo);
  }

  async getStatistics(laboratorioId?: string): Promise<{
    total: number;
    validados: number;
    pendentes: number;
    percentualValidacao: number;
  }> {
    const query =
      this.laboratorioAmostraRepository.createQueryBuilder('vinculo');

    if (laboratorioId) {
      query.where('vinculo.laboratorio_id = :laboratorioId', { laboratorioId });
    }

    const total = await query.getCount();

    const validados = await query
      .clone()
      .andWhere('vinculo.validado = :validado', { validado: true })
      .getCount();

    const pendentes = total - validados;
    const percentualValidacao = total > 0 ? (validados / total) * 100 : 0;

    return {
      total,
      validados,
      pendentes,
      percentualValidacao: Number(percentualValidacao.toFixed(2)),
    };
  }
}
