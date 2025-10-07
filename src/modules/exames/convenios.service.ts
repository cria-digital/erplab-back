import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Convenio } from './entities/convenio.entity';
import { CreateConvenioExamesDto } from './dto/create-convenio-exames.dto';
import { UpdateConvenioExamesDto } from './dto/update-convenio-exames.dto';

@Injectable()
export class ConveniosService {
  constructor(
    @InjectRepository(Convenio)
    private readonly convenioRepository: Repository<Convenio>,
  ) {}

  async create(createConvenioDto: CreateConvenioExamesDto): Promise<Convenio> {
    // Verifica se já existe um convênio com o mesmo código
    const existingConvenio = await this.convenioRepository.findOne({
      where: { codigo: createConvenioDto.codigo },
    });

    if (existingConvenio) {
      throw new ConflictException(
        `Convênio com código ${createConvenioDto.codigo} já existe`,
      );
    }

    // Verifica CNPJ duplicado se fornecido
    if (createConvenioDto.cnpj) {
      const existingCnpj = await this.convenioRepository.findOne({
        where: { cnpj: createConvenioDto.cnpj },
      });

      if (existingCnpj) {
        throw new ConflictException(
          `Convênio com CNPJ ${createConvenioDto.cnpj} já existe`,
        );
      }
    }

    const convenio = this.convenioRepository.create(createConvenioDto);
    return await this.convenioRepository.save(convenio);
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    search?: string,
    status?: string,
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

    if (status) {
      where.status = status;
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

  async findByCodigo(codigo: string): Promise<Convenio> {
    const convenio = await this.convenioRepository.findOne({
      where: { codigo },
    });

    if (!convenio) {
      throw new NotFoundException(
        `Convênio com código ${codigo} não encontrado`,
      );
    }

    return convenio;
  }

  async update(
    id: string,
    updateConvenioDto: UpdateConvenioExamesDto,
  ): Promise<Convenio> {
    const convenio = await this.findOne(id);

    // Se está alterando o código, verifica se não existe outro com o mesmo código
    if (
      updateConvenioDto.codigo &&
      updateConvenioDto.codigo !== convenio.codigo
    ) {
      const existingConvenio = await this.convenioRepository.findOne({
        where: { codigo: updateConvenioDto.codigo },
      });

      if (existingConvenio) {
        throw new ConflictException(
          `Convênio com código ${updateConvenioDto.codigo} já existe`,
        );
      }
    }

    // Se está alterando o CNPJ, verifica duplicação
    if (updateConvenioDto.cnpj && updateConvenioDto.cnpj !== convenio.cnpj) {
      const existingCnpj = await this.convenioRepository.findOne({
        where: { cnpj: updateConvenioDto.cnpj },
      });

      if (existingCnpj) {
        throw new ConflictException(
          `Convênio com CNPJ ${updateConvenioDto.cnpj} já existe`,
        );
      }
    }

    Object.assign(convenio, updateConvenioDto);
    return await this.convenioRepository.save(convenio);
  }

  async remove(id: string): Promise<void> {
    const convenio = await this.findOne(id);

    // Verifica se o convênio está sendo usado em alguma ordem de serviço
    // TODO: Implementar verificação quando OrdemServico estiver pronto

    // Por enquanto, apenas desativa o convênio ao invés de deletar
    convenio.status = 'inativo';
    await this.convenioRepository.save(convenio);
  }

  async findAtivos(): Promise<Convenio[]> {
    return await this.convenioRepository.find({
      where: { status: 'ativo' },
      order: { nome: 'ASC' },
    });
  }

  async findComIntegracao(): Promise<Convenio[]> {
    return await this.convenioRepository.find({
      where: { tem_integracao_api: true, status: 'ativo' },
      order: { nome: 'ASC' },
    });
  }

  async findByTipoFaturamento(tipo: string): Promise<Convenio[]> {
    return await this.convenioRepository.find({
      where: { tipo_faturamento: tipo as any, status: 'ativo' },
      order: { nome: 'ASC' },
    });
  }

  async verificarAutorizacao(
    convenioId: string,
  ): Promise<{ requerAutorizacao: boolean; requerSenha: boolean }> {
    const convenio = await this.findOne(convenioId);
    return {
      requerAutorizacao: convenio.requer_autorizacao,
      requerSenha: convenio.requer_senha,
    };
  }

  async getRegrasConvenio(convenioId: string): Promise<any> {
    const convenio = await this.findOne(convenioId);
    return {
      percentualDesconto: convenio.percentual_desconto,
      tabelaPrecos: convenio.tabela_precos,
      validadeGuiaDias: convenio.validade_guia_dias,
      regrasEspecificas: convenio.regras_especificas,
    };
  }
}
