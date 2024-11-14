-- DropForeignKey
ALTER TABLE `certificate` DROP FOREIGN KEY `Certificate_productId_fkey`;

-- CreateTable
CREATE TABLE `ProductCertificate` (
    `productId` INTEGER NOT NULL,
    `certificateId` INTEGER NOT NULL,

    PRIMARY KEY (`productId`, `certificateId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ProductCertificate` ADD CONSTRAINT `ProductCertificate_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`ProductID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductCertificate` ADD CONSTRAINT `ProductCertificate_certificateId_fkey` FOREIGN KEY (`certificateId`) REFERENCES `Certificate`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
