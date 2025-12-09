import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Unique,
} from 'typeorm';
import { Adquirente } from './adquirente.entity';
import { AlternativaCampoFormulario } from '../../../infraestrutura/campos-formulario/entities/alternativa-campo-formulario.entity';

/**
 * Tabela intermediária para relacionar Adquirentes com Tipos de Cartão
 * (que são alternativas do campo de formulário 'tipo_cartao')
 */
@Entity('adquirentes_tipos_cartao')
@Unique(['adquirente_id', 'tipo_cartao_id'])
export class AdquirenteTipoCartao {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  adquirente_id: string;

  @ManyToOne(() => Adquirente, (adquirente) => adquirente.tipos_cartao, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'adquirente_id' })
  adquirente: Adquirente;

  @Column({ type: 'uuid' })
  tipo_cartao_id: string;

  @ManyToOne(() => AlternativaCampoFormulario, { nullable: false })
  @JoinColumn({ name: 'tipo_cartao_id' })
  tipo_cartao: AlternativaCampoFormulario;

  @Column({ type: 'boolean', default: true })
  ativo: boolean;

  @CreateDateColumn()
  created_at: Date;
}
