import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import {
  Adquirente,
  StatusAdquirente,
  TipoAdquirente,
  TipoCartao,
} from './entities/adquirente.entity';
import { AdquirenteUnidade } from './entities/adquirente-unidade.entity';
import { CreateAdquirenteDto } from './dto/create-adquirente.dto';
import { UpdateAdquirenteDto } from './dto/update-adquirente.dto';
import { IntegracoesService } from '../../atendimento/integracoes/integracoes.service';

@Injectable()
export class AdquirenteService {
  constructor(
    @InjectRepository(Adquirente)
    private readonly repository: Repository<Adquirente>,
    @InjectRepository(AdquirenteUnidade)
    private readonly adquirenteUnidadeRepository: Repository<AdquirenteUnidade>,
    private readonly dataSource: DataSource,
    private readonly integracoesService: IntegracoesService,
  ) {}

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
      // Extrair unidades_associadas do DTO
      const { unidades_associadas, ...adquirenteData } = createDto;

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

      await queryRunner.commitTransaction();
      return this.findOne(adquirenteSalvo.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(): Promise<Adquirente[]> {
    return await this.repository.find({
      relations: [
        'conta_bancaria',
        'conta_bancaria.banco',
        'integracao',
        'unidades_associadas',
        'unidades_associadas.unidade_saude',
        'restricoes',
        'restricoes.unidade_saude',
      ],
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Adquirente> {
    const adquirente = await this.repository.findOne({
      where: { id },
      relations: [
        'conta_bancaria',
        'conta_bancaria.banco',
        'integracao',
        'integracao.configuracoes',
        'unidades_associadas',
        'unidades_associadas.unidade_saude',
        'restricoes',
        'restricoes.unidade_saude',
      ],
    });

    if (!adquirente) {
      throw new NotFoundException(`Adquirente com ID ${id} não encontrado`);
    }

    return adquirente;
  }

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
      // Extrair unidades_associadas do DTO
      const { unidades_associadas, ...adquirenteData } = updateDto;

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

      await queryRunner.commitTransaction();
      return this.findOne(id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: string): Promise<any> {
    const adquirente = await this.findOne(id);
    await this.repository.remove(adquirente);
    return { affected: 1 };
  }

  async findByStatus(status: StatusAdquirente): Promise<Adquirente[]> {
    return await this.repository.find({
      where: { status },
      relations: ['conta_bancaria'],
      order: { created_at: 'DESC' },
    });
  }

  async findByTipo(tipo: TipoAdquirente): Promise<Adquirente[]> {
    return await this.repository.find({
      where: { tipo_adquirente: tipo },
      relations: ['conta_bancaria'],
      order: { created_at: 'DESC' },
    });
  }

  async findByTipoCartao(tipoCartao: TipoCartao): Promise<Adquirente[]> {
    // TypeORM não tem suporte direto para buscar em arrays, então buscar todos e filtrar
    const todosAdquirentes = await this.repository.find({
      relations: ['conta_bancaria'],
      order: { created_at: 'DESC' },
    });

    return todosAdquirentes.filter(
      (adq) =>
        adq.tipos_cartao_suportados &&
        adq.tipos_cartao_suportados.includes(tipoCartao),
    );
  }

  async toggleStatus(id: string): Promise<Adquirente> {
    const adquirente = await this.findOne(id);

    adquirente.status =
      adquirente.status === StatusAdquirente.ATIVO
        ? StatusAdquirente.INATIVO
        : StatusAdquirente.ATIVO;

    return await this.repository.save(adquirente);
  }

  async updateTaxas(
    id: string,
    taxas: {
      taxa_antecipacao?: number;
      taxa_parcelamento?: number;
      taxa_transacao?: number;
      percentual_repasse?: number;
    },
  ): Promise<Adquirente> {
    const adquirente = await this.findOne(id);

    if (taxas.taxa_antecipacao !== undefined) {
      adquirente.taxa_antecipacao = taxas.taxa_antecipacao;
    }

    if (taxas.taxa_parcelamento !== undefined) {
      adquirente.taxa_parcelamento = taxas.taxa_parcelamento;
    }

    if (taxas.taxa_transacao !== undefined) {
      adquirente.taxa_transacao = taxas.taxa_transacao;
    }

    if (taxas.percentual_repasse !== undefined) {
      adquirente.percentual_repasse = taxas.percentual_repasse;
    }

    return await this.repository.save(adquirente);
  }

  async validateConfiguration(id: string): Promise<any> {
    const adquirente = await this.findOne(id);

    // Validações básicas
    if (!adquirente.codigo_estabelecimento && !adquirente.terminal_id) {
      return {
        valida: false,
        erro: 'Código de estabelecimento ou Terminal ID deve ser configurado',
      };
    }

    return {
      valida: true,
      erro: null,
    };
  }

  /**
   * Busca adquirentes por unidade de saúde
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
   * Vincula uma integração ao adquirente
   */
  async vincularIntegracao(
    id: string,
    integracaoId: string,
  ): Promise<Adquirente> {
    const adquirente = await this.findOne(id);

    // Verificar se a integração existe
    await this.integracoesService.findOne(integracaoId);

    adquirente.integracao_id = integracaoId;
    await this.repository.save(adquirente);

    return this.findOne(id);
  }

  /**
   * Remove vínculo de integração do adquirente
   */
  async desvincularIntegracao(id: string): Promise<Adquirente> {
    const adquirente = await this.findOne(id);

    adquirente.integracao_id = null;
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
}
