import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('pacientes')
@Index(['cpf', 'empresa_id'], { unique: true })
@Index(['email'])
@Index(['contatos'])
@Index(['nome'])
export class Paciente {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 20,
    comment: 'Código interno do paciente (ex: PAC123123)',
  })
  codigo_interno: string;

  @Column({
    type: 'varchar',
    length: 255,
    comment: 'Nome completo do paciente',
  })
  nome: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'Nome social do paciente',
  })
  nome_social: string;

  @Column({
    type: 'enum',
    enum: ['nao_se_aplica', 'sim', 'nao'],
    default: 'nao_se_aplica',
    comment: 'Se deve usar o nome social',
  })
  usar_nome_social: string;

  @Column({
    type: 'enum',
    enum: ['M', 'F', 'O'],
    comment: 'M - Masculino, F - Feminino, O - Outro',
  })
  sexo: string;

  @Column({
    type: 'date',
    comment: 'Data de nascimento',
  })
  data_nascimento: Date;

  @Column({
    type: 'varchar',
    length: 255,
    comment: 'Nome da mãe',
  })
  nome_mae: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
    comment: 'Número do prontuário',
  })
  prontuario: string;

  @Column({
    type: 'varchar',
    length: 20,
    comment: 'RG do paciente',
  })
  rg: string;

  @Column({
    type: 'varchar',
    length: 11,
    comment: 'CPF sem formatação',
  })
  cpf: string;

  @Column({
    type: 'varchar',
    length: 50,
    comment: 'Estado civil',
  })
  estado_civil: string;

  @Column({
    type: 'varchar',
    length: 255,
    comment: 'E-mail do paciente',
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 20,
    comment: 'Contatos (telefone/celular principal)',
  })
  contatos: string;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
    comment: 'WhatsApp',
  })
  whatsapp: string;

  @Column({
    type: 'varchar',
    length: 100,
    comment: 'Profissão',
  })
  profissao: string;

  @Column({
    type: 'text',
    nullable: true,
    comment: 'Observações gerais sobre o paciente',
  })
  observacao: string;

  // Informações de convênio
  @Column({
    nullable: true,
    comment: 'ID do convênio',
  })
  convenio_id: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    comment: 'Nome do plano',
  })
  plano: string;

  @Column({
    type: 'date',
    nullable: true,
    comment: 'Validade do convênio',
  })
  validade: Date;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
    comment: 'Matrícula do convênio',
  })
  matricula: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'Nome do titular do convênio',
  })
  nome_titular: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
    comment: 'Cartão SUS',
  })
  cartao_sus: string;

  // Endereço
  @Column({
    type: 'varchar',
    length: 8,
    comment: 'CEP sem formatação',
  })
  cep: string;

  @Column({
    type: 'varchar',
    length: 255,
    comment: 'Rua/Logradouro',
  })
  rua: string;

  @Column({
    type: 'varchar',
    length: 20,
    comment: 'Número do endereço',
  })
  numero: string;

  @Column({
    type: 'varchar',
    length: 100,
    comment: 'Bairro',
  })
  bairro: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    comment: 'Complemento do endereço',
  })
  complemento: string;

  @Column({
    type: 'varchar',
    length: 100,
    comment: 'Cidade',
  })
  cidade: string;

  @Column({
    type: 'char',
    length: 2,
    comment: 'Estado (UF)',
  })
  estado: string;

  // Campo para foto
  @Column({
    type: 'varchar',
    length: 500,
    nullable: true,
    comment: 'URL da foto do paciente',
  })
  foto_url: string;

  @Column({
    type: 'enum',
    enum: ['ativo', 'inativo', 'bloqueado'],
    default: 'ativo',
    comment: 'Status do paciente no sistema',
  })
  status: string;

  // Multi-empresa
  @Column({
    comment: 'ID da empresa (CNPJ/Filial)',
  })
  empresa_id: string;

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

  @Column({
    nullable: true,
    comment: 'ID do usuário que criou o registro',
  })
  criado_por: string;

  @Column({
    nullable: true,
    comment: 'ID do usuário que atualizou o registro',
  })
  atualizado_por: string;

  // Relacionamentos (serão implementados quando as outras entidades existirem)
  convenio?: any;
  empresa?: any;
  ordens_servico?: any[];
  agendamentos?: any[];

  // Métodos auxiliares
  getCpfFormatado(): string {
    if (!this.cpf || this.cpf.length !== 11) {
      return this.cpf;
    }
    return this.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

  getIdade(): number {
    if (!this.data_nascimento) {
      return 0;
    }
    const hoje = new Date();
    const nascimento = new Date(this.data_nascimento);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();

    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
      idade--;
    }

    return idade;
  }

  getNomeCompleto(): string {
    if (this.usar_nome_social === 'sim' && this.nome_social) {
      return this.nome_social;
    }
    return this.nome;
  }

  getEnderecoCompleto(): string {
    const partes = [this.rua, this.numero, this.bairro];
    if (this.complemento) {
      partes.splice(2, 0, this.complemento);
    }
    return partes.filter(Boolean).join(', ');
  }

  getCepFormatado(): string {
    if (!this.cep || this.cep.length !== 8) {
      return this.cep;
    }
    return this.cep.replace(/(\d{5})(\d{3})/, '$1-$2');
  }

  getTelefoneFormatado(): string {
    const numero = this.whatsapp || this.contatos;
    if (!numero) {
      return '';
    }

    // Remove caracteres não numéricos
    const cleaned = numero.replace(/\D/g, '');

    if (cleaned.length === 11) {
      return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (cleaned.length === 10) {
      return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }

    return numero;
  }
}
