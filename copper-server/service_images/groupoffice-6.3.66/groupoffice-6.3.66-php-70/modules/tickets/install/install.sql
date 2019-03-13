
--
-- Tabelstructuur voor tabel `cf_ti_tickets`
--

DROP TABLE IF EXISTS `cf_ti_tickets`;
CREATE TABLE IF NOT EXISTS `cf_ti_tickets` (
  `model_id` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`model_id`)
) ENGINE=InnoDB;

--
-- Tabelstructuur voor tabel `go_links_ti_tickets`
--

DROP TABLE IF EXISTS `go_links_ti_tickets`;
CREATE TABLE IF NOT EXISTS `go_links_ti_tickets` (
  `id` int(11) NOT NULL,
  `folder_id` int(11) NOT NULL,
  `model_id` int(11) NOT NULL,
  `model_type_id` int(11) NOT NULL,
  `description` varchar(100) DEFAULT NULL,
  `ctime` int(11) NOT NULL,
  PRIMARY KEY `model_id` (`id`,`model_id`,`model_type_id`),
  KEY `id` (`id`,`folder_id`),
  KEY `ctime` (`ctime`)
) ENGINE=InnoDB;

-- --------------------------------------------------------


--
-- Tabelstructuur voor tabel `ti_groups`
--

DROP TABLE IF EXISTS `ti_groups`;
CREATE TABLE IF NOT EXISTS `ti_groups` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `acl_id` int(11) NOT NULL,
  `company_id` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;


DROP TABLE IF EXISTS `ti_messages`;
CREATE TABLE IF NOT EXISTS `ti_messages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ticket_id` int(11) NOT NULL,
  `status_id` int(11) NOT NULL DEFAULT '0',
  `type_id` int(11) NOT NULL DEFAULT '0',
  `has_status` tinyint(1) NOT NULL DEFAULT '0',
  `has_type` tinyint(1) NOT NULL DEFAULT '0',
  `content` text,
  `attachments` varchar(500) NOT NULL DEFAULT '',
  `is_note` tinyint(1) NOT NULL DEFAULT '0',
  `user_id` int(11) NOT NULL DEFAULT '0',
  `ctime` int(11) NOT NULL,
  `mtime` int(11) NOT NULL,
  `rate_id` int(11) NOT NULL DEFAULT '0',
  `rate_amount` double NOT NULL DEFAULT '0',
  `rate_hours` double NOT NULL DEFAULT '0',
  `rate_name` varchar(50) NOT NULL DEFAULT '',
  `rate_cost_code` VARCHAR( 50 ) NULL DEFAULT NULL,
	`template_id` INT NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;


DROP TABLE IF EXISTS `ti_rates`;
CREATE TABLE IF NOT EXISTS `ti_rates` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `amount` double NOT NULL,
  `company_id` int(11) NOT NULL DEFAULT '0',
	`cost_code` VARCHAR( 50 ) NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `ti_settings`;
