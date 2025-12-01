import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { TipoCabecalhoRodape } from '../entities/cabecalho-rodape.entity';

export class CreateCabecalhoRodapeDto {
  @ApiProperty({
    description: 'ID da unidade de saúde',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty({ message: 'Unidade é obrigatória' })
  @IsUUID('4', { message: 'ID da unidade deve ser um UUID válido' })
  unidadeId: string;

  @ApiProperty({
    description: 'Tipo: CABECALHO ou RODAPE',
    enum: TipoCabecalhoRodape,
    example: TipoCabecalhoRodape.CABECALHO,
  })
  @IsNotEmpty({ message: 'Tipo é obrigatório' })
  @IsEnum(TipoCabecalhoRodape, {
    message: 'Tipo deve ser CABECALHO ou RODAPE',
  })
  tipo: TipoCabecalhoRodape;
}
