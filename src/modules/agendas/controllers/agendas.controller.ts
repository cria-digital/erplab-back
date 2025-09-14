import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { AgendasService } from '../services/agendas.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateAgendaDto } from '../dto/create-agenda.dto';
import { UpdateAgendaDto } from '../dto/update-agenda.dto';
import { CreateBloqueioDto } from '../dto/create-bloqueio.dto';
import { Agenda } from '../entities/agenda.entity';
import { BloqueioHorario } from '../entities/bloqueio-horario.entity';

@ApiTags('Agendas')
@ApiBearerAuth()
@Controller('agendas')
@UseGuards(JwtAuthGuard)
export class AgendasController {
  constructor(private readonly agendasService: AgendasService) {}

  @Post()
  @ApiOperation({ summary: 'Criar nova agenda' })
  @ApiBody({ type: CreateAgendaDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Agenda criada com sucesso',
    type: Agenda,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Dados inválidos',
  })
  create(@Body() createAgendaDto: CreateAgendaDto) {
    return this.agendasService.create(createAgendaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as agendas' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de agendas retornada com sucesso',
    type: [Agenda],
  })
  findAll() {
    return this.agendasService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar agenda por ID' })
  @ApiParam({ name: 'id', description: 'ID da agenda' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Agenda encontrada',
    type: Agenda,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Agenda não encontrada',
  })
  findOne(@Param('id') id: string) {
    return this.agendasService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar agenda' })
  @ApiParam({ name: 'id', description: 'ID da agenda' })
  @ApiBody({ type: UpdateAgendaDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Agenda atualizada com sucesso',
    type: Agenda,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Agenda não encontrada',
  })
  update(@Param('id') id: string, @Body() updateAgendaDto: UpdateAgendaDto) {
    return this.agendasService.update(id, updateAgendaDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover agenda' })
  @ApiParam({ name: 'id', description: 'ID da agenda' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Agenda removida com sucesso',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Agenda não encontrada',
  })
  remove(@Param('id') id: string) {
    return this.agendasService.remove(id);
  }

  @Post(':id/bloqueios')
  @ApiOperation({ summary: 'Adicionar bloqueio de horário em agenda' })
  @ApiParam({ name: 'id', description: 'ID da agenda' })
  @ApiBody({ type: CreateBloqueioDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Bloqueio adicionado com sucesso',
    type: BloqueioHorario,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Agenda não encontrada',
  })
  addBloqueio(@Param('id') id: string, @Body() bloqueioDto: CreateBloqueioDto) {
    return this.agendasService.addBloqueio(id, bloqueioDto);
  }

  @Delete('bloqueios/:bloqueioId')
  @ApiOperation({ summary: 'Remover bloqueio de horário' })
  @ApiParam({ name: 'bloqueioId', description: 'ID do bloqueio' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Bloqueio removido com sucesso',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Bloqueio não encontrado',
  })
  removeBloqueio(@Param('bloqueioId') bloqueioId: string) {
    return this.agendasService.removeBloqueio(bloqueioId);
  }
}
