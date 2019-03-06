<?php

namespace go\core\auth;

use Exception;
use go\core\db\Query;
use go\modules\core\modules\model\Module;
use go\core\validate\ValidationTrait;

abstract class BaseAuthenticator {
	
	use ValidationTrait;
	
	/**
	 * The ID of the authenticator
	 * 
	 * Used in the database
	 * 
	 * @return string
	 */
	public static function id() {
		return strtolower(substr(static::class, strrpos(static::class, "\\") + 1));
	}
	
	protected function internalValidate() {
		
	}

	/**
	 * Register the authenticator in the database
	 * 
	 * @throws Exception
	 */
	public static function register() {
		$method = new Method();
		$module = Module::findByClass(static::class);		
		$method->moduleId = $module->id;
		$method->id = static::id();
		$method->sortOrder = (new Query)->selectSingleValue("max(sortOrder)")->from('core_auth_method')->single() + 1;
		if(!$method->save()) {
			throw new Exception("Could not register authenticator!". var_export($method->getValidationErrors(), true));
		}
		
		return true;
	}
	/**
	 * Check if this authenticator is available for the user.
	 * 
	 * @param string $username
	 * @param string $domain
	 */
	abstract public static function isAvailableFor($username);	
		
}
