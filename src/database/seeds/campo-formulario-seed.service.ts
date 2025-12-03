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
    const startTime = Date.now();
    this.logger.log('🌱 [SEEDER] Iniciando seeder de Campos de Formulário...');
    this.logger.log(`🕒 [SEEDER] Timestamp: ${new Date().toISOString()}`);

    const count = await this.campoRepository.count();
    this.logger.log(`ℹ️  [SEEDER] Encontrados ${count} campo(s) existente(s).`);

    const campos: CampoData[] = [
      {
        nomeCampo: NomeCampoFormulario.TIPO_EXAMES,
        descricao: '',
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
        descricao: '',
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
        descricao: '',
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
        descricao: '',
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
        descricao: '',
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
        descricao: '',
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
        descricao: '',
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
        descricao: '',
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
        nomeCampo: NomeCampoFormulario.TIPO_RECIPIENTE,
        descricao: '',
        alternativas: [
          { texto: 'Tubo EDTA (tampa roxa)', ordem: 1 },
          { texto: 'Tubo Citrato (tampa azul)', ordem: 2 },
          { texto: 'Tubo Seco (tampa vermelha)', ordem: 3 },
          { texto: 'Tubo com Gel Separador (tampa amarela)', ordem: 4 },
          { texto: 'Tubo Heparina (tampa verde)', ordem: 5 },
          { texto: 'Tubo Fluoreto (tampa cinza)', ordem: 6 },
          { texto: 'Frasco Estéril', ordem: 7 },
          { texto: 'Frasco Urina', ordem: 8 },
          { texto: 'Pote Fezes', ordem: 9 },
          { texto: 'Swab Estéril', ordem: 10 },
          { texto: 'Seringa', ordem: 11 },
          { texto: 'Microtainer', ordem: 12 },
        ],
      },
      {
        nomeCampo: NomeCampoFormulario.REGIAO_COLETA,
        descricao: '',
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
        descricao: '',
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
        descricao: '',
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
      {
        nomeCampo: NomeCampoFormulario.FORMATO_LAUDO,
        descricao: '',
        alternativas: [
          { texto: 'Laudo Padrão', ordem: 1 },
          { texto: 'Laudo Descritivo', ordem: 2 },
          { texto: 'Laudo com Imagem', ordem: 3 },
          { texto: 'Laudo Gráfico', ordem: 4 },
          { texto: 'Laudo Tabular', ordem: 5 },
          { texto: 'Laudo Audiométrico', ordem: 6 },
          { texto: 'Laudo Eletrocardiográfico', ordem: 7 },
        ],
      },
    ];

    let totalCamposNovos = 0;
    let totalAlternativasNovas = 0;

    // Inserir campos com suas alternativas (incremental)
    for (const campoData of campos) {
      try {
        // Verifica se o campo já existe
        const campoExistente = await this.campoRepository.findOne({
          where: { nomeCampo: campoData.nomeCampo },
          relations: ['alternativas'],
        });

        let campoSalvo: any;

        if (!campoExistente) {
          // Campo não existe - criar novo
          const campo = this.campoRepository.create({
            nomeCampo: campoData.nomeCampo,
            descricao: campoData.descricao,
            ativo: true,
            createdBy: 'sistema',
          });

          campoSalvo = await this.campoRepository.save(campo);
          totalCamposNovos++;
          this.logger.log(`➕ Campo "${campoData.nomeCampo}" criado`);
        } else {
          // Campo já existe - usar o existente
          campoSalvo = campoExistente;
          this.logger.log(`✓ Campo "${campoData.nomeCampo}" já existe`);
        }

        // Verificar e inserir alternativas faltantes
        const alternativasExistentes = campoExistente?.alternativas || [];
        const textosExistentes = alternativasExistentes.map(
          (alt) => alt.textoAlternativa,
        );

        for (const altData of campoData.alternativas) {
          // Verifica se a alternativa já existe (por texto)
          if (!textosExistentes.includes(altData.texto)) {
            const alternativa = this.alternativaRepository.create({
              campoFormularioId: campoSalvo.id,
              textoAlternativa: altData.texto,
              ordem: altData.ordem,
              ativo: true,
            });

            await this.alternativaRepository.save(alternativa);
            totalAlternativasNovas++;
            this.logger.log(
              `  ➕ Alternativa "${altData.texto}" adicionada ao campo "${campoData.nomeCampo}"`,
            );
          }
        }
      } catch (error) {
        this.logger.error(
          `❌ Erro ao processar campo "${campoData.nomeCampo}": ${error.message}`,
        );
      }
    }

    const duration = Date.now() - startTime;

    if (totalCamposNovos > 0 || totalAlternativasNovas > 0) {
      this.logger.log(
        `✨ [SEEDER] Concluído: ${totalCamposNovos} campo(s) novo(s) e ${totalAlternativasNovas} alternativa(s) nova(s) adicionadas`,
      );
    } else {
      this.logger.log(
        `✓ [SEEDER] Todos os campos e alternativas já estão atualizados. Nenhuma alteração necessária.`,
      );
    }

    this.logger.log(
      `⏱️  [SEEDER] Tempo de execução: ${duration}ms (${(duration / 1000).toFixed(2)}s)`,
    );
    this.logger.log(`🏁 [SEEDER] Finalizado em: ${new Date().toISOString()}`);
  }
}
