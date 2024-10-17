/*
  Warnings:

  - You are about to drop the `history` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `history` DROP FOREIGN KEY `History_farmerId_fkey`;

-- DropForeignKey
ALTER TABLE `history` DROP FOREIGN KEY `History_orderId_fkey`;

-- DropForeignKey
ALTER TABLE `history` DROP FOREIGN KEY `History_userId_fkey`;

-- DropTable
DROP TABLE `history`;
