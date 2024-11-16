/*
  Warnings:

  - You are about to drop the column `firstName` on the `manage_farmer` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `manage_farmer` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `manage_farmer` DROP COLUMN `firstName`,
    DROP COLUMN `lastName`,
    ADD COLUMN `farmerName` VARCHAR(191) NULL;
