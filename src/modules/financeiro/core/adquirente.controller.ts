import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../autenticacao/auth/guards/jwt-auth.guard';
import { AdquirenteService } from './adquirente.service';
import { CreateAdquirenteDto } from './dto/create-adquirente.dto';
import { UpdateAdquirenteDto } from './dto/update-adquirente.dto';
import {
  StatusAdquirente,
  TipoCartao,
  TipoAdquirente,
} from './entities/adquirente.entity';

@ApiTags('Adquirentes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('financeiro/adquirentes')
export class AdquirenteController {
  constructor(private readonly service: AdquirenteService) {}

  @Post()
  @ApiOperation({ summary: 'Criar novo adquirente' })
  @ApiResponse({
    status: 201,
    description: 'Adquirente criado com sucesso',
  })
  @ApiResponse({
    status: 409,
    description: 'Já existe adquirente com o mesmo código interno',
  })
  create(@Body() createDto: CreateAdquirenteDto) {
    return this.service.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os adquirentes' })
  @ApiResponse({
    status: 200,
    description: 'Lista de adquirentes retornada com sucesso',
  })
  findAll() {
    return this.service.findAll();
  }

  @Get('status/:status')
  @ApiOperation({ summary: 'Buscar adquirentes por status' })
  @ApiParam({
    name: 'status',
    description: 'Status do adquirente',
    enum: StatusAdquirente,
  })
  @ApiResponse({
    status: 200,
    description: 'Adquirentes encontrados com sucesso',
  })
  findByStatus(@Param('status') status: StatusAdquirente) {
    return this.service.findByStatus(status);
  }

  @Get('tipo-cartao/:tipo')
  @ApiOperation({ summary: 'Buscar adquirentes por tipo de cartão suportado' })
  @ApiParam({
    name: 'tipo',
    description: 'Tipo de cartão',
    enum: TipoCartao,
  })
  @ApiResponse({
    status: 200,
    description: 'Adquirentes encontrados com sucesso',
  })
  findByTipoCartao(@Param('tipo') tipo: TipoCartao) {
    return this.service.findByTipoCartao(tipo);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar adquirente por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID do adquirente',
  })
  @ApiResponse({
    status: 200,
    description: 'Adquirente encontrado com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Adquirente não encontrado',
  })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar adquirente' })
  @ApiParam({
    name: 'id',
    description: 'ID do adquirente',
  })
  @ApiResponse({
    status: 200,
    description: 'Adquirente atualizado com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Adquirente não encontrado',
  })
  update(@Param('id') id: string, @Body() updateDto: UpdateAdquirenteDto) {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Deletar adquirente' })
  @ApiParam({
    name: 'id',
    description: 'ID do adquirente',
  })
  @ApiResponse({
    status: 204,
    description: 'Adquirente deletado com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Adquirente não encontrado',
  })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }

  @Patch(':id/toggle-status')
  @ApiOperation({ summary: 'Alternar status do adquirente (ativo/inativo)' })
  @ApiParam({
    name: 'id',
    description: 'ID do adquirente',
  })
  @ApiResponse({
    status: 200,
    description: 'Status alterado com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Adquirente não encontrado',
  })
  toggleStatus(@Param('id') id: string) {
    return this.service.toggleStatus(id);
  }

  @Get('tipo/:tipo')
  @ApiOperation({ summary: 'Buscar adquirentes por tipo' })
  @ApiParam({
    name: 'tipo',
    description: 'Tipo do adquirente',
    enum: TipoAdquirente,
  })
  @ApiResponse({
    status: 200,
    description: 'Adquirentes encontrados com sucesso',
  })
  findByTipo(@Param('tipo') tipo: TipoAdquirente) {
    return this.service.findByTipo(tipo);
  }

  @Patch(':id/taxas')
  @ApiOperation({ summary: 'Atualizar taxas do adquirente' })
  @ApiParam({
    name: 'id',
    description: 'ID do adquirente',
  })
  @ApiResponse({
    status: 200,
    description: 'Taxas atualizadas com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Adquirente não encontrado',
  })
  updateTaxas(
    @Param('id') id: string,
    @Body()
    taxas: {
      taxa_antecipacao?: number;
      taxa_parcelamento?: number;
      taxa_transacao?: number;
      percentual_repasse?: number;
    },
  ) {
    return this.service.updateTaxas(id, taxas);
  }

  @Get(':id/validate-configuration')
  @ApiOperation({ summary: 'Validar configuração de integração do adquirente' })
  @ApiParam({
    name: 'id',
    description: 'ID do adquirente',
  })
  @ApiResponse({
    status: 200,
    description: 'Validação realizada',
  })
  validateConfiguration(@Param('id') id: string) {
    return this.service.validateConfiguration(id);
  }
}
