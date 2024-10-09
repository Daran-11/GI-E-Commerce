-- DropForeignKey
ALTER TABLE `certificate_farmer` DROP FOREIGN KEY `Certificate_farmer_farmerId_fkey`;

-- AddForeignKey
ALTER TABLE `Certificate_farmer` ADD CONSTRAINT `Certificate_farmer_farmerId_fkey` FOREIGN KEY (`farmerId`) REFERENCES `manage_farmer`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
