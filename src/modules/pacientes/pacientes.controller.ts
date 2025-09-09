import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Request,
  ParseIntPipe,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';

import { PacientesService, PacientesFilters } from './pacientes.service';
import { CreatePacienteDto, UpdatePacienteDto } from './dto';
import { Paciente } from './entities/paciente.entity';

// Interfaces para documentação da API
interface ApiResponse<T = any> {
  message: string;
  data?: T;
}

interface RequestWithUser {
  user: {
    id: number;
    empresa_id: number;
  };
}

@ApiTags('Pacientes')
@ApiBearerAuth()
@Controller('pacientes')
export class PacientesController {
  constructor(private readonly pacientesService: PacientesService) {}

  @Post()
  @ApiOperation({
    summary: 'Criar um novo paciente',
    description:
      'Cria um novo paciente no sistema. O código interno será gerado automaticamente se não fornecido.',
  })
  @ApiResponse({
    status: 201,
    description: 'Paciente criado com sucesso',
    type: Paciente,
  })
  @ApiResponse({
    status: 409,
    description: 'CPF já cadastrado na empresa',
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos',
  })
  @ApiBody({ type: CreatePacienteDto })
  async create(
    @Body() createPacienteDto: CreatePacienteDto,
    @Request() req: RequestWithUser,
  ): Promise<ApiResponse<Paciente>> {
    const paciente = await this.pacientesService.create(
      createPacienteDto,
      req.user.id,
    );

    return {
      message: 'Paciente criado com sucesso',
      data: paciente,
    };
  }

