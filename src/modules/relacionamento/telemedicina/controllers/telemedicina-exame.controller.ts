import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { TelemedicinaExameService } from '../services/telemedicina-exame.service';
import { CreateTelemedicinaExameDto } from '../dto/create-telemedicina-exame.dto';
import { UpdateTelemedicinaExameDto } from '../dto/update-telemedicina-exame.dto';
import { TelemedicinaExame } from '../entities/telemedicina-exame.entity';

@ApiTags('Telemedicina - Exames')
@Controller('relacionamento/telemedicina-exames')
export class TelemedicinaExameController {
  constructor(
    private readonly telemedicinaExameService: TelemedicinaExameService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Vincular exame à telemedicina' })
  @ApiResponse({
    status: 201,
    description: 'Vínculo criado com sucesso.',
    type: TelemedicinaExame,
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  @ApiResponse({ status: 409, description: 'Vínculo já existe.' })
  async create(
    @Body() createTelemedicinaExameDto: CreateTelemedicinaExameDto,
  ): Promise<TelemedicinaExame> {
    return await this.telemedicinaExameService.create(
      createTelemedicinaExameDto,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os vínculos telemedicina-exame' })
  @ApiResponse({
    status: 200,
    description: 'Lista de vínculos retornada com sucesso.',
    type: [TelemedicinaExame],
  })
  async findAll(): Promise<TelemedicinaExame[]> {
    return await this.telemedicinaExameService.findAll();
  }

  @Get('ativos')
  @ApiOperation({ summary: 'Listar vínculos ativos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de vínculos ativos.',
    type: [TelemedicinaExame],
  })
  async findAtivos(): Promise<TelemedicinaExame[]> {
    return await this.telemedicinaExameService.findAtivos();
  }

  @Get('telemedicina/:telemedicinaId')
  @ApiOperation({ summary: 'Listar exames vinculados a uma telemedicina' })
  @ApiParam({ name: 'telemedicinaId', description: 'ID da telemedicina' })
  @ApiResponse({
    status: 200,
    description: 'Lista de exames vinculados.',
    type: [TelemedicinaExame],
  })
  async findByTelemedicina(
    @Param('telemedicinaId', ParseUUIDPipe) telemedicinaId: string,
  ): Promise<TelemedicinaExame[]> {
    return await this.telemedicinaExameService.findByTelemedicina(
      telemedicinaId,
    );
  }

  @Get('exame/:exameId')
  @ApiOperation({ summary: 'Listar telemedicinas vinculadas a um exame' })
  @ApiParam({ name: 'exameId', description: 'ID do exame' })
  @ApiResponse({
    status: 200,
    description: 'Lista de telemedicinas vinculadas.',
    type: [TelemedicinaExame],
  })
  async findByExame(
    @Param('exameId', ParseUUIDPipe) exameId: string,
  ): Promise<TelemedicinaExame[]> {
    return await this.telemedicinaExameService.findByExame(exameId);
  }

  @Get('sem-vinculo/:telemedicinaId')
  @ApiOperation({ summary: 'Listar exames sem vínculo com a telemedicina' })
  @ApiParam({ name: 'telemedicinaId', description: 'ID da telemedicina' })
  @ApiResponse({
    status: 200,
    description: 'Lista de exames sem vínculo.',
  })
  async findSemVinculo(
    @Param('telemedicinaId', ParseUUIDPipe) telemedicinaId: string,
  ): Promise<any[]> {
    return await this.telemedicinaExameService.findSemVinculo(telemedicinaId);
  }

  @Get('search/:telemedicinaId')
  @ApiOperation({ summary: 'Buscar vínculos por termo' })
  @ApiParam({ name: 'telemedicinaId', description: 'ID da telemedicina' })
  @ApiQuery({ name: 'q', description: 'Termo de busca' })
  @ApiResponse({
    status: 200,
    description: 'Resultados da busca.',
    type: [TelemedicinaExame],
  })
  async search(
    @Param('telemedicinaId', ParseUUIDPipe) telemedicinaId: string,
    @Query('q') query: string,
  ): Promise<TelemedicinaExame[]> {
    return await this.telemedicinaExameService.search(telemedicinaId, query);
  }

  @Get('estatisticas')
  @ApiOperation({ summary: 'Obter estatísticas dos vínculos' })
  @ApiQuery({
    name: 'telemedicinaId',
    description: 'ID da telemedicina (opcional)',
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'Estatísticas retornadas com sucesso.',
  })
  async getEstatisticas(
    @Query('telemedicinaId') telemedicinaId?: string,
  ): Promise<any> {
    return await this.telemedicinaExameService.getEstatisticas(telemedicinaId);
  }

  @Post('vincular-automaticamente/:telemedicinaId')
  @ApiOperation({ summary: 'Vincular exames automaticamente' })
  @ApiParam({ name: 'telemedicinaId', description: 'ID da telemedicina' })
  @ApiResponse({
    status: 200,
    description: 'Vinculação automática realizada.',
  })
  async vincularAutomaticamente(
    @Param('telemedicinaId', ParseUUIDPipe) telemedicinaId: string,
  ): Promise<{ vinculados: number; total: number }> {
    return await this.telemedicinaExameService.vincularAutomaticamente(
      telemedicinaId,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar vínculo por ID' })
  @ApiParam({ name: 'id', description: 'ID do vínculo' })
  @ApiResponse({
    status: 200,
    description: 'Vínculo encontrado.',
    type: TelemedicinaExame,
  })
  @ApiResponse({ status: 404, description: 'Vínculo não encontrado.' })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<TelemedicinaExame> {
    return await this.telemedicinaExameService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar vínculo telemedicina-exame' })
  @ApiParam({ name: 'id', description: 'ID do vínculo' })
  @ApiResponse({
    status: 200,
    description: 'Vínculo atualizado com sucesso.',
    type: TelemedicinaExame,
  })
  @ApiResponse({ status: 404, description: 'Vínculo não encontrado.' })
  @ApiResponse({ status: 409, description: 'Vínculo já existe.' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTelemedicinaExameDto: UpdateTelemedicinaExameDto,
  ): Promise<TelemedicinaExame> {
    return await this.telemedicinaExameService.update(
      id,
      updateTelemedicinaExameDto,
    );
  }

  @Patch(':id/toggle-status')
  @ApiOperation({ summary: 'Alternar status do vínculo' })
  @ApiParam({ name: 'id', description: 'ID do vínculo' })
  @ApiResponse({
    status: 200,
    description: 'Status alterado com sucesso.',
    type: TelemedicinaExame,
  })
  @ApiResponse({ status: 404, description: 'Vínculo não encontrado.' })
  async toggleStatus(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<TelemedicinaExame> {
    return await this.telemedicinaExameService.toggleStatus(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover vínculo telemedicina-exame' })
  @ApiParam({ name: 'id', description: 'ID do vínculo' })
  @ApiResponse({ status: 200, description: 'Vínculo removido com sucesso.' })
  @ApiResponse({ status: 404, description: 'Vínculo não encontrado.' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return await this.telemedicinaExameService.remove(id);
  }
}
