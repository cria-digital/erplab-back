import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAlternativaCampoDto } from './dto/create-alternativa-campo.dto';
import { UpdateAlternativaCampoDto } from './dto/update-alternativa-campo.dto';
import {
  AlternativaCampo,
  StatusAlternativa,
} from './entities/alternativa-campo.entity';

@Injectable()
export class AlternativaCampoService {
  constructor(
    @InjectRepository(AlternativaCampo)
    private alternativaRepository: Repository<AlternativaCampo>,
  ) {}

  async create(
    createAlternativaDto: CreateAlternativaCampoDto,
  ): Promise<AlternativaCampo> {
    const existingByCode = await this.alternativaRepository.findOne({
      where: {
        codigoAlternativa: createAlternativaDto.codigoAlternativa,
        campoFormularioId: createAlternativaDto.campoFormularioId,
      },
    });

    if (existingByCode) {
      throw new BadRequestException(
        `Já existe uma alternativa com o código ${createAlternativaDto.codigoAlternativa} neste campo`,
      );
    }

    const existingByValue = await this.alternativaRepository.findOne({
      where: {
        valor: createAlternativaDto.valor,
        campoFormularioId: createAlternativaDto.campoFormularioId,
      },
    });

    if (existingByValue) {
      throw new BadRequestException(
        `Já existe uma alternativa com o valor ${createAlternativaDto.valor} neste campo`,
      );
    }

    if (!createAlternativaDto.ordem) {
      const ultimaAlternativa = await this.alternativaRepository.findOne({
        where: { campoFormularioId: createAlternativaDto.campoFormularioId },
        order: { ordem: 'DESC' },
      });
      createAlternativaDto.ordem = ultimaAlternativa
        ? ultimaAlternativa.ordem + 1
        : 1;
    }

    const alternativa = this.alternativaRepository.create(createAlternativaDto);
    return await this.alternativaRepository.save(alternativa);
  }

  async findByCampo(campoFormularioId: string): Promise<AlternativaCampo[]> {
    return await this.alternativaRepository.find({
      where: { campoFormularioId },
      order: { ordem: 'ASC' },
    });
  }

  async findAtivas(campoFormularioId: string): Promise<AlternativaCampo[]> {
    return await this.alternativaRepository.find({
      where: { campoFormularioId, ativo: true },
      order: { ordem: 'ASC' },
    });
  }

  async findPadrao(campoFormularioId: string): Promise<AlternativaCampo[]> {
    return await this.alternativaRepository.find({
      where: { campoFormularioId, selecionadoPadrao: true },
      order: { ordem: 'ASC' },
    });
  }

  async findByValor(
    campoFormularioId: string,
    valor: string,
  ): Promise<AlternativaCampo> {
    const alternativa = await this.alternativaRepository.findOne({
      where: { campoFormularioId, valor },
    });

    if (!alternativa) {
      throw new NotFoundException(
        `Alternativa com valor ${valor} não encontrada no campo ${campoFormularioId}`,
      );
    }

    return alternativa;
  }

  async findByCodigo(
    campoFormularioId: string,
    codigo: string,
  ): Promise<AlternativaCampo> {
    const alternativa = await this.alternativaRepository.findOne({
      where: { campoFormularioId, codigoAlternativa: codigo },
    });

    if (!alternativa) {
      throw new NotFoundException(
        `Alternativa com código ${codigo} não encontrada no campo ${campoFormularioId}`,
      );
    }

    return alternativa;
  }

  async search(
    campoFormularioId: string,
    termo: string,
  ): Promise<AlternativaCampo[]> {
    return await this.alternativaRepository
      .createQueryBuilder('alternativa')
      .where('alternativa.campo_formulario_id = :campoFormularioId', {
        campoFormularioId,
      })
      .andWhere(
        '(alternativa.rotulo ILIKE :termo OR alternativa.valor ILIKE :termo OR alternativa.codigo_alternativa ILIKE :termo)',
        { termo: `%${termo}%` },
      )
      .orderBy('alternativa.ordem', 'ASC')
      .getMany();
  }

  async findOne(id: string): Promise<AlternativaCampo> {
    const alternativa = await this.alternativaRepository.findOne({
      where: { id },
      relations: ['campoFormulario'],
    });

    if (!alternativa) {
      throw new NotFoundException(`Alternativa com ID ${id} não encontrada`);
    }

    return alternativa;
  }

  async update(
    id: string,
    updateAlternativaDto: UpdateAlternativaCampoDto,
  ): Promise<AlternativaCampo> {
    const alternativa = await this.findOne(id);

    if (
      updateAlternativaDto.codigoAlternativa &&
      updateAlternativaDto.codigoAlternativa !== alternativa.codigoAlternativa
    ) {
      const existingByCode = await this.alternativaRepository.findOne({
        where: {
          codigoAlternativa: updateAlternativaDto.codigoAlternativa,
          campoFormularioId: alternativa.campoFormularioId,
        },
      });

      if (existingByCode) {
        throw new BadRequestException(
          `Já existe uma alternativa com o código ${updateAlternativaDto.codigoAlternativa} neste campo`,
        );
      }
    }

    if (
      updateAlternativaDto.valor &&
      updateAlternativaDto.valor !== alternativa.valor
    ) {
      const existingByValue = await this.alternativaRepository.findOne({
        where: {
          valor: updateAlternativaDto.valor,
          campoFormularioId: alternativa.campoFormularioId,
        },
      });

      if (existingByValue) {
        throw new BadRequestException(
          `Já existe uma alternativa com o valor ${updateAlternativaDto.valor} neste campo`,
        );
      }
    }

    Object.assign(alternativa, updateAlternativaDto);
    return await this.alternativaRepository.save(alternativa);
  }

