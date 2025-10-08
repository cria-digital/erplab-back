import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCampoFormularioDto } from './dto/create-campo-formulario.dto';
import { UpdateCampoFormularioDto } from './dto/update-campo-formulario.dto';
import {
  CampoFormulario,
  TipoCampo,
  StatusCampo,
} from './entities/campo-formulario.entity';

@Injectable()
export class CampoFormularioService {
  constructor(
    @InjectRepository(CampoFormulario)
    private campoRepository: Repository<CampoFormulario>,
  ) {}

  async create(
    createCampoDto: CreateCampoFormularioDto,
  ): Promise<CampoFormulario> {
    const existingByCode = await this.campoRepository.findOne({
      where: {
        codigoCampo: createCampoDto.codigoCampo,
        formularioId: createCampoDto.formularioId,
      },
    });

    if (existingByCode) {
      throw new BadRequestException(
        `Já existe um campo com o código ${createCampoDto.codigoCampo} neste formulário`,
      );
    }

    if (!createCampoDto.ordem) {
      const ultimoCampo = await this.campoRepository.findOne({
        where: { formularioId: createCampoDto.formularioId },
        order: { ordem: 'DESC' },
      });
      createCampoDto.ordem = ultimoCampo ? ultimoCampo.ordem + 1 : 1;
    }

    const campo = this.campoRepository.create(createCampoDto);
    return await this.campoRepository.save(campo);
  }

  async findByFormulario(formularioId: string): Promise<CampoFormulario[]> {
    return await this.campoRepository.find({
      where: { formularioId },
      relations: ['alternativas'],
      order: { ordem: 'ASC' },
    });
  }

  async findAtivos(formularioId: string): Promise<CampoFormulario[]> {
    return await this.campoRepository.find({
      where: { formularioId, ativo: true },
      relations: ['alternativas'],
      order: { ordem: 'ASC' },
    });
  }

  async findByTipo(
    formularioId: string,
    tipo: TipoCampo,
  ): Promise<CampoFormulario[]> {
    return await this.campoRepository.find({
      where: { formularioId, tipoCampo: tipo },
      relations: ['alternativas'],
      order: { ordem: 'ASC' },
    });
  }

  async findObrigatorios(formularioId: string): Promise<CampoFormulario[]> {
    return await this.campoRepository.find({
      where: { formularioId, obrigatorio: true },
      relations: ['alternativas'],
      order: { ordem: 'ASC' },
    });
  }

  async findByCodigo(
    formularioId: string,
    codigo: string,
  ): Promise<CampoFormulario> {
    const campo = await this.campoRepository.findOne({
      where: { formularioId, codigoCampo: codigo },
      relations: ['alternativas'],
    });

    if (!campo) {
      throw new NotFoundException(
        `Campo com código ${codigo} não encontrado no formulário ${formularioId}`,
      );
    }

    return campo;
  }

  async search(
    formularioId: string,
    termo: string,
  ): Promise<CampoFormulario[]> {
    return await this.campoRepository
      .createQueryBuilder('campo')
      .leftJoinAndSelect('campo.alternativas', 'alternativas')
      .where('campo.formulario_id = :formularioId', { formularioId })
      .andWhere(
        '(campo.nome_campo ILIKE :termo OR campo.descricao ILIKE :termo OR campo.codigo_campo ILIKE :termo)',
        { termo: `%${termo}%` },
      )
      .orderBy('campo.ordem', 'ASC')
      .getMany();
  }

  async findOne(id: string): Promise<CampoFormulario> {
    const campo = await this.campoRepository.findOne({
      where: { id },
      relations: ['alternativas', 'formulario'],
    });

    if (!campo) {
      throw new NotFoundException(`Campo com ID ${id} não encontrado`);
    }

    return campo;
  }

  async update(
    id: string,
    updateCampoDto: UpdateCampoFormularioDto,
  ): Promise<CampoFormulario> {
    const campo = await this.findOne(id);

    if (
      updateCampoDto.codigoCampo &&
      updateCampoDto.codigoCampo !== campo.codigoCampo
    ) {
      const existingByCode = await this.campoRepository.findOne({
        where: {
          codigoCampo: updateCampoDto.codigoCampo,
          formularioId: campo.formularioId,
        },
      });

      if (existingByCode) {
        throw new BadRequestException(
          `Já existe um campo com o código ${updateCampoDto.codigoCampo} neste formulário`,
        );
      }
    }

    Object.assign(campo, updateCampoDto);
    return await this.campoRepository.save(campo);
  }

