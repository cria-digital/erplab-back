import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
  ParseIntPipe,
  ParseEnumPipe,
  ParseBoolPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiParam } from '@nestjs/swagger';
import { AmostrasService } from '../services/amostras.service';
import { CreateAmostraDto } from '../dto/create-amostra.dto';
import { UpdateAmostraDto } from '../dto/update-amostra.dto';
import { TipoAmostra } from '../entities/amostra.entity';

@ApiTags('Amostras')
@Controller('exames/amostras')
export class AmostrasController {
  constructor(private readonly amostrasService: AmostrasService) {}

  @Post()
  @ApiOperation({ summary: 'Criar nova amostra' })
  create(@Body() createAmostraDto: CreateAmostraDto) {
    // TODO: Pegar usuarioId do token JWT
    const usuarioId = '00000000-0000-0000-0000-000000000000';
    return this.amostrasService.create(createAmostraDto, usuarioId);
  }

  @Get()
  @ApiOperation({ summary: 'Listar amostras com paginação e filtros' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({ name: 'search', required: false, description: 'Buscar por nome' })
  @ApiQuery({
    name: 'tipoAmostra',
    required: false,
    enum: TipoAmostra,
    description: 'Filtrar por tipo de amostra',
  })
  @ApiQuery({ name: 'ativo', required: false, type: Boolean })
  findAll(
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('search') search?: string,
    @Query('tipoAmostra', new ParseEnumPipe(TipoAmostra, { optional: true }))
    tipoAmostra?: TipoAmostra,
    @Query('ativo', new ParseBoolPipe({ optional: true })) ativo?: boolean,
  ) {
    return this.amostrasService.findAll(
      page,
      limit,
      search,
      tipoAmostra,
      ativo,
    );
  }

  @Get('ativas')
  @ApiOperation({ summary: 'Listar apenas amostras ativas' })
  findAtivas() {
    return this.amostrasService.findAtivas();
  }

  @Get('stats')
  @ApiOperation({ summary: 'Estatísticas de amostras' })
  getStats() {
    return this.amostrasService.getStats();
  }

  @Get('tipo/:tipo')
  @ApiOperation({ summary: 'Buscar amostras por tipo' })
  @ApiParam({ name: 'tipo', enum: TipoAmostra })
  findByTipo(@Param('tipo', new ParseEnumPipe(TipoAmostra)) tipo: TipoAmostra) {
    return this.amostrasService.findByTipo(tipo);
  }

  @Get('codigo/:codigo')
  @ApiOperation({ summary: 'Buscar amostra por código interno' })
  findByCodigo(@Param('codigo') codigo: string) {
    return this.amostrasService.findByCodigo(codigo);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar amostra por ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.amostrasService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar amostra' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAmostraDto: UpdateAmostraDto,
  ) {
    // TODO: Pegar usuarioId do token JWT
    const usuarioId = '00000000-0000-0000-0000-000000000000';
    return this.amostrasService.update(id, updateAmostraDto, usuarioId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover amostra (soft delete)' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    // TODO: Pegar usuarioId do token JWT
    const usuarioId = '00000000-0000-0000-0000-000000000000';
    return this.amostrasService.remove(id, usuarioId);
  }

  @Patch(':id/ativar')
  @ApiOperation({ summary: 'Ativar amostra' })
  activate(@Param('id', ParseUUIDPipe) id: string) {
    // TODO: Pegar usuarioId do token JWT
    const usuarioId = '00000000-0000-0000-0000-000000000000';
    return this.amostrasService.activate(id, usuarioId);
  }

  @Patch(':id/desativar')
  @ApiOperation({ summary: 'Desativar amostra' })
  deactivate(@Param('id', ParseUUIDPipe) id: string) {
    // TODO: Pegar usuarioId do token JWT
    const usuarioId = '00000000-0000-0000-0000-000000000000';
    return this.amostrasService.deactivate(id, usuarioId);
  }
}
