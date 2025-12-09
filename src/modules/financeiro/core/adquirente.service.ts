import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { validate as isUUID } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Adquirente, StatusAdquirente } from './entities/adquirente.entity';
import { AdquirenteUnidade } from './entities/adquirente-unidade.entity';
import { RestricaoAdquirente } from './entities/restricao-adquirente.entity';
import {
  CreateAdquirenteDto,
  RestricaoAdquirenteDto,
} from './dto/create-adquirente.dto';
import { UpdateAdquirenteDto } from './dto/update-adquirente.dto';
import { IntegracoesService } from '../../atendimento/integracoes/integracoes.service';

import { PaginatedResultDto } from '../../infraestrutura/common/dto/pagination.dto';

export interface FiltroAdquirente {
  status?: StatusAdquirente;
  unidade?: string;
  pesquisar?: string;
  page?: number;
  limit?: number;
}

@Injectable()
export class AdquirenteService {
  constructor(
    @InjectRepository(Adquirente)
    private readonly repository: Repository<Adquirente>,
    @InjectRepository(AdquirenteUnidade)
    private readonly adquirenteUnidadeRepository: Repository<AdquirenteUnidade>,
    @InjectRepository(RestricaoAdquirente)
    private readonly restricaoRepository: Repository<RestricaoAdquirente>,
    private readonly dataSource: DataSource,
    private readonly integracoesService: IntegracoesService,
  ) {}

