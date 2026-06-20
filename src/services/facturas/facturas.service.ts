import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FacturaResponseDto } from '../../dtos/factura/factura-reponse.dto';
import { CreateFacturaDto } from '../../dtos/factura/create-factura.dto';
import { Role } from '@prisma/client';
import { UpdateEstadoFacturaDto } from '../../dtos/factura/update-estado.dto';

@Injectable()
export class FacturasService {
  constructor(private readonly prisma: PrismaService) {}

  async createFactura(
    createFacturaDto: CreateFacturaDto,
  ): Promise<FacturaResponseDto> {
    const { metodoPago, items, citaId } = createFacturaDto;

    const cita = await this.prisma.cita.findUnique({
      where: { id: citaId },
    });
    if (!cita) {
      throw new NotFoundException('Cita not found');
    }

    const facturaExistente = await this.prisma.factura.findUnique({
      where: { citaId },
    });

    if (facturaExistente) {
      throw new BadRequestException('Esta cita ya tiene una factura generada');
    }

    const productIds = items.map((item) => item.productId);
    const productos = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    if (productos.length !== productIds.length) {
      throw new NotFoundException('Uno o más productos no existen');
    }

    // 4. Calcular subtotal, iva y total usando el precio REAL de la BD
    let subtotal = 0;
    const itemsData = items.map((item) => {
      const producto = productos.find((p) => p.id === item.productId)!;
      const precio = Number(producto.precio);
      subtotal += precio * item.cantidad;
      return {
        productId: item.productId,
        cantidad: item.cantidad,
        precio, // ← precio tomado de la BD, nunca del cliente
      };
    });

    const iva = subtotal * 0.15;
    const total = subtotal + iva;

    // 5. Crear la Factura y sus FacturaItem en una sola transacción
    const factura = await this.prisma.factura.create({
      data: {
        userId: cita.clienteId, // ← el dueño de la factura viene de la cita
        citaId,
        metodoPago,
        subtotal,
        iva,
        total,
        items: {
          create: itemsData, // ← crea todos los FacturaItem de una vez
        },
      },
      include: {
        user: {
          select: { id: true, email: true, firstname: true, lastname: true },
        },
        cita: {
          select: { id: true, fecha: true, motivo: true, tipo: true },
        },
        items: {
          include: {
            product: {
              select: { id: true, name: true, sku: true },
            },
          },
        },
      },
    });

    return {
      id: factura.id,
      numero: factura.numero,
      subtotal: Number(factura.subtotal),
      iva: Number(factura.iva),
      total: Number(factura.total),
      metodoPago: factura.metodoPago,
      estadoPago: factura.estadoPago,
      user: factura.user,
      cita: factura.cita,
      items: factura.items.map((item) => ({
        id: item.id,
        product: item.product,
        cantidad: item.cantidad,
        precio: Number(item.precio),
        subtotal: Number(item.precio) * item.cantidad,
      })),
      createdAt: factura.createdAt,
      updatedAt: factura.updatedAt,
    };
  }

  async getAll(): Promise<FacturaResponseDto[]> {
    const facturas = await this.prisma.factura.findMany({
      include: {
        user: {
          select: { id: true, email: true, firstname: true, lastname: true },
        },
        cita: {
          select: { id: true, fecha: true, motivo: true, tipo: true },
        },
        items: {
          include: {
            product: { select: { id: true, name: true, sku: true } },
          },
        },
      },
    });

    return facturas.map((factura) => ({
      id: factura.id,
      numero: factura.numero,
      subtotal: Number(factura.subtotal),
      iva: Number(factura.iva),
      total: Number(factura.total),
      metodoPago: factura.metodoPago,
      estadoPago: factura.estadoPago,
      user: factura.user,
      cita: factura.cita,
      items: factura.items.map((item) => ({
        id: item.id,
        product: item.product,
        cantidad: item.cantidad,
        precio: Number(item.precio),
        subtotal: Number(item.precio) * item.cantidad,
      })),
      createdAt: factura.createdAt,
      updatedAt: factura.updatedAt,
    }));
  }

