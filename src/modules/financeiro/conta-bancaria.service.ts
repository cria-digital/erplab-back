import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  ContaBancaria,
  TipoConta,
  StatusConta,
} from './entities/conta-bancaria.entity';
import { CreateContaBancariaDto } from './dto/create-conta-bancaria.dto';
import { UpdateContaBancariaDto } from './dto/update-conta-bancaria.dto';

@Injectable()
export class ContaBancariaService {
  constructor(
    @InjectRepository(ContaBancaria)
    private readonly contaBancariaRepository: Repository<ContaBancaria>,
  ) {}

  async create(createDto: CreateContaBancariaDto): Promise<ContaBancaria> {
    // Verifica se já existe conta com o mesmo código interno
    const existente = await this.contaBancariaRepository.findOne({
      where: { codigo_interno: createDto.codigo_interno },
    });

    if (existente) {
      throw new ConflictException(
        `Já existe uma conta bancária com o código interno: ${createDto.codigo_interno}`,
      );
    }

    const conta = this.contaBancariaRepository.create(createDto);
    return await this.contaBancariaRepository.save(conta);
  }

  async findAll(): Promise<ContaBancaria[]> {
    return await this.contaBancariaRepository.find({
      relations: ['banco', 'unidade_saude'],
      order: { created_at: 'DESC' },
    });
  }

  async findAtivas(): Promise<ContaBancaria[]> {
    return await this.contaBancariaRepository.find({
      where: { status: StatusConta.ATIVA },
      relations: ['banco', 'unidade_saude'],
      order: { created_at: 'DESC' },
    });
  }

  async findByUnidade(unidadeId: string): Promise<ContaBancaria[]> {
    return await this.contaBancariaRepository.find({
      where: { unidade_saude_id: unidadeId },
      relations: ['banco', 'unidade_saude'],
      order: { created_at: 'DESC' },
    });
  }

  async findByBanco(bancoId: string): Promise<ContaBancaria[]> {
    return await this.contaBancariaRepository.find({
      where: { banco_id: bancoId },
      relations: ['banco', 'unidade_saude'],
      order: { created_at: 'DESC' },
    });
  }

  async findByTipo(tipo: TipoConta): Promise<ContaBancaria[]> {
    return await this.contaBancariaRepository.find({
      where: { tipo_conta: tipo },
      relations: ['banco', 'unidade_saude'],
      order: { created_at: 'DESC' },
    });
  }

  async findByCodigo(codigo: string): Promise<ContaBancaria> {
    const conta = await this.contaBancariaRepository.findOne({
      where: { codigo_interno: codigo },
      relations: ['banco', 'unidade_saude'],
    });

    if (!conta) {
      throw new NotFoundException(
        `Conta bancária com código ${codigo} não encontrada`,
      );
    }

    return conta;
  }

  async findOne(id: string): Promise<ContaBancaria> {
    const conta = await this.contaBancariaRepository.findOne({
      where: { id },
      relations: ['banco', 'unidade_saude'],
    });

    if (!conta) {
      throw new NotFoundException(`Conta bancária com ID ${id} não encontrada`);
    }

    return conta;
  }

  async update(
    id: string,
    updateDto: UpdateContaBancariaDto,
  ): Promise<ContaBancaria> {
    const conta = await this.findOne(id);

    // Se está alterando o código interno, verifica se não existe outro com o mesmo
    if (
      updateDto.codigo_interno &&
      updateDto.codigo_interno !== conta.codigo_interno
    ) {
      const existente = await this.contaBancariaRepository.findOne({
        where: { codigo_interno: updateDto.codigo_interno },
      });

      if (existente) {
        throw new ConflictException(
          `Já existe uma conta bancária com o código interno: ${updateDto.codigo_interno}`,
        );
      }
    }

    Object.assign(conta, updateDto);
    return await this.contaBancariaRepository.save(conta);
  }

  async toggleStatus(id: string): Promise<ContaBancaria> {
    const conta = await this.findOne(id);

    conta.status =
      conta.status === StatusConta.ATIVA
        ? StatusConta.INATIVA
        : StatusConta.ATIVA;

    return await this.contaBancariaRepository.save(conta);
  }

  async remove(id: string): Promise<void> {
    const conta = await this.findOne(id);
    await this.contaBancariaRepository.remove(conta);
  }
}
