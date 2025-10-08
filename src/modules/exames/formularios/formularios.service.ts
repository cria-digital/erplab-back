import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFormularioDto } from './dto/create-formulario.dto';
import { UpdateFormularioDto } from './dto/update-formulario.dto';
import {
  Formulario,
  TipoFormulario,
  StatusFormulario,
} from './entities/formulario.entity';

@Injectable()
export class FormulariosService {
  constructor(
    @InjectRepository(Formulario)
    private formularioRepository: Repository<Formulario>,
  ) {}

  async create(createFormularioDto: CreateFormularioDto): Promise<Formulario> {
    const existingByCode = await this.formularioRepository.findOne({
      where: { codigoFormulario: createFormularioDto.codigoFormulario },
    });

    if (existingByCode) {
      throw new BadRequestException(
        `Já existe um formulário com o código ${createFormularioDto.codigoFormulario}`,
      );
    }

    if (!createFormularioDto.versao) {
      createFormularioDto.versao = 1;
    }

    if (!createFormularioDto.status) {
      createFormularioDto.status = StatusFormulario.RASCUNHO;
    }

    const formulario = this.formularioRepository.create(createFormularioDto);
    return await this.formularioRepository.save(formulario);
  }

  async findAll(): Promise<Formulario[]> {
    return await this.formularioRepository.find({
      relations: ['campos', 'respostas'],
      order: { nomeFormulario: 'ASC' },
    });
  }

  async findAtivos(): Promise<Formulario[]> {
    return await this.formularioRepository.find({
      where: { ativo: true },
      relations: ['campos'],
      order: { nomeFormulario: 'ASC' },
    });
  }

  async findPublicados(): Promise<Formulario[]> {
    return await this.formularioRepository.find({
      where: { status: StatusFormulario.PUBLICADO, ativo: true },
      relations: ['campos'],
      order: { nomeFormulario: 'ASC' },
    });
  }

  async findByTipo(tipo: TipoFormulario): Promise<Formulario[]> {
    return await this.formularioRepository.find({
      where: { tipo },
      relations: ['campos'],
      order: { nomeFormulario: 'ASC' },
    });
  }

  async findByStatus(status: StatusFormulario): Promise<Formulario[]> {
    return await this.formularioRepository.find({
      where: { status },
      relations: ['campos'],
      order: { nomeFormulario: 'ASC' },
    });
  }

  async findByUnidadeSaude(unidadeSaudeId: string): Promise<Formulario[]> {
    return await this.formularioRepository.find({
      where: { unidadeSaudeId },
      relations: ['campos'],
      order: { nomeFormulario: 'ASC' },
    });
  }

  async findByCodigo(codigo: string): Promise<Formulario> {
    const formulario = await this.formularioRepository.findOne({
      where: { codigoFormulario: codigo },
      relations: ['campos', 'campos.alternativas'],
    });

    if (!formulario) {
      throw new NotFoundException(
        `Formulário com código ${codigo} não encontrado`,
      );
    }

    return formulario;
  }

  async search(termo: string): Promise<Formulario[]> {
    return await this.formularioRepository
      .createQueryBuilder('formulario')
      .leftJoinAndSelect('formulario.campos', 'campos')
      .where('formulario.nome_formulario ILIKE :termo', { termo: `%${termo}%` })
      .orWhere('formulario.descricao ILIKE :termo', { termo: `%${termo}%` })
      .orWhere('formulario.codigo_formulario ILIKE :termo', {
        termo: `%${termo}%`,
      })
      .orderBy('formulario.nome_formulario', 'ASC')
      .getMany();
  }

  async findOne(id: string): Promise<Formulario> {
    const formulario = await this.formularioRepository.findOne({
      where: { id },
      relations: ['campos', 'campos.alternativas', 'respostas'],
    });

    if (!formulario) {
      throw new NotFoundException(`Formulário com ID ${id} não encontrado`);
    }

    return formulario;
  }

  async update(
    id: string,
    updateFormularioDto: UpdateFormularioDto,
  ): Promise<Formulario> {
    const formulario = await this.findOne(id);

    if (
      updateFormularioDto.codigoFormulario &&
      updateFormularioDto.codigoFormulario !== formulario.codigoFormulario
    ) {
      const existingByCode = await this.formularioRepository.findOne({
        where: { codigoFormulario: updateFormularioDto.codigoFormulario },
      });

      if (existingByCode) {
        throw new BadRequestException(
          `Já existe um formulário com o código ${updateFormularioDto.codigoFormulario}`,
        );
      }
    }

    Object.assign(formulario, updateFormularioDto);
    return await this.formularioRepository.save(formulario);
  }

