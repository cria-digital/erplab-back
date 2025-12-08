import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import {
  ConfiguracaoCampoFormulario,
  TipoEntidadeEnum,
  TipoFormularioEnum,
} from '../entities/configuracao-campo-formulario.entity';
import { CreateConfiguracaoCampoDto } from '../dto/create-configuracao-campo.dto';
import { UpdateConfiguracaoCampoDto } from '../dto/update-configuracao-campo.dto';

@Injectable()
export class ConfiguracaoCampoService {
  constructor(
    @InjectRepository(ConfiguracaoCampoFormulario)
    private readonly configuracaoRepository: Repository<ConfiguracaoCampoFormulario>,
    private readonly dataSource: DataSource,
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
    tipoFormulario?: TipoFormularioEnum,
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
    tipoFormulario: TipoFormularioEnum,
    campos: Array<{ nomeCampo: string; obrigatorio: boolean }>,
  ): Promise<{
    criados: ConfiguracaoCampoFormulario[];
    erros: Array<{ index: number; nomeCampo: string; erro: string }>;
  }> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const criados: ConfiguracaoCampoFormulario[] = [];
    const erros: Array<{ index: number; nomeCampo: string; erro: string }> = [];

    try {
      // Remover configurações antigas
      await queryRunner.manager.delete(ConfiguracaoCampoFormulario, {
        entidadeTipo,
        entidadeId,
        tipoFormulario,
      });

      // Criar novas configurações
      for (let i = 0; i < campos.length; i++) {
        const campo = campos[i];
        try {
          const configuracao = queryRunner.manager.create(
            ConfiguracaoCampoFormulario,
            {
              entidadeTipo,
              entidadeId,
              tipoFormulario,
              nomeCampo: campo.nomeCampo,
              obrigatorio: campo.obrigatorio,
            },
          );
          const salvo = await queryRunner.manager.save(configuracao);
          criados.push(salvo);
        } catch (error) {
          erros.push({
            index: i,
            nomeCampo: campo.nomeCampo,
            erro: error.message || 'Erro ao criar configuração',
          });
        }
      }

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }

    return { criados, erros };
  }

  async obterCamposObrigatorios(
    entidadeTipo: TipoEntidadeEnum,
    entidadeId: string,
    tipoFormulario: TipoFormularioEnum,
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
