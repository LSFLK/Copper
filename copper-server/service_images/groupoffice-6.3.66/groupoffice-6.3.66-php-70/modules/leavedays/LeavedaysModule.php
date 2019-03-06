<?php

namespace GO\Leavedays;

use Exception;
use GO;
use GO\Base\Model\Acl;
use GO\Base\Model\User;
use GO\Leavedays\Model\Leaveday;
use GO\Leavedays\Model\YearCredit;
use GO\Professional\Module;
use GO\Users\Controller\UserController;


class LeavedaysModule extends Module{
	
	public function autoInstall() {
		return true;
	}
	
	public static function initListeners() {
		$userController = new UserController();
		$userController->addListener('load', "GO\Leavedays\LeavedaysModule", "userLoaded");
		$userController->addListener('submit', "GO\Leavedays\LeavedaysModule", "userSubmitted");
		User::model()->addListener('delete', 'GO\Leavedays\LeavedaysModule', 'userDeleted');
	}
	
	public static function userLoaded( UserController $userController, &$response, &$userModel, &$loadParams ) {
			
		$wwModel = \GO\Base\Model\WorkingWeek::model()->findSingleByAttribute('user_id',$userModel->id);
		if (empty($wwModel))
			$wwModel = new \GO\Base\Model\WorkingWeek();

		
		$attr=$wwModel->getAttributes();
		unset($attr['user_id']);
		
		$response['data']=array_merge($attr, $response['data']);

	}
	
	public static function userSubmitted( UserController $userController, &$response, &$userModel, &$submitParams, $modifiedAttributes ) {
		
			$wwModel = \GO\Base\Model\WorkingWeek::model()->findSingleByAttribute('user_id',$userModel->id);
			if (empty($wwModel))
				$wwModel = new \GO\Base\Model\WorkingWeek();

			$wwModel->user_id = $userModel->id;
			
			$params = array(
				'mo_work_hours'	=> $submitParams['mo_work_hours'],
				'tu_work_hours'	=> $submitParams['tu_work_hours'],
				'we_work_hours'	=> $submitParams['we_work_hours'],
				'th_work_hours'	=> $submitParams['th_work_hours'],
				'fr_work_hours'	=> $submitParams['fr_work_hours'],
				'sa_work_hours'	=> $submitParams['sa_work_hours'],
				'su_work_hours'	=> $submitParams['su_work_hours']
			);
			
			$wwModel->setAttributes($params);


			if (!$wwModel->save()) {
				$validationErrors = $wwModel->getValidationErrors();			
				throw new Exception(GO::t("Could not save working week info.", "leavedays").' '.implode(', ',$validationErrors));
			}
					
	}
	
	public static function userDeleted(User $userModel) {
		
		if (self::userHasPermission($userModel->id)) {

			$ldsStmt = Leaveday::model()->findByAttribute('user_id',$userModel->id);
			if (!empty($ldsStmt))
				foreach ($ldsStmt as $ldModel)
					$ldModel->delete();

			$ycsStmt = YearCredit::model()->findByAttribute('user_id',$userModel->id);
			if (!empty($ycsStmt))
				foreach ($ycsStmt as $ycModel)
					$ycModel->delete();

		}
		
	}
	
	public static function userHasPermission($userId) {
		
		$level = Acl::getUserPermissionLevel(GO::modules()->leavedays->acl_id, $userId);
						
		
		return $level >= Acl::READ_PERMISSION;
		
	}
	
	public function install() {
		
		parent::install();
		
		
		$name = \GO::t("Holidays", "leavedays");
		
		// add default credit types add id 1
		$sql = "INSERT INTO `ld_credit_types` (`id`, `name`, `description`, `credit_doesnt_expired`, `sort_index`) VALUES (1, '". $name ."', '". $name ."', '1', '1');";
//		echo $sql."\n";

		\GO::getDbConnection()->query($sql);
		
	}
	
}
