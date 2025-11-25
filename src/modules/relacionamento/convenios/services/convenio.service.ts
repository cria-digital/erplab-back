import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, In } from 'typeorm';
import { Convenio } from '../entities/convenio.entity';
import { Empresa } from '../../../cadastros/empresas/entities/empresa.entity';
import { CreateConvenioDto } from '../dto/create-convenio.dto';
import { UpdateConvenioDto } from '../dto/update-convenio.dto';
import {
  VincularIntegracaoDto,
  VincularIntegracaoLoteDto,
} from '../dto/vincular-integracao.dto';

@Injectable()
export class ConvenioService {
  constructor(
    @InjectRepository(Convenio)
    private readonly convenioRepository: Repository<Convenio>,
    @InjectRepository(Empresa)
    private readonly empresaRepository: Repository<Empresa>,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * @deprecated Convênios agora são criados automaticamente ao criar empresa tipo CONVENIOS
   * Use: POST /cadastros/empresas com tipoEmpresa: "CONVENIOS"
   */
  async create(createConvenioDto: CreateConvenioDto): Promise<Convenio> {
    // Criar convênio diretamente (sem empresa)
    const convenio = this.convenioRepository.create(createConvenioDto);
    const savedConvenio = await this.convenioRepository.save(convenio);
    return await this.findOne(savedConvenio.id);
  }

  async findAll(): Promise<Convenio[]> {
    return await this.convenioRepository.find();
  }

  async findOne(id: string): Promise<Convenio> {
    const convenio = await this.convenioRepository.findOne({
      where: { id },
    });

    if (!convenio) {
      throw new NotFoundException(`Convênio com ID ${id} não encontrado`);
    }

    return convenio;
  }

  // TODO: Refatorar após migration - campo codigo_convenio removido
  // async findByCodigo(codigo: string): Promise<Convenio> {
  //   const convenio = await this.convenioRepository.findOne({
  //     where: { codigo_convenio: codigo },
  //     relations: ['empresa', 'planos', 'instrucoes_historico'],
  //   });

  //   if (!convenio) {
  //     throw new NotFoundException(
  //       `Convênio com código ${codigo} não encontrado`,
  //     );
  //   }

  //   return convenio;
  // }

  async findByCnpj(cnpj: string): Promise<Convenio> {
    // Buscar empresa por CNPJ primeiro
    const empresa = await this.empresaRepository.findOne({
      where: { cnpj },
    });

    if (!empresa) {
      throw new NotFoundException(`Convênio com CNPJ ${cnpj} não encontrado`);
    }

    // Buscar convênio pelo empresa_id
    const convenio = await this.convenioRepository.findOne({
      where: { empresa_id: empresa.id },
    });

    if (!convenio) {
      throw new NotFoundException(`Convênio com CNPJ ${cnpj} não encontrado`);
    }

    return convenio;
  }

  async findAtivos(): Promise<Convenio[]> {
    // Buscar empresas ativas tipo CONVENIOS
    const empresasAtivas = await this.empresaRepository.find({
      where: { ativo: true, tipoEmpresa: 'CONVENIOS' as any },
    });

    const empresaIds = empresasAtivas.map((e) => e.id);

    if (empresaIds.length === 0) {
      return [];
    }

    // Buscar convênios dessas empresas
    return await this.convenioRepository
      .createQueryBuilder('convenio')
      .whereInIds(empresaIds)
      .getMany();
  }

  async update(
    id: string,
    updateConvenioDto: UpdateConvenioDto,
  ): Promise<Convenio> {
    const convenio = await this.findOne(id);

    // Atualizar apenas dados do convênio (não atualiza empresa - use PUT /cadastros/empresas/:id)
    Object.assign(convenio, updateConvenioDto);
    const savedConvenio = await this.convenioRepository.save(convenio);

    return await this.findOne(savedConvenio.id);
  }

  async remove(id: string): Promise<void> {
    const convenio = await this.findOne(id);
    await this.convenioRepository.remove(convenio);
  }

  async toggleStatus(id: string): Promise<Convenio> {
    const convenio = await this.findOne(id);

    // Buscar empresa e toggle status
    const empresa = await this.empresaRepository.findOne({
      where: { id: convenio.empresa_id },
    });

    if (empresa) {
      empresa.ativo = !empresa.ativo;
      await this.empresaRepository.save(empresa);
    }

    return await this.findOne(id);
  }

  async search(query: string): Promise<Convenio[]> {
    // Buscar empresas que correspondem à query
    const empresas = await this.empresaRepository
      .createQueryBuilder('empresa')
      .where('empresa.nomeFantasia ILIKE :query', { query: `%${query}%` })
      .orWhere('empresa.razaoSocial ILIKE :query', { query: `%${query}%` })
      .orWhere('empresa.cnpj LIKE :query', { query: `%${query}%` })
      .andWhere('empresa.tipoEmpresa = :tipo', { tipo: 'CONVENIOS' })
      .getMany();

    if (empresas.length === 0) {
      return [];
    }

    const empresaIds = empresas.map((e) => e.id);

    // Buscar convênios dessas empresas
    return await this.convenioRepository
      .createQueryBuilder('convenio')
      .whereInIds(empresaIds)
      .getMany();
  }

  /**
   * Vincula uma integração a um convênio
   */
  async vincularIntegracao(dto: VincularIntegracaoDto): Promise<Convenio> {
    const convenio = await this.findOne(dto.convenioId);
    convenio.integracao_id = dto.integracaoId;
    await this.convenioRepository.save(convenio);
    return await this.findOne(dto.convenioId);
  }

  /**
   * Vincula integrações a múltiplos convênios em lote
   */
  async vincularIntegracaoLote(dto: VincularIntegracaoLoteDto): Promise<{
    sucesso: number;
    erros: { convenioId: string; erro: string }[];
  }> {
    const erros: { convenioId: string; erro: string }[] = [];
    let sucesso = 0;

    // Validar que todos os convênios existem
    const convenioIds = dto.vinculos.map((v) => v.convenioId);
    const convenios = await this.convenioRepository.find({
      where: { id: In(convenioIds) },
    });

    const convenioMap = new Map(convenios.map((c) => [c.id, c]));

    // Processar cada vínculo
    for (const vinculo of dto.vinculos) {
      const convenio = convenioMap.get(vinculo.convenioId);

      if (!convenio) {
        erros.push({
          convenioId: vinculo.convenioId,
          erro: 'Convênio não encontrado',
        });
        continue;
      }

      try {
        convenio.integracao_id = vinculo.integracaoId;
        await this.convenioRepository.save(convenio);
        sucesso++;
      } catch (error) {
        erros.push({
          convenioId: vinculo.convenioId,
          erro: error.message || 'Erro ao vincular integração',
        });
      }
    }

    return { sucesso, erros };
  }

  /**
   * Lista convênios que possuem integração vinculada
   */
  async findComIntegracao(): Promise<Convenio[]> {
    return await this.convenioRepository
      .createQueryBuilder('convenio')
      .where('convenio.integracao_id IS NOT NULL')
      .getMany();
  }

  /**
   * Lista convênios sem integração vinculada
   */
  async findSemIntegracao(): Promise<Convenio[]> {
    return await this.convenioRepository
      .createQueryBuilder('convenio')
      .where('convenio.integracao_id IS NULL')
      .getMany();
  }

  /**
   * Lista convênios vinculados a uma integração específica
   */
  async findByIntegracao(integracaoId: string): Promise<Convenio[]> {
    return await this.convenioRepository.find({
      where: { integracao_id: integracaoId },
    });
  }
}
