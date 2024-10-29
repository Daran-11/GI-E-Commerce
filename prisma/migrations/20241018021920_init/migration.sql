/*
  Warnings:

  - You are about to drop the column `farmerId` on the `manage_farmer` table. All the data in the column will be lost.
  - Added the required column `type` to the `Certificate_farmer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `variety` to the `Certificate_farmer` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `manage_farmer` DROP FOREIGN KEY `manage_farmer_farmerId_fkey`;

-- AlterTable
ALTER TABLE `certificate_farmer` ADD COLUMN `type` VARCHAR(191) NOT NULL,
    ADD COLUMN `variety` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `manage_farmer` DROP COLUMN `farmerId`;
