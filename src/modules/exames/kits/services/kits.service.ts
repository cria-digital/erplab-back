import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Kit, StatusKitEnum } from '../entities/kit.entity';
import { KitExame } from '../entities/kit-exame.entity';
import { KitUnidade } from '../entities/kit-unidade.entity';
import { KitConvenio } from '../entities/kit-convenio.entity';
import { CreateKitDto } from '../dto/create-kit.dto';
import { UpdateKitDto } from '../dto/update-kit.dto';
import { Exame } from '../../exames/entities/exame.entity';
import { UnidadeSaude } from '../../../cadastros/unidade-saude/entities/unidade-saude.entity';
import { Convenio } from '../../../relacionamento/convenios/entities/convenio.entity';

@Injectable()
export class KitsService {
  constructor(
    @InjectRepository(Kit)
    private readonly kitRepository: Repository<Kit>,
    @InjectRepository(KitExame)
    private readonly kitExameRepository: Repository<KitExame>,
    @InjectRepository(KitUnidade)
    private readonly kitUnidadeRepository: Repository<KitUnidade>,
    @InjectRepository(KitConvenio)
    private readonly kitConvenioRepository: Repository<KitConvenio>,
    @InjectRepository(Exame)
    private readonly exameRepository: Repository<Exame>,
    @InjectRepository(UnidadeSaude)
    private readonly unidadeRepository: Repository<UnidadeSaude>,
    @InjectRepository(Convenio)
    private readonly convenioRepository: Repository<Convenio>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createKitDto: CreateKitDto): Promise<Kit> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Verificar se código interno já existe
      const existingKit = await this.kitRepository.findOne({
        where: { codigoInterno: createKitDto.codigoInterno },
      });

      if (existingKit) {
        throw new ConflictException(
          `Kit com código ${createKitDto.codigoInterno} já existe`,
        );
      }

      // Criar o kit principal
      const kit = this.kitRepository.create({
        codigoInterno: createKitDto.codigoInterno,
        nomeKit: createKitDto.nomeKit,
        descricao: createKitDto.descricao,
        statusKit: createKitDto.statusKit || StatusKitEnum.ATIVO,
        empresaId: createKitDto.empresaId,
        prazoPadraoEntrega: createKitDto.prazoPadraoEntrega,
        precoKit: createKitDto.precoKit,
      });

      const savedKit = await queryRunner.manager.save(kit);

      // Adicionar exames se fornecidos
      if (createKitDto.exames && createKitDto.exames.length > 0) {
        for (const exameDto of createKitDto.exames) {
          const exame = await this.exameRepository.findOne({
            where: { id: exameDto.exameId },
          });

          if (!exame) {
            throw new NotFoundException(
              `Exame com ID ${exameDto.exameId} não encontrado`,
            );
          }

          const kitExame = this.kitExameRepository.create({
            kitId: savedKit.id,
            exameId: exame.id,
            quantidade: exameDto.quantidade || 1,
            ordemInsercao: exameDto.ordemInsercao,
            observacoes: exameDto.observacoes,
          });

          await queryRunner.manager.save(kitExame);
        }
      }

      // Adicionar unidades se fornecidas
      if (createKitDto.unidades && createKitDto.unidades.length > 0) {
        for (const unidadeDto of createKitDto.unidades) {
          const unidade = await this.unidadeRepository.findOne({
            where: { id: unidadeDto.unidadeId },
          });

          if (!unidade) {
            throw new NotFoundException(
              `Unidade com ID ${unidadeDto.unidadeId} não encontrada`,
            );
          }

          const kitUnidade = this.kitUnidadeRepository.create({
            kitId: savedKit.id,
            unidadeId: unidade.id,
          });

          await queryRunner.manager.save(kitUnidade);
        }
      }

