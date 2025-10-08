import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FornecedorInsumo } from '../entities/fornecedor-insumo.entity';
import { CreateFornecedorInsumoDto } from '../dto/create-fornecedor-insumo.dto';
import { UpdateFornecedorInsumoDto } from '../dto/update-fornecedor-insumo.dto';

@Injectable()
export class FornecedorInsumoService {
  constructor(
    @InjectRepository(FornecedorInsumo)
    private readonly fornecedorInsumoRepository: Repository<FornecedorInsumo>,
  ) {}

  async create(
    createFornecedorInsumoDto: CreateFornecedorInsumoDto,
  ): Promise<FornecedorInsumo> {
    // Verificar se já existe código interno para este fornecedor
    const existingCodigo = await this.fornecedorInsumoRepository.findOne({
      where: {
        fornecedor_id: createFornecedorInsumoDto.fornecedor_id,
        codigo_interno: createFornecedorInsumoDto.codigo_interno,
      },
    });

    if (existingCodigo) {
      throw new ConflictException(
        'Já existe um insumo com este código interno para este fornecedor',
      );
    }

    const fornecedorInsumo = this.fornecedorInsumoRepository.create(
      createFornecedorInsumoDto,
    );
    return await this.fornecedorInsumoRepository.save(fornecedorInsumo);
  }

  async findAll(): Promise<FornecedorInsumo[]> {
    return await this.fornecedorInsumoRepository.find({
      relations: ['fornecedor', 'fornecedor.empresa'],
      order: { created_at: 'DESC' },
    });
  }

  async findByFornecedor(fornecedorId: string): Promise<FornecedorInsumo[]> {
    return await this.fornecedorInsumoRepository.find({
      where: { fornecedor_id: fornecedorId },
      order: { nome_insumo: 'ASC' },
    });
  }

  async findByCategoria(categoria: string): Promise<FornecedorInsumo[]> {
    return await this.fornecedorInsumoRepository.find({
      where: { categoria: categoria as any },
      relations: ['fornecedor', 'fornecedor.empresa'],
      order: { nome_insumo: 'ASC' },
    });
  }

  async findAtivos(): Promise<FornecedorInsumo[]> {
    return await this.fornecedorInsumoRepository.find({
      where: { ativo: true, status: 'disponivel' as any },
      relations: ['fornecedor', 'fornecedor.empresa'],
      order: { nome_insumo: 'ASC' },
    });
  }

  async findByStatus(status: string): Promise<FornecedorInsumo[]> {
    return await this.fornecedorInsumoRepository.find({
      where: { status: status as any },
      relations: ['fornecedor', 'fornecedor.empresa'],
      order: { nome_insumo: 'ASC' },
    });
  }

  async findByCodigoInterno(
    fornecedorId: string,
    codigoInterno: string,
  ): Promise<FornecedorInsumo> {
    const insumo = await this.fornecedorInsumoRepository.findOne({
      where: {
        fornecedor_id: fornecedorId,
        codigo_interno: codigoInterno,
      },
      relations: ['fornecedor', 'fornecedor.empresa'],
    });

    if (!insumo) {
      throw new NotFoundException(
        `Insumo com código ${codigoInterno} não encontrado para este fornecedor`,
      );
    }

    return insumo;
  }

  async findByCodigoBarras(codigoBarras: string): Promise<FornecedorInsumo[]> {
    return await this.fornecedorInsumoRepository.find({
      where: { codigo_barras: codigoBarras },
      relations: ['fornecedor', 'fornecedor.empresa'],
    });
  }

  async findPromocoes(): Promise<FornecedorInsumo[]> {
    const hoje = new Date();

    return await this.fornecedorInsumoRepository
      .createQueryBuilder('insumo')
      .leftJoinAndSelect('insumo.fornecedor', 'fornecedor')
      .leftJoinAndSelect('fornecedor.empresa', 'empresa')
      .where('insumo.preco_promocional IS NOT NULL')
      .andWhere('insumo.data_inicio_promocao <= :hoje', { hoje })
      .andWhere('insumo.data_fim_promocao >= :hoje', { hoje })
      .andWhere('insumo.ativo = true')
      .orderBy('insumo.nome_insumo', 'ASC')
      .getMany();
  }

