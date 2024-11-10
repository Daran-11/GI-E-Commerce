-- DropForeignKey
ALTER TABLE `certificate` DROP FOREIGN KEY `Certificate_productId_fkey`;

-- AlterTable
ALTER TABLE `certificate` MODIFY `productId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Certificate` ADD CONSTRAINT `Certificate_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`ProductID`) ON DELETE SET NULL ON UPDATE CASCADE;
