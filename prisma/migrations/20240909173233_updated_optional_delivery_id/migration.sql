-- DropForeignKey
ALTER TABLE `order` DROP FOREIGN KEY `Order_deliveryId_fkey`;

-- AlterTable
ALTER TABLE `order` MODIFY `deliveryId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_deliveryId_fkey` FOREIGN KEY (`deliveryId`) REFERENCES `Delivery_Detail`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
