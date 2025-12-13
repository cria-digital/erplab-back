import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, IsNull } from 'typeorm';
import {
  Tenant,
  PlanoTenant,
} from '../../modules/tenants/entities/tenant.entity';
import { Usuario } from '../../modules/autenticacao/usuarios/entities/usuario.entity';

@Injectable()
export class TenantSeedService {
  private readonly logger = new Logger(TenantSeedService.name);

  constructor(
    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    private readonly dataSource: DataSource,
  ) {}

  async seed(): Promise<void> {
    this.logger.log('Iniciando seed de tenants...');

    // Verifica se já existe o tenant padrão
    let tenantPadrao = await this.tenantRepository.findOne({
      where: { slug: 'tenant-padrao' },
    });

    if (!tenantPadrao) {
      // Cria tenant padrão
      tenantPadrao = this.tenantRepository.create({
        nome: 'Tenant Padrão',
        slug: 'tenant-padrao',
        plano: PlanoTenant.ENTERPRISE,
        limiteUsuarios: 100,
        limiteUnidades: 50,
        ativo: true,
        configuracoes: {
          descricao:
            'Tenant padrão criado automaticamente para migração de dados existentes',
          criadoAutomaticamente: true,
          dataSetup: new Date().toISOString(),
        },
      });

      tenantPadrao = await this.tenantRepository.save(tenantPadrao);
      this.logger.log(`Tenant padrão criado com ID: ${tenantPadrao.id}`);
    } else {
      this.logger.log(
        `Tenant padrão já existe com ID: ${tenantPadrao.id}. Verificando usuários sem tenant...`,
      );
    }

    // SEMPRE tenta associar usuários sem tenant ao tenant padrão
    await this.associarUsuariosAoTenant(tenantPadrao.id);

    this.logger.log('Seed de tenants concluído.');
  }

  private async associarUsuariosAoTenant(tenantId: string): Promise<void> {
    // Busca usuários sem tenant usando IsNull() para comparar corretamente com NULL
    const usuariosSemTenant = await this.usuarioRepository.find({
      where: { tenantId: IsNull() },
    });

    if (usuariosSemTenant.length === 0) {
      this.logger.log('Nenhum usuário sem tenant encontrado.');
      return;
    }

    this.logger.log(
      `Associando ${usuariosSemTenant.length} usuário(s) ao tenant padrão...`,
    );

    // Usa uma transação para garantir atomicidade
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Atualiza todos os usuários de uma vez usando query builder para garantir IS NULL
      await queryRunner.manager
        .createQueryBuilder()
        .update(Usuario)
        .set({ tenantId })
        .where('tenant_id IS NULL')
        .execute();

      await queryRunner.commitTransaction();
      this.logger.log(
        `${usuariosSemTenant.length} usuário(s) associado(s) ao tenant padrão.`,
      );
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error('Erro ao associar usuários ao tenant:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
