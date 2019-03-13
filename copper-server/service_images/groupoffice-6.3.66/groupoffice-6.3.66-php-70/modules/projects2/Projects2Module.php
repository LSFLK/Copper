<?php


namespace GO\Projects2;

use Exception;
use GO;
use GO\Base\Db\FindCriteria;
use GO\Base\Db\FindParams;
use GO\Base\Db\Utils;
use GO\Base\Fs\Folder;
use GO\Base\Fs\File;
use GO\Projects2\Model\Project;
use GO\Projects2\Model\Status;
use GO\Projects2\Model\Template;
use GO\Projects2\Model\Type;
use PDO;





class Projects2Module extends \GO\Professional\Module {
	
	const FINANCE_PERMISSIONS = 45;

	public function appCenter(){
		return true;
	}
	
	/**
	 * Add the project manager notify email job to the cron controller
	 */
	public static function initListeners() {
		
		if(GO::modules()->isInstalled('files') && class_exists('\GO\Files\Controller\FolderController')){
			$folderController = new \GO\Files\Controller\FolderController();
			$folderController->addListener('checkmodelfolder', "GO\Projects2\Projects2Module", "createParentFolders");
		}
		
		\GO\Base\Model\User::model()->addListener('delete', "GO\Projects2\Projects2Module", "deleteUser");

	}
	
	/**
	 * When a folder is created for a project we must attach the parent folders 
	 * to the projects as well.
	 * 
	 * @param \GO\Projects2\Model\Folder  $model
	 * @param \GO\Files\Model\Folder $folder
	 */
	public static function createParentFolders($model, $folder, $newFolder){
		
		if($newFolder && is_a($model, "GO\Projects2\Model\Project")){
			if($project = $model->parent()){
				GO::debug("Checking folder: ".$project->path);
				
				$folderController = new \GO\Files\Controller\FolderController();				
				$folderController->checkModelFolder($project, true, true);
			}
		}
		
	}
	

	public function autoInstall() {
		return true;
	}

