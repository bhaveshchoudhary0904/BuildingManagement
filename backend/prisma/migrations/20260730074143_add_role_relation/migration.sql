-- AddForeignKey
ALTER TABLE `residents` ADD CONSTRAINT `residents_unit_id_fkey` FOREIGN KEY (`unit_id`) REFERENCES `units`(`unit_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `residents` ADD CONSTRAINT `residents_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `units` ADD CONSTRAINT `units_building_id_fkey` FOREIGN KEY (`building_id`) REFERENCES `buildings`(`building_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_building_id_fkey` FOREIGN KEY (`building_id`) REFERENCES `buildings`(`building_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `roles`(`role_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
