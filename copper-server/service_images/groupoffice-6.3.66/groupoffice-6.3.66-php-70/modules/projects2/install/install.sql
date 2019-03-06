-----################ PROJECT INSTALL ######################-----

--
-- Tabelstructuur voor tabel `cf_pr2_hours`
--

DROP TABLE IF EXISTS `cf_pr2_hours`;
CREATE TABLE IF NOT EXISTS `cf_pr2_hours` (
  `model_id` int(11) NOT NULL,
  PRIMARY KEY (`model_id`)
) ENGINE=InnoDB;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `cf_pr2_projects`
--

DROP TABLE IF EXISTS `cf_pr2_projects`;
CREATE TABLE IF NOT EXISTS `cf_pr2_projects` (
  `model_id` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`model_id`)
) ENGINE=InnoDB;

-- --------------------------------------------------------


--
-- Tabelstructuur voor tabel `go_links_pr2_projects`
--

DROP TABLE IF EXISTS `go_links_pr2_projects`;
CREATE TABLE IF NOT EXISTS `go_links_pr2_projects` (
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
-- Table structure for table `pr2_employees`
--

DROP TABLE IF EXISTS `pr2_employees`;
CREATE TABLE IF NOT EXISTS `pr2_employees` (
  `user_id` int(11) NOT NULL,
  `closed_entries_time` int(11) DEFAULT NULL,
  `ctime` int(11) DEFAULT NULL,
  `mtime` int(11) DEFAULT NULL,
  `external_fee` double NOT NULL DEFAULT '0',
	`internal_fee` double NOT NULL DEFAULT '0',
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB;

-- --------------------------------------------------------

--
-- Table structure for table `pr2_expenses`
--

DROP TABLE IF EXISTS `pr2_expenses`;
CREATE TABLE IF NOT EXISTS `pr2_expenses` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `project_id` int(11) NOT NULL,
  `nett` double NOT NULL DEFAULT '0',
  `vat` double NOT NULL DEFAULT '0',
  `date` int(11) NOT NULL DEFAULT '0',
  `invoice_id` varchar(100) NOT NULL,
  `description` varchar(255) NOT NULL DEFAULT '',
  `mtime` int(11) NOT NULL,
  `expense_budget_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `invoice_id` (`invoice_id`),
  KEY `fk_pr2_expenses_pr2_expense_budgets1_idx` (`expense_budget_id`),
  KEY `fk_pr2_expenses_pr2_projects1_idx` (`project_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `pr2_expense_budgets`
--

DROP TABLE IF EXISTS `pr2_expense_budgets`;
CREATE TABLE IF NOT EXISTS `pr2_expense_budgets` (
  `id` INT(11) NOT NULL AUTO_INCREMENT ,
  `description` VARCHAR(255) NOT NULL DEFAULT '' ,
  `nett` DOUBLE NOT NULL DEFAULT '0' ,
  `vat` DOUBLE NOT NULL DEFAULT '0' ,
  `ctime` INT(11) NOT NULL ,
  `mtime` INT(11) NOT NULL ,
  `supplier_company_id` INT(11) NULL DEFAULT NULL ,
  `budget_category_id` INT(11) NULL DEFAULT NULL,
  `project_id` INT(11) NOT NULL ,
  `comments` VARCHAR(1024) NOT NULL DEFAULT '',
  `id_number` VARCHAR(16) NOT NULL DEFAULT '',
  `quantity` FLOAT NOT NULL DEFAULT '1' , 
  `unit_type` VARCHAR(50) NOT NULL DEFAULT '' ,
  `contact_id` INT NULL DEFAULT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;

-- --------------------------------------------------------


-- --------------------------------------------------------

--
-- Table structure for table `pr2_hours`
--

DROP TABLE IF EXISTS `pr2_hours`;
CREATE TABLE IF NOT EXISTS `pr2_hours` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `duration` int(11) NOT NULL DEFAULT '0',
  `type` int(11) NOT NULL DEFAULT '0',
  `date` int(11) NOT NULL DEFAULT '0',
  `units` double NOT NULL DEFAULT '0',
  `comments` text,
  `external_fee` double NOT NULL DEFAULT '0',
  `internal_fee` double NOT NULL DEFAULT '0',
  `status` int(11) NOT NULL DEFAULT '0',
  `income_id` int(11) DEFAULT NULL,
  `ctime` int(11) NOT NULL DEFAULT '0',
  `mtime` int(11) NOT NULL DEFAULT '0',
  `project_id` int(11) DEFAULT NULL,
  `standard_task_id` int(11) DEFAULT NULL,
  `task_id` int(11) NOT NULL DEFAULT '0',
  `travel_distance` float NOT NULL DEFAULT '0',
  `travel_costs` double NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `status` (`status`),
  KEY `income_id` (`income_id`),
  KEY `user_id` (`user_id`),
  KEY `fk_pr2_hours_pr2_projects1_idx` (`project_id`),
  KEY `fk_pr2_hours_pr2_standard_tasks1_idx` (`standard_task_id`)
) ENGINE=InnoDB ;

-- --------------------------------------------------------

--
-- Table structure for table `pr2_portlet_statuses`
--

DROP TABLE IF EXISTS `pr2_portlet_statuses`;
CREATE TABLE IF NOT EXISTS `pr2_portlet_statuses` (
  `user_id` int(11) NOT NULL,
  `status_id` int(11) NOT NULL,
  PRIMARY KEY (`user_id`,`status_id`)
) ENGINE=InnoDB;

-- --------------------------------------------------------

--
-- Table structure for table `pr2_projects`
--

DROP TABLE IF EXISTS `pr2_projects`;
CREATE TABLE IF NOT EXISTS `pr2_projects` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL DEFAULT '0',
  `acl_id` INT(11) NOT NULL,
  `name` varchar(100) NOT NULL DEFAULT '',
  `customer` varchar(201) DEFAULT '',
  `description` text,
  `company_id` int(11) NOT NULL DEFAULT '0',
  `ctime` int(11) NOT NULL DEFAULT '0',
  `mtime` int(11) NOT NULL DEFAULT '0',
  `threshold_mails` varchar(45) DEFAULT NULL,
  `muser_id` int(11) NOT NULL DEFAULT '0',
  `start_time` int(11) NOT NULL DEFAULT '0',
  `due_time` int(11) NOT NULL DEFAULT '0',
  `contact_id` int(11) NOT NULL DEFAULT '0',
  `contact` varchar(150) DEFAULT NULL,
  `files_folder_id` int(11) NOT NULL DEFAULT '0',
  `responsible_user_id` int(11) NOT NULL DEFAULT '0',
  `calendar_id` int(11) NOT NULL DEFAULT '0',
  `event_id` int(11) NOT NULL DEFAULT '0',
  `path` varchar(255) NOT NULL DEFAULT '',
  `income_type` SMALLINT(2) NOT NULL DEFAULT 1,
  `status_id` int(11) DEFAULT NULL,
  `type_id` int(11) NOT NULL,
  `template_id` int(11) NOT NULL,
  `parent_project_id` INT( 11 ) NOT NULL DEFAULT  '0',
  `default_distance` double DEFAULT NULL,
  `travel_costs` double NOT NULL DEFAULT '0',
	`reference_no` VARCHAR(64) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `responsible_user_id` (`responsible_user_id`),
  KEY `fk_pr2_projects_pr2_statuses1_idx` (`status_id`),
  KEY `fk_pr2_projects_pr2_types1_idx` (`type_id`),
  KEY `fk_pr2_projects_pr2_templates1_idx` (`template_id`)
) ENGINE=InnoDB ;

-- --------------------------------------------------------

--
-- Table structure for table `pr2_resources`
--

DROP TABLE IF EXISTS `pr2_resources`;
CREATE TABLE IF NOT EXISTS `pr2_resources` (
  `project_id` int(11) NOT NULL DEFAULT '0',
  `user_id` int(11) NOT NULL,
  `budgeted_units` double NOT NULL DEFAULT '0',
  `external_fee` double NOT NULL DEFAULT '0',
  `internal_fee` double NOT NULL DEFAULT '0',
  `apply_internal_overtime` tinyint(1) NOT NULL DEFAULT '0',
  `apply_external_overtime` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`project_id`,`user_id`),
  KEY `fk_pm_user_fees_pm_projects1_idx` (`project_id`)
) ENGINE=InnoDB;


