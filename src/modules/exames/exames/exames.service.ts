import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Exame } from './entities/exame.entity';
import { CreateExameDto } from './dto/create-exame.dto';
import { UpdateExameDto } from './dto/update-exame.dto';
import { ExameUnidade } from './entities/exame-unidade.entity';
import { PaginatedResultDto } from '../../infraestrutura/common/dto/pagination.dto';

@Injectable()
export class ExamesService {
  constructor(
    @InjectRepository(Exame)
    private readonly exameRepository: Repository<Exame>,
    @InjectRepository(ExameUnidade)
    private readonly exameUnidadeRepository: Repository<ExameUnidade>,
  ) {}

  async create(createExameDto: CreateExameDto): Promise<Exame> {
    // Verifica se já existe um exame com o mesmo código interno
    const existingExame = await this.exameRepository.findOne({
      where: { codigo_interno: createExameDto.codigo_interno },
    });

    if (existingExame) {
      throw new ConflictException(
        `Exame com código ${createExameDto.codigo_interno} já existe`,
      );
    }

    // Separa unidades do resto do DTO
    const { unidades, tuss_id, ...exameData } = createExameDto;

    // Mapeia tuss_id do DTO para tussId da entidade
    const exame = this.exameRepository.create({
      ...exameData,
      tussId: tuss_id,
    });
    const savedExame = await this.exameRepository.save(exame);

    // Se foram passadas unidades, cria os vínculos
    if (unidades && unidades.length > 0) {
      for (const unidadeDto of unidades) {
        const exameUnidade = this.exameUnidadeRepository.create({
          exame_id: savedExame.id,
          unidade_id: unidadeDto.unidade_id,
          destino: unidadeDto.destino || 'interno',
          laboratorio_apoio_id: unidadeDto.laboratorio_apoio_id,
          telemedicina_id: unidadeDto.telemedicina_id,
        });
        await this.exameUnidadeRepository.save(exameUnidade);
      }
    }

    // Retorna com as relações carregadas
    return this.findOne(savedExame.id);
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    search?: string,
    status?: string,
    tipoExameId?: string,
    especialidadeId?: string,
  ): Promise<PaginatedResultDto<Exame>> {
    const where: any = {};

    if (search) {
      where.nome = Like(`%${search}%`);
    }

    if (status) {
      where.status = status;
    }

    if (tipoExameId) {
      where.tipo_exame_id = tipoExameId;
    }

    if (especialidadeId) {
      where.especialidade_id = especialidadeId;
    }

    const [data, total] = await this.exameRepository.findAndCount({
      where,
      relations: [
        'tipoExameAlternativa',
        'subgrupoAlternativa',
        'setorAlternativa',
        'tuss',
        'unidades',
        'unidades.unidadeSaude',
        'unidades.laboratorioApoio',
        'unidades.telemedicina',
      ],
      skip: (page - 1) * limit,
      take: limit,
      order: { nome: 'ASC' },
    });

    return new PaginatedResultDto(data, total, page, limit);
  }

  async findOne(id: string): Promise<Exame> {
    const exame = await this.exameRepository.findOne({
      where: { id },
      relations: [
        'tipoExameAlternativa',
        'subgrupoAlternativa',
        'setorAlternativa',
        'tuss',
        'unidades',
        'unidades.unidadeSaude',
        'unidades.laboratorioApoio',
        'unidades.telemedicina',
      ],
    });

    if (!exame) {
      throw new NotFoundException(`Exame com ID ${id} não encontrado`);
    }

    return exame;
  }

  async findByCodigo(codigo: string): Promise<Exame> {
    const exame = await this.exameRepository.findOne({
      where: { codigo_interno: codigo },
      relations: [
        'tipoExameAlternativa',
        'subgrupoAlternativa',
        'setorAlternativa',
        'tuss',
        'unidades',
        'unidades.unidadeSaude',
      ],
    });

    if (!exame) {
      throw new NotFoundException(`Exame com código ${codigo} não encontrado`);
    }

    return exame;
  }

