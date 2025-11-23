import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export enum TipoEntidadeEnum {
  CONVENIO = 'convenio',
  LABORATORIO = 'laboratorio',
  TELEMEDICINA = 'telemedicina',
  UNIDADE_SAUDE = 'unidade_saude',
  FORNECEDOR = 'fornecedor',
  PRESTADOR_SERVICO = 'prestador_servico',
}

@Entity('configuracoes_campos_formulario')
@Index('IDX_config_campos_entidade', [
  'entidadeTipo',
  'entidadeId',
  'tipoFormulario',
])
export class ConfiguracaoCampoFormulario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: TipoEntidadeEnum,
    name: 'entidade_tipo',
    comment: 'Tipo da entidade: convenio, laboratorio, telemedicina, etc',
  })
  entidadeTipo: TipoEntidadeEnum;

  @Column({
    type: 'uuid',
    name: 'entidade_id',
    comment: 'ID da entidade (convenio_id, laboratorio_id, etc)',
  })
  entidadeId: string;

  @Column({
    type: 'varchar',
    length: 50,
    name: 'tipo_formulario',
    comment: 'Tipo do formulário: cadastro_paciente, ordem_servico, tiss',
  })
  tipoFormulario: string;

  @Column({
    type: 'varchar',
    length: 100,
    name: 'nome_campo',
    comment: 'Nome do campo no formulário',
  })
  nomeCampo: string;

  @Column({
    type: 'boolean',
    default: false,
    comment: 'Se o campo é obrigatório para esta entidade',
  })
  obrigatorio: boolean;

  @CreateDateColumn({ name: 'criado_em' })
  criadoEm: Date;

  @UpdateDateColumn({ name: 'atualizado_em' })
  atualizadoEm: Date;
}
