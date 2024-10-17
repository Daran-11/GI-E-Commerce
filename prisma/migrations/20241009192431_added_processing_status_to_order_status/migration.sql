-- DropIndex
DROP INDEX `Order_deliveryId_fkey` ON `order`;

-- AlterTable
ALTER TABLE `order` MODIFY `status` ENUM('Pending', 'Processing', 'Completed') NOT NULL DEFAULT 'Pending';
