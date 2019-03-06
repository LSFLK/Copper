<?php

namespace go\core\db;

use Exception;
use go\core\App;
use go\core\fs\File;
use PDO;
use PDOException;

class Utils {

	public static function runSQLFile(File $file) {
		$queries = self::getSqlQueries($file);

		try {
			for ($i = 0, $c = count($queries); $i < $c; $i++) {
				App::get()->getDbConnection()->query($queries[$i]);
			}
		} catch (PDOException $e) {
			throw new Exception($e->getMessage() . ' on query (' . $i . ') ' . $queries[$i]);
		}
	}

	/**
	 * Get's all queries from an SQL dump file in an array
	 *
	 * @param File $file The absolute path to the SQL file
	 * @access public
	 * @return array An array of SQL strings
	 */
	public static function getSqlQueries(File $file) {
		$sql = '';
		$queries = array();

		$handle = $file->open('r');
		if ($handle) {
			while (!feof($handle)) {
				$buffer = trim(fgets($handle, 4096));
				if ($buffer != '' && substr($buffer, 0, 1) != '#' && substr($buffer, 0, 1) != '-') {
					$sql .= $buffer . "\n";
				}
			}
			fclose($handle);
		} else {
			throw new Exception("Could not read SQL dump file $file!");
		}
		$length = strlen($sql);
		$in_string = false;
		$start = 0;
		$escaped = false;
		for ($i = 0; $i < $length; $i++) {
			$char = $sql[$i];
			if ($char == '\'' && !$escaped) {
				$in_string = !$in_string;
			}
			if ($char == ';' && !$in_string) {
				$offset = $i - $start;
				$queries[] = trim(substr($sql, $start, $offset));

				$start = $i + 1;
			}
			if ($char == '\\') {
				$escaped = true;
			} else {
				$escaped = false;
			}
		}
		return $queries;
	}

	/**
	 * Check if a database exists
	 * 
	 * @param string $tableName
	 * @return boolean 
	 */
	public static function databaseExists($databaseName) {
		$stmt = App::get()->getDbConnection()->query('SHOW DATABASES');
		while ($r = $stmt->fetch()) {
			if ($r[0] == $databaseName) {
				return true;
			}
		}

		return false;
	}

	/**
	 * Check if a table exists in the Group-Office database.
	 * 
	 * @param string $tableName
	 * @return boolean 
	 */
	public static function tableExists($tableName) {

		$stmt = App::get()->getDbConnection()->query('SHOW TABLES');
		$stmt->setFetchMode(PDO::FETCH_COLUMN, 0);
		$tableNames = $stmt->fetchAll();

		return in_array($tableName, $tableNames);
	}

	/**
	 * Check if a column exists 
	 * 
	 * @param string $tableName
	 * @param string $columnName
	 * @return boolean
	 */
	public static function columnExists($tableName, $columnName) {
		$sql = "SHOW FIELDS FROM `" . $tableName . "`";
		$stmt = App::get()->getDbConnection()->query($sql);
		while ($record = $stmt->fetch(PDO::FETCH_ASSOC)) {
			if ($record['Field'] == $columnName) {
				return true;
			}
		}
		return false;
	}

	

	/**
	 * Detect PDO param type for binding by checking the PHP variable type
	 * 
	 * @param mixed $variable
	 * @return int
	 */
	public static function getPdoParamType($variable) {
		if (is_bool($variable)) {
			return PDO::PARAM_BOOL;
		} elseif (is_int($variable)) {
			return PDO::PARAM_INT;
		} elseif (is_null($variable)) {
			return PDO::PARAM_NULL;
		} else {
			return PDO::PARAM_STR;
		}
	}
	
  /**
   * Parse DSN connection string
   * 
   * @param string $dsn eg mysql:host=db;port=8306;dbname=groupoffice
   * @return ['scheme' => 'mysql', 'options' => ['host' => 'db']]
   */
  public static function parseDSN($dsn) {
    $dsn = substr($dsn, 6); //strip mysql:
    $parts = str_getcsv($dsn, ';');
    $options = [];
    foreach($parts as $part) {
      $is = strpos($part, '=');
      $options[substr($part,0, $is)] = substr($part, $is + 1);
    }
    
    return [
        'scheme' => 'mysql',
        'options' => $options
    ];
  }

}
