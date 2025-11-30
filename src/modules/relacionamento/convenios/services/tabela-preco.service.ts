import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOptionsWhere } from 'typeorm';
import { TabelaPreco, TipoTabelaPreco } from '../entities/tabela-preco.entity';
import { TabelaPrecoItem } from '../entities/tabela-preco-item.entity';
import { CreateTabelaPrecoDto } from '../dto/create-tabela-preco.dto';
import { UpdateTabelaPrecoDto } from '../dto/update-tabela-preco.dto';
import { CreateTabelaPrecoItemDto } from '../dto/create-tabela-preco-item.dto';
import { UpdateTabelaPrecoItemDto } from '../dto/update-tabela-preco-item.dto';

export interface FindAllOptions {
  ativo?: boolean;
  tipo_tabela?: TipoTabelaPreco;
  search?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

@Injectable()
export class TabelaPrecoService {
  constructor(
    @InjectRepository(TabelaPreco)
    private readonly tabelaPrecoRepository: Repository<TabelaPreco>,
    @InjectRepository(TabelaPrecoItem)
    private readonly tabelaPrecoItemRepository: Repository<TabelaPrecoItem>,
  ) {}

  // ==========================================
  // CRUD - TABELA DE PREÇOS
  // ==========================================

  async create(
    createTabelaPrecoDto: CreateTabelaPrecoDto,
  ): Promise<TabelaPreco> {
    // Verificar se já existe tabela com o mesmo código
    const existingTabela = await this.tabelaPrecoRepository.findOne({
      where: { codigo_interno: createTabelaPrecoDto.codigo_interno },
    });

    if (existingTabela) {
      throw new ConflictException(
        `Já existe uma tabela de preços com o código ${createTabelaPrecoDto.codigo_interno}`,
      );
    }

    // Criar tabela
    const tabela = this.tabelaPrecoRepository.create({
      codigo_interno: createTabelaPrecoDto.codigo_interno,
      nome: createTabelaPrecoDto.nome,
      tipo_tabela: createTabelaPrecoDto.tipo_tabela,
      observacoes: createTabelaPrecoDto.observacoes,
      ativo: createTabelaPrecoDto.ativo ?? true,
      empresa_id: createTabelaPrecoDto.empresa_id,
    });

    const tabelaSalva = await this.tabelaPrecoRepository.save(tabela);

    // Se tiver itens, criar também
    if (createTabelaPrecoDto.itens?.length) {
      for (const itemDto of createTabelaPrecoDto.itens) {
        const item = this.tabelaPrecoItemRepository.create({
          ...itemDto,
          tabela_preco_id: tabelaSalva.id,
        });
        await this.tabelaPrecoItemRepository.save(item);
      }
    }

    return this.findOne(tabelaSalva.id);
  }

  async findAll(
    options?: FindAllOptions,
  ): Promise<TabelaPreco[] | PaginatedResult<TabelaPreco>> {
    const where: FindOptionsWhere<TabelaPreco> = {};

    if (options?.ativo !== undefined) {
      where.ativo = options.ativo;
    }

    if (options?.tipo_tabela) {
      where.tipo_tabela = options.tipo_tabela;
    }

    // Se tiver paginação
    if (options?.page && options?.limit) {
      const [data, total] = await this.tabelaPrecoRepository.findAndCount({
        where,
        relations: ['itens'],
        order: { nome: 'ASC' },
        skip: (options.page - 1) * options.limit,
        take: options.limit,
      });

      return {
        data,
        meta: {
          total,
          page: options.page,
          limit: options.limit,
          totalPages: Math.ceil(total / options.limit),
        },
      };
    }

    // Sem paginação
    return await this.tabelaPrecoRepository.find({
      where,
      relations: ['itens'],
      order: { nome: 'ASC' },
    });
  }

  async findOne(id: string): Promise<TabelaPreco> {
    const tabela = await this.tabelaPrecoRepository.findOne({
      where: { id },
      relations: ['itens', 'itens.exame'],
    });

    if (!tabela) {
      throw new NotFoundException(
        `Tabela de preços com ID ${id} não encontrada`,
      );
    }

    return tabela;
  }

  async findByCodigo(codigoInterno: string): Promise<TabelaPreco> {
    const tabela = await this.tabelaPrecoRepository.findOne({
      where: { codigo_interno: codigoInterno },
      relations: ['itens', 'itens.exame'],
    });

    if (!tabela) {
      throw new NotFoundException(
        `Tabela de preços com código ${codigoInterno} não encontrada`,
      );
    }

    return tabela;
  }

  async findAtivas(): Promise<TabelaPreco[]> {
    return await this.tabelaPrecoRepository.find({
      where: { ativo: true },
      relations: ['itens'],
      order: { nome: 'ASC' },
    });
  }

  async findByTipo(tipo: TipoTabelaPreco): Promise<TabelaPreco[]> {
    return await this.tabelaPrecoRepository.find({
      where: { tipo_tabela: tipo, ativo: true },
      relations: ['itens'],
      order: { nome: 'ASC' },
    });
  }

