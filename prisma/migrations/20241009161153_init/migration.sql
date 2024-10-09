/*
  Warnings:

  - You are about to drop the column `approvalDate` on the `manage_farmer` table. All the data in the column will be lost.
  - You are about to drop the column `certificateNumber` on the `manage_farmer` table. All the data in the column will be lost.
  - You are about to drop the column `standardName` on the `manage_farmer` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `manage_farmer` DROP COLUMN `approvalDate`,
    DROP COLUMN `certificateNumber`,
    DROP COLUMN `standardName`;

-- CreateTable
CREATE TABLE `Certificate_farmer` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `standardName` VARCHAR(191) NOT NULL,
    `certificateNumber` VARCHAR(191) NOT NULL,
    `approvalDate` DATETIME(3) NOT NULL,
    `farmerId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Certificate_farmer` ADD CONSTRAINT `Certificate_farmer_farmerId_fkey` FOREIGN KEY (`farmerId`) REFERENCES `manage_farmer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
