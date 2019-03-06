--
-- Tabelstructuur voor tabel `cf_bs_products`
--

DROP TABLE IF EXISTS `cf_bs_products`;
CREATE TABLE IF NOT EXISTS `cf_bs_products` (
  `model_id` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`model_id`)
) ENGINE=InnoDB;


---
-- Tabelstructuur voor tabel `bs_batchjobs`
--

DROP TABLE IF EXISTS `bs_batchjobs`;
CREATE TABLE IF NOT EXISTS `bs_batchjobs` (
  `id` int(11) NOT NULL DEFAULT '0',
  `book_id` int(11) NOT NULL DEFAULT '0',
  `time` int(11) NOT NULL DEFAULT '0',
  `user_id` int(11) NOT NULL DEFAULT '0',
  `from_status_id` int(11) NOT NULL DEFAULT '0',
  `to_status_id` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `book_id` (`book_id`)
) ENGINE=InnoDB;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `bs_batchjob_orders`
--

DROP TABLE IF EXISTS `bs_batchjob_orders`;
CREATE TABLE IF NOT EXISTS `bs_batchjob_orders` (
  `batchjob_id` int(11) NOT NULL DEFAULT '0',
  `order_id` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`batchjob_id`,`order_id`)
) ENGINE=InnoDB;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `bs_books`
--
DROP TABLE IF EXISTS `bs_books`;
CREATE TABLE IF NOT EXISTS `bs_books` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL DEFAULT '0',
  `name` varchar(100) DEFAULT NULL,
  `acl_id` int(11) NOT NULL DEFAULT '0',
  `order_id_prefix` varchar(50) DEFAULT NULL,
  `order_id_length` int(11) NOT NULL DEFAULT '6',
  `show_statuses` varchar(100) DEFAULT NULL,
  `next_id` int(11) NOT NULL DEFAULT '0',
  `default_vat` double NOT NULL DEFAULT '19',
  `currency` varchar(10) DEFAULT NULL,
  `order_csv_template` text,
  `item_csv_template` text,
  `country` CHAR(2) NOT NULL DEFAULT '',
  `call_after_days` tinyint(4) NOT NULL DEFAULT '0',
  `sender_email` varchar(100) DEFAULT NULL,
  `sender_name` varchar(100) DEFAULT NULL,
  `is_purchase_orders_book` tinyint(1) NOT NULL DEFAULT '0',
  `backorder_status_id` int(11) NOT NULL DEFAULT '0',
  `delivered_status_id` int(11) NOT NULL DEFAULT '0',
  `reversal_status_id` int(11) NOT NULL DEFAULT '0',
  `addressbook_id` int(11) NOT NULL DEFAULT '0',
  `files_folder_id` int(11) NOT NULL DEFAULT '0',
  `allow_delete` BOOLEAN NOT NULL DEFAULT FALSE,
	`import_status_id` INT NOT NULL DEFAULT '0',
  `auto_paid_status` BOOLEAN NOT NULL DEFAULT 0,
	`import_notify_customer` INT NOT NULL DEFAULT '0',
	`import_duplicate_to_book` INT NOT NULL DEFAULT '0',
	`import_duplicate_status_id` INT NOT NULL DEFAULT '0',
  `show_sales_agents` tinyint(1) NOT NULL DEFAULT '0',
`default_due_days` INT NOT NULL DEFAULT '14',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB ;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `bs_category_languages`
--

DROP TABLE IF EXISTS `bs_category_languages`;
CREATE TABLE IF NOT EXISTS `bs_category_languages` (
  `language_id` int(11) NOT NULL DEFAULT '0',
  `category_id` int(11) NOT NULL DEFAULT '0',
  `name` varchar(50) NOT NULL DEFAULT '',
  PRIMARY KEY (`language_id`,`category_id`)
) ENGINE=InnoDB;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `bs_cost_codes`
--