  @Get()
  @ApiOperation({
    summary: 'Listar pacientes',
    description:
      'Lista todos os pacientes da empresa com filtros opcionais e paginação.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de pacientes retornada com sucesso',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/Paciente' },
        },
        total: { type: 'number', example: 100 },
        page: { type: 'number', example: 1 },
        limit: { type: 'number', example: 10 },
        totalPages: { type: 'number', example: 10 },
      },
    },
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Número da página',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Itens por página',
  })
  @ApiQuery({
    name: 'nome',
    required: false,
    type: String,
    description: 'Filtrar por nome',
  })
  @ApiQuery({
    name: 'cpf',
    required: false,
    type: String,
    description: 'Filtrar por CPF',
  })
  @ApiQuery({
    name: 'email',
    required: false,
    type: String,
    description: 'Filtrar por email',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['ativo', 'inativo', 'bloqueado'],
    description: 'Filtrar por status',
  })
  async findAll(
    @Request() req: RequestWithUser,
    @Query() filters: PacientesFilters,
  ) {
    return this.pacientesService.findAll(req.user.empresa_id, filters);
  }

  @Get('search')
  @ApiOperation({
    summary: 'Buscar pacientes por nome',
    description: 'Busca pacientes por nome parcial para autocomplete.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de pacientes encontrados',
    type: [Paciente],
  })
  @ApiQuery({
    name: 'nome',
    required: true,
    type: String,
    description: 'Nome para busca',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Limite de resultados (padrão: 10)',
  })
  async search(
    @Query('nome') nome: string,
    @Request() req: RequestWithUser,
    @Query() query: { limit?: number },
  ): Promise<Paciente[]> {
    const limit = query.limit || 10;
    return this.pacientesService.searchByName(nome, req.user.empresa_id, limit);
  }

  @Get('stats')
  @ApiOperation({
    summary: 'Estatísticas dos pacientes',
    description: 'Retorna estatísticas dos pacientes por empresa.',
  })
  @ApiResponse({
    status: 200,
    description: 'Estatísticas retornadas com sucesso',
    schema: {
      type: 'object',
      properties: {
        total: { type: 'number' },
        status: {
          type: 'object',
          properties: {
            ativo: { type: 'number' },
            inativo: { type: 'number' },
            bloqueado: { type: 'number' },
          },
        },
        convenio: {
          type: 'object',
          properties: {
            com_convenio: { type: 'number' },
            sem_convenio: { type: 'number' },
          },
        },
      },
    },
  })
  async getStats(@Request() req: RequestWithUser) {
    return this.pacientesService.getStats(req.user.empresa_id);
  }

  @Get('cpf/:cpf')
  @ApiOperation({
    summary: 'Buscar paciente por CPF',
    description: 'Busca um paciente específico pelo CPF.',
  })
  @ApiResponse({
    status: 200,
    description: 'Paciente encontrado',
    type: Paciente,
  })
  @ApiResponse({
    status: 404,
    description: 'Paciente não encontrado',
  })
  @ApiParam({
    name: 'cpf',
    description: 'CPF do paciente (apenas números)',
    example: '12345678901',
  })
  async findByCpf(
    @Param('cpf') cpf: string,
    @Request() req: RequestWithUser,
  ): Promise<Paciente | null> {
    return this.pacientesService.findByCpf(cpf, req.user.empresa_id);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Buscar paciente por ID',
    description: 'Busca um paciente específico pelo ID.',
  })
  @ApiResponse({
    status: 200,
    description: 'Paciente encontrado',
    type: Paciente,
  })
  @ApiResponse({
    status: 404,
    description: 'Paciente não encontrado',
  })
  @ApiParam({ name: 'id', description: 'ID do paciente' })
  async findOne(
    @Param('id') id: string,
    @Request() req: RequestWithUser,
  ): Promise<Paciente> {
    return this.pacientesService.findOne(+id, req.user.empresa_id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Atualizar paciente',
    description: 'Atualiza os dados de um paciente existente.',
  })
  @ApiResponse({
    status: 200,
    description: 'Paciente atualizado com sucesso',
    type: Paciente,
  })
  @ApiResponse({
    status: 404,
    description: 'Paciente não encontrado',
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos',
  })
  @ApiParam({ name: 'id', description: 'ID do paciente' })
  @ApiBody({ type: UpdatePacienteDto })
  async update(
    @Param('id') id: string,
    @Body() updatePacienteDto: UpdatePacienteDto,
    @Request() req: RequestWithUser,
  ): Promise<ApiResponse<Paciente>> {
    const paciente = await this.pacientesService.update(
      +id,
      req.user.empresa_id,
      updatePacienteDto,
      req.user.id,
    );

    return {
      message: 'Paciente atualizado com sucesso',
      data: paciente,
    };
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Remover paciente',
    description: 'Remove um paciente (soft delete - torna inativo).',
  })
  @ApiResponse({
    status: 200,
    description: 'Paciente removido com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Paciente não encontrado',
  })
  @ApiParam({ name: 'id', description: 'ID do paciente' })
  async remove(
    @Param('id') id: string,
    @Request() req: RequestWithUser,
  ): Promise<ApiResponse> {
    await this.pacientesService.remove(+id, req.user.empresa_id, req.user.id);

    return {
      message: 'Paciente removido com sucesso',
    };
  }

  @Patch(':id/activate')
  @ApiOperation({
    summary: 'Ativar paciente',
    description: 'Ativa um paciente inativo.',
  })
  @ApiResponse({
    status: 200,
    description: 'Paciente ativado com sucesso',
    type: Paciente,
  })
  @ApiResponse({
    status: 404,
    description: 'Paciente não encontrado',
  })
  @ApiParam({ name: 'id', description: 'ID do paciente' })
  async activate(
    @Param('id') id: string,
    @Request() req: RequestWithUser,
  ): Promise<ApiResponse<Paciente>> {
    const paciente = await this.pacientesService.activate(
      +id,
      req.user.empresa_id,
      req.user.id,
    );

    return {
      message: 'Paciente ativado com sucesso',
      data: paciente,
    };
  }

  @Patch(':id/block')
  @ApiOperation({
    summary: 'Bloquear paciente',
    description: 'Bloqueia um paciente ativo.',
  })
  @ApiResponse({
    status: 200,
    description: 'Paciente bloqueado com sucesso',
    type: Paciente,
  })
  @ApiResponse({
    status: 404,
    description: 'Paciente não encontrado',
  })
  @ApiParam({ name: 'id', description: 'ID do paciente' })
  async block(
    @Param('id') id: string,
    @Request() req: RequestWithUser,
  ): Promise<ApiResponse<Paciente>> {
    const paciente = await this.pacientesService.block(
      +id,
      req.user.empresa_id,
      req.user.id,
    );

    return {
      message: 'Paciente bloqueado com sucesso',
      data: paciente,
    };
  }
}
