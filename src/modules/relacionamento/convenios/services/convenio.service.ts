import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Convenio } from '../entities/convenio.entity';
import { Empresa } from '../../../cadastros/empresas/entities/empresa.entity';
import { CreateConvenioDto } from '../dto/create-convenio.dto';
import { UpdateConvenioDto } from '../dto/update-convenio.dto';

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
}
