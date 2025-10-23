import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, FindManyOptions, ILike } from 'typeorm';
import { UnidadeSaude } from './entities/unidade-saude.entity';
import { HorarioAtendimento } from './entities/horario-atendimento.entity';
import { DadoBancario } from './entities/dado-bancario.entity';
import { CnaeSecundario } from './entities/cnae-secundario.entity';
import { Banco } from '../../financeiro/core/entities/banco.entity';
import { CreateUnidadeSaudeDto } from './dto/create-unidade-saude.dto';
import { UpdateUnidadeSaudeDto } from './dto/update-unidade-saude.dto';

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  ativo?: boolean;
  cidade?: string;
  estado?: string;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class UnidadeSaudeService {
  constructor(
    @InjectRepository(UnidadeSaude)
    private readonly unidadeSaudeRepository: Repository<UnidadeSaude>,
    @InjectRepository(HorarioAtendimento)
    private readonly horarioAtendimentoRepository: Repository<HorarioAtendimento>,
    @InjectRepository(DadoBancario)
    private readonly dadoBancarioRepository: Repository<DadoBancario>,
    @InjectRepository(CnaeSecundario)
    private readonly cnaeSecundarioRepository: Repository<CnaeSecundario>,
    @InjectRepository(Banco)
    private readonly bancoRepository: Repository<Banco>,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Cria uma nova unidade de saúde com todos os relacionamentos
   */
  async create(createDto: CreateUnidadeSaudeDto): Promise<UnidadeSaude> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Verifica se já existe uma unidade com o mesmo CNPJ
      const existingUnidade = await this.unidadeSaudeRepository.findOne({
        where: { cnpj: createDto.cnpj },
      });

      if (existingUnidade) {
        throw new ConflictException(
          `Já existe uma unidade com o CNPJ ${createDto.cnpj}`,
        );
      }

      // Cria a unidade principal
      const {
        horariosAtendimento,
        dadosBancarios,
        cnaeSecundarios,
        cnaePrincipalId,
        ...unidadeData
      } = createDto;
      const unidade = this.unidadeSaudeRepository.create({
        ...unidadeData,
        cnaePrincipalId: cnaePrincipalId || null,
      });

      const savedUnidade = await queryRunner.manager.save(
        UnidadeSaude,
        unidade,
      );

      // Salva os horários de atendimento
      if (horariosAtendimento?.length > 0) {
        const horarios = horariosAtendimento.map((h) =>
          this.horarioAtendimentoRepository.create({
            ...h,
            unidadeSaudeId: savedUnidade.id,
          }),
        );
        await queryRunner.manager.save(HorarioAtendimento, horarios);
      }

      // Salva os dados bancários
      if (dadosBancarios?.length > 0) {
        // Valida se todos os bancos existem
        for (const dadoBancario of dadosBancarios) {
          const banco = await this.bancoRepository.findOne({
            where: { id: dadoBancario.bancoId },
          });

          if (!banco) {
            throw new BadRequestException(
              `Banco com ID ${dadoBancario.bancoId} não encontrado`,
            );
          }
        }

        // Garante que apenas um seja principal
        const hasPrincipal = dadosBancarios.some((d) => d.principal);
        if (!hasPrincipal && dadosBancarios.length > 0) {
          dadosBancarios[0].principal = true;
        }

        const dadosBancariosEntities = dadosBancarios.map((d) =>
          this.dadoBancarioRepository.create({
            ...d,
            unidadeSaudeId: savedUnidade.id,
          }),
        );
        await queryRunner.manager.save(DadoBancario, dadosBancariosEntities);
      }

      // Salva os CNAEs secundários
      if (cnaeSecundarios?.length > 0) {
        const cnaes = cnaeSecundarios.map((c) =>
          this.cnaeSecundarioRepository.create({
            cnaeId: c.cnaeId,
            unidadeSaudeId: savedUnidade.id,
            ativo: true,
          }),
        );
        await queryRunner.manager.save(CnaeSecundario, cnaes);
      }

      await queryRunner.commitTransaction();

      // Retorna a unidade completa com relacionamentos
      return this.findOne(savedUnidade.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Lista todas as unidades de saúde com paginação e filtros
   */
  async findAll(
    params: PaginationParams,
  ): Promise<PaginatedResult<UnidadeSaude>> {
    const { page = 1, limit = 10, search, ativo, cidade, estado } = params;

    const skip = (page - 1) * limit;

    let where: any = {};

    if (ativo !== undefined) {
      where.ativo = ativo;
    }

    if (cidade) {
      where.cidade = ILike(`%${cidade}%`);
    }

    if (estado) {
      where.estado = estado.toUpperCase();
    }

    if (search) {
      // Se há search, cria um array de condições OR
      where = [
        { ...where, nomeUnidade: ILike(`%${search}%`) },
        { ...where, nomeFantasia: ILike(`%${search}%`) },
        { ...where, cnpj: ILike(`%${search}%`) },
        { ...where, razaoSocial: ILike(`%${search}%`) },
      ];
    }

    const queryOptions: FindManyOptions<UnidadeSaude> = {
      where,
      relations: ['horariosAtendimento', 'dadosBancarios', 'cnaeSecundarios'],
      order: { nomeUnidade: 'ASC' },
      skip,
      take: limit,
    };

    const [data, total] =
      await this.unidadeSaudeRepository.findAndCount(queryOptions);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Busca uma unidade de saúde específica por ID
   */
  async findOne(id: string): Promise<UnidadeSaude> {
    const unidade = await this.unidadeSaudeRepository.findOne({
      where: { id },
      relations: ['horariosAtendimento', 'dadosBancarios', 'cnaeSecundarios'],
    });

    if (!unidade) {
      throw new NotFoundException(
        `Unidade de saúde com ID ${id} não encontrada`,
      );
    }

    return unidade;
  }

  /**
   * Busca uma unidade de saúde por CNPJ
   */
  async findByCnpj(cnpj: string): Promise<UnidadeSaude> {
    const unidade = await this.unidadeSaudeRepository.findOne({
      where: { cnpj },
      relations: ['horariosAtendimento', 'dadosBancarios', 'cnaeSecundarios'],
    });

    if (!unidade) {
      throw new NotFoundException(
        `Unidade de saúde com CNPJ ${cnpj} não encontrada`,
      );
    }

    return unidade;
  }

  /**
   * Atualiza uma unidade de saúde existente
   */
  async update(
    id: string,
    updateDto: UpdateUnidadeSaudeDto,
  ): Promise<UnidadeSaude> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Verifica se a unidade existe
      const unidade = await this.findOne(id);

      // Se mudou o CNPJ, verifica se já não existe outro com o mesmo CNPJ
      if (updateDto.cnpj && updateDto.cnpj !== unidade.cnpj) {
        const existingUnidade = await this.unidadeSaudeRepository.findOne({
          where: { cnpj: updateDto.cnpj },
        });

        if (existingUnidade) {
          throw new ConflictException(
            `Já existe uma unidade com o CNPJ ${updateDto.cnpj}`,
          );
        }
      }

      // Atualiza a unidade principal
      const {
        horariosAtendimento,
        dadosBancarios,
        cnaeSecundarios,
        cnaePrincipalId,
        ...updateData
      } = updateDto;
      await queryRunner.manager.update(
        UnidadeSaude,
        { id },
        {
          ...updateData,
          cnaePrincipalId:
            cnaePrincipalId !== undefined ? cnaePrincipalId : undefined,
        },
      );

      // Atualiza horários de atendimento se fornecidos
      if (horariosAtendimento !== undefined) {
        // Remove horários existentes
        await queryRunner.manager.delete(HorarioAtendimento, {
          unidadeSaudeId: id,
        });

        // Adiciona novos horários
        if (horariosAtendimento.length > 0) {
          const horarios = horariosAtendimento.map((h) =>
            this.horarioAtendimentoRepository.create({
              ...h,
              unidadeSaudeId: id,
            }),
          );
          await queryRunner.manager.save(HorarioAtendimento, horarios);
        }
      }

      // Atualiza dados bancários se fornecidos
      if (dadosBancarios !== undefined) {
        // Remove dados bancários existentes
        await queryRunner.manager.delete(DadoBancario, { unidadeSaudeId: id });

        // Adiciona novos dados bancários
        if (dadosBancarios.length > 0) {
          // Garante que apenas um seja principal
          const hasPrincipal = dadosBancarios.some((d) => d.principal);
          if (!hasPrincipal) {
            dadosBancarios[0].principal = true;
          }

          const dadosBancariosEntities = dadosBancarios.map((d) =>
            this.dadoBancarioRepository.create({
              ...d,
              unidadeSaudeId: id,
            }),
          );
          await queryRunner.manager.save(DadoBancario, dadosBancariosEntities);
        }
      }

      // Atualiza CNAEs secundários se fornecidos
      if (cnaeSecundarios !== undefined) {
        // Remove CNAEs existentes
        await queryRunner.manager.delete(CnaeSecundario, {
          unidadeSaudeId: id,
        });

        // Adiciona novos CNAEs
        if (cnaeSecundarios.length > 0) {
          const cnaes = cnaeSecundarios.map((c) =>
            this.cnaeSecundarioRepository.create({
              cnaeId: c.cnaeId,
              unidadeSaudeId: id,
              ativo: true,
            }),
          );
          await queryRunner.manager.save(CnaeSecundario, cnaes);
        }
      }

      await queryRunner.commitTransaction();

      // Retorna a unidade atualizada
      return this.findOne(id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Remove (soft delete) uma unidade de saúde
   */
  async remove(id: string): Promise<void> {
    await this.findOne(id);

    // Soft delete - apenas marca como inativo
    await this.unidadeSaudeRepository.update(id, { ativo: false });
  }

  /**
   * Ativa uma unidade de saúde
   */
  async activate(id: string): Promise<UnidadeSaude> {
    await this.findOne(id);

    await this.unidadeSaudeRepository.update(id, { ativo: true });

    return this.findOne(id);
  }

  /**
   * Desativa uma unidade de saúde
   */
  async deactivate(id: string): Promise<UnidadeSaude> {
    await this.findOne(id);

    await this.unidadeSaudeRepository.update(id, { ativo: false });

    return this.findOne(id);
  }

  /**
   * Lista unidades ativas para select/dropdown
   */
  async listActive(): Promise<
    Pick<UnidadeSaude, 'id' | 'nomeUnidade' | 'nomeFantasia' | 'cnpj'>[]
  > {
    return this.unidadeSaudeRepository.find({
      where: { ativo: true },
      select: ['id', 'nomeUnidade', 'nomeFantasia', 'cnpj'],
      order: { nomeUnidade: 'ASC' },
    });
  }

  /**
   * Busca unidades por cidade
   */
  async findByCidade(cidade: string): Promise<UnidadeSaude[]> {
    return this.unidadeSaudeRepository.find({
      where: {
        cidade: ILike(`%${cidade}%`),
        ativo: true,
      },
      relations: ['horariosAtendimento'],
      order: { nomeUnidade: 'ASC' },
    });
  }

  /**
   * Valida CNPJ
   */
  private validateCnpj(cnpj: string): boolean {
    if (!cnpj || typeof cnpj !== 'string') return false;

    cnpj = cnpj.replace(/[^\d]+/g, '');

    if (cnpj.length !== 14) return false;

    // Elimina CNPJs invalidos conhecidos
    if (/^(\d)\1{13}$/.test(cnpj)) return false;

    // Valida DVs
    let tamanho = cnpj.length - 2;
    let numeros = cnpj.substring(0, tamanho);
    const digitos = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;

    for (let i = tamanho; i >= 1; i--) {
      soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
      if (pos < 2) pos = 9;
    }

    let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado != parseInt(digitos.charAt(0))) return false;

    tamanho = tamanho + 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;

    for (let i = tamanho; i >= 1; i--) {
      soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
      if (pos < 2) pos = 9;
    }

    resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado != parseInt(digitos.charAt(1))) return false;

    return true;
  }
}
