import { Module } from '@nestjs/common';
import { CitasService } from '../../services/citas/citas.service';
import { CitasController } from '../../controllers/citas/citas.controller';

@Module({
  imports: [],
  controllers: [CitasController],
  providers: [CitasService],
})
export class CitasModule {}
