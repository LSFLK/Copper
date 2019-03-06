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
 * @version $Id: Planning.php 23116 2018-01-12 10:43:48Z mschering $ 
 * @author Merijn Schering <mschering@intermesh.nl>
 */

namespace GO\Projects2\Report;

class Planning extends AbstractReport {

	/**
	 *
	 * @var \GO\Base\Util\Pdf 
	 */
	private $_pdf;

	public function name() {
		return \GO::t("Project planning", "projects2");
	}

	public function fileExtension() {
		return 'pdf';
	}

	public function supportsSelectedProject() {
		return true;
	}

		
	public function supportsDateRange() {
		return false;
	}

	public function render($return = false) {
		$this->_pdf = new \GO\Base\Util\Pdf();
		$this->_pdf->title = \GO::t("Project planning", "projects2");
		if (!empty($_REQUEST['startdate'])) {
			$this->_pdf->subtitle = $_REQUEST['startdate'];

			if (!empty($_REQUEST['enddate'])) {
				$this->_pdf->subtitle .=" - " . $_REQUEST['enddate'];
			}
		}


		$this->_pdf->AddPage();

		$this->_addProjectInfo();
		
		$this->_addTasks();

//		$this->_addTimeEntries();

//		$this->_addExpenses();
		
		

//		$this->_addMileage();
//		exit;
		if ($return)
			return $this->_pdf->Output("test.pdf", 'S');
		else {
			\GO\Base\Util\Http::outputDownloadHeaders(new \GO\Base\Fs\File("Standard.pdf"));
			echo $this->_pdf->Output("test.pdf", 'I');
		}
	}

	private function _addProjectInfo() {
		$html = '<table cellpadding="2">';

		$html .= '<tr><td width="150px">' . \GO::t("Name") . ':</td><td>' . $this->project->path . '</td></tr>';
		$html .= '<tr><td>' . \GO::t("Status", "projects2") . ':</td><td>' . $this->project->status->name . '</td></tr>';

	
		
						
		if (!empty($this->project->description))
			$html .= '<tr><td>' . \GO::t("Description") . ':</td><td>' . $this->project->description . '</td></tr>';

		$html .= '</table>';


		$this->_pdf->writeHTML($html,true,false,false,true);
			
		$this->_pdf->Ln(10);
	}




	
	
	
	private function _addTasks(){
		
//		$this->_pdf->AddPage();
		
		$findParams = \GO\Base\Db\FindParams::newInstance()
						->select('t.*,parent.description AS parent_description')
						->group('t.id')
						->limit(0)
						->order('sort_order','ASC')
						->joinRelation('parent','LEFT');
						
		
		$findParams->groupRelation('timeEntries', 'sum(timeEntries.duration) AS minutes_booked','LEFT');
		
//		if(!empty($params['project_id'])){
		$findParams->getCriteria()
						->addCondition('project_id', $this->project->id)
						->addCondition('has_children', false);
		
//		if (isset($this->startDate)) {
//			$findParams->getCriteria()->addCondition('date', $this->startDate, '>=');
//		}
//
//		if (isset($this->endDate)) {
//			$findParams->getCriteria()->addCondition('date', $this->endDate, '<');
//		}
//		
		$stmt = \GO\Projects2\Model\Task::model()->find($findParams);
		
		

		if ($stmt->rowCount()) {
//			$this->_pdf->h2(\GO::t("Jobs", "projects2"));
			
			$html = $this->_pdf->getStyle();

			$html .= '<table border="0" cellpadding="3" nobr="true">';
			$html .= '<thead>' .
							$this->_pdf->tableRow(array(
						new \GO\Base\Util\PdfTableColumn(array("class"=>"", 'text' => '<h2>'.\GO::t("Jobs", "projects2").'</h2>','colspan'=>6)),
						
								)).
			
							$this->_pdf->tableHeaders(array(
									new \GO\Base\Util\PdfTableColumn(array('class'=>'head','width' => 70, 'text' => \GO::t("Day"), 'isHeader' => false)),
									new \GO\Base\Util\PdfTableColumn(array('class'=>'head', 'width' => 370, 'text' => \GO::t("Description"), 'isHeader' => false)),
//									new \GO\Base\Util\PdfTableColumn(array('class'=>'head','width' => 75, 'text' => \GO::t("% complete", "projects2"), 'align' => 'right')),
									new \GO\Base\Util\PdfTableColumn(array('class'=>'head','width' => 150, 'text' => \GO::t("Employee", "projects2"),'align' => 'right')),
									new \GO\Base\Util\PdfTableColumn(array('class'=>'head','width' => 80, 'text' => \GO::t("Duration", "projects2").' ('.\GO::t("h", "projects2").')', 'align' => 'right')),
//									new \GO\Base\Util\PdfTableColumn(array('class'=>'head','width' => 90, 'text' => \GO::t("Hours booked", "projects2"),  'align' => 'right'))
							)) .
							'</thead><tbody>';
//			$totalCost = 0;
			
			$lastGroup = false;
			$totalDuration =0;
			$totalBooked =0;
			
			$lastDate = FALSE;
			$day=0;
			
			foreach ($stmt as $task) {
				
				$newGroup = !empty($task->parent_description) ? $task->parent_description : \GO::t("Ungrouped", "projects2");
				
				if($newGroup!=$lastGroup){
					$html .= $this->_pdf->tableRow(array(
						new \GO\Base\Util\PdfTableColumn(array("class"=>"group", 'text' => $newGroup,'colspan'=>6)),
						
								));
				}
				
				$lastGroup = $newGroup;
				
				$newDate = \GO\Base\Util\Date::clear_time($task->getAutoDueDate(false));
				if($lastDate !=$newDate){
					$lastDate = $newDate;
					$day++;
				}
				
				$html .= $this->_pdf->tableRow(array(
						new \GO\Base\Util\PdfTableColumn(array("class"=>"normal",'text' => $day)),
						new \GO\Base\Util\PdfTableColumn(array("class"=>"normal",'text' => $task->description)),
//						new \GO\Base\Util\PdfTableColumn(array("class"=>"normal",'text' => $task->getAttribute('percentage_complete', 'formatted'))),
						new \GO\Base\Util\PdfTableColumn(array("class"=>"normal",'text' => $task->user->name)),
						new \GO\Base\Util\PdfTableColumn(array("class"=>"normal",'text' => \GO\Base\Util\Number::localize($task->duration/60))),
//						new \GO\Base\Util\PdfTableColumn(array("class"=>"normal",'text' => \GO\Base\Util\Number::localize($task->minutes_booked/60))),
								));

				$totalDuration +=$task->duration;
				$totalBooked +=$task->minutes_booked;
				
			}

			$html .= $this->_pdf->tableRow(array(
					new \GO\Base\Util\PdfTableColumn(array('class'=>'total','colspan' => 3, 'text' => \GO::t("Total") . ':')),
					new \GO\Base\Util\PdfTableColumn(array('class'=>'total','text' => \GO\Base\Util\Number::localize($totalDuration/60))),
//					new \GO\Base\Util\PdfTableColumn(array('class'=>'total','text' => \GO\Base\Util\Number::localize($totalBooked/60))),
							));



			$html .= '</tbody></table>';


			$this->_pdf->writeHTML($html,true,false,false,true);
			
			$this->_pdf->Ln(20);
		}
		
	}

}
