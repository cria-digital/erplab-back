import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { CampoFormulario } from './campo-formulario.entity';

/**
 * Entidade que representa uma Alternativa de Campo de Formulário
 *
 * Alternativas são as opções disponíveis para um campo.
 * Exemplos:
 * - Campo "Unidade de medida": MG/DL, G, MG, MCG, NG, PG
 * - Campo "Tipo de exames": Laboratorial, Imagem, Funcional
 */
@Entity('alternativas_campo_formulario')
@Index(['campoFormularioId', 'ordem'])
export class AlternativaCampoFormulario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'uuid',
    name: 'campo_formulario_id',
  })
  campoFormularioId: string;

  @ManyToOne(() => CampoFormulario, (campo) => campo.alternativas, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'campo_formulario_id' })
  campoFormulario: CampoFormulario;

  @Column({
    type: 'varchar',
    length: 255,
    name: 'texto_alternativa',
    comment: 'Texto da alternativa (ex: MG/DL, Audiometria)',
  })
  textoAlternativa: string;

  @Column({
    type: 'int',
    default: 0,
    comment: 'Ordem de exibição',
  })
  ordem: number;

  @Column({
    type: 'boolean',
    default: true,
    comment: 'Se a alternativa está ativa',
  })
  ativo: boolean;

  // Auditoria
  @CreateDateColumn({
    name: 'created_at',
    comment: 'Data de criação do registro',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    comment: 'Data da última atualização',
  })
  updatedAt: Date;
}
