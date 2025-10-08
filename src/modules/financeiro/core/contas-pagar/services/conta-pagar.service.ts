import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { ContaPagar } from '../entities/conta-pagar.entity';
import { CreateContaPagarDto } from '../dto/create-conta-pagar.dto';
import { UpdateContaPagarDto } from '../dto/update-conta-pagar.dto';
import { StatusContaPagar } from '../enums/contas-pagar.enum';

@Injectable()
export class ContaPagarService {
  constructor(
    @InjectRepository(ContaPagar)
    private readonly contaPagarRepository: Repository<ContaPagar>,
    private readonly dataSource: DataSource,
  ) {}

  async create(dto: CreateContaPagarDto): Promise<ContaPagar> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Gerar código interno se não fornecido
      if (!dto.codigoInterno) {
        dto.codigoInterno = await this.generateCodigoInterno();
      }

      // Verificar código único
      const existing = await this.contaPagarRepository.findOne({
        where: { codigoInterno: dto.codigoInterno },
      });

      if (existing) {
        throw new ConflictException('Já existe uma conta com este código');
      }

      // Criar apenas conta sem relações (relações serão criadas por cascade)
      const contaData: any = {
        credorTipo: dto.credorTipo,
        credorId: dto.credorId,
        unidadeDevedoraId: dto.unidadeDevedoraId,
        tipoDocumento: dto.tipoDocumento,
        numeroDocumento: dto.numeroDocumento,
        descricao: dto.descricao,
        valorBruto: dto.valorBruto,
        valorLiquido: dto.valorLiquido,
        competencia: dto.competencia,
        dataEmissao: new Date(dto.dataEmissao),
        codigoInterno: dto.codigoInterno,
        status: dto.status,
        observacoes: dto.observacoes,
      };

      const conta = this.contaPagarRepository.create(contaData);
      const savedArray = await queryRunner.manager.save(conta);
      const saved = Array.isArray(savedArray) ? savedArray[0] : savedArray;

      await queryRunner.commitTransaction();
      return await this.findOne(saved.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(): Promise<ContaPagar[]> {
    return await this.contaPagarRepository.find({
      relations: [
        'unidadeDevedora',
        'composicoesFinanceiras',
        'impostosRetidos',
        'parcelas',
        'anexos',
      ],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<ContaPagar> {
    const conta = await this.contaPagarRepository.findOne({
      where: { id },
      relations: [
        'unidadeDevedora',
        'composicoesFinanceiras',
        'impostosRetidos',
        'parcelas',
        'anexos',
        'parcelamentoConfig',
      ],
    });

    if (!conta) {
      throw new NotFoundException(`Conta a pagar com ID ${id} não encontrada`);
    }

    return conta;
  }

  async findByStatus(status: StatusContaPagar): Promise<ContaPagar[]> {
    return await this.contaPagarRepository.find({
      where: { status },
      relations: ['unidadeDevedora', 'parcelas'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByCredor(
    credorTipo: string,
    credorId: string,
  ): Promise<ContaPagar[]> {
    return await this.contaPagarRepository.find({
      where: { credorTipo: credorTipo as any, credorId },
      relations: ['unidadeDevedora', 'parcelas'],
      order: { createdAt: 'DESC' },
    });
  }

  async update(id: string, dto: UpdateContaPagarDto): Promise<ContaPagar> {
    const conta = await this.findOne(id);

    Object.assign(conta, dto);
    await this.contaPagarRepository.save(conta);

    return await this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const conta = await this.findOne(id);
    await this.contaPagarRepository.remove(conta);
  }

  async updateStatus(
    id: string,
    status: StatusContaPagar,
  ): Promise<ContaPagar> {
    const conta = await this.findOne(id);
    conta.status = status;
    await this.contaPagarRepository.save(conta);
    return await this.findOne(id);
  }

  private async generateCodigoInterno(): Promise<string> {
    const ano = new Date().getFullYear();
    const ultimaConta = await this.contaPagarRepository
      .createQueryBuilder('conta')
      .where('conta.codigo_interno LIKE :prefix', { prefix: `CAP${ano}%` })
      .orderBy('conta.codigo_interno', 'DESC')
      .getOne();

    if (!ultimaConta) {
      return `CAP${ano}0001`;
    }

    const ultimoNumero = parseInt(ultimaConta.codigoInterno.substring(7));
    const proximoNumero = (ultimoNumero + 1).toString().padStart(4, '0');
    return `CAP${ano}${proximoNumero}`;
  }
}
