import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';

import { UsuariosService, UsuariosFilters } from './usuarios.service';
import { CreateUsuarioDto, UpdateUsuarioDto, ChangePasswordDto } from './dto';
import { Usuario } from './entities/usuario.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

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

@ApiTags('Usuários')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post()
  @ApiOperation({
    summary: 'Criar um novo usuário',
    description:
      'Cria um novo usuário no sistema. O código interno será gerado automaticamente se não fornecido.',
  })
  @ApiResponse({
    status: 201,
    description: 'Usuário criado com sucesso',
    type: Usuario,
  })
  @ApiResponse({
    status: 409,
    description: 'E-mail ou CPF já cadastrado',
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos',
  })
  @ApiBody({ type: CreateUsuarioDto })
  async create(
    @Body() createUsuarioDto: CreateUsuarioDto,
    @Request() req: RequestWithUser,
  ): Promise<ApiResponse<Usuario>> {
    const usuario = await this.usuariosService.create(
      createUsuarioDto,
      req.user.id,
    );

    return {
      message: 'Usuário criado com sucesso',
      data: usuario,
    };
  }

  @Get()
  @ApiOperation({
    summary: 'Listar usuários',
    description: 'Lista todos os usuários com filtros opcionais e paginação.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuários retornada com sucesso',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/Usuario' },
        },
        total: { type: 'number', example: 100 },
        page: { type: 'number', example: 1 },
        limit: { type: 'number', example: 10 },
        totalPages: { type: 'number', example: 10 },
      },
    },
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Número da página',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Itens por página',
  })
  @ApiQuery({
    name: 'nome',
    required: false,
    type: String,
    description: 'Filtrar por nome',
  })
  @ApiQuery({
    name: 'email',
    required: false,
    type: String,
    description: 'Filtrar por e-mail',
  })
  @ApiQuery({
    name: 'cpf',
    required: false,
    type: String,
    description: 'Filtrar por CPF',
  })
  @ApiQuery({
    name: 'ativo',
    required: false,
    type: Boolean,
    description: 'Filtrar por status ativo',
  })
  @ApiQuery({
    name: 'unidadeId',
    required: false,
    type: String,
    description: 'Filtrar por unidade',
  })
  async findAll(@Query() filters: UsuariosFilters) {
    return this.usuariosService.findAll(filters);
  }

  @Get('stats')
  @ApiOperation({
    summary: 'Estatísticas dos usuários',
    description: 'Retorna estatísticas dos usuários.',
  })
  @ApiResponse({
    status: 200,
    description: 'Estatísticas retornadas com sucesso',
    schema: {
      type: 'object',
      properties: {
        total: { type: 'number' },
        ativos: { type: 'number' },
        inativos: { type: 'number' },
        bloqueados: { type: 'number' },
        com2FA: { type: 'number' },
      },
    },
  })
  async getStats() {
    return this.usuariosService.getStats();
  }

  @Get('me')
  @ApiOperation({
    summary: 'Obter dados do usuário autenticado',
    description: 'Retorna os dados do usuário atualmente autenticado.',
  })
  @ApiResponse({
    status: 200,
    description: 'Dados do usuário retornados com sucesso',
    type: Usuario,
  })
  async getMe(@Request() req: RequestWithUser): Promise<Usuario> {
    return this.usuariosService.findOne(req.user.id);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Buscar usuário por ID',
    description: 'Busca um usuário específico pelo ID.',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuário encontrado',
    type: Usuario,
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado',
  })
  @ApiParam({ name: 'id', description: 'ID do usuário' })
  async findOne(@Param('id') id: string): Promise<Usuario> {
    return this.usuariosService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Atualizar usuário',
    description: 'Atualiza os dados de um usuário existente.',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuário atualizado com sucesso',
    type: Usuario,
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado',
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos',
  })
  @ApiParam({ name: 'id', description: 'ID do usuário' })
  @ApiBody({ type: UpdateUsuarioDto })
  async update(
    @Param('id') id: string,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
    @Request() req: RequestWithUser,
  ): Promise<ApiResponse<Usuario>> {
    const usuario = await this.usuariosService.update(
      id,
      updateUsuarioDto,
      req.user.id,
    );

    return {
      message: 'Usuário atualizado com sucesso',
      data: usuario,
    };
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Remover usuário',
    description: 'Remove um usuário (soft delete - torna inativo).',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuário removido com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado',
  })
  @ApiParam({ name: 'id', description: 'ID do usuário' })
  async remove(
    @Param('id') id: string,
    @Request() req: RequestWithUser,
  ): Promise<ApiResponse> {
    await this.usuariosService.remove(id, req.user.id);

    return {
      message: 'Usuário removido com sucesso',
    };
  }

  @Patch(':id/activate')
  @ApiOperation({
    summary: 'Ativar usuário',
    description: 'Ativa um usuário inativo.',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuário ativado com sucesso',
    type: Usuario,
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado',
  })
  @ApiParam({ name: 'id', description: 'ID do usuário' })
  async activate(
    @Param('id') id: string,
    @Request() req: RequestWithUser,
  ): Promise<ApiResponse<Usuario>> {
    const usuario = await this.usuariosService.activate(id, req.user.id);

    return {
      message: 'Usuário ativado com sucesso',
      data: usuario,
    };
  }

  @Patch(':id/block')
  @ApiOperation({
    summary: 'Bloquear usuário',
    description: 'Bloqueia um usuário por um período determinado.',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuário bloqueado com sucesso',
    type: Usuario,
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado',
  })
  @ApiParam({ name: 'id', description: 'ID do usuário' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        minutos: {
          type: 'number',
          example: 30,
          description: 'Minutos de bloqueio',
        },
      },
      required: ['minutos'],
    },
  })
  async block(
    @Param('id') id: string,
    @Body('minutos') minutos: number,
    @Request() req: RequestWithUser,
  ): Promise<ApiResponse<Usuario>> {
    const usuario = await this.usuariosService.block(id, minutos, req.user.id);

    return {
      message: 'Usuário bloqueado com sucesso',
      data: usuario,
    };
  }

  @Patch(':id/unblock')
  @ApiOperation({
    summary: 'Desbloquear usuário',
    description: 'Desbloqueia um usuário bloqueado.',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuário desbloqueado com sucesso',
    type: Usuario,
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado',
  })
  @ApiParam({ name: 'id', description: 'ID do usuário' })
  async unblock(
    @Param('id') id: string,
    @Request() req: RequestWithUser,
  ): Promise<ApiResponse<Usuario>> {
    const usuario = await this.usuariosService.unblock(id, req.user.id);

    return {
      message: 'Usuário desbloqueado com sucesso',
      data: usuario,
    };
  }

  @Post('change-password')
  @ApiOperation({
    summary: 'Alterar senha',
    description: 'Permite que o usuário autenticado altere sua própria senha.',
  })
  @ApiResponse({
    status: 200,
    description: 'Senha alterada com sucesso',
  })
  @ApiResponse({
    status: 401,
    description: 'Senha atual incorreta',
  })
  @ApiResponse({
    status: 400,
    description: 'Nova senha e confirmação não conferem',
  })
  @ApiBody({ type: ChangePasswordDto })
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @Request() req: RequestWithUser,
  ): Promise<ApiResponse> {
    await this.usuariosService.changePassword(req.user.id, changePasswordDto);

    return {
      message: 'Senha alterada com sucesso',
    };
  }

  @Patch(':id/reset-password')
  @ApiOperation({
    summary: 'Resetar senha',
    description: 'Reseta a senha de um usuário (admin only).',
  })
  @ApiResponse({
    status: 200,
    description: 'Senha resetada com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado',
  })
  @ApiParam({ name: 'id', description: 'ID do usuário' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        novaSenha: {
          type: 'string',
          example: 'NovaSenha123!',
          description: 'Nova senha temporária',
        },
      },
      required: ['novaSenha'],
    },
  })
  async resetPassword(
    @Param('id') id: string,
    @Body('novaSenha') novaSenha: string,
    @Request() req: RequestWithUser,
  ): Promise<ApiResponse> {
    await this.usuariosService.resetPassword(id, novaSenha, req.user.id);

    return {
      message:
        'Senha resetada com sucesso. O usuário deverá alterar a senha no próximo login.',
    };
  }
}
