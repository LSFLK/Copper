<?php

namespace go\core\http;

use DateTime;
use go\core\http;
use go\core\Singleton;
use go\core\util\StringUtil;

/**
 * Response Object
 * 
 * An object with a data array that the API can encode.
 * Currently JSON (default) and XML encoding is supported.
 * 
 * The minimal response will be:
 *
 * (JSON)
 * ```````````````````````````````````````````````````````````````````````````
 * ['success' => true]
 * ```````````````````````````````````````````````````````````````````````````
 * 
 * or
 * 
 * (XML)
 * ```````````````````````````````````````````````````````````````````````````
 * 
 * <message>
 * 	<success type="boolean">true</success>
 * </message>
 * 
 * ```````````````````````````````````````````````````````````````````````````
 * 
 * @copyright (c) 2014, Intermesh BV http://www.intermesh.nl
 * @author Merijn Schering <mschering@intermesh.nl>
 * @license http://www.gnu.org/licenses/agpl-3.0.html AGPLv3
 */
class Response extends Singleton{
	
	public function __construct() {
//		$this->setHeader('Cache-Control', 'private');
//		$this->removeHeader('Pragma');
//		
//		$this->setHeader('Access-Control-Allow-Origin', '*');
//		$this->setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
//		$this->setHeader('Access-Control-Allow-Headers', 'Origin, Content-Type, Authorization, X-XSRFToken');
//		$this->setHeader('Access-Control-Max-Age', "1728000");
	}

	/**
	 * HTTP version
	 * 
	 * @var string 
	 */
	public $httpVersion = '1.1';
	
	/**
	 * Key value array with headers
	 * @var array 
	 */
	protected $headers = [];
	
	/**
	 * The modified at header
	 * 
	 * @var \DateTime 
	 */
	private $modifiedAt;
	
	/**
	 * Enable HTTP caching
	 * 
	 * @var boolean 
	 */
	public $enableCache = true;

	public function setContentType($contentType) {
		$this->setHeader('Content-Type', $contentType);
	}

	/**
	 * Updates a HTTP header.
	 *
	 * The case-sensitity of the name value must be retained as-is.
	 *
	 * If the header already existed, it will be overwritten.
	 *
	 * @param string $name
	 * @param string|StringUtil[] $value
	 * @return void
	 */
	public function setHeader($name, $value) {
		$name = strtolower($name);

		if (!is_array($value)) {
			$value = [$value];
		}

		$this->headers[$name] = $value;	
	}

	/**
	 * Remove an HTTP header
	 * 
	 * @param string $name
	 */
	public function removeHeader($name) {
		if (!headers_sent()) {
			header_remove($name);
		}

		unset($this->headers[$name]);
	}

	/**
	 * Get the header value
	 * 
	 * @param string $name
	 * @param string[]
	 */
	public function getHeader($name) {
		$name = strtolower($name);

		if (!isset($this->headers[$name])) {
			return null;
		} else {
			return $this->headers[$name];
		}
	}

	/**
	 * Set HTTP status header
	 * 
	 * @param int $httpCode
	 */
	public function setStatus($httpCode, $text = null) {

		if (!isset($text)) {
			$text = http\Exception::$codes[$httpCode];
		}
		
		header("HTTP/" . $this->httpVersion . " " . $httpCode . " " . $text);
	}

	/**
	 * Redirect to another URL
	 * 
	 * @param string $url
	 */
	public function redirect($url) {
		$this->setHeader('location', $url);
		exit();
	}

	/**
	 * Set Modified At header and enable HTTP caching
	 * @param DateTime $modifiedAt
	 */
	public function setModifiedAt(DateTime $modifiedAt) {
		$this->modifiedAt = $modifiedAt;
		$this->setHeader('Modified-At', $this->modifiedAt->format('D, d M Y H:i:s') . ' GMT');
	}

	private $etag;

	/**
	 * Set ETag header and enable HTTP caching
	 * 
	 * @param string $etag
	 */
	public function setETag($etag) {
		$this->etag = $etag;
		$this->setHeader('ETag', $this->etag);
	}

	public function setExpires(DateTime $expires = null) {
		$this->setHeader("Expires", $expires->format('D, d M Y H:i:s'));
	}

	/**
	 * Check if the client cache is up to date
	 * 
	 * If the If-Modified-Since or If-None-Match headers are sent and they match
	 * a http 304 not modified status will be sent and it will exit.
	 * 
	 * NOTE: this function is disabled when IFW\Debugger is enabled.
	 * 
	 * @return boolean
	 */
	public function isCached() {

		if(!$this->enableCache) {
			return false;
		}
		
		//get the HTTP_IF_MODIFIED_SINCE header if set
		$ifModifiedSince = isset($_SERVER['HTTP_IF_MODIFIED_SINCE']) ? $_SERVER['HTTP_IF_MODIFIED_SINCE'] : false;
		//get the HTTP_IF_NONE_MATCH header if set (etag: unique file hash)
		$etagHeader = isset($_SERVER['HTTP_IF_NONE_MATCH']) ? trim($_SERVER['HTTP_IF_NONE_MATCH']) : false;

		return (isset($this->modifiedAt) && $ifModifiedSince >= $this->modifiedAt->format('U')) || isset($this->etag) && $etagHeader == $this->etag;
	}

	/**
	 * Stop running if client has up to date cache.
	 */
	public function abortIfCached() {
		if ($this->isCached()) {
			$this->setStatus(304);
			exit();
		}
	}
	
	
	public function sendHeaders() {
		foreach ($this->headers as $name => $headerSet) {
			foreach ($headerSet as $v) {
				header($name . ': ' . $v);
			}
		}		
	}

	/**
	 * Output headers and body
	 * 
	 * @param string $data
	 */
	public function output($data = null) {
		
		if (isset($data)) {
			if(is_array($data)) {
				$data = json_encode($data);
				if(empty($data)){
					throw new Exception("JSON encoding error: '".json_last_error_msg()."'.\n\nArray data from server:\n\n" . var_export($data, true));
				}
				$this->setContentType('application/json; charset=UTF-8');
			} 
			$this->sendHeaders();
			echo $data;
		}
	}
	

}
