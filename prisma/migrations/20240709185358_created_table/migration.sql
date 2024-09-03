-- CreateTable
CREATE TABLE `Product` (
    `ProductID` INTEGER NOT NULL AUTO_INCREMENT,
    `ProductName` VARCHAR(11) NOT NULL,
    `ProductType` VARCHAR(11) NOT NULL,
    `Description` VARCHAR(200) NULL,
    `Price` SMALLINT NOT NULL,
    `Amount` MEDIUMINT NOT NULL,
    `ProductPic` BLOB NULL,
    `DateCreated` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `ProductID`(`ProductID`),
    PRIMARY KEY (`ProductID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `role` ENUM('customer', 'farmer', 'admin') NOT NULL DEFAULT 'customer',
    `password` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `phone` VARCHAR(191) NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    UNIQUE INDEX `User_phone_key`(`phone`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
