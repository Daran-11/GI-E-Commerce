/*
  Warnings:

  - You are about to drop the column `planting_plot_code` on the `farmer` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `certificate` MODIFY `status` VARCHAR(191) NOT NULL DEFAULT 'รอตรวจสอบใบรับรอง';

-- AlterTable
ALTER TABLE `farmer` DROP COLUMN `planting_plot_code`;
