import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Repasse } from '../entities/repasse.entity';
import { CreateRepasseDto } from '../dto/create-repasse.dto';
import { UpdateRepasseDto } from '../dto/update-repasse.dto';
import { StatusRepasse } from '../enums/contas-pagar.enum';

@Injectable()
export class RepasseService {
  constructor(
    @InjectRepository(Repasse)
    private readonly repasseRepository: Repository<Repasse>,
    private readonly dataSource: DataSource,
  ) {}

  async create(dto: CreateRepasseDto): Promise<Repasse> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const repasse = this.repasseRepository.create(dto);
      const saved = await queryRunner.manager.save(repasse);

      await queryRunner.commitTransaction();
      return await this.findOne(saved.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(): Promise<Repasse[]> {
    return await this.repasseRepository.find({
      relations: ['unidade', 'filtros'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Repasse> {
    const repasse = await this.repasseRepository.findOne({
      where: { id },
      relations: ['unidade', 'filtros'],
    });

    if (!repasse) {
      throw new NotFoundException(`Repasse com ID ${id} não encontrado`);
    }

    return repasse;
  }

  async findByUnidade(unidadeId: string): Promise<Repasse[]> {
    return await this.repasseRepository.find({
      where: { unidadeId },
      relations: ['unidade', 'filtros'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByStatus(status: StatusRepasse): Promise<Repasse[]> {
    return await this.repasseRepository.find({
      where: { status },
      relations: ['unidade', 'filtros'],
      order: { createdAt: 'DESC' },
    });
  }

  async update(id: string, dto: UpdateRepasseDto): Promise<Repasse> {
    const repasse = await this.findOne(id);

    Object.assign(repasse, dto);
    await this.repasseRepository.save(repasse);

    return await this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const repasse = await this.findOne(id);
    await this.repasseRepository.remove(repasse);
  }

  async updateStatus(id: string, status: StatusRepasse): Promise<Repasse> {
    const repasse = await this.findOne(id);
    repasse.status = status;
    await this.repasseRepository.save(repasse);
    return await this.findOne(id);
  }
}
