import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Laboratorio } from '../entities/laboratorio.entity';
import { CreateLaboratorioDto } from '../dto/create-laboratorio.dto';
import { UpdateLaboratorioDto } from '../dto/update-laboratorio.dto';
import { Empresa } from '../../../cadastros/empresas/entities/empresa.entity';
import { TipoEmpresaEnum } from '../../../cadastros/empresas/enums/empresas.enum';

@Injectable()
export class LaboratorioService {
  constructor(
    @InjectRepository(Laboratorio)
    private readonly laboratorioRepository: Repository<Laboratorio>,
    @InjectRepository(Empresa)
    private readonly empresaRepository: Repository<Empresa>,
    private readonly dataSource: DataSource,
  ) {}

  async create(
    createLaboratorioDto: CreateLaboratorioDto,
  ): Promise<Laboratorio> {
    // Verificar duplicidade de código
    const existingCodigo = await this.laboratorioRepository.findOne({
      where: { codigo_laboratorio: createLaboratorioDto.codigo },
    });

    if (existingCodigo) {
      throw new ConflictException('Já existe um laboratório com este código');
    }

    // Verificar duplicidade de CNPJ
    const existingCnpj = await this.empresaRepository.findOne({
      where: { cnpj: createLaboratorioDto.cnpj },
    });

    if (existingCnpj) {
      throw new ConflictException('Já existe uma empresa com este CNPJ');
    }

    // Usar transação para criar empresa e laboratório
    return await this.dataSource.transaction(async (manager) => {
      // 1. Criar empresa
      const empresa = manager.create(Empresa, {
        tipoEmpresa: TipoEmpresaEnum.LABORATORIO_APOIO,
        codigoInterno: createLaboratorioDto.codigo,
        cnpj: createLaboratorioDto.cnpj,
        razaoSocial: createLaboratorioDto.razao_social,
        nomeFantasia: createLaboratorioDto.nome_fantasia,
        inscricaoEstadual: createLaboratorioDto.inscricao_estadual,
        inscricaoMunicipal: createLaboratorioDto.inscricao_municipal,
        telefoneFixo: createLaboratorioDto.telefone_principal,
        celular: createLaboratorioDto.telefone_secundario,
        emailComercial: createLaboratorioDto.email_principal,
        siteEmpresa: createLaboratorioDto.website,
        cep: createLaboratorioDto.cep,
        rua: createLaboratorioDto.endereco,
        numero: createLaboratorioDto.numero,
        complemento: createLaboratorioDto.complemento,
        bairro: createLaboratorioDto.bairro,
        cidade: createLaboratorioDto.cidade,
        estado: createLaboratorioDto.uf,
        ativo: createLaboratorioDto.ativo ?? true,
      });

      const empresaSalva = await manager.save(Empresa, empresa);

      // 2. Criar laboratório vinculado à empresa
      const laboratorio = manager.create(Laboratorio, {
        empresa_id: empresaSalva.id,
        codigo_laboratorio: createLaboratorioDto.codigo,
        responsavel_tecnico: createLaboratorioDto.responsavel_tecnico,
        conselho_responsavel: createLaboratorioDto.conselho_responsavel,
        numero_conselho: createLaboratorioDto.numero_conselho,
        tipo_integracao: createLaboratorioDto.tipo_integracao,
        url_integracao: createLaboratorioDto.url_integracao,
        token_integracao: createLaboratorioDto.token_integracao,
        usuario_integracao: createLaboratorioDto.usuario_integracao,
        senha_integracao: createLaboratorioDto.senha_integracao,
        configuracao_adicional: createLaboratorioDto.configuracao_adicional,
        metodos_envio_resultado: createLaboratorioDto.metodos_envio_resultado,
        portal_resultados_url: createLaboratorioDto.portal_resultados_url,
        prazo_entrega_normal: createLaboratorioDto.prazo_entrega_normal ?? 3,
        prazo_entrega_urgente: createLaboratorioDto.prazo_entrega_urgente ?? 1,
        taxa_urgencia: createLaboratorioDto.taxa_urgencia,
        percentual_repasse: createLaboratorioDto.percentual_repasse,
        aceita_urgencia: createLaboratorioDto.aceita_urgencia ?? false,
        envia_resultado_automatico:
          createLaboratorioDto.envia_resultado_automatico ?? true,
        observacoes: createLaboratorioDto.observacoes,
      });

      const laboratorioSalvo = await manager.save(Laboratorio, laboratorio);

      // 3. Retornar laboratório com empresa carregada
      return await manager.findOne(Laboratorio, {
        where: { id: laboratorioSalvo.id },
        relations: ['empresa'],
      });
    });
  }

