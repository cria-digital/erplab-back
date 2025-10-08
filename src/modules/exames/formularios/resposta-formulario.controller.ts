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
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { RespostaFormularioService } from './resposta-formulario.service';
import { CreateRespostaFormularioDto } from './dto/create-resposta-formulario.dto';
import { UpdateRespostaFormularioDto } from './dto/update-resposta-formulario.dto';
import { StatusResposta } from './entities/resposta-formulario.entity';
import { JwtAuthGuard } from '../../autenticacao/auth/guards/jwt-auth.guard';

@ApiTags('Respostas de Formulário')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/v1/respostas-formulario')
export class RespostaFormularioController {
  constructor(
    private readonly respostaFormularioService: RespostaFormularioService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Criar nova resposta de formulário' })
  @ApiResponse({ status: 201, description: 'Resposta criada com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  create(@Body() createRespostaDto: CreateRespostaFormularioDto) {
    return this.respostaFormularioService.create(createRespostaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as respostas' })
  @ApiResponse({ status: 200, description: 'Lista de respostas' })
  findAll() {
    return this.respostaFormularioService.findAll();
  }

  @Get('completas')
  @ApiOperation({ summary: 'Listar respostas completas' })
  @ApiResponse({ status: 200, description: 'Lista de respostas completas' })
  findCompletas() {
    return this.respostaFormularioService.findCompletas();
  }

  @Get('pendentes-revisao')
  @ApiOperation({ summary: 'Listar respostas pendentes de revisão' })
  @ApiResponse({
    status: 200,
    description: 'Lista de respostas pendentes de revisão',
  })
  findPendentesRevisao() {
    return this.respostaFormularioService.findPendentesRevisao();
  }

  @Get('assinadas-digitalmente')
  @ApiOperation({ summary: 'Listar respostas assinadas digitalmente' })
  @ApiResponse({
    status: 200,
    description: 'Lista de respostas assinadas digitalmente',
  })
  findAssinadasDigitalmente() {
    return this.respostaFormularioService.findAssinadasDigitalmente();
  }

  @Get('search')
  @ApiOperation({ summary: 'Buscar respostas por termo' })
  @ApiQuery({ name: 'q', description: 'Termo de busca', required: true })
  @ApiResponse({ status: 200, description: 'Resultados da busca' })
  search(@Query('q') termo: string) {
    return this.respostaFormularioService.search(termo);
  }

  @Get('estatisticas')
  @ApiOperation({ summary: 'Obter estatísticas das respostas' })
  @ApiResponse({ status: 200, description: 'Estatísticas das respostas' })
  getEstatisticas() {
    return this.respostaFormularioService.getEstatisticas();
  }

  @Get('formulario/:formularioId')
  @ApiOperation({ summary: 'Listar respostas de um formulário' })
  @ApiParam({ name: 'formularioId', description: 'ID do formulário' })
  @ApiResponse({ status: 200, description: 'Lista de respostas do formulário' })
  findByFormulario(@Param('formularioId', ParseUUIDPipe) formularioId: string) {
    return this.respostaFormularioService.findByFormulario(formularioId);
  }

  @Get('paciente/:pacienteId')
  @ApiOperation({ summary: 'Listar respostas de um paciente' })
  @ApiParam({ name: 'pacienteId', description: 'ID do paciente' })
  @ApiResponse({ status: 200, description: 'Lista de respostas do paciente' })
  findByPaciente(@Param('pacienteId', ParseUUIDPipe) pacienteId: string) {
    return this.respostaFormularioService.findByPaciente(pacienteId);
  }

  @Get('usuario/:usuarioId')
  @ApiOperation({ summary: 'Listar respostas de um usuário' })
  @ApiParam({ name: 'usuarioId', description: 'ID do usuário' })
  @ApiResponse({ status: 200, description: 'Lista de respostas do usuário' })
  findByUsuario(@Param('usuarioId', ParseUUIDPipe) usuarioId: string) {
    return this.respostaFormularioService.findByUsuario(usuarioId);
  }

  @Get('status/:status')
  @ApiOperation({ summary: 'Listar respostas por status' })
  @ApiParam({ name: 'status', enum: StatusResposta })
  @ApiResponse({
    status: 200,
    description: 'Lista de respostas com o status especificado',
  })
  findByStatus(@Param('status') status: StatusResposta) {
    return this.respostaFormularioService.findByStatus(status);
  }

  @Get('unidade/:unidadeId')
  @ApiOperation({ summary: 'Listar respostas de uma unidade de saúde' })
  @ApiParam({ name: 'unidadeId', description: 'ID da unidade de saúde' })
  @ApiResponse({ status: 200, description: 'Lista de respostas da unidade' })
  findByUnidadeSaude(@Param('unidadeId', ParseUUIDPipe) unidadeId: string) {
    return this.respostaFormularioService.findByUnidadeSaude(unidadeId);
  }

  @Get('ordem-servico/:ordemId')
  @ApiOperation({ summary: 'Listar respostas de uma ordem de serviço' })
  @ApiParam({ name: 'ordemId', description: 'ID da ordem de serviço' })
  @ApiResponse({
    status: 200,
    description: 'Lista de respostas da ordem de serviço',
  })
  findByOrdemServico(@Param('ordemId', ParseUUIDPipe) ordemId: string) {
    return this.respostaFormularioService.findByOrdemServico(ordemId);
  }

  @Get('codigo/:codigo')
  @ApiOperation({ summary: 'Buscar resposta por código' })
  @ApiParam({ name: 'codigo', description: 'Código da resposta' })
  @ApiResponse({ status: 200, description: 'Resposta encontrada' })
  @ApiResponse({ status: 404, description: 'Resposta não encontrada' })
  findByCodigo(@Param('codigo') codigo: string) {
    return this.respostaFormularioService.findByCodigo(codigo);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar resposta por ID' })
  @ApiParam({ name: 'id', description: 'ID da resposta' })
  @ApiResponse({ status: 200, description: 'Resposta encontrada' })
  @ApiResponse({ status: 404, description: 'Resposta não encontrada' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.respostaFormularioService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar resposta' })
  @ApiParam({ name: 'id', description: 'ID da resposta' })
  @ApiResponse({ status: 200, description: 'Resposta atualizada com sucesso' })
  @ApiResponse({ status: 404, description: 'Resposta não encontrada' })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos ou resposta não pode ser editada',
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateRespostaDto: UpdateRespostaFormularioDto,
  ) {
    return this.respostaFormularioService.update(id, updateRespostaDto);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Atualizar status da resposta' })
  @ApiParam({ name: 'id', description: 'ID da resposta' })
  @ApiQuery({ name: 'status', enum: StatusResposta })
  @ApiQuery({
    name: 'observacoes',
    description: 'Observações sobre a alteração',
    required: false,
  })
  @ApiResponse({ status: 200, description: 'Status atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Resposta não encontrada' })
  @ApiResponse({ status: 400, description: 'Status não pode ser alterado' })
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('status') status: StatusResposta,
    @Query('observacoes') observacoes?: string,
  ) {
    return this.respostaFormularioService.updateStatus(id, status, observacoes);
  }

  @Post(':id/finalizar')
  @ApiOperation({ summary: 'Finalizar resposta' })
  @ApiParam({ name: 'id', description: 'ID da resposta' })
  @ApiResponse({ status: 200, description: 'Resposta finalizada com sucesso' })
  @ApiResponse({ status: 404, description: 'Resposta não encontrada' })
  @ApiResponse({ status: 400, description: 'Resposta não pode ser finalizada' })
  finalizar(@Param('id', ParseUUIDPipe) id: string) {
    return this.respostaFormularioService.finalizar(id);
  }

  @Post(':id/assinar-digitalmente')
  @ApiOperation({ summary: 'Assinar resposta digitalmente' })
  @ApiParam({ name: 'id', description: 'ID da resposta' })
  @ApiResponse({
    status: 200,
    description: 'Resposta assinada digitalmente com sucesso',
  })
  @ApiResponse({ status: 404, description: 'Resposta não encontrada' })
  @ApiResponse({ status: 400, description: 'Resposta não pode ser assinada' })
  assinarDigitalmente(
    @Param('id', ParseUUIDPipe) id: string,
    @Body()
    dadosAssinatura: {
      hashAssinatura: string;
      certificadoDigital: string;
    },
  ) {
    return this.respostaFormularioService.assinarDigitalmente(
      id,
      dadosAssinatura.hashAssinatura,
      dadosAssinatura.certificadoDigital,
    );
  }

  @Get(':id/calcular-percentual')
  @ApiOperation({ summary: 'Calcular percentual de completude da resposta' })
  @ApiParam({ name: 'id', description: 'ID da resposta' })
  @ApiResponse({ status: 200, description: 'Percentual calculado' })
  @ApiResponse({ status: 404, description: 'Resposta não encontrada' })
  calcularPercentualCompleto(@Param('id', ParseUUIDPipe) id: string) {
    return this.respostaFormularioService.calcularPercentualCompleto(id);
  }

  @Post(':id/duplicar')
  @ApiOperation({ summary: 'Duplicar resposta' })
  @ApiParam({ name: 'id', description: 'ID da resposta' })
  @ApiQuery({
    name: 'pacienteId',
    description: 'ID do novo paciente',
    required: false,
  })
  @ApiResponse({ status: 201, description: 'Resposta duplicada com sucesso' })
  @ApiResponse({ status: 404, description: 'Resposta não encontrada' })
  duplicar(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('pacienteId') novoPacienteId?: string,
  ) {
    return this.respostaFormularioService.duplicar(id, novoPacienteId);
  }

  @Post(':id/validar')
  @ApiOperation({ summary: 'Validar resposta' })
  @ApiParam({ name: 'id', description: 'ID da resposta' })
  @ApiResponse({ status: 200, description: 'Resultado da validação' })
  @ApiResponse({ status: 404, description: 'Resposta não encontrada' })
  validarResposta(@Param('id', ParseUUIDPipe) id: string) {
    return this.respostaFormularioService.validarResposta(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover resposta' })
  @ApiParam({ name: 'id', description: 'ID da resposta' })
  @ApiResponse({ status: 200, description: 'Resposta removida com sucesso' })
  @ApiResponse({ status: 404, description: 'Resposta não encontrada' })
  @ApiResponse({ status: 400, description: 'Resposta não pode ser removida' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.respostaFormularioService.remove(id);
  }
}
