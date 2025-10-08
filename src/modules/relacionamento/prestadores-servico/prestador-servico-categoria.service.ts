import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  PrestadorServicoCategoria,
  TipoServicoCategoria,
} from './entities/prestador-servico-categoria.entity';
import { PrestadorServico } from './entities/prestador-servico.entity';
import { CreatePrestadorServicoCategoriaDto } from './dto/create-prestador-servico-categoria.dto';
import { UpdatePrestadorServicoCategoriaDto } from './dto/update-prestador-servico-categoria.dto';

@Injectable()
export class PrestadorServicoCategoriaService {
  constructor(
    @InjectRepository(PrestadorServicoCategoria)
    private readonly categoriaRepository: Repository<PrestadorServicoCategoria>,
    @InjectRepository(PrestadorServico)
    private readonly prestadorRepository: Repository<PrestadorServico>,
  ) {}

  async create(
    createDto: CreatePrestadorServicoCategoriaDto,
  ): Promise<PrestadorServicoCategoria> {
    // Verificar se o prestador existe
    const prestador = await this.prestadorRepository.findOne({
      where: { id: createDto.prestadorServicoId },
    });

    if (!prestador) {
      throw new NotFoundException(
        `Prestador ${createDto.prestadorServicoId} não encontrado`,
      );
    }

    // Verificar se já existe categoria do mesmo tipo para o prestador
    const existing = await this.categoriaRepository.findOne({
      where: {
        prestadorServicoId: createDto.prestadorServicoId,
        tipoServico: createDto.tipoServico,
      },
    });

    if (existing) {
      throw new ConflictException(
        `Categoria ${createDto.tipoServico} já existe para este prestador`,
      );
    }

    const categoria = this.categoriaRepository.create(createDto);
    return this.categoriaRepository.save(categoria);
  }

  async findAll(): Promise<PrestadorServicoCategoria[]> {
    return this.categoriaRepository.find({
      relations: ['prestadorServico', 'prestadorServico.empresa'],
      order: {
        tipoServico: 'ASC',
      },
    });
  }

  async findByPrestador(
    prestadorId: string,
  ): Promise<PrestadorServicoCategoria[]> {
    return this.categoriaRepository.find({
      where: { prestadorServicoId: prestadorId },
      relations: ['prestadorServico', 'prestadorServico.empresa'],
      order: {
        tipoServico: 'ASC',
      },
    });
  }

  async findByTipo(
    tipo: TipoServicoCategoria,
  ): Promise<PrestadorServicoCategoria[]> {
    return this.categoriaRepository.find({
      where: {
        tipoServico: tipo,
        ativo: true,
      },
      relations: ['prestadorServico', 'prestadorServico.empresa'],
    });
  }

  async findOne(id: string): Promise<PrestadorServicoCategoria> {
    const categoria = await this.categoriaRepository.findOne({
      where: { id },
      relations: ['prestadorServico', 'prestadorServico.empresa'],
    });

    if (!categoria) {
      throw new NotFoundException(`Categoria ${id} não encontrada`);
    }

    return categoria;
  }

  async findActive(): Promise<PrestadorServicoCategoria[]> {
    return this.categoriaRepository.find({
      where: { ativo: true },
      relations: ['prestadorServico', 'prestadorServico.empresa'],
    });
  }

  async findActiveByPrestador(
    prestadorId: string,
  ): Promise<PrestadorServicoCategoria[]> {
    return this.categoriaRepository.find({
      where: {
        prestadorServicoId: prestadorId,
        ativo: true,
      },
      relations: ['prestadorServico'],
      order: {
        tipoServico: 'ASC',
      },
    });
  }

  async update(
    id: string,
    updateDto: UpdatePrestadorServicoCategoriaDto,
  ): Promise<PrestadorServicoCategoria> {
    const categoria = await this.findOne(id);

    Object.assign(categoria, updateDto);
    return this.categoriaRepository.save(categoria);
  }

  async toggleStatus(id: string): Promise<PrestadorServicoCategoria> {
    const categoria = await this.findOne(id);

    categoria.ativo = !categoria.ativo;
    return this.categoriaRepository.save(categoria);
  }

