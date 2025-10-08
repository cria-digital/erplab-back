import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Min,
  Max,
  IsIn,
} from 'class-validator';

/**
 * DTO para atualizar preferências do usuário
 */
export class UpdatePreferenciasDto {
  // Notificações
  @ApiProperty({
    description: 'Receber notificações por email',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  notificarEmail?: boolean;

  @ApiProperty({
    description: 'Receber notificações por WhatsApp',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  notificarWhatsapp?: boolean;

  @ApiProperty({
    description: 'Receber notificações por SMS',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  notificarSms?: boolean;

  @ApiProperty({
    description: 'Receber notificações no sistema',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  notificarSistema?: boolean;

  // Interface
  @ApiProperty({
    description: 'Tema da interface',
    example: 'claro',
    enum: ['claro', 'escuro', 'auto'],
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsIn(['claro', 'escuro', 'auto'])
  tema?: string;

  @ApiProperty({
    description: 'Idioma do sistema',
    example: 'pt-BR',
    required: false,
  })
  @IsOptional()
  @IsString()
  idioma?: string;

  @ApiProperty({
    description: 'Timezone',
    example: 'America/Sao_Paulo',
    required: false,
  })
  @IsOptional()
  @IsString()
  timezone?: string;

  // Privacidade
  @ApiProperty({
    description: 'Perfil público',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  perfilPublico?: boolean;

  @ApiProperty({
    description: 'Mostrar email publicamente',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  mostrarEmail?: boolean;

  @ApiProperty({
    description: 'Mostrar telefone publicamente',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  mostrarTelefone?: boolean;

  // Sessão
  @ApiProperty({
    description: 'Permitir login em múltiplos dispositivos',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  sessaoMultipla?: boolean;

  @ApiProperty({
    description: 'Tempo de inatividade em minutos até logout automático',
    example: 30,
    minimum: 5,
    maximum: 1440,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(5)
  @Max(1440)
  tempoInatividade?: number;

  // Outros
  @ApiProperty({
    description: 'Configurações adicionais em formato JSON',
    example: { preferencia1: 'valor1' },
    required: false,
  })
  @IsOptional()
  configuracoesAdicionais?: Record<string, any>;
}
