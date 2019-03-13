-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `wf_approvers`
--

CREATE TABLE IF NOT EXISTS `wf_approvers` (
  `step_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `wf_approvers_groups`
--

CREATE TABLE IF NOT EXISTS `wf_approvers_groups` (
  `step_id` int(11) NOT NULL,
  `group_id` int(11) NOT NULL
) ENGINE=InnoDB;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `wf_models`
--

CREATE TABLE IF NOT EXISTS `wf_models` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `model_id` int(11) NOT NULL,
  `model_type_id` int(11) NOT NULL,
  `process_id` int(11) NOT NULL,
  `step_id` int(11) NOT NULL,
  `ctime` int(11) NOT NULL,
  `due_time` int(11) NOT NULL,
  `shift_due_time` int(11) NOT NULL DEFAULT '0',
	`user_id` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `wf_processes`
--

CREATE TABLE IF NOT EXISTS `wf_processes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL DEFAULT '',
  `acl_id` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `wf_steps`
--

CREATE TABLE IF NOT EXISTS `wf_steps` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `process_id` int(11) NOT NULL,
  `sort_order` int(11) NOT NULL,
  `name` varchar(100) NOT NULL DEFAULT '',
  `description` text NOT NULL,
  `due_in` int(11) NOT NULL,
  `email_alert` tinyint(1) NOT NULL DEFAULT '0',
  `popup_alert` tinyint(1) NOT NULL DEFAULT '0',
  `all_must_approve` tinyint(1) NOT NULL DEFAULT '0',
	`action_type_id` int(11) NOT NULL DEFAULT '0',
	`copy_to_folder` varchar(256),
	`keep_original_copy` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

-- --------------------------------------------------------

--
--	Tabelstructuur voor tabel `wf_action_types
--

CREATE TABLE IF NOT EXISTS `wf_action_types` (
	`id` int(11) NOT NULL AUTO_INCREMENT,
	`name` varchar(64) NOT NULL DEFAULT 'Approve only',
	`class_name` varchar(64) NOT NULL DEFAULT 'GO_Workflow_Action_Approve',
	PRIMARY KEY (`id`)
) ENGINE=InnoDB;


INSERT INTO `wf_action_types` (`id`,`name`,`class_name`) VALUES ('1','Approve only','GO\\Workflow\\Action\\Approve');
INSERT INTO `wf_action_types` (`id`,`name`,`class_name`) VALUES ('2','Approve, then Copy / Move file','GO\\Workflow\\Action\\Copy');
INSERT INTO `wf_action_types` (`id`,`name`,`class_name`) VALUES ('3','Approve, then Workflow history in PDF','GO\\Workflow\\Action\\HistoryPdf');
INSERT INTO `wf_action_types` (`id`,`name`,`class_name`) VALUES ('4','Approve, then Workflow history in copy PDF','GO\\Workflow\\Action\\HistoryPdfInCopy');


-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `wf_step_history`
--

CREATE TABLE IF NOT EXISTS `wf_step_history` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `process_model_id` int(11) NOT NULL,
  `step_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `comment` text NOT NULL,
  `ctime` int(11) NOT NULL,
  `status` tinyint(4) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `wf_triggers`
--

CREATE TABLE IF NOT EXISTS `wf_triggers` (
  `model_type_id` int(11) NOT NULL,
  `model_attribute` varchar(100) NOT NULL DEFAULT '',
  `model_attribute_value` varchar(100) NOT NULL DEFAULT '',
  `process_id` int(11) NOT NULL,
  PRIMARY KEY (`model_type_id`,`model_attribute`,`model_attribute_value`,`process_id`)
) ENGINE=InnoDB;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `wf_required_approvers`
--

CREATE TABLE IF NOT EXISTS `wf_required_approvers` (
  `process_model_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `approved` tinyint(1) NOT NULL DEFAULT '0',
  `reminder_id` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`process_model_id`,`user_id`)
) ENGINE=InnoDB;