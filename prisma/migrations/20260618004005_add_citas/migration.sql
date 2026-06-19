/*
  Warnings:

  - Added the required column `clienteId` to the `Cita` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Cita" ADD COLUMN     "clienteId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Cita" ADD CONSTRAINT "Cita_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
