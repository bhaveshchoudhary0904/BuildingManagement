-- Add building_id as nullable first
ALTER TABLE `activity_logs` ADD COLUMN `building_id` INT;
ALTER TABLE `complaints` ADD COLUMN `building_id` INT;
ALTER TABLE `family_members` ADD COLUMN `building_id` INT;
ALTER TABLE `maintenance_requests` ADD COLUMN `building_id` INT;
ALTER TABLE `notices` ADD COLUMN `building_id` INT;
ALTER TABLE `notifications` ADD COLUMN `building_id` INT;
ALTER TABLE `payments` ADD COLUMN `building_id` INT;
ALTER TABLE `residents` ADD COLUMN `building_id` INT;
ALTER TABLE `settings` ADD COLUMN `building_id` INT;
ALTER TABLE `visitor_qr_codes` ADD COLUMN `building_id` INT;
ALTER TABLE `visitors` ADD COLUMN `building_id` INT;

-- Update existing data with building_id from related tables
UPDATE residents r JOIN units u ON r.unit_id = u.unit_id SET r.building_id = u.building_id;
UPDATE family_members fm JOIN residents r ON fm.resident_id = r.resident_id SET fm.building_id = r.building_id;
UPDATE complaints c JOIN residents r ON c.resident_id = r.resident_id SET c.building_id = r.building_id;
UPDATE maintenance_requests mr JOIN residents r ON mr.resident_id = r.resident_id SET mr.building_id = r.building_id;
UPDATE payments p JOIN residents r ON p.resident_id = r.resident_id SET p.building_id = r.building_id;
UPDATE visitors v JOIN residents r ON v.resident_id = r.resident_id SET v.building_id = r.building_id;
UPDATE visitor_qr_codes vq JOIN visitors v ON vq.visitor_id = v.visitor_id SET vq.building_id = v.building_id;

-- Set default building_id for system data (building_id = 1)
UPDATE activity_logs SET building_id = 1 WHERE building_id IS NULL;
UPDATE notices SET building_id = 1 WHERE building_id IS NULL;
UPDATE notifications SET building_id = 1 WHERE building_id IS NULL;
UPDATE settings SET building_id = NULL WHERE building_id IS NULL;

-- Make building_id required (except for settings and activity_logs where NULL is allowed)
ALTER TABLE `complaints` MODIFY COLUMN `building_id` INT NOT NULL;
ALTER TABLE `family_members` MODIFY COLUMN `building_id` INT NOT NULL;
ALTER TABLE `maintenance_requests` MODIFY COLUMN `building_id` INT NOT NULL;
ALTER TABLE `notices` MODIFY COLUMN `building_id` INT NOT NULL;
ALTER TABLE `notifications` MODIFY COLUMN `building_id` INT NOT NULL;
ALTER TABLE `payments` MODIFY COLUMN `building_id` INT NOT NULL;
ALTER TABLE `residents` MODIFY COLUMN `building_id` INT NOT NULL;
ALTER TABLE `visitor_qr_codes` MODIFY COLUMN `building_id` INT NOT NULL;
ALTER TABLE `visitors` MODIFY COLUMN `building_id` INT NOT NULL;

-- Add indexes
CREATE INDEX `activity_logs_building_id` ON `activity_logs`(`building_id`);
CREATE INDEX `complaints_building_id` ON `complaints`(`building_id`);
CREATE INDEX `family_members_building_id` ON `family_members`(`building_id`);
CREATE INDEX `maintenance_requests_building_id` ON `maintenance_requests`(`building_id`);
CREATE INDEX `notices_building_id` ON `notices`(`building_id`);
CREATE INDEX `notifications_building_id` ON `notifications`(`building_id`);
CREATE INDEX `payments_building_id` ON `payments`(`building_id`);
CREATE INDEX `residents_building_id` ON `residents`(`building_id`);
CREATE INDEX `settings_building_id` ON `settings`(`building_id`);
CREATE INDEX `visitor_qr_codes_building_id` ON `visitor_qr_codes`(`building_id`);
CREATE INDEX `visitors_building_id` ON `visitors`(`building_id`);

-- Drop old unique constraint on settings.setting_key
ALTER TABLE `settings` DROP INDEX `setting_key`;

-- Add new unique constraint on (building_id, setting_key)
CREATE UNIQUE INDEX `unique_building_setting` ON `settings`(`building_id`, `setting_key`);