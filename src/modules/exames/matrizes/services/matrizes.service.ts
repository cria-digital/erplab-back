import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, Like } from 'typeorm';
import {
  MatrizExame,
  TipoMatriz,
  StatusMatriz,
} from '../entities/matriz-exame.entity';
import { CampoMatriz } from '../entities/campo-matriz.entity';
import { CreateMatrizDto } from '../dto/create-matriz.dto';
import { UpdateMatrizDto } from '../dto/update-matriz.dto';

export interface PaginatedMatrizResult {
  data: MatrizExame[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class MatrizesService {
  constructor(
    @InjectRepository(MatrizExame)
    private readonly matrizRepository: Repository<MatrizExame>,
    @InjectRepository(CampoMatriz)
    private readonly campoMatrizRepository: Repository<CampoMatriz>,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Criar nova matriz com seus campos
   */
  async create(
    createMatrizDto: CreateMatrizDto,
    usuarioId: string,
  ): Promise<MatrizExame> {
    // Verificar se código já existe
    const existingMatriz = await this.matrizRepository.findOne({
      where: { codigoInterno: createMatrizDto.codigoInterno },
    });

    if (existingMatriz) {
      throw new ConflictException(
        `Matriz com código ${createMatrizDto.codigoInterno} já existe`,
      );
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Separar campos do restante dos dados
      const { campos, ...matrizData } = createMatrizDto;

      // Criar matriz
      const matriz = this.matrizRepository.create({
        ...matrizData,
        criadoPor: usuarioId,
        atualizadoPor: usuarioId,
      });

      const savedMatriz = await queryRunner.manager.save(matriz);

      // Criar campos se fornecidos
      if (campos && campos.length > 0) {
        const camposEntities = campos.map((campoDto, index) =>
          this.campoMatrizRepository.create({
            ...campoDto,
            matrizId: savedMatriz.id,
            ordemExibicao: campoDto.ordemExibicao ?? index,
          }),
        );

        await queryRunner.manager.save(CampoMatriz, camposEntities);
      }

      await queryRunner.commitTransaction();

      // Retornar matriz completa com campos
      return this.findOne(savedMatriz.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Listar matrizes com paginação e filtros
   */
  async findAll(
    page: number = 1,
    limit: number = 10,
    search?: string,
    tipoMatriz?: TipoMatriz,
    status?: StatusMatriz,
    ativo?: boolean,
  ): Promise<PaginatedMatrizResult> {
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.nome = Like(`%${search}%`);
    }

    if (tipoMatriz) {
      where.tipoMatriz = tipoMatriz;
    }

    if (status) {
      where.status = status;
    }

    if (ativo !== undefined) {
      where.ativo = ativo;
    }

    const [data, total] = await this.matrizRepository.findAndCount({
      where,
      relations: ['campos'],
      order: {
        nome: 'ASC',
      },
      skip,
      take: limit,
    });

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Buscar matriz por ID
   */
  async findOne(id: string): Promise<MatrizExame> {
    const matriz = await this.matrizRepository.findOne({
      where: { id },
      relations: ['campos', 'tipoExame', 'exame'],
    });

    if (!matriz) {
      throw new NotFoundException(`Matriz com ID ${id} não encontrada`);
    }

    return matriz;
  }

  /**
   * Buscar matriz por código interno
   */
  async findByCodigo(codigoInterno: string): Promise<MatrizExame> {
    const matriz = await this.matrizRepository.findOne({
      where: { codigoInterno },
      relations: ['campos'],
    });

    if (!matriz) {
      throw new NotFoundException(
        `Matriz com código ${codigoInterno} não encontrada`,
      );
    }

    return matriz;
  }

  /**
   * Buscar matrizes por tipo
   */
  async findByTipo(tipoMatriz: TipoMatriz): Promise<MatrizExame[]> {
    return this.matrizRepository.find({
      where: { tipoMatriz, ativo: true },
      relations: ['campos'],
      order: { nome: 'ASC' },
    });
  }

  /**
   * Buscar matrizes padrão do sistema
   */
  async findPadrao(): Promise<MatrizExame[]> {
    return this.matrizRepository.find({
      where: { padraoSistema: true, ativo: true },
      relations: ['campos'],
      order: { tipoMatriz: 'ASC', nome: 'ASC' },
    });
  }

  /**
   * Buscar matrizes ativas
   */
  async findAtivas(): Promise<MatrizExame[]> {
    return this.matrizRepository.find({
      where: { ativo: true, status: StatusMatriz.ATIVO },
      relations: ['campos'],
      order: { nome: 'ASC' },
    });
  }

  /**
   * Atualizar matriz
   */
  async update(
    id: string,
    updateMatrizDto: UpdateMatrizDto,
    usuarioId: string,
  ): Promise<MatrizExame> {
    const matriz = await this.findOne(id);

    // Se é matriz padrão, não permite algumas alterações
    if (matriz.padraoSistema && updateMatrizDto.padraoSistema === false) {
      throw new BadRequestException(
        'Não é possível desmarcar matriz padrão do sistema',
      );
    }

    // Verificar conflito de código
    if (
      updateMatrizDto.codigoInterno &&
      updateMatrizDto.codigoInterno !== matriz.codigoInterno
    ) {
      const existingMatriz = await this.matrizRepository.findOne({
        where: { codigoInterno: updateMatrizDto.codigoInterno },
      });

      if (existingMatriz) {
        throw new ConflictException(
          `Matriz com código ${updateMatrizDto.codigoInterno} já existe`,
        );
      }
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Separar campos do restante
      const { campos, ...matrizData } = updateMatrizDto;

      // Atualizar matriz
      Object.assign(matriz, {
        ...matrizData,
        atualizadoPor: usuarioId,
      });

      await queryRunner.manager.save(matriz);

      // Se campos foram fornecidos, substituir todos
      if (campos !== undefined) {
        // Remover campos existentes
        await queryRunner.manager.delete(CampoMatriz, { matrizId: id });

        // Criar novos campos
        if (campos.length > 0) {
          const camposEntities = campos.map((campoDto, index) =>
            this.campoMatrizRepository.create({
              ...campoDto,
              matrizId: id,
              ordemExibicao: campoDto.ordemExibicao ?? index,
            }),
          );

          await queryRunner.manager.save(CampoMatriz, camposEntities);
        }
      }

      await queryRunner.commitTransaction();

      return this.findOne(id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Remover matriz (soft delete)
   */
  async remove(id: string, usuarioId: string): Promise<void> {
    const matriz = await this.findOne(id);

    if (matriz.padraoSistema) {
      throw new BadRequestException(
        'Não é possível remover matriz padrão do sistema',
      );
    }

    matriz.ativo = false;
    matriz.atualizadoPor = usuarioId;

    await this.matrizRepository.save(matriz);
  }

  /**
   * Ativar matriz
   */
  async activate(id: string, usuarioId: string): Promise<MatrizExame> {
    const matriz = await this.findOne(id);

    matriz.ativo = true;
    matriz.status = StatusMatriz.ATIVO;
    matriz.atualizadoPor = usuarioId;

    await this.matrizRepository.save(matriz);

    return this.findOne(id);
  }

  /**
   * Desativar matriz
   */
  async deactivate(id: string, usuarioId: string): Promise<MatrizExame> {
    const matriz = await this.findOne(id);

    if (matriz.padraoSistema) {
      throw new BadRequestException(
        'Não é possível desativar matriz padrão do sistema',
      );
    }

    matriz.ativo = false;
    matriz.status = StatusMatriz.INATIVO;
    matriz.atualizadoPor = usuarioId;

    await this.matrizRepository.save(matriz);

    return this.findOne(id);
  }

  /**
   * Duplicar matriz (criar nova versão ou cópia)
   */
  async duplicate(
    id: string,
    novoCodigoInterno: string,
    novoNome: string,
    usuarioId: string,
  ): Promise<MatrizExame> {
    const matrizOriginal = await this.findOne(id);

    // Verificar se novo código já existe
    const existingMatriz = await this.matrizRepository.findOne({
      where: { codigoInterno: novoCodigoInterno },
    });

    if (existingMatriz) {
      throw new ConflictException(
        `Matriz com código ${novoCodigoInterno} já existe`,
      );
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Criar nova matriz (cópia)
      const novaMatriz = this.matrizRepository.create({
        ...matrizOriginal,
        id: undefined,
        codigoInterno: novoCodigoInterno,
        nome: novoNome,
        padraoSistema: false, // Cópia nunca é padrão
        criadoPor: usuarioId,
        atualizadoPor: usuarioId,
        criadoEm: undefined,
        atualizadoEm: undefined,
      });

      const savedMatriz = await queryRunner.manager.save(novaMatriz);

      // Copiar campos
      const camposOriginais = await this.campoMatrizRepository.find({
        where: { matrizId: id },
      });

      if (camposOriginais.length > 0) {
        const novosCampos = camposOriginais.map((campo) =>
          this.campoMatrizRepository.create({
            ...campo,
            id: undefined,
            matrizId: savedMatriz.id,
            criadoEm: undefined,
            atualizadoEm: undefined,
          }),
        );

        await queryRunner.manager.save(CampoMatriz, novosCampos);
      }

      await queryRunner.commitTransaction();

      return this.findOne(savedMatriz.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Estatísticas de matrizes
   */
  async getStats() {
    const [total, ativas, inativas, porTipo] = await Promise.all([
      this.matrizRepository.count(),
      this.matrizRepository.count({ where: { ativo: true } }),
      this.matrizRepository.count({ where: { ativo: false } }),
      this.matrizRepository
        .createQueryBuilder('matriz')
        .select('matriz.tipo_matriz', 'tipo')
        .addSelect('COUNT(*)', 'quantidade')
        .groupBy('matriz.tipo_matriz')
        .getRawMany(),
    ]);

    return {
      total,
      ativas,
      inativas,
      porTipo: porTipo.reduce(
        (acc, item) => {
          acc[item.tipo] = parseInt(item.quantidade);
          return acc;
        },
        {} as Record<string, number>,
      ),
    };
  }
}