  async reordenar(
    campoFormularioId: string,
    ordens: { id: string; ordem: number }[],
  ): Promise<void> {
    const alternativas = await this.findByCampo(campoFormularioId);

    for (const { id, ordem } of ordens) {
      const alternativa = alternativas.find((a) => a.id === id);
      if (alternativa) {
        alternativa.ordem = ordem;
        await this.alternativaRepository.save(alternativa);
      }
    }
  }

  async duplicar(id: string, novoCodigo?: string): Promise<AlternativaCampo> {
    const alternativaOriginal = await this.findOne(id);

    const codigo =
      novoCodigo || `${alternativaOriginal.codigoAlternativa}_COPY`;

    const existingByCode = await this.alternativaRepository.findOne({
      where: {
        codigoAlternativa: codigo,
        campoFormularioId: alternativaOriginal.campoFormularioId,
      },
    });

    if (existingByCode) {
      throw new BadRequestException(
        `Já existe uma alternativa com o código ${codigo} neste campo`,
      );
    }

    const ultimaAlternativa = await this.alternativaRepository.findOne({
      where: { campoFormularioId: alternativaOriginal.campoFormularioId },
      order: { ordem: 'DESC' },
    });

    const novaAlternativa = this.alternativaRepository.create({
      ...alternativaOriginal,
      id: undefined,
      codigoAlternativa: codigo,
      textoAlternativa: `${alternativaOriginal.textoAlternativa} (Cópia)`,
      valor: `${alternativaOriginal.valor}_COPY`,
      ordem: ultimaAlternativa ? ultimaAlternativa.ordem + 1 : 1,
      selecionadoPadrao: false,
      createdAt: undefined,
      updatedAt: undefined,
    });

    return await this.alternativaRepository.save(novaAlternativa);
  }

  async toggleStatus(id: string): Promise<AlternativaCampo> {
    const alternativa = await this.findOne(id);
    alternativa.ativo = !alternativa.ativo;
    return await this.alternativaRepository.save(alternativa);
  }

  async updateStatus(
    id: string,
    status: StatusAlternativa,
  ): Promise<AlternativaCampo> {
    const alternativa = await this.findOne(id);
    alternativa.status = status;
    return await this.alternativaRepository.save(alternativa);
  }

  async definirPadrao(id: string): Promise<AlternativaCampo> {
    const alternativa = await this.findOne(id);

    // Primeiro, remove o padrão de todas as outras alternativas do mesmo campo
    await this.alternativaRepository.update(
      { campoFormularioId: alternativa.campoFormularioId },
      { selecionadoPadrao: false },
    );

    // Define esta como padrão
    alternativa.selecionadoPadrao = true;
    return await this.alternativaRepository.save(alternativa);
  }

  async removerPadrao(campoFormularioId: string): Promise<void> {
    await this.alternativaRepository.update(
      { campoFormularioId },
      { selecionadoPadrao: false },
    );
  }

  async importarAlternativas(
    campoFormularioId: string,
    alternativas: Array<{
      codigo: string;
      valor: string;
      rotulo: string;
      descricao?: string;
      score?: number;
    }>,
  ): Promise<AlternativaCampo[]> {
    const alternativasExistentes = await this.findByCampo(campoFormularioId);
    const codigosExistentes = alternativasExistentes.map(
      (a) => a.codigoAlternativa,
    );
    const valoresExistentes = alternativasExistentes.map((a) => a.valor);

    const novasAlternativas: AlternativaCampo[] = [];
    let ordem =
      alternativasExistentes.length > 0
        ? Math.max(...alternativasExistentes.map((a) => a.ordem)) + 1
        : 1;

    for (const alt of alternativas) {
      if (
        !codigosExistentes.includes(alt.codigo) &&
        !valoresExistentes.includes(alt.valor)
      ) {
        const novaAlternativa = this.alternativaRepository.create({
          campoFormularioId,
          codigoAlternativa: alt.codigo,
          valor: alt.valor,
          textoAlternativa: alt.rotulo,
          descricao: alt.descricao,
          pontuacao: alt.score,
          ordem: ordem++,
          ativo: true,
        });

        const alternativaSalva =
          await this.alternativaRepository.save(novaAlternativa);
        novasAlternativas.push(alternativaSalva);
      }
    }

    return novasAlternativas;
  }

  async remove(id: string): Promise<void> {
    const alternativa = await this.findOne(id);
    await this.alternativaRepository.remove(alternativa);
  }

  async getEstatisticas(campoFormularioId: string) {
    const [total, ativas, inativas, padrao, porStatus] = await Promise.all([
      this.alternativaRepository.count({ where: { campoFormularioId } }),
      this.alternativaRepository.count({
        where: { campoFormularioId, ativo: true },
      }),
      this.alternativaRepository.count({
        where: { campoFormularioId, ativo: false },
      }),
      this.alternativaRepository.count({
        where: { campoFormularioId, selecionadoPadrao: true },
      }),
      this.alternativaRepository
        .createQueryBuilder('alternativa')
        .select('alternativa.status', 'status')
        .addSelect('COUNT(*)', 'total')
        .where('alternativa.campo_formulario_id = :campoFormularioId', {
          campoFormularioId,
        })
        .groupBy('alternativa.status')
        .getRawMany(),
    ]);

    return {
      total,
      ativas,
      inativas,
      padrao,
      porStatus,
    };
  }
}
