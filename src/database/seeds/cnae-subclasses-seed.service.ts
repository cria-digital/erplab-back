import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cnae } from '../../modules/infraestrutura/common/entities/cnae.entity';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class CnaeSubclassesSeedService {
  constructor(
    @InjectRepository(Cnae)
    private readonly cnaeRepository: Repository<Cnae>,
  ) {}

  /**
   * Converte código CNAE do formato XXXX-X/XX para XXXXXXX (7 dígitos)
   */
  private normalizarCodigo(codigo: string): string {
    return codigo.replace(/[-/]/g, '');
  }

  /**
   * Extrai o código da classe (4 dígitos) do código da subclasse
   * Ex: "0111-3/01" -> "0111"
   */
  private extrairClasse(codigoSubclasse: string): string {
    return codigoSubclasse.substring(0, 4);
  }

  async seed(): Promise<void> {
    console.log('🌱 Iniciando importação de Subclasses CNAE do IBGE...');

    const csvPath = path.join(__dirname, 'data', 'cnae', 'cnae_subclasses.csv');

    if (!fs.existsSync(csvPath)) {
      console.log(
        '⚠️ Arquivo cnae_subclasses.csv não encontrado. Pulando importação de subclasses.',
      );
      return;
    }

    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    const linhas = csvContent.split('\n');

    // Variáveis para rastrear a hierarquia atual
    let secaoAtual = '';
    let descricaoSecaoAtual = '';
    let divisaoAtual = '';
    let descricaoDivisaoAtual = '';
    let grupoAtual = '';
    let descricaoGrupoAtual = '';
    let classeAtual = '';
    let descricaoClasseAtual = '';

    let inseridos = 0;
    let jaExistentes = 0;
    let erros = 0;

    for (const linha of linhas) {
      // Parse CSV simples (considerando aspas)
      const colunas = this.parseCSVLine(linha);

      if (colunas.length < 6) continue;

      const [secao, divisao, grupo, classe, subclasse, denominacao] = colunas;

      // Atualiza seção se presente
      if (secao && secao.match(/^[A-U]$/)) {
        secaoAtual = secao;
        descricaoSecaoAtual = (denominacao || '').toUpperCase();
        continue;
      }

      // Atualiza divisão se presente
      if (divisao && divisao.match(/^\d{2}$/)) {
        divisaoAtual = divisao;
        descricaoDivisaoAtual = (denominacao || '').toUpperCase();
        continue;
      }

      // Atualiza grupo se presente (formato XX.X)
      if (grupo && grupo.match(/^\d{2}\.\d$/)) {
        grupoAtual = grupo.replace('.', '');
        descricaoGrupoAtual = (denominacao || '').toUpperCase();
        continue;
      }

      // Atualiza classe se presente (formato XX.XX-X)
      if (classe && classe.match(/^\d{2}\.\d{2}-\d$/)) {
        classeAtual = classe.substring(0, 2) + classe.substring(3, 5);
        descricaoClasseAtual = (denominacao || '').toUpperCase();
        continue;
      }

      // Processa subclasse se presente (formato XXXX-X/XX)
      if (subclasse && subclasse.match(/^\d{4}-\d\/\d{2}$/)) {
        const codigo7digitos = this.normalizarCodigo(subclasse);
        const descricaoSubclasse = (denominacao || '').toUpperCase();

        try {
          // Verifica se já existe
          const existente = await this.cnaeRepository.findOne({
            where: { codigo: codigo7digitos },
          });

          if (existente) {
            jaExistentes++;
            continue;
          }

          // Cria novo registro
          const cnae = this.cnaeRepository.create({
            codigo: codigo7digitos,
            descricao: descricaoSubclasse,
            secao: secaoAtual,
            descricaoSecao: descricaoSecaoAtual,
            divisao: divisaoAtual,
            descricaoDivisao: descricaoDivisaoAtual,
            grupo: grupoAtual,
            descricaoGrupo: descricaoGrupoAtual,
            classe: classeAtual,
            descricaoClasse: descricaoClasseAtual,
            subclasse: codigo7digitos,
            descricaoSubclasse: descricaoSubclasse,
            ativo: true,
          });

          await this.cnaeRepository.save(cnae);
          inseridos++;

          if (inseridos % 100 === 0) {
            console.log(`  ➕ ${inseridos} subclasses inseridas...`);
          }
        } catch (error) {
          erros++;
          if (erros <= 5) {
            console.error(
              `❌ Erro ao inserir ${codigo7digitos}: ${error.message}`,
            );
          }
        }
      }
    }

    console.log(`✅ Importação de Subclasses CNAE concluída:`);
    console.log(`   - ${inseridos} novas subclasses inseridas`);
    console.log(`   - ${jaExistentes} já existiam no banco`);
    if (erros > 0) {
      console.log(`   - ${erros} erros`);
    }
  }

  /**
   * Parse simples de linha CSV considerando aspas
   */
  private parseCSVLine(linha: string): string[] {
    const resultado: string[] = [];
    let atual = '';
    let dentroAspas = false;

    for (let i = 0; i < linha.length; i++) {
      const char = linha[i];

      if (char === '"') {
        dentroAspas = !dentroAspas;
      } else if (char === ',' && !dentroAspas) {
        resultado.push(atual.trim());
        atual = '';
      } else {
        atual += char;
      }
    }

    resultado.push(atual.trim());
    return resultado;
  }
}
