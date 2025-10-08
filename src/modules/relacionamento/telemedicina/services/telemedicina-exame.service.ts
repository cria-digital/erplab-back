import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TelemedicinaExame } from '../entities/telemedicina-exame.entity';
import { CreateTelemedicinaExameDto } from '../dto/create-telemedicina-exame.dto';
import { UpdateTelemedicinaExameDto } from '../dto/update-telemedicina-exame.dto';

@Injectable()
export class TelemedicinaExameService {
  constructor(
    @InjectRepository(TelemedicinaExame)
    private readonly telemedicinaExameRepository: Repository<TelemedicinaExame>,
  ) {}

  async create(
    createTelemedicinaExameDto: CreateTelemedicinaExameDto,
  ): Promise<TelemedicinaExame> {
    // Verificar se já existe vínculo
    const existingVinculo = await this.telemedicinaExameRepository.findOne({
      where: {
        telemedicina_id: createTelemedicinaExameDto.telemedicina_id,
        exame_id: createTelemedicinaExameDto.exame_id,
      },
    });

    if (existingVinculo) {
      throw new ConflictException(
        'Já existe um vínculo entre esta telemedicina e este exame',
      );
    }

    const telemedicinaExame = this.telemedicinaExameRepository.create(
      createTelemedicinaExameDto,
    );
    return await this.telemedicinaExameRepository.save(telemedicinaExame);
  }

  async findAll(): Promise<TelemedicinaExame[]> {
    return await this.telemedicinaExameRepository.find({
      relations: ['telemedicina', 'telemedicina.empresa', 'exame'],
      order: { created_at: 'DESC' },
    });
  }

  async findByTelemedicina(
    telemedicinaId: string,
  ): Promise<TelemedicinaExame[]> {
    return await this.telemedicinaExameRepository
      .createQueryBuilder('te')
      .leftJoinAndSelect('te.exame', 'exame')
      .where('te.telemedicina_id = :telemedicinaId', { telemedicinaId })
      .orderBy('exame.nome', 'ASC')
      .getMany();
  }

  async findByExame(exameId: string): Promise<TelemedicinaExame[]> {
    return await this.telemedicinaExameRepository.find({
      where: { exame_id: exameId },
      relations: ['telemedicina', 'telemedicina.empresa'],
      order: { created_at: 'DESC' },
    });
  }

  async findAtivos(): Promise<TelemedicinaExame[]> {
    return await this.telemedicinaExameRepository.find({
      where: { ativo: true },
      relations: ['telemedicina', 'telemedicina.empresa', 'exame'],
      order: { created_at: 'DESC' },
    });
  }

  async findSemVinculo(telemedicinaId: string): Promise<any[]> {
    // Query para buscar exames que ainda não foram vinculados a esta telemedicina
    const query = `
      SELECT e.id, e.codigo, e.nome, e.categoria
      FROM exames e
      WHERE e.id NOT IN (
        SELECT te.exame_id
        FROM telemedicina_exames te
        WHERE te.telemedicina_id = $1
      )
      AND e.ativo = true
      ORDER BY e.nome ASC
    `;

    return await this.telemedicinaExameRepository.query(query, [
      telemedicinaId,
    ]);
  }

  async findOne(id: string): Promise<TelemedicinaExame> {
    const telemedicinaExame = await this.telemedicinaExameRepository.findOne({
      where: { id },
      relations: ['telemedicina', 'telemedicina.empresa', 'exame'],
    });

    if (!telemedicinaExame) {
      throw new NotFoundException(
        `Vínculo telemedicina-exame com ID ${id} não encontrado`,
      );
    }

    return telemedicinaExame;
  }

