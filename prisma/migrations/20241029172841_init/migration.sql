/*
  Warnings:

  - You are about to drop the column `farmerId` on the `certificate` table. All the data in the column will be lost.
  - You are about to drop the column `farmerId` on the `certificate_farmer` table. All the data in the column will be lost.
  - You are about to drop the `farmer` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `UsersId` to the `Certificate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `UsersId` to the `Certificate_farmer` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `certificate` DROP FOREIGN KEY `Certificate_farmerId_fkey`;

-- DropForeignKey
ALTER TABLE `certificate_farmer` DROP FOREIGN KEY `Certificate_farmer_farmerId_fkey`;

-- AlterTable
ALTER TABLE `certificate` DROP COLUMN `farmerId`,
    ADD COLUMN `UsersId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `certificate_farmer` DROP COLUMN `farmerId`,
    ADD COLUMN `UsersId` INTEGER NOT NULL;

-- DropTable
DROP TABLE `farmer`;

-- CreateTable
CREATE TABLE `Users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `lastname` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `sub_district` VARCHAR(191) NOT NULL,
    `district` VARCHAR(191) NOT NULL,
    `province` VARCHAR(191) NOT NULL,
    `zip_code` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Certificate` ADD CONSTRAINT `Certificate_UsersId_fkey` FOREIGN KEY (`UsersId`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Certificate_farmer` ADD CONSTRAINT `Certificate_farmer_UsersId_fkey` FOREIGN KEY (`UsersId`) REFERENCES `manage_farmer`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
