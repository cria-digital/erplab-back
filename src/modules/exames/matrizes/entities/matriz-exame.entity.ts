import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { Exame } from '../../exames/entities/exame.entity';
import { AlternativaCampoFormulario } from '../../../infraestrutura/campos-formulario/entities/alternativa-campo-formulario.entity';
import { CampoMatriz } from './campo-matriz.entity';

/**
 * Entidade que representa uma Matriz de Exame
 *
 * Matrizes são templates/formulários padronizados para tipos específicos de exames.
 * Conforme Figma: Tipo de exame, Exame vinculado, Nome da matriz, Código interno
 */
@Entity('matrizes_exames')
@Index(['codigoInterno'])
@Index(['nome'])
@Index(['tipoExameId'])
@Index(['exameId'])
export class MatrizExame {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'codigo_interno',
    type: 'varchar',
    length: 50,
    unique: true,
    comment: 'Código interno único da matriz (ex: HEM123)',
  })
  codigoInterno: string;

  @Column({
    name: 'nome',
    type: 'varchar',
    length: 255,
    comment: 'Nome da matriz (ex: Hemograma 1)',
  })
  nome: string;

  // Tipo de Exame (FK para alternativa do campo tipo_exames)
  @Column({
    name: 'tipo_exame_id',
    type: 'uuid',
    nullable: true,
    comment: 'FK para alternativa do campo tipo_exames',
  })
  tipoExameId: string;

  @ManyToOne(() => AlternativaCampoFormulario)
  @JoinColumn({ name: 'tipo_exame_id' })
  tipoExameAlternativa: AlternativaCampoFormulario;

  // Exame Vinculado
  @Column({
    name: 'exame_id',
    type: 'uuid',
    comment: 'ID do exame vinculado (FK para exames)',
  })
  exameId: string;

  @ManyToOne(() => Exame)
  @JoinColumn({ name: 'exame_id' })
  exame: Exame;

  // Template importado (caminho/nome do arquivo)
  @Column({
    name: 'template_arquivo',
    type: 'varchar',
    length: 500,
    nullable: true,
    comment: 'Caminho ou nome do arquivo de template importado',
  })
  templateArquivo: string;

  // Dados do template em JSON (para preview)
  @Column({
    name: 'template_dados',
    type: 'jsonb',
    nullable: true,
    comment: 'Conteúdo do template em JSON para preview da matriz',
  })
  templateDados: Record<string, any>;

  @Column({
    name: 'ativo',
    type: 'boolean',
    default: true,
    comment: 'Se a matriz está ativa',
  })
  ativo: boolean;

  // Relacionamento com campos da matriz
  @OneToMany(() => CampoMatriz, (campo) => campo.matriz)
  campos: CampoMatriz[];

  // Auditoria
  @CreateDateColumn({
    name: 'criado_em',
    comment: 'Data de criação do registro',
  })
  criadoEm: Date;

  @UpdateDateColumn({
    name: 'atualizado_em',
    comment: 'Data da última atualização',
  })
  atualizadoEm: Date;

  @Column({
    name: 'criado_por',
    type: 'uuid',
    nullable: true,
    comment: 'ID do usuário que criou o registro',
  })
  criadoPor: string;

  @Column({
    name: 'atualizado_por',
    type: 'uuid',
    nullable: true,
    comment: 'ID do usuário que atualizou o registro',
  })
  atualizadoPor: string;
}
