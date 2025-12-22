import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { ExameLaboratorioApoio } from './entities/exame-laboratorio-apoio.entity';
import { CreateExameLaboratorioApoioDto } from './dto/create-exame-laboratorio-apoio.dto';
import { UpdateExameLaboratorioApoioDto } from './dto/update-exame-laboratorio-apoio.dto';
import { BatchCreateExameLaboratorioApoioDto } from './dto/batch-create-exame-laboratorio-apoio.dto';
import {
  SyncExameLaboratoriosApoioDto,
  SyncExameLaboratorioApoioItemDto,
} from './dto/sync-exame-laboratorio-apoio.dto';
import { PaginatedResultDto } from '../../infraestrutura/common/dto/pagination.dto';

@Injectable()
export class ExameLaboratorioApoioService {
  constructor(
    @InjectRepository(ExameLaboratorioApoio)
    private readonly repository: Repository<ExameLaboratorioApoio>,
    private readonly dataSource: DataSource,
  ) {}

  async create(
    dto: CreateExameLaboratorioApoioDto,
  ): Promise<ExameLaboratorioApoio> {
    // Verificar se já existe vínculo entre exame e laboratório
    const existente = await this.repository.findOne({
      where: {
        exameId: dto.exame_id,
        laboratorioApoioId: dto.laboratorio_apoio_id,
      },
    });

    if (existente) {
      throw new ConflictException(
        'Já existe uma configuração para este exame e laboratório de apoio',
      );
    }

    const entity = this.repository.create({
      exameId: dto.exame_id,
      laboratorioApoioId: dto.laboratorio_apoio_id,
      codigo_exame_apoio: dto.codigo_exame_apoio,
      metodologia_id: dto.metodologia_id,
      unidade_medida_id: dto.unidade_medida_id,
      peso: dto.peso ?? false,
      altura: dto.altura ?? false,
      volume: dto.volume ?? false,
      amostra_id: dto.amostra_id,
      amostra_enviar_id: dto.amostra_enviar_id,
      tipo_recipiente_id: dto.tipo_recipiente_id,
      regioes_coleta_ids: dto.regioes_coleta_ids,
      volume_minimo_id: dto.volume_minimo_id,
      estabilidade_id: dto.estabilidade_id,
      formularios_atendimento: dto.formularios_atendimento,
      preparo_geral: dto.preparo_geral,
      preparo_feminino: dto.preparo_feminino,
      preparo_infantil: dto.preparo_infantil,
      coleta_geral: dto.coleta_geral,
      coleta_feminino: dto.coleta_feminino,
      coleta_infantil: dto.coleta_infantil,
      tecnica_coleta: dto.tecnica_coleta,
      lembrete_coletora: dto.lembrete_coletora,
      lembrete_recepcionista_agendamento:
        dto.lembrete_recepcionista_agendamento,
      lembrete_recepcionista_os: dto.lembrete_recepcionista_os,
      distribuicao: dto.distribuicao,
      prazo_entrega_dias: dto.prazo_entrega_dias,
      formatos_laudo: dto.formatos_laudo,
      ativo: dto.ativo ?? true,
    });

    return this.repository.save(entity);
  }

  async createBatch(
    dto: BatchCreateExameLaboratorioApoioDto,
  ): Promise<{ created: ExameLaboratorioApoio[]; errors: any[] }> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const created: ExameLaboratorioApoio[] = [];
    const errors: any[] = [];

