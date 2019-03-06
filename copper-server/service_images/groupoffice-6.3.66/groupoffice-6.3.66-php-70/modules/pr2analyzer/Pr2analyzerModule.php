<?php
namespace GO\Pr2analyzer;

class Pr2analyzerModule extends \GO\Professional\Module {

	public function appCenter(){
		return true;
	}
	
	public function depends() {
		return array('projects2', 'timeregistration');
	}

}
