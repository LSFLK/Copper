<?php


namespace GO\Hoursapproval2;


class Hoursapproval2Module extends \GO\Professional\Module {

	public function depends() {
		return array('projects2', 'timeregistration2');
	}

	public function autoInstall() {
		return true;
	}
}
