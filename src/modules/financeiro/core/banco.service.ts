import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { Banco, StatusBanco } from './entities/banco.entity';
import { CreateBancoDto } from './dto/create-banco.dto';
import { UpdateBancoDto } from './dto/update-banco.dto';
import { AuditoriaService } from '../../infraestrutura/auditoria/auditoria.service';
import {
  TipoLog,
  OperacaoLog,
} from '../../infraestrutura/auditoria/entities/auditoria-log.entity';

@Injectable()
export class BancoService {
  constructor(
    @InjectRepository(Banco)
    private readonly bancoRepository: Repository<Banco>,
    private readonly auditoriaService: AuditoriaService,
  ) {}

  async create(
    createBancoDto: CreateBancoDto,
    usuarioId: string,
  ): Promise<Banco> {
    // Verificar se já existe um banco com o mesmo código
    const bancoExistente = await this.bancoRepository.findOne({
      where: [
        { codigo: createBancoDto.codigo },
        { codigo_interno: createBancoDto.codigo_interno },
      ],
    });

    if (bancoExistente) {
      throw new ConflictException(
        'Já existe um banco com este código ou código interno',
      );
    }

    const banco = this.bancoRepository.create(createBancoDto);
    const bancoSalvo = await this.bancoRepository.save(banco);

    // Registrar auditoria
    await this.auditoriaService.registrarLog({
      tipoLog: TipoLog.ALTERACAO,
      usuarioId,
      modulo: 'financeiro',
      acao: 'criar_banco',
      entidade: 'bancos',
      entidadeId: bancoSalvo.id,
      operacao: OperacaoLog.INSERT,
      dadosAlteracao: { antes: null, depois: bancoSalvo },
      detalhes: `Banco ${bancoSalvo.nome} criado`,
    });

    return bancoSalvo;
  }

  async findAll(
    page = 1,
    limit = 10,
    search?: string,
    status?: string,
  ): Promise<{
    data: Banco[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;

    const where: FindOptionsWhere<Banco> = {};

    if (status) {
      where.status = status as any;
    }

    const query = this.bancoRepository.createQueryBuilder('banco');

    if (status) {
      query.where('banco.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        '(banco.nome ILIKE :search OR banco.codigo ILIKE :search OR banco.codigo_interno ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    query.orderBy('banco.codigo', 'ASC').skip(skip).take(limit);

    const [data, total] = await query.getManyAndCount();

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Banco> {
    const banco = await this.bancoRepository.findOne({
      where: { id },
      relations: ['contas'],
    });

    if (!banco) {
      throw new NotFoundException(`Banco com ID ${id} não encontrado`);
    }

    return banco;
  }

  async findByCodigo(codigo: string): Promise<Banco> {
    const banco = await this.bancoRepository.findOne({
      where: { codigo },
    });

    if (!banco) {
      throw new NotFoundException(`Banco com código ${codigo} não encontrado`);
    }

    return banco;
  }

  async findByCodigoInterno(codigoInterno: string): Promise<Banco> {
    const banco = await this.bancoRepository.findOne({
      where: { codigo_interno: codigoInterno },
    });

    if (!banco) {
      throw new NotFoundException(
        `Banco com código interno ${codigoInterno} não encontrado`,
      );
    }

    return banco;
  }

  async update(
    id: string,
    updateBancoDto: UpdateBancoDto,
    usuarioId: string,
  ): Promise<Banco> {
    const banco = await this.findOne(id);

    // Verificar se o novo código já existe em outro banco
    if (updateBancoDto.codigo && updateBancoDto.codigo !== banco.codigo) {
      const bancoExistente = await this.bancoRepository.findOne({
        where: { codigo: updateBancoDto.codigo },
      });

      if (bancoExistente) {
        throw new ConflictException('Já existe um banco com este código');
      }
    }

    // Verificar se o novo código interno já existe em outro banco
    if (
      updateBancoDto.codigo_interno &&
      updateBancoDto.codigo_interno !== banco.codigo_interno
    ) {
      const bancoExistente = await this.bancoRepository.findOne({
        where: { codigo_interno: updateBancoDto.codigo_interno },
      });

      if (bancoExistente) {
        throw new ConflictException(
          'Já existe um banco com este código interno',
        );
      }
    }

    const dadosAntigos = { ...banco };
    Object.assign(banco, updateBancoDto);
    const bancoAtualizado = await this.bancoRepository.save(banco);

    // Registrar auditoria
    await this.auditoriaService.registrarLog({
      tipoLog: TipoLog.ALTERACAO,
      usuarioId,
      modulo: 'financeiro',
      acao: 'atualizar_banco',
      entidade: 'bancos',
      entidadeId: banco.id,
      operacao: OperacaoLog.UPDATE,
      dadosAlteracao: { antes: dadosAntigos, depois: bancoAtualizado },
      detalhes: `Banco ${banco.nome} atualizado`,
    });

    return bancoAtualizado;
  }

  async remove(id: string, usuarioId: string): Promise<void> {
    const banco = await this.findOne(id);

    // Verificar se há contas vinculadas
    if (banco.contas && banco.contas.length > 0) {
      throw new ConflictException(
        'Não é possível excluir este banco pois existem contas vinculadas',
      );
    }

    await this.bancoRepository.remove(banco);

    // Registrar auditoria
    await this.auditoriaService.registrarLog({
      tipoLog: TipoLog.ALTERACAO,
      usuarioId,
      modulo: 'financeiro',
      acao: 'excluir_banco',
      entidade: 'bancos',
      entidadeId: id,
      operacao: OperacaoLog.DELETE,
      dadosAlteracao: { antes: banco, depois: null },
      detalhes: `Banco ${banco.nome} excluído`,
    });
  }

  async toggleStatus(id: string, usuarioId: string): Promise<Banco> {
    const banco = await this.findOne(id);
    const statusAnterior = banco.status;

    banco.status =
      banco.status === StatusBanco.ATIVO
        ? StatusBanco.INATIVO
        : StatusBanco.ATIVO;
    const bancoAtualizado = await this.bancoRepository.save(banco);

    // Registrar auditoria
    await this.auditoriaService.registrarLog({
      tipoLog: TipoLog.ALTERACAO,
      usuarioId,
      modulo: 'financeiro',
      acao: 'alterar_status_banco',
      entidade: 'bancos',
      entidadeId: banco.id,
      operacao: OperacaoLog.UPDATE,
      dadosAlteracao: {
        antes: { status: statusAnterior },
        depois: { status: banco.status },
      },
      detalhes: `Status do banco ${banco.nome} alterado de ${statusAnterior} para ${banco.status}`,
    });

    return bancoAtualizado;
  }

  async findAtivos(): Promise<Banco[]> {
    return this.bancoRepository.find({
      where: { status: StatusBanco.ATIVO },
      order: { nome: 'ASC' },
    });
  }

  async count(): Promise<number> {
    return this.bancoRepository.count();
  }

  async countAtivos(): Promise<number> {
    return this.bancoRepository.count({
      where: { status: StatusBanco.ATIVO },
    });
  }

  async search(termo: string): Promise<Banco[]> {
    return await this.bancoRepository
      .createQueryBuilder('banco')
      .where(
        'banco.nome ILIKE :termo OR banco.codigo ILIKE :termo OR banco.codigo_interno ILIKE :termo',
        { termo: `%${termo}%` },
      )
      .orderBy('banco.nome', 'ASC')
      .getMany();
  }
}