  async update(id: string, updateExameDto: UpdateExameDto): Promise<Exame> {
    const exame = await this.findOne(id);

    // Se está alterando o código, verifica se não existe outro com o mesmo código
    if (
      updateExameDto.codigo_interno &&
      updateExameDto.codigo_interno !== exame.codigo_interno
    ) {
      const existingExame = await this.exameRepository.findOne({
        where: { codigo_interno: updateExameDto.codigo_interno },
      });

      if (existingExame) {
        throw new ConflictException(
          `Exame com código ${updateExameDto.codigo_interno} já existe`,
        );
      }
    }

    Object.assign(exame, updateExameDto);
    return await this.exameRepository.save(exame);
  }

  async remove(id: string): Promise<void> {
    const exame = await this.findOne(id);

    // Verifica se o exame está sendo usado em alguma ordem de serviço
    // TODO: Implementar verificação quando OrdemServicoExame estiver pronto

    // Por enquanto, apenas desativa o exame ao invés de deletar
    exame.status = 'inativo';
    await this.exameRepository.save(exame);
  }

  async findByTipo(tipoExameId: string): Promise<Exame[]> {
    return await this.exameRepository.find({
      where: { tipo_exame_id: tipoExameId, status: 'ativo' },
      relations: [
        'tipoExameAlternativa',
        'subgrupoAlternativa',
        'setorAlternativa',
      ],
      order: { nome: 'ASC' },
    });
  }

  async findByLaboratorioApoio(laboratorioId: string): Promise<Exame[]> {
    // Busca exames que têm vínculo com o laboratório de apoio via exames_unidades
    const exameUnidades = await this.exameUnidadeRepository.find({
      where: { laboratorio_apoio_id: laboratorioId, ativo: true },
      relations: ['exame'],
    });

    const exameIds = [...new Set(exameUnidades.map((eu) => eu.exame_id))];
    if (exameIds.length === 0) return [];

    return await this.exameRepository
      .createQueryBuilder('exame')
      .where('exame.id IN (:...ids)', { ids: exameIds })
      .andWhere('exame.status = :status', { status: 'ativo' })
      .orderBy('exame.nome', 'ASC')
      .getMany();
  }

  async searchByName(nome: string): Promise<Exame[]> {
    return await this.exameRepository.find({
      where: [
        { nome: Like(`%${nome}%`), status: 'ativo' },
        { sinonimos: Like(`%${nome}%`), status: 'ativo' },
      ],
      relations: ['tipoExameAlternativa'],
      take: 20,
      order: { nome: 'ASC' },
    });
  }

  async findByCodigos(
    codigoTuss?: string,
    codigoAmb?: string,
    codigoSus?: string,
  ): Promise<Exame[]> {
    const where: any = { status: 'ativo' };

    if (codigoTuss) {
      where.codigo_tuss = codigoTuss;
    }
    if (codigoAmb) {
      where.codigo_amb = codigoAmb;
    }
    if (codigoSus) {
      where.codigo_sus = codigoSus;
    }

    return await this.exameRepository.find({
      where,
      relations: ['tipoExameAlternativa'],
    });
  }

  async bulkUpdateStatus(ids: string[], status: string): Promise<void> {
    if (!['ativo', 'inativo', 'suspenso'].includes(status)) {
      throw new BadRequestException('Status inválido');
    }

    await this.exameRepository.update(ids, { status });
  }

  async getExamesComPreparo(): Promise<Exame[]> {
    return await this.exameRepository.find({
      where: { necessita_preparo: 'sim', status: 'ativo' },
      relations: ['tipoExameAlternativa'],
      order: { nome: 'ASC' },
    });
  }

  async getExamesUrgentes(): Promise<Exame[]> {
    return await this.exameRepository.find({
      where: { status: 'ativo' },
      relations: ['tipoExameAlternativa'],
      order: { peso: 'DESC', nome: 'ASC' },
      take: 50,
    });
  }
}
