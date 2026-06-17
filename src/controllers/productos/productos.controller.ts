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
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ProductosService } from '../../services/productos/productos.service';
import { JwtAuthGuard } from '../../guard/user/jwt-auth.guard';
import { RoleGuard } from '../../guard/user/role.guard';
import { Roles } from '../../decorators/roles.decorator';
import { Role } from '@prisma/client';
import { CreateProductoDto } from '../../dtos/producto/create-producto.dto';
import { ProductResponseDto } from '../../dtos/producto/producto-response.dto';
import { QueryProductoDto } from '../../dtos/producto/producto-service.dto';
import { UpdateProductoDto } from '../../dtos/producto/update-producto.dto';

@ApiTags('Productos')
@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new product' })
  @ApiBody({ type: CreateProductoDto })
  @ApiResponse({
    status: 201,
    description: 'Product created successfully.',
    type: ProductResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async createProducto(
    @Body() createProductoDto: CreateProductoDto,
  ): Promise<ProductResponseDto> {
    return this.productosService.createProduct(createProductoDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all products with optional filters',
  })
  @ApiResponse({
    status: 200,
    description: 'List of products with pagination',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/ProductResponseDto' },
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
  async findAll(@Query() queryDto: QueryProductoDto) {
    return this.productosService.findAll(queryDto);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get product by id',
  })
  @ApiResponse({
    status: 200,
    description: 'Product details',
    type: ProductResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found',
  })
  async findById(@Param('id') id: string): Promise<ProductResponseDto> {
    return this.productosService.findById(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update product (Admin only)' })
  @ApiBody({
    type: UpdateProductoDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Product updated successfully',
    type: ProductResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Product slug already exists',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async updateProducto(
    @Param('id') id: string,
    @Body() updateProductoDto: UpdateProductoDto,
  ): Promise<ProductResponseDto> {
    return this.productosService.updateProduct(id, updateProductoDto);
  }

  @Patch(':id/stock')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update product stock (Admin only)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        quantity: {
          type: 'number',
          description:
            'Stock adjustment ( positive to add, negative to subtract) ',
          example: 10,
        },
      },
      required: ['quantity'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Stock updated successfully',
    type: ProductResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Insufficient stock',
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found',
  })
  async updateStock(
    @Param('id') id: string,
    @Body() body: { quantity: number },
  ): Promise<ProductResponseDto> {
    return this.productosService.updateStock(id, body.quantity);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete product (Admin Only)' })
  @ApiResponse({ status: 200, description: 'Product deleted successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async deleteProduct(@Param('id') id: string): Promise<{ message: string }> {
    return this.productosService.deleteProduct(id);
  }
}