DROP TABLE IF EXISTS `bs_cost_codes`;
CREATE TABLE IF NOT EXISTS `bs_cost_codes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `book_id` int(11) NOT NULL,
  `code` varchar(10) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text,
  PRIMARY KEY (`id`),
  KEY `book_id` (`book_id`)
) ENGINE=InnoDB;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `bs_doc_templates`
--

DROP TABLE IF EXISTS `bs_doc_templates`;
CREATE TABLE IF NOT EXISTS `bs_doc_templates` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `book_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL DEFAULT '0',
  `name` varchar(100) DEFAULT NULL,
  `content` longblob NOT NULL,
  `extension` varchar(4) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `bs_expenses`
--

DROP TABLE IF EXISTS `bs_expenses`;
CREATE TABLE IF NOT EXISTS `bs_expenses` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL DEFAULT '0',
  `expense_book_id` int(11) NOT NULL DEFAULT '0',
  `category_id` int(11) NOT NULL DEFAULT '0',
  `supplier` varchar(100) DEFAULT NULL,
  `invoice_no` INT( 11 ) NOT NULL DEFAULT  '0',
  `ctime` int(11) NOT NULL DEFAULT '0',
  `mtime` int(11) NOT NULL DEFAULT '0',
  `btime` int(11) DEFAULT '0',
  `ptime` int(11) DEFAULT NULL,
  `subtotal` double NOT NULL DEFAULT '0',
  `vat` double NOT NULL DEFAULT '0',
	`invoice_id` INT( 11 ) NOT NULL DEFAULT  '0',
  PRIMARY KEY (`id`),
  KEY `book_id` (`expense_book_id`,`category_id`),
  KEY `invoice_id` (`invoice_id`)
) ENGINE=InnoDB;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `bs_expense_books`
--

DROP TABLE IF EXISTS `bs_expense_books`;
CREATE TABLE IF NOT EXISTS `bs_expense_books` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL DEFAULT '0',
  `acl_id` int(11) NOT NULL DEFAULT '0',
  `name` varchar(50) DEFAULT NULL,
  `currency` varchar(10) DEFAULT NULL,
  `vat` double NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `bs_expense_categories`
--

DROP TABLE IF EXISTS `bs_expense_categories`;
CREATE TABLE IF NOT EXISTS `bs_expense_categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `expense_book_id` int(11) NOT NULL DEFAULT '0',
  `name` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `book_id` (`expense_book_id`)
) ENGINE=InnoDB;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `bs_items`
--

DROP TABLE IF EXISTS `bs_items`;
CREATE TABLE IF NOT EXISTS `bs_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) NOT NULL DEFAULT '0',
  `product_id` int(11) NOT NULL DEFAULT '0',
  `description` text,
  `unit_cost` double NOT NULL DEFAULT '0',
  `unit_price` double NOT NULL DEFAULT '0',
  `unit_list` double NOT NULL DEFAULT '0',
  `unit_total` double NOT NULL DEFAULT '0',
  `amount` double NOT NULL DEFAULT '0',
  `vat` double NOT NULL DEFAULT '0',
	`vat_code` varchar(255) DEFAULT NULL,
  `discount` double NOT NULL DEFAULT '0',
  `sort_order` int(11) NOT NULL DEFAULT '0',
  `cost_code` varchar(50) DEFAULT NULL,
	`tracking_code` varchar(255) DEFAULT NULL,
  `markup` double NOT NULL DEFAULT '0',
  `order_at_supplier` tinyint(1) NOT NULL DEFAULT '0',
  `order_at_supplier_company_id` int(11) NOT NULL DEFAULT '0',
  `amount_delivered` double NOT NULL DEFAULT '0',
  `note` text,
  `unit` varchar(50) NOT NULL DEFAULT '',
  `item_group_id` int(11) NOT NULL DEFAULT '0',
	`extra_cost_status_id` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `product_id` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `bs_languages`
--

