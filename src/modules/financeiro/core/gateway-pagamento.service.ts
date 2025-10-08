import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  GatewayPagamento,
  TipoGateway,
  StatusGateway,
} from './entities/gateway-pagamento.entity';
import { CreateGatewayPagamentoDto } from './dto/create-gateway-pagamento.dto';
import { UpdateGatewayPagamentoDto } from './dto/update-gateway-pagamento.dto';

@Injectable()
export class GatewayPagamentoService {
  constructor(
    @InjectRepository(GatewayPagamento)
    private readonly repository: Repository<GatewayPagamento>,
  ) {}

  async create(
    createDto: CreateGatewayPagamentoDto,
  ): Promise<GatewayPagamento> {
    const gateway = this.repository.create(createDto);
    return await this.repository.save(gateway);
  }

  async findAll(): Promise<GatewayPagamento[]> {
    return await this.repository.find({
      relations: ['conta_bancaria'],
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: string): Promise<GatewayPagamento> {
    const gateway = await this.repository.findOne({
      where: { id },
      relations: ['conta_bancaria'],
    });

    if (!gateway) {
      throw new NotFoundException(
        `Gateway de pagamento com ID ${id} não encontrado`,
      );
    }

    return gateway;
  }

  async update(
    id: string,
    updateDto: UpdateGatewayPagamentoDto,
  ): Promise<GatewayPagamento> {
    const gateway = await this.findOne(id);
    Object.assign(gateway, updateDto);
    return await this.repository.save(gateway);
  }

  async remove(id: string): Promise<any> {
    const gateway = await this.findOne(id);
    await this.repository.remove(gateway);
    return { affected: 1 };
  }

  async findByTipo(tipo: TipoGateway): Promise<GatewayPagamento[]> {
    return await this.repository.find({
      where: { tipo_gateway: tipo },
      relations: ['conta_bancaria'],
      order: { created_at: 'DESC' },
    });
  }

  async findByStatus(status: StatusGateway): Promise<GatewayPagamento[]> {
    return await this.repository.find({
      where: { status },
      relations: ['conta_bancaria'],
      order: { created_at: 'DESC' },
    });
  }

  async findByContaBancaria(contaId: string): Promise<GatewayPagamento[]> {
    return await this.repository.find({
      where: { conta_bancaria_id: contaId },
      relations: ['conta_bancaria'],
      order: { created_at: 'DESC' },
    });
  }

  async testConnection(id: string): Promise<any> {
    const gateway = await this.findOne(id);

    // Simulação de teste de conexão
    // Em produção, aqui seria feita uma requisição real ao gateway
    try {
      return {
        conectado: true,
        latencia: Math.floor(Math.random() * 500) + 100,
        versao_api: '2.1',
        gateway: gateway.nome_gateway,
      };
    } catch (error) {
      return {
        conectado: false,
        erro: error.message,
      };
    }
  }

  async updateStatus(
    id: string,
    status: StatusGateway,
  ): Promise<GatewayPagamento> {
    const gateway = await this.findOne(id);
    gateway.status = status;
    return await this.repository.save(gateway);
  }

  async refreshApiKey(id: string): Promise<GatewayPagamento> {
    const gateway = await this.findOne(id);

    // Simulação de renovação de chave API
    // Em produção, aqui seria feita a requisição ao provedor
    const novaChave = `KEY-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    gateway.api_key = novaChave;

    return await this.repository.save(gateway);
  }

  async validateConfiguration(id: string): Promise<any> {
    const gateway = await this.findOne(id);

    const erros: string[] = [];

    if (!gateway.api_key && !gateway.merchant_id) {
      erros.push('API Key ou Merchant ID deve ser configurado');
    }

    if (
      !gateway.configuracao_adicional &&
      gateway.tipo_gateway !== TipoGateway.OUTRO
    ) {
      erros.push('Configurações adicionais não definidas');
    }

    return {
      valida: erros.length === 0,
      erros,
    };
  }

  async processPayment(id: string, dadosPagamento: any): Promise<any> {
    const gateway = await this.findOne(id);

    if (gateway.status !== StatusGateway.ATIVO) {
      throw new ConflictException('Gateway não está ativo');
    }

    // Simulação de processamento de pagamento
    // Em produção, aqui seria feita a requisição ao gateway real
    return {
      transacao_id: `TXN-${Date.now()}`,
      status: 'approved',
      valor: dadosPagamento.valor,
      gateway_response: {
        id: `${gateway.tipo_gateway.toUpperCase()}-${Date.now()}`,
        status: 'approved',
      },
    };
  }

  async getTransactionHistory(id: string): Promise<any> {
    const gateway = await this.findOne(id);

    // Simulação de histórico de transações
    // Em produção, aqui seria consultado o histórico real
    return {
      transacoes: [],
      total: 0,
      total_valor: 0,
      gateway: gateway.nome_gateway,
    };
  }

  async cancelTransaction(id: string, transacaoId: string): Promise<any> {
    const gateway = await this.findOne(id);

    // Simulação de cancelamento
    return {
      transacao_id: transacaoId,
      status: 'cancelled',
      gateway: gateway.nome_gateway,
    };
  }

  async refundTransaction(id: string, transacaoId: string): Promise<any> {
    const gateway = await this.findOne(id);

    // Simulação de estorno
    return {
      transacao_id: transacaoId,
      status: 'refunded',
      gateway: gateway.nome_gateway,
    };
  }

  async generatePaymentLink(id: string, dados: any): Promise<any> {
    const gateway = await this.findOne(id);

    // Simulação de geração de link
    return {
      link: `https://pagamento.exemplo.com/${gateway.tipo_gateway}/${Date.now()}`,
      validade: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24h
      valor: dados.valor,
    };
  }

  async getPaymentMethods(id: string): Promise<any> {
    const gateway = await this.findOne(id);

    // Simulação de métodos de pagamento disponíveis
    return {
      gateway: gateway.nome_gateway,
      metodos: ['credit_card', 'debit_card', 'pix', 'boleto'],
    };
  }

  async updateWebhookUrl(
    id: string,
    webhookUrl: string,
  ): Promise<GatewayPagamento> {
    const gateway = await this.findOne(id);
    gateway.webhook_url = webhookUrl;
    return await this.repository.save(gateway);
  }

  async generateReport(id: string): Promise<any> {
    const gateway = await this.findOne(id);

    // Simulação de relatório
    return {
      gateway: gateway.nome_gateway,
      periodo: {
        inicio: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        fim: new Date(),
      },
      transacoes_total: 0,
      valor_total: 0,
      taxa_sucesso: 0,
      principais_erros: [],
    };
  }
}
