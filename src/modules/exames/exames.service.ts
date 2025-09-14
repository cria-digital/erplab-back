import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Exame } from './entities/exame.entity';
import { CreateExameDto } from './dto/create-exame.dto';
import { UpdateExameDto } from './dto/update-exame.dto';

@Injectable()
export class ExamesService {
  constructor(
    @InjectRepository(Exame)
    private readonly exameRepository: Repository<Exame>,
  ) {}

  async create(createExameDto: CreateExameDto): Promise<Exame> {
    // Verifica se já existe um exame com o mesmo código interno
    const existingExame = await this.exameRepository.findOne({
      where: { codigo_interno: createExameDto.codigo_interno },
    });

    if (existingExame) {
      throw new ConflictException(
        `Exame com código ${createExameDto.codigo_interno} já existe`,
      );
    }

    const exame = this.exameRepository.create(createExameDto);
    return await this.exameRepository.save(exame);
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    search?: string,
    categoria?: string,
    status?: string,
  ): Promise<{ data: Exame[]; total: number; page: number; lastPage: number }> {
    const where: any = {};

    if (search) {
      where.nome = Like(`%${search}%`);
    }

    if (categoria) {
      where.categoria = categoria;
    }

    if (status) {
      where.status = status;
    }

    const [data, total] = await this.exameRepository.findAndCount({
      where,
      relations: ['tipoExame', 'subgrupo', 'setor', 'laboratorioApoio'],
      skip: (page - 1) * limit,
      take: limit,
      order: { nome: 'ASC' },
    });

    return {
      data,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  async findOne(id: number): Promise<Exame> {
    const exame = await this.exameRepository.findOne({
      where: { id },
      relations: ['tipoExame', 'subgrupo', 'setor', 'laboratorioApoio'],
    });

    if (!exame) {
      throw new NotFoundException(`Exame com ID ${id} não encontrado`);
    }

    return exame;
  }

  async findByCodigo(codigo: string): Promise<Exame> {
    const exame = await this.exameRepository.findOne({
      where: { codigo_interno: codigo },
      relations: ['tipoExame', 'subgrupo', 'setor', 'laboratorioApoio'],
    });

    if (!exame) {
      throw new NotFoundException(`Exame com código ${codigo} não encontrado`);
    }

    return exame;
  }

  async update(id: number, updateExameDto: UpdateExameDto): Promise<Exame> {
    const exame = await this.findOne(id);

    // Se está alterando o código, verifica se não existe outro com o mesmo código
    if (
      updateExameDto.codigo_interno &&
      updateExameDto.codigo_interno !== exame.codigo_interno
    ) {
      const existingExame = await this.exameRepository.findOne({
        where: { codigo_interno: updateExameDto.codigo_interno },
      });

      if (existingExame) {
        throw new ConflictException(
          `Exame com código ${updateExameDto.codigo_interno} já existe`,
        );
      }
    }

    Object.assign(exame, updateExameDto);
    return await this.exameRepository.save(exame);
  }

  async remove(id: number): Promise<void> {
    const exame = await this.findOne(id);

    // Verifica se o exame está sendo usado em alguma ordem de serviço
    // TODO: Implementar verificação quando OrdemServicoExame estiver pronto

    // Por enquanto, apenas desativa o exame ao invés de deletar
    exame.status = 'inativo';
    await this.exameRepository.save(exame);
  }

  async findByCategoria(categoria: string): Promise<Exame[]> {
    return await this.exameRepository.find({
      where: { categoria, status: 'ativo' },
      relations: ['tipoExame'],
      order: { nome: 'ASC' },
    });
  }

  async findByTipo(tipoExameId: number): Promise<Exame[]> {
    return await this.exameRepository.find({
      where: { tipo_exame_id: tipoExameId, status: 'ativo' },
      relations: ['tipoExame', 'subgrupo', 'setor'],
      order: { nome: 'ASC' },
    });
  }

  async findByLaboratorioApoio(laboratorioId: number): Promise<Exame[]> {
    return await this.exameRepository.find({
      where: { laboratorio_apoio_id: laboratorioId, status: 'ativo' },
      relations: ['laboratorioApoio'],
      order: { nome: 'ASC' },
    });
  }

  async searchByName(nome: string): Promise<Exame[]> {
    return await this.exameRepository.find({
      where: [
        { nome: Like(`%${nome}%`), status: 'ativo' },
        { sinonimos: Like(`%${nome}%`), status: 'ativo' },
      ],
      relations: ['tipoExame'],
      take: 20,
      order: { nome: 'ASC' },
    });
  }

  async findByCodigos(
    codigoTuss?: string,
    codigoAmb?: string,
    codigoSus?: string,
  ): Promise<Exame[]> {
    const where: any = { status: 'ativo' };

    if (codigoTuss) {
      where.codigo_tuss = codigoTuss;
    }
    if (codigoAmb) {
      where.codigo_amb = codigoAmb;
    }
    if (codigoSus) {
      where.codigo_sus = codigoSus;
    }

    return await this.exameRepository.find({
      where,
      relations: ['tipoExame'],
    });
  }

  async bulkUpdateStatus(ids: number[], status: string): Promise<void> {
    if (!['ativo', 'inativo', 'suspenso'].includes(status)) {
      throw new BadRequestException('Status inválido');
    }

    await this.exameRepository.update(ids, { status });
  }

  async getExamesComPreparo(): Promise<Exame[]> {
    return await this.exameRepository.find({
      where: { necessita_preparo: 'sim', status: 'ativo' },
      relations: ['tipoExame'],
      order: { nome: 'ASC' },
    });
  }

  async getExamesUrgentes(): Promise<Exame[]> {
    return await this.exameRepository.find({
      where: { status: 'ativo' },
      relations: ['tipoExame'],
      order: { peso: 'DESC', nome: 'ASC' },
      take: 50,
    });
  }
}