  async findComEstoqueBaixo(
    quantidadeMinima: number = 10,
  ): Promise<FornecedorInsumo[]> {
    return await this.fornecedorInsumoRepository
      .createQueryBuilder('insumo')
      .leftJoinAndSelect('insumo.fornecedor', 'fornecedor')
      .leftJoinAndSelect('fornecedor.empresa', 'empresa')
      .where('insumo.estoque_disponivel IS NOT NULL')
      .andWhere('insumo.estoque_disponivel <= :quantidade', {
        quantidade: quantidadeMinima,
      })
      .andWhere('insumo.ativo = true')
      .orderBy('insumo.estoque_disponivel', 'ASC')
      .getMany();
  }

  async findVencendoValidade(dias: number = 30): Promise<FornecedorInsumo[]> {
    const dataLimite = new Date();
    dataLimite.setDate(dataLimite.getDate() + dias);

    return await this.fornecedorInsumoRepository
      .createQueryBuilder('insumo')
      .leftJoinAndSelect('insumo.fornecedor', 'fornecedor')
      .leftJoinAndSelect('fornecedor.empresa', 'empresa')
      .where('insumo.data_validade IS NOT NULL')
      .andWhere('insumo.data_validade <= :dataLimite', { dataLimite })
      .andWhere('insumo.ativo = true')
      .orderBy('insumo.data_validade', 'ASC')
      .getMany();
  }

  async findOne(id: string): Promise<FornecedorInsumo> {
    const insumo = await this.fornecedorInsumoRepository.findOne({
      where: { id },
      relations: ['fornecedor', 'fornecedor.empresa'],
    });

    if (!insumo) {
      throw new NotFoundException(`Insumo com ID ${id} não encontrado`);
    }

    return insumo;
  }

  async update(
    id: string,
    updateFornecedorInsumoDto: UpdateFornecedorInsumoDto,
  ): Promise<FornecedorInsumo> {
    const insumo = await this.findOne(id);

    // Verificar se está tentando alterar código interno para um que já existe
    if (
      updateFornecedorInsumoDto.codigo_interno &&
      updateFornecedorInsumoDto.codigo_interno !== insumo.codigo_interno
    ) {
      const existingCodigo = await this.fornecedorInsumoRepository.findOne({
        where: {
          fornecedor_id: insumo.fornecedor_id,
          codigo_interno: updateFornecedorInsumoDto.codigo_interno,
        },
      });

      if (existingCodigo && existingCodigo.id !== id) {
        throw new ConflictException(
          'Já existe um insumo com este código interno para este fornecedor',
        );
      }
    }

    Object.assign(insumo, updateFornecedorInsumoDto);
    return await this.fornecedorInsumoRepository.save(insumo);
  }

  async remove(id: string): Promise<void> {
    const insumo = await this.findOne(id);
    await this.fornecedorInsumoRepository.remove(insumo);
  }

  async toggleStatus(id: string): Promise<FornecedorInsumo> {
    const insumo = await this.findOne(id);
    insumo.ativo = !insumo.ativo;
    return await this.fornecedorInsumoRepository.save(insumo);
  }

  async atualizarEstoque(
    id: string,
    novaQuantidade: number,
  ): Promise<FornecedorInsumo> {
    const insumo = await this.findOne(id);
    insumo.estoque_disponivel = novaQuantidade;

    // Atualizar status baseado no estoque
    if (novaQuantidade === 0) {
      insumo.status = 'indisponivel' as any;
    } else if (insumo.status === ('indisponivel' as any)) {
      insumo.status = 'disponivel' as any;
    }

    return await this.fornecedorInsumoRepository.save(insumo);
  }

  async atualizarPreco(
    id: string,
    novoPreco: number,
  ): Promise<FornecedorInsumo> {
    const insumo = await this.findOne(id);
    insumo.preco_unitario = novoPreco;
    await this.fornecedorInsumoRepository.save(insumo);
    return await this.findOne(id);
  }

