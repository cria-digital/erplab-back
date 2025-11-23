import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Telemedicina } from '../entities/telemedicina.entity';
import { Empresa } from '../../../cadastros/empresas/entities/empresa.entity';
import { UpdateTelemedicinaDto } from '../dto/update-telemedicina.dto';

@Injectable()
export class TelemedicinaService {
  constructor(
    @InjectRepository(Telemedicina)
    private readonly telemedicinaRepository: Repository<Telemedicina>,
    @InjectRepository(Empresa)
    private readonly empresaRepository: Repository<Empresa>,
    private readonly dataSource: DataSource,
  ) {}

  async findAll(): Promise<Telemedicina[]> {
    const telemedicinas = await this.telemedicinaRepository.find({
      relations: ['empresa'],
    });

    // Ordenar pelo nome fantasia da empresa
    return telemedicinas.sort((a, b) =>
      a.empresa.nomeFantasia.localeCompare(b.empresa.nomeFantasia),
    );
  }

  async findOne(id: string): Promise<Telemedicina> {
    const telemedicina = await this.telemedicinaRepository.findOne({
      where: { id },
      relations: ['empresa'],
    });

    if (!telemedicina) {
      throw new NotFoundException(`Telemedicina com ID ${id} não encontrada`);
    }

    return telemedicina;
  }

  async findByCodigo(codigo: string): Promise<Telemedicina> {
    const telemedicina = await this.telemedicinaRepository.findOne({
      where: { codigo_telemedicina: codigo },
      relations: ['empresa'],
    });

    if (!telemedicina) {
      throw new NotFoundException(
        `Telemedicina com código ${codigo} não encontrada`,
      );
    }

    return telemedicina;
  }

  async findByCnpj(cnpj: string): Promise<Telemedicina> {
    const telemedicina = await this.telemedicinaRepository
      .createQueryBuilder('telemedicina')
      .leftJoinAndSelect('telemedicina.empresa', 'empresa')
      .where('empresa.cnpj = :cnpj', { cnpj })
      .getOne();

    if (!telemedicina) {
      throw new NotFoundException(
        `Telemedicina com CNPJ ${cnpj} não encontrada`,
      );
    }

    return telemedicina;
  }

  async findAtivos(): Promise<Telemedicina[]> {
    return await this.telemedicinaRepository
      .createQueryBuilder('telemedicina')
      .leftJoinAndSelect('telemedicina.empresa', 'empresa')
      .where('empresa.ativo = :ativo', { ativo: true })
      .orderBy('empresa.nomeFantasia', 'ASC')
      .getMany();
  }

  async update(
    id: string,
    updateTelemedicinaDto: UpdateTelemedicinaDto,
  ): Promise<Telemedicina> {
    const telemedicina = await this.findOne(id);

    // Atualizar dados da telemedicina (apenas integracaoId e observacoes)
    if (updateTelemedicinaDto.integracaoId !== undefined) {
      telemedicina.integracao_id = updateTelemedicinaDto.integracaoId;
    }
    if (updateTelemedicinaDto.observacoes !== undefined) {
      telemedicina.observacoes = updateTelemedicinaDto.observacoes;
    }

    await this.telemedicinaRepository.save(telemedicina);
    return await this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const telemedicina = await this.findOne(id);
    await this.telemedicinaRepository.remove(telemedicina);
  }

  async toggleStatus(id: string): Promise<Telemedicina> {
    const telemedicina = await this.findOne(id);
    // Toggle status na empresa
    telemedicina.empresa.ativo = !telemedicina.empresa.ativo;
    await this.empresaRepository.save(telemedicina.empresa);
    return await this.findOne(id);
  }

  async search(query: string): Promise<Telemedicina[]> {
    return await this.telemedicinaRepository
      .createQueryBuilder('telemedicina')
      .leftJoinAndSelect('telemedicina.empresa', 'empresa')
      .where('empresa.nomeFantasia ILIKE :query', { query: `%${query}%` })
      .orWhere('empresa.razaoSocial ILIKE :query', { query: `%${query}%` })
      .orWhere('empresa.cnpj LIKE :query', { query: `%${query}%` })
      .orWhere('telemedicina.codigo_telemedicina LIKE :query', {
        query: `%${query}%`,
      })
      .orderBy('empresa.nomeFantasia', 'ASC')
      .getMany();
  }
}
