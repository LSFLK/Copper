<?php

namespace go\core\auth;

use go\core\orm\Entity;
use go\core\orm\Mapping;

class Method extends Entity {
	
	/**
	 * The id of this authenticator
	 * 
	 * @var string 
	 */
	public $id;
		
	/**
	 * The sort order of the authenticators. 
	 * 
	 * Higher value means higher priority!
	 * 
	 * @var string 
	 */
	public $sortOrder;
	
	/**
	 * The module ID this method belongs to
	 * 
	 * @var int
	 */
	public $moduleId;
	
	private $authenticator;
	
	protected static function defineMapping() {
		return parent::defineMapping()
		->addTable('core_auth_method', 'am')
		->setQuery(
						(new \go\core\db\Query)
						->join('core_module', 'mod', 'am.moduleId = mod.id AND mod.enabled = true')
						); //always join enabled modules so disabled modules are not used.
	}
	
	/**
	 * Get all authenticators
	 * 
	 * @return array ['password' => "go\core\auth\Password"]
	 */
	public static function findAllAuthenticators() {
		$classFinder = new \go\core\util\ClassFinder();
		$authenticators = $classFinder->findByParent(BaseAuthenticator::class);
		
		$arr = [];
		
		foreach($authenticators as $a) {
			$arr[$a::id()] = $a;
		}
		
		return $arr;
		
	}
	
	/**
	 * Get an instance of the authenticator
	 * 
	 * @return Authenticator
	 */
	public function getAuthenticator(){
		
		if(!$this->authenticator) {			
			$all = $this->findAllAuthenticators();
			$this->authenticator = new $all[$this->id];
		}
		
		return $this->authenticator;
	}	
}
