/*
  Warnings:

  - You are about to drop the column `hasGAP` on the `certificate` table. All the data in the column will be lost.
  - You are about to drop the column `hasGI` on the `certificate` table. All the data in the column will be lost.
  - You are about to drop the column `plotCode` on the `certificate` table. All the data in the column will be lost.
  - You are about to drop the column `plotCode` on the `product` table. All the data in the column will be lost.
  - Added the required column `productId` to the `Certificate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `standards` to the `Certificate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Certificate` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `certificate` DROP COLUMN `hasGAP`,
    DROP COLUMN `hasGI`,
    DROP COLUMN `plotCode`,
    ADD COLUMN `municipalComment` VARCHAR(191) NULL,
    ADD COLUMN `productId` INTEGER NOT NULL,
    ADD COLUMN `standards` JSON NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `product` DROP COLUMN `plotCode`,
    ADD COLUMN `Details` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `Standard` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `logoUrl` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Certificate` ADD CONSTRAINT `Certificate_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`ProductID`) ON DELETE RESTRICT ON UPDATE CASCADE;
