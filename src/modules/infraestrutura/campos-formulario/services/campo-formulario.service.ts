import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CampoFormulario,
  NomeCampoFormulario,
} from '../entities/campo-formulario.entity';
import { CreateCampoFormularioDto } from '../dto/create-campo-formulario.dto';
import { UpdateCampoFormularioDto } from '../dto/update-campo-formulario.dto';
import { SearchCampoFormularioDto } from '../dto/search-campo-formulario.dto';
import { PaginatedResultDto } from '../../common/dto/pagination.dto';

@Injectable()
export class CampoFormularioService {
  constructor(
    @InjectRepository(CampoFormulario)
    private readonly campoRepository: Repository<CampoFormulario>,
  ) {}

  /**
   * Criar novo campo de formulário
   */
  async create(
    createDto: CreateCampoFormularioDto,
    usuarioId?: string,
  ): Promise<CampoFormulario> {
    // Verificar se campo já existe
    const existente = await this.campoRepository.findOne({
      where: { nomeCampo: createDto.nomeCampo },
    });

    if (existente) {
      throw new ConflictException(
        `Campo ${createDto.nomeCampo} já está cadastrado`,
      );
    }

    const campo = this.campoRepository.create({
      ...createDto,
      createdBy: usuarioId,
    });

    return this.campoRepository.save(campo);
  }

  /**
   * Listar todos os campos SEM alternativas
   */
  async findAll(): Promise<CampoFormulario[]> {
    // Buscar todos os campos com suas alternativas
    const campos = await this.campoRepository.find({
      relations: ['alternativas'],
      order: {
        nomeCampo: 'ASC',
      },
    });

    // Filtrar apenas os campos que NÃO têm alternativas
    return campos.filter(
      (campo) => !campo.alternativas || campo.alternativas.length === 0,
    );
  }

  /**
   * Listar apenas campos ativos
   */
  async findAtivos(): Promise<CampoFormulario[]> {
    return this.campoRepository.find({
      where: { ativo: true },
      relations: ['alternativas'],
      order: {
        nomeCampo: 'ASC',
        alternativas: {
          ordem: 'ASC',
        },
      },
    });
  }

  /**
   * Buscar campo por ID
   */
  async findOne(id: string): Promise<CampoFormulario> {
    const campo = await this.campoRepository.findOne({
      where: { id },
      relations: ['alternativas'],
    });

    if (!campo) {
      throw new NotFoundException(`Campo com ID ${id} não encontrado`);
    }

    return campo;
  }

  /**
   * Buscar campo por nome
   */
  async findByNome(nomeCampo: NomeCampoFormulario): Promise<CampoFormulario> {
    const campo = await this.campoRepository.findOne({
      where: { nomeCampo },
      relations: ['alternativas'],
    });

    if (!campo) {
      throw new NotFoundException(`Campo ${nomeCampo} não encontrado`);
    }

    return campo;
  }

  /**
   * Buscar campos com filtros e paginação
   * IMPORTANTE: Retorna apenas campos que TÊM alternativas
   */
  async search(
    searchDto: SearchCampoFormularioDto,
  ): Promise<PaginatedResultDto<CampoFormulario>> {
    const { page = 1, limit = 10, termo, nomeCampo, ativo } = searchDto;

    // Query base para contar total
    const queryCount = this.campoRepository
      .createQueryBuilder('campo')
      .select('campo.id')
      .innerJoin('campo.alternativas', 'alt')
      .groupBy('campo.id');

    // Filtros
    if (termo) {
      queryCount.andWhere(
        'LOWER(campo.descricao) LIKE LOWER(:termo) OR LOWER("campo"."nome_campo"::text) LIKE LOWER(:termo)',
        { termo: `%${termo}%` },
      );
    }

    if (nomeCampo) {
      queryCount.andWhere('campo.nomeCampo = :nomeCampo', { nomeCampo });
    }

    if (ativo !== undefined) {
      queryCount.andWhere('campo.ativo = :ativo', { ativo });
    }

    // Contar total
    const total = await queryCount.getCount();

    // Query com LIMIT e OFFSET usando subquery (workaround para GROUP BY)
    // Primeiro, criar a subquery que retorna os IDs com paginação
    const subquery = this.campoRepository
      .createQueryBuilder('campo')
      .select('campo.id', 'id')
      .innerJoin('campo.alternativas', 'alt')
      .groupBy('campo.id')
      .orderBy('campo.nomeCampo', 'ASC')
      .limit(limit)
      .offset((page - 1) * limit);

    // Aplicar mesmos filtros na subquery
    if (termo) {
      subquery.andWhere(
        'LOWER(campo.descricao) LIKE LOWER(:termo) OR LOWER("campo"."nome_campo"::text) LIKE LOWER(:termo)',
        { termo: `%${termo}%` },
      );
    }

    if (nomeCampo) {
      subquery.andWhere('campo.nomeCampo = :nomeCampo', { nomeCampo });
    }

    if (ativo !== undefined) {
      subquery.andWhere('campo.ativo = :ativo', { ativo });
    }

    // Executar subquery para pegar IDs
    const idsResult = await subquery.getRawMany();
    const ids = idsResult.map((row) => row.id);

    // Se não houver resultados, retornar vazio
    if (ids.length === 0) {
      return new PaginatedResultDto([], total, page, limit);
    }

    // Query final: buscar campos completos com alternativas
    const data = await this.campoRepository
      .createQueryBuilder('campo')
      .leftJoinAndSelect('campo.alternativas', 'alternativas')
      .where('campo.id IN (:...ids)', { ids })
      .orderBy('campo.nomeCampo', 'ASC')
      .addOrderBy('alternativas.ordem', 'ASC')
      .getMany();

    return new PaginatedResultDto(data, total, page, limit);
  }

  /**
   * Atualizar campo
   */
  async update(
    id: string,
    updateDto: UpdateCampoFormularioDto,
    usuarioId?: string,
  ): Promise<CampoFormulario> {
    const campo = await this.findOne(id);

    // Se está tentando mudar o nome, verificar conflito
    if (updateDto.nomeCampo && updateDto.nomeCampo !== campo.nomeCampo) {
      const existente = await this.campoRepository.findOne({
        where: { nomeCampo: updateDto.nomeCampo },
      });

      if (existente) {
        throw new ConflictException(`Campo ${updateDto.nomeCampo} já existe`);
      }
    }

    Object.assign(campo, {
      ...updateDto,
      updatedBy: usuarioId,
    });

    return this.campoRepository.save(campo);
  }

  /**
   * Alternar status ativo/inativo
   */
  async toggleStatus(id: string, usuarioId?: string): Promise<CampoFormulario> {
    const campo = await this.findOne(id);
    campo.ativo = !campo.ativo;
    campo.updatedBy = usuarioId;
    return this.campoRepository.save(campo);
  }

  /**
   * Remover campo (soft delete)
   */
  async remove(id: string): Promise<void> {
    const campo = await this.findOne(id);
    campo.ativo = false;
    await this.campoRepository.save(campo);
  }
}
