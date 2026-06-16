import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductoDto } from '../../dtos/producto/create-producto.dto';
import { ProductResponseDto } from '../../dtos/producto/producto-response.dto';
import { QueryProductoDto } from '../../dtos/producto/producto-service.dto';
import { Prisma } from '@prisma/client';
import { UpdateProductoDto } from '../../dtos/producto/update-producto.dto';

@Injectable()
export class ProductosService {
  constructor(private readonly prisma: PrismaService) {}

  async createProduct(
    createProductoDto: CreateProductoDto,
  ): Promise<ProductResponseDto> {
    const { sku, precio, ...producto } = createProductoDto;

    const existingProduct = await this.prisma.product.findUnique({
      where: { sku },
    });
    if (existingProduct) {
      throw new ConflictException('Product with this SKU already exists');
    }
    const productos = await this.prisma.product.create({
      data: {
        name: producto.name || '',
        descripcion: producto.descripcion,
        precio: precio,
        stock: producto.stock,
        sku,
        imageUrl: producto.imageUrl,
        isActive: producto.isActive ?? true,
        categoryId: producto.categoryId,
      },
      include: {
        category: true,
      },
    });
    // ✅ retorna mapeado
    return {
      id: productos.id,
      name: productos.name,
      descripcion: productos.descripcion,
      precio: Number(productos.precio),
      stock: productos.stock,
      sku: productos.sku,
      imageUrl: productos.imageUrl,
      isActive: productos.isActive,
      category: productos.category.name,
      createdAt: productos.createdAt,
      updatedAt: productos.updatedAt,
    };
  }

  async findAll(queryDto: QueryProductoDto): Promise<{
    data: ProductResponseDto[];
    meta: { total: number; page: number; limit: number; totalPages: number };
  }> {
    const { search, category, isActive, page = 1, limit = 10 } = queryDto;
    const where: Prisma.ProductWhereInput = {};
    if (category) {
      where.categoryId = category;
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { descripcion: { contains: search, mode: 'insensitive' } },
      ];
    }

    const total = await this.prisma.product.count({ where });
    const productos = await this.prisma.product.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        category: true,
      },
    });

    return {
      data: productos.map((producto) => ({
        id: producto.id,
        name: producto.name,
        descripcion: producto.descripcion,
        precio: Number(producto.precio),
        stock: producto.stock,
        sku: producto.sku,
        imageUrl: producto.imageUrl,
        isActive: producto.isActive,
        category: producto.category.name,
        createdAt: producto.createdAt,
        updatedAt: producto.updatedAt,
      })),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string): Promise<ProductResponseDto> {
    const productos = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });

    if (!productos) {
      throw new NotFoundException('Product not found');
    }
    return {
      id: productos.id,
      name: productos.name,
      descripcion: productos.descripcion,
      precio: Number(productos.precio),
      stock: productos.stock,
      sku: productos.sku,
      imageUrl: productos.imageUrl,
      isActive: productos.isActive,
      category: productos.category.name,
      createdAt: productos.createdAt,
      updatedAt: productos.updatedAt,
    };
  }

  async updateProduct(
    id: string,
    updateProductoDto: UpdateProductoDto,
  ): Promise<ProductResponseDto> {
    const { sku, precio, ...producto } = updateProductoDto;

    const existingProduct = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      throw new NotFoundException('Product not found');
    }

    if (sku && sku !== existingProduct.sku) {
      const existingSku = await this.prisma.product.findUnique({
        where: { sku },
      });
      if (existingSku) {
        throw new ConflictException('Product with this SKU already exists');
      }
    }

    const updatedProduct = await this.prisma.product.update({
      where: { id },
      data: {
        ...producto,
        sku: sku ?? existingProduct.sku,
        precio: precio ?? existingProduct.precio,
      },
      include: {
        category: true,
      },
    });

    return {
      id: updatedProduct.id,
      name: updatedProduct.name,
      descripcion: updatedProduct.descripcion,
      precio: Number(updatedProduct.precio),
      stock: updatedProduct.stock,
      sku: updatedProduct.sku,
      imageUrl: updatedProduct.imageUrl,
      isActive: updatedProduct.isActive,
      category: updatedProduct.category.name,
      createdAt: updatedProduct.createdAt,
      updatedAt: updatedProduct.updatedAt,
    };
  }

  async updateStock(id: string, quantity: number): Promise<ProductResponseDto> {
    const existingProduct = await this.prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!existingProduct) {
      throw new NotFoundException('Product not found');
    }

    const newStock = existingProduct.stock + quantity;
    if (newStock < 0) {
      throw new BadRequestException('Insufficient stock');
    }

    const updatedProduct = await this.prisma.product.update({
      where: { id },
      data: { stock: newStock },
      include: { category: true },
    });

    return {
      id: updatedProduct.id,
      name: updatedProduct.name,
      descripcion: updatedProduct.descripcion,
      precio: Number(updatedProduct.precio),
      stock: updatedProduct.stock,
      sku: updatedProduct.sku,
      imageUrl: updatedProduct.imageUrl,
      isActive: updatedProduct.isActive,
      category: updatedProduct.category.name,
      createdAt: updatedProduct.createdAt,
      updatedAt: updatedProduct.updatedAt,
    };
  }

  async deleteProduct(id: string): Promise<{ message: string }> {
    const existingProduct = await this.prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!existingProduct) {
      throw new NotFoundException('Product not found');
    }
    await this.prisma.product.delete({
      where: { id },
    });
    return { message: 'Product deleted successfully' };
  }
}
