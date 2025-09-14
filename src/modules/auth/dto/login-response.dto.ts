import { ApiProperty } from '@nestjs/swagger';

class UserResponseDto {
  @ApiProperty({
    description: 'ID único do usuário',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Nome completo do usuário',
    example: 'João Silva',
  })
  nome: string;

  @ApiProperty({
    description: 'Email do usuário',
    example: 'joao.silva@exemplo.com',
  })
  email: string;

  @ApiProperty({
    description: 'Lista de permissões do usuário',
    example: ['VIEW_PATIENTS', 'EDIT_EXAMS'],
    required: false,
  })
  permissoes?: string[];

  @ApiProperty({
    description: 'URL da foto do perfil',
    example: 'https://exemplo.com/foto.jpg',
    required: false,
  })
  foto_url?: string;
}

export class LoginResponseDto {
  @ApiProperty({
    description: 'Token JWT de acesso',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ',
  })
  access_token: string;

  @ApiProperty({
    description: 'Token de renovação',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ',
  })
  refresh_token: string;

  @ApiProperty({
    description: 'Tipo do token',
    example: 'Bearer',
    default: 'Bearer',
  })
  token_type: string;

  @ApiProperty({
    description: 'Tempo de expiração do token',
    example: '24h',
  })
  expires_in: string;

  @ApiProperty({
    description: 'Dados do usuário autenticado',
    type: UserResponseDto,
  })
  user: UserResponseDto;
}

export class RefreshResponseDto {
  @ApiProperty({
    description: 'Novo token JWT de acesso',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ',
  })
  access_token: string;

  @ApiProperty({
    description: 'Tipo do token',
    example: 'Bearer',
    default: 'Bearer',
  })
  token_type: string;

  @ApiProperty({
    description: 'Tempo de expiração do token',
    example: '24h',
  })
  expires_in: string;
}

export class MessageResponseDto {
  @ApiProperty({
    description: 'Mensagem de resposta',
    example: 'Operação realizada com sucesso',
  })
  message: string;
}

export class ValidateTokenResponseDto {
  @ApiProperty({
    description: 'Indica se o token é válido',
    example: true,
  })
  valid: boolean;
}
