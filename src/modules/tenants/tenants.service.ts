import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tenant } from './entities/tenant.entity';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';

@Injectable()
export class TenantsService {
  constructor(
    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>,
  ) {}

  async create(createTenantDto: CreateTenantDto): Promise<Tenant> {
    // Verifica se já existe tenant com mesmo slug
    const existingBySlug = await this.tenantRepository.findOne({
      where: { slug: createTenantDto.slug },
    });

    if (existingBySlug) {
      throw new ConflictException(
        `Tenant com slug "${createTenantDto.slug}" já existe`,
      );
    }

    // Verifica se já existe tenant com mesmo CNPJ
    if (createTenantDto.cnpj) {
      const existingByCnpj = await this.tenantRepository.findOne({
        where: { cnpj: createTenantDto.cnpj },
      });

      if (existingByCnpj) {
        throw new ConflictException(
          `Tenant com CNPJ "${createTenantDto.cnpj}" já existe`,
        );
      }
    }

    const tenant = this.tenantRepository.create(createTenantDto);
    return await this.tenantRepository.save(tenant);
  }

  async findAll(): Promise<Tenant[]> {
    return await this.tenantRepository.find({
      order: { nome: 'ASC' },
    });
  }

  async findAtivos(): Promise<Tenant[]> {
    return await this.tenantRepository.find({
      where: { ativo: true },
      order: { nome: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Tenant> {
    const tenant = await this.tenantRepository.findOne({
      where: { id },
    });

    if (!tenant) {
      throw new NotFoundException(`Tenant com ID "${id}" não encontrado`);
    }

    return tenant;
  }

  async findBySlug(slug: string): Promise<Tenant> {
    const tenant = await this.tenantRepository.findOne({
      where: { slug },
    });

    if (!tenant) {
      throw new NotFoundException(`Tenant com slug "${slug}" não encontrado`);
    }

    return tenant;
  }

  async update(id: string, updateTenantDto: UpdateTenantDto): Promise<Tenant> {
    const tenant = await this.findOne(id);

    // Verifica slug duplicado
    if (updateTenantDto.slug && updateTenantDto.slug !== tenant.slug) {
      const existingBySlug = await this.tenantRepository.findOne({
        where: { slug: updateTenantDto.slug },
      });

      if (existingBySlug) {
        throw new ConflictException(
          `Tenant com slug "${updateTenantDto.slug}" já existe`,
        );
      }
    }

    // Verifica CNPJ duplicado
    if (updateTenantDto.cnpj && updateTenantDto.cnpj !== tenant.cnpj) {
      const existingByCnpj = await this.tenantRepository.findOne({
        where: { cnpj: updateTenantDto.cnpj },
      });

      if (existingByCnpj) {
        throw new ConflictException(
          `Tenant com CNPJ "${updateTenantDto.cnpj}" já existe`,
        );
      }
    }

    Object.assign(tenant, updateTenantDto);
    return await this.tenantRepository.save(tenant);
  }

  async remove(id: string): Promise<void> {
    const tenant = await this.findOne(id);
    tenant.ativo = false;
    await this.tenantRepository.save(tenant);
  }

  async getStatistics(): Promise<{
    total: number;
    ativos: number;
    inativos: number;
    porPlano: Record<string, number>;
  }> {
    const [total, ativos, porPlano] = await Promise.all([
      this.tenantRepository.count(),
      this.tenantRepository.count({ where: { ativo: true } }),
      this.tenantRepository
        .createQueryBuilder('tenant')
        .select('tenant.plano', 'plano')
        .addSelect('COUNT(*)', 'count')
        .groupBy('tenant.plano')
        .getRawMany(),
    ]);

    return {
      total,
      ativos,
      inativos: total - ativos,
      porPlano: porPlano.reduce(
        (acc, item) => {
          acc[item.plano] = parseInt(item.count);
          return acc;
        },
        {} as Record<string, number>,
      ),
    };
  }
}
