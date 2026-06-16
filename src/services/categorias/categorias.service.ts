import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CategoryResponseDto } from '../../dtos/category/category-reposense.dto';
import { CreateCategoryDto } from '../../dtos/category/create-category.dto';
import { PrismaService } from '../prisma/prisma.service';
import { QueryCategoryDto } from '../../dtos/category/category-service.dto';
import { Prisma } from '@prisma/client';
import { UpdateCategoryDto } from '../../dtos/category/update-category.dto';

@Injectable()
export class CategoriasService {
  constructor(private readonly prisma: PrismaService) {}

  async createCategory(
    createCategoryDto: CreateCategoryDto,
  ): Promise<CategoryResponseDto> {
    const { name, descripcion } = createCategoryDto;
    const slug = this.generateSlug(name);
    const existingCategory = await this.prisma.category.findUnique({
      where: { slug },
    });

    if (existingCategory) {
      throw new Error('Category with this name already exists');
    }

    const categoria = await this.prisma.category.create({
      data: {
        name,
        descripcion,
        slug,
        isActive: createCategoryDto.isActive ?? true,
      },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    return {
      id: categoria.id,
      name: categoria.name,
      descripcion: categoria.descripcion,
      slug: categoria.slug,
      isActive: categoria.isActive,
      createdAt: categoria.createdAt,
      updatedAt: categoria.updatedAt,
      productCount: categoria._count.products,
    };
  }

  async findAll(): Promise<CategoryResponseDto[]> {
    const categorias = await this.prisma.category.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    return categorias.map((categoria) => ({
      id: categoria.id,
      name: categoria.name,
      descripcion: categoria.descripcion,
      slug: categoria.slug,
      isActive: categoria.isActive ?? true,
      createdAt: categoria.createdAt,
      updatedAt: categoria.updatedAt,
      productCount: categoria._count.products,
    }));
  }

  async findAllActive(queryDto: QueryCategoryDto): Promise<{
    data: CategoryResponseDto[];
    meta: { total: number; page: number; limit: number; totalPages: number };
  }> {
    try {
      const { isActive, search, page = 1, limit = 10 } = queryDto;

      const where: Prisma.CategoryWhereInput = {};
      if (isActive !== undefined) {
        where.isActive = isActive;
      }

      if (search) {
        where.OR = [
          {
            name: { contains: search, mode: 'insensitive' },
          },
          {
            descripcion: { contains: search, mode: 'insensitive' },
          },
        ];
      }

      const total = await this.prisma.category.count({ where });
      const categorias = await this.prisma.category.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: { products: true },
          },
        },
      });

      return {
        data: categorias.map((categoria) => ({
          id: categoria.id,
          name: categoria.name,
          descripcion: categoria.descripcion,
          slug: categoria.slug,
          isActive: categoria.isActive ?? true,
          createdAt: categoria.createdAt,
          updatedAt: categoria.updatedAt,
          productCount: categoria._count.products,
        })),
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw new BadRequestException('Invalid query parameters', error);
    }
  }

  async findById(id: string): Promise<CategoryResponseDto> {
    const categoria = await this.prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    if (!categoria) {
      throw new NotFoundException('Category not found');
    }

    return {
      id: categoria.id,
      name: categoria.name,
      descripcion: categoria.descripcion,
      slug: categoria.slug,
      isActive: categoria.isActive ?? true,
      createdAt: categoria.createdAt,
      updatedAt: categoria.updatedAt,
      productCount: categoria._count.products,
    };
  }

  async findBySlug(slug: string): Promise<CategoryResponseDto> {
    const categoria = await this.prisma.category.findUnique({
      where: { slug },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    if (!categoria) {
      throw new NotFoundException('Category not found');
    }

    return {
      id: categoria.id,
      name: categoria.name,
      descripcion: categoria.descripcion,
      slug: categoria.slug,
      isActive: categoria.isActive ?? true,
      createdAt: categoria.createdAt,
      updatedAt: categoria.updatedAt,
      productCount: categoria._count.products,
    };
  }

  async updateCategory(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<CategoryResponseDto> {
    const existingCategory = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      throw new NotFoundException('Category not found');
    }

    const { name, descripcion, isActive } = updateCategoryDto;
    const slug = name ? this.generateSlug(name) : existingCategory.slug;
    if (name && slug !== existingCategory.slug) {
      const conflict = await this.prisma.category.findFirst({
        where: {
          OR: [{ slug }, { name }],
          NOT: { id }, // excluye la categoría actual
        },
      });

      if (conflict) {
        throw new ConflictException(
          conflict.name === name
            ? 'Category name already exists'
            : 'Category slug already exists',
        );
      }
    }

    const updatedCategory = await this.prisma.category.update({
      where: { id },
      data: {
        name,
        descripcion,
        isActive,
        slug,
      },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    return {
      id: updatedCategory.id,
      name: updatedCategory.name,
      descripcion: updatedCategory.descripcion,
      slug: updatedCategory.slug,
      isActive: updatedCategory.isActive ?? true,
      createdAt: updatedCategory.createdAt,
      updatedAt: updatedCategory.updatedAt,
      productCount: updatedCategory._count.products,
    };
  }

  async deleteCategory(id: string): Promise<{ message: string }> {
    const existingCategory = await this.prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    if (!existingCategory) {
      throw new NotFoundException('Category not found');
    }

    if (existingCategory._count.products > 0) {
      throw new BadRequestException(
        'Cannot delete category with associated products',
      );
    }

    await this.prisma.category.delete({
      where: { id },
    });

    return { message: 'Category deleted successfully' };
  }

  private generateSlug(name: string): string {
    return name.toLowerCase().replace(/\s+/g, '-');
  }
}
