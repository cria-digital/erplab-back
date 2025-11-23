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
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../autenticacao/auth/guards/jwt-auth.guard';
import { ConfiguracaoCampoService } from '../services/configuracao-campo.service';
import { CreateConfiguracaoCampoDto } from '../dto/create-configuracao-campo.dto';
import { UpdateConfiguracaoCampoDto } from '../dto/update-configuracao-campo.dto';
import { TipoEntidadeEnum } from '../entities/configuracao-campo-formulario.entity';

@ApiTags('Configurações de Campos')
@Controller('api/v1/configuracoes-campos')
@UseGuards(JwtAuthGuard)
export class ConfiguracaoCampoController {
  constructor(
    private readonly configuracaoCampoService: ConfiguracaoCampoService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Criar nova configuração de campo' })
  @ApiResponse({ status: 201, description: 'Configuração criada com sucesso' })
  create(@Body() createDto: CreateConfiguracaoCampoDto) {
    return this.configuracaoCampoService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as configurações de campos' })
  @ApiResponse({ status: 200, description: 'Lista de configurações' })
  findAll() {
    return this.configuracaoCampoService.findAll();
  }

  @Get('entidade/:entidadeTipo/:entidadeId')
  @ApiOperation({
    summary: 'Buscar configurações por entidade',
    description:
      'Retorna todas as configurações de campos para uma entidade específica',
  })
  @ApiQuery({
    name: 'tipoFormulario',
    required: false,
    description: 'Filtrar por tipo de formulário',
  })
  @ApiResponse({
    status: 200,
    description: 'Configurações encontradas',
  })
  findByEntidade(
    @Param('entidadeTipo') entidadeTipo: TipoEntidadeEnum,
    @Param('entidadeId') entidadeId: string,
    @Query('tipoFormulario') tipoFormulario?: string,
  ) {
    return this.configuracaoCampoService.findByEntidade(
      entidadeTipo,
      entidadeId,
      tipoFormulario,
    );
  }

  @Get('campos-obrigatorios/:entidadeTipo/:entidadeId/:tipoFormulario')
  @ApiOperation({
    summary: 'Obter apenas campos obrigatórios',
    description:
      'Retorna lista de nomes dos campos obrigatórios para validação',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de campos obrigatórios',
    type: [String],
  })
  obterCamposObrigatorios(
    @Param('entidadeTipo') entidadeTipo: TipoEntidadeEnum,
    @Param('entidadeId') entidadeId: string,
    @Param('tipoFormulario') tipoFormulario: string,
  ) {
    return this.configuracaoCampoService.obterCamposObrigatorios(
      entidadeTipo,
      entidadeId,
      tipoFormulario,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar configuração por ID' })
  @ApiResponse({ status: 200, description: 'Configuração encontrada' })
  @ApiResponse({ status: 404, description: 'Configuração não encontrada' })
  findOne(@Param('id') id: string) {
    return this.configuracaoCampoService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar configuração de campo' })
  @ApiResponse({ status: 200, description: 'Configuração atualizada' })
  @ApiResponse({ status: 404, description: 'Configuração não encontrada' })
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateConfiguracaoCampoDto,
  ) {
    return this.configuracaoCampoService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletar configuração de campo' })
  @ApiResponse({ status: 200, description: 'Configuração deletada' })
  @ApiResponse({ status: 404, description: 'Configuração não encontrada' })
  remove(@Param('id') id: string) {
    return this.configuracaoCampoService.remove(id);
  }
}
