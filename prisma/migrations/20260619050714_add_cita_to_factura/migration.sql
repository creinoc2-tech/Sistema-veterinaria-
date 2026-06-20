/*
  Warnings:

  - A unique constraint covering the columns `[citaId]` on the table `Factura` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `citaId` to the `Factura` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Factura" ADD COLUMN     "citaId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Factura_citaId_key" ON "Factura"("citaId");

-- AddForeignKey
ALTER TABLE "Factura" ADD CONSTRAINT "Factura_citaId_fkey" FOREIGN KEY ("citaId") REFERENCES "Cita"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
