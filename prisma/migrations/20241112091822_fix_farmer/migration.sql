/*
  Warnings:

  - You are about to drop the column `farmerName` on the `farmer` table. All the data in the column will be lost.
  - Added the required column `password` to the `Farmer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role` to the `Farmer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `farmer` DROP COLUMN `farmerName`,
    ADD COLUMN `password` VARCHAR(191) NOT NULL,
    ADD COLUMN `role` VARCHAR(191) NOT NULL;
