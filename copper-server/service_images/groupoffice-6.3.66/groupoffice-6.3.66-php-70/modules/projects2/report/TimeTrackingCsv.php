<?php

/*
 * Copyright Intermesh BV
 *
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 *
 * If you have questions write an e-mail to info@intermesh.nl
 */

/**
 * Generated PDF document for project milestones
 *
 * @package GO.projects2.report
 * @copyright Copyright Intermesh
 * @version $Id: TimeTrackingCsv.php 23116 2018-01-12 10:43:48Z mschering $ 
 * @author Merijn Schering <mschering@intermesh.nl>
 */

namespace GO\Projects2\Report;

use GO;
use GO\Projects2\Report\AbstractReport;


class TimeTrackingCsv extends AbstractReport {

	

	public function name() {
		return \GO::t("Time entries", "projects2");
	}
	
	public function supportsBatchReport() {
		return true;
	}
	
	public function supportsSelectedProject() {
		return true;
	}
	
	public function supportedProjectTypes() {
		return array(\GO\Projects2\Model\Template::PROJECT_TYPE_CONTAINER, \GO\Projects2\Model\Template::PROJECT_TYPE_PROJECT);
	}
	
	public function supportsDateRange() {
		return true;
	}

	public function fileExtension() {
		return 'csv';
	}

	public function render($return = false) {


		$fp = \GO\Base\Db\FindParams::newInstance()
						->ignoreAcl()
						->select('t.*')
						->joinRelation('user');
		
		if(isset($this->startDate))
			$fp->getCriteria()->addCondition('date', $this->startDate,'>=','t');
		
		if(isset($this->endDate))
			$fp->getCriteria()->addCondition('date', $this->endDate,'<','t');
		
		
			
		//query all subprojects of given path
		if($this->project){	
			$fp->getCriteria()->addRawCondition('t.project_id', "(SELECT id FROM pr2_projects WHERE path LIKE :path OR project_id = :project_id)",'IN');
			$fp->getCriteria()->addBindParameter(':path', $this->project->path.'/%');	
			$fp->getCriteria()->addBindParameter(':project_id', $this->project->id);				
		} 

		$stmt = \GO\Projects2\Model\TimeEntry::model()->find($fp);
		
		
		$csvFile = \GO\Base\Fs\CsvFile::tempFile($this->filename, $this->fileExtension());
		
		
		$attributes = array(			
			'user.name',
			'date',
			'comments',
			'project.path',
			'internal_fee',
			'external_fee',
			'units',
			'travel_distance',
			'travel_costs',
		);
		
		$csvFile->putRecord($attributes);
		
		\GO\Projects2\Model\TimeEntry::$attributeOutputMode='formatted';
		
		foreach($stmt as $timeEntry){
			
			$record = array();
			foreach($attributes as $attr){
				
				$relations = explode('.', $attr);
				
				$attrName = array_pop($relations);
				
				$model = $timeEntry;
				foreach($relations as $relation){
					$model = $model->$relation;
				}
				
				$value=$model->$attrName;
				
				//strip current project path from all children
				if($this->project && $attrName=='path'){
					$value = substr($value, strlen(dirname($this->project->path))+1);
				}
				
				$record[]=$value;
			}
			
			$csvFile->putRecord($record);
		}
		
		if($return){
			return $csvFile->getContents();
		}else
		{
			\GO\Base\Util\Http::outputDownloadHeaders($csvFile, false);
			$csvFile->output();
		}
	}
	

}
