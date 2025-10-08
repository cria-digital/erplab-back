import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  Param,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiExcludeEndpoint,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import {
  LoginResponseDto,
  RefreshResponseDto,
  MessageResponseDto,
  ValidateTokenResponseDto,
} from './dto/login-response.dto';
import { Public } from './decorators/public.decorator';
import { CurrentUser } from './decorators/current-user.decorator';

@ApiTags('Autenticação')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('setup')
  @HttpCode(HttpStatus.CREATED)
  @ApiExcludeEndpoint()
  @ApiOperation({ summary: 'Criar usuário inicial - diegosoek@gmail.com' })
  @ApiResponse({
    status: 201,
    description: 'Usuário inicial criado com sucesso',
  })
  @ApiResponse({
    status: 400,
    description: 'Já existe usuário cadastrado no sistema',
  })
  async setup(@Body() setupDto: { senha: string }) {
    return this.authService.setupInitialUser(setupDto.senha);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Realizar login',
    description: 'Autentica o usuário e retorna tokens de acesso JWT',
  })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Login realizado com sucesso',
    type: LoginResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Renovar access token',
    description: 'Usa o refresh token para gerar um novo access token',
  })
  @ApiBody({ type: RefreshTokenDto })
  @ApiResponse({
    status: 200,
    description: 'Token renovado com sucesso',
    type: RefreshResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Refresh token inválido' })
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto);
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Realizar logout',
    description: 'Invalida a sessão do usuário autenticado',
  })
  @ApiResponse({ status: 204, description: 'Logout realizado com sucesso' })
  async logout(@CurrentUser() user: any) {
    await this.authService.logout(user.id);
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Obter dados do usuário autenticado',
    description: 'Retorna as informações do usuário atual baseado no token JWT',
  })
  @ApiResponse({
    status: 200,
    description: 'Dados do usuário',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        nome: { type: 'string' },
        email: { type: 'string' },
        tipo: { type: 'string' },
        unidadeSaudeId: { type: 'string' },
        permissoes: { type: 'array', items: { type: 'string' } },
      },
    },
  })
  async getProfile(@CurrentUser() user: any) {
    return user;
  }

  @Public()
  @Post('validate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Validar token JWT',
    description: 'Verifica se um token JWT é válido',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        token: { type: 'string', description: 'Token JWT para validar' },
      },
      required: ['token'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Status de validação do token',
    type: ValidateTokenResponseDto,
  })
  async validateToken(@Body('token') token: string) {
    const valid = await this.authService.validateToken(token);
    return { valid };
  }

  @Public()
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Solicitar recuperação de senha',
    description:
      'Envia um email com token numérico de 6 dígitos para recuperação de senha',
  })
  @ApiBody({ type: ForgotPasswordDto })
  @ApiResponse({
    status: 200,
    description: 'Email de recuperação enviado se o email existir no sistema',
    type: MessageResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Erro ao enviar email de recuperação',
  })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    await this.authService.forgotPassword(forgotPasswordDto);
    return {
      message:
        'Se o email estiver cadastrado, você receberá um código de 6 dígitos para recuperação de senha.',
    };
  }

  @Public()
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Resetar senha com token de recuperação',
    description:
      'Define uma nova senha usando o código de 6 dígitos recebido por email',
  })
  @ApiBody({ type: ResetPasswordDto })
  @ApiResponse({
    status: 200,
    description: 'Senha alterada com sucesso',
    type: MessageResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Token inválido ou expirado',
  })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    await this.authService.resetPasswordWithToken(resetPasswordDto);
    return {
      message:
        'Senha alterada com sucesso. Você já pode fazer login com a nova senha.',
    };
  }

  @Public()
  @Get('validate-reset-token/:token')
  @ApiOperation({
    summary: 'Validar token de recuperação de senha',
    description:
      'Verifica se um token numérico de 6 dígitos é válido e não expirou',
  })
  @ApiParam({
    name: 'token',
    description: 'Token numérico de recuperação de senha (6 dígitos)',
    example: '123456',
  })
  @ApiResponse({
    status: 200,
    description: 'Status de validação do token',
    type: ValidateTokenResponseDto,
  })
  async validateResetToken(@Param('token') token: string) {
    const valid = await this.authService.validateResetToken(token);
    return { valid };
  }

  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Alterar senha do usuário autenticado',
    description:
      'Permite ao usuário logado alterar sua própria senha fornecendo a senha atual',
  })
  @ApiBody({ type: ChangePasswordDto })
  @ApiResponse({
    status: 200,
    description: 'Senha alterada com sucesso',
    type: MessageResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Senha atual incorreta ou usuário não autenticado',
  })
  @ApiResponse({
    status: 400,
    description: 'Nova senha igual à senha atual',
  })
  async changePassword(
    @CurrentUser() user: any,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    await this.authService.changePassword(user.id, changePasswordDto);
    return {
      message: 'Senha alterada com sucesso',
    };
  }
}
