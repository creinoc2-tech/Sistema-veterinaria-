import { Module } from '@nestjs/common';
import { FacturasService } from '../../services/facturas/facturas.service';
import { FacturasController } from '../../controllers/facturas/facturas.controller';

@Module({
  imports: [],
  controllers: [FacturasController],
  providers: [FacturasService],
})
export class FacturasModule {}