DROP TABLE IF EXISTS `bs_languages`;
CREATE TABLE IF NOT EXISTS `bs_languages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `language` varchar(10) NOT NULL DEFAULT '',
  `name` varchar(50) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;
ALTER TABLE `bs_languages`
ADD INDEX `language` (`language`);
-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `bs_numbers`
--

DROP TABLE IF EXISTS `bs_numbers`;
CREATE TABLE IF NOT EXISTS `bs_numbers` (
  `book_id` int(11) NOT NULL DEFAULT '0',
  `type` tinyint(4) NOT NULL DEFAULT '0',
  `next_id` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`book_id`,`type`)
) ENGINE=InnoDB;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `bs_orders`
--

DROP TABLE IF EXISTS `bs_orders`;
CREATE TABLE IF NOT EXISTS `bs_orders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `project_id` int(11) NOT NULL DEFAULT '0',
  `status_id` int(11) NOT NULL DEFAULT '0',
  `book_id` int(11) NOT NULL DEFAULT '0',
  `language_id` int(11) NOT NULL DEFAULT '0',
  `user_id` int(11) NOT NULL DEFAULT '0',
  `order_id` varchar(20) NOT NULL DEFAULT '',
  `po_id` varchar(50) NOT NULL DEFAULT '',
  `company_id` int(11) NOT NULL DEFAULT '0',
  `contact_id` int(11) NOT NULL DEFAULT '0',
  `ctime` int(11) NOT NULL DEFAULT '0',
  `mtime` int(11) NOT NULL DEFAULT '0',
	`muser_id` int(11) NOT NULL DEFAULT '0',
  `btime` int(11) NOT NULL DEFAULT '0',
  `ptime` int(11) NOT NULL DEFAULT '0',
  `costs` double NOT NULL DEFAULT '0',
  `subtotal` double NOT NULL DEFAULT '0',
  `vat` double,
  `total` double NOT NULL DEFAULT '0',
  `authcode` varchar(50) DEFAULT NULL,
  `frontpage_text` text,
  `customer_name` varchar(100) NOT NULL DEFAULT '',
  `customer_to` varchar(255) NOT NULL,
  `customer_salutation` varchar(100) DEFAULT NULL,
  `customer_contact_name` varchar(50) DEFAULT NULL,
  `customer_address` varchar(255) DEFAULT NULL,
  `customer_address_no` varchar(50) DEFAULT NULL,
  `customer_zip` varchar(20) DEFAULT NULL,
  `customer_city` varchar(50) DEFAULT NULL,
  `customer_state` varchar(50) DEFAULT NULL,
  `customer_country` char(2) NOT NULL,
  `customer_vat_no` varchar(50) DEFAULT NULL,
	`customer_crn` varchar(50) DEFAULT '',
  `customer_email` varchar(100) DEFAULT NULL,
  `customer_extra` varchar(255) NOT NULL DEFAULT '',
  `webshop_id` int(11) NOT NULL DEFAULT '0',
  `recur_type` varchar(10) NOT NULL DEFAULT '',
  `payment_method` varchar(50) NOT NULL DEFAULT '',
  `recurred_order_id` int(11) NOT NULL DEFAULT '0',
  `reference` varchar(100) NOT NULL DEFAULT '',
  `order_bonus_points` int(11) DEFAULT NULL,
  `pagebreak` tinyint(1) NOT NULL DEFAULT '0',
  `files_folder_id` int(11) NOT NULL DEFAULT '0',
  `cost_code` varchar(50) DEFAULT NULL,
  `for_warehouse` tinyint(1) NOT NULL DEFAULT '0',
  `dtime` int(11) NOT NULL DEFAULT '0',
	`total_paid` double NOT NULL DEFAULT '0',
	`due_date` int(11) NULL DEFAULT NULL,
	`other_shipping_address` tinyint(1) NOT NULL DEFAULT '0',
  `shipping_to` varchar(255) DEFAULT NULL,
  `shipping_salutation` varchar(100) DEFAULT NULL,
  `shipping_address` varchar(100) DEFAULT NULL,
  `shipping_address_no` varchar(50) DEFAULT NULL,
  `shipping_zip` varchar(20) DEFAULT NULL,
  `shipping_city` varchar(50) DEFAULT NULL,
  `shipping_state` varchar(50) DEFAULT NULL,
  `shipping_country` char(2) DEFAULT NULL,
  `shipping_extra` varchar(255) DEFAULT NULL,
	`telesales_agent` int(11) DEFAULT NULL,
  `fieldsales_agent` int(11) DEFAULT NULL,
	`extra_costs` double NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `company_id` (`company_id`),
  KEY `book_id` (`book_id`),
  KEY `status_id` (`status_id`),
  KEY `recurred_order_id` (`recurred_order_id`),
  KEY `project_id` (`project_id`)
) ENGINE=InnoDB;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `bs_order_item_groups`
--

