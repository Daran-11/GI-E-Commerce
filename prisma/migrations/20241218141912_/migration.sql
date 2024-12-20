/*
  Warnings:

  - You are about to drop the column `Address` on the `qr_code` table. All the data in the column will be lost.
  - You are about to drop the column `Latitude` on the `qr_code` table. All the data in the column will be lost.
  - You are about to drop the column `Longitude` on the `qr_code` table. All the data in the column will be lost.
  - You are about to drop the column `Phone` on the `qr_code` table. All the data in the column will be lost.
  - You are about to drop the column `Product_ID` on the `qr_code` table. All the data in the column will be lost.
  - You are about to drop the column `ProductionQuantity` on the `qr_code` table. All the data in the column will be lost.
  - You are about to drop the column `Standard` on the `qr_code` table. All the data in the column will be lost.
  - You are about to drop the column `Type` on the `qr_code` table. All the data in the column will be lost.
  - You are about to drop the column `Variety` on the `qr_code` table. All the data in the column will be lost.
  - You are about to drop the column `farmerName` on the `qr_code` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `qr_code` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[qrcodeId]` on the table `QR_Code` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `QR_Code_Product_ID_key` ON `qr_code`;

-- AlterTable
ALTER TABLE `qr_code` DROP COLUMN `Address`,
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
