/*
  Warnings:

  - You are about to drop the column `nombre` on the `Mascota` table. All the data in the column will be lost.
  - Added the required column `name` to the `Mascota` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Mascota" DROP COLUMN "nombre",
ADD COLUMN     "name" TEXT NOT NULL;
