/*
  Warnings:

  - You are about to drop the column `description` on the `standard` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `standard` DROP COLUMN `description`,
    ADD COLUMN `certificationInfo` VARCHAR(191) NULL;
