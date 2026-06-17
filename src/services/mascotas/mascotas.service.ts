import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MascotaResponseDto } from '../../dtos/mascota/mascota-response.dto';
import { CreateMascotaDto } from '../../dtos/mascota/create-mascota.dto';
import { QueryMascotaDto } from '../../dtos/mascota/mascotas-service.dto';
import { Prisma } from '@prisma/client';
import { UpdateMascotaDto } from '../../dtos/mascota/update-producto.dto';

@Injectable()
export class MascotasService {
  constructor(private readonly prisma: PrismaService) {}

  async createMascota(
    createMascotaDto: CreateMascotaDto,
    userId?: string,
  ): Promise<MascotaResponseDto> {
    const duenoId = userId || createMascotaDto.duenoId;

    // ✅ validar que el duenoId existe
    if (!duenoId) {
      throw new BadRequestException('duenoId is required');
    }

    const existingDueno = await this.prisma.user.findUnique({
      where: { id: duenoId },
    });
    if (!existingDueno) {
      throw new NotFoundException('Owner not found');
    }
    const mascota = await this.prisma.mascota.create({
      data: {
        name: createMascotaDto.name,
        especie: createMascotaDto.especie,
        raza: createMascotaDto.raza,
        sexo: createMascotaDto.sexo,
        fechaNac: createMascotaDto.fechaNac,
        peso: createMascotaDto.peso,
        foto: createMascotaDto.foto,
        color: createMascotaDto.color,
        duenoId: duenoId,
      },
      include: {
        dueno: {
          select: {
            id: true,
            email: true,
            firstname: true,
            lastname: true,
          },
        },
      },
    });

    return {
      id: mascota.id,
      name: mascota.name,
      especie: mascota.especie,
      raza: mascota.raza,
      sexo: mascota.sexo,
      fechaNac: mascota.fechaNac,
      peso: mascota.peso,
      color: mascota.color,
      foto: mascota.foto,
      duenoId: {
        id: mascota.dueno.id,
        email: mascota.dueno.email,
        firstname: mascota.dueno.firstname,
        lastname: mascota.dueno.lastname,
      },
      createdAt: mascota.createdAt,
      updatedAt: mascota.updatedAt,
    };
  }

  async findAll(queryDto: QueryMascotaDto): Promise<{
    data: MascotaResponseDto[];
    meta: { total: number; page: number; limit: number; totalPages: number };
  }> {
    const { especie, search, page = 1, limit = 10 } = queryDto;

    const where: Prisma.MascotaWhereInput = {};

    if (especie) {
      where.especie = especie;
    }

    if (search) {
      where.OR = [
        {
          name: { contains: search, mode: 'insensitive' },
        },
        {
          raza: { contains: search, mode: 'insensitive' },
        },
      ];
    }

    const total = await this.prisma.mascota.count({ where });
    const mascotas = await this.prisma.mascota.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        dueno: {
          select: {
            id: true,
            email: true,
            firstname: true,
            lastname: true,
          },
        },
      },
    });

    return {
      data: mascotas.map((mascota) => ({
        id: mascota.id,
        name: mascota.name,
        especie: mascota.especie,
        raza: mascota.raza,
        sexo: mascota.sexo,
        fechaNac: mascota.fechaNac,
        peso: mascota.peso,
        color: mascota.color,
        foto: mascota.foto,
        duenoId: {
          id: mascota.dueno.id,
          email: mascota.dueno.email,
          firstname: mascota.dueno.firstname,
          lastname: mascota.dueno.lastname,
        },
        createdAt: mascota.createdAt,
        updatedAt: mascota.updatedAt,
      })),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string): Promise<MascotaResponseDto> {
    const mascota = await this.prisma.mascota.findUnique({
      where: { id },
      include: {
        dueno: {
          select: {
            id: true,
            email: true,
            firstname: true,
            lastname: true,
          },
        },
      },
    });

    if (!mascota) {
      throw new NotFoundException('Mascota not found');
    }

    return {
      id: mascota.id,
      name: mascota.name,
      especie: mascota.especie,
      raza: mascota.raza,
      sexo: mascota.sexo,
      fechaNac: mascota.fechaNac,
      peso: mascota.peso,
      color: mascota.color,
      foto: mascota.foto,
      duenoId: {
        id: mascota.dueno.id,
        email: mascota.dueno.email,
        firstname: mascota.dueno.firstname,
        lastname: mascota.dueno.lastname,
      },
      createdAt: mascota.createdAt,
      updatedAt: mascota.updatedAt,
    };
  }

  async updateMascota(
    id: string,
    updateMascotaDto: UpdateMascotaDto,
  ): Promise<MascotaResponseDto> {
    const existingMascota = await this.prisma.mascota.findUnique({
      where: { id },
      include: { dueno: true },
    });

    if (!existingMascota) {
      throw new NotFoundException('Mascota not found');
    }

    const updatedMascota = await this.prisma.mascota.update({
      where: { id },
      data: updateMascotaDto,
      include: { dueno: true },
    });

    return {
      id: updatedMascota.id,
      name: updatedMascota.name,
      especie: updatedMascota.especie,
      raza: updatedMascota.raza,
      sexo: updatedMascota.sexo,
      fechaNac: updatedMascota.fechaNac,
      peso: updatedMascota.peso,
      color: updatedMascota.color,
      foto: updatedMascota.foto,
      duenoId: {
        id: updatedMascota.dueno.id,
        email: updatedMascota.dueno.email,
        firstname: updatedMascota.dueno.firstname,
        lastname: updatedMascota.dueno.lastname,
      },
      createdAt: updatedMascota.createdAt,
      updatedAt: updatedMascota.updatedAt,
    };
  }

  async findByIdForUser(userId: string): Promise<MascotaResponseDto[]> {
    const mascotas = await this.prisma.mascota.findMany({
      where: { duenoId: userId },
      include: {
        dueno: {
          select: {
            id: true,
            email: true,
            firstname: true,
            lastname: true,
          },
        },
      },
    });

    return mascotas.map((mascota) => ({
      id: mascota.id,
      name: mascota.name,
      especie: mascota.especie,
      raza: mascota.raza,
      sexo: mascota.sexo,
      fechaNac: mascota.fechaNac,
      peso: mascota.peso,
      color: mascota.color,
      foto: mascota.foto,
      duenoId: {
        id: mascota.dueno.id,
        email: mascota.dueno.email,
        firstname: mascota.dueno.firstname,
        lastname: mascota.dueno.lastname,
      },
      createdAt: mascota.createdAt,
      updatedAt: mascota.updatedAt,
    }));
  }

  async deleteMascota(id: string): Promise<{ message: string }> {
    const existingMascota = await this.prisma.mascota.findUnique({
      where: { id },
    });

    if (!existingMascota) {
      throw new NotFoundException('Mascota not found');
    }

    await this.prisma.mascota.delete({
      where: { id },
    });

    return { message: 'Mascota deleted successfully' };
  }
}
