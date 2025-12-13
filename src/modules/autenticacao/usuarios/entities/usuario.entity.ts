import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
  Index,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UsuarioUnidade } from './usuario-unidade.entity';
import { UsuarioPermissao } from './usuario-permissao.entity';
import { Tenant } from '../../../tenants/entities/tenant.entity';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Informações Gerais
  @Column({
    name: 'codigo_interno',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  codigoInterno: string;

  @Column({ name: 'nome_completo', type: 'varchar', length: 255 })
  nomeCompleto: string;

  @Column({ type: 'varchar', length: 11, unique: true, nullable: true })
  cpf: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  telefone: string;

  @Column({
    name: 'celular_whatsapp',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  celularWhatsapp: string;

  @Column({
    name: 'cargo_funcao',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  cargoFuncao: string;

  @Column({
    name: 'cnpj_associado',
    type: 'varchar',
    length: 14,
    nullable: true,
  })
  cnpjAssociado: string;

  @Column({
    name: 'dados_admissao',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  dadosAdmissao: string;

  @Column({ name: 'foto_url', type: 'varchar', length: 500, nullable: true })
  fotoUrl: string;

  // Dados de Acesso
  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ name: 'senha_hash', type: 'varchar', length: 255 })
  senhaHash: string;

  @Column({ name: 'resetar_senha', type: 'boolean', default: false })
  resetarSenha: boolean;

  // Recuperação de senha
  @Column({
    name: 'reset_password_token',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  resetPasswordToken: string;

  @Column({
    name: 'reset_password_expires',
    type: 'timestamp',
    nullable: true,
  })
  resetPasswordExpires: Date;

  // Autenticação 2 fatores
  @Column({ name: 'validacao_2_etapas', type: 'boolean', default: false })
  validacao2Etapas: boolean;

  @Column({
    name: 'metodo_validacao',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  metodoValidacao: string; // 'SMS', 'EMAIL', 'APP'

  @Column({
    name: 'pergunta_recuperacao',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  perguntaRecuperacao: string;

  @Column({
    name: 'resposta_recuperacao_hash',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  respostaRecuperacaoHash: string;

  // Controle de acesso
  @Column({ name: 'tentativas_login_falhas', type: 'int', default: 0 })
  tentativasLoginFalhas: number;

  @Column({ name: 'bloqueado_ate', type: 'timestamp', nullable: true })
  bloqueadoAte: Date;

  @Column({ name: 'ultimo_login', type: 'timestamp', nullable: true })
  ultimoLogin: Date;

  // Status
  @Column({ type: 'boolean', default: true })
  ativo: boolean;

  // Super Admin (acesso a todos os tenants e configurações globais)
  @Column({ name: 'is_super_admin', type: 'boolean', default: false })
  isSuperAdmin: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relacionamentos
  @OneToMany(() => UsuarioUnidade, (usuarioUnidade) => usuarioUnidade.usuario, {
    cascade: true,
  })
  unidades: UsuarioUnidade[];

  @OneToMany(() => UsuarioPermissao, (permissao) => permissao.usuario)
  permissoes: UsuarioPermissao[];

  // Métodos auxiliares
  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.senhaHash && !this.senhaHash.startsWith('$2b$')) {
      this.senhaHash = await bcrypt.hash(this.senhaHash, 10);
    }
  }

  async comparePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.senhaHash);
  }

  async hashRespostaRecuperacao(resposta: string) {
    this.respostaRecuperacaoHash = await bcrypt.hash(
      resposta.toLowerCase(),
      10,
    );
  }

  async compareRespostaRecuperacao(resposta: string): Promise<boolean> {
    return bcrypt.compare(resposta.toLowerCase(), this.respostaRecuperacaoHash);
  }

  // Multi-tenancy
  @Column({ name: 'tenant_id', type: 'uuid', nullable: true })
  @Index()
  tenantId: string;

  @ManyToOne(() => Tenant, { eager: false })
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;
}
