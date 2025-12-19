import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Amb } from '../../modules/exames/amb/entities/amb.entity';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class AmbSeedService {
  constructor(
    @InjectRepository(Amb)
    private readonly ambRepository: Repository<Amb>,
  ) {}

  async seed(): Promise<void> {
    const count = await this.ambRepository.count();

    // Verificar se já foram importados
    if (count >= 3000) {
      console.log(
        `AMB já foram importados (${count} registros). Pulando seed...`,
      );
      return;
    }

    if (count > 0) {
      console.log(
        `Encontrados ${count} registro(s) AMB existente(s). Complementando importação...`,
      );
    } else {
      console.log('Iniciando importação de códigos AMB-92...');
    }

    try {
      // Ler arquivo CSV
      const csvPath = path.join(__dirname, 'data', 'amb-92.csv');

      if (!fs.existsSync(csvPath)) {
        console.warn('⚠️  Arquivo AMB CSV não encontrado em:', csvPath);
        console.warn(
          '    Para importar AMB, coloque o arquivo CSV em src/database/seeds/data/amb-92.csv',
        );
        return;
      }

      const csvContent = fs.readFileSync(csvPath, 'utf-8');
      const lines = csvContent.split('\n');

      // Encontrar linha de cabeçalho (CODIGO,,DESCRIÇÃO,CH,AUX,PORTE)
      let headerIndex = -1;
      for (let i = 0; i < Math.min(20, lines.length); i++) {
        if (lines[i].includes('CODIGO') && lines[i].includes('DESCRI')) {
          headerIndex = i;
          break;
        }
      }

      if (headerIndex === -1) {
        console.warn('⚠️  Cabeçalho do CSV não encontrado');
        return;
      }

      // Processar linhas de dados
      const ambToCreate: Partial<Amb>[] = [];
      const existingCodigos = new Set<string>();

      // Buscar códigos existentes
      if (count > 0) {
        const existing = await this.ambRepository.find({ select: ['codigo'] });
        existing.forEach((a) => existingCodigos.add(a.codigo));
      }

      for (let i = headerIndex + 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line || line === ',') continue;

        // Parse CSV com suporte a campos entre aspas
        const parsed = this.parseCSVLine(line);
        if (parsed.length < 3) continue;

        // Formato CSV real: CODIGO,DESCRIÇÃO,,CH,AUX,PORTE
        // (coluna vazia entre descrição e CH)
        const codigo = parsed[0].trim();
        const descricao = parsed[1].trim();
        const chStr = parsed[3]?.trim() || '0';
        const auxStr = parsed[4]?.trim() || '0';
        const porteStr = parsed[5]?.trim() || '0';

        // Validar código (deve ter dígitos)
        if (!codigo || !descricao || !/^\d+$/.test(codigo)) continue;

        // Pular se já existe
        if (existingCodigos.has(codigo)) continue;

        existingCodigos.add(codigo);

        // Converter valores numéricos
        const ch = parseFloat(chStr) || 0;
        const aux = parseFloat(auxStr) || 0;
        const porte = parseInt(porteStr, 10) || 0;

        ambToCreate.push({
          codigo,
          descricao,
          ch,
          aux,
          porte,
          versao: 'AMB-92',
          ativo: true,
        });
      }

      if (ambToCreate.length === 0) {
        console.log('ℹ️  Nenhum novo código AMB para importar.');
        return;
      }

      // Inserir em lotes para melhor performance
      const batchSize = 500;
      let imported = 0;

      for (let i = 0; i < ambToCreate.length; i += batchSize) {
        const batch = ambToCreate.slice(i, i + batchSize);
        const entities = batch.map((data) => this.ambRepository.create(data));
        await this.ambRepository.save(entities);
        imported += batch.length;
        console.log(
          `   → Importados ${imported}/${ambToCreate.length} códigos AMB...`,
        );
      }

      console.log(`✅ ${imported} códigos AMB-92 importados com sucesso!`);
    } catch (error) {
      console.error('❌ Erro ao importar códigos AMB:', error);
      throw error;
    }
  }

  /**
   * Parse CSV line handling quoted fields
   */
  private parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }

    result.push(current.trim());
    return result;
  }
}
