<?php

namespace GO\Savemailas;

use GO;
use GO\Base\Db\ActiveRecord;
use GO\Base\Model\Acl as Acl2;
use go\core\acl\model\Acl;
use go\core\orm\EntityType;
use GO\Professional\Module;


class SavemailasModule extends Module{
	
	public function depends()
	{
		return array('email');
	}
	
	public function autoInstall() {
		return true;
	}
	
	
	
	/**
	 * 
	 * @param string $entity
	 * @return EntityType
	 */
	public static function getLinkModel($modelName, $modelId) {
		
		//make it backwards compatible with old classnames. Strip off the namespace.
		
		$parts = explode("\\", $modelName);
		$entity = array_pop($parts);
		
		$entityType = EntityType::findByName($entity);
		
		if(!$entityType) {
			return false;
		}
		
		$cls = $entityType->getClassName();
		if(is_a($cls, ActiveRecord::class, true)) {
		
			$model = GO::getModel($cls)->findByPk($modelId, false, true);
			if(!$model || !$model->checkPermissionLevel(Acl2::WRITE_PERMISSION)) {
				return false;
			}	
		} else
		{
			//must be a go\core\orm\Entity (new)			
			$model = $cls::findById($modelId);
			if(!$model || !$model->hasPermissionLevel(Acl::LEVEL_WRITE)) {
				return false;
			}
			
		}
		
		return $model;
	}
}
