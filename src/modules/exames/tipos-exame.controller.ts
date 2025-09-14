import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { TiposExameService } from './tipos-exame.service';
import { CreateTipoExameDto } from './dto/create-tipo-exame.dto';
import { UpdateTipoExameDto } from './dto/update-tipo-exame.dto';
import { TipoExame } from './entities/tipo-exame.entity';

interface ApiResponseType<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

@ApiTags('Tipos de Exame')
@ApiBearerAuth()
@Controller('tipos-exame')
export class TiposExameController {
  constructor(private readonly tiposExameService: TiposExameService) {}

  @Post()
  @ApiOperation({ summary: 'Criar novo tipo de exame' })
  @ApiResponse({
    status: 201,
    description: 'Tipo de exame criado com sucesso',
    type: TipoExame,
  })
  @ApiResponse({
    status: 409,
    description: 'Tipo de exame com este código já existe',
  })
  async create(
    @Body() createTipoExameDto: CreateTipoExameDto,
  ): Promise<ApiResponseType<TipoExame>> {
    const data = await this.tiposExameService.create(createTipoExameDto);
    return {
      success: true,
      message: 'Tipo de exame criado com sucesso',
      data,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os tipos de exame' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Número da página',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Itens por página',
    example: 10,
  })
  @ApiQuery({
    name: 'status',
    required: false,
    type: String,
    enum: ['ativo', 'inativo'],
    description: 'Filtrar por status',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de tipos de exame retornada com sucesso',
  })
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: string,
  ): Promise<
    ApiResponseType<{
      data: TipoExame[];
      total: number;
      page: number;
      lastPage: number;
    }>
  > {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;
    const result = await this.tiposExameService.findAll(pageNum, limitNum, status);
    return {
      success: true,
      message: 'Tipos de exame listados com sucesso',
      data: result,
    };
  }

  @Get('ativos')
  @ApiOperation({ summary: 'Listar apenas tipos de exame ativos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de tipos de exame ativos',
    type: [TipoExame],
  })
  async findAtivos(): Promise<ApiResponseType<TipoExame[]>> {
    const data = await this.tiposExameService.findAtivos();
    return {
      success: true,
      message: 'Tipos de exame ativos listados com sucesso',
      data,
    };
  }

  @Get('com-agendamento')
  @ApiOperation({ summary: 'Listar tipos que requerem agendamento' })
  @ApiResponse({
    status: 200,
    description: 'Lista de tipos que requerem agendamento',
    type: [TipoExame],
  })
  async findComAgendamento(): Promise<ApiResponseType<TipoExame[]>> {
    const data = await this.tiposExameService.findComAgendamento();
    return {
      success: true,
      message: 'Tipos com agendamento listados com sucesso',
      data,
    };
  }

  @Get('com-autorizacao')
  @ApiOperation({ summary: 'Listar tipos que requerem autorização' })
  @ApiResponse({
    status: 200,
    description: 'Lista de tipos que requerem autorização',
    type: [TipoExame],
  })
  async findComAutorizacao(): Promise<ApiResponseType<TipoExame[]>> {
    const data = await this.tiposExameService.findComAutorizacao();
    return {
      success: true,
      message: 'Tipos com autorização listados com sucesso',
      data,
    };
  }

  @Get('domiciliares')
  @ApiOperation({ summary: 'Listar tipos que permitem coleta domiciliar' })
  @ApiResponse({
    status: 200,
    description: 'Lista de tipos que permitem coleta domiciliar',
    type: [TipoExame],
  })
  async findDomiciliares(): Promise<ApiResponseType<TipoExame[]>> {
    const data = await this.tiposExameService.findDomiciliares();
    return {
      success: true,
      message: 'Tipos domiciliares listados com sucesso',
      data,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar tipo de exame por ID' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID do tipo de exame',
  })
  @ApiResponse({
    status: 200,
    description: 'Tipo de exame encontrado',
    type: TipoExame,
  })
  @ApiResponse({
    status: 404,
    description: 'Tipo de exame não encontrado',
  })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponseType<TipoExame>> {
    const data = await this.tiposExameService.findOne(id);
    return {
      success: true,
      message: 'Tipo de exame encontrado',
      data,
    };
  }

  @Get('codigo/:codigo')
  @ApiOperation({ summary: 'Buscar tipo de exame por código' })
  @ApiParam({
    name: 'codigo',
    type: String,
    description: 'Código do tipo de exame',
  })
  @ApiResponse({
    status: 200,
    description: 'Tipo de exame encontrado',
    type: TipoExame,
  })
  @ApiResponse({
    status: 404,
    description: 'Tipo de exame não encontrado',
  })
  async findByCodigo(
    @Param('codigo') codigo: string,
  ): Promise<ApiResponseType<TipoExame>> {
    const data = await this.tiposExameService.findByCodigo(codigo);
    return {
      success: true,
      message: 'Tipo de exame encontrado',
      data,
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar tipo de exame' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID do tipo de exame',
  })
  @ApiResponse({
    status: 200,
    description: 'Tipo de exame atualizado com sucesso',
    type: TipoExame,
  })
  @ApiResponse({
    status: 404,
    description: 'Tipo de exame não encontrado',
  })
  @ApiResponse({
    status: 409,
    description: 'Código já existe em outro tipo',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTipoExameDto: UpdateTipoExameDto,
  ): Promise<ApiResponseType<TipoExame>> {
    const data = await this.tiposExameService.update(id, updateTipoExameDto);
    return {
      success: true,
      message: 'Tipo de exame atualizado com sucesso',
      data,
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Desativar tipo de exame' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID do tipo de exame',
  })
  @ApiResponse({
    status: 200,
    description: 'Tipo de exame desativado com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Tipo de exame não encontrado',
  })
  @ApiResponse({
    status: 409,
    description: 'Não é possível excluir tipo com exames vinculados',
  })
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponseType<void>> {
    await this.tiposExameService.remove(id);
    return {
      success: true,
      message: 'Tipo de exame desativado com sucesso',
    };
  }
}