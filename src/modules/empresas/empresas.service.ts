import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Empresa } from './entities/empresa.entity';
import { CreateEmpresaDto } from './dto/create-empresa.dto';
import { UpdateEmpresaDto } from './dto/update-empresa.dto';

@Injectable()
export class EmpresasService {
  constructor(
    @InjectRepository(Empresa)
    private readonly empresaRepository: Repository<Empresa>,
  ) {}

  async create(createEmpresaDto: CreateEmpresaDto): Promise<Empresa> {
    // Verifica se o CNPJ já existe
    const empresaExistente = await this.empresaRepository.findOne({
      where: { cnpj: createEmpresaDto.cnpj },
    });

    if (empresaExistente) {
      throw new ConflictException('CNPJ já cadastrado');
    }

    const empresa = this.empresaRepository.create(createEmpresaDto);
    return await this.empresaRepository.save(empresa);
  }

  async findAll(): Promise<Empresa[]> {
    return await this.empresaRepository.find({
      order: {
        nomeFantasia: 'ASC',
      },
    });
  }

  async findOne(id: string): Promise<Empresa> {
    const empresa = await this.empresaRepository.findOne({
      where: { id },
    });

    if (!empresa) {
      throw new NotFoundException(`Empresa com ID ${id} não encontrada`);
    }

    return empresa;
  }

  async findByCnpj(cnpj: string): Promise<Empresa> {
    const empresa = await this.empresaRepository.findOne({
      where: { cnpj },
    });

    if (!empresa) {
      throw new NotFoundException(`Empresa com CNPJ ${cnpj} não encontrada`);
    }

    return empresa;
  }

  async findByTipo(tipo: string): Promise<Empresa[]> {
    return await this.empresaRepository.find({
      where: { tipoEmpresa: tipo as any },
      order: {
        nomeFantasia: 'ASC',
      },
    });
  }

  async update(
    id: string,
    updateEmpresaDto: UpdateEmpresaDto,
  ): Promise<Empresa> {
    const empresa = await this.findOne(id);

    // Se está tentando atualizar o CNPJ, verifica duplicidade
    if (updateEmpresaDto.cnpj && updateEmpresaDto.cnpj !== empresa.cnpj) {
      const empresaExistente = await this.empresaRepository.findOne({
        where: { cnpj: updateEmpresaDto.cnpj },
      });

      if (empresaExistente) {
        throw new ConflictException('CNPJ já cadastrado para outra empresa');
      }
    }

    Object.assign(empresa, updateEmpresaDto);
    return await this.empresaRepository.save(empresa);
  }

  async remove(id: string): Promise<void> {
    const empresa = await this.findOne(id);

    // Soft delete - apenas marca como inativo
    empresa.ativo = false;
    await this.empresaRepository.save(empresa);
  }

  async activate(id: string): Promise<Empresa> {
    const empresa = await this.findOne(id);
    empresa.ativo = true;
    return await this.empresaRepository.save(empresa);
  }

  async deactivate(id: string): Promise<Empresa> {
    const empresa = await this.findOne(id);
    empresa.ativo = false;
    return await this.empresaRepository.save(empresa);
  }

  // Métodos específicos para Laboratórios
  async findAllLaboratorios(): Promise<Empresa[]> {
    return await this.empresaRepository.find({
      where: { tipoEmpresa: 'LABORATORIO_APOIO' as any },
      order: { nomeFantasia: 'ASC' },
    });
  }

  async findLaboratoriosAtivos(): Promise<Empresa[]> {
    return await this.empresaRepository.find({
      where: {
        tipoEmpresa: 'LABORATORIO_APOIO' as any,
        ativo: true
      },
      order: { nomeFantasia: 'ASC' },
    });
  }

  // Métodos específicos para Convênios
  async findAllConvenios(): Promise<Empresa[]> {
    return await this.empresaRepository.find({
      where: { tipoEmpresa: 'CONVENIOS' as any },
      order: { nomeFantasia: 'ASC' },
    });
  }

  async findConveniosAtivos(): Promise<Empresa[]> {
    return await this.empresaRepository.find({
      where: {
        tipoEmpresa: 'CONVENIOS' as any,
        ativo: true
      },
      order: { nomeFantasia: 'ASC' },
    });
  }
}
