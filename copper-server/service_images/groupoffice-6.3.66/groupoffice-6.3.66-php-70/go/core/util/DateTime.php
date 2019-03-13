<?php
namespace go\core\util;

use DateTime as PHPDateTime;
use go\core\data\ArrayableInterface;

class DateTime extends PHPDateTime implements ArrayableInterface, \JsonSerializable {
	
	/**
	 * The date outputted to the clients. It's according to ISO 8601;	 
	 */
	const FORMAT_API = "c";

	public function toArray($properties = null) {
		return $this->format(self::FORMAT_API);
	}

	public function jsonSerialize() {
		return $this->format(self::FORMAT_API);
	}

}
