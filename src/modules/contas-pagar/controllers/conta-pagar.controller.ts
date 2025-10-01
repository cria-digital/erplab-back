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
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ContaPagarService } from '../services/conta-pagar.service';
import { CreateContaPagarDto } from '../dto/create-conta-pagar.dto';
import { UpdateContaPagarDto } from '../dto/update-conta-pagar.dto';
import { ContaPagar } from '../entities/conta-pagar.entity';
import { StatusContaPagar } from '../enums/contas-pagar.enum';

@ApiTags('Contas a Pagar')
@Controller('contas-pagar')
export class ContaPagarController {
  constructor(private readonly contaPagarService: ContaPagarService) {}

  @Post()
  @ApiOperation({ summary: 'Criar nova conta a pagar' })
  @ApiResponse({
    status: 201,
    description: 'Conta criada com sucesso',
    type: ContaPagar,
  })
  @ApiResponse({ status: 409, description: 'Conflito - Código já existente' })
  create(@Body() dto: CreateContaPagarDto): Promise<ContaPagar> {
    return this.contaPagarService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as contas a pagar' })
  @ApiResponse({
    status: 200,
    description: 'Lista de contas',
    type: [ContaPagar],
  })
  findAll(): Promise<ContaPagar[]> {
    return this.contaPagarService.findAll();
  }

  @Get('status/:status')
  @ApiOperation({ summary: 'Buscar contas por status' })
  @ApiParam({ name: 'status', enum: StatusContaPagar })
  @ApiResponse({
    status: 200,
    description: 'Contas encontradas',
    type: [ContaPagar],
  })
  findByStatus(
    @Param('status') status: StatusContaPagar,
  ): Promise<ContaPagar[]> {
    return this.contaPagarService.findByStatus(status);
  }

  @Get('credor/:tipo/:id')
  @ApiOperation({ summary: 'Buscar contas por credor' })
  @ApiResponse({
    status: 200,
    description: 'Contas encontradas',
    type: [ContaPagar],
  })
  findByCredor(
    @Param('tipo') tipo: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ContaPagar[]> {
    return this.contaPagarService.findByCredor(tipo, id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar conta por ID' })
  @ApiResponse({
    status: 200,
    description: 'Conta encontrada',
    type: ContaPagar,
  })
  @ApiResponse({ status: 404, description: 'Conta não encontrada' })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<ContaPagar> {
    return this.contaPagarService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar conta' })
  @ApiResponse({
    status: 200,
    description: 'Conta atualizada',
    type: ContaPagar,
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateContaPagarDto,
  ): Promise<ContaPagar> {
    return this.contaPagarService.update(id, dto);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Atualizar status da conta' })
  @ApiResponse({
    status: 200,
    description: 'Status atualizado',
    type: ContaPagar,
  })
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('status') status: StatusContaPagar,
  ): Promise<ContaPagar> {
    return this.contaPagarService.updateStatus(id, status);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover conta' })
  @ApiResponse({ status: 204, description: 'Conta removida' })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.contaPagarService.remove(id);
  }
}
