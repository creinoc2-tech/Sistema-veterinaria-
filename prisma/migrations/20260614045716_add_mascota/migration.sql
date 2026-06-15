-- CreateEnum
CREATE TYPE "Especie" AS ENUM ('PERRO', 'GATO', 'AVE', 'CONEJO', 'OTRO');

-- CreateEnum
CREATE TYPE "Sexo" AS ENUM ('MACHO', 'HEMBRA');

-- CreateTable
CREATE TABLE "Mascota" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "nombre" TEXT NOT NULL,
    "especie" "Especie" NOT NULL,
    "raza" TEXT,
    "sexo" "Sexo" NOT NULL,
    "fechaNac" TIMESTAMP(3),
    "peso" DOUBLE PRECISION,
    "color" TEXT,
    "foto" TEXT,
    "duenoId" TEXT NOT NULL,

    CONSTRAINT "Mascota_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Mascota" ADD CONSTRAINT "Mascota_duenoId_fkey" FOREIGN KEY ("duenoId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