	public function install() {
		
		// Install the notification cron for income contracts
		\GO\Projects2\Projects2Module::createDefaultIncomeContractNotificationCron();
		
//		if(!GO::modules()->isInstalled('projects')){
		GO::getDbConnection()->query("SET sql_mode=''");
		
		if(!Utils::tableExists("pm_projects")){
			parent::install();
			
			$defaultType = new Type();
			$defaultType->name = GO::t("Default");
			$defaultType->save();

			$defaultStatus = new Status();
			$defaultStatus->name = GO::t("Ongoing", "projects2");
			$defaultStatus->show_in_tree=true;
			$defaultStatus->save();
			
			$noneStatus = new Status();
			$noneStatus->name = GO::t("None", "projects2");
			$noneStatus->show_in_tree=true;
			$noneStatus->filterable=true;
			$noneStatus->save();

			$status = new Status();
			$status->name = GO::t("Complete", "projects2");
			$status->complete=true;
			$status->show_in_tree=false;
			$status->save();
			
			
			$folder = new \GO\Base\Fs\Folder(GO::config()->file_storage_path.'projects2/template-icons');
			$folder->create();			
			
			if(!$folder->child('folder.png')){
				$file = new \GO\Base\Fs\File(GO::modules()->projects2->path . 'install/images/folder.png');
				$file->copy($folder);
			}
			
			
			if(!$folder->child('project.png')){
				$file = new \GO\Base\Fs\File(GO::modules()->projects2->path . 'install/images/project.png');
				$file->copy($folder);			
			}

			$template = new Template();
			$template->name = GO::t("Projects folder", "projects2");
			$template->default_status_id = $noneStatus->id;
			$template->default_type_id = $defaultType->id;
			$template->icon=$folder->stripFileStoragePath().'/folder.png';
			$template->project_type=Template::PROJECT_TYPE_CONTAINER;
			$template->save();
			
			$template->acl->addGroup(GO::config()->group_everyone);


			$template = new Template();
			$template->name = GO::t("Standard project", "projects2");
			$template->default_status_id = $defaultStatus->id;
			$template->default_type_id = $defaultType->id;
			$template->project_type=Template::PROJECT_TYPE_PROJECT;
			$template->fields = 'responsible_user_id,status_date,customer,budget_fees,contact,expenses';
			$template->icon=$folder->stripFileStoragePath().'/project.png';
			$template->save();
			
			$template->acl->addGroup(GO::config()->group_everyone);
			
		}else
		{
			GO::setMaxExecutionTime(0);
			
			
			
			
			$oldModelTypeId = \GO\Base\Model\ModelType::model()->findByModelName("GO\Projects\Model\Project");
			$modelTypeId = \GO\Base\Model\ModelType::model()->findByModelName("GO\Projects2\Model\Project");
			
			//copy old projects module tables
			$stmt = GO::getDbConnection()->query('SHOW TABLES');
			while ($r = $stmt->fetch()) {
				$tableName = $r[0];


				if (substr($tableName, 0, 9) == 'go_links_' && !is_numeric(substr($tableName, 9, 1))) {			
					try{
						$sql = "ALTER TABLE  `$tableName` ADD  `ctime` INT NOT NULL DEFAULT  '0';";
						GO::getDbConnection()->query($sql);
					}
					catch(Exception $e){}
					
					$sql = "DELETE FROM `$tableName` WHERE model_type_id=".intval($modelTypeId);
					GO::debug($sql);
					GO::getDbConnection()->query($sql);

					$sql = "INSERT IGNORE INTO `$tableName` SELECT id,folder_id, model_id,'$modelTypeId', description, ctime FROM `$tableName` WHERE model_type_id=$oldModelTypeId";
					GO::debug($sql);
					GO::getDbConnection()->query($sql);
				}
				
				if (strpos($tableName, 'pm_') !== false) {
					
					//some GLOBAL2000 tables we do not want to copy
					if(!in_array($tableName,array('pm_employees','pm_resources','pm_employment_agreements'))){
					
						$newTable = str_replace('pm_', "pr2_", $tableName);

						$sql = "DROP TABLE IF EXISTS `$newTable`";
						GO::getDbConnection()->query($sql);

						$sql = "CREATE TABLE `$newTable` LIKE `$tableName`";
						GO::getDbConnection()->query($sql);

						$sql = "INSERT INTO `$newTable` SELECT * FROM `$tableName`";
						GO::getDbConnection()->query($sql);
					}
					
				}			
			}
			
			$sql = "update pr2_projects set name = replace(name, '/','-')";
			GO::getDbConnection()->query($sql);

			
//			$sql = "update pr2_projects set files_folder_id=0";
//			GO::getDbConnection()->query($sql);
			
			$sql = "select version from go_modules where id='projects'";			
			$stmt = GO::getDbConnection()->query($sql);
			
			$record = $stmt->fetch(PDO::FETCH_ASSOC);

			GO::modules()->projects2->version = $record['version'];
			GO::modules()->projects2->save();			
//			GO::modules()->projects->acl->copyPermissions(GO::modules()->projects2->acl);
			
			
			
			//start files
//			$sql = "UPDATE pr2_projects SET files_folder_id=(SELECT files_folder_id FROM pm_projects WHERE pm_projects.id=pr2_projects.id);";
//			GO::getDbConnection()->query($sql);

			$fsFolder = new GO\Base\Fs\Folder(GO::config()->file_storage_path.'projects2');
			if($fsFolder->exists()){
				$fsFolder->rename('projects2-'.date('c'));
			}

			$folder = \GO\Files\Model\Folder::model()->findByPath('projects');
			$folder->name='projects2';
			$folder->acl_id=GO::modules()->projects2->acl_id;
			$folder->save();


//			$sql = "UPDATE pm_projects SET files_folder_id=0;";
//			GO::getDbConnection()->query($sql);
			
			$sql = "update `pr2_templates` set icon = replace(icon, 'projects/', 'projects2/');";
			GO::getDbConnection()->query($sql);			
			
			//end files
			
			
			

			//upgrade database
			ob_start();
			$mc = new \GO\Core\Controller\MaintenanceController();
			$mc->run("upgrade", array(), false);
			ob_end_clean();
			
			
			
			//create new acl's
			
//			$types = \GO\Projects\Model\Type::model()->find();			
//			foreach($types as $type){				
//				$type2 = Model\Type::model()->findByPk($type->id);				
//				$type2->setNewAcl($type->user_id);				
//				$type->acl->copyPermissions($type2->acl);			
//				$type2->save();
//			}
			
			
			$sql="ALTER TABLE `pr2_hours` CHANGE `income_id` `old_income_id` INT( 11 ) NULL DEFAULT NULL ;";
			GO::getDbConnection()->query($sql);
			$sql="ALTER TABLE `pr2_hours` ADD `income_id` INT( 11 ) NULL AFTER `old_income_id` ;";
			GO::getDbConnection()->query($sql);
			$sql="UPDATE `pr2_hours` SET old_income_id=-1*old_income_id;";
			GO::getDbConnection()->query($sql);
			
			
			if(\GO\Base\Db\Utils::tableExists("pm_employment_agreements")){
				
				//GLOBAL 2000 version
				
				$sql = "replace into pr2_employees (user_id, external_fee, internal_fee) select employee_id, max(external_fee),max(internal_fee) from pm_employment_agreements group by employee_id";
				GO::getDbConnection()->query($sql);


				$sql = "replace into pr2_resources (user_id,project_id, external_fee, internal_fee) select user_id,project_id, external_fee, internal_fee from pm_resources";
				GO::getDbConnection()->query($sql);
				
//			No longer necessary because of $updates['201310041023'] in updates.inc.php :	
//				//untested
//				$sql = "ALTER TABLE  `pr2_hours` CHANGE  `external_value`  `external_fee` DOUBLE NOT NULL DEFAULT  '0'";
//				GO::getDbConnection()->query($sql);
			}else
			{
				$sql = "insert ignore into pr2_employees (user_id, external_fee, internal_fee) select user_id, max(ext_fee_value), max(int_fee_value) from pm_hours group by user_id";
				GO::getDbConnection()->query($sql);


				$sql = "insert ignore into pr2_resources (user_id,project_id, external_fee, internal_fee) select user_id,project_id, max(ext_fee_value), max(int_fee_value) from pm_hours group by user_id, project_id";
				GO::getDbConnection()->query($sql);
			}
			
			
			$sql = "update pr2_templates set project_type=1";
			GO::getDbConnection()->query($sql);


			if (GO::modules()->customfields) {
				
//				require(dirname(__FILE__).'/install/migrate/models.php');
				
//				\GO\Customfields\CustomfieldsModule::replaceRecords("GO\Projects\Model\Project", "GO\Projects2\Model\Project");
				
//				\GO\Customfields\CustomfieldsModule::replaceRecords("GO\Projects\Model\Hour", "GO\Projects2\Model\TimeEntry");
				
				//$sql = "RENAME TABLE  `cf_pm_projects` TO  `cf_pr2_projects` ";
				//GO::getDbConnection()->query($sql);
				
				//$sql = "RENAME TABLE  `cf_pm_hours` TO  `cf_pr2_hours` ";
				//GO::getDbConnection()->query($sql);
				
				$sql = "update `cf_categories` set extends_model = 'GO\\\\Projects2\\\\Model\\\\Project' where extends_model = 'GO\\\\Projects\\\\Model\\\\Project';";
				GO::getDbConnection()->query($sql);
				
				$sql = "update `cf_categories` set extends_model = 'GO\\\\Projects2\\\\Model\\\\Hour' where extends_model = 'GO\\\\Projects\\\\Model\\\\Hour';";
				GO::getDbConnection()->query($sql);

			}
			
			
			
			GO::getDbConnection()->query("UPDATE go_search_cache set model_type_id=$modelTypeId where model_type_id=$oldModelTypeId");
			
		
			

			// Now, let's make sure that all the projects have a template.
			
			$folder = new Folder(GO::config()->file_storage_path.'projects2/template-icons');
			$folder->create();			
			
			if(!$folder->child('folder.png')){
				$file = new File(GO::modules()->projects2->path . 'install/images/folder.png');
				$file->copy($folder);
			}
			
			if(!$folder->child('project.png')){
				$file = new File(GO::modules()->projects2->path . 'install/images/project.png');
				$file->copy($folder);			
			}
			
			if (\GO::modules()->files) {
	
				$fileFolder = \GO\Files\Model\Folder::model()->findByPath('projects2/template-icons',true);
				if(!$fileFolder->acl_id!=\GO::modules()->projects2->acl_id){
					$oldIgnore = \GO::$ignoreAclPermissions;
					\GO::$ignoreAclPermissions=true;
					$fileFolder->acl_id=\GO::modules()->projects2->acl_id;
					$fileFolder->save();		
					\GO::$ignoreAclPermissions=$oldIgnore;
				}
				//for icons added after install
				$fileFolder->syncFilesystem();
			}
			
			$normalTemplate = new Template();
			$normalTemplate->name = GO::t("Normal project", "projects2");
			$normalTemplate->project_type=Template::PROJECT_TYPE_PROJECT;
			$normalTemplate->fields = 'responsible_user_id,status_date,customer,budget_fees,contact,expenses';
			$normalTemplate->icon=$folder->stripFileStoragePath().'/project.png';
			$normalTemplate->save();
			
			GO\Base\Db\Columns::$forceLoad = true;
			
			$noTemplateProjectsStmt = Project::model()->find(
				FindParams::newInstance()
					->criteria(
						FindCriteria::newInstance()
							->addCondition('template_id',0)
					)
			);
			
			GO\Base\Db\Columns::$forceLoad = false;
			
			foreach ($noTemplateProjectsStmt as $noTemplateProjectModel) {
				$noTemplateProjectModel->template_id = $normalTemplate->id;
				$noTemplateProjectModel->save();
			}
			
		
			// Upgrade closed weeks
			ob_start();
			$pc = new \GO\Projects2\Controller\ProjectController();
			$pc->run("v1toV2Upgrade", array(), false);
			ob_end_clean();
			
		}

		
	}

