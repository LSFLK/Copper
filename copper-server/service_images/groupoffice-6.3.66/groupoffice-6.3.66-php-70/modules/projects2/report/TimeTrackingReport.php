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
 * @version $Id: TimeTrackingReport.php 23116 2018-01-12 10:43:48Z mschering $ 
 * @author Merijn Schering <mschering@intermesh.nl>
 */

namespace GO\Projects2\Report;
use GO;
use GO\Projects2\Model\Template;


class TimeTrackingReport extends AbstractReport {

	/**
	 *
	 * @var \GO\Base\Util\Pdf 
	 */
	private $_pdf;
	
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
		return array(Template::PROJECT_TYPE_CONTAINER, Template::PROJECT_TYPE_PROJECT);
	}
	
	public function supportsDateRange() {
		return true;
	}

	public function fileExtension() {
		return 'pdf';
	}

	public function render($return = false) {
		$this->_pdf = new \GO\Base\Util\Pdf('L');
		$this->_pdf->title = $this->name();
		if (!empty($_REQUEST['startdate'])) {
			$this->_pdf->subtitle = $_REQUEST['startdate'];

			if (!empty($_REQUEST['enddate'])) {
				$this->_pdf->subtitle .=" - " . $_REQUEST['enddate'];
			}
		}
	
		$this->_pdf->AddPage();
		
		$this->_addTimeEntries();
		
		if ($return)
			return $this->_pdf->Output($this->filename.".pdf", 'S');
		else {
//			\GO\Base\Util\Http::outputDownloadHeaders(new \GO\Base\Fs\File($this->filename.".pdf"));
			echo $this->_pdf->Output($this->filename.".pdf", 'I');
		}
	}

	private function _addTimeEntries($project=null) {

		$fp = \GO\Base\Db\FindParams::newInstance()
						->ignoreAcl()
						->select('t.*')
						->order(array('path','date'),array('asc','desc'))
						->joinRelation('user')
						->joinRelation('project');
		
		if(isset($this->startDate))
			$fp->getCriteria()->addCondition('date', $this->startDate,'>=','t');
		
		if(isset($this->endDate))
			$fp->getCriteria()->addCondition('date', $this->endDate,'<','t');
		
		
		$titleFn='h2';
		$title = sprintf(GO::t("Time entries", "projects2"), GO::t("all projects", "projects2"));
		
		//query all subprojects of given path
		if($this->project){
			$titleFn='h2';
			$title = sprintf(GO::t("Time entries for project \"%s\" and it's subprojects", "projects2"), $this->project->path);
			
			// For a single project
//			$fp->getCriteria()->addCondition('project_id', $this->project->id);
			
			
			// For a single project but including subprojects
			$fp->getCriteria()->addRawCondition('t.project_id', "(SELECT id FROM pr2_projects WHERE path LIKE :path OR project_id = :project_id)",'IN');
			$fp->getCriteria()->addBindParameter(':path', $this->project->path.'/%');	
			$fp->getCriteria()->addBindParameter(':project_id', $this->project->id);				
		} 

		$stmt = \GO\Projects2\Model\TimeEntry::model()->find($fp);
		
		$html = $this->_pdf->getStyle().
						'<table border="0" cellpadding="3">';
		$html .= '<thead>' .
						$this->_pdf->tableHeaders(array(
								new \GO\Base\Util\PdfTableColumn(array('width' => 340,'text' => \GO::t("Project", "projects2"), 'class'=>'head')),
								new \GO\Base\Util\PdfTableColumn(array('width' => 50,'text' => \GO::t("Hours"), 'class'=>'head', 'align' => 'right')),
								new \GO\Base\Util\PdfTableColumn(array('width' => 200,'text' => \GO::t("Employee", "projects2"), 'class'=>'head', 'align' => 'right')),
								new \GO\Base\Util\PdfTableColumn(array('width' => 80,'text'=>\GO::t("Date", "projects2"),'class'=>'head','align'=>'right')),
								new \GO\Base\Util\PdfTableColumn(array('width' => 300,'text'=>\GO::t("Comments", "projects2"),'class'=>'head','align'=>'right'))
						)) .
						'</thead><tbody>';

		if (!$stmt->rowCount()) {

			//print nothing
			return;

		} else {
			
			$this->_pdf->$titleFn($title);

			$totalMinutes = 0;

			foreach ($stmt as $timeEntry) {

				$html .= $this->_pdf->tableRow(array(
						new \GO\Base\Util\PdfTableColumn(array('text' => $timeEntry->project->path)),
						new \GO\Base\Util\PdfTableColumn(array('text' => \GO\Base\Util\Date::minutesToTimeString($timeEntry->duration))),
						new \GO\Base\Util\PdfTableColumn(array('text' => $timeEntry->employee->user->name)),
						new \GO\Base\Util\PdfTableColumn(array('text' => $timeEntry->getStart_date())),
						new \GO\Base\Util\PdfTableColumn(array('text' => $timeEntry->comments))
				));
						
				$totalMinutes += $timeEntry->duration;
			}

			$html .= $this->_pdf->tableRow(array(
					new \GO\Base\Util\PdfTableColumn(array('class'=>'total','colspan' => 1, 'text' => \GO::t("Total") . ':')),
					new \GO\Base\Util\PdfTableColumn(array('class'=>'total','text' => \GO\Base\Util\Date::minutesToTimeString($totalMinutes))),
					new \GO\Base\Util\PdfTableColumn(array('class'=>'total','colspan' => 3))
			));
		}
		
		$html .= '</tbody></table>';
		
		$this->_pdf->writeHTML($html,true,false,false,true);
			
		$this->_pdf->Ln(10);
	}
}
