/*
  Warnings:

  - Added the required column `iva` to the `Factura` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subtotal` to the `Factura` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Factura" ADD COLUMN     "iva" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "subtotal" DECIMAL(10,2) NOT NULL;
