/*
  Warnings:

  - You are about to drop the column `hasGAP` on the `Certificate` table. All the data in the column will be lost.
  - You are about to drop the column `hasGI` on the `Certificate` table. All the data in the column will be lost.
  - You are about to drop the column `plotCode` on the `Certificate` table. All the data in the column will be lost.
  - You are about to drop the column `lastname` on the `Farmer` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Farmer` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `Farmer` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `Farmer` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Farmer` table. All the data in the column will be lost.
  - You are about to drop the column `plotCode` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `firstName` on the `manage_farmer` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `manage_farmer` table. All the data in the column will be lost.
  - Added the required column `standards` to the `Certificate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Certificate` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Certificate` DROP COLUMN `hasGAP`,
    DROP COLUMN `hasGI`,
    DROP COLUMN `plotCode`,
    ADD COLUMN `municipalComment` VARCHAR(191) NULL,
    ADD COLUMN `productId` INTEGER NULL,
    ADD COLUMN `standards` JSON NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `Farmer` DROP COLUMN `lastname`,
    DROP COLUMN `name`,
    DROP COLUMN `password`,
    DROP COLUMN `role`,
    DROP COLUMN `title`,
    ADD COLUMN `farmerName` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Product` DROP COLUMN `plotCode`,
    ADD COLUMN `Details` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `User` MODIFY `role` ENUM('customer', 'farmer', 'admin', 'municipal') NOT NULL DEFAULT 'customer';

-- AlterTable
ALTER TABLE `manage_farmer` DROP COLUMN `firstName`,
    DROP COLUMN `lastName`,
    ADD COLUMN `farmerNameApprove` VARCHAR(191) NULL;

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

-- CreateTable
CREATE TABLE `ProductCertificate` (
    `productId` INTEGER NOT NULL,
    `certificateId` INTEGER NOT NULL,

    PRIMARY KEY (`productId`, `certificateId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ProductCertificate` ADD CONSTRAINT `ProductCertificate_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`ProductID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductCertificate` ADD CONSTRAINT `ProductCertificate_certificateId_fkey` FOREIGN KEY (`certificateId`) REFERENCES `Certificate`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
