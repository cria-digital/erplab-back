import {
  Injectable,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { Usuario } from './entities/usuario.entity';
import { UsuarioUnidade } from './entities/usuario-unidade.entity';
import { UsuarioPermissao } from './entities/usuario-permissao.entity';
import { CreateUsuarioDto, UpdateUsuarioDto, ChangePasswordDto } from './dto';
import { AuditoriaService } from '../../infraestrutura/auditoria/auditoria.service';
import { OperacaoLog } from '../../infraestrutura/auditoria/entities/auditoria-log.entity';

export interface UsuariosFilters {
  page?: number;
  limit?: number;
  nome?: string;
  email?: string;
  cpf?: string;
  ativo?: boolean;
  unidadeId?: string;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuariosRepository: Repository<Usuario>,
    @InjectRepository(UsuarioUnidade)
    private readonly usuarioUnidadeRepository: Repository<UsuarioUnidade>,
    @InjectRepository(UsuarioPermissao)
    private readonly usuarioPermissaoRepository: Repository<UsuarioPermissao>,
    private readonly auditoriaService: AuditoriaService,
  ) {}

  /**
   * Cria um novo usuário
   * @param createUsuarioDto Dados do usuário
   * @param criadoPorId ID do usuário que está criando
   * @returns Usuário criado
   */
  async create(
    createUsuarioDto: CreateUsuarioDto,
    criadoPorId?: string,
  ): Promise<Usuario> {
    // Verifica se já existe usuário com o e-mail
    const usuarioExistente = await this.usuariosRepository.findOne({
      where: { email: createUsuarioDto.email },
    });

    if (usuarioExistente) {
      throw new ConflictException(
        'Já existe um usuário cadastrado com este e-mail',
      );
    }

    // Verifica CPF se fornecido
    if (createUsuarioDto.cpf) {
      const usuarioCpf = await this.usuariosRepository.findOne({
        where: { cpf: createUsuarioDto.cpf },
      });

      if (usuarioCpf) {
        throw new ConflictException(
          'Já existe um usuário cadastrado com este CPF',
        );
      }
    }

    // Gera código interno se não fornecido
    const codigoInterno = createUsuarioDto.codigoInterno || `USR${Date.now()}`;

    // Prepara dados para criação
    const dadosUsuario = {
      ...createUsuarioDto,
      codigoInterno,
      senhaHash: createUsuarioDto.senha, // será hasheada pelo BeforeInsert
    };

    // Remove campos que não pertencem à entidade Usuario
    delete dadosUsuario.senha;
    delete dadosUsuario.unidadesIds;
    delete dadosUsuario.permissoesIds;

    // Cria o usuário
    const usuario = this.usuariosRepository.create(dadosUsuario);

    // Se houver resposta de recuperação, hasheia ela
    if (createUsuarioDto.respostaRecuperacao) {
      await usuario.hashRespostaRecuperacao(
        createUsuarioDto.respostaRecuperacao,
      );
    }

    const usuarioSalvo = await this.usuariosRepository.save(usuario);

    // Associa unidades se fornecidas
    if (
      createUsuarioDto.unidadesIds &&
      createUsuarioDto.unidadesIds.length > 0
    ) {
      const unidades = createUsuarioDto.unidadesIds.map((unidadeId) =>
        this.usuarioUnidadeRepository.create({
          usuario: usuarioSalvo,
          unidadeSaudeId: unidadeId,
        }),
      );
      await this.usuarioUnidadeRepository.save(unidades);
    }

    // Associa permissões se fornecidas
    if (
      createUsuarioDto.permissoesIds &&
      createUsuarioDto.permissoesIds.length > 0
    ) {
      const permissoes = createUsuarioDto.permissoesIds.map((permissaoId) =>
        this.usuarioPermissaoRepository.create({
          usuario: usuarioSalvo,
          permissaoId,
        }),
      );
      await this.usuarioPermissaoRepository.save(permissoes);
    }

    // Registra na auditoria apenas se não for o primeiro usuário
    if (criadoPorId) {
      await this.auditoriaService.registrarAlteracao(
        criadoPorId,
        'usuarios',
        usuarioSalvo.id,
        OperacaoLog.INSERT,
        { novo: { id: usuarioSalvo.id, email: usuarioSalvo.email } },
        'Usuários',
      );
    }

    return usuarioSalvo;
  }

  /**
   * Lista usuários com filtros e paginação
   * @param filters Filtros de busca
   * @returns Lista paginada de usuários
   */
  async findAll(
    filters: UsuariosFilters = {},
  ): Promise<PaginatedResult<Usuario>> {
    const {
      page = 1,
      limit = 10,
      nome,
      email,
      cpf,
      ativo,
      unidadeId,
    } = filters;
    const skip = (page - 1) * limit;

    let query = this.usuariosRepository
      .createQueryBuilder('usuario')
      .leftJoinAndSelect('usuario.unidades', 'unidades')
      .leftJoinAndSelect('usuario.permissoes', 'permissoes');

    if (nome) {
      query = query.andWhere('usuario.nomeCompleto ILIKE :nome', {
        nome: `%${nome}%`,
      });
    }

    if (email) {
      query = query.andWhere('usuario.email ILIKE :email', {
        email: `%${email}%`,
      });
    }

    if (cpf) {
      query = query.andWhere('usuario.cpf = :cpf', { cpf });
    }

    if (ativo !== undefined) {
      query = query.andWhere('usuario.ativo = :ativo', { ativo });
    }

    if (unidadeId) {
      query = query.andWhere('unidades.unidadeSaudeId = :unidadeId', {
        unidadeId,
      });
    }

    const [usuarios, total] = await query
      .orderBy('usuario.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      data: usuarios,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Busca um usuário por ID
   * @param id ID do usuário
   * @returns Usuário encontrado
   */
  async findOne(id: string): Promise<Usuario> {
    const usuario = await this.usuariosRepository.findOne({
      where: { id },
      relations: ['unidades', 'permissoes'],
    });

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return usuario;
  }

  /**
   * Busca um usuário por e-mail
   * @param email E-mail do usuário
   * @returns Usuário encontrado ou null
   */
  async findByEmail(email: string): Promise<Usuario | null> {
    return await this.usuariosRepository.findOne({
      where: { email },
      relations: ['unidades', 'permissoes'],
    });
  }

  /**
   * Atualiza um usuário
   * @param id ID do usuário
   * @param updateUsuarioDto Dados para atualização
   * @param atualizadoPorId ID do usuário que está atualizando
   * @returns Usuário atualizado
   */
  async update(
    id: string,
    updateUsuarioDto: UpdateUsuarioDto,
    atualizadoPorId: string,
  ): Promise<Usuario> {
    const usuario = await this.findOne(id);

    // Captura valores anteriores para auditoria
    const valoresAnteriores = {
      nomeCompleto: usuario.nomeCompleto,
      cpf: usuario.cpf,
      telefone: usuario.telefone,
      celularWhatsapp: usuario.celularWhatsapp,
      cargoFuncao: usuario.cargoFuncao,
      ativo: usuario.ativo,
    };

    // Se houver nova senha, hasheia ela
    if (updateUsuarioDto.senha) {
      usuario.senhaHash = await bcrypt.hash(updateUsuarioDto.senha, 10);
      delete updateUsuarioDto.senha;
    }

    // Se houver nova resposta de recuperação, hasheia ela
    if (updateUsuarioDto.respostaRecuperacao) {
      await usuario.hashRespostaRecuperacao(
        updateUsuarioDto.respostaRecuperacao,
      );
      delete updateUsuarioDto.respostaRecuperacao;
    }

    // Remove campos que não pertencem à entidade Usuario
    const { unidadesIds, permissoesIds, ...dadosAtualizacao } =
      updateUsuarioDto;

    // Aplica atualizações
    Object.assign(usuario, dadosAtualizacao);

    const usuarioAtualizado = await this.usuariosRepository.save(usuario);

    // Atualiza unidades se fornecidas
    if (unidadesIds !== undefined) {
      // Remove unidades antigas
      await this.usuarioUnidadeRepository.delete({ usuario: { id } });

      // Adiciona novas unidades
      if (unidadesIds.length > 0) {
        const unidades = unidadesIds.map((unidadeId) =>
          this.usuarioUnidadeRepository.create({
            usuario: usuarioAtualizado,
            unidadeSaudeId: unidadeId,
          }),
        );
        await this.usuarioUnidadeRepository.save(unidades);
      }
    }

    // Atualiza permissões se fornecidas
    if (permissoesIds !== undefined) {
      // Remove permissões antigas
      await this.usuarioPermissaoRepository.delete({ usuario: { id } });

      // Adiciona novas permissões
      if (permissoesIds.length > 0) {
        const permissoes = permissoesIds.map((permissaoId) =>
          this.usuarioPermissaoRepository.create({
            usuario: usuarioAtualizado,
            permissaoId,
          }),
        );
        await this.usuarioPermissaoRepository.save(permissoes);
      }
    }

    // Registra na auditoria
    await this.auditoriaService.registrarAlteracao(
      atualizadoPorId,
      'usuarios',
      id,
      OperacaoLog.UPDATE,
      {
        anterior: valoresAnteriores,
        novo: {
          nomeCompleto: usuarioAtualizado.nomeCompleto,
          cpf: usuarioAtualizado.cpf,
          telefone: usuarioAtualizado.telefone,
          celularWhatsapp: usuarioAtualizado.celularWhatsapp,
          cargoFuncao: usuarioAtualizado.cargoFuncao,
          ativo: usuarioAtualizado.ativo,
        },
      },
      'Usuários',
    );

    return usuarioAtualizado;
  }

  /**
   * Remove um usuário (soft delete - inativa)
   * @param id ID do usuário
   * @param removidoPorId ID do usuário que está removendo
   */
  async remove(id: string, removidoPorId: string): Promise<void> {
    const usuario = await this.findOne(id);

    usuario.ativo = false;

    await this.usuariosRepository.save(usuario);

    // Registra na auditoria
    await this.auditoriaService.registrarAlteracao(
      removidoPorId,
      'usuarios',
      id,
      OperacaoLog.DELETE,
      { anterior: { ativo: true }, novo: { ativo: false } },
      'Usuários',
    );
  }

  /**
   * Ativa um usuário inativo
   * @param id ID do usuário
   * @param ativadoPorId ID do usuário que está ativando
   * @returns Usuário ativado
   */
  async activate(id: string, ativadoPorId: string): Promise<Usuario> {
    const usuario = await this.findOne(id);

    usuario.ativo = true;
    usuario.tentativasLoginFalhas = 0;
    usuario.bloqueadoAte = null;

    const usuarioAtivado = await this.usuariosRepository.save(usuario);

    // Registra na auditoria
    await this.auditoriaService.registrarAlteracao(
      ativadoPorId,
      'usuarios',
      id,
      OperacaoLog.UPDATE,
      { anterior: { ativo: false }, novo: { ativo: true } },
      'Usuários',
    );

    return usuarioAtivado;
  }

  /**
   * Bloqueia um usuário
   * @param id ID do usuário
   * @param minutos Minutos de bloqueio
   * @param bloqueadoPorId ID do usuário que está bloqueando
   * @returns Usuário bloqueado
   */
  async block(
    id: string,
    minutos: number,
    bloqueadoPorId: string,
  ): Promise<Usuario> {
    const usuario = await this.findOne(id);

    const bloqueadoAte = new Date();
    bloqueadoAte.setMinutes(bloqueadoAte.getMinutes() + minutos);

    usuario.bloqueadoAte = bloqueadoAte;

    const usuarioBloqueado = await this.usuariosRepository.save(usuario);

    // Registra na auditoria
    await this.auditoriaService.registrarAlteracao(
      bloqueadoPorId,
      'usuarios',
      id,
      OperacaoLog.UPDATE,
      {
        anterior: { bloqueadoAte: null },
        novo: { bloqueadoAte },
      },
      'Usuários',
    );

    return usuarioBloqueado;
  }

  /**
   * Desbloqueia um usuário
   * @param id ID do usuário
   * @param desbloqueadoPorId ID do usuário que está desbloqueando
   * @returns Usuário desbloqueado
   */
  async unblock(id: string, desbloqueadoPorId: string): Promise<Usuario> {
    const usuario = await this.findOne(id);

    const bloqueadoAteAnterior = usuario.bloqueadoAte;
    usuario.bloqueadoAte = null;
    usuario.tentativasLoginFalhas = 0;

    const usuarioDesbloqueado = await this.usuariosRepository.save(usuario);

    // Registra na auditoria
    await this.auditoriaService.registrarAlteracao(
      desbloqueadoPorId,
      'usuarios',
      id,
      OperacaoLog.UPDATE,
      {
        anterior: { bloqueadoAte: bloqueadoAteAnterior },
        novo: { bloqueadoAte: null },
      },
      'Usuários',
    );

    return usuarioDesbloqueado;
  }

  /**
   * Altera a senha do usuário
   * @param id ID do usuário
   * @param changePasswordDto Dados de alteração de senha
   * @returns Usuário com senha alterada
   */
  async changePassword(
    id: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<Usuario> {
    const usuario = await this.findOne(id);

    // Verifica senha atual
    const senhaValida = await usuario.comparePassword(
      changePasswordDto.senhaAtual,
    );
    if (!senhaValida) {
      throw new UnauthorizedException('Senha atual incorreta');
    }

    // Verifica se a nova senha é igual à confirmação
    if (changePasswordDto.novaSenha !== changePasswordDto.confirmacaoSenha) {
      throw new BadRequestException('Nova senha e confirmação não conferem');
    }

    // Atualiza a senha
    usuario.senhaHash = await bcrypt.hash(changePasswordDto.novaSenha, 10);
    usuario.resetarSenha = false;

    const usuarioAtualizado = await this.usuariosRepository.save(usuario);

    // Registra na auditoria
    await this.auditoriaService.registrarAlteracao(
      id,
      'usuarios',
      id,
      OperacaoLog.UPDATE,
      { mensagem: 'Senha alterada pelo usuário' },
      'Usuários',
    );

    return usuarioAtualizado;
  }

  /**
   * Reseta a senha do usuário
   * @param id ID do usuário
   * @param novaSenha Nova senha temporária
   * @param resetadoPorId ID do usuário que está resetando
   * @returns Usuário com senha resetada
   */
  async resetPassword(
    id: string,
    novaSenha: string,
    resetadoPorId: string,
  ): Promise<Usuario> {
    const usuario = await this.findOne(id);

    usuario.senhaHash = await bcrypt.hash(novaSenha, 10);
    usuario.resetarSenha = true;
    usuario.tentativasLoginFalhas = 0;
    usuario.bloqueadoAte = null;

    const usuarioAtualizado = await this.usuariosRepository.save(usuario);

    // Registra na auditoria
    await this.auditoriaService.registrarAlteracao(
      resetadoPorId,
      'usuarios',
      id,
      OperacaoLog.UPDATE,
      { mensagem: 'Senha resetada por administrador' },
      'Usuários',
    );

    return usuarioAtualizado;
  }

  /**
   * Registra tentativa de login falha
   * @param email E-mail do usuário
   */
  async registrarTentativaFalha(email: string): Promise<void> {
    const usuario = await this.findByEmail(email);

    if (usuario) {
      usuario.tentativasLoginFalhas++;

      // Bloqueia após 5 tentativas
      if (usuario.tentativasLoginFalhas >= 5) {
        const bloqueadoAte = new Date();
        bloqueadoAte.setMinutes(bloqueadoAte.getMinutes() + 30); // Bloqueia por 30 minutos
        usuario.bloqueadoAte = bloqueadoAte;
      }

      await this.usuariosRepository.save(usuario);
    }
  }

  /**
   * Registra login bem-sucedido
   * @param id ID do usuário
   */
  async registrarLoginSucesso(id: string): Promise<void> {
    const usuario = await this.findOne(id);

    usuario.tentativasLoginFalhas = 0;
    usuario.ultimoLogin = new Date();

    await this.usuariosRepository.save(usuario);
  }

  /**
   * Estatísticas dos usuários
   * @returns Estatísticas
   */
  async getStats() {
    const [total, ativos, inativos, bloqueados, com2FA] = await Promise.all([
      this.usuariosRepository.count(),
      this.usuariosRepository.count({ where: { ativo: true } }),
      this.usuariosRepository.count({ where: { ativo: false } }),
      this.usuariosRepository
        .createQueryBuilder('usuario')
        .where('usuario.bloqueadoAte > :agora', { agora: new Date() })
        .getCount(),
      this.usuariosRepository.count({ where: { validacao2Etapas: true } }),
    ]);

    return {
      total,
      ativos,
      inativos,
      bloqueados,
      com2FA,
    };
  }

  /**
   * Incrementa tentativas de login falhas
   * @param id ID do usuário
   */
  async incrementarTentativasLogin(id: string): Promise<void> {
    const usuario = await this.findOne(id);
    usuario.tentativasLoginFalhas = (usuario.tentativasLoginFalhas || 0) + 1;

    // Bloqueia após 5 tentativas
    if (usuario.tentativasLoginFalhas >= 5) {
      const bloqueadoAte = new Date();
      bloqueadoAte.setMinutes(bloqueadoAte.getMinutes() + 30); // Bloqueia por 30 minutos
      usuario.bloqueadoAte = bloqueadoAte;
    }

    await this.usuariosRepository.save(usuario);
  }

  /**
   * Reseta tentativas de login
   * @param id ID do usuário
   */
  async resetarTentativasLogin(id: string): Promise<void> {
    const usuario = await this.findOne(id);
    usuario.tentativasLoginFalhas = 0;
    usuario.bloqueadoAte = null;
    await this.usuariosRepository.save(usuario);
  }

  /**
   * Atualiza último login do usuário
   * @param id ID do usuário
   */
  async atualizarUltimoLogin(id: string): Promise<void> {
    const usuario = await this.findOne(id);
    usuario.ultimoLogin = new Date();
    await this.usuariosRepository.save(usuario);

    // Registra acesso
    await this.auditoriaService.registrarAcesso(
      id,
      'Login',
      'Sistema',
      'Login realizado com sucesso',
    );
  }

  /**
   * Registra logout do usuário
   * @param id ID do usuário
   */
  async registrarLogout(id: string): Promise<void> {
    // Registra acesso
    await this.auditoriaService.registrarAcesso(
      id,
      'Logout',
      'Sistema',
      'Logout realizado',
    );
  }
}
