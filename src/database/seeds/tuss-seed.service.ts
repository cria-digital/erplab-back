import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tuss } from '../../modules/exames/tuss/entities/tuss.entity';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class TussSeedService {
  constructor(
    @InjectRepository(Tuss)
    private readonly tussRepository: Repository<Tuss>,
  ) {}

  async seed(): Promise<void> {
    const count = await this.tussRepository.count();

    // Verificar se já foram importados
    if (count >= 5000) {
      console.log(
        `TUSS já foram importados (${count} registros). Pulando seed...`,
      );
      return;
    }

    if (count > 0) {
      console.log(
        `Encontrados ${count} registro(s) TUSS existente(s). Complementando importação...`,
      );
    } else {
      console.log('Iniciando importação de códigos TUSS...');
    }

    try {
      // Ler arquivo CSV
      const csvPath = path.join(__dirname, 'data', 'tuss.csv');

      if (!fs.existsSync(csvPath)) {
        console.warn('⚠️  Arquivo TUSS CSV não encontrado em:', csvPath);
        console.warn(
          '    Para importar TUSS, coloque o arquivo CSV em src/database/seeds/data/tuss.csv',
        );
        return;
      }

      const csvContent = fs.readFileSync(csvPath, 'utf-8');
      const lines = csvContent.split('\n');

      // Encontrar linha de cabeçalho (Código do Termo,Termo)
      let headerIndex = -1;
      for (let i = 0; i < Math.min(20, lines.length); i++) {
        if (
          lines[i].includes('Código do Termo') &&
          lines[i].includes('Termo')
        ) {
          headerIndex = i;
          break;
        }
      }

      if (headerIndex === -1) {
        console.warn('⚠️  Cabeçalho do CSV não encontrado');
        return;
      }

      // Processar linhas de dados
      const tussToCreate: Partial<Tuss>[] = [];
      const existingCodigos = new Set<string>();

      // Buscar códigos existentes
      if (count > 0) {
        const existing = await this.tussRepository.find({ select: ['codigo'] });
        existing.forEach((t) => existingCodigos.add(t.codigo));
      }

      for (let i = headerIndex + 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line || line === ',') continue;

        // Parse CSV com suporte a campos entre aspas
        const parsed = this.parseCSVLine(line);
        if (parsed.length < 2) continue;

        const codigo = parsed[0].trim();
        const termo = parsed[1].trim();

        // Validar código (deve ser numérico e ter 8 dígitos)
        if (!codigo || !termo || !/^\d{8}$/.test(codigo)) continue;

        // Pular se já existe
        if (existingCodigos.has(codigo)) continue;

        existingCodigos.add(codigo);
        tussToCreate.push({
          codigo,
          termo,
          versao: '202511',
          ativo: true,
        });
      }

      if (tussToCreate.length === 0) {
        console.log('ℹ️  Nenhum novo código TUSS para importar.');
        return;
      }

      // Inserir em lotes para melhor performance
      const batchSize = 500;
      let imported = 0;

      for (let i = 0; i < tussToCreate.length; i += batchSize) {
        const batch = tussToCreate.slice(i, i + batchSize);
        const entities = batch.map((data) => this.tussRepository.create(data));
        await this.tussRepository.save(entities);
        imported += batch.length;
        console.log(
          `   → Importados ${imported}/${tussToCreate.length} códigos TUSS...`,
        );
      }

      console.log(`✅ ${imported} códigos TUSS importados com sucesso!`);
    } catch (error) {
      console.error('❌ Erro ao importar códigos TUSS:', error);
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
