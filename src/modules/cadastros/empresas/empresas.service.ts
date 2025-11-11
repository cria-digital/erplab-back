import {
  Injectable,
  NotFoundException,
  ConflictException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Empresa } from './entities/empresa.entity';
import { CreateEmpresaDto } from './dto/create-empresa.dto';
import { UpdateEmpresaDto } from './dto/update-empresa.dto';
import { SearchEmpresaDto } from './dto/search-empresa.dto';
import { PaginatedResultDto } from '../../infraestrutura/common/dto/pagination.dto';

@Injectable()
export class EmpresasService {
  constructor(
    @InjectRepository(Empresa)
    private readonly empresaRepository: Repository<Empresa>,
  ) {}

  async create(createEmpresaDto: CreateEmpresaDto): Promise<Empresa> {
    // Verifica se o CNPJ já existe
    const empresaExistente = await this.empresaRepository.findOne({
      where: { cnpj: createEmpresaDto.cnpj },
    });

    if (empresaExistente) {
      throw new ConflictException('CNPJ já cadastrado');
    }

    const empresa = this.empresaRepository.create(createEmpresaDto);
    return await this.empresaRepository.save(empresa);
  }

  async findAll(): Promise<Empresa[]> {
    return await this.empresaRepository.find({
      order: {
        nomeFantasia: 'ASC',
      },
    });
  }

  async search(
    searchDto: SearchEmpresaDto,
  ): Promise<PaginatedResultDto<Empresa>> {
    const { page = 1, limit = 10, termo, tipoEmpresa, ativo } = searchDto;

    const query = this.empresaRepository
      .createQueryBuilder('empresa')
      .orderBy('empresa.nomeFantasia', 'ASC');

    // Filtro por termo (busca em razão social, nome fantasia e CNPJ)
    if (termo) {
      query.andWhere(
        'LOWER(empresa.razaoSocial) LIKE LOWER(:termo) OR LOWER(empresa.nomeFantasia) LIKE LOWER(:termo) OR empresa.cnpj LIKE :termo',
        { termo: `%${termo}%` },
      );
    }

    // Filtro por tipo de empresa
    if (tipoEmpresa) {
      query.andWhere('empresa.tipoEmpresa = :tipoEmpresa', { tipoEmpresa });
    }

    // Filtro por status ativo/inativo
    if (ativo !== undefined) {
      query.andWhere('empresa.ativo = :ativo', { ativo });
    }

    // Contar total de registros
    const total = await query.getCount();

    // Aplicar paginação
    query.skip((page - 1) * limit).take(limit);

    // Buscar dados
    const data = await query.getMany();

    return new PaginatedResultDto(data, total, page, limit);
  }

  async findOne(id: string): Promise<Empresa> {
    const empresa = await this.empresaRepository.findOne({
      where: { id },
    });

    if (!empresa) {
      throw new NotFoundException(`Empresa com ID ${id} não encontrada`);
    }

    return empresa;
  }

  async findByCnpj(cnpj: string): Promise<Empresa | any> {
    // Remove formatação do CNPJ (mantém apenas números)
    const cnpjLimpo = cnpj.replace(/\D/g, '');

    // Busca no banco local primeiro
    const empresa = await this.empresaRepository.findOne({
      where: { cnpj: cnpjLimpo },
    });

    if (empresa) {
      return empresa;
    }

    // Se não encontrou no banco, busca na API CNPJA
    try {
      const dadosCNPJA = await this.buscarCNPJA(cnpjLimpo);

      // Adapta os dados da API CNPJA para o formato esperado pelo frontend
      return this.adaptarRespostaCNPJA(dadosCNPJA);
    } catch (_error) {
      throw new NotFoundException(
        `Empresa com CNPJ ${cnpj} não encontrada no banco de dados e na Receita Federal`,
      );
    }
  }

