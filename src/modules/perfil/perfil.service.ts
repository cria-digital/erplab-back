import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { Usuario } from '../usuarios/entities/usuario.entity';
import { PreferenciaUsuario } from './entities/preferencia-usuario.entity';
import { HistoricoSenha } from './entities/historico-senha.entity';
import {
  UpdatePerfilDto,
  UpdatePreferenciasDto,
  AlterarSenhaDto,
  CreatePreferenciasDto,
} from './dto';
import { AuditoriaService } from '../auditoria/auditoria.service';

@Injectable()
export class PerfilService {
  // Número de senhas anteriores que não podem ser reutilizadas
  private readonly HISTORICO_SENHAS_LIMIT = 5;

  constructor(
    @InjectRepository(Usuario)
    private readonly usuariosRepository: Repository<Usuario>,
    @InjectRepository(PreferenciaUsuario)
    private readonly preferenciasRepository: Repository<PreferenciaUsuario>,
    @InjectRepository(HistoricoSenha)
    private readonly historicoSenhasRepository: Repository<HistoricoSenha>,
    private readonly auditoriaService: AuditoriaService,
  ) {}

  /**
   * Obtém o perfil completo do usuário (dados + preferências)
   */
  async obterPerfil(usuarioId: string) {
    const usuario = await this.usuariosRepository.findOne({
      where: { id: usuarioId },
      relations: ['unidades', 'permissoes'],
    });

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Buscar ou criar preferências
    let preferencias = await this.preferenciasRepository.findOne({
      where: { usuarioId },
    });

    if (!preferencias) {
      // Criar preferências com valores padrão se não existir
      preferencias = await this.criarPreferenciasIniciais(usuarioId);
    }

    // Remove dados sensíveis
    const {
      senhaHash: _,
      respostaRecuperacaoHash: __,
      resetPasswordToken: ___,
      ...dadosUsuario
    } = usuario;

    return {
      ...dadosUsuario,
      preferencias,
    };
  }

  /**
   * Atualiza dados pessoais do perfil
   */
  async atualizarPerfil(
    usuarioId: string,
    updatePerfilDto: UpdatePerfilDto,
    ipOrigem?: string,
  ) {
    const usuario = await this.usuariosRepository.findOne({
      where: { id: usuarioId },
    });

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Verifica se email já está em uso por outro usuário
    if (updatePerfilDto.email && updatePerfilDto.email !== usuario.email) {
      const emailExiste = await this.usuariosRepository.findOne({
        where: { email: updatePerfilDto.email },
      });

      if (emailExiste) {
        throw new ConflictException('Este e-mail já está em uso');
      }
    }

    // Verifica se CPF já está em uso por outro usuário
    if (updatePerfilDto.cpf && updatePerfilDto.cpf !== usuario.cpf) {
      const cpfExiste = await this.usuariosRepository.findOne({
        where: { cpf: updatePerfilDto.cpf },
      });

      if (cpfExiste) {
        throw new ConflictException('Este CPF já está em uso');
      }
    }

    // Atualiza dados
    Object.assign(usuario, updatePerfilDto);
    const usuarioAtualizado = await this.usuariosRepository.save(usuario);

    // Registrar auditoria
    await this.auditoriaService.registrarLog({
      tipoLog: 'ALTERACAO' as any,
      usuarioId,
      acao: 'ATUALIZACAO_PERFIL',
      operacao: 'UPDATE' as any,
      detalhes: 'Atualização de dados do perfil',
      entidade: 'Usuario',
      entidadeId: usuarioId,
      dadosAlteracao: updatePerfilDto,
      ipAddress: ipOrigem,
    });

    // Remove dados sensíveis
    const {
      senhaHash: ____,
      respostaRecuperacaoHash: _____,
      resetPasswordToken: ______,
      ...dadosRetorno
    } = usuarioAtualizado;

    return dadosRetorno;
  }

  /**
   * Obtém preferências do usuário
   */
  async obterPreferencias(usuarioId: string) {
    let preferencias = await this.preferenciasRepository.findOne({
      where: { usuarioId },
    });

    if (!preferencias) {
      // Criar preferências padrão se não existir
      preferencias = await this.criarPreferenciasIniciais(usuarioId);
    }

    return preferencias;
  }

  /**
   * Atualiza preferências do usuário
   */
  async atualizarPreferencias(
    usuarioId: string,
    updatePreferenciasDto: UpdatePreferenciasDto,
    ipOrigem?: string,
  ) {
    let preferencias = await this.preferenciasRepository.findOne({
      where: { usuarioId },
    });

    if (!preferencias) {
      // Criar preferências se não existir
      preferencias = this.preferenciasRepository.create({
        usuarioId,
        ...updatePreferenciasDto,
      });
    } else {
      // Atualizar preferências existentes
      Object.assign(preferencias, updatePreferenciasDto);
    }

    const preferenciasAtualizadas =
      await this.preferenciasRepository.save(preferencias);

    // Registrar auditoria
    await this.auditoriaService.registrarLog({
      tipoLog: 'ALTERACAO' as any,
      usuarioId,
      acao: 'ATUALIZACAO_PREFERENCIAS',
      operacao: 'UPDATE' as any,
      detalhes: 'Atualização de preferências do usuário',
      entidade: 'PreferenciaUsuario',
      entidadeId: preferencias.id,
      dadosAlteracao: updatePreferenciasDto,
      ipAddress: ipOrigem,
    });

    return preferenciasAtualizadas;
  }

