/*
  Warnings:

  - You are about to drop the column `lastname` on the `farmer` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `farmer` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `farmer` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `farmer` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `farmer` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `farmer` DROP COLUMN `lastname`,
    DROP COLUMN `name`,
    DROP COLUMN `password`,
    DROP COLUMN `role`,
    DROP COLUMN `title`,
    ADD COLUMN `farmerName` VARCHAR(191) NULL;