  async adicionarPromocao(
    id: string,
    precoPromocional: number,
    dataInicio: Date,
    dataFim: Date,
  ): Promise<FornecedorInsumo> {
    const insumo = await this.findOne(id);
    insumo.preco_promocional = precoPromocional;
    insumo.data_inicio_promocao = dataInicio;
    insumo.data_fim_promocao = dataFim;
    return await this.fornecedorInsumoRepository.save(insumo);
  }

  async removerPromocao(id: string): Promise<FornecedorInsumo> {
    const insumo = await this.findOne(id);
    insumo.preco_promocional = null;
    insumo.data_inicio_promocao = null;
    insumo.data_fim_promocao = null;
    return await this.fornecedorInsumoRepository.save(insumo);
  }

  async search(
    fornecedorId: string,
    query: string,
  ): Promise<FornecedorInsumo[]> {
    return await this.fornecedorInsumoRepository
      .createQueryBuilder('insumo')
      .where('insumo.fornecedor_id = :fornecedorId', { fornecedorId })
      .andWhere(
        '(insumo.nome_insumo ILIKE :query OR insumo.codigo_interno LIKE :query OR insumo.codigo_barras LIKE :query OR insumo.marca ILIKE :query)',
        { query: `%${query}%` },
      )
      .orderBy('insumo.nome_insumo', 'ASC')
      .getMany();
  }

  async searchGlobal(query: string): Promise<FornecedorInsumo[]> {
    return await this.fornecedorInsumoRepository
      .createQueryBuilder('insumo')
      .leftJoinAndSelect('insumo.fornecedor', 'fornecedor')
      .leftJoinAndSelect('fornecedor.empresa', 'empresa')
      .where(
        '(insumo.nome_insumo ILIKE :query OR insumo.codigo_interno LIKE :query OR insumo.codigo_barras LIKE :query OR insumo.marca ILIKE :query OR empresa.nomeFantasia ILIKE :query)',
        { query: `%${query}%` },
      )
      .andWhere('insumo.ativo = true')
      .orderBy('insumo.nome_insumo', 'ASC')
      .getMany();
  }

  async getEstatisticas(fornecedorId?: string): Promise<any> {
    const whereClause = fornecedorId ? { fornecedor_id: fornecedorId } : {};

    const total = await this.fornecedorInsumoRepository.count({
      where: whereClause,
    });
    const ativos = await this.fornecedorInsumoRepository.count({
      where: { ...whereClause, ativo: true },
    });

    const porCategoria = await this.fornecedorInsumoRepository
      .createQueryBuilder('insumo')
      .select('insumo.categoria', 'categoria')
      .addSelect('COUNT(*)', 'total')
      .where(fornecedorId ? 'insumo.fornecedor_id = :fornecedorId' : '1=1', {
        fornecedorId,
      })
      .groupBy('insumo.categoria')
      .getRawMany();

    const porStatus = await this.fornecedorInsumoRepository
      .createQueryBuilder('insumo')
      .select('insumo.status', 'status')
      .addSelect('COUNT(*)', 'total')
      .where(fornecedorId ? 'insumo.fornecedor_id = :fornecedorId' : '1=1', {
        fornecedorId,
      })
      .groupBy('insumo.status')
      .getRawMany();

    const emPromocao = await this.fornecedorInsumoRepository.count({
      where: {
        ...whereClause,
        preco_promocional: 'IS NOT NULL' as any,
      },
    });

    return {
      total,
      ativos,
      inativos: total - ativos,
      porCategoria,
      porStatus,
      emPromocao,
    };
  }

  async registrarPedido(id: string): Promise<void> {
    const insumo = await this.findOne(id);
    insumo.data_ultimo_pedido = new Date();
    insumo.total_pedidos = (insumo.total_pedidos || 0) + 1;
    await this.fornecedorInsumoRepository.save(insumo);
  }

  async avaliarProduto(
    id: string,
    avaliacao: number,
  ): Promise<FornecedorInsumo> {
    const insumo = await this.findOne(id);
    insumo.avaliacao_produto = avaliacao;
    return await this.fornecedorInsumoRepository.save(insumo);
  }
}