  /**
   * Altera a senha do usuário com validações de segurança
   */
  async alterarSenha(
    usuarioId: string,
    alterarSenhaDto: AlterarSenhaDto,
    ipOrigem?: string,
    userAgent?: string,
  ) {
    const { senhaAtual, novaSenha, confirmarNovaSenha } = alterarSenhaDto;

    // Validar se nova senha e confirmação são iguais
    if (novaSenha !== confirmarNovaSenha) {
      throw new BadRequestException('Nova senha e confirmação não conferem');
    }

    // Buscar usuário
    const usuario = await this.usuariosRepository.findOne({
      where: { id: usuarioId },
    });

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Validar senha atual
    const senhaValida = await usuario.comparePassword(senhaAtual);
    if (!senhaValida) {
      throw new UnauthorizedException('Senha atual incorreta');
    }

    // Validar se nova senha é diferente da atual
    const novaSenhaIgualAtual = await bcrypt.compare(
      novaSenha,
      usuario.senhaHash,
    );
    if (novaSenhaIgualAtual) {
      throw new BadRequestException(
        'A nova senha deve ser diferente da senha atual',
      );
    }

    // Buscar histórico de senhas anteriores
    const historicoSenhas = await this.historicoSenhasRepository.find({
      where: { usuarioId },
      order: { dataAlteracao: 'DESC' },
      take: this.HISTORICO_SENHAS_LIMIT,
    });

    // Validar se a nova senha não foi usada recentemente
    for (const historico of historicoSenhas) {
      const senhaJaUsada = await bcrypt.compare(novaSenha, historico.senhaHash);
      if (senhaJaUsada) {
        throw new BadRequestException(
          `A nova senha não pode ser igual a nenhuma das últimas ${this.HISTORICO_SENHAS_LIMIT} senhas utilizadas`,
        );
      }
    }

    // Salvar senha atual no histórico antes de alterar
    const historicoSenha = this.historicoSenhasRepository.create({
      usuarioId,
      senhaHash: usuario.senhaHash,
      motivoAlteracao: 'usuario_solicitou',
      ipOrigem,
      userAgent,
    });
    await this.historicoSenhasRepository.save(historicoSenha);

    // Atualizar senha do usuário
    usuario.senhaHash = novaSenha; // Será hasheada pelo BeforeUpdate
    await this.usuariosRepository.save(usuario);

    // Limpar histórico antigo (manter apenas os últimos N)
    const todasSenhasHistorico = await this.historicoSenhasRepository.find({
      where: { usuarioId },
      order: { dataAlteracao: 'DESC' },
    });

    if (todasSenhasHistorico.length > this.HISTORICO_SENHAS_LIMIT) {
      const senhasParaRemover = todasSenhasHistorico.slice(
        this.HISTORICO_SENHAS_LIMIT,
      );
      await this.historicoSenhasRepository.remove(senhasParaRemover);
    }

    // Registrar auditoria
    await this.auditoriaService.registrarLog({
      tipoLog: 'ALTERACAO' as any,
      usuarioId,
      acao: 'ALTERACAO_SENHA',
      operacao: 'UPDATE' as any,
      detalhes: 'Alteração de senha pelo próprio usuário',
      entidade: 'Usuario',
      entidadeId: usuarioId,
      ipAddress: ipOrigem,
    });

    return {
      message: 'Senha alterada com sucesso',
    };
  }

  /**
   * Obtém histórico de alterações de senha
   */
  async obterHistoricoSenhas(usuarioId: string) {
    const historico = await this.historicoSenhasRepository.find({
      where: { usuarioId },
      order: { dataAlteracao: 'DESC' },
      take: 20, // Últimas 20 alterações
    });

    // Remove hash de senha da resposta
    return historico.map(({ senhaHash: _______, ...resto }) => resto);
  }

  /**
   * Cria preferências iniciais para um usuário
   * (método auxiliar, geralmente chamado ao criar novo usuário)
   */
  async criarPreferenciasIniciais(
    usuarioId: string,
    dados?: CreatePreferenciasDto,
  ): Promise<PreferenciaUsuario> {
    const preferencias = this.preferenciasRepository.create({
      usuarioId,
      ...dados,
    });

    return await this.preferenciasRepository.save(preferencias);
  }
}