  async findAll(): Promise<Laboratorio[]> {
    return await this.laboratorioRepository.find({
      relations: ['empresa'],
      order: { codigo_laboratorio: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Laboratorio> {
    const laboratorio = await this.laboratorioRepository.findOne({
      where: { id },
    });

    if (!laboratorio) {
      throw new NotFoundException(`Laboratório com ID ${id} não encontrado`);
    }

    return laboratorio;
  }

  async findByCodigo(codigo: string): Promise<Laboratorio> {
    const laboratorio = await this.laboratorioRepository.findOne({
      where: { codigo_laboratorio: codigo },
      relations: ['empresa'],
    });

    if (!laboratorio) {
      throw new NotFoundException(
        `Laboratório com código ${codigo} não encontrado`,
      );
    }

    return laboratorio;
  }

  async findByCnpj(cnpj: string): Promise<Laboratorio> {
    const laboratorio = await this.laboratorioRepository.findOne({
      where: { empresa: { cnpj } },
      relations: ['empresa'],
    });

    if (!laboratorio) {
      throw new NotFoundException(
        `Laboratório com CNPJ ${cnpj} não encontrado`,
      );
    }

    return laboratorio;
  }

  async findAtivos(): Promise<Laboratorio[]> {
    return await this.laboratorioRepository.find({
      where: { empresa: { ativo: true } },
      relations: ['empresa'],
      order: { codigo_laboratorio: 'ASC' },
    });
  }

  async findByIntegracao(tipo: string): Promise<Laboratorio[]> {
    return await this.laboratorioRepository.find({
      where: {
        tipo_integracao: tipo as any,
        empresa: { ativo: true },
      },
      relations: ['empresa'],
      order: { codigo_laboratorio: 'ASC' },
    });
  }

  async findAceitamUrgencia(): Promise<Laboratorio[]> {
    return await this.laboratorioRepository.find({
      where: {
        aceita_urgencia: true,
        empresa: { ativo: true },
      },
      relations: ['empresa'],
      order: { codigo_laboratorio: 'ASC' },
    });
  }

  async update(
    id: string,
    updateLaboratorioDto: UpdateLaboratorioDto,
  ): Promise<Laboratorio> {
    const laboratorio = await this.findOne(id);

    // Verificar duplicidade de código se foi alterado
    if (
      updateLaboratorioDto.codigo &&
      updateLaboratorioDto.codigo !== laboratorio.codigo_laboratorio
    ) {
      const existingCodigo = await this.laboratorioRepository.findOne({
        where: { codigo_laboratorio: updateLaboratorioDto.codigo },
      });

      if (existingCodigo) {
        throw new ConflictException('Já existe um laboratório com este código');
      }
    }

    Object.assign(laboratorio, updateLaboratorioDto);
    return await this.laboratorioRepository.save(laboratorio);
  }

  async remove(id: string): Promise<void> {
    const laboratorio = await this.findOne(id);
    await this.laboratorioRepository.remove(laboratorio);
  }

  async toggleStatus(id: string): Promise<Laboratorio> {
    const laboratorio = await this.laboratorioRepository.findOne({
      where: { id },
      relations: ['empresa'],
    });

    if (!laboratorio) {
      throw new NotFoundException(`Laboratório com ID ${id} não encontrado`);
    }

    laboratorio.empresa.ativo = !laboratorio.empresa.ativo;
    return await this.laboratorioRepository.save(laboratorio);
  }

  async search(query: string): Promise<Laboratorio[]> {
    return await this.laboratorioRepository
      .createQueryBuilder('laboratorio')
      .leftJoinAndSelect('laboratorio.empresa', 'empresa')
      .where('empresa.nomeFantasia ILIKE :query', { query: `%${query}%` })
      .orWhere('empresa.razaoSocial ILIKE :query', { query: `%${query}%` })
      .orWhere('empresa.cnpj LIKE :query', { query: `%${query}%` })
      .orWhere('laboratorio.codigo_laboratorio LIKE :query', {
        query: `%${query}%`,
      })
      .orderBy('empresa.nomeFantasia', 'ASC')
      .getMany();
  }
}
