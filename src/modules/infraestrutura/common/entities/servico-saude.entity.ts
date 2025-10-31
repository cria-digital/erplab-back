import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('servicos_saude')
export class ServicoSaude {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 10, unique: true })
  codigo: string;

  @Column({ type: 'text' })
  descricao: string;

  @Column({ type: 'varchar', length: 10 })
  codigo_grupo: string;

  @Column({ type: 'varchar', length: 100 })
  nome_grupo: string;

  @Column({ type: 'boolean', default: true })
  ativo: boolean;
}
