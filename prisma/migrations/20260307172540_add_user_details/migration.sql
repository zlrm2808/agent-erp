/*
  Warnings:

  - You are about to drop the `InventoryMovement` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Product` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProductCategory` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN "department" TEXT DEFAULT 'Administración';
ALTER TABLE "User" ADD COLUMN "photo" TEXT;
ALTER TABLE "User" ADD COLUMN "position" TEXT DEFAULT 'Consultor';

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "InventoryMovement";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Product";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ProductCategory";
PRAGMA foreign_keys=on;
