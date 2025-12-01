import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Query,
  UseInterceptors,
  UploadedFile,
  Res,
  ParseUUIDPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Response } from 'express';
import { FormulariosAtendimentoService } from '../services/formularios-atendimento.service';
import { CreateFormularioAtendimentoDto } from '../dto/create-formulario-atendimento.dto';
import { FilterFormularioAtendimentoDto } from '../dto/filter-formulario-atendimento.dto';

@ApiTags('Formulários de Atendimento')
@ApiBearerAuth()
@Controller('configuracoes/documentacao/formularios-atendimento')
export class FormulariosAtendimentoController {
  constructor(private readonly service: FormulariosAtendimentoService) {}

  @Post()
  @UseInterceptors(FileInterceptor('arquivo'))
  @ApiOperation({ summary: 'Upload de formulário de atendimento' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['unidadeId', 'arquivo'],
      properties: {
        unidadeId: {
          type: 'string',
          format: 'uuid',
          description: 'ID da unidade de saúde',
        },
        observacao: {
          type: 'string',
          description: 'Observação sobre o formulário',
        },
        arquivo: {
          type: 'string',
          format: 'binary',
          description: 'Arquivo PDF (máx 1MB)',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Formulário criado com sucesso' })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos ou arquivo inválido',
  })
  async create(
    @Body() dto: CreateFormularioAtendimentoDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.service.create(dto, file);
  }

  @Get()
  @ApiOperation({ summary: 'Listar formulários de atendimento' })
  @ApiResponse({ status: 200, description: 'Lista de formulários' })
  async findAll(@Query() filter: FilterFormularioAtendimentoDto) {
    return await this.service.findAll(filter);
  }

  @Get('estatisticas')
  @ApiOperation({ summary: 'Obter estatísticas dos formulários' })
  @ApiResponse({ status: 200, description: 'Estatísticas dos formulários' })
  async getEstatisticas() {
    return await this.service.getEstatisticas();
  }

  @Get('unidade/:unidadeId')
  @ApiOperation({ summary: 'Listar formulários por unidade' })
  @ApiResponse({ status: 200, description: 'Lista de formulários da unidade' })
  async findByUnidade(@Param('unidadeId', ParseUUIDPipe) unidadeId: string) {
    return await this.service.findByUnidade(unidadeId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar formulário por ID' })
  @ApiResponse({ status: 200, description: 'Formulário encontrado' })
  @ApiResponse({ status: 404, description: 'Formulário não encontrado' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.service.findOne(id);
  }

  @Get(':id/download')
  @ApiOperation({ summary: 'Download do arquivo do formulário' })
  @ApiResponse({ status: 200, description: 'Arquivo para download' })
  @ApiResponse({
    status: 404,
    description: 'Formulário ou arquivo não encontrado',
  })
  async download(@Param('id', ParseUUIDPipe) id: string, @Res() res: Response) {
    const fileInfo = await this.service.getFilePath(id);

    res.setHeader('Content-Type', fileInfo.mimeType);
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${encodeURIComponent(fileInfo.filename)}"`,
    );

    res.sendFile(fileInfo.path);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover formulário de atendimento' })
  @ApiResponse({ status: 200, description: 'Formulário removido com sucesso' })
  @ApiResponse({ status: 404, description: 'Formulário não encontrado' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.service.remove(id);
    return { message: 'Formulário removido com sucesso' };
  }
}