  async update(
    id: string,
    updateTelemedicinaExameDto: UpdateTelemedicinaExameDto,
  ): Promise<TelemedicinaExame> {
    const telemedicinaExame = await this.findOne(id);

    // Verificar se está tentando alterar o vínculo para um que já existe
    if (
      (updateTelemedicinaExameDto.telemedicina_id &&
        updateTelemedicinaExameDto.telemedicina_id !==
          telemedicinaExame.telemedicina_id) ||
      (updateTelemedicinaExameDto.exame_id &&
        updateTelemedicinaExameDto.exame_id !== telemedicinaExame.exame_id)
    ) {
      const existingVinculo = await this.telemedicinaExameRepository.findOne({
        where: {
          telemedicina_id:
            updateTelemedicinaExameDto.telemedicina_id ||
            telemedicinaExame.telemedicina_id,
          exame_id:
            updateTelemedicinaExameDto.exame_id || telemedicinaExame.exame_id,
        },
      });

      if (existingVinculo && existingVinculo.id !== id) {
        throw new ConflictException(
          'Já existe um vínculo entre esta telemedicina e este exame',
        );
      }
    }

    Object.assign(telemedicinaExame, updateTelemedicinaExameDto);
    return await this.telemedicinaExameRepository.save(telemedicinaExame);
  }

  async remove(id: string): Promise<void> {
    const telemedicinaExame = await this.findOne(id);
    await this.telemedicinaExameRepository.remove(telemedicinaExame);
  }

  async toggleStatus(id: string): Promise<TelemedicinaExame> {
    const telemedicinaExame = await this.findOne(id);
    telemedicinaExame.ativo = !telemedicinaExame.ativo;
    return await this.telemedicinaExameRepository.save(telemedicinaExame);
  }

  async vincularAutomaticamente(
    telemedicinaId: string,
  ): Promise<{ vinculados: number; total: number }> {
    // Buscar exames sem vínculo
    const examesSemVinculo = await this.findSemVinculo(telemedicinaId);
    let vinculados = 0;

    for (const exame of examesSemVinculo) {
      try {
        // Tentar vincular automaticamente usando o mesmo código
        await this.create({
          telemedicina_id: telemedicinaId,
          exame_id: exame.id,
          codigo_telemedicina: exame.codigo,
          nome_exame_telemedicina: exame.nome,
          categoria_telemedicina: exame.categoria,
          ativo: true,
        });
        vinculados++;
      } catch {
        // Se não conseguir vincular, continua para o próximo
        continue;
      }
    }

    return {
      vinculados,
      total: examesSemVinculo.length,
    };
  }

  async search(
    telemedicinaId: string,
    query: string,
  ): Promise<TelemedicinaExame[]> {
    return await this.telemedicinaExameRepository
      .createQueryBuilder('te')
      .leftJoinAndSelect('te.exame', 'exame')
      .leftJoinAndSelect('te.telemedicina', 'telemedicina')
      .where('te.telemedicina_id = :telemedicinaId', { telemedicinaId })
      .andWhere(
        '(exame.nome ILIKE :query OR exame.codigo LIKE :query OR te.codigo_telemedicina LIKE :query OR te.nome_exame_telemedicina ILIKE :query)',
        { query: `%${query}%` },
      )
      .orderBy('exame.nome', 'ASC')
      .getMany();
  }

  async getEstatisticas(telemedicinaId?: string): Promise<any> {
    const whereClause = telemedicinaId
      ? { telemedicina_id: telemedicinaId }
      : {};

    const total = await this.telemedicinaExameRepository.count({
      where: whereClause,
    });
    const ativos = await this.telemedicinaExameRepository.count({
      where: { ...whereClause, ativo: true },
    });

    const comUploadImagem = await this.telemedicinaExameRepository.count({
      where: { ...whereClause, permite_upload_imagem: true },
    });

    const requerEspecialista = await this.telemedicinaExameRepository.count({
      where: { ...whereClause, requer_especialista: true },
    });

    return {
      total,
      ativos,
      inativos: total - ativos,
      comUploadImagem,
      requerEspecialista,
    };
  }
}