--
-- Table structure for table `pr2_default_resources`
--

DROP TABLE IF EXISTS `pr2_default_resources`;
CREATE TABLE IF NOT EXISTS `pr2_default_resources` (
  `template_id` int(11) NOT NULL DEFAULT '0',
  `user_id` int(11) NOT NULL,
  `budgeted_units` double NOT NULL DEFAULT '0',
  `external_fee` double NOT NULL DEFAULT '0',
  `internal_fee` double NOT NULL DEFAULT '0',
  `apply_internal_overtime` tinyint(1) NOT NULL DEFAULT '0',
  `apply_external_overtime` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`template_id`,`user_id`),
  KEY `fk_pm_user_fees_pm_templates1_idx` (`template_id`)
) ENGINE=InnoDB;

-- --------------------------------------------------------

--
-- Table structure for table `pr2_standard_tasks`
--

DROP TABLE IF EXISTS `pr2_standard_tasks`;
CREATE TABLE IF NOT EXISTS `pr2_standard_tasks` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `units` double NOT NULL,
  `description` text,
  `disabled` tinyint(1) NOT NULL DEFAULT '0',
  `is_billable` TINYINT(1) NOT NULL DEFAULT 1,
	`is_always_billable` TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

-- --------------------------------------------------------

--
-- Table structure for table `pr2_statuses`
--

