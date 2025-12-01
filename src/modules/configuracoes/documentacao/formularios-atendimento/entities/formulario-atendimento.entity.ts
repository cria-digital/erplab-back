import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UnidadeSaude } from '../../../../cadastros/unidade-saude/entities/unidade-saude.entity';

@Entity('formularios_atendimento')
export class FormularioAtendimento {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'unidade_id' })
  unidadeId: string;

  @ManyToOne(() => UnidadeSaude, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'unidade_id' })
  unidade: UnidadeSaude;

  @Column({ name: 'nome_documento', length: 255 })
  nomeDocumento: string;

  @Column({ name: 'caminho_arquivo', length: 500 })
  caminhoArquivo: string;

  @Column({ type: 'text', nullable: true })
  observacao: string;

  @Column({ name: 'mime_type', length: 100 })
  mimeType: string;

  @Column({ type: 'integer' })
  tamanho: number;

  @Column({ default: true })
  ativo: boolean;

  @CreateDateColumn({ name: 'criado_em' })
  criadoEm: Date;

  @UpdateDateColumn({ name: 'atualizado_em' })
  atualizadoEm: Date;
}
