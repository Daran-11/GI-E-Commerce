/*
  Warnings:

  - Added the required column `orderId` to the `RatingReview` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ratingreview` ADD COLUMN `orderId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `RatingReview` ADD CONSTRAINT `RatingReview_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
