import { Module } from '@nestjs/common';
import { CategoriasService } from '../../services/categorias/categorias.service';
import { CategoriasController } from '../../controllers/categorias/categorias.controller';

@Module({
  imports: [],
  controllers: [CategoriasController],
  providers: [CategoriasService],
})
export class CategoriasModule {}
