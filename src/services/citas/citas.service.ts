import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CitaResponseDto } from '../../dtos/cita/cita-response.dto';
import { CreateCitaDto } from '../../dtos/cita/create-cita.dto';
import { QueryCitaDto } from '../../dtos/cita/cita-service.dto';
import { Prisma } from '@prisma/client';
import { UpdateEstadoCitaDto } from '../../dtos/cita/updateEstado.dto';
import { UpdateCitaDto } from '../../dtos/cita/update-cita.dto';

@Injectable()
export class CitasService {
  constructor(private readonly prisma: PrismaService) {}

  async createCita(
    createCitaDto: CreateCitaDto,
    userId: string,
  ): Promise<CitaResponseDto> {
    const { mascotaId, veterinarioId, clienteId, fecha } = createCitaDto;

    const mascota = await this.prisma.mascota.findUnique({
      where: { id: mascotaId },
    });

    if (!mascota) {
      throw new NotFoundException('mascotaId is required');
    }
    const veterinario = await this.prisma.user.findUnique({
      where: { id: veterinarioId, role: 'VETERINARIO' },
    });
    if (!veterinario) {
      throw new NotFoundException('veterinarioId is required');
    }

    const cliente = await this.prisma.user.findUnique({
      where: { id: clienteId, role: 'CLIENTE' },
    });

    if (!cliente) {
      throw new NotFoundException('clienteId is required');
    }

    const citaExistente = await this.prisma.cita.findFirst({
      where: {
        veterinarioId,
        fecha: new Date(fecha),
        hora: createCitaDto.hora,
      },
    });
    if (citaExistente) {
      throw new NotFoundException(
        'El veterinario ya tiene una cita en esa fecha y hora',
      );
    }

    const cita = await this.prisma.cita.create({
      data: {
        fecha,
        hora: createCitaDto.hora,
        motivo: createCitaDto.motivo,
        tipo: createCitaDto.tipo,
        notas: createCitaDto.notas,
        mascotaId,
        veterinarioId,
        creadoPorId: userId,
        clienteId,
      },
      include: {
        mascota: {
          select: {
            id: true,
            name: true,
            raza: true,
            sexo: true,
          },
        },
        veterinario: {
          select: {
            id: true,
            email: true,
            firstname: true,
            lastname: true,
          },
        },
        creadoPor: {
          select: {
            id: true,
            email: true,
            firstname: true,
            lastname: true,
          },
        },
        cliente: {
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
      id: cita.id,
      fecha: cita.fecha,
      hora: cita.hora,
      motivo: cita.motivo,
      estado: cita.estado,
      tipo: cita.tipo,
      notas: cita.notas,
      mascotaId: {
        id: cita.mascota.id,
        name: cita.mascota.name,
        raza: cita.mascota.raza,
        sexo: cita.mascota.sexo,
      },
      veterinarioId: {
        id: cita.veterinario.id,
        email: cita.veterinario.email,
        firstname: cita.veterinario.firstname,
        lastname: cita.veterinario.lastname,
      },
      creadoPorId: {
        id: cita.creadoPor.id,
        email: cita.creadoPor.email,
        firstname: cita.creadoPor.firstname,
        lastname: cita.creadoPor.lastname,
      },
      clienteId: {
        id: cita.cliente.id,
        email: cita.cliente.email,
        firstname: cita.cliente.firstname,
        lastname: cita.cliente.lastname,
      },
      createdAt: cita.createdAt,
      updatedAt: cita.updatedAt,
    };
  }

  async findAll(queryDto: QueryCitaDto): Promise<{
    data: CitaResponseDto[];
    meta: { total: number; page: number; limit: number; totalPages: number };
  }> {
    const { estado, tipo, search, page = 1, limit = 10 } = queryDto;

    const where: Prisma.CitaWhereInput = {};

    if (estado) {
      where.estado = estado;
    }

    if (tipo) {
      where.tipo = tipo;
    }

    if (search) {
      where.OR = [
        { mascota: { name: { contains: search, mode: 'insensitive' } } },
        { mascota: { raza: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const total = await this.prisma.cita.count({ where });

    const citas = await this.prisma.cita.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        mascota: {
          select: {
            id: true,
            name: true,
            raza: true,
            sexo: true,
            dueno: {
              select: {
                id: true,
                email: true,
                firstname: true,
                lastname: true,
              },
            },
          },
        },
        veterinario: {
          select: {
            id: true,
            email: true,
            firstname: true,
            lastname: true,
          },
        },
        creadoPor: {
          select: {
            id: true,
            email: true,
            firstname: true,
            lastname: true,
          },
        },
      },
    });

    const totalPages = Math.ceil(total / limit);

    return {
      data: citas.map((cita) => ({
        id: cita.id,
        fecha: cita.fecha,
        hora: cita.hora,
        motivo: cita.motivo,
        estado: cita.estado,
        tipo: cita.tipo,
        notas: cita.notas,
        mascotaId: {
          id: cita.mascota.id,
          name: cita.mascota.name,
          raza: cita.mascota.raza,
          sexo: cita.mascota.sexo,
          dueno: {
            id: cita.mascota.dueno.id,
            email: cita.mascota.dueno.email,
            firstname: cita.mascota.dueno.firstname,
            lastname: cita.mascota.dueno.lastname,
          },
        },
        veterinarioId: {
          id: cita.veterinario.id,
          email: cita.veterinario.email,
          firstname: cita.veterinario.firstname,
          lastname: cita.veterinario.lastname,
        },
        creadoPorId: {
          id: cita.creadoPor.id,
          email: cita.creadoPor.email,
          firstname: cita.creadoPor.firstname,
          lastname: cita.creadoPor.lastname,
        },

        createdAt: cita.createdAt,
        updatedAt: cita.updatedAt,
      })),
      meta: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  }

  async findById(id: string): Promise<CitaResponseDto> {
    const cita = await this.prisma.cita.findUnique({
      where: { id },
      include: {
        mascota: {
          select: {
            id: true,
            name: true,
            raza: true,
            sexo: true,
            dueno: {
              select: {
                id: true,
                email: true,
                firstname: true,
                lastname: true,
              },
            },
          },
        },
        veterinario: {
          select: {
            id: true,
            email: true,
            firstname: true,
            lastname: true,
          },
        },
        creadoPor: {
          select: {
            id: true,
            email: true,
            firstname: true,
            lastname: true,
          },
        },
      },
    });

    if (!cita) {
      throw new NotFoundException('Cita not found');
    }

    return {
      id: cita.id,
      fecha: cita.fecha,
      hora: cita.hora,
      motivo: cita.motivo,
      estado: cita.estado,
      tipo: cita.tipo,
      notas: cita.notas,
      mascotaId: {
        id: cita.mascota.id,
        name: cita.mascota.name,
        raza: cita.mascota.raza,
        sexo: cita.mascota.sexo,
        dueno: {
          id: cita.mascota.dueno.id,
          email: cita.mascota.dueno.email,
          firstname: cita.mascota.dueno.firstname,
          lastname: cita.mascota.dueno.lastname,
        },
      },
      veterinarioId: {
        id: cita.veterinario.id,
        email: cita.veterinario.email,
        firstname: cita.veterinario.firstname,
        lastname: cita.veterinario.lastname,
      },
      creadoPorId: {
        id: cita.creadoPor.id,
        email: cita.creadoPor.email,
        firstname: cita.creadoPor.firstname,
        lastname: cita.creadoPor.lastname,
      },

      createdAt: cita.createdAt,
      updatedAt: cita.updatedAt,
    };
  }

  async findByVeterinario(userId: string): Promise<CitaResponseDto[]> {
    const citas = await this.prisma.cita.findMany({
      where: { veterinarioId: userId },
      include: {
        mascota: {
          select: {
            id: true,
            name: true,
            raza: true,
            sexo: true,
            dueno: {
              select: {
                id: true,
                email: true,
                firstname: true,
                lastname: true,
              },
            },
          },
        },
        veterinario: {
          select: {
            id: true,
            email: true,
            firstname: true,
            lastname: true,
          },
        },
        creadoPor: {
          select: {
            id: true,
            email: true,
            firstname: true,
            lastname: true,
          },
        },
      },
    });

    return citas.map((cita) => ({
      id: cita.id,
      fecha: cita.fecha,
      hora: cita.hora,
      motivo: cita.motivo,
      estado: cita.estado,
      tipo: cita.tipo,
      notas: cita.notas,
      mascotaId: {
        id: cita.mascota.id,
        name: cita.mascota.name,
        raza: cita.mascota.raza,
        sexo: cita.mascota.sexo,
        dueno: {
          id: cita.mascota.dueno.id,
          email: cita.mascota.dueno.email,
          firstname: cita.mascota.dueno.firstname,
          lastname: cita.mascota.dueno.lastname,
        },
      },
      veterinarioId: {
        id: cita.veterinario.id,
        email: cita.veterinario.email,
        firstname: cita.veterinario.firstname,
        lastname: cita.veterinario.lastname,
      },
      creadoPorId: {
        id: cita.creadoPor.id,
        email: cita.creadoPor.email,
        firstname: cita.creadoPor.firstname,
        lastname: cita.creadoPor.lastname,
      },

      createdAt: cita.createdAt,
      updatedAt: cita.updatedAt,
    }));
  }

  async findByMascotaId(id: string): Promise<CitaResponseDto[]> {
    const citas = await this.prisma.cita.findMany({
      where: { mascotaId: id },
      include: {
        mascota: {
          select: {
            id: true,
            name: true,
            raza: true,
            sexo: true,
            dueno: {
              select: {
                id: true,
                email: true,
                firstname: true,
                lastname: true,
              },
            },
          },
        },
        veterinario: {
          select: {
            id: true,
            email: true,
            firstname: true,
            lastname: true,
          },
        },
        creadoPor: {
          select: {
            id: true,
            email: true,
            firstname: true,
            lastname: true,
          },
        },
      },
    });

    return citas.map((cita) => ({
      id: cita.id,
      fecha: cita.fecha,
      hora: cita.hora,
      motivo: cita.motivo,
      estado: cita.estado,
      tipo: cita.tipo,
      notas: cita.notas,
      mascotaId: {
        id: cita.mascota.id,
        name: cita.mascota.name,
        raza: cita.mascota.raza,
        sexo: cita.mascota.sexo,
        dueno: {
          id: cita.mascota.dueno.id,
          email: cita.mascota.dueno.email,
          firstname: cita.mascota.dueno.firstname,
          lastname: cita.mascota.dueno.lastname,
        },
      },
      veterinarioId: {
        id: cita.veterinario.id,
        email: cita.veterinario.email,
        firstname: cita.veterinario.firstname,
        lastname: cita.veterinario.lastname,
      },
      creadoPorId: {
        id: cita.creadoPor.id,
        email: cita.creadoPor.email,
        firstname: cita.creadoPor.firstname,
        lastname: cita.creadoPor.lastname,
      },

      createdAt: cita.createdAt,
      updatedAt: cita.updatedAt,
    }));
  }

  async findByClienteId(id: string): Promise<CitaResponseDto[]> {
    const citas = await this.prisma.cita.findMany({
      where: { clienteId: id },
      include: {
        mascota: {
          select: {
            id: true,
            name: true,
            raza: true,
            sexo: true,
            dueno: {
              select: {
                id: true,
                email: true,
                firstname: true,
                lastname: true,
              },
            },
          },
        },
        veterinario: {
          select: {
            id: true,
            email: true,
            firstname: true,
            lastname: true,
          },
        },
        creadoPor: {
          select: {
            id: true,
            email: true,
            firstname: true,
            lastname: true,
          },
        },
        cliente: {
          select: {
            id: true,
            email: true,
            firstname: true,
            lastname: true,
          },
        },
      },
    });

    return citas.map((cita) => ({
      id: cita.id,
      fecha: cita.fecha,
      hora: cita.hora,
      motivo: cita.motivo,
      estado: cita.estado,
      tipo: cita.tipo,
      notas: cita.notas,
      mascotaId: {
        id: cita.mascota.id,
        name: cita.mascota.name,
        raza: cita.mascota.raza,
        sexo: cita.mascota.sexo,
        dueno: {
          id: cita.mascota.dueno.id,
          email: cita.mascota.dueno.email,
          firstname: cita.mascota.dueno.firstname,
          lastname: cita.mascota.dueno.lastname,
        },
      },
      veterinarioId: {
        id: cita.veterinario.id,
        email: cita.veterinario.email,
        firstname: cita.veterinario.firstname,
        lastname: cita.veterinario.lastname,
      },
      creadoPorId: {
        id: cita.creadoPor.id,
        email: cita.creadoPor.email,
        firstname: cita.creadoPor.firstname,
        lastname: cita.creadoPor.lastname,
      },
      clienteId: {
        id: cita.cliente.id,
        email: cita.cliente.email,
        firstname: cita.cliente.firstname,
        lastname: cita.cliente.lastname,
      },

      createdAt: cita.createdAt,
      updatedAt: cita.updatedAt,
    }));
  }
  async updateEstado(
    id: string,
    updateEstadoCitaDto: UpdateEstadoCitaDto,
  ): Promise<CitaResponseDto> {
    const existingCita = await this.prisma.cita.findUnique({ where: { id } });
    if (!existingCita) {
      throw new NotFoundException('Cita not found');
    }
    const updatedCita = await this.prisma.cita.update({
      where: { id },
      data: {
        estado: updateEstadoCitaDto.estado,
      },
      include: {
        mascota: {
          select: {
            id: true,
            name: true,
            raza: true,
            sexo: true,
            dueno: {
              select: {
                id: true,
                email: true,
                firstname: true,
                lastname: true,
              },
            },
          },
        },
        veterinario: {
          select: {
            id: true,
            email: true,
            firstname: true,
            lastname: true,
          },
        },
        creadoPor: {
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
      id: updatedCita.id,
      fecha: updatedCita.fecha,
      hora: updatedCita.hora,
      motivo: updatedCita.motivo,
      estado: updatedCita.estado,
      tipo: updatedCita.tipo,
      notas: updatedCita.notas,
      mascotaId: {
        id: updatedCita.mascota.id,
        name: updatedCita.mascota.name,
        raza: updatedCita.mascota.raza,
        sexo: updatedCita.mascota.sexo,
        dueno: {
          id: updatedCita.mascota.dueno.id,
          email: updatedCita.mascota.dueno.email,
          firstname: updatedCita.mascota.dueno.firstname,
          lastname: updatedCita.mascota.dueno.lastname,
        },
      },
      veterinarioId: {
        id: updatedCita.veterinario.id,
        email: updatedCita.veterinario.email,
        firstname: updatedCita.veterinario.firstname,
        lastname: updatedCita.veterinario.lastname,
      },
      creadoPorId: {
        id: updatedCita.creadoPor.id,
        email: updatedCita.creadoPor.email,
        firstname: updatedCita.creadoPor.firstname,
        lastname: updatedCita.creadoPor.lastname,
      },

      createdAt: updatedCita.createdAt,
      updatedAt: updatedCita.updatedAt,
    };
  }

  async updateCita(
    id: string,
    updateCitaDto: UpdateCitaDto,
  ): Promise<CitaResponseDto> {
    const existingCita = await this.prisma.cita.findUnique({ where: { id } });
    if (!existingCita) {
      throw new NotFoundException('Cita not found');
    }
    const updatedCita = await this.prisma.cita.update({
      where: { id },
      data: updateCitaDto,
      include: {
        mascota: {
          select: {
            id: true,
            name: true,
            raza: true,
            sexo: true,
            dueno: {
              select: {
                id: true,
                email: true,
                firstname: true,
                lastname: true,
              },
            },
          },
        },
        veterinario: {
          select: {
            id: true,
            email: true,
            firstname: true,
            lastname: true,
          },
        },
        creadoPor: {
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
      id: updatedCita.id,
      fecha: updatedCita.fecha,
      hora: updatedCita.hora,
      motivo: updatedCita.motivo,
      estado: updatedCita.estado,
      tipo: updatedCita.tipo,
      notas: updatedCita.notas,
      mascotaId: {
        id: updatedCita.mascota.id,
        name: updatedCita.mascota.name,
        raza: updatedCita.mascota.raza,
        sexo: updatedCita.mascota.sexo,
        dueno: {
          id: updatedCita.mascota.dueno.id,
          email: updatedCita.mascota.dueno.email,
          firstname: updatedCita.mascota.dueno.firstname,
          lastname: updatedCita.mascota.dueno.lastname,
        },
      },
      veterinarioId: {
        id: updatedCita.veterinario.id,
        email: updatedCita.veterinario.email,
        firstname: updatedCita.veterinario.firstname,
        lastname: updatedCita.veterinario.lastname,
      },
      creadoPorId: {
        id: updatedCita.creadoPor.id,
        email: updatedCita.creadoPor.email,
        firstname: updatedCita.creadoPor.firstname,
        lastname: updatedCita.creadoPor.lastname,
      },

      createdAt: updatedCita.createdAt,
      updatedAt: updatedCita.updatedAt,
    };
  }

  async deleteCita(id: string): Promise<{ message: string }> {
    const existingCita = await this.prisma.cita.findUnique({ where: { id } });
    if (!existingCita) {
      throw new NotFoundException('Cita not found');
    }
    await this.prisma.cita.delete({ where: { id } });
    return { message: 'Cita deleted successfully' };
  }
}
