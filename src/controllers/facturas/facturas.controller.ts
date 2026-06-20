import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { FacturasService } from '../../services/facturas/facturas.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../guard/user/jwt-auth.guard';
import { RoleGuard } from '../../guard/user/role.guard';
import { Roles } from '../../decorators/roles.decorator';
import { Role } from '@prisma/client';
import { FacturaResponseDto } from '../../dtos/factura/factura-reponse.dto';
import { CreateFacturaDto } from '../../dtos/factura/create-factura.dto';
import { GetUser } from '../../decorators/get-user.decorator';
import { UpdateEstadoFacturaDto } from '../../dtos/factura/update-estado.dto';
@ApiTags(' Facturas')
@Controller('facturas')
export class FacturasController {
  constructor(private readonly facturasService: FacturasService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN, Role.VETERINARIO, Role.RECEPCIONISTA)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new factura' })
  @ApiBody({ type: CreateFacturaDto })
  @ApiResponse({
    status: 201,
    description: 'Factura created successfully.',
    type: FacturaResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async createFactura(
    @Body() createFacturaDto: CreateFacturaDto,
  ): Promise<FacturaResponseDto> {
    return this.facturasService.createFactura(createFacturaDto);
  }

  @Get('/list')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN, Role.RECEPCIONISTA)
  @ApiOperation({ summary: 'Get list of facturas' })
  @ApiResponse({
    status: 200,
    description: 'List of facturas',
    type: [FacturaResponseDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'No facturas found' })
  async getAll(): Promise<FacturaResponseDto[]> {
    return this.facturasService.getAll();
  }

  @Get('mis-facturas')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.CLIENTE)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get facturas for the authenticated user',
  })
  @ApiResponse({
    status: 200,
    description: 'Factura details',
    type: [FacturaResponseDto],
  })
  @ApiResponse({
    status: 404,
    description: 'Factura not found',
  })
  async findByIdForUser(
    @GetUser('id') userId: string,
  ): Promise<FacturaResponseDto[]> {
    return this.facturasService.findByIdForUser(userId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN, Role.RECEPCIONISTA, Role.VETERINARIO, Role.CLIENTE)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get factura by id',
  })
  @ApiResponse({
    status: 200,
    description: 'Factura details',
    type: FacturaResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Factura not found',
  })
  async findById(
    @Param('id') id: string,
    @GetUser('id') userId: string,
    @GetUser('role') role: Role,
  ): Promise<FacturaResponseDto> {
    return this.facturasService.findById(id, userId, role);
  }

  @Patch(':id/estado')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN, Role.RECEPCIONISTA, Role.VETERINARIO)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update factura estado' })
  @ApiResponse({
    status: 200,
    description: 'Factura estado updated successfully',
    type: FacturaResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Factura not found.' })
  async updateEstado(
    @Param('id') id: string,
    @Body() updateEstadoFacturaDto: UpdateEstadoFacturaDto,
  ): Promise<FacturaResponseDto> {
    return this.facturasService.updateEstado(id, updateEstadoFacturaDto);
  }
}
