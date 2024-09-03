/*
  Warnings:

  - You are about to drop the column `amphoe` on the `address` table. All the data in the column will be lost.
  - You are about to drop the column `province` on the `address` table. All the data in the column will be lost.
  - You are about to drop the column `tambon` on the `address` table. All the data in the column will be lost.
  - You are about to alter the column `addressLine` on the `address` table. The data in that column could be lost. The data in that column will be cast from `VarChar(200)` to `VarChar(191)`.
  - You are about to alter the column `totalPrice` on the `order` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - Added the required column `amphoeId` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `provinceId` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tambonId` to the `Address` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `address` DROP COLUMN `amphoe`,
    DROP COLUMN `province`,
    DROP COLUMN `tambon`,
    ADD COLUMN `amphoeId` INTEGER NOT NULL,
    ADD COLUMN `provinceId` INTEGER NOT NULL,
    ADD COLUMN `tambonId` INTEGER NOT NULL,
    MODIFY `addressLine` VARCHAR(191) NOT NULL,
    MODIFY `postalCode` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `order` MODIFY `totalPrice` DOUBLE NOT NULL;

-- CreateTable
CREATE TABLE `Province` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Amphoe` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `provinceId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tambon` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `amphoeId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Address` ADD CONSTRAINT `Address_provinceId_fkey` FOREIGN KEY (`provinceId`) REFERENCES `Province`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Address` ADD CONSTRAINT `Address_amphoeId_fkey` FOREIGN KEY (`amphoeId`) REFERENCES `Amphoe`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Address` ADD CONSTRAINT `Address_tambonId_fkey` FOREIGN KEY (`tambonId`) REFERENCES `Tambon`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Amphoe` ADD CONSTRAINT `Amphoe_provinceId_fkey` FOREIGN KEY (`provinceId`) REFERENCES `Province`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Tambon` ADD CONSTRAINT `Tambon_amphoeId_fkey` FOREIGN KEY (`amphoeId`) REFERENCES `Amphoe`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
