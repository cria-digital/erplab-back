import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Adquirente,
  StatusAdquirente,
  TipoAdquirente,
  TipoCartao,
} from './entities/adquirente.entity';
import { CreateAdquirenteDto } from './dto/create-adquirente.dto';
import { UpdateAdquirenteDto } from './dto/update-adquirente.dto';

@Injectable()
export class AdquirenteService {
  constructor(
    @InjectRepository(Adquirente)
    private readonly repository: Repository<Adquirente>,
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

    const adquirente = this.repository.create(createDto);
    return await this.repository.save(adquirente);
  }

  async findAll(): Promise<Adquirente[]> {
    return await this.repository.find({
      relations: ['conta_bancaria'],
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Adquirente> {
    const adquirente = await this.repository.findOne({
      where: { id },
      relations: ['conta_bancaria'],
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

    Object.assign(adquirente, updateDto);
    return await this.repository.save(adquirente);
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
}
