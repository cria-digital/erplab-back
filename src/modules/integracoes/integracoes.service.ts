import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateIntegracaoDto } from './dto/create-integracao.dto';
import { UpdateIntegracaoDto } from './dto/update-integracao.dto';
import {
  Integracao,
  TipoIntegracao,
  StatusIntegracao,
} from './entities/integracao.entity';

@Injectable()
export class IntegracoesService {
  constructor(
    @InjectRepository(Integracao)
    private integracaoRepository: Repository<Integracao>,
  ) {}

  async create(createIntegracaoDto: CreateIntegracaoDto): Promise<Integracao> {
    const existingByCode = await this.integracaoRepository.findOne({
      where: { codigoIdentificacao: createIntegracaoDto.codigoIdentificacao },
    });

    if (existingByCode) {
      throw new ConflictException(
        `Já existe uma integração com o código ${createIntegracaoDto.codigoIdentificacao}`,
      );
    }

    const integracao = this.integracaoRepository.create(createIntegracaoDto);
    return await this.integracaoRepository.save(integracao);
  }

  async findAll(): Promise<Integracao[]> {
    return await this.integracaoRepository.find({
      relations: ['unidadeSaude'],
      order: { nomeIntegracao: 'ASC' },
    });
  }

  async findAtivos(): Promise<Integracao[]> {
    return await this.integracaoRepository.find({
      where: { ativo: true },
      relations: ['unidadeSaude'],
      order: { nomeIntegracao: 'ASC' },
    });
  }

  async findByTipo(tipo: TipoIntegracao): Promise<Integracao[]> {
    return await this.integracaoRepository.find({
      where: { tipoIntegracao: tipo },
      relations: ['unidadeSaude'],
      order: { nomeIntegracao: 'ASC' },
    });
  }

  async findByStatus(status: StatusIntegracao): Promise<Integracao[]> {
    return await this.integracaoRepository.find({
      where: { status },
      relations: ['unidadeSaude'],
      order: { nomeIntegracao: 'ASC' },
    });
  }

  async findByUnidadeSaude(unidadeSaudeId: string): Promise<Integracao[]> {
    return await this.integracaoRepository.find({
      where: { unidadeSaudeId },
      relations: ['unidadeSaude'],
      order: { nomeIntegracao: 'ASC' },
    });
  }

  async findByCodigo(codigo: string): Promise<Integracao> {
    const integracao = await this.integracaoRepository.findOne({
      where: { codigoIdentificacao: codigo },
      relations: ['unidadeSaude'],
    });

    if (!integracao) {
      throw new NotFoundException(
        `Integração com código ${codigo} não encontrada`,
      );
    }

    return integracao;
  }

  async search(termo: string): Promise<Integracao[]> {
    return await this.integracaoRepository
      .createQueryBuilder('integracao')
      .leftJoinAndSelect('integracao.unidadeSaude', 'unidadeSaude')
      .where('integracao.nome_integracao ILIKE :termo', { termo: `%${termo}%` })
      .orWhere('integracao.descricao_api ILIKE :termo', { termo: `%${termo}%` })
      .orWhere('integracao.codigo_identificacao ILIKE :termo', {
        termo: `%${termo}%`,
      })
      .orderBy('integracao.nome_integracao', 'ASC')
      .getMany();
  }

  async findOne(id: string): Promise<Integracao> {
    const integracao = await this.integracaoRepository.findOne({
      where: { id },
      relations: ['unidadeSaude'],
    });

    if (!integracao) {
      throw new NotFoundException(`Integração com ID ${id} não encontrada`);
    }

    return integracao;
  }

  async update(
    id: string,
    updateIntegracaoDto: UpdateIntegracaoDto,
  ): Promise<Integracao> {
    const integracao = await this.findOne(id);

    if (
      updateIntegracaoDto.codigoIdentificacao &&
      updateIntegracaoDto.codigoIdentificacao !== integracao.codigoIdentificacao
    ) {
      const existingByCode = await this.integracaoRepository.findOne({
        where: { codigoIdentificacao: updateIntegracaoDto.codigoIdentificacao },
      });

      if (existingByCode) {
        throw new ConflictException(
          `Já existe uma integração com o código ${updateIntegracaoDto.codigoIdentificacao}`,
        );
      }
    }

    Object.assign(integracao, updateIntegracaoDto);
    return await this.integracaoRepository.save(integracao);
  }

  async toggleStatus(id: string): Promise<Integracao> {
    const integracao = await this.findOne(id);
    integracao.ativo = !integracao.ativo;
    return await this.integracaoRepository.save(integracao);
  }

  async updateStatus(
    id: string,
    status: StatusIntegracao,
  ): Promise<Integracao> {
    const integracao = await this.findOne(id);
    integracao.status = status;
    return await this.integracaoRepository.save(integracao);
  }

  async remove(id: string): Promise<void> {
    const integracao = await this.findOne(id);
    await this.integracaoRepository.remove(integracao);
  }

  async getEstatisticas() {
    const [total, ativos, inativos, porTipo, porStatus] = await Promise.all([
      this.integracaoRepository.count(),
      this.integracaoRepository.count({ where: { ativo: true } }),
      this.integracaoRepository.count({ where: { ativo: false } }),
      this.integracaoRepository
        .createQueryBuilder('integracao')
        .select('integracao.tipo_integracao', 'tipo')
        .addSelect('COUNT(*)', 'total')
        .groupBy('integracao.tipo_integracao')
        .getRawMany(),
      this.integracaoRepository
        .createQueryBuilder('integracao')
        .select('integracao.status', 'status')
        .addSelect('COUNT(*)', 'total')
        .groupBy('integracao.status')
        .getRawMany(),
    ]);

    return {
      total,
      ativos,
      inativos,
      porTipo,
      porStatus,
    };
  }

  async testarConexao(
    id: string,
  ): Promise<{ sucesso: boolean; mensagem: string; detalhes?: any }> {
    const integracao = await this.findOne(id);

    try {
      // Simular teste de conexão básico
      if (!integracao.ativo) {
        return {
          sucesso: false,
          mensagem: 'Integração está inativa',
        };
      }

      if (!integracao.urlBase && !integracao.urlApiExames) {
        return {
          sucesso: false,
          mensagem: 'URL de conexão não configurada',
        };
      }

      // Aqui implementar lógica específica de teste por tipo
      return {
        sucesso: true,
        mensagem: 'Teste de conexão simulado - Implementar lógica específica',
        detalhes: {
          url: integracao.urlApiExames || integracao.urlBase,
          tipo: integracao.tipoIntegracao,
          timestampTeste: new Date(),
        },
      };
    } catch (error) {
      return {
        sucesso: false,
        mensagem: `Erro ao testar conexão: ${error.message}`,
      };
    }
  }

  async sincronizar(id: string): Promise<{
    sucesso: boolean;
    dadosSincronizados?: number;
    ultimaSincronizacao?: Date;
  }> {
    const integracao = await this.findOne(id);

    if (!integracao.ativo) {
      return {
        sucesso: false,
      };
    }

    // Simular sincronização
    const agora = new Date();
    integracao.ultimaSincronizacao = agora;
    integracao.tentativasFalhas = 0;

    await this.integracaoRepository.save(integracao);

    return {
      sucesso: true,
      dadosSincronizados: 10,
      ultimaSincronizacao: agora,
    };
  }
}