  async search(termo: string): Promise<TabelaPreco[]> {
    return await this.tabelaPrecoRepository.find({
      where: [
        { nome: Like(`%${termo}%`) },
        { codigo_interno: Like(`%${termo}%`) },
      ],
      relations: ['itens'],
      order: { nome: 'ASC' },
    });
  }

  async update(
    id: string,
    updateTabelaPrecoDto: UpdateTabelaPrecoDto,
  ): Promise<TabelaPreco> {
    const tabela = await this.findOne(id);

    // Verificar unicidade do código se estiver sendo alterado
    if (
      updateTabelaPrecoDto.codigo_interno &&
      updateTabelaPrecoDto.codigo_interno !== tabela.codigo_interno
    ) {
      const existingTabela = await this.tabelaPrecoRepository.findOne({
        where: { codigo_interno: updateTabelaPrecoDto.codigo_interno },
      });

      if (existingTabela && existingTabela.id !== id) {
        throw new ConflictException(
          `Já existe uma tabela de preços com o código ${updateTabelaPrecoDto.codigo_interno}`,
        );
      }
    }

    Object.assign(tabela, updateTabelaPrecoDto);
    await this.tabelaPrecoRepository.save(tabela);

    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const tabela = await this.findOne(id);
    await this.tabelaPrecoRepository.remove(tabela);
  }

  async toggleStatus(id: string): Promise<TabelaPreco> {
    const tabela = await this.findOne(id);
    tabela.ativo = !tabela.ativo;
    await this.tabelaPrecoRepository.save(tabela);
    return this.findOne(id);
  }

  // ==========================================
  // CRUD - ITENS DA TABELA
  // ==========================================

  async createItem(
    tabelaId: string,
    createItemDto: CreateTabelaPrecoItemDto,
  ): Promise<TabelaPrecoItem> {
    // Verificar se tabela existe
    await this.findOne(tabelaId);

    // Verificar se já existe item com mesmo exame na tabela
    const existingItem = await this.tabelaPrecoItemRepository.findOne({
      where: {
        tabela_preco_id: tabelaId,
        exame_id: createItemDto.exame_id,
      },
    });

    if (existingItem) {
      throw new ConflictException(
        'Este exame já está cadastrado nesta tabela de preços',
      );
    }

    const item = this.tabelaPrecoItemRepository.create({
      ...createItemDto,
      tabela_preco_id: tabelaId,
    });

    return await this.tabelaPrecoItemRepository.save(item);
  }

  async findAllItens(tabelaId: string): Promise<TabelaPrecoItem[]> {
    // Verificar se tabela existe
    await this.findOne(tabelaId);

    return await this.tabelaPrecoItemRepository.find({
      where: { tabela_preco_id: tabelaId },
      relations: ['exame'],
      order: { created_at: 'ASC' },
    });
  }

  async findOneItem(
    tabelaId: string,
    itemId: string,
  ): Promise<TabelaPrecoItem> {
    const item = await this.tabelaPrecoItemRepository.findOne({
      where: { id: itemId, tabela_preco_id: tabelaId },
      relations: ['exame', 'tabelaPreco'],
    });

    if (!item) {
      throw new NotFoundException(
        `Item com ID ${itemId} não encontrado na tabela ${tabelaId}`,
      );
    }

    return item;
  }

  async updateItem(
    tabelaId: string,
    itemId: string,
    updateItemDto: UpdateTabelaPrecoItemDto,
  ): Promise<TabelaPrecoItem> {
    const item = await this.findOneItem(tabelaId, itemId);

    Object.assign(item, updateItemDto);
    await this.tabelaPrecoItemRepository.save(item);

    return this.findOneItem(tabelaId, itemId);
  }

  async removeItem(tabelaId: string, itemId: string): Promise<void> {
    const item = await this.findOneItem(tabelaId, itemId);
    await this.tabelaPrecoItemRepository.remove(item);
  }

  async toggleItemStatus(
    tabelaId: string,
    itemId: string,
  ): Promise<TabelaPrecoItem> {
    const item = await this.findOneItem(tabelaId, itemId);
    item.ativo = !item.ativo;
    await this.tabelaPrecoItemRepository.save(item);
    return this.findOneItem(tabelaId, itemId);
  }

  // ==========================================
  // UTILITÁRIOS
  // ==========================================

  async findPrecoExame(
    tabelaId: string,
    exameId: string,
  ): Promise<TabelaPrecoItem | null> {
    return await this.tabelaPrecoItemRepository.findOne({
      where: {
        tabela_preco_id: tabelaId,
        exame_id: exameId,
        ativo: true,
      },
      relations: ['exame'],
    });
  }

  async countItens(tabelaId: string): Promise<number> {
    return await this.tabelaPrecoItemRepository.count({
      where: { tabela_preco_id: tabelaId },
    });
  }
}
