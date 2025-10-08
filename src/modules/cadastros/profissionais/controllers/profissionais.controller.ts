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
import { ProfissionaisService } from '../services/profissionais.service';
import { JwtAuthGuard } from '../../../autenticacao/auth/guards/jwt-auth.guard';
import { CreateProfissionalDto } from '../dto/create-profissional.dto';
import { UpdateProfissionalDto } from '../dto/update-profissional.dto';
import { CreateDocumentoDto } from '../dto/create-documento.dto';
import { Profissional } from '../entities/profissional.entity';
import { DocumentoProfissional } from '../entities/documento-profissional.entity';

@ApiTags('Profissionais')
@ApiBearerAuth()
@Controller('cadastros/profissionais')
@UseGuards(JwtAuthGuard)
export class ProfissionaisController {
  constructor(private readonly profissionaisService: ProfissionaisService) {}

  @Post()
  @ApiOperation({ summary: 'Cadastrar novo profissional' })
  @ApiBody({ type: CreateProfissionalDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Profissional cadastrado com sucesso',
    type: Profissional,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Dados inválidos',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'CPF já cadastrado',
  })
  create(@Body() createProfissionalDto: CreateProfissionalDto) {
    return this.profissionaisService.create(createProfissionalDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os profissionais' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de profissionais retornada com sucesso',
    type: [Profissional],
  })
  findAll() {
    return this.profissionaisService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar profissional por ID' })
  @ApiParam({ name: 'id', description: 'ID do profissional' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Profissional encontrado',
    type: Profissional,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Profissional não encontrado',
  })
  findOne(@Param('id') id: string) {
    return this.profissionaisService.findOne(id);
  }

  @Get('cpf/:cpf')
  @ApiOperation({ summary: 'Buscar profissional por CPF' })
  @ApiParam({
    name: 'cpf',
    description: 'CPF do profissional',
    example: '123.456.789-00',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Profissional encontrado',
    type: Profissional,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Profissional não encontrado',
  })
  findByCpf(@Param('cpf') cpf: string) {
    return this.profissionaisService.findByCpf(cpf);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar dados do profissional' })
  @ApiParam({ name: 'id', description: 'ID do profissional' })
  @ApiBody({ type: UpdateProfissionalDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Profissional atualizado com sucesso',
    type: Profissional,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Profissional não encontrado',
  })
  update(
    @Param('id') id: string,
    @Body() updateProfissionalDto: UpdateProfissionalDto,
  ) {
    return this.profissionaisService.update(id, updateProfissionalDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover profissional' })
  @ApiParam({ name: 'id', description: 'ID do profissional' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Profissional removido com sucesso',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Profissional não encontrado',
  })
  remove(@Param('id') id: string) {
    return this.profissionaisService.remove(id);
  }

  @Post(':id/documentos')
  @ApiOperation({ summary: 'Adicionar documento ao profissional' })
  @ApiParam({ name: 'id', description: 'ID do profissional' })
  @ApiBody({ type: CreateDocumentoDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Documento adicionado com sucesso',
    type: DocumentoProfissional,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Profissional não encontrado',
  })
  addDocumento(
    @Param('id') id: string,
    @Body() documentoDto: CreateDocumentoDto,
  ) {
    return this.profissionaisService.addDocumento(id, documentoDto);
  }

  @Patch('documentos/:documentoId')
  @ApiOperation({ summary: 'Atualizar documento do profissional' })
  @ApiParam({ name: 'documentoId', description: 'ID do documento' })
  @ApiBody({ type: CreateDocumentoDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Documento atualizado com sucesso',
    type: DocumentoProfissional,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Documento não encontrado',
  })
  updateDocumento(
    @Param('documentoId') documentoId: string,
    @Body() updateDocumentoDto: CreateDocumentoDto,
  ) {
    return this.profissionaisService.updateDocumento(
      documentoId,
      updateDocumentoDto,
    );
  }

  @Delete('documentos/:documentoId')
  @ApiOperation({ summary: 'Remover documento do profissional' })
  @ApiParam({ name: 'documentoId', description: 'ID do documento' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Documento removido com sucesso',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Documento não encontrado',
  })
  removeDocumento(@Param('documentoId') documentoId: string) {
    return this.profissionaisService.removeDocumento(documentoId);
  }

  @Post(':id/agendas/:agendaId')
  @ApiOperation({ summary: 'Vincular agenda ao profissional' })
  @ApiParam({ name: 'id', description: 'ID do profissional' })
  @ApiParam({ name: 'agendaId', description: 'ID da agenda' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Agenda vinculada com sucesso',
    type: Profissional,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Profissional ou agenda não encontrado',
  })
  vincularAgenda(@Param('id') id: string, @Param('agendaId') agendaId: string) {
    return this.profissionaisService.vincularAgenda(id, agendaId);
  }

  @Delete(':id/agendas/:agendaId')
  @ApiOperation({ summary: 'Desvincular agenda do profissional' })
  @ApiParam({ name: 'id', description: 'ID do profissional' })
  @ApiParam({ name: 'agendaId', description: 'ID da agenda' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Agenda desvinculada com sucesso',
    type: Profissional,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Profissional ou agenda não encontrado',
  })
  desvincularAgenda(
    @Param('id') id: string,
    @Param('agendaId') agendaId: string,
  ) {
    return this.profissionaisService.desvincularAgenda(id, agendaId);
  }
}