DROP TABLE IF EXISTS `pr2_statuses`;
CREATE TABLE IF NOT EXISTS `pr2_statuses` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL DEFAULT '',
  `complete` tinyint(1) NOT NULL DEFAULT '0',
  `sort_order` int(11) NOT NULL DEFAULT '0',
  `filterable` tinyint(1) NOT NULL DEFAULT '1',
  `show_in_tree` tinyint(1) NOT NULL DEFAULT '1',
  `make_invoiceable` TINYINT(1) NOT NULL DEFAULT 0,
  `not_for_postcalculation` tinyint(1) NOT NULL DEFAULT '0',
  `acl_id` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `sort_order` (`sort_order`)
) ENGINE=InnoDB ;

-- --------------------------------------------------------

--
-- Table structure for table `pr2_tasks`
--

DROP TABLE IF EXISTS `pr2_tasks`;
CREATE TABLE IF NOT EXISTS `pr2_tasks` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `project_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `percentage_complete` tinyint(4) NOT NULL DEFAULT '0',
  `duration` double NOT NULL DEFAULT '60',
  `due_date` int(11) DEFAULT NULL,
  `description` varchar(255) NOT NULL,
  `sort_order` int(11) DEFAULT NULL,
  `parent_id` int(11) NOT NULL DEFAULT '0',
  `has_children` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `project_id` (`project_id`)
) ENGINE=InnoDB ;

-- --------------------------------------------------------

--
-- Table structure for table `pr2_templates`
--

DROP TABLE IF EXISTS `pr2_templates`;
CREATE TABLE IF NOT EXISTS `pr2_templates` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL DEFAULT '0',
  `name` varchar(50) NOT NULL DEFAULT '',
  `acl_id` int(11) NOT NULL DEFAULT '0',
  `files_folder_id` int(11) NOT NULL DEFAULT '0',
  `fields` varchar(255) NOT NULL DEFAULT '',
  `icon` varchar(255) NOT NULL DEFAULT '',
  `project_type` tinyint(4) NOT NULL DEFAULT '0',
  `default_income_email_template` INT(11) DEFAULT NULL,
  `default_status_id` int(11) NOT NULL,
  `default_type_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_pr2_templates_pr2_types1_idx` (`default_type_id`),
  KEY `fk_pr2_templates_pr2_statuses1_idx` (`default_status_id`)
) ENGINE=InnoDB ;

-- --------------------------------------------------------

--
-- Table structure for table `pr2_templates_events`
--

DROP TABLE IF EXISTS `pr2_templates_events`;
CREATE TABLE IF NOT EXISTS `pr2_templates_events` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `description` text,
  `time_offset` int(11) DEFAULT NULL,
  `duration` int(11) DEFAULT NULL,
  `type` varchar(20) NOT NULL DEFAULT '0',
  `reminder` int(11) NOT NULL DEFAULT '0',
  `user_id` int(11) NOT NULL,
  `new_template_id` int(11) NOT NULL DEFAULT '0',
  `template_id` int(11) NOT NULL,
  `for_manager` TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `fk_pr2_templates_events_pr2_templates1_idx` (`template_id`)
) ENGINE=InnoDB;

-- --------------------------------------------------------

--
-- Table structure for table `pr2_timers`
--

DROP TABLE IF EXISTS `pr2_timers`;
CREATE TABLE IF NOT EXISTS `pr2_timers` (
  `project_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `starttime` int(11) NOT NULL,
  PRIMARY KEY (`project_id`,`user_id`),
  KEY `project_id` (`user_id`,`starttime`)
) ENGINE=InnoDB;

