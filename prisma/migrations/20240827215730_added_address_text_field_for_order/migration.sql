/*
  Warnings:

  - You are about to drop the column `addressId` on the `order` table. All the data in the column will be lost.
  - Added the required column `addressText` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `order` DROP FOREIGN KEY `Order_addressId_fkey`;

-- AlterTable
ALTER TABLE `order` DROP COLUMN `addressId`,
    ADD COLUMN `addressText` VARCHAR(191) NOT NULL;
