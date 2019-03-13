-- --------------------------------------------------------


--
-- Tabelstructuur voor tabel `exact_project_templates`
--

CREATE TABLE IF NOT EXISTS `exact_addressbook_addressbook` (
  `addressbook_id` int(11) NOT NULL,
  `division_code` int(11) NOT NULL
) ENGINE=InnoDB;


CREATE TABLE IF NOT EXISTS `exact_addressbook_companies` (
  `company_id` int(11) NOT NULL,
  `account_id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB;


CREATE TABLE `exact_project2_income` (
  `income_id` int(11) NOT NULL,
  `invoice_id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `open_fee` double NOT NULL DEFAULT '0'
) ENGINE=InnoDB;


CREATE TABLE IF NOT EXISTS `exact_project_templates` (
  `template_id` int(11) NOT NULL,
  `division_number` varchar(16) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT ''
) ENGINE=InnoDB;


ALTER TABLE `exact_addressbook_addressbook`
  ADD PRIMARY KEY (`addressbook_id`),
  ADD UNIQUE KEY `addressbook_id` (`addressbook_id`);


ALTER TABLE `exact_addressbook_companies`
  ADD PRIMARY KEY (`company_id`),
  ADD UNIQUE KEY `company_id` (`company_id`);


ALTER TABLE `exact_project_templates`
  ADD PRIMARY KEY (`template_id`);


ALTER TABLE `exact_project2_income` ADD PRIMARY KEY( `income_id`, `invoice_id`);


CREATE TABLE `exact_addressbook_contacts` (
  `contact_id` int(11) NOT NULL,
  `account_id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `division_number` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT ''
) ENGINE=InnoDB;


ALTER TABLE `exact_addressbook_contacts`
  ADD PRIMARY KEY (`contact_id`,`account_id`,`division_number`);