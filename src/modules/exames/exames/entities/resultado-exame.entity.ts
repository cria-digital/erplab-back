import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { OrdemServicoExame } from './ordem-servico-exame.entity';
import { Exame } from './exame.entity';

@Entity('resultados_exames')
@Index(['ordem_servico_exame_id'])
@Index(['parametro'])
export class ResultadoExame {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    comment: 'ID do exame na ordem de serviço',
  })
  ordem_servico_exame_id: string;

  @Column({
    comment: 'ID do exame',
  })
  exame_id: string;

  // Parâmetro e resultado
  @Column({
    type: 'varchar',
    length: 255,
    comment: 'Nome do parâmetro analisado',
  })
  parametro: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'Resultado do parâmetro',
  })
  resultado: string;

  @Column({
    type: 'decimal',
    precision: 15,
    scale: 5,
    nullable: true,
    comment: 'Resultado numérico (quando aplicável)',
  })
  resultado_numerico: number;

  @Column({
    type: 'text',
    nullable: true,
    comment: 'Resultado textual/descritivo',
  })
  resultado_texto: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
    comment: 'Unidade de medida',
  })
  unidade: string;

  // Valores de referência
  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'Valor de referência',
  })
  valor_referencia: string;

  @Column({
    type: 'decimal',
    precision: 15,
    scale: 5,
    nullable: true,
    comment: 'Valor mínimo de referência',
  })
  valor_minimo: number;

  @Column({
    type: 'decimal',
    precision: 15,
    scale: 5,
    nullable: true,
    comment: 'Valor máximo de referência',
  })
  valor_maximo: number;

  // Flags e indicadores
  @Column({
    type: 'enum',
    enum: ['normal', 'alterado', 'critico'],
    default: 'normal',
    comment: 'Classificação do resultado',
  })
  classificacao: string;

  @Column({
    type: 'varchar',
    length: 10,
    nullable: true,
    comment: 'Flag do resultado (H, L, HH, LL, etc)',
  })
  flag: string;

  @Column({
    type: 'boolean',
    default: false,
    comment: 'Se o valor está fora da referência',
  })
  fora_referencia: boolean;

  @Column({
    type: 'boolean',
    default: false,
    comment: 'Se é um valor crítico/pânico',
  })
  valor_critico: boolean;

  // Método e observações
  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'Método utilizado na análise',
  })
  metodo: string;

  @Column({
    type: 'text',
    nullable: true,
    comment: 'Observações do resultado',
  })
  observacoes: string;

  @Column({
    type: 'text',
    nullable: true,
    comment: 'Interpretação do resultado',
  })
  interpretacao: string;

  @Column({
    type: 'text',
    nullable: true,
    comment: 'Comentários adicionais',
  })
  comentarios: string;

  // Laudos e arquivos
  @Column({
    type: 'text',
    nullable: true,
    comment: 'Laudo completo (para exames de imagem)',
  })
  laudo: string;

  @Column({
    type: 'jsonb',
    nullable: true,
    comment: 'URLs de arquivos anexados (imagens, PDFs)',
  })
  arquivos_anexados: any;

  // Histórico e revisões
  @Column({
    type: 'int',
    default: 1,
    comment: 'Versão do resultado (para rastrear alterações)',
  })
  versao: number;

  @Column({
    type: 'jsonb',
    nullable: true,
    comment: 'Histórico de versões anteriores',
  })
  historico_versoes: any;

  @Column({
    type: 'timestamp',
    nullable: true,
    comment: 'Data da última revisão',
  })
  data_revisao: Date;

  @Column({
    type: 'int',
    nullable: true,
    comment: 'ID do usuário que revisou',
  })
  revisado_por: number;

  // Assinatura e liberação
  @Column({
    type: 'timestamp',
    nullable: true,
    comment: 'Data e hora da liberação',
  })
  data_liberacao: Date;

  @Column({
    type: 'int',
    nullable: true,
    comment: 'ID do responsável técnico que liberou',
  })
  liberado_por: number;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'Assinatura digital do responsável',
  })
  assinatura_digital: string;

  // Status
  @Column({
    type: 'enum',
    enum: [
      'rascunho',
      'em_analise',
      'aguardando_revisao',
      'liberado',
      'retificado',
    ],
    default: 'rascunho',
    comment: 'Status do resultado',
  })
  status: string;

  // Origem do resultado
  @Column({
    type: 'enum',
    enum: ['manual', 'interfaceamento', 'apoio', 'telemedicina'],
    default: 'manual',
    comment: 'Origem do resultado',
  })
  origem: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    comment: 'Sistema/equipamento de origem',
  })
  sistema_origem: string;

  // Controle de qualidade
  @Column({
    type: 'boolean',
    default: false,
    comment: 'Se passou pelo controle de qualidade',
  })
  qc_aprovado: boolean;

  @Column({
    type: 'timestamp',
    nullable: true,
    comment: 'Data do controle de qualidade',
  })
  data_qc: Date;

  @Column({
    nullable: true,
    comment: 'ID do responsável pelo QC',
  })
  qc_responsavel_id: string;

  // Ordem de exibição
  @Column({
    type: 'int',
    default: 0,
    comment: 'Ordem de exibição no laudo',
  })
  ordem_exibicao: number;

  // Campos de auditoria
  @CreateDateColumn({
    type: 'timestamp',
    comment: 'Data de criação do registro',
  })
  criado_em: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    comment: 'Data da última atualização',
  })
  atualizado_em: Date;

  @Column({
    type: 'int',
    nullable: true,
    comment: 'ID do usuário que criou o registro',
  })
  criado_por: number;

  @Column({
    type: 'int',
    nullable: true,
    comment: 'ID do usuário que atualizou o registro',
  })
  atualizado_por: number;

  // Relacionamentos
  @ManyToOne(() => OrdemServicoExame, (osExame) => osExame.resultados, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'ordem_servico_exame_id' })
  ordemServicoExame?: OrdemServicoExame;

  @ManyToOne(() => Exame, { eager: false })
  @JoinColumn({ name: 'exame_id' })
  exame?: Exame;

  // Métodos auxiliares
  isAlterado(): boolean {
    return this.classificacao !== 'normal' || this.fora_referencia;
  }

  isCritico(): boolean {
    return this.valor_critico || this.classificacao === 'critico';
  }

  isLiberado(): boolean {
    return this.status === 'liberado';
  }

  needsReview(): boolean {
    return this.status === 'aguardando_revisao';
  }

  getResultadoFormatado(): string {
    if (this.resultado_numerico !== null) {
      return `${this.resultado_numerico} ${this.unidade || ''}`.trim();
    }
    return this.resultado || this.resultado_texto || '';
  }

  getInterpretacao(): string {
    if (this.flag === 'H') return 'Alto';
    if (this.flag === 'L') return 'Baixo';
    if (this.flag === 'HH') return 'Muito Alto';
    if (this.flag === 'LL') return 'Muito Baixo';
    return 'Normal';
  }

  addToHistory(): void {
    if (!this.historico_versoes) {
      this.historico_versoes = [];
    }
    this.historico_versoes.push({
      versao: this.versao,
      resultado: this.resultado,
      resultado_numerico: this.resultado_numerico,
      resultado_texto: this.resultado_texto,
      classificacao: this.classificacao,
      data: new Date(),
      usuario: this.atualizado_por,
    });
    this.versao++;
  }
}
