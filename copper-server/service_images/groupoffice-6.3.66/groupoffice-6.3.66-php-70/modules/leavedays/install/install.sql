

CREATE TABLE IF NOT EXISTS `ld_credit_types` (
  `id` int(11) AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text NOT NULL,
  `credit_doesnt_expired` tinyint(1) NOT NULL DEFAULT '0',
  `sort_index` int(11) NOT NULL DEFAULT '0',
	PRIMARY KEY (`id`)
) ENGINE=InnoDB;



CREATE TABLE IF NOT EXISTS `ld_leave_days` (
  `id` int(11) AUTO_INCREMENT,
  `user_id` int(11) NOT NULL DEFAULT '0',
  `first_date` int(11) NOT NULL DEFAULT '0',
  `last_date` int(11) NOT NULL DEFAULT '0',
  `from_time` time DEFAULT NULL,
  `n_hours` double NOT NULL DEFAULT '0',
  `n_nat_holiday_hours` double NOT NULL DEFAULT '0',
  `description` varchar(50) NOT NULL DEFAULT '',
  `ctime` int(11) NOT NULL DEFAULT '0',
  `mtime` int(11) NOT NULL DEFAULT '0',
  `status` int(11) NOT NULL DEFAULT '0',
  `ld_credit_type_id` int(11) NOT NULL,
	PRIMARY KEY (`id`)
) ENGINE=InnoDB;


CREATE TABLE IF NOT EXISTS `ld_year_credits` (
  `id` int(11) AUTO_INCREMENT,
  `user_id` int(11) NOT NULL DEFAULT '0',
  `year` int(4) NOT NULL DEFAULT '0',
  `comments` varchar(50) NOT NULL DEFAULT '0',
  `manager_user_id` int(11) DEFAULT NULL,
	PRIMARY KEY (`id`)
) ENGINE=InnoDB;



CREATE TABLE IF NOT EXISTS `ld_credits` (
  `ld_year_credit_id` int(11) NOT NULL,
  `ld_credit_type_id` int(11) NOT NULL,
  `n_hours` double DEFAULT NULL
) ENGINE=InnoDB;

ALTER TABLE `ld_credits` ADD PRIMARY KEY (`ld_year_credit_id`,`ld_credit_type_id`);