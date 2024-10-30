/*
  Warnings:

  - You are about to drop the column `deliveryId` on the `delivery_detail` table. All the data in the column will be lost.
  - Added the required column `serviceId` to the `Delivery_Detail` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `delivery_detail` DROP FOREIGN KEY `Delivery_Detail_deliveryId_fkey`;

-- AlterTable
ALTER TABLE `delivery_detail` DROP COLUMN `deliveryId`,
    ADD COLUMN `serviceId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Delivery_Detail` ADD CONSTRAINT `Delivery_Detail_serviceId_fkey` FOREIGN KEY (`serviceId`) REFERENCES `Delivery_Service`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
