/*
  Warnings:

  - You are about to drop the column `amount` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `product` table. All the data in the column will be lost.
  - Added the required column `contactLine` to the `Farmer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `farmerName` to the `Farmer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deliveryId` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `farmerId` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Amount` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Price` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `farmerId` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `farmer` ADD COLUMN `contactLine` VARCHAR(15) NOT NULL,
    ADD COLUMN `farmerName` VARCHAR(100) NOT NULL;

-- AlterTable
ALTER TABLE `order` ADD COLUMN `deliveryId` INTEGER NOT NULL,
    ADD COLUMN `farmerId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `product` DROP COLUMN `amount`,
    DROP COLUMN `price`,
    ADD COLUMN `Amount` MEDIUMINT NOT NULL,
    ADD COLUMN `Price` SMALLINT NOT NULL,
    ADD COLUMN `farmerId` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `RatingReview` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `productId` INTEGER NOT NULL,
    `rating` TINYINT NOT NULL,
    `review` VARCHAR(1000) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Delivery_Service` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Delivery_Order` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `deliveryId` INTEGER NOT NULL,
    `trackingNum` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_farmerId_fkey` FOREIGN KEY (`farmerId`) REFERENCES `Farmer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RatingReview` ADD CONSTRAINT `RatingReview_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`ProductID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RatingReview` ADD CONSTRAINT `RatingReview_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_deliveryId_fkey` FOREIGN KEY (`deliveryId`) REFERENCES `Delivery_Order`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_farmerId_fkey` FOREIGN KEY (`farmerId`) REFERENCES `Farmer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Delivery_Order` ADD CONSTRAINT `Delivery_Order_deliveryId_fkey` FOREIGN KEY (`deliveryId`) REFERENCES `Delivery_Service`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
