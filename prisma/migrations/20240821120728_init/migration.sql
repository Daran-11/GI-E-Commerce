-- CreateTable
CREATE TABLE `Farmer` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `location` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Certificate` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `variety` VARCHAR(191) NOT NULL,
    `plotCode` VARCHAR(191) NOT NULL,
    `registrationDate` DATETIME(3) NOT NULL,
    `expiryDate` DATETIME(3) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `imageUrl` VARCHAR(191) NOT NULL,
    `farmerId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;


-- AddForeignKey
ALTER TABLE `Certificate` ADD CONSTRAINT `Certificate_farmerId_fkey` FOREIGN KEY (`farmerId`) REFERENCES `Farmer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
