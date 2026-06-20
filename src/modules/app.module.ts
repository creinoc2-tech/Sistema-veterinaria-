import { Module } from '@nestjs/common';
import { AppController } from '../controllers/app.controller';
import { AppService } from '../services/app.service';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { CategoriasModule } from './categorias/categorias.module';
import { ProductosModule } from './productos/productos.module';
import { MascotasModule } from './mascotas/mascotas.module';
import { CitasModule } from './citas/citas.module';
import { FacturasModule } from './facturas/facturas.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.develop', '.env'],
      isGlobal: true,
    }),
    UserModule,
    PrismaModule,
    AuthModule,
    CategoriasModule,
    ProductosModule,
    MascotasModule,
    CitasModule,
    FacturasModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
