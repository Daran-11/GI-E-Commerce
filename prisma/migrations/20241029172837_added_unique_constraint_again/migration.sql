/*
  Warnings:

  - A unique constraint covering the columns `[userId,orderId]` on the table `RatingReview` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `RatingReview_userId_orderId_key` ON `RatingReview`(`userId`, `orderId`);
