/*
  Warnings:

  - You are about to drop the column `name` on the `farmer` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Farmer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `plotCode` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `variety` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `farmer` DROP COLUMN `name`,
    ADD COLUMN `userId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `product` ADD COLUMN `plotCode` VARCHAR(191) NOT NULL,
    ADD COLUMN `status` VARCHAR(191) NOT NULL,
    ADD COLUMN `variety` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Farmer` ADD CONSTRAINT `Farmer_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
