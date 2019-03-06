
--
-- Tabelstructuur voor tabel `fs_docbundles`
--

DROP TABLE IF EXISTS `fs_docbundles`;
CREATE TABLE IF NOT EXISTS `fs_docbundles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `description` text NOT NULL,
  `keywords` varchar(255) NOT NULL,
  `ctime` int(11) NOT NULL,
  `mtime` int(11) NOT NULL,
  `acl_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `fs_docbundles_files`
--

DROP TABLE IF EXISTS `fs_docbundles_files`;
CREATE TABLE IF NOT EXISTS `fs_docbundles_files` (
  `docbundle_id` int(11) NOT NULL,
  `file_id` int(11) NOT NULL,
  PRIMARY KEY (`docbundle_id`,`file_id`)
) ENGINE=InnoDB;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `fs_duplicates`
--

DROP TABLE IF EXISTS `fs_duplicates`;
CREATE TABLE IF NOT EXISTS `fs_duplicates` (
  `user_id` int(11) NOT NULL,
  `file_id` int(11) NOT NULL,
  PRIMARY KEY (`user_id`,`file_id`)
) ENGINE=InnoDB;

-- --------------------------------------------------------

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `fs_filesearch`
--

DROP TABLE IF EXISTS `fs_filesearch`;
CREATE TABLE IF NOT EXISTS `fs_filesearch` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `text` longtext NOT NULL,
  `preview_text` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `mtime` int(11) NOT NULL,
  `ctime` int(11) NOT NULL,
  `author` varchar(50) NOT NULL DEFAULT '',
  `last_modified_by` varchar(50) NOT NULL DEFAULT '',
  `extension` varchar(20) NOT NULL DEFAULT '',
  `subject` varchar(100) NOT NULL DEFAULT '',
  `to` text NOT NULL,
  PRIMARY KEY (`id`),
  KEY `mtime` (`mtime`),
  KEY `ctime` (`ctime`,`author`,`extension`),
  KEY `user_id` (`user_id`),
  KEY `extension` (`extension`),
  FULLTEXT KEY `text` (`text`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------


-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `fs_search_queries`
--

DROP TABLE IF EXISTS `fs_search_queries`;
CREATE TABLE IF NOT EXISTS `fs_search_queries` (
  `id` int(11) NOT NULL DEFAULT '0',
  `user_id` int(11) NOT NULL,
  `name` varchar(32) DEFAULT NULL,
  `sql` text,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB;

-- --------------------------------------------------------