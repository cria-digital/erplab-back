import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cidade } from '../../modules/infraestrutura/common/entities/cidade.entity';
import { Estado } from '../../modules/infraestrutura/common/entities/estado.entity';
import axios from 'axios';

interface IbgeCidade {
  id: number;
  nome: string;
  microrregiao: {
    mesorregiao: {
      UF: {
        id: number;
        sigla: string;
        nome: string;
      };
    };
  };
}

@Injectable()
export class CidadeSeedService {
  constructor(
    @InjectRepository(Cidade)
    private readonly cidadeRepository: Repository<Cidade>,
    @InjectRepository(Estado)
    private readonly estadoRepository: Repository<Estado>,
  ) {}

  async seed(): Promise<void> {
    const count = await this.cidadeRepository.count();

    // Só executa se não houver cidades cadastradas
    if (count > 0) {
      console.log('Cidades já foram inseridas anteriormente. Pulando seed...');
      return;
    }

    console.log('Buscando cidades da API do IBGE...');

    try {
      // Busca todas as cidades da API do IBGE
      const response = await axios.get<IbgeCidade[]>(
        'https://servicodados.ibge.gov.br/api/v1/localidades/municipios',
      );

      const cidadesIbge = response.data;
      console.log(`📥 ${cidadesIbge.length} cidades obtidas da API do IBGE`);

      // Busca todos os estados do banco de dados
      const estados = await this.estadoRepository.find();
      const estadosPorUf = new Map(estados.map((e) => [e.uf, e]));

      // Prepara os dados das cidades para inserção
      const cidadesParaInserir: Partial<Cidade>[] = [];

      for (const cidadeIbge of cidadesIbge) {
        // Valida se a estrutura está completa
        if (
          !cidadeIbge.microrregiao ||
          !cidadeIbge.microrregiao.mesorregiao ||
          !cidadeIbge.microrregiao.mesorregiao.UF
        ) {
          console.warn(
            `⚠️  Estrutura incompleta para cidade ${cidadeIbge.nome}, pulando...`,
          );
          continue;
        }

        const uf = cidadeIbge.microrregiao.mesorregiao.UF.sigla;
        const estado = estadosPorUf.get(uf);

        if (!estado) {
          console.warn(
            `⚠️  Estado ${uf} não encontrado para cidade ${cidadeIbge.nome}`,
          );
          continue;
        }

        cidadesParaInserir.push({
          nome: cidadeIbge.nome,
          codigoIbge: String(cidadeIbge.id),
          estadoId: estado.id,
        });
      }

      // Insere as cidades em lotes de 500 para melhor performance
      const batchSize = 500;
      let inserted = 0;

      for (let i = 0; i < cidadesParaInserir.length; i += batchSize) {
        const batch = cidadesParaInserir.slice(i, i + batchSize);
        await this.cidadeRepository.save(batch);
        inserted += batch.length;
        console.log(
          `   Inseridas ${inserted}/${cidadesParaInserir.length} cidades...`,
        );
      }

      console.log(
        `✅ ${cidadesParaInserir.length} cidades inseridas com sucesso!`,
      );
    } catch (error) {
      console.error('❌ Erro ao buscar/inserir cidades:', error.message);
      throw error;
    }
  }
}
