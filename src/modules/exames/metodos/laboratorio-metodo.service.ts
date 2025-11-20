import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LaboratorioMetodo } from './entities/laboratorio-metodo.entity';
import { CreateLaboratorioMetodoDto } from './dto/create-laboratorio-metodo.dto';
import { UpdateLaboratorioMetodoDto } from './dto/update-laboratorio-metodo.dto';
import { Laboratorio } from '../../relacionamento/laboratorios/entities/laboratorio.entity';
import { Metodo } from './entities/metodo.entity';

@Injectable()
export class LaboratorioMetodoService {
  constructor(
    @InjectRepository(LaboratorioMetodo)
    private readonly laboratorioMetodoRepository: Repository<LaboratorioMetodo>,
    @InjectRepository(Laboratorio)
    private readonly laboratorioRepository: Repository<Laboratorio>,
    @InjectRepository(Metodo)
    private readonly metodoRepository: Repository<Metodo>,
  ) {}

  async create(
    createLaboratorioMetodoDto: CreateLaboratorioMetodoDto,
  ): Promise<LaboratorioMetodo> {
    const { laboratorioId, metodoId } = createLaboratorioMetodoDto;

    const laboratorio = await this.laboratorioRepository.findOne({
      where: { id: laboratorioId },
    });

    if (!laboratorio) {
      throw new NotFoundException(
        `Laboratório com ID ${laboratorioId} não foi encontrado. ` +
          `Soluções possíveis:\n` +
          `1) Criar uma empresa com tipo LABORATORIO_APOIO: POST /api/v1/cadastros/empresas\n` +
          `   (O registro de laboratório será criado automaticamente)\n` +
          `2) Listar laboratórios disponíveis: GET /api/v1/relacionamento/laboratorios\n` +
          `3) Verificar se o ID no http-client.env.json está correto\n` +
          `4) Verificar se o laboratório está ativo (empresa.ativo = true)`,
      );
    }

    const metodo = await this.metodoRepository.findOne({
      where: { id: metodoId },
    });

    if (!metodo) {
      throw new NotFoundException(`Método com ID ${metodoId} não encontrado`);
    }

    const existingRelation = await this.laboratorioMetodoRepository.findOne({
      where: { laboratorioId, metodoId },
    });

    if (existingRelation) {
      throw new ConflictException(
        'Este laboratório já está vinculado a este método',
      );
    }

    const laboratorioMetodo = this.laboratorioMetodoRepository.create(
      createLaboratorioMetodoDto,
    );

    return await this.laboratorioMetodoRepository.save(laboratorioMetodo);
  }

  async findAll(
    page = 1,
    limit = 10,
    laboratorioId?: string,
    metodoId?: string,
    validado?: boolean,
  ): Promise<{
    data: LaboratorioMetodo[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const query = this.laboratorioMetodoRepository
      .createQueryBuilder('laboratorioMetodo')
      .leftJoinAndSelect('laboratorioMetodo.laboratorio', 'laboratorio')
      .leftJoinAndSelect('laboratorio.empresa', 'empresa')
      .leftJoinAndSelect('laboratorioMetodo.metodo', 'metodo');

    if (laboratorioId) {
      query.andWhere('laboratorioMetodo.laboratorio_id = :laboratorioId', {
        laboratorioId,
      });
    }

    if (metodoId) {
      query.andWhere('laboratorioMetodo.metodo_id = :metodoId', { metodoId });
    }

    if (validado !== undefined) {
      query.andWhere('laboratorioMetodo.validado = :validado', { validado });
    }

    query.orderBy('laboratorioMetodo.createdAt', 'DESC');

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

  async findOne(id: string): Promise<LaboratorioMetodo> {
    const laboratorioMetodo = await this.laboratorioMetodoRepository.findOne({
      where: { id },
      relations: ['laboratorio', 'laboratorio.empresa', 'metodo'],
    });

    if (!laboratorioMetodo) {
      throw new NotFoundException(
        `Vínculo laboratório-método com ID ${id} não encontrado`,
      );
    }

    return laboratorioMetodo;
  }

  async findByLaboratorio(laboratorioId: string): Promise<LaboratorioMetodo[]> {
    return await this.laboratorioMetodoRepository.find({
      where: { laboratorioId },
      relations: ['metodo'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByMetodo(metodoId: string): Promise<LaboratorioMetodo[]> {
    return await this.laboratorioMetodoRepository.find({
      where: { metodoId },
      relations: ['laboratorio', 'laboratorio.empresa'],
      order: { createdAt: 'DESC' },
    });
  }

  async update(
    id: string,
    updateLaboratorioMetodoDto: UpdateLaboratorioMetodoDto,
  ): Promise<LaboratorioMetodo> {
    const laboratorioMetodo = await this.findOne(id);

    Object.assign(laboratorioMetodo, updateLaboratorioMetodoDto);

    return await this.laboratorioMetodoRepository.save(laboratorioMetodo);
  }

  async remove(id: string): Promise<void> {
    const laboratorioMetodo = await this.findOne(id);
    await this.laboratorioMetodoRepository.remove(laboratorioMetodo);
  }

  async validar(id: string): Promise<LaboratorioMetodo> {
    const laboratorioMetodo = await this.findOne(id);

    if (laboratorioMetodo.validado) {
      throw new BadRequestException(
        'Este vínculo laboratório-método já está validado',
      );
    }

    laboratorioMetodo.validado = true;
    laboratorioMetodo.dataValidacao = new Date();

    return await this.laboratorioMetodoRepository.save(laboratorioMetodo);
  }

  async invalidar(id: string): Promise<LaboratorioMetodo> {
    const laboratorioMetodo = await this.findOne(id);

    if (!laboratorioMetodo.validado) {
      throw new BadRequestException(
        'Este vínculo laboratório-método já está invalidado',
      );
    }

    laboratorioMetodo.validado = false;
    laboratorioMetodo.dataValidacao = null;

    return await this.laboratorioMetodoRepository.save(laboratorioMetodo);
  }

  async findValidados(laboratorioId?: string): Promise<LaboratorioMetodo[]> {
    const query = this.laboratorioMetodoRepository
      .createQueryBuilder('laboratorioMetodo')
      .leftJoinAndSelect('laboratorioMetodo.laboratorio', 'laboratorio')
      .leftJoinAndSelect('laboratorio.empresa', 'empresa')
      .leftJoinAndSelect('laboratorioMetodo.metodo', 'metodo')
      .where('laboratorioMetodo.validado = :validado', { validado: true });

    if (laboratorioId) {
      query.andWhere('laboratorioMetodo.laboratorio_id = :laboratorioId', {
        laboratorioId,
      });
    }

    return await query
      .orderBy('laboratorioMetodo.dataValidacao', 'DESC')
      .getMany();
  }

  async getStatistics(laboratorioId?: string): Promise<{
    total: number;
    validados: number;
    pendentes: number;
    percentualValidacao: number;
  }> {
    const query =
      this.laboratorioMetodoRepository.createQueryBuilder('laboratorioMetodo');

    if (laboratorioId) {
      query.where('laboratorioMetodo.laboratorio_id = :laboratorioId', {
        laboratorioId,
      });
    }

    const total = await query.getCount();

    const validadosQuery = query.clone();
    const validados = await validadosQuery
      .andWhere('laboratorioMetodo.validado = :validado', { validado: true })
      .getCount();

    const pendentes = total - validados;
    const percentualValidacao = total > 0 ? (validados / total) * 100 : 0;

    return {
      total,
      validados,
      pendentes,
      percentualValidacao: parseFloat(percentualValidacao.toFixed(2)),
    };
  }
}
