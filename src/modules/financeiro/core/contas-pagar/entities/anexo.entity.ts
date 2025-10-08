import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ContaPagar } from './conta-pagar.entity';
import { TipoAnexo } from '../enums/contas-pagar.enum';

@Entity('anexos_contas_pagar')
export class Anexo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'conta_pagar_id', type: 'uuid' })
  contaPagarId: string;

  @ManyToOne(() => ContaPagar, (conta) => conta.anexos)
  @JoinColumn({ name: 'conta_pagar_id' })
  contaPagar: ContaPagar;

  @Column({ name: 'tipo_anexo', type: 'enum', enum: TipoAnexo })
  tipoAnexo: TipoAnexo;

  @Column({ name: 'nome_arquivo', type: 'varchar', length: 255 })
  nomeArquivo: string;

  @Column({ name: 'caminho_arquivo', type: 'varchar', length: 500 })
  caminhoArquivo: string;

  @Column({ name: 'mime_type', type: 'varchar', length: 100 })
  mimeType: string;

  @Column({ type: 'bigint' })
  tamanho: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
