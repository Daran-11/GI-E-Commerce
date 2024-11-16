/*
  Warnings:

  - You are about to drop the column `farmerName` on the `manage_farmer` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `manage_farmer` DROP COLUMN `farmerName`,
    ADD COLUMN `farmerNameApprove` VARCHAR(191) NULL;
