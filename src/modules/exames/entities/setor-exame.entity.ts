import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('setores_exame')
@Index(['codigo'])
@Index(['nome'])
export class SetorExame {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 20,
    unique: true,
    comment: 'Código do setor',
  })
  codigo: string;

  @Column({
    type: 'varchar',
    length: 100,
    comment: 'Nome do setor (ex: Laboratório, Radiologia, Ultrassom)',
  })
  nome: string;

  @Column({
    type: 'text',
    nullable: true,
    comment: 'Descrição do setor',
  })
  descricao: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    comment: 'Localização física do setor',
  })
  localizacao: string;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
    comment: 'Ramal/telefone do setor',
  })
  ramal: string;

  @Column({
    type: 'int',
    nullable: true,
    comment: 'ID do responsável pelo setor',
  })
  responsavel_id: number;

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
    comment: 'Status do setor',
  })
  status: string;

  @CreateDateColumn({
    type: 'timestamp',
    comment: 'Data de criação',
  })
  criado_em: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    comment: 'Data de atualização',
  })
  atualizado_em: Date;
}
