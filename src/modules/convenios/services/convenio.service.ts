import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Convenio } from '../entities/convenio.entity';
import { CreateConvenioDto } from '../dto/create-convenio.dto';
import { UpdateConvenioDto } from '../dto/update-convenio.dto';

@Injectable()
export class ConvenioService {
  constructor(
    @InjectRepository(Convenio)
    private readonly convenioRepository: Repository<Convenio>,
  ) {}

  async create(createConvenioDto: CreateConvenioDto): Promise<Convenio> {
    const existingCodigo = await this.convenioRepository.findOne({
      where: { codigo: createConvenioDto.codigo },
    });

    if (existingCodigo) {
      throw new ConflictException('Já existe um convênio com este código');
    }

    const existingCnpj = await this.convenioRepository.findOne({
      where: { cnpj: createConvenioDto.cnpj },
    });

    if (existingCnpj) {
      throw new ConflictException('Já existe um convênio com este CNPJ');
    }

    const convenio = this.convenioRepository.create(createConvenioDto);
    return await this.convenioRepository.save(convenio);
  }

  async findAll(): Promise<Convenio[]> {
    return await this.convenioRepository.find({
      relations: ['planos', 'instrucoes'],
      order: { nome_fantasia: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Convenio> {
    const convenio = await this.convenioRepository.findOne({
      where: { id },
      relations: ['planos', 'instrucoes'],
    });

    if (!convenio) {
      throw new NotFoundException(`Convênio com ID ${id} não encontrado`);
    }

    return convenio;
  }

  async findByCodigo(codigo: string): Promise<Convenio> {
    const convenio = await this.convenioRepository.findOne({
      where: { codigo },
      relations: ['planos', 'instrucoes'],
    });

    if (!convenio) {
      throw new NotFoundException(
        `Convênio com código ${codigo} não encontrado`,
      );
    }

    return convenio;
  }

  async findByCnpj(cnpj: string): Promise<Convenio> {
    const convenio = await this.convenioRepository.findOne({
      where: { cnpj },
      relations: ['planos', 'instrucoes'],
    });

    if (!convenio) {
      throw new NotFoundException(`Convênio com CNPJ ${cnpj} não encontrado`);
    }

    return convenio;
  }

  async findAtivos(): Promise<Convenio[]> {
    return await this.convenioRepository.find({
      where: { ativo: true },
      relations: ['planos'],
      order: { nome_fantasia: 'ASC' },
    });
  }

  async update(
    id: string,
    updateConvenioDto: UpdateConvenioDto,
  ): Promise<Convenio> {
    const convenio = await this.findOne(id);

    if (
      updateConvenioDto.codigo &&
      updateConvenioDto.codigo !== convenio.codigo
    ) {
      const existingCodigo = await this.convenioRepository.findOne({
        where: { codigo: updateConvenioDto.codigo },
      });

      if (existingCodigo) {
        throw new ConflictException('Já existe um convênio com este código');
      }
    }

    if (updateConvenioDto.cnpj && updateConvenioDto.cnpj !== convenio.cnpj) {
      const existingCnpj = await this.convenioRepository.findOne({
        where: { cnpj: updateConvenioDto.cnpj },
      });

      if (existingCnpj) {
        throw new ConflictException('Já existe um convênio com este CNPJ');
      }
    }

    Object.assign(convenio, updateConvenioDto);
    return await this.convenioRepository.save(convenio);
  }

  async remove(id: string): Promise<void> {
    const convenio = await this.findOne(id);
    await this.convenioRepository.remove(convenio);
  }

  async toggleStatus(id: string): Promise<Convenio> {
    const convenio = await this.findOne(id);
    convenio.ativo = !convenio.ativo;
    return await this.convenioRepository.save(convenio);
  }

  async search(query: string): Promise<Convenio[]> {
    return await this.convenioRepository
      .createQueryBuilder('convenio')
      .where('convenio.nome_fantasia ILIKE :query', { query: `%${query}%` })
      .orWhere('convenio.razao_social ILIKE :query', { query: `%${query}%` })
      .orWhere('convenio.cnpj LIKE :query', { query: `%${query}%` })
      .orWhere('convenio.codigo LIKE :query', { query: `%${query}%` })
      .leftJoinAndSelect('convenio.planos', 'planos')
      .orderBy('convenio.nome_fantasia', 'ASC')
      .getMany();
  }
}
