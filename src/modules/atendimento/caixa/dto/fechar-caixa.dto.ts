import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';

export class FecharCaixaDto {
  // === DINHEIRO EM ESPÉCIE ===

  @ApiProperty({
    description: 'Total de entradas em espécie',
    example: 1500.0,
  })
  @IsNotEmpty({ message: 'Total de entradas em espécie é obrigatório' })
  @IsNumber({}, { message: 'Valor deve ser um número' })
  @Min(0, { message: 'Valor não pode ser negativo' })
  totalEntradasEspecie: number;

  @ApiProperty({
    description: 'Total de saídas em espécie (despesas)',
    example: 200.0,
  })
  @IsNotEmpty({ message: 'Total de saídas em espécie é obrigatório' })
  @IsNumber({}, { message: 'Valor deve ser um número' })
  @Min(0, { message: 'Valor não pode ser negativo' })
  totalSaidasEspecie: number;

  @ApiProperty({
    description: 'Valor da sangria (retirada de dinheiro)',
    example: 500.0,
  })
  @IsNotEmpty({ message: 'Valor da sangria é obrigatório' })
  @IsNumber({}, { message: 'Valor deve ser um número' })
  @Min(0, { message: 'Valor não pode ser negativo' })
  sangriaEspecie: number;

  @ApiProperty({
    description: 'Saldo para o próximo dia',
    example: 800.0,
  })
  @IsNotEmpty({ message: 'Saldo para próximo dia é obrigatório' })
  @IsNumber({}, { message: 'Valor deve ser um número' })
  @Min(0, { message: 'Valor não pode ser negativo' })
  saldoProximoDia: number;

  // === SALDO GERAL (outros meios de pagamento) ===

  @ApiPropertyOptional({
    description: 'Total de entradas em cartão de crédito',
    example: 3000.0,
    default: 0,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Valor deve ser um número' })
  @Min(0, { message: 'Valor não pode ser negativo' })
  totalEntradasCredito?: number;

  @ApiPropertyOptional({
    description: 'Total de entradas em cartão de débito',
    example: 2000.0,
    default: 0,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Valor deve ser um número' })
  @Min(0, { message: 'Valor não pode ser negativo' })
  totalEntradasDebito?: number;

  @ApiPropertyOptional({
    description: 'Total de entradas em PIX',
    example: 1500.0,
    default: 0,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Valor deve ser um número' })
  @Min(0, { message: 'Valor não pode ser negativo' })
  totalEntradasPix?: number;

  @ApiProperty({
    description: 'Saldo final do caixa (calculado automaticamente)',
    example: 7800.0,
  })
  @IsNotEmpty({ message: 'Saldo final é obrigatório' })
  @IsNumber({}, { message: 'Valor deve ser um número' })
  saldoFinal: number;
}
