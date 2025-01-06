-- DropForeignKey
ALTER TABLE `qr_code` DROP FOREIGN KEY `QR_Code_orderId_fkey`;

-- DropIndex
DROP INDEX `QR_Code_orderId_fkey` ON `qr_code`;
