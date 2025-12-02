import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExameLaboratorioApoio } from './entities/exame-laboratorio-apoio.entity';
import { CreateExameLaboratorioApoioDto } from './dto/create-exame-laboratorio-apoio.dto';
import { UpdateExameLaboratorioApoioDto } from './dto/update-exame-laboratorio-apoio.dto';
import { PaginatedResultDto } from '../../infraestrutura/common/dto/pagination.dto';

@Injectable()
export class ExameLaboratorioApoioService {
  constructor(
    @InjectRepository(ExameLaboratorioApoio)
    private readonly repository: Repository<ExameLaboratorioApoio>,
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
      requer_peso: dto.requer_peso ?? false,
      requer_altura: dto.requer_altura ?? false,
      requer_volume: dto.requer_volume ?? false,
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
      formato_laudo_id: dto.formato_laudo_id,
      ativo: dto.ativo ?? true,
    });

    return this.repository.save(entity);
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
        'formatoLaudoAlternativa',
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
    if (dto.requer_peso !== undefined) entity.requer_peso = dto.requer_peso;
    if (dto.requer_altura !== undefined)
      entity.requer_altura = dto.requer_altura;
    if (dto.requer_volume !== undefined)
      entity.requer_volume = dto.requer_volume;
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
    if (dto.formato_laudo_id !== undefined)
      entity.formato_laudo_id = dto.formato_laudo_id;
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
}
