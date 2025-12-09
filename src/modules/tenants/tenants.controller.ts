import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { TenantsService } from './tenants.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { Tenant } from './entities/tenant.entity';
import { SuperAdmin } from '../../comum/decorators/super-admin.decorator';
import { SkipTenantCheck } from '../../comum/decorators/skip-tenant-check.decorator';

@ApiTags('Tenants')
@ApiBearerAuth()
@SuperAdmin() // Apenas Super Admins podem acessar este controller
@SkipTenantCheck() // Super Admins não precisam de tenant
@Controller('tenants')
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Post()
  @ApiOperation({ summary: 'Criar novo tenant' })
  @ApiResponse({ status: 201, description: 'Tenant criado com sucesso' })
  @ApiResponse({ status: 409, description: 'Tenant já existe' })
  async create(@Body() createTenantDto: CreateTenantDto): Promise<Tenant> {
    return await this.tenantsService.create(createTenantDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os tenants' })
  @ApiResponse({ status: 200, description: 'Lista de tenants' })
  async findAll(): Promise<Tenant[]> {
    return await this.tenantsService.findAll();
  }

  @Get('ativos')
  @ApiOperation({ summary: 'Listar tenants ativos' })
  @ApiResponse({ status: 200, description: 'Lista de tenants ativos' })
  async findAtivos(): Promise<Tenant[]> {
    return await this.tenantsService.findAtivos();
  }

  @Get('estatisticas')
  @ApiOperation({ summary: 'Obter estatísticas de tenants' })
  @ApiResponse({ status: 200, description: 'Estatísticas de tenants' })
  async getStatistics() {
    return await this.tenantsService.getStatistics();
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Buscar tenant por slug' })
  @ApiResponse({ status: 200, description: 'Tenant encontrado' })
  @ApiResponse({ status: 404, description: 'Tenant não encontrado' })
  async findBySlug(@Param('slug') slug: string): Promise<Tenant> {
    return await this.tenantsService.findBySlug(slug);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar tenant por ID' })
  @ApiResponse({ status: 200, description: 'Tenant encontrado' })
  @ApiResponse({ status: 404, description: 'Tenant não encontrado' })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Tenant> {
    return await this.tenantsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar tenant' })
  @ApiResponse({ status: 200, description: 'Tenant atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Tenant não encontrado' })
  @ApiResponse({ status: 409, description: 'Conflito de dados' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTenantDto: UpdateTenantDto,
  ): Promise<Tenant> {
    return await this.tenantsService.update(id, updateTenantDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Desativar tenant' })
  @ApiResponse({ status: 200, description: 'Tenant desativado com sucesso' })
  @ApiResponse({ status: 404, description: 'Tenant não encontrado' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return await this.tenantsService.remove(id);
  }
}
