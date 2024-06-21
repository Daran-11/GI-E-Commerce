-- CreateTable
CREATE TABLE `product` (
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
