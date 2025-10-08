import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, Like } from 'typeorm';
import {
  PrestadorServico,
  StatusContrato,
} from './entities/prestador-servico.entity';
import { Empresa } from '../../cadastros/empresas/entities/empresa.entity';
import { TipoEmpresaEnum } from '../../cadastros/empresas/enums/empresas.enum';
import { CreatePrestadorServicoDto } from './dto/create-prestador-servico.dto';
import { UpdatePrestadorServicoDto } from './dto/update-prestador-servico.dto';

@Injectable()
export class PrestadorServicoService {
  constructor(
    @InjectRepository(PrestadorServico)
    private readonly prestadorServicoRepository: Repository<PrestadorServico>,
    @InjectRepository(Empresa)
    private readonly empresaRepository: Repository<Empresa>,
    private readonly dataSource: DataSource,
  ) {}

  async create(
    createDto: CreatePrestadorServicoDto,
  ): Promise<PrestadorServico> {
    // Verificar se já existe um prestador com o mesmo código
    const existingPrestador = await this.prestadorServicoRepository.findOne({
      where: { codigoPrestador: createDto.codigoPrestador },
    });

    if (existingPrestador) {
      throw new ConflictException(
        `Prestador com código ${createDto.codigoPrestador} já existe`,
      );
    }

    // Verificar se já existe empresa com o mesmo CNPJ
    if (createDto.empresa?.cnpj) {
      const existingEmpresa = await this.empresaRepository.findOne({
        where: { cnpj: createDto.empresa.cnpj },
      });

      if (existingEmpresa) {
        throw new ConflictException(
          `Empresa com CNPJ ${createDto.empresa.cnpj} já existe`,
        );
      }
    }

    // Usar transação para criar empresa e prestador
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Criar a empresa primeiro
      const empresa = this.empresaRepository.create({
        ...createDto.empresa,
        tipoEmpresa: TipoEmpresaEnum.PRESTADORES_SERVICOS,
      });
      const savedEmpresa = await queryRunner.manager.save(empresa);

      // Criar o prestador
      const prestador = this.prestadorServicoRepository.create({
        ...createDto,
        empresaId: savedEmpresa.id,
        empresa: savedEmpresa,
      });
      delete prestador.empresa; // Remover o objeto empresa para evitar duplicação
      prestador.empresaId = savedEmpresa.id;

      const savedPrestador = await queryRunner.manager.save(prestador);

      await queryRunner.commitTransaction();

      // Buscar com relações
      return this.findOne(savedPrestador.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(): Promise<PrestadorServico[]> {
    const prestadores = await this.prestadorServicoRepository.find({
      relations: ['empresa', 'categorias'],
      order: {
        createdAt: 'DESC',
      },
    });

    // Ordenar por nome fantasia da empresa
    return prestadores.sort((a, b) =>
      (a.empresa?.nomeFantasia || '').localeCompare(
        b.empresa?.nomeFantasia || '',
      ),
    );
  }

  async findActive(): Promise<PrestadorServico[]> {
    const prestadores = await this.prestadorServicoRepository.find({
      where: {
        statusContrato: StatusContrato.ATIVO,
        empresa: {
          ativo: true,
        },
      },
      relations: ['empresa', 'categorias'],
    });

    return prestadores.sort((a, b) =>
      (a.empresa?.nomeFantasia || '').localeCompare(
        b.empresa?.nomeFantasia || '',
      ),
    );
  }

  async findOne(id: string): Promise<PrestadorServico> {
    const prestador = await this.prestadorServicoRepository.findOne({
      where: { id },
      relations: ['empresa', 'categorias'],
    });

    if (!prestador) {
      throw new NotFoundException(`Prestador ${id} não encontrado`);
    }

    return prestador;
  }

  async findByCodigo(codigo: string): Promise<PrestadorServico> {
    const prestador = await this.prestadorServicoRepository.findOne({
      where: { codigoPrestador: codigo },
      relations: ['empresa', 'categorias'],
    });

    if (!prestador) {
      throw new NotFoundException(
        `Prestador com código ${codigo} não encontrado`,
      );
    }

    return prestador;
  }

  async findByCnpj(cnpj: string): Promise<PrestadorServico> {
    const prestador = await this.prestadorServicoRepository.findOne({
      where: {
        empresa: { cnpj },
      },
      relations: ['empresa', 'categorias'],
    });

    if (!prestador) {
      throw new NotFoundException(`Prestador com CNPJ ${cnpj} não encontrado`);
    }

    return prestador;
  }

  async search(termo: string): Promise<PrestadorServico[]> {
    const prestadores = await this.prestadorServicoRepository.find({
      where: [
        { codigoPrestador: Like(`%${termo}%`) },
        { observacoes: Like(`%${termo}%`) },
        {
          empresa: {
            nomeFantasia: Like(`%${termo}%`),
          },
        },
        {
          empresa: {
            razaoSocial: Like(`%${termo}%`),
          },
        },
        {
          empresa: {
            cnpj: Like(`%${termo}%`),
          },
        },
      ],
      relations: ['empresa', 'categorias'],
    });

    return prestadores;
  }

  async findByStatus(status: StatusContrato): Promise<PrestadorServico[]> {
    return this.prestadorServicoRepository.find({
      where: { statusContrato: status },
      relations: ['empresa', 'categorias'],
    });
  }

  async findByTipoContrato(tipo: string): Promise<PrestadorServico[]> {
    return this.prestadorServicoRepository.find({
      where: { tipoContrato: tipo as any },
      relations: ['empresa', 'categorias'],
    });
  }

  async findComUrgencia(): Promise<PrestadorServico[]> {
    return this.prestadorServicoRepository.find({
      where: {
        atendeUrgencia: true,
        statusContrato: StatusContrato.ATIVO,
      },
      relations: ['empresa', 'categorias'],
    });
  }

  async findCom24x7(): Promise<PrestadorServico[]> {
    return this.prestadorServicoRepository.find({
      where: {
        suporte24x7: true,
        statusContrato: StatusContrato.ATIVO,
      },
      relations: ['empresa', 'categorias'],
    });
  }

  async update(
    id: string,
    updateDto: UpdatePrestadorServicoDto,
  ): Promise<PrestadorServico> {
    const prestador = await this.findOne(id);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Atualizar dados da empresa se fornecidos
      if (updateDto.empresa) {
        await queryRunner.manager.update(
          Empresa,
          prestador.empresaId,
          updateDto.empresa,
        );
      }

      // Atualizar dados do prestador
      const { ...prestadorData } = updateDto;
      await queryRunner.manager.update(PrestadorServico, id, prestadorData);

      await queryRunner.commitTransaction();

      return this.findOne(id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async updateStatus(
    id: string,
    status: StatusContrato,
  ): Promise<PrestadorServico> {
    const prestador = await this.findOne(id);

    prestador.statusContrato = status;
    await this.prestadorServicoRepository.save(prestador);

    return this.findOne(id);
  }

  async toggleStatus(id: string): Promise<PrestadorServico> {
    const prestador = await this.findOne(id);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Alternar status da empresa
      await queryRunner.manager.update(Empresa, prestador.empresaId, {
        ativo: !prestador.empresa.ativo,
      });

      await queryRunner.commitTransaction();

      return this.findOne(id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async avaliar(id: string, avaliacao: number): Promise<PrestadorServico> {
    if (avaliacao < 1 || avaliacao > 5) {
      throw new BadRequestException('Avaliação deve estar entre 1 e 5');
    }

    const prestador = await this.findOne(id);

    // Calcular nova média
    const totalAvaliacoes = prestador.totalAvaliacoes + 1;
    const somaAvaliacoes =
      (prestador.avaliacaoMedia || 0) * prestador.totalAvaliacoes + avaliacao;
    const novaMedia = somaAvaliacoes / totalAvaliacoes;

    prestador.avaliacaoMedia = Math.round(novaMedia * 100) / 100; // Arredondar para 2 casas decimais
    prestador.totalAvaliacoes = totalAvaliacoes;

    await this.prestadorServicoRepository.save(prestador);

    return prestador;
  }

  async incrementarServicos(id: string): Promise<PrestadorServico> {
    const prestador = await this.findOne(id);

    prestador.totalServicosPrestados =
      (prestador.totalServicosPrestados || 0) + 1;
    await this.prestadorServicoRepository.save(prestador);

    return prestador;
  }

  async remove(id: string): Promise<void> {
    const prestador = await this.findOne(id);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Remover o prestador
      await queryRunner.manager.delete(PrestadorServico, id);

      // Remover a empresa associada
      await queryRunner.manager.delete(Empresa, prestador.empresaId);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getEstatisticas(): Promise<any> {
    const [
      total,
      ativos,
      inativos,
      suspensos,
      emAnalise,
      com24x7,
      comUrgencia,
    ] = await Promise.all([
      this.prestadorServicoRepository.count(),
      this.prestadorServicoRepository.count({
        where: { statusContrato: StatusContrato.ATIVO },
      }),
      this.prestadorServicoRepository.count({
        where: { statusContrato: StatusContrato.INATIVO },
      }),
      this.prestadorServicoRepository.count({
        where: { statusContrato: StatusContrato.SUSPENSO },
      }),
      this.prestadorServicoRepository.count({
        where: { statusContrato: StatusContrato.EM_ANALISE },
      }),
      this.prestadorServicoRepository.count({
        where: {
          suporte24x7: true,
          statusContrato: StatusContrato.ATIVO,
        },
      }),
      this.prestadorServicoRepository.count({
        where: {
          atendeUrgencia: true,
          statusContrato: StatusContrato.ATIVO,
        },
      }),
    ]);

    // Buscar prestadores mais bem avaliados
    const melhoresAvaliados = await this.prestadorServicoRepository.find({
      where: {
        statusContrato: StatusContrato.ATIVO,
      },
      order: {
        avaliacaoMedia: 'DESC',
        totalAvaliacoes: 'DESC',
      },
      take: 5,
      relations: ['empresa'],
    });

    // Buscar prestadores com mais serviços
    const maisServicos = await this.prestadorServicoRepository.find({
      where: {
        statusContrato: StatusContrato.ATIVO,
      },
      order: {
        totalServicosPrestados: 'DESC',
      },
      take: 5,
      relations: ['empresa'],
    });

    return {
      resumo: {
        total,
        ativos,
        inativos,
        suspensos,
        emAnalise,
        com24x7,
        comUrgencia,
      },
      melhoresAvaliados: melhoresAvaliados.map((p) => ({
        id: p.id,
        codigo: p.codigoPrestador,
        nome: p.empresa?.nomeFantasia,
        avaliacao: p.avaliacaoMedia,
        totalAvaliacoes: p.totalAvaliacoes,
      })),
      maisServicos: maisServicos.map((p) => ({
        id: p.id,
        codigo: p.codigoPrestador,
        nome: p.empresa?.nomeFantasia,
        totalServicos: p.totalServicosPrestados,
      })),
    };
  }

  async getContratosVencendo(dias: number = 30): Promise<PrestadorServico[]> {
    const dataLimite = new Date();
    dataLimite.setDate(dataLimite.getDate() + dias);

    const prestadores = await this.prestadorServicoRepository
      .createQueryBuilder('prestador')
      .leftJoinAndSelect('prestador.empresa', 'empresa')
      .where('prestador.dataFimContrato <= :dataLimite', { dataLimite })
      .andWhere('prestador.dataFimContrato >= :hoje', { hoje: new Date() })
      .andWhere('prestador.statusContrato = :status', {
        status: StatusContrato.ATIVO,
      })
      .getMany();

    return prestadores;
  }

  async getRenovacoesAutomaticas(): Promise<PrestadorServico[]> {
    const hoje = new Date();

    const prestadores = await this.prestadorServicoRepository
      .createQueryBuilder('prestador')
      .leftJoinAndSelect('prestador.empresa', 'empresa')
      .where('prestador.renovacaoAutomatica = :renovacao', { renovacao: true })
      .andWhere('prestador.statusContrato = :status', {
        status: StatusContrato.ATIVO,
      })
      .andWhere('prestador.dataFimContrato IS NOT NULL')
      .getMany();

    // Filtrar prestadores que precisam de aviso
    return prestadores.filter((p) => {
      if (!p.dataFimContrato || !p.prazoAvisoRenovacao) return false;

      const dataFim = new Date(p.dataFimContrato);
      const dataAviso = new Date(dataFim);
      dataAviso.setDate(dataAviso.getDate() - p.prazoAvisoRenovacao);

      return dataAviso <= hoje && hoje <= dataFim;
    });
  }
}
