import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { UnidadeSaude } from '../../../../cadastros/unidade-saude/entities/unidade-saude.entity';

export enum TipoCabecalhoRodape {
  CABECALHO = 'CABECALHO',
  RODAPE = 'RODAPE',
}

@Entity('cabecalhos_rodapes')
@Unique(['unidadeId', 'tipo'])
export class CabecalhoRodape {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'unidade_id' })
  unidadeId: string;

  @ManyToOne(() => UnidadeSaude, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'unidade_id' })
  unidade: UnidadeSaude;

  @Column({
    type: 'enum',
    enum: TipoCabecalhoRodape,
  })
  tipo: TipoCabecalhoRodape;

  @Column({ name: 'nome_arquivo', length: 255 })
  nomeArquivo: string;

  @Column({ name: 'caminho_arquivo', length: 500 })
  caminhoArquivo: string;

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