  async remove(id: string): Promise<void> {
    const categoria = await this.findOne(id);
    await this.categoriaRepository.remove(categoria);
  }

  async removeByPrestador(prestadorId: string): Promise<void> {
    await this.categoriaRepository.delete({ prestadorServicoId: prestadorId });
  }

  async getEstatisticasPorTipo(): Promise<any> {
    const tipos = Object.values(TipoServicoCategoria);
    const estatisticas = await Promise.all(
      tipos.map(async (tipo) => {
        const [total, ativos] = await Promise.all([
          this.categoriaRepository.count({
            where: { tipoServico: tipo },
          }),
          this.categoriaRepository.count({
            where: {
              tipoServico: tipo,
              ativo: true,
            },
          }),
        ]);

        return {
          tipo,
          total,
          ativos,
          inativos: total - ativos,
        };
      }),
    );

    return estatisticas;
  }

  async getEstatisticasPrestador(prestadorId: string): Promise<any> {
    const categorias = await this.findByPrestador(prestadorId);

    const total = categorias.length;
    const ativas = categorias.filter((c) => c.ativo).length;
    const comOrcamento = categorias.filter((c) => c.requerOrcamento).length;
    const comAprovacao = categorias.filter((c) => c.requerAprovacao).length;

    const porTipo = categorias.reduce((acc, cat) => {
      if (!acc[cat.tipoServico]) {
        acc[cat.tipoServico] = {
          total: 0,
          ativas: 0,
          valorMedio: [],
        };
      }

      acc[cat.tipoServico].total++;
      if (cat.ativo) acc[cat.tipoServico].ativas++;
      if (cat.valorPadrao)
        acc[cat.tipoServico].valorMedio.push(cat.valorPadrao);

      return acc;
    }, {});

    // Calcular médias
    Object.keys(porTipo).forEach((tipo) => {
      const valores = porTipo[tipo].valorMedio;
      porTipo[tipo].valorMedio =
        valores.length > 0
          ? valores.reduce((a, b) => a + b, 0) / valores.length
          : 0;
    });

    return {
      resumo: {
        total,
        ativas,
        inativas: total - ativas,
        comOrcamento,
        comAprovacao,
      },
      porTipo,
    };
  }

  async getPrestadoresPorCategoria(tipo: TipoServicoCategoria): Promise<any[]> {
    const categorias = await this.findByTipo(tipo);

    return categorias.map((cat) => ({
      id: cat.prestadorServico.id,
      codigo: cat.prestadorServico.codigoPrestador,
      nome: cat.prestadorServico.empresa?.nomeFantasia,
      valorPadrao: cat.valorPadrao,
      prazoExecucao: cat.prazoExecucao,
      responsavelTecnico: cat.responsavelTecnico,
      requerOrcamento: cat.requerOrcamento,
      requerAprovacao: cat.requerAprovacao,
    }));
  }

  async importarCategorias(
    prestadorId: string,
    categorias: Partial<CreatePrestadorServicoCategoriaDto>[],
  ): Promise<PrestadorServicoCategoria[]> {
    // Verificar se o prestador existe
    const prestador = await this.prestadorRepository.findOne({
      where: { id: prestadorId },
    });

    if (!prestador) {
      throw new NotFoundException(`Prestador ${prestadorId} não encontrado`);
    }

    // Remover categorias existentes (opcional, dependendo da lógica desejada)
    // await this.removeByPrestador(prestadorId);

    const criadas = await Promise.all(
      categorias.map(async (cat) => {
        // Verificar se já existe
        const existing = await this.categoriaRepository.findOne({
          where: {
            prestadorServicoId: prestadorId,
            tipoServico: cat.tipoServico,
          },
        });

        if (existing) {
          // Atualizar existente
          Object.assign(existing, cat);
          return this.categoriaRepository.save(existing);
        } else {
          // Criar nova
          const nova = this.categoriaRepository.create({
            ...cat,
            prestadorServicoId: prestadorId,
          });
          return this.categoriaRepository.save(nova);
        }
      }),
    );

    return criadas;
  }
}
