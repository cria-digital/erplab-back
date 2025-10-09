import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  EtiquetaAmostra,
  TipoImpressora,
} from '../entities/etiqueta-amostra.entity';
import { CreateEtiquetaAmostraDto } from '../dto/create-etiqueta-amostra.dto';
import { UpdateEtiquetaAmostraDto } from '../dto/update-etiqueta-amostra.dto';

@Injectable()
export class EtiquetasAmostraService {
  constructor(
    @InjectRepository(EtiquetaAmostra)
    private readonly etiquetaAmostraRepository: Repository<EtiquetaAmostra>,
  ) {}

  async create(
    createEtiquetaAmostraDto: CreateEtiquetaAmostraDto,
    criadoPor: string,
  ): Promise<EtiquetaAmostra> {
    const etiqueta = this.etiquetaAmostraRepository.create({
      ...createEtiquetaAmostraDto,
      criadoPor,
      atualizadoPor: criadoPor,
    });

    return await this.etiquetaAmostraRepository.save(etiqueta);
  }

  async findAll(): Promise<EtiquetaAmostra[]> {
    return await this.etiquetaAmostraRepository.find({
      relations: ['unidade'],
      order: { nome: 'ASC' },
    });
  }

  async findAllAtivas(): Promise<EtiquetaAmostra[]> {
    return await this.etiquetaAmostraRepository.find({
      where: { ativo: true },
      relations: ['unidade'],
      order: { nome: 'ASC' },
    });
  }

  async findOne(id: string): Promise<EtiquetaAmostra> {
    const etiqueta = await this.etiquetaAmostraRepository.findOne({
      where: { id },
      relations: ['unidade'],
    });

    if (!etiqueta) {
      throw new NotFoundException(
        `Etiqueta de Amostra com ID ${id} não encontrada`,
      );
    }

    return etiqueta;
  }

  async findByTipoImpressora(
    tipoImpressora: TipoImpressora,
  ): Promise<EtiquetaAmostra[]> {
    return await this.etiquetaAmostraRepository.find({
      where: { tipoImpressora },
      relations: ['unidade'],
      order: { nome: 'ASC' },
    });
  }

  async findPadrao(unidadeId: string): Promise<EtiquetaAmostra> {
    const etiqueta = await this.etiquetaAmostraRepository.findOne({
      where: { padrao: true, unidadeId, ativo: true },
      relations: ['unidade'],
    });

    if (!etiqueta) {
      throw new NotFoundException(
        `Etiqueta padrão não encontrada para a unidade ${unidadeId}`,
      );
    }

    return etiqueta;
  }

  async findByUnidade(unidadeId: string): Promise<EtiquetaAmostra[]> {
    return await this.etiquetaAmostraRepository.find({
      where: { unidadeId },
      order: { nome: 'ASC' },
    });
  }

  async update(
    id: string,
    updateEtiquetaAmostraDto: UpdateEtiquetaAmostraDto,
    atualizadoPor: string,
  ): Promise<EtiquetaAmostra> {
    const etiqueta = await this.findOne(id);

    Object.assign(etiqueta, updateEtiquetaAmostraDto, { atualizadoPor });

    return await this.etiquetaAmostraRepository.save(etiqueta);
  }

  async toggleAtivo(
    id: string,
    atualizadoPor: string,
  ): Promise<EtiquetaAmostra> {
    const etiqueta = await this.findOne(id);
    etiqueta.ativo = !etiqueta.ativo;
    etiqueta.atualizadoPor = atualizadoPor;

    return await this.etiquetaAmostraRepository.save(etiqueta);
  }

  async setPadrao(id: string, atualizadoPor: string): Promise<EtiquetaAmostra> {
    const etiqueta = await this.findOne(id);

    // Remove o padrão de outras etiquetas da mesma unidade
    await this.etiquetaAmostraRepository.update(
      { unidadeId: etiqueta.unidadeId, padrao: true },
      { padrao: false },
    );

    // Define a nova etiqueta padrão
    etiqueta.padrao = true;
    etiqueta.atualizadoPor = atualizadoPor;

    return await this.etiquetaAmostraRepository.save(etiqueta);
  }

  async remove(id: string): Promise<void> {
    const etiqueta = await this.findOne(id);
    await this.etiquetaAmostraRepository.remove(etiqueta);
  }

  async getEstatisticas() {
    const total = await this.etiquetaAmostraRepository.count();
    const ativas = await this.etiquetaAmostraRepository.count({
      where: { ativo: true },
    });
    const inativas = total - ativas;

    const porTipoImpressora = await this.etiquetaAmostraRepository
      .createQueryBuilder('etiqueta')
      .select('etiqueta.tipo_impressora', 'tipo')
      .addSelect('COUNT(*)', 'quantidade')
      .groupBy('etiqueta.tipo_impressora')
      .getRawMany();

    const comCodigoBarras = await this.etiquetaAmostraRepository.count({
      where: { exibirCodigoBarras: true },
    });

    const comLogo = await this.etiquetaAmostraRepository.count({
      where: { exibirLogo: true },
    });

    return {
      total,
      ativas,
      inativas,
      porTipoImpressora,
      comCodigoBarras,
      comLogo,
    };
  }
}
