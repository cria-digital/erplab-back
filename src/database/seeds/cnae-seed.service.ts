import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cnae } from '../../modules/infraestrutura/common/entities/cnae.entity';
import * as fs from 'fs';
import * as path from 'path';

interface CnaeJson {
  id: string;
  descricao: string;
  grupo: {
    id: string;
    descricao: string;
    divisao: {
      id: string;
      descricao: string;
      secao: {
        id: string;
        descricao: string;
      };
    };
  };
  observacoes?: string[];
}

@Injectable()
export class CnaeSeedService {
  constructor(
    @InjectRepository(Cnae)
    private readonly cnaeRepository: Repository<Cnae>,
  ) {}

  /**
   * Normaliza o código CNAE para o formato sem formatação (7 dígitos)
   * Formato IBGE (classe): "01113" (5 dígitos) -> "0111300" (7 dígitos)
   * Formato CNPJA (subclasse): 6311900 (7 dígitos) -> "6311900"
   * Mantém compatibilidade com API CNPJA que usa códigos de 7 dígitos
   */
  private normalizarCodigoCnae(codigo: string): string {
    // Remove qualquer formatação existente (hífens, barras)
    const codigoLimpo = codigo.replace(/[-/]/g, '');

    // Se o código tem 5 dígitos (formato IBGE classe), adiciona "00" no final (subclasse padrão)
    if (codigoLimpo.length === 5) {
      return codigoLimpo + '00';
    }

    // Se tem menos de 7 dígitos, adiciona zeros à esquerda
    if (codigoLimpo.length < 7) {
      return codigoLimpo.padStart(7, '0');
    }

    // Se já tem 7 dígitos, retorna como está
    return codigoLimpo;
  }

  async seed(): Promise<void> {
    console.log('Iniciando importação de CNAEs...');

    // Verifica se já existem CNAEs suficientes no banco
    const count = await this.cnaeRepository.count();
    if (count >= 600) {
      console.log(
        `✅ CNAEs já importados (${count} registros). Pulando importação.`,
      );
      return;
    }

    // Lê o arquivo JSON de CNAEs
    const jsonPath = path.join(__dirname, 'data', 'cnaes.json');

    if (!fs.existsSync(jsonPath)) {
      console.log(
        '⚠️ Arquivo cnaes.json não encontrado. Usando CNAEs básicos de saúde.',
      );
      await this.seedCnaesBasicos();
      return;
    }

    try {
      const jsonContent = fs.readFileSync(jsonPath, 'utf-8');
      const cnaesJson: CnaeJson[] = JSON.parse(jsonContent);

      console.log(`📊 Encontrados ${cnaesJson.length} CNAEs no arquivo JSON`);

      let inseridos = 0;
      let atualizados = 0;
      let erros = 0;

      for (const cnaeJson of cnaesJson) {
        try {
          const codigoNormalizado = this.normalizarCodigoCnae(cnaeJson.id);

          const cnaeData = {
            codigo: codigoNormalizado,
            descricao: cnaeJson.descricao,
            secao: cnaeJson.grupo.divisao.secao.id,
            descricaoSecao: cnaeJson.grupo.divisao.secao.descricao,
            divisao: cnaeJson.grupo.divisao.id,
            descricaoDivisao: cnaeJson.grupo.divisao.descricao,
            grupo: cnaeJson.grupo.id,
            descricaoGrupo: cnaeJson.grupo.descricao,
            classe: codigoNormalizado.substring(0, 4),
            descricaoClasse: cnaeJson.descricao,
            subclasse: codigoNormalizado.substring(0, 6),
            descricaoSubclasse: cnaeJson.descricao,
            ativo: true,
          };

          const existente = await this.cnaeRepository.findOne({
            where: { codigo: codigoNormalizado },
          });

          if (existente) {
            await this.cnaeRepository.update(
              { codigo: codigoNormalizado },
              cnaeData,
            );
            atualizados++;
          } else {
            const entity = this.cnaeRepository.create(cnaeData);
            await this.cnaeRepository.save(entity);
            inseridos++;
          }
        } catch (error) {
          erros++;
          if (erros <= 5) {
            console.error(`Erro ao processar CNAE ${cnaeJson.id}:`, error);
          }
        }
      }

      if (erros > 5) {
        console.log(`... e mais ${erros - 5} erros`);
      }

      console.log(
        `✅ Importação concluída: ${inseridos} inseridos, ${atualizados} atualizados, ${erros} erros`,
      );
    } catch (error) {
      console.error('Erro ao ler arquivo JSON de CNAEs:', error);
      console.log('Usando CNAEs básicos de saúde como fallback...');
      await this.seedCnaesBasicos();
    }
  }

