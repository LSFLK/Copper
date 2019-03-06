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
 * @version $Id: TimeTrackingCsv.php 18516 2014-03-12 10:01:47Z mschering $
 * @author Merijn Schering <mschering@intermesh.nl>
 */

namespace GO\Projects2\Report;

use GO;
use GO\Projects2\Report\AbstractReport;

class ExportAll extends AbstractReport {

	public function name() {
		return \GO::t("Export All", "projects2");
	}

	public function supportsBatchReport() {
		return true;
	}

	public function supportsSelectedProject() {
		return false;
	}

//	public function supportedProjectTypes() {
//		return array(\GO\Projects2\Model\Template::PROJECT_TYPE_CONTAINER, \GO\Projects2\Model\Template::PROJECT_TYPE_PROJECT);
//	}

	public function supportsDateRange() {
		return false;
	}

	public function fileExtension() {
		return 'csv';
	}

	public function render($return = false) {


		$fp = \GO\Base\Db\FindParams::newInstance()
				->ignoreAcl()
				->select('t.*')
				->joinRelation('user');


		$stmt = \GO\Projects2\Model\Project::model()->find($fp);


		$csvFile = \GO\Base\Fs\CsvFile::tempFile($this->filename, $this->fileExtension());

		$attributes = array_keys(\GO\Projects2\Model\Project::model()->findSingle()->getColumns());
		unset($attributes['acl_overwritten']);

		$csvFile->putRecord($attributes);

		\GO\Projects2\Model\Project::$attributeOutputMode = 'formatted';

		foreach ($stmt as $timeEntry) {

			$record = array();
			foreach ($attributes as $attr) {

				$relations = explode('.', $attr);

				$attrName = array_pop($relations);

				$model = $timeEntry;
				foreach ($relations as $relation) {
					$model = $model->$relation;
				}

				$record[] = $model->$attrName;
			}

			$csvFile->putRecord($record);
		}

		if ($return) {
			return $csvFile->getContents();
		} else {
			\GO\Base\Util\Http::outputDownloadHeaders($csvFile, false);
			$csvFile->output();
		}
	}

}
