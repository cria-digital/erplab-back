import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { Exame } from './exame.entity';

@Entity('tipos_exame')
@Index(['codigo'])
@Index(['nome'])
export class TipoExame {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 20,
    unique: true,
    comment: 'Código do tipo de exame',
  })
  codigo: string;

  @Column({
    type: 'varchar',
    length: 100,
    comment: 'Nome do tipo de exame',
  })
  nome: string;

  @Column({
    type: 'text',
    nullable: true,
    comment: 'Descrição detalhada do tipo',
  })
  descricao: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
    comment: 'Ícone ou identificador visual',
  })
  icone: string;

  @Column({
    type: 'varchar',
    length: 7,
    nullable: true,
    comment: 'Cor hexadecimal para interface',
  })
  cor: string;

  @Column({
    type: 'int',
    default: 0,
    comment: 'Ordem de exibição',
  })
  ordem: number;

  @Column({
    type: 'enum',
    enum: ['ativo', 'inativo'],
    default: 'ativo',
    comment: 'Status do tipo de exame',
  })
  status: string;

  // Configurações específicas
  @Column({
    type: 'boolean',
    default: false,
    comment: 'Se requer agendamento prévio',
  })
  requer_agendamento: boolean;

  @Column({
    type: 'boolean',
    default: false,
    comment: 'Se requer autorização de convênio',
  })
  requer_autorizacao: boolean;

  @Column({
    type: 'boolean',
    default: false,
    comment: 'Se permite coleta domiciliar',
  })
  permite_domiciliar: boolean;

  @Column({
    type: 'jsonb',
    nullable: true,
    comment: 'Configurações adicionais do tipo',
  })
  configuracoes: any;

  // Campos de auditoria
  @CreateDateColumn({
    type: 'timestamp',
    comment: 'Data de criação do registro',
  })
  criado_em: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    comment: 'Data da última atualização',
  })
  atualizado_em: Date;

  // Relacionamentos
  @OneToMany(() => Exame, (exame) => exame.tipoExame)
  exames?: Exame[];
}
