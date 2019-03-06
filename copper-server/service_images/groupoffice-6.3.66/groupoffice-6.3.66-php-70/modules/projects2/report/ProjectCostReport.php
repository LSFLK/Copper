<?php

//ProjectCostReport



namespace GO\Projects2\Report;

use GO\Projects2\Model\Template;



class ProjectCostReport extends ProjectCostBatchReport{
	
	public function supportsBatchReport() {
		return false;
	}
	
	public function supportedProjectTypes() {
		return array(Template::PROJECT_TYPE_PROJECT, Template::PROJECT_TYPE_CONTAINER);
	}
	
}
