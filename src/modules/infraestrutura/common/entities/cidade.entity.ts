import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Estado } from './estado.entity';

@Entity('cidades')
@Index(['estadoId'])
@Index(['codigoIbge'])
export class Cidade {
  @ApiProperty({
    description: 'ID único da cidade',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Nome da cidade',
    example: 'São Paulo',
  })
  @Column({ type: 'varchar', length: 255 })
  nome: string;

  @ApiProperty({
    description: 'Código IBGE da cidade',
    example: '3550308',
  })
  @Column({ type: 'varchar', length: 7, unique: true, name: 'codigo_ibge' })
  codigoIbge: string;

  @ApiProperty({
    description: 'ID do estado',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Column({ type: 'uuid', name: 'estado_id' })
  estadoId: string;

  @ApiProperty({
    description: 'Data de criação do registro',
    example: '2025-01-01T00:00:00.000Z',
  })
  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'created_at',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Data da última atualização do registro',
    example: '2025-01-01T00:00:00.000Z',
  })
  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
    name: 'updated_at',
  })
  updatedAt: Date;

  @ManyToOne(() => Estado, (estado) => estado.cidades)
  @JoinColumn({ name: 'estado_id' })
  estado: Estado;
}
