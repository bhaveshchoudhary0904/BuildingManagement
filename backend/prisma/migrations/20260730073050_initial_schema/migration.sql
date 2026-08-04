-- CreateTable
CREATE TABLE `activity_logs` (
    `log_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NULL,
    `action` VARCHAR(255) NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `user_id`(`user_id`),
    PRIMARY KEY (`log_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `buildings` (
    `building_id` INTEGER NOT NULL AUTO_INCREMENT,
    `building_name` VARCHAR(100) NOT NULL,
    `address` TEXT NULL,
    `total_floors` INTEGER NOT NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`building_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `complaints` (
    `complaint_id` INTEGER NOT NULL AUTO_INCREMENT,
    `resident_id` INTEGER NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `category` VARCHAR(100) NULL,
    `priority` ENUM('Low', 'Medium', 'High') NULL DEFAULT 'Medium',
    `status` ENUM('Pending', 'In Progress', 'Resolved', 'Closed') NULL DEFAULT 'Pending',
    `assigned_to` INTEGER NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `assigned_to`(`assigned_to`),
    INDEX `resident_id`(`resident_id`),
    PRIMARY KEY (`complaint_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `family_members` (
    `member_id` INTEGER NOT NULL AUTO_INCREMENT,
    `resident_id` INTEGER NOT NULL,
    `member_name` VARCHAR(100) NULL,
    `relation_type` VARCHAR(50) NULL,
    `age` INTEGER NULL,

    INDEX `resident_id`(`resident_id`),
    PRIMARY KEY (`member_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `maintenance_requests` (
    `request_id` INTEGER NOT NULL AUTO_INCREMENT,
    `resident_id` INTEGER NOT NULL,
    `category` VARCHAR(100) NULL,
    `description` TEXT NULL,
    `priority` ENUM('Low', 'Medium', 'High') NULL DEFAULT 'Medium',
    `status` ENUM('Pending', 'In Progress', 'Completed') NULL DEFAULT 'Pending',
    `assigned_to` INTEGER NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `assigned_to`(`assigned_to`),
    INDEX `resident_id`(`resident_id`),
    PRIMARY KEY (`request_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notices` (
    `notice_id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `notice_type` ENUM('Water', 'Electricity', 'Maintenance', 'Emergency', 'General') NULL,
    `created_by` INTEGER NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `created_by`(`created_by`),
    PRIMARY KEY (`notice_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notifications` (
    `notification_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `title` VARCHAR(255) NULL,
    `message` TEXT NULL,
    `is_read` BOOLEAN NULL DEFAULT false,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `user_id`(`user_id`),
    PRIMARY KEY (`notification_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payments` (
    `payment_id` INTEGER NOT NULL AUTO_INCREMENT,
    `resident_id` INTEGER NOT NULL,
    `amount` DECIMAL(10, 2) NOT NULL,
    `month` VARCHAR(20) NULL,
    `year` INTEGER NULL,
    `payment_status` ENUM('Pending', 'Paid') NULL DEFAULT 'Pending',
    `payment_method` VARCHAR(50) NULL,
    `transaction_id` VARCHAR(100) NULL,
    `upi_id` VARCHAR(100) NULL,
    `notes` TEXT NULL,
    `bill_source` VARCHAR(20) NULL DEFAULT 'resident',
    `payment_date` DATETIME(0) NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `resident_id`(`resident_id`),
    PRIMARY KEY (`payment_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `residents` (
    `resident_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NULL,
    `unit_id` INTEGER NOT NULL,
    `emergency_contact` VARCHAR(15) NULL,
    `move_in_date` DATE NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `unit_id`(`unit_id`),
    INDEX `user_id`(`user_id`),
    PRIMARY KEY (`resident_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `roles` (
    `role_id` INTEGER NOT NULL AUTO_INCREMENT,
    `role_name` VARCHAR(50) NOT NULL,

    UNIQUE INDEX `role_name`(`role_name`),
    PRIMARY KEY (`role_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `settings` (
    `setting_id` INTEGER NOT NULL AUTO_INCREMENT,
    `setting_key` VARCHAR(100) NOT NULL,
    `setting_value` TEXT NOT NULL,
    `updated_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `setting_key`(`setting_key`),
    PRIMARY KEY (`setting_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `units` (
    `unit_id` INTEGER NOT NULL AUTO_INCREMENT,
    `building_id` INTEGER NOT NULL,
    `floor_number` INTEGER NOT NULL,
    `unit_number` VARCHAR(20) NOT NULL,
    `occupancy_status` ENUM('Vacant', 'Occupied') NULL DEFAULT 'Vacant',

    INDEX `building_id`(`building_id`),
    PRIMARY KEY (`unit_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `user_id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `phone_number` VARCHAR(15) NOT NULL,
    `email` VARCHAR(100) NULL,
    `password` VARCHAR(255) NOT NULL,
    `role_id` INTEGER NOT NULL,
    `building_id` INTEGER NULL,
    `profile_image` VARCHAR(255) NULL,
    `is_active` BOOLEAN NULL DEFAULT true,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `phone_number`(`phone_number`),
    UNIQUE INDEX `email`(`email`),
    INDEX `role_id`(`role_id`),
    INDEX `building_id`(`building_id`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `visitor_qr_codes` (
    `qr_id` INTEGER NOT NULL AUTO_INCREMENT,
    `visitor_id` INTEGER NOT NULL,
    `qr_token` VARCHAR(191) NULL,
    `expiry_time` DATETIME(0) NULL,

    UNIQUE INDEX `qr_token`(`qr_token`),
    INDEX `visitor_id`(`visitor_id`),
    PRIMARY KEY (`qr_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `visitors` (
    `visitor_id` INTEGER NOT NULL AUTO_INCREMENT,
    `resident_id` INTEGER NULL,
    `visitor_name` VARCHAR(100) NULL,
    `phone_number` VARCHAR(15) NULL,
    `purpose` VARCHAR(255) NULL,
    `status` ENUM('Approved', 'Checked In', 'Checked Out') NULL DEFAULT 'Approved',
    `check_in` DATETIME(0) NULL,
    `check_out` DATETIME(0) NULL,
    `delivery_type` VARCHAR(50) NULL,

    INDEX `resident_id`(`resident_id`),
    PRIMARY KEY (`visitor_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `residents` ADD CONSTRAINT `residents_unit_id_fkey` FOREIGN KEY (`unit_id`) REFERENCES `units`(`unit_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `residents` ADD CONSTRAINT `residents_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `units` ADD CONSTRAINT `units_building_id_fkey` FOREIGN KEY (`building_id`) REFERENCES `buildings`(`building_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_building_id_fkey` FOREIGN KEY (`building_id`) REFERENCES `buildings`(`building_id`) ON DELETE SET NULL ON UPDATE CASCADE;