      // Adicionar convênios se fornecidos
      if (createKitDto.convenios && createKitDto.convenios.length > 0) {
        for (const convenioDto of createKitDto.convenios) {
          const convenio = await this.convenioRepository.findOne({
            where: { id: convenioDto.convenioId },
          });

          if (!convenio) {
            throw new NotFoundException(
              `Convênio com ID ${convenioDto.convenioId} não encontrado`,
            );
          }

          const kitConvenio = this.kitConvenioRepository.create({
            kitId: savedKit.id,
            convenioId: convenio.id,
          });

          await queryRunner.manager.save(kitConvenio);
        }
      }

      await queryRunner.commitTransaction();

      return this.findOne(savedKit.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(): Promise<Kit[]> {
    return this.kitRepository.find({
      relations: [
        'empresa',
        'criadoPor',
        'atualizadoPor',
        'kitExames',
        'kitExames.exame',
        'kitUnidades',
        'kitUnidades.unidade',
        'kitConvenios',
        'kitConvenios.convenio',
      ],
      order: {
        nomeKit: 'ASC',
        kitExames: {
          ordemInsercao: 'ASC',
        },
      },
    });
  }

  async findOne(id: string): Promise<Kit> {
    const kit = await this.kitRepository.findOne({
      where: { id },
      relations: [
        'empresa',
        'criadoPor',
        'atualizadoPor',
        'kitExames',
        'kitExames.exame',
        'kitUnidades',
        'kitUnidades.unidade',
        'kitConvenios',
        'kitConvenios.convenio',
      ],
      order: {
        kitExames: {
          ordemInsercao: 'ASC',
        },
      },
    });

    if (!kit) {
      throw new NotFoundException(`Kit com ID ${id} não encontrado`);
    }

    return kit;
  }

  async findByCodigo(codigo: string): Promise<Kit> {
    const kit = await this.kitRepository.findOne({
      where: { codigoInterno: codigo },
      relations: [
        'empresa',
        'criadoPor',
        'atualizadoPor',
        'kitExames',
        'kitExames.exame',
        'kitUnidades',
        'kitUnidades.unidade',
        'kitConvenios',
        'kitConvenios.convenio',
      ],
    });

    if (!kit) {
      throw new NotFoundException(`Kit com código ${codigo} não encontrado`);
    }

    return kit;
  }

  async findByUnidade(unidadeId: string): Promise<Kit[]> {
    const kitUnidades = await this.kitUnidadeRepository.find({
      where: { unidadeId },
      relations: ['kit', 'kit.empresa', 'kit.kitExames', 'kit.kitExames.exame'],
    });

    return kitUnidades.map((ku) => ku.kit);
  }

  async findByConvenio(convenioId: string): Promise<Kit[]> {
    const kitConvenios = await this.kitConvenioRepository.find({
      where: { convenioId },
      relations: ['kit', 'kit.empresa', 'kit.kitExames', 'kit.kitExames.exame'],
    });

    return kitConvenios.map((kc) => kc.kit);
  }

  async findAtivos(): Promise<Kit[]> {
    return this.kitRepository.find({
      where: { statusKit: StatusKitEnum.ATIVO },
      relations: [
        'empresa',
        'criadoPor',
        'atualizadoPor',
        'kitExames',
        'kitExames.exame',
        'kitUnidades',
        'kitUnidades.unidade',
        'kitConvenios',
        'kitConvenios.convenio',
      ],
      order: {
        nomeKit: 'ASC',
      },
    });
  }

  async update(id: string, updateKitDto: UpdateKitDto): Promise<Kit> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const kit = await this.findOne(id);

      // Atualizar dados básicos do kit
      Object.assign(kit, {
        nomeKit: updateKitDto.nomeKit ?? kit.nomeKit,
        descricao: updateKitDto.descricao ?? kit.descricao,
        statusKit: updateKitDto.statusKit ?? kit.statusKit,
        prazoPadraoEntrega:
          updateKitDto.prazoPadraoEntrega ?? kit.prazoPadraoEntrega,
        precoKit: updateKitDto.precoKit ?? kit.precoKit,
      });

      await queryRunner.manager.save(kit);

      // Atualizar exames se fornecidos
      if (updateKitDto.exames !== undefined) {
        // Remover exames existentes
        await queryRunner.manager.delete(KitExame, { kitId: id });

        // Adicionar novos exames
        for (const exameDto of updateKitDto.exames) {
          const exame = await this.exameRepository.findOne({
            where: { id: exameDto.exameId },
          });

          if (!exame) {
            throw new NotFoundException(
              `Exame com ID ${exameDto.exameId} não encontrado`,
            );
          }

          const kitExame = this.kitExameRepository.create({
            kitId: id,
            exameId: exame.id,
            quantidade: exameDto.quantidade || 1,
            ordemInsercao: exameDto.ordemInsercao,
            observacoes: exameDto.observacoes,
          });

          await queryRunner.manager.save(kitExame);
        }
      }

      // Atualizar unidades se fornecidas
      if (updateKitDto.unidades !== undefined) {
        await queryRunner.manager.delete(KitUnidade, { kitId: id });

        for (const unidadeDto of updateKitDto.unidades) {
          const unidade = await this.unidadeRepository.findOne({
            where: { id: unidadeDto.unidadeId },
          });

          if (!unidade) {
            throw new NotFoundException(
              `Unidade com ID ${unidadeDto.unidadeId} não encontrada`,
            );
          }

          const kitUnidade = this.kitUnidadeRepository.create({
            kitId: id,
            unidadeId: unidade.id,
          });

          await queryRunner.manager.save(kitUnidade);
        }
      }

      // Atualizar convênios se fornecidos
      if (updateKitDto.convenios !== undefined) {
        await queryRunner.manager.delete(KitConvenio, { kitId: id });

        for (const convenioDto of updateKitDto.convenios) {
          const convenio = await this.convenioRepository.findOne({
            where: { id: convenioDto.convenioId },
          });

          if (!convenio) {
            throw new NotFoundException(
              `Convênio com ID ${convenioDto.convenioId} não encontrado`,
            );
          }

          const kitConvenio = this.kitConvenioRepository.create({
            kitId: id,
            convenioId: convenio.id,
          });

          await queryRunner.manager.save(kitConvenio);
        }
      }

      await queryRunner.commitTransaction();

      return this.findOne(id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: string): Promise<void> {
    const kit = await this.findOne(id);
    await this.kitRepository.remove(kit);
  }

  async toggleStatus(id: string): Promise<Kit> {
    const kit = await this.findOne(id);

    kit.statusKit =
      kit.statusKit === StatusKitEnum.ATIVO
        ? StatusKitEnum.INATIVO
        : StatusKitEnum.ATIVO;

    await this.kitRepository.save(kit);
    return kit;
  }

  async duplicateKit(id: string, novoCodigoInterno: string): Promise<Kit> {
    const kitOriginal = await this.findOne(id);

    const createDto: CreateKitDto = {
      codigoInterno: novoCodigoInterno,
      nomeKit: `${kitOriginal.nomeKit} (Cópia)`,
      descricao: kitOriginal.descricao,
      statusKit: StatusKitEnum.EM_REVISAO,
      empresaId: kitOriginal.empresaId,
      prazoPadraoEntrega: kitOriginal.prazoPadraoEntrega,
      precoKit: kitOriginal.precoKit,
      exames: kitOriginal.kitExames.map((ke) => ({
        exameId: ke.exameId,
        quantidade: ke.quantidade,
        ordemInsercao: ke.ordemInsercao,
        observacoes: ke.observacoes,
      })),
      unidades: kitOriginal.kitUnidades.map((ku) => ({
        unidadeId: ku.unidadeId,
      })),
      convenios: kitOriginal.kitConvenios.map((kc) => ({
        convenioId: kc.convenioId,
      })),
    };

    return this.create(createDto);
  }
}
