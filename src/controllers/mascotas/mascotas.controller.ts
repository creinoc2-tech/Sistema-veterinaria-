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
import { MascotasService } from '../../services/mascotas/mascotas.service';
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
import { CreateMascotaDto } from '../../dtos/mascota/create-mascota.dto';
import { MascotaResponseDto } from '../../dtos/mascota/mascota-response.dto';
import { GetUser } from '../../decorators/get-user.decorator';
import { QueryMascotaDto } from '../../dtos/mascota/mascotas-service.dto';
import { UpdateMascotaDto } from '../../dtos/mascota/update-producto.dto';
@ApiTags('Mascotas')
@Controller('mascotas')
export class MascotasController {
  constructor(private readonly mascotasService: MascotasService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new mascota' })
  @ApiBody({ type: CreateMascotaDto })
  @ApiResponse({
    status: 201,
    description: 'Mascota created successfully.',
    type: MascotaResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async createMascota(
    @Body() createMascotaDto: CreateMascotaDto,
  ): Promise<MascotaResponseDto> {
    return this.mascotasService.createMascota(createMascotaDto);
  }

  @Post('create/user')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new mascota for a user' })
  @ApiBody({ type: CreateMascotaDto })
  @ApiResponse({
    status: 201,
    description: 'Mascota created successfully.',
    type: MascotaResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async createMascotaForUser(
    @GetUser('id') userId: string,
    @Body() createMascotaDto: CreateMascotaDto,
  ): Promise<MascotaResponseDto> {
    return this.mascotasService.createMascota(createMascotaDto, userId);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all mascotas with optional filters',
  })
  @ApiResponse({
    status: 200,
    description: 'List of mascotas with pagination',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/MascotaResponseDto' },
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
  async findAll(@Query() queryDto: QueryMascotaDto) {
    return this.mascotasService.findAll(queryDto);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get mascota by id',
  })
  @ApiResponse({
    status: 200,
    description: 'Mascota details',
    type: MascotaResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Mascota not found',
  })
  async findById(@Param('id') id: string): Promise<MascotaResponseDto> {
    return this.mascotasService.findById(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update mascota (Admin only)' })
  @ApiBody({
    type: UpdateMascotaDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Mascota updated successfully',
    type: MascotaResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Mascota not found',
  })
  async updateMascota(
    @Param('id') id: string,
    @Body() updateMascotaDto: UpdateMascotaDto,
  ): Promise<MascotaResponseDto> {
    return this.mascotasService.updateMascota(id, updateMascotaDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete mascota (Admin Only)' })
  @ApiResponse({ status: 200, description: 'Mascota deleted successfully' })
  @ApiResponse({ status: 404, description: 'Mascota not found' })
  async deleteMascota(@Param('id') id: string): Promise<{ message: string }> {
    return this.mascotasService.deleteMascota(id);
  }
}
