<?php
/*
 * Copyright Intermesh BV.
 *
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 *
 * If you have questions write an e-mail to info@intermesh.nl
 */

/**
 * The WorkflowModule class

 * @package GO.modules.Scanbox
 * @version $Id: WorkflowModule.php 22580 2017-10-23 08:06:26Z mschering $
 * @copyright Copyright Intermesh BV.
 * @author Wesley Smits wsmits@intermesh.nl
 *
 */


namespace GO\Workflow;


class WorkflowModule extends \GO\Professional\Module{
	
	public function package() {
		return "Documents";
	}

	/**
	 * Initialize the listeners for the ActiveRecords
	 */
	public static function initListeners(){	
		// Define the ActiveRecord \GO\Files\Model\File
		\GO\Files\Model\File::model()->addListener('save', 'GO\Workflow\WorkflowModule', 'save');
		\GO\Files\Model\File::model()->addListener('delete', 'GO\Workflow\WorkflowModule', 'delete');
		
		// Define the ActiveRecord \GO\Tasks\Model\Task
		\GO\Tasks\Model\Task::model()->addListener('save', 'GO\Workflow\WorkflowModule', 'save');
		\GO\Tasks\Model\Task::model()->addListener('delete', 'GO\Workflow\WorkflowModule', 'delete');
		
		// Add trigger for folder in the files module
		$c = new \GO\Files\Controller\FolderController();
		$c->addListener('submit', 'GO\Workflow\WorkflowModule', 'checkFolderTrigger');
		$c->addListener('load', 'GO\Workflow\WorkflowModule', 'loadFolderTrigger');
	}	
	
	/**
	 * Univeral checker for workflow triggers
	 * This function should work for all ActiveRecords
	 * 
	 * @param \GO\Base\Db\ActiveRecord $model 
	 */
	public static function save($model,$wasNew){
	
		if($wasNew || (!$wasNew && $model->className() == 'GO\Files\Model\File' && $model->isModified('folder_id'))){
			// Check for a trigger for this model
			$triggers = Model\Trigger::model()->findByAttribute('model_type_id', $model->modelTypeId());

			\GO::debug('CHECK FOR WORKFLOW TRIGGER ON THIS MODEL');

			while($trigger = $triggers->fetch()){
					if($trigger->model_attribute_value == $model->{$trigger->model_attribute}){

						\GO::debug('TRIGGER FOUND!, START NEW WORKFLOW PROCESS');

						$process = Model\Process::model()->findByPk($trigger->process_id);
						$step = $process->getNextStep();

						$wfModel = new Model\Model();
						$wfModel->model_id = $model->id;
						$wfModel->model_type_id = $model->modelTypeId();
						$wfModel->process_id = $trigger->process_id;
						$wfModel->step_id = $step->id;
						//$wfModel->ctime = 0;
						$wfModel->due_time = $wfModel->calculateDueTime($step);
						$wfModel->shift_due_time = 0;
						$wfModel->save();
					}
			}
		}
	}
	
	public static function loadFolderTrigger($self,&$response,$model,&$params){
		
		$trigger = Model\Trigger::model()->findSingleByAttributes(array(
					'model_type_id'=>\GO\Files\Model\File::model()->modelTypeId(),
					'model_attribute'=>'folder_id',
					'model_attribute_value'=>$model->id
				//	'process_id'=>$params['wf_process_id'] Only one trigger is allowed
			));
		
		if($trigger){
			$response['data']['wf_process_id'] = $trigger->process_id;
			$response['remoteComboTexts']['wf_process_id'] = $trigger->process->name;
		}else{
			$response['data']['wf_process_id'] = "";
		}
	}
	
	public static function checkFolderTrigger($self,&$response,$model,&$params,$modifiedAttributes){

		$trigger = Model\Trigger::model()->findSingleByAttributes(array(
					'model_type_id'=>\GO\Files\Model\File::model()->modelTypeId(),
					'model_attribute'=>'folder_id',
					'model_attribute_value'=>$model->id
				//	'process_id'=>$params['wf_process_id'] Only one trigger is allowed
			));
		
		if(!empty($params['wf_process_id'])){
			if(!$trigger){
				\GO::debug('NO EXISTING TRIGGER FOUND, CREATE NEW TRIGGER');
				$trigger = new Model\Trigger();
				$trigger->model_type_id = \GO\Files\Model\File::model()->modelTypeId();
				$trigger->model_attribute = 'folder_id';
				$trigger->model_attribute_value = $model->id;				
			}
			$trigger->process_id = $params['wf_process_id'];
			$trigger->save();
				
		}elseif($trigger)
			$trigger->delete();
	}
	
	
	public static function delete($model){
		$wfModels = Model\Model::model()->findByAttributes(array('model_type_id'=>$model->modelTypeId(),'model_id'=>$model->id));
		while($wfModel = $wfModels->fetch()){
			$wfModel->delete();
		}
	}
		
	public function autoInstall() {
		return false;
	}
	
	public function author() {
		return 'Wesley Smits';
	}
	
	public function authorEmail() {
		return 'wsmits@intermesh.nl';
	}
	
	public function depends() {
		return ['files'];
	}
}
