import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class HorarioAtendimentoResponseDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  diaSemana: string;

  @ApiProperty()
  @Expose()
  horarioInicio: string;

  @ApiProperty()
  @Expose()
  horarioFim: string;

  @ApiProperty({ required: false })
  @Expose()
  intervaloInicio?: string;

  @ApiProperty({ required: false })
  @Expose()
  intervaloFim?: string;

  @ApiProperty()
  @Expose()
  semIntervalo: boolean;

  @ApiProperty()
  @Expose()
  ativo: boolean;
}

export class BancoResponseDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  codigo: string;

  @ApiProperty()
  @Expose()
  nome: string;
}

export class DadoBancarioResponseDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  bancoId: string;

  @ApiProperty({ type: BancoResponseDto })
  @Expose()
  @Type(() => BancoResponseDto)
  banco: BancoResponseDto;

  @ApiProperty()
  @Expose()
  agencia: string;

  @ApiProperty({ required: false })
  @Expose()
  digitoAgencia?: string;

  @ApiProperty()
  @Expose()
  contaCorrente: string;

  @ApiProperty({ required: false })
  @Expose()
  digitoConta?: string;

  @ApiProperty()
  @Expose()
  tipoConta: string;

  @ApiProperty()
  @Expose()
  principal: boolean;

  @ApiProperty({ required: false })
  @Expose()
  observacoes?: string;

  @ApiProperty()
  @Expose()
  ativo: boolean;
}

export class CnaeSecundarioResponseDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  cnaeId: string;

  @ApiProperty({ type: Object, description: 'Objeto CNAE completo' })
  @Expose()
  cnae: any;

  @ApiProperty()
  @Expose()
  ativo: boolean;
}

export class UnidadeSaudeResponseDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  nomeUnidade: string;

  @ApiProperty({ required: false })
  @Expose()
  codigoInterno?: string;

  @ApiProperty()
  @Expose()
  cnpj: string;

  @ApiProperty()
  @Expose()
  razaoSocial: string;

  @ApiProperty()
  @Expose()
  nomeFantasia: string;

  @ApiProperty({ required: false })
  @Expose()
  inscricaoMunicipal?: string;

  @ApiProperty({ required: false })
  @Expose()
  inscricaoEstadual?: string;

  @ApiProperty({ required: false })
  @Expose()
  cnes?: string;

  @ApiProperty({ required: false })
  @Expose()
  contatosUnidade?: string;

  @ApiProperty({ required: false })
  @Expose()
  email?: string;

  @ApiProperty({ required: false })
  @Expose()
  codigoServicoPrincipal?: string;

  @ApiProperty({ required: false, type: [String] })
  @Expose()
  codigoServicoSecundario?: string[];

  @ApiProperty({ required: false })
  @Expose()
  cnaePrincipalId?: string;

  @ApiProperty({
    type: Object,
    required: false,
    description: 'Objeto CNAE principal',
  })
  @Expose()
  cnaePrincipal?: any;

  // Endereço
  @ApiProperty({ required: false })
  @Expose()
  cep?: string;

  @ApiProperty({ required: false })
  @Expose()
  rua?: string;

  @ApiProperty({ required: false })
  @Expose()
  numero?: string;

  @ApiProperty({ required: false })
  @Expose()
  bairro?: string;

  @ApiProperty({ required: false })
  @Expose()
  complemento?: string;

  @ApiProperty({ required: false })
  @Expose()
  estado?: string;

  @ApiProperty({ required: false })
  @Expose()
  cidade?: string;

  // Responsável
  @ApiProperty({ required: false })
  @Expose()
  nomeResponsavel?: string;

  @ApiProperty({ required: false })
  @Expose()
  contatoResponsavel?: string;

  @ApiProperty({ required: false })
  @Expose()
  emailResponsavel?: string;

  // Impostos
  @ApiProperty({ required: false })
  @Expose()
  irrfPercentual?: number;

  @ApiProperty({ required: false })
  @Expose()
  pisPercentual?: number;

  @ApiProperty({ required: false })
  @Expose()
  cofinsPercentual?: number;

  @ApiProperty({ required: false })
  @Expose()
  csllPercentual?: number;

  @ApiProperty({ required: false })
  @Expose()
  issPercentual?: number;

  @ApiProperty({ required: false })
  @Expose()
  ibsPercentual?: number;

  @ApiProperty({ required: false })
  @Expose()
  cbsPercentual?: number;

  // Retenções
  @ApiProperty()
  @Expose()
  reterIss: boolean;

  @ApiProperty()
  @Expose()
  reterIr: boolean;

  @ApiProperty()
  @Expose()
  reterPcc: boolean;

  @ApiProperty()
  @Expose()
  reterIbs: boolean;

  @ApiProperty()
  @Expose()
  reterCbs: boolean;

  @ApiProperty()
  @Expose()
  optanteSimplesNacional: boolean;

  // Certificado Digital
  @ApiProperty()
  @Expose()
  certificadoDigitalVinculado: boolean;

  @ApiProperty({ required: false })
  @Expose()
  certificadoDigitalValidade?: Date;

  // Relacionamentos
  @ApiProperty({ type: [HorarioAtendimentoResponseDto] })
  @Expose()
  @Type(() => HorarioAtendimentoResponseDto)
  horariosAtendimento?: HorarioAtendimentoResponseDto[];

  @ApiProperty({ type: [DadoBancarioResponseDto] })
  @Expose()
  @Type(() => DadoBancarioResponseDto)
  dadosBancarios?: DadoBancarioResponseDto[];

  @ApiProperty({ type: [CnaeSecundarioResponseDto] })
  @Expose()
  @Type(() => CnaeSecundarioResponseDto)
  cnaeSecundarios?: CnaeSecundarioResponseDto[];

  @ApiProperty()
  @Expose()
  ativo: boolean;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  updatedAt: Date;
}

export class UnidadeSaudeListResponseDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  nomeUnidade: string;

  @ApiProperty()
  @Expose()
  nomeFantasia: string;

  @ApiProperty()
  @Expose()
  cnpj: string;

  @ApiProperty({ required: false })
  @Expose()
  cidade?: string;

  @ApiProperty({ required: false })
  @Expose()
  estado?: string;

  @ApiProperty()
  @Expose()
  ativo: boolean;

  @ApiProperty()
  @Expose()
  createdAt: Date;
}
