/*
  Warnings:

  - You are about to drop the `delivery_order` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `delivery_order` DROP FOREIGN KEY `Delivery_Order_deliveryId_fkey`;

-- DropForeignKey
ALTER TABLE `order` DROP FOREIGN KEY `Order_deliveryId_fkey`;

-- DropTable
DROP TABLE `delivery_order`;

-- CreateTable
CREATE TABLE `Delivery_Detail` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `deliveryId` INTEGER NOT NULL,
    `trackingNum` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_deliveryId_fkey` FOREIGN KEY (`deliveryId`) REFERENCES `Delivery_Detail`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Delivery_Detail` ADD CONSTRAINT `Delivery_Detail_deliveryId_fkey` FOREIGN KEY (`deliveryId`) REFERENCES `Delivery_Service`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
