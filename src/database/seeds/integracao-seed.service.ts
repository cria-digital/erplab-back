import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import {
  Integracao,
  TipoIntegracao,
  StatusIntegracao,
} from '../../modules/atendimento/integracoes/entities/integracao.entity';
import { IntegracaoConfiguracao } from '../../modules/atendimento/integracoes/entities/integracao-configuracao.entity';
import { Tenant } from '../../modules/tenants/entities/tenant.entity';

/**
 * Seeder para criar integrações iniciais por tenant
 *
 * Este seeder:
 * 1. Busca o tenant padrão
 * 2. Cria integração DB Diagnósticos para o tenant (se não existir)
 * 3. Popula configurações baseadas no .env
 *
 * Cada tenant pode ter suas próprias configurações de integrações.
 * O tenant padrão recebe as configurações do .env como ponto de partida.
 */
@Injectable()
export class IntegracaoSeedService {
  private readonly logger = new Logger(IntegracaoSeedService.name);

  constructor(
    @InjectRepository(Integracao)
    private readonly integracaoRepository: Repository<Integracao>,
    @InjectRepository(IntegracaoConfiguracao)
    private readonly configuracaoRepository: Repository<IntegracaoConfiguracao>,
    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>,
    private readonly configService: ConfigService,
    private readonly dataSource: DataSource,
  ) {}

  async seed(): Promise<void> {
    this.logger.log('Iniciando seed de integrações...');

    // Busca tenant padrão
    const tenantPadrao = await this.tenantRepository.findOne({
      where: { slug: 'tenant-padrao' },
    });

    if (!tenantPadrao) {
      this.logger.warn(
        'Tenant padrão não encontrado. Execute o seed de tenants primeiro.',
      );
      return;
    }

    // Cria integração DB Diagnósticos
    await this.seedDbDiagnosticos(tenantPadrao.id);

    // Cria integração Hermes Pardini
    await this.seedHermesPardini(tenantPadrao.id);

    this.logger.log('Seed de integrações concluído.');
  }

  /**
   * Cria integração DB Diagnósticos para um tenant
   */
  private async seedDbDiagnosticos(tenantId: string): Promise<void> {
    const templateSlug = 'db-diagnosticos';

    // Verifica se já existe
    const existente = await this.integracaoRepository.findOne({
      where: {
        templateSlug,
        tenantId,
      },
    });

    if (existente) {
      this.logger.log(
        `Integração ${templateSlug} já existe para tenant ${tenantId}`,
      );
      return;
    }

    // Busca configurações do .env
    const codigoApoiado = this.configService.get<string>(
      'DB_DIAGNOSTICOS_CODIGO_APOIADO',
      '',
    );
    const senhaIntegracao = this.configService.get<string>(
      'DB_DIAGNOSTICOS_SENHA',
      '',
    );
    const wsdlUrl = this.configService.get<string>(
      'DB_DIAGNOSTICOS_WSDL_URL',
      'https://wsmb.diagnosticosdobrasil.com.br/dbsync/wsrvProtocoloDBSync.dbsync.svc?wsdl',
    );
    const timeout = this.configService.get<string>(
      'DB_DIAGNOSTICOS_TIMEOUT',
      '60000',
    );

    // Se não há credenciais no .env, não cria a integração
    if (!codigoApoiado || !senhaIntegracao) {
      this.logger.log(
        `Credenciais DB Diagnósticos não encontradas no .env, pulando seed`,
      );
      return;
    }

    // Cria integração em transação
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Cria integração
      const integracao = this.integracaoRepository.create({
        templateSlug,
        codigoIdentificacao: `DB-${tenantId.substring(0, 8).toUpperCase()}`,
        nomeInstancia: 'DB Diagnósticos - Integração Principal',
        descricao: 'Integração com laboratório de apoio DB Diagnósticos',
        tiposContexto: [TipoIntegracao.LABORATORIO_APOIO],
        status: StatusIntegracao.ATIVA,
        ativo: true,
        tenantId,
        timeoutSegundos: parseInt(timeout, 10) / 1000,
      });

      const integracaoSalva = await queryRunner.manager.save(integracao);

      // Cria configurações
      const configuracoes = [
        { chave: 'codigo_apoiado', valor: codigoApoiado },
        { chave: 'senha_integracao', valor: senhaIntegracao },
        { chave: 'ambiente', valor: 'producao' },
        { chave: 'wsdl_url', valor: wsdlUrl },
        { chave: 'timeout', valor: timeout },
      ];

      for (const config of configuracoes) {
        const configEntity = this.configuracaoRepository.create({
          integracaoId: integracaoSalva.id,
          chave: config.chave,
          valor: config.valor,
          tenantId,
        });
        await queryRunner.manager.save(configEntity);
      }

      await queryRunner.commitTransaction();
      this.logger.log(
        `Integração ${templateSlug} criada para tenant ${tenantId}`,
      );
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(
        `Erro ao criar integração ${templateSlug}: ${error.message}`,
      );
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Cria integração Hermes Pardini para um tenant
   */
  private async seedHermesPardini(tenantId: string): Promise<void> {
    const templateSlug = 'hermes-pardini';

    // Verifica se já existe
    const existente = await this.integracaoRepository.findOne({
      where: {
        templateSlug,
        tenantId,
      },
    });

    if (existente) {
      this.logger.log(
        `Integração ${templateSlug} já existe para tenant ${tenantId}`,
      );
      return;
    }

    // Busca configurações do .env
    const login = this.configService.get<string>('HERMES_PARDINI_LOGIN', '');
    const senha = this.configService.get<string>('HERMES_PARDINI_SENHA', '');

    // Se não há credenciais no .env, não cria a integração
    if (!login || !senha) {
      this.logger.log(
        `Credenciais Hermes Pardini não encontradas no .env, pulando seed`,
      );
      return;
    }

    // Cria integração em transação
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Cria integração
      const integracao = this.integracaoRepository.create({
        templateSlug,
        codigoIdentificacao: `HP-${tenantId.substring(0, 8).toUpperCase()}`,
        nomeInstancia: 'Hermes Pardini - Integração Principal',
        descricao: 'Integração com laboratório de apoio Hermes Pardini',
        tiposContexto: [TipoIntegracao.LABORATORIO_APOIO],
        status: StatusIntegracao.ATIVA,
        ativo: true,
        tenantId,
        timeoutSegundos: 30,
      });

      const integracaoSalva = await queryRunner.manager.save(integracao);

      // Cria configurações
      const configuracoes = [
        { chave: 'login', valor: login },
        { chave: 'senha', valor: senha },
        { chave: 'ambiente', valor: 'producao' },
        {
          chave: 'url_webservice',
          valor: 'https://www.hermespardini.com.br/b2b/HPWS.XMLServer.cls',
        },
        {
          chave: 'url_tabela_exames',
          valor: 'http://www.hermespardini.com.br/cal/tabexalhpV2.xml',
        },
        { chave: 'valor_referencia', valor: '0' },
        { chave: 'papel_timbrado', valor: '0' },
        { chave: 'timeout', valor: '30' },
      ];

      for (const config of configuracoes) {
        const configEntity = this.configuracaoRepository.create({
          integracaoId: integracaoSalva.id,
          chave: config.chave,
          valor: config.valor,
          tenantId,
        });
        await queryRunner.manager.save(configEntity);
      }

      await queryRunner.commitTransaction();
      this.logger.log(
        `Integração ${templateSlug} criada para tenant ${tenantId}`,
      );
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(
        `Erro ao criar integração ${templateSlug}: ${error.message}`,
      );
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
