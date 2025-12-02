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
import {
  CreateContaBancariaDto,
  CreateContaBancariaBatchDto,
} from './dto/create-conta-bancaria.dto';
import { UpdateContaBancariaDto } from './dto/update-conta-bancaria.dto';
import { PaginatedResultDto } from '../../infraestrutura/common/dto/pagination.dto';

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  tipo?: TipoConta;
  status?: StatusConta;
  banco_id?: string;
  unidade_id?: string;
}

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

  async createBatch(batchDto: CreateContaBancariaBatchDto): Promise<{
    criadas: ContaBancaria[];
    erros: { index: number; erro: string }[];
  }> {
    const criadas: ContaBancaria[] = [];
    const erros: { index: number; erro: string }[] = [];

    for (let i = 0; i < batchDto.contas.length; i++) {
      const dto = batchDto.contas[i];
      try {
        const conta = await this.create(dto);
        criadas.push(conta);
      } catch (error) {
        erros.push({
          index: i,
          erro: error.message || 'Erro desconhecido ao criar conta',
        });
      }
    }

    return { criadas, erros };
  }

  async findAll(
    params: PaginationParams,
  ): Promise<PaginatedResultDto<ContaBancaria>> {
    const page = params.page || 1;
    const limit = params.limit || 10;
    const skip = (page - 1) * limit;

    const queryBuilder = this.contaBancariaRepository
      .createQueryBuilder('conta')
      .leftJoinAndSelect('conta.banco', 'banco')
      .leftJoinAndSelect('conta.unidade_saude', 'unidade_saude')
      .leftJoinAndSelect('conta.unidades_vinculadas', 'unidades_vinculadas')
      .leftJoinAndSelect(
        'unidades_vinculadas.unidade_saude',
        'vinculo_unidade',
      );

    // Filtro de busca textual (agência, conta, banco)
    if (params.search) {
      queryBuilder.andWhere(
        '(conta.agencia ILIKE :search OR conta.numero_conta ILIKE :search OR banco.nome ILIKE :search)',
        { search: `%${params.search}%` },
      );
    }

    // Filtro por tipo de conta
    if (params.tipo) {
      queryBuilder.andWhere('conta.tipo_conta = :tipo', { tipo: params.tipo });
    }

    // Filtro por status
    if (params.status) {
      queryBuilder.andWhere('conta.status = :status', {
        status: params.status,
      });
    }

    // Filtro por banco
    if (params.banco_id) {
      queryBuilder.andWhere('conta.banco_id = :banco_id', {
        banco_id: params.banco_id,
      });
    }

    // Filtro por unidade
    if (params.unidade_id) {
      queryBuilder.andWhere('conta.unidade_saude_id = :unidade_id', {
        unidade_id: params.unidade_id,
      });
    }

    // Ordenação e paginação
    queryBuilder.orderBy('conta.created_at', 'DESC').skip(skip).take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return new PaginatedResultDto(data, total, page, limit);
  }

  async findAtivas(): Promise<ContaBancaria[]> {
    return await this.contaBancariaRepository.find({
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

    // Extrai unidades_ids para processar separadamente
    const { unidades_ids, ...dadosConta } = updateDto;

    // Atualiza os dados básicos da conta
    Object.assign(conta, dadosConta);
    const contaAtualizada = await this.contaBancariaRepository.save(conta);

    // Se unidades_ids foi fornecido, atualiza os vínculos
    if (unidades_ids !== undefined) {
      // Remove todos os vínculos antigos
      await this.contaBancariaRepository
        .createQueryBuilder()
        .delete()
        .from('contas_bancarias_unidades')
        .where('conta_bancaria_id = :contaId', { contaId: id })
        .execute();

      // Adiciona os novos vínculos
      if (unidades_ids.length > 0) {
        const vinculos = unidades_ids.map((unidadeId) => ({
          conta_bancaria_id: id,
          unidade_saude_id: unidadeId,
          ativo: true,
        }));

        await this.contaBancariaRepository
          .createQueryBuilder()
          .insert()
          .into('contas_bancarias_unidades')
          .values(vinculos)
          .execute();
      }

      // Retorna a conta atualizada com os novos vínculos
      return await this.findOne(id);
    }

    return contaAtualizada;
  }

  async remove(id: string): Promise<void> {
    const conta = await this.findOne(id);
    await this.contaBancariaRepository.remove(conta);
  }
}
