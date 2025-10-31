import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServicoSaude } from '../../modules/infraestrutura/common/entities/servico-saude.entity';

@Injectable()
export class ServicoSaudeSeedService {
  private readonly logger = new Logger(ServicoSaudeSeedService.name);

  constructor(
    @InjectRepository(ServicoSaude)
    private servicoSaudeRepository: Repository<ServicoSaude>,
  ) {}

  async seed(): Promise<void> {
    const count = await this.servicoSaudeRepository.count();

    // Só importa se a tabela estiver vazia ou com menos de 23 registros
    if (count >= 23) {
      this.logger.log(
        `✓ Serviços de Saúde já importados (${count} registros). Pulando importação.`,
      );
      return;
    }

    this.logger.log('Iniciando importação de Serviços de Saúde...');

    const servicos = [
      {
        codigo: '4.01',
        descricao: 'Medicina e biomedicina.',
        codigo_grupo: '4',
        nome_grupo: 'Serviços de saúde, assistência médica e congêneres',
      },
      {
        codigo: '4.02',
        descricao:
          'Análises clínicas, patologia, eletricidade médica, radioterapia, quimioterapia, ultra-sonografia, ressonância magnética, radiologia, tomografia e congêneres.',
        codigo_grupo: '4',
        nome_grupo: 'Serviços de saúde, assistência médica e congêneres',
      },
      {
        codigo: '4.03',
        descricao:
          'Hospitais, clínicas, laboratórios, sanatórios, manicômios, casas de saúde, prontos-socorros, ambulatórios e congêneres.',
        codigo_grupo: '4',
        nome_grupo: 'Serviços de saúde, assistência médica e congêneres',
      },
      {
        codigo: '4.04',
        descricao: 'Instrumentação cirúrgica.',
        codigo_grupo: '4',
        nome_grupo: 'Serviços de saúde, assistência médica e congêneres',
      },
      {
        codigo: '4.05',
        descricao: 'Acupuntura.',
        codigo_grupo: '4',
        nome_grupo: 'Serviços de saúde, assistência médica e congêneres',
      },
      {
        codigo: '4.06',
        descricao: 'Enfermagem, inclusive serviços auxiliares.',
        codigo_grupo: '4',
        nome_grupo: 'Serviços de saúde, assistência médica e congêneres',
      },
      {
        codigo: '4.07',
        descricao: 'Serviços farmacêuticos.',
        codigo_grupo: '4',
        nome_grupo: 'Serviços de saúde, assistência médica e congêneres',
      },
      {
        codigo: '4.08',
        descricao: 'Terapia ocupacional, fisioterapia e fonoaudiologia.',
        codigo_grupo: '4',
        nome_grupo: 'Serviços de saúde, assistência médica e congêneres',
      },
      {
        codigo: '4.09',
        descricao:
          'Terapias de qualquer espécie destinadas ao tratamento físico, orgânico e mental.',
        codigo_grupo: '4',
        nome_grupo: 'Serviços de saúde, assistência médica e congêneres',
      },
      {
        codigo: '4.10',
        descricao: 'Nutrição.',
        codigo_grupo: '4',
        nome_grupo: 'Serviços de saúde, assistência médica e congêneres',
      },
      {
        codigo: '4.11',
        descricao: 'Obstetrícia.',
        codigo_grupo: '4',
        nome_grupo: 'Serviços de saúde, assistência médica e congêneres',
      },
      {
        codigo: '4.12',
        descricao: 'Odontologia.',
        codigo_grupo: '4',
        nome_grupo: 'Serviços de saúde, assistência médica e congêneres',
      },
      {
        codigo: '4.13',
        descricao: 'Ortóptica.',
        codigo_grupo: '4',
        nome_grupo: 'Serviços de saúde, assistência médica e congêneres',
      },
      {
        codigo: '4.14',
        descricao: 'Próteses sob encomenda.',
        codigo_grupo: '4',
        nome_grupo: 'Serviços de saúde, assistência médica e congêneres',
      },
      {
        codigo: '4.15',
        descricao: 'Psicanálise.',
        codigo_grupo: '4',
        nome_grupo: 'Serviços de saúde, assistência médica e congêneres',
      },
      {
        codigo: '4.16',
        descricao: 'Psicologia.',
        codigo_grupo: '4',
        nome_grupo: 'Serviços de saúde, assistência médica e congêneres',
      },
      {
        codigo: '4.17',
        descricao:
          'Casas de repouso e de recuperação, creches, asilos e congêneres.',
        codigo_grupo: '4',
        nome_grupo: 'Serviços de saúde, assistência médica e congêneres',
      },
      {
        codigo: '4.18',
        descricao:
          'Inseminação artificial, fertilização in vitro e congêneres.',
        codigo_grupo: '4',
        nome_grupo: 'Serviços de saúde, assistência médica e congêneres',
      },
      {
        codigo: '4.19',
        descricao:
          'Bancos de sangue, leite, pele, olhos, óvulos, sêmen e congêneres.',
        codigo_grupo: '4',
        nome_grupo: 'Serviços de saúde, assistência médica e congêneres',
      },
      {
        codigo: '4.20',
        descricao:
          'Coleta de sangue, leite, tecidos, sêmen, órgãos e materiais biológicos de qualquer espécie.',
        codigo_grupo: '4',
        nome_grupo: 'Serviços de saúde, assistência médica e congêneres',
      },
      {
        codigo: '4.21',
        descricao:
          'Unidade de atendimento, assistência ou tratamento móvel e congêneres.',
        codigo_grupo: '4',
        nome_grupo: 'Serviços de saúde, assistência médica e congêneres',
      },
      {
        codigo: '4.22',
        descricao:
          'Planos de medicina de grupo ou individual e convênios para prestação de assistência médica, hospitalar, odontológica e congêneres.',
        codigo_grupo: '4',
        nome_grupo: 'Serviços de saúde, assistência médica e congêneres',
      },
      {
        codigo: '4.23',
        descricao:
          'Outros planos de saúde que se cumpram através de serviços de terceiros contratados, credenciados, cooperados ou apenas pagos pelo operador do plano mediante indicação do beneficiário.',
        codigo_grupo: '4',
        nome_grupo: 'Serviços de saúde, assistência médica e congêneres',
      },
    ];

    try {
      for (const servico of servicos) {
        // Verifica se já existe
        const existe = await this.servicoSaudeRepository.findOne({
          where: { codigo: servico.codigo },
        });

        if (!existe) {
          await this.servicoSaudeRepository.save(
            this.servicoSaudeRepository.create(servico),
          );
          this.logger.log(`✓ Serviço ${servico.codigo} importado`);
        }
      }

      this.logger.log(
        `✓ Importação concluída! ${servicos.length} serviços de saúde disponíveis.`,
      );
    } catch (error) {
      this.logger.error('Erro ao importar serviços de saúde:', error);
      throw error;
    }
  }
}
