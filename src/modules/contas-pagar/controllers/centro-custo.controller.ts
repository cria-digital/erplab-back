import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CentroCustoService } from '../services/centro-custo.service';
import { CreateCentroCustoDto } from '../dto/create-centro-custo.dto';
import { UpdateCentroCustoDto } from '../dto/update-centro-custo.dto';
import { CentroCusto } from '../entities/centro-custo.entity';

@ApiTags('Centros de Custo')
@Controller('centros-custo')
export class CentroCustoController {
  constructor(private readonly centroCustoService: CentroCustoService) {}

  @Post()
  @ApiOperation({ summary: 'Criar novo centro de custo' })
  @ApiResponse({
    status: 201,
    description: 'Centro criado com sucesso',
    type: CentroCusto,
  })
  create(@Body() dto: CreateCentroCustoDto): Promise<CentroCusto> {
    return this.centroCustoService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os centros de custo' })
  @ApiResponse({
    status: 200,
    description: 'Lista de centros',
    type: [CentroCusto],
  })
  findAll(): Promise<CentroCusto[]> {
    return this.centroCustoService.findAll();
  }

  @Get('ativos')
  @ApiOperation({ summary: 'Listar centros de custo ativos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de centros ativos',
    type: [CentroCusto],
  })
  findAtivos(): Promise<CentroCusto[]> {
    return this.centroCustoService.findAtivos();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar centro de custo por ID' })
  @ApiResponse({
    status: 200,
    description: 'Centro encontrado',
    type: CentroCusto,
  })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<CentroCusto> {
    return this.centroCustoService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar centro de custo' })
  @ApiResponse({
    status: 200,
    description: 'Centro atualizado',
    type: CentroCusto,
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCentroCustoDto,
  ): Promise<CentroCusto> {
    return this.centroCustoService.update(id, dto);
  }

  @Patch(':id/toggle-status')
  @ApiOperation({ summary: 'Alternar status do centro' })
  @ApiResponse({
    status: 200,
    description: 'Status alternado',
    type: CentroCusto,
  })
  toggleStatus(@Param('id', ParseUUIDPipe) id: string): Promise<CentroCusto> {
    return this.centroCustoService.toggleStatus(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover centro de custo' })
  @ApiResponse({ status: 204, description: 'Centro removido' })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.centroCustoService.remove(id);
  }
}
