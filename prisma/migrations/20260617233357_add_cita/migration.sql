-- CreateEnum
CREATE TYPE "EstadoCita" AS ENUM ('PENDIENTE', 'CONFIRMADA', 'EN_PROCESO', 'COMPLETADA', 'CANCELADA');

-- CreateEnum
CREATE TYPE "TipoCita" AS ENUM ('CONSULTA', 'VACUNA', 'CIRUGIA', 'CONTROL', 'EMERGENCIA', 'OTRO');

-- CreateTable
CREATE TABLE "Cita" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "hora" TEXT NOT NULL,
    "motivo" TEXT NOT NULL,
    "estado" "EstadoCita" NOT NULL DEFAULT 'PENDIENTE',
    "tipo" "TipoCita" NOT NULL,
    "notas" TEXT,
    "mascotaId" TEXT NOT NULL,
    "veterinarioId" TEXT NOT NULL,
    "creadoPorId" TEXT NOT NULL,

    CONSTRAINT "Cita_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Cita" ADD CONSTRAINT "Cita_mascotaId_fkey" FOREIGN KEY ("mascotaId") REFERENCES "Mascota"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cita" ADD CONSTRAINT "Cita_veterinarioId_fkey" FOREIGN KEY ("veterinarioId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cita" ADD CONSTRAINT "Cita_creadoPorId_fkey" FOREIGN KEY ("creadoPorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