  private async buscarCNPJA(cnpj: string): Promise<any> {
    try {
      const response = await fetch(`https://open.cnpja.com/office/${cnpj}`);

      if (!response.ok) {
        if (response.status === 404) {
          throw new NotFoundException(`CNPJ ${cnpj} não encontrado na API`);
        }
        throw new HttpException(
          'Erro ao consultar API CNPJA',
          HttpStatus.BAD_GATEWAY,
        );
      }

      return await response.json();
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof HttpException
      ) {
        throw error;
      }
      throw new HttpException(
        'Erro ao consultar API externa',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  private adaptarRespostaCNPJA(dados: any): any {
    // Monta o objeto adaptado para o formato da entidade Empresa
    return {
      // Indica que é um registro externo (não existe no banco)
      isExternal: true,
      externalSource: 'CNPJA',

      // Dados básicos
      cnpj: dados.taxId,
      razaoSocial: dados.company?.name || '',
      nomeFantasia: dados.alias || dados.company?.name || '',
      inscricaoEstadual:
        dados.registrations?.find((r) => r.type?.id === 1)?.number || null,

      // Endereço
      cep: dados.address?.zip || null,
      rua: dados.address?.street || null,
      numero: dados.address?.number || null,
      bairro: dados.address?.district || null,
      complemento: dados.address?.details || null,
      cidade: dados.address?.city || null,
      estado: dados.address?.state || null,

      // Contato
      telefoneFixo:
        dados.phones
          ?.filter((p) => p.type === 'LANDLINE')
          .map((p) => `(${p.area}) ${p.number}`)
          .join(', ') || null,
      emailComercial:
        dados.emails?.find((e) => e.ownership === 'CORPORATE')?.address || null,

      // Status
      ativo: dados.status?.id === 2, // 2 = Ativa
      statusDate: dados.statusDate,
      status: dados.status?.text,

      // Informações adicionais da API
      mainActivity: dados.mainActivity
        ? {
            code: dados.mainActivity.id,
            description: dados.mainActivity.text,
          }
        : null,
      sideActivities: dados.sideActivities?.map((a) => ({
        code: a.id,
        description: a.text,
      })),

      // Informações da empresa matriz
      company: {
        name: dados.company?.name,
        equity: dados.company?.equity,
        nature: dados.company?.nature?.text,
        size: dados.company?.size?.text,
        simples: dados.company?.simples?.optant,
        simei: dados.company?.simei?.optant,
      },

      // Sócios/Membros (apenas nomes e cargos, dados sensíveis ofuscados)
      members: dados.company?.members?.map((m) => ({
        name: m.person?.name,
        role: m.role?.text,
        since: m.since,
      })),

      // Suframa (se houver)
      suframa: dados.suframa?.map((s) => ({
        number: s.number,
        approved: s.approved,
        status: s.status?.text,
        incentives: s.incentives?.map((i) => ({
          tribute: i.tribute,
          benefit: i.benefit,
        })),
      })),

      // Registrations (IE, ST, etc)
      registrations: dados.registrations?.map((r) => ({
        number: r.number,
        state: r.state,
        enabled: r.enabled,
        type: r.type?.text,
        status: r.status?.text,
      })),

      // Data de fundação
      founded: dados.founded,

      // Informação de que é filial/matriz
      head: dados.head,
    };
  }

  async findByTipo(tipo: string): Promise<Empresa[]> {
    return await this.empresaRepository.find({
      where: { tipoEmpresa: tipo as any },
      order: {
        nomeFantasia: 'ASC',
      },
    });
  }

  async update(
    id: string,
    updateEmpresaDto: UpdateEmpresaDto,
  ): Promise<Empresa> {
    const empresa = await this.findOne(id);

    // Se está tentando atualizar o CNPJ, verifica duplicidade
    if (updateEmpresaDto.cnpj && updateEmpresaDto.cnpj !== empresa.cnpj) {
      const empresaExistente = await this.empresaRepository.findOne({
        where: { cnpj: updateEmpresaDto.cnpj },
      });

      if (empresaExistente) {
        throw new ConflictException('CNPJ já cadastrado para outra empresa');
      }
    }

    Object.assign(empresa, updateEmpresaDto);
    return await this.empresaRepository.save(empresa);
  }

  async remove(id: string): Promise<void> {
    const empresa = await this.findOne(id);

    // Soft delete - apenas marca como inativo
    empresa.ativo = false;
    await this.empresaRepository.save(empresa);
  }

  async activate(id: string): Promise<Empresa> {
    const empresa = await this.findOne(id);
    empresa.ativo = true;
    return await this.empresaRepository.save(empresa);
  }

  async deactivate(id: string): Promise<Empresa> {
    const empresa = await this.findOne(id);
    empresa.ativo = false;
    return await this.empresaRepository.save(empresa);
  }

  // Métodos específicos para Laboratórios
  async findAllLaboratorios(): Promise<Empresa[]> {
    return await this.empresaRepository.find({
      where: { tipoEmpresa: 'LABORATORIO_APOIO' as any },
      order: { nomeFantasia: 'ASC' },
    });
  }

  async findLaboratoriosAtivos(): Promise<Empresa[]> {
    return await this.empresaRepository.find({
      where: {
        tipoEmpresa: 'LABORATORIO_APOIO' as any,
        ativo: true,
      },
      order: { nomeFantasia: 'ASC' },
    });
  }

  // Métodos específicos para Convênios
  async findAllConvenios(): Promise<Empresa[]> {
    return await this.empresaRepository.find({
      where: { tipoEmpresa: 'CONVENIOS' as any },
      order: { nomeFantasia: 'ASC' },
    });
  }

  async findConveniosAtivos(): Promise<Empresa[]> {
    return await this.empresaRepository.find({
      where: {
        tipoEmpresa: 'CONVENIOS' as any,
        ativo: true,
      },
      order: { nomeFantasia: 'ASC' },
    });
  }
}
