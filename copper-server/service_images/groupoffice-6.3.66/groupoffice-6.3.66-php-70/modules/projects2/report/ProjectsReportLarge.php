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
 * @version $Id: ProjectsReportLarge.php 23116 2018-01-12 10:43:48Z mschering $ 
 * @author Merijn Schering <mschering@intermesh.nl>
 */

namespace GO\Projects2\Report;

use GO;
use GO\Base\Db\FindParams;
use GO\Base\Fs\File;
use GO\Base\Util\Date;
use GO\Base\Util\Http;
use GO\Base\Util\Number;
use GO\Base\Util\Pdf;
use GO\Base\Util\PdfTableColumn;
use GO\Projects2\Model\Project;
use GO\Projects2\Model\Template;

class ProjectsReportLarge extends AbstractReport {

	/**
	 *
	 * @var Pdf 
	 */
	private $_pdf;

	public function name() {
		return GO::t("Large projects overview", "projects2");
	}

	public function fileExtension() {
		return 'pdf';
	}

	public function supportsStatusFilter() {
		return true;
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

	public function render($return = false) {

		\GO::setMemoryLimit(512);

		$this->_pdf = new Pdf('L');
//		$this->_pdf->font_size=8;
		$this->_pdf->title = $this->name();


		if ($this->project) {
			$this->_pdf->title .= ': ' . $this->project->path;
		}

		if (!empty($_REQUEST['startdate'])) {
			$this->_pdf->subtitle = $_REQUEST['startdate'];

			if (!empty($_REQUEST['enddate'])) {
				$this->_pdf->subtitle .=" - " . $_REQUEST['enddate'];
			}
		}


		$this->_pdf->AddPage();


		$this->_addProjects();


		if ($return)
			return $this->_pdf->Output($this->filename . ".pdf", 'S');
		else {
			Http::outputDownloadHeaders(new File($this->filename . ".pdf"));
			echo $this->_pdf->Output($this->filename . ".pdf", 'I');
		}
	}

	private function _date($unixtime) {
		return date('Y-m-d', $unixtime);
	}

	private function _addProjects() {

		$fp = FindParams::newInstance();
		$fp->joinRelation('template');
//		$fp->joinRelation('status');


		$fp->getCriteria()
						->addCondition('project_type', Template::PROJECT_TYPE_PROJECT, '=', 'template')
						->addInCondition('status_id', $this->statuses);


		//query all subprojects of given path
		if ($this->project) {
			$fp->getCriteria()->addCondition('path', $this->project->path . '/%', 'LIKE');
		}

//		if (isset($this->startDate))
//			$fp->getCriteria()->addCondition('start_time', $this->startDate, '>=');
//
//		if (isset($this->endDate))
//			$fp->getCriteria()->addCondition('start_time', $this->endDate,'<');


		$ganttdata = array(
				'title' => "Timeline"
//				, 'daterange' => array($this->_date($this->project->start_time), $this->_date($this->project->due_time))
				, 'items' => array()
		);

		$this->_pdf->style = 'td.head{
	font-weight:bold;
	border-bottom:2px solid #000;
	font-size:60%;
	line-height:200%;
}
td.total{
	border-top:1px solid black;
	line-height:300%;
}

td.normal{
	border-bottom:1px solid #ccc;
}
			
td.group{
	border-bottom:1px solid #ccc;
	font-size:11px;
	line-height:200%;
}
			
h2{
color:#000;
}

td{font-size:55%}';


		$stmt = Project::model()->find($fp);


		$html = $this->_pdf->getStyle() . '<table border="0" cellpadding="3">';
		$html .= '<thead>' .
						$this->_pdf->tableHeaders(array(
								new PdfTableColumn(array('width' => 290, 'text' => GO::t("Project", "projects2"), 'class' => 'head')),
								new PdfTableColumn(array('width' => 50, 'text' => GO::t("Status", "projects2"), 'class' => 'head')),
								new PdfTableColumn(array('width' => 50, 'text' => GO::t("Budget", "projects2"), 'class' => 'head', 'align' => 'right')),
								new PdfTableColumn(array('width' => 50, 'text' => GO::t("B. internal", "projects2"), 'class' => 'head', 'align' => 'right')),
								new PdfTableColumn(array('width' => 50, 'text' => GO::t("B. expenses", "projects2"), 'class' => 'head', 'align' => 'right')),
								new PdfTableColumn(array('width' => 50, 'text' => GO::t("B. mileage", "projects2"), 'class' => 'head', 'align' => 'right')),
								new PdfTableColumn(array('width' => 50, 'text' => GO::t("Total budget", "projects2"), 'class' => 'head', 'align' => 'right')),
								new PdfTableColumn(array('width' => 50, 'text' => GO::t("Realization", "projects2"), 'class' => 'head', 'align' => 'right')),
								new PdfTableColumn(array('width' => 50, 'text' => GO::t("R. internal", "projects2"), 'class' => 'head', 'align' => 'right')),
								new PdfTableColumn(array('width' => 50, 'text' => GO::t("R. expenses", "projects2"), 'class' => 'head', 'align' => 'right')),
								new PdfTableColumn(array('width' => 50, 'text' => GO::t("R. mileage", "projects2"), 'class' => 'head', 'align' => 'right')),
								new PdfTableColumn(array('width' => 50, 'text' => GO::t("Total realization", "projects2"), 'class' => 'head', 'align' => 'right')),
								new PdfTableColumn(array('width' => 50, 'text' => GO::t("Expenses", "projects2"), 'class' => 'head', 'align' => 'right')),
//								new PdfTableColumn(array('width' => 50, 'text' => GO::t("Time", "projects2").' €', 'class'=>'head','align'=>'right')),								
								new PdfTableColumn(array('width' => 60, 'text' => GO::t("Time", "projects2") . ' h', 'class' => 'head', 'align' => 'right')),
								new PdfTableColumn(array('width' => 50, 'text' => GO::t("Travel distance", "projects2"), 'class' => 'head', 'align' => 'right')),
//								new PdfTableColumn(array('width' => 50, 'text' => GO::t("Travel costs", "projects2"), 'class'=>'head','align'=>'right')),								
								new PdfTableColumn(array('width' => 50, 'text' => GO::t("% complete", "projects2"), 'class' => 'head', 'align' => 'right')),
								new PdfTableColumn(array('width' => 50, 'text' => GO::t("Lag", "projects2"), 'class' => 'head', 'align' => 'right')),
//								new PdfTableColumn(array('width' => 60, 'text' => GO::t("Budget", "projects2"), 'class'=>'head','align'=>'right')),
//								new PdfTableColumn(array('width' => 60, 'text' => GO::t("Realization", "projects2"), 'class'=>'head','align'=>'right')),
						)) .
						'</thead><tbody>';

		if (!$stmt->rowCount()) {
			$html .= '<tr>' .
							'<td colspan="1">' . GO::t("No items to display") . '</td>' .
							'</tr>';
		} else {

			$totals = array(
					'budget' => 0,
					'b_internal' => 0,
					'b_expenses' => 0,
					'b_mileage' => 0,
					'b_total' => 0,
					'realization' => 0,
					'r_internal' => 0,
					'r_expenses' => 0,
					'r_mileage' => 0,
					'r_total' => 0
//					,
//					'total_expenses' => 0
					,'time_real'=>0,
					'time_budget'=>0,
					'travel_distance'=>0
			);

			foreach ($stmt as $project) {

//				$totalExpenses = $project->totalExpenses;

//				$s=$project->getTimeEntrySum();
//				$totalTimeEntryFee = $s['internal_fee'];
//				$budget = $project->getBudgetForIncomeContractPrice();
				$budgetSums = $project->getBudgetCalculationArrays();
//				$budgetSums = array(
//					'budget_sum' => \GO\Projects2\Model\Project::sumsArrayToCalculationHtmlString($sumsArrays['budget_sum']),
//					'real_sum' => \GO\Projects2\Model\Project::sumsArrayToCalculationHtmlString($sumsArrays['real_sum'])
//				);

				$totals['budget']+=$budgetSums['budget_sum']['budget'];
				$totals['b_internal']+=$budgetSums['budget_sum']['internalFee'];
				$totals['b_expenses']+=$budgetSums['budget_sum']['expenses'];
				$totals['b_mileage']+=$budgetSums['budget_sum']['mileage'];
				$totals['b_total']+=$budgetSums['budget_sum']['sum'];
				$totals['realization']+=$budgetSums['real_sum']['budget'];
				$totals['r_internal']+=$budgetSums['real_sum']['internalFee'];
				$totals['r_expenses']+=$budgetSums['real_sum']['expenses'];
				$totals['r_mileage']+=$budgetSums['real_sum']['mileage'];
				$totals['r_total']+=$budgetSums['real_sum']['sum'];
//				$totals['total_expenses']+=$totalExpenses;
				$totals['time_real']+=$project->getTotalTimeEntryMinutes();
				$totals['time_budget']+=$project->getTotalTimeBudgetMinutes();
				$totals['travel_distance']+=$project->getTotalMileage();

				$html .= $this->_pdf->tableRow(array(
						new PdfTableColumn(array('text' => $project->path)),
						new PdfTableColumn(array('text' => $project->status->name)),
//						new PdfTableColumn(array('text' => Number::localize($totalExpenses+$totalTimeEntryFee).' / '.Number::localize($budget),'color'=>$budget>$totalExpenses+$totalTimeEntryFee ? 'black' : 'red')),						
						new PdfTableColumn(array('text' => Number::localize($budgetSums['budget_sum']['budget']), 'align' => 'right')),
						new PdfTableColumn(array('text' => Number::localize($budgetSums['budget_sum']['internalFee']), 'align' => 'right')),
						new PdfTableColumn(array('text' => Number::localize($budgetSums['budget_sum']['expenses']), 'align' => 'right')),
						new PdfTableColumn(array('text' => Number::localize($budgetSums['budget_sum']['mileage']), 'align' => 'right')),
						new PdfTableColumn(array('text' => Number::localize($budgetSums['budget_sum']['sum']), 'align' => 'right')),
						new PdfTableColumn(array('text' => Number::localize($budgetSums['real_sum']['budget']), 'align' => 'right')),
						new PdfTableColumn(array('text' => Number::localize($budgetSums['real_sum']['internalFee']), 'align' => 'right')),
						new PdfTableColumn(array('text' => Number::localize($budgetSums['real_sum']['expenses']), 'align' => 'right')),
						new PdfTableColumn(array('text' => Number::localize($budgetSums['real_sum']['mileage']), 'align' => 'right')),
						new PdfTableColumn(array('text' => Number::localize($budgetSums['real_sum']['sum']), 'align' => 'right')),
//						new PdfTableColumn(array('text' => Number::localize($totalExpenses), 'align' => 'right')),
//						new PdfTableColumn(array('text' => Number::localize($totalTimeEntryFee),'align'=>'right')),
						new PdfTableColumn(array('text' => Date::minutesToTimeString($project->getTotalTimeEntryMinutes()) . ' / ' . Date::minutesToTimeString($project->getTotalTimeBudgetMinutes()), 'align' => 'right', 'color' => $project->getTotalTimeBudgetMinutes() > $project->getTotalTimeEntryMinutes() ? 'black' : 'red')),
						new PdfTableColumn(array('text' => Number::localize($project->getTotalMileage()), 'align' => 'right')),
//						new PdfTableColumn(array('text' => Number::localize($project->getTotalTravelCosts()),'align'=>'right')),
						new PdfTableColumn(array('text' => $project->getPercentageComplete() . '%', 'align' => 'right')),
						new PdfTableColumn(array('text' => Date::minutesToTimeString($project->getLag()), 'align' => 'right')),
//						new PdfTableColumn(array('text' => $budgetSumString,'align'=>'right')),
//						new PdfTableColumn(array('text' => $realSumString,'align'=>'right')),
				));


				$resources = array();

				foreach ($project->resources as $resource) {
					if (!empty($resource->user))
						$resources[] = $resource->user->name;
					else
						$resources[] = '';
				}


				$ganttdata['items'][] = array(
						'id' => $project->id,
						'description' => $project->path,
						'datestart' => $this->_date($project->start_time),
						'dateend' => $this->_date($project->due_time),
						//'workdays' => $task->duration/60, 
						'members' => implode(', ', $resources),
//					'milestone'=>$task->parent_description ? $task->parent_description : \GO::t("ungrouped", "projects"),
						'progress' => $project->getPercentageComplete() / 100
				);
			}


			$html .= $this->_pdf->tableRow(array(
					new PdfTableColumn(array('text' => '<b>'.\GO::t("Total", "projects2").'</b>')),
					new PdfTableColumn(array('text' => '')),
//						new PdfTableColumn(array('text' => Number::localize($totalExpenses+$totalTimeEntryFee).' / '.Number::localize($budget),'color'=>$budget>$totalExpenses+$totalTimeEntryFee ? 'black' : 'red')),						
					new PdfTableColumn(array('text' => Number::localize($totals['budget']), 'align' => 'right')),
					new PdfTableColumn(array('text' => Number::localize($totals['b_internal']), 'align' => 'right')),
					new PdfTableColumn(array('text' => Number::localize($totals['b_expenses']), 'align' => 'right')),
					new PdfTableColumn(array('text' => Number::localize($totals['b_mileage']), 'align' => 'right')),
					new PdfTableColumn(array('text' => Number::localize($totals['b_total']), 'align' => 'right')),
					new PdfTableColumn(array('text' => Number::localize($totals['realization']), 'align' => 'right')),
					new PdfTableColumn(array('text' => Number::localize($totals['r_internal']), 'align' => 'right')),
					new PdfTableColumn(array('text' => Number::localize($totals['r_expenses']), 'align' => 'right')),
					new PdfTableColumn(array('text' => Number::localize($totals['r_mileage']), 'align' => 'right')),
					new PdfTableColumn(array('text' => Number::localize($totals['r_total']), 'align' => 'right')),
//					new PdfTableColumn(array('text' => Number::localize($totalExpenses), 'align' => 'right')),
//						new PdfTableColumn(array('text' => Number::localize($totalTimeEntryFee),'align'=>'right')),
					new PdfTableColumn(array('text' => Date::minutesToTimeString($totals['time_real']) . ' / ' . Date::minutesToTimeString($totals['time_budget']), 'align' => 'right', 'color' => $project->getTotalTimeBudgetMinutes() > $project->getTotalTimeEntryMinutes() ? 'black' : 'red')),
					new PdfTableColumn(array('text' => Number::localize($totals['travel_distance']), 'align' => 'right')),
//						new PdfTableColumn(array('text' => Number::localize($project->getTotalTravelCosts()),'align'=>'right')),
					new PdfTableColumn(array('text' => '', 'align' => 'right')),
					new PdfTableColumn(array('text' => '', 'align' => 'right'))
//						new PdfTableColumn(array('text' => $budgetSumString,'align'=>'right')),
//						new PdfTableColumn(array('text' => $realSumString,'align'=>'right')),
			));
		}

		$html .= '</tbody></table>';

//		exit($html);

		$this->_pdf->writeHTML($html, true, false, false, true);

		$this->_pdf->Ln(10);



//		$this->_pdf->AddPage();
//		$fp = \GO\Base\Db\FindParams::newInstance();
//		$fp->joinRelation('template');
//		$fp->joinRelation('status');
//								
//
//		$fp->getCriteria()
//						->addCondition('project_type', \GO\Projects2\Model\Template::PROJECT_TYPE_PROJECT, '=', 'template')
//						->addCondition('complete', 0,'=','status');
//		$pano = false;
//		$gantt_cfg = array(
//				'stringcharset' => 'utf-8'
//				, 'outname' => 'gantt_standalone.pdf'
//				, 'descr_width' => 0.3
//				, 'bgcolor' => '#eee'
//				, 'arrow_color' => '#25e'
//				, 'grid_color' => '#cce'
//				, 'shade_color' => '#bbb'
//		);
//		$gantt = new \GO\Base\Util\PdfGantt($this->_pdf, $gantt_cfg, 10, 10, 0, 14*count($ganttdata['items']));
# $gantt->localize( array('milestones'=>'Important stages') );
//		header('content-type: text/plain');		
//		var_dump($ganttdata);
//		exit();
//		$gantt->Render($ganttdata);
	}

}