  async toggleStatus(id: string): Promise<Formulario> {
    const formulario = await this.findOne(id);
    formulario.ativo = !formulario.ativo;
    return await this.formularioRepository.save(formulario);
  }

  async updateStatus(
    id: string,
    status: StatusFormulario,
  ): Promise<Formulario> {
    const formulario = await this.findOne(id);
    formulario.status = status;
    return await this.formularioRepository.save(formulario);
  }

  async publicar(id: string): Promise<Formulario> {
    const formulario = await this.findOne(id);

    if (formulario.status === StatusFormulario.PUBLICADO) {
      throw new BadRequestException('Formulário já está publicado');
    }

    if (!formulario.campos || formulario.campos.length === 0) {
      throw new BadRequestException(
        'Não é possível publicar formulário sem campos',
      );
    }

    formulario.status = StatusFormulario.PUBLICADO;
    formulario.ativo = true;
    return await this.formularioRepository.save(formulario);
  }

  async criarVersao(id: string): Promise<Formulario> {
    const formularioOriginal = await this.findOne(id);

    const novaVersao = formularioOriginal.versao + 1;
    const novoCodigo = `${formularioOriginal.codigoFormulario}_V${novaVersao}`;

    const novoFormulario = this.formularioRepository.create({
      ...formularioOriginal,
      id: undefined,
      codigoFormulario: novoCodigo,
      versao: novaVersao,
      status: StatusFormulario.RASCUNHO,
      formularioPaiId: formularioOriginal.id,
      createdAt: undefined,
      updatedAt: undefined,
    });

    return await this.formularioRepository.save(novoFormulario);
  }

  async remove(id: string): Promise<void> {
    const formulario = await this.findOne(id);

    if (formulario.status === StatusFormulario.PUBLICADO) {
      throw new BadRequestException(
        'Não é possível excluir formulário publicado',
      );
    }

    // Verificar se há respostas vinculadas (implementação simplificada)
    // Em implementação real, seria feita consulta ao repositório de respostas

    await this.formularioRepository.remove(formulario);
  }

  async getEstatisticas() {
    const [
      total,
      ativos,
      inativos,
      publicados,
      porTipo,
      porStatus,
      comRespostas,
    ] = await Promise.all([
      this.formularioRepository.count(),
      this.formularioRepository.count({ where: { ativo: true } }),
      this.formularioRepository.count({ where: { ativo: false } }),
      this.formularioRepository.count({
        where: { status: StatusFormulario.PUBLICADO },
      }),
      this.formularioRepository
        .createQueryBuilder('formulario')
        .select('formulario.tipo', 'tipo')
        .addSelect('COUNT(*)', 'total')
        .groupBy('formulario.tipo')
        .getRawMany(),
      this.formularioRepository
        .createQueryBuilder('formulario')
        .select('formulario.status', 'status')
        .addSelect('COUNT(*)', 'total')
        .groupBy('formulario.status')
        .getRawMany(),
      this.formularioRepository
        .createQueryBuilder('formulario')
        .leftJoin('formulario.respostas', 'respostas')
        .where('respostas.id IS NOT NULL')
        .getCount(),
    ]);

    return {
      total,
      ativos,
      inativos,
      publicados,
      comRespostas,
      porTipo,
      porStatus,
    };
  }

  async validarFormulario(
    id: string,
  ): Promise<{ valido: boolean; erros: string[] }> {
    const formulario = await this.findOne(id);
    const erros: string[] = [];

    if (!formulario.campos || formulario.campos.length === 0) {
      erros.push('Formulário deve ter pelo menos um campo');
    }

    const camposObrigatorios = formulario.campos?.filter(
      (campo) => campo.obrigatorio,
    );
    if (camposObrigatorios && camposObrigatorios.length === 0) {
      erros.push('Formulário deve ter pelo menos um campo obrigatório');
    }

    const codigosCampos =
      formulario.campos?.map((campo) => campo.codigoCampo) || [];
    const codigosDuplicados = codigosCampos.filter(
      (codigo, index) => codigosCampos.indexOf(codigo) !== index,
    );

    if (codigosDuplicados.length > 0) {
      erros.push(
        `Códigos de campos duplicados: ${codigosDuplicados.join(', ')}`,
      );
    }

    return {
      valido: erros.length === 0,
      erros,
    };
  }
}
