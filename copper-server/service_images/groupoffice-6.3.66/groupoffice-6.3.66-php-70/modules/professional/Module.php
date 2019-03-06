<?php


namespace GO\Professional;
use GO;

abstract class Module extends \GO\Base\Module {
	
	public function appCenter(){
		return GO::config()->product_name=='Group-Office';
	}
	
	public function package(){
		return 'Professional';
	}
	
	public function checkPermissionsWithLicense(){
		
		$users = License::moduleIsRestricted($this->id());
		
//		GO::debug($users);
		
		if($users===false){
			return true;
		}
		
		$acl_id= GO::modules()->{$this->id()}->acl_id;

		$users = \GO\Base\Model\Acl::getAuthorizedUsers($acl_id);		
		foreach($users as $user){
			if(!in_array($user->username, $users))
			{
				return false;
			}
		}
		
		
		return true;	
	}
	
	public function isInstallable(){
		return GO::scriptCanBeDecoded($this->package());
	}
	
	public function isAvailable() {
		
		if(!\GO::scriptCanBeDecoded($this->package())){
			return false;
		}else
		{
			return true;
		}

		
//		if we can run this file without ioncube it must be open source.
//		if(!function_exists('ioncube_file_is_encoded') || !ioncube_file_is_encoded()){
//			return true;
//		}
		
		/*if(!GO::user()){
			return true;
		}
		

		$className = get_class($this);

		$classParts = explode('\\', $className);

		if(!License::userHasModule(GO::user()->username, strtolower($classParts[1]))){
			return false;
		}
		
		
		return true;*/
		
	}
}
