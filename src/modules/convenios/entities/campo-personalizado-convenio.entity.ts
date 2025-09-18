import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Empresa } from '../../empresas/entities/empresa.entity';

@Entity('campos_personalizados_convenio')
export class CampoPersonalizadoConvenio {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'empresa_id' })
  empresaId: string;

  @ManyToOne(() => Empresa)
  @JoinColumn({ name: 'empresa_id' })
  empresa: Empresa;

  @Column({ name: 'nome_campo' })
  nomeCampo: string;

  @Column({ name: 'tipo_campo' })
  tipoCampo: string;

  @Column({ nullable: true })
  valor: string;

  @Column({ nullable: true, name: 'valor_json', type: 'json' })
  valorJson: Record<string, any>;

  @Column({ nullable: true })
  descricao: string;

  @Column({ default: false })
  obrigatorio: boolean;

  @Column({ default: true })
  ativo: boolean;

  @CreateDateColumn({ name: 'criado_em' })
  criadoEm: Date;

  @UpdateDateColumn({ name: 'atualizado_em' })
  atualizadoEm: Date;
}
