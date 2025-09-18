import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profissional } from '../entities/profissional.entity';
import { DocumentoProfissional } from '../entities/documento-profissional.entity';
import { Endereco } from '../../../comum/entities/endereco.entity';
import { Agenda } from '../../agendas/entities/agenda.entity';
import { CreateProfissionalDto } from '../dto/create-profissional.dto';
import { UpdateProfissionalDto } from '../dto/update-profissional.dto';
import { CreateDocumentoDto } from '../dto/create-documento.dto';

@Injectable()
export class ProfissionaisService {
  constructor(
    @InjectRepository(Profissional)
    private profissionalRepository: Repository<Profissional>,
    @InjectRepository(DocumentoProfissional)
    private documentoRepository: Repository<DocumentoProfissional>,
    @InjectRepository(Endereco)
    private enderecoRepository: Repository<Endereco>,
    @InjectRepository(Agenda)
    private agendaRepository: Repository<Agenda>,
  ) {}

  async create(
    createProfissionalDto: CreateProfissionalDto,
  ): Promise<Profissional> {
    const profissionalData: any = { ...createProfissionalDto };

    if (createProfissionalDto.endereco) {
      const endereco = this.enderecoRepository.create(
        createProfissionalDto.endereco,
      );
      const savedEndereco = (await this.enderecoRepository.save(
        endereco,
      )) as unknown as Endereco;
      profissionalData.enderecoId = savedEndereco.id;
      delete profissionalData.endereco;
    }

    const profissional = this.profissionalRepository.create(profissionalData);
    return this.profissionalRepository.save(
      profissional,
    ) as unknown as Promise<Profissional>;
  }

  async findAll(): Promise<Profissional[]> {
    return await this.profissionalRepository.find({
      relations: ['documentos', 'endereco', 'agendas'],
    });
  }

  async findOne(id: string): Promise<Profissional> {
    const profissional = await this.profissionalRepository.findOne({
      where: { id },
      relations: ['documentos', 'endereco', 'agendas'],
    });

    if (!profissional) {
      throw new NotFoundException(`Profissional com ID ${id} não encontrado`);
    }

    return profissional;
  }

  async findByCpf(cpf: string): Promise<Profissional> {
    const profissional = await this.profissionalRepository.findOne({
      where: { cpf },
      relations: ['documentos', 'endereco', 'agendas'],
    });

    if (!profissional) {
      throw new NotFoundException(`Profissional com CPF ${cpf} não encontrado`);
    }

    return profissional;
  }

  async update(
    id: string,
    updateProfissionalDto: UpdateProfissionalDto,
  ): Promise<Profissional> {
    const updateData: any = { ...updateProfissionalDto };

    if (updateProfissionalDto.endereco) {
      const profissional = await this.findOne(id);
      if (profissional.enderecoId) {
        await this.enderecoRepository.update(
          profissional.enderecoId,
          updateProfissionalDto.endereco,
        );
      } else {
        const endereco = this.enderecoRepository.create(
          updateProfissionalDto.endereco,
        );
        const savedEndereco = (await this.enderecoRepository.save(
          endereco,
        )) as unknown as Endereco;
        updateData.enderecoId = savedEndereco.id;
      }
      delete updateData.endereco;
    }

    await this.profissionalRepository.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const result = await this.profissionalRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Profissional com ID ${id} não encontrado`);
    }
  }

  async addDocumento(
    profissionalId: string,
    documentoDto: CreateDocumentoDto,
  ): Promise<DocumentoProfissional> {
    const profissional = await this.findOne(profissionalId);
    const documento = this.documentoRepository.create({
      ...documentoDto,
      profissionalId: profissional.id,
    });
    return this.documentoRepository.save(
      documento,
    ) as unknown as Promise<DocumentoProfissional>;
  }

  async updateDocumento(
    documentoId: string,
    updateDocumentoDto: CreateDocumentoDto,
  ): Promise<DocumentoProfissional> {
    await this.documentoRepository.update(documentoId, updateDocumentoDto);
    const documento = await this.documentoRepository.findOne({
      where: { id: documentoId },
    });

    if (!documento) {
      throw new NotFoundException(
        `Documento com ID ${documentoId} não encontrado`,
      );
    }

    return documento;
  }

  async removeDocumento(documentoId: string): Promise<void> {
    const result = await this.documentoRepository.delete(documentoId);
    if (result.affected === 0) {
      throw new NotFoundException(
        `Documento com ID ${documentoId} não encontrado`,
      );
    }
  }

  async vincularAgenda(
    profissionalId: string,
    agendaId: string,
  ): Promise<Profissional> {
    const profissional = await this.findOne(profissionalId);

    const agenda = await this.agendaRepository.findOne({
      where: { id: agendaId },
      relations: ['profissionais'],
    });

    if (!agenda) {
      throw new NotFoundException('Agenda não encontrada');
    }

    const jaVinculado = profissional.agendas?.some((a) => a.id === agendaId);
    if (jaVinculado) {
      throw new BadRequestException(
        'Agenda já está vinculada a este profissional',
      );
    }

    if (!profissional.agendas) {
      profissional.agendas = [];
    }

    profissional.agendas.push(agenda);
    await this.profissionalRepository.save(profissional);

    return this.findOne(profissionalId);
  }

  async desvincularAgenda(
    profissionalId: string,
    agendaId: string,
  ): Promise<Profissional> {
    const profissional = await this.findOne(profissionalId);

    const agenda = await this.agendaRepository.findOne({
      where: { id: agendaId },
    });

    if (!agenda) {
      throw new NotFoundException('Agenda não encontrada');
    }

    const vinculoExiste = profissional.agendas?.some((a) => a.id === agendaId);
    if (!vinculoExiste) {
      throw new BadRequestException(
        'Agenda não está vinculada a este profissional',
      );
    }

    profissional.agendas = profissional.agendas.filter(
      (a) => a.id !== agendaId,
    );

    await this.profissionalRepository.save(profissional);

    return this.findOne(profissionalId);
  }
}
