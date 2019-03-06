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
 * Abstract class for generating Reports for the project module
 * All classes the extend this class will are listed in the report panel
 * The function render() should be  
 *
 * @package GO.projects2.report
 * @copyright Copyright Intermesh
 * @version $Id: AbstractReport.php 21165 2016-01-28 10:27:14Z mdhart $ 
 * @author Michael de Hart <mdhart@intermesh.nl> 
 * @author Merijn Schering <mschering@intermesh.nl> 
 */
	
namespace GO\Projects2\Report;
use GO\Projects2\Model\Template;

abstract class AbstractReport {

	const REPORT_TYPE_CONTAINER = 1;
	const REPORT_TYPE_PROJECT = 2;
	
	private $_fp;
	private $_outputPath;
	private $filters = array();
	
	protected $startDate;
	protected $endDate;
	
	public $statuses=array();

	/**
	 * If this report has a selected project then this holds the model.
	 * 
	 * @var \GO\Projects2\Model\Project 
	 */
	protected $project;
	
	public function __construct() {

		if(!empty($_REQUEST['startdate']))
			$this->startDate = \GO\Base\Util\Date::to_unixtime($_REQUEST['startdate']);
		
		if(!empty($_REQUEST['enddate']))
			$this->endDate = \GO\Base\Util\Date::date_add(\GO\Base\Util\Date::to_unixtime($_REQUEST['enddate']),1);
		
		if($this->supportsStatusFilter()){
			if(\GO\Base\Util\Http::isPostRequest()){
				$this->statuses=!empty($_POST['status_id']) ? $_POST['status_id'] : array();	
				\GO::config()->save_setting(get_class($this), json_encode($this->statuses), \GO::user()->id);
			}  else {
				$statuses = \GO::config()->get_setting(get_class($this), \GO::user()->id);
				if($statuses){
					$this->statuses=json_decode($statuses);
				}
			}
		}

	}

	/**
	 * Return the name of the report used in the drop down
	 * 
	 * @return StringHelper
	 */
	public abstract function name();

	/**
	 * Return filename extension.
	 * @return StringHelper
	 */
	public abstract function fileExtension();

	/**
	 * Start rendering the report.
	 * 
	 * @param boolean $return to return the file data as string.
	 */
	public abstract function render($return = false);

	/**
	 * With this enabled it will only show up if this report is created from the
	 * "New" menu in a project.
	 * 
	 * @return boolean defaults to false
	 */
	public function supportsSelectedProject() {
		return false;
	}
	
	/**
	 * With this enables it shows up when you create a report from the main toolbar
	 * in the projects module.
	 * 
	 * @return boolean
	 */
	public function supportsBatchReport(){
		return false;
	}
	
	/**
	 * Indicates which project types are accepted for this report.
	 * 
	 * @return boolean Array containing for example: GO\Projects2\Model\Template::PROJECT_TYPE_PROJECT or GO\Projects2\Model\Template::PROJECT_TYPE_CONTAINER
	 */
	public function supportedProjectTypes() {
		return array(Template::PROJECT_TYPE_PROJECT);
	}
	
	/**
	 * Indicate whether this report supports a start and end date
	 * 
	 * @return boolean defaults to false
	 */
	public function supportsDateRange() {
		return false;
	}
	
	/**
	 * Indicate whether this report supports a start and end date
	 * 
	 * @return boolean defaults to false
	 */
	public function supportsStatusFilter() {
		return false;
	}

	/**
	 * Return array of attribute names that can be filtered on from the report dialog.
	 * eg. array('customer','col_6','col_22')
	 * @return array
	 */
	public function filterAttributes() {
		return array();
	}

	/**
	 * Set the path (relative to GO::config()->file_storage_path) to the folder where the file will be written.
	 * 
	 * @param StringHelper $outputPath
	 */
	public function setOutputPath($outputPath) {
		$this->_outputPath = \GO::config()->file_storage_path . $outputPath;
	}

	protected $filename;

	/**
	 * Set the filename without extension
	 * 
	 * @param StringHelper $name
	 */
	public final function setFilename($name) {
		$this->filename = $name;
	}

	/**
	 * Set's filters for the projects to query.
	 * 
	 * @param array $filters
	 */
	public final function setFilters($filters) {
		$this->filters = $filters;
	}

	protected final function getFilePath() {
		return $this->_outputPath;
	}
	
	/**
	 * Set the project for reporting
	 * @param \GO\Projects2\Model\Project $project
	 */
	public function setProject(\GO\Projects2\Model\Project $project){
		$this->project = $project;
		
	}

	/**
	 * Saves the report to a file
	 * output path and filename should be set before calling this function
	 * @param \GO\Projects2\Model\Project $project the project object
	 * @return \GO\Files\Model\File
	 */
	public function save() {
		$file = new \GO\Base\Fs\File($this->_outputPath . '/' . $this->filename . '.' . $this->fileExtension());
		$file->appendNumberToNameIfExists();
		$this->_outputPath = $file->path();

		
		$str = $this->render(true);
		if (!isset($this->_fp))
			$this->_fp = fopen($this->_outputPath, 'w+');

		fputs($this->_fp, $str);

		$folder = \GO\Files\Model\Folder::model()->findByPath($file->parent()->stripFileStoragePath());
		$fileModel = $folder->addFile($file->name());

		return $fileModel;
	}
}
