/*
  Warnings:

  - Added the required column `zip_code` to the `Tambon` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `tambon` ADD COLUMN `zip_code` INTEGER NOT NULL;
