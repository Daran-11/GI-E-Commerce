-- AlterTable
ALTER TABLE `manage_farmer` ADD COLUMN `farmerId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `manage_farmer` ADD CONSTRAINT `manage_farmer_farmerId_fkey` FOREIGN KEY (`farmerId`) REFERENCES `Farmer`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
