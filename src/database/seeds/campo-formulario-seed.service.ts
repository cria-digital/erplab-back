import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CampoFormulario } from '../../modules/infraestrutura/campos-formulario/entities/campo-formulario.entity';
import { AlternativaCampoFormulario } from '../../modules/infraestrutura/campos-formulario/entities/alternativa-campo-formulario.entity';
import { NomeCampoFormulario } from '../../modules/infraestrutura/campos-formulario/entities/campo-formulario.entity';

interface AlternativaData {
  texto: string;
  ordem: number;
}

interface CampoData {
  nomeCampo: NomeCampoFormulario;
  descricao: string;
  alternativas: AlternativaData[];
}

@Injectable()
export class CampoFormularioSeedService {
  private readonly logger = new Logger(CampoFormularioSeedService.name);

  constructor(
    @InjectRepository(CampoFormulario)
    private readonly campoRepository: Repository<CampoFormulario>,
    @InjectRepository(AlternativaCampoFormulario)
    private readonly alternativaRepository: Repository<AlternativaCampoFormulario>,
  ) {}

  async seed(): Promise<void> {
    this.logger.log('🌱 Iniciando seeder de Campos de Formulário...');

    // Verificar se já existem campos cadastrados
    const count = await this.campoRepository.count();
    if (count > 0) {
      this.logger.log(
        `ℹ️  Já existem ${count} campos cadastrados. Pulando seeder.`,
      );
      return;
    }

    const campos: CampoData[] = [
      {
        nomeCampo: NomeCampoFormulario.TIPO_EXAMES,
        descricao: 'Classificação do tipo de exame',
        alternativas: [
          { texto: 'Laboratorial', ordem: 1 },
          { texto: 'Imagem', ordem: 2 },
          { texto: 'Funcional', ordem: 3 },
          { texto: 'Procedimento', ordem: 4 },
          { texto: 'Análise Clínica', ordem: 5 },
        ],
      },
      {
        nomeCampo: NomeCampoFormulario.ESPECIALIDADE,
        descricao: 'Especialidade médica relacionada ao exame',
        alternativas: [
          { texto: 'Cardiologia', ordem: 1 },
          { texto: 'Neurologia', ordem: 2 },
          { texto: 'Ortopedia', ordem: 3 },
          { texto: 'Dermatologia', ordem: 4 },
          { texto: 'Oftalmologia', ordem: 5 },
          { texto: 'Otorrinolaringologia', ordem: 6 },
          { texto: 'Ginecologia', ordem: 7 },
          { texto: 'Urologia', ordem: 8 },
          { texto: 'Pediatria', ordem: 9 },
          { texto: 'Clínica Geral', ordem: 10 },
        ],
      },
      {
        nomeCampo: NomeCampoFormulario.GRUPO,
        descricao: 'Grupo de exames (categoria principal)',
        alternativas: [
          { texto: 'Bioquímica', ordem: 1 },
          { texto: 'Hematologia', ordem: 2 },
          { texto: 'Imunologia', ordem: 3 },
          { texto: 'Microbiologia', ordem: 4 },
          { texto: 'Parasitologia', ordem: 5 },
          { texto: 'Urinálise', ordem: 6 },
          { texto: 'Hormonologia', ordem: 7 },
        ],
      },
      {
        nomeCampo: NomeCampoFormulario.SUBGRUPO,
        descricao: 'Subgrupo de exames (subcategoria)',
        alternativas: [
          { texto: 'Glicemia', ordem: 1 },
          { texto: 'Lipidograma', ordem: 2 },
          { texto: 'Função Renal', ordem: 3 },
          { texto: 'Função Hepática', ordem: 4 },
          { texto: 'Eletrólitos', ordem: 5 },
          { texto: 'Hemograma Completo', ordem: 6 },
          { texto: 'Coagulograma', ordem: 7 },
        ],
      },
      {
        nomeCampo: NomeCampoFormulario.SETOR,
        descricao: 'Setor responsável pela execução do exame',
        alternativas: [
          { texto: 'Bioquímica', ordem: 1 },
          { texto: 'Hematologia', ordem: 2 },
          { texto: 'Imunologia', ordem: 3 },
          { texto: 'Microbiologia', ordem: 4 },
          { texto: 'Parasitologia', ordem: 5 },
          { texto: 'Urinálise', ordem: 6 },
          { texto: 'Sorologia', ordem: 7 },
          { texto: 'Hormônios', ordem: 8 },
        ],
      },
      {
        nomeCampo: NomeCampoFormulario.METODOLOGIA,
        descricao: 'Metodologia utilizada para executar o exame',
        alternativas: [
          { texto: 'Automação', ordem: 1 },
          { texto: 'Enzimático', ordem: 2 },
          { texto: 'Colorimétrico', ordem: 3 },
          { texto: 'Imunoensaio', ordem: 4 },
          { texto: 'ELISA', ordem: 5 },
          { texto: 'PCR', ordem: 6 },
          { texto: 'Microscopia', ordem: 7 },
          { texto: 'Cultura', ordem: 8 },
          { texto: 'Quimioluminescência', ordem: 9 },
        ],
      },
      {
        nomeCampo: NomeCampoFormulario.UNIDADE_MEDIDA,
        descricao: 'Unidade de medida do resultado',
        alternativas: [
          { texto: 'mg/dL', ordem: 1 },
          { texto: 'g/dL', ordem: 2 },
          { texto: 'mEq/L', ordem: 3 },
          { texto: 'mmol/L', ordem: 4 },
          { texto: 'UI/L', ordem: 5 },
          { texto: 'ng/mL', ordem: 6 },
          { texto: 'pg/mL', ordem: 7 },
          { texto: 'µg/dL', ordem: 8 },
          { texto: 'mil/mm³', ordem: 9 },
          { texto: '%', ordem: 10 },
          { texto: 'segundos', ordem: 11 },
          { texto: 'ratio', ordem: 12 },
        ],
      },
      {
        nomeCampo: NomeCampoFormulario.AMOSTRA,
        descricao: 'Tipo de amostra biológica necessária',
        alternativas: [
          { texto: 'Sangue Total', ordem: 1 },
          { texto: 'Soro', ordem: 2 },
          { texto: 'Plasma', ordem: 3 },
          { texto: 'Urina', ordem: 4 },
          { texto: 'Fezes', ordem: 5 },
          { texto: 'Líquor', ordem: 6 },
          { texto: 'Swab Nasal', ordem: 7 },
          { texto: 'Swab Orofaringe', ordem: 8 },
          { texto: 'Escarro', ordem: 9 },
          { texto: 'Saliva', ordem: 10 },
        ],
      },
      {
        nomeCampo: NomeCampoFormulario.REGIAO_COLETA,
        descricao: 'Região anatômica para coleta da amostra',
        alternativas: [
          { texto: 'Veia do antebraço', ordem: 1 },
          { texto: 'Veia dorsal da mão', ordem: 2 },
          { texto: 'Punção arterial', ordem: 3 },
          { texto: 'Punção lombar', ordem: 4 },
          { texto: 'Nasofaringe', ordem: 5 },
          { texto: 'Orofaringe', ordem: 6 },
          { texto: 'Jato médio', ordem: 7 },
          { texto: 'Ponta do dedo', ordem: 8 },
        ],
      },
      {
        nomeCampo: NomeCampoFormulario.VOLUME_MINIMO,
        descricao: 'Volume mínimo de amostra necessário',
        alternativas: [
          { texto: '1 mL', ordem: 1 },
          { texto: '2 mL', ordem: 2 },
          { texto: '3 mL', ordem: 3 },
          { texto: '5 mL', ordem: 4 },
          { texto: '10 mL', ordem: 5 },
          { texto: '20 mL', ordem: 6 },
          { texto: '0,5 mL', ordem: 7 },
          { texto: '0,3 mL', ordem: 8 },
        ],
      },
      {
        nomeCampo: NomeCampoFormulario.ESTABILIDADE,
        descricao: 'Estabilidade da amostra e condições de armazenamento',
        alternativas: [
          { texto: '2h temperatura ambiente', ordem: 1 },
          { texto: '4h temperatura ambiente', ordem: 2 },
          { texto: '8h temperatura ambiente', ordem: 3 },
          { texto: '24h refrigerado (2-8°C)', ordem: 4 },
          { texto: '48h refrigerado (2-8°C)', ordem: 5 },
          { texto: '72h refrigerado (2-8°C)', ordem: 6 },
          { texto: '7 dias refrigerado', ordem: 7 },
          { texto: '30 dias congelado (-20°C)', ordem: 8 },
          { texto: 'Processar imediatamente', ordem: 9 },
        ],
      },
    ];

    let totalCampos = 0;
    let totalAlternativas = 0;

    // Inserir campos com suas alternativas
    for (const campoData of campos) {
      try {
        // Criar o campo
        const campo = this.campoRepository.create({
          nomeCampo: campoData.nomeCampo,
          descricao: campoData.descricao,
          ativo: true,
          createdBy: 'sistema',
        });

        const campoSalvo = await this.campoRepository.save(campo);
        totalCampos++;

        // Criar as alternativas
        for (const altData of campoData.alternativas) {
          const alternativa = this.alternativaRepository.create({
            campoFormularioId: campoSalvo.id,
            textoAlternativa: altData.texto,
            ordem: altData.ordem,
            ativo: true,
          });

          await this.alternativaRepository.save(alternativa);
          totalAlternativas++;
        }

        this.logger.log(
          `✅ Campo "${campoData.nomeCampo}" criado com ${campoData.alternativas.length} alternativas`,
        );
      } catch (error) {
        this.logger.error(
          `❌ Erro ao criar campo "${campoData.nomeCampo}": ${error.message}`,
        );
      }
    }

    this.logger.log(
      `✨ Seeder concluído: ${totalCampos} campos e ${totalAlternativas} alternativas criados`,
    );
  }
}
