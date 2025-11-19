import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cnae } from '../../modules/infraestrutura/common/entities/cnae.entity';

@Injectable()
export class CnaeSeedService {
  constructor(
    @InjectRepository(Cnae)
    private readonly cnaeRepository: Repository<Cnae>,
  ) {}

  async seed(): Promise<void> {
    console.log('Iniciando sincronização de CNAEs da área de saúde...');

    // Códigos dos CNAEs que devem permanecer ativos
    const codigosCnaesAtivos = [
      '8640-2/02',
      '8640-2/03',
      '8640-2/04',
      '8640-2/05',
      '8640-2/06',
      '8640-2/07',
      '8640-2/08',
      '8640-2/09',
      '8640-2/10',
      '8640-2/11',
      '8621-4/00',
      '8630-5/03',
      '8630-5/01',
      '8630-5/02',
      '7490-1/04',
      '8610-1/01',
      '8299-7/99',
    ];

    // 1. Desativar todos os CNAEs que não estão na lista
    await this.cnaeRepository
      .createQueryBuilder()
      .update()
      .set({ ativo: false })
      .where('codigo NOT IN (:...codigos)', { codigos: codigosCnaesAtivos })
      .execute();

    console.log('✅ CNAEs fora da lista de saúde foram marcados como inativos');

    // CNAEs específicos para Laboratórios, Consultórios e Saúde Ocupacional
    const cnaesSaude = [
      // 🧬 1. Laboratórios, Diagnóstico e Imagem
      {
        codigo: '8640-2/02',
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
        codigo: '8640-2/03',
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
          'Serviços de diagnóstico por imagem com uso de radiação ionizante',
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
        codigo: '8640-2/06',
        descricao: 'Serviços de ressonância magnética',
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
        codigo: '8640-2/07',
        descricao:
          'Serviços de diagnóstico por imagem sem uso de radiação ionizante',
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
        codigo: '8640-2/08',
        descricao:
          'Serviços de registros gráficos e métodos ópticos (ECG, EEG, etc.)',
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
        codigo: '8640-2/09',
        descricao: 'Serviços de diagnóstico por imagem até 1 Tesla',
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
        codigo: '8640-2/10',
        descricao: 'Serviços de diagnóstico por imagem acima de 1 Tesla',
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
        codigo: '8640-2/11',
        descricao: 'Serviços de apoio à diagnose (diversos)',
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

      // 🩺 2. Consultórios e Clínicas Médicas
      {
        codigo: '8621-4/00',
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
        subclasse: '8621-4',
        descricaoSubclasse: 'Consultórios médicos',
        ativo: true,
      },
      {
        codigo: '8630-5/03',
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
        subclasse: '8630-5',
        descricaoSubclasse: 'Atividades de atenção ambulatorial',
        ativo: true,
      },
      {
        codigo: '8630-5/01',
        descricao:
          'Atividade médica ambulatorial com recursos para exames complementares',
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
        descricao: 'Unidade de atendimento médico de urgência e emergência',
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

      // 🪪 3. Saúde Ocupacional / Segurança do Trabalho
      {
        codigo: '7490-1/04',
        descricao: 'Serviços de perícia técnica e inspeção do trabalho',
        secao: 'M',
        descricaoSecao: 'ATIVIDADES PROFISSIONAIS, CIENTÍFICAS E TÉCNICAS',
        divisao: '74',
        descricaoDivisao:
          'Outras atividades profissionais, científicas e técnicas',
        grupo: '749',
        descricaoGrupo:
          'Outras atividades profissionais, científicas e técnicas não especificadas anteriormente',
        classe: '7490',
        descricaoClasse:
          'Outras atividades profissionais, científicas e técnicas não especificadas anteriormente',
        subclasse: '7490-1',
        descricaoSubclasse:
          'Atividades profissionais, científicas e técnicas não especificadas anteriormente',
        ativo: true,
      },
      {
        codigo: '8610-1/01',
        descricao: 'Atividades de atendimento hospitalar',
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
        codigo: '8299-7/99',
        descricao: 'Atividades de apoio administrativo',
        secao: 'N',
        descricaoSecao: 'ATIVIDADES ADMINISTRATIVAS E SERVIÇOS COMPLEMENTARES',
        divisao: '82',
        descricaoDivisao:
          'Serviços de escritório, de apoio administrativo e outros serviços prestados às empresas',
        grupo: '829',
        descricaoGrupo:
          'Atividades de serviços prestados principalmente às empresas não especificadas anteriormente',
        classe: '8299',
        descricaoClasse:
          'Outras atividades de serviços prestados principalmente às empresas não especificadas anteriormente',
        subclasse: '8299-7',
        descricaoSubclasse:
          'Outras atividades de serviços prestados principalmente às empresas',
        ativo: true,
      },
    ];

    // 2. Inserir ou atualizar os CNAEs de saúde
    let inseridos = 0;
    let atualizados = 0;

    for (const cnae of cnaesSaude) {
      const existente = await this.cnaeRepository.findOne({
        where: { codigo: cnae.codigo },
      });

      if (existente) {
        // Atualizar registro existente, garantindo que fique ativo
        await this.cnaeRepository.update(
          { codigo: cnae.codigo },
          { ...cnae, ativo: true },
        );
        atualizados++;
      } else {
        // Inserir novo registro
        const entity = this.cnaeRepository.create(cnae);
        await this.cnaeRepository.save(entity);
        inseridos++;
      }
    }

    console.log(
      `✅ Sincronização concluída: ${inseridos} CNAEs inseridos, ${atualizados} atualizados`,
    );
  }
}
