import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Banco } from './banco.entity';
import { GatewayPagamento } from './gateway-pagamento.entity';
import { UnidadeSaude } from '../../../cadastros/unidade-saude/entities/unidade-saude.entity';
import { ContaBancariaUnidade } from './conta-bancaria-unidade.entity';
import { Empresa } from '../../../cadastros/empresas/entities/empresa.entity';

export enum TipoConta {
  CORRENTE = 'corrente',
  POUPANCA = 'poupanca',
  PAGAMENTO = 'pagamento',
  SALARIO = 'salario',
  INVESTIMENTO = 'investimento',
}

export enum StatusConta {
  ATIVO = 'ativo',
  INATIVO = 'inativo',
  SUSPENSO = 'suspenso',
}

@Entity('contas_bancarias')
export class ContaBancaria {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: TipoConta,
    default: TipoConta.CORRENTE,
  })
  tipo_conta: TipoConta;

  @Column({ type: 'varchar', length: 10 })
  agencia: string;

  @Column({ type: 'varchar', length: 2, nullable: true })
  digito_agencia: string;

  @Column({ type: 'varchar', length: 20 })
  numero_conta: string;

  @Column({ type: 'varchar', length: 2 })
  digito_conta: string;

  @Column({ type: 'text', nullable: true })
  observacoes: string;

  @Column({
    type: 'enum',
    enum: StatusConta,
    default: StatusConta.ATIVO,
  })
  status: StatusConta;

  @Column({ type: 'varchar', length: 255, nullable: true })
  chave_pix: string;

  @Column({ type: 'uuid' })
  banco_id: string;

  @ManyToOne(() => Banco, (banco) => banco.contas)
  @JoinColumn({ name: 'banco_id' })
  banco: Banco;

  // Campo mantido para compatibilidade (será deprecated)
  @Column({ type: 'uuid', nullable: true })
  unidade_saude_id: string;

  @ManyToOne(() => UnidadeSaude)
  @JoinColumn({ name: 'unidade_saude_id' })
  unidade_saude: UnidadeSaude;

  // Relacionamento com Empresa (para convênios, laboratórios, fornecedores, etc)
  @Column({ type: 'uuid', nullable: true })
  empresa_id: string;

  @ManyToOne(() => Empresa, (empresa) => empresa.contasBancarias)
  @JoinColumn({ name: 'empresa_id' })
  empresa: Empresa;

  // Novo relacionamento ManyToMany via tabela intermediária
  @OneToMany(() => ContaBancariaUnidade, (vinculo) => vinculo.conta_bancaria, {
    cascade: true,
  })
  unidades_vinculadas: ContaBancariaUnidade[];

  @OneToMany(() => GatewayPagamento, (gateway) => gateway.conta_bancaria)
  gateways_pagamento: GatewayPagamento[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
