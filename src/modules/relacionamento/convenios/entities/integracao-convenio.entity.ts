import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Empresa } from '../../../cadastros/empresas/entities/empresa.entity';

@Entity('integracoes_convenio')
export class IntegracaoConvenio {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'empresa_id' })
  empresaId: string;

  @ManyToOne(() => Empresa)
  @JoinColumn({ name: 'empresa_id' })
  empresa: Empresa;

  // Vincular integração
  @Column({ nullable: true, name: 'integracao' })
  integracao: string;

  // URLs de integração
  @Column({ nullable: true, name: 'url_verificacao_elegibilidade' })
  urlVerificacaoElegibilidade: string;

  @Column({ nullable: true, name: 'url_autenticacao' })
  urlAutenticacao: string;

  @Column({ nullable: true, name: 'url_solicitacao_procedimento' })
  urlSolicitacaoProcedimento: string;

  @Column({ nullable: true, name: 'url_cancelamento' })
  urlCancelamento: string;

  @Column({ nullable: true, name: 'url_status_autorizacao' })
  urlStatusAutorizacao: string;

  @Column({ nullable: true, name: 'url_protocolo' })
  urlProtocolo: string;

  @Column({ nullable: true, name: 'url_lote_anexo' })
  urlLoteAnexo: string;

  @Column({ nullable: true, name: 'url_comunicacao_beneficiario' })
  urlComunicacaoBeneficiario: string;

  // Configuração de Comunicação
  @Column({ default: false, name: 'ativar_comunicacao' })
  ativarComunicacao: boolean;

  @Column({ nullable: true, name: 'versao_tiss_comunicacao' })
  versaoTissComunicacao: string;

  @Column({ default: false, name: 'criptografar_tiss' })
  criptografarTiss: boolean;

  @Column({ nullable: true, name: 'autorizador_padrao' })
  autorizadorPadrao: string;

  @Column({ default: false, name: 'cadastrar_credencial' })
  cadastrarCredencial: boolean;

  @Column({ default: false, name: 'utilizar_autenticador' })
  utilizarAutenticador: boolean;

  @Column({ default: false, name: 'utilizar_soap_action' })
  utilizarSoapAction: boolean;

  @Column({ default: false, name: 'enviar_arquivo' })
  enviarArquivo: boolean;

  @Column({ nullable: true, name: 'chave_api' })
  chaveApi: string;

  @Column({ nullable: true, name: 'tipo_autenticacao' })
  tipoAutenticacao: string;

  @Column({ nullable: true })
  usuario: string;

  @Column({ nullable: true })
  senha: string;

  // Adicionais para criptografia
  @Column({ nullable: true, name: 'criptografar_senha' })
  criptografarSenha: boolean;

  @Column({ nullable: true, name: 'certificado_serie' })
  certificadoSerie: string;

  @Column({ default: true })
  ativo: boolean;

  @CreateDateColumn({ name: 'criado_em' })
  criadoEm: Date;

  @UpdateDateColumn({ name: 'atualizado_em' })
  atualizadoEm: Date;
}
