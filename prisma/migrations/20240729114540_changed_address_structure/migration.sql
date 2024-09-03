/*
  Warnings:

  - You are about to drop the column `createdAt` on the `amphoe` table. All the data in the column will be lost.
  - You are about to drop the column `provinceId` on the `amphoe` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `amphoe` table. All the data in the column will be lost.
  - Added the required column `province_id` to the `Amphoe` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Amphoe` table without a default value. This is not possible if the table is not empty.
  - Added the required column `geography_id` to the `Province` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Province` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `amphoe` DROP FOREIGN KEY `Amphoe_provinceId_fkey`;

-- AlterTable
ALTER TABLE `amphoe` DROP COLUMN `createdAt`,
    DROP COLUMN `provinceId`,
    DROP COLUMN `updatedAt`,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `deleted_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `province_id` INTEGER NOT NULL,
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `province` ADD COLUMN `deleted_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `geography_id` INTEGER NOT NULL,
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `tambon` ADD COLUMN `deleted_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE `Amphoe` ADD CONSTRAINT `Amphoe_province_id_fkey` FOREIGN KEY (`province_id`) REFERENCES `Province`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
