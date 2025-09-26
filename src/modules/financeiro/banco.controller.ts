import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { BancoService } from './banco.service';
import { CreateBancoDto } from './dto/create-banco.dto';
import { UpdateBancoDto } from './dto/update-banco.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Usuario } from '../usuarios/entities/usuario.entity';

@ApiTags('Bancos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('bancos')
export class BancoController {
  constructor(private readonly bancoService: BancoService) {}

  @Post()
  @ApiOperation({ summary: 'Criar um novo banco' })
  @ApiResponse({ status: 201, description: 'Banco criado com sucesso' })
  @ApiResponse({ status: 409, description: 'Banco já existe' })
  async create(
    @Body() createBancoDto: CreateBancoDto,
    @CurrentUser() user: Usuario,
  ) {
    return this.bancoService.create(createBancoDto, user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os bancos' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Página',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Limite por página',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Busca por nome, código ou código interno',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    type: String,
    description: 'Filtrar por status',
  })
  @ApiResponse({ status: 200, description: 'Lista de bancos' })
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('status') status?: string,
  ) {
    return this.bancoService.findAll(
      page ? +page : 1,
      limit ? +limit : 10,
      search,
      status,
    );
  }

  @Get('ativos')
  @ApiOperation({ summary: 'Listar bancos ativos' })
  @ApiResponse({ status: 200, description: 'Lista de bancos ativos' })
  async findAtivos() {
    return this.bancoService.findAtivos();
  }

  @Get('estatisticas')
  @ApiOperation({ summary: 'Obter estatísticas dos bancos' })
  @ApiResponse({ status: 200, description: 'Estatísticas dos bancos' })
  async getEstatisticas() {
    const [total, ativos] = await Promise.all([
      this.bancoService.count(),
      this.bancoService.countAtivos(),
    ]);

    return {
      total,
      ativos,
      inativos: total - ativos,
    };
  }

  @Get('codigo/:codigo')
  @ApiOperation({ summary: 'Buscar banco por código FEBRABAN' })
  @ApiResponse({ status: 200, description: 'Banco encontrado' })
  @ApiResponse({ status: 404, description: 'Banco não encontrado' })
  async findByCodigo(@Param('codigo') codigo: string) {
    return this.bancoService.findByCodigo(codigo);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar banco por ID' })
  @ApiResponse({ status: 200, description: 'Banco encontrado' })
  @ApiResponse({ status: 404, description: 'Banco não encontrado' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.bancoService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar banco' })
  @ApiResponse({ status: 200, description: 'Banco atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Banco não encontrado' })
  @ApiResponse({ status: 409, description: 'Código já existe em outro banco' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateBancoDto: UpdateBancoDto,
    @CurrentUser() user: Usuario,
  ) {
    return this.bancoService.update(id, updateBancoDto, user.id);
  }

  @Patch(':id/toggle-status')
  @ApiOperation({ summary: 'Alternar status do banco (ativo/inativo)' })
  @ApiResponse({ status: 200, description: 'Status alterado com sucesso' })
  @ApiResponse({ status: 404, description: 'Banco não encontrado' })
  async toggleStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: Usuario,
  ) {
    return this.bancoService.toggleStatus(id, user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Excluir banco' })
  @ApiResponse({ status: 204, description: 'Banco excluído com sucesso' })
  @ApiResponse({ status: 404, description: 'Banco não encontrado' })
  @ApiResponse({ status: 409, description: 'Banco possui contas vinculadas' })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: Usuario,
  ) {
    await this.bancoService.remove(id, user.id);
  }
}
