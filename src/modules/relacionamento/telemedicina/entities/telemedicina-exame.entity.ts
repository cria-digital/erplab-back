import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Telemedicina } from './telemedicina.entity';
import { Exame } from '../../../exames/exames/entities/exame.entity';

@Entity('telemedicina_exames')
@Unique(['telemedicina_id', 'exame_id'])
export class TelemedicinaExame {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  telemedicina_id: string;

  @ManyToOne(() => Telemedicina, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'telemedicina_id' })
  telemedicina: Telemedicina;

  @Column({ type: 'uuid' })
  exame_id: string;

  @ManyToOne(() => Exame, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'exame_id' })
  exame: Exame;

  // Mapeamento de códigos para a plataforma de telemedicina
  @Column({ type: 'varchar', length: 50, nullable: true })
  codigo_telemedicina: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  nome_exame_telemedicina: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  categoria_telemedicina: string;

  // Configurações específicas
  @Column({ type: 'boolean', default: true })
  ativo: boolean;

  @Column({ type: 'boolean', default: false })
  permite_upload_imagem: boolean;

  @Column({ type: 'boolean', default: false })
  requer_especialista: boolean;

  @Column({ type: 'int', nullable: true })
  tempo_laudo_padrao: number; // em horas

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  valor_laudo: number;

  @Column({ type: 'text', nullable: true })
  observacoes: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
