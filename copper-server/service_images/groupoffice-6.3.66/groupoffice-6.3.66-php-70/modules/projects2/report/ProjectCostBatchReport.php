<?php

//projectCostReport

namespace GO\Projects2\Report;

use GO;
use GO\Base\Db\FindCriteria;
use GO\Base\Db\FindParams;
use GO\Base\Fs\CsvFile;
use GO\Base\Util\Date;
use GO\Base\Util\Http;
use GO\Base\Util\Number;
use GO\Projects2\Model\Project;
use GO\Projects2\Model\StandardTask;
use GO\Projects2\Model\TimeEntry;
use GO\Projects2\Report\AbstractReport;

class ProjectCostBatchReport extends AbstractReport {

	public function name() {
		return GO::t("project cost report", "projects2");
	}

	public function supportsBatchReport() {
		return true;
	}

	public function fileExtension() {
		return 'csv';
	}

	public function supportsSelectedProject() {
		return true;
	}

	public function supportsDateRange() {
		return false;
	}
	
	protected function getHeader() {
		$data = array(
				'id',
				'project_name',
				'path',
				'manager_full_name',
				'customer_full_name',
				'contact_full_name',
				'description',
				'created_at',
				'modified_at',
				'start_time',
				'due_time',
				'parent_project_id',
				'project_status',
				'budgeted_income',
				'budgeted_internal_fees',
				'budgeted_expenses',
				'budgeted_travel_costs',
				'budgeted_total',
				'actual_income',
				'actual_internal_fees',
				'actual_expenses',
				'actual_travel_costs',
				'actual_total',
				'subproject_budgeted_income',
				'subproject_budgeted_internal_fees',
				'subproject_budgeted_expenses',
				'subproject_budgeted_travel_costs',
				'subproject_budgeted_total',
				'subproject_actual_income',
				'subproject_actual_internal_fees',
				'subproject_actual_expenses',
				'subproject_actual_travel_costs',
				'subproject_actual_total',
		);
		
		
		foreach ($this->getStandardTask() as $standardTaskModel) {

			$data[$standardTaskModel->code . ' - ' . $standardTaskModel->name] = $standardTaskModel->code . ' - ' . $standardTaskModel->name;
		}
		
		return $data;
	}

	public function render($return = false) {


		if ($this->project) {

			$stmt = Project::model()->findByAttribute('parent_project_id', $this->project->id, FindParams::newInstance()->select('t.*'));
		} else {
			$stmt = Project::model()->findByAttribute('parent_project_id', 0, FindParams::newInstance()->select('t.*'));
		}

		$csvFile = CsvFile::tempFile($this->filename, $this->fileExtension());



		$headerData = $this->getHeader();


		$csvFile->putRecord($headerData);


		$this->itterProjects($csvFile, $stmt);


		if ($return) {
			return $csvFile->getContents();
		} else {
			Http::outputDownloadHeaders($csvFile, false);
			$csvFile->output();
		}
	}

	protected function getStandardTask() {

		if (empty($this->standardTaskArray)) { 
			$stms = StandardTask::model()->find(FindParams::newInstance()
											->select('t.id, t.code, t.name')
			);
			$this->standardTaskArray = $stms->fetchAll();
		}

		return $this->standardTaskArray;
	}

