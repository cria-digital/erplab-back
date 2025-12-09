import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Adquirente } from './adquirente.entity';
import { UnidadeSaude } from '../../../cadastros/unidade-saude/entities/unidade-saude.entity';
import { AlternativaCampoFormulario } from '../../../infraestrutura/campos-formulario/entities/alternativa-campo-formulario.entity';

@Entity('restricoes_adquirente')
export class RestricaoAdquirente {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  unidade_saude_id: string;

  @ManyToOne(() => UnidadeSaude)
  @JoinColumn({ name: 'unidade_saude_id' })
  unidade_saude: UnidadeSaude;

  // Tipo de restrição (FK para alternativas_campo_formulario)
  @Column({ type: 'uuid', nullable: true })
  restricao_id: string;

  @ManyToOne(() => AlternativaCampoFormulario, { nullable: true })
  @JoinColumn({ name: 'restricao_id' })
  restricao: AlternativaCampoFormulario;

  // Valor ou observação adicional da restrição (ex: "R$ 50,00" para valor mínimo)
  @Column({ type: 'text', nullable: true })
  valor_restricao: string;

  @Column({ type: 'uuid' })
  adquirente_id: string;

  @ManyToOne(() => Adquirente, (adquirente) => adquirente.restricoes)
  @JoinColumn({ name: 'adquirente_id' })
  adquirente: Adquirente;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