DROP TABLE IF EXISTS `bs_order_item_groups`;
CREATE TABLE IF NOT EXISTS `bs_order_item_groups` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL DEFAULT 'Item Group',
  `summarize` tinyint(1) NOT NULL DEFAULT '0',
	`show_individual_prices` tinyint(1) NOT NULL DEFAULT '1',
	`sort_order` INT NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `bs_order_statuses`
--

DROP TABLE IF EXISTS `bs_order_statuses`;
CREATE TABLE IF NOT EXISTS `bs_order_statuses` (
  `id` INT( 11 ) NOT NULL AUTO_INCREMENT,
  `book_id` int(11) NOT NULL DEFAULT '0',
  `max_age` int(11) NOT NULL DEFAULT '0',
  `payment_required` tinyint(1) NOT NULL DEFAULT '0',
  `remove_from_stock` tinyint(1) NOT NULL DEFAULT '0',
  `read_only` tinyint(1) NOT NULL DEFAULT '0',
  `color` varchar(6) NOT NULL DEFAULT 'FFFFFF',
  `required_status_id` int(11) NOT NULL DEFAULT '0',
  `acl_id` int(11) NOT NULL,
	`apply_extra_cost` tinyint(1) DEFAULT '0',
	`extra_cost_min_value` double DEFAULT NULL,
	`extra_cost_percentage` double DEFAULT NULL,
	`email_bcc` varchar(100) DEFAULT NULL,
  `email_owner` tinyint(1) NOT NULL DEFAULT '0',
	`ask_to_notify_customer` TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  KEY `book_id` (`book_id`)
) ENGINE=InnoDB;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `bs_order_status_history`
--

DROP TABLE IF EXISTS `bs_order_status_history`;
CREATE TABLE IF NOT EXISTS `bs_order_status_history` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) NOT NULL DEFAULT '0',
  `status_id` int(11) NOT NULL DEFAULT '0',
  `user_id` int(11) NOT NULL DEFAULT '0',
  `ctime` int(11) NOT NULL DEFAULT '0',
  `notified` tinyint(1) NOT NULL DEFAULT '0',
  `notification_email` varchar(255) DEFAULT NULL,
  `comments` text,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`,`status_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `bs_products`
--

