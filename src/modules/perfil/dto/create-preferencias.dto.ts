import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

/**
 * DTO para criar preferências iniciais de um usuário
 * Geralmente criado automaticamente ao criar novo usuário
 */
export class CreatePreferenciasDto {
  @ApiProperty({
    description: 'ID do usuário',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  usuarioId: string;

  @ApiProperty({
    description: 'Receber notificações por email',
    example: true,
    default: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  notificarEmail?: boolean;

  @ApiProperty({
    description: 'Receber notificações por WhatsApp',
    example: false,
    default: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  notificarWhatsapp?: boolean;

  @ApiProperty({
    description: 'Receber notificações por SMS',
    example: false,
    default: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  notificarSms?: boolean;

  @ApiProperty({
    description: 'Receber notificações no sistema',
    example: true,
    default: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  notificarSistema?: boolean;

  @ApiProperty({
    description: 'Tema da interface',
    example: 'claro',
    default: 'claro',
    required: false,
  })
  @IsOptional()
  @IsString()
  tema?: string;

  @ApiProperty({
    description: 'Idioma',
    example: 'pt-BR',
    default: 'pt-BR',
    required: false,
  })
  @IsOptional()
  @IsString()
  idioma?: string;

  @ApiProperty({
    description: 'Timezone',
    example: 'America/Sao_Paulo',
    default: 'America/Sao_Paulo',
    required: false,
  })
  @IsOptional()
  @IsString()
  timezone?: string;

  @ApiProperty({
    description: 'Tempo de inatividade em minutos',
    example: 30,
    default: 30,
    required: false,
  })
  @IsOptional()
  @IsInt()
  tempoInatividade?: number;
}
