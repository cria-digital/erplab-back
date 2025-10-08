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
import { RepasseService } from '../services/repasse.service';
import { CreateRepasseDto } from '../dto/create-repasse.dto';
import { UpdateRepasseDto } from '../dto/update-repasse.dto';
import { Repasse } from '../entities/repasse.entity';
import { StatusRepasse } from '../enums/contas-pagar.enum';

@ApiTags('Repasses')
@Controller('financeiro/repasses')
export class RepasseController {
  constructor(private readonly repasseService: RepasseService) {}

  @Post()
  @ApiOperation({ summary: 'Criar novo repasse' })
  @ApiResponse({
    status: 201,
    description: 'Repasse criado com sucesso',
    type: Repasse,
  })
  create(@Body() dto: CreateRepasseDto): Promise<Repasse> {
    return this.repasseService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os repasses' })
  @ApiResponse({
    status: 200,
    description: 'Lista de repasses',
    type: [Repasse],
  })
  findAll(): Promise<Repasse[]> {
    return this.repasseService.findAll();
  }

  @Get('unidade/:unidadeId')
  @ApiOperation({ summary: 'Buscar repasses por unidade' })
  @ApiResponse({
    status: 200,
    description: 'Repasses encontrados',
    type: [Repasse],
  })
  findByUnidade(
    @Param('unidadeId', ParseUUIDPipe) unidadeId: string,
  ): Promise<Repasse[]> {
    return this.repasseService.findByUnidade(unidadeId);
  }

  @Get('status/:status')
  @ApiOperation({ summary: 'Buscar repasses por status' })
  @ApiResponse({
    status: 200,
    description: 'Repasses encontrados',
    type: [Repasse],
  })
  findByStatus(@Param('status') status: StatusRepasse): Promise<Repasse[]> {
    return this.repasseService.findByStatus(status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar repasse por ID' })
  @ApiResponse({
    status: 200,
    description: 'Repasse encontrado',
    type: Repasse,
  })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Repasse> {
    return this.repasseService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar repasse' })
  @ApiResponse({
    status: 200,
    description: 'Repasse atualizado',
    type: Repasse,
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateRepasseDto,
  ): Promise<Repasse> {
    return this.repasseService.update(id, dto);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Atualizar status do repasse' })
  @ApiResponse({ status: 200, description: 'Status atualizado', type: Repasse })
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('status') status: StatusRepasse,
  ): Promise<Repasse> {
    return this.repasseService.updateStatus(id, status);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover repasse' })
  @ApiResponse({ status: 204, description: 'Repasse removido' })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.repasseService.remove(id);
  }
}
