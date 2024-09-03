/*
  Warnings:

  - You are about to drop the column `name` on the `amphoe` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `province` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `tambon` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name_en` to the `Amphoe` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name_th` to the `Amphoe` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Amphoe` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name_en` to the `Province` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name_th` to the `Province` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name_en` to the `Tambon` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name_th` to the `Tambon` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Tambon` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `address` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `amphoe` DROP COLUMN `name`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `name_en` VARCHAR(191) NOT NULL,
    ADD COLUMN `name_th` VARCHAR(191) NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `province` DROP COLUMN `name`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `name_en` VARCHAR(191) NOT NULL,
    ADD COLUMN `name_th` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `tambon` DROP COLUMN `name`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `name_en` VARCHAR(191) NOT NULL,
    ADD COLUMN `name_th` VARCHAR(191) NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;
