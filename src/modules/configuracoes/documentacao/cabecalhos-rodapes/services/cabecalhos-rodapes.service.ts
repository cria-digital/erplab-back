import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import {
  CabecalhoRodape,
  TipoCabecalhoRodape,
} from '../entities/cabecalho-rodape.entity';
import { CreateCabecalhoRodapeDto } from '../dto/create-cabecalho-rodape.dto';
import { FilterCabecalhoRodapeDto } from '../dto/filter-cabecalho-rodape.dto';

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
];
const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB
const UPLOAD_DIR = 'uploads/cabecalhos-rodapes';

@Injectable()
export class CabecalhosRodapesService {
  constructor(
    @InjectRepository(CabecalhoRodape)
    private readonly repository: Repository<CabecalhoRodape>,
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
    dto: CreateCabecalhoRodapeDto,
    file: Express.Multer.File,
  ): Promise<CabecalhoRodape> {
    // Validar arquivo
    this.validateFile(file);

    // Verificar se já existe para esta unidade e tipo
    const existente = await this.repository.findOne({
      where: { unidadeId: dto.unidadeId, tipo: dto.tipo },
    });

    if (existente) {
      throw new ConflictException(
        `Já existe um ${dto.tipo.toLowerCase()} cadastrado para esta unidade. Exclua o existente antes de adicionar um novo.`,
      );
    }

    // Criar diretório da unidade se não existir
    const unidadeDir = path.join(process.cwd(), UPLOAD_DIR, dto.unidadeId);
    if (!fs.existsSync(unidadeDir)) {
      fs.mkdirSync(unidadeDir, { recursive: true });
    }

    // Gerar nome do arquivo
    const ext = path.extname(file.originalname);
    const nomeArquivo = `${dto.tipo.toLowerCase()}${ext}`;
    const caminhoArquivo = path.join(UPLOAD_DIR, dto.unidadeId, nomeArquivo);
    const caminhoCompleto = path.join(process.cwd(), caminhoArquivo);

    // Salvar arquivo
    fs.writeFileSync(caminhoCompleto, file.buffer);

    // Criar registro no banco
    const cabecalhoRodape = this.repository.create({
      unidadeId: dto.unidadeId,
      tipo: dto.tipo,
      nomeArquivo: file.originalname,
      caminhoArquivo,
      mimeType: file.mimetype,
      tamanho: file.size,
    });

    return await this.repository.save(cabecalhoRodape);
  }

  async findAll(filter: FilterCabecalhoRodapeDto): Promise<CabecalhoRodape[]> {
    const whereConditions: Record<string, unknown> = { ativo: true };

    if (filter.unidadeId) {
      whereConditions.unidadeId = filter.unidadeId;
    }

    if (filter.tipo) {
      whereConditions.tipo = filter.tipo;
    }

    return await this.repository.find({
      where: whereConditions,
      order: { tipo: 'ASC' },
    });
  }

  async findOne(id: string): Promise<CabecalhoRodape> {
    const cabecalhoRodape = await this.repository.findOne({
      where: { id },
    });

    if (!cabecalhoRodape) {
      throw new NotFoundException(
        `Cabeçalho/Rodapé com ID ${id} não encontrado`,
      );
    }

    return cabecalhoRodape;
  }

  async findByUnidade(unidadeId: string): Promise<CabecalhoRodape[]> {
    return await this.repository.find({
      where: { unidadeId, ativo: true },
      order: { tipo: 'ASC' },
    });
  }

  async remove(id: string): Promise<void> {
    const cabecalhoRodape = await this.findOne(id);

    // Remover arquivo físico
    const caminhoCompleto = path.join(
      process.cwd(),
      cabecalhoRodape.caminhoArquivo,
    );
    if (fs.existsSync(caminhoCompleto)) {
      fs.unlinkSync(caminhoCompleto);
    }

    // Remover registro do banco
    await this.repository.remove(cabecalhoRodape);
  }

  async getFilePath(id: string): Promise<{
    path: string;
    filename: string;
    mimeType: string;
  }> {
    const cabecalhoRodape = await this.findOne(id);

    const caminhoCompleto = path.join(
      process.cwd(),
      cabecalhoRodape.caminhoArquivo,
    );

    if (!fs.existsSync(caminhoCompleto)) {
      throw new NotFoundException('Arquivo não encontrado no servidor');
    }

    return {
      path: caminhoCompleto,
      filename: cabecalhoRodape.nomeArquivo,
      mimeType: cabecalhoRodape.mimeType,
    };
  }

  async getEstatisticas(): Promise<{
    total: number;
    cabecalhos: number;
    rodapes: number;
  }> {
    const total = await this.repository.count({ where: { ativo: true } });

    const cabecalhos = await this.repository.count({
      where: { tipo: TipoCabecalhoRodape.CABECALHO, ativo: true },
    });

    const rodapes = await this.repository.count({
      where: { tipo: TipoCabecalhoRodape.RODAPE, ativo: true },
    });

    return {
      total,
      cabecalhos,
      rodapes,
    };
  }

  private validateFile(file: Express.Multer.File): void {
    if (!file) {
      throw new BadRequestException('Arquivo é obrigatório');
    }

    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      throw new BadRequestException(
        `Tipo de arquivo não permitido. Formatos aceitos: JPG, PNG, GIF, WEBP`,
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new BadRequestException(
        `Arquivo muito grande. Tamanho máximo permitido: 1MB`,
      );
    }
  }
}
