import {
  Controller,
  Get,
  Patch,
  Post,
  Body,
  Request,
  Ip,
  Headers,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse as ApiResponseDoc,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';

import { PerfilService } from './perfil.service';
import { UpdatePerfilDto, UpdatePreferenciasDto, AlterarSenhaDto } from './dto';

interface ApiResponse<T = any> {
  message: string;
  data?: T;
}

interface RequestWithUser {
  user: {
    id: string;
    email: string;
  };
}

@ApiTags('Perfil')
@ApiBearerAuth()
@Controller('perfil')
export class PerfilController {
  constructor(private readonly perfilService: PerfilService) {}

  @Get()
  @ApiOperation({
    summary: 'Obter perfil completo do usuário logado',
    description: 'Retorna dados pessoais e preferências do usuário autenticado',
  })
  @ApiResponseDoc({
    status: 200,
    description: 'Perfil obtido com sucesso',
  })
  @ApiResponseDoc({
    status: 404,
    description: 'Usuário não encontrado',
  })
  async obterPerfil(@Request() req: RequestWithUser): Promise<ApiResponse> {
    const perfil = await this.perfilService.obterPerfil(req.user.id);

    return {
      message: 'Perfil obtido com sucesso',
      data: perfil,
    };
  }

  @Patch()
  @ApiOperation({
    summary: 'Atualizar dados pessoais do perfil',
    description:
      'Atualiza informações pessoais do usuário logado (nome, email, telefone, etc)',
  })
  @ApiResponseDoc({
    status: 200,
    description: 'Perfil atualizado com sucesso',
  })
  @ApiResponseDoc({
    status: 409,
    description: 'Email ou CPF já em uso',
  })
  @ApiResponseDoc({
    status: 404,
    description: 'Usuário não encontrado',
  })
  @ApiBody({ type: UpdatePerfilDto })
  async atualizarPerfil(
    @Request() req: RequestWithUser,
    @Body() updatePerfilDto: UpdatePerfilDto,
    @Ip() ip: string,
  ): Promise<ApiResponse> {
    const perfilAtualizado = await this.perfilService.atualizarPerfil(
      req.user.id,
      updatePerfilDto,
      ip,
    );

    return {
      message: 'Perfil atualizado com sucesso',
      data: perfilAtualizado,
    };
  }

  @Get('preferencias')
  @ApiOperation({
    summary: 'Obter preferências do usuário',
    description:
      'Retorna configurações de notificações, interface e privacidade',
  })
  @ApiResponseDoc({
    status: 200,
    description: 'Preferências obtidas com sucesso',
  })
  async obterPreferencias(
    @Request() req: RequestWithUser,
  ): Promise<ApiResponse> {
    const preferencias = await this.perfilService.obterPreferencias(
      req.user.id,
    );

    return {
      message: 'Preferências obtidas com sucesso',
      data: preferencias,
    };
  }

  @Patch('preferencias')
  @ApiOperation({
    summary: 'Atualizar preferências do usuário',
    description:
      'Atualiza configurações de notificações, interface e privacidade',
  })
  @ApiResponseDoc({
    status: 200,
    description: 'Preferências atualizadas com sucesso',
  })
  @ApiBody({ type: UpdatePreferenciasDto })
  async atualizarPreferencias(
    @Request() req: RequestWithUser,
    @Body() updatePreferenciasDto: UpdatePreferenciasDto,
    @Ip() ip: string,
  ): Promise<ApiResponse> {
    const preferenciasAtualizadas =
      await this.perfilService.atualizarPreferencias(
        req.user.id,
        updatePreferenciasDto,
        ip,
      );

    return {
      message: 'Preferências atualizadas com sucesso',
      data: preferenciasAtualizadas,
    };
  }

  @Post('alterar-senha')
  @ApiOperation({
    summary: 'Alterar senha do usuário',
    description:
      'Altera a senha do usuário com validações de segurança: mínimo 8 caracteres, 1 maiúscula, 1 número, 1 especial, diferente das últimas 5 senhas',
  })
  @ApiResponseDoc({
    status: 200,
    description: 'Senha alterada com sucesso',
  })
  @ApiResponseDoc({
    status: 400,
    description: 'Dados inválidos ou senha não atende aos requisitos',
  })
  @ApiResponseDoc({
    status: 401,
    description: 'Senha atual incorreta',
  })
  @ApiBody({ type: AlterarSenhaDto })
  async alterarSenha(
    @Request() req: RequestWithUser,
    @Body() alterarSenhaDto: AlterarSenhaDto,
    @Ip() ip: string,
    @Headers('user-agent') userAgent: string,
  ): Promise<ApiResponse> {
    const resultado = await this.perfilService.alterarSenha(
      req.user.id,
      alterarSenhaDto,
      ip,
      userAgent,
    );

    return resultado;
  }

  @Get('historico-senhas')
  @ApiOperation({
    summary: 'Obter histórico de alterações de senha',
    description:
      'Retorna as últimas 20 alterações de senha do usuário (sem exibir os hashes)',
  })
  @ApiResponseDoc({
    status: 200,
    description: 'Histórico obtido com sucesso',
  })
  async obterHistoricoSenhas(
    @Request() req: RequestWithUser,
  ): Promise<ApiResponse> {
    const historico = await this.perfilService.obterHistoricoSenhas(
      req.user.id,
    );

    return {
      message: 'Histórico de senhas obtido com sucesso',
      data: historico,
    };
  }
}