  /**
   * Criar novo adquirente
   */
  async create(createDto: CreateAdquirenteDto): Promise<Adquirente> {
    // Verifica se já existe adquirente com o mesmo código interno
    const existente = await this.repository.findOne({
      where: { codigo_interno: createDto.codigo_interno },
    });

    if (existente) {
      throw new ConflictException(
        `Já existe um adquirente com o código interno: ${createDto.codigo_interno}`,
      );
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Extrair relacionamentos do DTO
      const { unidades_associadas, restricoes, ...adquirenteData } = createDto;

      // Criar adquirente
      const adquirente = this.repository.create(adquirenteData);
      const adquirenteSalvo = await queryRunner.manager.save(adquirente);

      // Criar vínculos com unidades
      if (unidades_associadas && unidades_associadas.length > 0) {
        const vinculos = unidades_associadas.map((unidade) =>
          this.adquirenteUnidadeRepository.create({
            adquirente_id: adquirenteSalvo.id,
            unidade_saude_id: unidade.unidade_saude_id,
            ativo: unidade.ativo ?? true,
          }),
        );
        await queryRunner.manager.save(vinculos);
      }

      // Criar restrições
      if (restricoes && restricoes.length > 0) {
        const restricoesEntities = restricoes.map((r) =>
          this.restricaoRepository.create({
            adquirente_id: adquirenteSalvo.id,
            unidade_saude_id: r.unidade_saude_id,
            restricao_id: r.restricao_id,
            valor_restricao: r.valor_restricao,
          }),
        );
        await queryRunner.manager.save(restricoesEntities);
      }

      await queryRunner.commitTransaction();
      return this.findOne(adquirenteSalvo.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Listar todos os adquirentes com filtros opcionais e paginação
   */
  async findAll(
    filtros?: FiltroAdquirente,
  ): Promise<PaginatedResultDto<Adquirente>> {
    const page = filtros?.page || 1;
    const limit = filtros?.limit || 10;
    const skip = (page - 1) * limit;

    const queryBuilder = this.repository
      .createQueryBuilder('adquirente')
      .leftJoinAndSelect('adquirente.conta_bancaria', 'conta_bancaria')
      .leftJoinAndSelect('conta_bancaria.banco', 'banco')
      .leftJoinAndSelect('adquirente.integracao', 'integracao')
      .leftJoinAndSelect('adquirente.opcao_parcelamento', 'opcao_parcelamento')
      .leftJoinAndSelect(
        'adquirente.unidades_associadas',
        'unidades_associadas',
      )
      .leftJoinAndSelect('unidades_associadas.unidade_saude', 'unidade_saude')
      .leftJoinAndSelect('adquirente.restricoes', 'restricoes')
      .leftJoinAndSelect('restricoes.unidade_saude', 'restricao_unidade')
      .leftJoinAndSelect('restricoes.restricao', 'restricao_alternativa');

    // Filtro por status
    if (filtros?.status) {
      queryBuilder.andWhere('adquirente.status = :status', {
        status: filtros.status,
      });
    }

    // Filtro por unidade
    if (filtros?.unidade) {
      if (!isUUID(filtros.unidade)) {
        throw new BadRequestException(
          'O parâmetro "unidade" deve ser um UUID válido',
        );
      }
      queryBuilder.andWhere('unidades_associadas.unidade_saude_id = :unidade', {
        unidade: filtros.unidade,
      });
    }

    // Filtro por pesquisa (nome ou código)
    if (filtros?.pesquisar) {
      queryBuilder.andWhere(
        '(adquirente.nome_adquirente ILIKE :pesquisar OR adquirente.codigo_interno ILIKE :pesquisar)',
        { pesquisar: `%${filtros.pesquisar}%` },
      );
    }

    const [data, total] = await queryBuilder
      .orderBy('adquirente.nome_adquirente', 'ASC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return new PaginatedResultDto(data, total, page, limit);
  }

  /**
   * Buscar adquirente por ID
   */
  async findOne(id: string): Promise<Adquirente> {
    const adquirente = await this.repository.findOne({
      where: { id },
      relations: [
        'conta_bancaria',
        'conta_bancaria.banco',
        'integracao',
        'opcao_parcelamento',
        'unidades_associadas',
        'unidades_associadas.unidade_saude',
        'restricoes',
        'restricoes.unidade_saude',
        'restricoes.restricao',
      ],
    });

    if (!adquirente) {
      throw new NotFoundException(`Adquirente com ID ${id} não encontrado`);
    }

    return adquirente;
  }

  /**
   * Atualizar adquirente
   */
  async update(
    id: string,
    updateDto: UpdateAdquirenteDto,
  ): Promise<Adquirente> {
    const adquirente = await this.findOne(id);

    // Se está alterando o código interno, verifica se não existe outro com o mesmo
    if (
      updateDto.codigo_interno &&
      updateDto.codigo_interno !== adquirente.codigo_interno
    ) {
      const existente = await this.repository.findOne({
        where: { codigo_interno: updateDto.codigo_interno },
      });

      if (existente) {
        throw new ConflictException(
          `Já existe um adquirente com o código interno: ${updateDto.codigo_interno}`,
        );
      }
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Extrair relacionamentos do DTO
      const { unidades_associadas, restricoes, ...adquirenteData } = updateDto;

      // Atualizar adquirente
      Object.assign(adquirente, adquirenteData);
      await queryRunner.manager.save(adquirente);

      // Atualizar vínculos com unidades se fornecido
      if (unidades_associadas !== undefined) {
        // Remover vínculos antigos
        await queryRunner.manager.delete(AdquirenteUnidade, {
          adquirente_id: id,
        });

        // Criar novos vínculos
        if (unidades_associadas.length > 0) {
          const vinculos = unidades_associadas.map((unidade) =>
            this.adquirenteUnidadeRepository.create({
              adquirente_id: id,
              unidade_saude_id: unidade.unidade_saude_id,
              ativo: unidade.ativo ?? true,
            }),
          );
          await queryRunner.manager.save(vinculos);
        }
      }

      // Atualizar restrições se fornecido
      if (restricoes !== undefined) {
        // Remover restrições antigas
        await queryRunner.manager.delete(RestricaoAdquirente, {
          adquirente_id: id,
        });

        // Criar novas restrições
        if (restricoes.length > 0) {
          const restricoesEntities = restricoes.map((r) =>
            this.restricaoRepository.create({
              adquirente_id: id,
              unidade_saude_id: r.unidade_saude_id,
              restricao_id: r.restricao_id,
              valor_restricao: r.valor_restricao,
            }),
          );
          await queryRunner.manager.save(restricoesEntities);
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
   * Excluir adquirente
   */
  async remove(id: string): Promise<{ affected: number }> {
    const adquirente = await this.findOne(id);
    await this.repository.remove(adquirente);
    return { affected: 1 };
  }

  /**
   * Alternar status do adquirente (ativo/inativo)
   */
  async toggleStatus(id: string): Promise<Adquirente> {
    const adquirente = await this.findOne(id);

    adquirente.status =
      adquirente.status === StatusAdquirente.ATIVO
        ? StatusAdquirente.INATIVO
        : StatusAdquirente.ATIVO;

    return await this.repository.save(adquirente);
  }

  /**
   * Estatísticas dos adquirentes (para o contador no Figma)
   */
  async getEstatisticas(): Promise<{
    total: number;
    ativos: number;
    inativos: number;
  }> {
    const total = await this.repository.count();
    const ativos = await this.repository.count({
      where: { status: StatusAdquirente.ATIVO },
    });
    const inativos = await this.repository.count({
      where: { status: StatusAdquirente.INATIVO },
    });

    return { total, ativos, inativos };
  }

  /**
   * Buscar adquirentes por unidade de saúde
   */
  async findByUnidade(unidadeSaudeId: string): Promise<Adquirente[]> {
    return await this.repository
      .createQueryBuilder('adquirente')
      .leftJoinAndSelect('adquirente.conta_bancaria', 'conta_bancaria')
      .leftJoinAndSelect('conta_bancaria.banco', 'banco')
      .leftJoinAndSelect('adquirente.integracao', 'integracao')
      .leftJoinAndSelect(
        'adquirente.unidades_associadas',
        'unidades_associadas',
      )
      .leftJoinAndSelect('unidades_associadas.unidade_saude', 'unidade_saude')
      .where('unidades_associadas.unidade_saude_id = :unidadeSaudeId', {
        unidadeSaudeId,
      })
      .andWhere('unidades_associadas.ativo = true')
      .orderBy('adquirente.nome_adquirente', 'ASC')
      .getMany();
  }

  /**
   * Buscar adquirentes por status
   */
  async findByStatus(status: StatusAdquirente): Promise<Adquirente[]> {
    return await this.repository.find({
      where: { status },
      relations: [
        'conta_bancaria',
        'conta_bancaria.banco',
        'unidades_associadas',
        'unidades_associadas.unidade_saude',
      ],
      order: { nome_adquirente: 'ASC' },
    });
  }

  /**
   * Testa conexão com a integração vinculada ao adquirente
   */
  async testarConexao(
    id: string,
  ): Promise<{ sucesso: boolean; mensagem: string; detalhes?: any }> {
    const adquirente = await this.findOne(id);

    if (!adquirente.integracao_id) {
      return {
        sucesso: false,
        mensagem: 'Adquirente não possui integração vinculada',
      };
    }

    // Delegar teste para o service de integrações
    return await this.integracoesService.testarConexao(
      adquirente.integracao_id,
    );
  }

  /**
   * Vincular uma integração ao adquirente
   */
  async vincularIntegracao(
    id: string,
    integracaoId: string,
    validadeConfigApi?: string,
    chaveContingencia?: string,
  ): Promise<Adquirente> {
    const adquirente = await this.findOne(id);

    // Verificar se a integração existe
    await this.integracoesService.findOne(integracaoId);

    adquirente.integracao_id = integracaoId;

    if (validadeConfigApi) {
      adquirente.validade_configuracao_api = new Date(validadeConfigApi);
    }

    if (chaveContingencia) {
      adquirente.chave_contingencia = chaveContingencia;
    }

    await this.repository.save(adquirente);

    return this.findOne(id);
  }

  /**
   * Remove vínculo de integração do adquirente
   */
  async desvincularIntegracao(id: string): Promise<Adquirente> {
    const adquirente = await this.findOne(id);

    adquirente.integracao_id = null;
    adquirente.validade_configuracao_api = null;
    adquirente.chave_contingencia = null;

    await this.repository.save(adquirente);

    return this.findOne(id);
  }

  /**
   * Adiciona uma unidade ao adquirente
   */
  async adicionarUnidade(
    id: string,
    unidadeSaudeId: string,
  ): Promise<Adquirente> {
    // Verificar se adquirente existe
    await this.findOne(id);

    // Verificar se vínculo já existe
    const vinculoExistente = await this.adquirenteUnidadeRepository.findOne({
      where: { adquirente_id: id, unidade_saude_id: unidadeSaudeId },
    });

    if (vinculoExistente) {
      // Se existe mas estava inativo, reativar
      if (!vinculoExistente.ativo) {
        vinculoExistente.ativo = true;
        await this.adquirenteUnidadeRepository.save(vinculoExistente);
      }
      return this.findOne(id);
    }

    // Criar novo vínculo
    const vinculo = this.adquirenteUnidadeRepository.create({
      adquirente_id: id,
      unidade_saude_id: unidadeSaudeId,
      ativo: true,
    });
    await this.adquirenteUnidadeRepository.save(vinculo);

    return this.findOne(id);
  }

  /**
   * Remove uma unidade do adquirente
   */
  async removerUnidade(
    id: string,
    unidadeSaudeId: string,
  ): Promise<Adquirente> {
    await this.adquirenteUnidadeRepository.delete({
      adquirente_id: id,
      unidade_saude_id: unidadeSaudeId,
    });

    return this.findOne(id);
  }

  /**
   * Adicionar restrição
   */
  async adicionarRestricao(
    id: string,
    restricaoDto: RestricaoAdquirenteDto,
  ): Promise<Adquirente> {
    // Verificar se adquirente existe
    await this.findOne(id);

    const restricao = this.restricaoRepository.create({
      adquirente_id: id,
      unidade_saude_id: restricaoDto.unidade_saude_id,
      restricao_id: restricaoDto.restricao_id,
      valor_restricao: restricaoDto.valor_restricao,
    });
    await this.restricaoRepository.save(restricao);

    return this.findOne(id);
  }

  /**
   * Remover restrição
   */
  async removerRestricao(id: string, restricaoId: string): Promise<Adquirente> {
    await this.restricaoRepository.delete({
      id: restricaoId,
      adquirente_id: id,
    });

    return this.findOne(id);
  }
}