    try {
      for (let i = 0; i < dto.items.length; i++) {
        const item = dto.items[i];
        try {
          // Verificar se já existe vínculo entre exame e laboratório
          const existente = await queryRunner.manager.findOne(
            ExameLaboratorioApoio,
            {
              where: {
                exameId: item.exame_id,
                laboratorioApoioId: item.laboratorio_apoio_id,
              },
            },
          );

          if (existente) {
            errors.push({
              index: i,
              exame_id: item.exame_id,
              laboratorio_apoio_id: item.laboratorio_apoio_id,
              error:
                'Já existe uma configuração para este exame e laboratório de apoio',
            });
            continue;
          }

          const entity = queryRunner.manager.create(ExameLaboratorioApoio, {
            exameId: item.exame_id,
            laboratorioApoioId: item.laboratorio_apoio_id,
            codigo_exame_apoio: item.codigo_exame_apoio,
            metodologia_id: item.metodologia_id,
            unidade_medida_id: item.unidade_medida_id,
            peso: item.peso ?? false,
            altura: item.altura ?? false,
            volume: item.volume ?? false,
            amostra_id: item.amostra_id,
            amostra_enviar_id: item.amostra_enviar_id,
            tipo_recipiente_id: item.tipo_recipiente_id,
            regioes_coleta_ids: item.regioes_coleta_ids,
            volume_minimo_id: item.volume_minimo_id,
            estabilidade_id: item.estabilidade_id,
            formularios_atendimento: item.formularios_atendimento,
            preparo_geral: item.preparo_geral,
            preparo_feminino: item.preparo_feminino,
            preparo_infantil: item.preparo_infantil,
            coleta_geral: item.coleta_geral,
            coleta_feminino: item.coleta_feminino,
            coleta_infantil: item.coleta_infantil,
            tecnica_coleta: item.tecnica_coleta,
            lembrete_coletora: item.lembrete_coletora,
            lembrete_recepcionista_agendamento:
              item.lembrete_recepcionista_agendamento,
            lembrete_recepcionista_os: item.lembrete_recepcionista_os,
            distribuicao: item.distribuicao,
            prazo_entrega_dias: item.prazo_entrega_dias,
            formatos_laudo: item.formatos_laudo,
            ativo: item.ativo ?? true,
          });

          const saved = await queryRunner.manager.save(entity);
          created.push(saved);
        } catch (error) {
          errors.push({
            index: i,
            exame_id: item.exame_id,
            laboratorio_apoio_id: item.laboratorio_apoio_id,
            error: error.message,
          });
        }
      }

      await queryRunner.commitTransaction();
      return { created, errors };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(
    page = 1,
    limit = 10,
    exameId?: string,
  ): Promise<PaginatedResultDto<ExameLaboratorioApoio>> {
    const queryBuilder = this.repository
      .createQueryBuilder('ela')
      .leftJoinAndSelect('ela.laboratorioApoio', 'laboratorioApoio')
      .leftJoinAndSelect('ela.metodologiaAlternativa', 'metodologia')
      .leftJoinAndSelect('ela.unidadeMedidaAlternativa', 'unidadeMedida')
      .leftJoinAndSelect('ela.amostra', 'amostra')
      .orderBy('ela.criado_em', 'DESC');

    if (exameId) {
      queryBuilder.where('ela.exame_id = :exameId', { exameId });
    }

    const [data, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return new PaginatedResultDto(data, total, page, limit);
  }

  async findByExame(exameId: string): Promise<ExameLaboratorioApoio[]> {
    return this.repository.find({
      where: { exameId },
      relations: [
        'laboratorioApoio',
        'metodologiaAlternativa',
        'unidadeMedidaAlternativa',
        'amostra',
      ],
      order: { criado_em: 'DESC' },
    });
  }

  async findOne(id: string): Promise<ExameLaboratorioApoio> {
    const entity = await this.repository.findOne({
      where: { id },
      relations: [
        'exame',
        'laboratorioApoio',
        'metodologiaAlternativa',
        'unidadeMedidaAlternativa',
        'amostra',
        'amostraEnviarAlternativa',
        'tipoRecipienteAlternativa',
        'volumeMinimoAlternativa',
        'estabilidadeAlternativa',
      ],
    });

    if (!entity) {
      throw new NotFoundException(
        `Configuração de laboratório de apoio não encontrada`,
      );
    }

    return entity;
  }

  async update(
    id: string,
    dto: UpdateExameLaboratorioApoioDto,
  ): Promise<ExameLaboratorioApoio> {
    const entity = await this.findOne(id);

    // Se estiver tentando mudar o laboratório, verificar duplicidade
    if (
      dto.laboratorio_apoio_id &&
      dto.laboratorio_apoio_id !== entity.laboratorioApoioId
    ) {
      const existente = await this.repository.findOne({
        where: {
          exameId: entity.exameId,
          laboratorioApoioId: dto.laboratorio_apoio_id,
        },
      });

      if (existente && existente.id !== id) {
        throw new ConflictException(
          'Já existe uma configuração para este exame e laboratório de apoio',
        );
      }
    }

    // Atualizar campos
    if (dto.laboratorio_apoio_id)
      entity.laboratorioApoioId = dto.laboratorio_apoio_id;
    if (dto.codigo_exame_apoio !== undefined)
      entity.codigo_exame_apoio = dto.codigo_exame_apoio;
    if (dto.metodologia_id !== undefined)
      entity.metodologia_id = dto.metodologia_id;
    if (dto.unidade_medida_id !== undefined)
      entity.unidade_medida_id = dto.unidade_medida_id;
    if (dto.peso !== undefined) entity.peso = dto.peso;
    if (dto.altura !== undefined) entity.altura = dto.altura;
    if (dto.volume !== undefined) entity.volume = dto.volume;
    if (dto.amostra_id !== undefined) entity.amostra_id = dto.amostra_id;
    if (dto.amostra_enviar_id !== undefined)
      entity.amostra_enviar_id = dto.amostra_enviar_id;
    if (dto.tipo_recipiente_id !== undefined)
      entity.tipo_recipiente_id = dto.tipo_recipiente_id;
    if (dto.regioes_coleta_ids !== undefined)
      entity.regioes_coleta_ids = dto.regioes_coleta_ids;
    if (dto.volume_minimo_id !== undefined)
      entity.volume_minimo_id = dto.volume_minimo_id;
    if (dto.estabilidade_id !== undefined)
      entity.estabilidade_id = dto.estabilidade_id;
    if (dto.formularios_atendimento !== undefined)
      entity.formularios_atendimento = dto.formularios_atendimento;
    if (dto.preparo_geral !== undefined)
      entity.preparo_geral = dto.preparo_geral;
    if (dto.preparo_feminino !== undefined)
      entity.preparo_feminino = dto.preparo_feminino;
    if (dto.preparo_infantil !== undefined)
      entity.preparo_infantil = dto.preparo_infantil;
    if (dto.coleta_geral !== undefined) entity.coleta_geral = dto.coleta_geral;
    if (dto.coleta_feminino !== undefined)
      entity.coleta_feminino = dto.coleta_feminino;
    if (dto.coleta_infantil !== undefined)
      entity.coleta_infantil = dto.coleta_infantil;
    if (dto.tecnica_coleta !== undefined)
      entity.tecnica_coleta = dto.tecnica_coleta;
    if (dto.lembrete_coletora !== undefined)
      entity.lembrete_coletora = dto.lembrete_coletora;
    if (dto.lembrete_recepcionista_agendamento !== undefined)
      entity.lembrete_recepcionista_agendamento =
        dto.lembrete_recepcionista_agendamento;
    if (dto.lembrete_recepcionista_os !== undefined)
      entity.lembrete_recepcionista_os = dto.lembrete_recepcionista_os;
    if (dto.distribuicao !== undefined) entity.distribuicao = dto.distribuicao;
    if (dto.prazo_entrega_dias !== undefined)
      entity.prazo_entrega_dias = dto.prazo_entrega_dias;
    if (dto.formatos_laudo !== undefined)
      entity.formatos_laudo = dto.formatos_laudo;
    if (dto.ativo !== undefined) entity.ativo = dto.ativo;

    return this.repository.save(entity);
  }

  async remove(id: string): Promise<void> {
    const entity = await this.findOne(id);
    await this.repository.remove(entity);
  }

  async toggleAtivo(id: string): Promise<ExameLaboratorioApoio> {
    const entity = await this.findOne(id);
    entity.ativo = !entity.ativo;
    return this.repository.save(entity);
  }

  async findByLaboratorio(
    laboratorioApoioId: string,
  ): Promise<ExameLaboratorioApoio[]> {
    return this.repository.find({
      where: { laboratorioApoioId, ativo: true },
      relations: ['exame'],
      order: { criado_em: 'DESC' },
    });
  }

  /**
   * Sincroniza fichas de laboratório de apoio de um exame
   *
   * Lógica:
   * - Tem id na lista? → UPDATE
   * - Não tem id na lista? → CREATE
   * - Existe no banco mas NÃO está na lista? → DELETE
   */
  async syncBatch(dto: SyncExameLaboratoriosApoioDto): Promise<{
    created: ExameLaboratorioApoio[];
    updated: ExameLaboratorioApoio[];
    deleted: string[];
    errors: any[];
  }> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const created: ExameLaboratorioApoio[] = [];
    const updated: ExameLaboratorioApoio[] = [];
    const deleted: string[] = [];
    const errors: any[] = [];

    try {
      // 1. Buscar todas as fichas existentes deste exame
      const fichasExistentes = await queryRunner.manager.find(
        ExameLaboratorioApoio,
        { where: { exameId: dto.exame_id } },
      );

      // IDs que vieram na lista (para saber o que deletar)
      const idsNaLista = new Set(
        dto.items.filter((item) => item.id).map((item) => item.id),
      );

      // 2. Deletar fichas que existem no banco mas NÃO vieram na lista
      for (const fichaExistente of fichasExistentes) {
        if (!idsNaLista.has(fichaExistente.id)) {
          try {
            await queryRunner.manager.remove(fichaExistente);
            deleted.push(fichaExistente.id);
          } catch (error) {
            errors.push({
              id: fichaExistente.id,
              operation: 'delete',
              error: error.message,
            });
          }
        }
      }

      // 3. Processar creates e updates
      for (let i = 0; i < dto.items.length; i++) {
        const item = dto.items[i];
        try {
          if (item.id) {
            // UPDATE
            const result = await this.syncItem(
              queryRunner,
              dto.exame_id,
              item,
              'update',
            );
            if (result) updated.push(result);
          } else {
            // CREATE
            const result = await this.syncItem(
              queryRunner,
              dto.exame_id,
              item,
              'create',
            );
            if (result) created.push(result);
          }
        } catch (error) {
          errors.push({
            index: i,
            id: item.id,
            laboratorio_apoio_id: item.laboratorio_apoio_id,
            operation: item.id ? 'update' : 'create',
            error: error.message,
          });
        }
      }

      await queryRunner.commitTransaction();
      return { created, updated, deleted, errors };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Helper para criar ou atualizar um item
   */
  private async syncItem(
    queryRunner: any,
    exameId: string,
    item: SyncExameLaboratorioApoioItemDto,
    operation: 'create' | 'update',
  ): Promise<ExameLaboratorioApoio> {
    if (operation === 'update' && item.id) {
      // Busca a entidade existente
      const entity = await queryRunner.manager.findOne(ExameLaboratorioApoio, {
        where: { id: item.id },
      });

      if (!entity) {
        throw new NotFoundException(`Ficha com ID ${item.id} não encontrada`);
      }

      // Se estiver mudando o laboratório, verifica duplicidade
      if (
        item.laboratorio_apoio_id &&
        item.laboratorio_apoio_id !== entity.laboratorioApoioId
      ) {
        const existente = await queryRunner.manager.findOne(
          ExameLaboratorioApoio,
          {
            where: {
              exameId: exameId,
              laboratorioApoioId: item.laboratorio_apoio_id,
            },
          },
        );
        if (existente && existente.id !== item.id) {
          throw new ConflictException(
            'Já existe configuração para este exame e laboratório',
          );
        }
      }

      // Atualiza os campos
      if (item.laboratorio_apoio_id)
        entity.laboratorioApoioId = item.laboratorio_apoio_id;
      this.mapSyncItemToEntity(entity, item);
      return queryRunner.manager.save(entity);
    } else {
      // CREATE - verifica duplicidade
      const existente = await queryRunner.manager.findOne(
        ExameLaboratorioApoio,
        {
          where: {
            exameId: exameId,
            laboratorioApoioId: item.laboratorio_apoio_id,
          },
        },
      );

      if (existente) {
        throw new ConflictException(
          'Já existe configuração para este exame e laboratório',
        );
      }

      const entity = queryRunner.manager.create(ExameLaboratorioApoio, {
        exameId: exameId,
        laboratorioApoioId: item.laboratorio_apoio_id,
        ativo: true,
      });
      this.mapSyncItemToEntity(entity, item);
      return queryRunner.manager.save(entity);
    }
  }

  /**
   * Mapeia os campos do DTO para a entidade
   */
  private mapSyncItemToEntity(
    entity: ExameLaboratorioApoio,
    item: SyncExameLaboratorioApoioItemDto,
  ): void {
    if (item.codigo_exame_apoio !== undefined)
      entity.codigo_exame_apoio = item.codigo_exame_apoio;
    if (item.metodologia_id !== undefined)
      entity.metodologia_id = item.metodologia_id;
    if (item.unidade_medida_id !== undefined)
      entity.unidade_medida_id = item.unidade_medida_id;
    if (item.peso !== undefined) entity.peso = item.peso;
    if (item.altura !== undefined) entity.altura = item.altura;
    if (item.volume !== undefined) entity.volume = item.volume;
    if (item.amostra_id !== undefined) entity.amostra_id = item.amostra_id;
    if (item.amostra_enviar_id !== undefined)
      entity.amostra_enviar_id = item.amostra_enviar_id;
    if (item.tipo_recipiente_id !== undefined)
      entity.tipo_recipiente_id = item.tipo_recipiente_id;
    if (item.regioes_coleta_ids !== undefined)
      entity.regioes_coleta_ids = item.regioes_coleta_ids;
    if (item.volume_minimo_id !== undefined)
      entity.volume_minimo_id = item.volume_minimo_id;
    if (item.estabilidade_id !== undefined)
      entity.estabilidade_id = item.estabilidade_id;
    if (item.formularios_atendimento !== undefined)
      entity.formularios_atendimento = item.formularios_atendimento;
    if (item.preparo_geral !== undefined)
      entity.preparo_geral = item.preparo_geral;
    if (item.preparo_feminino !== undefined)
      entity.preparo_feminino = item.preparo_feminino;
    if (item.preparo_infantil !== undefined)
      entity.preparo_infantil = item.preparo_infantil;
    if (item.coleta_geral !== undefined)
      entity.coleta_geral = item.coleta_geral;
    if (item.coleta_feminino !== undefined)
      entity.coleta_feminino = item.coleta_feminino;
    if (item.coleta_infantil !== undefined)
      entity.coleta_infantil = item.coleta_infantil;
    if (item.tecnica_coleta !== undefined)
      entity.tecnica_coleta = item.tecnica_coleta;
    if (item.lembrete_coletora !== undefined)
      entity.lembrete_coletora = item.lembrete_coletora;
    if (item.lembrete_recepcionista_agendamento !== undefined)
      entity.lembrete_recepcionista_agendamento =
        item.lembrete_recepcionista_agendamento;
    if (item.lembrete_recepcionista_os !== undefined)
      entity.lembrete_recepcionista_os = item.lembrete_recepcionista_os;
    if (item.distribuicao !== undefined)
      entity.distribuicao = item.distribuicao;
    if (item.prazo_entrega_dias !== undefined)
      entity.prazo_entrega_dias = item.prazo_entrega_dias;
    if (item.formatos_laudo !== undefined)
      entity.formatos_laudo = item.formatos_laudo;
    if (item.ativo !== undefined) entity.ativo = item.ativo;
  }
}
