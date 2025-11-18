import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Estado } from '../../modules/infraestrutura/common/entities/estado.entity';

@Injectable()
export class EstadoSeedService {
  constructor(
    @InjectRepository(Estado)
    private readonly estadoRepository: Repository<Estado>,
  ) {}

  async seed(): Promise<void> {
    const count = await this.estadoRepository.count();

    // Só executa se não houver estados cadastrados
    if (count > 0) {
      console.log('Estados já foram inseridos anteriormente. Pulando seed...');
      return;
    }

    console.log('Inserindo estados do Brasil...');

    const estados = [
      { nome: 'Acre', uf: 'AC', codigoIbge: '12', regiao: 'Norte' },
      { nome: 'Alagoas', uf: 'AL', codigoIbge: '27', regiao: 'Nordeste' },
      { nome: 'Amapá', uf: 'AP', codigoIbge: '16', regiao: 'Norte' },
      { nome: 'Amazonas', uf: 'AM', codigoIbge: '13', regiao: 'Norte' },
      { nome: 'Bahia', uf: 'BA', codigoIbge: '29', regiao: 'Nordeste' },
      { nome: 'Ceará', uf: 'CE', codigoIbge: '23', regiao: 'Nordeste' },
      {
        nome: 'Distrito Federal',
        uf: 'DF',
        codigoIbge: '53',
        regiao: 'Centro-Oeste',
      },
      { nome: 'Espírito Santo', uf: 'ES', codigoIbge: '32', regiao: 'Sudeste' },
      { nome: 'Goiás', uf: 'GO', codigoIbge: '52', regiao: 'Centro-Oeste' },
      { nome: 'Maranhão', uf: 'MA', codigoIbge: '21', regiao: 'Nordeste' },
      {
        nome: 'Mato Grosso',
        uf: 'MT',
        codigoIbge: '51',
        regiao: 'Centro-Oeste',
      },
      {
        nome: 'Mato Grosso do Sul',
        uf: 'MS',
        codigoIbge: '50',
        regiao: 'Centro-Oeste',
      },
      { nome: 'Minas Gerais', uf: 'MG', codigoIbge: '31', regiao: 'Sudeste' },
      { nome: 'Pará', uf: 'PA', codigoIbge: '15', regiao: 'Norte' },
      { nome: 'Paraíba', uf: 'PB', codigoIbge: '25', regiao: 'Nordeste' },
      { nome: 'Paraná', uf: 'PR', codigoIbge: '41', regiao: 'Sul' },
      { nome: 'Pernambuco', uf: 'PE', codigoIbge: '26', regiao: 'Nordeste' },
      { nome: 'Piauí', uf: 'PI', codigoIbge: '22', regiao: 'Nordeste' },
      { nome: 'Rio de Janeiro', uf: 'RJ', codigoIbge: '33', regiao: 'Sudeste' },
      {
        nome: 'Rio Grande do Norte',
        uf: 'RN',
        codigoIbge: '24',
        regiao: 'Nordeste',
      },
      { nome: 'Rio Grande do Sul', uf: 'RS', codigoIbge: '43', regiao: 'Sul' },
      { nome: 'Rondônia', uf: 'RO', codigoIbge: '11', regiao: 'Norte' },
      { nome: 'Roraima', uf: 'RR', codigoIbge: '14', regiao: 'Norte' },
      { nome: 'Santa Catarina', uf: 'SC', codigoIbge: '42', regiao: 'Sul' },
      { nome: 'São Paulo', uf: 'SP', codigoIbge: '35', regiao: 'Sudeste' },
      { nome: 'Sergipe', uf: 'SE', codigoIbge: '28', regiao: 'Nordeste' },
      { nome: 'Tocantins', uf: 'TO', codigoIbge: '17', regiao: 'Norte' },
    ];

    await this.estadoRepository.save(estados);

    console.log(`✅ ${estados.length} estados inseridos com sucesso!`);
  }
}
