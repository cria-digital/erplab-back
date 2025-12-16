import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Usuario } from '../../../autenticacao/usuarios/entities/usuario.entity';
import { UnidadeSaude } from '../../../cadastros/unidade-saude/entities/unidade-saude.entity';
import { Tenant } from '../../../tenants/entities/tenant.entity';

export enum StatusCaixa {
  ABERTO = 'aberto',
  FECHADO = 'fechado',
}

@Entity('caixas')
@Index(['usuarioId', 'dataAbertura'])
@Index(['unidadeId', 'status'])
export class Caixa {
  @ApiProperty({ description: 'ID único do caixa' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'ID do usuário responsável pelo caixa' })
  @Column({ name: 'usuario_id', type: 'uuid' })
  @Index()
  usuarioId: string;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @ApiProperty({ description: 'ID da unidade de saúde' })
  @Column({ name: 'unidade_id', type: 'uuid' })
  @Index()
  unidadeId: string;

  @ManyToOne(() => UnidadeSaude)
  @JoinColumn({ name: 'unidade_id' })
  unidade: UnidadeSaude;

  @ApiProperty({ description: 'Data/hora de abertura do caixa' })
  @Column({ name: 'data_abertura', type: 'timestamp' })
  dataAbertura: Date;

  @ApiProperty({
    description: 'Data/hora de fechamento do caixa',
    nullable: true,
  })
  @Column({ name: 'data_fechamento', type: 'timestamp', nullable: true })
  dataFechamento: Date;

  @ApiProperty({ description: 'Status do caixa', enum: StatusCaixa })
  @Column({ type: 'enum', enum: StatusCaixa, default: StatusCaixa.ABERTO })
  status: StatusCaixa;

  // === DINHEIRO EM ESPÉCIE ===

  @ApiProperty({
    description: 'Abertura (espécie) - valor inicial do caixa',
    example: 1000.0,
  })
  @Column({
    name: 'abertura_especie',
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  aberturaEspecie: number;

  @ApiProperty({
    description: 'Total de entradas (espécie)',
    example: 0,
    nullable: true,
  })
  @Column({
    name: 'total_entradas_especie',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    default: 0,
  })
  totalEntradasEspecie: number;

  @ApiProperty({
    description: 'Total de saídas (espécie)',
    example: 0,
    nullable: true,
  })
  @Column({
    name: 'total_saidas_especie',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    default: 0,
  })
  totalSaidasEspecie: number;

  @ApiProperty({ description: 'Sangria (espécie)', example: 0, nullable: true })
  @Column({
    name: 'sangria_especie',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    default: 0,
  })
  sangriaEspecie: number;

  @ApiProperty({
    description: 'Saldo para próximo dia',
    example: 1000.0,
    nullable: true,
  })
  @Column({
    name: 'saldo_proximo_dia',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  saldoProximoDia: number;

  // === SALDO GERAL ===

  @ApiProperty({
    description: 'Total de entradas (cartão de crédito)',
    example: 0,
    nullable: true,
  })
  @Column({
    name: 'total_entradas_credito',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    default: 0,
  })
  totalEntradasCredito: number;

  @ApiProperty({
    description: 'Total de entradas (cartão de débito)',
    example: 0,
    nullable: true,
  })
  @Column({
    name: 'total_entradas_debito',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    default: 0,
  })
  totalEntradasDebito: number;

  @ApiProperty({
    description: 'Total de entradas (PIX)',
    example: 0,
    nullable: true,
  })
  @Column({
    name: 'total_entradas_pix',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    default: 0,
  })
  totalEntradasPix: number;

  @ApiProperty({
    description: 'Saldo final do caixa',
    example: 0,
    nullable: true,
  })
  @Column({
    name: 'saldo_final',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  saldoFinal: number;

  // === RELACIONAMENTOS ===

  @OneToMany('DespesaCaixa', 'caixa')
  despesas: any[];

  // Multi-tenancy
  @Column({ name: 'tenant_id', type: 'uuid', nullable: true })
  @Index()
  tenantId: string;

  @ManyToOne(() => Tenant, { eager: false })
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // === HELPERS ===

  isAberto(): boolean {
    return this.status === StatusCaixa.ABERTO;
  }

  isFechado(): boolean {
    return this.status === StatusCaixa.FECHADO;
  }

  isDoMesmoDia(data: Date): boolean {
    const dataAbertura = new Date(this.dataAbertura);
    return (
      dataAbertura.getFullYear() === data.getFullYear() &&
      dataAbertura.getMonth() === data.getMonth() &&
      dataAbertura.getDate() === data.getDate()
    );
  }

  // Calcula o total de entradas (soma de todos os tipos)
  getTotalEntradas(): number {
    return (
      Number(this.totalEntradasEspecie || 0) +
      Number(this.totalEntradasCredito || 0) +
      Number(this.totalEntradasDebito || 0) +
      Number(this.totalEntradasPix || 0)
    );
  }

  // Calcula o saldo em espécie
  getSaldoEspecie(): number {
    return (
      Number(this.aberturaEspecie || 0) +
      Number(this.totalEntradasEspecie || 0) -
      Number(this.totalSaidasEspecie || 0) -
      Number(this.sangriaEspecie || 0)
    );
  }
}
