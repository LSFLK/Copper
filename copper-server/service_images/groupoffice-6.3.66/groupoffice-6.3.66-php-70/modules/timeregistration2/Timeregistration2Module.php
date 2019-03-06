<?php


namespace GO\Timeregistration2;


class Timeregistration2Module extends \GO\Professional\Module {

	public function depends() {
		return array('projects2');
	}


	/**
	 * The module settings
	 * @var \GO\Projects2\Model\Settings
	 * @see getSettings()
	 */
	private $_settings;

	public function getSettings() {
		if (!isset($this->_settings))
			$this->_settings = \GO\Projects2\Model\Settings::load();
		return $this->_settings;
	}

	public function autoInstall() {
		return true;
	}

}
