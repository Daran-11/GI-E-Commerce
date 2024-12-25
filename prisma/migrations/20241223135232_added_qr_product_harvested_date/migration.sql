/*
  Warnings:

  - You are about to drop the column `Address` on the `QR_Code` table. All the data in the column will be lost.
  - You are about to drop the column `Latitude` on the `QR_Code` table. All the data in the column will be lost.
  - You are about to drop the column `Longitude` on the `QR_Code` table. All the data in the column will be lost.
  - You are about to drop the column `Phone` on the `QR_Code` table. All the data in the column will be lost.
  - You are about to drop the column `Product_ID` on the `QR_Code` table. All the data in the column will be lost.
  - You are about to drop the column `ProductionQuantity` on the `QR_Code` table. All the data in the column will be lost.
  - You are about to drop the column `Standard` on the `QR_Code` table. All the data in the column will be lost.
  - You are about to drop the column `Type` on the `QR_Code` table. All the data in the column will be lost.
  - You are about to drop the column `Variety` on the `QR_Code` table. All the data in the column will be lost.
  - You are about to drop the column `farmerName` on the `QR_Code` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `QR_Code` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Standard` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[qrcodeId]` on the table `QR_Code` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `HarvestedAt` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Made the column `Description` on table `Product` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX `QR_Code_Product_ID_key` ON `QR_Code`;

-- AlterTable
ALTER TABLE `Product` ADD COLUMN `HarvestedAt` DATETIME(3) NOT NULL,
    MODIFY `Description` VARCHAR(200) NOT NULL;

-- AlterTable
ALTER TABLE `QR_Code` DROP COLUMN `Address`,
    DROP COLUMN `Latitude`,
    DROP COLUMN `Longitude`,
    DROP COLUMN `Phone`,
    DROP COLUMN `Product_ID`,
    DROP COLUMN `ProductionQuantity`,
    DROP COLUMN `Standard`,
    DROP COLUMN `Type`,
    DROP COLUMN `Variety`,
    DROP COLUMN `farmerName`,
    DROP COLUMN `updatedAt`,
    ADD COLUMN `certificateId` INTEGER NULL,
    ADD COLUMN `orderId` INTEGER NULL,
    ADD COLUMN `productId` INTEGER NULL,
    ADD COLUMN `qrcodeId` VARCHAR(191) NULL,
    ADD COLUMN `userId` INTEGER NULL,
    MODIFY `farmerId` INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE `Standard` DROP COLUMN `description`,
    ADD COLUMN `certificationInfo` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `manage_type` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `varieties` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `typeId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `varieties_typeId_idx`(`typeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `QR_Code_qrcodeId_key` ON `QR_Code`(`qrcodeId`);

-- AddForeignKey
ALTER TABLE `QR_Code` ADD CONSTRAINT `QR_Code_certificateId_fkey` FOREIGN KEY (`certificateId`) REFERENCES `Certificate`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `QR_Code` ADD CONSTRAINT `QR_Code_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `QR_Code` ADD CONSTRAINT `QR_Code_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`ProductID`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `QR_Code` ADD CONSTRAINT `QR_Code_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `varieties` ADD CONSTRAINT `varieties_typeId_fkey` FOREIGN KEY (`typeId`) REFERENCES `manage_type`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