	/**
	 * Get the user this time entry is for based on a session that is set
	 * If the logged in user is no manger always return itself
	 * 
	 * @return int
	 */
	public static function getActiveTimeregistrationUserId() {

		if (GO::user()->getModulePermissionLevel('timeregistration2') == \GO\Base\Model\Acl::MANAGE_PERMISSION && !empty(GO::session()->values['tr_active_user']))
			return GO::session()->values['tr_active_user'];
		else
			return GO::user()->id;
	}

	/**
	 * Create the default notification cronjob for income contracts
	 */
	public static function createDefaultIncomeContractNotificationCron(){
		
			$cron = new \GO\Base\Cron\CronJob();
		
			$cron->name = GO::t("Contract Expiry Notification Cron", "projects2");
			$cron->active = true;
			$cron->runonce = false;
			$cron->minutes = '2';
			$cron->hours = '7';
			$cron->monthdays = '*';
			$cron->months = '*';
			$cron->weekdays = '*';
			$cron->job = 'GO\Projects2\Cron\IncomeNotification';

			return $cron->save();
	}
	
	
	public static function deleteUser($user){
		
		Model\Employee::model()->deleteByAttribute('user_id', $user->id);
		Model\Resource::model()->deleteByAttribute('user_id', $user->id);
		Model\DefaultResource::model()->deleteByAttribute('user_id', $user->id);
	}
	
	public function checkDatabase(&$response) {
		
//		$sql = "update fs_folders set readonly = 0, acl_id = 0 where id in (
//
//			select id from (select id,parent_id from fs_folders order by parent_id, id) sort, (select @pv := '36') initialisation where find_in_set(parent_id, @pv) > 0 and @pv := concat(@pv, ',', id)
//    
//    )
//    
//    
//    and
//    
//    id  not in (
//        
//        select files_folder_id from pr2_projects
//        
//        )
//        
//        and readonly = 1;";

		
		return parent::checkDatabase($response);
	}
}