  /**
   * Seed básico com CNAEs de saúde (fallback)
   * Códigos sem formatação para compatibilidade com API CNPJA
   */
  private async seedCnaesBasicos(): Promise<void> {
    const cnaesSaude = [
      {
        codigo: '8640202',
        descricao: 'Laboratórios de anatomia patológica e citológica',
        secao: 'Q',
        descricaoSecao: 'SAÚDE HUMANA E SERVIÇOS SOCIAIS',
        divisao: '86',
        descricaoDivisao: 'Atividades de atenção à saúde humana',
        grupo: '864',
        descricaoGrupo:
          'Atividades de serviços de complementação diagnóstica e terapêutica',
        classe: '8640',
        descricaoClasse:
          'Atividades de serviços de complementação diagnóstica e terapêutica',
        subclasse: '864020',
        descricaoSubclasse:
          'Atividades de serviços de complementação diagnóstica e terapêutica',
        ativo: true,
      },
      {
        codigo: '8640203',
        descricao: 'Laboratórios clínicos',
        secao: 'Q',
        descricaoSecao: 'SAÚDE HUMANA E SERVIÇOS SOCIAIS',
        divisao: '86',
        descricaoDivisao: 'Atividades de atenção à saúde humana',
        grupo: '864',
        descricaoGrupo:
          'Atividades de serviços de complementação diagnóstica e terapêutica',
        classe: '8640',
        descricaoClasse:
          'Atividades de serviços de complementação diagnóstica e terapêutica',
        subclasse: '864020',
        descricaoSubclasse:
          'Atividades de serviços de complementação diagnóstica e terapêutica',
        ativo: true,
      },
      {
        codigo: '8621400',
        descricao: 'Consultórios médicos',
        secao: 'Q',
        descricaoSecao: 'SAÚDE HUMANA E SERVIÇOS SOCIAIS',
        divisao: '86',
        descricaoDivisao: 'Atividades de atenção à saúde humana',
        grupo: '862',
        descricaoGrupo:
          'Atividades de atenção ambulatorial executadas por médicos e odontólogos',
        classe: '8621',
        descricaoClasse: 'Consultórios médicos',
        subclasse: '862140',
        descricaoSubclasse: 'Consultórios médicos',
        ativo: true,
      },
      {
        codigo: '8630503',
        descricao: 'Atividades de clínicas médicas',
        secao: 'Q',
        descricaoSecao: 'SAÚDE HUMANA E SERVIÇOS SOCIAIS',
        divisao: '86',
        descricaoDivisao: 'Atividades de atenção à saúde humana',
        grupo: '863',
        descricaoGrupo:
          'Atividades de atenção ambulatorial executadas por médicos e odontólogos',
        classe: '8630',
        descricaoClasse:
          'Atividades de atenção ambulatorial executadas por médicos e odontólogos',
        subclasse: '863050',
        descricaoSubclasse: 'Atividades de atenção ambulatorial',
        ativo: true,
      },
      {
        codigo: '8610101',
        descricao: 'Atividades de atendimento hospitalar',
        secao: 'Q',
        descricaoSecao: 'SAÚDE HUMANA E SERVIÇOS SOCIAIS',
        divisao: '86',
        descricaoDivisao: 'Atividades de atenção à saúde humana',
        grupo: '861',
        descricaoGrupo: 'Atividades de atendimento hospitalar',
        classe: '8610',
        descricaoClasse: 'Atividades de atendimento hospitalar',
        subclasse: '861010',
        descricaoSubclasse: 'Atividades de atendimento hospitalar',
        ativo: true,
      },
    ];

    let inseridos = 0;

    for (const cnae of cnaesSaude) {
      const existente = await this.cnaeRepository.findOne({
        where: { codigo: cnae.codigo },
      });

      if (!existente) {
        const entity = this.cnaeRepository.create(cnae);
        await this.cnaeRepository.save(entity);
        inseridos++;
      }
    }

    console.log(`✅ CNAEs básicos de saúde: ${inseridos} inseridos`);
  }
}
