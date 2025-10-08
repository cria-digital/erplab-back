import { ApiProperty } from '@nestjs/swagger';

export class EnderecoResponseDto {
  @ApiProperty({ example: '01310100', description: 'CEP sem formatação' })
  cep: string;

  @ApiProperty({ example: 'Avenida Paulista', description: 'Logradouro/Rua' })
  rua: string;

  @ApiProperty({
    example: 'Avenida Paulista',
    description: 'Logradouro original da API',
  })
  logradouro: string;

  @ApiProperty({
    example: 'de 612 a 1510 - lado par',
    description: 'Complemento do logradouro',
  })
  complemento: string;

  @ApiProperty({ example: 'Bela Vista', description: 'Bairro' })
  bairro: string;

  @ApiProperty({ example: 'São Paulo', description: 'Cidade' })
  cidade: string;

  @ApiProperty({ example: 'SP', description: 'Estado (sigla UF)' })
  estado: string;

  @ApiProperty({ example: '3550308', description: 'Código IBGE do município' })
  ibge: string;

  @ApiProperty({ example: '1004', description: 'Código GIA' })
  gia: string;

  @ApiProperty({ example: '11', description: 'DDD da região' })
  ddd: string;

  @ApiProperty({ example: '7107', description: 'Código SIAFI' })
  siafi: string;
}
