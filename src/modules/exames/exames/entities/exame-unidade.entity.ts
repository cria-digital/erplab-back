import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
  Unique,
} from 'typeorm';
import { Exame } from './exame.entity';
import { LaboratorioApoio } from './laboratorio-apoio.entity';
import { UnidadeSaude } from '../../../cadastros/unidade-saude/entities/unidade-saude.entity';
import { Telemedicina } from '../../../relacionamento/telemedicina/entities/telemedicina.entity';

/**
 * Entidade para vincular exames com unidades de saúde e seus destinos.
 * Cada exame pode ser feito em múltiplas unidades, e cada unidade pode ter
 * um destino diferente (interno, apoio, telemedicina).
 */
@Entity('exames_unidades')
@Index(['exame_id', 'unidade_id'])
@Unique(['exame_id', 'unidade_id'])
export class ExameUnidade {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'uuid',
    comment: 'FK para exame',
  })
  exame_id: string;

  @Column({
    type: 'uuid',
    comment: 'FK para unidade de saúde',
  })
  unidade_id: string;

  @Column({
    type: 'enum',
    enum: ['interno', 'apoio', 'telemedicina'],
    default: 'interno',
    comment: 'Destino do exame para esta unidade',
  })
  destino: string;

  @Column({
    type: 'uuid',
    nullable: true,
    comment: 'FK para laboratório de apoio (quando destino = apoio)',
  })
  laboratorio_apoio_id: string;

  @Column({
    type: 'uuid',
    nullable: true,
    comment: 'FK para telemedicina (quando destino = telemedicina)',
  })
  telemedicina_id: string;

  @Column({
    type: 'boolean',
    default: true,
    comment: 'Se o vínculo está ativo',
  })
  ativo: boolean;

  @CreateDateColumn({
    type: 'timestamp',
    comment: 'Data de criação do registro',
  })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    comment: 'Data da última atualização',
  })
  updated_at: Date;

  // Relacionamentos
  @ManyToOne(() => Exame, (exame) => exame.unidades, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'exame_id' })
  exame?: Exame;

  @ManyToOne(() => UnidadeSaude, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'unidade_id' })
  unidadeSaude?: UnidadeSaude;

  @ManyToOne(() => LaboratorioApoio, {
    nullable: true,
  })
  @JoinColumn({ name: 'laboratorio_apoio_id' })
  laboratorioApoio?: LaboratorioApoio;

  @ManyToOne(() => Telemedicina, {
    nullable: true,
  })
  @JoinColumn({ name: 'telemedicina_id' })
  telemedicina?: Telemedicina;
}
