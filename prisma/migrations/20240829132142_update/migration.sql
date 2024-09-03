/*
  Warnings:

  - You are about to drop the column `expiryDate` on the `certificate` table. All the data in the column will be lost.
  - You are about to drop the column `farmerId` on the `certificate` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `certificate` table. All the data in the column will be lost.
  - You are about to drop the column `plotCode` on the `certificate` table. All the data in the column will be lost.
  - You are about to drop the column `registrationDate` on the `certificate` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `certificate` table. All the data in the column will be lost.
  - You are about to drop the column `variety` on the `certificate` table. All the data in the column will be lost.
  - You are about to drop the column `plotCode` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `variety` on the `product` table. All the data in the column will be lost.
  - Added the required column `ExpiryDate` to the `Certificate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `FarmerId` to the `Certificate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ImageUrl` to the `Certificate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `PlotCode` to the `Certificate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `RegistrationDate` to the `Certificate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Status` to the `Certificate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Variety` to the `Certificate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `PlotCode` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Status` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `certificate` DROP FOREIGN KEY `Certificate_farmerId_fkey`;

-- AlterTable
ALTER TABLE `certificate` DROP COLUMN `expiryDate`,
    DROP COLUMN `farmerId`,
    DROP COLUMN `imageUrl`,
    DROP COLUMN `plotCode`,
    DROP COLUMN `registrationDate`,
    DROP COLUMN `status`,
    DROP COLUMN `variety`,
    ADD COLUMN `ExpiryDate` DATETIME(3) NOT NULL,
    ADD COLUMN `FarmerId` INTEGER NOT NULL,
    ADD COLUMN `ImageUrl` VARCHAR(191) NOT NULL,
    ADD COLUMN `PlotCode` VARCHAR(191) NOT NULL,
    ADD COLUMN `RegistrationDate` DATETIME(3) NOT NULL,
    ADD COLUMN `Status` VARCHAR(191) NOT NULL,
    ADD COLUMN `Variety` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `product` DROP COLUMN `plotCode`,
    DROP COLUMN `status`,
    DROP COLUMN `variety`,
    ADD COLUMN `PlotCode` VARCHAR(191) NOT NULL,
    ADD COLUMN `Status` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Certificate` ADD CONSTRAINT `Certificate_FarmerId_fkey` FOREIGN KEY (`FarmerId`) REFERENCES `Farmer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
