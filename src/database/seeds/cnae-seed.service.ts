import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cnae } from '../../modules/common/entities/cnae.entity';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class CnaeSeedService {
  constructor(
    @InjectRepository(Cnae)
    private readonly cnaeRepository: Repository<Cnae>,
  ) {}

  async seed(): Promise<void> {
    const count = await this.cnaeRepository.count();

    if (count > 0) {
      console.log(
        `CNAEs já foram importados (${count} registros). Pulando seed...`,
      );
      return;
    }

    console.log('Iniciando importação de CNAEs...');

    try {
      // Arquivo JSON com todos os CNAEs deve ser baixado de:
      // https://servicodados.ibge.gov.br/api/v2/cnae/classes
      // ou https://concla.ibge.gov.br/busca-online-cnae.html

      // Usar caminho absoluto do arquivo de dados (não afetado pelo build)
      const filePath = path.join(
        process.cwd(),
        'src',
        'database',
        'seeds',
        'data',
        'cnaes.json',
      );

      if (!fs.existsSync(filePath)) {
        console.log(
          'Arquivo de CNAEs não encontrado. Baixe de https://servicodados.ibge.gov.br/api/v2/cnae/classes',
        );
        console.log('Criando alguns CNAEs de exemplo para área de saúde...');

        // CNAEs principais da área de saúde
        const cnaesSaude = [
          {
            codigo: '8610-1/01',
            descricao:
              'Atividades de atendimento hospitalar, exceto pronto-socorro e unidades para atendimento a urgências',
            secao: 'Q',
            descricaoSecao: 'SAÚDE HUMANA E SERVIÇOS SOCIAIS',
            divisao: '86',
            descricaoDivisao: 'Atividades de atenção à saúde humana',
            grupo: '861',
            descricaoGrupo: 'Atividades de atendimento hospitalar',
            classe: '8610',
            descricaoClasse: 'Atividades de atendimento hospitalar',
            subclasse: '8610-1',
            descricaoSubclasse: 'Atividades de atendimento hospitalar',
            ativo: true,
          },
          {
            codigo: '8610-1/02',
            descricao:
              'Atividades de atendimento em pronto-socorro e unidades hospitalares para atendimento a urgências',
            secao: 'Q',
            descricaoSecao: 'SAÚDE HUMANA E SERVIÇOS SOCIAIS',
            divisao: '86',
            descricaoDivisao: 'Atividades de atenção à saúde humana',
            grupo: '861',
            descricaoGrupo: 'Atividades de atendimento hospitalar',
            classe: '8610',
            descricaoClasse: 'Atividades de atendimento hospitalar',
            subclasse: '8610-1',
            descricaoSubclasse: 'Atividades de atendimento hospitalar',
            ativo: true,
          },
          {
            codigo: '8621-6/01',
            descricao: 'UTI móvel',
            secao: 'Q',
            descricaoSecao: 'SAÚDE HUMANA E SERVIÇOS SOCIAIS',
            divisao: '86',
            descricaoDivisao: 'Atividades de atenção à saúde humana',
            grupo: '862',
            descricaoGrupo:
              'Serviços móveis de atendimento a urgências e de remoção de pacientes',
            classe: '8621',
            descricaoClasse: 'Serviços móveis de atendimento a urgências',
            subclasse: '8621-6',
            descricaoSubclasse: 'Serviços móveis de atendimento a urgências',
            ativo: true,
          },
          {
            codigo: '8622-4/00',
            descricao:
              'Serviços de remoção de pacientes, exceto os serviços móveis de atendimento a urgências',
            secao: 'Q',
            descricaoSecao: 'SAÚDE HUMANA E SERVIÇOS SOCIAIS',
            divisao: '86',
            descricaoDivisao: 'Atividades de atenção à saúde humana',
            grupo: '862',
            descricaoGrupo:
              'Serviços móveis de atendimento a urgências e de remoção de pacientes',
            classe: '8622',
            descricaoClasse:
              'Serviços de remoção de pacientes, exceto os serviços móveis de atendimento a urgências',
            subclasse: '8622-4',
            descricaoSubclasse: 'Serviços de remoção de pacientes',
            ativo: true,
          },
          {
            codigo: '8630-5/01',
            descricao:
              'Atividade médica ambulatorial com recursos para realização de procedimentos cirúrgicos',
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
            subclasse: '8630-5',
            descricaoSubclasse: 'Atividades de atenção ambulatorial',
            ativo: true,
          },
          {
            codigo: '8630-5/02',
            descricao:
              'Atividade médica ambulatorial com recursos para realização de exames complementares',
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
            subclasse: '8630-5',
            descricaoSubclasse: 'Atividades de atenção ambulatorial',
            ativo: true,
          },
          {
            codigo: '8630-5/03',
            descricao: 'Atividade médica ambulatorial restrita a consultas',
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
            subclasse: '8630-5',
            descricaoSubclasse: 'Atividades de atenção ambulatorial',
            ativo: true,
          },
          {
            codigo: '8640-2/01',
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
            subclasse: '8640-2',
            descricaoSubclasse:
              'Atividades de serviços de complementação diagnóstica e terapêutica',
            ativo: true,
          },
          {
            codigo: '8640-2/02',
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
            subclasse: '8640-2',
            descricaoSubclasse:
              'Atividades de serviços de complementação diagnóstica e terapêutica',
            ativo: true,
          },
          {
            codigo: '8640-2/03',
            descricao: 'Serviços de diálise e nefrologia',
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
            subclasse: '8640-2',
            descricaoSubclasse:
              'Atividades de serviços de complementação diagnóstica e terapêutica',
            ativo: true,
          },
          {
            codigo: '8640-2/04',
            descricao: 'Serviços de tomografia',
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
            subclasse: '8640-2',
            descricaoSubclasse:
              'Atividades de serviços de complementação diagnóstica e terapêutica',
            ativo: true,
          },
          {
            codigo: '8640-2/05',
            descricao:
              'Serviços de diagnóstico por imagem com uso de radiação ionizante, exceto tomografia',
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
            subclasse: '8640-2',
            descricaoSubclasse:
              'Atividades de serviços de complementação diagnóstica e terapêutica',
            ativo: true,
          },
        ];

        for (const cnae of cnaesSaude) {
          const entity = this.cnaeRepository.create(cnae);
          await this.cnaeRepository.save(entity);
        }

        console.log(
          `${cnaesSaude.length} CNAEs de saúde importados com sucesso!`,
        );
        return;
      }

      // Se o arquivo existir, fazer importação completa
      const data = fs.readFileSync(filePath, 'utf8');
      const cnaes = JSON.parse(data);

      const chunks = [];
      const chunkSize = 500;

      for (let i = 0; i < cnaes.length; i += chunkSize) {
        chunks.push(cnaes.slice(i, i + chunkSize));
      }

      for (const chunk of chunks) {
        const entities = chunk.map((cnaeData) =>
          this.cnaeRepository.create({
            // Não definir ID - deixar o TypeORM gerar UUID automaticamente
            codigo: cnaeData.id,
            descricao: cnaeData.descricao,
            secao: cnaeData.grupo?.divisao?.secao?.id || 'A',
            descricaoSecao:
              cnaeData.grupo?.divisao?.secao?.descricao || 'NÃO ESPECIFICADO',
            divisao: cnaeData.grupo?.divisao?.id || '01',
            descricaoDivisao:
              cnaeData.grupo?.divisao?.descricao || 'NÃO ESPECIFICADO',
            grupo: cnaeData.grupo?.id || '011',
            descricaoGrupo: cnaeData.grupo?.descricao || 'NÃO ESPECIFICADO',
            classe: cnaeData.id?.substring(0, 4) || '0111',
            descricaoClasse: cnaeData.descricao,
            subclasse: cnaeData.id,
            descricaoSubclasse: cnaeData.descricao,
            ativo: true,
            observacoes: cnaeData.observacoes?.join('\n\n') || null,
          }),
        );
        await this.cnaeRepository.save(entities);
      }

      console.log(`${cnaes.length} CNAEs importados com sucesso!`);
    } catch (error) {
      console.error('Erro ao importar CNAEs:', error);
      throw error;
    }
  }
}
