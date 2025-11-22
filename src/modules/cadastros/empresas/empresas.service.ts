import {
  Injectable,
  NotFoundException,
  ConflictException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, Brackets } from 'typeorm';
import { Empresa } from './entities/empresa.entity';
import { ContaBancaria } from '../../financeiro/core/entities/conta-bancaria.entity';
import { Laboratorio } from '../../relacionamento/laboratorios/entities/laboratorio.entity';
import { Convenio } from '../../relacionamento/convenios/entities/convenio.entity';
import { Telemedicina } from '../../relacionamento/telemedicina/entities/telemedicina.entity';
import { CreateEmpresaDto } from './dto/create-empresa.dto';
import { UpdateEmpresaDto } from './dto/update-empresa.dto';
import { SearchEmpresaDto } from './dto/search-empresa.dto';
import { PaginatedResultDto } from '../../infraestrutura/common/dto/pagination.dto';
import { TipoEmpresaEnum } from './enums/empresas.enum';

@Injectable()
export class EmpresasService {
  constructor(
    @InjectRepository(Empresa)
    private readonly empresaRepository: Repository<Empresa>,
    @InjectRepository(ContaBancaria)
    private readonly contaBancariaRepository: Repository<ContaBancaria>,
    @InjectRepository(Laboratorio)
    private readonly laboratorioRepository: Repository<Laboratorio>,
    @InjectRepository(Convenio)
    private readonly convenioRepository: Repository<Convenio>,
    @InjectRepository(Telemedicina)
    private readonly telemedicinaRepository: Repository<Telemedicina>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createEmpresaDto: CreateEmpresaDto): Promise<Empresa> {
    // Verifica se o CNPJ já existe
    const empresaExistente = await this.empresaRepository.findOne({
      where: { cnpj: createEmpresaDto.cnpj },
    });

    if (empresaExistente) {
      throw new ConflictException('CNPJ já cadastrado');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Extrai contas bancárias do DTO
      const { contasBancarias, ...empresaData } = createEmpresaDto;

      // Cria a empresa
      const empresa = this.empresaRepository.create(empresaData);
      const empresaSalva = await queryRunner.manager.save(empresa);

      // Cria as contas bancárias se fornecidas
      if (contasBancarias && contasBancarias.length > 0) {
        const contas = contasBancarias.map((conta) => {
          return this.contaBancariaRepository.create({
            ...conta,
            empresa_id: empresaSalva.id,
          });
        });

        await queryRunner.manager.save(contas);
      }

      // Cria registros automáticos nas tabelas especializadas baseado no tipo de empresa
      switch (empresaSalva.tipoEmpresa) {
        case TipoEmpresaEnum.LABORATORIO_APOIO:
          const laboratorio = this.laboratorioRepository.create({
            id: empresaSalva.id, // MESMO ID DA EMPRESA para facilitar buscas
            empresa_id: empresaSalva.id,
            codigo_laboratorio:
              empresaSalva.codigoInterno ||
              `LAB-${empresaSalva.id.substring(0, 8).toUpperCase()}`,
            prazo_entrega_normal: 3,
            prazo_entrega_urgente: 1,
            aceita_urgencia: false,
            envia_resultado_automatico: true,
          });
          await queryRunner.manager.save(Laboratorio, laboratorio);
          break;

        case TipoEmpresaEnum.CONVENIOS:
          const convenio = this.convenioRepository.create({
            id: empresaSalva.id, // MESMO ID DA EMPRESA para facilitar buscas
            empresa_id: empresaSalva.id,
            nome: empresaSalva.nomeFantasia || empresaSalva.razaoSocial,
          });
          await queryRunner.manager.save(Convenio, convenio);
          break;

        case TipoEmpresaEnum.TELEMEDICINA:
          const telemedicina = this.telemedicinaRepository.create({
            id: empresaSalva.id, // MESMO ID DA EMPRESA para facilitar buscas
            empresa_id: empresaSalva.id,
            codigo_telemedicina:
              empresaSalva.codigoInterno ||
              `TELE-${empresaSalva.id.substring(0, 8).toUpperCase()}`,
            tempo_consulta_padrao: 30,
            permite_agendamento_online: true,
            permite_cancelamento_online: true,
            antecedencia_minima_agendamento: 60,
            antecedencia_minima_cancelamento: 24,
            suporte_gravacao: true,
            suporte_streaming: true,
            criptografia_end_to_end: true,
          });
          await queryRunner.manager.save(Telemedicina, telemedicina);
          break;
      }

      await queryRunner.commitTransaction();

      // Retorna empresa com contas bancárias
      return await this.findOne(empresaSalva.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(): Promise<Empresa[]> {
    return await this.empresaRepository.find({
      where: { ativo: true },
      relations: ['contasBancarias', 'contasBancarias.banco'],
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
      .leftJoinAndSelect('empresa.contasBancarias', 'conta')
      .leftJoinAndSelect('conta.banco', 'banco')
      .orderBy('empresa.nomeFantasia', 'ASC');

    // Filtro por termo (busca em razão social, nome fantasia e CNPJ)
    if (termo) {
      query.andWhere(
        new Brackets((qb) => {
          qb.where('LOWER(empresa.razaoSocial) LIKE LOWER(:termo)', {
            termo: `%${termo}%`,
          })
            .orWhere('LOWER(empresa.nomeFantasia) LIKE LOWER(:termo)', {
              termo: `%${termo}%`,
            })
            .orWhere('empresa.cnpj LIKE :termo', { termo: `%${termo}%` });
        }),
      );
    }

    // Filtro por tipo de empresa
    if (tipoEmpresa) {
      query.andWhere('empresa.tipoEmpresa = :tipoEmpresa', { tipoEmpresa });
    }

    // Filtro por status ativo/inativo (padrão: apenas ativas)
    const ativoFiltro = ativo !== undefined ? ativo : true;
    query.andWhere('empresa.ativo = :ativo', { ativo: ativoFiltro });

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
      relations: ['contasBancarias', 'contasBancarias.banco'],
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

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Extrai contas bancárias do DTO
      const { contasBancarias, ...empresaData } = updateEmpresaDto;

      // Atualiza dados da empresa
      Object.assign(empresa, empresaData);
      await queryRunner.manager.save(empresa);

      // Se contasBancarias foi fornecido, substitui completamente as contas existentes
      if (contasBancarias !== undefined) {
        // Remove todas as contas existentes
        await queryRunner.manager.delete(ContaBancaria, {
          empresa_id: empresa.id,
        });

        // Cria as novas contas
        if (contasBancarias.length > 0) {
          const contas = contasBancarias.map((conta) => {
            return this.contaBancariaRepository.create({
              ...conta,
              empresa_id: empresa.id,
            });
          });

          await queryRunner.manager.save(contas);
        }
      }

      // Se mudou o tipo para LABORATORIO_APOIO, cria registro de laboratório se não existir
      if (empresa.tipoEmpresa === TipoEmpresaEnum.LABORATORIO_APOIO) {
        const laboratorioExistente = await queryRunner.manager.findOne(
          Laboratorio,
          {
            where: { empresa_id: empresa.id },
          },
        );

        if (!laboratorioExistente) {
          const laboratorio = this.laboratorioRepository.create({
            empresa_id: empresa.id,
            codigo_laboratorio:
              empresa.codigoInterno ||
              `LAB-${empresa.id.substring(0, 8).toUpperCase()}`,
            prazo_entrega_normal: 3,
            prazo_entrega_urgente: 1,
            aceita_urgencia: false,
            envia_resultado_automatico: true,
          });

          await queryRunner.manager.save(Laboratorio, laboratorio);
        }
      }

      await queryRunner.commitTransaction();

      // Retorna empresa atualizada com contas bancárias
      return await this.findOne(empresa.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAllIncludingInactive(): Promise<Empresa[]> {
    return await this.empresaRepository.find({
      relations: ['contasBancarias', 'contasBancarias.banco'],
      order: {
        nomeFantasia: 'ASC',
      },
    });
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
