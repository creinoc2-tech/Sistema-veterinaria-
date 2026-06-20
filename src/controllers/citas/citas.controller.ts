import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CitasService } from '../../services/citas/citas.service';
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
import { CreateCitaDto } from '../../dtos/cita/create-cita.dto';
import { CitaResponseDto } from '../../dtos/cita/cita-response.dto';
import { GetUser } from '../../decorators/get-user.decorator';
import { QueryCitaDto } from '../../dtos/cita/cita-service.dto';
import { UpdateCitaDto } from '../../dtos/cita/update-cita.dto';
import { UpdateEstadoCitaDto } from '../../dtos/cita/updateEstado.dto';
@ApiTags('Citas')
@Controller('citas')
export class CitasController {
  constructor(private readonly citasService: CitasService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN, Role.RECEPCIONISTA, Role.VETERINARIO)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new cita' })
  @ApiBody({ type: CreateCitaDto })
  @ApiResponse({
    status: 201,
    description: 'Cita created successfully.',
    type: CitaResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async createCita(
    @Body() createCitaDto: CreateCitaDto,
    @GetUser('id') userId: string,
  ): Promise<CitaResponseDto> {
    return this.citasService.createCita(createCitaDto, userId);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN, Role.RECEPCIONISTA, Role.VETERINARIO)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get all citas' })
  @ApiResponse({
    status: 200,
    description: 'List of citas with pagination',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/CitaResponseDto' },
        },
        meta: {
          type: 'object',
          properties: {
            total: { type: 'number' },
            page: { type: 'number' },
            limit: { type: 'number' },
            totalPages: { type: 'number' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async findAll(@Query() queryDto: QueryCitaDto) {
    return this.citasService.findAll(queryDto);
  }

  @Get('mi-agenda')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.VETERINARIO)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get my agenda (Veterinario only)' })
  @ApiResponse({
    status: 200,
    description: 'List of citas',
    type: [CitaResponseDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'No citas found' })
  async findMyAgenda(
    @GetUser('id') userId: string,
  ): Promise<CitaResponseDto[]> {
    return this.citasService.findByVeterinario(userId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN, Role.RECEPCIONISTA, Role.VETERINARIO)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get cita by id',
  })
  @ApiResponse({
    status: 200,
    description: 'Cita details',
    type: CitaResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Cita not found',
  })
  async findById(@Param('id') id: string): Promise<CitaResponseDto> {
    return this.citasService.findById(id);
  }

  @Get('citas-mascota/:id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN, Role.RECEPCIONISTA, Role.VETERINARIO)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get citas by mascota id',
  })
  @ApiResponse({
    status: 200,
    description: 'Cita details',
    type: [CitaResponseDto],
  })
  @ApiResponse({
    status: 404,
    description: 'Cita not found',
  })
  async findByMascotaId(@Param('id') id: string): Promise<CitaResponseDto[]> {
    return this.citasService.findByMascotaId(id);
  }

  @Get('mis-citas')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.CLIENTE)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get my citas (Cliente only)',
  })
  @ApiResponse({
    status: 200,
    description: 'Cita details',
    type: [CitaResponseDto],
  })
  @ApiResponse({
    status: 404,
    description: 'Cita not found',
  })
  async findMyCitas(@GetUser('id') userId: string): Promise<CitaResponseDto[]> {
    return this.citasService.findByClienteId(userId);
  }

  @Patch(':id/estado')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN, Role.RECEPCIONISTA, Role.VETERINARIO)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update cita estado' })
  @ApiResponse({
    status: 200,
    description: 'Cita estado updated successfully',
    type: CitaResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Cita not found.' })
  async updateEstado(
    @Param('id') id: string,
    @Body() updateEstadoCitaDto: UpdateEstadoCitaDto,
  ): Promise<CitaResponseDto> {
    return this.citasService.updateEstado(id, updateEstadoCitaDto);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN, Role.RECEPCIONISTA)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update cita (Admin only)' })
  @ApiBody({
    type: UpdateCitaDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Cita updated successfully',
    type: CitaResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Cita not found',
  })
  async updateCita(
    @Param('id') id: string,
    @Body() updateCitaDto: UpdateCitaDto,
  ): Promise<CitaResponseDto> {
    return this.citasService.updateCita(id, updateCitaDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN, Role.RECEPCIONISTA, Role.VETERINARIO)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete cita (Admin, Recepcionista, Veterinario)' })
  @ApiResponse({ status: 200, description: 'Cita deleted successfully' })
  @ApiResponse({ status: 404, description: 'Cita not found' })
  async deleteCita(@Param('id') id: string): Promise<{ message: string }> {
    return this.citasService.deleteCita(id);
  }
}
