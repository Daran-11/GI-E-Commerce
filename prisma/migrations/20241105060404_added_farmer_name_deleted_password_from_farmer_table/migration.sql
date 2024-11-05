/*
  Warnings:

  - You are about to drop the column `password` on the `farmer` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `farmer` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `farmer` DROP COLUMN `password`,
    DROP COLUMN `role`,
    ADD COLUMN `farmerName` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `user` MODIFY `role` ENUM('customer', 'farmer', 'admin', 'municipal') NOT NULL DEFAULT 'customer';
