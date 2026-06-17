import { Module } from '@nestjs/common';
import { MascotasController } from '../../controllers/mascotas/mascotas.controller';
import { MascotasService } from '../../services/mascotas/mascotas.service';

@Module({
  imports: [],
  controllers: [MascotasController],
  providers: [MascotasService],
})
export class MascotasModule {}