  async reordenar(
    formularioId: string,
    ordens: { id: string; ordem: number }[],
  ): Promise<void> {
    const campos = await this.findByFormulario(formularioId);

    for (const { id, ordem } of ordens) {
      const campo = campos.find((c) => c.id === id);
      if (campo) {
        campo.ordem = ordem;
        await this.campoRepository.save(campo);
      }
    }
  }

  async duplicar(
    id: string,
    novoCodigoCampo?: string,
  ): Promise<CampoFormulario> {
    const campoOriginal = await this.findOne(id);

    const codigo = novoCodigoCampo || `${campoOriginal.codigoCampo}_COPY`;

    const existingByCode = await this.campoRepository.findOne({
      where: {
        codigoCampo: codigo,
        formularioId: campoOriginal.formularioId,
      },
    });

    if (existingByCode) {
      throw new BadRequestException(
        `Já existe um campo com o código ${codigo} neste formulário`,
      );
    }

    const ultimoCampo = await this.campoRepository.findOne({
      where: { formularioId: campoOriginal.formularioId },
      order: { ordem: 'DESC' },
    });

    const novoCampo = this.campoRepository.create({
      ...campoOriginal,
      id: undefined,
      codigoCampo: codigo,
      nomeCampo: `${campoOriginal.nomeCampo} (Cópia)`,
      ordem: ultimoCampo ? ultimoCampo.ordem + 1 : 1,
      createdAt: undefined,
      updatedAt: undefined,
    });

    return await this.campoRepository.save(novoCampo);
  }

  async toggleStatus(id: string): Promise<CampoFormulario> {
    const campo = await this.findOne(id);
    campo.ativo = !campo.ativo;
    return await this.campoRepository.save(campo);
  }

  async updateStatus(
    id: string,
    status: StatusCampo,
  ): Promise<CampoFormulario> {
    const campo = await this.findOne(id);
    campo.status = status;
    return await this.campoRepository.save(campo);
  }

  async remove(id: string): Promise<void> {
    const campo = await this.findOne(id);
    await this.campoRepository.remove(campo);
  }

  async getEstatisticas(formularioId: string) {
    const [total, ativos, inativos, obrigatorios, porTipo, porStatus] =
      await Promise.all([
        this.campoRepository.count({ where: { formularioId } }),
        this.campoRepository.count({ where: { formularioId, ativo: true } }),
        this.campoRepository.count({ where: { formularioId, ativo: false } }),
        this.campoRepository.count({
          where: { formularioId, obrigatorio: true },
        }),
        this.campoRepository
          .createQueryBuilder('campo')
          .select('campo.tipo_campo', 'tipo')
          .addSelect('COUNT(*)', 'total')
          .where('campo.formulario_id = :formularioId', { formularioId })
          .groupBy('campo.tipo_campo')
          .getRawMany(),
        this.campoRepository
          .createQueryBuilder('campo')
          .select('campo.status', 'status')
          .addSelect('COUNT(*)', 'total')
          .where('campo.formulario_id = :formularioId', { formularioId })
          .groupBy('campo.status')
          .getRawMany(),
      ]);

    return {
      total,
      ativos,
      inativos,
      obrigatorios,
      porTipo,
      porStatus,
    };
  }

  async validarCampo(
    id: string,
  ): Promise<{ valido: boolean; erros: string[] }> {
    const campo = await this.findOne(id);
    const erros: string[] = [];

    if (
      campo.tipoCampo === TipoCampo.SELECT &&
      (!campo.alternativas || campo.alternativas.length === 0)
    ) {
      erros.push('Campo de seleção deve ter pelo menos uma alternativa');
    }

    if (
      campo.tipoCampo === TipoCampo.RADIO &&
      (!campo.alternativas || campo.alternativas.length === 0)
    ) {
      erros.push('Campo de rádio deve ter pelo menos uma alternativa');
    }

    if (
      campo.tamanhoMinimo &&
      campo.tamanhoMaximo &&
      campo.tamanhoMinimo > campo.tamanhoMaximo
    ) {
      erros.push('Tamanho mínimo não pode ser maior que o tamanho máximo');
    }

    if (
      campo.valorMinimo &&
      campo.valorMaximo &&
      campo.valorMinimo > campo.valorMaximo
    ) {
      erros.push('Valor mínimo não pode ser maior que o valor máximo');
    }

    return {
      valido: erros.length === 0,
      erros,
    };
  }
}
