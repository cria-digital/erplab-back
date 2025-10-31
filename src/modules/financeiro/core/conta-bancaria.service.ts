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
import { PaginatedResultDto } from '../../infraestrutura/common/dto/pagination.dto';

@Injectable()
export class ContaBancariaService {
  constructor(
    @InjectRepository(ContaBancaria)
    private readonly contaBancariaRepository: Repository<ContaBancaria>,
  ) {}

  async create(createDto: CreateContaBancariaDto): Promise<ContaBancaria> {
    // Verifica se já existe conta com mesma combinação banco+agência+conta
    const existente = await this.contaBancariaRepository.findOne({
      where: {
        banco_id: createDto.banco_id,
        agencia: createDto.agencia,
        numero_conta: createDto.numero_conta,
      },
    });

    if (existente) {
      throw new ConflictException(
        `Já existe uma conta bancária com agência ${createDto.agencia} e conta ${createDto.numero_conta} para este banco`,
      );
    }

    // Extrai os IDs das unidades
    const { unidades_ids, ...dadosConta } = createDto;

    // Compatibilidade: se passar unidade_saude_id (deprecated), usa ele
    if (createDto.unidade_saude_id && !unidades_ids) {
      dadosConta.unidade_saude_id = createDto.unidade_saude_id;
    }

    // Cria a conta bancária
    const conta = this.contaBancariaRepository.create(dadosConta);
    const contaSalva = await this.contaBancariaRepository.save(conta);

    // Vincula as unidades se fornecidas
    if (unidades_ids && unidades_ids.length > 0) {
      const vinculos = unidades_ids.map((unidadeId) => ({
        conta_bancaria_id: contaSalva.id,
        unidade_saude_id: unidadeId,
        ativo: true,
      }));

      await this.contaBancariaRepository
        .createQueryBuilder()
        .insert()
        .into('contas_bancarias_unidades')
        .values(vinculos)
        .execute();

      // Atualiza para retornar com os vínculos
      return await this.findOne(contaSalva.id);
    }

    return contaSalva;
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginatedResultDto<ContaBancaria>> {
    const skip = (page - 1) * limit;

    const [data, total] = await this.contaBancariaRepository.findAndCount({
      relations: [
        'banco',
        'unidade_saude',
        'unidades_vinculadas',
        'unidades_vinculadas.unidade_saude',
      ],
      order: { created_at: 'DESC' },
      skip,
      take: limit,
    });

    return new PaginatedResultDto(data, total, page, limit);
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

  /**
   * @deprecated Use findOne() por ID ao invés de código interno
   */
  async findByCodigo(_codigo: string): Promise<ContaBancaria> {
    // Código interno foi removido - retorna erro
    throw new NotFoundException(
      `O método findByCodigo foi descontinuado. Use findOne() com ID.`,
    );
  }

  async findOne(id: string): Promise<ContaBancaria> {
    const conta = await this.contaBancariaRepository.findOne({
      where: { id },
      relations: [
        'banco',
        'unidade_saude',
        'unidades_vinculadas',
        'unidades_vinculadas.unidade_saude',
      ],
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

    // Se está alterando banco, agência ou conta, verifica se não existe outro com a mesma combinação
    if (updateDto.banco_id || updateDto.agencia || updateDto.numero_conta) {
      const existente = await this.contaBancariaRepository.findOne({
        where: {
          banco_id: updateDto.banco_id || conta.banco_id,
          agencia: updateDto.agencia || conta.agencia,
          numero_conta: updateDto.numero_conta || conta.numero_conta,
        },
      });

      if (existente && existente.id !== id) {
        throw new ConflictException(
          `Já existe uma conta bancária com agência ${updateDto.agencia || conta.agencia} e conta ${updateDto.numero_conta || conta.numero_conta} para este banco`,
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
