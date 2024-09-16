/*
  Warnings:

  - You are about to drop the column `hasGAP` on the `certificate` table. All the data in the column will be lost.
  - You are about to drop the column `hasGI` on the `certificate` table. All the data in the column will be lost.
  - Added the required column `standards` to the `Certificate` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `certificate` DROP COLUMN `hasGAP`,
    DROP COLUMN `hasGI`,
    ADD COLUMN `standards` JSON NOT NULL;