DROP TABLE IF EXISTS `bs_products`;
CREATE TABLE IF NOT EXISTS `bs_products` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sort_order` int(11) NOT NULL DEFAULT '0',
  `category_id` int(11) NOT NULL DEFAULT '0',
  `image` varchar(255) NOT NULL DEFAULT '',
  `cost_price` double NOT NULL DEFAULT '0',
  `list_price` double NOT NULL DEFAULT '0',
  `vat` double NOT NULL DEFAULT '0',
  `total_price` double NOT NULL DEFAULT '0',
  `supplier_company_id` int(11) NOT NULL DEFAULT '0',
  `supplier_product_id` varchar(50) DEFAULT NULL,  
  `stock` int(11) NOT NULL DEFAULT '0',
  `required_products` varchar(255) NOT NULL DEFAULT '',
  `stock_min` int(11) NOT NULL DEFAULT '0',
  `article_id` varchar(190) NOT NULL DEFAULT '',
  `unit` varchar(255) NOT NULL DEFAULT '',
  `unit_stock` varchar(255) NOT NULL DEFAULT '',
  `files_folder_id` int(11) NOT NULL DEFAULT '0',
	`cost_code` varchar(50) DEFAULT NULL,
	`tracking_code` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `category_id` (`category_id`),
  KEY `article_id` (`article_id`)
) ENGINE=InnoDB;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `bs_product_categories`
--

DROP TABLE IF EXISTS `bs_product_categories`;
CREATE TABLE IF NOT EXISTS `bs_product_categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sort_order` int(11) NOT NULL DEFAULT '0',
  `parent_id` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `parent_id` (`parent_id`)
) ENGINE=InnoDB;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `bs_product_languages`
--

DROP TABLE IF EXISTS `bs_product_languages`;
CREATE TABLE IF NOT EXISTS `bs_product_languages` (
  `language_id` int(11) NOT NULL DEFAULT '0',
  `product_id` int(11) NOT NULL DEFAULT '0',
  `name` varchar(100) NOT NULL DEFAULT '',
  `description` text,
  `short_description` varchar(255) NOT NULL DEFAULT '',
  PRIMARY KEY (`language_id`,`product_id`)
) ENGINE=InnoDB;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `bs_status_languages`
--

DROP TABLE IF EXISTS `bs_status_languages`;
CREATE TABLE IF NOT EXISTS `bs_status_languages` (
  `language_id` int(11) NOT NULL DEFAULT '0',
  `status_id` int(11) NOT NULL DEFAULT '0',
  `name` varchar(50) DEFAULT NULL,
	`extra_cost_item_text` varchar(200) DEFAULT NULL,
  `email_subject` varchar(100) DEFAULT NULL,
  `email_template` longtext DEFAULT NULL,
  `screen_template` text DEFAULT NULL,
  `pdf_template_id` int(11) NOT NULL DEFAULT '0',
  `doc_template_id` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`language_id`,`status_id`)
) ENGINE=InnoDB;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `bs_templates`
--

DROP TABLE IF EXISTS `bs_templates`;
CREATE TABLE IF NOT EXISTS `bs_templates` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `title` varchar(50) DEFAULT NULL,
  `right_col` text,
  `left_col` text,
  `margin_top` int(11) NOT NULL DEFAULT '30',
  `margin_bottom` int(11) NOT NULL DEFAULT '30',
  `margin_left` int(11) NOT NULL DEFAULT '30',
  `margin_right` int(11) NOT NULL DEFAULT '30',
  `page_format` varchar(20) DEFAULT NULL,
  `stationery_paper` varchar(255) DEFAULT NULL,
  `footer` text,
  `closing` text,
  `number_name` varchar(30) DEFAULT NULL,
  `reference_name` varchar(30) DEFAULT NULL,
  `date_name` varchar(30) DEFAULT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `logo_width` int(11) NOT NULL DEFAULT '0',
  `logo_height` int(11) NOT NULL DEFAULT '0',
  `show_supplier_product_id` tinyint(1) NOT NULL DEFAULT '0',
  `show_nett_total_price` tinyint(1) NOT NULL DEFAULT '1',
  `show_nett_unit_price` tinyint(1) NOT NULL DEFAULT '1',
  `show_summary_totals` tinyint(1) NOT NULL DEFAULT '1',
  `show_vat` tinyint(1) NOT NULL DEFAULT '1',
	`show_units` tinyint(1) NOT NULL DEFAULT '0',
  `book_id` int(11) NOT NULL,
  `logo_top` int(11) NOT NULL DEFAULT '0',
  `logo_left` int(11) NOT NULL DEFAULT '0',
  `left_col_top` int(11) NOT NULL DEFAULT '30',
  `left_col_left` int(11) NOT NULL DEFAULT '30',
  `right_col_top` int(11) NOT NULL DEFAULT '30',
  `right_col_left` int(11) NOT NULL DEFAULT '365',
  `show_amounts` tinyint(1) NOT NULL DEFAULT '1',
  `logo_only_first_page` tinyint(1) NOT NULL DEFAULT '0',
  `use_html_table` tinyint(1) NOT NULL DEFAULT '0',
  `html_table` text,
  `repeat_header` tinyint(1) NOT NULL DEFAULT '0',
  `show_gross_unit_price` tinyint(1) NOT NULL DEFAULT '1',
	`show_unit_cost` tinyint(1) NOT NULL DEFAULT '0',
  `show_gross_total_price` tinyint(1) NOT NULL DEFAULT '1',
	`show_date_sent` BOOLEAN NOT NULL DEFAULT '0',
	`show_page_numbers` TINYINT( 1 ) NOT NULL DEFAULT '0',
	`show_total_paid` TINYINT( 1 ) NOT NULL DEFAULT '0',
	`show_reference` TINYINT( 1 ) NOT NULL DEFAULT '1',
	`show_product_number` TINYINT( 1 ) NOT NULL DEFAULT '0',
	`show_item_id` TINYINT( 1 ) NOT NULL DEFAULT '0',
	`show_cost_code` TINYINT( 1 ) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `book_id` (`book_id`)
) ENGINE=InnoDB ;



--
-- Tabelstructuur voor tabel `cf_bs_orders`
--

DROP TABLE IF EXISTS `cf_bs_orders`;
CREATE TABLE IF NOT EXISTS `cf_bs_orders` (
  `model_id` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`model_id`)
) ENGINE=InnoDB;

-- --------------------------------------------------------



--
-- Tabelstructuur voor tabel `go_links_bs_orders`
--

DROP TABLE IF EXISTS `go_links_bs_orders`;
CREATE TABLE IF NOT EXISTS `go_links_bs_orders` (
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
-- Table structure for table `bs_product_item_option`
--

CREATE TABLE IF NOT EXISTS `bs_item_product_option` (
  `item_id` int(11) NOT NULL,
  `product_option_value_id` int(11) NOT NULL,
  PRIMARY KEY (`item_id`,`product_option_value_id`)
) ENGINE=InnoDB;

-- --------------------------------------------------------

--
-- Table structure for table `bs_product_option`
--

CREATE TABLE IF NOT EXISTS `bs_product_option` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `product_id` int(11) NOT NULL,
  `type` varchar(15) NOT NULL DEFAULT 'text',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

-- --------------------------------------------------------

--
-- Table structure for table `bs_product_option_language`
--

CREATE TABLE IF NOT EXISTS `bs_product_option_language` (
  `product_option_id` int(11) NOT NULL,
  `language_id` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`product_option_id`,`language_id`)
) ENGINE=InnoDB;

-- --------------------------------------------------------

--
-- Table structure for table `bs_product_option_value`
--

CREATE TABLE IF NOT EXISTS `bs_product_option_value` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `product_option_id` int(11) NOT NULL,
  `value` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

-- --------------------------------------------------------

--
-- Table structure for table `bs_product_option_value_language`
--

CREATE TABLE IF NOT EXISTS `bs_product_option_value_language` (
  `product_option_value_id` int(11) NOT NULL,
  `language_id` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`product_option_value_id`,`language_id`)
) ENGINE=InnoDB;

-- --------------------------------------------------------

--
-- Table structure for table `bs_tracking_codes`
--

CREATE TABLE IF NOT EXISTS `bs_tracking_codes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `costcode_id` int(11) NOT NULL,
  `code` varchar(255) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `description` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

-- --------------------------------------------------------

--
-- Table structure for table `bs_tax_rates`
--

CREATE TABLE IF NOT EXISTS `bs_tax_rates` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
	`book_id` int(11) NOT NULL DEFAULT '0',
  `name` varchar(100) NOT NULL,
  `percentage` double NOT NULL,
  `description` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;


--
-- Table structure for table `bs_order_payments`
--

CREATE TABLE IF NOT EXISTS `bs_order_payments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) NOT NULL,
  `date` int(11) NOT NULL,
  `amount` double NOT NULL,
  `description` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;


-- DROP TABLE IF EXISTS `cf_bs_items`;
-- CREATE TABLE IF NOT EXISTS `cf_bs_items` (
--   `model_id` int(11) NOT NULL DEFAULT '0',
--   PRIMARY KEY (`model_id`)
-- ) ENGINE=InnoDB;
