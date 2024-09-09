/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `Farmer` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `order` ADD COLUMN `deliveryStatus` VARCHAR(191) NOT NULL DEFAULT 'Preparing';

-- CreateIndex
CREATE UNIQUE INDEX `Farmer_userId_key` ON `Farmer`(`userId`);
