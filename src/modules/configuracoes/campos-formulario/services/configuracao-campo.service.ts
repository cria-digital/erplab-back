import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  ConfiguracaoCampoFormulario,
  TipoEntidadeEnum,
} from '../entities/configuracao-campo-formulario.entity';
import { CreateConfiguracaoCampoDto } from '../dto/create-configuracao-campo.dto';
import { UpdateConfiguracaoCampoDto } from '../dto/update-configuracao-campo.dto';

@Injectable()
export class ConfiguracaoCampoService {
  constructor(
    @InjectRepository(ConfiguracaoCampoFormulario)
    private readonly configuracaoRepository: Repository<ConfiguracaoCampoFormulario>,
  ) {}

  async create(
    dto: CreateConfiguracaoCampoDto,
  ): Promise<ConfiguracaoCampoFormulario> {
    const configuracao = this.configuracaoRepository.create(dto);
    return await this.configuracaoRepository.save(configuracao);
  }

  async findAll(): Promise<ConfiguracaoCampoFormulario[]> {
    return await this.configuracaoRepository.find({
      order: { tipoFormulario: 'ASC', nomeCampo: 'ASC' },
    });
  }

  async findOne(id: string): Promise<ConfiguracaoCampoFormulario> {
    const configuracao = await this.configuracaoRepository.findOne({
      where: { id },
    });

    if (!configuracao) {
      throw new NotFoundException(
        `Configuração de campo com ID ${id} não encontrada`,
      );
    }

    return configuracao;
  }

  async findByEntidade(
    entidadeTipo: TipoEntidadeEnum,
    entidadeId: string,
    tipoFormulario?: string,
  ): Promise<ConfiguracaoCampoFormulario[]> {
    const where: any = { entidadeTipo, entidadeId };

    if (tipoFormulario) {
      where.tipoFormulario = tipoFormulario;
    }

    return await this.configuracaoRepository.find({
      where,
      order: { tipoFormulario: 'ASC', nomeCampo: 'ASC' },
    });
  }

  async update(
    id: string,
    dto: UpdateConfiguracaoCampoDto,
  ): Promise<ConfiguracaoCampoFormulario> {
    const configuracao = await this.findOne(id);
    Object.assign(configuracao, dto);
    return await this.configuracaoRepository.save(configuracao);
  }

  async remove(id: string): Promise<void> {
    const configuracao = await this.findOne(id);
    await this.configuracaoRepository.remove(configuracao);
  }

  async configurarEmMassa(
    entidadeTipo: TipoEntidadeEnum,
    entidadeId: string,
    tipoFormulario: string,
    campos: Array<{ nomeCampo: string; obrigatorio: boolean }>,
  ): Promise<ConfiguracaoCampoFormulario[]> {
    // Remover configurações antigas
    await this.configuracaoRepository.delete({
      entidadeTipo,
      entidadeId,
      tipoFormulario,
    });

    // Criar novas configurações
    const configuracoes = campos.map((campo) =>
      this.configuracaoRepository.create({
        entidadeTipo,
        entidadeId,
        tipoFormulario,
        nomeCampo: campo.nomeCampo,
        obrigatorio: campo.obrigatorio,
      }),
    );

    return await this.configuracaoRepository.save(configuracoes);
  }

  async obterCamposObrigatorios(
    entidadeTipo: TipoEntidadeEnum,
    entidadeId: string,
    tipoFormulario: string,
  ): Promise<string[]> {
    const configuracoes = await this.configuracaoRepository.find({
      where: {
        entidadeTipo,
        entidadeId,
        tipoFormulario,
        obrigatorio: true,
      },
    });

    return configuracoes.map((config) => config.nomeCampo);
  }
}
