-- CreateTable
CREATE TABLE `QR_Code` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `Product_ID` VARCHAR(191) NOT NULL,
    `Type` VARCHAR(191) NOT NULL,
    `Variety` VARCHAR(191) NOT NULL,
    `ProductionQuantity` INTEGER NOT NULL,
    `Standard` JSON NOT NULL,
    `Address` VARCHAR(191) NOT NULL,
    `Phone` VARCHAR(191) NOT NULL,
    `farmerName` VARCHAR(191) NOT NULL,
    `farmerId` INTEGER NOT NULL,
    `Latitude` DOUBLE NULL,
    `Longitude` DOUBLE NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `QR_Code_Product_ID_key`(`Product_ID`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `QR_Code` ADD CONSTRAINT `QR_Code_farmerId_fkey` FOREIGN KEY (`farmerId`) REFERENCES `Farmer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