  async findByIdForUser(userId: string): Promise<FacturaResponseDto[]> {
    const facturas = await this.prisma.factura.findMany({
      where: { userId },
      include: {
        user: {
          select: { id: true, email: true, firstname: true, lastname: true },
        },
        cita: {
          select: { id: true, fecha: true, motivo: true, tipo: true },
        },
        items: {
          include: {
            product: { select: { id: true, name: true, sku: true } },
          },
        },
      },
    });

    return facturas.map((factura) => ({
      id: factura.id,
      numero: factura.numero,
      subtotal: Number(factura.subtotal),
      iva: Number(factura.iva),
      total: Number(factura.total),
      metodoPago: factura.metodoPago,
      estadoPago: factura.estadoPago,
      user: factura.user,
      cita: factura.cita,
      items: factura.items.map((item) => ({
        id: item.id,
        product: item.product,
        cantidad: item.cantidad,
        precio: Number(item.precio),
        subtotal: Number(item.precio) * item.cantidad,
      })),
      createdAt: factura.createdAt,
      updatedAt: factura.updatedAt,
    }));
  }

  async findById(
    id: string,
    userId: string,
    role: Role,
  ): Promise<FacturaResponseDto> {
    const factura = await this.prisma.factura.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, email: true, firstname: true, lastname: true },
        },
        cita: {
          select: { id: true, fecha: true, motivo: true, tipo: true },
        },
        items: {
          include: {
            product: { select: { id: true, name: true, sku: true } },
          },
        },
      },
    });

    if (!factura) {
      throw new NotFoundException('Factura not found');
    }

    if (role === 'CLIENTE' && factura.userId !== userId) {
      throw new NotFoundException('Factura not found');
    }

    return {
      id: factura.id,
      numero: factura.numero,
      subtotal: Number(factura.subtotal),
      iva: Number(factura.iva),
      total: Number(factura.total),
      metodoPago: factura.metodoPago,
      estadoPago: factura.estadoPago,
      user: factura.user,
      cita: factura.cita,
      items: factura.items.map((item) => ({
        id: item.id,
        product: item.product,
        cantidad: item.cantidad,
        precio: Number(item.precio),
        subtotal: Number(item.precio) * item.cantidad,
      })),
      createdAt: factura.createdAt,
      updatedAt: factura.updatedAt,
    };
  }

  async updateEstado(
    id: string,
    updateEstadoFacturaDto: UpdateEstadoFacturaDto,
  ): Promise<FacturaResponseDto> {
    const existingFactura = await this.prisma.factura.findUnique({
      where: { id },
    });
    if (!existingFactura) {
      throw new NotFoundException('Factura not found');
    }

    if (existingFactura.estadoPago === 'ANULADO') {
      throw new BadRequestException(
        'No se puede modificar una factura anulada',
      );
    }
    const factura = await this.prisma.factura.update({
      where: { id },
      data: { estadoPago: updateEstadoFacturaDto.estadoPago },
      include: {
        user: {
          select: { id: true, email: true, firstname: true, lastname: true },
        },
        cita: {
          select: { id: true, fecha: true, motivo: true, tipo: true },
        },
        items: {
          include: {
            product: { select: { id: true, name: true, sku: true } },
          },
        },
      },
    });

    return {
      id: factura.id,
      numero: factura.numero,
      subtotal: Number(factura.subtotal),
      iva: Number(factura.iva),
      total: Number(factura.total),
      metodoPago: factura.metodoPago,
      estadoPago: factura.estadoPago,
      user: factura.user,
      cita: factura.cita,
      items: factura.items.map((item) => ({
        id: item.id,
        product: item.product,
        cantidad: item.cantidad,
        precio: Number(item.precio),
        subtotal: Number(item.precio) * item.cantidad,
      })),
      createdAt: factura.createdAt,
      updatedAt: factura.updatedAt,
    };
  }
}
