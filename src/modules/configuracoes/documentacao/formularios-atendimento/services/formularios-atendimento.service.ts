import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { FormularioAtendimento } from '../entities/formulario-atendimento.entity';
import { CreateFormularioAtendimentoDto } from '../dto/create-formulario-atendimento.dto';
import { FilterFormularioAtendimentoDto } from '../dto/filter-formulario-atendimento.dto';

const ALLOWED_MIME_TYPES = ['application/pdf'];
const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB
const UPLOAD_DIR = 'uploads/formularios-atendimento';

@Injectable()
export class FormulariosAtendimentoService {
  constructor(
    @InjectRepository(FormularioAtendimento)
    private readonly repository: Repository<FormularioAtendimento>,
  ) {
    this.ensureUploadDirExists();
  }

  private ensureUploadDirExists(): void {
    const uploadPath = path.join(process.cwd(), UPLOAD_DIR);
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
  }

  async create(
    dto: CreateFormularioAtendimentoDto,
    file: Express.Multer.File,
  ): Promise<FormularioAtendimento> {
    // Validar arquivo
    this.validateFile(file);

    // Criar diretório da unidade se não existir
    const unidadeDir = path.join(process.cwd(), UPLOAD_DIR, dto.unidadeId);
    if (!fs.existsSync(unidadeDir)) {
      fs.mkdirSync(unidadeDir, { recursive: true });
    }

    // Gerar nome único para o arquivo
    const fileId = uuidv4();
    const ext = path.extname(file.originalname);
    const nomeArquivoSalvo = `${fileId}${ext}`;
    const caminhoArquivo = path.join(
      UPLOAD_DIR,
      dto.unidadeId,
      nomeArquivoSalvo,
    );
    const caminhoCompleto = path.join(process.cwd(), caminhoArquivo);

    // Salvar arquivo
    fs.writeFileSync(caminhoCompleto, file.buffer);

    // Criar registro no banco
    const formulario = this.repository.create({
      unidadeId: dto.unidadeId,
      nomeDocumento: file.originalname,
      caminhoArquivo,
      observacao: dto.observacao,
      mimeType: file.mimetype,
      tamanho: file.size,
    });

    return await this.repository.save(formulario);
  }

  async findAll(
    filter: FilterFormularioAtendimentoDto,
  ): Promise<FormularioAtendimento[]> {
    const whereConditions: Record<string, unknown> = { ativo: true };

    if (filter.unidadeId) {
      whereConditions.unidadeId = filter.unidadeId;
    }

    return await this.repository.find({
      where: whereConditions,
      order: { criadoEm: 'DESC' },
    });
  }

  async findOne(id: string): Promise<FormularioAtendimento> {
    const formulario = await this.repository.findOne({
      where: { id },
    });

    if (!formulario) {
      throw new NotFoundException(
        `Formulário de atendimento com ID ${id} não encontrado`,
      );
    }

    return formulario;
  }

  async findByUnidade(unidadeId: string): Promise<FormularioAtendimento[]> {
    return await this.repository.find({
      where: { unidadeId, ativo: true },
      order: { criadoEm: 'DESC' },
    });
  }

  async remove(id: string): Promise<void> {
    const formulario = await this.findOne(id);

    // Remover arquivo físico
    const caminhoCompleto = path.join(process.cwd(), formulario.caminhoArquivo);
    if (fs.existsSync(caminhoCompleto)) {
      fs.unlinkSync(caminhoCompleto);
    }

    // Remover registro do banco
    await this.repository.remove(formulario);
  }

  async getFilePath(id: string): Promise<{
    path: string;
    filename: string;
    mimeType: string;
  }> {
    const formulario = await this.findOne(id);

    const caminhoCompleto = path.join(process.cwd(), formulario.caminhoArquivo);

    if (!fs.existsSync(caminhoCompleto)) {
      throw new NotFoundException('Arquivo não encontrado no servidor');
    }

    return {
      path: caminhoCompleto,
      filename: formulario.nomeDocumento,
      mimeType: formulario.mimeType,
    };
  }

  async getEstatisticas(): Promise<{
    total: number;
  }> {
    const total = await this.repository.count({ where: { ativo: true } });

    return {
      total,
    };
  }

  private validateFile(file: Express.Multer.File): void {
    if (!file) {
      throw new BadRequestException('Arquivo é obrigatório');
    }

    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      throw new BadRequestException(
        `Tipo de arquivo não permitido. Formato aceito: PDF`,
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new BadRequestException(
        `Arquivo muito grande. Tamanho máximo permitido: 1MB`,
      );
    }
  }
}