CREATE TABLE IF NOT EXISTS `ti_settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `from_email` varchar(100) NOT NULL,
  `from_name` varchar(100) NOT NULL,
  `use_alternative_url` tinyint(1) NOT NULL DEFAULT '0',
  `alternative_url` varchar(100) NOT NULL DEFAULT '',
  `subject` varchar(100) NOT NULL,
  `default_type` int(11) NOT NULL DEFAULT '0',
  `logo` varchar(50) NOT NULL,
  `customer_message` text NOT NULL,
  `response_message` text NOT NULL,
  `notify_contact` tinyint(1) NOT NULL DEFAULT '0',
  `language` varchar(20) DEFAULT NULL,
  `expire_days` int(11) NOT NULL DEFAULT '0',
  `never_close_status_id` int(11) DEFAULT NULL,
  `disable_reminder_assigned` tinyint(1) NOT NULL DEFAULT '0',
  `disable_reminder_unanswered` tinyint(1) NOT NULL DEFAULT '0',
  `enable_external_page` tinyint(1) NOT NULL DEFAULT '0',
  `allow_anonymous` tinyint(1) NOT NULL DEFAULT '0',
  `external_page_css` text,
	`leave_type_blank_by_default` tinyint(1) NOT NULL DEFAULT '0',
  `new_ticket` BOOLEAN NOT NULL DEFAULT '0',
	`new_ticket_msg` text,
	`assigned_to` BOOLEAN NOT NULL DEFAULT '0',
	`assigned_to_msg` text,
	`notify_agent` BOOLEAN NOT NULL DEFAULT '0',
	`notify_agent_msg` text,
	`notify_due_date` BOOLEAN NOT NULL DEFAULT '0',
	`notify_due_date_msg` text,
	`manager_reopen_ticket_only` tinyint(1) NOT NULL DEFAULT '0',
	`show_close_confirm` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB ;

DROP TABLE IF EXISTS `ti_statuses`;
CREATE TABLE IF NOT EXISTS `ti_statuses` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;



DROP TABLE IF EXISTS `ti_templates`;
CREATE TABLE IF NOT EXISTS `ti_templates` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `content` text NOT NULL,
  `user_id` int(11) NOT NULL,
  `autoreply` BOOLEAN NOT NULL DEFAULT '0',
  `default_template` BOOLEAN NOT NULL DEFAULT '0',
  `ticket_created_for_client` BOOLEAN NOT NULL DEFAULT '0',
	`ticket_mail_for_agent` BOOLEAN NOT NULL DEFAULT '0',
	`ticket_claim_notification` BOOLEAN NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB ;


DROP TABLE IF EXISTS `ti_tickets`;
CREATE TABLE IF NOT EXISTS `ti_tickets` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ticket_number` varchar(16) DEFAULT NULL,
  `ticket_verifier` int(11) NOT NULL DEFAULT '0',
  `priority` int(11) NOT NULL DEFAULT '1',
  `status_id` int(11) NOT NULL DEFAULT '0',
  `type_id` int(11) NOT NULL DEFAULT '0',
  `user_id` int(11) NOT NULL DEFAULT '0',
  `agent_id` INT( 11 ) NOT NULL DEFAULT '0',
  `contact_id` int(11) NOT NULL DEFAULT '0',
  `company` varchar(100) NOT NULL DEFAULT '',
  `company_id` int(11) NOT NULL DEFAULT '0',
  `first_name` varchar(50) NOT NULL DEFAULT '',
  `middle_name` varchar(100) NOT NULL DEFAULT '',
  `last_name` varchar(50) NOT NULL DEFAULT '',
  `email` varchar(100)  NOT NULL DEFAULT '',
  `phone` varchar(50)  NOT NULL DEFAULT '',
  `subject` varchar(100) NOT NULL,
  `ctime` int(11) NOT NULL DEFAULT '0',
  `mtime` int(11) NOT NULL DEFAULT '0',
  `muser_id` int(11) NOT NULL DEFAULT '0',
  `files_folder_id` int(11) NOT NULL DEFAULT '0',
  `unseen` int(1) NOT NULL DEFAULT '1',
  `group_id` int(11) NOT NULL DEFAULT '0',
  `order_id` INT NOT NULL DEFAULT '0',
  `last_response_time` int(11) NOT NULL DEFAULT '0',
  `cc_addresses` varchar(1024) NOT NULL DEFAULT '',
	`cuser_id` int(11) NOT NULL DEFAULT '0',
`due_date` INT NULL,
`due_reminder_sent` TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `type_id` (`type_id`),
  KEY `user_id` (`user_id`),
  KEY `status_id` (`status_id`)
) ENGINE=InnoDB;


DROP TABLE IF EXISTS `ti_types`;
CREATE TABLE IF NOT EXISTS `ti_types` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `user_id` int(11) NOT NULL,
  `acl_id` int(11) NOT NULL,
  `show_statuses` varchar(100) DEFAULT NULL,
  `show_from_others` tinyint(1) NOT NULL DEFAULT '0',
  `files_folder_id` int(11) NOT NULL DEFAULT '0',
  `email_on_new` text,
  `email_to_agent` tinyint(1) NOT NULL DEFAULT '0',
  `custom_sender_field` tinyint(1) NOT NULL DEFAULT '0',
  `sender_name` varchar(64) DEFAULT NULL,
  `sender_email` varchar(128) DEFAULT NULL,
  `publish_on_site` tinyint(1) NOT NULL DEFAULT '0',
  `type_group_id` INT NULL DEFAULT NULL,
	`email_account_id` INT NOT NULL DEFAULT  '0',
	`enable_templates` BOOLEAN NOT NULL DEFAULT '0',
	`new_ticket` BOOLEAN NOT NULL DEFAULT '0',
	`new_ticket_msg` text,
	`assigned_to` BOOLEAN NOT NULL DEFAULT '0',
	`assigned_to_msg` text,
	`notify_agent` BOOLEAN NOT NULL DEFAULT '0',
	`notify_agent_msg` text,
	`search_cache_acl_id` int(11) NOT NULL DEFAULT 0,
	`email_on_new_msg` TEXT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB ;

DROP TABLE IF EXISTS `ti_type_groups`;
CREATE TABLE IF NOT EXISTS `ti_type_groups` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  `sort_index` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

ALTER TABLE `ti_tickets` ADD `last_agent_response_time` INT(11) NOT NULL DEFAULT '0', ADD `last_contact_response_time` INT(11) NOT NULL DEFAULT '0' AFTER `last_agent_response_time`;

ALTER TABLE `ti_tickets` ADD INDEX `unseen_type_id_agent_id` (`unseen`, `type_id`, `agent_id`);
ALTER TABLE `ti_types` ADD INDEX `name` (`name`);