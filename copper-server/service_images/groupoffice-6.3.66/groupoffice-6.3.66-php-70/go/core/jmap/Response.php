<?php
namespace go\core\jmap;

/**
 * JMAP Response object
 * 
 * Uses application/json and formats every method output according to the JSON spec.
 */
class Response extends \go\core\http\Response {
	
	private $clientCallId;
	
	private $methodName;
	
	private $data = [];
	
	public function __construct() {
		parent::__construct();
		$this->setHeader('Content-Type', 'application/json;charset=utf-8');
	}
	
	/**
	 * Output a response
	 * 
	 * @param array $responseData eg. ['resultName, ['data']];
	 * @return type
	 * @throws Exception
	 */
	public function addResponse($responseData = null) {		
		$this->data[] = [$this->methodName,  $responseData, $this->clientCallId];
	}
	
	/**
	 * 
	 * Array of responses.
	 * 
	 * [
	 *	['resultName, ['data'], 'clientCallId'],
	 *  ['resultName, ['data'], 'clientCallId'],
	 * ]
	 * 
	 * @return array
	 */
	public function getData() {
		return $this->data;
	}
	
	/**
	 * The client call ID is passed by the router. It needs to be appended to 
	 * every response.
	 * 
	 * @param string $clientCallId
	 */
	public function setClientCall($methodName, $clientCallId) {
		$this->clientCallId = $clientCallId;
		$this->methodName = $methodName;
	}
	
	public function output($data = null) {
		
		if(isset($data)) {
			$this->addResponse($data);
		}
	
		return parent::output($this->data);
	}
}
