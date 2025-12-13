import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsInt,
  IsBoolean,
  IsDateString,
  IsObject,
  MinLength,
  MaxLength,
  Min,
  Matches,
} from 'class-validator';
import { PlanoTenant } from '../entities/tenant.entity';

export class CreateTenantDto {
  @ApiProperty({
    description: 'Nome do tenant',
    example: 'Laboratório São Lucas',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  nome: string;

  @ApiProperty({
    description: 'Slug único do tenant (usado em URLs)',
    example: 'laboratorio-sao-lucas',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'Slug deve conter apenas letras minúsculas, números e hífens',
  })
  slug: string;

  @ApiPropertyOptional({
    description: 'CNPJ do tenant (apenas números)',
    example: '12345678000190',
  })
  @IsOptional()
  @IsString()
  @Matches(/^\d{14}$/, {
    message: 'CNPJ deve conter exatamente 14 dígitos numéricos',
  })
  cnpj?: string;

  @ApiPropertyOptional({
    description: 'Plano do tenant',
    enum: PlanoTenant,
    default: PlanoTenant.TRIAL,
  })
  @IsOptional()
  @IsEnum(PlanoTenant)
  plano?: PlanoTenant;

  @ApiPropertyOptional({
    description: 'Limite de usuários',
    default: 5,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  limiteUsuarios?: number;

  @ApiPropertyOptional({
    description: 'Limite de unidades de saúde',
    default: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  limiteUnidades?: number;

  @ApiPropertyOptional({
    description: 'Data de expiração (para trials)',
    example: '2025-12-31',
  })
  @IsOptional()
  @IsDateString()
  dataExpiracao?: string;

  @ApiPropertyOptional({
    description: 'Configurações adicionais do tenant',
  })
  @IsOptional()
  @IsObject()
  configuracoes?: Record<string, any>;

  @ApiPropertyOptional({
    description: 'Status ativo',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  ativo?: boolean;
}
