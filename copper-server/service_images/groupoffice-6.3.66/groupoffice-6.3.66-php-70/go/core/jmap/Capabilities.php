<?php
namespace go\core\jmap;

use go\core\Environment;
use go\core\Singleton;

class Capabilities extends Singleton {
	
	/**
	 * The maximum file size, in bytes, that the server will accept for a 
	 * single file upload (for any purpose).
	 */
	public $maxSizeUpload = 40*1000*1024; // 40MB
	
	public $maxConcurrentUpload = 4;
	
	public $maxSizeRequest = 100*1000*1024; // 100MB
	
	public $maxConcurrentRequests = 4;
	
	public $maxCallInRequest = 10;
	
	public $maxObjectsInGet = 1000;
	
	public $maxObjectsInSet = 1000;
	
	public function __construct() {
		$this->maxSizeUpload = min($this->maxSizeUpload, Environment::get()->getMaxUploadSize());
	}
}
