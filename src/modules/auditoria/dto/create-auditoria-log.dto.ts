import {
  IsString,
  IsEnum,
  IsOptional,
  IsUUID,
  IsObject,
  IsIP,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  TipoLog,
  NivelLog,
  OperacaoLog,
} from '../entities/auditoria-log.entity';

export class CreateAuditoriaLogDto {
  @ApiProperty({
    description: 'Tipo do log',
    enum: TipoLog,
    example: TipoLog.ACESSO,
  })
  @IsNotEmpty({ message: 'Tipo do log é obrigatório' })
  @IsEnum(TipoLog, {
    message: 'Tipo do log deve ser: ACESSO, ALTERACAO, ERRO ou ACAO',
  })
  tipoLog: TipoLog;

  @ApiProperty({
    description: 'ID do usuário que realizou a ação',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty({ message: 'ID do usuário é obrigatório' })
  @IsUUID('4', { message: 'ID do usuário deve ser um UUID válido' })
  usuarioId: string;

  @ApiPropertyOptional({
    description: 'Endereço IP do usuário',
    example: '192.168.1.1',
  })
  @IsOptional()
  @IsIP('4', { message: 'Endereço IP deve ser válido (IPv4)' })
  ipAddress?: string;

  @ApiPropertyOptional({
    description: 'User Agent do navegador/cliente',
    example: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  })
  @IsOptional()
  @IsString()
  userAgent?: string;

  @ApiPropertyOptional({
    description: 'ID da unidade de saúde',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsUUID('4', { message: 'ID da unidade deve ser um UUID válido' })
  unidadeSaudeId?: string;

  @ApiPropertyOptional({
    description: 'Módulo do sistema',
    example: 'Pacientes',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  modulo?: string;

  @ApiPropertyOptional({
    description: 'Ação realizada (para logs de acesso)',
    example: 'Visualizar Lista',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  acao?: string;

  @ApiPropertyOptional({
    description: 'Nome da entidade afetada (para logs de alteração)',
    example: 'pacientes',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  entidade?: string;

  @ApiPropertyOptional({
    description: 'ID da entidade afetada',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsUUID('4', { message: 'ID da entidade deve ser um UUID válido' })
  entidadeId?: string;

  @ApiPropertyOptional({
    description: 'Tipo de operação realizada',
    enum: OperacaoLog,
    example: OperacaoLog.UPDATE,
  })
  @IsOptional()
  @IsEnum(OperacaoLog, {
    message:
      'Operação deve ser: INSERT, UPDATE, DELETE, LOGIN, LOGOUT ou LOGIN_FALHA',
  })
  operacao?: OperacaoLog;

  @ApiPropertyOptional({
    description:
      'ID do usuário que foi alterado (para logs de alteração em usuários)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsUUID('4', { message: 'ID do usuário alterado deve ser um UUID válido' })
  usuarioAlterouId?: string;

  @ApiPropertyOptional({
    description: 'Dados da alteração em formato JSON',
    example: {
      antes: { nome: 'João' },
      depois: { nome: 'João Silva' },
    },
  })
  @IsOptional()
  @IsObject({ message: 'Dados da alteração devem ser um objeto' })
  dadosAlteracao?: any;

  @ApiPropertyOptional({
    description: 'Detalhes adicionais sobre o log',
    example: 'Alteração realizada via importação em lote',
  })
  @IsOptional()
  @IsString()
  detalhes?: string;

  @ApiPropertyOptional({
    description: 'Nível de severidade do log',
    enum: NivelLog,
    example: NivelLog.INFO,
    default: NivelLog.INFO,
  })
  @IsOptional()
  @IsEnum(NivelLog, {
    message: 'Nível deve ser: INFO, WARNING, ERROR ou CRITICAL',
  })
  nivel?: NivelLog = NivelLog.INFO;
}
