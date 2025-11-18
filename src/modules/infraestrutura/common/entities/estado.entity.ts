import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Cidade } from './cidade.entity';

@Entity('estados')
export class Estado {
  @ApiProperty({
    description: 'ID único do estado',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Nome do estado',
    example: 'São Paulo',
  })
  @Column({ type: 'varchar', length: 100 })
  nome: string;

  @ApiProperty({
    description: 'Sigla UF do estado',
    example: 'SP',
  })
  @Column({ type: 'varchar', length: 2, unique: true })
  uf: string;

  @ApiProperty({
    description: 'Código IBGE do estado',
    example: '35',
  })
  @Column({ type: 'varchar', length: 2, unique: true, name: 'codigo_ibge' })
  codigoIbge: string;

  @ApiProperty({
    description: 'Região do Brasil',
    example: 'Sudeste',
  })
  @Column({ type: 'varchar', length: 20 })
  regiao: string;

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

  @OneToMany(() => Cidade, (cidade) => cidade.estado)
  cidades: Cidade[];
}
