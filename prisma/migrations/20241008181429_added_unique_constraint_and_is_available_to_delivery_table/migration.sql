/*
  Warnings:

  - A unique constraint covering the columns `[orderId]` on the table `Delivery_Detail` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `orderId` to the `Delivery_Detail` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `order` DROP FOREIGN KEY `Order_deliveryId_fkey`;

-- AlterTable
ALTER TABLE `delivery_detail` ADD COLUMN `orderId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `delivery_service` ADD COLUMN `isAvailable` BOOLEAN NOT NULL DEFAULT true;

-- CreateIndex
CREATE UNIQUE INDEX `Delivery_Detail_orderId_key` ON `Delivery_Detail`(`orderId`);

-- AddForeignKey
ALTER TABLE `Delivery_Detail` ADD CONSTRAINT `Delivery_Detail_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