	public function itterProjects($csvFile, $stmt, $MathValues = false) {
		
		if (!$MathValues) {
				$MathValues = array(
						'budgeted_income' => 0,
						'budgeted_internal_fees' => 0,
						'budgeted_expenses' => 0,
						'budgeted_travel_costs' => 0,
						'budgeted_total' => 0,
						'actual_income' => 0,
						'actual_internal_fees' => 0,
						'actual_expenses' => 0,
						'actual_travel_costs' => 0,
						'actual_total' => 0,
						'standard_task' => array()
				);
		}

		foreach ($stmt as $projectModel) {

			$newStmt = Project::model()->findByAttribute('parent_project_id', $projectModel->id, FindParams::newInstance()->select('t.*'));

			if ($newStmt) {
				$MathSubValues = $this->itterProjects($csvFile, $newStmt);
				
			} else {
				$MathSubValues = array(
						'budgeted_income' => 0,
						'budgeted_internal_fees' => 0,
						'budgeted_expenses' => 0,
						'budgeted_travel_costs' => 0,
						'budgeted_total' => 0,
						'actual_income' => 0,
						'actual_internal_fees' => 0,
						'actual_expenses' => 0,
						'actual_travel_costs' => 0,
						'actual_total' => 0,
						'standard_task' => array()
				);
			}

			
			
			/**
			 * Sum the data
			 */
			$amountSums = $projectModel->getBudgetCalculationArrays();

			$invoicable_amount = $amountSums['invoicable_amount'];
			$budget_sum = $amountSums['budget_sum'];
			$real_sum = $amountSums['real_sum'];

			$MathValues['budgeted_income'] += $budget_sum['budget'];
			$MathValues['budgeted_internal_fees'] += $budget_sum['internalFee'];
			$MathValues['budgeted_expenses'] += $budget_sum['expenses'];
			$MathValues['budgeted_travel_costs'] += $budget_sum['mileage'];
			$MathValues['budgeted_total'] += $budget_sum['sum'];


			$MathValues['actual_income'] += $real_sum['budget'];
			$MathValues['actual_internal_fees'] += $real_sum['internalFee'];
			$MathValues['actual_expenses'] += $real_sum['expenses'];
			$MathValues['actual_travel_costs'] += $real_sum['mileage'];
			$MathValues['actual_total'] += $real_sum['sum'];
			
			$MathValues['budgeted_income'] += $MathSubValues['budgeted_income'];
			$MathValues['budgeted_internal_fees'] += $MathSubValues['budgeted_internal_fees'];
			$MathValues['budgeted_expenses'] += $MathSubValues['budgeted_expenses'];
			$MathValues['budgeted_travel_costs'] += $MathSubValues['budgeted_travel_costs'];
			$MathValues['budgeted_total'] += $MathSubValues['budgeted_total'];


			$MathValues['actual_income'] += $MathSubValues['actual_income'];
			$MathValues['actual_internal_fees'] += $MathSubValues['actual_internal_fees'];
			$MathValues['actual_expenses'] += $MathSubValues['actual_expenses'];
			$MathValues['actual_travel_costs'] += $MathSubValues['actual_travel_costs'];
			$MathValues['actual_total'] += $MathSubValues['actual_total'];

			$timeStms = StandardTask::model()->find(FindParams::newInstance()
				->select('t.id, t.code, t.name, SUM(ti.duration) AS total')
				->group('t.id')
				->joinModel(array(
						'model' => TimeEntry::className(),
						'foreignField' => 'standard_task_id',
						'localField' => 'id',
						'tableAlias' => 'ti',
						'criteria' => FindCriteria::newInstance()
						->addCondition('project_id', $projectModel->id, '=', 'ti') //skip current project
				))
			);

			foreach ($timeStms as $standardTaskTime) {

				if (!array_key_exists((int) $standardTaskTime->id, $MathSubValues['standard_task'])) {
					$MathSubValues['standard_task'][$standardTaskTime->id] = array(
							'name' => $standardTaskTime->code . "  - " . $standardTaskTime->name,
							'duration' => 0
					);
				}
				$MathSubValues['standard_task'][$standardTaskTime->id]['duration'] += $standardTaskTime->total;
			}


			/**
			 * 
			 */
			$data = array(
					'id' => $projectModel->id,
					'project_name' => $projectModel->name,
					'path' => $projectModel->path,
					'manager_full_name' => $projectModel->responsibleUser ? $projectModel->responsibleUser->name : ' ', 
					'customer_full_name' => $projectModel->customerObj ? $projectModel->customerObj->name : ' ',
					'contact_full_name' => $projectModel->contactObj ? $projectModel->contactObj->name : ' ',
					'description' => $projectModel->description,
					'created_at' => Date::get_timestamp($projectModel->ctime),
					'modified_at' => Date::get_timestamp($projectModel->mtime),
					'start_time' => Date::get_timestamp($projectModel->start_time),
					'due_time' => Date::get_timestamp($projectModel->due_time),
					'parent_project_id' => $projectModel->parent_project_id,
					'project_status' => $projectModel->status->name,
					'budgeted_income' => Number::localize($budget_sum['budget']),
					'budgeted_internal_fees' => Number::localize($budget_sum['internalFee']),
					'budgeted_expenses' => Number::localize($budget_sum['expenses']),
					'budgeted_travel_costs' => Number::localize($budget_sum['mileage']),
					'budgeted_total' => Number::localize($budget_sum['sum']),
					'actual_income' => Number::localize($real_sum['budget']),
					'actual_internal_fees' => Number::localize($real_sum['internalFee']),
					'actual_expenses' => Number::localize($real_sum['expenses']),
					'actual_travel_costs' => Number::localize($real_sum['mileage']),
					'actual_total' => Number::localize($real_sum['sum']),
					'subproject_budgeted_income' => Number::localize($MathSubValues['budgeted_income']),
					'subproject_budgeted_internal_fees' => Number::localize($MathSubValues['budgeted_internal_fees']),
					'subproject_budgeted_expenses' => Number::localize($MathSubValues['budgeted_expenses']),
					'subproject_budgeted_travel_costs' => Number::localize($MathSubValues['budgeted_travel_costs']),
					'subproject_budgeted_total' => Number::localize($MathSubValues['budgeted_total']),
					'subproject_actual_income' => Number::localize($MathSubValues['actual_income']),
					'subproject_actual_internal_fees' => Number::localize($MathSubValues['actual_internal_fees']),
					'subproject_actual_expenses' => Number::localize($MathSubValues['actual_expenses']),
					'subproject_actual_travel_costs' => Number::localize($MathSubValues['actual_travel_costs']),
					'subproject_actual_total' => Number::localize($MathSubValues['actual_total'])
			);

			foreach ($this->getStandardTask() as $standardTaskModel) {

				if (empty($MathSubValues['standard_task'][$standardTaskModel->id]['duration']) || $MathSubValues['standard_task'][$standardTaskModel->id]['duration'] == '') {
					$value = 0;
				} else {
					$value = $MathSubValues['standard_task'][$standardTaskModel->id]['duration'];
				}

				
				if (!array_key_exists((int) $standardTaskModel->id, $MathValues['standard_task'])) {
					$MathValues['standard_task'][$standardTaskModel->id] = array(
							'name' => $standardTaskModel->code . "  - " . $standardTaskModel->name,
							'duration' => 0
					);
				}
				
				$MathValues['standard_task'][$standardTaskModel->id]['duration'] += $value;
				
				$data[$standardTaskModel->code . ' - ' . $standardTaskModel->name] = 	Number::localize($value);
			
			}

			$csvFile->putRecord($data);
		}

		return $MathValues;
	}

}
