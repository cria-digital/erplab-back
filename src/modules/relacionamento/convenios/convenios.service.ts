import {
  Injectable,
  NotFoundException,
  // ConflictException, // TODO: Será necessário após refatoração
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, DataSource } from 'typeorm';
import { Convenio } from './entities/convenio.entity';
import { Empresa } from '../../cadastros/empresas/entities/empresa.entity';
import { CreateConvenioExamesDto } from '../../exames/exames/dto/create-convenio-exames.dto';
import { UpdateConvenioExamesDto } from '../../exames/exames/dto/update-convenio-exames.dto';

@Injectable()
export class ConveniosService {
  constructor(
    @InjectRepository(Convenio)
    private readonly convenioRepository: Repository<Convenio>,
    @InjectRepository(Empresa)
    private readonly empresaRepository: Repository<Empresa>,
    private readonly dataSource: DataSource,
  ) {}

  // TODO: Refatorar após migration - campos antigos removidos
  async create(_createConvenioDto: CreateConvenioExamesDto): Promise<Convenio> {
    throw new Error('Método create precisa ser refatorado após migration');
    // Verifica se já existe um convênio com o mesmo código
    // const existingConvenio = await this.convenioRepository.findOne({
    //   where: { codigo_convenio: createConvenioDto.codigo },
    // });

    // if (existingConvenio) {
    //   throw new ConflictException(
    //     `Convênio com código ${createConvenioDto.codigo} já existe`,
    //   );
    // }

    // // Verifica CNPJ duplicado se fornecido através da empresa
    // if (createConvenioDto.cnpj) {
    //   const existingEmpresa = await this.empresaRepository.findOne({
    //     where: { cnpj: createConvenioDto.cnpj },
    //   });

    //   if (existingEmpresa) {
    //     throw new ConflictException(
    //       `Empresa com CNPJ ${createConvenioDto.cnpj} já existe`,
    //     );
    //   }
    // }

    // // Usa transação para criar empresa e convênio atomicamente
    // return await this.dataSource.transaction(async (manager) => {
    //   // Cria a empresa primeiro
    //   const empresa = manager.create(Empresa, {
    //     cnpj: createConvenioDto.cnpj,
    //     razao_social: createConvenioDto.razao_social,
    //     nome_fantasia: createConvenioDto.nome,
    //     // Outros campos da empresa podem ser adicionados conforme necessário
    //   });
    //   const empresaSalva = await manager.save(empresa);

    //   // Cria o convênio vinculado à empresa
    //   const convenio = manager.create(Convenio, {
    //     empresa_id: empresaSalva.id,
    //     codigo_convenio: createConvenioDto.codigo,
    //     nome: createConvenioDto.nome,
    //     registro_ans: createConvenioDto.registro_ans,
    //     tem_integracao_api: createConvenioDto.tem_integracao_api,
    //     url_api: createConvenioDto.url_api,
    //     token_api: createConvenioDto.token_api,
    //     requer_autorizacao: createConvenioDto.requer_autorizacao,
    //     requer_senha: createConvenioDto.requer_senha,
    //     validade_guia_dias: createConvenioDto.validade_guia_dias,
    //     percentual_desconto: createConvenioDto.percentual_desconto,
    //     tabela_precos: createConvenioDto.tabela_precos,
    //     // Mapear outros campos conforme necessário
    //   });

    //   return await manager.save(convenio);
    // });
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    search?: string,
  ): Promise<{
    data: Convenio[];
    total: number;
    page: number;
    lastPage: number;
  }> {
    const where: any = {};

    if (search) {
      where.nome = Like(`%${search}%`);
    }

    const [data, total] = await this.convenioRepository.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: { nome: 'ASC' },
    });

    return {
      data,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
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
  //   });

  //   if (!convenio) {
  //     throw new NotFoundException(
  //       `Convênio com código ${codigo} não encontrado`,
  //     );
  //   }

  //   return convenio;
  // }

  // TODO: Refatorar após migration - validações antigas removidas
  async update(
    id: string,
    updateConvenioDto: UpdateConvenioExamesDto,
  ): Promise<Convenio> {
    const convenio = await this.findOne(id);
    Object.assign(convenio, updateConvenioDto);
    return await this.convenioRepository.save(convenio);
  }

  async remove(id: string): Promise<void> {
    const convenio = await this.findOne(id);

    // Verifica se o convênio está sendo usado em alguma ordem de serviço
    // TODO: Implementar verificação quando OrdemServico estiver pronto

    // Desativa o convênio ao invés de deletar (soft delete)
    convenio.ativo = false;
    await this.convenioRepository.save(convenio);
  }

  async findAtivos(): Promise<Convenio[]> {
    return await this.convenioRepository.find({
      where: { ativo: true },
      order: { nome: 'ASC' },
    });
  }

  // TODO: Refatorar após migration - campo tem_integracao_api removido
  // async findComIntegracao(): Promise<Convenio[]> {
  //   return await this.convenioRepository.find({
  //     where: { tem_integracao_api: true, ativo: true },
  //     order: { nome: 'ASC' },
  //   });
  // }

  // TODO: Refatorar após migration - campo tipo_faturamento removido
  // async findByTipoFaturamento(tipo: string): Promise<Convenio[]> {
  //   return await this.convenioRepository.find({
  //     where: { tipo_faturamento: tipo as any, ativo: true },
  //     order: { nome: 'ASC' },
  //   });
  // }

  // TODO: Refatorar após migration - campos requer_autorizacao/requer_senha removidos
  // async verificarAutorizacao(
  //   convenioId: string,
  // ): Promise<{ requerAutorizacao: boolean; requerSenha: boolean }> {
  //   const convenio = await this.findOne(convenioId);
  //   return {
  //     requerAutorizacao: convenio.requer_autorizacao,
  //     requerSenha: convenio.requer_senha,
  //   };
  // }

  // TODO: Refatorar após migration - campos de regras removidos
  // async getRegrasConvenio(convenioId: string): Promise<any> {
  //   const convenio = await this.findOne(convenioId);
  //   return {
  //     percentualDesconto: convenio.percentual_desconto,
  //     tabelaPrecos: convenio.tabela_precos,
  //     validadeGuiaDias: convenio.validade_guia_dias,
  //     regrasEspecificas: convenio.regras_especificas,
  //   };
  // }
}
