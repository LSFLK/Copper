<?php
namespace go\core\db;

use go\core\App;
use PDO;

class Database {
		
	private $tableNames;	
	
	/**
	 * Check if the current database has a table
	 * 
	 * @param string $name
	 * @return bool
	 */
	public function hasTable($name) {
		return in_array($name, $this->getTableNames());
	}
	
	
	private function getTableNames() {
		if(!isset($this->tableNames)) {
			$stmt = App::get()->getDbConnection()->query('SHOW TABLES');
			$stmt->setFetchMode(PDO::FETCH_COLUMN, 0);
			$this->tableNames = $stmt->fetchAll();
		}
		
		return $this->tableNames;
	}
	
	/**
	 * Get all tables
	 * 
	 * @return Table[]
	 */
	public function getTables() {
		$t = [];
		
		foreach($this->getTableNames() as $tableName) {
			$t[] = Table::getInstance($tableName);
		}
		
		return $t;
	}
	
	/**
	 * Get database name
	 * 
	 * @return string eg. "user@localhost"
	 */
	public function getUser() {
		$sql = "SELECT USER();";
		$stmt = App::get()->getDbConnection()->query($sql);
		$stmt->setFetchMode(PDO::FETCH_COLUMN, 0);
		return  $stmt->fetch();		
	}
	
	/**
	 * Get database name
	 * 
	 * @return string
	 */
	public function getName() {
		$sql = "SELECT DATABASE();";
		$stmt = App::get()->getDbConnection()->query($sql);
		$stmt->setFetchMode(PDO::FETCH_COLUMN, 0);
		return  $stmt->fetch();		
	}
	
	/**
	 * Set UTF8 collation
	 * 
	 * @return \PDOStatement
	 */
	public function setUtf8() {
		//Set utf8 as collation default
		$sql = "ALTER DATABASE `" .$this->getName() . "` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;";		
		return App::get()->getDbConnection()->query($sql);
	}
}

