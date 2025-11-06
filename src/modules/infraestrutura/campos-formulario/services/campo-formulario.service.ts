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
   * Listar todos os campos
   */
  async findAll(): Promise<CampoFormulario[]> {
    return this.campoRepository.find({
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
   * Buscar campos com filtros
   */
  async search(
    searchDto: SearchCampoFormularioDto,
  ): Promise<CampoFormulario[]> {
    const query = this.campoRepository
      .createQueryBuilder('campo')
      .leftJoinAndSelect('campo.alternativas', 'alternativas')
      .orderBy('campo.nomeCampo', 'ASC')
      .addOrderBy('alternativas.ordem', 'ASC');

    // Filtro por termo (busca na descrição e no nome do campo)
    // Importante: nomeCampo é ENUM, precisa fazer cast para text antes de usar LOWER()
    // Usar aspas duplas para referenciar o nome da coluna no banco (nome_campo)
    if (searchDto.termo) {
      query.andWhere(
        'LOWER(campo.descricao) LIKE LOWER(:termo) OR LOWER("campo"."nome_campo"::text) LIKE LOWER(:termo)',
        { termo: `%${searchDto.termo}%` },
      );
    }

    // Filtro por nome específico do campo
    if (searchDto.nomeCampo) {
      query.andWhere('campo.nomeCampo = :nomeCampo', {
        nomeCampo: searchDto.nomeCampo,
      });
    }

    // Filtro por status ativo/inativo
    if (searchDto.ativo !== undefined) {
      query.andWhere('campo.ativo = :ativo', { ativo: searchDto.ativo });
    }

    return query.getMany();
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
