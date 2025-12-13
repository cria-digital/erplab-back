import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { UnidadeSaude } from '../../../../cadastros/unidade-saude/entities/unidade-saude.entity';
import { Sala } from '../../salas/entities/sala.entity';

import { Tenant } from '../../../../tenants/entities/tenant.entity';
/**
 * Entidade que representa um Equipamento/Imobilizado
 *
 * Estrutura simplificada conforme Figma:
 * - Código interno (gerado: EQ001, EQ002...)
 * - Unidade (FK)
 * - Nome do equipamento
 * - Numeração (número de série/patrimônio)
 * - Localização (FK para sala)
 */
@Entity('equipamentos')
@Index(['codigoInterno'])
@Index(['nome'])
@Index(['unidadeId'])
@Index(['salaId'])
export class Equipamento {
  @ApiProperty({ description: 'ID único do equipamento' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Código interno único do equipamento (ex: EQ001)',
    example: 'EQ001',
  })
  @Column({
    name: 'codigo_interno',
    type: 'varchar',
    length: 50,
    unique: true,
    comment: 'Código interno único do equipamento (ex: EQ001)',
  })
  codigoInterno: string;

  @ApiProperty({
    description: 'ID da unidade de saúde',
    example: 'uuid-da-unidade',
  })
  @Column({
    name: 'unidade_id',
    type: 'uuid',
    comment: 'ID da unidade de saúde',
  })
  unidadeId: string;

  @ApiProperty({ description: 'Unidade de saúde do equipamento' })
  @ManyToOne(() => UnidadeSaude)
  @JoinColumn({ name: 'unidade_id' })
  unidade: UnidadeSaude;

  @ApiProperty({
    description: 'Nome/descrição do equipamento',
    example: 'Raio-X',
  })
  @Column({
    name: 'nome',
    type: 'varchar',
    length: 255,
    comment: 'Nome/descrição do equipamento',
  })
  nome: string;

  @ApiProperty({
    description: 'Numeração/número de série do equipamento',
    example: '1592653986625698526',
    required: false,
  })
  @Column({
    name: 'numeracao',
    type: 'varchar',
    length: 100,
    nullable: true,
    comment: 'Numeração/número de série do equipamento',
  })
  numeracao: string;

  @ApiProperty({
    description: 'ID da sala onde está localizado',
    example: 'uuid-da-sala',
    required: false,
  })
  @Column({
    name: 'sala_id',
    type: 'uuid',
    nullable: true,
    comment: 'ID da sala onde está localizado',
  })
  salaId: string;

  @ApiProperty({ description: 'Sala onde o equipamento está localizado' })
  @ManyToOne(() => Sala, { nullable: true })
  @JoinColumn({ name: 'sala_id' })
  sala: Sala;

  @ApiProperty({
    description: 'Se o registro está ativo',
    example: true,
  })
  @Column({
    name: 'ativo',
    type: 'boolean',
    default: true,
    comment: 'Se o registro está ativo',
  })
  ativo: boolean;

  @ApiProperty({ description: 'Data de criação do registro' })
  @CreateDateColumn({
    name: 'criado_em',
    comment: 'Data de criação do registro',
  })
  criadoEm: Date;

  @ApiProperty({ description: 'Data da última atualização' })
  @UpdateDateColumn({
    name: 'atualizado_em',
    comment: 'Data da última atualização',
  })
  atualizadoEm: Date;

  // Multi-tenancy
  @Column({ name: 'tenant_id', type: 'uuid', nullable: true })
  @Index()
  tenantId: string;

  @ManyToOne(() => Tenant, { eager: false })
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;
}