-- --------------------------------------------------------

--
-- Table structure for table `pr2_types`
--

DROP TABLE IF EXISTS `pr2_types`;
CREATE TABLE IF NOT EXISTS `pr2_types` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  `user_id` int(11) NOT NULL,
  `acl_id` int(11) NOT NULL DEFAULT '0',
  `acl_book` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB ;

--
-- Table structure for table `pr2_income`
--
DROP TABLE IF EXISTS `pr2_income`;
CREATE TABLE IF NOT EXISTS `pr2_income` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `description` VARCHAR(255) NOT NULL DEFAULT '',
  `amount` DOUBLE NOT NULL,
  `is_invoiced` TINYINT(1) NOT NULL DEFAULT 0,
  `invoiceable` TINYINT(1) NOT NULL DEFAULT 0,
	`period_start` INT(11) NOT NULL DEFAULT '0',
	`period_end` INT(11) NOT NULL DEFAULT '0',
  `paid_at` INT(11) NULL,
  `invoice_at` INT(11) NOT NULL,
  `invoice_number` VARCHAR(45) NOT NULL DEFAULT '',
  `type` TINYINT(1) NOT NULL,
  `project_id` INT(11) NOT NULL,
	`reference_no` VARCHAR(64) NOT NULL DEFAULT '',
	`comments` TEXT,
	`files_folder_id` INT(11) NOT NULL DEFAULT '0',
	`is_contract` tinyint(1) NOT NULL DEFAULT '0',
	`contract_repeat_amount` int(11) NOT NULL DEFAULT '1',
	`contract_repeat_freq` varchar(10) NOT NULL DEFAULT '',
	`contract_end` int(11) NOT NULL DEFAULT '0',
  `contract_end_notification_days` int(11) NOT NULL DEFAULT '10',
  `contract_end_notification_active` tinyint(1) NOT NULL DEFAULT '0',
  `contract_end_notification_template` int(11) NULL DEFAULT NULL,
  `contract_end_notification_sent` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
)
ENGINE = InnoDB ;




ALTER TABLE `pr2_templates` ADD `use_name_template` BOOLEAN NOT NULL DEFAULT FALSE, ADD `name_template` VARCHAR(80) NOT NULL AFTER `use_name_template`; 


ALTER TABLE `pr2_income` CHANGE `paid_at` `paid_at` INT(11) NOT NULL DEFAULT '0';



--
-- Tabelstructuur voor tabel `pr2_income_items`
--

CREATE TABLE `pr2_income_items` (
  `id` int(11) NOT NULL,
  `income_id` int(11) NOT NULL,
  `amount` double NOT NULL DEFAULT '0',
  `description` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT ''
) ENGINE=InnoDB;


CREATE TABLE `pr2_employee_activity_rate` (
  `activity_id` INT NOT NULL,
  `employee_id` INT NOT NULL,
  `external_rate` FLOAT NOT NULL,
  PRIMARY KEY (`activity_id`, `employee_id`),
  INDEX `fk_pr2_employee_activity_idx` (`employee_id` ASC),
  CONSTRAINT `fk_pr2_employee_activity`
    FOREIGN KEY (`employee_id`)
    REFERENCES `pr2_employees` (`user_id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION);


CREATE TABLE `pr2_resource_activity_rate` (
  `activity_id` INT NOT NULL,
  `employee_id` INT NOT NULL,
  `project_id` INT NOT NULL,
  `external_rate` FLOAT NOT NULL,
  PRIMARY KEY (`activity_id`, `employee_id`, `project_id`),
  INDEX `fk_pr2_resource_activity_idx` (`project_id` ASC, `employee_id` ASC),
  CONSTRAINT `fk_pr2_resource_activity`
    FOREIGN KEY (`project_id`, `employee_id`)
    REFERENCES `pr2_resources` (`project_id`, `user_id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
);


--
-- Indexen voor geëxporteerde tabellen
--

--
-- Indexen voor tabel `pr2_income_items`
--
ALTER TABLE `pr2_income_items`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT voor geëxporteerde tabellen
--

--
-- AUTO_INCREMENT voor een tabel `pr2_income_items`
--
ALTER TABLE `pr2_income_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;


ALTER TABLE `pr2_income` ADD `contact` VARCHAR(190) NULL DEFAULT NULL AFTER `contract_end_notification_sent`;
