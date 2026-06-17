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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
