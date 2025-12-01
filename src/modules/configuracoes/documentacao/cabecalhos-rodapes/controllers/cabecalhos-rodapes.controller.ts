import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  UseInterceptors,
  UploadedFile,
  Body,
  Res,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
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
import { CabecalhosRodapesService } from '../services/cabecalhos-rodapes.service';
import { CreateCabecalhoRodapeDto } from '../dto/create-cabecalho-rodape.dto';
import { FilterCabecalhoRodapeDto } from '../dto/filter-cabecalho-rodape.dto';

@ApiTags('Cabeçalhos/Rodapés')
@ApiBearerAuth()
@Controller('configuracoes/documentacao/cabecalhos-rodapes')
export class CabecalhosRodapesController {
  constructor(private readonly service: CabecalhosRodapesService) {}

  @Post()
  @UseInterceptors(FileInterceptor('arquivo'))
  @ApiOperation({ summary: 'Criar cabeçalho ou rodapé com upload de imagem' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['unidadeId', 'tipo', 'arquivo'],
      properties: {
        unidadeId: {
          type: 'string',
          format: 'uuid',
          description: 'ID da unidade de saúde',
        },
        tipo: {
          type: 'string',
          enum: ['CABECALHO', 'RODAPE'],
          description: 'Tipo: CABECALHO ou RODAPE',
        },
        arquivo: {
          type: 'string',
          format: 'binary',
          description: 'Imagem (JPG, PNG, GIF, WEBP) - máx 1MB',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Criado com sucesso' })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos ou arquivo inválido',
  })
  @ApiResponse({
    status: 409,
    description: 'Já existe para esta unidade e tipo',
  })
  async create(
    @Body() dto: CreateCabecalhoRodapeDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.service.create(dto, file);
  }

  @Get()
  @ApiOperation({ summary: 'Listar cabeçalhos e rodapés' })
  @ApiResponse({ status: 200, description: 'Lista retornada com sucesso' })
  async findAll(@Query() filter: FilterCabecalhoRodapeDto) {
    return await this.service.findAll(filter);
  }

  @Get('estatisticas')
  @ApiOperation({ summary: 'Obter estatísticas de cabeçalhos e rodapés' })
  @ApiResponse({ status: 200, description: 'Estatísticas retornadas' })
  async getEstatisticas() {
    return await this.service.getEstatisticas();
  }

  @Get('unidade/:unidadeId')
  @ApiOperation({ summary: 'Listar cabeçalhos e rodapés de uma unidade' })
  @ApiResponse({ status: 200, description: 'Lista retornada com sucesso' })
  async findByUnidade(@Param('unidadeId', ParseUUIDPipe) unidadeId: string) {
    return await this.service.findByUnidade(unidadeId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar cabeçalho/rodapé por ID' })
  @ApiResponse({ status: 200, description: 'Encontrado com sucesso' })
  @ApiResponse({ status: 404, description: 'Não encontrado' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.service.findOne(id);
  }

  @Get(':id/download')
  @ApiOperation({ summary: 'Download da imagem' })
  @ApiResponse({ status: 200, description: 'Arquivo retornado' })
  @ApiResponse({ status: 404, description: 'Arquivo não encontrado' })
  async download(@Param('id', ParseUUIDPipe) id: string, @Res() res: Response) {
    const fileInfo = await this.service.getFilePath(id);

    res.setHeader('Content-Type', fileInfo.mimeType);
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${fileInfo.filename}"`,
    );

    res.sendFile(fileInfo.path);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Excluir cabeçalho/rodapé' })
  @ApiResponse({ status: 204, description: 'Excluído com sucesso' })
  @ApiResponse({ status: 404, description: 'Não encontrado' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.service.remove(id);
  }
}
