import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Empresa } from '../../../cadastros/empresas/entities/empresa.entity';

export enum TipoRestricaoEnum {
  PLANO = 'PLANO',
  MEDICO = 'MEDICO',
  ESPECIALIDADE = 'ESPECIALIDADE',
  SETOR_SOLICITANTE = 'SETOR_SOLICITANTE',
  EXAME_MATERIAL_MEDICAMENTO = 'EXAME_MATERIAL_MEDICAMENTO',
  OUTRO = 'OUTRO',
}

@Entity('restricoes_convenio')
export class RestricaoConvenio {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'empresa_id' })
  empresaId: string;

  @ManyToOne(() => Empresa)
  @JoinColumn({ name: 'empresa_id' })
  empresa: Empresa;

  @Column({
    type: 'enum',
    enum: TipoRestricaoEnum,
    name: 'tipo_restricao',
  })
  tipoRestricao: TipoRestricaoEnum;

  // Campos para identificação baseado no tipo
  @Column({ nullable: true, name: 'plano_id' })
  planoId: string;

  @Column({ nullable: true, name: 'plano_nome' })
  planoNome: string;

  @Column({ nullable: true, name: 'medico_id' })
  medicoId: string;

  @Column({ nullable: true, name: 'medico_nome' })
  medicoNome: string;

  @Column({ nullable: true, name: 'especialidade_id' })
  especialidadeId: string;

  @Column({ nullable: true, name: 'especialidade_nome' })
  especialidadeNome: string;

  @Column({ nullable: true, name: 'setor_solicitante_id' })
  setorSolicitanteId: string;

  @Column({ nullable: true, name: 'setor_solicitante_nome' })
  setorSolicitanteNome: string;

  @Column({ nullable: true, name: 'unidade_id' })
  unidadeId: string;

  @Column({ nullable: true, name: 'unidade_nome' })
  unidadeNome: string;

  // Campos para Exame/Material/Medicamento
  @Column({ nullable: true, name: 'exame_material_id' })
  exameMaterialId: string;

  @Column({ nullable: true, name: 'exame_material_nome' })
  exameMaterialNome: string;

  @Column({ nullable: true, name: 'especialidade_exame' })
  especialidadeExame: string;

  @Column({ nullable: true, name: 'criog' })
  criog: string;

  // Descrição geral da restrição
  @Column({ type: 'text', nullable: true })
  descricao: string;

  @Column({ default: true })
  ativo: boolean;

  @CreateDateColumn({ name: 'criado_em' })
  criadoEm: Date;

  @UpdateDateColumn({ name: 'atualizado_em' })
  atualizadoEm: Date;
}
